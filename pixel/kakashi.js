/* Kakashi Hatake (Parte 1) no mesmo estilo dos sprites a mao do Sasuke.
   Corpo = geometria de cada pose do Sasuke; toda a pele (bracos, pernas, pescoco, maos) vira tecido azul-marinho (mangas e calca longas, luvas),
   o torso vira colete jounin verde. Cabeca nova: cabelo prateado espetado, bandana sobre o olho esquerdo, mascara cobrindo nariz e boca. */
const KAK_PAL=Object.assign({},SAS2_PAL,{
 C:'#53703d',c:'#3c5632',d:'#273a22',D:'#789a58',
 P:'#34456e',p:'#26345a',q:'#1a2442',
 f:'#40527e',g:'#2d3b62',h:'#1b2544',
 i:'#aab3c6',j:'#eef1f8',k:'#7a849c',l:'#4a5268',
 u:'#f6c9a0',w:'#de9c70',y:'#a86a4c',
 B:'#2d3b62',b:'#1a2442',M:'#c9d0e0',m:'#8c96b0',L:'#5c6684'});

let KAK_SHAR=false; /* gerando o quadro com o Sharingan descoberto */
function kakashiHeadRows(mod){
 const base=sasHeadRows(mod),g=PixGrid(42,21);
 const hair={'1':'l','2':'k','3':'i','4':'j','5':'j'},skin={S:'u',s:'w',t:'y',o:'y'};
 for(let y=0;y<base.length;y++)for(let x=0;x<base[y].length;x++){const ch=base[y][x];if(ch==='.')continue;g.G[y][x]=hair[ch]||skin[ch]||ch;}
 /* bandana: faixa azul-marinho na testa que desce e cobre o olho esquerdo (o de tras), com a placa de metal */
 if(KAK_SHAR){ /* bandana levantada: so a faixa na testa, olho esquerdo com o Sharingan e a cicatriz */
  g.poly([[11,7.5],[31,6],[31,9.5],[11,11]],'g');g.line(11,7.5,31,6,'f',['g']);g.line(11,11,31,9.5,'h',['g']);
  g.poly([[16,8],[23,7.4],[23,10.2],[16,10.8]],'M');g.line(16,8,23,7.4,'j',['M']);g.line(16,10.8,23,10.2,'m',['M']);
  g.put(16,12,'KKKKKK');g.put(16,13,'WRRKRW');g.put(16,14,'uRKRRu');g.put(17,15,'uuuu');g.put(19,11,'y');g.put(19,12,'y');g.put(20,13,'y');g.put(20,14,'y');g.put(20,15,'y');
 }else{
 g.poly([[11,8],[31,6.5],[31,10],[24,11.5],[22,16],[16,16],[15,12],[11,12]],'g');
 g.line(11,8,31,6.5,'f',['g']);g.line(15,12,16,16,'h',['g']);g.line(22,16,16,16,'h',['g']);g.line(24,11.5,31,10,'h',['g']);
 g.poly([[16,9],[23,8.5],[23,14],[16,14]],'M');g.line(16,9,23,8.5,'j',['M']);g.line(16,14,23,14,'m',['M']);g.line(23,9,23,14,'m',['M']);
 g.put(18,10,'mm');g.put(20,11,'m');g.put(18,12,'mm');g.put(20,10,'m');}
 /* olho direito (o da frente): meio fechado, preguicoso */
 if(!(mod&&mod.shut)){g.put(24,12,'KKKKK');g.put(24,13,'WEEKW');g.put(24,14,'uKKKu');}
 /* mascara: cobre nariz, boca e queixo, com a ponta do nariz marcada */
 for(let y=15;y<=19;y++)for(let x=16;x<=30;x++){const ch=g.G[y][x];if(ch==='u')g.G[y][x]='g';else if(ch==='w')g.G[y][x]='h';else if(ch==='y')g.G[y][x]='h';}
 g.line(17,15,29,15,'f',['g','h']);g.put(25,16,'f');g.put(26,17,'f');g.line(19,18,26,18,'h',['g']);
 g.outline('K');
 return g.G;}

let KAK_LAST=null; /* ultima cabeca desenhada (para desfazer olhos de Sharingan que as poses do Sasuke pintam por cima) */
function kakashiHead(g,ox,oy,mod){const rows=kakashiHeadRows(mod);KAK_LAST={ox,oy,rows};rows.forEach((r,y)=>g.put(ox,y+oy,r.join('')));}
function kakashiHeadLying(g,ox,oy,groundY,mod){const rows=kakashiHeadRows(mod),Wd=rows[0].length;
 for(let y=0;y<rows.length;y++)for(let x=0;x<Wd;x++){const ch=rows[y][x];if(ch==='.')continue;const nx=ox+y,ny=oy+(Wd-1-x);if(ny<=groundY)g.set(nx,ny,ch);}}
/* gera a pose do Sasuke e troca a pele do corpo por tecido (a cabeca usa chaves proprias, entao nao e afetada) */
function kakashiFrom(fn,shar){return()=>{KAK_SHAR=!!shar;KAK_LAST=null;HEADHOOK={head:kakashiHead,lying:kakashiHeadLying};let g;try{g=fn();}finally{HEADHOOK=null;KAK_SHAR=false;}
 /* so o olho esquerdo (coberto pela bandana) tem Sharingan: apaga os pixels vermelhos que algumas poses do Sasuke pintam nos olhos */
 if(KAK_LAST){const {ox,oy,rows}=KAK_LAST;for(let y=0;y<rows.length;y++)for(let x=0;x<rows[y].length;x++){const gy=y+oy,gx=x+ox;if(gy<g.h&&gx<g.w&&g.G[gy][gx]==='R'&&rows[y][x]!=='R'&&rows[y][x]!=='.')g.G[gy][gx]=rows[y][x];}}
 const m={S:'f',s:'g',t:'h',o:'h',A:'i',a:'k',r:'l'};
 for(let y=0;y<g.h;y++)for(let x=0;x<g.w;x++){const c=m[g.G[y][x]];if(c)g.G[y][x]=c;}
 return g;};}
