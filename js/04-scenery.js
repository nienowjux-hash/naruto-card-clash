/* ---------- background ---------- */
const BW=Math.round(W*RES),BH=Math.round(H*RES);
const bgSky=document.createElement('canvas'),bgFront=document.createElement('canvas');bgSky.width=bgFront.width=BW;bgSky.height=bgFront.height=BH;
const cloudSpr=[];let bgRefl=null;
/* cenario em pixel art: reduz para 1 pixel por unidade do mundo (a mesma escala dos sprites), reduz a paleta com tramado ordenado e amplia sem suavizar */
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function pixelateBG(cnv,step){const sm=document.createElement('canvas');sm.width=W;sm.height=H;const sx=sm.getContext('2d',{willReadFrequently:true});sx.imageSmoothingEnabled=true;sx.imageSmoothingQuality='high';sx.drawImage(cnv,0,0,W,H);
 const id=sx.getImageData(0,0,W,H),d=id.data;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4,b=(BAYER[(y&3)*4+(x&3)]/16-.47)*step*.9;for(let c=0;c<3;c++)d[i+c]=Math.max(0,Math.min(255,Math.round((d[i+c]+b)/step)*step));d[i+3]=d[i+3]<110?0:255;}
 sx.putImageData(id,0,0);const cx=cnv.getContext('2d');cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cnv.width,cnv.height);cx.imageSmoothingEnabled=false;cx.drawImage(sm,0,0,cnv.width,cnv.height);}
function buildBG(){
 let c=bgSky.getContext('2d');c.setTransform(RES,0,0,RES,0,0);
 let gr=c.createLinearGradient(0,0,0,152);[[0,'#040620'],[.28,'#140e44'],[.55,'#33205f'],[.75,'#7c3a7e'],[.9,'#cf6580'],[1,'#ffb98c']].forEach(s=>gr.addColorStop(s[0],s[1]));c.fillStyle=gr;c.fillRect(0,0,W,152);
 const rn=R(42);
 for(let i=0;i<170;i++){const x=rn()*W,y=rn()*86,s=.2+rn()*.5;orb(c,x,y,s*1.6,[[0,`rgba(255,255,255,${.6+rn()*.4})`],[1,'rgba(180,200,255,0)']]);if(rn()<.1){c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=.2;c.beginPath();c.moveTo(x-2,y);c.lineTo(x+2,y);c.moveTo(x,y-2);c.lineTo(x,y+2);c.stroke();}}
 // milky way band
 c.save();c.translate(260,30);c.rotate(-.5);for(let i=0;i<40;i++){orb(c,(rn()-.5)*200,(rn()-.5)*14,10+rn()*10,[[0,'rgba(190,170,255,.05)'],[1,'rgba(190,170,255,0)']]);}c.restore();
 orb(c,192,50,130,[[0,'rgba(255,225,190,.30)'],[.35,'rgba(255,190,200,.12)'],[1,'rgba(255,170,200,0)']]);
 orb(c,192,50,46,[[0,'rgba(255,240,215,.5)'],[1,'rgba(255,220,190,0)']]);
 let mg=c.createRadialGradient(188,46,2,192,50,22);mg.addColorStop(0,'#fffdf2');mg.addColorStop(.7,'#fff0cc');mg.addColorStop(1,'#f2d9a6');c.fillStyle=mg;c.beginPath();c.arc(192,50,21,0,TAU);c.fill();
 c.fillStyle='rgba(190,150,100,.28)';[[-7,-6,5],[6,4,6.5],[-3,10,3.4],[10,-9,3],[-12,6,2.6],[2,-13,2.4]].forEach(q=>{c.beginPath();c.arc(192+q[0],50+q[1],q[2],0,TAU);c.fill();});
 const L=[['#8a5a98','#5a3a78',101,11,.027,8,.061,5,.15],['#5a3472','#3a2060',112,10,.031,7,.071,4,.17],['#3c2260','#271446',121,12,.021,6,.09,3,.21],['#26143f','#170b2c',132,8,.037,5,.11,3,.19]];
 for(const l of L){const g2=c.createLinearGradient(0,l[2]-12,0,152);g2.addColorStop(0,l[0]);g2.addColorStop(1,l[1]);c.fillStyle=g2;c.beginPath();c.moveTo(0,152);for(let x=0;x<=W;x+=1.5){c.lineTo(x,l[2]+l[3]*Math.sin(x*l[4]+l[2])+l[5]*Math.sin(x*l[6]+1.3)+l[7]*Math.sin(x*l[8]));}c.lineTo(W,152);c.closePath();c.fill();
  c.strokeStyle='rgba(255,170,160,.2)';c.lineWidth=.35;c.beginPath();for(let x=0;x<=W;x+=1.5){const y=l[2]+l[3]*Math.sin(x*l[4]+l[2])+l[5]*Math.sin(x*l[6]+1.3)+l[7]*Math.sin(x*l[8]);x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
 // pine silhouettes on far hill
 c.fillStyle='#1a0d30';const rp=R(77);for(let i=0;i<60;i++){const x=rp()*W;if(x>160&&x<224)continue;const yb=132+Math.sin(x*.037)*8*.9+3,h=5+rp()*6;poly(c,[[x-1.6,yb],[x,yb-h],[x+1.6,yb]],'#1a0d30');poly(c,[[x-1.2,yb-h*.5],[x,yb-h*1.2],[x+1.2,yb-h*.5]],'#1a0d30');}
 gr=c.createLinearGradient(0,112,0,152);gr.addColorStop(0,'rgba(255,150,140,0)');gr.addColorStop(1,'rgba(255,160,150,.3)');c.fillStyle=gr;c.fillRect(0,112,W,40);
 for(let i=0;i<3;i++){const cc=document.createElement('canvas');cc.width=Math.round(120*RES);cc.height=Math.round(34*RES);const x=cc.getContext('2d');x.setTransform(RES,0,0,RES,0,0);x.filter='blur(1.6px)';
  const r3=R(100+i*7);
  for(let j=0;j<7;j++){const cx=14+j*14+r3()*6,cy=18+r3()*7,rx=14+r3()*10,ry=3+r3()*3;x.fillStyle='rgba(58,34,92,.85)';x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,TAU);x.fill();x.fillStyle='rgba(246,160,170,.38)';x.beginPath();x.ellipse(cx-1,cy-ry*.5,rx*.8,ry*.4,0,0,TAU);x.fill();}
  cloudSpr.push(cc);}
 c=bgFront.getContext('2d');c.setTransform(RES,0,0,RES,0,0);
 gr=c.createLinearGradient(0,150,0,H);[[0,'#2e4f95'],[.25,'#203d82'],[.6,'#12245a'],[1,'#080e2e']].forEach(s=>gr.addColorStop(s[0],s[1]));c.fillStyle=gr;c.fillRect(0,150,W,H-150);
 gr=c.createLinearGradient(0,150,0,168);gr.addColorStop(0,'rgba(255,170,160,.35)');gr.addColorStop(1,'rgba(255,170,160,0)');c.fillStyle=gr;c.fillRect(0,150,W,18);
 const cg=c.createLinearGradient(0,70,0,152);cg.addColorStop(0,'#2c1b4c');cg.addColorStop(1,'#120a28');
 /* paredoes de rocha irregulares que abrem uma garganta; a cachoeira nasce de um entalhe no platô */
 const wallL=[[0,152],[0,92],[30,86],[60,80],[110,76],[138,70],[152,64],[162,58],[171,66],[163,80],[171,90],[166,102],[172,114],[168,128],[173,140],[170,152]];
 const wallR=wallL.map(p=>[W-p[0],p[1]]);
 poly(c,wallL,cg);poly(c,wallR,cg);
 poly(c,[[158,59],[170,62],[182,59],[196,61],[210,58],[222,61],[226,59],[224,72],[208,74],[194,71],[180,74],[166,72],[160,70]],'#2a1949');
 c.strokeStyle='rgba(205,190,255,.5)';c.lineWidth=.5;c.beginPath();c.moveTo(162,58);c.lineTo(170,61.5);c.lineTo(182,58.5);c.lineTo(196,60.5);c.lineTo(210,57.5);c.lineTo(222,60.5);c.stroke();
 {const rs=R(55);c.strokeStyle='rgba(10,5,28,.55)';c.lineWidth=.5;
  for(let i=0;i<30;i++){const y=84+rs()*62,x0=rs()*140,len=14+rs()*30,dy=(rs()-.5)*4;for(const m of [0,1]){const a=m?W-x0:x0,b=m?W-x0-len:x0+len;c.beginPath();c.moveTo(a,y);c.lineTo(b,y+dy);c.stroke();}}
  c.strokeStyle='rgba(205,190,255,.4)';c.lineWidth=.5;for(const m of [0,1]){c.beginPath();for(let i=6;i<wallL.length-1;i++){const p=wallL[i],x=m?W-p[0]:p[0];i===6?c.moveTo(x,p[1]):c.lineTo(x,p[1]);}c.stroke();}
  c.fillStyle='rgba(8,4,24,.55)';for(let i=0;i<14;i++){const x=rs()*150,y=96+rs()*50,r=1.4+rs()*3;for(const m of [0,1]){c.beginPath();c.ellipse(m?W-x:x,y,r*1.6,r,0,0,TAU);c.fill();}}}
 function statue(mir,x0,y0,sc,kind){
  const T=p=>mir?[x0-p[0]*sc,y0+p[1]*sc]:[x0+p[0]*sc,y0+p[1]*sc];
  const stone=c.createLinearGradient(0,y0,0,y0+150*sc);stone.addColorStop(0,'#6a6aa2');stone.addColorStop(.45,'#3a3668');stone.addColorStop(1,'#16102e');
  const stoneD=c.createLinearGradient(0,y0,0,y0+150*sc);stoneD.addColorStop(0,'#3a3a68');stoneD.addColorStop(1,'#0e0a22');
  const part=(P,fill,rim)=>{const pts=P.map(T);if(rim)poly(c,pts,'rgba(214,200,255,.9)',null,0,mir?-.9:.9,-.25);poly(c,pts,fill,'rgba(10,6,30,.7)',.5);};
  // hair behind
  const hairBack=kind===0?[[34,26],[22,6],[30,18],[16,0],[28,16],[8,12],[22,28],[2,26],[18,42],[0,50],[16,56],[8,74],[26,66],[32,80],[42,70]]
                         :[[36,18],[24,30],[18,62],[14,98],[32,108],[40,84],[48,50],[46,30]];
  part(hairBack,stoneD,true);
  // torso / armor
  part([[28,84],[44,78],[62,82],[78,90],[90,104],[98,150],[16,150],[20,104]],stone,true);
  // neck
  part([[46,64],[58,68],[60,86],[42,88]],stone,false);
  // head
  part([[40,22],[52,15],[62,19],[67,30],[66,36],[70,46],[67,50],[68,54],[66,57],[68,60],[65,67],[58,71],[50,72],[44,60],[40,40]],stone,true);
  // raised arm with hand seal
  part([[62,86],[78,84],[92,92],[94,104],[78,100],[64,100]],stone,true);
  part([[84,98],[99,98],[100,60],[86,60]],stone,true);
  part([[84,62],[100,62],[100,46],[84,46]],stone,true);
  part([[85,46],[91,46],[91,18],[86,19]],stone,true);
  part([[93,46],[99,46],[98,22],[94,21]],stone,true);
  // hair front
  const hairFront=kind===0?[[44,22],[48,8],[54,16],[60,4],[63,18],[72,12],[68,26],[60,22],[52,26]]:[[42,24],[52,10],[64,14],[70,24],[62,22],[54,26]];
  part(hairFront,stoneD,true);
  // carved details
  c.lineCap='round';c.strokeStyle='rgba(8,4,24,.75)';c.lineWidth=.6*sc;
  const ln=(pts)=>{const q=pts.map(T);c.beginPath();q.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();};
  ln([[52,33],[62,34]]);ln([[54,38],[60,39]]);ln([[64,56],[68,57]]);ln([[48,24],[50,40],[47,58]]);
  c.fillStyle='rgba(6,3,20,.8)';{const e=T([58,36]);c.beginPath();c.ellipse(e[0],e[1],2.6*sc,1.1*sc,0,0,TAU);c.fill();}
  // hair strands
  c.strokeStyle='rgba(10,6,34,.6)';c.lineWidth=.5*sc;const rr=R(kind+11);
  for(let i=0;i<16;i++){const x=10+rr()*34,y=(kind===0?6:30)+rr()*70;ln([[x,y],[x-4-rr()*6,y+8+rr()*14]]);}
  // armor plates
  c.strokeStyle='rgba(8,4,24,.7)';c.lineWidth=.7*sc;ln([[30,92],[60,98],[84,112]]);ln([[26,112],[58,118],[88,130]]);ln([[24,132],[58,136],[92,146]]);
  ln([[62,88],[70,100],[66,112]]);
  // moonlit highlights
  c.strokeStyle='rgba(205,195,255,.38)';c.lineWidth=.5*sc;ln([[66,24],[69,34]]);ln([[90,96],[96,100]]);ln([[98,60],[99,100]]);ln([[85,20],[90,44]]);ln([[90,108],[96,148]]);
  // bright fingertips/knuckles
  c.fillStyle='rgba(215,205,255,.35)';{const k=T([88,46]);c.beginPath();c.arc(k[0],k[1],2*sc,0,TAU);c.fill();}
 }
 c.save();c.beginPath();c.rect(0,0,W,152);c.clip();statue(false,-12,10,1.08,0);statue(true,W+12,10,1.08,1);c.restore();
 gr=c.createLinearGradient(0,96,0,152);gr.addColorStop(0,'rgba(8,4,24,0)');gr.addColorStop(1,'rgba(8,4,24,.8)');c.fillStyle=gr;c.fillRect(0,96,W,56);
 c.strokeStyle='rgba(120,90,180,.25)';c.lineWidth=.4;const r2=R(9);for(let i=0;i<140;i++){const x=r2()*W;if(x>150&&x<234)continue;const y=118+r2()*32;c.beginPath();c.moveTo(x,y);c.lineTo(x+(r2()-.5)*4,y+3+r2()*6);c.stroke();}
 poly(c,[[0,152],[0,146],[40,148],[90,150],[150,152]],'#0d0820');poly(c,[[W,152],[W,146],[W-40,148],[W-90,150],[W-150,152]],'#0d0820');
 {const rg=c.createLinearGradient(0,152,0,182);rg.addColorStop(0,'rgba(8,4,26,.7)');rg.addColorStop(1,'rgba(8,4,26,0)');c.fillStyle=rg;c.fillRect(0,152,167,30);c.fillRect(W-167,152,167,30);
  c.strokeStyle='rgba(200,225,255,.35)';c.lineWidth=.45;const rf=R(31);for(let i=0;i<46;i++){const x=rf()<.5?rf()*160:W-rf()*160;c.beginPath();c.moveTo(x,151.5+rf()*1.2);c.lineTo(x+2+rf()*5,151.6+rf()*1.2);c.stroke();}}
 // rocks in water
 [[110,156,9,3.5],[300,154,11,4],[330,162,6,2.6]].forEach(q=>{const rg=c.createLinearGradient(0,q[1]-q[3]*2,0,q[1]+2);rg.addColorStop(0,'#3a2a60');rg.addColorStop(1,'#0e0820');c.fillStyle=rg;c.beginPath();c.ellipse(q[0],q[1],q[2],q[3],0,Math.PI,TAU);c.fill();c.strokeStyle='rgba(200,180,255,.35)';c.lineWidth=.35;c.stroke();});
 const mr=c.createLinearGradient(0,152,0,200);mr.addColorStop(0,'rgba(255,225,170,.45)');mr.addColorStop(1,'rgba(255,225,170,0)');c.fillStyle=mr;c.beginPath();c.moveTo(184,152);c.lineTo(200,152);c.lineTo(212,205);c.lineTo(172,205);c.closePath();c.fill();
 const fg=c.createLinearGradient(0,190,0,H);fg.addColorStop(0,'#1b1136');fg.addColorStop(1,'#05030f');
 poly(c,[[0,H],[0,194],[10,188],[26,190],[40,198],[56,208],[74,H]],fg,'rgba(170,150,240,.35)',.4);
 poly(c,[[W,H],[W,196],[W-12,189],[W-30,193],[W-46,200],[W-60,210],[W-80,H]],fg,'rgba(170,150,240,.35)',.4);
 pixelateBG(bgSky,20);pixelateBG(bgFront,20);
 /* reflexo do cenario na agua: tira da parte de baixo invertida, desenhada em faixas ondulantes a cada quadro */
 {const rc=document.createElement('canvas');rc.width=BW;rc.height=Math.round(70*RES);const x=rc.getContext('2d');x.setTransform(1,0,0,-1,0,rc.height);
  x.drawImage(bgSky,0,(152-70)*RES,BW,70*RES,0,0,BW,70*RES);x.drawImage(bgFront,0,(152-70)*RES,BW,70*RES,0,0,BW,70*RES);bgRefl=rc;}
}
buildBG();
/* variacoes de cenario: o Vale do Fim e recolorido por filtro (placeholder ate termos um cenario desenhado para cada local) */
const SCENE_FILTER={ondas:'hue-rotate(165deg) saturate(.55) brightness(1.25)',vale:'none',vila:'hue-rotate(110deg) saturate(1.25) brightness(1.2)',treino:'hue-rotate(140deg) saturate(1.3) brightness(1.35)',floresta:'hue-rotate(-115deg) saturate(1.25) brightness(1.2)',deserto:'sepia(.9) hue-rotate(-20deg) saturate(1.8) brightness(1.35)',neve:'hue-rotate(-15deg) saturate(.4) brightness(1.6)'};
const bgBase=(()=>{const mk=c=>{const k=document.createElement('canvas');k.width=c.width;k.height=c.height;k.getContext('2d').drawImage(c,0,0);return k;};return{sky:mk(bgSky),front:mk(bgFront)};})();
let curScene='vale';
function setScene(t){if(!SCENE_FILTER[t])t='vale';curScene=t;
 for(const [dst,src] of [[bgSky,bgBase.sky],[bgFront,bgBase.front]]){const g=dst.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,dst.width,dst.height);g.filter=SCENE_FILTER[t];g.drawImage(src,0,0);g.filter='none';}
 const rc=document.createElement('canvas');rc.width=BW;rc.height=Math.round(70*RES);const x=rc.getContext('2d');x.setTransform(1,0,0,-1,0,rc.height);
 x.drawImage(bgSky,0,(152-70)*RES,BW,70*RES,0,0,BW,70*RES);x.drawImage(bgFront,0,(152-70)*RES,BW,70*RES,0,0,BW,70*RES);bgRefl=rc;}
function drawBird(c,x,y,s,ph){c.strokeStyle='rgba(14,6,30,.85)';c.lineWidth=.55*s;c.lineCap='round';const w=Math.sin(ph)*2.2*s;c.beginPath();c.moveTo(x-4*s,y-w*.6);c.quadraticCurveTo(x-2*s,y-w-1*s,x,y);c.quadraticCurveTo(x+2*s,y-w-1*s,x+4*s,y-w*.6);c.stroke();}
function drawEnv(c,time,tint){
 c.save();c.imageSmoothingEnabled=false;c.drawImage(bgSky,0,0,W,H);c.restore();
 // god rays
 c.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const a=.04+.025*Math.sin(time*.6+i*1.7);const x0=192+(i-2)*10,x1=192+(i-2)*46;const gr=c.createLinearGradient(0,60,0,150);gr.addColorStop(0,`rgba(255,220,180,${a})`);gr.addColorStop(1,'rgba(255,220,180,0)');c.fillStyle=gr;c.beginPath();c.moveTo(x0-3,62);c.lineTo(x0+3,62);c.lineTo(x1+14,150);c.lineTo(x1-14,150);c.closePath();c.fill();}c.globalCompositeOperation='source-over';
 c.globalAlpha=.9;[[10,32,3,0],[130,22,5,1],[250,44,4,2],[330,26,6,1],[60,64,2,2]].forEach(q=>{const x=((q[0]+time*q[2]*.7)%(W+160))-120;c.drawImage(cloudSpr[q[3]],x,q[1],120,34);});c.globalAlpha=1;
 for(let i=0;i<5;i++){const x=((time*9+i*70)%(W+80))-40,y=26+(i*13)%34+Math.sin(time*.9+i)*3;drawBird(c,x,y,.8+i%3*.25,time*7+i*2);}
 let wg=c.createLinearGradient(168,0,216,0);wg.addColorStop(0,'#3d6fa8');wg.addColorStop(.18,'#8fd0ee');wg.addColorStop(.5,'#c9eefc');wg.addColorStop(.82,'#8fd0ee');wg.addColorStop(1,'#3d6fa8');
 wg=c.createLinearGradient(160,0,224,0);wg.addColorStop(0,'#2a4f86');wg.addColorStop(.2,'#8fd0ee');wg.addColorStop(.5,'#c9eefc');wg.addColorStop(.8,'#8fd0ee');wg.addColorStop(1,'#2a4f86');
 c.fillStyle='#120a2a';c.fillRect(158,58,68,96);c.fillStyle=wg;c.fillRect(162,72,60,80);
 c.lineCap='round';
 for(let i=0;i<70;i++){const hs=((i*7919)%1000)/1000,x=169+((i*37)%46)+hs*.9,spd=55+hs*60,len=5+hs*14;const y0=74+((time*spd+hs*200+i*13)%90)-14;c.strokeStyle=`rgba(255,255,255,${.25+hs*.5})`;c.lineWidth=.35+hs*.45;const ya=Math.max(74,y0),yb=Math.min(152,y0+len);if(yb>ya){c.beginPath();c.moveTo(x,ya);c.lineTo(x,yb);c.stroke();}}
 for(let i=0;i<22;i++){const hs=((i*104729)%1000)/1000,x=170+((i*53)%44),y0=74+((time*(40+hs*30)+hs*300)%90);c.strokeStyle='rgba(60,120,180,.35)';c.lineWidth=.45;c.beginPath();c.moveTo(x,y0);c.lineTo(x,Math.min(152,y0+7));c.stroke();}
 c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.ellipse(192,74,24,1.7,0,0,Math.PI);c.fill();
 c.save();c.imageSmoothingEnabled=false;c.drawImage(bgFront,0,0,W,H);c.restore();
 for(let i=0;i<8;i++){const x=((i*61+time*(2+i%3*1.3))%(W+140))-70,y=146+Math.sin(time*.3+i*1.7)*2;c.save();c.translate(x,y);c.scale(2.4,.32);orb(c,0,0,30,[[0,'rgba(175,155,225,.11)'],[1,'rgba(175,155,225,0)']]);c.restore();}
 // foam & mist at base
 c.fillStyle='rgba(240,250,255,.55)';for(let i=0;i<18;i++){const a=i/18*TAU,rx=24+Math.sin(time*2+i)*2;c.beginPath();c.ellipse(192+Math.cos(a)*rx*.9,151.5+Math.sin(a)*1.3,2.6+Math.sin(time*3+i*2)*.8,1,0,0,TAU);c.fill();}
 for(let i=0;i<9;i++){const x=192+Math.sin(time*.7+i*1.9)*26+(i-4)*5,y=150+Math.sin(time*1.1+i)*2;orb(c,x,y,20+i%3*5,[[0,'rgba(235,245,255,.2)'],[1,'rgba(235,245,255,0)']]);}
 for(let i=0;i<14;i++){const ph=(time*.5+i*.31)%1;const x=192+(i-7)*3+Math.sin(i*5)*3;c.fillStyle=`rgba(255,255,255,${(1-ph)*.6})`;c.beginPath();c.arc(x,150-ph*14,.5+ph*.6,0,TAU);c.fill();}
 c.save();c.beginPath();c.rect(0,152,W,H-152);c.clip();
 if(bgRefl){for(let i=0;i<36;i++){const ox=Math.sin(time*1.3+i*.7)*(.5+i*.06);c.globalAlpha=.34*(1-i/40);c.drawImage(bgRefl,0,Math.round(i*1.9*RES),BW,Math.round(1.9*RES),ox,152.4+i*1.75,W,1.75);}c.globalAlpha=1;}
 for(let i=0;i<50;i++){const y=153+i*1.15,w=(15-i*.17)*(.7+.3*Math.sin(time*2+i*1.7));c.fillStyle=`rgba(255,228,170,${Math.max(0,.5-i*.01)*(.5+.5*Math.sin(time*3+i))})`;c.fillRect(192-w/2+Math.sin(time+i)*1.5,y,w,.55);}
 c.strokeStyle='rgba(150,180,255,.3)';c.lineWidth=.35;
 for(let i=0;i<90;i++){const x=((i*61+time*(5+i%4*3))%(W+20))-10,y=154+(i*17)%58;if(Math.sin(time*2.4+i*2.1)<-.2)continue;c.beginPath();c.moveTo(x,y);c.lineTo(x+3+i%7,y);c.stroke();}
 c.strokeStyle='rgba(255,255,255,.35)';for(let i=0;i<24;i++){const x=(i*47+time*3)%W,y=156+(i*29)%50;if(Math.sin(time*5+i)<.3)continue;c.beginPath();c.moveTo(x,y);c.lineTo(x+1.4,y);c.stroke();}
 c.restore();
 // leaves
 for(let i=0;i<12;i++){const ph=(time*.07+i*.083)%1;const x=W+10-ph*(W+40)+Math.sin(time*1.5+i)*8,y=20+ph*120+Math.sin(time*2+i*3)*6,a=time*2+i;c.save();c.translate(x,y);c.rotate(a);c.fillStyle=i%3?'#7a3a50':'#a0603a';c.beginPath();c.ellipse(0,0,1.6,.8,0,0,TAU);c.fill();c.restore();}
 c.globalCompositeOperation='lighter';for(let i=0;i<16;i++){const x=((i*83+time*(3+i%3))%W),y=100+((i*47)%70)+Math.sin(time*.8+i)*5;orb(c,x,y,2.4,[[0,`rgba(255,235,160,${.5+.4*Math.sin(time*2+i)})`],[1,'rgba(255,200,100,0)']]);}c.globalCompositeOperation='source-over';
 /* juncos na beira, balançando com o vento */
 c.strokeStyle='#07041a';c.lineWidth=.9;c.lineCap='round';
 for(let i=0;i<24;i++){const side=i<12?0:1,j=side?i-12:i,bx=side?W-3-j*4:3+j*4.2,h=13+((i*37)%19),dir=side?-1:1,sw=Math.sin(time*1.3+i*.8)*2.2;c.beginPath();c.moveTo(bx,H);c.quadraticCurveTo(bx+sw*.4+dir*3,H-h*.6,bx+sw+dir*5,H-h);c.stroke();}
 {const vg=c.createRadialGradient(W/2,H*.55,H*.42,W/2,H*.55,W*.62);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(4,2,16,.42)');c.fillStyle=vg;c.fillRect(0,0,W,H);}
 if(curScene==='ondas'){ /* neblina da Grande Ponte: bancos de nevoa passando, pilares e cabos da ponte ao fundo */
  c.save();c.fillStyle='rgba(40,56,78,.55)';for(let i=0;i<7;i++){const x=22+i*58;c.fillRect(x,60,3,92);c.fillRect(x-1,58,5,2);}c.strokeStyle='rgba(40,56,78,.5)';c.lineWidth=.7;for(let i=0;i<6;i++){c.beginPath();c.moveTo(22+i*58,62);c.quadraticCurveTo(51+i*58,96,80+i*58,62);c.stroke();}c.restore();
  for(let i=0;i<9;i++){const x=((i*53+time*(3+i%3*1.6))%(W+200))-100,y=70+(i*19)%80+Math.sin(time*.4+i)*3;c.save();c.translate(x,y);c.scale(4.2,.55);orb(c,0,0,34,[[0,'rgba(232,240,246,.32)'],[1,'rgba(232,240,246,0)']]);c.restore();}
  c.fillStyle='rgba(214,226,236,.22)';c.fillRect(0,0,W,H);}
 if(tint){c.fillStyle=tint;c.fillRect(-20,-20,W+40,H+40);}
}
function shadowRipple(c,x,time,glow){
 c.fillStyle='rgba(2,6,20,.55)';c.beginPath();c.ellipse(x,GY+1,17,3.2,0,0,TAU);c.fill();
 for(let k=0;k<3;k++){const ph=(time*.5+k/3)%1,rx=8+ph*22;c.strokeStyle=glow?`rgba(140,210,255,${(1-ph)*.8})`:`rgba(200,225,255,${(1-ph)*.55})`;c.lineWidth=.45;c.beginPath();c.ellipse(x,GY+1,rx,rx*.24,0,0,TAU);c.stroke();}
}

