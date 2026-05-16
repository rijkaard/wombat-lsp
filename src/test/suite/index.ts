import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Mocha = require('mocha');

export function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'tdd', color: true, timeout: 30_000 });
  mocha.addFile(path.resolve(__dirname, 'extension.test.js'));

  return new Promise((resolve, reject) => {
    mocha.run((failures: number) => {
      if (failures > 0) reject(new Error(`${failures} test(s) failed`));
      else resolve();
    });
  });
}
