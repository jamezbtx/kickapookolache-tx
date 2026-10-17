const fs=require('fs'),path=require('path');const pub='/workspace/kickapookolache/public';
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):e.name.endsWith('.html')?[path.join(d,e.name)]:[])}
let bad=0,n=0;
for(const f of walk(pub)){const s=fs.readFileSync(f,'utf8');
 for(const m of s.matchAll(/(?:href|src)="([^"]+)"/g)){let u=m[1];
  if(/^(https?:|mailto:|tel:|#|data:|javascript:|\/\/)/.test(u))continue;
  u=u.split('#')[0].split('?')[0]; if(!u)continue; n++;
  const t=u.startsWith('/')?path.join(pub,u):path.resolve(path.dirname(f),u);
  if(!fs.existsSync(t)||(fs.statSync(t).isDirectory()&&!fs.existsSync(path.join(t,'index.html')))){bad++;console.log('BROKEN',path.relative(pub,f),'->',m[1]);}}}
console.log(`checked ${n} internal refs, ${bad} broken`);
