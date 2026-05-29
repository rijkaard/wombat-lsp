# Wombat Script — VS Code Language Support

Language support extension for the **Wombat scripting language** used in the Ultima Online June 1998 server.

## Features

- **Syntax highlighting** for `.m` Wombat script files
- **Language Server Protocol (LSP)** backend providing:
  - Go-to-definition (within file and cross-file via `inherits`)
  - Hover documentation for built-in engine functions, user symbols, trigger variables, and enum constants
  - Completion suggestions for identifiers, keywords, API names, and enum constant names
  - Diagnostics: undefined symbols, engine-function case mismatches, and enum type mismatches

### Enum support

The LSP knows about all named enum constants from the `ouo` server headers (e.g. `SKILL_ALCHEMY`, `DIR_NORTH`, `EQUIP_BACKPACK`, `TIMER_EVENT_CALLBACK`).

- **Completion** — inside an annotated function call, only constants of the correct enum type are offered (e.g. typing at `getSkillLevel(this, <cursor>)` offers `SKILL_*` names)
- **Hover** — hovering an enum constant shows its hex value and type; if it is at an annotated parameter position, a ✓/⚠ type-match note is shown
- **Diagnostics** — passing an enum constant of the wrong type (e.g. `DIR_NORTH` where a `Skill` is expected) produces an error

## Requirements

No external tools required. The language server is bundled with the extension.

## Configuration

| Setting | Default | Description |
|---|---|---|
| `wombat.scriptsDirectory` | `""` | Path to the Wombat scripts directory for cross-file go-to-definition. Leave blank to use the directory of the current file. |

## Building from Source

```bash
npm install
cd server && npm install && cd ..
npm run bundle      # esbuild production bundle
npm run package     # produce .vsix via vsce
```

### Regenerating the enum catalog from source headers

The committed `server/data/enums.json` is a static fallback. To regenerate from the live `ouo` headers:

```bash
npm run gen-enums
# produces server/data/enums.generated.json
# the LSP server prefers this file over enums.json when present
```

Configuration is in `server/data/enum-mapping.json`:
- `headers` — paths to C headers to scan (relative to the config file)
- `typeMap` — maps C enum type names to LSP type names (e.g. `"SkillId": "Skill"`)

To add support for a new enum type, add the header (if not listed) and a `typeMap` entry, then re-run `npm run gen-enums`.

## Data files

| File | Description |
|------|-------------|
| `server/data/catalog.json` | Engine built-in function catalog (signatures, descriptions) |
| `server/data/enums.json` | Committed enum constant definitions (static fallback) |
| `server/data/enums.generated.json` | Generated enum constants (preferred; not committed) |
| `server/data/enum-mapping.json` | Config for `gen-enums.mjs`: header paths + C→LSP type-name map |
| `server/data/param-enums.json` | Maps `(function, arg_index)` to enum type for completion/hover/validation |

## License

MIT
