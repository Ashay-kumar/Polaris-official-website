import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
for(const route of ["","our-thinking/","home-leadership-kit/","help-shape-polaris/","about/"]){
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
for(const asset of ["favicon.ico","icon.svg","apple-icon.png","downloads/polaris-home-leadership-kit.pdf"])assert.ok(fs.existsSync("out/"+asset),asset);
assert.equal(createHash("sha256").update(fs.readFileSync("out/downloads/polaris-home-leadership-kit.pdf")).digest("hex"),"0a39023cb7a555de06cee6abe39a0b10f0d14407b5d42e478b6c91f8c770bbf5");
assert.ok(!fs.existsSync("out/api"));
assert.ok(fs.existsSync("out/404.html"), "Cloudflare Pages must have a static 404 document");
assert.ok(fs.existsSync("out/_next/static"));
function inspect(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) inspect(file);
  else if (/\.(html|css|js)$/.test(file)) assert.ok(!fs.readFileSync(file, "utf8").includes("/Polaris-official-website"), "Obsolete subpath in " + file);
} }
inspect("out");
console.log("Five exported routes, root-path HTML assets, favicon files and original PDF verified.");
