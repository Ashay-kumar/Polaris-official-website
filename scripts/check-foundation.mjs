import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const readJson = p => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = b => createHash("sha256").update(b).digest("hex");
const brand = readJson("docs/brand-files.json");
assert.equal(brand.commit, "0328f77f90b31a7478866c9af11a3fd69b02ec24");
for (const file of brand.files) {
  assert.equal(hash(fs.readFileSync(file.destination)), file.sha256, `Imported brand asset changed: ${file.destination}`);
  if (!file.adapted) assert.equal(file.sha256, file.sourceSha256);
}
const original = readJson("docs/asset-inventory.json").preservedFiles;
for (const file of original) assert.equal(hash(fs.readFileSync(file.path)), file.sha256, `Original design asset changed: ${file.path}`);
const local = readJson("docs/local-assets.json").files;
for (const file of local) assert.equal(hash(fs.readFileSync(file.destination)), file.sha256, `Local asset changed: ${file.destination}`);

const css = fs.readdirSync("src/styles/tokens").filter(f => f.endsWith(".css")).map(f => fs.readFileSync(`src/styles/tokens/${f}`, "utf8")).join("\n");
const declarations = new Map([...css.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)].map(m => [m[1], m[2].trim()]));
for (const [name, value] of Object.entries({ blue: "#245CFF", pink: "#E93C8D", lime: "#C8EE56", peach: "#FFB78A", ink: "#19253D", ivory: "#FFFDF7" })) {
  assert.equal(declarations.get(`--color-brand-${name}`), value);
}
for (const [, ref] of css.matchAll(/var\((--[\w-]+)/g)) assert.ok(declarations.has(ref) || ["--loaded-font-body", "--loaded-font-editorial"].includes(ref), `Unresolved token ${ref}`);
const graph = new Map([...declarations].map(([name, value]) => [name, [...value.matchAll(/var\((--[\w-]+)/g)].map(m => m[1])]));
function resolve(name, trail = new Set()) {
  assert.ok(!trail.has(name), `Circular token reference ${name}`);
  const next = new Set(trail).add(name);
  for (const ref of graph.get(name) ?? []) resolve(ref, next);
}
for (const name of graph.keys()) resolve(name);
assert.match(css, /prefers-reduced-motion:\s*reduce/);
assert.match(css, /min-width:\s*50rem/);
assert.match(css, /min-width:\s*75rem/);

const logoManifest = fs.readFileSync("src/lib/brand/logos.ts", "utf8");
const logoFiles = [...logoManifest.matchAll(/\/([\w-]+\.svg)/g)].map(m => m[1]);
assert.equal(logoFiles.length, 6);
for (const name of logoFiles) {
  const file = `public/brand/logos/v1.1/svg/${name}`;
  const svg = fs.readFileSync(file, "utf8");
  assert.match(svg, /<svg\b/);
  assert.match(svg, /viewBox="0 0 [\d.]+ [\d.]+"/);
  assert.doesNotMatch(svg, /<script\b|<foreignObject\b|\son\w+\s*=/i);
  assert.ok(fs.existsSync(file.replace("/svg/", "/png/").replace(/\.svg$/, ".png")));
}
for (const font of local.filter(f => f.destination.endsWith(".woff2"))) {
  assert.equal(fs.readFileSync(font.destination).subarray(0, 4).toString(), "wOF2");
  assert.ok(fs.readFileSync("src/app/layout.tsx", "utf8").includes(path.basename(font.destination)));
}
const kit = local.find(f => f.destination.endsWith(".pdf"));
if (kit) {
  const pdf = fs.readFileSync(kit.destination).toString("latin1");
  assert.ok(pdf.startsWith("%PDF-"));
  assert.equal([...pdf.matchAll(/\/Type\s*\/Page\b/g)].length, 6);
}
console.log(`Foundation passed: ${brand.files.length} approved imports, ${original.length} preserved original files, ${declarations.size} token names, six SVG/PNG logo pairs, four local fonts${kit ? ", six-page kit" : ""}.`);
