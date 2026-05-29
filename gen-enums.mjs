#!/usr/bin/env node
/**
 * gen-enums.mjs — generate enums.generated.json for the Wombat LSP
 *
 * Reads one or more C header files, extracts named enum definitions,
 * applies the type-name mapping from enum-mapping.json, and writes
 * enums.generated.json.  The LSP server loads this file in preference
 * to the committed enums.json, so the data stays in sync with the
 * source headers without overwriting the hand-maintained fallback.
 *
 * Usage:
 *   node gen-enums.mjs [--config <path>] [--base <path>] [--out <path>]
 *
 * Defaults (all relative to this script's directory):
 *   --config  server/data/enum-mapping.json
 *   --base    server/data/enums.json
 *   --out     server/data/enums.generated.json
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ── CLI ─────────────────────────────────────────────────────────────────── */

const argv  = process.argv.slice(2);
const arg   = (flag) => { const i = argv.indexOf(flag); return i >= 0 ? argv[i + 1] : null; };

const CONFIG_PATH = arg('--config') ?? path.join(__dirname, 'server/data/enum-mapping.json');
const BASE_PATH   = arg('--base')   ?? path.join(__dirname, 'server/data/enums.json');
const OUT_PATH    = arg('--out')    ?? path.join(__dirname, 'server/data/enums.generated.json');

/* ── Load config ─────────────────────────────────────────────────────────── */

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const typeMap      = config.typeMap;       // { C_type_name: LSP_type_name }
const headerPaths  = config.headers;       // paths relative to config file

if (!typeMap || !headerPaths) {
  console.error('enum-mapping.json must have "headers" and "typeMap" keys');
  process.exit(1);
}

const configDir = path.dirname(CONFIG_PATH);

/* ── Parse a C header for named enum definitions ─────────────────────────── */

function parseHeader(src) {
  /* Returns Map<C_type_name, Array<{name, value, hex}>> */
  const result  = new Map();
  let inBlock   = false;   // inside a /* */ comment
  let curType   = null;
  let lastVal   = -1n;
  let entries   = [];

  for (const rawLine of src.split('\n')) {
    let line = rawLine;

    /* strip block comments */
    if (inBlock) {
      const end = line.indexOf('*/');
      if (end >= 0) { inBlock = false; line = line.slice(end + 2); }
      else continue;
    }
    const bc = line.indexOf('/*');
    if (bc >= 0) {
      const end = line.indexOf('*/', bc + 2);
      if (end >= 0) {
        line = line.slice(0, bc) + line.slice(end + 2);
      } else {
        inBlock = true;
        line = line.slice(0, bc);
      }
    }
    /* strip line comments */
    const lc = line.indexOf('//');
    if (lc >= 0) line = line.slice(0, lc);

    line = line.trim();
    if (!line) continue;

    if (curType === null) {
      /* Look for:  enum TypeName {   (named enum — anonymous enums are skipped) */
      const m = line.match(/^enum\s+([A-Za-z_]\w*)\s*\{/);
      if (m) {
        curType = m[1];
        lastVal = -1n;
        entries = [];
      }
    } else {
      /* Inside an enum body */
      if (line.startsWith('}')) {
        result.set(curType, entries);
        curType = null;
        entries = [];
        continue;
      }

      /* IDENTIFIER [= VALUE] [,] */
      const m = line.match(/^([A-Za-z_]\w*)\s*(?:=\s*([^,]+?))?(?:\s*,|\s*$)/);
      if (!m) continue;

      const name = m[1];
      let   val;
      if (m[2] !== undefined) {
        const raw = m[2].trim();
        if (/^'.'$/.test(raw)) {
          val = BigInt(raw.charCodeAt(1));
        } else if (/^0[xX][0-9A-Fa-f]+$/.test(raw)) {
          try { val = BigInt(raw); } catch { continue; }
        } else if (/^-?\d+$/.test(raw)) {
          try { val = BigInt(raw); } catch { continue; }
        } else if (/^\d+\s*<<\s*\d+$/.test(raw)) {
          /* bit-shift literals like  1 << 4 */
          try {
            const [a, b] = raw.split('<<').map(s => BigInt(s.trim()));
            val = a << b;
          } catch { continue; }
        } else {
          continue; /* skip symbolic references (e.g. OTHER_CONST + 1) */
        }
      } else {
        val = lastVal + 1n;
      }
      lastVal = val;

      const numVal = Number(val);
      let hex;
      if (numVal < 0) {
        hex = '-0x' + (-numVal).toString(16).toUpperCase();
      } else if (numVal >= 10) {
        hex = '0x' + numVal.toString(16).toUpperCase();
      } else {
        hex = String(numVal);
      }

      entries.push({ name, value: numVal, hex });
    }
  }

  return result;
}

/* ── Main ────────────────────────────────────────────────────────────────── */

/* Load base enums (committed fallback) */
const base = JSON.parse(fs.readFileSync(BASE_PATH, 'utf8'));

/* Parse all headers */
const allParsed = new Map();  /* C_type_name → entries */

for (const rel of headerPaths) {
  const absPath = path.resolve(configDir, rel);
  if (!fs.existsSync(absPath)) {
    console.warn(`Warning: header not found: ${absPath}`);
    continue;
  }
  const src = fs.readFileSync(absPath, 'utf8');
  const parsed = parseHeader(src);
  for (const [cType, entries] of parsed) {
    if (!allParsed.has(cType)) allParsed.set(cType, entries);
    /* first definition wins if a type appears in multiple headers */
  }
}

/* Apply mapping and build output */
const generated = {};

for (const [cType, lspType] of Object.entries(typeMap)) {
  const entries = allParsed.get(cType);
  if (!entries) {
    console.warn(`Warning: C type '${cType}' not found in any header (wanted as '${lspType}')`);
    continue;
  }
  generated[lspType] = entries.slice().sort((a, b) => a.value - b.value);
  console.log(`${cType} → ${lspType}: ${entries.length} entries`);
}

/* Merge: generated takes priority; base fills in anything missing */
const output = { ...base, ...generated };

fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));
console.log(`\nWrote ${Object.keys(output).length} enum types to ${OUT_PATH}`);
console.log(`  ${Object.keys(generated).length} from headers, ${Object.keys(base).length} in base`);
