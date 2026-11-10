import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const base = "/Polaris-official-website";
const root = path.resolve("out");
const types = { ".html":"text/html", ".css":"text/css", ".js":"text/javascript", ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".ico":"image/x-icon", ".pdf":"application/pdf", ".woff2":"font/woff2", ".txt":"text/plain" };
const server = http.createServer((req,res)=>{
  const pathname = decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  if (pathname === base) {res.writeHead(308,{Location:base+"/"});res.end();return;}
  if (!pathname.startsWith(base+"/")) {res.writeHead(404);res.end();return;}
  let file = path.resolve(root, "."+pathname.slice(base.length));
  if (!file.startsWith(root+path.sep) && file!==root) {res.writeHead(403);res.end();return;}
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file=path.join(file,"index.html");
  if (!fs.existsSync(file)) {res.writeHead(404);res.end();return;}
  res.writeHead(200,{"Content-Type":types[path.extname(file)]??"application/octet-stream"});fs.createReadStream(file).pipe(res);
});
server.listen(Number(process.env.PORT??4173),"127.0.0.1",()=>console.log("Static Pages preview: http://127.0.0.1:4173"+base+"/"));
