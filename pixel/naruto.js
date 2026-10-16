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
/* Rosto DE FRENTE e simetrico, centro em x=27 (igual ao centro do rosto do Sasuke). (ox,oy) = mesmo canto da cabeca do Sasuke.
   Queixo em y=20, bandana em y=4..7, olhos em y=11..13, boca em y=17..19. */
function naruHead(g,ox,oy,mod){
 const T=pts=>pts.map(p=>[p[0]+ox,p[1]+oy]),P=(x,y,s)=>g.put(x+ox,y+oy,s),L=(a,b,c,d,k,o)=>g.line(a+ox,b+oy,c+ox,d+oy,k,o);
 /* --- cabelo: massa + 5 espetos em cima + 2 espetos para tras --- */
 g.poly(T([[15,6],[17,0],[27,-2],[37,0],[39,6],[39,9],[15,9]]),'Y');
 for(const s of [[[15,4],[12,-1],[20,1]],[[19,0],[21,-4],[26,0]],[[25,-1],[28,-5],[31,-1]],[[30,0],[34,-4],[35,1]],[[34,2],[41,-1],[39,5]],
                 [[16,5],[8,3],[16,9]],[[15,8],[6,10],[15,12]],[[15,11],[7,16],[16,14]]])g.poly(T(s),'Y');
 g.shade(T([[5,-8],[27,-8],[27,18],[5,18]]),['Y'],'y');g.shade(T([[5,8],[16,8],[16,18],[5,18]]),['y'],'x');
 g.shade(T([[21,-5],[24,-5],[23,0],[21,0]]),['Y','y'],'X');g.shade(T([[26,-6],[30,-6],[29,-1],[27,-1]]),['Y','y'],'X');g.shade(T([[31,-5],[34,-5],[34,0],[32,0]]),['Y'],'X');g.shade(T([[35,-2],[40,-2],[39,4],[36,4]]),['Y'],'X');g.shade(T([[13,-2],[16,-2],[17,3],[14,3]]),['Y','y'],'X');
 L(20,1,21,-3,'y',['Y','X']);L(25,0,27,-4,'y',['Y','X']);L(30,0,32,-4,'y',['Y','X']);L(34,2,37,-1,'y',['Y','X']);L(16,6,10,4,'x',['y','Y']);L(15,9,9,10,'x',['y']);L(16,12,9,14,'x',['y']);
 P(21,-3,'X');P(28,-4,'X');P(33,-3,'X');P(13,0,'X');P(40,0,'X');
 /* --- orelhas --- */
 g.ell(18+ox,12.5+oy,1.4,2.2,'S');g.ell(36+ox,12.5+oy,1.4,2.2,'S');P(18,12,'t');P(36,12,'s');P(18,13,'s');
 /* --- rosto: oval simetrico, sombra a esquerda, luz a direita --- */
 g.poly(T([[20,8],[34,8],[36,12],[35,16],[32,20],[22,20],[19,16],[18,12]]),'S');
 g.shade(T([[18,8],[22,8],[22,21],[18,21]]),['S'],'s');g.shade(T([[21,17],[33,17],[31,21],[23,21]]),['S'],'s');
 g.shade(T([[18,11],[20,11],[20,17],[18,17]]),['s'],'t');g.shade(T([[31,10],[35,10],[35,15],[32,15]]),['S'],'k');
 /* --- bandana: faixa, placa, nos --- */
 g.poly(T([[14,3.4],[40,3],[40,7.2],[14,7.8]]),'B');g.shade(T([[14,6],[40,5.6],[40,7.4],[14,8]]),['B'],'b');L(15,4.4,39,4,'j',['B']);
 g.poly(T([[23,3.6],[31,3.4],[31.4,7.2],[23.4,7.5]]),'M');g.edge(T([[23,3.6],[31,3.4],[31.4,7.2],[23.4,7.5]]),'L');g.shade(T([[23,6.4],[31,6.2],[31,7.2],[23,7.4]]),['M'],'L');
 P(25,5,'L');P(26,4,'LL');P(28,5,'L');P(27,6,'L');
 P(13,6,'bB');P(10,7,'bBBB');P(8,8,'bBBb');P(7,10,'bBBb');P(6,12,'bBb');P(7,14,'bB');P(10,9,'bB');P(9,16,'b');
 /* --- franja: mecha fina de cada lado --- */
 g.poly(T([[20,8],[23,8],[21,13]]),'Y');g.poly(T([[31,8],[34,8],[33,12]]),'Y');L(21,8,21,11,'y',['Y']);P(33,9,'X');
 /* --- sobrancelhas e olhos (4 px cada, olhando de frente) --- */
 const shut=mod&&mod.shut;
 if(shut){L(22,12,25,13,'K');L(29,13,32,12,'K');L(22,10,25,10,'x',['S','s']);L(29,10,32,10,'x',['S','s']);}
 else{L(22,10,25,10,'x',['S','s']);L(29,10,32,10,'x',['S','s']);
  L(22,11,25,11,'K');L(29,11,32,11,'K');P(22,12,'WeEW');P(29,12,'WEeW');P(23,13,'ee');P(30,13,'ee');P(22,14,'ssss');P(29,14,'ssss');}
 /* --- nariz --- */
 P(27,14,'s');P(27,15,'t');P(28,15,'s');
 /* --- bigodes: 3 riscos em cada bochecha --- */
 L(20,13,23,14,'t',['S','s']);L(20,15,23,15,'t',['S','s']);L(21,17,24,16,'t',['S','s']);
 L(34,13,31,14,'t',['S','s']);L(34,15,31,15,'t',['S','s']);L(33,17,30,16,'t',['S','s']);
 /* --- boca: sorriso largo com dentes, ou aberta de dor --- */
 if(mod&&mod.mouth){g.ell(27+ox,18+oy,3,1.8,'K');L(25,18,29,18,'W');L(26,19,28,19,'o');}
 else{L(24,17,30,17,'K');P(23,16,'o');P(31,16,'o');L(25,18,29,18,'W');P(26,19,'sss');}
 L(24,20,30,20,'t',['S','s']);
}/* cabeca deitada (rosto para cima) */
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
