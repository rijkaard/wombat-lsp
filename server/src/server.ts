import * as fs from 'fs';
import * as path from 'path';
import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  Hover,
  MarkupKind,
  Definition,
  Location,
  Range,
  Position,
  MarkupContent,
  InsertTextFormat
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

// ── Engine function catalog ───────────────────────────────────────────────────

interface EngineFn {
  name: string;
  signature: string;
  description: string;
  aliases: string[];
}

const engineCatalog = new Map<string, EngineFn>();

function loadCatalog(): void {
  const catalogPath = path.join(__dirname, '..', 'data', 'catalog.json');
  try {
    const raw = JSON.parse(fs.readFileSync(catalogPath, 'utf8')) as Record<string, EngineFn>;
    for (const [key, entry] of Object.entries(raw)) {
      const lk = key.toLowerCase();
      if (!engineCatalog.has(lk)) engineCatalog.set(lk, entry);
    }
  } catch (e) {
    connection.console.error(`Failed to load engine catalog: ${e}`);
  }
}

// ── Tokenizer ─────────────────────────────────────────────────────────────────
// Hand-written lexer so we can correctly skip strings, handle CRLF, and
// associate doc-comments with the symbol that follows them — without needing
// a Java-based ANTLR code-generation step.

type TokKind =
  | 'type_kw' | 'kw' | 'ident'
  | 'string' | 'number'
  | 'lparen' | 'rparen' | 'lbrace' | 'rbrace' | 'lbracket' | 'rbracket'
  | 'semi' | 'comma'
  | 'line_comment' | 'block_comment'
  | 'other';

interface Tok {
  kind: TokKind;
  text: string;
  line: number;  // 0-based
  col: number;
}

const TYPE_KWS  = new Set(['int','obj','void','string','float','list','loc','str']);
const OTHER_KWS = new Set([
  'if','else','switch','case','default','break','for','while','return',
  'function','trigger','member','forward','inherits','NULL'
]);

function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0, line = 0, lineStart = 0;

  while (i < src.length) {
    const col = i - lineStart;
    const ch  = src[i];

    if (ch === '\r') { i++; continue; }
    if (ch === '\n') { line++; lineStart = i + 1; i++; continue; }
    if (ch === ' ' || ch === '\t') { i++; continue; }

    if (src[i] === '/' && src[i + 1] === '/') {
      const s = i;
      while (i < src.length && src[i] !== '\n') i++;
      toks.push({ kind: 'line_comment', text: src.slice(s, i), line, col });
      continue;
    }

    if (src[i] === '/' && src[i + 1] === '*') {
      const s = i, sl = line, sc = col;
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] === '\n') { line++; lineStart = i + 1; }
        i++;
      }
      i += 2;
      toks.push({ kind: 'block_comment', text: src.slice(s, i), line: sl, col: sc });
      continue;
    }

    if (ch === '"') {
      const s = i, sl = line, sc = col;
      i++;
      while (i < src.length && src[i] !== '"') {
        if (src[i] === '\\') i++;
        if (i < src.length && src[i] === '\n') { line++; lineStart = i + 1; }
        i++;
      }
      i++;
      toks.push({ kind: 'string', text: src.slice(s, i), line: sl, col: sc });
      continue;
    }

    if (ch >= '0' && ch <= '9') {
      const s = i;
      if (src[i + 1] === 'x' || src[i + 1] === 'X') {
        i += 2;
        while (i < src.length && /[0-9A-Fa-f]/.test(src[i])) i++;
      } else {
        while (i < src.length && src[i] >= '0' && src[i] <= '9') i++;
      }
      toks.push({ kind: 'number', text: src.slice(s, i), line, col });
      continue;
    }

    if (/[A-Za-z_]/.test(ch)) {
      const s = i;
      while (i < src.length && /[A-Za-z0-9_]/.test(src[i])) i++;
      const word = src.slice(s, i);
      const kind: TokKind = TYPE_KWS.has(word) ? 'type_kw' : OTHER_KWS.has(word) ? 'kw' : 'ident';
      toks.push({ kind, text: word, line, col });
      continue;
    }

    const punct: Record<string, TokKind> = {
      '(': 'lparen', ')': 'rparen',
      '{': 'lbrace', '}': 'rbrace',
      '[': 'lbracket', ']': 'rbracket',
      ';': 'semi', ',': 'comma'
    };
    if (punct[ch]) { toks.push({ kind: punct[ch], text: ch, line, col }); i++; continue; }

    toks.push({ kind: 'other', text: ch, line, col });
    i++;
  }
  return toks;
}

// ── User-defined symbol extraction ────────────────────────────────────────────

type SymbolKind = 'function' | 'trigger' | 'member' | 'variable' | 'forward' | 'param';

interface UserSymbol {
  name: string;
  kind: SymbolKind;
  type: string;
  line: number;
  col: number;
  params?: string;
  docComment?: string;
}

function parseSymbols(src: string): UserSymbol[] {
  const raw = tokenize(src);
  const symbols: UserSymbol[] = [];

  // Build filtered token list (no block comments) and doc-comment map
  const toks: Tok[] = [];
  const docAt = new Map<number, string>();
  let pendingDoc = '';

  for (const t of raw) {
    if (t.kind === 'block_comment') { pendingDoc = ''; continue; }
    if (t.kind === 'line_comment') {
      const txt = t.text.slice(2).trim();
      pendingDoc = pendingDoc ? `${pendingDoc}\n${txt}` : txt;
      continue;
    }
    if (pendingDoc) { docAt.set(toks.length, pendingDoc); pendingDoc = ''; }
    toks.push(t);
  }

  let i = 0;
  const at  = (n = 0): Tok | undefined => toks[i + n];
  const eat = (): Tok | undefined => toks[i++];

  // Consume balanced parens, return inner content joined
  function eatParens(): string {
    const parts: string[] = [];
    eat(); // (
    let depth = 1;
    while (i < toks.length && depth > 0) {
      const t = at();
      if (!t) break;
      if (t.kind === 'lparen')  depth++;
      if (t.kind === 'rparen') { depth--; if (depth === 0) break; }
      parts.push(t.text);
      eat();
    }
    eat(); // )
    return parts.join(' ');
  }

  // Consume a block and extract local variable declarations from it
  function eatBlockExtractVars(): void {
    eat(); // {
    let depth = 1;
    while (i < toks.length && depth > 0) {
      const t = at();
      if (!t) break;
      if (t.kind === 'lbrace') { depth++; eat(); continue; }
      if (t.kind === 'rbrace') { depth--; eat(); continue; }

      // TYPE NAME [not followed by '('] → local variable
      if (t.kind === 'type_kw') {
        const typeTok = eat()!;
        if (at()?.kind === 'ident') {
          const nameTok = eat()!;
          if (at()?.kind !== 'lparen') {
            symbols.push({ name: nameTok.text, kind: 'variable', type: typeTok.text,
              line: nameTok.line, col: nameTok.col });
          }
        }
        // skip to next ';' (don't cross block boundaries)
        while (i < toks.length &&
               at()?.kind !== 'semi' && at()?.kind !== 'lbrace' && at()?.kind !== 'rbrace') eat();
        if (at()?.kind === 'semi') eat();
        continue;
      }

      eat();
    }
  }

  // Skip a balanced brace block with no extraction (used for non-function blocks)
  function eatBlock(): void {
    eat(); // {
    let depth = 1;
    while (i < toks.length && depth > 0) {
      const t = eat();
      if (!t) break;
      if (t.kind === 'lbrace') depth++;
      if (t.kind === 'rbrace') depth--;
    }
  }

  // Skip forward to and past the next semicolon
  function eatToSemi(): void {
    while (i < toks.length && at()?.kind !== 'semi') eat();
    if (at()?.kind === 'semi') eat();
  }

  // Normalise raw inner-paren text to canonical param string
  function fmtParams(raw: string): string {
    return raw.split(',').map(p => p.trim()).filter(Boolean).join(', ');
  }

  while (i < toks.length) {
    const t = at();
    if (!t) break;
    const doc = docAt.get(i) ?? '';

    // ── forward TYPE NAME ( params ) ;
    if (t.kind === 'kw' && t.text === 'forward') {
      eat();
      if (at()?.kind === 'type_kw') {
        const typeTok = eat()!;
        if (at()?.kind === 'ident') {
          const nameTok = eat()!;
          if (at()?.kind === 'lparen') {
            const params = fmtParams(eatParens());
            if (at()?.kind === 'semi') eat();
            symbols.push({ name: nameTok.text, kind: 'forward', type: typeTok.text,
              line: nameTok.line, col: nameTok.col, params,
              docComment: doc || undefined });
          }
        }
      }
      continue;
    }

    // ── function NAME ( params ) ;   ← typeless forward declaration
    //    function NAME ( params ) {   ← typeless function body (skip, not indexed)
    if (t.kind === 'kw' && t.text === 'function') {
      if (at(1)?.kind === 'ident' && at(2)?.kind === 'lparen') {
        eat(); // 'function'
        const nameTok = eat()!;
        const params = fmtParams(eatParens());
        if (at()?.kind === 'semi') {
          eat();
          symbols.push({ name: nameTok.text, kind: 'forward', type: 'void',
            line: nameTok.line, col: nameTok.col, params,
            docComment: doc || undefined });
        } else {
          while (i < toks.length && at()?.kind !== 'lbrace') eat();
          if (at()?.kind === 'lbrace') eatBlockExtractVars();
        }
        continue;
      }
      // 'function' as optional prefix before a TYPE keyword — eat and let type_kw branch handle it
      eat();
      continue;
    }

    // ── trigger [HEX] NAME [(filter)] { body }
    if (t.kind === 'kw' && t.text === 'trigger') {
      eat();
      if (at()?.kind === 'number') eat();              // optional numeric ID
      const nameTok = (at()?.kind === 'ident' || at()?.kind === 'kw') ? eat()! : undefined;
      if (nameTok) {
        symbols.push({ name: nameTok.text, kind: 'trigger', type: 'trigger',
          line: nameTok.line, col: nameTok.col, docComment: doc || undefined });
      }
      if (at()?.kind === 'lparen') eatParens();        // optional filter expression
      while (i < toks.length && at()?.kind !== 'lbrace') eat();
      if (at()?.kind === 'lbrace') eatBlockExtractVars();
      continue;
    }

    // ── member TYPE NAME [= ...] ;
    if (t.kind === 'kw' && t.text === 'member') {
      eat();
      if (at()?.kind === 'type_kw') {
        const typeTok = eat()!;
        if (at()?.kind === 'ident') {
          const nameTok = eat()!;
          symbols.push({ name: nameTok.text, kind: 'member', type: typeTok.text,
            line: nameTok.line, col: nameTok.col, docComment: doc || undefined });
        }
      }
      eatToSemi();
      continue;
    }

    // ── TYPE NAME ( params ) { body }   ← function definition
    //    TYPE NAME ( params ) ;          ← implicit forward (no keyword)
    //    TYPE NAME [= ...] ;             ← variable declaration
    if (t.kind === 'type_kw') {
      const typeTok = eat()!;
      if (at()?.kind !== 'ident') continue;
      const nameTok = eat()!;

      if (at()?.kind === 'lparen') {
        const params = fmtParams(eatParens());
        // Skip tokens between ')' and the '{' or ';' — handles brace-on-next-line
        while (i < toks.length &&
               at()?.kind !== 'lbrace' && at()?.kind !== 'semi' && at()?.kind !== 'rbrace') {
          eat();
        }
        if (at()?.kind === 'lbrace') {
          symbols.push({ name: nameTok.text, kind: 'function', type: typeTok.text,
            line: nameTok.line, col: nameTok.col, params,
            docComment: doc || undefined });
          for (const p of params.split(',')) {
            const pm = p.trim().match(
              /^(int|obj|void|string|float|list|loc|str)\s+([A-Za-z_][A-Za-z0-9_]*)$/
            );
            if (pm) symbols.push({ name: pm[2], kind: 'param', type: pm[1],
              line: nameTok.line, col: nameTok.col });
          }
          eatBlockExtractVars();
        } else if (at()?.kind === 'semi') {
          eat();
          symbols.push({ name: nameTok.text, kind: 'forward', type: typeTok.text,
            line: nameTok.line, col: nameTok.col, params,
            docComment: doc || undefined });
        }
      } else {
        // Variable declaration (with or without initialiser)
        symbols.push({ name: nameTok.text, kind: 'variable', type: typeTok.text,
          line: nameTok.line, col: nameTok.col, docComment: doc || undefined });
        eatToSemi();
      }
      continue;
    }

    eat(); // skip unrecognised token
  }

  return symbols;
}

function symbolSignature(sym: UserSymbol): string {
  if (sym.kind === 'function' || sym.kind === 'forward') {
    return `${sym.type} ${sym.name}(${sym.params ?? ''})`;
  }
  if (sym.kind === 'trigger') return `trigger ${sym.name}`;
  return `${sym.type} ${sym.name}`;
}

// ── Cross-file resolution ─────────────────────────────────────────────────────

function getInheritedScriptPaths(
  text: string, currentUri: string, scriptsDir: string,
  visited: Set<string> = new Set()
): string[] {
  const dir = scriptsDir || path.dirname(filePathFromUri(currentUri));
  const result: string[] = [];
  for (const m of text.matchAll(/\binherits\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/g)) {
    const candidate = path.join(dir, m[1] + '.m');
    if (!fs.existsSync(candidate) || visited.has(candidate)) continue;
    visited.add(candidate);
    result.push(candidate);
    try {
      const parentText = fs.readFileSync(candidate, 'utf8');
      const transitive = getInheritedScriptPaths(
        parentText, uriFromFilePath(candidate),
        scriptsDir || path.dirname(candidate), visited
      );
      result.push(...transitive);
    } catch { /* skip unreadable */ }
  }
  return result;
}

function filePathFromUri(uri: string): string {
  try {
    // Handles file:///path (Unix) and file:///C:/path (Windows)
    const p = decodeURIComponent(new URL(uri).pathname);
    return p.replace(/^\/([A-Za-z]:)/, '$1');
  } catch {
    return decodeURIComponent(uri.replace(/^file:\/\//, ''));
  }
}

function uriFromFilePath(filePath: string): string {
  const normalised = filePath.replace(/\\/g, '/');
  return normalised.startsWith('/') ? `file://${normalised}` : `file:///${normalised}`;
}

// ── LSP connection ────────────────────────────────────────────────────────────

const connection = createConnection(ProposedFeatures.all);
const documents  = new TextDocuments(TextDocument);

let scriptsDirectory = '';

connection.onInitialize((params: InitializeParams): InitializeResult => {
  scriptsDirectory = params.initializationOptions?.scriptsDirectory ?? '';
  loadCatalog();

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: ['(', '.']
      },
      hoverProvider: true,
      definitionProvider: true
    }
  };
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function isInString(line: string, pos: number): boolean {
  let inStr = false;
  for (let i = 0; i < pos; i++) {
    if (line[i] === '"' && (i === 0 || line[i - 1] !== '\\')) inStr = !inStr;
  }
  return inStr;
}

function wordAt(text: string, pos: Position): string {
  const lines = text.split('\n');
  const line  = (lines[pos.line] ?? '').replace(/\r$/, '');
  if (isInString(line, pos.character)) return '';
  let s = pos.character, e = pos.character;
  while (s > 0 && /\w/.test(line[s - 1])) s--;
  while (e < line.length && /\w/.test(line[e])) e++;
  return line.slice(s, e);
}

function engineHover(fn: EngineFn): MarkupContent {
  const desc    = fn.description ? `\n\n${fn.description}` : '';
  const aliases = fn.aliases.length ? `\n\n*Aliases: ${fn.aliases.join(', ')}*` : '';
  return {
    kind: MarkupKind.Markdown,
    value: `\`\`\`wombat\n${fn.signature}\n\`\`\`\n\n🔧 *Engine built-in*${desc}${aliases}`
  };
}

function userHover(sym: UserSymbol): MarkupContent {
  const doc = sym.docComment ? `\n\n${sym.docComment}` : '';
  return {
    kind: MarkupKind.Markdown,
    value: `\`\`\`wombat\n${symbolSignature(sym)}\n\`\`\`${doc}`
  };
}

// ── Completion ────────────────────────────────────────────────────────────────

connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return [];

  const text  = doc.getText();
  const items: CompletionItem[] = [];
  const seen  = new Set<string>();

  for (const [, fn] of engineCatalog) {
    if (seen.has(fn.name)) continue;
    seen.add(fn.name);
    items.push({
      label: fn.name,
      kind: CompletionItemKind.Function,
      detail: fn.signature,
      documentation: { kind: MarkupKind.Markdown, value: fn.description || '*Engine built-in*' },
      insertText: fn.name,
      insertTextFormat: InsertTextFormat.PlainText,
      sortText: '1_' + fn.name
    });
  }

  for (const sym of parseSymbols(text)) {
    if (seen.has(sym.name) || sym.kind === 'param') continue;
    seen.add(sym.name);
    const kind =
      sym.kind === 'function' || sym.kind === 'forward' ? CompletionItemKind.Function :
      sym.kind === 'trigger'  ? CompletionItemKind.Event :
      sym.kind === 'member'   ? CompletionItemKind.Field :
      CompletionItemKind.Variable;
    items.push({
      label: sym.name,
      kind,
      detail: symbolSignature(sym),
      documentation: sym.docComment ? { kind: MarkupKind.PlainText, value: sym.docComment } : undefined,
      sortText: '2_' + sym.name
    });
  }

  for (const scriptPath of getInheritedScriptPaths(text, params.textDocument.uri, scriptsDirectory)) {
    try {
      const inherited = fs.readFileSync(scriptPath, 'utf8');
      for (const sym of parseSymbols(inherited)) {
        if (seen.has(sym.name) || sym.kind === 'param' || sym.kind === 'variable') continue;
        seen.add(sym.name);
        items.push({
          label: sym.name,
          kind: sym.kind === 'function' || sym.kind === 'forward' ? CompletionItemKind.Function : CompletionItemKind.Field,
          detail: `[${path.basename(scriptPath)}] ${symbolSignature(sym)}`,
          sortText: '3_' + sym.name
        });
      }
    } catch { /* skip unreadable files */ }
  }

  for (const kw of ['if','else','switch','case','default','break','for','while','return',
                    'member','function','trigger','forward','inherits','NULL()',
                    'int','obj','void','string','float','list','loc','str']) {
    items.push({ label: kw, kind: CompletionItemKind.Keyword, sortText: '9_' + kw });
  }

  return items;
});

// ── Hover ─────────────────────────────────────────────────────────────────────

connection.onHover((params: TextDocumentPositionParams): Hover | null => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return null;

  const text = doc.getText();
  const word = wordAt(text, params.position);
  if (!word) return null;

  const engineFn = engineCatalog.get(word.toLowerCase());
  if (engineFn) return { contents: engineHover(engineFn) };

  const syms = parseSymbols(text);
  // Include params — they shadow same-named members from inherited scripts.
  const sym  = syms.find(s => s.name === word);
  if (sym) return { contents: userHover(sym) };

  for (const scriptPath of getInheritedScriptPaths(text, params.textDocument.uri, scriptsDirectory)) {
    try {
      const inherited = fs.readFileSync(scriptPath, 'utf8');
      const isym = parseSymbols(inherited).find(s => s.name === word && s.kind !== 'param');
      if (isym) {
        return {
          contents: {
            kind: MarkupKind.Markdown,
            value: `${userHover(isym).value}\n\n*from \`${path.basename(scriptPath)}\`*`
          }
        };
      }
    } catch { /* skip */ }
  }

  return null;
});

// ── Go to definition ──────────────────────────────────────────────────────────

connection.onDefinition((params: TextDocumentPositionParams): Definition | null => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return null;

  const text = doc.getText();
  const word = wordAt(text, params.position);
  if (!word) return null;

  // Check if the cursor is on the module name in an `inherits <module>;` directive.
  const lines    = text.split('\n');
  const lineText = (lines[params.position.line] ?? '').replace(/\r$/, '');
  const inheritsM = lineText.match(/\binherits\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/);
  if (inheritsM && inheritsM[1] === word) {
    const dir = scriptsDirectory || path.dirname(filePathFromUri(params.textDocument.uri));
    const candidate = path.join(dir, word + '.m');
    if (fs.existsSync(candidate)) {
      return Location.create(
        uriFromFilePath(candidate),
        Range.create(Position.create(0, 0), Position.create(0, 0))
      );
    }
  }

  if (engineCatalog.has(word.toLowerCase())) return null;

  const syms = parseSymbols(text);

  // Prefer the actual definition (function/trigger/member) over a forward declaration.
  const primary = syms.find(s => s.name === word &&
    (s.kind === 'function' || s.kind === 'trigger' || s.kind === 'member'))
    ?? syms.find(s => s.name === word && s.kind === 'forward');
  if (primary) {
    return Location.create(
      params.textDocument.uri,
      Range.create(Position.create(primary.line, primary.col), Position.create(primary.line, 999))
    );
  }

  const varSym = syms.find(s => s.name === word &&
    (s.kind === 'variable' || s.kind === 'param'));
  if (varSym) {
    return Location.create(
      params.textDocument.uri,
      Range.create(Position.create(varSym.line, varSym.col), Position.create(varSym.line, 999))
    );
  }

  for (const scriptPath of getInheritedScriptPaths(text, params.textDocument.uri, scriptsDirectory)) {
    try {
      const inherited = fs.readFileSync(scriptPath, 'utf8');
      const found = parseSymbols(inherited).find(s => s.name === word &&
        (s.kind === 'function' || s.kind === 'trigger' || s.kind === 'member' || s.kind === 'forward'));
      if (found) {
        return Location.create(
          uriFromFilePath(scriptPath),
          Range.create(Position.create(found.line, found.col), Position.create(found.line, 999))
        );
      }
    } catch { /* skip */ }
  }

  return null;
});

// ── Start ─────────────────────────────────────────────────────────────────────

documents.listen(connection);
connection.listen();
