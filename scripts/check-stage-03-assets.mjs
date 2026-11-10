import fs from "node:fs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import sharp from "sharp";

const manifest = JSON.parse(fs.readFileSync("docs/stage-03-derived-assets.json", "utf8"));
const hash = path => createHash("sha256").update(fs.readFileSync(path)).digest("hex");
assert.equal(hash(manifest.iconSource), manifest.iconSourceSha256);
assert.equal(hash(manifest.pdfSource), "0a39023cb7a555de06cee6abe39a0b10f0d14407b5d42e478b6c91f8c770bbf5");
assert.equal(hash("src/app/icon.svg"), manifest.iconSourceSha256, "SVG must retain exact approved bytes");
for (const file of manifest.icons) assert.equal(hash(file.path), file.sha256);
const apple = await sharp("src/app/apple-icon.png").metadata();
assert.equal(apple.width, 180); assert.equal(apple.height, 180);
for (const image of Object.values(manifest.previews)) {
  assert.equal(hash(`public${image.src}`), image.sha256);
  const metadata = await sharp(`public${image.src}`).metadata();
  assert.equal(metadata.width, image.width); assert.equal(metadata.height, image.height);
}
const ico = fs.readFileSync("src/app/favicon.ico");
assert.equal(ico.readUInt16LE(2), 1); assert.equal(ico.readUInt16LE(4), 3);
for (let i = 0; i < 3; i++) {
  const size = [16, 32, 48][i], entry = 6 + i * 16;
  const frame = ico.subarray(ico.readUInt32LE(entry + 12), ico.readUInt32LE(entry + 12) + ico.readUInt32LE(entry + 8));
  const expected = await sharp(manifest.iconSource).resize(size, size).png().toBuffer();
  assert.ok(frame.equals(expected), `ICO ${size}px frame must preserve approved artwork`);
}
console.log("Stage 03 assets passed: approved icon bytes/rasters; three faithful PDF previews; original PDF unchanged.");
