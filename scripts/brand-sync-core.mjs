import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
export const digest = bytes => createHash("sha256").update(bytes).digest("hex");
export const json = value => JSON.stringify(value, null, 2) + "\n";
export const fail = message => { throw new Error(message); };
export function safePath(value) {
  if (typeof value !== "string" || !value || value.length > 240 || /[\\:\x00-\x1f]/.test(value) || value.startsWith("/") || value.split("/").some(p => !p || p === "." || p === ".." || /[. ]$/.test(p) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p))) fail("Unsafe path: " + value);
  return value;
}
export function contained(root, relative) {
  safePath(relative);
  const base = path.resolve(root);
  if (fs.existsSync(base) && fs.lstatSync(base).isSymbolicLink()) fail("Symlink root rejected");
  let current = base;
  for (const part of relative.split("/")) { current = path.join(current, part); if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) fail("Symlink rejected: " + relative); }
  // Also reject junction/symlink ancestors of the supplied root.
  if (fs.existsSync(base) && fs.realpathSync(base).toLowerCase() !== base.toLowerCase()) fail("Redirected root rejected");
  return current;
}
export function loadContract(filename) {
  const c = JSON.parse(fs.readFileSync(filename, "utf8"));
  if (c.schemaVersion !== 1 || c.contractVersion !== "1.0.0" || !/^[0-9a-f]{40}$/.test(c.sourceCommit) || !/^[0-9a-f]{40}$/.test(c.approvedSourceBaseline) || !/^[0-9]+\.[0-9]+\.[0-9]+(?:-[a-z0-9.-]+)?$/.test(c.brandReleaseVersion)) fail("Unsupported contract/version/source");
  if (!["local-candidate", "approved"].includes(c.releaseStatus) || (c.releaseStatus === "approved" && (!c.releaseApproval?.reference || !c.releaseApproval?.approvedBy))) fail("Missing release approval record");
  if (c.repository !== "mridulavdass-bit/polaris-brand-design-system" || !c.compatibility || !Array.isArray(c.files) || !c.files.length) fail("Incomplete contract");
  for (const k of ["logoAssetVersion","identityApproval","releaseNotes"]) if (typeof c[k]!=="string" || !c[k].trim()) fail("Missing contract metadata: "+k);
  for (const k of ["node","next","react","reactDom","phosphor","styling"]) if (typeof c.compatibility[k]!=="string" || !c.compatibility[k]) fail("Missing compatibility: "+k);
  if(c.files.length>128)fail("Export allowlist exceeds contract limit");
  safePath(c.releaseNotes);
  for (const key of ["source", "destination"]) { const paths = c.files.map(f => safePath(f[key]).toLowerCase()); if (new Set(paths).size !== paths.length) fail("Duplicate allowlist path"); }
  for (const f of c.files) if (!/^[a-f0-9]{64}$/.test(f.sha256) || !["git", "font-package", "contract-file"].includes(f.kind) || !f.license || (f.kind === "font-package" && !f.origin)) fail("Incomplete file provenance");
  return c;
}
export function manifestFor(c, sizes) {
  return { schemaVersion:c.schemaVersion, contractVersion:c.contractVersion, brandReleaseVersion:c.brandReleaseVersion, logoAssetVersion:c.logoAssetVersion, releaseStatus:c.releaseStatus, releaseApproval:c.releaseApproval, repository:c.repository, sourceCommit:c.sourceCommit, approvedSourceBaseline:c.approvedSourceBaseline, identityApproval:c.identityApproval, releaseNotes:c.releaseNotes, compatibility:c.compatibility, contractSha256:digest(json(c)), buildIdentifier:"sha256:" + digest(json(c)), files:c.files.map((f,i)=>({...f, bytes:sizes[i]})) };
}
export function filesUnder(root, prefix = "") {
  return fs.readdirSync(path.join(root,prefix),{withFileTypes:true}).flatMap(e=>{const rel=prefix?prefix+"/"+e.name:e.name;contained(root,rel);if(e.isSymbolicLink())fail("Symlink in export");return e.isDirectory()?filesUnder(root,rel):[rel];}).sort();
}
export function validateBundle(root,c) {
  const expected=["manifest.json",...c.files.map(f=>"files/"+f.destination)].sort();
  if (JSON.stringify(filesUnder(root)) !== JSON.stringify(expected)) fail("Missing or unexpected bundle files");
  const buffers=c.files.map(f=>{const file=contained(root,"files/"+f.destination);if(fs.statSync(file).size>5_000_000)fail("Oversized export asset");const b=fs.readFileSync(file);if(b.length>5_000_000 || digest(b)!==f.sha256)fail("Tampered asset: "+f.destination);return b;});
  if(fs.statSync(contained(root,"manifest.json")).size>1_000_000)fail("Oversized manifest");
  const m=JSON.parse(fs.readFileSync(contained(root,"manifest.json"),"utf8"));
  if(json(m)!==json(manifestFor(c,buffers.map(b=>b.length))))fail("Manifest does not match reviewed contract");
  return {manifest:m,buffers};
}
export function checkCompatibility(c,pkg) {
  for(const [k,v] of Object.entries({next:c.compatibility.next,react:c.compatibility.react,"react-dom":c.compatibility.reactDom,"@phosphor-icons/react":c.compatibility.phosphor})) if(pkg.dependencies[k]!==v)fail("Compatibility conflict: "+k);
  const [major,minor]=process.versions.node.split(".").map(Number);if(major<20 || (major===20 && minor<9))fail("Node >=20.9 required");
}
