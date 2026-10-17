/* ---------- Vila da Folha (Konohagakure) ----------
   Cenario proprio da vila, usado fora de duelo (hubMode). A parte fixa e pintada uma vez em pixel art de verdade (PixGrid 384x216, sem suavizacao):
   ceu e sol, montanhas, floresta, Monte Hokage com os quatro rostos, tres fileiras de casas, Torre do Hokage, Armeiro, Ichiraku, Dojo, Academia, torii,
   cerejeiras e rua de pedra com perspectiva. Por cima, animado: nuvens, passaros, fumaca, vapor do ramen, petalas, lanternas e moradores andando.
   O Time 7 fica parado na rua e os predios sao botoes (KON_SPOTS, ver 25-vila.js). */
const KON_SPOTS=[
 {id:'torre',x:60,y:92,name:'Torre do Hokage',sub:'Mapa da campanha',go:()=>openMap()},
 {id:'armeiro',x:146,y:124,name:'Armeiro',sub:'Equipamentos',go:()=>openInv()},
 {id:'dojo',x:245,y:102,name:'Dojo',sub:'Árvore de habilidades',go:()=>openTree()},
 {id:'templo',x:352,y:104,name:'Templo de Invocação',sub:'Invocar ninjas',go:()=>openGacha()}];
let konStatic=null,konSprites=null;
const konHash=(x,y)=>{let h=(x*374761393+y*668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296;};
const KON_BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const konBY=(x,y)=>KON_BAYER[(y&3)*4+(x&3)]/16;
function konBuildStatic(){
 const g=PixGrid(W,H),PAL={},pool='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&*+=?@^~',cmap={};let np=0;
 const C=hex=>{if(cmap[hex])return cmap[hex];const k=np<pool.length?pool[np]:String.fromCharCode(0x100+np);np++;cmap[hex]=k;PAL[k]=hex;return k;};
 const rect=(x,y,w,h,k)=>{x=Math.round(x);y=Math.round(y);for(let j=0;j<h;j++)for(let i=0;i<w;i++)g.set(x+i,y+j,k);};
 const grad=(y0,y1,cols)=>{for(let y=y0;y<y1;y++){const t=(y-y0)/(y1-y0)*(cols.length-1),i=Math.floor(t),f=t-i;for(let x=0;x<W;x++)g.set(x,y,cols[Math.min(cols.length-1,i+(f>konBY(x,y)?1:0))]);}};
 const inPoly=(pts,px,py)=>{let c=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))c=!c;}return c;};
 const dots=(x0,y0,x1,y1,k,p,only,seed)=>{x0=Math.round(x0);y0=Math.max(0,Math.round(y0));x1=Math.round(x1);y1=Math.min(H,Math.round(y1));for(let y=y0;y<y1;y++)for(let x=Math.max(0,x0);x<Math.min(W,x1);x++)if(konHash(x+seed,y)<p&&(!only||only.includes(g.G[y][x])))g.set(x,y,k);};
 /* ---- ceu ---- */
 grad(0,152,[C('#3a82d4'),C('#559ae0'),C('#78b4ec'),C('#a0caf0'),C('#c6e2f2'),C('#ecebcc'),C('#ffdc9c')]);
 for(let y=0;y<152;y++)for(let x=0;x<W;x++){const d=Math.hypot(x-322,y-58);if(d<13)g.set(x,y,C('#fffbe2'));else if(d<17)g.set(x,y,C('#fff0b4'));else if(d<52){const p=Math.pow(1-(d-17)/35,2)*.55;if(konBY(x,y)<p)g.set(x,y,C('#fff6cc'));}}
 /* ---- montanhas distantes ---- */
 const ridge=(x,base,amp,ph)=>base-amp*(.5+.5*Math.sin(x*.019+ph))-amp*.45*Math.sin(x*.053+ph*2)-amp*.2*Math.sin(x*.13+ph*3);
 for(const [col,hi,base,amp,ph,snow] of [[C('#a2bae4'),C('#c8d8f4'),98,34,1,true],[C('#7f9bcf'),C('#a6bbe2'),112,26,3.4,false]])for(let x=0;x<W;x++){const r=Math.round(ridge(x,base,amp,ph));for(let y=r;y<152;y++)g.set(x,y,y<r+2?hi:col);if(snow&&r<76)for(let y=r;y<r+3+(76-r)*.15;y++)if(konHash(x,y)<.85)g.set(x,y,C('#f6faff'));}
 /* ---- colinas de floresta ao fundo ---- */
 for(let x=0;x<W;x++){const h=Math.round(124+8*Math.sin(x*.045)+5*Math.sin(x*.13+2)),c1=C('#3c8a4a'),c2=C('#2e7040'),c3=C('#58a85a');for(let y=h;y<152;y++)g.set(x,y,(y-h<2)?c3:(konHash(x>>1,y>>1)<.3?c2:c1));}
 /* ---- Monte Hokage ---- */
 const rockPts=[[52,152],[66,108],[84,76],[112,52],[146,42],[192,38],[238,42],[272,52],[300,76],[318,108],[332,152]];
 const rk=[C('#d6ba88'),C('#bf9e6c'),C('#a28258'),C('#85694a'),C('#6c5339')];
 for(let y=36;y<152;y++)for(let x=50;x<334;x++){if(!inPoly(rockPts,x+.5,y+.5))continue;
  let t=.25+((x-52)/280)*.75+(y-40)/260*.25+(konHash(x>>1,y>>1)-.5)*.28;const strata=((y*.9+Math.sin(x*.07)*3+Math.sin(x*.19)*1.4)%9);if(strata<1.1)t+=.2;
  if(konHash(x,y+500)<.04)t+=.25;g.set(x,y,rk[Math.max(0,Math.min(4,Math.floor(t*4.4)))]);}
 for(const [tx,ty] of [[92,80],[104,64],[120,54],[150,45],[236,45],[262,55],[282,66],[298,84],[76,100],[316,104]]){for(const [dx,dy,r] of [[0,0,5],[-4,2,4],[4,2,4],[0,-3,3.4]])g.ell(tx+dx,ty+dy,r,r*.8,C(konHash(tx,ty)<.5?'#3c8a46':'#2c7038'));g.ell(tx-1,ty-2,2.4,1.6,C('#62b25c'));}
 /* rostos dos quatro Hokages esculpidos na pedra: so tons de areia/marrom, com testeira, cabelo/chapeu entalhados, sombra funda nos olhos, rachaduras e textura */
 const facePx=new Set();
 const face=(g,cx,cy,k)=>{const L=C('#dcc8a2'),M=C('#bda580'),D=C('#947c5a'),X=C('#6a553c'),T=C('#4a3a28');
  g.ell(cx,cy,12.5,15.5,L);g.poly([[cx+1,cy-15],[cx+9,cy-10],[cx+12,cy+2],[cx+8,cy+12],[cx+2,cy+15]],M);g.poly([[cx+7,cy-8],[cx+12,cy+2],[cx+8,cy+12],[cx+5,cy+6]],D);g.ell(cx,cy+14,7,3.4,D);
  if(k===0){ /* cabelo comprido e liso dos dois lados */
   g.poly([[cx-15,cy+25],[cx-16,cy-6],[cx-12,cy-18],[cx,cy-21],[cx+12,cy-18],[cx+16,cy-6],[cx+15,cy+25],[cx+11,cy+6],[cx+10,cy-10],[cx-10,cy-10],[cx-11,cy+6]],M);
   g.poly([[cx+11,cy-18],[cx+16,cy-6],[cx+15,cy+25],[cx+12,cy+10]],D);for(let i=-13;i<=13;i+=3)g.line(cx+i,cy-19+Math.abs(i)*.2,cx+i*1.1,cy+22,D,[M]);}
  else if(k===1){ /* cabelo espetado + testeira */
   g.poly([[cx-14,cy-4],[cx-13,cy-18],[cx-6,cy-12],[cx-2,cy-23],[cx+4,cy-13],[cx+10,cy-21],[cx+14,cy-5],[cx+11,cy-9],[cx-11,cy-9]],M);g.poly([[cx+4,cy-13],[cx+10,cy-21],[cx+14,cy-5],[cx+11,cy-9]],D);g.line(cx-13,cy-16,cx-6,cy-11,D);g.line(cx-2,cy-21,cx+3,cy-13,D);}
  else if(k===2){ /* chapeu do Hokage com o simbolo do fogo */
   g.poly([[cx-17,cy-8],[cx-15,cy-21],[cx+15,cy-21],[cx+17,cy-8],[cx+11,cy-10],[cx-11,cy-10]],D);g.poly([[cx-13,cy-21],[cx+13,cy-21],[cx+10,cy-25],[cx-10,cy-25]],M);g.poly([[cx+8,cy-21],[cx+17,cy-8],[cx+11,cy-10],[cx+9,cy-17]],X);g.line(cx-15,cy-8,cx+15,cy-8,X);g.ell(cx,cy-16,3.4,2.6,L);g.line(cx,cy-18,cx,cy-14,T);g.line(cx-2,cy-16,cx+2,cy-16,T);
   g.line(cx-6,cy+9,cx-4,cy+14,D);g.line(cx+6,cy+9,cx+4,cy+14,D);g.line(cx-3,cy+13,cx+3,cy+13,D);}
  else{ /* cabelo espetado + testeira */
   g.poly([[cx-14,cy-4],[cx-17,cy-14],[cx-9,cy-12],[cx-6,cy-24],[cx,cy-14],[cx+6,cy-24],[cx+9,cy-12],[cx+17,cy-14],[cx+14,cy-4],[cx+11,cy-9],[cx-11,cy-9]],M);g.poly([[cx+6,cy-24],[cx+9,cy-12],[cx+17,cy-14],[cx+14,cy-4],[cx+11,cy-9]],D);g.line(cx-6,cy-22,cx,cy-14,D);g.line(cx+6,cy-22,cx,cy-14,X);}
  if(k===1||k===3){g.poly([[cx-13,cy-10],[cx+13,cy-10],[cx+13,cy-5],[cx-13,cy-5]],L);g.line(cx-13,cy-5,cx+13,cy-5,D);g.poly([[cx+5,cy-10],[cx+13,cy-10],[cx+13,cy-5],[cx+5,cy-5]],M);g.poly([[cx-6,cy-10],[cx+6,cy-10],[cx+6,cy-5],[cx-6,cy-5]],M);g.line(cx-6,cy-10,cx+6,cy-10,L);g.line(cx-3,cy-7,cx+3,cy-8,X);}
  const brow=k===1||k===3?cy-3:cy-6;
  g.line(cx-10,brow,cx-3,brow+1,X);g.line(cx+3,brow+1,cx+10,brow,X);g.ell(cx-6,brow+3.5,3.6,1.9,X);g.ell(cx+6,brow+3.5,3.6,1.9,X);g.line(cx-8,brow+3,cx-4,brow+3,L);g.line(cx+4,brow+3,cx+8,brow+3,L);g.set(cx-6,brow+3,T);g.set(cx+6,brow+3,T);
  g.line(cx,brow+4,cx,cy+6,L);g.line(cx+1,brow+5,cx+2,cy+6,D);g.line(cx-3,cy+7,cx+3,cy+7,D);g.set(cx-2,cy+7,X);g.set(cx+2,cy+7,X);g.line(cx-4,cy+10,cx+4,cy+10,X);g.line(cx-3,cy+11,cx+3,cy+11,D);
  if(k<2){g.line(cx-9,cy+1,cx-8,cy+8,D);g.line(cx+9,cy+1,cx+8,cy+8,X);}
  g.line(cx-3,cy-12+(k===1||k===3?4:0),cx-1,cy-6,D);g.line(cx+7,cy+1,cx+9,cy+7,D);
  for(let y=cy-24;y<=cy+26;y++)for(let x=cx-18;x<=cx+18;x++){const s=g.G[y]&&g.G[y][x];if(!s||s==='.')continue;const r=konHash(x+k*91,y);if(s===L&&r<.12)g.set(x,y,M);else if(s===M&&r<.1)g.set(x,y,D);else if(s===D&&r<.06)g.set(x,y,X);else if(s===L&&r>.97)g.set(x,y,C('#eadbbb'));}};
 /* cada rosto e pintado num quadro proprio e ampliado 1,5x (amostragem por vizinho mais proximo) para ocupar o monte como na referencia */
 [[132,80],[172,76],[212,76],[252,80]].forEach((p,i)=>{const t=PixGrid(54,72);face(t,27,36,i);for(let y=0;y<108;y++)for(let x=0;x<81;x++){const k=t.G[Math.floor(y/1.5)][Math.floor(x/1.5)];if(k!=='.'){g.set(p[0]-40+x,p[1]-54+y,k);facePx.add((p[0]-40+x)+','+(p[1]-54+y));}}});
 /* contorno em relevo: sombra escura no lado de fora de cada rosto (esquerda e embaixo) */
 const rockSet=rk.concat([C('#5a4630')]);facePx.forEach(key=>{const [x,y]=key.split(',').map(Number);for(const [dx,dy] of [[-1,0],[0,1],[-2,0],[0,2]]){const nx=x+dx,ny=y+dy;if(!facePx.has(nx+','+ny)&&g.G[ny]&&rk.includes(g.G[ny][nx]))g.set(nx,ny,C('#5a4630'));}});
 /* rachaduras da pedra: abaixo de cada queixo e espalhadas pelo monte */
 const crack=(x0,y0,len,seed)=>{let x=x0,y=y0;const ck=C('#5a4630'),cd=C('#7c6446');for(let i=0;i<len;i++){const r=konHash(seed,i);y+=1;x+=r<.3?-1:r>.7?1:0;if(g.G[y]&&rk.includes(g.G[y][x])){g.set(x,y,ck);if(g.G[y][x+1]&&rk.includes(g.G[y][x+1])&&r<.5)g.set(x+1,y,cd);}}};
 [[132,112],[172,108],[212,108],[252,112]].forEach((q,i)=>{for(let j=-1;j<=1;j++)crack(q[0]+j*9,q[1]+j*j,34+Math.floor(konHash(i,j)*14),i*7+j+30);});
 for(let i=0;i<18;i++)crack(Math.floor(70+konHash(i,41)*250),Math.floor(56+konHash(i,42)*50),10+Math.floor(konHash(i,43)*22),100+i);
 for(let y=136;y<152;y++)for(let x=50;x<340;x++)if(konBY(x,y)<(y-136)/16*.5)g.set(x,y,C('#e8f0f0'));
 /* ---- casas ---- */
 const ROOF={o:[C('#e07a40'),C('#b8502c'),C('#f6a462')],t:[C('#4c8c96'),C('#2e6470'),C('#78b4bc')],b:[C('#5c70a0'),C('#3c4c74'),C('#8698c4')],g:[C('#5c9c54'),C('#3c7440'),C('#88c472')],r:[C('#c84c3c'),C('#962c26'),C('#ea7a5c')]};
 const smoke=[],wins=[];
 const house=(x,yb,w,h,rp,o)=>{o=o||{};const wall=C(o.wall||'#eddfba'),wS=C('#cfba90'),beam=C('#6a4528'),lit=C('#fbe08a'),dk=C('#5a3a22');
  rect(x,yb-h,w,h,wall);rect(x+Math.round(w*.64),yb-h,w-Math.round(w*.64),h,wS);rect(x,yb-h,1,h,beam);rect(x+w-1,yb-h,1,h,beam);rect(x+Math.floor(w/2),yb-h,1,h,beam);rect(x,yb-1,w,1,beam);
  const nw=Math.max(1,Math.floor((w-4)/10));for(let i=0;i<nw;i++){const wx=Math.round(x+3+i*(w-6)/nw+1),wy=yb-Math.round(h*.68),wh=Math.max(3,Math.round(h*.3));rect(wx,wy,5,wh,lit);wins.push([wx+2.5,wy+wh/2]);rect(wx+2,wy,1,wh,dk);rect(wx,wy+1,5,1,dk);}
  if(h>=11&&!o.nodoor){rect(x+Math.floor(w/2)-2,yb-6,5,5,dk);rect(x+Math.floor(w/2),yb-6,1,5,C('#3a2414'));}
  g.poly([[x-4,yb-h+1],[x+w+4,yb-h+1],[x+w,yb-h-8],[x,yb-h-8]],rp[1]);g.poly([[x,yb-h-8],[x+w,yb-h-8],[x+w-5,yb-h-13],[x+5,yb-h-13]],rp[0]);
  for(let i=1;i<w+6;i+=3)g.line(x-3+i,yb-h,Math.round(x-2+i*.85),yb-h-7,rp[1],[rp[0]]);g.line(x+5,yb-h-13,x+w-5,yb-h-13,rp[2]);g.line(x-4,yb-h+1,x+w+4,yb-h+1,C('#8a5a3a'));g.line(x,yb-h-8,x+w,yb-h-8,rp[2]);
  if(o.chim){const cx=x+Math.round(w*.72);rect(cx,yb-h-17,3,6,C('#7a5a46'));rect(cx,yb-h-17,3,1,C('#4a3224'));smoke.push([cx+1,yb-h-18]);}};
 const HR=[ROOF.o,ROOF.t,ROOF.b,ROOF.g,ROOF.r];
 for(let x=-6,i=0;x<W;x+=22+Math.floor(konHash(i,3)*8),i++){const w=14+Math.floor(konHash(i,5)*8),h=8+Math.floor(konHash(i,6)*5);house(x,142,w,h,HR[Math.floor(konHash(i,7)*5)],{wall:'#e2d6b8',nodoor:true,chim:konHash(i,8)<.3});}
 for(let y=128;y<146;y++)for(let x=0;x<W;x++)if(konBY(x,y)<(146-y)/18*.3&&konHash(x,y)<.9){const k=g.G[y][x];if(k!=='.')g.set(x,y,C('#b8cce4'));}
 const bigTree=(tx,tb,sz,pal)=>{g.poly([[tx-2*sz,tb],[tx-sz,tb-14*sz],[tx+sz,tb-14*sz],[tx+2*sz,tb]],C('#5a3c26'));g.line(tx-sz,tb-12*sz,tx-sz,tb,C('#3c2616'));
  for(const [dx,dy,r] of [[0,-24,12],[-10,-19,9],[10,-19,9],[-5,-30,8],[6,-29,8],[0,-17,10]])g.ell(tx+dx*sz*.8,tb+dy*sz*.8,r*sz*.8,r*sz*.7,pal[0]);
  for(const [dx,dy,r] of [[-4,-27,6],[6,-23,5],[-9,-21,4],[2,-32,4]])g.ell(tx+dx*sz*.8,tb+dy*sz*.8,r*sz*.7,r*sz*.55,pal[1]);dots(tx-16,tb-44,tx+16,tb-6,pal[2],.12,[pal[0]],tx);};
 const GP=[C('#2f7a3e'),C('#58aa56'),C('#1f5a30')];
 bigTree(14,150,1.2,GP);bigTree(372,150,1.2,GP);bigTree(112,152,.8,GP);bigTree(284,152,.8,GP);
 for(const [x,w,h,r,o] of [[-4,26,16,2,{chim:1}],[22,22,14,4,{}],[84,22,15,0,{chim:1}],[250,20,15,3,{}],[310,26,16,1,{chim:1}],[338,22,14,2,{}],[364,26,16,0,{}]])if(x<W)house(x,152,w,h,HR[r],o);
 /* ---- Torre do Hokage ---- */
 {const cx=60,b=152,rd=C('#c8483a'),rd2=C('#9c2e28'),rd3=C('#e46a52'),cr=C('#ecdcb4');
  rect(cx-17,b-44,34,44,rd);rect(cx+5,b-44,12,44,rd2);rect(cx-17,b-44,2,44,rd3);rect(cx-17,b-30,34,2,cr);rect(cx-17,b-4,34,4,cr);rect(cx-17,b-44,34,2,cr);
  for(let i=0;i<5;i++){rect(cx-14+i*7,b-26,3,9,C('#fbe08a'));rect(cx-13+i*7,b-26,1,9,C('#5a3a22'));}rect(cx-3,b-14,6,10,C('#4a2c18'));rect(cx-1,b-14,1,10,C('#2a1608'));
  g.poly([[cx-26,b-42],[cx+26,b-42],[cx+19,b-56],[cx-19,b-56]],rd2);g.poly([[cx-19,b-56],[cx+19,b-56],[cx+13,b-66],[cx-13,b-66]],rd);g.poly([[cx-13,b-66],[cx+13,b-66],[cx+8,b-74],[cx-8,b-74]],rd2);
  for(let i=-24;i<24;i+=3)g.line(cx+i,b-43,Math.round(cx+i*.7),b-55,rd,[rd2]);g.line(cx-26,b-42,cx+26,b-42,rd3);g.line(cx-19,b-56,cx+19,b-56,rd3);g.line(cx-13,b-66,cx+13,b-66,rd3);
  rect(cx-1,b-84,3,10,C('#7a2018'));g.poly([[cx-5,b-80],[cx+6,b-80],[cx,b-90]],rd3);
  const fk=C('#fff6e0');g.line(cx,b-42,cx,b-32,fk);g.line(cx-1,b-39,cx-6,b-33,fk);g.line(cx+1,b-39,cx+6,b-33,fk);g.set(cx-6,b-41,fk);g.set(cx+6,b-41,fk);g.set(cx-5,b-38,fk);g.set(cx+5,b-38,fk);}
 /* ---- Armeiro ---- */
 {house(122,152,48,26,[C('#7a5a3a'),C('#5a4028'),C('#a47c50')],{wall:'#eadbb4',nodoor:true});
  for(let i=0;i<9;i++)rect(125+i*5,128,5,8,C(i%2?'#d84a3a':'#f6eed6'));g.line(125,136,170,136,C('#8a2a20'));rect(130,140,18,10,C('#3a2a1e'));rect(150,140,14,10,C('#3a2a1e'));
  g.line(134,148,138,142,C('#dfe6f4'));g.line(141,148,145,142,C('#dfe6f4'));g.line(154,148,160,143,C('#c8d0e0'));rect(166,140,2,10,C('#6a4528'));}
 /* ---- Ichiraku Ramen ---- */
 {rect(176,142,30,12,C('#c89a68'));rect(176,142,30,2,C('#6a4528'));rect(178,144,26,9,C('#4a2c18'));g.poly([[174,142],[208,142],[205,134],[177,134]],C('#e8e0d0'));g.poly([[174,142],[208,142],[207,139],[175,139]],C('#d84a3a'));
  for(let i=0;i<5;i++){rect(179+i*5,144,4,7,C('#f6f0e0'));rect(180+i*5,146,2,3,C('#c83a30'));}rect(176,153,30,2,C('#7a5a3a'));rect(180,148,6,2,C('#f4d078'));rect(194,148,6,2,C('#f4d078'));}
 /* ---- Dojo ---- */
 {const x=214,b=152;rect(x,b-26,62,26,C('#eadcb6'));rect(x+42,b-26,20,26,C('#cdb88e'));for(const bx of [0,14,30,46,60])rect(x+bx,b-26,2,26,C('#6a4528'));rect(x,b-1,62,1,C('#6a4528'));
  const d1=ROOF.b;g.poly([[x-8,b-26],[x+70,b-26],[x+62,b-38],[x+0,b-38]],d1[1]);g.poly([[x+0,b-38],[x+62,b-38],[x+54,b-50],[x+8,b-50]],d1[0]);
  for(let i=-6;i<68;i+=3)g.line(x+i,b-27,Math.round(x+i*.9+3),b-37,d1[1],[d1[0]]);g.line(x+8,b-50,x+54,b-50,d1[2]);g.line(x+0,b-38,x+62,b-38,d1[2]);g.line(x-8,b-26,x+70,b-26,C('#2a3250'));
  rect(x+25,b-22,14,18,C('#c8362e'));rect(x+25,b-22,14,2,C('#9a2822'));const wh=C('#fff4dc');g.ell(x+32,b-13,4,4,wh);g.poly([[x+29,b-11],[x+35,b-11],[x+32,b-18]],C('#c8362e'));g.line(x+28,b-14,x+36,b-14,C('#c8362e'));
  for(const dx of [8,16,48,55]){rect(x+dx,b-20,5,14,C('#4a2c18'));rect(x+dx,b-20,5,1,C('#2a1608'));}}
 /* ---- Academia ---- */
 {const x=284,b=152;rect(x,b-22,40,22,C('#f4ecd6'));rect(x+28,b-22,12,22,C('#d8cdae'));for(let i=0;i<4;i++){rect(x+3+i*9,b-16,5,8,C('#fbe08a'));rect(x+5+i*9,b-16,1,8,C('#5a3a22'));}rect(x+17,b-9,7,9,C('#5a3a22'));
  const r=ROOF.r;g.poly([[x-5,b-22],[x+45,b-22],[x+37,b-32],[x+3,b-32]],r[1]);g.poly([[x+3,b-32],[x+37,b-32],[x+28,b-40],[x+12,b-40]],r[0]);for(let i=-3;i<46;i+=3)g.line(x+i,b-23,Math.round(x+i*.9+2),b-31,r[1],[r[0]]);g.line(x+12,b-40,x+28,b-40,r[2]);g.line(x+3,b-32,x+37,b-32,r[2]);
  g.ell(x+20,b-35,4,4,C('#fffdf0'));g.line(x+20,b-35,x+20,b-38,C('#3a2a1e'));g.line(x+20,b-35,x+22,b-34,C('#3a2a1e'));rect(x+48,b-46,2,46,C('#6a4528'));g.poly([[x+50,b-46],[x+61,b-43],[x+50,b-40]],C('#d84a3a'));}
 /* ---- Templo de Invocacao ---- */
 {const x=330,b=156;house(x+8,152,26,18,[C('#4a3a2a'),C('#33281c'),C('#6e5538')],{wall:'#e4d4ac',nodoor:true});
  const tr=C('#d63a2a'),tr2=C('#a82a20'),blk=C('#26262e');rect(x+0,b-38,5,38,tr);rect(x+40,b-38,5,38,tr);rect(x+3,b-38,2,38,tr2);rect(x+43,b-38,2,38,tr2);rect(x+8,b-30,29,3,tr);rect(x-5,b-42,55,5,tr);g.poly([[x-9,b-42],[x+54,b-42],[x+48,b-48],[x-3,b-48]],blk);rect(x-5,b-42,55,1,C('#f08a6a'));rect(x+19,b-42,7,12,C('#f4eed8'));rect(x+21,b-40,3,8,C('#c83a30'));
  rect(x-3,b-1,9,3,C('#8a8a92'));rect(x+39,b-1,9,3,C('#8a8a92'));}
 /* ---- cerejeiras ---- */
 const cherry=(tx,tb,sz)=>{g.poly([[tx-3*sz,tb],[tx-sz,tb-16*sz],[tx+sz,tb-16*sz],[tx+3*sz,tb]],C('#5c3a2c'));g.line(tx,Math.round(tb-14*sz),Math.round(tx-10*sz),Math.round(tb-24*sz),C('#4a2e22'));g.line(tx,Math.round(tb-14*sz),Math.round(tx+11*sz),Math.round(tb-23*sz),C('#4a2e22'));
  const p1=C('#f7a8c0'),p2=C('#ffc8d8'),p3=C('#e0809c');for(const [dx,dy,r] of [[0,-26,13],[-13,-22,10],[13,-21,10],[-6,-34,9],[7,-33,9],[0,-18,10]])g.ell(tx+dx*sz*.85,tb+dy*sz*.85,r*sz*.85,r*sz*.72,p1);
  for(const [dx,dy,r] of [[-4,-30,6],[8,-26,5],[-11,-24,4],[3,-37,4]])g.ell(tx+dx*sz*.85,tb+dy*sz*.85,r*sz*.8,r*sz*.55,p2);dots(tx-18,tb-46,tx+18,tb-14,p3,.12,[p1],tx+3);};
 cherry(40,166,1.1);cherry(350,170,1.25);
 /* ---- chao: grama e rua de pedra com perspectiva ---- */
 grad(152,160,[C('#86c25c'),C('#6aa84c')]);rect(0,159,W,1,C('#4a8a3a'));
 const bands=[[160,166],[166,172],[172,179],[179,187],[187,196],[196,206],[206,216]],t1=C('#dcc79a'),t2=C('#d0b88a'),jn=C('#a88e60'),hi=C('#ecdcb4');
 bands.forEach((b,bi)=>{const tw=14+bi*4;for(let y=b[0];y<b[1];y++)for(let x=0;x<W;x++){const col=Math.floor((x+(bi%2?tw/2:0))/tw);g.set(x,y,(col+bi)%3?t1:t2);}
  g.line(0,b[0],W-1,b[0],jn);for(let x=(bi%2?tw/2:0);x<W;x+=tw)for(let y=b[0];y<b[1];y++)g.set(Math.round(x),y,jn);g.line(0,b[0]+1,W-1,b[0]+1,hi,[t1,t2]);});
 dots(0,160,W,H,C('#b89c6a'),.05,[t1,t2],11);dots(0,160,W,H,C('#f0e2bc'),.04,[t1,t2],23);
 for(let i=0;i<22;i++){const x=Math.floor(konHash(i,31)*W),y=162+Math.floor(konHash(i,32)*50);g.ell(x,y,2.4,1.2,C('#6aa84c'));}
 for(let x=0;x<W;x+=7){if(x>118&&x<322)continue;rect(x,148,2,10,C('#7a5230'));}rect(0,151,118,2,C('#7a5230'));rect(322,151,62,2,C('#7a5230'));
 for(const x of [104,208,300]){rect(x,134,2,24,C('#4a2c18'));rect(x-4,126,10,10,C('#d63a2a'));rect(x-4,126,10,2,C('#7a2018'));rect(x-4,134,10,2,C('#7a2018'));rect(x-2,128,6,6,C('#fbd868'));}
 for(const [x,y] of [[96,160],[310,160]]){g.ell(x,y,4,3,C('#8a5a30'));g.line(x-4,y,x+4,y,C('#4a2c18'));}
 const cv=document.createElement('canvas');g.draw(cv,PAL,5);konStatic={cv,smoke,wins};
 /* ---- sprites animados: nuvens e moradores ---- */
 const cl=(w,seed)=>{const q=PixGrid(w,20),a=C('#ffffff'),b=C('#dbe8f6'),c2=C('#b8cde6');for(const [cx,cy,rx,ry] of [[.22,.62,.2,.3],[.4,.5,.22,.4],[.6,.5,.2,.38],[.78,.62,.2,.28],[.5,.7,.4,.26]])q.ell(w*cx,20*cy,w*rx,20*ry,a);q.poly([[2,18],[w-2,18],[w-6,13],[6,13]],b);q.line(4,19,w-4,19,c2);const cvs=document.createElement('canvas');q.draw(cvs,PAL,2);return cvs;};
 const npc=(skin,hair,top,bot,frame,band)=>{const q=PixGrid(10,20),S=C(skin),Hh=C(hair),T=C(top),B=C(bot),K=C('#2a1a12');q.ell(5,4,3,3.4,S);q.poly([[1,3],[2,0],[8,0],[9,3],[8,2],[2,2]],Hh);q.set(4,4,K);q.set(6,4,K);if(band){q.line(2,2,8,2,C('#3a5ab8'));q.set(5,2,C('#d8dce8'));}q.poly([[2,8],[8,8],[9,15],[1,15]],T);
  if(frame){q.poly([[2,15],[5,15],[4,19],[1,19]],B);q.poly([[5,15],[8,15],[9,19],[6,19]],B);}else{q.poly([[3,15],[5,15],[5,19],[3,19]],B);q.poly([[5,15],[7,15],[7,19],[5,19]],B);}q.outline(K);const cvs=document.createElement('canvas');q.draw(cvs,PAL,2);return cvs;};
 konSprites={clouds:[cl(64,1),cl(80,2),cl(56,3)],npcs:[['#f4d2b0','#3a2a1e','#6a8ac8','#3a3a5a'],['#e8c49c','#a85a2a','#c85a4a','#4a3a2a'],['#f4d2b0','#d8d0c0','#5a9a6a','#3a4a3a'],['#e8c49c','#2a2a34','#e0b84a','#3a3a4a'],['#f4d2b0','#4a3020','#4a5a3a','#2a3a2a',1],['#e8c49c','#c8a24a','#d88a3a','#3a3a5a',1],['#f4d2b0','#2a2a34','#8a5ab8','#3a3a4a'],['#e8c49c','#e0e0e0','#9a8a6a','#4a3a2a']].map(a=>[npc(a[0],a[1],a[2],a[3],0,a[4]),npc(a[0],a[1],a[2],a[3],1,a[4])])};}
function konTod(){const q=new URLSearchParams(location.search).get('hora'),d=new Date(),hr=q!=null&&q!==''&&!isNaN(+q)?+q:d.getHours()+d.getMinutes()/60;
 let night=0,warm=0;if(hr>=19.5||hr<5.5)night=1;else if(hr>=18)night=(hr-18)/1.5;else if(hr<7)night=(7-hr)/1.5;
 if(hr>=16&&hr<19.5)warm=Math.min(1,(hr-16)/2.5);else if(hr>=5.5&&hr<8)warm=(8-hr)/2.5*.6;return{night,warm};}
function drawKonoha(c,time,tint){
 if(!konStatic)konBuildStatic();
 c.save();c.imageSmoothingEnabled=false;c.drawImage(konStatic.cv,0,0,konStatic.cv.width,konStatic.cv.height,0,0,W,H);c.restore();
 c.save();c.imageSmoothingEnabled=false;
 [[10,8,3.2,0],[140,16,2,1],[236,6,4,2],[320,24,2.6,1],[-20,34,2.2,0]].forEach(q=>{const sp=konSprites.clouds[q[3]],w=sp.width/2,x=Math.round(((q[0]+time*q[2])%(W+w+40))-w-10);c.drawImage(sp,x,q[1],w,10);});
 c.restore();
 for(let i=0;i<5;i++){const x=((time*11+i*80)%(W+60))-30,y=22+(i*17)%38+Math.sin(time*.9+i)*3;drawBird(c,x,y,.8+i%3*.2,time*7+i*2);}
 for(const s of konStatic.smoke)for(let k=0;k<4;k++){const ph=(time*.3+k*.25+s[0]*.013)%1,x=s[0]+Math.sin(time*.8+k+s[0])*2+ph*6,y=s[1]-ph*22,r=1.4+ph*3.4;c.fillStyle=`rgba(244,244,248,${(1-ph)*.5})`;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
 for(let k=0;k<6;k++){const ph=(time*.5+k*.17)%1,x=191+Math.sin(time*1.6+k*2)*2.4,y=146-ph*14,r=1+ph*2.4;c.fillStyle=`rgba(255,255,255,${(1-ph)*.6})`;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
 c.globalCompositeOperation='lighter';for(const x of [105,209,301]){const f=.5+.5*Math.sin(time*5+x);orb(c,x+1,131,15,[[0,`rgba(255,196,96,${.34+.2*f})`],[1,'rgba(255,196,96,0)']]);}c.globalCompositeOperation='source-over';
 c.save();c.imageSmoothingEnabled=false;[[0,24,174,-1],[1,9,168,1],[2,16,171,-1],[3,12,177,1],[4,20,181,1],[5,30,172,-1],[6,8,166,1],[7,6,179,-1]].forEach(([n,sp,y,dir],i)=>{const ph=(time*sp*.006+i*.31)%1,x=dir>0?-12+ph*(W+24):W+12-ph*(W+24),fr=Math.floor(time*5+i)%2,spr=konSprites.npcs[n][fr];
  c.fillStyle='rgba(40,28,14,.3)';c.beginPath();c.ellipse(x,y+9,4.6,1.2,0,0,TAU);c.fill();c.save();c.translate(Math.round(x),y-1+(fr?0:-.5));if(dir<0)c.scale(-1,1);c.drawImage(spr,-5,-10,10,20);c.restore();});c.restore();
 const team=(typeof teamNow==='function'?teamNow():['sasuke']).slice(0,4),xs=[138,176,214,252];
 team.forEach((id,i)=>{c.fillStyle='rgba(40,28,14,.38)';c.beginPath();c.ellipse(xs[i],204,11,2.6,0,0,TAU);c.fill();});
 {const hb=hubMode,hs=heroS;hubMode=false;try{team.forEach((id,i)=>{const x=xs[i],br=Math.sin(time*2.2+i)*.6;
   if(id==='naruto'){blit(x,202,true,NARUTO,Object.assign({},N_READY,{crouch:3+br}),time,{noRefl:true,sc:.7});}
   else if(id==='gozu'||id==='meizu'){const ps=playSkin,rn=roleN;playSkin=id;roleN=true;try{blit(x,202,true,NARUTO,N_READY,time,{noRefl:true,sc:.7});}finally{playSkin=ps;roleN=rn;}}
   else{heroS=id;blit(x,202,false,SASUKE,Object.assign({},READY,{crouch:3+br}),time,{noRefl:true,sc:.7});}});}finally{hubMode=hb;heroS=hs;}}
 for(let i=0;i<26;i++){const ph=(time*.05+i*.0385)%1,src=i%2?[350,140]:[40,140],x=src[0]+Math.sin(time*1.2+i*2.1)*14+(ph-.2)*(i%2?-90:80),y=src[1]+ph*70+Math.sin(time*2+i)*3,a=time*2+i;c.save();c.translate(x,y);c.rotate(a);c.fillStyle=i%3?'rgba(255,190,210,.9)':'rgba(255,224,232,.9)';c.beginPath();c.ellipse(0,0,1.5,.8,0,0,TAU);c.fill();c.restore();}
 for(let i=0;i<8;i++){const ph=(time*.05+i*.125)%1,x=W+8-ph*(W+30)+Math.sin(time*1.5+i)*8,y=8+ph*180+Math.sin(time*2+i*3)*6,a=time*2+i;c.save();c.translate(x,y);c.rotate(a);c.fillStyle=i%2?'#5aa84a':'#d0883a';c.beginPath();c.ellipse(0,0,1.7,.85,0,0,TAU);c.fill();c.restore();}
 c.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const a=.035+.02*Math.sin(time*.5+i*1.6);const gr=c.createLinearGradient(322,50,322-(i+1)*70,200);gr.addColorStop(0,`rgba(255,236,170,${a*2})`);gr.addColorStop(1,'rgba(255,236,170,0)');c.fillStyle=gr;c.beginPath();c.moveTo(316,50);c.lineTo(332,50);c.lineTo(332-(i+1)*80,216);c.lineTo(250-(i+1)*80,216);c.fill();}c.globalCompositeOperation='source-over';
 const tod=konTod();
 if(tod.warm>0){c.fillStyle=`rgba(255,150,70,${.16*tod.warm})`;c.fillRect(0,0,W,H);}
 if(tod.night>0){orb(c,322,58,34,[[0,`rgba(14,28,84,${.98*tod.night})`],[.6,`rgba(14,28,84,${.9*tod.night})`],[1,'rgba(14,28,84,0)']]); /* o sol some de noite */
  c.fillStyle=`rgba(10,18,64,${.58*tod.night})`;c.fillRect(0,0,W,H);
  c.globalCompositeOperation='lighter';
  for(const w of konStatic.wins){const f=.75+.25*Math.sin(time*3+w[0]*1.7);orb(c,w[0],w[1],7,[[0,`rgba(255,206,120,${.5*tod.night*f})`],[1,'rgba(255,206,120,0)']]);}
  for(const x of [105,209,301])orb(c,x+1,131,24,[[0,`rgba(255,190,90,${.55*tod.night})`],[1,'rgba(255,190,90,0)']]);
  orb(c,191,140,26,[[0,`rgba(255,210,150,${.4*tod.night})`],[1,'rgba(255,210,150,0)']]);
  c.globalCompositeOperation='source-over';
  for(let i=0;i<46;i++){const x=konHash(i,71)*W,y=konHash(i,72)*92,tw=.4+.6*Math.abs(Math.sin(time*1.4+i*2.3));c.fillStyle=`rgba(255,255,255,${.85*tod.night*tw})`;c.fillRect(Math.floor(x),Math.floor(y),1,1);}
  orb(c,70,44,26,[[0,`rgba(235,240,255,${.5*tod.night})`],[1,'rgba(235,240,255,0)']]);c.fillStyle=`rgba(244,246,255,${tod.night})`;c.beginPath();c.arc(70,44,9,0,TAU);c.fill();c.fillStyle=`rgba(190,200,225,${.7*tod.night})`;for(const [dx,dy,r] of [[-3,-2,2.2],[3,2,2.6],[1,-5,1.4]]){c.beginPath();c.arc(70+dx,44+dy,r,0,TAU);c.fill();}}
 const vg=c.createRadialGradient(W/2,H*.55,H*.5,W/2,H*.55,W*.66);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(30,14,10,.28)');c.fillStyle=vg;c.fillRect(0,0,W,H);
 if(tint){c.fillStyle=tint;c.fillRect(-20,-20,W+40,H+40);}}
if(typeof konSpots==='function')konSpots();
