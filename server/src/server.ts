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
      engineCatalog.set(key.toLowerCase(), entry);
    }
  } catch (e) {
    connection.console.error(`Failed to load engine catalog: ${e}`);
  }
}

// ── User-defined symbols ──────────────────────────────────────────────────────

type SymbolKind = 'function' | 'trigger' | 'member' | 'variable' | 'forward' | 'param';

interface UserSymbol {
  name: string;
  kind: SymbolKind;
  type: string;
  line: number;
  col: number;
  params?: string;      // raw param string for functions
  docComment?: string;
}

// Parse a Wombat document into symbol definitions.
function parseSymbols(text: string): UserSymbol[] {
  const symbols: UserSymbol[] = [];
  const lines = text.split('\n');

  const TYPE = '(?:int|obj|void|string|float|list|loc|str)';
  const NAME = '[A-Za-z_][A-Za-z0-9_]*';

  const reFunc    = new RegExp(`^(?:function\\s+)?(${TYPE})\\s+(${NAME})\\s*\\(([^)]*)\\)\\s*\\{`);
  const reFwd     = new RegExp(`^forward\\s+(${TYPE})\\s+(${NAME})\\s*\\(([^)]*)\\)\\s*;`);
  const reFwdTypeless = new RegExp(`^function\\s+(${NAME})\\s*\\(([^)]*)\\)\\s*;`);
  const reTrigger = new RegExp(`^trigger\\s+(?:0x[0-9A-Fa-f]+\\s+)?(${NAME})`);
  const reMember  = new RegExp(`^member\\s+(${TYPE})\\s+(${NAME})`);
  const reVarDecl = new RegExp(`^(?:function\\s+)?(${TYPE})\\s+(${NAME})(?:\\s*=|\\s*;)`);

  let pendingDoc = '';

  for (let i = 0; i < lines.length; i++) {
    const raw  = lines[i];
    const line = raw.trimStart();
    const col  = raw.length - line.length;

    if (line.startsWith('//')) {
      const comment = line.slice(2).trim();
      pendingDoc = pendingDoc ? `${pendingDoc}\n${comment}` : comment;
      continue;
    }
    if (!line || line.startsWith('/*')) {
      if (!line) pendingDoc = '';
      continue;
    }

    const doc = pendingDoc;
    pendingDoc = '';

    let m: RegExpMatchArray | null;

    if ((m = line.match(reFunc))) {
      symbols.push({ name: m[2], kind: 'function', type: m[1], line: i, col, params: m[3].trim(), docComment: doc });
      // Also register parameters
      for (const p of m[3].split(',')) {
        const pm = p.trim().match(new RegExp(`(${TYPE})\\s+(${NAME})`));
        if (pm) symbols.push({ name: pm[2], kind: 'param', type: pm[1], line: i, col });
      }
      continue;
    }

    if ((m = line.match(reFwd))) {
      symbols.push({ name: m[2], kind: 'forward', type: m[1], line: i, col, params: m[3].trim(), docComment: doc });
      continue;
    }

    if ((m = line.match(reFwdTypeless))) {
      symbols.push({ name: m[1], kind: 'forward', type: 'void', line: i, col, params: m[2].trim(), docComment: doc });
      continue;
    }

    if ((m = line.match(reTrigger))) {
      symbols.push({ name: m[1], kind: 'trigger', type: 'trigger', line: i, col, docComment: doc });
      continue;
    }

    if ((m = line.match(reMember))) {
      symbols.push({ name: m[2], kind: 'member', type: m[1], line: i, col, docComment: doc });
      continue;
    }

    if ((m = line.match(reVarDecl))) {
      // Skip if it looks like a function (has '(' before '{')
      if (!line.includes('(') || line.indexOf(';') < line.indexOf('(')) {
        symbols.push({ name: m[2], kind: 'variable', type: m[1], line: i, col, docComment: doc });
      }
    }
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

function getInheritedScriptPaths(text: string, currentUri: string, scriptsDir: string): string[] {
  const dir = scriptsDir || path.dirname(filePathFromUri(currentUri));
  const paths: string[] = [];
  for (const m of text.matchAll(/\binherits\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/g)) {
    const candidate = path.join(dir, m[1] + '.m');
    if (fs.existsSync(candidate)) paths.push(candidate);
  }
  return paths;
}

function filePathFromUri(uri: string): string {
  return decodeURIComponent(uri.replace(/^file:\/\//, ''));
}

function uriFromFilePath(filePath: string): string {
  return 'file://' + filePath;
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

function wordAt(text: string, pos: Position): string {
  const lines = text.split('\n');
  const line  = lines[pos.line] ?? '';
  let s = pos.character, e = pos.character;
  while (s > 0 && /\w/.test(line[s - 1])) s--;
  while (e < line.length && /\w/.test(line[e])) e++;
  return line.slice(s, e);
}

function engineHover(fn: EngineFn): MarkupContent {
  const desc = fn.description ? `\n\n${fn.description}` : '';
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

  const text = doc.getText();
  const items: CompletionItem[] = [];
  const seen = new Set<string>();

  // Engine functions
  for (const [, fn] of engineCatalog) {
    if (seen.has(fn.name)) continue;
    seen.add(fn.name);
    items.push({
      label: fn.name,
      kind: CompletionItemKind.Function,
      detail: fn.signature,
      documentation: {
        kind: MarkupKind.Markdown,
        value: fn.description || '*Engine built-in*'
      },
      insertText: fn.name,
      insertTextFormat: InsertTextFormat.PlainText,
      sortText: '1_' + fn.name
    });
  }

  // User symbols from current file
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

  // User symbols from inherited scripts
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

  // Keywords
  const keywords = [
    'if', 'else', 'switch', 'case', 'default', 'break',
    'for', 'while', 'return', 'member', 'function',
    'trigger', 'forward', 'inherits', 'NULL()'
  ];
  const types = ['int', 'obj', 'void', 'string', 'float', 'list', 'loc', 'str'];
  for (const kw of [...keywords, ...types]) {
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

  // Engine function (case-insensitive lookup)
  const engineFn = engineCatalog.get(word.toLowerCase());
  if (engineFn) {
    return { contents: engineHover(engineFn) };
  }

  // User symbol in current file
  const syms = parseSymbols(text);
  const sym = syms.find(s => s.name === word && s.kind !== 'param');
  if (sym) {
    return { contents: userHover(sym) };
  }

  // User symbol in inherited scripts
  for (const scriptPath of getInheritedScriptPaths(text, params.textDocument.uri, scriptsDirectory)) {
    try {
      const inherited = fs.readFileSync(scriptPath, 'utf8');
      const isym = parseSymbols(inherited).find(s => s.name === word);
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

  // Engine functions have no source location
  if (engineCatalog.has(word.toLowerCase())) return null;

  // Search current file — prefer function/trigger/member/forward definitions
  const syms = parseSymbols(text);
  const primary = syms.find(s => s.name === word &&
    (s.kind === 'function' || s.kind === 'trigger' || s.kind === 'member' || s.kind === 'forward'));
  if (primary) {
    return Location.create(
      params.textDocument.uri,
      Range.create(Position.create(primary.line, primary.col), Position.create(primary.line, 999))
    );
  }

  // Variable declaration in current file
  const varSym = syms.find(s => s.name === word && s.kind === 'variable');
  if (varSym) {
    return Location.create(
      params.textDocument.uri,
      Range.create(Position.create(varSym.line, varSym.col), Position.create(varSym.line, 999))
    );
  }

  // Search inherited scripts
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
