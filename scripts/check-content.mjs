import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { inflateSync } from "node:zlib";

const pdf = fs.readFileSync("public/downloads/polaris-home-leadership-kit.pdf");
assert.equal(createHash("sha256").update(pdf).digest("hex"), "0a39023cb7a555de06cee6abe39a0b10f0d14407b5d42e478b6c91f8c770bbf5");
function decodeAscii85(source) {
  const output = [];
  let group = [];
  function emit(values, count = 4) {
    const number = values.reduce((sum, value) => sum * 85 + value, 0);
    output.push(...[Math.floor(number / 16777216) & 255, Math.floor(number / 65536) & 255, Math.floor(number / 256) & 255, number & 255].slice(0, count));
  }
  for (const character of source.replace(/\s/g, "").replace(/~>$/, "")) {
    if (character === "z" && !group.length) { output.push(0, 0, 0, 0); continue; }
    group.push(character.charCodeAt(0) - 33);
    if (group.length === 5) { emit(group); group = []; }
  }
  if (group.length) { const count = group.length; while (group.length < 5) group.push(84); emit(group, count - 1); }
  return Buffer.from(output);
}
const streams = [...pdf.toString("latin1").matchAll(/stream\r?\n([\s\S]*?)endstream/g)];
assert.equal(streams.length, 6);
const text = streams.map(match => {
  const stream = inflateSync(decodeAscii85(match[1].trim())).toString();
  return [...stream.matchAll(/\(((?:\\.|[^\\)])*)\)\s*Tj/g)].map(m => m[1]).join(" ");
}).join(" ").replaceAll("\\(", "(").replaceAll("\\)", ")").replace(/\s+/g, " ");
const activities = JSON.parse(fs.readFileSync("src/content/activities.json", "utf8"));
assert.equal(activities.length, 12);
assert.equal(new Set(activities.map(a => a.id)).size, 12);
for (const quality of ["communication", "leadership", "curiosity", "resilience"]) assert.equal(activities.filter(a => a.quality === quality).length, 3);
for (const activity of activities) {
  for (const field of ["name", "duration", "instructions", "rationale", "ages"]) assert.ok(text.includes(activity[field]), `${activity.name}: ${field} differs from the original PDF`);
}
console.log("Content passed: unchanged six-page PDF; all 12 names, durations, instructions, rationales and age adaptations match source text.");
