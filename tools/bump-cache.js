/* Troca o ?v= de todos os scripts e do CSS do naruto-demo.html por um carimbo novo (evita cache velho no GitHub Pages).
   Rode antes de cada commit/push:  node tools/bump-cache.js */
const fs=require('fs'),p='naruto-demo.html',v=Date.now().toString(36);
let s=fs.readFileSync(p,'utf8');
s=s.replace(/((?:src|href)="(?:js\/|pixel\/)?[\w\-\/]+\.(?:js|css))(?:\?v=\w+)?"/g,'$1?v='+v+'"');
fs.writeFileSync(p,s);console.log('versao',v);
