// Source of truth for archived essays stays in the desktop index.html.
import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';
const source=fs.readFileSync('index.html','utf8');
const block=source.match(/<script>\s*(const studySchedule[\s\S]*?)const keys/);
if(!block)throw Error('Archived data block was not found; refusing to overwrite mobile data.');
const context=vm.createContext({});vm.runInContext(block[1]+';globalThis.output={records,studySchedule}',context,{timeout:1000});
fs.writeFileSync('mobile/data.json',JSON.stringify(context.output,null,2)+'\n');
const files=Object.fromEntries(['index.html','app.js','style.css','data.json'].map(n=>[n,crypto.createHash('sha256').update(fs.readFileSync('mobile/'+n)).digest('hex')]));
const bundle=crypto.createHash('sha256').update(JSON.stringify(files)).digest('hex');
fs.writeFileSync('mobile/version.json',JSON.stringify({version:'1.0.0',bundle,minNativeVersion:1,apkVersionCode:1,apkUrl:'',files},null,2)+'\n');
console.log('Mobile data and verified update manifest generated.');
