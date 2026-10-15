const http=require('http'),fs=require('fs'),path=require('path');
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.json':'application/json'};
http.createServer((q,s)=>{
 let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/naruto-demo.html';
 const f=path.join(__dirname,path.normalize(p));
 if(!f.startsWith(__dirname)){s.writeHead(403);s.end();return;}
 fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end('nao encontrado');return;}s.writeHead(200,{'Cache-Control':'no-store','Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});s.end(d)})}).listen(8123);
