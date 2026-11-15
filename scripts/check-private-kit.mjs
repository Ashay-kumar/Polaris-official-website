import fs from "node:fs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { privateKitAssets } from "./private-kit-files.mjs";
for (const asset of privateKitAssets) {
  assert.ok(!fs.existsSync(asset.from), "PDF must not be restored under public/");
  assert.ok(fs.existsSync(asset.to), `Provide the authorized private fixture locally: ${asset.to}`);
  const bytes = fs.readFileSync(asset.to);
  assert.equal(bytes.length, asset.bytes);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256);
  assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
  assert.equal([...bytes.toString("latin1").matchAll(/\/Type\s*\/Page\b/g)].length, asset.bytes === 325137 ? 8 : 6);
}
await import("./check-content.mjs");
console.log("Private kit verification passed: three original byte hashes/sizes/page counts and full founder activity-content comparison. No private artifacts published.");
