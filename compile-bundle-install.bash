#!/usr/bin/env bash

npm run compile
npm run vscode:prepublish
vsce package
code --uninstall-extension uo-june98.wombat-language
code --install-extension ./wombat-language-0.1.0.vsix

