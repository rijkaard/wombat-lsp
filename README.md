# Wombat Script — VS Code Language Support

Language support extension for the **Wombat scripting language** used in the Ultima Online June 1998 server.

## Features

- **Syntax highlighting** for `.m` Wombat script files
- **Language Server Protocol (LSP)** backend providing:
  - Go-to-definition (within file and cross-file)
  - Hover documentation for built-in functions and constants
  - Completion suggestions for identifiers, keywords, and API names
  - Diagnostics (parse errors)

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

## License

MIT
