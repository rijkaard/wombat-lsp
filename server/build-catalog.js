#!/usr/bin/env node
'use strict';
// Parses wombat-api.html → data/catalog.json for the language server.

const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../../wombat-api.html');
const outPath  = path.resolve(__dirname, 'data/catalog.json');

const html = fs.readFileSync(htmlPath, 'utf8');
const catalog = {};

// Each function entry is a <details> block containing:
//   <code class="proto">signature</code>
//   <p class="desc">description</p>
//   <div class="aliases">Also: <code>alias</code></div>
const detailsRe = /<details>([\s\S]*?)<\/details>/g;
const protoRe   = /<code class="proto">([^<]+)<\/code>/;
const descRe    = /<p class="desc">([^<]+)<\/p>/;
const aliasesRe = /class="aliases"[^>]*>Also:\s*([\s\S]*?)<\/div>/;
const aliasCodeRe = /<code>([^<]+)<\/code>/g;

let m;
while ((m = detailsRe.exec(html)) !== null) {
  const block = m[1];

  const protoMatch = block.match(protoRe);
  if (!protoMatch) continue;
  const signature = protoMatch[1].trim();

  // Extract name: first word before '('
  const nameMatch = signature.match(/(?:\w+\s+)?(\w+)\s*\(/);
  if (!nameMatch) continue;
  const name = nameMatch[1];

  const descMatch = block.match(descRe);
  const description = descMatch ? descMatch[1].trim() : '';

  const aliases = [];
  const aliasesMatch = block.match(aliasesRe);
  if (aliasesMatch) {
    let am;
    while ((am = aliasCodeRe.exec(aliasesMatch[1])) !== null) {
      aliases.push(am[1]);
    }
  }

  catalog[name] = { name, signature, description, aliases };
  // Also index aliases pointing to the same entry
  for (const alias of aliases) {
    catalog[alias] = { name: alias, signature: signature.replace(/\b\w+(?=\()/, alias), description, aliases: [name] };
  }
}

fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2));
console.log(`Catalog: ${Object.keys(catalog).length} entries → ${outPath}`);
