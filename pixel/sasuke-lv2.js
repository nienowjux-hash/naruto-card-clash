/* Sasuke no Selo Amaldicoado nivel 2, no mesmo estilo dos sprites a mao.
   Pele cinza-lilas, cabelo mais claro e comprido caindo pelas costas, olhos de esclera escura com o Sharingan,
   e a marca em X no nariz. Usa a mesma geometria de cada pose; so a cabeca e a paleta mudam. */
const LV2_PAL=Object.assign({},SAS2_PAL,{
 1:'#2a3352',2:'#44557f',3:'#6276aa',4:'#8d9fd0',5:'#c0cbec',
 S:'#bdb6d2',s:'#9790b2',t:'#736b8f',o:'#4c4566',
 x:'#e0202e',X:'#ff6a5a'});

function lv2HeadRows(mod){
 const rows=sasHeadRows(mod).map(r=>r.slice());
 const set=(y,x,s)=>{for(let i=0;i<s.length;i++)rows[y][x+i]=s[i];};
 if(!(mod&&mod.shut)){set(12,17,'Lxx');set(12,25,'xxL');set(13,18,'x');set(13,26,'x');}
 /* marca em X no nariz, entre os olhos */
 set(14,21,'tKt');set(15,22,'t');
 return rows;}

/* mechas compridas e espetadas caindo pelas costas (ficam do lado de tras da cabeca, a esquerda) */
function lv2Mane(g,ox,oy){
 const dx=ox-4,dy=oy-1,P=pts=>pts.map(([x,y])=>[x+dx,y+dy]);
 g.poly(P([[6,10],[15,12],[14,22],[12,30],[9,26],[7,36],[4,28],[2,38],[1,26],[2,16]]),'2');
 g.shade(P([[0,10],[7,10],[6,40],[0,40]]),['2'],'1');
 g.line(9+dx,14+dy,8+dx,28+dy,'3',['2']);g.line(12+dx,15+dy,11+dx,24+dy,'3',['2']);g.line(5+dx,18+dy,4+dx,30+dy,'1',['2']);
 g.put(10+dx,13+dy,'4');g.put(13+dx,14+dy,'4');}

function lv2Head(g,ox,oy,mod){
 lv2Mane(g,ox,oy);
 lv2HeadRows(mod).forEach((r,y)=>g.put(ox,y+oy,r.join('')));
 const dx=ox-4,dy=oy-1,L=(a,b,c,d,k)=>g.line(a+dx,b+dy,c+dx,d+dy,k,['3']);
 L(33,7,24,6,'2');L(28,5,17,7,'2');L(21,6,11,9,'2');L(16,9,8,11,'2');
 L(33,6,25,5,'4');L(27,4,18,6,'4');L(20,5,12,8,'4');L(15,8,9,10,'4');
 g.put(29+dx,4+dy,'5');g.put(21+dx,5+dy,'5');g.put(14+dx,6+dy,'5');
 g.put(14+dx,10+dy,'b');g.put(12+dx,11+dy,'bBb');g.put(11+dx,12+dy,'bBB');g.put(10+dx,13+dy,'bB');g.put(10+dx,14+dy,'b');g.put(14+dx,13+dy,'Bb');g.put(15+dx,14+dy,'b');}

function lv2HeadLying(g,ox,oy,groundY,mod){const rows=lv2HeadRows(mod),Wd=rows[0].length;
 for(let y=0;y<rows.length;y++)for(let x=0;x<Wd;x++){const ch=rows[y][x];if(ch==='.')continue;const nx=ox+y,ny=oy+(Wd-1-x);if(ny<=groundY)g.set(nx,ny,ch);}}

function lv2From(fn){return()=>{HEADHOOK={head:lv2Head,lying:lv2HeadLying};let g;try{g=fn();}finally{HEADHOOK=null;}return g;};}
const LV2_POSES={guard:sasukeGuard,punch:sasukePunch,hit:sasukeHit,down:sasukeDown,kick:sasukeKick,seal:sasukeSeal,chidori:sasukeChidori,
 katon:sasukeKaton,block:sasukeBlock};
if(typeof sasukePunchWind==='function')LV2_POSES.pw=sasukePunchWind;
if(typeof sasukeKickWind==='function')LV2_POSES.kw=sasukeKickWind;
