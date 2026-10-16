/* Naruto em pixel art, no mesmo formato do Sasuke (grade 56x80, olhando para a direita).
   Cabeca desenhada pixel a pixel (3/4, mesmo tamanho e posicao da do Sasuke). O corpo usa a mesma geometria de cada pose
   do Sasuke, trocando a roupa: casaco laranja de gola azul alta, calca laranja com dobras e atadura branca na canela. */
const NAR_PAL=Object.assign({},SAS2_PAL,{
 Y:'#ffd93a',y:'#e9a91d',x:'#a8700f',X:'#fff6b0',
 O:'#f58a18',Q:'#ffb347',q:'#cf620e',m:'#8a380a',k:'#ffd27a',
 B:'#2f48aa',b:'#1a2a70',j:'#6a86e0',M:'#eef1f8',L:'#7c86a8',
 N:'#2e4ab0',n:'#1b2b72',v:'#5a78d8',
 W:'#ffffff',E:'#16102a',e:'#2c6ee8',j:'#7fb2ff',u:'#aab0c8'});
const NAR_DARK=Object.assign({},SAS_DARK,{Y:'x',y:'x',X:'y',x:'x',O:'q',Q:'O',q:'m',m:'m',B:'b',j:'B'});

/* ---------------- cabeca, linha por linha ----------------
   Feita sobre a MESMA grade da cabeca do Sasuke (40x21, mesmo rosto, mesma bandana, mesmo angulo):
   o rosto e a bandana vem das linhas do Sasuke, o cabelo de cima e redesenhado pixel a pixel em espetos,
   e olhos azuis, bigodes e o sorriso sao pintados por cima. */
const NARU_HAIR_TOP=[
 [[16,'K'],[22,'K']],
 [[10,'K'],[15,'KXK'],[21,'KXK'],[27,'K']],
 [[3,'K'],[9,'KXK'],[14,'KXYK'],[20,'KXYK'],[26,'KXK']],
 [[3,'KXK'],[8,'KXYK'],[13,'KXYYK'],[19,'KXYYK'],[25,'KXYK'],[30,'K']],
 [[3,'KXYK'],[7,'KXYYK'],[12,'KXYYYK'],[18,'KXYYYK'],[24,'KXYYK'],[29,'KXK']],
 [[2,'KXYYKXYYYYKXYYYYYKXYYYYYKXYYYYK']],
 [[1,'KyYYYYyYYYYYyYYYYYYyYYYYYYyYYYXK']],
 [[0,'KyYK'],[30,'XYYK']],[[0,'KYK'],[31,'XYXK']],[[31,'YYK']],[[30,'XYYK']],[[30,'YXK']]];
function naruHeadRows(mod){
 const rows=sasHeadRows(mod).map(r=>r.slice());
 const tr={'1':'x','2':'y','3':'Y','4':'X','5':'X','m':'u','e':'j','E':'E'};
 for(const r of rows)for(let i=0;i<r.length;i++){if(tr[r[i]])r[i]=tr[r[i]];}
 for(let y=0;y<7;y++)for(let i=0;i<r0len(rows,y);i++)rows[y][i]='.';
 NARU_HAIR_TOP.forEach((segs,y)=>segs.forEach(([x,s])=>{for(let i=0;i<s.length;i++)rows[y][x+i]=s[i];}));
 const set=(y,x,s)=>{for(let i=0;i<s.length;i++)rows[y][x+i]=s[i];};
 if(!(mod&&mod.shut)){set(12,16,'sKKKKSSSKKKKSK');set(13,16,'sWeEWSSSWEeWSK');set(14,16,'SKjeKSSSKejKSK');}
 /* bigodes de raposa (3 em cada bochecha) */
 set(15,16,'tt');set(15,27,'tt');set(16,16,'t');set(16,17,'t');set(16,26,'tt');set(17,17,'t');set(17,26,'t');
 /* sorriso largo com dentes, ou boca aberta */
 if(!(mod&&mod.mouth)){set(17,19,'oKKKKo');set(18,20,'WWWW');}
 return rows;}
function r0len(rows,y){return rows[y].length;}
function naruHead(g,ox,oy,mod){
 naruHeadRows(mod).forEach((r,y)=>g.put(ox,y+oy,r.join('')));
 const dx=ox-4,dy=oy-1,L=(a,b,c,d,k)=>g.line(a+dx,b+dy,c+dx,d+dy,k,['Y']);
 L(33,7,24,6,'y');L(28,5,17,7,'y');L(21,6,11,9,'y');L(16,9,8,11,'y');
 g.put(14+dx,10+dy,'b');g.put(12+dx,11+dy,'bBb');g.put(11+dx,12+dy,'bBB');g.put(10+dx,13+dy,'bB');g.put(10+dx,14+dy,'b');g.put(14+dx,13+dy,'Bb');g.put(15+dx,14+dy,'b');
}/* cabeca deitada (rosto para cima) */
function naruHeadLying(g,ox,oy,groundY,mod){
 const tmp=PixGrid(44,34);naruHead(tmp,0,6,mod);const rows=tmp.G,Wd=44;
 for(let y=0;y<rows.length;y++)for(let x=0;x<Wd;x++){const ch=rows[y][x];if(ch==='.')continue;const nx=ox+y-6,ny=oy+(Wd-1-x);if(ny<=groundY)g.set(nx,ny,ch);}}

/* ---------------- roupa: recolorir o corpo da pose do Sasuke ---------------- */
let HEADHOOK=null;
function naruDress(g,r){
 const jack={C:'O',c:'q',d:'m',D:'Q'},pant={P:'O',p:'q',q:'m'},skin={S:'O',s:'q',t:'m'};
 for(let y=0;y<g.h;y++)for(let x=0;x<g.w;x++){const ch=g.G[y][x];if(ch==='.')continue;
  if(jack[ch]!==undefined){const z=r.collar(x,y); /* 1 = gola de pelo branca, 2 = faixa azul dos ombros */
   g.G[y][x]=z===1?{C:'W',c:'A',d:'a',D:'W'}[ch]:z===2?{C:'N',c:'n',d:'n',D:'v'}[ch]:jack[ch];continue;}
  if(pant[ch]!==undefined){g.G[y][x]=r.waist(x,y)?{P:'N',p:'n',q:'n'}[ch]:pant[ch];continue;}
  if(skin[ch]!==undefined&&r.cover(x,y)){g.G[y][x]=skin[ch];continue;}
  if(ch==='A'||ch==='a'||ch==='r'){g.G[y][x]={A:'O',a:'q',r:'m'}[ch];}
 }
 for(const f of r.folds||[])g.line(f[0],f[1],f[2],f[3],f[4]||'m',['O','q','Q']);
 if(r.extra)r.extra(g);
 return g;}function naruFrom(fn,rules){return()=>{HEADHOOK={head:naruHead,lying:naruHeadLying};let g;try{g=fn();}finally{HEADHOOK=null;}
 naruDress(g,rules);g.outline('K');g.selout('K',NAR_DARK);return g;};}
/* so as faixas dos antebracos viram manga; a atadura da canela (y>=64, x>=36 ou x<=16) continua branca */
const NAR_STD={collar:(x,y)=>(y>=24&&y<=30&&x>=22&&x<=38)?1:(y>=30&&y<=33&&x>=17&&x<=43)?2:(y>=44)?2:0,waist:(x,y)=>y<=46,cover:(x,y)=>y>=49&&y<=69,
 extra:g=>{ /* atadura na coxa da frente e porta-kunai na de tras, barra da calca dobrada */
  for(let x=31;x<42;x++){if(g.G[54][x]==='O'||g.G[54][x]==='q'){g.G[54][x]='A';g.G[55][x]='a';}}
  for(const [x,y] of [[23,31],[26,31],[29,32],[32,31],[35,31],[37,30]])if(g.G[y][x]!=='.')g.G[y][x]='W';
  g.poly([[11,53],[15,53],[15,60],[11,60]],'d');g.line(11,54,15,54,'D');g.put(13,56,'L');
  for(let x=0;x<56;x++){if(g.G[64][x]==='O')g.G[64][x]='Q';if(g.G[65][x]==='O'||g.G[65][x]==='q')g.G[65][x]='m';}},
 folds:[[20,57,16,61,'m'],[14,62,12,66,'m'],[41,58,43,62,'m'],[40,50,36,53,'q'],[17,52,14,56,'m']]};
const naruGuard=naruFrom(sasukeGuard,NAR_STD);
const naruPunch=naruFrom(sasukePunch,Object.assign({},NAR_STD,{folds:[[24,52,20,57,'m'],[14,62,10,67,'m'],[41,58,44,62,'m']]}));
const naruHit=naruFrom(sasukeHit,Object.assign({},NAR_STD,{folds:[[22,52,18,57,'m'],[36,52,38,57,'m']]}));
const naruKick=naruFrom(sasukeKick,Object.assign({},NAR_STD,{cover:(x,y)=>y>=48||(y>=42&&x>=30&&x<=47)}));
const naruSeal=naruFrom(sasukeSeal,NAR_STD);
const naruBlock=naruFrom(sasukeBlock,NAR_STD);
const naruDown=naruFrom(sasukeDown,{collar:(x,y)=>(x<=22&&y>=33&&y<=44)?1:(x<=25&&y>=33&&y<=44)?2:0,waist:(x,y)=>x<=41,cover:(x,y)=>x>=44&&y>=22,folds:[[52,32,50,38,'m']]});
