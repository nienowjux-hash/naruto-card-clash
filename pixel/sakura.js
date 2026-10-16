/* Sakura Haruno (Parte 1, Genin) no mesmo estilo dos sprites a mao do Sasuke.
   O corpo e a geometria de cada pose do Sasuke (so a paleta muda: qipao vermelho, shorts verdes); a cabeca e nova:
   cabelo rosa em corte chanel, fita vermelha na testa com laco atras e olhos verdes. */
const SAK_PAL=Object.assign({},SAS2_PAL,{
 C:'#d8343a',c:'#b02430',d:'#7c1626',D:'#f86a58',
 P:'#4a9a5a',p:'#37774a',q:'#235030',
 i:'#6e2446',h:'#a8426a',H:'#e0709c',J:'#ff9fc0',j:'#ffd6e4',
 g:'#46d072',k:'#17603a',
 U:'#d8142a',u:'#8e0c1c',V:'#ff6a58'});

function sakuraHeadRows(mod){
 const base=sasHeadRows(mod),g=PixGrid(42,21),W=42;
 /* cabelo: calota arredondada + chanel caindo atras ate o queixo */
 g.ell(21,8,12.5,8.2,'H');
 g.poly([[9,9],[13,5],[17,9],[17,18],[12,19],[8,16]],'H');
 g.poly([[8,12],[12,10],[15,11],[15,18],[10,19]],'h');
 /* luz vindo de cima/direita: mechas claras e sombra embaixo/atras */
 g.shade([[8,16],[17,16],[17,20],[8,20]],['H','h'],'i');
 g.line(24,2,28,4,'J',['H']);g.line(19,2,23,2,'J',['H']);g.line(27,5,29,7,'J',['H']);g.put(22,1,'jj');g.put(25,3,'j');
 g.line(14,5,12,9,'h',['H']);g.line(16,3,13,6,'h',['H']);
 g.line(13,11,12,17,'i',['h','H']);g.line(11,12,10,16,'i',['h']);
 /* rosto: tudo que e pele do Sasuke (a partir da coluna 15, abaixo da testa) */
 for(let y=10;y<base.length;y++)for(let x=15;x<W;x++){const ch=base[y][x];if(ch!=='.'&&'SstoKWEe'.includes(ch))g.G[y][x]=ch;}
 /* olho verde grande com cilios */
 if(!(mod&&mod.shut)){
  g.put(16,12,'sKKKKSSSKKKKS');g.put(16,13,'sWkgWSSSWgkWS');g.put(16,14,'SKgkKSSSKkgKS');}
 /* franja repartida caindo nos dois lados da testa */
 g.poly([[15,8],[19,10],[17,15],[15,17]],'H');g.line(16,10,16,15,'h',['H']);g.put(15,16,'h');
 g.poly([[27,9],[31,8],[30,13],[28,12]],'H');g.line(29,9,30,12,'J',['H']);g.put(28,11,'h');
 /* fita vermelha na testa e laco atras */
 g.poly([[10,8],[31,7],[31,10],[10,11]],'U');g.line(10,8,31,7,'V',['U']);g.line(10,11,31,10,'u',['U']);
 g.poly([[5,6],[11,9],[7,11]],'U');g.poly([[5,13],[11,10],[8,9]],'U');g.put(9,9,'uu');g.put(10,10,'u');
 g.line(5,6,10,9,'V',['U']);g.line(5,13,9,10,'u',['U']);
 g.outline('K');
 return g.G;}

function sakuraHead(g,ox,oy,mod){sakuraHeadRows(mod).forEach((r,y)=>g.put(ox,y+oy,r.join('')));}
function sakuraHeadLying(g,ox,oy,groundY,mod){const rows=sakuraHeadRows(mod),Wd=rows[0].length;
 for(let y=0;y<rows.length;y++)for(let x=0;x<Wd;x++){const ch=rows[y][x];if(ch==='.')continue;const nx=ox+y,ny=oy+(Wd-1-x);if(ny<=groundY)g.set(nx,ny,ch);}}
function sakuraFrom(fn){return()=>{HEADHOOK={head:sakuraHead,lying:sakuraHeadLying};let g;try{g=fn();}finally{HEADHOOK=null;}return g;};}
