import fs from "node:fs";
import assert from "node:assert/strict";
const assets = JSON.parse(fs.readFileSync("docs/private-kit-assets.json", "utf8"));
const expected = [
  ["Kyro_Learning_Home_Leadership_Kit.pdf", "69dda4c82161de29300c8212d82aef9f078be8ca084e475ef730fd6c1ed955da", 325137],
  ["polaris-home-leadership-kit.pdf", "0a39023cb7a555de06cee6abe39a0b10f0d14407b5d42e478b6c91f8c770bbf5", 13123],
  ["Polaris_Home_Leadership_Kit.pdf", "0a39023cb7a555de06cee6abe39a0b10f0d14407b5d42e478b6c91f8c770bbf5", 13123],
];
assert.deepEqual(assets, expected.map(([name, sha256, bytes]) => ({ from: `public/downloads/${name}`, to: `private/kit/${name}`, sha256, bytes })), "Private kit relocation metadata changed");
export const privateKitAssets = assets;
export const isPrivateKit = source => assets.some(asset => asset.from === source);
/** Explicit relocation only; existing expected hashes are still verified by callers. */
export const privateKitPath = source => assets.find(asset => asset.from === source)?.to ?? source;
