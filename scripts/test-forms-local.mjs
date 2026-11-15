// Isolated synthetic harness: never changes application configuration or uses private files.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import {randomUUID} from 'node:crypto';
import {spawn, spawnSync} from 'node:child_process';
const cwd=process.cwd(), root=fs.mkdtempSync(path.join(os.tmpdir(),'kyro-forms-test-'));
for(const name of ['src','public'])fs.cpSync(name,path.join(root,name),{recursive:true});
for(const name of ['package.json','tsconfig.json'])fs.copyFileSync(name,path.join(root,name));
fs.symlinkSync(path.join(cwd,'node_modules'),path.join(root,'node_modules'),process.platform==='win32'?'junction':'dir');
fs.writeFileSync(path.join(root,'next.config.ts'),JSON.stringify({output:'export',trailingSlash:true,images:{unoptimized:true},env:{NEXT_PUBLIC_FORM_SUBMISSIONS_ENABLED:'true',NEXT_PUBLIC_TURNSTILE_SITE_KEY:'synthetic-test-only',NEXT_PUBLIC_FORMS_API_BASE_URL:''}}).replace(/^/,'export default '));
const port=await new Promise((resolve,reject)=>{const socket=net.createServer();socket.on('error',reject);socket.listen(0,'localhost',()=>{const port=socket.address().port;socket.close(()=>resolve(port));});}),url='http://localhost:'+port;
const marker=randomUUID();fs.writeFileSync(path.join(root,'public/__synthetic-harness.txt'),marker);
const server=spawn(process.execPath,[path.join(cwd,'node_modules/next/dist/bin/next'),'dev',root,'--webpack','--hostname','localhost','-p',String(port)],{stdio:'ignore',cwd:root});
let exit=1;
try{
 let ready=false;for(let i=0;i<90;i++){if(server.exitCode!==null)throw Error('Isolated server exited');try{const r=await fetch(url+'/__synthetic-harness.txt');const text=await r.text();if(r.ok&&text===marker){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,1000));}if(!ready)throw Error('Isolated server did not start');
 const args=process.argv.slice(2);const run=spawn(process.execPath,[path.join(cwd,'node_modules/@playwright/test/cli.js'),'test',...(args.length?args:['tests/e2e/form-submission.spec.ts'])],{stdio:'inherit',env:{...process.env,POLARIS_TEST_URL:url,KYRO_STAGE06B_MOCKS:'true'}});
 exit=await new Promise(resolve=>run.on('exit',code=>resolve(code??1)));
}finally{if(process.platform==='win32')spawnSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore'});else server.kill();console.log('Synthetic harness stopped. Temporary copy: '+root);}
process.exitCode=exit;
