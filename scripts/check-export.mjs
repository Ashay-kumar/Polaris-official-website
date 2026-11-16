import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { privateKitAssets } from "./private-kit-files.mjs";
const origin = "https://kyrolearning.com";
const routes = ["","our-thinking/","home-leadership-kit/","help-shape-polaris/","about/","privacy-policy/","cookie-policy/","terms-of-use/"];
for(const route of routes){
  const html=fs.readFileSync("out/"+route+"index.html","utf8");
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, "Missing document head: /"+route);
  const robots = [...head.matchAll(/<meta\s+name="(?:robots|googlebot)"\s+content="([^"]*)"/g)];
  assert.ok(robots.length, "Missing indexing metadata: /"+route);
  for (const [, directives] of robots) {
    assert.ok(!/\b(noindex|nofollow|none)\b/i.test(directives), "Page blocks indexing: /"+route);
    assert.match(directives, /\bindex\b/);
    assert.match(directives, /\bfollow\b/);
  }
  const canonicals = [...head.matchAll(/<link\s+rel="canonical"\s+href="([^"]*)"/g)];
  assert.equal(canonicals.length, 1, "Expected one canonical: /"+route);
  assert.equal(canonicals[0][1], origin+"/"+route);
  assert.equal([...head.matchAll(/<title>/g)].length, 1, "Expected one title: /"+route);
  assert.ok(!html.includes("/Polaris-official-website"), "Obsolete repository subpath in HTML");
  for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
    if(!url.startsWith("/"))continue;
    assert.ok(!url.startsWith("//"),"Unexpected external asset URL: "+url);
    const relative=decodeURIComponent(url.split(/[?#]/)[0]);
    let file=path.join("out",relative);if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,"index.html");
    assert.ok(fs.existsSync(file),"Missing asset: "+file);
  }
}
const sitemap = fs.readFileSync("out/sitemap.xml", "utf8");
assert.match(sitemap, /<urlset\s+xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.deepEqual(sitemapUrls.sort(), routes.map(route => origin+"/"+route).sort(), "Sitemap must contain exactly eight public production URLs");
const robotsText = fs.readFileSync("out/robots.txt", "utf8");
assert.deepEqual(robotsText.trim().split(/\r?\n/).filter(Boolean), ["User-Agent: *", "Allow: /", "Sitemap: "+origin+"/sitemap.xml"]);
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
console.log("Eight indexable routes with unique titles and self-referencing canonicals, production sitemap/robots, root-path assets and favicons verified; no PDF in static output; review forms disabled. Private bytes checked separately.");
