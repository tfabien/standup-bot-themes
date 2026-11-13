import {readdir,readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.argv[2]??'.');
const roles=['lead','general','explore','plan','review','test','code','generic'];
const pattern=/^(lead|general|explore|plan|review|test|code|generic)(?:-([2-9]|[1-9][0-9]))?(?:-blink)?\.(png|webp|gif|jpg|svg)$/;
const fail=[];let count=0;
for(const entry of await readdir(root,{withFileTypes:true})){
 if(!entry.isDirectory()||entry.name==='tools'||entry.name.startsWith('.'))continue;
 const dir=path.join(root,entry.name);const jsonPath=path.join(dir,'theme.json');let d;
 try{const s=await stat(jsonPath);if(s.size>256*1024)throw Error('theme.json too large');d=JSON.parse(await readFile(jsonPath,'utf8'));}catch(e){fail.push(`${entry.name}: ${e.message}`);continue;}
 count++;const error=m=>fail.push(`${entry.name}: ${m}`);
 if(!/^[a-z0-9-]{1,32}$/.test(entry.name)||d.name!==entry.name)error('invalid/mismatched name');
 if(!d.label||typeof d.label!=='string')error('missing label');
 if(typeof d.description!=='string'||d.description.length>200||!d.description)error('invalid description');
 if(!Array.isArray(d.keywords)||d.keywords.length<3||d.keywords.length>8||d.keywords.some(k=>typeof k!=='string'||!/^[a-z0-9-]{1,24}$/.test(k)))error('invalid keywords');
 if(typeof d.author!=='string'||!d.author)error('missing author');
 if(!/^\d+(?:\.\d+)+$/.test(d.version??''))error('invalid version');
 if('iconPack'in d)error('iconPack forbidden');
 if(!d.colors||typeof d.colors!=='object'||Array.isArray(d.colors))error('invalid colors');
 let bytes=0,files=0;const found=new Set();
 async function scan(base,isIcons){for(const ent of await readdir(base,{withFileTypes:true})){const f=path.join(base,ent.name);if(!ent.isFile()){if(!isIcons&&ent.name==='icons')continue;error(`unexpected directory ${f}`);continue;}const s=await stat(f);bytes+=s.size;files++;
 if(isIcons){const m=pattern.exec(ent.name);if(!m){error(`invalid icon filename ${ent.name}`);continue;}found.add(m[1]);if(ent.name.endsWith('.svg')&&s.size>256*1024)error(`SVG too large ${ent.name}`);if(!ent.name.endsWith('.svg')&&s.size>1024*1024)error(`raster too large ${ent.name}`);}
 else if(/^preview\.(png|webp|gif|jpg)$/.test(ent.name)&&s.size>1024*1024)error('preview too large');
 else if(!['theme.json'].includes(ent.name)&&!/^preview\.(png|webp|gif|jpg)$/.test(ent.name))error(`unexpected file ${ent.name}`);
 }}
 try{await scan(dir,false);await scan(path.join(dir,'icons'),true);}catch(e){error(e.message);}
 for(const role of roles)if(!found.has(role))error(`missing ${role}`);
 if(files>100)error('more than 100 files');if(bytes>20*1024*1024)error('over 20MB');
}
if(count===0)fail.push('no themes');
if(fail.length){for(const f of fail)console.error('FAIL',f);process.exitCode=1;}else console.log(`PASS ${count} marketplace themes`);
