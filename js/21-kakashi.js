/* ---------- Kakashi Hatake (Parte 1) ----------
   Joga no lado esquerdo no lugar do Sasuke/Sakura, com sprites proprios (pixel/kakashi.js). O kit usa as animacoes do Sharingan:
   Katon copiado, Raikiri (a animacao e o fatality do Chidori, com outro nome e texto), Genjutsu e Ninja Copiador. */
ANIMS.raikiri=Object.assign({},ANIMS.chidori,{L:Object.assign({},ANIMS.chidori.L,{line:'Acabou.',banner:['雷切','FATALITY','Raikiri','#7fd4ff']})});
const KAKASHI_JUTSUS=[
 Object.assign({},SASUKE_JUTSUS.find(c=>c.id==='katon'),{desc:'Katon copiado com o Sharingan: bola de fogo que explode no alvo, causando queimadura.'}),
 {id:'raikiri',anim:'chidori',name:'Raikiri',cost:3,col:'#7fd4ff',desc:'Relâmpagos concentrados na mão: a técnica que corta o raio. Dano alto e fatality.',live:true,
  icon:SASUKE_JUTSUS[0].icon},
 (()=>{const g0=SASUKE_JUTSUS.find(c=>c.id==='genjutsu');return Object.assign({},g0,{name:'Genjutsu (Sharingan)',desc:'Prende o alvo numa ilusão: 14 de dano e ele perde o próximo turno. Só 1 uso por batalha.',ok:()=>!genK,onUse:()=>{g0.onUse();genK=true;}});})(),
 SASUKE_JUTSUS.find(c=>c.id==='copy'),
 SASUKE_JUTSUS.find(c=>c.id==='cop_rasengan'),
 SASUKE_JUTSUS.find(c=>c.id==='cop_bunshin')];
portrait('ptKa',SASUKE,mk({red:1,expr:1,hr:.05}));

/* ---------- Suiton (jutsus raros do Kakashi, liberados sozinhos por nivel) ---------- */
let wallS=false; /* Parede de Agua ativa: o proximo dano cai 80% */
const SUI_SEAL=mk({tilt:.05,crouch:6,lean:1,fbx:-9,ffx:7,hxF:2,hyF:-13,hxB:3,hyB:9,hr:.12,hdy:2,expr:2,tw:.9,hF:3});
const WATER_COL=['#1c5fb8','#2f86e6','#6cc0ff','#d8f0ff'];
/* Parede de Agua: sobe uma cortina de agua na frente dele */
function suijinhekiFX(c){const {f,t,time,sx0}=c,up=scaleAt(0,1,1.0,1.7,t),dn=scaleAt(0,1,2.7,3.3,t),k=up*(1-dn);if(k<=0)return;
 const x0=sx0+16,h=62*k;f.save();
 const gr=f.createLinearGradient(0,GY-h,0,GY);gr.addColorStop(0,'rgba(160,215,255,.55)');gr.addColorStop(.5,'rgba(60,140,235,.62)');gr.addColorStop(1,'rgba(20,80,180,.75)');
 f.fillStyle=gr;f.beginPath();f.moveTo(x0-9,GY);for(let i=0;i<=18;i++){const u=i/18,x=x0-9+u*18;f.lineTo(x,GY-h+Math.sin(time*7+u*9)*2.2*k);}f.lineTo(x0+9,GY);f.closePath();f.fill();
 f.strokeStyle=`rgba(225,245,255,${.8*k})`;f.lineWidth=.7;for(let i=0;i<5;i++){f.beginPath();for(let q=0;q<=10;q++){const y=GY-h*(q/10),x=x0-6+i*3+Math.sin(time*6+q*.9+i)*1.4;q?f.lineTo(x,y):f.moveTo(x,y);}f.stroke();}
 f.globalCompositeOperation='lighter';const r2=R(55);for(let i=0;i<20;i++){const ph=(time*.8+r2())%1;f.fillStyle=`rgba(200,235,255,${(1-ph)*k})`;f.fillRect(Math.round(x0+(r2()-.5)*20),Math.round(GY-ph*h),1,1);}
 ringFX(f,x0,GY-2,10+16*up,1.2,`rgba(150,210,255,${.7*k})`);f.restore();}
ANIMS.suijinheki={dur:3.6,hold:1.5,hitT:1.5,dmg:0,cost:18,noLift:true,
 sP:[[0,READY],[.4,READY],[.7,SUI_SEAL],[1.3,SUI_SEAL],[1.6,READY],[3.6,READY]],
 nP:[[0,N_READY],[3.6,N_READY]],nX:[[0,288],[3.6,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.5,{z:1.04,cx:192,cy:116}],[.9,{z:1.7,cx:135,cy:124}],[2.4,{z:1.5,cx:150,cy:124}],[3.2,{z:1.04,cx:192,cy:116}],[3.6,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const k=scaleAt(0,1,.6,1.0,t)*(1-scaleAt(0,1,2.6,3.2,t)),E={dim:.2*k,tint:`rgba(10,40,90,${.22*k})`};if(t>1.0&&t<1.4)E.shk=2.5*(1-(t-1)/.4);return E;},
 fx:c=>suijinhekiFX(c)};

/* Dragao de Agua: o corpo e a trilha do caminho da cabeca (arco do Kakashi ate o inimigo), com ondulacao */
function dragonPath(tau,x0,x1,time){const e=tau*tau*(3-2*tau);return[x0+(x1-x0)*e+Math.sin(tau*9+time*5)*1.6,GY-26-Math.sin(tau*Math.PI)*34+Math.cos(tau*7+time*4)*2.2];}
function suiryudanFX(c){const {f,t,time,sx0,nx0}=c,x0=sx0+12,x1=nx0-8,hitAt=2.3;
 /* agua juntando e sendo moldada */
 const g=scaleAt(0,1,.7,1.3,t)*(1-scaleAt(0,1,1.4,1.8,t));
 if(g>0){f.save();f.globalCompositeOperation='lighter';orb(f,x0,GY-28,18*g,[[0,'rgba(190,230,255,.55)'],[1,'rgba(30,110,230,0)']]);const r2=R(8);for(let i=0;i<24;i++){const a=r2()*TAU+time*3,rr=(6+r2()*22)*(1-g*.4);f.fillStyle=`rgba(150,210,255,${.7*g})`;f.fillRect(Math.round(x0+Math.cos(a)*rr),Math.round(GY-28+Math.sin(a)*rr*.7),1,1);}f.restore();}
 const tauH=scaleAt(0,1,1.2,hitAt,t);if(tauH<=0||t>3.6)return;
 const fade=1-scaleAt(0,1,hitAt+.1,hitAt+.7,t),N=26,lag=.5;
 f.save();
 for(let i=N;i>=0;i--){const s=i/N,tau=Math.max(0,tauH-s*lag),[px,py]=dragonPath(tau,x0,x1,time),r=(7.2*Math.pow(1-s,.55)+1.4)*(.4+.6*scaleAt(0,1,0,.3,tauH))*(.35+.65*fade);
  f.globalAlpha=fade*.96;f.fillStyle=WATER_COL[0];f.beginPath();f.arc(px,py,r,0,TAU);f.fill();
  f.fillStyle=WATER_COL[1];f.beginPath();f.arc(px-.5,py-r*.25,r*.78,0,TAU);f.fill();
  f.fillStyle=WATER_COL[2];f.beginPath();f.arc(px-r*.2,py-r*.45,r*.4,0,TAU);f.fill();
  if(i%4===0){f.fillStyle=WATER_COL[3];f.fillRect(Math.round(px-r*.4),Math.round(py-r*.7),2,1);}}
 /* cabeca de dragao: focinho, chifres, olho e mandibula aberta */
 const [hx,hy]=dragonPath(tauH,x0,x1,time),[bx,by]=dragonPath(Math.max(0,tauH-.04),x0,x1,time),ang=Math.atan2(hy-by,hx-bx),hr=9*(.4+.6*scaleAt(0,1,0,.3,tauH))*(.35+.65*fade);
 f.globalAlpha=fade;f.translate(hx,hy);f.rotate(ang);
 f.fillStyle=WATER_COL[0];f.beginPath();f.moveTo(-hr,-hr*.7);f.lineTo(hr*1.5,-hr*.25);f.lineTo(hr*1.7,0);f.lineTo(hr*.2,hr*.15);f.lineTo(-hr,hr*.8);f.closePath();f.fill();
 f.fillStyle=WATER_COL[1];f.beginPath();f.moveTo(-hr*.8,-hr*.6);f.lineTo(hr*1.4,-hr*.22);f.lineTo(hr*.1,0);f.closePath();f.fill();
 f.fillStyle=WATER_COL[0];f.beginPath();f.moveTo(hr*.1,hr*.2);f.lineTo(hr*1.4,hr*.45);f.lineTo(hr*1.1,hr*.75);f.lineTo(-hr*.6,hr*.6);f.closePath();f.fill();
 f.fillStyle=WATER_COL[3];for(let i=0;i<4;i++)f.fillRect(Math.round(hr*(.35+i*.28)),Math.round(hr*.12),1,2);
 f.strokeStyle=WATER_COL[2];f.lineWidth=1.1;f.beginPath();f.moveTo(-hr*.4,-hr*.7);f.lineTo(-hr*1.4,-hr*1.4);f.moveTo(0,-hr*.6);f.lineTo(-hr*.7,-hr*1.5);f.stroke();
 f.fillStyle='#fff';f.fillRect(Math.round(hr*.15),Math.round(-hr*.38),2,2);f.fillStyle='#0a2a5a';f.fillRect(Math.round(hr*.15+1),Math.round(-hr*.38),1,1);
 f.restore();
 /* impacto: explosao de agua, anel e gotas */
 const a=t-hitAt;if(a>=0&&a<1.0){const k=a/1.0;f.save();f.globalCompositeOperation='lighter';orb(f,x1,GY-34,44*(1-k*.5),[[0,`rgba(230,248,255,${.8*(1-k)})`],[.4,`rgba(80,170,255,${.5*(1-k)})`],[1,'rgba(20,80,200,0)']]);
  ringFX(f,x1,GY-34,6+80*(1-(1-k)*(1-k)),2.6*(1-k)+.2,`rgba(190,230,255,${1-k})`);ringFX(f,x1,GY-3,4+70*k,1.8*(1-k)+.2,`rgba(150,210,255,${.8*(1-k)})`);f.restore();
  const r2=R(91);for(let i=0;i<26;i++){const ang2=-Math.PI*(.1+r2()*.8),sp=30+r2()*50,x=x1+Math.cos(ang2)*sp*k*(r2()<.5?-1:1),y=GY-30+Math.sin(ang2)*sp*k+k*k*60;f.fillStyle=`rgba(${160+(r2()*70|0)},${210+(r2()*40|0)},255,${1-k})`;f.fillRect(Math.round(x),Math.round(y),2,2);}}}
ANIMS.suiryudan={dur:4.2,hold:2.3,hitT:2.3,dmg:36,cost:30,noLift:true,
 sP:[[0,READY],[.4,READY],[.7,SUI_SEAL],[1.5,SUI_SEAL],[1.75,READY],[2.6,READY],[4.2,READY]],
 nP:[[0,N_READY],[2.2,N_READY],[2.3,N_HIT],[2.9,N_STAG],[3.6,N_READY],[4.2,N_READY]],
 nX:[[0,288],[2.28,288],[2.5,304],[3.0,298],[3.8,288],[4.2,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.8,{z:1.9,cx:120,cy:124}],[1.4,{z:1.5,cx:150,cy:122}],[1.9,{z:1.15,cx:210,cy:116}],[2.3,{z:1.55,cx:262,cy:128}],[3.0,{z:1.3,cx:240,cy:124}],[3.7,{z:1.04,cx:192,cy:116}],[4.2,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const a=t-2.3,k=scaleAt(0,1,.5,1.0,t)*(1-scaleAt(0,1,3.0,3.8,t)),E={dim:.2*k,tint:`rgba(10,40,100,${.25*k})`};if(a>0&&a<.6)E.shk=9*(1-a/.6);if(a>=0&&a<.04)E.flash=.5;return E;},
 fx:c=>suiryudanFX(c)};

KAKASHI_JUTSUS.push(
 {id:'suijinheki',name:'Suiton: Suijinheki',cost:18,col:'#6cc0ff',desc:'Parede de Água: absorve 80% do próximo dano que receber.',live:true,ok:()=>!wallS,onUse:()=>{wallS=true;later(1700,()=>toast('Parede de água erguida: o próximo golpe é quase todo absorvido'));}},
 {id:'suiryudan',name:'Suiton: Suiryūdan no Jutsu',cost:30,col:'#2f86e6',desc:'Molda a água em um dragão que devora o inimigo (36 de dano).',live:true,shout:'Suiton: Suiryūdan no Jutsu!'});
