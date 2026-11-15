import fs from "node:fs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { privateKitAssets } from "./private-kit-files.mjs";

const bytes = fs.readFileSync("src/content/activities.json");
assert.equal(createHash("sha256").update(bytes).digest("hex"), "2a927962f217e610ba4bd94db94d54b2dca987f79a3a85d69bf43f831c37964d", "Approved public activity content changed; verify against private source before approving a new hash");
const activities = JSON.parse(bytes);
assert.equal(activities.length, 12);
assert.equal(new Set(activities.map(a => a.id)).size, 12);
for (const quality of ["communication", "leadership", "curiosity", "resilience"]) assert.equal(activities.filter(a => a.quality === quality).length, 3);
for (const activity of activities) for (const field of ["name", "duration", "instructions", "rationale", "ages"]) assert.ok(typeof activity[field] === "string" && activity[field].trim(), `Missing ${field}`);
for (const asset of privateKitAssets) assert.ok(!fs.existsSync(asset.from), "Private PDF restored to public/");

const git = process.platform === "win32" && fs.existsSync("tmp/git-portable/cmd/git.exe") ? "tmp/git-portable/cmd/git.exe" : "git";
const result = spawnSync(git, ["ls-files", "-z"], { encoding: "utf8" });
assert.equal(result.status, 0, "Unable to verify tracked resource exclusions");
for (const file of result.stdout.split("\0").filter(Boolean)) {
  if (!fs.existsSync(file)) continue; // Locally pending deletions; clean CI checks every tracked file.
  if ([".env.example", ".dev.vars.example"].includes(file)) continue;
  assert.doesNotMatch(file, /(^|\/)(private|node_modules|\.wrangler|tmp)\/|^docs\/operations\/|\.(pdf|pem|key|p12|pfx)$|(^|\/)\.env($|\.)|(^|\/)\.dev\.vars($|\.)/i, "Private/generated material tracked");
}
console.log("Public content passed: approved activity hash/structure, pinned private provenance and tracked resource exclusions. No PDF access required.");
