import fs from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";

const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const iconSource = "public/brand/logos/v1.1/svg/polaris-icon-primary.svg";
const svg = fs.readFileSync(iconSource);
fs.copyFileSync(iconSource, "src/app/icon.svg");
await sharp(svg).resize(180, 180, { fit: "contain" }).png().toFile("src/app/apple-icon.png");
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map(size => sharp(svg).resize(size, size, { fit: "contain" }).png().toBuffer()));
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((frame, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index]; header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8); header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
fs.writeFileSync("src/app/favicon.ico", Buffer.concat([header, ...frames]));
fs.mkdirSync("qa-artifacts/stage-03/icons", { recursive: true });
for (let i = 0; i < sizes.length; i++) fs.writeFileSync(`qa-artifacts/stage-03/icons/icon-${sizes[i]}.png`, frames[i]);
const sheets = [];
for (const background of ["#FFFDF7", "#19253D"]) {
  const composite = [];
  for (const [index, size] of [16, 24, 32, 48, 64, 180].entries()) {
    const input = await sharp(svg).resize(size).png().toBuffer();
    composite.push({ input, left: index * 90 + 30, top: 36 });
  }
  sheets.push(await sharp({ create: { width: 720, height: 240, channels: 4, background } }).composite(composite).png().toBuffer());
}
await sharp({ create: { width: 720, height: 480, channels: 4, background: "#FFFDF7" } }).composite([{ input: sheets[0], top: 0, left: 0 }, { input: sheets[1], top: 240, left: 0 }]).png().toFile("qa-artifacts/stage-03/icons/light-dark-review.png");
const previews = {};
for (const page of [1, 2, 6]) {
  const path = `public/images/home-leadership-kit/previews/page-${page}.png`;
  const meta = await sharp(path).metadata();
  if (!meta.width || !meta.height) throw Error("Missing rendered PDF preview");
  previews[page] = { src: path.replace("public", ""), width: meta.width, height: meta.height, sha256: hash(fs.readFileSync(path)) };
}
fs.writeFileSync("src/content/kit-previews.json", JSON.stringify(previews, null, 2) + "\n");
const derived = ["src/app/icon.svg", "src/app/favicon.ico", "src/app/apple-icon.png"].map(path => ({ path, sha256: hash(fs.readFileSync(path)) }));
fs.writeFileSync("docs/stage-03-derived-assets.json", JSON.stringify({ iconSource, iconSourceSha256: hash(svg), icons: derived, pdfSource: "public/downloads/polaris-home-leadership-kit.pdf", pdfSourceSha256: hash(fs.readFileSync("public/downloads/polaris-home-leadership-kit.pdf")), renderer: "Windows.Data.Pdf native renderer; pages 1, 2, 6; complete page canvas, no document edits", previews }, null, 2) + "\n");
console.log("Generated three favicon formats and recorded three faithful PDF-page previews.");
