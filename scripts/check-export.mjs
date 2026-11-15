import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { privateKitAssets } from "./private-kit-files.mjs";
for(const route of ["","our-thinking/","home-leadership-kit/","help-shape-polaris/","about/","privacy-policy/","cookie-policy/","terms-of-use/"]){
  const html=fs.readFileSync("out/"+route+"index.html","utf8");
  assert.match(html,/noindex/);
  assert.ok(!html.includes("/Polaris-official-website"), "Obsolete repository subpath in HTML");
  for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
    if(!url.startsWith("/"))continue;
    assert.ok(!url.startsWith("//"),"Unexpected external asset URL: "+url);
    const relative=decodeURIComponent(url.split(/[?#]/)[0]);
    let file=path.join("out",relative);if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,"index.html");
    assert.ok(fs.existsSync(file),"Missing asset: "+file);
  }
}
for(const asset of ["favicon.ico","icon.svg","apple-icon.png"])assert.ok(fs.existsSync("out/"+asset),asset);
for(const asset of privateKitAssets){
  assert.ok(!fs.existsSync(asset.from),"Private PDF remains under public/");
}
assert.match(fs.readFileSync("out/home-leadership-kit/index.html", "utf8"), /Kit requests are currently unavailable/);
assert.match(fs.readFileSync("out/help-shape-polaris/index.html", "utf8"), /Feedback submission is currently unavailable/);
assert.ok(!fs.existsSync("out/api"));
assert.ok(fs.existsSync("out/404.html"), "Cloudflare Pages must have a static 404 document");
assert.ok(fs.existsSync("out/_next/static"));
function inspect(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) inspect(file);
  else if (/\.pdf$/i.test(file)) assert.fail("PDF must not be in static export: "+file);
  else if (/\.(html|css|js)$/.test(file)) assert.ok(!fs.readFileSync(file, "utf8").includes("/Polaris-official-website"), "Obsolete subpath in " + file);
} }
inspect("out");
console.log("Eight exported routes, root-path assets and favicons verified; no PDF in static output; review forms disabled. Private bytes checked separately.");
