import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
  const extensionDevelopmentPath = path.resolve(__dirname, '../../');
  const extensionTestsPath       = path.resolve(__dirname, './suite/index');
  const workspacePath            = path.resolve(__dirname, '../../testFixtures');

  await runTests({
    extensionDevelopmentPath,
    extensionTestsPath,
    launchArgs: [workspacePath, '--disable-extensions']
  });
}

main().catch(err => { console.error(err); process.exit(1); });
