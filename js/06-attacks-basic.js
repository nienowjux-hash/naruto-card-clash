/* ---------- ataques basicos (Atacar): Kunai, Shuriken, Soco e Chute, cada um com seu fatality ---------- */
const LG=type=>!!(type&&ANIMS[type]&&ANIMS[type].L&&ANIMS[type].L.g&&((anim&&anim.lethal)||window.__LETHG===type));
const mapGen=(M,raw)=>{if(raw<=0)return raw;let i=0;while(i<M.length-2&&raw>M[i+1][0])i++;const a=M[i],b=M[i+1];return a[1]+(b[1]-a[1])*(raw-a[0])/(b[0]-a[0]);};
const rawOfGen=(M,tt)=>{let lo=0,hi=60;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(mapGen(M,m)<tt)lo=m;else hi=m;}return lo;};
let fatalKind=null;
/* gira um ponto do mundo em volta do pivo do corpo, igual ao que blit() faz quando o Naruto cai (rot em radianos) */
const rotAround=(x,y,px,py,ang)=>{const c=Math.cos(ang),s=Math.sin(ang),dx=x-px,dy=y-py;return[px+dx*c-dy*s,py+dx*s+dy*c];};
/* efeitos de "lente" reutilizaveis: vinheta vermelha pulsante, raio de luz e respingos de sangue na camera */
const LPW=213,LPH=120,lensPix=document.createElement('canvas');lensPix.width=LPW;lensPix.height=LPH;const lensPx=lensPix.getContext('2d'); /* respingos de sangue na lente em pixels grandes */
function lensGen(g,c,cfg){
 const raw=c.raw,syp=y=>(y-c.ccy)*K*c.z+PH/2;
 if(cfg.streak){const a=raw-cfg.streak[0];if(a>=0&&a<.4){const y=syp(cfg.streak[1]),al=1-a/.4;g.save();g.globalCompositeOperation='lighter';const gr=g.createLinearGradient(0,y-7,0,y+7);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,`rgba(255,255,255,${al})`);gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,y-7,PW,14);g.restore();}}
 const hv=scaleAt(0,1,cfg.vig[0],cfg.vig[1],raw)*(1-scaleAt(0,1,cfg.vig[2],cfg.vig[3],raw));
 if(hv>0){const pulse=.5+.5*Math.pow(Math.max(0,Math.sin(raw*5.2)),4),vg=g.createRadialGradient(PW/2,PH/2,PH*.3,PW/2,PH/2,PW*.65);vg.addColorStop(0,'rgba(90,0,8,0)');vg.addColorStop(1,`rgba(110,0,10,${.55*hv*pulse+.1*hv})`);g.fillStyle=vg;g.fillRect(0,0,PW,PH);}
 const fade=1-scaleAt(0,1,cfg.fade[0],cfg.fade[1],raw);if(fade<=0||!cfg.spl)return;
 const gg=g;g=lensPx;lensPx.setTransform(1,0,0,1,0,0);lensPx.clearRect(0,0,LPW,LPH);lensPx.setTransform(LPW/PW,0,0,LPH/PH,0,0);
 for(const s of cfg.spl){const age=raw-s[0];if(age<0)continue;const x=s[1]*PW,y=s[2]*PH+age*s[3]*.4*Math.min(1,age),sz=s[3]*(.55+Math.min(1,age*5)*.45);
  const len=Math.min(age*s[3]*.9,s[3]*2.2);g.save();g.lineCap='round';g.strokeStyle=`rgba(104,4,12,${fade*.8})`;g.lineWidth=sz*.2;g.beginPath();g.moveTo(x,y);g.lineTo(x,y+len);g.stroke();
  g.globalAlpha=fade*.88;g.translate(x,y);g.fillStyle='rgb(112,5,13)';blobPath(g,sz,s[4],.3);g.fill();g.fillStyle='rgba(165,15,24,.55)';g.translate(-sz*.12,-sz*.14);blobPath(g,sz*.45,s[4]+1,.3);g.fill();g.restore();}
 g=gg;g.save();g.imageSmoothingEnabled=false;g.drawImage(lensPix,0,0,PW,PH);g.restore();
}
const ATKS=[
 {id:'kunai',name:'Kunai',cost:0,col:'#b8c4d8',desc:'Arremessa um kunai direto no alvo.',live:true},
 {id:'shuriken',name:'Shuriken',cost:0,col:'#9fb0c8',desc:'Lança estrelas ninja que giram até o alvo.',live:true},
 {id:'soco',name:'Soco',cost:0,col:'#ffb04a',desc:'Avança e acerta um soco no rosto.',live:true},
 {id:'chute',name:'Chute',cost:0,col:'#ff8a4a',desc:'Salta e acerta um chute giratório.',live:true}];
/* ---- Kunai ---- */
const KT_W=mk({tilt:-.12,crouch:3,lean:-2,fbx:-7,ffx:5,hxF:-6,hyF:-3,hxB:6,hyB:5,expr:1,tw:.92,hr:-.04});
const KT_T=mk({tilt:.14,crouch:3,lean:2,fbx:-7,ffx:7,hxF:15,hyF:-5,hxB:-4,hyB:4,expr:1,tw:.9,hr:.04,wind:.3});
const KT_F=mk({tilt:.06,crouch:3,lean:1,fbx:-7,ffx:6,hxF:11,hyF:-2,hxB:-2,hyB:6,expr:1,tw:.92,hr:.02});
function drawKunai(f,x,y,ang,sc){
 f.save();f.translate(x,y);f.rotate(ang);f.scale(sc,sc);f.lineCap='round';
 f.strokeStyle='#161624';f.lineWidth=1.3;f.beginPath();f.moveTo(-4,0);f.lineTo(1,0);f.stroke();
 f.strokeStyle='#9aa0b8';f.lineWidth=.5;f.beginPath();f.arc(-5.4,0,1.2,0,TAU);f.stroke();
 f.beginPath();f.moveTo(1,-1.1);f.lineTo(10,0);f.lineTo(1,1.1);f.closePath();const g2=f.createLinearGradient(1,0,10,0);g2.addColorStop(0,'#c0cadb');g2.addColorStop(1,'#f6f9ff');f.fillStyle=g2;f.fill();f.strokeStyle='rgba(30,30,50,.85)';f.lineWidth=.35;f.stroke();
 f.restore();}
/* voo do kunai (do instante em que sai da mao ate acertar) e kunai cravado depois do impacto. Lm = versao fatal (mira na testa) */
function kunaiFX(c,Lm){
 const {f,A,t,time,fr,nx0,ny0}=c,T0=.85,T1=1.25,sPk=Lm?A.L.sP:A.sP;
 const hr=rigW(evalPose(sPk,T0)),P0=[96+hr.hf.hx+3,GY+hr.hf.hy];
 let P1=[nx0-6,GY-42];
 if(Lm){const rg=rigW(evalPose(A.L.nP,T1));P1=[288-rg.C[0]-3.4,GY+rg.C[1]-1.6];}
 const dx=P1[0]-P0[0],dy=P1[1]-P0[1],dir=Math.atan2(dy,dx);
 if(t>=T0&&t<T1){const k=(t-T0)/(T1-T0),pos=kk=>[P0[0]+dx*kk,P0[1]+dy*kk-Math.sin(kk*Math.PI)*(Lm?5:10)];
  f.globalCompositeOperation='lighter';for(let i=1;i<=9;i++){const kk=k-i*.025;if(kk<0)break;const q=pos(kk);f.fillStyle=`rgba(210,230,255,${(1-i/10)*.7})`;f.beginPath();f.arc(q[0],q[1],1.1*(1-i/12),0,TAU);f.fill();}
  if(Lm){for(let i=0;i<3;i++){const q=pos(Math.max(0,k-i*.05));f.strokeStyle=`rgba(190,225,255,${.5-i*.15})`;f.lineWidth=.5;f.beginPath();f.ellipse(q[0],q[1],3+i*3,6+i*5,dir,0,TAU);f.stroke();}}
  f.globalCompositeOperation='source-over';const q=pos(k);drawKunai(f,q[0],q[1],dir+(1-k)*(Lm?5:12),Lm?1.35:1);}
 const a=t-T1;
 if(a>=0){
  if(!Lm&&t<2.7)drawKunai(f,P1[0]-8.5,P1[1],-.08,1.05); /* na versao fatal o kunai fica cravado na testa e cai junto com o corpo (ver kunaiFatalFX) */
  if(a<.55){f.globalCompositeOperation='lighter';if(a<.3)orb(f,P1[0],P1[1],16*(1-a/.45),[[0,'rgba(255,255,255,.8)'],[.4,'rgba(200,225,255,.4)'],[1,'rgba(120,160,255,0)']]);
   const r2=R(61);f.lineCap='round';for(let i=0;i<10;i++){const an=-Math.PI*.8+r2()*Math.PI*1.6,r0=3+a*60,r1=r0+5+r2()*9;f.strokeStyle=`rgba(255,250,220,${1-a/.55})`;f.lineWidth=.45;f.beginPath();f.moveTo(P1[0]+Math.cos(an)*r0,P1[1]+Math.sin(an)*r0);f.lineTo(P1[0]+Math.cos(an)*r1,P1[1]+Math.sin(an)*r1);f.stroke();}
   f.globalCompositeOperation='source-over';}
  bloodSpray(f,P1[0],P1[1],a*(Lm?.9:1),71,Lm?26:14,-1);
  if(!Lm&&t>1.3&&t<3){for(let i=0;i<3;i++){const ph=((t*.6+i*.31)%1);f.fillStyle=`rgba(150,10,20,${(1-ph)*.8})`;f.beginPath();f.ellipse(P1[0]-3+i*1.4,P1[1]+2+ph*ph*20,.6,1,0,0,TAU);f.fill();}}
 }
}
ANIMS.kunai={dur:3.0,hold:1.25,hitT:1.25,dmg:8,cost:0,noLift:true,
 sP:[[0,READY],[.4,READY],[.65,KT_W],[.85,KT_T],[1.05,KT_T],[1.5,KT_F],[1.9,READY],[3.0,READY]],
 nP:[[0,N_READY],[1.0,N_READY],[1.15,N_SURP],[1.25,N_HIT],[1.6,N_STAG],[2.4,N_READY],[3.0,N_READY]],
 nX:[[0,288],[1.2,288],[1.3,293],[1.9,290],[2.6,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.35,cx:130,cy:128}],[1.0,{z:1.3,cx:200,cy:128}],[1.28,{z:1.5,cx:262,cy:130}],[1.9,{z:1.3,cx:240,cy:128}],[2.5,{z:1.04,cx:192,cy:116}],[3.0,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const a=t-1.25,E={};if(a>0&&a<.35)E.shk=2.5*(1-a/.35);if(a>=0&&a<.03)E.flash=.2;return E;},
 fx:c=>kunaiFX(c,false)};
/* ---- fatality do Kunai: tiro na testa em "bullet time" ---- */
const N_HS=mk({tilt:-.16,lean:-3,crouch:1,fbx:-6,fby:-1,ffx:5,hxF:-6,hyF:-3,hxB:-5,hyB:-2,hdx:-2,hdy:-1,hr:-.55,expr:3,tw:1,wind:.5});
const N_FZ=mk({tilt:-.06,lean:-1,crouch:1,fbx:-6,ffx:5,hxF:2,hyF:11,hxB:1,hyB:11,hdx:-1,hdy:0,hr:-.28,expr:3,tw:1});
const N_FZ2=mk({tilt:-.04,lean:-1,crouch:2,fbx:-6,ffx:5,hxF:1,hyF:12,hxB:0,hyB:12,hdx:0,hdy:1,hr:-.18,expr:3,tw:1});
ANIMS.kunai.L={g:true,dur:7.7,koAt:7.1,bannerAt:6.3,banner:['必','FATALITY','Kunai','#b8c4d8'],latchT:1.25,
 map:[[0,0],[.85,.85],[2.6,1.25],[2.95,1.27],[5.2,2.4],[6.8,3.3],[99,95.5]],
 sP:[[0,READY],[.4,READY],[.65,KT_W],[.85,KT_T],[1.6,KT_T],[2.2,KT_F],[2.8,VICTORY],[99,VICTORY]],
 nP:[[0,N_READY],[1.0,N_READY],[1.15,N_SURP],[1.25,N_SURP],[1.28,N_HS],[1.5,N_FZ],[2.1,N_FZ2],[99,N_FZ2]],
 nX:[[0,288],[99,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.65,{z:1.5,cx:128,cy:126}],[.85,{z:2.0,cx:116,cy:122}],[1.0,{z:1.8,cx:150,cy:122}],[1.15,{z:1.9,cx:226,cy:120}],[1.25,{z:2.7,cx:274,cy:118}],[2.0,{z:2.7,cx:282,cy:124}],[2.6,{z:1.9,cx:290,cy:132}],[3.3,{z:1.5,cx:292,cy:142}],[3.9,{z:1.2,cx:240,cy:125}],[4.2,{z:1.04,cx:192,cy:116}]],
 nRot:t=>{const k=scaleAt(0,1,2.1,3.0,t);return -1.45*k*k;},
 nY:t=>{const k=scaleAt(0,1,2.1,3.0,t);return 32*k*k;},
 stat:{nx0:292,nP:N_FZ2},
 env:(raw,t)=>{const a=raw-2.6,E={};if(a>0&&a<1.4)E.shk=8*Math.pow(1-a/1.4,1.4)*(a<.4?1.3:1);if(a>=0&&a<.04)E.flash=.9;else if(a>=.04&&a<.14)E.flash=.45;else if(a>=.14&&a<.3)E.flash=.15;
  E.dim=.45*scaleAt(0,1,.4,.85,t)*(1-.4*scaleAt(0,1,5.2,6.4,raw)-.6*scaleAt(0,1,7.1,7.7,raw));E.bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,7.1,7.7,raw));
  const tr=scaleAt(0,1,.85,1.4,raw)*(1-scaleAt(0,1,5.0,6.4,raw));if(tr>0)E.tint=`rgba(40,60,120,${.2*tr})`;return E;},
 lens:(g,c)=>lensGen(g,c,{streak:[2.6,GY-58],vig:[2.7,3.3,5.4,6.6],fade:[6.8,7.4],spl:[[2.65,.8,.3,52,1],[2.75,.2,.45,40,2],[3.1,.6,.8,36,3]]}),
 fx:c=>{kunaiFX(c,true);kunaiFatalFX(c);},
 fxStatic:c=>kunaiFatalFX(c)};
/* cabeca com kunai na testa: sangue escorrendo pelo rosto, jato pela nuca, e o kunai acompanha o corpo caindo */
function kunaiFatalFX(c){
 const {f,t,time,nx0,ny0,nP,A}=c,L=ANIMS.kunai.L,tt=A?t:99,a=tt-1.25;if(a<0)return;
 const rot=L.nRot(tt),py=GY+ny0+L.nY(tt)-30,pv=[nx0,GY+ny0-30],rg=rigW(nP),ang=-rot;
 const base=[nx0-rg.C[0],GY+ny0+rg.C[1]],rp=q=>rotAround(q[0],q[1],pv[0],pv[1],ang);
 const ent=rp([base[0]-3.4,base[1]-1.6]);
 if(a<1.6){const k=Math.min(1,a/.3);bloodSpray(f,ent[0],ent[1],a*.9,81,22,-1);const back=rp([base[0]+3,base[1]-2]);bloodSpray(f,back[0],back[1],a*1.1,83,30,1);}
 f.lineCap='round';
 for(let i=0;i<3;i++){const ph=Math.min(1,a*.5+i*.05),p0=rp([base[0]-3.4+i*.6,base[1]-1.6]),p1=rp([base[0]-3+i*.5,base[1]+4+ph*5]);f.strokeStyle=`rgba(135,8,16,${.9})`;f.lineWidth=.7;f.beginPath();f.moveTo(p0[0],p0[1]);f.lineTo(p0[0]+(p1[0]-p0[0])*ph,p0[1]+(p1[1]-p0[1])*ph);f.stroke();}
 f.save();f.translate(ent[0],ent[1]);drawKunai(f,-9*1.2*Math.cos(ang),-9*1.2*Math.sin(ang),ang,1.2);f.restore();
 if(tt>2.9||!A){const pr=Math.min(11,((A?tt-2.9:99))*5),fl=rp([base[0],base[1]+6]);f.fillStyle='rgba(112,6,14,.55)';f.beginPath();f.ellipse(nx0+4,GY+2,pr,pr*.24,0,0,TAU);f.fill();}
}
function sfxFatalKunai(){
 const M=ANIMS.kunai.L.map,rf=rawOfGen(M,3.0);
 tone('sine',70,38,2.2,.35,.85);nz(.18,'highpass',3000,8000,.25,.85);tone('sine',3200,1200,1.75,.045,.88);nz(1.7,'bandpass',2500,1200,.06,.9);
 nz(.14,'bandpass',1200,500,.9,2.6);tone('sine',130,34,.55,.85,2.6);nz(.35,'lowpass',1400,160,.7,2.64);tone('sine',4200,3800,.3,.05,2.62);
 [3.4,4.2,5.0,5.8].forEach((a,i)=>{tone('sine',62,38,.2,.5-i*.05,a);tone('sine',58,36,.2,.4-i*.05,a+.26);});
 tone('sine',85,30,.55,.65,rf);nz(.45,'lowpass',1600,150,.6,rf);nz(.3,'lowpass',2600,300,.4,rf+.25);}
ANIMS.kunai.L.sfxFn=sfxFatalKunai;
/* ---- Shuriken ---- */
function drawShuriken(f,x,y,ang,sc,glow){
 f.save();f.translate(x,y);f.rotate(ang);f.scale(sc,sc);
 if(glow){f.globalCompositeOperation='lighter';orb(f,0,0,9,[[0,'rgba(160,200,255,.45)'],[1,'rgba(80,120,255,0)']]);f.globalCompositeOperation='source-over';}
 f.beginPath();for(let i=0;i<4;i++){const a=i*Math.PI/2;f.lineTo(Math.cos(a)*5,Math.sin(a)*5);f.lineTo(Math.cos(a+Math.PI/4)*1.6,Math.sin(a+Math.PI/4)*1.6);}f.closePath();
 const g2=f.createRadialGradient(0,0,0,0,0,5);g2.addColorStop(0,'#e8eef8');g2.addColorStop(1,'#8a94ac');f.fillStyle=g2;f.fill();f.strokeStyle='rgba(20,20,40,.9)';f.lineWidth=.45;f.lineJoin='round';f.stroke();
 f.beginPath();f.arc(0,0,1,0,TAU);f.fillStyle='#161624';f.fill();f.restore();}
function shurikenFX(c){
 const {f,A,t,time,nx0}=c,R0=[.82,1.02,1.22],H=[1.32,1.52,1.72],T=[[nx0-6,GY-44],[nx0-3,GY-54],[nx0-5,GY-24]];
 for(let i=0;i<3;i++){const hr=rigW(evalPose(A.sP,R0[i])),P0=[96+hr.hf.hx+3,GY+hr.hf.hy-1],a=t-H[i];
  if(t>=R0[i]&&t<H[i]){const k=(t-R0[i])/.5,x=P0[0]+(T[i][0]-P0[0])*k,y=P0[1]+(T[i][1]-P0[1])*k-Math.sin(k*Math.PI)*(8+i*3);
   f.globalCompositeOperation='lighter';for(let j=1;j<=7;j++){const kk=k-j*.03;if(kk<0)break;const qx=P0[0]+(T[i][0]-P0[0])*kk,qy=P0[1]+(T[i][1]-P0[1])*kk-Math.sin(kk*Math.PI)*(8+i*3);f.fillStyle=`rgba(200,220,255,${(1-j/8)*.6})`;f.beginPath();f.arc(qx,qy,1-j*.1,0,TAU);f.fill();}f.globalCompositeOperation='source-over';
   drawShuriken(f,x,y,t*40+i,.9,false);}
  if(a>=0){if(t<2.8)drawShuriken(f,T[i][0]-1.2,T[i][1],.4+i*1.1,.8,false);
   if(a<.4){f.globalCompositeOperation='lighter';orb(f,T[i][0],T[i][1],12*(1-a/.5),[[0,'rgba(255,255,255,.7)'],[.4,'rgba(200,225,255,.35)'],[1,'rgba(120,160,255,0)']]);f.globalCompositeOperation='source-over';}
   bloodSpray(f,T[i][0],T[i][1],a,91+i,9,-1);}
 }
}
ANIMS.shuriken={dur:3.2,hold:1.32,hitT:1.32,dmg:12,cost:0,noLift:true,
 sP:[[0,READY],[.4,READY],[.6,KT_W],[.8,KT_T],[.9,KT_F],[.95,KT_W],[1.0,KT_T],[1.1,KT_F],[1.15,KT_W],[1.2,KT_T],[1.7,KT_F],[2.1,READY],[3.2,READY]],
 nP:[[0,N_READY],[1.3,N_READY],[1.32,N_HIT],[1.5,N_STAG],[1.55,N_HIT],[1.72,N_HIT],[2.1,N_STAG],[2.8,N_READY],[3.2,N_READY]],
 nX:[[0,288],[1.3,288],[1.4,292],[1.6,294],[1.8,296],[2.4,290],[3.0,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.35,cx:130,cy:128}],[1.1,{z:1.3,cx:200,cy:128}],[1.35,{z:1.5,cx:262,cy:130}],[2.0,{z:1.3,cx:245,cy:128}],[2.7,{z:1.04,cx:192,cy:116}],[3.2,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={};for(const h of [1.32,1.52,1.72]){const a=t-h;if(a>0&&a<.25)E.shk=Math.max(E.shk||0,2.5*(1-a/.25));if(a>=0&&a<.03)E.flash=.15;}return E;},
 fx:c=>shurikenFX(c)};
/* ---- fatality do Shuriken: shuriken gigante corta o Naruto em dois na diagonal ---- */
const N_CUT=mk({tilt:-.06,lean:-2,crouch:1,fbx:-6,ffx:5,hxF:5,hyF:-6,hxB:-6,hyB:-5,hdx:0,hdy:-1,hr:-.2,expr:3,tw:1,wind:.5});
const CUT_TH=-.35,CUT_TC=1.4,CUT_P=[288,GY-37];
function cutState(tt){
 const ux=Math.cos(CUT_TH),uy=Math.sin(CUT_TH),slide=Math.pow(scaleAt(0,1,CUT_TC,2.1,tt),.8)*20,fall=Math.max(0,tt-1.95),dyg=Math.min(46,.5*170*fall*fall);
 return{ux,uy,dxU:ux*slide,dyU:uy*slide+dyg,rU:-1.3*scaleAt(0,1,1.6,2.9,tt),rL:-1.35*Math.pow(scaleAt(0,1,2.3,3.2,tt),2)};}
/* desenha o Naruto em duas metades: cada uma recortada pela reta do corte e movida/girada separadamente */
function cutDrawN(c){
 const {g,A,t,time,nx0,ny0,nP,nOpt}=c,tt=A?t:99,x=nx0,y=GY+ny0;
 if(tt<CUT_TC){blit(x,y,true,NARUTO,nP,time,nOpt);return;}
 const S=cutState(tt),cp=[nx0,CUT_P[1]],nUp=[S.uy,-S.ux],q=(s,n)=>[cp[0]+S.ux*s+nUp[0]*n,cp[1]+S.uy*s+nUp[1]*n],o2=Object.assign({},nOpt,{noRefl:true});
 const half=(n0,n1)=>{g.beginPath();[q(-130,n0),q(130,n0),q(130,n1),q(-130,n1)].forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.clip();};
 g.save();g.translate(cp[0]+S.dxU,cp[1]+S.dyU);g.rotate(S.rU);g.translate(-cp[0],-cp[1]);half(0,140);blit(x,y,true,NARUTO,nP,time,o2);
 g.fillStyle='rgba(125,8,16,.95)';g.beginPath();[q(-16,0),q(16,0),q(16,-3.4),q(-16,-3.4)].forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();g.restore();
 g.save();g.translate(nx0,GY);g.rotate(S.rL);g.translate(-nx0,-GY);half(-140,0);blit(x,y,true,NARUTO,nP,time,o2);
 g.fillStyle='rgba(125,8,16,.95)';g.beginPath();[q(-16,0),q(16,0),q(16,3.4),q(-16,3.4)].forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();g.restore();
}
function shurikenFatalFX(c){
 const {f,A,t,time,nx0}=c,tt=A?t:99,hr=rigW(evalPose(ANIMS.shuriken.L.sP,.85)),P0=[96+hr.hf.hx+3,GY+hr.hf.hy-1],WALL=[351,GY-34],k=(tt-.85)/.77;
 if(tt>=.85&&tt<1.62){const x=P0[0]+(WALL[0]-P0[0])*k,y=P0[1]+(WALL[1]-P0[1])*k;
  f.globalCompositeOperation='lighter';for(let j=1;j<=14;j++){const kk=k-j*.025;if(kk<0)break;const qx=P0[0]+(WALL[0]-P0[0])*kk,qy=P0[1]+(WALL[1]-P0[1])*kk;f.fillStyle=`rgba(170,205,255,${(1-j/15)*.65})`;f.beginPath();f.arc(qx,qy,3*(1-j/16),0,TAU);f.fill();}
  for(let i=0;i<3;i++){f.strokeStyle=`rgba(190,225,255,${.45-i*.12})`;f.lineWidth=.5;f.beginPath();f.ellipse(x-i*5,y,3+i*3,9+i*4,0,0,TAU);f.stroke();}f.globalCompositeOperation='source-over';
  drawShuriken(f,x,y,tt*55,3.2,true);}
 if(tt>=1.62||!A){drawShuriken(f,WALL[0]-1,WALL[1],.6,3.0,false);const a=A?tt-1.62:9;if(a<.6){f.globalCompositeOperation='lighter';orb(f,WALL[0],WALL[1],26*(1-a/.7),[[0,'rgba(255,255,255,.7)'],[1,'rgba(255,210,150,0)']]);f.globalCompositeOperation='source-over';}
  f.strokeStyle='rgba(15,10,30,.8)';f.lineWidth=.5;for(let i=0;i<7;i++){const an=i*.9+.3,l=8+((i*37)%9);f.beginPath();f.moveTo(WALL[0]+3,WALL[1]);f.lineTo(WALL[0]+3+Math.cos(an)*l,WALL[1]+Math.sin(an)*l);f.stroke();}}
 const a=tt-CUT_TC;if(a<0)return;
 const S=cutState(tt),cp=CUT_P,upC=[cp[0]+S.dxU,cp[1]+S.dyU],loC=rotAround(cp[0],cp[1],nx0,GY,S.rL);
 if(a<.5){f.globalCompositeOperation='lighter';const k=a/.5;f.strokeStyle=`rgba(255,255,255,${1-k})`;f.lineWidth=2.4*(1-k)+.4;f.beginPath();f.moveTo(cp[0]-S.ux*40,cp[1]-S.uy*40);f.lineTo(cp[0]+S.ux*40,cp[1]+S.uy*40);f.stroke();orb(f,cp[0],cp[1],30*(1-k*.6),[[0,'rgba(255,255,255,.7)'],[1,'rgba(255,200,200,0)']]);f.globalCompositeOperation='source-over';}
 const env=Math.pow(1-scaleAt(0,1,CUT_TC,3.4,tt),1.2);
 if(A&&env>0){for(let i=-2;i<=2;i++){const s=i*5,bx=cp[0]+S.ux*s,by=cp[1]+S.uy*s;bloodSpray(f,loC[0]+S.ux*s*.5,loC[1]+S.uy*s*.5,((time*.9+i*.17)%.8),95+i+3,Math.round(10*env)+3,.3*i);bloodSpray(f,upC[0]+S.ux*s,upC[1]+S.uy*s+2,((time*1.1+i*.23)%.7),99+i+3,Math.round(6*env)+2,-.5+.2*i);}}
 f.strokeStyle='rgba(120,6,14,.8)';f.lineWidth=1;f.lineCap='round';for(let i=0;i<5;i++){const ph=((time*.7+i*.21)%1);f.beginPath();f.moveTo(upC[0]+(i-2)*4,upC[1]+3);f.lineTo(upC[0]+(i-2)*4,upC[1]+3+ph*Math.max(4,GY-upC[1]-10)*env);f.stroke();}
 const pr=Math.min(24,(A?Math.max(0,tt-1.9):9)*8);if(pr>0){f.fillStyle='rgba(110,6,14,.6)';f.beginPath();f.ellipse(nx0+2,GY+2,pr,pr*.24,0,0,TAU);f.fill();}
}
ANIMS.shuriken.L={g:true,dur:8.1,koAt:7.6,bannerAt:5.9,banner:['裂','FATALITY','Shuriken','#9fb0c8'],latchT:1.4,
 map:[[0,0],[.85,.85],[2.3,1.38],[2.7,1.42],[5.7,2.9],[7.4,3.9],[99,95.5]],
 sP:[[0,READY],[.4,READY],[.6,KT_W],[.85,KT_T],[1.6,KT_T],[2.2,KT_F],[2.8,VICTORY],[99,VICTORY]],
 nP:[[0,N_READY],[1.3,N_READY],[1.4,N_SURP],[1.45,N_CUT],[99,N_CUT]],
 nX:[[0,288],[99,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.6,{z:1.5,cx:130,cy:126}],[.85,{z:2.0,cx:140,cy:122}],[1.1,{z:1.7,cx:210,cy:124}],[1.4,{z:2.4,cx:285,cy:128}],[2.0,{z:2.2,cx:292,cy:130}],[2.9,{z:1.9,cx:296,cy:140}],[3.6,{z:1.4,cx:270,cy:130}],[4.2,{z:1.04,cx:192,cy:116}]],
 drawN:c=>cutDrawN(c),
 stat:{nx0:292,nP:N_CUT},
 env:(raw,t)=>{const a=raw-2.3,E={};if(a>0&&a<1.6)E.shk=9*Math.pow(1-a/1.6,1.4)*(a<.4?1.3:1);if(a>=0&&a<.04)E.flash=.9;else if(a>=.04&&a<.14)E.flash=.45;else if(a>=.14&&a<.3)E.flash=.15;
  E.dim=.45*scaleAt(0,1,.4,.85,t)*(1-.4*scaleAt(0,1,5.2,6.4,raw)-.6*scaleAt(0,1,7.6,8.1,raw));E.bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,7.6,8.1,raw));
  const tr=scaleAt(0,1,2.3,3.0,raw)*(1-scaleAt(0,1,5.5,6.8,raw));if(tr>0)E.tint=`rgba(110,6,18,${.22*tr})`;return E;},
 lens:(g,c)=>lensGen(g,c,{streak:[2.3,GY-37],vig:[2.4,3.0,5.6,6.8],fade:[7.2,7.8],spl:[[2.35,.8,.3,52,1],[2.45,.2,.45,40,2],[2.9,.65,.8,38,3],[3.4,.4,.2,34,4]]}),
 fx:c=>shurikenFatalFX(c),fxStatic:c=>shurikenFatalFX(c)};
function sfxFatalShur(){
 const M=ANIMS.shuriken.L.map,rl=rawOfGen(M,2.2),rw=rawOfGen(M,1.62);
 tone('sine',70,38,2.4,.3,.85);nz(2.3,'highpass',2500,9000,.12,.85);tone('sine',1500,900,2.3,.05,.9);
 nz(.3,'highpass',3500,9000,.5,2.3);nz(.3,'lowpass',1500,200,.8,2.32);tone('sine',120,34,.5,.8,2.32);nz(.5,'bandpass',300,90,.6,2.4);
 nz(.25,'highpass',2000,7000,.35,rw);tone('sine',200,60,.3,.5,rw);
 [3.0,3.7,4.4,5.1].forEach(a=>nz(.4,'lowpass',700,150,.35,a));
 tone('sine',85,30,.55,.65,rl);nz(.45,'lowpass',1600,150,.6,rl);tone('sine',80,28,.55,.6,rl+.8);nz(.4,'lowpass',1500,150,.55,rl+.8);}
ANIMS.shuriken.L.sfxFn=sfxFatalShur;
/* ---- Soco ---- */
const PN_W=mk({tilt:-.14,crouch:6,lean:-3,fbx:-11,ffx:6,hxF:-7,hyF:3,hxB:5,hyB:6,expr:2,tw:.85,hr:-.05,wind:.3});
const PN_D=mk({tilt:.4,crouch:7,lean:3,fbx:-16,fby:-4,ffx:-4,ffy:-6,hxF:12,hyF:2,hxB:-9,hyB:3,expr:2,tw:.8,hr:-.1,wind:1});
const PN_P=mk({tilt:.34,crouch:6,lean:3,fbx:-12,ffx:7,hxF:17,hyF:-1,hxB:-8,hyB:3,hdx:3,hdy:1,expr:2,tw:.8,hr:-.08,wind:.6});
const PN_R=mk({tilt:.1,crouch:4,lean:1,fbx:-8,ffx:6,hxF:8,hyF:4,hxB:5,hyB:6,expr:1,tw:.9});
const PN_S=mk({tilt:.02,crouch:2,lean:0,fbx:-7,ffx:5,hxF:5,hyF:9,hxB:4,hyB:8,expr:1,tw:.95,hr:.03});
/* faiscas, anel e flash de impacto (reuso: soco e chute) */
function impactFX(f,x,y,a,seed,big){
 if(a<0||a>.7)return;f.globalCompositeOperation='lighter';
 if(a<.3)orb(f,x,y,(big?34:22)*(1-a/.4),[[0,'rgba(255,255,255,.85)'],[.4,'rgba(255,225,170,.4)'],[1,'rgba(255,150,60,0)']]);
 if(a<.35){const k=a/.35;f.strokeStyle=`rgba(255,255,255,${1-k})`;f.lineWidth=(big?2.4:1.6)*(1-k)+.2;f.beginPath();f.ellipse(x,y,6+(big?70:44)*k,(6+(big?70:44)*k)*.92,0,0,TAU);f.stroke();}
 const r2=R(seed);f.lineCap='round';for(let i=0;i<(big?18:12);i++){const an=r2()*TAU,r0=5+a*70,r1=r0+7+r2()*14;f.strokeStyle=`rgba(255,240,200,${1-a/.7})`;f.lineWidth=.5;f.beginPath();f.moveTo(x+Math.cos(an)*r0,y+Math.sin(an)*r0);f.lineTo(x+Math.cos(an)*r1,y+Math.sin(an)*r1);f.stroke();}
 f.globalCompositeOperation='source-over';}
function dashLines(f,c,t0,t1,seed){const {t,ccx,hw2,ccy}=c;if(t<t0||t>t1)return;const r2=R(c.fr*13+seed);f.lineCap='round';for(let i=0;i<16;i++){const y=GY-70+r2()*80,x=ccx-hw2+r2()*W/c.z,l=22+r2()*60;f.strokeStyle=`rgba(255,255,255,${.2+r2()*.4})`;f.lineWidth=.3+r2()*.4;f.beginPath();f.moveTo(x,y);f.lineTo(x-l,y);f.stroke();}}
function socoFX(c){
 const {f,t,nx0}=c;dashLines(f,c,.5,.85,3);
 for(let i=3;i>=1;i--){const tt=t-i*.04;if(tt<.55||tt>.88)continue;const P2=evalPose(ANIMS.soco.sP,tt),x2=interp(ANIMS.soco.sX,tt);blit(x2,GY,false,SASUKE,P2,c.time,{tint:[255,255,255],tk:.5,alpha:.28-i*.07,noRefl:true});}
 const a=t-.85;impactFX(f,nx0-6,GY-53,a,5,false);if(a>=0)bloodSpray(f,nx0-6,GY-52,a,7,16,-1);}
ANIMS.soco={dur:3.0,hold:.85,hitT:.85,dmg:10,cost:0,
 tp:[1.3],
 sP:[[0,READY],[.4,READY],[.5,PN_W],[.62,PN_D],[.8,PN_D],[.85,PN_P],[1.1,PN_P],[1.29,PN_P],[1.31,READY],[3.0,READY]],
 sX:[[0,96],[.4,96],[.52,88],[.62,150],[.82,252],[1.29,252],[1.31,96],[3.0,96]],
 nP:[[0,N_READY],[.8,N_READY],[.85,N_HIT],[1.3,N_STAG],[2.0,N_READY],[3.0,N_READY]],
 nX:[[0,288],[.83,288],[.95,298],[1.4,304],[2.4,290],[3.0,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.3,cx:170,cy:128}],[.9,{z:1.5,cx:262,cy:130}],[1.38,{z:1.45,cx:250,cy:130}],[1.75,{z:1.15,cx:205,cy:122}],[2.2,{z:1.04,cx:192,cy:116}],[3.0,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const a=t-.85,E={};if(a>0&&a<.4)E.shk=5*(1-a/.4);if(a>=0&&a<.03)E.flash=.35;else if(a>=.03&&a<.1)E.flash=.12;return E;},
 fx:c=>socoFX(c)};
/* ---- fatality do Soco: o soco quebra o pescoco, a cabeca gira para tras ---- */
const N_NK1=mk({tilt:-.3,lean:-3,crouch:1,fbx:-6,ffx:5,hxF:-5,hyF:5,hxB:-4,hyB:5,hdx:-3,hdy:-1,hr:-.55,expr:3,tw:1,wind:.8});
const N_NK2=mk({tilt:-.2,lean:-2,crouch:1,fbx:-6,ffx:5,hxF:-1,hyF:10,hxB:-2,hyB:10,hdx:-1,hdy:0,hr:-2.5,expr:3,tw:1});
const N_NK3=mk({tilt:-.04,lean:-1,crouch:1,fbx:-6,ffx:5,hxF:0,hyF:12,hxB:-1,hyB:12,hdx:0,hdy:1,hr:-3.05,expr:3,tw:1});
const N_NK4=mk({tilt:.15,lean:0,crouch:8,fbx:-9,ffx:6,hxF:1,hyF:12,hxB:0,hyB:12,hdx:0,hdy:2,hr:-3.05,expr:3,tw:1});
const N_NKD=Object.assign({},N_DOWN,{hr:-3.05});
function socoFatalFX(c){
 const {f,A,t,time,nx0,ny0,nP}=c,tt=A?t:99,a=tt-.9;
 for(let i=3;i>=1;i--){const t2=tt-i*.04;if(!A||t2<.55||t2>.88)continue;const P2=evalPose(ANIMS.soco.L.sP,t2),x2=interp(ANIMS.soco.L.sX,t2);blit(x2,GY,false,SASUKE,P2,time,{tint:[255,255,255],tk:.5,alpha:.28-i*.07,noRefl:true});}
 if(A)dashLines(f,c,.5,.88,3);
 if(a<0)return;
 const rg=rigW(nP),H=[nx0-rg.C[0],GY+ny0+rg.C[1]],mouth=[H[0]-3,H[1]+2.5];
 impactFX(f,mouth[0],mouth[1],A?a:9,5,true);
 if(A&&a<1.2){bloodSpray(f,mouth[0],mouth[1],a,7,34,1);
  for(let i=0;i<10;i++){const r=R(400+i),vx=30+r()*90,vy=-(20+r()*60),x=mouth[0]+vx*a,y=mouth[1]+vy*a+160*a*a;if(y>GY||a>1)continue;f.fillStyle='#f4f1e6';f.fillRect(x,y,1.1,1.5);}}
 if(A&&a>.12&&a<.5){f.globalCompositeOperation='lighter';f.strokeStyle=`rgba(255,255,255,${1-a/.5})`;f.lineWidth=1.2;f.beginPath();f.ellipse(H[0],H[1],8+a*40,5+a*26,0,0,TAU);f.stroke();f.globalCompositeOperation='source-over';}
 const nk=[H[0]+1,H[1]+6];f.lineCap='round';
 if(tt>1.0){const env=tt>2.6?0:1;for(let i=0;i<3;i++){const ph=((time*.8+i*.3)%1);f.strokeStyle='rgba(135,8,16,.85)';f.lineWidth=.8;f.beginPath();f.moveTo(mouth[0]+(i-1)*.8,mouth[1]);f.lineTo(mouth[0]+(i-1)*.9,mouth[1]+2+ph*14);f.stroke();}}
 if(tt>2.2||!A){const pr=Math.min(11,(A?tt-2.2:99)*9);f.fillStyle='rgba(110,6,14,.55)';f.beginPath();f.ellipse(nx0+4,GY+2,pr,pr*.24,0,0,TAU);f.fill();}
}
ANIMS.soco.L={g:true,dur:7.7,koAt:7.1,bannerAt:5.75,banner:['砕','FATALITY','Soco','#ffb04a'],latchT:.9,
 map:[[0,0],[.7,.7],[1.9,.9],[2.3,.93],[5.0,2.0],[6.5,2.8],[99,96.3]],
 sX:[[0,96],[.4,96],[.52,88],[.62,150],[.82,252],[99,252]],
 sP:[[0,READY],[.4,READY],[.5,PN_W],[.62,PN_D],[.8,PN_D],[.9,PN_P],[1.8,PN_P],[2.4,PN_R],[3.0,PN_S],[99,PN_S]],
 nP:[[0,N_READY],[.8,N_READY],[.9,N_SURP],[.93,N_NK1],[1.05,N_NK2],[1.2,N_NK3],[2.0,N_NK3],[2.6,N_NK4],[3.0,N_NKD],[99,N_NKD]],
 nX:[[0,288],[.88,288],[1.0,296],[2.0,300],[3.0,308],[99,308]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.6,{z:1.5,cx:150,cy:126}],[.8,{z:1.9,cx:230,cy:122}],[.9,{z:2.6,cx:268,cy:118}],[1.3,{z:2.4,cx:274,cy:120}],[2.0,{z:2.0,cx:280,cy:132}],[2.9,{z:1.7,cx:290,cy:140}],[3.6,{z:1.3,cx:240,cy:128}],[4.2,{z:1.04,cx:192,cy:116}]],
 stat:{nx0:308,sx0:252,nP:N_NKD},
 env:(raw,t)=>{const a=raw-2.3,E={};if(a>0&&a<1.5)E.shk=10*Math.pow(1-a/1.5,1.4)*(a<.4?1.3:1);if(a>=0&&a<.04)E.flash=.95;else if(a>=.04&&a<.14)E.flash=.5;else if(a>=.14&&a<.3)E.flash=.18;
  E.dim=.45*scaleAt(0,1,.4,.85,t)*(1-.4*scaleAt(0,1,5.0,6.4,raw)-.6*scaleAt(0,1,7.1,7.7,raw));E.bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,7.1,7.7,raw));
  const tr=scaleAt(0,1,2.3,3.0,raw)*(1-scaleAt(0,1,5.0,6.4,raw));if(tr>0)E.tint=`rgba(110,6,18,${.2*tr})`;return E;},
 lens:(g,c)=>lensGen(g,c,{streak:[2.3,GY-53],vig:[2.4,3.0,5.2,6.4],fade:[6.6,7.2],spl:[[2.35,.8,.3,52,1],[2.5,.18,.5,40,2],[3.2,.62,.8,36,3]]}),
 fx:c=>socoFatalFX(c),fxStatic:c=>socoFatalFX(c)};
function sfxFatalSoco(){
 const rf=rawOfGen(ANIMS.soco.L.map,2.5);
 nz(.3,'bandpass',500,2400,.2,.45);tone('sine',70,38,2.2,.3,.7);nz(1.5,'highpass',2500,8000,.08,.9);
 nz(.12,'highpass',3000,8000,.5,2.3);tone('sine',110,36,.5,.85,2.3);nz(.25,'lowpass',2200,300,.8,2.3);
 [2.46,2.58].forEach(a=>{nz(.05,'bandpass',1800,900,.7,a);tone('sine',260,120,.08,.4,a);});
 [3.2,3.9,4.6,5.3].forEach((a,i)=>{tone('sine',62,38,.2,.5-i*.05,a);tone('sine',58,36,.2,.4-i*.05,a+.26);});
 tone('sine',85,30,.55,.65,rf);nz(.45,'lowpass',1600,150,.6,rf);}
ANIMS.soco.L.sfxFn=sfxFatalSoco;
/* ---- Chute ---- */
const CK_W=mk({tilt:-.2,crouch:8,lean:-4,fbx:-12,ffx:7,hxF:6,hyF:2,hxB:8,hyB:4,expr:2,tw:.85,hr:.05,wind:.3});
const CK_K=mk({tilt:-.14,crouch:2,lean:-1,fbx:-6,ffx:18,ffy:-16,hxF:-5,hyF:4,hxB:10,hyB:-3,hr:.12,expr:2,tw:.9,wind:.7});
const CK_L=mk({tilt:-.1,crouch:3,lean:-2,fbx:-8,ffx:5,hxF:2,hyF:8,hxB:6,hyB:6,expr:1,tw:.92});
function chuteFX(c){
 const {f,t,nx0}=c;dashLines(f,c,.55,.95,9);
 for(let i=3;i>=1;i--){const tt=t-i*.04;if(tt<.6||tt>.95)continue;const P2=evalPose(ANIMS.chute.sP,tt),x2=interp(ANIMS.chute.sX,tt),y2=GY+(function(){const q=ANIMS.chute.sArc;return (tt>q[0]&&tt<q[1])?-Math.sin((tt-q[0])/(q[1]-q[0])*Math.PI)*q[2]:0;})();blit(x2,y2,false,SASUKE,P2,c.time,{tint:[255,255,255],tk:.5,alpha:.28-i*.07,noRefl:true});}
 const a=t-.95;impactFX(f,nx0-5,GY-40,a,6,false);if(a>=0)bloodSpray(f,nx0-5,GY-40,a,8,12,-1);}
ANIMS.chute={dur:3.2,hold:.95,hitT:.95,dmg:12,cost:0,
 tp:[1.35],
 sP:[[0,READY],[.4,READY],[.55,CK_W],[.86,CK_W],[.92,CK_K],[1.34,CK_K],[1.36,READY],[3.2,READY]],
 sX:[[0,96],[.4,96],[.54,87],[.7,170],[.93,256],[1.34,256],[1.36,96],[3.2,96]],
 sArc:[.6,1.0,10],
 nP:[[0,N_READY],[.9,N_READY],[.95,N_HITB],[1.4,N_STAG],[2.1,N_READY],[3.2,N_READY]],
 nX:[[0,288],[.93,288],[1.1,318],[1.5,325],[2.4,300],[3.0,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.3,cx:190,cy:128}],[.95,{z:1.5,cx:272,cy:130}],[1.42,{z:1.45,cx:255,cy:130}],[1.8,{z:1.15,cx:205,cy:122}],[2.4,{z:1.04,cx:192,cy:116}],[3.2,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const a=t-.95,E={};if(a>0&&a<.4)E.shk=6*(1-a/.4);if(a>=0&&a<.03)E.flash=.35;else if(a>=.03&&a<.1)E.flash=.12;return E;},
 fx:c=>chuteFX(c)};
/* ---- fatality do Chute: o Naruto voa e se arrebenta contra a parede de pedra ---- */
const WALLX=352;
const N_FLY=mk({tilt:-.3,lean:-4,crouch:1,fbx:-4,fby:-3,ffx:5,ffy:-3,hxF:-6,hyF:-5,hxB:-6,hyB:-4,hdx:-2,hdy:-1,hr:-.4,expr:3,tw:1,wind:1});
const N_SPLAT=mk({tilt:-.1,lean:-2,crouch:3,fbx:-9,fby:-4,ffx:8,ffy:-4,hxF:-8,hyF:-6,hxB:-8,hyB:-6,hdx:-1,hdy:-1,hr:-.2,expr:3,tw:1});
const N_SLID=mk({tilt:.05,lean:-1,crouch:6,fbx:-8,ffx:6,hxF:1,hyF:12,hxB:0,hyB:12,hdx:0,hdy:2,hr:.1,expr:3,tw:1});
const CH_NX=[[0,288],[.93,288],[1.0,296],[1.3,350],[2.2,350],[2.9,347],[99,347]];
function wallDamage(f,a,A,time){
 const x=WALLX+2,y=GY-40,k=A?Math.min(1,a/.2):1;
 f.fillStyle=`rgba(10,6,20,${.7*k})`;f.beginPath();f.ellipse(x,y,10*k,16*k,0,0,TAU);f.fill();
 f.strokeStyle='rgba(8,4,18,.9)';f.lineWidth=.6;f.lineCap='round';for(let i=0;i<10;i++){const an=-1.5+i*.7,l=(10+((i*29)%14))*k;f.beginPath();f.moveTo(x,y);f.lineTo(x+Math.cos(an)*l*.6-3*k,y+Math.sin(an)*l);f.stroke();}
 f.strokeStyle=`rgba(120,6,14,${.85*k})`;f.lineWidth=2.2;const slide=A?Math.min(1,Math.max(0,(a-.5)/1.4)):1;f.beginPath();f.moveTo(x-1,y-6);f.lineTo(x-1,y-6+(GY-y+4)*slide);f.stroke();f.lineWidth=1;f.beginPath();f.moveTo(x+3,y);f.lineTo(x+3,y+(GY-y)*slide*.8);f.stroke();
}
function chuteFatalFX(c){
 const {f,A,t,time,nx0,nP}=c,tt=A?t:99,a=tt-1.3;
 for(let i=3;i>=1;i--){const t2=tt-i*.04;if(!A||t2<.6||t2>.95)continue;const P2=evalPose(ANIMS.chute.L.sP,t2),x2=interp(ANIMS.chute.L.sX,t2),q=ANIMS.chute.L.sArc,y2=GY+((t2>q[0]&&t2<q[1])?-Math.sin((t2-q[0])/(q[1]-q[0])*Math.PI)*q[2]:0);blit(x2,y2,false,SASUKE,P2,time,{tint:[255,255,255],tk:.5,alpha:.28-i*.07,noRefl:true});}
 if(A)dashLines(f,c,.55,.95,9);
 if(A&&tt>=.95&&tt<1.3){impactFX(f,nx0-5,GY-40,tt-.95,6,true);f.strokeStyle='rgba(255,255,255,.5)';f.lineWidth=.7;f.lineCap='round';for(let i=0;i<8;i++){const y=GY-70+i*9,l=14+((i*13)%16);f.beginPath();f.moveTo(nx0+10,y);f.lineTo(nx0+10+l,y);f.stroke();}}
 if(a<0&&A)return;
 wallDamage(f,a,A,time);
 if(!A)return;
 impactFX(f,WALLX-2,GY-40,a,9,true);
 if(a<1.4){bloodSpray(f,WALLX-2,GY-40,a*1.2,11,34,-1);
  for(let i=0;i<20;i++){const r=R(600+i),x=WALLX-4-r()*8+(r()-.5)*40*Math.min(a,1.2),y=GY-52+r()*20+80*a*a*(.4+r());if(a<0||a>1.3||y>GY)continue;f.fillStyle=r()<.5?'#3a3350':'#6a6590';f.fillRect(x,y,1.2+r()*1.4,1+r()*1.2);}
  f.fillStyle=`rgba(190,180,200,${Math.max(0,.4-a*.3)})`;for(let i=0;i<5;i++)smoke(f,WALLX-10-i*5,GY-42+Math.sin(i*2)*8,10+i*3+a*10,.35*Math.max(0,1-a/1.3));}
 if(a>.8&&a<3){const pr=Math.min(12,(a-.8)*6);f.fillStyle='rgba(110,6,14,.55)';f.beginPath();f.ellipse(nx0,GY+2,pr,pr*.24,0,0,TAU);f.fill();}
}
ANIMS.chute.L={g:true,dur:7.8,koAt:7.2,bannerAt:5.71,banner:['砕','FATALITY','Chute','#ff8a4a'],latchT:1.3,
 map:[[0,0],[.78,.78],[1.8,.95],[2.2,.98],[4.0,1.5],[6.0,2.9],[7.0,3.6],[99,95.6]],
 sX:[[0,96],[.4,96],[.54,87],[.7,170],[.93,256],[99,256]],sArc:[.7,1.15,26],
 sP:[[0,READY],[.4,READY],[.55,CK_W],[.7,PN_D],[.85,CK_K],[1.3,CK_K],[1.9,CK_L],[2.6,PN_S],[99,VICTORY]],
 nP:[[0,N_READY],[.9,N_READY],[.95,N_FLY],[1.25,N_FLY],[1.32,N_SPLAT],[2.0,N_SPLAT],[2.6,N_SLID],[3.1,N_DOWN],[99,N_DOWN]],
 nX:CH_NX,
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.6,{z:1.5,cx:170,cy:126}],[.85,{z:1.9,cx:240,cy:124}],[.95,{z:2.3,cx:284,cy:126}],[1.15,{z:2.0,cx:320,cy:126}],[1.3,{z:2.4,cx:344,cy:124}],[2.0,{z:2.2,cx:340,cy:130}],[2.9,{z:1.8,cx:330,cy:138}],[3.7,{z:1.4,cx:290,cy:130}],[4.3,{z:1.04,cx:192,cy:116}]],
 nRot:t=>{const f=scaleAt(0,1,.95,1.3,t),sl=scaleAt(0,1,2.0,2.6,t);return -(1.1*Math.sin(f*Math.PI*.9)*(1-scaleAt(0,1,1.3,1.36,t)))-(-.0)*sl;},
 nY:t=>{const a=scaleAt(0,1,.95,1.3,t);return -10*Math.sin(a*Math.PI)*(1-scaleAt(0,1,1.3,1.36,t));},
 stat:{nx0:347,nP:N_DOWN},
 env:(raw,t)=>{const a=raw-3.3,E={};if(a>0&&a<1.7)E.shk=11*Math.pow(1-a/1.7,1.4)*(a<.4?1.3:1);if(a>=0&&a<.04)E.flash=.95;else if(a>=.04&&a<.14)E.flash=.5;else if(a>=.14&&a<.3)E.flash=.18;
  E.dim=.45*scaleAt(0,1,.4,.85,t)*(1-.4*scaleAt(0,1,5.2,6.4,raw)-.6*scaleAt(0,1,7.2,7.8,raw));E.bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,7.2,7.8,raw));
  const tr=scaleAt(0,1,3.3,4.0,raw)*(1-scaleAt(0,1,5.4,6.6,raw));if(tr>0)E.tint=`rgba(110,6,18,${.2*tr})`;return E;},
 lens:(g,c)=>lensGen(g,c,{vig:[3.3,4.0,5.6,6.8],fade:[6.8,7.4],spl:[[3.35,.8,.3,52,1],[3.5,.2,.5,40,2],[3.9,.62,.8,36,3]]}),
 fx:c=>chuteFatalFX(c),fxStatic:c=>chuteFatalFX(c)};
function sfxFatalChute(){
 const M=ANIMS.chute.L.map,rw=rawOfGen(M,1.3),rf=rawOfGen(M,2.9);
 nz(.4,'bandpass',600,2800,.22,.5);tone('sine',70,38,2.0,.3,.8);nz(.15,'highpass',3000,8000,.3,2.2);tone('sine',100,34,.5,.85,2.2);nz(.3,'lowpass',2600,200,.7,2.2);
 nz(1.4,'bandpass',300,1500,.1,2.3);
 tone('sine',60,24,.9,.95,rw);nz(.5,'lowpass',2400,160,.9,rw);nz(.25,'highpass',2000,7000,.4,rw);[rw+.12,rw+.3].forEach(a=>nz(.06,'bandpass',1500,600,.5,a));
 nz(1.2,'lowpass',900,200,.3,rw+.5);
 [rw+.7,rw+1.0,rw+1.5].forEach(a=>nz(.2,'lowpass',1800,200,.3,a));
 tone('sine',85,30,.55,.65,rf);nz(.45,'lowpass',1600,150,.6,rf);}
ANIMS.chute.L.sfxFn=sfxFatalChute;
