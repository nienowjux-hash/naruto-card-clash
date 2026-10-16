/* Naruto em pixel art, no mesmo formato do Sasuke (grade 56x80, olhando para a direita).
   Cabeca desenhada pixel a pixel (3/4, mesmo tamanho e posicao da do Sasuke). O corpo usa a mesma geometria de cada pose
   do Sasuke, trocando a roupa: casaco laranja de gola azul alta, calca laranja com dobras e atadura branca na canela. */
const NAR_PAL=Object.assign({},SAS2_PAL,{
 Y:'#ffd93a',y:'#e9a91d',x:'#a8700f',X:'#fff6b0',
 O:'#f58a18',Q:'#ffb347',q:'#cf620e',m:'#8a380a',k:'#ffd27a',
 B:'#2f48aa',b:'#1a2a70',j:'#6a86e0',M:'#eef1f8',L:'#7c86a8',
 N:'#2e4ab0',n:'#1b2b72',v:'#5a78d8',
 W:'#ffffff',E:'#16102a',e:'#2c6ee8'});
const NAR_DARK=Object.assign({},SAS_DARK,{Y:'x',y:'x',X:'y',x:'x',O:'q',Q:'O',q:'m',m:'m',B:'b',j:'B'});

/* ---------------- cabeca, linha por linha ---------------- */
/* (ox,oy): mesmo canto usado pela cabeca do Sasuke. Rosto em x 20..34 / y 10..21, bandana em y 7..9. */
function naruHead(g,ox,oy,mod){
 const T=pts=>pts.map(p=>[p[0]+ox,p[1]+oy]),P=(x,y,s)=>g.put(x+ox,y+oy,s),L=(a,b,c,d,k,o)=>g.line(a+ox,b+oy,c+ox,d+oy,k,o);
 /* cabelo: espetos de tras (esquerda) e do alto, cada um com 3 tons */
 g.poly(T([[10,9],[11,4],[17,1],[26,0],[32,3],[35,8],[35,10]]),'Y');
 g.poly(T([[9,10],[22,9],[22,17],[19,20],[13,19],[9,15]]),'Y');
 for(const s of [[[11,6],[3,2],[13,9]],[[10,9],[0,8],[11,11]],[[9,12],[0,15],[10,15]],[[15,3],[13,-4],[19,2]],[[19,2],[20,-5],[25,1]],[[24,1],[29,-4],[30,3]],[[29,3],[36,-1],[34,8]]])g.poly(T(s),'Y');
 g.shade(T([[0,5],[24,5],[24,16],[0,16]]),['Y'],'y');g.shade(T([[0,10],[11,10],[11,16],[0,16]]),['y'],'x');
 g.shade(T([[13,-5],[17,-5],[17,3],[14,3]]),['Y','y'],'X');g.shade(T([[21,-6],[24,-6],[24,1],[21,1]]),['Y','y'],'X');g.shade(T([[28,-5],[31,-5],[31,3],[29,3]]),['Y'],'X');g.shade(T([[32,0],[36,0],[35,6],[32,6]]),['Y'],'X');
 L(16,2,15,-2,'y',['Y','X']);L(22,1,22,-3,'y',['Y','X']);L(27,2,27,-2,'y',['Y','X']);L(31,3,34,0,'y',['Y','X']);
 L(11,6,4,3,'x',['y','Y']);L(11,10,3,10,'x',['y','Y']);L(10,13,4,14,'x',['y']);L(19,3,19,6,'x',['y']);L(26,3,26,6,'x',['y']);
 P(14,-2,'X');P(21,-3,'X');P(28,-2,'X');P(35,0,'X');P(3,2,'X');
 /* orelha */
 P(19,13,'sSs');P(19,14,'ssS');P(19,15,'sSs');P(20,16,'ts');
 /* rosto: 3/4 para a direita */
 g.poly(T([[21,10],[33,10],[35,14],[34,18],[31,21],[25,21],[22,18],[20,14]]),'S');
 g.shade(T([[20,10],[24,10],[24,22],[20,22]]),['S'],'s');g.shade(T([[22,18],[32,18],[30,22],[25,22]]),['S'],'s');
 g.shade(T([[20,13],[22,13],[22,19],[20,19]]),['s'],'t');
 /* bandana: faixa azul, placa de metal, nos pontas */
 g.poly(T([[9,6.5],[36,5.8],[36,10],[9,10.8]]),'B');g.shade(T([[9,9],[36,8.4],[36,10.2],[9,11]]),['B'],'b');L(10,7.4,35,6.8,'j',['B']);
 g.poly(T([[22,6.6],[31,6.3],[31.4,10.3],[22.4,10.6]]),'M');g.edge(T([[22,6.6],[31,6.3],[31.4,10.3],[22.4,10.6]]),'L');g.shade(T([[22,9.4],[31,9],[31,10.2],[22,10.5]]),['M'],'L');
 P(25,8,'L');P(26,7,'LL');P(28,8,'L');P(27,9,'L');
 P(8,9,'bB');P(5,10,'bBBBb');P(4,11,'bBBb');P(3,13,'bBb');P(3,15,'bB');P(5,17,'b');P(8,11,'bB');
 /* franja: duas mechas finas caindo ao lado da bandana */
 g.poly(T([[21,10],[24,10],[22,15]]),'Y');g.poly(T([[31,10],[34,10],[33,14]]),'Y');L(22,10,22,13,'y',['Y']);P(33,11,'X');
 /* sobrancelhas e olhos */
 const shut=mod&&mod.shut;
 if(shut){L(23,14,26,15,'K');L(29,15,33,14,'K');L(23,12,26,12,'x',['S','s']);L(29,12,33,12,'x',['S','s']);}
 else{L(23,12,26,12,'x',['S','s']);L(29,12,33,12,'x',['S','s']);
  L(23,13,26,13,'K');L(29,13,33,13,'K');P(23,14,'WeEe');P(29,14,'WeEeW');P(24,15,'ee');P(30,15,'eee');P(23,16,'ss');P(30,16,'sss');}
 /* nariz */
 P(34,16,'s');P(34,17,'t');P(33,17,'s');
 /* bigodes: 3 riscos na bochecha da frente e 2 na de tras */
 L(29,17,33,16,'t',['S','s']);L(29,19,33,19,'t',['S','s']);L(30,21,33,20,'t',['S','s']);
 L(21,17,23,17,'t',['S','s']);L(21,19,23,19,'t',['S','s']);
 /* boca */
 if(mod&&mod.mouth){L(27,19,31,19,'K');L(27,20,31,20,'K');P(28,20,'WW');P(28,21,'oooo');}
 else{L(27,19,31,18,'K');P(26,18,'o');P(32,18,'o');P(28,20,'WWW');P(29,21,'ss');}
 /* queixo e pescoco */
 L(25,22,30,22,'t',['S','s']);
}
/* cabeca deitada (rosto para cima) */
function naruHeadLying(g,ox,oy,groundY,mod){
 const tmp=PixGrid(44,34);naruHead(tmp,0,6,mod);const rows=tmp.G,Wd=44;
 for(let y=0;y<rows.length;y++)for(let x=0;x<Wd;x++){const ch=rows[y][x];if(ch==='.')continue;const nx=ox+y-6,ny=oy+(Wd-1-x);if(ny<=groundY)g.set(nx,ny,ch);}}

/* ---------------- roupa: recolorir o corpo da pose do Sasuke ---------------- */
let HEADHOOK=null;
function naruDress(g,r){
 const jack={C:'O',c:'q',d:'m',D:'Q'},pant={P:'O',p:'q',q:'m'};
 const skin={S:'O',s:'q',t:'m'};
 for(let y=0;y<g.h;y++)for(let x=0;x<g.w;x++){const ch=g.G[y][x];if(ch==='.')continue;
  if(jack[ch]!==undefined){
   if(r.collar(x,y)){g.G[y][x]={C:'N',c:'n',d:'n',D:'v'}[ch];}else g.G[y][x]=jack[ch];continue;}
  if(pant[ch]!==undefined){g.G[y][x]=pant[ch];continue;}
  if(skin[ch]!==undefined&&r.cover(x,y)){g.G[y][x]=skin[ch];continue;}
  if((ch==='A'||ch==='a'||ch==='r')&&r.armWrap(x,y)){g.G[y][x]={A:'O',a:'q',r:'m'}[ch];}
 }
 for(const f of r.folds||[])g.line(f[0],f[1],f[2],f[3],f[4]||'m',['O','q','Q']);
 return g;}
function naruFrom(fn,rules){return()=>{HEADHOOK={head:naruHead,lying:naruHeadLying};let g;try{g=fn();}finally{HEADHOOK=null;}
 naruDress(g,rules);g.outline('K');g.selout('K',NAR_DARK);return g;};}
/* so as faixas dos antebracos viram manga; a atadura da canela (y>=64, x>=36 ou x<=16) continua branca */
const NAR_STD={collar:(x,y)=>y>=24&&y<=33&&x>=22&&x<=42,cover:(x,y)=>y>=49&&y<=69,armWrap:(x,y)=>y<60,
 folds:[[20,57,16,61,'m'],[14,62,12,66,'m'],[41,58,43,62,'m'],[40,50,36,53,'q'],[17,52,14,56,'m']]};
const naruGuard=naruFrom(sasukeGuard,NAR_STD);
const naruPunch=naruFrom(sasukePunch,Object.assign({},NAR_STD,{folds:[[24,52,20,57,'m'],[14,62,10,67,'m'],[41,58,44,62,'m']]}));
const naruHit=naruFrom(sasukeHit,Object.assign({},NAR_STD,{folds:[[22,52,18,57,'m'],[36,52,38,57,'m']]}));
const naruKick=naruFrom(sasukeKick,Object.assign({},NAR_STD,{cover:(x,y)=>y>=48||(y>=42&&x>=30&&x<=47)}));
const naruSeal=naruFrom(sasukeSeal,NAR_STD);
const naruBlock=naruFrom(sasukeBlock,NAR_STD);
const naruDown=naruFrom(sasukeDown,{collar:(x,y)=>x<=24&&y>=33&&y<=44,cover:(x,y)=>x>=44&&y>=22,armWrap:(x,y)=>true,folds:[[52,32,50,38,'m']]});
