import fs from "node:fs";import assert from "node:assert/strict";import {createHash} from "node:crypto";import {getCountries} from "libphonenumber-js/max";
const manifest=JSON.parse(fs.readFileSync("docs/phone-assets.json","utf8"));assert.equal(manifest.files.length,getCountries().length);
for(const file of manifest.files){const bytes=fs.readFileSync(file.path);assert.equal(createHash("sha256").update(bytes).digest("hex"),file.sha256);assert.match(bytes.toString(),/<svg/);assert.doesNotMatch(bytes.toString(),/<script|<foreignObject|(?:href|src)=["']https?:/i);}
for(const c of getCountries())assert.ok(manifest.files.some(f=>f.path.endsWith("/"+c+".svg")));
console.log(getCountries().length+" supported-country flags passed integrity and static SVG checks.");
