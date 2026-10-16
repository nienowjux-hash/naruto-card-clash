/* ================== Sōshūken no Jutsu e Shuriken Kage no Jutsu ================== */
const handPt=(P,tt,front)=>{const rg=rigW(evalPose(P,tt)),o=front?rg.hf:rg.hb;return[96+o.hx,GY+o.hy];};
const bz2=(a,c,b,k)=>{const u=1-k;return[u*u*a[0]+2*u*k*c[0]+k*k*b[0],u*u*a[1]+2*u*k*c[1]+k*k*b[1]];};

function wire(f,a,b,al,sag){f.lineCap='round';f.strokeStyle=`rgba(205,225,255,${al})`;f.lineWidth=.4;f.beginPath();f.moveTo(a[0],a[1]);f.quadraticCurveTo((a[0]+b[0])/2,(a[1]+b[1])/2+(sag||0),b[0],b[1]);f.stroke();f.strokeStyle=`rgba(255,255,255,${al*.55})`;f.lineWidth=.16;f.stroke();}
const fenv=(h,v0,v1,fad0,fad1)=>(raw,t)=>{const a=raw-h,E={};if(a>0&&a<1.6)E.shk=10*Math.pow(1-a/1.6,1.4)*(a<.4?1.3:1);if(a>=0&&a<.04)E.flash=.95;else if(a>=.04&&a<.14)E.flash=.5;else if(a>=.14&&a<.3)E.flash=.18;
 E.dim=.45*scaleAt(0,1,.4,.85,t)*(1-.4*scaleAt(0,1,v0,v1,raw)-.6*scaleAt(0,1,fad0,fad1,raw));E.bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,fad0,fad1,raw));
 const tr=scaleAt(0,1,h,h+.7,raw)*(1-scaleAt(0,1,v0,v1,raw));if(tr>0)E.tint=`rgba(110,6,18,${.2*tr})`;return E;};
const SS_T=mk({tilt:.12,crouch:4,lean:2,fbx:-8,ffx:7,hxF:15,hyF:-6,hxB:11,hyB:-3,expr:1,tw:.88,hr:.05,wind:.4,red:1});
const SS_G=mk({tilt:-.02,crouch:4,lean:0,fbx:-8,ffx:6,hxF:11,hyF:-3,hxB:9,hyB:-1,expr:1,tw:.88,red:1});
const SS_P=mk({tilt:-.2,crouch:6,lean:-4,fbx:-11,ffx:6,hxF:-3,hyF:-2,hxB:-4,hyB:0,hr:.1,expr:2,tw:.85,red:1,wind:.5});
const N_JUMP=mk({tilt:.05,lean:1,crouch:-1,fbx:-3,fby:-7,ffx:4,ffy:-8,hxF:7,hyF:-9,hxB:3,hyB:-9,expr:2,tw:1,wind:.8});
const N_BOUND=mk({tilt:0,lean:0,crouch:1,fbx:-4,ffx:4,hxF:1.5,hyF:11,hxB:-1,hyB:11,hdx:0,hdy:0,hr:-.05,expr:3,tw:1});
const N_BOUND2=mk({tilt:-.04,lean:-1,crouch:2,fbx:-4,ffx:4,hxF:1.5,hyF:11,hxB:-1,hyB:11,hdx:-1,hdy:-1,hr:-.35,expr:3,tw:1});
const N_PIN=mk({tilt:0,lean:0,crouch:0,fbx:-3,ffx:3,hxF:2,hyF:-12,hxB:3,hyB:-11,hdx:1,hdy:0,hr:.4,expr:3,tw:1});
/* ---- Sōshūken: shuriken e kunai guiados por fios ---- */
const SSN={sh:{t0:.75,A:[338,GY-70],C1:[220,GY-110],C2:[360,GY-28],B:[293,GY-44],t1:1.35,t2:1.8},ku:{t0:.85,A:[336,GY-24],C1:[220,GY-8],C2:[352,GY-48],B:[291,GY-20],t1:1.45,t2:1.95}};
function ssnPos(w,tt,H){if(tt<w.t0)return null;if(tt<w.t1)return bz2(H,w.C1,w.A,(tt-w.t0)/(w.t1-w.t0));if(tt<w.t2)return bz2(w.A,w.C2,w.B,(tt-w.t1)/(w.t2-w.t1));return w.B;}
function soushukenFX(c){
 const {f,A,t,time}=c;
 for(const [key,front] of [['sh',true],['ku',false]]){const w=SSN[key],H=handPt(A.sP,Math.min(t,w.t0),front),p=ssnPos(w,t,H);if(!p)continue;
  const live=t<w.t2,hand=handPt(A.sP,t,front);
  if(live||t<w.t2+.4)wire(f,hand,p,live?.85:Math.max(0,.85*(1-(t-w.t2)/.4)),live?6*Math.sin((t-w.t0)*5):0);
  if(live){f.globalCompositeOperation='lighter';for(let i=1;i<=8;i++){const tt=t-i*.025,q=ssnPos(w,tt,H);if(!q)break;f.fillStyle=`rgba(200,225,255,${(1-i/9)*.55})`;f.beginPath();f.arc(q[0],q[1],1-i*.09,0,TAU);f.fill();}f.globalCompositeOperation='source-over';}
  const q2=ssnPos(w,t+.012,H)||p,ang=Math.atan2(q2[1]-p[1],q2[0]-p[0]);
  if(t<w.t2+.9){if(key==='sh')drawShuriken(f,p[0],p[1],live?t*46:1.2,.95,live);else drawKunai(f,p[0],p[1],live?ang:.2,1);}
  const a=t-w.t2;if(a>=0&&a<.5){f.globalCompositeOperation='lighter';orb(f,p[0],p[1],14*(1-a/.6),[[0,'rgba(255,255,255,.75)'],[.4,'rgba(200,225,255,.35)'],[1,'rgba(120,160,255,0)']]);f.globalCompositeOperation='source-over';}
  if(a>=0)bloodSpray(f,p[0],p[1],a,121+(front?0:5),front?14:10,1);}
}
ANIMS.soushuken={dur:3.4,hold:1.8,hitT:1.8,dmg:28,cost:15,noLift:true,
 sP:[[0,READY],[.4,READY],[.6,KT_W],[.75,SS_T],[.95,SS_G],[1.6,SS_G],[1.8,SS_P],[2.2,SS_P],[2.7,READY],[3.4,READY]],
 nP:[[0,N_READY],[.9,N_READY],[1.1,N_GUARD],[1.7,N_GUARD],[1.8,N_HITB],[2.0,N_HITB],[2.4,N_STAG],[3.0,N_READY],[3.4,N_READY]],
 nX:[[0,288],[1.75,288],[1.85,280],[2.1,276],[2.8,288],[3.4,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.35,cx:150,cy:126}],[1.1,{z:1.25,cx:220,cy:124}],[1.5,{z:1.35,cx:268,cy:122}],[1.85,{z:1.6,cx:282,cy:130}],[2.6,{z:1.3,cx:250,cy:126}],[3.2,{z:1.04,cx:192,cy:116}],[3.4,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={},a1=t-1.8,a2=t-1.95;if(a1>0&&a1<.4)E.shk=3*(1-a1/.4);if(a2>0&&a2<.3)E.shk=Math.max(E.shk||0,2*(1-a2/.3));if(a1>=0&&a1<.03)E.flash=.2;return E;},
 fx:c=>soushukenFX(c)};
/* ---- fatality do Soushuken: fios enrolam o Naruto e o fatiam em cinco pedacos ---- */
const SSF_Y=[-54,-41,-28,-14],SSF_CUT=2.34;
const SSF_P=[{top:-200,bot:-54},{top:-54,bot:-41},{top:-41,bot:-28},{top:-28,bot:-14},{top:-14,bot:60}];
function ssfState(i,tt){const k=Math.max(0,tt-SSF_CUT),dl=[.12,.04,.18,.3,0][i],fl=Math.max(0,k-dl),g=Math.min([52,39,26,12,0][i],.5*210*fl*fl),sl=scaleAt(0,1,0,1.3,k),dx=[-4,7,-8,9,2][i]*sl*1.6,rr=[.95,-.55,.7,-.4,.55][i]*scaleAt(0,1,.1,1.5,k)*(i===4?scaleAt(0,1,.5,1.4,k):1);return{dx,dy:g,r:rr};}
function ssfDrawN(c){
 const {g,A,t,time,nx0,ny0,nP,nOpt}=c,tt=A?t:99,x=nx0,y=GY+ny0;
 if(tt<SSF_CUT){blit(x,y,true,NARUTO,nP,time,nOpt);return;}
 const o2=Object.assign({},nOpt,{noRefl:true});
 SSF_P.forEach((pc,i)=>{const s=ssfState(i,tt),top=GY+pc.top,bot=GY+pc.bot,cy=(Math.max(top,GY-80)+Math.min(bot,GY))/2;
  g.save();g.translate(nx0+s.dx,cy+s.dy);g.rotate(s.r);g.translate(-nx0,-cy);
  g.beginPath();g.rect(nx0-40,top,80,bot-top);g.clip();blit(x,y,true,NARUTO,nP,time,o2);
  g.fillStyle='rgba(122,8,16,.95)';if(i>0)g.fillRect(nx0-8,top,16,2.4);if(i<4)g.fillRect(nx0-8,bot-2.4,16,2.4);
  g.restore();});
}
function ssfFX(c){
 const {f,A,t,time,nx0}=c,tt=A?t:99,L=ANIMS.soushuken.L,ry=SSF_Y.map(v=>GY+v);
 if(A&&tt<SSF_CUT+.02){
  const tc=Math.min(tt,2.4),hF=handPt(L.sP,tc,true),hB=handPt(L.sP,tc,false),shrink=scaleAt(0,1,2.0,SSF_CUT,tt),rx=15*(1-shrink*.5);
  const ps=(j,u)=>{const th=Math.PI+4*Math.PI*u;return[nx0+rx*Math.cos(th),ry[j]+3.5*Math.sin(th)];};
  for(let j=0;j<4;j++){const s0=.8+j*.1,uu=clamp((tt-s0)/1.2,0,1),front=j%2===0,hand=front?hF:hB;let cur;
   if(tt<s0){const k=clamp((tt-(s0-.3))/.3,0,1);if(tt<s0-.3)continue;cur=bz2(hand,[(hand[0]+nx0)/2,ry[j]-30],ps(j,0),k);}
   else{cur=ps(j,uu);f.strokeStyle='rgba(205,225,255,.7)';f.lineWidth=.35;f.lineCap='round';f.beginPath();for(let u=0;u<=uu;u+=.02){const q=ps(j,u);u?f.lineTo(q[0],q[1]):f.moveTo(q[0],q[1]);}f.lineTo(cur[0],cur[1]);f.stroke();}
   wire(f,hand,cur,.85,3*Math.sin(time*7+j));
   const lead=ps(j,Math.min(1,uu+.01)),ang=Math.atan2(lead[1]-cur[1],lead[0]-cur[0]);
   if(j%2===0)drawShuriken(f,cur[0],cur[1],tt*30+j,.8,uu<1);else drawKunai(f,cur[0],cur[1],uu<1?ang:Math.PI,.9);}
  if(tt>2.0){const k=scaleAt(0,1,2.0,SSF_CUT,tt);f.globalCompositeOperation='lighter';for(let j=0;j<4;j++){orb(f,nx0,ry[j],10+8*k,[[0,`rgba(230,240,255,${.5*k})`],[1,'rgba(150,190,255,0)']]);}f.globalCompositeOperation='source-over';}
 }
 const a=tt-SSF_CUT;if(a<0)return;
 for(let j=0;j<4;j++){bloodSpray(f,nx0-8,ry[j],a*.9,131+j*2,A?18:0,-1);bloodSpray(f,nx0+8,ry[j],a*.9,132+j*2,A?12:0,1);}
 if(A&&a<.5){f.globalCompositeOperation='lighter';const k=a/.5;for(let j=0;j<4;j++){f.strokeStyle=`rgba(255,255,255,${1-k})`;f.lineWidth=2*(1-k)+.3;f.beginPath();f.moveTo(nx0-24,ry[j]);f.lineTo(nx0+24,ry[j]);f.stroke();}f.globalCompositeOperation='source-over';}
 f.lineCap='round';
 for(let j=0;j<4;j++){const s=ssfState(j,tt),ph=((time*.7+j*.23)%1);f.strokeStyle='rgba(125,8,16,.85)';f.lineWidth=.9;f.beginPath();f.moveTo(nx0-6+j*4+s.dx,ry[j]+s.dy+2);f.lineTo(nx0-6+j*4+s.dx,ry[j]+s.dy+2+ph*Math.max(3,(GY-ry[j]-s.dy)));f.stroke();}
 const pr=Math.min(24,(A?Math.max(0,a-.4):9)*8);if(pr>0){f.fillStyle='rgba(110,6,14,.6)';f.beginPath();f.ellipse(nx0+2,GY+2,pr,pr*.24,0,0,TAU);f.fill();}
}
const N_SSB=Object.assign({},N_BOUND2);
ANIMS.soushuken.L={g:true,dur:8.8,koAt:8.1,bannerAt:6.3,banner:['裂','FATALITY','Sōshūken','#9fc8ff'],latchT:SSF_CUT,
 map:[[0,0],[.8,.8],[2.2,1.9],[3.4,2.3],[3.7,2.34],[6.0,3.2],[7.5,4.0],[99,95.5]],
 sP:[[0,READY],[.4,READY],[.6,KT_W],[.75,SS_T],[.95,SS_G],[2.0,SS_G],[2.3,SS_P],[3.2,SS_P],[3.8,FLICK],[4.4,VICTORY],[99,VICTORY]],
 nP:[[0,N_READY],[.8,N_READY],[1.0,N_SURP],[1.3,N_BOUND],[2.1,N_BOUND2],[2.5,N_BOUND2],[99,N_BOUND2]],
 nX:[[0,288],[99,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.4,cx:150,cy:126}],[1.2,{z:1.7,cx:230,cy:124}],[1.9,{z:2.1,cx:270,cy:128}],[2.34,{z:2.5,cx:284,cy:124}],[2.9,{z:1.9,cx:286,cy:136}],[3.5,{z:1.7,cx:286,cy:138}],[4.0,{z:1.4,cx:250,cy:128}],[4.6,{z:1.04,cx:192,cy:116}]],
 drawN:c=>ssfDrawN(c),
 stat:{nx0:288,nP:N_BOUND2},
 env:fenv(3.7,6.0,7.2,8.1,8.8),
 lens:(g,c)=>lensGen(g,c,{streak:[3.7,GY-41],vig:[3.8,4.4,6.2,7.4],fade:[7.4,8.0],spl:[[3.75,.8,.3,52,1],[3.85,.2,.45,40,2],[4.3,.62,.8,36,3],[5.2,.4,.2,34,4]]}),
 fx:c=>ssfFX(c),fxStatic:c=>ssfFX(c)};
function sfxFatalSS(){
 const M=ANIMS.soushuken.L.map,rl=rawOfGen(M,3.0);
 [.75,.85].forEach(a=>nz(.2,'highpass',3000,8000,.25,a));
 tone('sine',2400,3400,1.6,.04,1.0);nz(2.0,'highpass',3500,9000,.07,.9);[1.2,1.8,2.4,3.0].forEach(a=>tone('sine',3000+a*100,2500,.4,.03,a));
 tone('sine',70,38,2.4,.3,2.2);nz(1.2,'bandpass',700,3200,.12,2.6);tone('sawtooth',500,1800,1.0,.03,3.0,15);
 nz(.3,'highpass',3500,9000,.55,3.7);nz(.5,'lowpass',1600,150,.9,3.72);tone('sine',120,32,.6,.85,3.72);[3.8,3.9,4.0,4.1].forEach(a=>nz(.07,'bandpass',1500,500,.4,a));
 [4.6,5.4,6.2,7.0].forEach((a,i)=>{tone('sine',62,38,.2,.45-i*.05,a);tone('sine',58,36,.2,.35-i*.05,a+.26);});
 tone('sine',85,30,.55,.65,rl);nz(.45,'lowpass',1600,150,.6,rl);[rl+.5,rl+1.0].forEach(a=>nz(.3,'lowpass',1500,200,.4,a));}
ANIMS.soushuken.L.sfxFn=sfxFatalSS;
/* ---- Shuriken Kage: a segunda shuriken vem escondida na sombra da primeira ---- */
const KG={t0:.82,t1:1.44,W1:[352,GY-8],reveal:1.12};
const kgFirst=(tt,H)=>lerp2(H,KG.W1,clamp((tt-KG.t0)/(KG.t1-KG.t0),0,1));
function kageFlight(c,L,fatal){
 const {f,A,t,time,nx0}=c,H=handPt(L.sP,KG.t0,true),hand=handPt(L.sP,Math.min(t,2),true);
 if(t<KG.t0)return;
 const p1=kgFirst(t,H),flight=t<KG.t1;
 if(flight){wire(f,hand,p1,.0,0);}
 /* sombra: silhueta escura exatamente atras da primeira ate o momento da revelacao */
 if(t<KG.reveal){f.save();f.globalAlpha=.8;f.translate(p1[0]-.9,p1[1]+.9);f.rotate(t*40);f.scale(2.3,2.3);f.beginPath();for(let i=0;i<4;i++){const a=i*Math.PI/2;f.lineTo(Math.cos(a)*5,Math.sin(a)*5);f.lineTo(Math.cos(a+Math.PI/4)*1.6,Math.sin(a+Math.PI/4)*1.6);}f.closePath();f.fillStyle='#05030c';f.fill();f.restore();}
 if(flight||t<KG.t1+.8){const pp=flight?p1:KG.W1;if(flight){f.globalCompositeOperation='lighter';for(let i=1;i<=10;i++){const q=kgFirst(t-i*.03,H);f.fillStyle=`rgba(200,220,255,${(1-i/11)*.55})`;f.beginPath();f.arc(q[0],q[1],2.4*(1-i/12),0,TAU);f.fill();}f.globalCompositeOperation='source-over';}
  drawShuriken(f,pp[0],pp[1],flight?t*38:.5,2.3,flight);}
 /* segunda shuriken escondida: sai da primeira e curva ate o alvo */
 const nPose=tt=>{const P=evalPose(L.nP,tt),rg=rigW(P),nx=interp(L.nX,tt),ny=interp(L.nYk,tt);return{rg,nx,ny};};
 const tgtAt=tt=>{const q=nPose(tt);return fatal?[q.nx-q.rg.S[0]-.4,GY+q.ny+q.rg.S[1]-3.8]:[q.nx-3,GY+q.ny-44];};
 const hitT=1.5;
 if(t>=KG.reveal){const k=clamp((t-KG.reveal)/(hitT-KG.reveal),0,1),s0=kgFirst(KG.reveal,H),tg=tgtAt(hitT),ctrl=[(s0[0]+tg[0])/2+10,Math.min(s0[1],tg[1])-24];
  let pos=bz2(s0,ctrl,tg,k);if(t>=hitT)pos=tgtAt(t);
  if(t<hitT){f.globalCompositeOperation='lighter';for(let i=1;i<=10;i++){const kk=clamp((t-i*.025-KG.reveal)/(hitT-KG.reveal),0,1),q=bz2(s0,ctrl,tg,kk);f.fillStyle=`rgba(150,130,230,${(1-i/11)*.5})`;f.beginPath();f.arc(q[0],q[1],2.6*(1-i/12),0,TAU);f.fill();}f.globalCompositeOperation='source-over';
   for(let i=0;i<6;i++){const r=R(900+i),ag=t*5+i;f.fillStyle=`rgba(10,6,24,${.5*(1-k)})`;f.beginPath();f.arc(s0[0]+(r()-.5)*12*k,s0[1]-k*20*r()+Math.sin(ag)*2,2+r()*2,0,TAU);f.fill();}}
  if(t<hitT||!fatal){if(t<2.6)drawShuriken(f,pos[0],pos[1],t<hitT?t*44:.9,2.3,t<hitT);}
  const a=t-hitT;if(a>=0&&a<.5){f.globalCompositeOperation='lighter';orb(f,tg[0],tg[1],20*(1-a/.6),[[0,'rgba(255,255,255,.75)'],[.4,'rgba(200,225,255,.35)'],[1,'rgba(120,160,255,0)']]);f.globalCompositeOperation='source-over';}
  if(a>=0)bloodSpray(f,tgtAt(t)[0],tgtAt(t)[1],a*(fatal?1.1:1),141,fatal?32:16,-1);
 }
 f.strokeStyle='rgba(15,10,30,.8)';f.lineWidth=.5;if(t>=KG.t1+.05){for(let i=0;i<6;i++){const an=i*1.0+.2,l=6+((i*37)%7);f.beginPath();f.moveTo(KG.W1[0]+4,KG.W1[1]);f.lineTo(KG.W1[0]+4+Math.cos(an+Math.PI/2)*l*.5,KG.W1[1]+Math.sin(an+Math.PI/2)*l);f.stroke();}}
}
ANIMS.kagesh={dur:3.4,hold:1.5,hitT:1.5,dmg:30,cost:12,noLift:true,
 nYk:[[0,0],[1.05,0],[1.3,-30],[1.5,-26],[2.0,0],[99,0]],
 sP:[[0,READY],[.4,READY],[.6,KT_W],[.82,KT_T],[1.0,KT_T],[1.5,KT_F],[2.1,READY],[3.4,READY]],
 nP:[[0,N_READY],[.9,N_READY],[1.0,N_GUARD],[1.12,N_JUMP],[1.45,N_JUMP],[1.5,N_HIT],[1.75,N_STAG],[2.3,N_STAG],[2.9,N_READY],[3.4,N_READY]],
 nX:[[0,288],[1.5,288],[1.6,297],[2.2,293],[2.9,288],[3.4,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.35,cx:130,cy:126}],[1.05,{z:1.3,cx:215,cy:124}],[1.4,{z:1.55,cx:272,cy:118}],[1.8,{z:1.5,cx:272,cy:130}],[2.5,{z:1.25,cx:240,cy:126}],[3.0,{z:1.04,cx:192,cy:116}],[3.4,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={},a=t-1.5;if(a>0&&a<.5)E.shk=4*(1-a/.5);if(a>=0&&a<.03)E.flash=.2;return E;},
 fx:c=>{c.f.save();kageFlight(c,ANIMS.kagesh,false);c.f.restore();}};
ANIMS.kagesh.nYf=t=>interp(ANIMS.kagesh.nYk,t);
/* ---- fatality do Shuriken Kage: a shuriken escondida atravessa a garganta e pregra o Naruto na parede ---- */
function kageFatalFX(c){
 const {f,A,t,time,nx0,ny0,nP}=c,tt=A?t:99,L=ANIMS.kagesh.L;
 if(A)kageFlight(c,L,true);else {drawShuriken(f,KG.W1[0],KG.W1[1],.5,2.3,false);}
 if(tt<1.5&&A)return;
 const rg=rigW(nP),neck=[nx0-rg.S[0]-.4,GY+ny0+rg.S[1]-3.8],a=tt-1.5;
 if(tt>=1.52||!A){drawShuriken(f,neck[0]+2,neck[1],.6,2.5,false);}
 if(A&&tt>=1.5&&tt<1.85){impactFX(f,neck[0],neck[1],a,5,true);}
 f.lineCap='round';
 for(let i=0;i<4;i++){const ph=((time*.55+i*.27)%1),x0=neck[0]+(i-1.5)*1.3;f.strokeStyle='rgba(135,8,16,.9)';f.lineWidth=.8+.3*(i%2);f.beginPath();f.moveTo(x0,neck[1]+2);f.lineTo(x0+Math.sin(time*2+i)*.5,neck[1]+2+ph*Math.max(8,GY-neck[1]-6));f.stroke();}
 f.strokeStyle='rgba(120,6,14,.85)';f.lineWidth=1.8;const sl=A?clamp((tt-1.7)/1.8,0,1):1;f.beginPath();f.moveTo(WALLX+1,neck[1]+3);f.lineTo(WALLX+1,neck[1]+3+(GY-neck[1]-3)*sl);f.stroke();
 const pr=Math.min(13,(A?Math.max(0,tt-1.9):9)*5);if(pr>0){f.fillStyle='rgba(110,6,14,.55)';f.beginPath();f.ellipse(nx0,GY+2,pr,pr*.24,0,0,TAU);f.fill();}
}
ANIMS.kagesh.L={g:true,dur:9.0,koAt:8.4,bannerAt:6.7,banner:['影','FATALITY','Shuriken Kage','#8a7ad0'],latchT:1.52,
 nYk:[[0,0],[1.05,0],[1.3,-30],[1.5,-26],[1.85,-12],[99,-12]],
 map:[[0,0],[.9,.9],[1.9,1.3],[2.9,1.47],[3.1,1.5],[3.3,1.52],[6.5,2.6],[8.0,3.5],[99,94.5]],
 sP:[[0,READY],[.4,READY],[.6,KT_W],[.82,KT_T],[1.0,KT_T],[1.6,KT_F],[2.2,FLICK],[3.0,VICTORY],[99,VICTORY]],
 nP:[[0,N_READY],[.9,N_READY],[1.0,N_GUARD],[1.12,N_JUMP],[1.45,N_JUMP],[1.52,N_PIN],[99,N_PIN]],
 nX:[[0,288],[1.5,288],[1.55,292],[1.85,346],[99,346]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.35,cx:130,cy:126}],[1.0,{z:1.5,cx:200,cy:122}],[1.3,{z:2.1,cx:262,cy:112}],[1.5,{z:2.6,cx:300,cy:108}],[1.85,{z:2.5,cx:332,cy:112}],[2.4,{z:2.2,cx:336,cy:118}],[3.2,{z:1.7,cx:320,cy:126}],[3.9,{z:1.3,cx:260,cy:124}],[4.4,{z:1.04,cx:192,cy:116}]],
 nY:t=>interp(ANIMS.kagesh.L.nYk,t),
 stat:{nx0:346,nP:N_PIN},
 env:fenv(3.1,6.4,7.4,8.4,9.0),
 lens:(g,c)=>lensGen(g,c,{streak:[3.1,GY-60],vig:[3.2,3.8,6.6,7.6],fade:[7.8,8.4],spl:[[3.15,.8,.28,52,1],[3.3,.2,.45,40,2],[3.8,.62,.78,36,3],[5.2,.35,.2,32,4]]}),
 fx:c=>kageFatalFX(c),fxStatic:c=>kageFatalFX(c)};
function sfxFatalKage(){
 const M=ANIMS.kagesh.L.map,rh=rawOfGen(M,1.5),rf=rawOfGen(M,3.0);
 nz(.2,'highpass',3000,8000,.3,.85);tone('sine',70,38,2.2,.3,.85);nz(2.2,'highpass',2500,8000,.1,.9);tone('sine',1200,700,2.2,.05,1.0);
 tone('sine',220,80,.8,.35,2.6);nz(1.2,'lowpass',800,200,.3,2.4);
 nz(.3,'highpass',3500,9000,.55,rh);nz(.4,'lowpass',1600,150,.9,rh+.02);tone('sine',130,32,.55,.85,rh+.02);nz(.2,'bandpass',2000,800,.5,rh+.08);
 [rh+.5,rh+.9,rh+1.4].forEach(a=>nz(.3,'lowpass',900,200,.3,a));
 [4.6,5.4,6.2,7.0].forEach((a,i)=>{tone('sine',62,38,.2,.45-i*.05,a);tone('sine',58,36,.2,.35-i*.05,a+.26);});
 tone('sine',85,30,.55,.65,rf+3.6);nz(.45,'lowpass',1600,150,.6,rf+3.6);}
ANIMS.kagesh.L.sfxFn=sfxFatalKage;
