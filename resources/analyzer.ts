import * as ts from "typescript";
import * as fs from "fs";
import { parseTemplate } from "@angular/compiler";

const filePath = "./codegen-poc/src/app/app.ts";
const pagesDir = "../"; 

const sourceText = fs.readFileSync(filePath, "utf8");
const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);

const SIGNAL_FACTORIES = ["signal", "computed", "linkedSignal", "toSignal", "input", "model"];

const signals: string[] = [];
const members: string[] = [];
const found: { template?: string } = {};

function calleeName(call: ts.CallExpression): string | undefined {
  const callee = call.expression;
  if (ts.isIdentifier(callee)) return callee.text;
  if (ts.isPropertyAccessExpression(callee) && ts.isIdentifier(callee.expression)) {
    return callee.expression.text;
  }
  return undefined;
}

function readTemplate(cls: ts.ClassDeclaration) {
  for (const decorator of ts.getDecorators(cls) ?? []) {
    const call = decorator.expression;
    if (!ts.isCallExpression(call)) continue;
    const arg = call.arguments[0];
    if (!arg || !ts.isObjectLiteralExpression(arg)) continue;
    for (const prop of arg.properties) {
      if (ts.isPropertyAssignment(prop) && prop.name.getText() === "template") {
        const init = prop.initializer;
        if (ts.isNoSubstitutionTemplateLiteral(init) || ts.isStringLiteral(init)) {
          found.template = init.text;
        }
      }
    }
  }
}

function visit(node: ts.Node) {
  if (ts.isClassDeclaration(node)) {
    readTemplate(node);
  }

  if (ts.isPropertyDeclaration(node) && node.initializer) {
    const name = node.name.getText();
    const init = node.initializer;
    const factory = ts.isCallExpression(init) ? calleeName(init) : undefined;

    if (factory && SIGNAL_FACTORIES.includes(factory)) {
      signals.push(name);
      if (factory === "signal" && ts.isCallExpression(init)) {
        const arg = init.arguments[0]?.getText() ?? "undefined";
        members.push(`${name}: signal(${arg})`);
      } else {
        console.warn(`warning: ${name} uses ${factory}(), which runtime.js does not implement; left out of ctx.js`);
      }
    } else {
      members.push(`${name}: ${init.getText()}`);
    }
  }

  if (ts.isMethodDeclaration(node) && node.body) {
    const params = node.parameters.map((p) => p.getText()).join(", ");
    members.push(`${node.name.getText()}(${params}) ${node.body.getText()}`);
  }

  ts.forEachChild(node, visit);
}

visit(sourceFile);

if (found.template === undefined) {
  throw new Error(`No inline template found in ${filePath}`);
}

const result = parseTemplate(found.template, "test.html");
fs.writeFileSync("ast.json", JSON.stringify(result.nodes, null, 2));
fs.writeFileSync("signals.json", JSON.stringify(signals, null, 2));

const ctxTs =
  `import { signal } from './runtime.js';\n` +
  `export const ctx = {\n  ${members.join(",\n  ")}\n};\n`;

const ctxJs = ts.transpileModule(ctxTs, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;

fs.mkdirSync(pagesDir, { recursive: true });
fs.writeFileSync(`../ctx.js`, ctxJs);

console.log("signals:", signals);
console.log("template length:", found.template.length);
console.log(`wrote output_final.json, signals.json, ${pagesDir}/ctx.js`);