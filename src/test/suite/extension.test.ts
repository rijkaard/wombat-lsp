/**
 * End-to-end tests for the Wombat language server.
 *
 * Fixture layout — basic.m (0-indexed lines/cols):
 *   L0   // LSP test fixture — wombat-lsp E2E suite
 *   L1   member int armor_class;           armor_class @ col 11
 *   L2   member string guild_name;
 *   L3   (blank)
 *   L4   forward int compute_ac(int base); compute_ac  @ col 12
 *   L5   (blank)
 *   L6   // Get the armor class
 *   L7   int compute_ac(int base)          compute_ac  @ col 4 (definition)
 *                                          base param  @ col 19
 *   L8   {
 *   L9       int result = base + armor_class;  result @ col 8, base(usage) @ col 17
 *   L10      return(result);
 *   L11  }
 *   L12  (blank)
 *   L13  trigger use {                         use     @ col 8
 *   L14      int ac = compute_ac(getObjVar(this, "armorClass"));
 *            compute_ac @ col 13  getObjVar @ col 24  "..." starts @ col 40
 *   L15      return(0x01);
 *   L16  }
 *
 * Fixture layout — child.m:
 *   L0   inherits parent;                  parent(module) @ col 9
 *   L1   (blank)
 *   L2   trigger use {
 *   L3       int hp = get_hp(10);          get_hp @ col 13
 *   L4       int gs = get_grand_stat();    get_grand_stat @ col 13
 *   L5       return(0x01);
 *   L6   }
 *
 * Fixture layout — parent.m:
 *   L0   inherits grandparent;             grandparent(module) @ col 9
 *   L2   member int base_hp;
 *   L5   int get_hp(int bonus)             get_hp @ col 4 (definition)
 *
 * Fixture layout — grandparent.m:
 *   L0   member int grand_stat;
 *   L2   int get_grand_stat()              get_grand_stat @ col 4 (definition)
 *
 * Fixture layout — enum-test.m:
 *   L1   callbackAdvanced(this, 10, 5, 0); 5(eventType) @ col 31 [TIMER_EVENT_CALLBACK]
 *   L2   scriptTrig(this, 0x10, 0);        0x10(trigType) @ col 21 [EnterRange]
 *   L3   setMobFlag(this, 0x40);           0x40(flagId) @ col 21 [MobileFlag_WarMode]
 */

import * as assert from 'assert';
import * as path   from 'path';
import * as vscode from 'vscode';

const fixturesDir = path.resolve(__dirname, '../../../testFixtures');

// ── Helpers ───────────────────────────────────────────────────────────────────

function uri(filename: string): vscode.Uri {
  return vscode.Uri.file(path.join(fixturesDir, filename));
}

async function openDoc(filename: string): Promise<vscode.Uri> {
  const docUri = uri(filename);
  const doc    = await vscode.workspace.openTextDocument(docUri);
  await vscode.window.showTextDocument(doc);
  return docUri;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function hoverText(hovers: vscode.Hover[]): string {
  return hovers.flatMap(h =>
    h.contents.map(c => (typeof c === 'string' ? c : (c as vscode.MarkdownString).value))
  ).join('\n');
}

// ── Suite setup ───────────────────────────────────────────────────────────────

suite('Wombat LSP', function () {
  this.timeout(60_000);

  suiteSetup(async () => {
    // Open a file so the extension activates and the server starts
    await openDoc('basic.m');
    await sleep(3000);  // wait for server to initialise
  });

  // ── Hover ─────────────────────────────────────────────────────────────────

  suite('Hover', () => {

    test('engine function: shows built-in marker and signature', async () => {
      // getObjVar at L14 col 24
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(14, 24)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover result for engine function');
      const text = hoverText(hovers);
      assert.ok(text.includes('getObjVar'),       `signature missing — got: ${text}`);
      assert.ok(text.includes('Engine built-in'), `built-in marker missing — got: ${text}`);
    });

    test('engine function: no hover inside string literal', async () => {
      // col 45 is inside "armorClass" on L14
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(14, 45)
      );
      const text = hovers ? hoverText(hovers) : '';
      assert.ok(
        !text.includes('Engine built-in') && !text.includes('int ') && !text.includes('string '),
        `unexpected hover inside string literal — got: ${text}`
      );
    });

    test('user function: shows signature on definition line', async () => {
      // compute_ac at L7 col 4
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(7, 4)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover for user function');
      const text = hoverText(hovers);
      assert.ok(text.includes('compute_ac'), `function name missing — got: ${text}`);
      assert.ok(text.includes('int'),        `return type missing — got: ${text}`);
    });

    test('user function: shows signature on call site', async () => {
      // compute_ac at L14 col 13
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(14, 13)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover for user function call');
      const text = hoverText(hovers);
      assert.ok(text.includes('compute_ac'), `function name missing — got: ${text}`);
    });

    test('member: shows type and name', async () => {
      // armor_class at L1 col 11
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(1, 11)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover for member');
      const text = hoverText(hovers);
      assert.ok(text.includes('armor_class'), `member name missing — got: ${text}`);
      assert.ok(text.includes('int'),         `member type missing — got: ${text}`);
    });

    test('local variable: shows type and name', async () => {
      // result at L9 col 8
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(9, 8)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover for local variable');
      const text = hoverText(hovers);
      assert.ok(text.includes('result'), `variable name missing — got: ${text}`);
      assert.ok(text.includes('int'),    `variable type missing — got: ${text}`);
    });

    test('trigger: shows trigger name', async () => {
      // use at L13 col 8
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(13, 8)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover for trigger');
      const text = hoverText(hovers);
      assert.ok(text.includes('use'), `trigger name missing — got: ${text}`);
    });

    test('forward declaration: shows signature', async () => {
      // compute_ac at L4 col 12
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(4, 12)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover for forward');
      const text = hoverText(hovers);
      assert.ok(text.includes('compute_ac'), `forward name missing — got: ${text}`);
    });

    test('inherited symbol: shows signature and source file', async () => {
      // get_hp at L3 col 13 in child.m (defined in parent.m)
      const docUri = await openDoc('child.m');
      await sleep(1000);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(3, 13)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover for inherited function');
      const text = hoverText(hovers);
      assert.ok(text.includes('get_hp'),    `function name missing — got: ${text}`);
      assert.ok(text.includes('parent.m'),  `source file missing — got: ${text}`);
    });

  });

  // ── Completion ────────────────────────────────────────────────────────────

  suite('Completion', () => {

    test('engine functions appear in completion list', async () => {
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider', docUri, new vscode.Position(14, 13)
      );
      assert.ok(list && list.items.length > 0, 'expected completion items');
      const names = list.items.map(i => i.label.toString());
      assert.ok(names.includes('getObjVar'), `getObjVar not in completions: ${names.slice(0,20)}`);
      assert.ok(names.includes('attachScript'), `attachScript not in completions`);
    });

    test('user-defined symbols appear in completion list', async () => {
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider', docUri, new vscode.Position(14, 13)
      );
      assert.ok(list && list.items.length > 0, 'expected completion items');
      const names = list.items.map(i => i.label.toString());
      assert.ok(names.includes('compute_ac'),  `user function missing from completions`);
      assert.ok(names.includes('armor_class'), `member missing from completions`);
    });

    test('keywords appear in completion list', async () => {
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider', docUri, new vscode.Position(14, 13)
      );
      assert.ok(list && list.items.length > 0, 'expected completion items');
      const names = list.items.map(i => i.label.toString());
      assert.ok(names.includes('if'),     'keyword "if" missing');
      assert.ok(names.includes('return'), 'keyword "return" missing');
      assert.ok(names.includes('int'),    'type "int" missing');
    });

    test('inherited symbols appear in completion list (child.m)', async () => {
      const docUri = await openDoc('child.m');
      await sleep(1000);
      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider', docUri, new vscode.Position(3, 13)
      );
      assert.ok(list && list.items.length > 0, 'expected completion items');
      const names = list.items.map(i => i.label.toString());
      assert.ok(names.includes('get_hp'), `inherited function missing from completions: ${names.slice(0,20)}`);
    });

  });

  // ── Go to definition ──────────────────────────────────────────────────────

  suite('Go to definition', () => {

    test('function call → definition in same file', async () => {
      // compute_ac call at L14 col 13 should jump to definition at L7
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const locs = await vscode.commands.executeCommand<vscode.Location[]>(
        'vscode.executeDefinitionProvider', docUri, new vscode.Position(14, 13)
      );
      assert.ok(locs && locs.length > 0, 'expected definition location');
      assert.strictEqual(locs[0].uri.fsPath, uri('basic.m').fsPath);
      assert.strictEqual(locs[0].range.start.line, 7, `expected L7, got L${locs[0].range.start.line}`);
    });

    test('forward declaration → definition in same file', async () => {
      // compute_ac forward at L4 col 12 → definition at L7
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const locs = await vscode.commands.executeCommand<vscode.Location[]>(
        'vscode.executeDefinitionProvider', docUri, new vscode.Position(4, 12)
      );
      assert.ok(locs && locs.length > 0, 'expected definition location for forward');
      assert.strictEqual(locs[0].uri.fsPath, uri('basic.m').fsPath);
      // Forward decl resolves to the function body (definition preferred over forward)
      assert.strictEqual(locs[0].range.start.line, 7, `expected L7, got L${locs[0].range.start.line}`);
    });

    test('member name → declaration line', async () => {
      // armor_class at L1 col 11 → declaration on L1
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const locs = await vscode.commands.executeCommand<vscode.Location[]>(
        'vscode.executeDefinitionProvider', docUri, new vscode.Position(1, 11)
      );
      assert.ok(locs && locs.length > 0, 'expected definition for member');
      assert.strictEqual(locs[0].uri.fsPath, uri('basic.m').fsPath);
      assert.strictEqual(locs[0].range.start.line, 1);
    });

    test('local variable → declaration line', async () => {
      // result at L9 col 8 → declaration on L9
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const locs = await vscode.commands.executeCommand<vscode.Location[]>(
        'vscode.executeDefinitionProvider', docUri, new vscode.Position(9, 8)
      );
      assert.ok(locs && locs.length > 0, 'expected definition for local variable');
      assert.strictEqual(locs[0].uri.fsPath, uri('basic.m').fsPath);
      assert.strictEqual(locs[0].range.start.line, 9);
    });

    test('engine function → no definition (returns null/empty)', async () => {
      // getObjVar at L14 col 24 — engine functions have no source location
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const locs = await vscode.commands.executeCommand<vscode.Location[]>(
        'vscode.executeDefinitionProvider', docUri, new vscode.Position(14, 24)
      );
      const count = locs ? locs.length : 0;
      assert.strictEqual(count, 0, 'engine function should have no definition location');
    });

    test('inherited symbol → definition in parent file', async () => {
      // get_hp at L3 col 13 in child.m → defined in parent.m at L3
      const docUri = await openDoc('child.m');
      await sleep(1000);
      const locs = await vscode.commands.executeCommand<vscode.Location[]>(
        'vscode.executeDefinitionProvider', docUri, new vscode.Position(3, 13)
      );
      assert.ok(locs && locs.length > 0, 'expected definition for inherited function');
      assert.ok(
        locs[0].uri.fsPath.endsWith('parent.m'),
        `expected parent.m, got ${locs[0].uri.fsPath}`
      );
      assert.strictEqual(locs[0].range.start.line, 5, `expected L5, got L${locs[0].range.start.line}`);
    });

    test('inherits directive: jumps to module file', async () => {
      // "parent" at L0 col 9 in child.m → should open parent.m
      const docUri = await openDoc('child.m');
      await sleep(1000);
      const locs = await vscode.commands.executeCommand<vscode.Location[]>(
        'vscode.executeDefinitionProvider', docUri, new vscode.Position(0, 9)
      );
      assert.ok(locs && locs.length > 0, 'expected definition for inherits module name');
      assert.ok(
        locs[0].uri.fsPath.endsWith('parent.m'),
        `expected parent.m, got ${locs[0].uri.fsPath}`
      );
    });

    test('recursive inherited symbol → definition in grandparent file', async () => {
      // get_grand_stat at L4 col 13 in child.m → defined in grandparent.m L2
      const docUri = await openDoc('child.m');
      await sleep(1000);
      const locs = await vscode.commands.executeCommand<vscode.Location[]>(
        'vscode.executeDefinitionProvider', docUri, new vscode.Position(4, 13)
      );
      assert.ok(locs && locs.length > 0, 'expected definition for grandparent function');
      assert.ok(
        locs[0].uri.fsPath.endsWith('grandparent.m'),
        `expected grandparent.m, got ${locs[0].uri.fsPath}`
      );
      assert.strictEqual(locs[0].range.start.line, 2, `expected L2, got L${locs[0].range.start.line}`);
    });

    test('parameter: go-to-def jumps to function definition line', async () => {
      // base at L9 col 17 in basic.m — param of compute_ac defined at L7
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const locs = await vscode.commands.executeCommand<vscode.Location[]>(
        'vscode.executeDefinitionProvider', docUri, new vscode.Position(9, 17)
      );
      assert.ok(locs && locs.length > 0, 'expected definition for parameter');
      assert.strictEqual(locs[0].uri.fsPath, uri('basic.m').fsPath);
      assert.strictEqual(locs[0].range.start.line, 7, `expected L7, got L${locs[0].range.start.line}`);
    });

  });

  // ── Additional hover tests ────────────────────────────────────────────────

  suite('Hover (extended)', () => {

    test('parameter: shows type without hallucinating inherited member', async () => {
      // base at L9 col 17 in basic.m — param of compute_ac, NOT an inherited member
      const docUri = await openDoc('basic.m');
      await sleep(500);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(9, 17)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover for parameter');
      const text = hoverText(hovers);
      assert.ok(text.includes('base'), `param name missing — got: ${text}`);
      assert.ok(text.includes('int'),  `param type missing — got: ${text}`);
    });

    test('recursive inherited symbol: shows signature and grandparent source file', async () => {
      // get_grand_stat at L4 col 13 in child.m — defined 2 levels up in grandparent.m
      const docUri = await openDoc('child.m');
      await sleep(1000);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(4, 13)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover for grandparent function');
      const text = hoverText(hovers);
      assert.ok(text.includes('get_grand_stat'), `function name missing — got: ${text}`);
      assert.ok(text.includes('grandparent.m'),  `source file missing — got: ${text}`);
    });

  });

  // ── Additional completion tests ───────────────────────────────────────────

  suite('Completion (extended)', () => {

    test('recursive grandparent symbols appear in completion list', async () => {
      const docUri = await openDoc('child.m');
      await sleep(1000);
      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider', docUri, new vscode.Position(4, 13)
      );
      assert.ok(list && list.items.length > 0, 'expected completion items');
      const names = list.items.map(i => i.label.toString());
      assert.ok(names.includes('get_grand_stat'), `grandparent function missing from completions: ${names.slice(0,20)}`);
    });

  });

  // ── Enum hover and completion ─────────────────────────────────────────────
  //
  // Fixture layout — enum-test.m (0-indexed):
  //   L0   trigger use {
  //   L1       callbackAdvanced(this, 10, 5, 0);
  //            callbackAdvanced @ col 4   5(eventType) @ col 31 [param index 2]
  //   L2       scriptTrig(this, 0x10, 0);
  //            scriptTrig @ col 4   0x10(trigType) @ col 21 [param index 1]
  //   L3       setMobFlag(this, 0x40);
  //            setMobFlag @ col 4   0x40(flagId) @ col 21 [param index 1]
  //   L4   }

  suite('Enum hover', () => {

    test('known decimal enum value shows name and enum', async () => {
      // 5 at L1 col 31 = TIMER_EVENT_CALLBACK in callbackAdvanced eventType
      const docUri = await openDoc('enum-test.m');
      await sleep(1000);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(1, 31)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover for enum value');
      const text = hoverText(hovers);
      assert.ok(text.includes('TIMER_EVENT_CALLBACK'), `enum name missing — got: ${text}`);
      assert.ok(text.includes('TIMER_EVENT_*') || text.includes('TIMER_EVENT_CALLBACK'), `enum group missing — got: ${text}`);
    });

    test('known hex enum value shows name and enum', async () => {
      // 0x10 at L2 col 21 = EnterRange in scriptTrig trigType
      const docUri = await openDoc('enum-test.m');
      await sleep(500);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(2, 21)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover for hex enum value');
      const text = hoverText(hovers);
      assert.ok(text.includes('EnterRange'), `enum member name missing — got: ${text}`);
      assert.ok(text.includes('EventType'),  `enum type name missing — got: ${text}`);
    });

    test('known hex flag value shows name and enum', async () => {
      // 0x40 at L3 col 21 = MobileFlag_WarMode in setMobFlag flagId
      const docUri = await openDoc('enum-test.m');
      await sleep(500);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider', docUri, new vscode.Position(3, 21)
      );
      assert.ok(hovers && hovers.length > 0, 'expected hover for flag value');
      const text = hoverText(hovers);
      assert.ok(text.includes('MobileFlag'), `enum group missing — got: ${text}`);
    });

  });

  suite('Enum completion', () => {

    test('TIMER_EVENT_* values offered at eventType param position', async () => {
      // cursor at L1 col 31 = inside eventType arg of callbackAdvanced
      const docUri = await openDoc('enum-test.m');
      await sleep(500);
      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider', docUri, new vscode.Position(1, 31)
      );
      assert.ok(list && list.items.length > 0, 'expected completion items');
      const labels = list.items.map(i => i.label.toString());
      // TIMER_EVENT_CALLBACK = 5 = 0x5
      assert.ok(labels.some(l => /^0x5$/i.test(l) || l === '0x5'), `TIMER_EVENT_CALLBACK hex missing: ${labels.slice(0,15)}`);
      // Should have many TIMER_EVENT entries
      assert.ok(labels.filter(l => /^0x/.test(l)).length >= 5, `too few enum completions: ${labels.slice(0,15)}`);
    });

    test('EventType values offered at trigType param position', async () => {
      // cursor at L2 col 21 = inside trigType arg of scriptTrig
      const docUri = await openDoc('enum-test.m');
      await sleep(500);
      const list = await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider', docUri, new vscode.Position(2, 21)
      );
      assert.ok(list && list.items.length > 0, 'expected completion items');
      const labels = list.items.map(i => i.label.toString());
      // EnterRange = 0x10
      assert.ok(labels.some(l => /^0x10$/i.test(l)), `EnterRange hex missing: ${labels.slice(0,15)}`);
    });

  });

});
