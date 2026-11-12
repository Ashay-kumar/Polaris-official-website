import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {loadContract,validateBundle,contained,digest,json,checkCompatibility,fail} from "./brand-sync-core.mjs";
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
export function verifyPin(workspace, pin) {
  if(pin.schemaVersion!==1 || !pin.manifest || pin.manifestSha256!==digest(json(pin.manifest)))fail("Invalid pin");
  const seen=new Set();
  for(const f of pin.manifest.files){if(seen.has(f.destination.toLowerCase()))fail("Duplicate pin path");seen.add(f.destination.toLowerCase());const dest=contained(workspace,f.destination);if(!fs.existsSync(dest)||digest(fs.readFileSync(dest))!==f.sha256)fail("Local conflict: "+f.destination);}
  return pin;
}
export function propose(workspace,bundle,c,pin) {
  checkCompatibility(c,JSON.parse(fs.readFileSync(path.join(workspace,"package.json"))));
  const validated=validateBundle(bundle,c);
  if(pin)verifyPin(workspace,pin);
  const old=new Map((pin?.manifest.files??[]).map(f=>[f.destination,f]));
  if([...old.keys()].some(k=>!c.files.some(f=>f.destination===k)))fail("Removing managed paths requires a separately reviewed migration");
  if(pin && pin.manifest.brandReleaseVersion===c.brandReleaseVersion && pin.manifest.contractSha256!==validated.manifest.contractSha256)fail("Release version reused with different content");
  const changes=c.files.map(f=>{const dest=contained(workspace,f.destination);const before=fs.existsSync(dest)?digest(fs.readFileSync(dest)):null;if(!old.has(f.destination)&&before && before!==f.sha256)fail("Unmanaged destination conflict: "+f.destination);return {path:f.destination,before,after:f.sha256,action:before===f.sha256?"unchanged":before?"replace":"add"};});
  const diffs=changes.flatMap((f,i)=>{if(f.action==="unchanged")return [];const text=/\.(?:css|tsx?|json|txt)$/.test(f.path);return [{path:f.path,format:text?"before/after text":"binary hashes",...(text?{beforeText:f.before?fs.readFileSync(contained(workspace,f.path),"utf8"):null,afterText:validated.buffers[i].toString("utf8")}: {})}];});
  const plan={diffs,from:pin?.manifest.brandReleaseVersion??null,to:c.brandReleaseVersion,releaseStatus:c.releaseStatus,manifestSha256:digest(json(validated.manifest)),changes};
  return {...validated,plan,planId:digest(json(plan))};
}
export function apply(workspace,bundle,c,pin,reviewedId,{bootstrap=false}={}) {
  const p=propose(workspace,bundle,c,pin);
  if(reviewedId!==p.planId)fail("Plan changed; review again");
  if(c.releaseStatus!=="approved" && !(bootstrap&&!pin&&p.plan.changes.every(f=>f.action==="unchanged" || ["src/lib/brand/identity.json","docs/brand-sync/logos.json"].includes(f.path))))fail("Candidate release cannot update website foundations");
  const pinPath=contained(workspace,"docs/brand-sync/pin.json");
  const writes=p.plan.changes.map((f,i)=>({dest:contained(workspace,f.path),before:fs.existsSync(contained(workspace,f.path))?fs.readFileSync(contained(workspace,f.path)):null,after:p.buffers[i]})).filter((f)=>!f.before||digest(f.before)!==digest(f.after));
  const pinBytes=Buffer.from(json({schemaVersion:1,manifestSha256:p.plan.manifestSha256,manifest:p.manifest}));
  writes.push({dest:pinPath,before:fs.existsSync(pinPath)?fs.readFileSync(pinPath):null,after:pinBytes});
  // Snapshot all destinations before writes. Local tool: never use against concurrently edited files.
  const completed=[];
  try {for(const w of writes){fs.mkdirSync(path.dirname(w.dest),{recursive:true});fs.writeFileSync(w.dest,w.after);completed.push(w);}}
  catch(error){for(const w of completed.reverse()){if(w.before)fs.writeFileSync(w.dest,w.before);else fs.unlinkSync(w.dest);}throw error;}
  return p;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const args=process.argv.slice(2),mode=args.shift();const allowed=["--check","--plan","--apply","--bootstrap"];
  if(!allowed.includes(mode))fail("Usage: node scripts/brand-sync.mjs --check | --plan <bundle> | --apply <bundle> <plan-id> | --bootstrap <bundle> <plan-id>");
  const c=loadContract(path.join(root,"docs/brand-sync/contract.json"));
  const pp=path.join(root,"docs/brand-sync/pin.json");const pin=fs.existsSync(pp)?JSON.parse(fs.readFileSync(pp)):null;
  if(mode==="--check") {if(args.length||!pin)fail("Missing pin or unexpected arguments");verifyPin(root,pin);checkCompatibility(c,JSON.parse(fs.readFileSync(path.join(root,"package.json"))));if(pin.manifest.contractSha256!==digest(json(c)))fail("Pin differs from reviewed contract");const sizes=c.files.map(f=>fs.statSync(contained(root,f.destination)).size);const {manifestFor}=await import("./brand-sync-core.mjs");if(json(pin.manifest)!==json(manifestFor(c,sizes)))fail("Incomplete/inconsistent pin");console.log("Pinned brand integrity passed: "+c.files.length+" files; "+c.releaseStatus);}
  else {if(args.length!==(mode==="--plan"?1:2))fail("Unexpected arguments");const p=mode==="--plan"?propose(root,args[0],c,pin):apply(root,args[0],c,pin,args[1],{bootstrap:mode==="--bootstrap"});console.log(json({planId:p.planId,...p.plan}));}
}
