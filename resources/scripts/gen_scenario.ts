import * as fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const counted = args.includes("--counted");
const n = Number(args.find((a) => !a.startsWith("--")) ?? 100);

const bindings = Array.from({ length: n }, (_, i) => `    <p>{{ s${i}() }}</p>`).join("\n");

let app: string;

if (!counted) {
  const fields = Array.from({ length: n }, (_, i) => `  readonly s${i} = signal(${i});`).join("\n");

  app = `import { Component, signal } from '@angular/core';

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
} else {
  const setup = `let READS = 0;

function counted<T>(s: WritableSignal<T>) {
  const read = () => { READS++; return s(); };
  read.set = s.set.bind(s);
  return read;
}`;

  const buttonTest = `    <button (click)="test()">Run test</button>\n`;
  const buttonTime = `    <button (click)="time()">Run timer</button>\n`
  const fields = Array.from({ length: n }, (_, i) => `  readonly s${i} = counted(signal(${i}));`).join("\n");

  const testMethod = `  async test() {
    READS = 0;
    this.s0.set(999);
    await this.appRef.whenStable();
    console.log('reads for one write:', READS);
  }\n`;

  const timeMethod = `  async time() {
    const writes = 1000, rounds = 5, batch = 50;
    const times: number[] = [];
    for (let r = 0; r < rounds; r++) {
      let elapsed = 0;
      for (let done = 0; done < writes; done += batch) {
        const t0 = performance.now();
        for (let i = 0; i < batch; i++) {
          this.s0.set(r * writes + done + i + 1);
          this.appRef.tick();
        }
        elapsed += performance.now() - t0;
        await new Promise((res) => setTimeout(res));  
      }
      times.push(elapsed);
    }
    times.sort((a, b) => a - b);
    console.log('median ms:', times[Math.floor(rounds / 2)]);
  }\n`;

  app = `import { ApplicationRef, Component, inject, signal, WritableSignal } from '@angular/core';

${setup}

@Component({
  selector: 'app-root',
  template: \`
${buttonTest}${buttonTime}${bindings}
  \`,
})
export class App {
  private appRef = inject(ApplicationRef);
${fields}
${testMethod}
${timeMethod}
}
`;
}

const targetPath = path.join(__dirname, "../codegen-poc/src/app/app.ts");
fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, app);
console.log(`wrote app.ts (${counted ? "counted" : "plain"}) with ${n} independent signal bindings`);