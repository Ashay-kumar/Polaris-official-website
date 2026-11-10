import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
const base="/Polaris-official-website";
for(const route of ["","our-thinking/","home-leadership-kit/","help-shape-polaris/","about/"]){
  const html=fs.readFileSync("out/"+route+"index.html","utf8");
  assert.match(html,/noindex/);
  for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
    if(!url.startsWith("/"))continue;
    assert.ok(url.startsWith(base+"/"),"Unprefixed URL: "+url);
    const relative=decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]);
    let file=path.join("out",relative);if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,"index.html");
    assert.ok(fs.existsSync(file),"Missing asset: "+file);
  }
}
for(const asset of ["favicon.ico","icon.svg","apple-icon.png","downloads/polaris-home-leadership-kit.pdf"])assert.ok(fs.existsSync("out/"+asset),asset);
assert.equal(createHash("sha256").update(fs.readFileSync("out/downloads/polaris-home-leadership-kit.pdf")).digest("hex"),"0a39023cb7a555de06cee6abe39a0b10f0d14407b5d42e478b6c91f8c770bbf5");
assert.ok(!fs.existsSync("out/api"));
fs.writeFileSync("out/.nojekyll","");
console.log("Five exported routes, subpath HTML assets, favicon files and original PDF verified.");
