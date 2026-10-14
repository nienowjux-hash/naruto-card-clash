const http=require('http'),fs=require('fs');
http.createServer((q,s)=>{fs.readFile(__dirname+'/naruto-demo.html',(e,d)=>{s.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});s.end(d)})}).listen(8123);
