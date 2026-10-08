import * as fs from "fs";
import path from 'path';

const n = Number(process.argv[2] ?? 100);

const bindings = Array.from({ length: n }, (_, i) => `    <p>{{ s${i}() }}</p>`).join("\n");
const fields = Array.from({ length: n }, (_, i) => `  readonly s${i} = signal(${i});`).join("\n");

const app = `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
${bindings}
  \`,
})
export class App {
${fields}
}
`;

const targetPath = path.join(__dirname, '../codegen-poc/src/app/app.ts');
fs.mkdirSync(path.dirname(targetPath), {recursive: true})
fs.writeFileSync(targetPath, app);
console.log(`wrote app.ts with ${n} independent signal bindings`);