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
/* Parede de Agua: cortina de agua na frente dele. Fica de pe (wallShow) ate o inimigo acertar; ai estoura em gotas (wallBreakT) */
let wallShow=false,wallBreakT=-9,wallBreakX=0;
function wallDraw(f,x0,k,time){const h=64*k;if(h<=0)return;f.save();
 const gr=f.createLinearGradient(0,GY-h,0,GY);gr.addColorStop(0,'rgba(170,222,255,.6)');gr.addColorStop(.5,'rgba(60,140,235,.66)');gr.addColorStop(1,'rgba(20,80,180,.8)');
 f.fillStyle=gr;f.beginPath();f.moveTo(x0-10,GY);for(let i=0;i<=18;i++){const u=i/18;f.lineTo(x0-10+u*20,GY-h+Math.sin(time*7+u*9)*2.2*k);}f.lineTo(x0+10,GY);f.closePath();f.fill();
 f.strokeStyle=`rgba(225,245,255,${.8*k})`;f.lineWidth=.7;for(let i=0;i<5;i++){f.beginPath();for(let q=0;q<=10;q++){const y=GY-h*(q/10),x=x0-7+i*3.5+Math.sin(time*6+q*.9+i)*1.4;q?f.lineTo(x,y):f.moveTo(x,y);}f.stroke();}
 f.strokeStyle=`rgba(255,255,255,${.9*k})`;f.lineWidth=1;f.beginPath();for(let i=0;i<=18;i++){const u=i/18,x=x0-10+u*20,y=GY-h+Math.sin(time*7+u*9)*2.2*k;i?f.lineTo(x,y):f.moveTo(x,y);}f.stroke();
 f.globalCompositeOperation='lighter';const r2=R(55);for(let i=0;i<20;i++){const ph=(time*.8+r2())%1;f.fillStyle=`rgba(200,235,255,${(1-ph)*k})`;f.fillRect(Math.round(x0+(r2()-.5)*22),Math.round(GY-ph*h),1,1);}
 ringFX(f,x0,GY-2,14,1.2,`rgba(150,210,255,${.6*k})`);f.restore();}
function suijinhekiFX(c){const {f,t,time,sx0}=c;wallDraw(f,sx0+16,scaleAt(0,1,1.0,1.7,t),time);
 if(t>1.0&&t<1.6){const k=(t-1)/.6;f.save();f.globalCompositeOperation='lighter';ringFX(f,sx0+16,GY-2,8+40*k,2*(1-k)+.2,`rgba(160,215,255,${1-k})`);f.restore();}}
/* parede parada no cenario enquanto o inimigo nao ataca, e o estouro quando ela e atingida */
function wallStatic(c){const {f,time}=c,now=performance.now()/1000;
 if(wallShow)wallDraw(f,wallBreakX,1,time);
 const a=now-wallBreakT;if(a>=0&&a<.8){const k=a/.8;f.save();f.globalCompositeOperation='lighter';orb(f,wallBreakX,GY-34,34*(1-k*.5),[[0,`rgba(230,248,255,${.7*(1-k)})`],[1,'rgba(40,120,230,0)']]);ringFX(f,wallBreakX,GY-34,6+50*k,2*(1-k)+.2,`rgba(190,230,255,${1-k})`);f.restore();
  const r2=R(17);for(let i=0;i<30;i++){const an=-Math.PI*(.05+r2()*.9),sp=22+r2()*46,x=wallBreakX+Math.cos(an)*sp*k*(r2()<.5?-1:1),y=GY-30+Math.sin(an)*sp*k+k*k*55;f.fillStyle=`rgba(${160+(r2()*70|0)},${210+(r2()*40|0)},255,${1-k})`;f.fillRect(Math.round(x),Math.round(y),2,2);}}}
ANIMS.suijinheki={dur:3.6,hold:1.5,hitT:1.5,dmg:0,cost:18,noLift:true,
 sP:[[0,READY],[.4,READY],[.7,SUI_SEAL],[1.3,SUI_SEAL],[1.6,READY],[3.6,READY]],
 nP:[[0,N_READY],[3.6,N_READY]],nX:[[0,288],[3.6,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.5,{z:1.04,cx:192,cy:116}],[.9,{z:1.7,cx:135,cy:124}],[2.4,{z:1.5,cx:150,cy:124}],[3.2,{z:1.04,cx:192,cy:116}],[3.6,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const k=scaleAt(0,1,.6,1.0,t)*(1-scaleAt(0,1,2.6,3.2,t)),E={dim:.2*k,tint:`rgba(10,40,90,${.22*k})`};if(t>1.0&&t<1.4)E.shk=2.5*(1-(t-1)/.4);return E;},
 fx:c=>suijinhekiFX(c)};

/* Dragao de Agua: espinha com onda lateral, corpo em fita (casca escura, miolo claro, barriga, escamas e nadadeiras), cabeca com chifres, bigodes e mandibula, coluna de agua na origem e onda que desaba no alvo */
function dragonSpine(tauH,x0,x1,time,N,lag){const P=[];for(let i=0;i<=N;i++){const s=i/N,tau=Math.max(0,tauH-s*lag),e=tau*tau*(3-2*tau);
  const x=x0+(x1-x0)*e,y=GY-22-Math.sin(tau*Math.PI)*50,w=Math.sin(s*11-time*8)*3.4*Math.min(1,s*6)*(1-.35*tau);P.push([x,y+w]);}return P;}
function dragonR(s){return s<.1?5+s/.1*5.5:10.5*Math.pow(1-(s-.1)/.9,.75)+1.1;}
function suiryudanFX(c){const {f,t,time,sx0,nx0}=c,x0=sx0+12,x1=nx0-8,hitAt=2.3;
 /* coluna de agua em espiral subindo no Kakashi */
 const col=scaleAt(0,1,.7,1.2,t)*(1-scaleAt(0,1,1.6,2.1,t));
 if(col>0){f.save();for(let r=0;r<6;r++){const ph=(time*1.1+r/6)%1,y=GY-ph*54,rw=(6+8*Math.sin(ph*Math.PI))*col;f.strokeStyle=`rgba(${120+r*14},${190+r*8},255,${(1-ph)*.85*col})`;f.lineWidth=1.3;f.beginPath();f.ellipse(x0,y,rw,rw*.28,0,0,TAU);f.stroke();}
  f.globalCompositeOperation='lighter';orb(f,x0,GY-26,22*col,[[0,'rgba(190,230,255,.45)'],[1,'rgba(30,110,230,0)']]);const r2=R(8);for(let i=0;i<26;i++){const a=r2()*TAU+time*3,rr=(4+r2()*20)*(1-col*.3);f.fillStyle=`rgba(170,220,255,${.7*col})`;f.fillRect(Math.round(x0+Math.cos(a)*rr),Math.round(GY-8-r2()*40+Math.sin(a)*3),1,1);}f.restore();}
 const tauH=scaleAt(0,1,1.15,hitAt,t);if(tauH<=0||t>3.7)return;
 const fade=1-scaleAt(0,1,hitAt+.05,hitAt+.55,t),N=64,P=dragonSpine(tauH,x0,x1,time,N,.5);if(fade<=0)return;
 const grow=.45+.55*scaleAt(0,1,0,.25,tauH),sc=grow*(.4+.6*fade),nrm=[];
 for(let i=0;i<=N;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(N,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const L=Math.hypot(dx,dy)||1;let nx=-dy/L,ny=dx/L;if(ny>0){nx=-nx;ny=-ny;}nrm.push([nx,ny]);}
 const edge=(k0,k1,o)=>{const A=[],B=[];for(let i=0;i<=N;i++){const r=dragonR(i/N)*sc,[nx,ny]=nrm[i];A.push([P[i][0]+nx*r*k0,P[i][1]+ny*r*k0]);B.push([P[i][0]+nx*r*k1,P[i][1]+ny*r*k1]);}return A.concat(B.reverse());};
 const poly=(pts,fill,stroke)=>{f.beginPath();pts.forEach((q,i)=>i?f.lineTo(q[0],q[1]):f.moveTo(q[0],q[1]));f.closePath();f.fillStyle=fill;f.fill();if(stroke){f.strokeStyle=stroke;f.lineWidth=.8;f.stroke();}};
 f.save();f.globalAlpha=fade;
 /* nadadeiras dorsais (atras do corpo) */
 f.fillStyle='#1c5fb8';for(let i=6;i<N-4;i+=4){const r=dragonR(i/N)*sc,[nx,ny]=nrm[i],[px,py]=P[i];f.beginPath();f.moveTo(px+nx*r*.8-2,py+ny*r*.8);f.lineTo(px+nx*(r+5*sc)+2.5,py+ny*(r+5*sc)-1);f.lineTo(px+nx*r*.8+2.5,py+ny*r*.8+1);f.closePath();f.fill();}
 poly(edge(1,-1),'#1d63bd','#0c3a80');
 poly(edge(.8,-.2),'#3392ee');
 poly(edge(-.25,-.85),'#9fd8ff');
 f.strokeStyle='rgba(230,248,255,.9)';f.lineWidth=.9;f.beginPath();for(let i=0;i<=N;i++){const r=dragonR(i/N)*sc*.72,[nx,ny]=nrm[i],x=P[i][0]+nx*r,y=P[i][1]+ny*r;i?f.lineTo(x,y):f.moveTo(x,y);}f.stroke();
 f.strokeStyle='rgba(235,250,255,.4)';f.lineWidth=.6;for(let i=5;i<N-2;i+=3){const r=dragonR(i/N)*sc,[nx,ny]=nrm[i],[px,py]=P[i];f.beginPath();f.moveTo(px+nx*r*.7,py+ny*r*.7);f.quadraticCurveTo(px+nx*r*.1+1.5,py+ny*r*.1,px-nx*r*.5,py-ny*r*.5);f.stroke();}
 /* cabeca */
 const hd=P[0],nk=P[3],ang=Math.atan2(hd[1]-nk[1],hd[0]-nk[0]),hr=13*sc,open=Math.max(0,(.55+.25*Math.sin(time*7))*(1-scaleAt(0,1,hitAt-.35,hitAt,t)));
 f.translate(hd[0],hd[1]);f.rotate(ang);
 /* bigodes de agua */
 f.strokeStyle='rgba(190,232,255,.9)';f.lineWidth=.9;for(let w=0;w<2;w++){f.beginPath();f.moveTo(hr*.9,(w?1:-1)*hr*.12);f.bezierCurveTo(hr*1.6,(w?1:-1)*hr*(.8+Math.sin(time*6+w)*.2),hr*.4,(w?1:-1)*hr*1.5,-hr*1.2,(w?1:-1)*hr*(1.2+Math.sin(time*5+w)*.4));f.stroke();}
 /* juba/espinhos */
 f.fillStyle='#8fd0ff';for(let q=0;q<5;q++){f.beginPath();f.moveTo(-hr*(.2+q*.28),-hr*.62);f.lineTo(-hr*(.7+q*.28),-hr*(1.05+q*.06));f.lineTo(-hr*(.45+q*.28),-hr*.5);f.closePath();f.fill();}
 /* mandibula de baixo, cranio e mandibula de cima */
 f.save();f.rotate(open*.5);f.fillStyle='#1d63bd';f.strokeStyle='#0c3a80';f.lineWidth=.7;f.beginPath();f.moveTo(-hr*.5,hr*.1);f.lineTo(hr*1.55,hr*.2);f.lineTo(hr*1.4,hr*.55);f.lineTo(-hr*.3,hr*.75);f.closePath();f.fill();f.stroke();
 f.fillStyle='#fff';for(let q=0;q<4;q++){f.beginPath();f.moveTo(hr*(.5+q*.28),hr*.2);f.lineTo(hr*(.58+q*.28),-hr*.12);f.lineTo(hr*(.66+q*.28),hr*.2);f.closePath();f.fill();}f.restore();
 f.fillStyle='#1d63bd';f.strokeStyle='#0c3a80';f.lineWidth=.7;f.beginPath();f.moveTo(-hr*.9,-hr*.65);f.lineTo(hr*.6,-hr*.7);f.lineTo(hr*1.9,-hr*.25);f.lineTo(hr*1.75,hr*.02);f.lineTo(hr*.2,hr*.05);f.lineTo(-hr*.9,hr*.6);f.closePath();f.fill();f.stroke();
 f.fillStyle='#3392ee';f.beginPath();f.moveTo(-hr*.7,-hr*.55);f.lineTo(hr*.6,-hr*.6);f.lineTo(hr*1.7,-hr*.28);f.lineTo(hr*.2,-hr*.2);f.closePath();f.fill();
 f.fillStyle='#fff';for(let q=0;q<4;q++){f.beginPath();f.moveTo(hr*(.7+q*.28),hr*.03);f.lineTo(hr*(.78+q*.28),hr*.3);f.lineTo(hr*(.86+q*.28),hr*.03);f.closePath();f.fill();}
 f.fillStyle='#0a2a5a';f.fillRect(Math.round(hr*1.7),Math.round(-hr*.18),2,1);
 /* chifres */
 f.strokeStyle='#cfeaff';f.lineWidth=1.3;f.beginPath();f.moveTo(-hr*.2,-hr*.7);f.quadraticCurveTo(-hr*.7,-hr*1.4,-hr*1.5,-hr*1.2);f.moveTo(hr*.2,-hr*.72);f.quadraticCurveTo(-hr*.2,-hr*1.6,-hr*.9,-hr*1.7);f.stroke();
 /* olho */
 f.fillStyle='#fff7c0';f.beginPath();f.ellipse(hr*.35,-hr*.38,hr*.2,hr*.14,-.25,0,TAU);f.fill();f.fillStyle='#0a2a5a';f.fillRect(Math.round(hr*.4),Math.round(-hr*.42),1.5,2);
 f.restore();
 /* espuma e gotas soltas pelo corpo */
 f.save();f.globalCompositeOperation='lighter';const r3=R(123);for(let i=0;i<46;i++){const k=Math.floor(r3()*N),[px,py]=P[k],ph=(time*1.4+r3())%1;f.fillStyle=`rgba(200,236,255,${(1-ph)*.8*fade})`;f.fillRect(Math.round(px-ph*10*(r3()+.3)),Math.round(py-ph*8+ph*ph*20+(r3()-.5)*8),1+(i%3===0?1:0),1);}f.restore();
 /* impacto: onda que desaba, brilho, aneis e gotas */
 const a=t-hitAt;if(a>=0&&a<1.1){const k=a/1.1,h=58*Math.sin(Math.PI*Math.min(1,Math.pow(k/.7,.8)))*(k<.7?1:Math.max(0,1-(k-.7)/.3));
  if(h>0){f.save();f.globalAlpha=Math.min(1,(1-k)*1.6);const gr=f.createLinearGradient(0,GY-h,0,GY);gr.addColorStop(0,'rgba(200,236,255,.85)');gr.addColorStop(.4,'rgba(60,150,240,.8)');gr.addColorStop(1,'rgba(20,80,190,.85)');f.fillStyle=gr;f.beginPath();f.moveTo(x1-40,GY);for(let u=0;u<=20;u++){const q=u/20,yy=GY-h*Math.pow(Math.sin(Math.PI*q),.8)*(1+.12*Math.sin(q*14+time*10));f.lineTo(x1-40+q*80+(q<.5?-1:1)*Math.sin(q*Math.PI)*10*k,yy);}f.lineTo(x1+40,GY);f.closePath();f.fill();
   f.strokeStyle='rgba(255,255,255,.9)';f.lineWidth=1.2;f.beginPath();for(let u=0;u<=20;u++){const q=u/20,yy=GY-h*Math.pow(Math.sin(Math.PI*q),.8);u?f.lineTo(x1-40+q*80,yy):f.moveTo(x1-40,yy);}f.stroke();f.restore();}
  f.save();f.globalCompositeOperation='lighter';orb(f,x1,GY-34,46*(1-k*.5),[[0,`rgba(230,248,255,${.8*(1-k)})`],[.4,`rgba(80,170,255,${.5*(1-k)})`],[1,'rgba(20,80,200,0)']]);
  ringFX(f,x1,GY-34,6+84*(1-(1-k)*(1-k)),2.6*(1-k)+.2,`rgba(190,230,255,${1-k})`);ringFX(f,x1,GY-3,4+76*k,1.8*(1-k)+.2,`rgba(150,210,255,${.8*(1-k)})`);f.restore();
  const r2=R(91);for(let i=0;i<34;i++){const ang2=-Math.PI*(.1+r2()*.8),sp=30+r2()*60,x=x1+Math.cos(ang2)*sp*k*(r2()<.5?-1:1),y=GY-30+Math.sin(ang2)*sp*k+k*k*64;f.fillStyle=`rgba(${160+(r2()*70|0)},${210+(r2()*40|0)},255,${1-k})`;f.fillRect(Math.round(x),Math.round(y),2,2);}}}
ANIMS.suiryudan={dur:4.2,hold:2.3,hitT:2.3,dmg:36,cost:30,noLift:true,
 sP:[[0,READY],[.4,READY],[.7,SUI_SEAL],[1.5,SUI_SEAL],[1.75,READY],[2.6,READY],[4.2,READY]],
 nP:[[0,N_READY],[2.2,N_READY],[2.3,N_HIT],[2.9,N_STAG],[3.6,N_READY],[4.2,N_READY]],
 nX:[[0,288],[2.28,288],[2.5,304],[3.0,298],[3.8,288],[4.2,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.8,{z:1.9,cx:120,cy:124}],[1.4,{z:1.5,cx:150,cy:122}],[1.9,{z:1.15,cx:210,cy:116}],[2.3,{z:1.55,cx:262,cy:128}],[3.0,{z:1.3,cx:240,cy:124}],[3.7,{z:1.04,cx:192,cy:116}],[4.2,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const a=t-2.3,k=scaleAt(0,1,.5,1.0,t)*(1-scaleAt(0,1,3.0,3.8,t)),E={dim:.2*k,tint:`rgba(10,40,100,${.25*k})`};if(a>0&&a<.6)E.shk=9*(1-a/.6);if(a>=0&&a<.04)E.flash=.5;return E;},
 fx:c=>suiryudanFX(c)};

KAKASHI_JUTSUS.push(
 {id:'suijinheki',name:'Suiton: Suijinheki',cost:18,col:'#6cc0ff',desc:'Parede de Água: fica de pé até o inimigo atacar e absorve 80% do dano desse golpe.',live:true,ok:()=>!wallS,onUse:()=>{wallS=true;wallShow=true;wallBreakX=96+16;later(1700,()=>toast('Parede de água erguida: fica de pé até o inimigo atacar'));}},
 {id:'suiryudan',name:'Suiton: Suiryūdan no Jutsu',cost:30,col:'#2f86e6',desc:'Molda a água em um dragão que devora o inimigo (36 de dano).',live:true,shout:'Suiton: Suiryūdan no Jutsu!'});
