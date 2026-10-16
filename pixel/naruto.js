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
 set(15,16,'oo');set(15,27,'oo');set(16,17,'o');set(16,27,'o');set(17,17,'o');set(17,26,'o');
 /* sorriso largo com dentes, ou boca aberta */
 if(!(mod&&mod.mouth)){set(17,20,'KWWK');set(18,21,'KK');}else{set(17,20,'KKK');set(18,20,'KoK');}
 return rows;}
function r0len(rows,y){return rows[y].length;}
function naruHead(g,ox,oy,mod){
 naruHeadRows(mod).forEach((r,y)=>g.put(ox,y+oy,r.join('')));
 const dx=ox-4,dy=oy-1,L=(a,b,c,d,k)=>g.line(a+dx,b+dy,c+dx,d+dy,k,['Y']);
 L(33,7,24,6,'y');L(28,5,17,7,'y');L(21,6,11,9,'y');L(16,9,8,11,'y');
 /* mechas soltas atras da faixa (no lugar das pontas azuis) */
 g.put(14+dx,10+dy,'y');g.put(12+dx,11+dy,'yYy');g.put(11+dx,12+dy,'yYY');g.put(10+dx,13+dy,'yY');g.put(10+dx,14+dy,'x');g.put(14+dx,13+dy,'Yy');g.put(15+dx,14+dy,'y');
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
/* carregando o Rasengan: base agachada do Chidori sem a bola (o jogo desenha a esfera na mao) */
function naruCharge(){const g=naruFrom(sasukeChidori,NAR_STD)();for(let y=0;y<g.h;y++)for(let x=36;x<g.w;x++){if(y>=34&&'ZzR'.includes(g.G[y][x]))g.G[y][x]='.';}for(let y=34;y<g.h;y++)for(let x=36;x<g.w;x++){if(g.G[y][x]==='K'){const nb=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const c=(g.G[y+b]||[])[x+a];return c&&c!=='.'&&c!=='K';});if(!nb)g.G[y][x]='.';}}return g;}
/* quadros de transicao (derivados dos do Sasuke) */
const naruPunchWind=typeof sasukePunchWind==='function'?naruFrom(sasukePunchWind,Object.assign({},NAR_STD,{folds:[[24,52,20,57,'m'],[14,62,10,67,'m'],[41,58,44,62,'m']]})):null;
/* Oiroke no Jutsu: a transformacao comica (cabelo loiro em duas maria-chiquinhas, sem a faixa, rubor no rosto)
   com o corpo coberto por nuvens de fumaca, como no anime. Base: a base de luta do Naruto. */
NAR_PAL.h='#f49ab0';
function naruSexy(){const g=naruGuard();
 const toSkin={O:'S',Q:'S',q:'s',m:'t',N:'S',n:'s',v:'S',W:'S',A:'S',a:'s',d:'s',D:'S',L:'s'};
 for(let y=0;y<g.h;y++)for(let x=0;x<g.w;x++){const ch=g.G[y][x];if(ch==='.')continue;
  if(y<=26){if('MmLBbuj'.includes(ch)&&y<=17)g.G[y][x]=(x+y)%3?'Y':'y';continue;} /* tira a faixa: vira franja */
  if(y<=66&&toSkin[ch])g.G[y][x]=toSkin[ch];}
 /* maria-chiquinhas descendo dos lados da cabeca */
 g.poly([[9,12],[14,13],[13,24],[10,34],[7,30],[8,20]],'Y');g.line(10,15,9,29,'y',['Y']);
 g.poly([[40,12],[45,12],[47,20],[46,31],[43,35],[41,24]],'Y');g.line(44,15,45,29,'y',['Y']);
 /* rubor */
 g.put(25,21,'hh');g.put(35,21,'hh');
 /* nuvens de fumaca cobrindo o corpo */
 for(const [cx,cy,rx,ry] of [[29,35,10,6],[22,38,6,5],[36,38,6,5],[29,44,9,5],[29,51,12,6],[20,53,6,4.5],[38,53,6,4.5]])g.ell(cx,cy,rx,ry,'W');
 for(const [cx,cy,rx,ry] of [[29,39,9,2.5],[29,55,11,2.5],[21,56,5,2],[37,56,5,2]])g.ell(cx,cy,rx,ry,'u');
 g.outline('K');return g;}
/* Manto da Kyubi: o Naruto de quatro, como uma raposa, olhando para a direita (72x80, ancora no pe).
   Seguindo a referencia: corpo baixo e esticado, bracos retos com as maos espalmadas na frente, pes atras, cabeca erguida
   olhando para a frente com cara de raiva. Mesmas cores e contorno dos outros sprites dele. */
function naruFours(){const g=PixGrid(72,80);HEADHOOK=null;
 /* perna de tras (esquerda): coxa dobrada, canela encostada no chao, sandalia */
 g.poly([[4,52],[16,50],[18,60],[6,62]],'q');g.poly([[2,60],[14,60],[12,70],[0,70]],'O');g.shade([[0,64],[14,64],[14,72],[0,72]],['O'],'q');
 g.poly([[0,68],[14,68],[15,74],[0,74]],'N');g.line(0,73,14,73,'n');g.put(8,69,'SSS');
 /* perna da frente (direita da traseira): mais a frente, joelho no chao */
 g.poly([[14,50],[26,50],[28,62],[24,66],[14,62]],'O');g.shade([[12,56],[30,56],[30,68],[12,68]],['O'],'q');
 g.poly([[18,64],[29,64],[28,70],[18,70]],'A');g.line(18,67,28,67,'a');g.poly([[16,70],[30,70],[31,75],[15,75]],'N');g.line(16,74,30,74,'n');
 /* tronco baixo e esticado: quadril (esq.) baixo, ombros (dir.) um pouco mais altos */
 g.poly([[4,44],[14,38],[34,34],[50,34],[56,40],[56,48],[44,52],[22,54],[6,52]],'O');
 g.shade([[2,48],[58,48],[58,56],[2,56]],['O'],'q');g.shade([[14,34],[52,34],[52,38],[14,38]],['O'],'Q');
 g.line(10,44,46,40,'m',['O','Q']);g.line(4,50,16,49,'N',['O','q']);g.line(4,51,16,50,'n',['O','q']);
 /* bolsa e zipper */
 g.line(30,36,42,36,'m',['O','Q']);g.put(24,46,'W');
 /* gola de pelo branca nos ombros */
 g.poly([[44,32],[54,32],[58,38],[52,42],[44,40]],'W');g.shade([[44,38],[60,38],[60,43],[44,43]],['W'],'A');
 /* braco de tras (atras do tronco), reto ate o chao */
 g.poly([[38,42],[46,42],[50,60],[48,70],[42,70],[42,58]],'q');g.poly([[40,68],[50,68],[52,75],[40,75]],'s');g.line(41,74,51,74,'t');
 /* braco da frente, reto e inclinado para a frente, com a mao espalmada no chao */
 g.poly([[50,40],[58,40],[66,58],[66,70],[60,70],[58,58]],'O');g.shade([[56,52],[70,52],[70,72],[56,72]],['O'],'q');
 g.poly([[58,64],[67,64],[66,70],[59,70]],'N');g.line(58,67,67,67,'n');
 g.poly([[56,70],[68,70],[71,74],[70,75],[54,75]],'S');g.line(56,74,70,74,'s');for(const x of [60,63,66])g.line(x,71,x+1,75,'s');
 /* cabeca erguida, projetada para a frente e um pouco acima dos ombros, com cara de raiva */
 naruHead(g,30,8,{mouth:true});
 g.outline('K');g.selout('K',NAR_DARK);
 return g;}
