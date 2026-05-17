#!/usr/bin/env node
'use strict';
// Parses wombat-api-ref/combined.md → data/catalog.json for the language server.
// Each entry has C signature, Wombat signature, aliases, and a notes description.

const fs = require('fs');
const path = require('path');

const mdPath  = path.resolve(__dirname, '../../../wombat-api-ref/combined.md');
const outPath = path.resolve(__dirname, 'data/catalog.json');

const md = fs.readFileSync(mdPath, 'utf8');
const catalog = {};

// Parse sections: ### Script_xxx\n**C:** ...\n**Wombat:** ...\n**Notes:** ...
const sectionRe = /^### (Script_\w+)\n\*\*C:\*\* `([^\n`]+)`\n\*\*Wombat:\*\* `([^\n`]+)`(?:[^\n]*)?\n\*\*Notes:\*\* ([^\n]+)/gm;

let m;
while ((m = sectionRe.exec(md)) !== null) {
  const [, cName, cSig, wombatSig, notes] = m;

  // Extract Wombat function name (first identifier before '(')
  const nameMatch = wombatSig.match(/(?:\w+\s+)?(\w+)\s*\(/);
  if (!nameMatch) continue;
  const wombatName = nameMatch[1];

  // Extract aliases from the _(aliases: ...)_ portion of the Wombat line
  const aliasMatch = m[0].match(/_\(aliases:\s*([^)]+)\)_/);
  const aliases = [];
  if (aliasMatch) {
    for (const a of aliasMatch[1].split(',')) {
      const t = a.trim();
      // Skip index numbers like [167] and the primary name itself
      if (/^\[\d+\]$/.test(t) || t === wombatName) continue;
      if (t) aliases.push(t);
    }
  }

  const entry = {
    name: wombatName,
    cSignature: cSig.trim(),
    signature: wombatSig.trim(),
    description: notes.trim(),
    aliases,
  };

  catalog[wombatName] = entry;
  // Also index aliases
  for (const alias of aliases) {
    catalog[alias] = {
      ...entry,
      name: alias,
      signature: entry.signature.replace(/(?:\w+\s+)?(\w+)(?=\s*\()/, alias),
      aliases: aliases.filter(a => a !== alias).concat([wombatName]),
    };
  }
}

fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2));
console.log(`Catalog: ${Object.keys(catalog).length} entries → ${outPath}`);
