/* ---------- render ---------- */
function scaleAt(a,b,t0,t1,t){return t<=t0?a:t>=t1?b:a+(b-a)*(t-t0)/(t1-t0)}
const mirc=document.createElement('canvas');mirc.width=PW;mirc.height=PH;const mirx=mirc.getContext('2d');
function render(ts){
 let raw=-1,type=null;
 if(frozen){raw=frozen.t;type=frozen.type;}
 else if(anim){raw=(ts-anim.t0)/1000;type=anim.type;if(raw>anim.dur){{const was=anim;anim=null;raw=-1;type=null;afterAnim(was);}}}
 const t=type?warp(type,raw):-1;
 const time=window.__T!=null?window.__T:(frozen?frozen.t+3:ts/1000),fr=Math.floor(time*30);
 const A=type?ANIMS[type]:null;
 if((seal2T>0)!==lastP2){lastP2=seal2T>0;portrait('ptS',lastP2?lvDef(1):SASUKE,mk({red:1,expr:1,hr:.05}));}
 if(burning&&!outcome&&!anim&&!frozen&&ts-lastBurn>1600){lastBurn=ts;if(bunta){bunta.hp=Math.max(0,bunta.hp-1);if(bunta.hp<=0)buntaDie();}else hp.n=Math.max(0,hp.n-1);setBars();if(hp.n<=0){outcome='S';outcomeT=performance.now()/1000;showKO('S');setCommands(false);}}
 let shk=0,flashA=0,dim=0,bars=0,tint=null;
 if(type==='chidori'&&LC(type)){ /* fatality: tela treme, flashes, escurece e fica avermelhada na camera lenta (tempos em raw = segundos reais) */
  const a=raw-2.58;
  if(a>0&&a<1.8)shk=10*Math.pow(1-a/1.8,1.4)*(a<.42?1.3:1);
  if(a>=0&&a<.04)flashA=.95;else if(a>=.04&&a<.14)flashA=.55;else if(a>=.14&&a<.3)flashA=.2;
  if(raw>5.24&&raw<5.9)shk=Math.max(shk,9*(1-(raw-5.24)/.66));
  if(raw>5.25&&raw<5.33)flashA=Math.max(flashA,.55);
  if(raw>8.5&&raw<8.58)flashA=Math.max(flashA,.2);
  dim=.5*scaleAt(0,1,.4,.85,t)*(1-.4*scaleAt(0,1,7.4,8.4,raw)-.6*scaleAt(0,1,9.9,10.6,raw));bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,9.9,10.6,raw));
  const tb=scaleAt(0,1,.8,1.4,t)*(1-scaleAt(0,1,2.6,3.2,raw)),tr=scaleAt(0,1,2.6,3.3,raw)*(1-scaleAt(0,1,6.3,7.3,raw));
  if(tr>0)tint=`rgba(125,6,18,${.26*tr})`;else if(tb>0)tint=`rgba(20,40,160,${.2*tb})`;}
 else if(type==='chidori'){const a=t-2.58;if(a>0&&a<.8)shk=6*(1-a/.8);
  if(a>=0&&a<.02)flashA=.7;else if(a>=.02&&a<.1)flashA=.3;else if(a>=.1&&a<.2)flashA=.12;
  dim=.5*scaleAt(0,1,.4,.85,t)*(1-scaleAt(0,1,3.1,3.7,t));bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,3.2,3.7,t));
  const ti=scaleAt(0,1,.8,1.4,t)*(1-scaleAt(0,1,2.9,3.6,t));if(ti>0)tint=`rgba(20,40,160,${.2*ti})`;}
 else if(LKM(type)){const d=t-KMF_DROP;if(t>KMF_UP&&t<KMF_DROP)shk=2;if(d>0&&d<1)shk=10*(1-d);if(d>=0&&d<.05)flashA=.7;dim=.35*scaleAt(0,1,2.2,2.7,t)*(1-scaleAt(0,1,5.4,6.0,t));bars=14*scaleAt(0,1,2.4,2.8,t)*(1-scaleAt(0,1,7.4,8.0,t));}
 else if(LU(type)){const a=t-UZ_SLAM;if(a>0&&a<1.2)shk=10*Math.pow(1-a/1.2,1.3);if(a>=0&&a<.05)flashA=.8;else if(a>=.05&&a<.15)flashA=.3;
  dim=.35*scaleAt(0,1,2.2,2.7,t)*(1-scaleAt(0,1,4.6,5.4,t));bars=14*scaleAt(0,1,2.4,2.8,t)*(1-scaleAt(0,1,6.4,7.0,t));}
 else if(type==='kyuubi'){const a=t-KY_ON;if(t>.5&&t<KY_ON)shk=1.5;if(a>0&&a<.7)shk=8*(1-a/.7);if(a>=0&&a<.05)flashA=.5;dim=.4*scaleAt(0,1,.3,.6,t)*(1-scaleAt(0,1,2.4,3.0,t));tint=t>.5&&t<2.8?`rgba(160,10,0,${.22*scaleAt(0,1,.5,1.1,t)*(1-scaleAt(0,1,2.2,2.8,t))})`:null;}
 else if(type==='teppodama'){const a=t-TP_HIT;if(a>0&&a<.6)shk=6*(1-a/.6);if(a>=0&&a<.04)flashA=.3;const f0=t-TP_FIRE;if(f0>0&&f0<.3)shk=Math.max(shk,4*(1-f0/.3));
  if(LTP(type)){const l=t-TPF_LAND;if(l>0&&l<1.2)shk=Math.max(shk,12*Math.pow(1-l/1.2,1.3));if(l>=0&&l<.05)flashA=.6;dim=.35*scaleAt(0,1,2.0,2.4,t)*(1-scaleAt(0,1,5.6,6.2,t));bars=14*scaleAt(0,1,2.1,2.4,t)*(1-scaleAt(0,1,7.2,7.8,t));}}
 else if(type==='kuchiyose'){const a=t-KU_HIT,b=t-KU_IN;if(b>0&&b<.5)shk=6*(1-b/.5);if(a>0&&a<.7)shk=Math.max(shk,7*(1-a/.7));if(a>=0&&a<.04)flashA=.35;dim=.3*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,4.4,5.0,t));}
 else if(type==='rasengan'||type==='bunshin'||type==='uzumaki'||type==='kamikaze'){const a=t-A.hitT;if(a>0&&a<.9)shk=6*(1-a/.9);if(a>=0&&a<.03)flashA=.45;else if(a>=.03&&a<.1)flashA=.18;for(const h of A.hits)if(t>h.t&&t<h.t+.22)shk=Math.max(shk,2.5);dim=.35*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,A.dur-1.4,A.dur-.8,t));bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,A.dur-1.0,A.dur-.5,t));}
 else if(type==='amaterasu'&&LA(type)){const a=raw-2.0;
  if(a>0&&a<1.4)shk=5*Math.pow(1-a/1.4,1.4);
  if(a>=0&&a<.05)flashA=.6;
  if(raw>7.9&&raw<8.0)flashA=Math.max(flashA,.22);
  dim=.5*scaleAt(0,1,.4,.9,t)*(1-.3*scaleAt(0,1,8.0,9.4,raw)-.7*scaleAt(0,1,10.0,10.8,raw));bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,10.0,10.8,raw));
  const ti=scaleAt(0,1,.9,1.5,t)*(1-scaleAt(0,1,9.6,10.6,raw));if(ti>0)tint='rgba(70,0,22,'+(.34*ti)+')';}
 else if(type==='amaterasu'){dim=.5*scaleAt(0,1,.4,.9,t)*(1-scaleAt(0,1,3.6,4.3,t));bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,4.0,4.5,t));const ti=scaleAt(0,1,.9,1.5,t)*(1-scaleAt(0,1,3.6,4.4,t));if(ti>0)tint='rgba(70,0,22,'+(.3*ti)+')';const a=t-2.0;if(a>0&&a<.9)shk=3*(1-a/.9);if(a>=0&&a<.05)flashA=.5;if(t>1.15&&t<1.35)flashA=.6*(1-Math.abs((t-1.25)/.1));}
 else if(A&&(LG(type)?A.L.env:A.env)){const E=(LG(type)?A.L.env:A.env)(raw,t);shk=E.shk||0;flashA=E.flash||0;dim=E.dim||0;bars=E.bars||0;tint=E.tint||null;}
 else if(type==='kawarimi'&&LW(type)){const a=raw-2.66;
  if(a>0&&a<1.7)shk=10*Math.pow(1-a/1.7,1.4)*(a<.4?1.3:1);
  if(a>=0&&a<.04)flashA=.95;else if(a>=.04&&a<.14)flashA=.5;else if(a>=.14&&a<.3)flashA=.18;
  dim=.45*scaleAt(0,1,.4,.85,t)*(1-.4*scaleAt(0,1,7.2,8.4,raw)-.6*scaleAt(0,1,9.0,9.8,raw));bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,9.0,9.8,raw));
  const tr=scaleAt(0,1,2.7,3.3,raw)*(1-scaleAt(0,1,7.4,8.8,raw));if(tr>0)tint=`rgba(125,6,18,${.22*tr})`;}
 else if(type==='katon'&&LK(type)){const a=raw-2.4;
  if(a>0&&a<1.7)shk=11*Math.pow(1-a/1.7,1.4)*(a<.4?1.3:1);
  if(raw>2.7&&raw<6.6)shk=Math.max(shk,1.1);
  if(a>=0&&a<.04)flashA=.95;else if(a>=.04&&a<.14)flashA=.5;else if(a>=.14&&a<.3)flashA=.18;
  dim=.45*scaleAt(0,1,.4,.85,t)*(1-.35*scaleAt(0,1,7.0,8.2,raw)-.65*scaleAt(0,1,9.0,9.6,raw));bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,9.0,9.6,raw));
  const ti=scaleAt(0,1,2.4,3.0,raw)*(1-scaleAt(0,1,6.5,8.0,raw)),tp=scaleAt(0,1,1.2,1.9,t)*(1-scaleAt(0,1,2.4,3.0,raw));if(ti>0)tint=`rgba(190,60,10,${.26*ti})`;else if(tp>0)tint=`rgba(140,40,10,${.22*tp})`;}
 else if(LR(type)){const L=ANIMS.rasengan.LR,a=t-2.2,b=t-L.burst;if(rasKyu){if(b>0&&b<1.2)shk=Math.max(shk,14*(1-b/1.2));tint=t>2.2&&t<5.4?`rgba(150,10,0,${.25*scaleAt(0,1,2.2,2.6,t)*(1-scaleAt(0,1,4.8,5.4,t))})`:null;}if(a>0&&a<.5)shk=6*(1-a/.5);if(t>2.3&&t<L.burst)shk=Math.max(shk,1.6);if(b>0&&b<.8)shk=Math.max(shk,9*(1-b/.8));
  if(a>=0&&a<.04)flashA=.5;if(b>=0&&b<.04)flashA=.9;else if(b>=.04&&b<.14)flashA=.4;
  dim=.4*scaleAt(0,1,1.6,2.2,t)*(1-scaleAt(0,1,4.6,5.6,t));bars=14*scaleAt(0,1,2.0,2.3,t)*(1-scaleAt(0,1,6.0,6.8,t));}
 else if(type==='katon'){const a=t-2.4;if(a>0&&a<1)shk=7*(1-a/1);
  if(a>=0&&a<.04)flashA=.9;else if(a>=.04&&a<.14)flashA=.4;
  dim=.45*scaleAt(0,1,.4,.85,t)*(1-scaleAt(0,1,2.9,3.5,t));bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,3.0,3.6,t));
  const ti=scaleAt(0,1,1.2,1.9,t)*(1-scaleAt(0,1,2.9,3.6,t));if(ti>0)tint=`rgba(140,40,10,${.22*ti})`;}
 const rn=R(fr*7+3);const idleCam=A?0:1;const sx=(shk?(rn()-.5)*2*shk*K:0)+idleCam*Math.sin(time*.45)*5,sy=(shk?(rn()-.5)*2*shk*K:0)+idleCam*Math.sin(time*.6+1)*2.5;
 // camera
 let cam=A?interp(LE(type)?A.LR.cam:(LC(type)||LK(type)||LW(type)||LA(type)||LG(type))?A.L.cam:A.cam,t):{z:1.04,cx:192,cy:116};
 if(window.__CAM)cam=window.__CAM;let z=cam.z,ccx=cam.cx,ccy=cam.cy;
 {const q=Math.round(clamp(z*1.3,1.6,3.4)*5)/5;SR=K*q;spW=Math.round(SW*SR);spH=Math.round(SH*SR);}
 if(type==='chidori'&&t>2.15&&t<2.56){const k=scaleAt(0,1,2.15,2.3,t);ccx=ccx*(1-k)+(sasX(type,t)+34)*k*(t<2.5?1:0)+ccx*k*(t<2.5?0:1);}
 const hw2=W/(2*z),hh2=H/(2*z);ccx=clamp(ccx,hw2,W-hw2);ccy=clamp(ccy,hh2,H-hh2);
 g.setTransform(1,0,0,1,0,0);g.fillStyle='#000';g.fillRect(0,0,PW,PH);
 setCam(g,z,sx,sy,ccx,ccy);g.globalAlpha=1;g.globalCompositeOperation='source-over';
 drawEnv(g,time,tint);
 const bob=Math.sin(time*3)*.7;
 let sP,nP,sx0=96,sy0=0,nx0=288;
 const lethal=!!(anim&&anim.lethal)||LC(type)||LK(type)||LW(type)||LA(type)||LG(type)||LE(type);if(lethal)(A.enemy?buildLethalE(A):buildLethal(A));
 if(A){sP=evalPose(lethal?A.sPL:A.sP,t);nP=evalPose(lethal?A.nPL:A.nP,t);nx0=interp(lethal?A.nXL:A.nX,t);sx0=sasX(type,t);sy0=sasY(type,t);if(lethal&&A.enemy&&A.sXL)sx0=interp(A.sXL,t);}
 else if(outcome==='N'){sP=Object.assign({},S_DOWN);nP=Object.assign({},N_VICT);sx0=tpKill?74:90;nx0=288;}
 else if(outcome){sP=Object.assign({},VICTORY);nP=Object.assign({},N_DOWN);nx0=300;if(chestHole){nP.turn=.35;nP.torn=1;}if(decap){nx0=112;sx0=152;nP.nohead=1;}if(ashed){sP=Object.assign({},AMA_CL2);}if(fatalKind){const S2=ANIMS[fatalKind].L.stat;if(S2){if(S2.nx0!=null)nx0=S2.nx0;if(S2.sx0!=null)sx0=S2.sx0;if(S2.nP)nP=Object.assign({},S2.nP);if(S2.sP)sP=Object.assign({},S2.sP);}}}
 else if(burning){sP=Object.assign({},READY);nP=Object.assign({},interp([[0,N_STAG],[1,N_BURN1],[2,N_STAG],[3,N_BURN2],[4,N_STAG]],(time*.9)%4));}
 else{sP=Object.assign({},READY);nP=Object.assign({},N_READY);}
 sP=Object.assign({},sP);nP=Object.assign({},nP);
 if(!A||t<.4||t>3.8){ /* respiracao irregular e diferente em cada um: Sasuke calmo, Naruto inquieto */
  const bs=Math.sin(time*2.3),bn=Math.sin(time*3.1+1);
  sP.crouch+=bs*.45+Math.sin(time*.85+1.3)*.25;sP.lean+=bs*.15;sP.hyF-=bs*.25;sP.hyB-=bs*.25;
  nP.crouch+=bn*.6+Math.sin(time*1.25+.4)*.3;nP.lean+=bn*.2;nP.hyF-=bn*.3;nP.hyB-=bn*.3;}
 const onToad=!!bunta&&type!=='kuchiyose'&&type!=='teppodama'; /* com o sapo em campo o Naruto fica na cabeca dele e o sapo e o alvo */ /* com o sapo em campo, o Naruto fica em cima da cabeca dele (menos nos proprios jutsus) */
 let ny0=0,sRot=0;if(A){ny0=nY(type,t);sRot=sRotF(type,t);}
 if(type==='teppodama')nx0+=tpRec(t).x;
 if(onToad){if(A&&!A.enemy){nx0=KU_BX-44;ny0=0;}else{nx0=KU_NX;ny0=KU_NY;}nP=Object.assign({},(A&&A.enemy&&(type==='nkunai'||type==='nshuriken'))?evalPose(A.nP,t):N_READY);nP.crouch+=Math.sin(time*3.1)*.4;}
 if(LKM(type)&&t>=KMF_UP){sy0=kmFatY(t);sRot=t<KMF_DROP?(t-KMF_UP)*TAU*3.2:0;}
 if(type==='harem'&&anim&&anim.oirHit){const hf=HAR_FLY(t);if(hf){sx0=hf.x;sy0=hf.y;sRot=hf.rot;sP=Object.assign({},S_HIT);}}if(LR(type)){sRot=0;sy0=0;}if(LU(type)&&t>=UZ_SLAM-.06){sRot=0;sy0=2*clamp((t-UZ_SLAM)/.1,0,1);}
 else if(fatalKind&&outcome==='S'&&ANIMS[fatalKind].L.nY)ny0=ANIMS[fatalKind].L.nY(99); /* corpo deitado depois do fatality: mesma altura do fim da animacao, senao fica no ar */
 if(LC(type)&&t>2.62&&t<3.7)ny0=-3*scaleAt(0,1,2.62,2.8,t)*(1-scaleAt(0,1,3.56,3.7,t)); /* o braco do Sasuke levanta o Naruto do chao */
 if(LC(type)&&t>=3.58)chestHole=1;
 if(type==='selochidori'&&LG(type)&&t>=4.2)chestHole=1;
 if(LK(type)&&t>=5.2)burnt=1;
 if(LW(type)&&t>=2.68)decap=1;
 if(LA(type)&&t>=5.8)ashed=1;
 if(LG(type)&&t>=ANIMS[type].L.latchT)fatalKind=type;
 const idleMv=!A||t<.42||t>4.1;
 const vS=A?(sasX(type,t+.02)-sasX(type,t-.02))/.04:0,vN=A?(interp(lethal?A.nXL:A.nX,t+.02)-interp(lethal?A.nXL:A.nX,t-.02))/.04:0;
 sP=gait(sP,sx0,(LC(type)&&t>6.7)?-1:1,vS,sy0<-1?0:1,time,idleMv,0,GSTATE[0]);nP=gait(nP,nx0,-1,vN,ny0<-1?0:1,time,idleMv,1.7,GSTATE[1]);
 {const DG=anim&&anim.dodge;if(DG&&t>=DG.t1){if(DG.who==='S'){sP=Object.assign({},READY);sx0=96;sy0=0;sRot=0;}else{nP=Object.assign({},N_READY);nx0=288;ny0=0;}}} /* depois da esquiva quem apanharia volta ileso para a posicao inicial */
 if((sealT>0||seal2T>0)&&sP.red<1)sP.red=1; /* com o selo ativo o Sharingan fica sempre ligado */
 if(!A&&!outcome){const sw1=Math.sin(time*1.8),sw2=Math.cos(time*2.1);sP.hxF+=sw1*.7;sP.hyF+=sw2*.6;sP.hxB+=sw2*.5;sP.hyB+=sw1*.5;
  nP.hxF+=sw2*.7;nP.hyF+=sw1*.6;nP.hxB+=sw1*.5;nP.hyB+=sw2*.5;
  const ph=time%8,gA=ph>2.6&&ph<4.4?Math.sin((ph-2.6)/1.8*Math.PI):0,gB=ph>5.6&&ph<7.0?Math.sin((ph-5.6)/1.4*Math.PI):0,sm=v=>Math.min(1,v*2.2);
  if(gA>0){const w=sm(gA);nP.hxF+=(12-nP.hxF)*w;nP.hyF+=(-5+Math.sin(time*15)*1.6-nP.hyF)*w;if(w>.5)nP.hF=1;if(w>.4)nP.expr=6;nP.hr+=.1*w;nP.tilt+=.05*w;nP.crouch+=1*w;}
  if(gB>0){const w=sm(gB);nP.hxF+=(8-nP.hxF)*w;nP.hyF+=(-10-nP.hyF)*w;nP.hxB+=(9-nP.hxB)*w;nP.hyB+=(-8-nP.hyB)*w;nP.hF=0;nP.hB=0;if(w>.4)nP.expr=2;nP.crouch-=1.5*w;nP.tilt-=.04*w;}
  {const p1=(time+1)%9,fA=p1<1.6?Math.sin(p1/1.6*Math.PI):0,p2=(time+5)%9,fB=p2<1.8?Math.sin(p2/1.8*Math.PI):0;
   if(fA>0){const w=Math.min(1,fA*2.2);if(w>.25)sP.red=1;sP.expr=1;sP.hr+=.07*w;sP.tilt+=.04*w;}
   if(fB>0){const w=Math.min(1,fB*2.2);sP.hxF+=(10-sP.hxF)*w;sP.hyF+=(-4-sP.hyF)*w;sP.hF=0;sP.hxB+=(5-sP.hxB)*w*.6;sP.tilt+=.05*w;sP.crouch+=.8*w;sP.expr=1;}}
 }
 if(type==='selochidori'&&LG(type)&&t>3.3&&t<4.1){const w=Math.min(1,(t-3.3)/.15)*(1-scaleAt(0,1,3.9,4.1,t));nx0+=Math.sin(time*55)*.9*w;nP.hr+=Math.sin(time*47)*.12*w;nP.hxF+=Math.sin(time*39)*1.6*w;nP.hyF+=Math.cos(time*33)*1.6*w;nP.hxB+=Math.cos(time*41)*1.6*w;nP.crouch+=Math.sin(time*50)*.5*w;}
 if(LC(type)&&t>2.6&&t<3.6){ /* Naruto convulsiona empalado */
  const w=Math.min(1,(t-2.6)/.15)*(1-scaleAt(0,1,3.3,3.6,t));
  nx0+=Math.sin(time*55)*.9*w;nP.hr+=Math.sin(time*47)*.12*w;nP.hxF+=Math.sin(time*39)*1.6*w;nP.hyF+=Math.cos(time*33)*1.6*w;nP.hxB+=Math.cos(time*41)*1.6*w;nP.crouch+=Math.sin(time*50)*.5*w;}
 if(LA(type)&&t>2.3&&t<4.5){const w=scaleAt(0,1,2.3,2.6,t)*(1-scaleAt(0,1,4.2,4.5,t));nx0+=Math.sin(time*34)*.9*w;nP.hxF+=Math.sin(time*31)*1.8*w;nP.hyF+=Math.cos(time*27)*2*w;nP.hxB+=Math.cos(time*29)*1.8*w;nP.hyB+=Math.sin(time*33)*2*w;}
 if(LK(type)&&t>2.5&&t<5.2){const w=scaleAt(0,1,2.5,2.8,t)*(1-scaleAt(0,1,4.9,5.2,t));nx0+=Math.sin(time*38)*1.1*w;nP.hxF+=Math.sin(time*27)*2.2*w;nP.hyF+=Math.cos(time*31)*2.5*w;nP.hxB+=Math.cos(time*29)*2.2*w;nP.hyB+=Math.sin(time*33)*2.5*w;nP.hr+=Math.sin(time*23)*.1*w;}
 hairStep(HAIR[0],sP,sx0,sy0,1,time);hairStep(HAIR[1],nP,nx0,ny0,-1,time);
 let power=0;
 if(type==='chidori'){if(t<1.35)power=0;else if(t<2.0)power=Math.pow((t-1.35)/.65,.8);else if(t<2.58)power=1+.15*scaleAt(0,1,2.0,2.55,t);else if(t<3.0)power=1.15;else if(t<3.25)power=1.15*(1-(t-3)/.25);
  if(LC(type)&&t>=2.58)power=t<3.6?1.15:0;}
 if(power>0&&t<2.15){sP.lean+=Math.sin(time*70)*.22*power;sP.crouch+=Math.sin(time*55)*.2*power;}
 bOff={x:0,y:0,sq:0,rot:0};if(type==='teppodama'){const rc=tpRec(t);bOff.x=rc.x;bOff.rot=rc.rot;if(LTP(type)){bOff.x+=tpJx(t);bOff.y=tpJy(t);bOff.sq=tpSq(t);}}
 if(LTP(type)&&t>=TPF_LAND-.05)drawCrater(g,sx0,clamp((t-TPF_LAND)/.15,0,1));else if(!A&&outcome==='N'&&tpKill)drawCrater(g,74,1);
 if(bunta&&type!=='kuchiyose'){let hit=0;if(A&&!A.enemy){const hh=t-A.hitT;hit=hh>=0&&hh<.4?1-hh/.4:0;}const tpO=type==='teppodama'?clamp(Math.min((t-(TP_FIRE-.5))/.35,(TP_FIRE+.3-t)/.25),0,1):0;drawBunta(g,time,1,type==='teppodama'&&t>TP_FIRE-.8&&t<TP_FIRE?(t-(TP_FIRE-.8))/.8:0,hit,tpO);}
 {const ag=time-buntaGone;if(buntaGone&&ag<.8){for(let i=0;i<7;i++)puff(g,KU_BX-60+i*20,GY-24-(i%3)*34,ag-i*.03,121+i);}}
 shadowRipple(g,sx0,time,power>0&&t<2.6);shadowRipple(g,nx0,time,false);drawSteps(g,time);
 if(LU(type)&&t>=UZ_SLAM)drawCrater(g,sx0,clamp((t-UZ_SLAM)/.12,0,1));else if(!A&&outcome==='N'&&uzKill)drawCrater(g,sx0,1);
 if(outcome==='N'&&WOUNDS.s.some(w=>w.k==='blood'||w.k==='puncture')){const kk=clamp((time-outcomeT)/5,0,1),rx=24*kk;g.fillStyle='rgba(110,8,16,.55)';g.beginPath();g.ellipse(sx0+2,GY+2,rx,rx*.24,0,0,TAU);g.fill();g.fillStyle='rgba(180,20,30,.25)';g.beginPath();g.ellipse(sx0+4,GY+1.5,rx*.7,rx*.16,0,0,TAU);g.fill();}
 if(outcome==='S'&&WOUNDS.n.some(w=>w.k==='blood'||w.k==='puncture')){const kk=clamp((time-outcomeT)/5,0,1),rx=24*kk;g.fillStyle='rgba(110,8,16,.55)';g.beginPath();g.ellipse(nx0-2,GY+2,rx,rx*.24,0,0,TAU);g.fill();g.fillStyle='rgba(180,20,30,.25)';g.beginPath();g.ellipse(nx0-4,GY+1.5,rx*.7,rx*.16,0,0,TAU);g.fill();}
 if(dim>0){g.fillStyle=`rgba(5,3,30,${dim})`;g.fillRect(-10,-10,W+20,H+20);}
 f.setTransform(1,0,0,1,0,0);f.clearRect(0,0,PW,PH);setCam(f,z,sx,sy,ccx,ccy);f.globalAlpha=1;f.globalCompositeOperation='source-over';
 if(power>0&&t<(LC(type)?3.65:3.2)){g.save();g.globalCompositeOperation='lighter';const a=Math.min(1,power)*.5;g.translate(sx0,GY+sy0-33);g.scale(1,2.2);orb(g,0,0,26,[[0,`rgba(80,150,255,${a*.7})`],[.6,`rgba(40,90,255,${a*.3})`],[1,'rgba(20,50,255,0)']]);g.restore();}
 const dashing=type==='chidori'&&t>2.15&&t<2.56;
 if(dashing||(type==='chidori'&&t>=2.56&&t<2.7)){for(let i=3;i>=1;i--){const tt=t-i*.035;if(tt<2.15)continue;const P2=evalPose(A.sP,tt),x2=sasX(type,tt);blit(x2,GY+sasY(type,tt),false,SASUKE,P2,time,{tint:[70,190,255],tk:.7,alpha:.3-i*.07,noRefl:true});}}
 let nOpt={};
 if(type==='chidori'&&t>2.58&&t<(LC(type)?3.5:3.0)&&((Math.floor((LC(type)?time*1.4:t)*30)%3)===0))nOpt={tint:[255,255,255],tk:.85};
 if(LK(type)&&t>2.4){const ch=scaleAt(0,1,2.7,5.4,t),c1=mix([255,120,30],[62,48,46],Math.min(1,ch*1.15));nOpt={tint:c1,tk:(.2+.07*Math.sin(time*40))*(1-ch)+.86*ch};}
 else if(type==='katon'&&t>2.4&&t<3.15)nOpt={tint:[255,120,30],tk:.3+.2*Math.sin(t*50)};
 else if(type==='katon'&&t>=3.15)nOpt={tint:[28,22,26],tk:lethal?.4:.4*(1-clamp((t-3.15)/1.4,0,1))};
 else if(LA(type)&&t>=2.0)nOpt={tint:[22,4,18],tk:.7};
 else if(type==='amaterasu'&&t>=2.0)nOpt={tint:t<3.9?[22,4,18]:[28,22,26],tk:t<3.9?.7:(lethal?.4:.4*(1-clamp((t-3.9)/1.2,0,1)))};
 else if(burning&&type!=='amaterasu')nOpt={tint:[22,4,18],tk:.3+.06*Math.sin(time*6)};
 else if(!A&&outcome==='S')nOpt=burnt?{tint:[62,48,46],tk:.8}:{tint:[28,22,26],tk:.38};
 if(A)nOpt.rot=nRotF(type,t);
 nOpt.bleed=Math.max(0,(100-hp.n)/100);if((type==='oiroke'||type==='harem')&&t>=OIR_ON&&t<OIR_OFF){nOpt.sexy=true;nOpt.bleed=0;}if((type==='kuchiyose'&&t>=1.5)||onToad||(bunta&&type==='teppodama')){nOpt.sc=KU_NS;nOpt.noRefl=true;nOpt.vel=0;nOpt.rot=0;nOpt.bleed=0;}if(type==='kamikaze'&&KM_SPIN(t)&&!(LKM(type)&&t>KMF_DROP))nOpt.flipN=Math.sin(time*44)>0;
 if(A&&A.tpN&&!lethal)nOpt.alpha=clamp(Math.abs(t-A.tpN[0])/.07,0,1); /* o Naruto tambem volta por teleporte */
 {const DG=anim&&anim.dodge;if(DG&&DG.who==='N'&&t>=DG.t0&&t<DG.t1)nOpt.alpha=0;} /* Kawarimi: some enquanto o tronco leva o golpe */
 if(A&&A.hitT!=null&&!LG(type)){const hh=t-A.hitT;if(hh>=0&&hh<.22)nOpt.sq=Math.pow(1-hh/.22,2)*(Math.min(1,(A.dmg||10)/25)*.6+.4);}
 if(chestHole)nOpt.hole=(A&&LC(type))?clamp((t-3.58)/.1,0,1):((A&&type==='selochidori'&&LG(type))?clamp((t-4.2)/.1,0,1)*1.8:(fatalKind==='selochidori'?1.8:1));
 if(type==='selochidori'&&LG(type)&&t>=3.2){const kk=scaleAt(0,1,3.25,3.5,t)*(1-scaleAt(0,1,4.1,4.4,t));nOpt=Object.assign({},nOpt,{tint:[50,20,90],tk:.35*kk});}
 if(fatalKind&&!A&&outcome==='S'&&ANIMS[fatalKind].L.nRot)nOpt.rot=ANIMS[fatalKind].L.nRot(99);
 if(LA(type)&&t>=4.3)nOpt.dissolve=scaleAt(0,1,4.4,5.8,t);
 if(LK(type)&&t>2.6)nOpt.cracks=scaleAt(0,1,2.7,5.4,t);else if(burnt&&(!A||type==='katon'))nOpt.cracks=1;
 const rS=rigW(sP);
 const hw=[sx0+rS.hf.hx,GY+sy0+rS.hf.hy];
 let ras=null;if(type==='rasengan'){const rNn=rigW(nP),rr=t<.75?0:t<1.55?clamp((t-.75)/.7,0,1)*9:t<2.2?9.5:(LR(type)&&t<2.9)?9.5+Math.sin(time*30)*.6:0; /* no fatality a esfera fica moendo no peito ate estourar pelas costas */if(rr>0){ras={x:nx0-rNn.hf.hx-5,y:GY+ny0+rNn.hf.hy-1,r:rr};
  /* com sprites, a esfera fica na mao desenhada do sprite (mao baixa ao carregar, punho esticado ao avancar) */
  if(kyuT>0&&SPRN.four){ras.x=nx0-31-rr*.5;ras.y=GY+ny0-12;} /* de quatro: a esfera vermelha gira na frente da mao, perto do chao */
  else if(USE_SPR&&SPRN.guard){const k=sprPick(nP,sprRefsN()),HO={charge:[20,33],punch:[31,45]}[k];if(HO){ras.x=nx0-HO[0]-rr*.6;ras.y=GY+ny0-HO[1];}}}}
 fxLights=[];
 if(ras)fxLights.push({x:ras.x,y:ras.y,col:[140,200,255],r:130,k:.9});
 if(type==='rasengan'){const a0=t-2.2;if(a0>=0&&a0<.7)fxLights.push({x:104,y:GY-38,col:[170,220,255],r:150,k:.9*(1-a0/.7)});}
 if(type==='chidori'){if(power>0&&t<(LC(type)?3.65:3.2))fxLights.push({x:hw[0],y:hw[1],col:[130,205,255],r:150,k:.95*Math.min(1,power)});
  const a0=t-2.58;if(a0>=0&&a0<.7)fxLights.push({x:nx0-6,y:GY-42,col:[190,230,255],r:170,k:.95*(1-a0/.7)});}
 if(LK(type)&&t>2.4){const ii=scaleAt(0,1,2.45,2.95,t)*(1-.6*scaleAt(0,1,5.2,6.4,t))*(.85+.15*Math.sin(time*30));fxLights.push({x:nx0,y:GY-30,col:[255,130,40],r:150,k:.9*ii});}
 if(burning&&!ashed&&type!=='amaterasu')fxLights.push({x:nx0,y:GY-30,col:[200,30,60],r:120,k:.45});
 if(type==='amaterasu'&&t>2.0){const ii=ameInt(t-2.0);if(ii>.03)fxLights.push({x:nx0,y:GY-30,col:[70,12,60],r:120,k:.4*ii});}
 if(type==='katon'){const mth=[sx0+rS.C[0]+2.2,GY+sy0+rS.C[1]+2.7],tx0=nx0-6,ty0=GY-42;
  if(t>=1.82&&t<2.4){const kk=(t-1.82)/.58,ee=kk*kk*.7+kk*.3;fxLights.push({x:mth[0]+(tx0-mth[0])*ee,y:mth[1]+(ty0-mth[1])*ee,col:[255,150,50],r:150,k:.85});}
  const a0=t-2.4;if(a0>=0&&a0<1.2)fxLights.push({x:tx0,y:ty0,col:[255,150,50],r:190,k:.9*(1-a0/1.2)});}
 {const DG=anim&&anim.dodge;if(DG&&t>=DG.t0&&t<DG.t1+.1){const bx=DG.who==='S'?96:288;drawLog(g,bx,t<DG.tb?1.62+((t*9)%1)*.12:t-DG.tb+1.62);puff(f,bx,GY-24,t-DG.t0,3);puff(f,bx,GY-24,t-DG.t1,4);}} /* o tronco no lugar de quem esquivou: em pe ate o golpe, depois se parte */
 if(type==='kawarimi')drawLog(g,96,t); /* anim antiga do Kawarimi como golpe: fora do menu */
 const ctx={hw,f,g,A,type,t,raw,time,fr,nx0,ny0,sx0,sy0,nP,sP,rS,nOpt,ccx,ccy,z,hw2,outcome};
 const LGk=LG(type)?A.L:(fatalKind&&!A&&outcome==='S'?ANIMS[fatalKind].L:null);
 nOpt.vel=vN;const drawN=()=>{if(ashed&&!A&&outcome==='S')return;if(onToad&&A&&!A.enemy){blit(KU_NX,GY+KU_NY,true,NARUTO,nP,time,nOpt);return;}if(LGk&&LGk.drawN){LGk.drawN(ctx);return;}const kA=(type==='kyuubi'?clamp((t-.6)/(KY_ON-.6),0,1):0)||(kyuT>0&&!onToad?1:0),fl=nOpt.flipN!=null?nOpt.flipN:true;
 const four=kA>.5&&!!SPRN.four&&!(type==='kyuubi'&&t<=KY_ON)&&!((type==='oiroke'||type==='harem')&&t>=OIR_ON&&t<OIR_OFF)&&!(type==='kuchiyose') /* no manto da Kyubi ele fica e ataca sempre de quatro */,dirK=fl?1:-1,nO=kA>.5?Object.assign({},nOpt,{sharingan:true,four,tint:[200,40,16],tk:.3*Math.min(1,kA)}):nOpt,kKey=four?'four':(kA>0?sprPick(nP,sprRefsN()):null);
 kyuAura(g,nx0,GY+ny0,time,kA,false,dirK,four,kKey);blit(nx0,GY+ny0,fl,NARUTO,nP,time,nO);kyuAura(g,nx0,GY+ny0,time,kA,true,dirK,four,kKey);};
 const pierce=(LC(type)&&t>=2.56&&t<3.75)||(type==='selochidori'&&LG(type)&&t>=3.3&&t<4.38);
 if(!(A&&A.enemy)&&!pierce)drawN();
 const sOpt={};if(LTP(type)&&t>=TPF_LAND-.04&&t<TPF_BACK+.12)sOpt.alpha=0;if((LTP(type)&&t>=TPF_BACK+.12)||(!A&&outcome==='N'&&tpKill)){sOpt.flat=.42;sP.torn=1;}if(LKM(type)&&t>=KMF_UP+.3){sP.torn=1;}else if(!A&&outcome==='N'&&kmKill)sP.torn=1;if(LR(type)&&t>=ANIMS.rasengan.LR.burst){sOpt.hole=clamp((t-ANIMS.rasengan.LR.burst)/.06,0,1)*(rasKyu?3.8:2.5);if(rasKyu){sOpt.cracks=scaleAt(0,1,ANIMS.rasengan.LR.burst,ANIMS.rasengan.LR.burst+1.2,t);sOpt.tint=[40,14,10];sOpt.tk=.55*scaleAt(0,1,ANIMS.rasengan.LR.burst,ANIMS.rasengan.LR.burst+.8,t);}}else if(!A&&outcome==='N'&&rasKill){sOpt.hole=rasKyu?3.8:2.5;if(rasKyu){sOpt.cracks=1;sOpt.tint=[40,14,10];sOpt.tk=.55;}}
 if(type==='kawarimi')sOpt.alpha=(t>1.6&&t<1.9)?0:1;
 if(power>0)sOpt.light={x:rS.hf.hx,y:rS.hf.hy,r:34,col:[110,185,255],k:.75*Math.min(1,power)};
 if(type==='katon'&&t>1.82&&t<2.4)sOpt.light={x:rS.C[0]+3.2,y:rS.C[1]+2.6,r:28,col:[255,150,50],k:.7};
 const sFlip=(type==='kawarimi'&&t>1.9&&(LW(type)||t<3.2))||(LC(type)&&t>6.7)||(decap&&!A&&outcome==='S');
 {const l2=(type==='selo2')?scaleAt(0,1,1.0,2.4,t):(type==='selochidori'?1:(seal2T>0?1:0));const cs=(l2>0)?0:(type==='selo'?scaleAt(0,1,.8,2.0,t):(sealT>0?1:0));if(l2>0){sOpt.lv2=l2;sOpt.lv2h=(type==='selo2')?scaleAt(0,1,2.35,2.95,t):1;if(type==='selochidori'){sOpt.tint=[50,20,90];sOpt.tk=.2;}}else if(cs>0)sOpt.curse=cs;}
 if(A&&A.tp&&!LG(type)&&!lethal)sOpt.alpha=clamp(Math.abs(t-A.tp[0])/.07,0,1); /* teleporte: some no lugar do golpe e aparece na posicao inicial */
 {const DG=anim&&anim.dodge;if(DG&&DG.who==='S'&&t>=DG.t0&&t<DG.t1)sOpt.alpha=0;} /* Kawarimi: some enquanto o tronco leva o golpe */
 sOpt.bleed=Math.max(0,(100-hp.s)/100);
 sOpt.rot=sRot;sOpt.vel=vS;blit(sx0,GY+sy0,sFlip,SASUKE,sP,time,sOpt);
 if(pierce){drawN(); /* o braco entra no peito do Naruto: ele e desenhado por cima do Sasuke e so a parte de fora da frente do corpo reaparece */
  const o2=Object.assign({},sOpt,{noRefl:true});
  g.save();g.beginPath();g.rect(-50,-50,nx0-7+50,H+100);g.clip();blit(sx0,GY+sy0,false,SASUKE,sP,time,o2);g.restore();}
 if((LW(type)&&t>=2.68)||(decap&&!A&&outcome==='S')){const LL2=ANIMS.kawarimi.L,age2=LW(type)?t-2.68:99,hs2=headSim(LL2.head0[0],LL2.head0[1],age2);drawFlyHead(g,hs2.x,hs2.y,hs2.r,nP,time);}
 if(A&&A.clonesFn&&!LG(type))A.clonesFn(ctx);
 if(A&&A.tpN&&!lethal){const k=A.tpN[0];puff(f,interp(A.nX,k-.02),GY-24,t-k,7);puff(f,288,GY-24,t-k-.04,8);}
 if(A&&A.tp&&!LG(type)&&!lethal){const k=A.tp[0],xo=sasX(type,k-.02);puff(f,xo,GY-24,t-k,5);puff(f,96,GY-24,t-k-.04,6);}
 if(A&&A.enemy){if(type==='bunshin')drawClones(t,time);if(type==='uzumaki')uzClones(t,time);if(type==='harem')haremClones(t,time);if(type==='kuchiyose'){kuSeal(g,t,nx0-4);if(t>=KU_IN-.05)drawBunta(g,time,Math.min(1,(t-(KU_IN-.05))/.12),t>KU_FIRE-.6&&t<KU_FIRE?(t-(KU_FIRE-.6))/.6:0,0,clamp(Math.min((t-(KU_FIRE-.5))/.35,(KU_FIRE+.3-t)/.25),0,1));}if(type==='kamikaze'&&!(LKM(type)&&t>KMF_DROP)){kmTornado(g,t,time,nx0);kmClones(t,time,nx0,false);}drawN();if(type==='kamikaze'&&!(LKM(type)&&t>KMF_DROP))kmClones(t,time,nx0,true);if(type==='kuchiyose'){[0,1,2,3,4,5,6].forEach(i=>{puff(g,KU_BX-70+i*24,GY-24-(i%3)*34,t-(KU_IN-.15+i*.03),101+i);});kuWater(g,f,t,time,sx0,KU_FIRE,KU_HIT);
  if(t>.5&&t<KU_SLAM+.2){f.save();f.globalCompositeOperation='lighter';orb(f,nx0,GY-30,26+3*Math.sin(time*18),[[0,'rgba(255,90,30,.45)'],[1,'rgba(200,20,0,0)']]);f.restore();}}
 if(type==='kyuubi'){const a=t-KY_ON;if(t>.5&&t<KY_ON){f.save();f.globalCompositeOperation='lighter';orb(f,nx0,GY-34,22+14*Math.sin(time*30)*.2+20*clamp((t-.5)/.8,0,1),[[0,'rgba(255,80,30,.5)'],[1,'rgba(200,10,0,0)']]);f.restore();}
  if(a>=0&&a<.6){const k=a/.6;f.save();f.globalCompositeOperation='lighter';ringFX(f,nx0,GY-34,8+80*(1-(1-k)*(1-k)),3*(1-k)+.3,`rgba(255,120,40,${1-k})`);orb(f,nx0,GY-34,60*(1-k*.5),[[0,`rgba(255,160,80,${.7*(1-k)})`],[1,'rgba(200,20,0,0)']]);f.restore();const r2=R(2200);for(let i=0;i<40;i++){const an=r2()*TAU,sp=40+r2()*120;g.fillStyle=r2()<.5?'#ff6a2a':'#c81e10';g.fillRect(Math.round(nx0+Math.cos(an)*sp*a),Math.round(GY-34+Math.sin(an)*sp*a),2,2);}}}
 if(type==='teppodama'){kuWater(g,f,t,time,sx0,TP_FIRE,TP_HIT);if(LTP(type))tpFatalFX(g,f,t,sx0);}
 if(type==='nkunai'||type==='nshuriken')nThrowFX(f,type,t,time,sx0);
 if(type==='kamikaze'){puff(g,nx0,GY-26,t-1.05,91);if(LKM(type))kmFatalFX(f,t,sx0,sy0);}if(LU(type)){uzFatalFX(f,t,sx0);uzDust(g,t,sx0);}if(type==='oiroke'){puff(g,nx0,GY-30,t-(OIR_ON-.1),41);puff(g,nx0,GY-30,t-(OIR_OFF-.1),42);oirokeFX(f,t,time,nx0,sx0);}
 if(type==='harem'){if(anim&&anim.oirHit)puff(g,96,GY-30,t-4.45,77);HAR_X.forEach((x,i)=>{puff(g,x,GY-30,t-(OIR_ON-.1+i*.04),51+i);puff(g,x-6,GY-30,t-(OIR_OFF-.1),61+i);});HAR_X.forEach((x,i)=>oirokeFX(f,t-i*.09,time,x,sx0));if(anim&&anim.oirHit&&t>3.0&&t<3.95){for(let i=0;i<40;i++){const tb=3.0+i*.022,a2=t-tb;if(a2<0||a2>.55)continue;const hf=HAR_FLY(tb);if(!hf||hf.out)continue;const r=R(i+700);f.fillStyle=r()<.5?'#d4202e':'#9a0f1c';f.fillRect(Math.round(hf.x+6+(r()-.2)*30*a2),Math.round(GY+hf.y-46+(r()-.5)*20*a2+80*a2*a2),2,2);}}}if(type==='bunshin')puffs(g,t);} /* fumaca no canvas principal (sem bloom): cinza como nuvem, sem brilhar */

 /* ---- FX ---- */
 if(type==='chidori'){
  if(t>.55&&t<1.45){const r2=R(fr*11);f.globalCompositeOperation='lighter';for(let i=0;i<8;i++){const a=r2()*TAU,d=r2()*7;f.fillStyle=r2()<.5?'#8fe3ff':'#ffffff';f.fillRect(sx0+rS.hf.hx+Math.cos(a)*d,GY+sy0+rS.hf.hy+Math.sin(a)*d,.5,.5);}f.globalCompositeOperation='source-over';
   if(t>1.1)chidoriFX(f,hw[0],hw[1],(t-1.1)*.5,fr>>1,time);}
  if(t>1.5&&t<2.2){const r2=R((fr>>1)*53+1);f.globalCompositeOperation='lighter';let L=[];for(let i=0;i<4;i++){const tx=hw[0]+(r2()-.4)*52;L.push(...jagLines(hw[0],hw[1],tx,GY+2,(fr>>1)*29+i,9));}drawBolts(f,L,.8);
   for(let k=0;k<2;k++){const ph=((t*1.8+k*.5)%1);f.strokeStyle=`rgba(140,225,255,${(1-ph)*.8})`;f.lineWidth=.6;f.beginPath();f.ellipse(sx0,GY+1,10+ph*34,(10+ph*34)*.26,0,0,TAU);f.stroke();}
   for(let i=0;i<14;i++){f.fillStyle='#bfeaff';f.fillRect(hw[0]+(r2()-.5)*60,hw[1]+(r2()-.5)*50-r2()*12,.5,.5);}f.globalCompositeOperation='source-over';}
  if(t>2.15&&t<2.95){ // wake + water lightning
   f.lineCap='round';for(let i=0;i<26;i++){const tt=t-i*.014;if(tt<2.15||tt>2.58)continue;const X=sasX(type,tt);const fa=1-i/26;f.strokeStyle=`rgba(230,246,255,${fa*.55})`;f.lineWidth=.5;f.beginPath();f.ellipse(X-5,GY+1,5+i*1.3,(5+i*1.3)*.2,0,0,TAU);f.stroke();}
   if(t<2.6){f.globalCompositeOperation='lighter';const X=sasX(type,t);let L=[];const r2=R(fr*29);for(let i=0;i<3;i++)L.push(...jagLines(X-4,GY+1,X-28-r2()*30,GY+2+r2()*2,fr*3+i,5));drawBolts(f,L,.7);f.globalCompositeOperation='source-over';}}
  if(t>2.2&&t<2.9){const pts=[],eye=[];for(let i=0;i<18;i++){const tt=t-i*.016;if(tt<2.15)break;const P2=evalPose(A.sP,tt),rg=rigW(P2),X=sasX(type,tt),Y=GY+sasY(type,tt);pts.push([X+rg.hf.hx,Y+rg.hf.hy]);eye.push([X+rg.C[0]+2.6,Y+rg.C[1]]);}
   const r2=R(fr*71);f.globalCompositeOperation='lighter';f.lineCap='round';
   for(let i=0;i<pts.length-1;i++){const fa=1-i/pts.length,a=pts[i],b=pts[i+1],j=(r2()-.5)*3;f.strokeStyle=`rgba(60,120,255,${fa*.4})`;f.lineWidth=5*fa+1;f.beginPath();f.moveTo(a[0],a[1]+j);f.lineTo(b[0],b[1]+(r2()-.5)*3);f.stroke();f.strokeStyle=`rgba(190,240,255,${fa*.9})`;f.lineWidth=2*fa+.4;f.stroke();}
   for(let i=0;i<eye.length-1;i++){const fa=1-i/eye.length;f.strokeStyle=`rgba(255,40,50,${fa*.85})`;f.lineWidth=1.2*fa+.2;f.beginPath();f.moveTo(eye[i][0],eye[i][1]);f.lineTo(eye[i+1][0],eye[i+1][1]);f.stroke();}
   let L=[];for(let i=0;i<5;i++){const q=pts[Math.min(pts.length-1,i*3)];if(q)L.push(...boltLines(q[0],q[1],Math.PI+(r2()-.5)*1.6,10+r2()*14,fr*13+i,false));}drawBolts(f,L,.8);f.globalCompositeOperation='source-over';
   for(let i=0;i<4;i++){const q=pts[Math.min(pts.length-1,2+i*4)];if(q)eBird(f,q[0]-i*2.5,q[1]+(i%2?6:-6),0,1.35-i*.15,time*30+i*2,fr);}}
  if(t>2.2&&t<2.6){const r2=R(fr*97);f.lineCap='round';for(let i=0;i<34;i++){const y=20+r2()*165,x=ccx-hw2+r2()*W/z,l=20+r2()*80;f.strokeStyle=r2()<.5?`rgba(210,240,255,${.25+r2()*.5})`:`rgba(90,160,255,${.25+r2()*.5})`;f.lineWidth=.3+r2()*.5;f.beginPath();f.moveTo(x,y);f.lineTo(x+l,y);f.stroke();}}
  const spray=(t0,t1,n,posFn,dirx,seed)=>{for(let i=0;i<n;i++){const tb=t0+(t1-t0)*i/n,age=t-tb;if(age<0||age>.65)continue;const r2=R(seed+i),p0=posFn(tb),vx=(r2()-.5)*36+dirx,vy=-(24+r2()*56);const x=p0[0]+vx*age,y=p0[1]+vy*age+130*age*age;if(y>GY+4)continue;f.fillStyle=r2()<.5?`rgba(235,248,255,${1-age/.65})`:`rgba(140,196,240,${1-age/.65})`;f.beginPath();f.arc(x,y,.4+r2()*.5,0,TAU);f.fill();}};
  spray(2.15,2.56,70,tb=>[sasX(type,tb)-6,GY],-40,100);spray(2.58,3.1,50,tb=>[nx0,GY],60,300);spray(3.1,3.6,30,tb=>[sasX(type,tb),GY],20,500);
  if(LC(type)&&t>=2.58)pierceFX(f,t,time,fr,nx0,sx0,sy0,rS,hw,ny0);
  chidoriFX(f,hw[0],hw[1],power*((LC(type)&&t>=2.58)?.4:1),fr>>1,time);
  if(power>.15&&t<2.58){const nb=t<2.15?3:2;for(let i=0;i<nb;i++){const an=time*2.6+i*TAU/nb,rr=(19+5*Math.sin(time*2+i))*Math.min(1,power);eBird(f,hw[0]+Math.cos(an)*rr,hw[1]+Math.sin(an)*rr*.8,an+Math.PI/2,1.0+.3*Math.min(1,power),time*20+i*2,fr);}}
  const a=LC(type)?(raw-2.58)*1.7:t-2.58;
  if(a>=0&&a<1.0){const cx=nx0-6,cy=GY-42;
   waterColumn(f,nx0-8,a,11,52);
   bloodSpray(f,nx0-4,GY-44,a,3,30,1);
   scraps(f,nx0-4,GY-44,a,4,16,[[245,143,28],[42,79,184],[245,143,28]],1);
   if(a<.6){for(let i=0;i<9;i++){const an=i/9*TAU+.2,d0=a*120+6;eBird(f,cx+Math.cos(an)*d0,cy+Math.sin(an)*d0*.8,an,1.5*(1-a/.62),time*26+i,fr);}}
   f.globalCompositeOperation='lighter';
   if(a<.6)orb(f,cx,cy,52*(1-a/.9),[[0,'rgba(255,255,255,.7)'],[.3,'rgba(150,230,255,.4)'],[1,'rgba(60,120,255,0)']]);
   if(a<.35){const k=a/.35,rr=6+68*(1-(1-k)*(1-k));ringFX(f,cx,cy,rr,2.4*(1-k)+.3,`rgba(255,255,255,${1-k})`);ringFX(f,cx,cy,rr*.8,1.4*(1-k)+.2,`rgba(110,210,255,${1-k})`);}
   if(a<.6){const k=a/.6;f.strokeStyle=`rgba(200,235,255,${1-k})`;f.lineWidth=.7;f.beginPath();f.ellipse(nx0,GY+1,10+k*70,(10+k*70)*.22,0,0,TAU);f.stroke();}
   if(a<.7){const r2=R((fr>>1)*41),L2=a<.3?1:1-(a-.3)/.4;let L=[];for(let i=0;i<16;i++)L.push(...boltLines(cx,cy,r2()*TAU,(16+r2()*38)*L2,(fr>>1)*73+i,true));drawBolts(f,L,1.2);}
   if(a<.16){const s=36*(1-a/.16);f.fillStyle='rgba(255,255,255,.95)';f.beginPath();for(let i=0;i<16;i++){const ang=i/16*TAU,rr=i%2?s*.14:s;f.lineTo(cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr);}f.closePath();f.fill();}
   const r2=R(77);for(let i=0;i<70;i++){const ang=r2()*TAU,spd=40+r2()*130;const x=cx+Math.cos(ang)*spd*a,y=cy+Math.sin(ang)*spd*a+90*a*a;if(a>.7)continue;f.fillStyle=r2()<.5?`rgba(255,255,255,${1-a/.7})`:`rgba(140,230,255,${1-a/.7})`;f.fillRect(x,y,.7,.7);}
   if(a<.25){f.lineCap='round';for(let i=0;i<26;i++){const ang=i/26*TAU+.1,r0=10+a*70,r1=r0+16+r2()*34;f.strokeStyle=`rgba(255,255,255,${.7*(1-a/.25)})`;f.lineWidth=.5;f.beginPath();f.moveTo(cx+Math.cos(ang)*r0,cy+Math.sin(ang)*r0);f.lineTo(cx+Math.cos(ang)*r1,cy+Math.sin(ang)*r1);f.stroke();}}
   f.globalCompositeOperation='source-over';}
 }
 if(type==='katon'){
  const C=rS.C,mouth=[sx0+C[0]+2.2,GY+sy0+C[1]+2.7];
  if(t>.5&&t<1.5){const r2=R(fr*5);f.globalCompositeOperation='lighter';for(let i=0;i<5;i++){f.fillStyle='#ffb347';f.fillRect(sx0+rS.hf.hx+(r2()-.5)*8,GY+rS.hf.hy+(r2()-.5)*8,.5,.5);}f.globalCompositeOperation='source-over';}
  if(t>1.5&&t<1.82){const k=(t-1.5)/.32;f.globalCompositeOperation='lighter';orb(f,mouth[0]+2,mouth[1],6+12*k,[[0,`rgba(255,160,50,${.7*k})`],[1,'rgba(255,80,0,0)']]);f.globalCompositeOperation='source-over';}
  const tx=nx0-6,ty=GY-42;
  if(t>=1.82&&t<2.4){const k=(t-1.82)/.58,e=k*k*.7+k*.3,bx=mouth[0]+(tx-mouth[0])*e,by=mouth[1]+(ty-mouth[1])*e,br=3+16*Math.pow(k,.7);
   for(let i=0;i<12;i++){const q=i/12,px=mouth[0]+(bx-mouth[0])*q,py=mouth[1]+(by-mouth[1])*q+Math.sin(fr*.7+i)*1.5,rr=Math.max(1.5,br*(.2+.6*q));blob(f,px,py,rr,i%2?'#ff8a1e':'#d83a16',fr*.8+i,.3);}
   {const bd=Math.atan2(ty-by,tx-bx)+Math.PI;for(let i=0;i<7;i++){const q=(i+1)*br*.55;f.save();f.translate(bx+Math.cos(bd)*q+(Math.sin(fr*.5+i)*1.5),by+Math.sin(bd)*q);f.rotate(bd+Math.PI/2);flame(f,0,0,br*(1.1-i*.1),br*.33,fr*.4+i);f.restore();}}
   fireBlob(f,bx,by,br,fr*.9);
   f.globalCompositeOperation='lighter';orb(f,bx,GY,br*2.4,[[0,'rgba(255,150,50,.5)'],[1,'rgba(255,80,0,0)']]);
   const r2=R(fr*3);for(let i=0;i<16;i++){f.fillStyle=r2()<.5?'#ffd860':'#ff6a1a';f.fillRect(bx-br*.8-r2()*30,by+(r2()-.5)*br*1.5,.7+r2()*.5,.5);}f.globalCompositeOperation='source-over';}
  if(LK(type)&&t>=2.4)burnFX(f,t,time,fr,nx0,ny0,nP);
  const a=LK(type)?(raw-2.4)*1.1:t-2.4;
  if(a>=0&&a<1.6){explosionFX(f,tx+2,ty,a,fr);scraps(f,tx,ty,a,7,18,[[60,36,18],[245,143,28],[30,20,18]],0);
   if(a>.12&&a<1.4){const k=(a-.12)/1.28,fade=1-k;for(const dir of [-1,1]){for(let i=0;i<14;i++){const dist=i*7+k*95,xx=nx0+dir*dist,hh=(10+5*Math.sin(fr*.4+i*2))*fade*(1-i/18);if(hh>1&&xx>-10&&xx<W+10)flame(f,xx,GY+1,hh,hh*.34,fr*.35+i*1.3);}}}
   if(a>.15&&a<1.2){const r2=R(fr*9),fa=a<.8?1:1-(a-.8)/.4;for(let i=0;i<8;i++){const fx=nx0+(i-3.5)*4+(r2()-.5)*4,fy=GY-4-((i*13+fr*3)%42)*fa*.9;blob(f,fx,fy,(4+r2()*4)*fa,'#ff7a1a',fr*.7+i,.35,1.4);blob(f,fx,fy-1,(2.4+r2()*2.4)*fa,'#ffd860',fr*.7+i,.3,1.4);}
    for(let i=0;i<9;i++){const fx=nx0+(i-4)*9+Math.sin(i*3)*3,fa2=Math.min(1,(a-.15)/.2)*(a<1?1:1-(a-1)/.2);blob(f,fx,GY-1.5,(2.2+Math.sin(fr*.6+i)*.8)*fa2,'#ff6a1a',fr*.8+i,.4,1.8);blob(f,fx,GY-1.2,(1.2)*fa2,'#ffe27a',fr*.8+i,.3,1.8);}}
   if(a>.25){const fa=Math.min(1,(a-.25)/.3)*(1-Math.min(1,Math.max(0,(a-.9)/.7)));for(let i=0;i<6;i++)smoke(f,tx+(i-2.5)*8+Math.sin(a*3+i)*3,ty-20-(a-.25)*34-i*4,16+i*2,.55*fa);}
   f.globalCompositeOperation='lighter';
   if(a<.4){const k=a/.4,rr=4+76*(1-(1-k)*(1-k));ringFX(f,tx,ty,rr,2.6*(1-k)+.3,`rgba(255,220,120,${1-k})`);ringFX(f,tx,ty,rr*.85,1.5*(1-k)+.2,`rgba(255,120,30,${1-k})`);}
   const r2=R(55);for(let i=0;i<60;i++){const ang=r2()*TAU,spd=30+r2()*120;if(a>.9)continue;const x=tx+Math.cos(ang)*spd*a,y=ty+Math.sin(ang)*spd*a+80*a*a;f.fillStyle=r2()<.5?`rgba(255,216,96,${1-a/.9})`:`rgba(255,122,26,${1-a/.9})`;f.fillRect(x,y,.8,.8);}
   for(let i=0;i<24;i++){const ph=(a*.6+i*.137)%1;const ex=nx0+(i%9-4)*7+Math.sin(a*4+i)*4,ey=GY-8-ph*60;f.fillStyle=`rgba(255,${150+i*3},60,${(1-ph)*.9})`;f.fillRect(ex,ey,.7,.7);}
   f.globalCompositeOperation='source-over';}
 }
 {const FXF=LG(type)?A.L.fx:(A&&A.fx);if(FXF)FXF(ctx);else if(fatalKind&&!A&&outcome==='S'&&ANIMS[fatalKind].L.fxStatic)ANIMS[fatalKind].L.fxStatic(ctx);}
 if(burnt&&!A&&outcome==='S')ashFX(f,time,fr,nx0);
 if(seal2T>0&&type!=='selo2'&&type!=='selochidori'&&!(A&&A.L&&LG(type)))curseAura2(f,sx0,.3,time,fr);else if(sealT>0&&type!=='selo'&&type!=='selochidori'&&!(A&&A.L&&LG(type)))curseAura(f,sx0,.22,time,fr);
 if(ashed&&!A&&outcome==='S')ashPile(f,time,nx0,1);
 g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;

 if(type==='rasengan'){
  if(LR(type))rasFatalFX(g,f,t,raw,time,fr,sx0,z,sx,sy,ccx,ccy);
  if(ras){g.save();setCam(g,z,sx,sy,ccx,ccy);rasengan(g,ras.x,ras.y,ras.r,time,fr);g.restore();
   if(t<1.55){const r2=R(fr*3+1);for(let i=0;i<18;i++){const an=r2()*TAU+time*2,d0=14+r2()*22,ph=(time*2.4+i*.17)%1,dd=d0*(1-ph);g.save();setCam(g,z,sx,sy,ccx,ccy);g.fillStyle=i%3?'#bfe6ff':'#ffffff';g.globalAlpha=Math.min(1,ph*1.6);g.fillRect(Math.round(ras.x+Math.cos(an)*dd),Math.round(ras.y+Math.sin(an)*dd*.8),1,1);g.restore();}}} /* chakra em pixels sendo puxado para a esfera */
  if(t>1.65&&t<2.2){const r2=R(fr*97);f.lineCap='round';for(let i=0;i<26;i++){const y=22+r2()*160,x=ccx-hw2+r2()*W/z,l=20+r2()*70;f.strokeStyle=r2()<.5?'rgba(210,240,255,'+(.25+r2()*.5)+')':'rgba(110,170,255,'+(.25+r2()*.5)+')';f.lineWidth=.3+r2()*.5;f.beginPath();f.moveTo(x,y);f.lineTo(x-l,y);f.stroke();}}
  const a=t-2.2;if(a>=0&&a<1.0){const rNn=rigW(nP),ex=nx0-rNn.hf.hx-8,ey=GY+ny0+rNn.hf.hy;
   waterColumn(f,ex-6,a,11,46);bloodSpray(f,ex-4,ey-2,a,4,30,-1);scraps(f,ex,ey,a,5,18,[[51,68,154],[236,238,248],[250,210,176]],-1);
   f.globalCompositeOperation='lighter';
   if(a<.6)orb(f,ex,ey,44*(1-a/.9),[[0,'rgba(255,255,255,.5)'],[.3,'rgba(150,215,255,.3)'],[1,'rgba(60,120,255,0)']]);
   if(a<.5&&!LR(type)){const k=a/.5,e2=1-(1-k)*(1-k);rasengan(f,ex,ey,9+40*e2,time*1.4,fr,.8*(1-k));ringFX(f,ex,ey,6+66*e2,2.2*(1-k)+.2,'rgba(255,255,255,'+(1-k)+')');ringFX(f,ex,ey,(6+66*e2)*.8,1.4*(1-k)+.2,'rgba(120,190,255,'+(1-k)+')');}
   if(a<.35){f.lineCap='round';const r2=R(61);for(let i=0;i<22;i++){const an=i/22*TAU+.1,r0=10+a*80,r1=r0+14+r2()*30;f.strokeStyle='rgba(255,255,255,'+.7*(1-a/.35)+')';f.lineWidth=.5;f.beginPath();f.moveTo(ex+Math.cos(an)*r0,ey+Math.sin(an)*r0);f.lineTo(ex+Math.cos(an)*r1,ey+Math.sin(an)*r1);f.stroke();}}
   f.globalCompositeOperation='source-over';}
 }
 if(type==='bunshin'){
  if(t>.65&&t<1.15){f.globalCompositeOperation='lighter';orb(f,nx0-4,GY-44,16+4*Math.sin(time*20),[[0,'rgba(255,190,90,.6)'],[1,'rgba(255,120,30,0)']]);f.globalCompositeOperation='source-over';}
  const r2=R(fr*53);f.lineCap='round';
  for(const cl of A.clones)if(t>cl.r0&&t<cl.h-.05){for(let i=0;i<10;i++){const x=cl.x0-(cl.x0-128)*((t-cl.r0)/(cl.h-.05-cl.r0))+r2()*40,y=GY-70+r2()*70;f.strokeStyle='rgba(255,255,255,'+(.2+r2()*.4)+')';f.lineWidth=.3+r2()*.4;f.beginPath();f.moveTo(x,y);f.lineTo(x+14+r2()*20,y);f.stroke();}}
  if(t>3.3&&t<3.58){for(let i=0;i<16;i++){const y=GY-75+r2()*80,x=ccx-hw2+r2()*W/z;f.strokeStyle='rgba(255,230,190,'+(.25+r2()*.4)+')';f.lineWidth=.3+r2()*.5;f.beginPath();f.moveTo(x,y);f.lineTo(x-20-r2()*40,y);f.stroke();}}
  A.hits.forEach((h,i)=>{const a=t-h.t,big=i===A.hits.length-1,ex=sx0+8,ey=GY-40;if(a<0||a>(big?1:.4))return;
   bloodSpray(f,ex,ey,a,i+3,big?28:10,-1);scraps(f,ex,ey,a,i+9,big?14:5,[[51,68,154],[236,238,248],[250,210,176]],-1);
   f.globalCompositeOperation='lighter';const k=Math.min(1,a/(big?.5:.25));
   orb(f,ex,ey,(big?40:20)*(1-k*.7),[[0,'rgba(255,255,255,'+(.8*(1-k))+')'],[.5,'rgba(255,220,150,'+(.4*(1-k))+')'],[1,'rgba(255,150,60,0)']]);
   ringFX(f,ex,ey,5+(big?60:26)*k,(big?2.2:1.4)*(1-k)+.2,'rgba(255,255,255,'+(1-k)+')');
   if(big&&a<.5){f.lineCap='round';const r3=R(77);for(let q=0;q<14;q++){const an=-Math.PI/2+(r3()-.5)*1.4,r0=8+a*90,r1=r0+14+r3()*26;f.strokeStyle='rgba(255,240,200,'+(1-a/.5)+')';f.lineWidth=.5;f.beginPath();f.moveTo(ex+Math.cos(an)*r0,ey+Math.sin(an)*r0);f.lineTo(ex+Math.cos(an)*r1,ey+Math.sin(an)*r1);f.stroke();}waterColumn(f,ex,a,11,50);}
   f.globalCompositeOperation='source-over';});
 }
 if(burning&&!ashed&&type!=='amaterasu')ameFlames(f,nx0,5,fr,.5+.08*Math.sin(time*5),rigW(nP),ny0);
 if(type==='amaterasu'){
  if(t>2.0){ameFlames(f,nx0,t-2.0,fr,LA(type)?ameLInt(t):null,rigW(nP),ny0);scraps(f,nx0,GY-40,t-2.0,8,22,[[20,14,18],[60,16,30]],0);}
  if(!LA(type)&&t>=3.0&&t<4.7){f.save();f.globalAlpha=scaleAt(0,1,3.0,3.3,t)*(1-scaleAt(0,1,4.3,4.7,t));eyeBleedFX(f,6.4,time,sx0,sy0,rS);f.restore();} /* o Sasuke volta na camera, com a mao no olho que sangra */
  if(LA(type)){ashFlakes(f,t,time,nx0,ny0,nP);ashPile(f,time,nx0,scaleAt(0,1,4.5,5.8,t));if(t>=5.8)eyeBleedFX(f,t,time,sx0,sy0,rS);}
  if(t>1.0&&t<2.3){const ex=sx0+rS.C[0]+.5,ey=GY+sy0+rS.C[1]+.5,pu=.6+.4*Math.sin(time*14);f.globalCompositeOperation='lighter';orb(f,ex,ey,14*pu,[[0,'rgba(255,40,60,.9)'],[.4,'rgba(200,10,40,.4)'],[1,'rgba(120,0,20,0)']]);f.globalCompositeOperation='source-over';}
 }
 if(type==='kawarimi'){
  puff(f,96,GY-24,t-1.6,1);puff(f,170,GY-28,t-1.9,2);
  if(LW(type))decapFX(f,t,raw,time,fr,nx0,sx0,sy0,nP);
  if(t>1.15&&t<1.62){const r2=R(fr*53);f.lineCap='round';for(let i=0;i<18;i++){const y=GY-60+r2()*70,x=ccx-hw2+r2()*W/z,l=18+r2()*50;f.strokeStyle='rgba(255,255,255,'+(.2+r2()*.4)+')';f.lineWidth=.3+r2()*.4;f.beginPath();f.moveTo(x,y);f.lineTo(x+l,y);f.stroke();}}
  const a1=t-1.62;if(a1>=0&&a1<.5){const k=a1/.5;f.globalCompositeOperation='lighter';ringFX(f,100,GY-30,6+44*k,1.8*(1-k)+.2,'rgba(255,255,255,'+(1-k)+')');f.globalCompositeOperation='source-over';}
  const b1=LW(type)?-1:t-2.68;if(b1>=0&&b1<.8){const k=b1/.8;bloodSpray(f,nx0+2,GY-34,b1,5,22,-1);scraps(f,nx0+2,GY-34,b1,6,12,[[245,143,28],[242,127,18]],-1);f.globalCompositeOperation='lighter';if(b1<.4)orb(f,nx0+4,GY-34,26*(1-b1/.5),[[0,'rgba(255,255,255,.6)'],[.4,'rgba(255,220,160,.3)'],[1,'rgba(255,150,60,0)']]);
   ringFX(f,nx0+4,GY-34,6+66*Math.min(1,b1/.35),2.4*(1-Math.min(1,b1/.35))+.2,'rgba(255,255,255,'+(1-k)+')');
   const r2=R(91);f.lineCap='round';for(let i=0;i<14;i++){const an=-Math.PI*.9+r2()*Math.PI*.8,r0=8+b1*70,r1=r0+14+r2()*20;f.strokeStyle='rgba(255,240,200,'+(1-k)+')';f.lineWidth=.5;f.beginPath();f.moveTo(nx0+4+Math.cos(an)*r0,GY-34+Math.sin(an)*r0);f.lineTo(nx0+4+Math.cos(an)*r1,GY-34+Math.sin(an)*r1);f.stroke();}
   f.globalCompositeOperation='source-over';}
 }
 // dash zoom blur
 if(type==='chidori'&&t>2.2&&t<2.56){const px=(sx0-ccx)*K*z+PW/2,py=(GY-30-ccy)*K*z+PH/2;g.globalAlpha=.22;const s=1.05;g.save();g.translate(px,py);g.scale(s,s);g.translate(-px,-py);g.drawImage(cv,0,0);g.restore();g.globalAlpha=1;}
 {const PST=LG(type)?A.L.post:(A&&A.post);if(PST)PST(g,ctx);}
 if(type==='amaterasu'){fxPx.clearRect(0,0,384,216);fxPx.imageSmoothingEnabled=true;fxPx.drawImage(fxc,0,0,384,216);g.save();g.imageSmoothingEnabled=false;g.drawImage(fxPix,0,0,PW,PH);g.restore();}else g.drawImage(fxc,0,0);
 bx.clearRect(0,0,320,180);bx.filter='blur(3.5px)';bx.drawImage(fxc,0,0,320,180);bx.filter='none';bx2.clearRect(0,0,640,360);bx2.filter='blur(2px)';bx2.drawImage(fxc,0,0,640,360);bx2.filter='none';
 g.save();g.globalCompositeOperation='lighter';g.imageSmoothingQuality='high';g.globalAlpha=.8;g.drawImage(bloomc,0,0,PW,PH);g.globalAlpha=.4;g.drawImage(bloomc2,0,0,PW,PH);g.restore();
 if(flashA>0){g.fillStyle=`rgba(255,255,255,${flashA})`;g.fillRect(0,0,PW,PH);}
 if(LC(type))fatalLens(g,raw,t,time,ccx,ccy,z,nx0);
 if(LW(type))decapLens(g,raw,ccx,ccy,z);
 if(LG(type)&&A.L.lens)A.L.lens(g,ctx);
 const vg=g.createRadialGradient(PW/2,PH/2,PH*.35,PW/2,PH/2,PW*.62);vg.addColorStop(0,'rgba(0,0,12,0)');vg.addColorStop(1,'rgba(0,0,12,.55)');g.fillStyle=vg;g.fillRect(0,0,PW,PH);
 if(bars>0){const bh=bars*K;g.fillStyle='#000';g.fillRect(0,0,PW,bh);g.fillRect(0,PH-bh,PW,bh);}
 const mShot=LR(type)&&!!ANIMS.rasengan.LR.mirror&&t>=ANIMS.rasengan.LR.mirror[0]&&t<ANIMS.rasengan.LR.mirror[1]; /* corte para tras do Sasuke: o quadro inteiro inverte */
 if(roleN!==mShot){mirx.clearRect(0,0,PW,PH);mirx.drawImage(cv,0,0);g.save();g.setTransform(-1,0,0,1,PW,0);g.imageSmoothingEnabled=false;g.drawImage(mirc,0,0);g.restore();}
}
function loop(ts){render(ts);requestAnimationFrame(loop)}
requestAnimationFrame(loop);

