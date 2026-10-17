/* ---------- characters ---------- */
function mkDef(o){for(const k in o)if(typeof o[k]==='string'&&o[k][0]==='#')o[k]=hex(o[k]);return o}
const SASUKE=mkDef({skin:'#f7d6b8',shirt:'#33449a',sleeve:'#33449a',fore:'#f7d6b8',collar:'#222f78',shorts:'#eceef8',shin:'#f7d6b8',wrap:'#f7f7f7',wrapLen:.5,shoe:'#1d2766',belt:'#5a4aa8',
 hair:'#161a32',hairHi:'#5870c0',band:'#1f2d80',plate:'#d5dcec',iris:'#14141f',irisHi:'#47507a',eyeH:.86,eyeW:1.1,browW:.72,lidW:.95,lash:0,style:'s'});
const NARUTO=mkDef({skin:'#fbd3a8',shirt:'#f58f1c',sleeve:'#f58f1c',fore:'#f58f1c',collar:'#2a4fb8',shorts:'#f27f12',shin:'#f27f12',wrap:'#efece2',wrapLen:.22,shoe:'#1d2d78',belt:'#2a4fb8',
 hair:'#ffcb24',hairHi:'#fff2a0',band:'#1f3fa0',plate:'#d5dcec',iris:'#1646d8',irisHi:'#86d4ff',eyeH:1.06,eyeW:1.02,browW:1.2,lidW:1.0,lash:0,style:'n'});
const IDLE={lean:0,crouch:0,fbx:-5,fby:0,ffx:5,ffy:0,hxF:4,hyF:12,hxB:-1,hyB:12,hdx:0,hdy:0,hr:0,tilt:0,red:0,expr:0,hF:0,hB:0,tw:1,wind:0,hix:0,hiy:0,turn:0,torn:0,scream:0};
const mk=o=>Object.assign({},IDLE,o);
function ik(sx,sy,hx,hy,l1,l2,dir){let dx=hx-sx,dy=hy-sy,d=Math.hypot(dx,dy);const mx=(l1+l2)*.965;if(d>mx){dx*=mx/d;dy*=mx/d;d=mx;hx=sx+dx;hy=sy+dy}if(d<.01)d=.01;
 const a=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-a*a));const px=sx+dx*a/d,py=sy+dy*a/d;return{ex:px+(-dy/d)*h*dir,ey:py+(dx/d)*h*dir,hx,hy}}
/* braco com limite suave: perto da extensao maxima o cotovelo continua levemente dobrado (sem braco "travado") */
function ikArm(sx,sy,hx,hy){const l=8.2,mx=l*2*.965,soft=mx*.86;let dx=hx-sx,dy=hy-sy;const d=Math.hypot(dx,dy);
 if(d>soft){const nd=soft+(mx-soft)*(1-Math.exp(-(d-soft)/(mx-soft)));hx=sx+dx*nd/d;hy=sy+dy*nd/d;}
 return ik(sx,sy,hx,hy,l,l,1);}
const BS=1.42;let HEADS=.5;const WOUNDS={s:[],n:[]};let burning=false,lastBurn=0,outcomeT=0;
function rig(P){
 const cr=P.crouch*1.15,fk=.85;
 const Hp=[P.lean*.35,-21.4+cr],hip=[Hp[0],Hp[1]+2];
 const S=[P.lean,Hp[1]-13.4];
 const T=P.turn||0; /* turn: gira o tronco para a camera (ombros e quadril abrem, peito de frente) */
 const lf=ik(hip[0]+1+T*1.6,hip[1],P.ffx*fk,P.ffy,10.2,10.2,-1),lb=ik(hip[0]-1-T*1.6,hip[1],P.fbx*fk,P.fby,10.2,10.2,-1);
 const sh=[S[0],S[1]+1],shF=[S[0]+3+T*3.6,S[1]+1.6],shB=[S[0]-2.8-T*3.2,S[1]+1.6];
 const hf=ikArm(shF[0],shF[1],shF[0]+P.hxF,shF[1]+P.hyF),hb=ikArm(shB[0],shB[1],shB[0]+P.hxB,shB[1]+P.hyB);
 const C=[S[0]+1+P.hdx,S[1]-6.9+P.hdy];
 return{S,Hp,hip,lf,lb,sh,shF,shB,hf,hb,C};
}
function rigW(P){const r=rig(P),Hp=r.Hp,t=P.tilt||0,cs=Math.cos(t),sn=Math.sin(t);
 const rot=a=>{const x=a[0]-Hp[0],y=a[1]-Hp[1];return[Hp[0]+x*cs-y*sn,Hp[1]+x*sn+y*cs]};
 const m=a=>[a[0]*BS,a[1]*BS];
 const ml=(o,rr)=>{const e=rr?rot([o.ex,o.ey]):[o.ex,o.ey],h=rr?rot([o.hx,o.hy]):[o.hx,o.hy];return{ex:e[0]*BS,ey:e[1]*BS,hx:h[0]*BS,hy:h[1]*BS}};
 return{S:m(rot(r.S)),Hp:m(r.Hp),hip:m(r.hip),sh:m(rot(r.sh)),shF:m(rot(r.shF)),shB:m(rot(r.shB)),C:m(rot(r.C)),lf:ml(r.lf,0),lb:ml(r.lb,0),hf:ml(r.hf,1),hb:ml(r.hb,1)};}
const SW=170,SH=140,OXU=85,OYU=118;
const SRMAX=K*3.4;let SR=RES,spW=Math.round(SW*SR),spH=Math.round(SH*SR);
const sp=document.createElement('canvas');sp.width=Math.round(SW*SRMAX);sp.height=Math.round(SH*SRMAX);const sc=sp.getContext('2d');
const fxPix=document.createElement('canvas');fxPix.width=384;fxPix.height=216;const fxPx=fxPix.getContext('2d'); /* chamas negras do Amaterasu em pixels grandes */
const bloomc=document.createElement('canvas');bloomc.width=320;bloomc.height=180;const bx=bloomc.getContext('2d');const bloomc2=document.createElement('canvas');bloomc2.width=640;bloomc2.height=360;const bx2=bloomc2.getContext('2d');
const rimc=document.createElement('canvas');rimc.width=sp.width;rimc.height=sp.height;const rimx=rimc.getContext('2d');

const INK=[12,8,38];
const outC=(col,a=1)=>css(mix(col,INK,.8),1,a);
const shC=(col,k=1)=>css([col[0]*.7,col[1]*.58,col[2]*.68+16],k,1);
const hiC=(col,k=1,a=.6)=>css(mix(col,[255,246,232],.55),k,a);
const lerp2=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
function limb(c,pts,w,col,k,o){o=o||{};
 c.lineCap=o.cap||'round';c.lineJoin='round';
 c.strokeStyle=o.oc||outC(col);c.lineWidth=w+.8;path(c,pts);c.stroke();
 c.strokeStyle=css(col,k);c.lineWidth=w;path(c,pts);c.stroke();
 if(!o.flat){
  c.save();c.translate(-w*.2,w*.13);c.strokeStyle=shC(col,k);c.lineWidth=w*.5;path(c,pts);c.stroke();c.restore();
  c.save();c.translate(w*.23,-w*.2);c.strokeStyle=hiC(col,k,.5);c.lineWidth=w*.17;path(c,pts);c.stroke();c.restore();}}
function creases(c,p0,j,p1,w,col,k,n){
 let ux=p0[0]-j[0],uy=p0[1]-j[1],vx=p1[0]-j[0],vy=p1[1]-j[1];const lu=Math.hypot(ux,uy)||1,lv=Math.hypot(vx,vy)||1;ux/=lu;uy/=lu;vx/=lv;vy/=lv;
 let bx=ux+vx,by=uy+vy;const lb=Math.hypot(bx,by);if(lb<.5)return;bx/=lb;by/=lb;const it=clamp((lb-.5)/1.0,0,1);const px=-by,py=bx;
 c.lineCap='round';
 for(let i=0;i<n;i++){const off=.5+i*.95,cx=j[0]+bx*off,cy=j[1]+by*off,hw2=w*(.44-.07*i);
  c.strokeStyle=shC(col,k);c.globalAlpha=.8*it;c.lineWidth=.38;c.beginPath();c.moveTo(cx-px*hw2,cy-py*hw2);c.quadraticCurveTo(cx+bx*.55,cy+by*.55,cx+px*hw2,cy+py*hw2);c.stroke();
  c.strokeStyle=hiC(col,k,.5);c.globalAlpha=.4*it;c.lineWidth=.28;c.beginPath();c.moveTo(cx-px*hw2*.8+bx*.5,cy-py*hw2*.8+by*.5);c.quadraticCurveTo(cx+bx*1.0,cy+by*1.0,cx+px*hw2*.8+bx*.5,cy+py*hw2*.8+by*.5);c.stroke();}
 c.globalAlpha=1;}
function tap(c,a,b,wa,wb,col,k,o){o=o||{};
 const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,ang=Math.atan2(dy,dx);
 const pf=(ox,oy)=>{c.beginPath();c.moveTo(a[0]+nx*wa/2+ox,a[1]+ny*wa/2+oy);c.lineTo(b[0]+nx*wb/2+ox,b[1]+ny*wb/2+oy);
  if(o.flat)c.lineTo(b[0]-nx*wb/2+ox,b[1]-ny*wb/2+oy);else c.arc(b[0]+ox,b[1]+oy,wb/2,ang+Math.PI/2,ang-Math.PI/2,true);
  c.lineTo(a[0]-nx*wa/2+ox,a[1]-ny*wa/2+oy);c.arc(a[0]+ox,a[1]+oy,wa/2,ang-Math.PI/2,ang+Math.PI/2,true);c.closePath();};
 const w=(wa+wb)/2;
 c.save();pf(0,0);c.fillStyle=shC(col,k);c.fill();c.clip();
 pf(w*.2,-w*.15);c.fillStyle=css(col,k);c.fill();
 c.strokeStyle=hiC(col,k,.5);c.lineWidth=w*.14;c.lineCap='round';c.beginPath();c.moveTo(a[0]+w*.2,a[1]-w*.16);c.lineTo(b[0]+w*.16,b[1]-w*.14);c.stroke();
 c.restore();
 pf(0,0);c.strokeStyle=o.oc||outC(col);c.lineWidth=.72;c.lineJoin='round';c.stroke();}
const sameC=(a,b)=>a[0]===b[0]&&a[1]===b[1]&&a[2]===b[2];
function tapG(c,segs,col,k,o){o=o||{};
 const sub=(s,ox,oy)=>{const [a,b,wa,wb]=s,dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,ang=Math.atan2(dy,dx);
  c.moveTo(a[0]+nx*wa/2+ox,a[1]+ny*wa/2+oy);c.lineTo(b[0]+nx*wb/2+ox,b[1]+ny*wb/2+oy);c.arc(b[0]+ox,b[1]+oy,wb/2,ang+Math.PI/2,ang-Math.PI/2,true);
  c.lineTo(a[0]-nx*wa/2+ox,a[1]-ny*wa/2+oy);c.arc(a[0]+ox,a[1]+oy,wa/2,ang-Math.PI/2,ang+Math.PI/2,true);c.closePath();};
 const all=(ox,oy)=>{c.beginPath();for(const s of segs)sub(s,ox,oy);};
 let w=0;for(const s of segs)w+=(s[2]+s[3])/2;w/=segs.length;
 /* contorno por baixo: as linhas internas entre segmentos ficam cobertas pelo preenchimento */
 all(0,0);c.strokeStyle=o.oc||outC(col);c.lineWidth=1.15;c.lineJoin='round';c.stroke();
 c.save();all(0,0);c.fillStyle=shC(col,k);c.fill();c.clip();
 all(w*.2,-w*.15);c.fillStyle=css(col,k);c.fill();
 c.strokeStyle=hiC(col,k,.5);c.lineWidth=w*.14;c.lineCap='round';c.lineJoin='round';c.beginPath();
 segs.forEach((s,i)=>{const p=[s[0][0]+w*.2,s[0][1]-w*.16],q=[s[1][0]+w*.16,s[1][1]-w*.14];if(!i)c.moveTo(p[0],p[1]);else c.lineTo(p[0],p[1]);c.lineTo(q[0],q[1]);});c.stroke();
 c.restore();}
function handDraw(c,x,y,ang,type,d,k){
 /* mao desenhada no referencial do antebraco: +x = direcao dos dedos, y = largura da palma */
 const sk=css(d.skin,k),sd=css(mix(d.skin,[90,40,80],.35),k),oc=css([112,56,58],1);
 c.save();c.translate(x,y);c.scale(.82,.82);c.rotate(ang);c.lineCap='round';c.lineJoin='round';
 const parts=[],cap=(x0,y0,x1,y1,w)=>parts.push([0,x0,y0,x1,y1,w]),rr=(x0,y0,w,h,r)=>parts.push([1,x0,y0,w,h,r]);
 const fin=(bx,by,a,l1,l2,bend,w)=>{const x1=bx+Math.cos(a)*l1,y1=by+Math.sin(a)*l1,a2=a+bend;cap(bx,by,x1,y1,w);cap(x1,y1,x1+Math.cos(a2)*l2,y1+Math.sin(a2)*l2,w*.9);};
 const lines=[];const ln=(x0,y0,x1,y1)=>lines.push([x0,y0,x1,y1]);
 if(type===1){ /* mao aberta */
  rr(-.5,-1.75,3.7,3.5,1.1);
  const fy=[-1.25,-.42,.42,1.25],fa=[-.34,-.11,.11,.34],l1=[1.7,2.0,1.9,1.5],l2=[1.3,1.6,1.5,1.1];
  for(let i=0;i<4;i++)fin(2.8,fy[i],fa[i],l1[i],l2[i],fa[i]*.35,.98);
  fin(.7,-1.5,-1.0,1.4,1.2,.3,1.15);
  ln(.6,-.8,2.4,-.6);ln(.6,.5,2.4,.4);}
 else if(type===2){ /* selo: indicador e medio em pe, resto fechado */
  rr(-.5,-1.75,3.5,3.5,1.1);cap(2.7,.9,3.3,.9,1.0);cap(2.7,1.55,3.2,1.55,.9);
  const up=-Math.PI/2-ang;fin(2.5,-.55,up,2.1,1.8,-.04,1.0);fin(2.5,.35,up+.05,2.3,1.9,.04,1.0);
  cap(1.2,-1.5,2.7,-.95,1.05);}
 else{ /* punho (0 = relaxado, 3 = cerrado com forca) */
  const big=type===3?1.12:1;
  rr(-.5,-1.85*big,3.9*big,3.7*big,1.25);
  for(let i=0;i<4;i++)cap(3.0*big,(-1.35+i*.9)*big,3.5*big,(-1.35+i*.9)*big,1.0);
  cap(1.5,-1.7*big,3.2*big,-.5*big,1.15);
  ln(2.2*big,-.9,3.4*big,-.9);ln(2.2*big,0,3.4*big,0);ln(2.2*big,.9,3.4*big,.9);}
 c.strokeStyle=oc;c.fillStyle=oc;
 for(const p of parts){if(p[0]===0){c.lineWidth=p[5]+.85;c.beginPath();c.moveTo(p[1],p[2]);c.lineTo(p[3],p[4]);c.stroke();}else{c.beginPath();c.roundRect(p[1]-.42,p[2]-.42,p[3]+.84,p[4]+.84,p[5]+.4);c.fill();}}
 c.strokeStyle=sk;c.fillStyle=sk;
 for(const p of parts){if(p[0]===0){c.lineWidth=p[5];c.beginPath();c.moveTo(p[1],p[2]);c.lineTo(p[3],p[4]);c.stroke();}else{c.beginPath();c.roundRect(p[1],p[2],p[3],p[4],p[5]);c.fill();}}
 c.strokeStyle=sd;c.globalAlpha=.55;c.lineWidth=.3;for(const l of lines){c.beginPath();c.moveTo(l[0],l[1]);c.lineTo(l[2],l[3]);c.stroke();}
 c.fillStyle=sd;c.globalAlpha=.3;c.beginPath();c.ellipse(1.1,.9,1.6,.9,0,0,TAU);c.fill();c.globalAlpha=.4*k;c.fillStyle='#fff';c.beginPath();c.ellipse(1.3,-1.0,.8,.35,0,0,TAU);c.fill();c.globalAlpha=1;
 c.restore();}
function drawFig(c,d,P,time){
 const r=rig(P),S=r.S,Hp=r.Hp,tw=P.tw*(1+(P.turn||0)*.3),sw=5.7*tw,wind=P.wind;
 const hF=Math.round(P.hF),hB=Math.round(P.hB);
 const isS=d.style==='s';
 c.save();c.scale(BS,BS);
 const up=fn=>{c.save();c.translate(Hp[0],Hp[1]);c.rotate(P.tilt||0);c.translate(-Hp[0],-Hp[1]);fn();c.restore();};
 function leg(hip,kk,k,front){
  const kn=[kk.ex,kk.ey],an=[kk.hx,kk.hy],at=t=>lerp2(kn,an,t);
  const cp=at(.35),thc=isS?d.skin:d.shorts,tw0=isS?6.3:6.5,tw1=isS?4.4:4.8;
  if(sameC(thc,d.shin))tapG(c,[[hip,kn,tw0,tw1],[kn,cp,4.6,5.2],[cp,an,5.2,3.1]],d.shin,k);else{tap(c,hip,kn,tw0,tw1,thc,k);tap(c,kn,cp,4.6,5.2,d.shin,k);tap(c,cp,an,5.2,3.1,d.shin,k);}
  if(isS)tap(c,hip,lerp2(hip,kn,.66),7.0,5.6,d.shorts,k,{flat:1});
  if(front){const p=lerp2(hip,kn,.34),ang=Math.atan2(kn[1]-hip[1],kn[0]-hip[0]);
   c.save();c.translate(p[0]+2.6,p[1]);c.rotate(ang-Math.PI/2+.12);c.beginPath();c.roundRect(-1.5,-2.4,3,4.8,.7);c.fillStyle=isS?'#e4e0d8':'#cbb585';c.fill();c.strokeStyle=outC(d.shorts);c.lineWidth=.5;c.stroke();c.strokeStyle='rgba(80,60,60,.55)';c.lineWidth=.35;c.beginPath();c.moveTo(-1.5,-1);c.lineTo(1.5,-1);c.stroke();c.restore();}
  
  creases(c,[hip[0],hip[1]-9],hip,kn,5.2,d.shorts,k,2);if(!isS)creases(c,hip,kn,an,4.8,d.shorts,k,3);
  const wf=1-d.wrapLen,wm=wf<.35?4.5:wf<.6?4.1:3.4;tap(c,at(wf),an,wm+.3,3.3,d.wrap,k);
  c.strokeStyle='rgba(90,80,100,.45)';c.lineWidth=.28;for(let i=1;i<5;i++){const q=lerp2(at(wf),an,i/5);c.beginPath();c.moveTo(q[0]-1.5,q[1]);c.lineTo(q[0]+1.5,q[1]+.4);c.stroke();}
  c.save();c.translate(an[0]+1.3,an[1]+.9);
  c.beginPath();c.moveTo(-2.6,-1.4);c.quadraticCurveTo(-1,-2.1,1.2,-1.7);c.quadraticCurveTo(4.4,-1,4.6,.8);c.quadraticCurveTo(4.5,2.1,2.4,2.1);c.lineTo(-2.4,2.1);c.quadraticCurveTo(-3.2,.6,-2.6,-1.4);c.closePath();
  c.fillStyle=css(d.shoe,k);c.fill();c.strokeStyle=outC(d.shoe);c.lineWidth=.55;c.stroke();
  c.fillStyle=hiC(d.shoe,k,.55);c.fillRect(-1,-1.5,3.4,.45);c.fillStyle='rgba(8,6,30,.55)';c.fillRect(-2.4,1.4,6.8,.65);c.restore();}
 function arm(ka,k,type,shd){const sh=shd,el=[ka.ex,ka.ey],ha=[ka.hx,ka.hy],ap=t=>lerp2(sh,el,t),fp=t=>lerp2(el,ha,t);
  if(isS){if(sameC(d.skin,d.fore))tapG(c,[[sh,ap(.45),4.8,4.5],[ap(.45),el,4.5,3.7],[el,fp(.4),3.9,4.0],[fp(.4),ha,4.0,3.0]],d.skin,k);else{tap(c,sh,ap(.45),4.8,4.5,d.skin,k);tap(c,ap(.45),el,4.5,3.7,d.skin,k);tap(c,el,fp(.4),3.9,4.0,d.fore,k);tap(c,fp(.4),ha,4.0,3.0,d.fore,k);}
   tap(c,sh,ap(.64),5.9,5.4,d.sleeve,k,{flat:1});tap(c,fp(.36),ha,4.4,3.5,d.wrap,k);
   c.strokeStyle='rgba(90,80,110,.5)';c.lineWidth=.28;for(let i=1;i<5;i++){const q=lerp2(fp(.36),ha,i/5);c.beginPath();c.moveTo(q[0]-1.3,q[1]-.3);c.lineTo(q[0]+1.3,q[1]+.4);c.stroke();}creases(c,sh,el,ha,3.2,d.skin,k,2);}
  else{if(sameC(d.sleeve,d.fore))tapG(c,[[sh,ap(.5),5.8,5.4],[ap(.5),el,5.4,4.5],[el,fp(.45),4.5,4.4],[fp(.45),ha,4.4,3.3]],d.sleeve,k);else{tap(c,sh,ap(.5),5.8,5.4,d.sleeve,k);tap(c,ap(.5),el,5.4,4.5,d.sleeve,k);tap(c,el,fp(.45),4.5,4.4,d.fore,k);tap(c,fp(.45),ha,4.4,3.3,d.fore,k);}tap(c,fp(.78),ha,3.9,3.6,d.collar,k);creases(c,sh,el,ha,4.6,d.sleeve,k,3);}
  {const g2=c.createLinearGradient(sh[0]-2.4,sh[1]-2,sh[0]+2.4,sh[1]+3);g2.addColorStop(0,css(d.sleeve,k));g2.addColorStop(1,shC(d.sleeve,k));c.beginPath();c.ellipse(sh[0]-.2,sh[1]+.5,2.5,2.9,.15,0,TAU);c.fillStyle=g2;c.fill();}
  handDraw(c,ha[0],ha[1],Math.atan2(ha[1]-el[1],ha[0]-el[0]),type,d,k);}
 const handsUp=P.hyB<-1;
 if(!handsUp)up(()=>arm(r.hb,.74,hB,r.shB));
 leg(r.hip,r.lb,.74,false);
 up(()=>{
 // torso (V shape: wide shoulders, narrow waist)
 const wa=4.2*tw,hw=4.6*tw,mid=(S[1]+Hp[1])*.5;
 c.beginPath();
 /* tronco com trapezio inclinado, peito, cintura marcada e quadril: deixa de ser um retangulo */
 c.moveTo(S[0]-sw+.2,S[1]+1.4);c.quadraticCurveTo(S[0]-sw-.2,S[1]-.8,S[0]-sw*.45,S[1]-2.2);c.quadraticCurveTo(S[0],S[1]-3,S[0]+sw*.45,S[1]-2.2);c.quadraticCurveTo(S[0]+sw+.2,S[1]-.8,S[0]+sw-.2,S[1]+1.4);
 c.bezierCurveTo(S[0]+sw+1.4,S[1]+4,S[0]+wa+1.4,mid-1.2,S[0]+wa+.5,mid+1.6);c.quadraticCurveTo(Hp[0]+hw+.6,Hp[1]-1,Hp[0]+hw,Hp[1]+2);
 c.lineTo(Hp[0]-hw,Hp[1]+2);c.quadraticCurveTo(Hp[0]-hw-.4,Hp[1]-1,S[0]-wa-.3,mid+1.6);c.bezierCurveTo(S[0]-wa-.9,mid-1.2,S[0]-sw-.8,S[1]+4,S[0]-sw+.2,S[1]+1.4);c.closePath();
 c.fillStyle=css(d.shirt,1);c.fill();
 c.save();c.clip();
 c.fillStyle=shC(d.shirt,1);c.beginPath();c.moveTo(S[0]-sw-1,S[1]-2);c.lineTo(S[0]-sw+2.4,S[1]-2);c.quadraticCurveTo(Hp[0]-2.4,mid,Hp[0]-hw+2,Hp[1]+3);c.lineTo(Hp[0]-6,Hp[1]+3);c.closePath();c.fill();
 c.fillStyle=hiC(d.shirt,1,.35);c.beginPath();c.moveTo(S[0]+sw-2,S[1]-2);c.lineTo(S[0]+sw+1,S[1]-2);c.lineTo(Hp[0]+hw+1,Hp[1]+3);c.lineTo(Hp[0]+hw-1.2,Hp[1]+3);c.closePath();c.fill();
 c.fillStyle='rgba(20,10,60,.28)';c.beginPath();c.ellipse(S[0],S[1]-.5,sw*.8,2.2,0,0,TAU);c.fill();
 c.strokeStyle=shC(d.shirt,.8);c.lineWidth=.38;for(let i=0;i<3;i++){c.beginPath();c.moveTo(Hp[0]-2.6+i*2.6,Hp[1]-1);c.quadraticCurveTo(Hp[0]-1.8+i*2.6,Hp[1]-5,Hp[0]-3+i*2.6,Hp[1]-9);c.stroke();}
 {const fi=clamp(P.tilt*4+Math.max(0,P.crouch-4)*.12,0,1);if(fi>.15){c.strokeStyle=shC(d.shirt,.75);c.lineWidth=.4;for(let i=0;i<3;i++){const yy=mid+1.6+i*1.6;c.beginPath();c.moveTo(S[0]-wa-1+i*.5,yy);c.quadraticCurveTo(S[0]+.5,yy+1.2*fi,S[0]+wa+1-i*.5,yy-.3);c.globalAlpha=fi;c.stroke();c.globalAlpha=1;}}}
 // pec / chest line
 c.strokeStyle=shC(d.shirt,.85);c.lineWidth=.35;c.beginPath();c.moveTo(S[0]+.6,S[1]+3);c.quadraticCurveTo(S[0]+3.4,S[1]+4.6,S[0]+5,S[1]+3.4);c.stroke();
 if(isS){c.strokeStyle=shC(d.shirt,.7);c.lineWidth=.38;c.beginPath();c.moveTo(S[0]+.6,S[1]+1);c.lineTo(S[0]+.8,Hp[1]+1);c.stroke();}
 else{c.fillStyle=css(d.collar,1);c.beginPath();c.moveTo(S[0]-sw-1,S[1]-2);c.lineTo(S[0]-sw*.35,S[1]-2);c.lineTo(S[0]-sw*.45,S[1]+2.4);c.lineTo(S[0]-sw-1,S[1]+3.4);c.closePath();c.fill();
  c.beginPath();c.moveTo(S[0]+sw+1,S[1]-2);c.lineTo(S[0]+sw*.35,S[1]-2);c.lineTo(S[0]+sw*.45,S[1]+2.4);c.lineTo(S[0]+sw+1,S[1]+3.4);c.closePath();c.fill();
  c.strokeStyle='#241a10';c.lineWidth=.45;c.beginPath();c.moveTo(S[0]+.9,S[1]);c.lineTo(S[0]+1.3,Hp[1]+1);c.stroke();c.fillStyle='#c8c8d0';c.fillRect(S[0]+.5,S[1]+.2,1,1.2);}
  if(P.torn>0){ /* roupa rasgada no peito: pele a mostra, bordas queimadas, retalhos pendurados e sangue */
   const q=Math.min(1,P.torn),ccx=S[0]+.6,top=S[1]+.8,bot=mid+5.2,wp=5+q*2.8,H2=bot-top;
   const PT=[[-.95,0],[-.5,-.12],[-.1,.1],[.3,-.1],[.7,.05],[1,.45],[.9,.85],[.5,1.05],[0,.92],[-.5,1.08],[-.9,.8],[-1.05,.4]];
   const pth=()=>{c.beginPath();PT.forEach((p,i)=>{const x=ccx+p[0]*wp,y=top+p[1]*H2;i?c.lineTo(x,y):c.moveTo(x,y);});c.closePath();};
   pth();let sg2=c.createLinearGradient(0,top,0,bot);sg2.addColorStop(0,css(d.skin,1.04));sg2.addColorStop(1,shC(d.skin,1));c.fillStyle=sg2;c.fill();
   c.strokeStyle='rgba(120,60,60,.5)';c.lineWidth=.4;c.beginPath();c.moveTo(ccx,top+.8);c.lineTo(ccx,bot-.5);c.moveTo(ccx-wp*.8,top+H2*.45);c.quadraticCurveTo(ccx-wp*.4,top+H2*.58,ccx-.8,top+H2*.5);c.moveTo(ccx+wp*.8,top+H2*.45);c.quadraticCurveTo(ccx+wp*.4,top+H2*.58,ccx+.8,top+H2*.5);c.stroke();
   const bg=c.createRadialGradient(ccx,top+H2*.5,.5,ccx,top+H2*.5,wp*1.1);bg.addColorStop(0,'rgba(120,6,14,.75)');bg.addColorStop(.55,'rgba(150,14,22,.35)');bg.addColorStop(1,'rgba(150,14,22,0)');pth();c.fillStyle=bg;c.fill();
   pth();c.strokeStyle='rgba(30,8,10,.75)';c.lineWidth=1.1;c.lineJoin='round';c.stroke();
   for(const fl of [[-.95,.05,-1.5,.5],[-.5,-.1,-.9,.35],[.7,.02,1.2,.4],[1,.45,1.5,.95],[-.9,.8,-1.4,1.2],[.5,1.05,.7,1.5]]){const x0=ccx+fl[0]*wp,y0=top+fl[1]*H2,x1=ccx+fl[2]*wp,y1=top+fl[3]*H2;c.beginPath();c.moveTo(x0-.6,y0-.5);c.lineTo(x1,y1);c.lineTo(x0+.7,y0+.9);c.closePath();c.fillStyle=css(d.shirt,1);c.fill();c.strokeStyle=outC(d.shirt);c.lineWidth=.45;c.stroke();}}
 c.restore();
 c.strokeStyle=outC(d.shirt);c.lineWidth=.8;c.lineJoin='round';c.stroke();
 // belt
 c.strokeStyle=outC(d.belt);c.lineWidth=2.4;c.beginPath();c.moveTo(Hp[0]-4.3*tw,Hp[1]+1.5);c.lineTo(Hp[0]+4.3*tw,Hp[1]+1.5);c.stroke();c.strokeStyle=css(d.belt,1);c.lineWidth=1.5;c.stroke();
 c.fillStyle='#d8d8e4';c.fillRect(Hp[0]+1.2*tw,Hp[1]+.7,1.6,1.7);
 // shorts/pants top
 c.beginPath();c.moveTo(Hp[0]-4.4*tw,Hp[1]+2.3);c.lineTo(Hp[0]+4.4*tw,Hp[1]+2.3);c.lineTo(Hp[0]+5.4*tw,Hp[1]+8.4);c.quadraticCurveTo(Hp[0],Hp[1]+10,Hp[0]-5.4*tw,Hp[1]+8.4);c.closePath();
 c.fillStyle=css(d.shorts,1);c.fill();c.save();c.clip();c.fillStyle=shC(d.shorts,1);c.fillRect(Hp[0]-8,Hp[1]+2,6.2,10);c.fillStyle=hiC(d.shorts,1,.4);c.fillRect(Hp[0]+3.4*tw,Hp[1]+2,3,10);
 c.strokeStyle=shC(d.shorts,.8);c.lineWidth=.38;c.beginPath();c.moveTo(Hp[0]-.6,Hp[1]+3);c.quadraticCurveTo(Hp[0]-1.6,Hp[1]+6,Hp[0]-3,Hp[1]+9);c.moveTo(Hp[0]+2,Hp[1]+3);c.quadraticCurveTo(Hp[0]+3,Hp[1]+6,Hp[0]+3.2,Hp[1]+9);c.stroke();c.restore();
 c.strokeStyle=outC(d.shorts);c.lineWidth=.65;c.stroke();
 if(!isS){const w1=Math.sin(time*6)*.6+wind*2.4-P.hix*.35;c.beginPath();c.moveTo(Hp[0]-5,Hp[1]+1.2);c.lineTo(Hp[0]+5,Hp[1]+1.2);c.quadraticCurveTo(Hp[0]+6.6-w1,Hp[1]+4.5,Hp[0]+5.8-w1*1.4,Hp[1]+7.4);c.lineTo(Hp[0]+2,Hp[1]+6.4-wind);c.lineTo(Hp[0]-2.4,Hp[1]+7.2);c.lineTo(Hp[0]-5.6-w1*.6,Hp[1]+6);c.closePath();
  c.fillStyle=css(d.shirt,1);c.fill();c.strokeStyle=outC(d.shirt);c.lineWidth=.65;c.stroke();c.fillStyle=shC(d.shirt,1);c.beginPath();c.moveTo(Hp[0]-5,Hp[1]+1.2);c.lineTo(Hp[0]-2,Hp[1]+1.2);c.lineTo(Hp[0]-2.4,Hp[1]+7.2);c.lineTo(Hp[0]-5.6-w1*.6,Hp[1]+6);c.closePath();c.fill();}
 // collar
 if(isS){c.beginPath();c.moveTo(S[0]-sw,S[1]+1);c.lineTo(S[0]-4.2*tw,S[1]-3.8);c.quadraticCurveTo(S[0]+.5,S[1]-5.4,S[0]+4.6*tw,S[1]-3.6);c.lineTo(S[0]+sw,S[1]+1);c.quadraticCurveTo(S[0],S[1]-1.4,S[0]-sw,S[1]+1);c.closePath();c.fillStyle=css(d.collar,1);c.fill();c.strokeStyle=outC(d.collar);c.lineWidth=.75;c.stroke();
   c.strokeStyle=hiC(d.collar,1,.6);c.lineWidth=.38;c.beginPath();c.moveTo(S[0]-3.6,S[1]-2.8);c.quadraticCurveTo(S[0]+.5,S[1]-4.2,S[0]+3.8,S[1]-2.6);c.stroke();c.fillStyle=shC(d.collar,1);c.beginPath();c.moveTo(S[0]-sw,S[1]+1);c.lineTo(S[0]-4.2*tw,S[1]-3.8);c.lineTo(S[0]-2.6,S[1]-3.6);c.lineTo(S[0]-3,S[1]+.4);c.closePath();c.fill();}
 else{c.beginPath();c.moveTo(S[0]-sw,S[1]+1);c.lineTo(S[0]-4*tw,S[1]-2.8);c.quadraticCurveTo(S[0]+.5,S[1]-3.8,S[0]+4.2*tw,S[1]-2.6);c.lineTo(S[0]+sw,S[1]+1);c.quadraticCurveTo(S[0],S[1]-.5,S[0]-sw,S[1]+1);c.closePath();c.fillStyle=css(d.collar,1);c.fill();c.strokeStyle=outC(d.collar);c.lineWidth=.75;c.stroke();c.strokeStyle=hiC(d.collar,1,.55);c.lineWidth=.38;c.beginPath();c.moveTo(S[0]-3.4,S[1]-1.6);c.quadraticCurveTo(S[0]+.5,S[1]-2.6,S[0]+3.4,S[1]-1.5);c.stroke();}
 });
 leg(r.hip,r.lf,1,true);
 up(()=>drawHead(c,d,P,r,time));
 if(handsUp)up(()=>arm(r.hb,.74,hB,r.shB));
 up(()=>arm(r.hf,1,hF,r.shF));
 c.restore();
 return r;
}
function eyeShape(c,w,h){c.beginPath();c.moveTo(-w/2,.3);c.quadraticCurveTo(-w*.1,-h*1.6,w/2,.05);c.quadraticCurveTo(w*.05,h*1.2,-w/2,.3);c.closePath();}
let blinkK=0,MANG=false;
function drawEye(c,d,cx,cy,w,h,rot,e,red,far){
 c.save();c.translate(cx,cy);c.rotate(rot);
 if(e===3){c.strokeStyle=OUT;c.lineWidth=.95;c.lineCap='round';c.lineJoin='round';c.beginPath();if(!far){c.moveTo(-w/2,-.9);c.lineTo(w*.3,.5);c.lineTo(-w/2,1.9);}else{c.moveTo(w/2,-.9);c.lineTo(-w*.3,.5);c.lineTo(w/2,1.9);}c.stroke();c.restore();return;}
 const hh=h*(e===1?.85:e===2?1.12:e===6?.7:e===7?.78:1)*(1-blinkK*.88);
 eyeShape(c,w,hh);c.fillStyle='#f4f2f8';c.fill();
 c.save();c.clip();
 const ir=Math.min(w*.36,hh*1.55),ix=w*.12,iy=.2;
 const ig=c.createLinearGradient(0,iy-ir,0,iy+ir);
 if(red){ig.addColorStop(0,'#7a0610');ig.addColorStop(.55,'#e5141f');ig.addColorStop(1,'#ff6a52');}else{ig.addColorStop(0,css(d.iris,.65));ig.addColorStop(.5,css(d.iris,1));ig.addColorStop(1,css(d.irisHi,1));}
 c.fillStyle=ig;c.beginPath();c.arc(ix,iy,ir,0,TAU);c.fill();
 if(red&&MANG){c.fillStyle='#120000';c.beginPath();c.arc(ix,iy,ir*.2,0,TAU);c.fill();for(let i=0;i<3;i++){const a=i*TAU/3+.3;c.beginPath();c.moveTo(ix+Math.cos(a)*ir*.2,iy+Math.sin(a)*ir*.2);c.quadraticCurveTo(ix+Math.cos(a+.9)*ir*.95,iy+Math.sin(a+.9)*ir*.95,ix+Math.cos(a+.4)*ir*.98,iy+Math.sin(a+.4)*ir*.98);c.quadraticCurveTo(ix+Math.cos(a+.1)*ir*.5,iy+Math.sin(a+.1)*ir*.5,ix+Math.cos(a)*ir*.2,iy+Math.sin(a)*ir*.2);c.fill();}}else if(red){c.strokeStyle='rgba(20,0,0,.8)';c.lineWidth=.22;c.beginPath();c.arc(ix,iy,ir*.62,0,TAU);c.stroke();c.fillStyle='#130000';for(let i=0;i<3;i++){const a=i*TAU/3+.6;const px=ix+Math.cos(a)*ir*.62,py=iy+Math.sin(a)*ir*.62;c.beginPath();c.arc(px,py,ir*.2,0,TAU);c.fill();c.strokeStyle='#130000';c.lineWidth=.2;c.beginPath();c.moveTo(px,py);c.lineTo(px+Math.cos(a+1.6)*ir*.3,py+Math.sin(a+1.6)*ir*.3);c.stroke();}c.beginPath();c.arc(ix,iy,ir*.16,0,TAU);c.fill();}
 else{c.fillStyle='#03030a';c.beginPath();c.arc(ix+.05,iy,ir*.5,0,TAU);c.fill();}
 c.fillStyle='rgba(255,255,255,.92)';c.beginPath();c.arc(ix-ir*.4,iy-ir*.4,ir*.24,0,TAU);c.fill();
 const lg=c.createLinearGradient(0,-hh*1.5,0,hh*.3);lg.addColorStop(0,'rgba(10,5,30,.6)');lg.addColorStop(1,'rgba(10,5,30,0)');c.fillStyle=lg;c.fillRect(-w,-hh*2,w*2,hh*2.4);
 c.restore();
 c.strokeStyle=OUT;c.lineWidth=d.lidW;c.lineCap='round';c.beginPath();c.moveTo(-w/2-.2,.35);c.quadraticCurveTo(-w*.1,-hh*1.75,w/2+.1,.0);c.stroke();
 c.strokeStyle='rgba(80,40,50,.35)';c.lineWidth=.3;c.beginPath();c.moveTo(-w*.3,.7);c.quadraticCurveTo(0,hh*.95,w*.3,.55);c.stroke();
 c.restore();}
function lock(c,bx,by,tx,ty,w,bend,fill,out,hi,hiA){
 const dx=tx-bx,dy=ty-by,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
 const mx=(bx+tx)/2+nx*bend,my=(by+ty)/2+ny*bend;
 c.beginPath();c.moveTo(bx+nx*w/2,by+ny*w/2);c.quadraticCurveTo(mx+nx*w*.3,my+ny*w*.3,tx,ty);c.quadraticCurveTo(mx-nx*w*.3,my-ny*w*.3,bx-nx*w/2,by-ny*w/2);c.closePath();
 c.fillStyle=fill;c.fill();c.strokeStyle=out;c.lineWidth=.6;c.lineJoin='round';c.stroke();
 if(hi){c.strokeStyle=hi;c.globalAlpha=hiA==null?.55:hiA;c.lineWidth=.42;c.lineCap='round';c.beginPath();c.moveTo(bx+(tx-bx)*.28+nx*w*.12,by+(ty-by)*.28+ny*w*.12);c.quadraticCurveTo(mx+nx*w*.14,my+ny*w*.14,bx+(tx-bx)*.9+nx*w*.02,by+(ty-by)*.9+ny*w*.02);c.stroke();c.globalAlpha=1;}}
/* Cabeca de frente (usada quando o tronco esta virado para a camera): rosto simetrico, franja, protetor de testa, bigodes, hematomas e sangue. */
function drawHeadFront(c,d,P,r,time){
 const C=r.C,isS=d.style==='s',e=Math.round(P.expr),hairO=outC(d.hair),skinO=d.lv2>0?css(mix([112,54,56],[58,48,92],d.lv2),1):css([112,54,56],1),X=1.4;
 c.save();c.translate(C[0],C[1]);c.rotate(P.hr);c.scale(HEADS,HEADS);c.lineJoin='round';c.lineCap='round';
 const hg=c.createLinearGradient(-8,-18,9,-2);hg.addColorStop(0,css(d.hairHi,1));hg.addColorStop(.5,css(d.hair,1.05));hg.addColorStop(1,css(d.hair,.72));
 const wv=P.wind*1.4+P.hix*.25,sp=isS?[[-7.2,-2,-10.5,-9,-6.2,-6],[-6,-6,-9,-15,-3.2,-9.5],[-2.6,-9,-4.4,-17,.4,-10.5],[1.4,-10,2.2,-18.5,4.4,-10.5],[4.6,-9,8.4,-16.5,7.2,-8.8],[7.2,-6,11.4,-12,9.2,-4.6],[8.6,-2,12,-6,8.8,-.2]]
  :[[-7.4,-2,-12,-7,-6.5,-6],[-6.2,-6,-11,-14,-3.6,-9],[-3,-9,-6,-18,0,-10.5],[1.4,-10,1.4,-20,4,-10.5],[4.5,-9,8.6,-18.5,7,-9],[7.2,-6,12.2,-14,9.2,-5],[8.6,-2,13,-7.5,8.8,-.5]];
 for(const s of sp){const dx=wv*.3;c.beginPath();c.moveTo(s[0],s[1]);c.lineTo(s[2]+dx,s[3]);c.lineTo(s[4],s[5]);c.closePath();c.fillStyle=hg;c.fill();c.strokeStyle=hairO;c.lineWidth=.6;c.stroke();}
 const ng=c.createLinearGradient(-1,0,5,0);ng.addColorStop(0,shC(d.skin,1));ng.addColorStop(1,css(d.skin,.96));c.fillStyle=ng;c.fillRect(X-2.4,6.5,4.8,9);
 for(const sx of [-1,1]){c.beginPath();c.ellipse(X+sx*7,2,1.4,2.2,0,0,TAU);c.fillStyle=css(d.skin,.9);c.fill();c.strokeStyle=skinO;c.lineWidth=.5;c.stroke();}
 const face=()=>{c.beginPath();c.moveTo(X-6.4,-4.5);c.bezierCurveTo(X-6.4,-10.5,X+6.4,-10.5,X+6.4,-4.5);c.bezierCurveTo(X+6.9,1,X+5.8,6.2,X+3.4,8.6);c.bezierCurveTo(X+2,9.9,X-2,9.9,X-3.4,8.6);c.bezierCurveTo(X-5.8,6.2,X-6.9,1,X-6.4,-4.5);c.closePath();};
 face();const fg=c.createLinearGradient(X-7,-9,X+7,9);fg.addColorStop(0,css(d.skin,.92));fg.addColorStop(.5,css(d.skin,1.05));fg.addColorStop(1,css(d.skin,.86));c.fillStyle=fg;c.fill();
 c.save();face();c.clip();c.fillStyle='rgba(80,30,60,.22)';c.fillRect(X-8,-10,3.2,22);c.fillRect(X+5,-10,3.2,22);c.fillStyle='rgba(70,30,60,.25)';c.beginPath();c.ellipse(X,10,5.2,2.4,0,0,TAU);c.fill();c.restore();
 face();c.strokeStyle=skinO;c.lineWidth=.7;c.stroke();
 /* olhos e sobrancelhas */
 const ey=1.2;
 for(const sx of [-1,1]){const x=X+sx*2.7;
  if(e===3){c.strokeStyle='rgba(40,18,24,.95)';c.lineWidth=.75;c.beginPath();c.moveTo(x-sx*1.5,ey-1.2);c.lineTo(x+sx*1.2,ey+.15);c.lineTo(x-sx*1.5,ey+1.4);c.stroke();}
  else{const L2=d.lv2>0;c.beginPath();c.ellipse(x,ey,1.6*d.eyeW,1.15*d.eyeH*(L2?.72:1),L2?sx*.22:0,0,TAU);c.fillStyle='#f4f1ea';c.fill();c.strokeStyle='rgba(30,16,24,.9)';c.lineWidth=.45;c.stroke();c.beginPath();c.arc(x,ey+.1,L2?.88:.95,0,TAU);c.fillStyle=L2?'#d2121c':css(d.iris,1);c.fill();if(L2){c.fillStyle='#120000';c.beginPath();c.arc(x,ey+.1,.2,0,TAU);c.fill();for(let q=0;q<3;q++){const an=q*TAU/3+.5;c.beginPath();c.arc(x+Math.cos(an)*.5,ey+.1+Math.sin(an)*.5,.15,0,TAU);c.fill();}c.fillStyle='rgba(30,0,10,.35)';c.fillRect(x-1.7,ey-1.2,3.4,.7);}c.fillStyle='#fff';c.fillRect(x-.2,ey-.5,.4,.4);}
  c.strokeStyle=hairO;c.lineWidth=.7;c.beginPath();if(d.lv2>0){c.moveTo(x-sx*2,ey-1.7);c.lineTo(x+sx*1.5,ey-3.1);}else{c.moveTo(x-sx*2,ey-2.6+(e===3?-.4:0));c.lineTo(x+sx*1.3,ey-(e===3?3.3:2.2));}c.stroke();}
 /* hematomas roxos em volta dos olhos */
 for(const sx of [-1,1]){c.beginPath();c.ellipse(X+sx*2.7,ey+.5,2.5,1.9,0,0,TAU);c.fillStyle='rgba(105,45,140,.42)';c.fill();}
 if(d.lv2>0){const p=d.lv2;c.save();face();c.clip();
  for(const sx of [-1,1]){c.fillStyle=`rgba(40,28,84,${.34*p})`;c.beginPath();c.ellipse(X+sx*2.7,ey+1.1,2.6,1.4,sx*.15,0,TAU);c.fill();}
  c.strokeStyle=`rgba(36,24,70,${.6*p})`;c.lineWidth=.36;c.lineCap='round';
  c.beginPath();c.moveTo(X-.5,-2.2);c.lineTo(X-.3,-.2);c.stroke();c.beginPath();c.moveTo(X+.5,-2.2);c.lineTo(X+.3,-.2);c.stroke();
  for(const sx of [-1,1]){c.beginPath();c.moveTo(X+sx*1.6,3.4);c.quadraticCurveTo(X+sx*3.2,5.2,X+sx*2.6,7.4);c.stroke();c.beginPath();c.moveTo(X+sx*.8,ey+2.2);c.quadraticCurveTo(X+sx*2.7,ey+3,X+sx*4.5,ey+2.1);c.stroke();}
  c.fillStyle=`rgba(58,46,100,${.55*p})`;for(let i=0;i<11;i++){const rr=R(900+i);c.beginPath();c.arc(X-5+rr()*10,-1+rr()*9,.2+rr()*.2,0,TAU);c.fill();}
  c.restore();}
 /* bigodes do Naruto */
 if(!isS){c.strokeStyle='rgba(80,42,30,.85)';c.lineWidth=.38;for(const sx of [-1,1])for(let i=0;i<3;i++){c.beginPath();c.moveTo(X+sx*3.6,3+i*1.1);c.lineTo(X+sx*6.2,2.4+i*1.35);c.stroke();}}
 c.strokeStyle='rgba(120,60,60,.7)';c.lineWidth=.4;c.beginPath();c.moveTo(X,3.2);c.lineTo(X+.4,4.2);c.lineTo(X-.3,4.4);c.stroke();
 /* boca aberta, sangrando */
 const scr=P.scream||0;c.beginPath();c.ellipse(X,7+scr*.9,1.7+scr*1.1,1.2+(e===3?.35:0)+scr*2.3,0,0,TAU);c.fillStyle=scr>.3?'#2a0508':'#4a0a14';c.fill();if(scr>.3){c.fillStyle='#f2efe6';c.fillRect(X-1.9,5.3+scr*.2,3.8,.9);c.fillStyle='#c0405a';c.beginPath();c.ellipse(X,9.4+scr*.5,1.5,.9,0,0,TAU);c.fill();}c.strokeStyle=skinO;c.lineWidth=.45;c.stroke();
 c.fillStyle='rgba(200,18,28,.9)';c.beginPath();c.moveTo(X-.2,7.6);c.bezierCurveTo(X-.6,9,X-.1,10.5,X-.4,12);c.lineTo(X+.5,12);c.bezierCurveTo(X+.7,10,X+.9,8.6,X+.9,7.8);c.closePath();c.fill();
 /* franja irregular */
 const fr=[[X-6.6,-5],[X-6.9,-10],[X-3.6,-8],[X-2.2,-11.8],[X,-8.2],[X+2.3,-12],[X+3.8,-8],[X+7,-10.2],[X+6.6,-5],[X+5,-6.6],[X+3,-5.2],[X+1,-6.9],[X-1.4,-5.3],[X-3.4,-6.8],[X-5,-5.4]];
 c.beginPath();fr.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle=hg;c.fill();c.strokeStyle=hairO;c.lineWidth=.6;c.stroke();
 /* protetor de testa */
 c.fillStyle=css(d.band,1);c.fillRect(X-7,-5.2,14,2.9);c.strokeStyle=outC(d.band);c.lineWidth=.5;c.strokeRect(X-7,-5.2,14,2.9);
 c.beginPath();c.roundRect(X-3.7,-5.8,7.4,4,.7);c.fillStyle=css(d.plate,1);c.fill();c.strokeStyle='rgba(30,30,60,.8)';c.lineWidth=.45;c.stroke();
 c.strokeStyle='rgba(50,50,90,.9)';c.lineWidth=.4;c.beginPath();c.arc(X-.4,-3.8,1,.4,5.4);c.moveTo(X-.4,-3.8);c.lineTo(X+1.6,-3.8);c.stroke();
 /* corte e sangue na testa */
 c.strokeStyle='rgba(170,16,26,.95)';c.lineWidth=.7;c.beginPath();c.moveTo(X+1.8,-9);c.lineTo(X+2.4,-6);c.stroke();c.fillStyle='rgba(150,12,22,.85)';c.beginPath();c.ellipse(X+2.4,-5.8,.6,.9,0,0,TAU);c.fill();
 c.restore();}
function drawHead(c,d,P,r,time){
 if((P.turn||0)>=.8){drawHeadFront(c,d,P,r,time);return;}
 const e=(d.lv2>.5&&Math.round(P.expr)===0)?1:Math.round(P.expr),red=P.red>.5||d.lv2>.5,wind=P.wind+.12,C=r.C,isS=d.style==='s';
 const WL=WOUNDS[isS?'s':'n'];
 const singe=Math.min(1,(WL.filter(w=>w.k==='burn'||w.k==='faceBurn').length+((burning&&!isS)?3:0))/6),bleed=Math.min(1,WL.filter(w=>w.k==='blood'||w.k==='puncture'||(w.part==='face'&&(w.k==='brow'||w.k==='lip'||w.k==='nose'))).length/5);
 if(singe>0)d=Object.assign({},d,{hair:mix(d.hair,[26,18,20],singe*.6),hairHi:mix(d.hairHi,[96,64,50],singe*.65)});
 const hairO=outC(d.hair),skinO=d.lv2>0?css(mix([112,54,56],[58,48,92],d.lv2),1):css([112,54,56],1);
 c.save();c.translate(C[0],C[1]);c.rotate(P.hr);c.scale(HEADS,HEADS);
 const lockFill=(bx,by,tx,ty,dark)=>{const g2=c.createLinearGradient(bx,by,tx,ty);g2.addColorStop(0,css(d.hair,dark?.45:.62));g2.addColorStop(.55,css(d.hair,dark?.8:1.05));g2.addColorStop(1,css(mix(d.hair,d.hairHi,dark?.3:.62),1));return g2;};
 const wp=(x,y)=>{const k=Math.max(0,-x-2)/17;return[x-wind*k*9+P.hix*k,y-wind*k*3+P.hiy*k+Math.sin(time*(wind>.5?18:2.4)+y*.7)*wind*k*(wind>.5?1:.55)];};
  const L=(a,dark)=>{const sfk=1-singe*.2;const t=wp(a[0]+(a[2]-a[0])*sfk,a[1]+(a[3]-a[1])*sfk);lock(c,a[0],a[1],t[0],t[1],a[4]*1.3,a[5]*1.25,lockFill(a[0],a[1],t[0],t[1],dark),hairO,css(d.hairHi,1),dark?.45:.85);
  const dx=t[0]-a[0],dy=t[1]-a[1],len=Math.hypot(dx,dy)||1,ang=Math.atan2(dy,dx);
  for(const j of [a[5]>0?-1:1]){const bx=a[0]+dx*.2,by=a[1]+dy*.2,l2=len*.6,an2=ang+j*.4,tx2=bx+Math.cos(an2)*l2,ty2=by+Math.sin(an2)*l2,tt=wp(tx2,ty2);
   lock(c,bx,by,tt[0],tt[1],a[4]*.5,a[5]*.4*j,lockFill(bx,by,tt[0],tt[1],dark),hairO,css(d.hairHi,1),dark?.3:.6);}
  if(singe>.2){c.strokeStyle=hairO;c.lineWidth=.3;c.lineCap='round';for(let q=0;q<2;q++){const aa=Math.atan2(t[1]-a[1],t[0]-a[0])+(q?.8:-.8);c.beginPath();c.moveTo(t[0],t[1]);c.quadraticCurveTo(t[0]+Math.cos(aa)*1.8,t[1]+Math.sin(aa)*1.8,t[0]+Math.cos(aa+1.2)*2.2,t[1]+Math.sin(aa+1.2)*2.2);c.stroke();}}};
 // headband tails
 const wv=Math.sin(time*5)*1.2+wind*3-P.hix*.6;
 poly(c,[[-6.5,-3],[-12+wv*.3,-2.4],[-17-wv*1.4,1.2-wind*2],[-12.5,.4],[-15-wv*1.6,4-wind*1.6],[-9,1.2],[-6.5,0]],css(d.band,1),outC(d.band),.55);
 const backL=isS?[[-4,-6,-14,-10,5.6,-1.2],[-5,-2,-18,-3.5,6,.8],[-5,1.5,-16.5,5,5.8,1.4],[-4,4,-11,11,5,1.2],[-3,5.5,-5.5,12.5,4.2,.6],[-3,-9,-11,-14.5,5.4,-1.6]]
  :[[-6,-4,-14.5,-9,5.4,-1],[-6,-1,-16,-2.5,5.4,.6],[-5.5,2.5,-12.5,6.5,4.6,1],[-5,-7,-12,-13.5,5.4,-1.4],[-2,-9,-6,-17,5.4,-.8],[2,-9,0,-18.5,5.6,-.2]];
 const lh=d.longHair||0;
 if(lh>0){for(const a of backL){const k=1+.75*lh;L([a[0],a[1],a[0]+(a[2]-a[0])*k,a[1]+(a[3]-a[1])*k+3.5*lh,a[4],a[5]],true);}
  for(const a of [[-3,3,-10,19,5.2,1.2],[-2,5,-5,21,4.6,.6],[-5,0,-15,15,5.4,1.4]])L([a[0],a[1],a[0]+(a[2]-a[0])*lh,a[1]+(a[3]-a[1])*lh,a[4],a[5]],true);}
 else for(const a of backL)L(a,true);
 // neck
 const ng=c.createLinearGradient(-1,0,4,0);ng.addColorStop(0,shC(d.skin,1));ng.addColorStop(1,css(d.skin,.96));c.fillStyle=ng;c.fillRect(isS?-1.8:-1.6,4.5,isS?6:5.4,10.5);
 c.fillStyle='rgba(60,20,50,.34)';c.fillRect(-1.8,6.5,6.4,2.6);
 // ear
 c.beginPath();c.ellipse(-5.8,1.4,1.5,2.4,0,0,TAU);c.fillStyle=css(d.skin,.9);c.fill();c.strokeStyle=skinO;c.lineWidth=.5;c.stroke();c.strokeStyle='rgba(150,70,70,.6)';c.lineWidth=.3;c.beginPath();c.arc(-5.6,1.4,.8,.5,4);c.stroke();
 // hair dome (behind face top)
 c.beginPath();c.moveTo(-7,-3);c.bezierCurveTo(-8.4,-12,0,-15,5,-13.4);c.bezierCurveTo(9.4,-12,10.4,-7,9.6,-3);c.closePath();
 const dg=c.createLinearGradient(-8,-14,9,-3);dg.addColorStop(0,css(d.hair,1.35));dg.addColorStop(1,css(d.hair,.7));c.fillStyle=dg;c.fill();c.strokeStyle=hairO;c.lineWidth=.6;c.stroke();
 // face
 const fp=()=>{c.beginPath();c.moveTo(-5.6,-4.8);c.bezierCurveTo(-3.6,-10,4,-10.6,7.2,-5.4);c.bezierCurveTo(8.2,-3.8,8.4,-1.4,8.2,.6);
  if(isS){c.bezierCurveTo(8.0,3.4,7.2,5.8,5.8,7.6);c.lineTo(3.6,9.4);c.bezierCurveTo(2.8,9.8,1.4,9.8,.4,9.4);c.bezierCurveTo(-2.2,8.4,-5.2,4.8,-5.7,-.4);}
  else{c.bezierCurveTo(8.0,3.6,7.0,6.0,5.2,8.0);c.bezierCurveTo(4.0,9.1,2.8,9.7,1.6,9.5);c.bezierCurveTo(-1.6,8.6,-5.2,5,-5.7,-.4);}
  c.closePath();};
 fp();
 const fg=c.createLinearGradient(-6,-9,9,8);fg.addColorStop(0,css(d.skin,.9));fg.addColorStop(.5,css(d.skin,1.04));fg.addColorStop(1,css(d.skin,.88));c.fillStyle=fg;c.fill();
 c.save();c.clip();
 let sg=c.createLinearGradient(0,-9,0,-2);sg.addColorStop(0,'rgba(50,20,70,.42)');sg.addColorStop(1,'rgba(50,20,70,0)');c.fillStyle=sg;c.fillRect(-8,-10,18,9);
 sg=c.createLinearGradient(-7,0,-1,0);sg.addColorStop(0,'rgba(70,20,60,.34)');sg.addColorStop(1,'rgba(70,20,60,0)');c.fillStyle=sg;c.fillRect(-7,-6,7,15);
 if(isS){c.fillStyle='rgba(90,40,60,.2)';c.beginPath();c.moveTo(-5,2.4);c.quadraticCurveTo(-1,4.2,2,8);c.lineTo(-5,8);c.closePath();c.fill();c.fillStyle='rgba(90,40,60,.16)';c.beginPath();c.moveTo(7,1.6);c.quadraticCurveTo(6.6,5,4.6,8);c.lineTo(9.4,8);c.lineTo(9.4,1.6);c.closePath();c.fill();c.fillStyle='rgba(255,236,220,.2)';c.beginPath();c.ellipse(4.6,-1.8,1.5,3,.4,0,TAU);c.fill();}
 else{c.fillStyle='rgba(240,130,120,.16)';c.beginPath();c.ellipse(-1.2,4.1,2,1,0,0,TAU);c.fill();c.fillStyle='rgba(255,240,230,.2)';c.beginPath();c.ellipse(4.8,-2.4,1.6,2.8,.4,0,TAU);c.fill();}
 c.fillStyle='rgba(70,30,60,.3)';c.beginPath();c.ellipse(2.8,9.6,5.5,2.3,0,0,TAU);c.fill();
 c.restore();
 fp();c.strokeStyle=skinO;c.lineWidth=.7;c.lineJoin='round';c.stroke();
 // eyes
 MANG=P.red>1.5;{const bp=(time+(isS?0:1.3))%3.6;blinkK=(e===3||bp>.14)?0:1-Math.abs(bp/.07-1);}
 const slant=e===1?(isS?.28:.2):e===2?.12:0,eh=d.eyeH,ew=d.eyeW;
 drawEye(c,d,.4,isS?.5:.3,5.4*ew,1.75*eh,slant+(isS&&e===0?.08:0),e,red,false);
 drawEye(c,d,6.1,isS?.3:.1,3.0*ew,1.5*eh,-slant-(isS&&e===0?.08:0),e,red,true);
 // brows
 if(d.lv2>0){const p=d.lv2;c.save();fp();c.clip();c.lineCap='round';
  // olheiras fundas e sombra roxa em volta dos olhos
  c.fillStyle=`rgba(52,38,96,${.42*p})`;c.beginPath();c.ellipse(.4,1.0,3.9,1.9,.12,0,TAU);c.fill();c.beginPath();c.ellipse(6.1,.8,2.5,1.4,-.12,0,TAU);c.fill();
  c.fillStyle=`rgba(36,24,70,${.3*p})`;c.beginPath();c.ellipse(.6,-2.3,4.2,1.2,.08,0,TAU);c.fill();
  // sulcos de raiva: entre as sobrancelhas, sob os olhos, ao lado do nariz e da boca
  c.strokeStyle=`rgba(36,24,70,${.6*p})`;c.lineWidth=.38;
  c.beginPath();c.moveTo(3.2,-3.6);c.quadraticCurveTo(3.7,-2.4,3.3,-1.2);c.stroke();c.beginPath();c.moveTo(4.4,-3.4);c.quadraticCurveTo(4.8,-2.4,4.5,-1.4);c.stroke();
  c.beginPath();c.moveTo(-2.3,2.6);c.quadraticCurveTo(.4,3.6,3.0,2.8);c.stroke();c.beginPath();c.moveTo(4.4,2.2);c.quadraticCurveTo(6.2,2.8,7.4,2.0);c.stroke();
  c.beginPath();c.moveTo(1.6,3.8);c.quadraticCurveTo(.8,6.2,2.0,8.0);c.stroke();
  // pintinhas escuras na pele, como no anime
  c.fillStyle=`rgba(58,46,100,${.55*p})`;for(let i=0;i<11;i++){const rr=R(900+i);c.beginPath();c.arc(-3.6+rr()*10.6,-3+rr()*9.6,.22+rr()*.2,0,TAU);c.fill();}
  c.restore();}
 c.strokeStyle=css(d.hair,isS?.62:.72);c.lineWidth=d.browW;c.lineCap='round';
 const bo=e===1?[-4.7,-2.9,-4.1]:e===2?[-4.4,-3.2,-4.4]:e===3?[-3.2,-4.4,-4.2]:isS?[-4.3,-3.8,-4.5]:e===5?[-3.9,-3.4,-4.4]:[-3.6,-3.4,-4.4];
 c.beginPath();c.moveTo(-2.8,bo[0]);c.quadraticCurveTo(.6,bo[2],3.9,bo[1]);c.stroke();
 const bo2=e===1?[-3.0,-4.6,-4.0]:e===2?[-3.2,-4.4,-4.4]:e===3?[-4.4,-3.2,-4.2]:isS?[-3.8,-4.3,-4.4]:e===5?[-3.4,-4.0,-4.2]:[-3.4,-3.6,-4.2];
 c.beginPath();c.moveTo(4.8,bo2[0]);c.quadraticCurveTo(6.3,bo2[2],7.8,bo2[1]);c.stroke();
 // nose
 c.strokeStyle='rgba(130,62,60,.7)';c.lineWidth=.5;c.beginPath();c.moveTo(isS?3.7:3.9,isS?1.0:2.0);c.quadraticCurveTo(isS?4.6:4.5,isS?2.4:3.0,3.8,3.7);c.stroke();c.fillStyle='rgba(130,62,60,.5)';c.beginPath();c.ellipse(4.3,3.9,.55,.28,0,0,TAU);c.fill();
 if(!isS){c.strokeStyle='#7a3c18';c.lineWidth=.5;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-4.4,2.2+i*1.1);c.lineTo(-1,1.8+i*1.1);c.stroke();c.beginPath();c.moveTo(6.8,2.0+i*1.1);c.lineTo(8.2,1.9+i*1.1);c.stroke();}}
 if(MANG&&isS){c.lineCap='round';c.strokeStyle='#8a0408';c.lineWidth=.9;c.beginPath();c.moveTo(1.0,1.8);c.quadraticCurveTo(.4,4.6,1.2,7.6);c.stroke();c.strokeStyle='#d01418';c.lineWidth=.45;c.stroke();c.fillStyle='#b00a10';c.beginPath();c.arc(1.2,8.1,.7,0,TAU);c.fill();}
 // mouth
 c.lineCap='round';c.lineJoin='round';const mx=3.3,my=6.0;
 if(e===4){c.fillStyle='#3a0606';c.beginPath();c.ellipse(mx+.4,my-.2,1.9,1.9,0,0,TAU);c.fill();c.strokeStyle=OUT;c.lineWidth=.55;c.stroke();orb(c,mx+.4,my-.2,2,[[0,'rgba(255,200,80,.95)'],[1,'rgba(255,90,20,0)']]);}
 else if(e===2){c.beginPath();c.moveTo(mx-2.4,my-1);c.quadraticCurveTo(mx,my-.5,mx+2.6,my-1.1);c.quadraticCurveTo(mx+2.2,my+2.4,mx,my+2.6);c.quadraticCurveTo(mx-2.2,my+2.4,mx-2.4,my-1);c.closePath();c.fillStyle='#4a0a10';c.fill();c.strokeStyle=OUT;c.lineWidth=.6;c.stroke();c.fillStyle='#fff';c.fillRect(mx-1.8,my-.9,3.9,.8);c.fillStyle='#d8586c';c.beginPath();c.ellipse(mx+.1,my+1.8,1.4,.7,0,0,TAU);c.fill();}
 else if(e===3){c.beginPath();c.moveTo(mx-2,my-.4);c.lineTo(mx+2.2,my-.7);c.lineTo(mx+1.8,my+1.6);c.quadraticCurveTo(mx,my+2,mx-1.6,my+1.5);c.closePath();c.fillStyle='#4a0a10';c.fill();c.strokeStyle=OUT;c.lineWidth=.6;c.stroke();c.fillStyle='#fff';c.fillRect(mx-1.6,my-.3,3.4,.8);}
 else if(e===7){c.strokeStyle='#6a2626';c.lineWidth=.7;c.beginPath();c.moveTo(mx-1.8,my+.4);c.quadraticCurveTo(mx+.8,my+.6,mx+2.8,my-.7);c.stroke();}
 else if(e===6){c.beginPath();c.moveTo(mx-3,my-1.1);c.quadraticCurveTo(mx,my+.7,mx+3.2,my-1.3);c.quadraticCurveTo(mx+2.4,my+3.6,mx,my+3.7);c.quadraticCurveTo(mx-2.6,my+3.6,mx-3,my-1.1);c.closePath();c.fillStyle='#5a0e12';c.fill();c.strokeStyle=OUT;c.lineWidth=.6;c.stroke();c.fillStyle='#fff';c.beginPath();c.moveTo(mx-2.6,my-.9);c.quadraticCurveTo(mx,my+.5,mx+2.8,my-1.1);c.lineTo(mx+2.6,my+.5);c.quadraticCurveTo(mx,my+1.5,mx-2.4,my+.5);c.closePath();c.fill();}
 else if(e===5){c.strokeStyle='#7a2c2c';c.lineWidth=.7;c.beginPath();c.moveTo(mx-1.8,my+.2);c.quadraticCurveTo(mx+.6,my+.9,mx+2.6,my-.5);c.stroke();}
 else if(e===1){c.strokeStyle='#6a2626';c.lineWidth=.7;c.beginPath();c.moveTo(mx-2,my);c.quadraticCurveTo(mx,my-.4,mx+2.5,my+.6);c.stroke();}
 else{c.strokeStyle='#7a3430';c.lineWidth=.65;c.beginPath();c.moveTo(mx-1.8,my);c.lineTo(mx+2.4,my);c.stroke();}
 {const fw=WOUNDS[isS?'s':'n'].filter(w=>w.part==='face');if(fw.length){c.save();fp();c.clip();for(const w of fw)drawFaceWound(c,w,time-w.t0);c.restore();}}
 // top locks + fringe (before headband so band overlaps tips)
 const topL=isS?[[0,-10,-6,-16,5.4,-1.2],[3,-10,2,-17,5.2,.4],[6,-9,10,-14.5,4.6,1],[-4,-9,-11,-13.5,5,-1.2]]
  :[[-3,-8,-6.5,-16.5,5.4,-.8],[1,-9,.5,-18.5,5.8,.2],[4.5,-8.5,8,-17,5.4,.8],[7.4,-7,12.5,-12.5,4.8,1.2],[-5.5,-6,-10,-12,5,-1.2]];
 for(const a of topL)L(a,false);
 const fr=isS?[[-1.5,-8,-3,-3.8,3.2,-.4],[2.4,-8,1.6,-3.6,3.2,.3],[5.8,-8,7,-4.2,3,.5],[-4,-8,-5.4,-4.4,2.6,-.3]]:[[-2,-8,-3,-4.6,3,-.3],[1.5,-8,1.6,-4.4,2.8,.2],[5,-8,6.4,-4.6,3,.3]];
 for(const a of fr)L(a,false);
 // headband
 c.lineCap='butt';c.strokeStyle=outC(d.band);c.lineWidth=3.4;c.beginPath();c.moveTo(-7,-3.4);c.quadraticCurveTo(1,-6.4,9,-3.6);c.stroke();
 c.strokeStyle=css(d.band,1.15);c.lineWidth=2.5;c.stroke();
 c.strokeStyle=shC(d.band,1);c.lineWidth=.85;c.beginPath();c.moveTo(-6.6,-2.6);c.quadraticCurveTo(1,-5.4,8.6,-2.8);c.stroke();
 c.strokeStyle=css(d.band,2.4,.55);c.lineWidth=.42;c.beginPath();c.moveTo(-5.6,-4.5);c.quadraticCurveTo(1,-7.4,7.6,-4.8);c.stroke();
 c.save();c.translate(2.2,-5.0);c.rotate(-.04);const pg=c.createLinearGradient(-3.4,-2,3.4,2);pg.addColorStop(0,'#fff');pg.addColorStop(.45,css(d.plate,1));pg.addColorStop(1,'#707a9a');
 c.beginPath();c.roundRect(-3.3,-1.9,6.6,3.8,.9);c.fillStyle=pg;c.fill();c.strokeStyle=outC(d.plate);c.lineWidth=.5;c.stroke();
 c.strokeStyle='#3e4864';c.lineWidth=.48;c.beginPath();c.arc(.1,.1,.9,.4,TAU*.85);c.stroke();c.beginPath();c.moveTo(.1,-.8);c.lineTo(1.8,-1.1);c.stroke();c.fillStyle='rgba(255,255,255,.8)';c.fillRect(-2.8,-1.5,2,.45);c.restore();
 if(bleed>.25){c.fillStyle='rgba(118,8,14,.75)';for(const [x,y,r2] of [[-2,-9,1.7],[4,-9.5,1.4],[7.5,-7,1.1],[-6,-6,1.2]]){c.beginPath();c.ellipse(x,y,r2,r2*.8,.3,0,TAU);c.fill();}c.strokeStyle='rgba(118,8,14,.7)';c.lineWidth=.45;c.lineCap='round';for(let i=0;i<4;i++){c.beginPath();c.moveTo(-4+i*3.4,-11);c.lineTo(-4.4+i*3.4,-7.4);c.stroke();}}
 // side locks (front)
 const sideL=isS?[[7.4,-8,9.4,8,3.8,.9],[-5.6,-8,-6.6,6,3.4,-.5]]:[[7.4,-7,11.5,1.5,3.4,.9],[-5.6,-7,-9.4,2,3.2,-.8]];
 for(const a of sideL)L(a,false);
 c.restore();
}
/* Retratos do HUD: a propria cabeca em pixel art dos sprites (mesmo desenho do jogo), recortada e ampliada sem suavizar */
const PORTRAIT_CACHE={};
function portraitKind(id,d){return id==='ptG'?'demgozu':id==='ptM'?'demmeizu':id==='ptN'?((typeof nSkin==='function'&&nSkin())?'dem'+nSkin():'nar'):id==='ptK'?'sak':id==='ptKa'?'kak':id==='ptS0'?'sas':(d===SASUKE?((typeof roleN!=='undefined'&&roleN&&enemySkin)?'dem'+enemySkin:({sakura:'sak',kakashi:'kak'}[heroS]||'sas')):'lv2');}
function portrait(id,d,P){
 const cvp=$(id),c=cvp.getContext('2d'),kind=portraitKind(id,d);
 if(!PORTRAIT_CACHE[kind]&&kind==='demlobo'){const gr=ninkenGrid('lobo','bite',0),src=document.createElement('canvas');gr.draw(src,Object.assign({},NINKEN_PAL,NINKEN_KIND.lobo),1);PORTRAIT_CACHE[kind]={src,x0:17,y0:0,w:19,h:16};}
 if(!PORTRAIT_CACHE[kind]){
  const g=PixGrid(60,48),ox=10,oy=14;
  if(kind==='nar'||kind.slice(0,3)==='dem'){(kind==='nar'?naruHead:Object.assign({},DEMON_SKIN,COMMON_SKIN)[kind.slice(3)].head)(g,ox,oy,{});g.poly([[ox+8,oy+19],[ox+34,oy+19],[ox+40,oy+30],[ox+2,oy+30]],'O');g.poly([[ox+13,oy+18],[ox+29,oy+18],[ox+25,oy+24],[ox+17,oy+24]],'S');g.poly([[ox+8,oy+19],[ox+34,oy+19],[ox+34,oy+22],[ox+8,oy+22]],'N');}
  else{(kind==='lv2'?lv2Head:kind==='sak'?sakuraHead:kind==='kak'?kakashiHead:putHead)(g,ox,oy,{});g.poly([[ox+8,oy+19],[ox+34,oy+19],[ox+40,oy+30],[ox+2,oy+30]],'C');g.poly([[ox+13,oy+18],[ox+29,oy+18],[ox+25,oy+24],[ox+17,oy+24]],'S');g.poly([[ox+8,oy+19],[ox+34,oy+19],[ox+34,oy+22],[ox+8,oy+22]],'c');}
  let x0=99,x1=0,y0=99,y1=0;for(let y=0;y<g.h;y++)for(let x=0;x<g.w;x++)if(g.G[y][x]!=='.'){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  const src=document.createElement('canvas');g.draw(src,kind.slice(0,3)==='dem'?Object.assign({},DEMON_SKIN,COMMON_SKIN)[kind.slice(3)].pal:kind==='nar'?NAR_PAL:kind==='lv2'?LV2_PAL:kind==='sak'?SAK_PAL:kind==='kak'?KAK_PAL:Object.assign({},SAS2_PAL,SHARI),1);
  PORTRAIT_CACHE[kind]={src,x0,y0,w:x1-x0+1,h:y1-y0+1};}
 const p=PORTRAIT_CACHE[kind];c.clearRect(0,0,96,96);c.imageSmoothingEnabled=false;
 c.fillStyle=kind.slice(0,3)==='dem'?'#262e3c':kind==='nar'?'#3a2a14':kind==='sak'?'#3a1a2e':kind==='kak'?'#1c2a38':'#1b1a3a';c.fillRect(0,0,96,96);
 const s=Math.min(96/p.w,96/p.h),dw=p.w*s,dh=p.h*s;c.drawImage(p.src,p.x0,p.y0,p.w,p.h,(96-dw)/2,96-dh,dw,dh);}

function lerpP(pts,u){const L=[];let tot=0;for(let i=0;i<pts.length-1;i++){const l=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);L.push(l);tot+=l;}
 let dd=clamp(u,0,1)*tot,i=0;while(i<L.length-1&&dd>L[i]){dd-=L[i];i++;}const k=L[i]?dd/L[i]:0,a=pts[i],b=pts[i+1];return{x:a[0]+(b[0]-a[0])*k,y:a[1]+(b[1]-a[1])*k,ang:Math.atan2(b[1]-a[1],b[0]-a[0])};}
function woundPos(r,w){let p,up=true;
 if(w.part==='torso'){p={x:r.S[0]+(r.Hp[0]-r.S[0])*w.u+w.v*4.6,y:r.S[1]+(r.Hp[1]-r.S[1])*w.u,ang:Math.PI/2};}
 else{const m={armF:[r.shF,[r.hf.ex,r.hf.ey],[r.hf.hx,r.hf.hy]],armB:[r.shB,[r.hb.ex,r.hb.ey],[r.hb.hx,r.hb.hy]],legF:[r.hip,[r.lf.ex,r.lf.ey],[r.lf.hx,r.lf.hy]],legB:[r.hip,[r.lb.ex,r.lb.ey],[r.lb.hx,r.lb.hy]]}[w.part];
  p=lerpP(m,w.u);p.x+=-Math.sin(p.ang)*w.v*1.6;p.y+=Math.cos(p.ang)*w.v*1.6;if(w.part[0]==='l')up=false;}
 p.up=up;return p;}
function blobPath(c,r,seed,amp){const rn=R(seed);c.beginPath();const n=14;for(let i=0;i<=n;i++){const a=i/n*TAU,rr=r*(1-amp+rn()*amp*2);i?c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr*.85):c.moveTo(Math.cos(a)*rr,Math.sin(a)*rr*.85);}c.closePath();}
function drawWound(c,w,age){const r=w.r;
 if(w.k==='blood'){blobPath(c,r,w.seed,.35);c.fillStyle='rgba(118,8,14,.85)';c.fill();blobPath(c,r*.6,w.seed+3,.3);c.fillStyle='rgba(168,14,22,.85)';c.fill();
  c.fillStyle='rgba(255,170,170,'+(.4*Math.max(0,1-age/12))+')';c.beginPath();c.ellipse(-r*.25,-r*.3,r*.18,r*.1,-.5,0,TAU);c.fill();
  const dl=Math.min(1,age/2.2)*(w.drip||0);if(dl>0){const ex=r*.1+Math.sin(w.seed)*.5,ey=r*.4+dl*6;c.strokeStyle='rgba(118,8,14,.9)';c.lineWidth=Math.max(.35,r*.18);c.lineCap='round';c.beginPath();c.moveTo(r*.1,r*.4);c.lineTo(ex,ey);c.stroke();c.fillStyle='rgba(150,10,18,.95)';c.beginPath();c.arc(ex,ey,Math.max(.35,r*.14),0,TAU);c.fill();}}
 else if(w.k==='cut'){c.rotate(w.rot||0);c.lineCap='round';c.strokeStyle='rgba(245,170,170,.5)';c.lineWidth=.9;c.beginPath();c.moveTo(-r,0);c.quadraticCurveTo(0,.8,r,0);c.stroke();c.strokeStyle='rgba(90,0,8,.95)';c.lineWidth=.45;c.stroke();c.strokeStyle='rgba(190,20,30,.9)';c.lineWidth=.2;c.stroke();}
 else if(w.k==='bruise'){const g1=c.createRadialGradient(0,0,0,0,0,r);g1.addColorStop(0,'rgba(80,30,110,.62)');g1.addColorStop(.6,'rgba(110,50,120,.4)');g1.addColorStop(1,'rgba(150,150,60,0)');c.fillStyle=g1;c.scale(1,.8);c.beginPath();c.arc(0,0,r,0,TAU);c.fill();}
 else if(w.k==='burn'){const fresh=Math.max(0,1-age/8);blobPath(c,r*1.15,w.seed,.3);c.fillStyle='rgba(74,38,18,.78)';c.fill();blobPath(c,r*.85,w.seed+1,.3);c.fillStyle='rgba(22,12,10,.94)';c.fill();
  if(fresh>0){c.globalCompositeOperation='lighter';c.strokeStyle='rgba(255,'+(80+60*Math.sin(age*9+w.seed))+',20,'+.7*fresh+')';c.lineWidth=.5;blobPath(c,r*1.02,w.seed+2,.3);c.stroke();c.globalCompositeOperation='source-atop';}
  c.fillStyle='rgba(255,200,140,.16)';c.beginPath();c.arc(-r*.3,-r*.2,r*.2,0,TAU);c.fill();}
 else if(w.k==='scorch'){const g1=c.createRadialGradient(0,0,0,0,0,r);g1.addColorStop(0,'rgba(18,12,14,.62)');g1.addColorStop(1,'rgba(18,12,14,0)');c.fillStyle=g1;c.scale(.8,1.3);c.beginPath();c.arc(0,0,r,0,TAU);c.fill();}
 else if(w.k==='tear'){const rn=R(w.seed);c.beginPath();const n=12;for(let i=0;i<=n;i++){const a=i/n*TAU,rr=r*(.55+rn()*.75)*(i%2?1:.7);i?c.lineTo(Math.cos(a)*rr*1.1,Math.sin(a)*rr*.8):c.moveTo(Math.cos(a)*rr*1.1,Math.sin(a)*rr*.8);}c.closePath();c.fillStyle=w.under||'#c8a088';c.fill();c.strokeStyle='rgba(30,12,10,.9)';c.lineWidth=.35;c.stroke();
  c.fillStyle='rgba(120,30,30,.32)';c.fill();c.strokeStyle='rgba(120,20,20,.7)';c.lineWidth=.3;c.beginPath();c.moveTo(-r*.5,-r*.2);c.lineTo(r*.4,r*.1);c.stroke();
  c.strokeStyle=w.cloth||'rgba(40,40,40,.7)';c.lineWidth=.3;for(let i=0;i<9;i++){const a=i/9*TAU+.3,rr=r*1.05;c.beginPath();c.moveTo(Math.cos(a)*rr,Math.sin(a)*rr*.8);c.lineTo(Math.cos(a)*(rr+.8),Math.sin(a)*(rr+.8)*.8);c.stroke();}}
 else if(w.k==='puncture'){const fr=Math.max(0,1-age/1.6);blobPath(c,r*1.5,w.seed,.25);c.fillStyle='rgba(120,8,14,.88)';c.fill();blobPath(c,r*.8,w.seed+1,.2);c.fillStyle='rgba(20,0,4,.96)';c.fill();
  const bolt=(col,lw,comp)=>{c.globalCompositeOperation=comp;c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';const rn=R(w.seed+9);for(let i=0;i<7;i++){let a=rn()*TAU,x=0,y=0;c.beginPath();c.moveTo(0,0);for(let j=0;j<5;j++){a+=(rn()-.5)*1.1;x+=Math.cos(a)*r*.9;y+=Math.sin(a)*r*.9;c.lineTo(x,y);}c.stroke();}};
  bolt('rgba(60,24,16,.85)',.3,'source-atop');if(fr>0)bolt('rgba(140,210,255,'+.8*fr+')',.4,'lighter');c.globalCompositeOperation='source-atop';}}
function drawDecals(c,d,P,time){const list=WOUNDS[d.style==='s'?'s':'n'];if(!list.length)return;
 const r=rig(P);c.save();c.scale(BS,BS);c.globalCompositeOperation='source-atop';
 for(const w of list){if(w.part==='face')continue;const p=woundPos(r,w),age=time-w.t0;c.save();
  if(p.up){c.translate(r.Hp[0],r.Hp[1]);c.rotate(P.tilt||0);c.translate(-r.Hp[0],-r.Hp[1]);}
  c.translate(p.x,p.y);drawWound(c,w,age);c.restore();c.globalCompositeOperation='source-atop';}
 c.globalCompositeOperation='source-over';
 for(const w of list){if(w.k!=='tear'||w.part==='face')continue;const p=woundPos(r,w);c.save();
  if(p.up){c.translate(r.Hp[0],r.Hp[1]);c.rotate(P.tilt||0);c.translate(-r.Hp[0],-r.Hp[1]);}
  c.translate(p.x,p.y);const base=w.part[0]==='l'?d.shorts:d.shirt,burnt=(w.under==='#6a3a28'||w.under==='#2a1a14'),col=burnt?base.map(v=>v*.32):base;
  for(let i=0;i<2;i++)drawShred(c,i?2.4:-2.2,w.r*.5,w.r*(1.3+i*.7)+1.4,col,time,w.seed+i);c.restore();}
 c.restore();}
function drawShred(c,x,y,len,col,time,seed){const sw=Math.sin(time*3+seed)*.9;
 const pts=[[x-.9,y],[x+.9,y],[x+.8+sw*.4,y+len*.45],[x+1.1+sw*.8,y+len*.7],[x+sw*1.2,y+len],[x-.7+sw*.7,y+len*.62],[x-1.1+sw*.4,y+len*.4]];
 poly(c,pts,css(col,.92),outC(col),.4);}
function scraps(c,x,y,age,seed,n,cols,dir){if(age<0||age>1.4)return;for(let i=0;i<n;i++){const r=R(seed*7+i),an=-Math.PI/2+(r()-.5)*2.6+dir*.5,sp=25+r()*60,px=x+Math.cos(an)*sp*age+Math.sin(age*5+i)*1.5,py=y+Math.sin(an)*sp*age+60*age*age,rot=age*(4+r()*6)+i,sz=1+r()*1.4,col=cols[i%cols.length];
  c.save();c.translate(px,py);c.rotate(rot);c.globalAlpha=1-age/1.4;c.fillStyle='rgb('+col[0]+','+col[1]+','+col[2]+')';c.strokeStyle='rgba(10,6,20,.7)';c.lineWidth=.25;c.beginPath();c.moveTo(-sz,-sz*.5);c.lineTo(sz*.9,-sz*.7);c.lineTo(sz,sz*.5);c.lineTo(-sz*.6,sz*.8);c.closePath();c.fill();c.stroke();c.restore();}c.globalAlpha=1;}
function drawFaceWound(c,w,age){c.save();c.lineCap='round';
 const dr=(x,y)=>{const dl=Math.min(1,age/1.8);return[x,y+3*dl];};
 if(w.k==='eyeBruise'){for(const [x,y,r] of [[.4,.9,3.6],[6.1,.7,2.5]]){const g1=c.createRadialGradient(x,y,0,x,y,r);g1.addColorStop(0,'rgba(70,24,100,.66)');g1.addColorStop(.65,'rgba(120,50,120,.4)');g1.addColorStop(1,'rgba(150,140,60,0)');c.fillStyle=g1;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}}
 else if(w.k==='lip'){c.strokeStyle='rgba(150,10,18,.95)';c.lineWidth=.9;c.beginPath();c.moveTo(1.8,6.1);c.quadraticCurveTo(3.4,6.5,5.4,5.9);c.stroke();const dl=Math.min(1,age/1.6);c.strokeStyle='rgba(130,6,14,.92)';c.lineWidth=.7;c.beginPath();c.moveTo(4.6,6.5);c.lineTo(4.4,6.5+3*dl);c.stroke();c.fillStyle='rgba(140,8,16,.95)';c.beginPath();c.arc(4.4,6.6+3*dl,.5,0,TAU);c.fill();}
 else if(w.k==='nose'){c.strokeStyle='rgba(150,10,18,.95)';c.lineWidth=.6;const dl=Math.min(1,age/1.4);for(const x of [3.8,4.7]){c.beginPath();c.moveTo(x,3.8);c.quadraticCurveTo(x+.3,5,x,3.8+3.2*dl);c.stroke();}}
 else if(w.k==='cheekCut'){c.strokeStyle='rgba(100,0,8,.95)';c.lineWidth=.55;c.beginPath();c.moveTo(-3.4,2.4);c.quadraticCurveTo(-1.8,3.2,-.6,5);c.stroke();c.strokeStyle='rgba(200,30,40,.9)';c.lineWidth=.22;c.stroke();const dl=Math.min(1,age/2);c.strokeStyle='rgba(130,6,14,.88)';c.lineWidth=.45;c.beginPath();c.moveTo(-.6,5);c.lineTo(-.7,5+2.6*dl);c.stroke();}
 else if(w.k==='brow'){c.strokeStyle='rgba(100,0,8,.95)';c.lineWidth=.6;c.beginPath();c.moveTo(.8,-3.8);c.lineTo(3.4,-4.1);c.stroke();const dl=Math.min(1,age/1.8);c.strokeStyle='rgba(150,10,18,.92)';c.lineWidth=.8;c.beginPath();c.moveTo(2.4,-3.9);c.quadraticCurveTo(3.2,-1,2.9,-1+3.5*dl);c.stroke();}
 else if(w.k==='faceBurn'){for(const [x,y,r,sd] of [[-2.6,3.2,3.2,3],[5.2,-1.6,2.2,5]]){c.save();c.translate(x,y);blobPath(c,r*1.15,w.seed+sd,.3);c.fillStyle='rgba(74,38,18,.78)';c.fill();blobPath(c,r*.85,w.seed+sd+1,.3);c.fillStyle='rgba(24,12,10,.94)';c.fill();const fresh=Math.max(0,1-age/8);if(fresh>0){c.globalCompositeOperation='lighter';c.strokeStyle='rgba(255,110,20,'+.7*fresh+')';c.lineWidth=.45;blobPath(c,r*1.02,w.seed+sd+2,.3);c.stroke();}c.restore();}}
 else if(w.k==='faceSoot'){for(const [x,y,r] of [[1,3.5,8],[0,-5,5]]){const g1=c.createRadialGradient(x,y,0,x,y,r);g1.addColorStop(0,'rgba(20,14,16,.38)');g1.addColorStop(1,'rgba(20,14,16,0)');c.fillStyle=g1;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}}
 else if(w.k==='eyeBlood'){c.strokeStyle='rgba(120,6,12,.95)';c.lineWidth=.8;c.beginPath();c.moveTo(1.0,1.8);c.quadraticCurveTo(.4,4.6,1.2,7.8);c.stroke();c.strokeStyle='rgba(60,0,6,.7)';c.lineWidth=.3;c.stroke();}
 else if(w.k==='scratch'){c.strokeStyle='rgba(140,20,26,.8)';c.lineWidth=.3;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-3+i*.8,1.2+i*.3);c.lineTo(-.4+i*.8,3.6+i*.4);c.stroke();}}
 c.restore();}
function applyDamage(kind){const N=WOUNDS.n,t0=performance.now()/1000;
 const add=w=>{w.t0=t0;N.push(w);if(N.length>70)N.shift();},rs=()=>Math.floor(Math.random()*9999);
 const F=k=>add({k,part:'face',seed:rs(),r:1});
 const B=(part,u,v,r,drip)=>add({k:'blood',part,u,v,r,seed:rs(),drip:drip||0});
 const BU=(part,u,v,r)=>add({k:'burn',part,u,v,r,seed:rs()});
 const SC=(part,u,v,r)=>add({k:'scorch',part,u,v,r,seed:rs()});
 const TE=(part,u,v,r,under,cloth)=>add({k:'tear',part,u,v,r,seed:rs(),under,cloth});
 const CU=(part,u,v,r,rot)=>add({k:'cut',part,u,v,r,rot,seed:rs()});
 if(kind==='chidori'){TE('torso',.42,.5,2.8,'#c89a80','#a85808');add({k:'puncture',part:'torso',u:.42,v:.5,r:1.2,seed:rs()});B('torso',.5,.46,2.6,1);BU('torso',.64,.2,1.5);CU('armF',.5,0,2.4,.4);B('armF',.52,0,1.3,1);F('eyeBruise');F('nose');F('lip');}
 else if(kind==='katon'){BU('torso',.3,.4,2.6);BU('torso',.55,-.2,2.2);BU('torso',.75,.3,2);BU('armF',.45,0,1.8);BU('armB',.5,0,1.6);BU('legF',.4,0,1.6);SC('torso',.5,.1,6);SC('legF',.6,0,4);SC('legB',.5,0,4);TE('torso',.62,.35,2.4,'#6a3a28','#4a2a10');TE('armF',.6,0,1.9,'#6a3a28','#4a2a10');TE('legB',.4,0,1.9,'#6a3a28','#4a2a10');F('faceBurn');F('faceSoot');}
 else if(kind==='cop_rasengan'){B('torso',.5,.45,2.4,1);F('nose');F('lip');BU('torso',.5,.45,1.6);}
 else if(kind==='cop_bunshin'){F('eyeBruise');F('lip');B('torso',.4,.3,1.6,1);CU('armF',.5,0,1.4,.3);}
 else if(kind==='shishi'){F('eyeBruise');F('nose');F('lip');B('torso',.5,.4,2,1);add({k:'bruise',part:'torso',u:.45,v:.3,r:3,seed:rs()});}
 else if(kind==='selochidori'){TE('torso',.42,.5,2.8,'#c89a80','#a85808');add({k:'puncture',part:'torso',u:.42,v:.5,r:1.2,seed:rs()});B('torso',.5,.46,2.6,1);BU('torso',.64,.2,1.8);BU('torso',.3,.4,1.6);F('eyeBruise');F('nose');F('lip');}
 else if(kind==='soushuken'){CU('torso',.3,.2,1.6,.3);CU('torso',.6,.1,1.6,.6);CU('armF',.5,0,1.5,.4);CU('legF',.4,0,1.5,.2);CU('legB',.5,0,1.3,.5);B('torso',.32,.22,1.4,1);B('legF',.42,0,1,1);}
 else if(kind==='kagesh'){CU('torso',.45,.25,2,.2);B('torso',.47,.27,1.8,1);B('torso',.5,.4,1.2,1);}
 else if(kind==='kunai'){CU('torso',.5,.3,1.8,.5);B('torso',.52,.32,1.6,1);}
 else if(kind==='shuriken'){CU('torso',.4,.2,1.6,.3);CU('armF',.5,0,1.6,.4);CU('legF',.4,0,1.4,.2);B('torso',.42,.22,1.4,1);B('armF',.52,0,1,1);}
 else if(kind==='soco'){F('eyeBruise');F('nose');F('lip');F('brow');}
 else if(kind==='chute'){B('torso',.5,.4,2,1);add({k:'bruise',part:'torso',u:.5,v:.4,r:3,seed:rs()});}
 else if(kind==='amaterasu'){BU('torso',.25,.3,3.2);BU('torso',.5,-.3,3.4);BU('torso',.7,.2,3);BU('armF',.4,0,2.5);BU('armB',.5,0,2.3);BU('legF',.4,0,2.4);BU('legB',.5,0,2.2);SC('torso',.5,0,8);SC('armF',.5,0,5);SC('legF',.5,0,5);TE('torso',.4,.4,3.4,'#2a1a14','#2a1408');TE('armF',.55,0,2.4,'#2a1a14','#2a1408');TE('legB',.45,0,2.4,'#2a1a14','#2a1408');F('faceBurn');F('faceBurn');F('faceSoot');}}
function bloodSpray(c,x,y,age,seed,n,dir){if(age<0||age>1.15)return;n=Math.round(n*1.5); /* sangue em pixels quadrados, tres tons; cai, bate no chao e fica */
 const fade=age<.9?1:1-(age-.9)/.25;c.save();c.globalAlpha=Math.max(0,fade);
 for(let i=0;i<n;i++){const r=R(seed*13+i),an=-Math.PI/2+(r()-.5)*2.6+dir*.6,sp=45+r()*125,sz=r()<.2?2:1,tone=r(),life=Math.min(age,.85);
  let px=x+Math.cos(an)*sp*life,py=y+Math.sin(an)*sp*life+170*life*life,ground=false;if(py>GY+2){py=GY+1+(i%3);ground=true;}
  c.fillStyle=tone<.3?'#5a0610':tone<.75?'#9a0f1c':'#d4202e';c.fillRect(Math.floor(px),Math.floor(py),ground?sz+1:sz,sz);}
 c.restore();}
/* contorno irregular (pontas alternando para dentro e para fora) para o buraco rasgado */
function holePts(r,seed,sx,sy,rot){const rn=R(seed),n=18,c=Math.cos(rot),s=Math.sin(rot),pts=[];for(let i=0;i<n;i++){const a=i/n*TAU,k=(.6+rn()*.75)*(i%2?.8:1.12),x=Math.cos(a)*r*k*sx,y=Math.sin(a)*r*k*sy;pts.push([x*c-y*s,x*s+y*c]);}return pts;}
function holePath(c,hx,hy,pts){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(hx+p[0],hy+p[1]):c.moveTo(hx+p[0],hy+p[1]));c.closePath();}
/* centro do peito rasgado (mesmo ponto do remendo de pele desenhado em drawFig), ja em unidades do mundo e girado com o tronco */
function chestPos(P){const r=rig(P),S=r.S,Hp=r.Hp,mid=(S[1]+Hp[1])*.5,cx=S[0]+.6,cy=((S[1]+.8)+(mid+5.2))/2,t=P.tilt||0,cs=Math.cos(t),sn=Math.sin(t),x=cx-Hp[0],y=cy-Hp[1];
 return[(Hp[0]+x*cs-y*sn)*BS,(Hp[1]+x*sn+y*cs)*BS];}
/* contorno externo: dilata a silhueta do sprite e pinta por tras, deixando a borda de fora mais grossa que as linhas internas */
function silhouette(col){const ow=.5*SR;sc.setTransform(1,0,0,1,0,0);
 rimx.setTransform(1,0,0,1,0,0);rimx.globalCompositeOperation='source-over';rimx.clearRect(0,0,spW,spH);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;rimx.drawImage(sp,0,0,spW,spH,Math.cos(a)*ow,Math.sin(a)*ow,spW,spH);}
 rimx.globalCompositeOperation='source-in';rimx.fillStyle=col||'rgb(10,6,26)';rimx.fillRect(0,0,spW,spH);rimx.globalCompositeOperation='source-over';
 sc.globalCompositeOperation='destination-over';sc.drawImage(rimc,0,0,spW,spH,0,0,spW,spH);sc.globalCompositeOperation='source-over';}
