/* ---------- Arte do mapa da campanha (pixel art) ----------
   O mapa e pintado em baixa resolucao (1 pixel = 4 unidades do mapa), com paleta fixa, tramado ordenado e iluminacao,
   e ampliado sem suavizar. Os locais, caminhos e a ficha da equipe sao desenhados por cima em blocos de 4, no mesmo estilo.
   (As funcoes usam coordenadas do mapa: NODES[*].x/y vem de 00-data.js; mapSel, mapHover, mapTok... vem de 19-map.js.) */
const MAP_S=4;
const MAP_BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const MAP_PAL={
 grass:['#86b85a','#6fa04d','#588542'],train:['#b2d276','#9bbd63','#82a653'],forest:['#437f3d','#33693a','#265430'],
 desert:['#ecca82','#d8ae63','#c19654'],snow:['#f6fafd','#dbe8f2','#bdd2e4'],rock:['#a2a4bc','#8789a4','#6e708a'],village:['#94bd62','#7ca754','#659044'],
 beach:'#f2e6b4',beachD:'#dccf95',cliff1:'#6c543a',cliff2:'#473621',
 foam:'#eaf7ff',sh:'#86d6dc',w1:'#52aac8',w2:'#3380ae',w3:'#235a92',w4:'#193f74',wave:'#3b84b8'};
function mapHash(x,y){let h=(x*374761393+y*668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296;}
function mapNoise(x,y,s){const gx=Math.floor(x/s),gy=Math.floor(y/s),fx=x/s-gx,fy=y/s-gy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),a=mapHash(gx,gy),b=mapHash(gx+1,gy),c=mapHash(gx,gy+1),d=mapHash(gx+1,gy+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
function mapFbm(x,y){return mapNoise(x,y,22)*.5+mapNoise(x,y,9)*.3+mapNoise(x,y,4)*.2;}

function paintMap(){
 const SW=MAP_W/MAP_S,SH=MAP_H/MAP_S,S=MAP_S;
 const sm=document.createElement('canvas');sm.width=SW;sm.height=SH;const c=sm.getContext('2d',{willReadFrequently:true});
 /* ---- mascara da terra ---- */
 const mk=document.createElement('canvas');mk.width=SW;mk.height=SH;const m=mk.getContext('2d');m.fillStyle='#000';
 const blob=(cx,cy,rx,ry,ph)=>{m.beginPath();for(let i=0;i<=72;i++){const a=i/72*Math.PI*2,k=1+.16*Math.sin(3*a+ph)+.1*Math.sin(5*a+ph*2)+.06*Math.sin(9*a+ph*3)+.035*Math.sin(15*a+ph*5);const x=cx+Math.cos(a)*rx*k,y=cy+Math.sin(a)*ry*k;i?m.lineTo(x/S,y/S):m.moveTo(x/S,y/S);}m.closePath();m.fill();};
 for(const[a,b,rx,ry,p]of [[210,335,250,190,1],[590,300,330,250,2],[900,330,270,230,3],[140,330,150,130,4]])blob(a,b,rx,ry,p);
 const md=m.getImageData(0,0,SW,SH).data,land=new Uint8Array(SW*SH);for(let i=0;i<SW*SH;i++)land[i]=md[i*4+3]>110?1:0;
 const L=(x,y)=>x>=0&&y>=0&&x<SW&&y<SH&&land[y*SW+x];
 /* ---- distancia a costa (positiva em terra, negativa na agua) ---- */
 const R=14,dist=new Int8Array(SW*SH);
 for(let y=0;y<SH;y++)for(let x=0;x<SW;x++){const me=land[y*SW+x];let best=R;for(let dy=-R;dy<=R&&best>1;dy++)for(let dx=-R;dx<=R;dx++){const d=Math.max(Math.abs(dx),Math.abs(dy));if(d>=best)continue;const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=SW||yy>=SH)continue;if(land[yy*SW+xx]!==me)best=d;}dist[y*SW+x]=me?best:-best;}
 /* ---- biomas (centros em unidades do mapa) ---- */
 const BIO=[['forest',550,165,190,160],['desert',540,485,185,150],['snow',805,490,150,120],['rock',985,290,170,150],['village',135,330,120,100],['train',340,310,120,100]];
 const biomeAt=(x,y)=>{const wx=x*S,wy=y*S;let best='grass',bs=.3,n=mapFbm(x,y);for(const[k,cx,cy,rx,ry]of BIO){const d=Math.hypot((wx-cx)/(rx*1.12),(wy-cy)/(ry*1.12)),w=1-d+(n-.5)*.45;if(w>bs){bs=w;best=k;}}return best;};
 const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
 const img=c.createImageData(SW,SH),D=img.data,put=(x,y,col)=>{const i=(y*SW+x)*4,v=hex(col);D[i]=v[0];D[i+1]=v[1];D[i+2]=v[2];D[i+3]=255;};
 const bio=new Array(SW*SH);
 for(let y=0;y<SH;y++)for(let x=0;x<SW;x++){const d=dist[y*SW+x],bay=MAP_BAYER[(y&3)*4+(x&3)]/16;
  if(d>0){ /* terra */
   const b=biomeAt(x,y);bio[y*SW+x]=b;const P=MAP_PAL[b],n=mapFbm(x+31,y+17),lit=(dist[Math.max(0,y-1)*SW+Math.max(0,x-1)]-dist[Math.min(SH-1,y+1)*SW+Math.min(SW-1,x+1)])*.07;
   if(d===1&&b!=='snow'&&b!=='rock'){put(x,y,(x+y)%3?MAP_PAL.beach:MAP_PAL.beachD);continue;}
   const v=n*.9+lit+(bay-.5)*.22+(d<4?-(.04*(4-d)):0);put(x,y,v>.6?P[0]:v>.4?P[1]:P[2]);}
  else{ /* agua */
   const dd=-d,n=mapNoise(x*1.7+9,y*1.7,6);let col;
   if(dd<=1)col=((x+y+(n>.5?1:0))&1)?MAP_PAL.foam:MAP_PAL.sh;
   else if(dd<=3)col=bay<.55?MAP_PAL.sh:MAP_PAL.w1;
   else if(dd<=6)col=dd<5?MAP_PAL.w1:(bay<.5?MAP_PAL.w1:MAP_PAL.w2);
   else if(dd<=10)col=bay<(11-dd)/5?MAP_PAL.w2:MAP_PAL.w3;
   else col=(n>.62&&bay<.5)?MAP_PAL.w3:MAP_PAL.w4;
   /* falesia: 1-2 pixels escuros logo abaixo da terra */
   if(L(x,y-1))col=MAP_PAL.cliff1;else if(!L(x,y-1)&&L(x,y-2)&&dd<=2)col=MAP_PAL.cliff2;
   put(x,y,col);}}
 c.putImageData(img,0,0);
 /* ondas no mar aberto: tracinhos claros */
 c.fillStyle=MAP_PAL.wave;for(let i=0;i<180;i++){const x=Math.floor(mapHash(i,1)*SW),y=Math.floor(mapHash(i,2)*SH);if(dist[y*SW+x]<-9){c.fillRect(x,y,3,1);c.fillRect(x+1,y-1,1,1);}}
 /* ---- pontos livres para decoracao: longe de caminhos, locais e da costa ---- */
 const free=(x,y,dmin)=>{if(!L(x,y)||dist[y*SW+x]<dmin)return false;for(const id in NODES)if(Math.hypot(x*S-NODES[id].x,y*S-NODES[id].y)<44)return false;
  for(const[a,b]of EDGES){const e=edgePts(a,b);for(let k=0;k<=20;k++){const q=bez(e,k/20);if(Math.hypot(x*S-q[0],y*S-q[1])<20)return false;}}return true;};
 const rect=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
 const things=[];
 /* arvores: pinheiros em floresta, neve, e arbustos na grama */
 for(let gy=3;gy<SH-3;gy+=3)for(let gx=3;gx<SW-3;gx+=3){const x=gx+Math.floor(mapHash(gx,gy)*3)-1,y=gy+Math.floor(mapHash(gy,gx)*3)-1;if(!L(x,y))continue;const b=bio[y*SW+x],h=mapHash(x,y+7);
  if(b==='forest'&&h<.78&&free(x,y,3))things.push(['pine',x,y,0]);else if(b==='snow'&&h<.2&&free(x,y,3))things.push(['pine',x,y,1]);
  else if((b==='grass'||b==='train'||b==='village')&&h<.16&&free(x,y,3))things.push(['bush',x,y,b==='train'?1:0]);
  else if(b==='desert'&&h<.1&&free(x,y,3))things.push(['cactus',x,y,0]);
  else if(b==='rock'&&h<.12&&free(x,y,3))things.push(['rock',x,y,0]);}
 /* montanhas (posicoes antigas em unidades do mapa) */
 for(const[x,y,s]of [[690,420,38],[735,395,30],[880,570,34],[935,545,28],[1060,400,30],[1090,230,34],[930,150,32],[1040,170,28],[420,130,26],[280,470,26],[200,215,24]]){const sx=Math.round(x/S),sy=Math.round(y/S);if(L(sx,sy))things.push(['mount',sx,sy,Math.round(s/1.9)]);}
 things.sort((a,b)=>a[2]-b[2]);
 for(const[k,x,y,v]of things){
  if(k==='pine'){const sn=v===1,dk=sn?'#9db8cc':'#183f24',md=sn?'#cfe0ec':'#2a6334',lt=sn?'#ffffff':'#3c8040';rect(x-1,y,3,1,'rgba(0,0,0,.25)');rect(x+1,y+1,3,1,'#00000040');
   rect(x,y-1,1,2,'#4a3020');for(let i=0;i<5;i++){const w=1+i;rect(x-Math.floor(w/2),y-2-i,w+ (i>0?0:0),1,i%2?md:lt);}rect(x+1,y-4,1,3,dk);rect(x,y-7,1,2,sn?'#ffffff':lt);}
  else if(k==='bush'){rect(x-1,y,4,1,'#00000030');rect(x-1,y-2,3,2,v?'#5e8f3c':'#4c7e38');rect(x,y-3,2,1,'#7fb04e');rect(x+1,y-2,1,1,'#3a6a30');}
  else if(k==='cactus'){rect(x,y-4,1,5,'#4d8a40');rect(x-1,y-3,1,1,'#4d8a40');rect(x+1,y-2,1,1,'#4d8a40');rect(x,y-4,1,1,'#7fb85a');rect(x-1,y,3,1,'#00000030');}
  else if(k==='rock'){rect(x-1,y-1,3,2,'#6f7188');rect(x,y-2,2,1,'#a6a8c0');rect(x,y+1,3,1,'#00000030');}
  else if(k==='mount'){const h=v,hw=Math.round(h*.95);for(let r=0;r<=h;r++){const half=Math.round(r*hw/h);for(let dx=-half;dx<=half;dx++){const X=x+dx,Y=y-h+r;const edge=Math.abs(dx)===half,snow=r<h*.38+((dx+r)&1)*.8;
     let col=dx<0?'#a8aac0':'#727590';if(dx>=0&&dx>half*.55)col='#5f6280';if(snow&&!edge)col=dx<0?'#ffffff':'#d2dcea';if(edge)col='#3a3c52';c.fillStyle=col;c.fillRect(X,Y,1,1);}}
    rect(x-hw,y+1,hw*2+3,1,'#00000038');rect(x-Math.floor(h*.2),y-Math.floor(h*.5),1,Math.floor(h*.45),'#8f92aa');}
 }
 /* dunas */
 c.fillStyle='#c0944f';for(let i=0;i<46;i++){const x=Math.floor(mapHash(i,41)*SW),y=Math.floor(mapHash(i,42)*SH);if(bio[y*SW+x]==='desert'&&free(x,y,3)){const w=4+Math.floor(mapHash(i,43)*5);for(let k=0;k<w;k++)c.fillRect(x+k,y-Math.round(Math.sin(k/w*Math.PI)*1.6),1,1);c.fillStyle='#f4dc9c';for(let k=1;k<w-1;k++)c.fillRect(x+k,y-1-Math.round(Math.sin(k/w*Math.PI)*1.6),1,1);c.fillStyle='#c0944f';}}
 /* rio da vila: curva de Bezier, 2 pixels de largura */
 const rv=[[130,170],[60,260],[210,330],[130,470]];for(let i=0;i<=120;i++){const t=i/120,u=1-t,X=u*u*u*rv[0][0]+3*u*u*t*rv[1][0]+3*u*t*t*rv[2][0]+t*t*t*rv[3][0],Y=u*u*u*rv[0][1]+3*u*u*t*rv[1][1]+3*u*t*t*rv[2][1]+t*t*t*rv[3][1],x=Math.round(X/S),y=Math.round(Y/S);if(!L(x,y))continue;rect(x-1,y,3,1,'#2f6aa8');rect(x,y,1,1,'#7cc4ee');if(i%7===0)rect(x,y-1,1,1,'#eaf7ff');}
 /* casas de Konoha */
 for(const[x,y]of [[82,360],[112,378],[150,372],[178,350],[94,306],[160,300],[120,340]]){const sx=Math.round(x/S),sy=Math.round(y/S);rect(sx-3,sy+3,8,1,'#00000035');rect(sx-3,sy-1,7,4,'#d9b87a');rect(sx-3,sy+2,7,1,'#b99860');rect(sx,sy+1,2,2,'#5a3a1c');
  for(let i=0;i<4;i++)rect(sx-4+i,sy-2-i,9-i*2,1,i%2?'#c8502e':'#d9603a');rect(sx-4,sy-1,9,1,'#8e2e1a');}
 /* Vale do Fim: cachoeira e as duas estatuas */
 const vx=Math.round(985/S),vy=Math.round(285/S);rect(vx-1,vy-7,3,8,'#bfe4ff');for(let i=0;i<6;i++)rect(vx-1+(i%3),vy-7+i,1,1,'#ffffff');rect(vx-3,vy+1,7,1,'#eaf7ff');
 for(const sx of [vx-8,vx+7]){rect(sx-2,vy-5,5,8,'#5a5e7c');rect(sx-2,vy-5,2,8,'#7a7e9c');rect(sx-1,vy-8,3,3,'#8a8eac');rect(sx-1,vy-7,1,1,'#2a2c40');rect(sx-3,vy+3,7,1,'#00000040');}
 /* barquinhos no mar */
 for(const[x,y]of [[18,148],[262,18],[150,152]]){if(dist[y*SW+x]>-4)continue;rect(x-3,y+1,7,1,'#6c543a');rect(x-2,y+2,5,1,'#473621');rect(x,y-5,1,6,'#d8c8a0');rect(x+1,y-5,3,4,'#f4ecd0');rect(x+1,y-3,3,1,'#d8c8a0');rect(x-3,y+3,9,1,'#eaf7ff80');}
 /* bussola */
 const bx=Math.round(1100/S),by=Math.round(572/S);c.strokeStyle='#e8d8a0';rect(bx,by-9,1,19,'#e8d8a0');rect(bx-9,by,19,1,'#e8d8a0');for(const[dx,dy]of [[-2,-2],[2,-2],[-2,2],[2,2],[-3,-3],[3,-3],[-3,3],[3,3]])rect(bx+dx,by+dy,1,1,'#b89a5a');rect(bx-1,by-10,3,3,'#c43a2a');rect(bx,by-13,1,1,'#fff6d8');rect(bx-2,by-16,5,1,'#e8d8a0');rect(bx-2,by-14,1,3,'#e8d8a0');rect(bx+2,by-14,1,3,'#e8d8a0');rect(bx-1,by-13,1,1,'#e8d8a0');rect(bx,by-12,1,1,'#e8d8a0');
 /* moldura dourada com cantos */
 rect(0,0,SW,2,'#b8924a');rect(0,SH-2,SW,2,'#b8924a');rect(0,0,2,SH,'#b8924a');rect(SW-2,0,2,SH,'#b8924a');
 rect(2,2,SW-4,1,'#6e5424');rect(2,SH-3,SW-4,1,'#6e5424');rect(2,2,1,SH-4,'#6e5424');rect(SW-3,2,1,SH-4,'#6e5424');
 for(const[x,y]of [[0,0],[SW-6,0],[0,SH-6],[SW-6,SH-6]]){rect(x,y,6,6,'#d8b45a');rect(x+1,y+1,4,4,'#6e5424');rect(x+2,y+2,2,2,'#ffe9a8');}
 /* ---- amplia sem suavizar ---- */
 const out=document.createElement('canvas');out.width=MAP_W;out.height=MAP_H;const o=out.getContext('2d');o.imageSmoothingEnabled=false;o.drawImage(sm,0,0,MAP_W,MAP_H);
 const g=o.createRadialGradient(MAP_W/2,MAP_H/2,MAP_H*.5,MAP_W/2,MAP_H/2,MAP_W*.62);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,12,.38)');o.fillStyle=g;o.fillRect(0,0,MAP_W,MAP_H);
 return out;}

/* ---- pecas desenhadas por cima do mapa, sempre alinhadas a grade de 4 ---- */
function mapSn(v){return Math.round(v/MAP_S)*MAP_S;}
function mapCircle(c,cx,cy,r,col){for(let dy=-r;dy<r;dy+=MAP_S){const w=Math.sqrt(Math.max(0,r*r-(dy+MAP_S/2)*(dy+MAP_S/2))),hw=mapSn(w);if(hw<=0)continue;c.fillStyle=col;c.fillRect(cx-hw,cy+dy,hw*2,MAP_S);}}
function mapPxText(c,txt,x,y,font,col,out){c.font=font;c.textAlign='center';c.textBaseline='middle';c.fillStyle=out||'#140c06';for(const[dx,dy]of [[-2,0],[2,0],[0,-2],[0,2],[-2,-2],[2,-2],[-2,2],[2,2]])c.fillText(txt,x+dx,y+dy);c.fillStyle=col;c.fillText(txt,x,y);}
function mapDraw(ts){
 const cv=document.getElementById('mapcv');if(!cv){mapRAF=null;return;}
 const c=cv.getContext('2d'),t=ts/1000;c.imageSmoothingEnabled=false;if(!mapBG)mapBG=paintMap();c.drawImage(mapBG,0,0);
 /* caminhos: estrada de terra em pixels; concluidos ganham pontinhos dourados correndo */
 for(const[a,b]of EDGES){const e=edgePts(a,b),sa=nodeState(a),sb=nodeState(b),on=sa==='cleared'&&sb==='cleared',open=sa!=='locked'&&sb!=='locked';
  const pts=[];let px=-1,py=-1;for(let k=0;k<=160;k++){const q=bez(e,k/160),X=mapSn(q[0]),Y=mapSn(q[1]);if(X!==px||Y!==py){pts.push([X,Y]);px=X;py=Y;}}
  for(const[X,Y]of pts){c.fillStyle='rgba(20,10,0,.35)';c.fillRect(X-2,Y+2,MAP_S+4,MAP_S+2);}
  pts.forEach(([X,Y],i)=>{c.fillStyle=open?'#5a4026':'#3c3426';c.fillRect(X-2,Y-2,MAP_S+4,MAP_S+4);});
  pts.forEach(([X,Y],i)=>{const dash=(i%3)!==2;c.fillStyle=on?(((i+Math.floor(t*10))%6<2)?'#ffe69a':'#d9a640'):open?(dash?'#e8d3a0':'#c9b27a'):(dash?'#7b6f56':'#625842');c.fillRect(X,Y,MAP_S,MAP_S);});}
 /* locais */
 for(const id in NODES){const n=NODES[id],st=nodeState(id),sel=mapSel===id,hov=mapHover===id,cx=mapSn(n.x),cy=mapSn(n.y),r=24+(sel?4:0)+(hov?4:0);
  if(st==='open'||sel){const p=(Math.sin(t*3)+1)/2;mapCircle(c,cx,cy,r+8+Math.round(p*2)*4,`rgba(255,217,122,${.18+.2*p})`);}
  mapCircle(c,cx+4,cy+8,r+4,'rgba(10,6,0,.45)');
  const rim=st==='cleared'?'#ffd97a':st==='open'?'#fff2c0':'#4a4a58',kind=n.kind==='chefe'?['#c84432','#8a2a22','#5a1a18']:n.kind==='vila'?['#58b868','#3c8a4c','#256234']:['#e8c068','#b8883c','#7e5a22'];
  const cols=st==='locked'?['#7a7a88','#5a5a68','#3a3a46']:kind;
  mapCircle(c,cx,cy,r+4,'#140c06');mapCircle(c,cx,cy,r,rim);mapCircle(c,cx,cy,r-4,'#140c06');mapCircle(c,cx,cy,r-8,cols[1]);
  /* brilho no topo e sombra embaixo (3 tons) */
  c.save();c.beginPath();c.rect(cx-r,cy-r,r*2,r*2);c.clip();c.fillStyle=cols[0];for(let dy=-r+8;dy<-4;dy+=MAP_S){const w=Math.sqrt(Math.max(0,(r-8)*(r-8)-(dy+2)*(dy+2)));const hw=mapSn(w)-4;if(hw>0)c.fillRect(cx-hw,cy+dy,hw*2,MAP_S);}
  c.fillStyle=cols[2];for(let dy=8;dy<r-8;dy+=MAP_S){const w=Math.sqrt(Math.max(0,(r-8)*(r-8)-(dy+2)*(dy+2)));const hw=mapSn(w)-4;if(hw>0)c.fillRect(cx-hw,cy+dy,hw*2,MAP_S);}c.restore();
  mapPxText(c,NODE_GLYPH[id]||'?',cx,cy+2,"900 28px 'Yu Mincho','MS Mincho','Noto Serif JP',serif",st==='locked'?'#b8b8c8':'#fffbe8','#2a1a08');
  if(st==='cleared'&&n.kind!=='vila'){const bx=cx+r-4,by=cy-r+4;mapCircle(c,bx,by,16,'#140c06');mapCircle(c,bx,by,12,'#2c8a4c');c.fillStyle='#fff';c.fillRect(bx-6,by,4,4);c.fillRect(bx-2,by+4,4,4);c.fillRect(bx+2,by,4,4);c.fillRect(bx+6,by-4,4,4);}
  if(st==='locked'){const bx=cx+r-4,by=cy-r+4;c.fillStyle='#140c06';c.fillRect(bx-10,by-6,20,18);c.fillStyle='#e8b830';c.fillRect(bx-8,by-2,16,12);c.fillStyle='#8a6a14';c.fillRect(bx-8,by+6,16,4);c.fillStyle='#140c06';c.fillRect(bx-2,by+2,4,6);c.fillStyle='#bfc0d0';c.fillRect(bx-6,by-10,4,8);c.fillRect(bx+2,by-10,4,8);c.fillRect(bx-6,by-10,12,4);}
  mapPxText(c,n.name.toUpperCase(),cx,cy+r+22,"700 16px Consolas,'Courier New',monospace",st==='locked'?'#b0b0c4':'#fff6d8');}
 /* ficha da equipe: retrato num quadro dourado com seta, balancando */
 const tk=mapTok||{x:NODES[CAMP.at].x,y:NODES[CAMP.at].y},bob=Math.round(Math.sin(t*4)*1)*MAP_S/2,tx=mapSn(tk.x),ty=mapSn(tk.y-58)+bob;
 c.fillStyle='rgba(10,6,0,.4)';c.fillRect(tx-20,ty+28,44,8);
 c.fillStyle='#140c06';c.fillRect(tx-28,ty-28,56,56);c.fillStyle='#ffd97a';c.fillRect(tx-24,ty-24,48,48);c.fillStyle='#140c06';c.fillRect(tx-20,ty-20,40,40);
 c.fillStyle='#ffd97a';c.fillRect(tx-8,ty+24,16,4);c.fillRect(tx-4,ty+28,8,4);
 const pt=document.getElementById(HERO_PT[mapHero]||'ptN');if(pt){c.imageSmoothingEnabled=false;c.drawImage(pt,tx-20,ty-20,40,40);}
 mapRAF=requestAnimationFrame(mapDraw);}
