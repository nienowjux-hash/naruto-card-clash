/* ---------- marcas do Selo Amaldicoado e aura sombria ---------- */
/* marcas do Selo Amaldicoado (Nivel 1): padroes tribais pretos em forma de chamas, no rosto, pescoco, antebracos, maos e pernas */
function tribal(sc,A,B,k,seed,wd,spacing){
 const dx=B[0]-A[0],dy=B[1]-A[1],len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,nx=-uy,ny=ux,rn=R(seed),n=Math.max(2,Math.floor(len/(spacing||1.05)));
 const P=(x,y)=>[(OXU+x)*SR,(OYU+y)*SR];
 for(let i=0;i<n;i++){const u=(i+.5)/n;if(u>k)break;const side=i%2?1:-1,cx=A[0]+dx*u+nx*side*(.3+rn()*.5),cy=A[1]+dy*u+ny*side*(.3+rn()*.5),L=(1.5+rn()*1.7),w=wd*.5*(.7+rn()*.7),ca=Math.atan2(dy,dx)+side*(.7+rn()*.8);
  const ex=cx+Math.cos(ca)*L,ey=cy+Math.sin(ca)*L,mx=cx+Math.cos(ca-side*.9)*L*.62,my=cy+Math.sin(ca-side*.9)*L*.62;
  sc.beginPath();const p0=P(cx,cy),pm=P(mx,my),pe=P(ex,ey);sc.moveTo(p0[0],p0[1]);sc.quadraticCurveTo(pm[0],pm[1],pe[0],pe[1]);sc.lineWidth=w*SR;sc.stroke();
  if(rn()<.55){const q=P(cx+Math.cos(ca+side*.5)*L*.5,cy+Math.sin(ca+side*.5)*L*.5);sc.beginPath();sc.moveTo(p0[0],p0[1]);sc.quadraticCurveTo(q[0],q[1],q[0]+side*SR,q[1]-SR*.6);sc.lineWidth=w*.6*SR;sc.stroke();}}
 const a=P(A[0],A[1]);sc.beginPath();sc.moveTo(a[0],a[1]);const b=P(A[0]+dx*Math.min(1,k),A[1]+dy*Math.min(1,k));sc.lineTo(b[0],b[1]);sc.lineWidth=wd*.38*SR;sc.stroke();}
function lvDef(p){const d=Object.assign({},SASUKE);d.skin=mix(SASUKE.skin,[156,154,190],p);d.fore=d.skin;d.shin=d.skin;d.hair=mix(SASUKE.hair,[72,90,132],p);d.hairHi=mix(SASUKE.hairHi,[172,192,228],p);d.longHair=p*.5;d.lv2=p;d.eyeH=SASUKE.eyeH*(1-.12*p);return d;}
function giantHand(c,w,h,flex,seed,mir){
 c.save();if(mir)c.scale(-1,1);c.lineJoin='round';c.lineCap='round';const ol='#3a2e44';
 const pg=c.createLinearGradient(-w*.5,-h*.5,w*.5,h*.4);pg.addColorStop(0,'#c6b9c4');pg.addColorStop(.5,'#9d8f9f');pg.addColorStop(1,'#5f5169');
 const ph=h*.5;// altura da palma
 // dedo grosso, quase paralelo, com pontinha de garra
 const finger=(bx,by,ang,len,wd,bend,claw)=>{const n=8,L=[],R=[];let x=bx,y=by,a=ang;
  for(let i=0;i<=n;i++){const t=i/n,hw=wd*(1-.35*t*t-(i>=n-2?(i-(n-3))*.3:0))/2;const nx=Math.cos(a),ny=Math.sin(a);L.push([x-nx*hw,y-ny*hw]);R.push([x+nx*hw,y+ny*hw]);
   x+=Math.sin(a)*len/n;y-=Math.cos(a)*len/n;a+=bend*(.3+t)/n;}
  c.beginPath();c.moveTo(L[0][0],L[0][1]);for(const p of L)c.lineTo(p[0],p[1]);for(let i=R.length-1;i>=0;i--)c.lineTo(R[i][0],R[i][1]);c.closePath();
  c.fillStyle=pg;c.fill();c.strokeStyle=ol;c.lineWidth=1.2;c.stroke();
  c.strokeStyle='rgba(60,44,70,.3)';c.lineWidth=wd*.22;c.beginPath();for(let i=0;i<=n-1;i++){const p=R[i],q=[(p[0]*3+L[i][0])/4,(p[1]*3+L[i][1])/4];i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);}c.stroke();
  c.strokeStyle='rgba(60,44,70,.5)';c.lineWidth=.8;for(const i of [3,6]){c.beginPath();c.moveTo(L[i][0]*.85+R[i][0]*.15,L[i][1]*.85+R[i][1]*.15);c.lineTo(L[i][0]*.15+R[i][0]*.85,L[i][1]*.15+R[i][1]*.85);c.stroke();}
  if(claw){{const m=n-3;c.beginPath();c.moveTo(L[m][0],L[m][1]);for(let i=m;i<=n;i++)c.lineTo(L[i][0],L[i][1]);for(let i=n;i>=m;i--)c.lineTo(R[i][0],R[i][1]);c.closePath();const cg=c.createLinearGradient(L[m][0],L[m][1],L[n][0],L[n][1]);cg.addColorStop(0,'#5a4a68');cg.addColorStop(1,'#1c1426');c.fillStyle=cg;c.fill();c.strokeStyle='#150f1c';c.lineWidth=.8;c.stroke();c.strokeStyle='rgba(200,170,255,.45)';c.lineWidth=.6;c.beginPath();c.moveTo(L[m][0]*.7+R[m][0]*.3,L[m][1]*.7+R[m][1]*.3);c.lineTo(L[n][0],L[n][1]);c.stroke();}}};
 // polegar atras da palma, aberto para o lado
 finger(-w*.34,ph*.55,-.95-.15*flex,h*.4,w*.27,.5*flex,true);
 // quatro dedos juntos, longos como a palma
 const bx=[-.375,-.125,.125,.375],len=[.92,1.08,1.0,.8],ang=[-.1,-.03,.04,.12];
 for(let i=0;i<4;i++)finger(bx[i]*w,-ph*.12,ang[i]*(1+flex),ph*len[i]*1.05,w*.235,(i<2?-1:1)*.55*flex,true);
 // palma larga e quadrada
 c.beginPath();c.moveTo(-w*.5,-ph*.12);c.lineTo(w*.5,-ph*.12);c.quadraticCurveTo(w*.56,ph*.4,w*.4,ph*.95);c.lineTo(-w*.4,ph*.95);c.quadraticCurveTo(-w*.56,ph*.4,-w*.5,-ph*.12);c.closePath();
 c.fillStyle=pg;c.fill();c.strokeStyle=ol;c.lineWidth=1.5;c.stroke();
 c.strokeStyle='rgba(60,44,70,.45)';c.lineWidth=1;
 c.beginPath();c.moveTo(-w*.36,ph*.15);c.quadraticCurveTo(-w*.05,ph*.5,w*.2,ph*.85);c.stroke();
 c.beginPath();c.moveTo(-w*.4,ph*.5);c.quadraticCurveTo(-w*.1,ph*.6,w*.05,ph*.9);c.stroke();
 c.beginPath();c.moveTo(w*.35,ph*.1);c.quadraticCurveTo(w*.15,ph*.4,w*.2,ph*.7);c.stroke();
 c.fillStyle='rgba(245,238,244,.25)';c.beginPath();c.ellipse(-w*.15,ph*.3,w*.22,ph*.22,-.3,0,TAU);c.fill();
 for(let i=0;i<4;i++){const kx=bx[i]*w;c.fillStyle='rgba(235,225,235,.3)';c.beginPath();c.arc(kx-w*.03,-ph*.02,w*.085,0,TAU);c.fill();c.strokeStyle='rgba(40,28,52,.55)';c.lineWidth=.9;c.beginPath();c.arc(kx,ph*.02,w*.11,.3,Math.PI-.3);c.stroke();}
 c.strokeStyle='rgba(95,60,150,.55)';c.lineWidth=.8;for(const v of [[-.2,.4,-.3,.9],[.1,.35,.2,.9]]){c.beginPath();c.moveTo(v[0]*w,ph*v[1]);c.quadraticCurveTo((v[0]+v[2])*.5*w+3,ph*.65,v[2]*w,ph*v[3]);c.stroke();}
 c.restore();}
function drawWings(sc,P,k,time){if(k<=0)return;const rg=rigW(P),S=rg.S,t0=P.tilt||0;sc.save();sc.setTransform(SR,0,0,SR,OXU*SR,OYU*SR);
 const g=k*(1+.1*Math.sin(Math.min(1,k)*Math.PI));sc.globalAlpha=Math.min(1,k*1.6);
 // esquerda: mao aberta erguida atras; direita: mais inclinada e fechando os dedos
 const hands=[{dx:-26,dy:-30,rot:-.25,w:25,h:42,seed:1,flex:.3,mir:false},{dx:20,dy:-26,rot:.75,w:26,h:43,seed:2,flex:.8,mir:true}];
 for(const hd of hands){
  const rot=hd.rot+t0+Math.sin(time*1.3+hd.seed)*.03,cx=S[0]+hd.dx*g,cy=S[1]+hd.dy*g,wx=cx-Math.sin(rot)*hd.h*.32*g,wy=cy+Math.cos(rot)*hd.h*.32*g,bx=S[0]-2,by=S[1]+6;
  const mx=(bx+wx)/2-(wy-by)*.12*(hd.mir?-1:1),my=(by+wy)/2+(wx-bx)*.12*(hd.mir?-1:1);
  sc.save();sc.lineCap='round';sc.shadowColor='rgba(110,50,200,.5)';sc.shadowBlur=5*SR;
  sc.strokeStyle='#3a2e44';sc.lineWidth=hd.w*.72*g+1.8;sc.beginPath();sc.moveTo(bx,by);sc.quadraticCurveTo(mx,my,wx,wy);sc.stroke();
  const ag=sc.createLinearGradient(bx,by,wx,wy);ag.addColorStop(0,'#8c7e8c');ag.addColorStop(1,'#b8abb4');sc.strokeStyle=ag;sc.lineWidth=hd.w*.72*g;sc.stroke();
  sc.shadowBlur=0;sc.strokeStyle='rgba(245,238,244,.22)';sc.lineWidth=hd.w*.2*g;sc.beginPath();sc.moveTo(bx-2,by-1);sc.quadraticCurveTo(mx-2,my-1,wx-2,wy-1);sc.stroke();
  sc.restore();
  sc.save();sc.translate(cx,cy);sc.rotate(rot);sc.scale(g*(1+.02*Math.sin(time*1.9+hd.seed)),g);sc.shadowColor='rgba(110,50,200,.4)';sc.shadowBlur=4*SR;
  sc.translate(0,hd.h*.12);giantHand(sc,hd.w,hd.h,hd.flex+.1*Math.sin(time*1.7+hd.seed),hd.seed,hd.mir);sc.restore();}
 sc.restore();}
function curseMarks2(sc,P,k,time){if(k<=0)return;const rg=rigW(P),E=o=>[o.ex,o.ey],H=o=>[o.hx,o.hy],nk=[rg.S[0]+.7,rg.S[1]-3.4],C=rg.C,Hp=rg.Hp;
 sc.save();sc.setTransform(1,0,0,1,0,0);sc.globalCompositeOperation='source-atop';sc.lineCap='round';sc.lineJoin='round';sc.strokeStyle='rgba(8,4,16,.98)';
 const paths=[[[C[0]-4.6,C[1]-5.4],[C[0]-1.4,C[1]+3.6],2.2,0,11],[[C[0]+3.6,C[1]-5.6],[C[0]+5.4,C[1]+1.2],1.8,.05,12],[[C[0]-2,C[1]+4],[C[0]+4.2,C[1]+5.4],1.7,.1,13],[[C[0]+.5,C[1]-6],[C[0]+1.2,C[1]-.8],1.4,.12,14],
  [nk,[nk[0]-1,nk[1]+8],2.4,0,15],[[rg.S[0]+.6,rg.S[1]+1],[Hp[0]+.5,Hp[1]],2.4,.12,16],[[rg.S[0]-4,rg.S[1]+2],[Hp[0]-4,Hp[1]-3],1.9,.2,17],[[rg.S[0]+5,rg.S[1]+2],[Hp[0]+4.6,Hp[1]-3],1.9,.22,18],[[rg.S[0]-5,rg.S[1]+.6],[rg.S[0]+6,rg.S[1]+.8],1.6,.18,19],
  [rg.shF,E(rg.hf),2.1,.15,20],[E(rg.hf),H(rg.hf),1.9,.3,21],[rg.shB,E(rg.hb),1.9,.2,22],[E(rg.hb),H(rg.hb),1.7,.34,23],
  [rg.hip,E(rg.lf),2.3,.28,24],[E(rg.lf),H(rg.lf),2.0,.4,25],[rg.hip,E(rg.lb),2.1,.3,26],[E(rg.lb),H(rg.lb),1.8,.42,27]];
 for(const p of paths){const kk=clamp((k-p[3])/.5,0,1);if(kk<=0)continue;tribal(sc,p[0],p[1],kk,p[4],p[2],1.5);}
 sc.restore();}
function curseAura2(f,x,k,time,fr){if(k<=0)return;
 f.globalCompositeOperation='lighter';orb(f,x,GY-34,56*k,[[0,'rgba(90,30,170,'+.38*k+')'],[1,'rgba(30,6,70,0)']]);f.globalCompositeOperation='source-over';
 for(let i=0;i<11;i++){const u=(i-5)/5,px=x+u*16+Math.sin(fr*.3+i*1.9)*1.6,hh=(20+10*Math.sin(fr*.4+i*2.3)+(1-Math.abs(u))*22)*k;
  lick(f,px,GY+1,hh,hh*.3,fr*.33+i,'#3a1a64');lick(f,px,GY+1,hh*.88,hh*.25,fr*.33+i+.4,'#14082a');lick(f,px,GY+1,hh*.64,hh*.17,fr*.33+i+.9,'#030106');}
 for(let i=0;i<16;i++){const ph=((time*.6+i*.17)%1);f.fillStyle='rgba(8,4,16,'+(1-ph)*.8*k+')';f.fillRect(x+Math.sin(i*5.1)*14,GY-ph*70,1.2,1.2);}
 f.globalCompositeOperation='lighter';for(let i=0;i<10;i++){const ph=((time*.8+i*.23)%1);f.fillStyle='rgba(170,100,255,'+(1-ph)*.7*k+')';f.fillRect(x+Math.sin(i*3.7)*12,GY-ph*60,.8,.8);}f.globalCompositeOperation='source-over';}
function darkBolts(c,L,s){const op=c.globalCompositeOperation;c.globalCompositeOperation='source-over';drawBolts(c,L,s,[[4.2,'rgba(6,0,14,.82)']]);c.globalCompositeOperation='lighter';drawBolts(c,L,s,[[1.9,'rgba(140,60,250,.9)'],[.6,'rgba(240,215,255,1)']]);c.globalCompositeOperation=op;}
function curseMarks(sc,P,k,time){
 if(k<=0)return;const rg=rigW(P),E=o=>[o.ex,o.ey],H=o=>[o.hx,o.hy],nk=[rg.S[0]+.7,rg.S[1]-3.4],C=rg.C;
 const mid=(a,b,u)=>[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u];
 sc.save();sc.setTransform(1,0,0,1,0,0);sc.globalCompositeOperation='source-atop';sc.lineCap='round';sc.lineJoin='round';sc.strokeStyle='rgba(6,3,10,.97)';
 const paths=[ /* [de,ate,largura,inicio,seed] */
  [nk,[C[0]+3.4,C[1]+5.2],1.9,0,1],[[C[0]+3.4,C[1]+5.2],[C[0]+4.4,C[1]+1.6],1.5,.1,2],[[C[0]+1.4,C[1]+3.6],[C[0]+5.0,C[1]+4.2],1.2,.18,3],[nk,[nk[0]-1.6,nk[1]+1.8],1.1,0,4],
  [mid(rg.shF,E(rg.hf),.7),E(rg.hf),1.6,.12,5],[E(rg.hf),H(rg.hf),1.45,.28,6],
  [mid(rg.hip,E(rg.lf),.72),E(rg.lf),1.7,.26,9],[E(rg.lf),mid(E(rg.lf),H(rg.lf),.5),1.5,.36,10]];
 for(const p of paths){const kk=clamp((k-p[3])/.55,0,1);if(kk<=0)continue;tribal(sc,p[0],p[1],kk,p[4],p[2],1.7);}
 sc.restore();}
function curseAura(f,x,k,time,fr){
 if(k<=0)return;f.globalCompositeOperation='lighter';orb(f,x,GY-30,44*k,[[0,`rgba(30,30,48,${.4*k})`],[1,'rgba(10,10,20,0)']]);f.globalCompositeOperation='source-over';
 for(let i=0;i<9;i++){const u=(i-4)/4,px=x+u*13+Math.sin(fr*.3+i*1.9)*1.4,hh=(14+8*Math.sin(fr*.4+i*2.3)+(1-Math.abs(u))*16)*k;
  lick(f,px,GY+1,hh,hh*.3,fr*.33+i,'#262634');lick(f,px,GY+1,hh*.85,hh*.24,fr*.33+i+.4,'#0e0e16');lick(f,px,GY+1,hh*.62,hh*.16,fr*.33+i+.9,'#000');}
 f.globalCompositeOperation='lighter';for(let i=0;i<10;i++){const ph=((time*.7+i*.19)%1);f.fillStyle=`rgba(150,150,175,${(1-ph)*.5*k})`;f.fillRect(x+Math.sin(i*5.1)*12,GY-ph*50,.7,.7);}f.globalCompositeOperation='source-over';}
const DK=[[3.6,'rgba(30,0,60,.55)'],[1.6,'rgba(175,95,255,.9)'],[.55,'rgba(255,225,255,1)']];
function darkChidoriFX(f,x,y,p,fr,time){
 if(p<=0)return;const r2=R(fr*7+3),rr=11*Math.min(1.3,p);
 orb(f,x,y,rr*2.4,[[0,'rgba(4,0,10,.82)'],[.6,'rgba(20,4,40,.5)'],[1,'rgba(20,4,40,0)']]);
 f.globalCompositeOperation='lighter';orb(f,x,y,rr*3,[[0,'rgba(150,60,255,.38)'],[1,'rgba(60,10,140,0)']]);f.globalCompositeOperation='source-over';
 let L=[];for(let i=0;i<11;i++)L.push(...boltLines(x,y,r2()*TAU,8+r2()*18*p,fr*13+i,true));darkBolts(f,L,.95);
 f.fillStyle='#050109';f.beginPath();f.arc(x,y,rr*.58,0,TAU);f.fill();f.strokeStyle='rgba(190,120,255,.9)';f.lineWidth=.55;f.stroke();
 f.globalCompositeOperation='lighter';orb(f,x,y,rr*.34,[[0,'rgba(245,225,255,.95)'],[1,'rgba(160,80,255,0)']]);f.globalCompositeOperation='source-over';}
/* ---- Shishi Rendan ---- */
const SH_W=mk({tilt:-.2,crouch:8,lean:-4,fbx:-12,ffx:7,hxF:6,hyF:2,hxB:8,hyB:4,expr:2,tw:.85,hr:.05,wind:.3});
const SH_UP=mk({tilt:-.1,crouch:2,lean:-2,fbx:-7,fby:-5,ffx:18,ffy:-17,hxF:-4,hyF:4,hxB:10,hyB:-3,hr:.1,expr:2,tw:.9,wind:.8});
const SH_A=mk({tilt:.18,crouch:0,lean:2,fbx:-5,fby:-6,ffx:5,ffy:-7,hxF:17,hyF:-3,hxB:-8,hyB:4,hr:.06,expr:2,tw:.85,wind:1});
const SH_B=mk({tilt:-.12,crouch:0,lean:-1,fbx:-4,fby:-4,ffx:17,ffy:-14,hxF:-3,hyF:5,hxB:9,hyB:-2,hr:.1,expr:2,tw:.88,wind:1});
const SH_TOP=mk({tilt:.1,crouch:-2,lean:0,fbx:-4,fby:-8,ffx:8,ffy:-9,hxF:10,hyF:-12,hxB:8,hyB:-10,hr:.08,expr:2,tw:.9,wind:1});
const SH_HEEL=mk({tilt:-.5,crouch:-1,lean:-3,fbx:-5,fby:-7,ffx:14,ffy:-19,hxF:-6,hyF:-5,hxB:5,hyB:-8,hr:.18,expr:2,tw:.9,wind:1});
const N_AIR=mk({tilt:-.3,lean:-3,crouch:1,fbx:-5,fby:-3,ffx:4,ffy:-4,hxF:-6,hyF:-4,hxB:-7,hyB:-5,hdx:-2,hdy:-1,hr:-.3,expr:3,tw:1,wind:1});
const N_AIR2=mk({tilt:.25,lean:2,crouch:2,fbx:-4,fby:-4,ffx:5,ffy:-3,hxF:-5,hyF:-1,hxB:-4,hyB:-6,hdx:2,hdy:1,hr:.25,expr:3,tw:1,wind:1});
const SHT=[1.2,1.35,1.5,1.65,1.8];
function afterimgs(c,Pk,xk,yFn,t0,t1,tintA){const {t,time}=c;for(let i=3;i>=1;i--){const tt=t-i*.04;if(tt<t0||tt>t1)continue;blit(interp(xk,tt),GY+yFn(tt),false,SASUKE,evalPose(Pk,tt),time,{tint:tintA||[255,255,255],tk:.5,alpha:.28-i*.07,noRefl:true});}}
function shishiFX(c,fatal){
 const {f,A,t,time,nx0,ny0,sx0,sy0}=c,L=fatal?A?A.L:ANIMS.shishi.L:ANIMS.shishi,tt=A?t:99;
 if(A){dashLines(f,c,.5,.85,3);afterimgs(c,L.sP,L.sX,s=>sasYShishi(s),.52,.9);}
 const hitAt=SHT;
 for(let i=0;i<hitAt.length;i++){const a=tt-hitAt[i];if(a>=0&&a<.5&&A){impactFX(f,nx0-6,GY+ny0-36-(i%2)*10,a,40+i,false);bloodSpray(f,nx0-6,GY+ny0-36,a,60+i,8,-1);}}
 const a0=tt-.85;if(a0>=0&&a0<.5&&A)impactFX(f,nx0-6,GY-26,a0,35,false);
}
function sasYShishi(tt){return interp([[0,0],[.82,0],[1.0,-46],[1.25,-60],[1.9,-64],[2.0,-76],[2.1,-40],[2.3,0],[99,0]],tt);}
function shishiSlamFX(c,landT){
 const {f,A,t,time,nx0}=c,tt=A?t:99,a=tt-landT;if(a<0)return;
 if(A&&a<1.6){waterColumn(f,nx0-2,a,16,44);bloodSpray(f,nx0-3,GY-2,a,70,34,0);
  f.strokeStyle=`rgba(210,232,255,${Math.max(0,1-a/1.3)})`;f.lineWidth=.9;for(let k=0;k<3;k++){const r=(a*55+k*14);f.beginPath();f.ellipse(nx0,GY+1,r,r*.24,0,0,TAU);f.stroke();}
  f.globalCompositeOperation='lighter';if(a<.4)orb(f,nx0,GY-3,38*(1-a/.5),[[0,'rgba(255,255,255,.8)'],[1,'rgba(255,220,180,0)']]);f.globalCompositeOperation='source-over';}
 const pr=Math.min(20,a*7);f.fillStyle='rgba(8,4,16,.6)';f.beginPath();f.ellipse(nx0,GY+1.5,pr*.8,pr*.2,0,0,TAU);f.fill();f.fillStyle='rgba(112,6,14,.6)';f.beginPath();f.ellipse(nx0+2,GY+2,pr,pr*.24,0,0,TAU);f.fill();}
ANIMS.shishi={dur:4.2,hold:1.0,hitT:.85,dmg:36,cost:25,noLift:true,
 nYf:t=>interp([[0,0],[.85,0],[1.2,-62],[1.9,-66],[2.05,-62],[2.2,0],[99,0]],t),
 sYf:sasYShishi,
 sP:[[0,READY],[.4,READY],[.5,SH_W],[.7,PN_D],[.82,SH_UP],[1.0,SH_A],[1.2,SH_A],[1.27,SH_B],[1.42,SH_A],[1.57,SH_B],[1.72,SH_A],[1.85,SH_TOP],[2.0,SH_HEEL],[2.3,READY],[3.0,READY],[4.2,READY]],
 tp:[2.4],sX:[[0,96],[.45,96],[.8,250],[1.0,258],[2.0,262],[2.39,260],[2.41,96],[4.2,96]],sSpin:[1.82,2.02,1],
 /* Naruto lancado: o corpo deita para tras no ar e da um tranco a cada golpe da sombra */
 nRotf:t=>{const k=scaleAt(0,1,.85,1.15,t)*(1-scaleAt(0,1,2.0,2.2,t));let w=0;for(const h of SHT)if(t>h&&t<h+.12)w+=.3*(1-(t-h)/.12);return (-1.2+w)*k;},
 nP:[[0,N_READY],[.8,N_READY],[.85,N_HITB],[1.1,N_AIR],[1.4,N_AIR2],[1.7,N_AIR],[1.95,N_AIR2],[2.2,N_STAG],[3.0,N_READY],[4.2,N_READY]],
 nX:[[0,288],[.85,288],[1.2,304],[2.0,300],[2.3,296],[3.0,288],[4.2,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.4,cx:180,cy:126}],[.9,{z:1.6,cx:268,cy:118}],[1.3,{z:1.5,cx:274,cy:96}],[1.9,{z:1.5,cx:278,cy:94}],[2.1,{z:1.6,cx:280,cy:122}],[2.5,{z:1.3,cx:262,cy:128}],[2.9,{z:1.1,cx:205,cy:122}],[3.3,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={};for(const h of SHT.concat([.85])){const a=t-h;if(a>0&&a<.25)E.shk=Math.max(E.shk||0,3*(1-a/.25));}const a2=t-2.2;if(a2>0&&a2<.6)E.shk=Math.max(E.shk||0,8*(1-a2/.6));if(a2>=0&&a2<.04)E.flash=.5;return E;},
 fx:c=>{shishiFX(c,false);shishiSlamFX(c,2.2);}};
/* ---- fatality do Shishi Rendan: o calcanhar crava a cabeca do Naruto na agua ---- */
const N_PLANT=mk({tilt:0,lean:0,crouch:1,fbx:-5,fby:-6,ffx:5,ffy:-7,hxF:-2,hyF:9,hxB:-2,hyB:9,hr:0,expr:3,tw:1,wind:.6});
ANIMS.shishi.L={g:true,dur:9.0,koAt:8.3,bannerAt:6.5,banner:['獅','FATALITY','Shishi Rendan','#ffb04a'],latchT:2.15,
 map:[[0,0],[.8,.8],[1.4,1.1],[3.0,1.95],[3.6,2.05],[4.4,2.15],[6.0,3.1],[7.5,4.2],[99,95.7]],
 sYf:sasYShishi,
 sP:ANIMS.shishi.sP.filter(k=>k[0]<=2.0).concat([[2.3,SH_HEEL],[2.6,READY],[3.0,READY],[3.6,VICTORY],[99,VICTORY]]),
 sX:ANIMS.shishi.sX.filter(k=>k[0]<=2.3).concat([[99,260]]),
 nP:[[0,N_READY],[.8,N_READY],[.85,N_HITB],[1.1,N_AIR],[1.4,N_AIR2],[1.7,N_AIR],[1.95,N_AIR2],[2.1,N_AIR],[2.18,N_PLANT],[3.3,N_PLANT],[4.0,N_DOWN],[99,N_DOWN]],
 nX:[[0,288],[.85,288],[1.2,292],[2.0,290],[99,290]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.4,cx:180,cy:126}],[.9,{z:1.6,cx:268,cy:118}],[1.3,{z:1.5,cx:274,cy:96}],[1.9,{z:1.9,cx:280,cy:92}],[2.05,{z:2.4,cx:284,cy:110}],[2.2,{z:2.7,cx:288,cy:150}],[2.9,{z:2.2,cx:288,cy:150}],[3.6,{z:1.8,cx:288,cy:140}],[4.2,{z:1.4,cx:250,cy:128}],[4.8,{z:1.04,cx:192,cy:116}]],
 nRot:t=>{if(t<1.95)return 0;if(t<2.18)return -3.14*scaleAt(0,1,1.95,2.18,t);return -3.14+1.57*scaleAt(0,1,3.3,4.0,t);},
 nY:t=>interp([[0,0],[.85,0],[1.2,-62],[1.9,-66],[2.0,-66],[2.18,0],[3.3,0],[4.0,32],[99,32]],t),
 stat:{nx0:290,sx0:215,nP:N_DOWN},
 env:(raw,t)=>{const a=raw-4.4,E={};if(a>0&&a<1.7)E.shk=12*Math.pow(1-a/1.7,1.4)*(a<.4?1.3:1);if(a>=0&&a<.04)E.flash=.95;else if(a>=.04&&a<.14)E.flash=.5;else if(a>=.14&&a<.3)E.flash=.18;
  for(const h of SHT){const d=t-h;if(d>0&&d<.25)E.shk=Math.max(E.shk||0,3*(1-d/.25));}
  E.dim=.45*scaleAt(0,1,.4,.85,t)*(1-.4*scaleAt(0,1,6.0,7.0,raw)-.6*scaleAt(0,1,8.3,9.0,raw));E.bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,8.3,9.0,raw));
  const tr=scaleAt(0,1,4.4,5.0,raw)*(1-scaleAt(0,1,6.0,7.2,raw));if(tr>0)E.tint=`rgba(110,6,18,${.2*tr})`;return E;},
 lens:(g,c)=>lensGen(g,c,{streak:[4.4,GY-4],vig:[4.5,5.1,6.2,7.4],fade:[7.8,8.4],spl:[[4.45,.8,.3,52,1],[4.6,.2,.5,40,2],[5.0,.62,.8,36,3]]}),
 fx:c=>{shishiFX(c,true);shishiSlamFX(c,2.18);},fxStatic:c=>shishiSlamFX(c,2.18)};
function sfxFatalShishi(){
 const M=ANIMS.shishi.L.map,rs=rawOfGen(M,2.18);
 nz(.3,'bandpass',500,2400,.22,.5);tone('sine',70,38,2.4,.25,.7);SHT.forEach(a=>{const r=rawOfGen(M,a);nz(.08,'bandpass',1500,700,.45,r);tone('sine',120,50,.18,.5,r);});
 const r0=rawOfGen(M,.85);nz(.12,'highpass',3000,8000,.4,r0);tone('sine',110,38,.4,.7,r0);
 nz(.3,'highpass',2500,8000,.4,rs-.2);tone('sine',60,24,1.2,.95,rs);nz(.8,'lowpass',2600,160,.9,rs);nz(.3,'bandpass',1500,500,.5,rs+.05);nz(1.2,'lowpass',900,200,.3,rs+.4);
 [rs+1.5,rs+2.2,rs+2.9].forEach((a,i)=>{tone('sine',62,38,.2,.45-i*.05,a);tone('sine',58,36,.2,.35-i*.05,a+.26);});
 tone('sine',85,30,.55,.65,rs+3.0);nz(.45,'lowpass',1600,150,.6,rs+3.0);}
ANIMS.shishi.L.sfxFn=sfxFatalShishi;
/* ---- Selo Amaldicoado: Chidori Sombrio ---- */
const SEL_N=mk({tilt:.05,crouch:6,lean:1,fbx:-9,ffx:7,hxF:2,hyF:-13,hxB:3,hyB:9,hr:.12,hdy:2,expr:2,tw:.9,red:1,hF:3});
const SEL_B=mk({tilt:-.1,crouch:5,lean:-2,fbx:-10,ffx:8,hxF:12,hyF:2,hxB:12,hyB:3,hr:-.1,expr:2,tw:.9,red:1,wind:1});
const SEL_C=mk({tilt:.06,crouch:5,lean:0,fbx:-10,ffx:8,hxF:14,hyF:8,hxB:12,hyB:7,expr:2,tw:.9,hF:1,hB:3,hr:.08,red:1,wind:.8});
const SEL_D=mk({tilt:.42,crouch:7,lean:3,fbx:-16,fby:-4,ffx:-4,ffy:-6,hxF:17,hyF:-5,hxB:-9,hyB:3,hdx:3,hdy:1,red:1,expr:2,hF:1,hB:0,tw:.8,hr:-.1,wind:1});
const SEL_H=mk({tilt:.32,crouch:6,lean:3,fbx:-12,ffx:7,hxF:17,hyF:-6,hxB:-8,hyB:3,hdx:3,hdy:1,red:1,expr:2,hF:1,hB:0,tw:.8,hr:-.08,wind:.6});
const SELX=[[0,96],[2.75,96],[2.95,150],[3.15,246],[4.1,246],[4.7,110],[5.2,96]];
function seloFX(c,fatal){
 const {f,A,t,time,fr,nx0,sx0,sy0,rS,hw}=c,tt=A?t:99;
 const aur=scaleAt(0,1,.8,1.8,tt)*(1-scaleAt(0,1,4.3,5.0,tt));
 if(A&&aur>0)curseAura(f,sx0,aur,time,fr);
 if(A&&tt>.6&&tt<2.0){f.globalCompositeOperation='lighter';const k=scaleAt(0,1,.6,1.0,tt);for(let i=0;i<3;i++){f.strokeStyle=`rgba(170,90,255,${(1-i*.3)*k*.5})`;f.lineWidth=.5;f.beginPath();f.ellipse(sx0,GY-30,10+((time*20+i*13)%34),14+((time*20+i*13)%34)*.6,0,0,TAU);f.stroke();}f.globalCompositeOperation='source-over';}
 const pw=scaleAt(0,1,2.0,2.6,tt)*(1-scaleAt(0,1,3.2,3.45,tt));
 if(A&&pw>0&&!(fatal&&tt>=3.22))darkChidoriFX(f,hw[0],hw[1],pw*1.1,fr>>1,time);
 if(A&&tt>=2.95&&tt<3.2){for(let i=3;i>=1;i--){const t2=tt-i*.03;if(t2<2.95)continue;const P2=evalPose(c.A.sP||ANIMS.selochidori.sP,t2),x2=interp(SELX,t2);blit(x2,GY,false,SASUKE,P2,time,{tint:[150,70,255],tk:.6,alpha:.3-i*.07,noRefl:true,curse:1});}
  f.lineCap='round';f.strokeStyle='rgba(170,90,255,.5)';f.lineWidth=.5;for(let i=0;i<14;i++){const y=GY-70+((i*29)%70),x=c.ccx-c.hw2+((i*53)%W)/c.z,l=22+((i*17)%50);f.beginPath();f.moveTo(x,y);f.lineTo(x-l,y);f.stroke();}}
 const a=tt-3.2;
 if(A&&a>=0&&a<1.2){const cx=nx0-6,cy=GY-40;f.globalCompositeOperation='lighter';
  if(a<.7)orb(f,cx,cy,34*(1-a/.9),[[0,'rgba(4,0,10,.8)'],[1,'rgba(20,4,40,0)']]);f.globalCompositeOperation='lighter';if(a<.5&&!fatal)orb(f,cx,cy,50*(1-a/.7),[[0,'rgba(200,160,255,.5)'],[.35,'rgba(130,60,230,.4)'],[1,'rgba(60,10,140,0)']]);
  const k=Math.min(1,a/.4);ringFX(f,cx,cy,6+70*k,2.4*(1-k)+.3,`rgba(190,120,255,${1-k})`);
  const r2=R(88);let L=[];for(let i=0;i<(fatal?4:14);i++)L.push(...boltLines(cx,cy,r2()*TAU,(14+r2()*34)*(1-a/1.2)*(fatal?.6:1),(fr>>1)*29+i,true));darkBolts(f,L,fatal?.5:1);
  f.globalCompositeOperation='source-over';bloodSpray(f,cx,cy,a,95,fatal?14:24,-1);}
 if(!fatal&&A&&a>=0&&a<1.3){scraps(f,nx0,GY-40,a,96,12,[[40,20,70],[245,143,28]],0);}
}
ANIMS.selochidori={dur:5.4,hold:3.2,hitT:3.2,dmg:44,cost:35,noLift:false,noSeal:true,
 sP:[[0,READY],[.4,READY],[.6,SEL_B],[1.7,SEL_B],[1.95,SEL_B],[2.3,SEL_C],[2.7,SEL_C],[2.9,SEL_D],[3.15,SEL_D],[3.2,SEL_H],[3.9,SEL_H],[4.4,READY],[5.4,READY]],
 sX:SELX,
 nP:[[0,N_READY],[2.4,N_READY],[2.6,N_SURP],[2.95,N_GUARD],[3.15,N_GUARD],[3.2,N_HIT],[3.7,N_HIT],[4.1,N_STAG],[4.9,N_READY],[5.4,N_READY]],
 nX:[[0,288],[3.15,288],[3.2,290],[3.6,324],[4.3,318],[5.0,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:2.2,cx:104,cy:122}],[1.7,{z:2.0,cx:104,cy:122}],[2.0,{z:1.5,cx:120,cy:124}],[2.6,{z:1.5,cx:112,cy:128}],[2.9,{z:1.3,cx:180,cy:128}],[3.1,{z:1.4,cx:250,cy:130}],[3.25,{z:1.6,cx:272,cy:130}],[4.0,{z:1.35,cx:264,cy:128}],[4.8,{z:1.04,cx:192,cy:116}],[5.4,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={},a=t-3.2;if(a>0&&a<1)E.shk=7*(1-a/1);if(a>=0&&a<.04)E.flash=.5;else if(a>=.04&&a<.14)E.flash=.25;if(t>1.0&&t<1.9)E.shk=Math.max(E.shk||0,1.6);
  E.dim=.5*scaleAt(0,1,.4,.85,t)*(1-scaleAt(0,1,4.0,4.8,t));E.bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,4.2,4.8,t));
  const ti=scaleAt(0,1,.8,1.5,t)*(1-scaleAt(0,1,4.0,4.8,t));if(ti>0)E.tint=`rgba(60,10,110,${.28*ti})`;return E;},
 fx:c=>seloFX(c,false)};
/* ---- fatality: as marcas da maldicao se espalham, o Naruto vira pedra negra e se despedaca ---- */
const N_CURSE=mk({tilt:-.06,lean:-2,crouch:2,fbx:-6,ffx:5,hxF:-3,hyF:6,hxB:-4,hyB:6,hdx:-1,hdy:0,hr:-.3,expr:3,tw:1,wind:.5});
const N_CURSE2=mk({tilt:.04,lean:-1,crouch:3,fbx:-6,ffx:5,hxF:2,hyF:11,hxB:1,hyB:11,hdx:0,hdy:1,hr:.2,expr:3,tw:1});
const N_STONE=mk({tilt:-.02,lean:-1,crouch:1,fbx:-5,ffx:5,hxF:6,hyF:-10,hxB:5,hyB:-9,hdx:0,hdy:-1,hr:-.35,expr:3,tw:1});
const SELSH=4.2;
function selFatalFX(c){
 const {f,A,t,time,nx0,fr}=c,tt=A?t:99;
 seloFX(c,true);
 const cx=nx0-1.5,cy=GY-40,r2=R(fr*7+3);f.lineCap='round';
 if(A&&tt>=3.25&&tt<4.35){ /* braco cravado: energia roxa e negra vaza pelo corpo, sangue jorra dos dois lados */
  f.globalCompositeOperation='lighter';const gl=.55+.25*Math.sin(time*40);
  orb(f,cx,cy,20,[[0,`rgba(215,175,255,${gl*.4})`],[.4,`rgba(120,50,230,${gl*.2})`],[1,'rgba(50,10,120,0)']]);
  let L=[];for(let i=0;i<4;i++)L.push(...boltLines(cx,cy,r2()*TAU,9+r2()*14,fr*31+i,false));darkBolts(f,L,.55);
  f.globalCompositeOperation='source-over';
  const a=tt-3.25;for(let k=0;k<5;k++){const ak=a-k*.26;if(ak>=0&&ak<.85){bloodSpray(f,nx0+7,cy,ak,11+k,k?14:28,1);bloodSpray(f,nx0-8,cy+1,ak,21+k,k?10:20,-1);}}}
 const rp=tt-SELSH;
 if(A&&rp>=0&&rp<1.5){ /* arranque: o buraco abre e o sangue explode */
  bloodSpray(f,cx-3,cy,rp*1.4,41,70,-1);bloodSpray(f,cx-3,cy+2,rp*1.1,42,52,-1);bloodSpray(f,cx+5,cy,rp*1.2,43,56,1);bloodSpray(f,cx,cy-3,rp*1.3,44,44,-1);bloodSpray(f,cx+2,cy+3,rp*1.0,45,40,1);
  if(rp<.4){f.globalCompositeOperation='lighter';const k=rp/.4;
   orb(f,cx,cy,40*(1-k*.6),[[0,`rgba(235,215,255,${.5*(1-k)})`],[.35,`rgba(150,80,245,${.3*(1-k)})`],[1,'rgba(50,10,130,0)']]);
   ringFX(f,cx,cy,8+78*(1-(1-k)*(1-k)),2.4*(1-k)+.2,`rgba(195,140,255,${1-k})`);
   let L=[];for(let i=0;i<5;i++)L.push(...boltLines(cx,cy,r2()*TAU,(12+r2()*26)*(1-k*.7),fr*13+i,false));darkBolts(f,L,.7);f.globalCompositeOperation='source-over';}
  for(let i=0;i<60;i++){const r=R(300+i),vx=-(30+r()*150),vy=-(10+r()*110),x=cx-2+vx*rp,y=cy+vy*rp+150*rp*rp;if(y>GY+2||rp>1.3)continue;
   f.fillStyle=r()<.35?'rgba(70,6,12,.95)':'rgba(150,12,20,.95)';f.beginPath();f.ellipse(x,y,.6+r()*1.5,.5+r()*1.1,r()*3,0,TAU);f.fill();}}
 if(!A||tt>SELSH+.1){ /* buraco grande no peito: sangue escorrendo e poca crescendo */
  const kk=A?clamp((tt-SELSH)/.4,0,1):1,wy=cy+6;
  for(let i=0;i<8;i++){const sp=.35+((i*29)%7)/14,ph=((time*sp+i*.23)%1),x0=cx+(((i*53)%11)-5)*1.2,len=(GY-wy)*(.45+((i*17)%5)/9),yy=wy+ph*len,w=.6+((i*13)%4)*.34;
   f.strokeStyle=`rgba(115,6,14,${.85*kk})`;f.lineWidth=w;f.beginPath();f.moveTo(x0,wy);f.quadraticCurveTo(x0+Math.sin(time*2+i)*1.2,(wy+yy)/2,x0,yy);f.stroke();
   f.fillStyle=`rgba(150,10,20,${kk*(1-ph*.5)})`;f.beginPath();f.ellipse(x0,yy,w*.8,w*1.3,0,0,TAU);f.fill();}
  const pr=A?Math.min(16,Math.max(0,(tt-SELSH-.2)*5)):16;if(pr>0){f.fillStyle='rgba(95,5,13,.78)';f.beginPath();f.ellipse(nx0,GY+1.6,pr,pr*.24,0,0,TAU);f.fill();f.fillStyle='rgba(150,14,22,.45)';f.beginPath();f.ellipse(nx0-pr*.15,GY+1.3,pr*.6,pr*.14,0,0,TAU);f.fill();}}
}
ANIMS.selochidori.L={g:true,dur:10.6,koAt:9.9,bannerAt:8.1,banner:['呪','FATALITY','Selo Amaldiçoado','#8a50c8'],latchT:3.25,
 map:[[0,0],[2.7,2.7],[3.6,3.15],[3.9,3.2],[5.8,4.1],[6.2,4.3],[7.6,5.1],[99,96.5]],
 sX:SELX.filter(k=>k[0]<=2.95).concat([[3.25,262],[4.1,262],[4.2,258],[4.3,236],[5.0,232],[6.2,232],[7.0,96],[99,96]]),
 sP:ANIMS.selochidori.sP.filter(k=>k[0]<=3.2).concat([[3.5,HIT_B],[4.0,HIT_B],[4.12,CH_WIND],[4.22,CH_RIP],[4.7,CH_DRIP],[5.4,VICTORY],[99,VICTORY]]),
 nP:[[0,N_READY],[2.4,N_READY],[2.6,N_SURP],[2.95,N_GUARD],[3.15,N_GUARD],[3.2,N_IMP],[3.6,N_IMP_B],[4.1,N_IMP2],[4.26,N_JERK],[4.6,N_SWAY1],[5.4,N_SWAY2],[5.9,N_SWAY2],[6.3,N_SLUMP],[6.7,N_DOWN_T],[99,N_DOWN_T]],
 nX:[[0,288],[3.15,288],[3.2,291],[4.1,291],[4.26,285],[4.6,289],[5.9,289],[6.7,300],[99,300]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:2.2,cx:104,cy:122}],[1.7,{z:2.0,cx:104,cy:122}],[2.0,{z:1.5,cx:120,cy:124}],[2.6,{z:1.5,cx:112,cy:128}],[2.9,{z:1.3,cx:180,cy:128}],[3.1,{z:1.6,cx:260,cy:130}],[3.3,{z:2.4,cx:284,cy:131}],[3.7,{z:3.0,cx:276,cy:131}],[4.1,{z:2.3,cx:283,cy:132}],[4.24,{z:2.6,cx:272,cy:130}],[4.5,{z:3.1,cx:284,cy:140}],[4.9,{z:3.2,cx:284,cy:140}],[5.3,{z:2.5,cx:262,cy:138}],[6.2,{z:2.3,cx:260,cy:137}],[6.8,{z:1.9,cx:268,cy:130}],[7.6,{z:1.5,cx:230,cy:122}],[8.2,{z:1.25,cx:200,cy:120}]],
 stat:{nx0:300},
 env:(raw,t)=>{const E={};let a=raw-3.9;if(a>0&&a<1.8)E.shk=10*Math.pow(1-a/1.8,1.4)*(a<.42?1.3:1);if(a>=0&&a<.04)E.flash=.8;else if(a>=.04&&a<.14)E.flash=.45;else if(a>=.14&&a<.3)E.flash=.15;
  const b=raw-5.95;if(b>0&&b<.8)E.shk=Math.max(E.shk||0,13*(1-b/.8));if(b>=0&&b<.08)E.flash=Math.max(E.flash||0,.7);else if(b>=.08&&b<.2)E.flash=Math.max(E.flash||0,.3);
  E.dim=.5*scaleAt(0,1,.4,.85,t)*(1-.3*scaleAt(0,1,8.0,9.0,raw)-.7*scaleAt(0,1,9.9,10.6,raw));E.bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,9.9,10.6,raw));
  const ti=scaleAt(0,1,.8,1.5,t)*(1-scaleAt(0,1,8.0,9.0,raw));if(ti>0)E.tint=`rgba(60,10,110,${.3*ti})`;return E;},
 lens:(g,c)=>lensGen(g,c,{vig:[4.0,4.8,8.2,9.4],fade:[9.4,10.1],spl:[[3.95,.8,.3,52,1],[4.1,.2,.5,40,2],[5.95,.5,.4,96,11],[5.97,.3,.25,74,5],[6.0,.72,.16,60,6],[6.06,.2,.8,70,7],[6.2,.1,.55,48,8],[6.35,.85,.5,44,9],[6.5,.4,.85,36,10],[6.7,.62,.3,50,3]]}),
 fx:c=>selFatalFX(c),fxStatic:c=>selFatalFX(c)};
function sfxFatalSelo(){
 const M=ANIMS.selochidori.L.map,rh=rawOfGen(M,3.2),rr=rawOfGen(M,SELSH);
 tone('sine',55,48,2.0,.4,.7);nz(1.8,'bandpass',200,900,.25,.8);tone('sawtooth',90,400,1.2,.06,1.0,8);nz(.6,'highpass',3000,9000,.3,1.9);
 tone('sine',2600,3600,.8,.04,2.3);nz(.4,'bandpass',500,3200,.2,3.0);
 nz(.3,'highpass',3500,9000,.7,rh);nz(.5,'lowpass',2000,150,.9,rh);tone('sine',90,26,.9,.9,rh);
 nz(rr-rh,'bandpass',500,2200,.12,rh+.2);tone('sawtooth',60,140,rr-rh,.05,rh+.2,20);
 nz(.5,'lowpass',2500,120,1.0,rr);nz(.35,'bandpass',900,300,.9,rr);tone('sine',80,28,1.2,1.0,rr);nz(.3,'highpass',3000,9000,.7,rr);
 [rr+.2,rr+.45,rr+.8,rr+1.2].forEach(a=>nz(.1,'bandpass',1500,500,.35,a));}
ANIMS.selochidori.L.sfxFn=sfxFatalSelo;
