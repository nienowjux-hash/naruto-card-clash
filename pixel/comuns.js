/* Inimigos comuns do caminho ate o Pais das Ondas.
   Bandido e Ninja Renegado: mesmas poses do Naruto (como os Irmaos Demonios), outra cabeca e paleta.
   O Lobo nao e humano: SPRE.lobo (js/03-sprites.js) troca o corpo inteiro por sprites do lobo (pixel/ninken.js). */
const COMMON_PAL={
 bandido:{O:'#7a5a36',Q:'#9c7648',q:'#4e3820',m:'#2c1e10',k:'#c49a64',
  N:'#6a1e1e',n:'#42100f',v:'#9a3030',W:'#b8a888',A:'#a89878',a:'#807458',
  Y:'#3a2410',y:'#22140a',x:'#120a04',X:'#5a3a1c',
  u:'#b02828',w:'#7a1818',z:'#4a0e0e',F:'#d84a3a',G:'#5c1414',H:'#f08070'},
 renegado:{O:'#4a5846',Q:'#6a7a64',q:'#2c3828',m:'#182018',k:'#8c9c84',
  N:'#2a2a34',n:'#18181e',v:'#46465a',W:'#a8aca0',A:'#8c9084',a:'#6a6e62',
  Y:'#c8c8d0',y:'#8c8c98',x:'#585866',X:'#e8e8f0',
  u:'#9c9ca8',w:'#6c6c78',z:'#3e3e48',F:'#c8ccd4',G:'#3a3a44',H:'#f2f4f8'}};
function commonHeadRows(variant,mod){
 const base=sasHeadRows(mod),g=PixGrid(42,21),band=variant==='bandido';
 const hair=band?{'1':'x','2':'y','3':'Y','4':'X','5':'X'}:{'1':'x','2':'y','3':'Y','4':'X','5':'X'},skin={S:'S',s:'s',t:'t',o:'o'};
 for(let y=0;y<base.length;y++)for(let x=0;x<base[y].length;x++){const ch=base[y][x];if(ch==='.')continue;g.G[y][x]=hair[ch]||skin[ch]||ch;}
 if(band){ /* cabelo desgrenhado e um pano vermelho amarrado cobrindo nariz e boca; cicatriz no rosto */
  g.poly([[11,7],[31,6],[31,9],[11,10]],'N');g.line(11,7,31,6,'v',['N']);g.line(11,10,31,9,'n',['N']);g.put(10,9,'NN');g.put(8,10,'nv');g.put(8,11,'N');
  if(!(mod&&mod.shut)){g.put(16,12,'KKKKK');g.put(24,12,'KKKKK');g.put(16,13,'sWEEK');g.put(24,13,'EEWKs');}
  g.line(18,11,22,14,'t',['S','s']);
  for(let y=15;y<=19;y++)for(let x=16;x<=30;x++){const ch=g.G[y][x];if(ch==='S'||ch==='s'||ch==='t'||ch==='o')g.G[y][x]=y===15?'F':y<=17?'u':'w';}
  g.line(17,15,29,15,'H',['F','u']);g.line(17,19,27,19,'z',['w']);g.put(13,17,'uu');g.put(12,18,'uw');g.put(11,19,'w');
 }else{ /* bandana de ninja desertor com o risco, sem mascara, barba rala */
  g.poly([[11,8],[31,6.5],[31,10],[11,11.5]],'N');g.line(11,8,31,6.5,'v',['N']);g.line(11,11.5,31,10,'n',['N']);
  g.poly([[16,8.4],[24,7.6],[24,11],[16,12]],'F');g.line(16,8.4,24,7.6,'H',['F']);g.line(16,12,24,11,'u',['F']);g.line(17,11.2,23,8.4,'K',['F','H','u']);
  if(!(mod&&mod.shut)){g.put(16,12,'KKKKK');g.put(24,12,'KKKKK');g.put(16,13,'sWEEK');g.put(24,13,'EEWKs');}
  for(let y=17;y<=19;y++)for(let x=18;x<=29;x++){const ch=g.G[y][x];if((ch==='S'||ch==='s')&&((x*7+y*3)%3===0))g.G[y][x]='t';}
 }
 g.outline('K');
 return g.G;}
function commonHead(variant){return(g,ox,oy,mod)=>commonHeadRows(variant,mod).forEach((r,y)=>g.put(ox,y+oy,r.join('')));}
function commonHeadLying(variant){return(g,ox,oy,groundY,mod)=>{const rows=commonHeadRows(variant,mod),Wd=rows[0].length;
 for(let y=0;y<rows.length;y++)for(let x=0;x<Wd;x++){const ch=rows[y][x];if(ch==='.')continue;const nx=ox+y,ny=oy+(Wd-1-x);if(ny<=groundY)g.set(nx,ny,ch);}};}
const COMMON_SKIN={};for(const v of ['bandido','renegado']){COMMON_SKIN[v]={head:commonHead(v),lying:commonHeadLying(v),pal:Object.assign({},NAR_PAL,COMMON_PAL[v]),variant:v};}
