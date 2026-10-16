/* Ninjas de Kirigakure (Irmaos Demonios: Gozu e Meizu) em pixel art.
   O corpo e a geometria de cada pose do Naruto (que vem das do Sasuke) com outra paleta (roupa cinza-azulada ou verde-oliva escura);
   a cabeca e nova: bandana da Nevoa com a placa riscada, mascara de respiracao cobrindo nariz e boca com filtro e tubo, olhos fundos e cabelo escuro.
   Gozu: cabelo preto espetado, mascara redonda cinza-azulada. Meizu: cabelo castanho solto, mascara em bico, roupa verde-oliva. */
const DEMON_PAL={
 gozu:{O:'#59636f',Q:'#7b8794',q:'#3b434e',m:'#262b34',k:'#9aa4b0',
  N:'#2a3858',n:'#1b2540',v:'#445a86',W:'#aab4c0',A:'#8f9aa8',a:'#6f7a88',
  Y:'#26262e',y:'#16161c',x:'#0a0a10',X:'#575767',
  u:'#9aa8b4',w:'#6e7c88',z:'#3e4a56',F:'#c8d0d8',G:'#42505c',H:'#f2f5f8'},
 meizu:{O:'#5a5a3c',Q:'#7c7c52',q:'#3c3c28',m:'#26261a',k:'#9a9a6a',
  N:'#3a2a1c',n:'#241a10',v:'#5a4630',W:'#b0a888',A:'#968e70',a:'#746e56',
  Y:'#5a3a22',y:'#3a2414',x:'#22140a',X:'#8a6240',
  u:'#a8a080',w:'#7c7660',z:'#4a4632',F:'#d0c8a8',G:'#585238',H:'#f4f0e0'}};
function demonHeadRows(variant,mod){
 const base=sasHeadRows(mod),g=PixGrid(42,21),gozu=variant==='gozu';
 /* cabelo: aproveita os espetos do Sasuke (Gozu) ou deixa mais caido e comprido (Meizu) */
 const hair={'1':'x','2':'y','3':'Y','4':'X','5':'X'},skin={S:'S',s:'s',t:'t',o:'o'};
 for(let y=0;y<base.length;y++)for(let x=0;x<base[y].length;x++){const ch=base[y][x];if(ch==='.')continue;g.G[y][x]=hair[ch]||skin[ch]||ch;}
 if(!gozu){ /* Meizu: franja e madeixas caindo ao lado do rosto, sem espetos para tras */
  for(let y=0;y<g.h;y++)for(let x=0;x<8;x++)if(y<10)g.G[y][x]='.';
  g.poly([[9,9],[14,6],[18,8],[17,18],[13,20],[9,15]],'Y');g.line(11,10,11,19,'y',['Y']);g.line(14,8,14,18,'X',['Y']);
  g.poly([[28,7],[31,10],[31,17],[28,13]],'Y');g.line(29,9,30,15,'y',['Y']);}
 /* bandana de Kirigakure: faixa azul-marinho e placa de metal com o risco do desertor */
 g.poly([[11,8],[31,6.5],[31,10],[11,11.5]],'N');g.line(11,8,31,6.5,'v',['N']);g.line(11,11.5,31,10,'n',['N']);
 g.poly([[16,8.4],[24,7.6],[24,11],[16,12]],'F');g.line(16,8.4,24,7.6,'H',['F']);g.line(16,12,24,11,'u',['F']);g.line(17,11.2,23,8.4,'K',['F','H','u']);
 /* olhos fundos e frios: sobrancelhas pesadas e olheiras */
 if(!(mod&&mod.shut)){g.put(16,12,'KKKKK');g.put(24,12,'KKKKK');g.put(16,13,'sWEEK');g.put(24,13,'EEWKs');g.put(16,14,'wKKKw');g.put(24,14,'wKKKw');}
 /* mascara de respiracao cobrindo nariz e boca, com filtro e tubo */
 for(let y=15;y<=19;y++)for(let x=16;x<=30;x++){const ch=g.G[y][x];if(ch==='S'||ch==='s'||ch==='t'||ch==='o')g.G[y][x]=y===15?'F':y<=17?'u':'w';}
 g.line(17,15,29,15,'F',['u','w']);g.line(17,19,26,19,'z',['w']);
 if(gozu){g.ell(24,17,2.4,2.2,'G');g.put(23,16,'FF');g.put(23,17,'zz');g.put(23,18,'GG');}
 else{g.poly([[25,15],[31,17],[25,19]],'u');g.line(25,15,31,17,'F',['u']);g.line(25,19,31,17,'z',['u']);g.put(27,17,'GG');}
 g.line(16,17,13,18,'z',['.']);g.put(13,18,'zz');
 g.outline('K');
 return g.G;}
function demonHead(variant){return(g,ox,oy,mod)=>demonHeadRows(variant,mod).forEach((r,y)=>g.put(ox,y+oy,r.join('')));}
function demonHeadLying(variant){return(g,ox,oy,groundY,mod)=>{const rows=demonHeadRows(variant,mod),Wd=rows[0].length;
 for(let y=0;y<rows.length;y++)for(let x=0;x<Wd;x++){const ch=rows[y][x];if(ch==='.')continue;const nx=ox+y,ny=oy+(Wd-1-x);if(ny<=groundY)g.set(nx,ny,ch);}};}
const DEMON_SKIN={};for(const v of ['gozu','meizu'])DEMON_SKIN[v]={head:demonHead(v),lying:demonHeadLying(v),pal:Object.assign({},NAR_PAL,DEMON_PAL[v]),variant:v};
