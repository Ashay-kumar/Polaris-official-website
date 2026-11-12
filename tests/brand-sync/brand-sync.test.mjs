import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {execFileSync} from "node:child_process";
import {digest,json,loadContract,manifestFor,validateBundle,safePath,contained,checkCompatibility} from "../../scripts/brand-sync-core.mjs";
import {propose,apply,verifyPin} from "../../scripts/brand-sync.mjs";
const c=loadContract("docs/brand-sync/contract.json");const pin=JSON.parse(fs.readFileSync("docs/brand-sync/pin.json"));

const pkg=JSON.parse(fs.readFileSync("package.json"));
const temporary=[];function dir(){const p=fs.mkdtempSync(path.join(os.tmpdir(),"kyro-brand-test-"));temporary.push(p);return p;}
const source=process.env.BRAND_TEST_EXPORT ?? (()=>{const p=dir();for(const f of c.files){const dest=path.join(p,"files",f.destination);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(f.destination,dest);}fs.writeFileSync(path.join(p,"manifest.json"),json(pin.manifest));return p;})();
function bundle(){const p=dir();fs.cpSync(source,p,{recursive:true});return p;}
function workspace(){const p=dir();fs.writeFileSync(path.join(p,"package.json"),json(pkg));for(const f of c.files){const dest=path.join(p,f.destination);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(f.destination,dest);}return p;}
function rewriteBundle(b,contract){const sizes=contract.files.map(f=>fs.statSync(path.join(b,"files",f.destination)).size);fs.writeFileSync(path.join(b,"manifest.json"),json(manifestFor(contract,sizes)));}
test("all 42 approved entries and manifest metadata validate",()=>{assert.equal(c.files.length,42);assert.equal(validateBundle(source,c).manifest.buildIdentifier,"sha256:"+digest(json(c)));assert.equal(c.releaseStatus,"approved");assert.equal(c.brandReleaseVersion,"0.1.0-identity.3");assert.ok(c.releaseApproval?.approvedBy);assert.equal(c.releaseApproval?.reference,"docs/kyro-brand-release-approval.md");});
test("real exporter is deterministic and refuses existing output",{skip:!fs.existsSync(path.join(process.env.BRAND_SOURCE_ROOT??"C:/Users/Mridula Dass/Documents/polaris-brand-design-system","scripts/export-brand.mjs"))},()=>{const parent=dir();const brand=process.env.BRAND_SOURCE_ROOT??"C:/Users/Mridula Dass/Documents/polaris-brand-design-system";const git=path.resolve("tmp/git-portable/cmd/git.exe");const run=out=>execFileSync(process.execPath,[path.join(brand,"scripts/export-brand.mjs"),"--out",out],{env:{...process.env,BRAND_GIT_EXECUTABLE:git},stdio:["ignore","pipe","pipe"]});const a=path.join(parent,"a"),b=path.join(parent,"b");run(a);run(b);assert.deepEqual(fs.readFileSync(path.join(a,"manifest.json")),fs.readFileSync(path.join(b,"manifest.json")));assert.deepEqual(validateBundle(a,c).buffers,validateBundle(b,c).buffers);assert.throws(()=>run(a));});
test("missing asset rejected",()=>{const b=bundle();fs.unlinkSync(path.join(b,"files",c.files[0].destination));assert.throws(()=>validateBundle(b,c),/Missing or unexpected/);});
test("unexpected file rejected",()=>{const b=bundle();fs.writeFileSync(path.join(b,"unexpected.txt"),"extra");assert.throws(()=>validateBundle(b,c),/Missing or unexpected/);});
test("tampered asset rejected",()=>{const b=bundle();fs.appendFileSync(path.join(b,"files",c.files[0].destination),"tampered");assert.throws(()=>validateBundle(b,c),/Tampered/);});
test("tampered or incomplete manifest rejected",()=>{const b=bundle();const m=JSON.parse(fs.readFileSync(path.join(b,"manifest.json")));delete m.compatibility;fs.writeFileSync(path.join(b,"manifest.json"),json(m));assert.throws(()=>validateBundle(b,c),/Manifest/);});
test("contract requires compatibility and licence metadata",()=>{const p=dir(),file=path.join(p,"contract.json");for(const remove of [v=>delete v.compatibility.next,v=>delete v.logoAssetVersion,v=>delete v.files[0].license]){const bad=structuredClone(c);remove(bad);fs.writeFileSync(file,json(bad));assert.throws(()=>loadContract(file));}});
test("path traversal, Windows aliases and absolute paths rejected",()=>{for(const p of ["../x","a/../x","/x","C:/x","a\\b","a//b","a/./b","a.txt:stream","CON.txt","x.","x ","a/\u0000b"])assert.throws(()=>safePath(p));assert.equal(safePath("src/styles/tokens/colour-tokens.css"),"src/styles/tokens/colour-tokens.css");});
test("manifest cannot supply a replacement allowlist",()=>{const b=bundle();const m=JSON.parse(fs.readFileSync(path.join(b,"manifest.json")));m.files[0].destination="../package.json";fs.writeFileSync(path.join(b,"manifest.json"),json(m));assert.throws(()=>validateBundle(b,c),/Manifest/);});
test("symlink or junction escape rejected",()=>{const p=dir(),outside=dir();fs.symlinkSync(outside,path.join(p,"escape"),process.platform==="win32"?"junction":"dir");assert.throws(()=>contained(p,"escape/file.json"),/Symlink/);});
test("current website and pin agree",()=>{assert.equal(verifyPin(process.cwd(),pin),pin);assert.equal(pin.manifest.contractSha256,digest(json(c)));});
test("local managed-file change conflicts before writes",()=>{const w=workspace();fs.appendFileSync(path.join(w,c.files[0].destination),"local");assert.throws(()=>propose(w,source,c,pin),/Local conflict/);});
test("unmanaged destination is never silently overwritten",()=>{const w=workspace();fs.appendFileSync(path.join(w,c.files[0].destination),"local");assert.throws(()=>propose(w,source,c,null),/Unmanaged destination conflict/);});
test("same-version content change rejected",()=>{const altered=structuredClone(c);altered.identityApproval+=" change";const b=bundle();rewriteBundle(b,altered);assert.throws(()=>propose(workspace(),b,altered,pin),/version reused/);});
test("candidate is reviewable but cannot apply over existing pin",()=>{const candidate=structuredClone(c);candidate.brandReleaseVersion="0.1.1-candidate-test";candidate.releaseStatus="local-candidate";candidate.releaseApproval=null;const b=bundle();rewriteBundle(b,candidate);const w=workspace(),p=propose(w,b,candidate,pin);assert.throws(()=>apply(w,b,candidate,pin,p.planId),/Candidate release/);});
test("reviewed approved fixture is repeatable; stale plan is rejected",()=>{const approved=structuredClone(c);approved.brandReleaseVersion="0.1.1";approved.releaseStatus="approved";approved.releaseApproval={approvedBy:"TEST FIXTURE ONLY",reference:"test fixture, not real release approval"};const b=bundle();rewriteBundle(b,approved);const w=workspace(),p=propose(w,b,approved,pin);assert.throws(()=>apply(w,b,approved,pin,"wrong"),/Plan changed/);apply(w,b,approved,pin,p.planId);const next=JSON.parse(fs.readFileSync(path.join(w,"docs/brand-sync/pin.json")));const repeat=propose(w,b,approved,next);const before=fs.readFileSync(path.join(w,"docs/brand-sync/pin.json"));apply(w,b,approved,next,repeat.planId);assert.deepEqual(fs.readFileSync(path.join(w,"docs/brand-sync/pin.json")),before);});
test("framework compatibility is explicit; no network/build-time importer",()=>{checkCompatibility(c,pkg);const wrong=structuredClone(pkg);wrong.dependencies.next="0.0.0";assert.throws(()=>checkCompatibility(c,wrong),/Compatibility/);const config=fs.readFileSync("next.config.ts","utf8");assert.match(config,/output: "export"/);assert.doesNotMatch(config,/brand-sync|https?:/);assert.doesNotMatch(pkg.scripts.build,/brand|https?:/);});
test("Stage 06.1 baseline and approved Kyro migration retain verified hashes",()=>{
  const snapshot=JSON.parse(fs.readFileSync("docs/brand-sync/preflight-hashes.json","utf8"));
  const record=JSON.parse(fs.readFileSync("docs/brand-sync/kyro-migration-hashes.json","utf8"));
  assert.equal(snapshot.files.length,458);
  assert.equal(record.approvedBrandRelease,"0.1.0-identity.3");
  assert.equal(record.originalSnapshot,"docs/brand-sync/preflight-hashes.json");
  assert.equal(record.files.length,16);

  const historical=new Map(snapshot.files.map(f=>[f.path,f.sha256]));
  assert.equal(historical.size,snapshot.files.length);
  const migrated=new Map(record.files.map(f=>[f.path,f]));
  assert.equal(migrated.size,record.files.length);

  for(const entry of record.files){
    assert.equal(entry.beforeSha256,historical.get(entry.path),entry.path);
    assert.notEqual(entry.beforeSha256,entry.afterSha256,entry.path);
  }

  for(const entry of snapshot.files){
    const expected=migrated.has(entry.path)
      ? migrated.get(entry.path).afterSha256
      : entry.sha256;
    assert.equal(digest(fs.readFileSync(entry.path)),expected,entry.path);
  }
});
// Only disposable test directories are removed; no repository source is cleaned.
test.after(()=>{for(const p of temporary){const resolved=path.resolve(p);assert.equal(path.dirname(resolved),path.resolve(os.tmpdir()));assert.match(path.basename(resolved),/^kyro-brand-test-/);fs.rmSync(resolved,{recursive:true,force:true});}});
