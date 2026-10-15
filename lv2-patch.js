const fs=require('fs');let s=fs.readFileSync('naruto-demo.html','utf8');
const rp=(x,y)=>{if(!s.includes(x)){console.log('MISSING',x.slice(0,100));return;}s=s.split(x).join(y)};
// ---------- helpers (forma, maos-asas, marcas, aura, raios negros)
rp('function curseMarks(sc,P,k,time){',`function lvDef(p){const d=Object.assign({},SASUKE);d.skin=mix(SASUKE.skin,[150,160,198],p);d.fore=d.skin;d.shin=d.skin;d.hair=mix(SASUKE.hair,[72,90,132],p);d.hairHi=mix(SASUKE.hairHi,[172,192,228],p);d.longHair=p;d.lv2=p;d.eyeH=SASUKE.eyeH*(1-.12*p);return d;}
function wingHand(c,len,flex,seed){c.lineCap='round';c.lineJoin='round';const ol='#241816';
 const ag=c.createLinearGradient(0,-5,0,5);ag.addColorStop(0,'#b2a194');ag.addColorStop(1,'#6a5a54');
 c.strokeStyle=ol;c.lineWidth=11;c.beginPath();c.moveTo(-len*.62,0);c.lineTo(-len*.02,0);c.stroke();c.strokeStyle=ag;c.lineWidth=9.2;c.stroke();
 c.fillStyle='rgba(255,235,220,.25)';c.beginPath();c.ellipse(-len*.3,-2.4,len*.28,1.1,0,0,TAU);c.fill();
 c.beginPath();c.ellipse(len*.14,0,len*.2,len*.19,0,0,TAU);c.fillStyle=ag;c.fill();c.strokeStyle=ol;c.lineWidth=1.1;c.stroke();
 const fingers=[[-.95,.68,.5],[-.45,.9,.55],[0,1,.6],[.45,.9,.55],[.9,.7,.5]];
 fingers.forEach((fg,i)=>{const base=[len*.3,fg[0]*len*.17],a0=fg[0]*.55-.05,seg=[len*.34*fg[1],len*.27*fg[1],len*.2*fg[1]],curl=(flex*.55+Math.sin(seed+i)*.12)*(fg[0]<0?1:.9);
  let x=base[0],y=base[1],a=a0;const pts=[[x,y]];for(let j=0;j<3;j++){a+=curl*(j+.6)*(fg[0]>=0?-.55:.55)*.9;x+=Math.cos(a)*seg[j];y+=Math.sin(a)*seg[j];pts.push([x,y]);}
  c.strokeStyle=ol;c.lineWidth=4.6;c.beginPath();pts.forEach((p,j)=>j?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  c.strokeStyle=ag;c.lineWidth=3.2;c.stroke();c.fillStyle='#2a1c1a';c.beginPath();c.arc(pts[3][0],pts[3][1],1.5,0,TAU);c.fill();});
 const th=[len*.2,len*.17];c.strokeStyle=ol;c.lineWidth=4.6;c.beginPath();c.moveTo(th[0],th[1]);c.quadraticCurveTo(th[0]+len*.1,th[1]+len*.18,th[0]+len*.28,th[1]+len*.2);c.stroke();c.strokeStyle=ag;c.lineWidth=3.2;c.stroke();}
function drawWings(sc,P,k,time){const grow=clamp((k-.5)/.5,0,1);if(grow<=0)return;const rg=rigW(P),S=rg.S,t0=P.tilt||0;
 sc.save();sc.setTransform(RES,0,0,RES,OXU*RES,OYU*RES);sc.globalAlpha=Math.min(1,grow*1.4);
 const defs=[{ang:-2.3,dx:-4,dy:-1,len:38,seed:1},{ang:-1.9,dx:-1.5,dy:-3,len:35,seed:2}];
 for(const w of defs){sc.save();sc.translate(S[0]+w.dx,S[1]+w.dy);sc.rotate(w.ang+t0+Math.sin(time*1.6+w.seed)*.05);wingHand(sc,w.len*grow,.55+.35*Math.sin(time*2.1+w.seed),w.seed);sc.restore();}
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
function curseMarks(sc,P,k,time){`);
// ---------- Chidori roxo e negro
const d0=s.indexOf('function darkChidoriFX(');const d1=s.indexOf('/* ---- Shishi Rendan ---- */');
if(d0<0||d1<0)console.log('MISSING darkChidoriFX');
else s=s.slice(0,d0)+`function darkChidoriFX(f,x,y,p,fr,time){
 if(p<=0)return;const r2=R(fr*7+3),rr=11*Math.min(1.3,p);
 orb(f,x,y,rr*2.4,[[0,'rgba(4,0,10,.82)'],[.6,'rgba(20,4,40,.5)'],[1,'rgba(20,4,40,0)']]);
 f.globalCompositeOperation='lighter';orb(f,x,y,rr*3,[[0,'rgba(150,60,255,.38)'],[1,'rgba(60,10,140,0)']]);f.globalCompositeOperation='source-over';
 let L=[];for(let i=0;i<11;i++)L.push(...boltLines(x,y,r2()*TAU,8+r2()*18*p,fr*13+i,true));darkBolts(f,L,.95);
 f.fillStyle='#050109';f.beginPath();f.arc(x,y,rr*.58,0,TAU);f.fill();f.strokeStyle='rgba(190,120,255,.9)';f.lineWidth=.55;f.stroke();
 f.globalCompositeOperation='lighter';orb(f,x,y,rr*.34,[[0,'rgba(245,225,255,.95)'],[1,'rgba(160,80,255,0)']]);f.globalCompositeOperation='source-over';}
`+s.slice(d1);
s=s.replace(/drawBolts\(f,L,([\d.]+),DK\)/g,'darkBolts(f,L,$1)');
// ---------- cabelo longo
rp('for(const a of backL)L(a,true);',`const lh=d.longHair||0;
 if(lh>0){for(const a of backL){const k=1+.75*lh;L([a[0],a[1],a[0]+(a[2]-a[0])*k,a[1]+(a[3]-a[1])*k+3.5*lh,a[4],a[5]],true);}
  for(const a of [[-3,3,-10,19,5.2,1.2],[-2,5,-5,21,4.6,.6],[-5,0,-15,15,5.4,1.4]])L([a[0],a[1],a[0]+(a[2]-a[0])*lh,a[1]+(a[3]-a[1])*lh,a[4],a[5]],true);}
 else for(const a of backL)L(a,true);`);
// ---------- blit
rp('function blit(x,y,flip,d,P,time,o){o=o||{};','function blit(x,y,flip,d,P,time,o){o=o||{};if(o.lv2>0&&d.style===\'s\')d=lvDef(o.lv2);');
rp('sc.setTransform(RES,0,0,RES,OXU*RES,OYU*RES);const r=drawFig(sc,d,P,time);drawDecals(sc,d,P,time);','if(o.lv2>0)drawWings(sc,P,o.lv2,time);sc.setTransform(RES,0,0,RES,OXU*RES,OYU*RES);const r=drawFig(sc,d,P,time);drawDecals(sc,d,P,time);');
rp('if(o.curse>0)curseMarks(sc,P,o.curse,time);','if(o.curse>0)curseMarks(sc,P,o.curse,time);if(o.lv2>0)curseMarks2(sc,P,o.lv2,time);');
// ---------- estado e cartas
rp("let guard=false,menuOpen='main',copied=null,lastEnemy=null,sealT=0,stunN=false;","let guard=false,menuOpen='main',copied=null,lastEnemy=null,sealT=0,seal2T=0,lastP2=false,stunN=false;");
rp("return Math.round(base*((sealT>0&&!cd.noSeal)?1.3:1));","return Math.round(base*((seal2T>0&&!cd.noSeal)?1.6:(sealT>0&&!cd.noSeal)?1.3:1));");
rp("ok:()=>sealT===0,onUse:()=>{hp.s=Math.max(1,hp.s-8);sealT=4;setBars();}},","ok:()=>sealT===0&&seal2T===0,onUse:()=>{hp.s=Math.max(1,hp.s-8);sealT=4;setBars();}},\n{id:'selo2',name:'Selo Amaldiçoado (Nível 2)',cost:40,col:'#8a7ab8',desc:'Transformação: perde 15 de vida. Por 3 turnos: +60% de dano, +15 de chakra por turno, 40% de chance de desviar e libera o Chidori Sombrio.',live:true,noSeal:true,ok:()=>seal2T===0,onUse:()=>{hp.s=Math.max(1,hp.s-15);seal2T=4;sealT=0;setBars();}},");
rp("{id:'selochidori',name:'Selo Amaldiçoado: Chidori',cost:35,col:'#8a50c8',desc:'(reservado para a transformação total)',live:true,noSeal:true,show:()=>false,onUse:()=>{hp.s=Math.max(1,hp.s-10);sealT=3;setBars();}},","{id:'selochidori',name:'Chidori Sombrio (Nível 2)',cost:35,col:'#8a50c8',desc:'O Chidori negro e roxo da transformação. Dano alto e fatality.',live:true,show:()=>seal2T>0,ok:()=>seal2T>0,onUse:()=>{hp.s=Math.max(1,hp.s-6);setBars();}},");
rp("if(sealT>0){sealT--;hp.s=Math.max(1,hp.s-2);ck.s=Math.min(100,ck.s+10);if(!sealT)toast('O selo amaldiçoado se acalma');}","if(seal2T>0){seal2T--;hp.s=Math.max(1,hp.s-3);ck.s=Math.min(100,ck.s+15);if(!seal2T)toast('A transformação se desfaz');}else if(sealT>0){sealT--;hp.s=Math.max(1,hp.s-2);ck.s=Math.min(100,ck.s+10);if(!sealT)toast('O selo amaldiçoado se acalma');}");
rp("if(sealT>0&&Math.random()<.3){skipEnemy('Sasuke desvia com a velocidade do selo!');return;}","if((sealT>0&&Math.random()<.3)||(seal2T>0&&Math.random()<.4)){skipEnemy('Sasuke desvia com a velocidade do selo!');return;}");
rp("lastEnemy=null;sealT=0;stunN=false;","lastEnemy=null;sealT=0;seal2T=0;stunN=false;");
rp("({chidori:[1350,'千鳥'","({selo2:[1000,'呪印','SELO AMALDIÇOADO','Nível 2','#8a7ab8'],chidori:[1350,'千鳥'");
// ---------- render
rp("if(sealT>0&&sP.red<1)sP.red=1;","if((sealT>0||seal2T>0)&&sP.red<1)sP.red=1;");
rp("{const cs=(type==='selochidori')?scaleAt(0,1,.7,1.7,t):(type==='selo'?scaleAt(0,1,.8,2.0,t):(sealT>0?1:0));if(cs>0){sOpt.curse=cs;if(type==='selochidori'){sOpt.tint=[70,30,110];sOpt.tk=.25*cs;}}}",
 "{const l2=(type==='selo2')?scaleAt(0,1,1.0,2.4,t):(type==='selochidori'?1:(seal2T>0?1:0));const cs=(l2>0)?0:(type==='selo'?scaleAt(0,1,.8,2.0,t):(sealT>0?1:0));if(l2>0){sOpt.lv2=l2;if(type==='selochidori'){sOpt.tint=[50,20,90];sOpt.tk=.2;}}else if(cs>0)sOpt.curse=cs;}");
rp("if(sealT>0&&type!=='selo'&&type!=='selochidori'&&!(A&&A.L&&LG(type)))curseAura(f,sx0,.22,time,fr);","if(seal2T>0&&type!=='selo2'&&type!=='selochidori'&&!(A&&A.L&&LG(type)))curseAura2(f,sx0,.5,time,fr);else if(sealT>0&&type!=='selo'&&type!=='selochidori'&&!(A&&A.L&&LG(type)))curseAura(f,sx0,.22,time,fr);");
{const r0=s.indexOf('function render(');const a0=s.indexOf('const A=type?ANIMS[type]:null;',r0);if(a0>0)s=s.slice(0,a0)+"const A=type?ANIMS[type]:null;\n if((seal2T>0)!==lastP2){lastP2=seal2T>0;portrait('ptS',lastP2?lvDef(1):SASUKE,mk({red:1,expr:1,hr:.05}));}"+s.slice(a0+'const A=type?ANIMS[type]:null;'.length);else console.log('MISSING render A');}
// ---------- chidori sombrio: sem a pegada do pescoco (ja esta transformado)
rp("ANIMS.selochidori={dur:5.4,hold:3.2,hitT:3.2,dmg:48,","ANIMS.selochidori={dur:5.4,hold:3.2,hitT:3.2,dmg:44,");
rp("[.6,SEL_N],[1.7,SEL_N],[1.95,SEL_B]","[.6,SEL_B],[1.7,SEL_B],[1.95,SEL_B]");
// ---------- animacao da transformacao
rp('ANIMS.rasengan={enemy:true,dur:4.6',`const SEL_ROAR=mk({tilt:-.15,crouch:4,lean:-1,fbx:-9,ffx:7,hxF:-7,hyF:-8,hxB:-9,hyB:-8,hr:-.25,expr:2,red:1,tw:.95,wind:1,scream:1});
function selo2FX(c){const {f,t,time,fr,sx0,sy0,rS}=c,on=scaleAt(0,1,1.0,2.4,t),[ex,ey]=eyePos(sx0,sy0,rS);
 if(t>.6&&t<3.4){const k=scaleAt(0,1,.6,1.0,t);f.fillStyle='rgba(6,4,12,.6)';for(let i=0;i<16;i++){const r=R(500+i),ph=((time*.8+i*.137)%1),x=sx0+(r()-.5)*24*(1+ph),y=GY-8-ph*66*(.6+r()*.6);f.beginPath();f.ellipse(x,y,1+r()*1.8,1.8+r()*3*ph,0,0,TAU);f.globalAlpha=(1-ph)*.7*k;f.fill();}f.globalAlpha=1;}
 if(t>1.0&&t<3.1){const r2=R(fr*5+11);let L=[];const n=Math.round(5+11*on);for(let i=0;i<n;i++)L.push(...boltLines(sx0+(r2()-.5)*10,GY-36+(r2()-.5)*44,r2()*TAU,8+r2()*(12+22*on),fr*7+i,true));darkBolts(f,L,.8);}
 curseAura2(f,sx0,.95*on*(1-.45*scaleAt(0,1,3.6,4.4,t)),time,fr);
 f.globalCompositeOperation='lighter';orb(f,ex+1.5,ey,5*scaleAt(0,1,.8,1.4,t),[[0,'rgba(255,50,60,.6)'],[1,'rgba(160,10,30,0)']]);f.globalCompositeOperation='source-over';
 const a=t-2.4;if(a>=0&&a<1.0){const k=a/1.0;f.globalCompositeOperation='lighter';orb(f,sx0,GY-40,70*(1-k*.6),[[0,'rgba(220,190,255,'+(.6*(1-k))+')'],[.4,'rgba(130,60,240,'+(.35*(1-k))+')'],[1,'rgba(40,10,100,0)']]);
  for(let q=0;q<3;q++){const kk=clamp(k*1.3-q*.12,0,1);ringFX(f,sx0,GY-34,8+90*kk,2.4*(1-kk)+.2,'rgba('+(q?'120,60,220':'210,190,255')+','+(1-kk)+')');}
  f.strokeStyle='rgba(200,160,255,'+(1-k)+')';f.lineWidth=.55;f.lineCap='round';for(let i=0;i<18;i++){const an=i*TAU/18,r0=12+a*100,r1=r0+10+((i*37)%16);f.beginPath();f.moveTo(sx0+Math.cos(an)*r0,GY-34+Math.sin(an)*r0*.9);f.lineTo(sx0+Math.cos(an)*r1,GY-34+Math.sin(an)*r1*.9);f.stroke();}f.globalCompositeOperation='source-over';}
}
ANIMS.selo2={dur:4.8,hold:2.4,hitT:2.4,dmg:0,cost:40,noLift:true,
 sP:[[0,READY],[.4,READY],[.6,SEL_N],[2.3,SEL_N],[2.45,SEL_ROAR],[3.3,SEL_ROAR],[3.8,SEL_S],[4.8,SEL_S]],
 nP:[[0,N_READY],[1.3,N_READY],[1.8,N_SURP],[2.8,N_SURP],[3.4,N_GUARD],[4.8,N_GUARD]],
 nX:[[0,288],[4.8,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:2.5,cx:104,cy:124}],[2.3,{z:2.8,cx:104,cy:122}],[2.5,{z:1.5,cx:100,cy:116}],[3.4,{z:1.5,cx:100,cy:116}],[4.2,{z:1.04,cx:192,cy:116}],[4.8,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={},a=t-2.4;if(a>0&&a<1.1)E.shk=8*(1-a/1.1);if(t>1.0&&t<2.3)E.shk=Math.max(E.shk||0,1.8);if(a>=0&&a<.05)E.flash=.6;
  E.dim=.45*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,3.6,4.4,t));E.tint='rgba(30,10,60,'+(.34*scaleAt(0,1,.6,1.2,t)*(1-scaleAt(0,1,3.6,4.4,t)))+')';E.bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,4.0,4.6,t));return E;},
 fx:c=>selo2FX(c)};
ANIMS.rasengan={enemy:true,dur:4.6`);
rp("if(type==='selo'){tone('sine',55,48,1.8,.4,.7);",`if(type==='selo2'){tone('sine',48,40,2.4,.45,.6);nz(2.0,'bandpass',180,1000,.28,.7);tone('sawtooth',80,520,1.6,.06,.9,9);[1.3,1.6,1.9,2.2].forEach(a=>tone('sine',60,34,.22,.45,a));nz(.6,'highpass',3000,9000,.4,2.0);tone('sine',90,28,1.0,.9,2.4);nz(.9,'lowpass',2600,150,.8,2.4);nz(.5,'highpass',3500,9000,.5,2.45);return;}
 if(type==='selo'){tone('sine',55,48,1.8,.4,.7);`);
fs.writeFileSync('naruto-demo.html',s);console.log('ok');
