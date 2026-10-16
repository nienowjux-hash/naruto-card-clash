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
/* as defesas ficam FIXAS no cenario (nao seguem o Kakashi quando ele avanca para atacar) */
const WALL_X=112,STONE_X=118;
let wallShow=false,wallBreakT=-9,wallBreakX=WALL_X;
function wallDraw(f,x0,k,time){const h=64*k;if(h<=0)return;f.save();
 const gr=f.createLinearGradient(0,GY-h,0,GY);gr.addColorStop(0,'rgba(170,222,255,.6)');gr.addColorStop(.5,'rgba(60,140,235,.66)');gr.addColorStop(1,'rgba(20,80,180,.8)');
 f.fillStyle=gr;f.beginPath();f.moveTo(x0-10,GY);for(let i=0;i<=18;i++){const u=i/18;f.lineTo(x0-10+u*20,GY-h+Math.sin(time*7+u*9)*2.2*k);}f.lineTo(x0+10,GY);f.closePath();f.fill();
 f.strokeStyle=`rgba(225,245,255,${.8*k})`;f.lineWidth=.7;for(let i=0;i<5;i++){f.beginPath();for(let q=0;q<=10;q++){const y=GY-h*(q/10),x=x0-7+i*3.5+Math.sin(time*6+q*.9+i)*1.4;q?f.lineTo(x,y):f.moveTo(x,y);}f.stroke();}
 f.strokeStyle=`rgba(255,255,255,${.9*k})`;f.lineWidth=1;f.beginPath();for(let i=0;i<=18;i++){const u=i/18,x=x0-10+u*20,y=GY-h+Math.sin(time*7+u*9)*2.2*k;i?f.lineTo(x,y):f.moveTo(x,y);}f.stroke();
 f.globalCompositeOperation='lighter';const r2=R(55);for(let i=0;i<20;i++){const ph=(time*.8+r2())%1;f.fillStyle=`rgba(200,235,255,${(1-ph)*k})`;f.fillRect(Math.round(x0+(r2()-.5)*22),Math.round(GY-ph*h),1,1);}
 ringFX(f,x0,GY-2,14,1.2,`rgba(150,210,255,${.6*k})`);f.restore();}
function suijinhekiFX(c){const {f,t,time}=c;wallDraw(f,WALL_X,scaleAt(0,1,1.0,1.7,t),time);
 if(t>1.0&&t<1.6){const k=(t-1)/.6;f.save();f.globalCompositeOperation='lighter';ringFX(f,WALL_X,GY-2,8+40*k,2*(1-k)+.2,`rgba(160,215,255,${1-k})`);f.restore();}}
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

/* selos de mao do Dragao de Agua: troca rapida de poses (SEAL_A/B/C, TIGER, SUI_SEAL) com o nome de cada selo piscando nas maos */
const SEAL_SEQ=[SEAL_A,SEAL_B,TIGER,SEAL_C,SEAL_A,SUI_SEAL,SEAL_B,TIGER,SEAL_C,SUI_SEAL];
const SEAL_NAMES=['丑','申','卯','子','亥','酉','午','辰','巳','寅'];
function sealPoses(t0,t1){const n=SEAL_SEQ.length,dt=(t1-t0)/n,L=[];for(let i=0;i<n;i++){L.push([+(t0+i*dt).toFixed(3),SEAL_SEQ[i]]);L.push([+(t0+(i+1)*dt-.01).toFixed(3),SEAL_SEQ[i]]);}return L;}
function sealFX(f,x,y,t,t0,t1,time,col){if(t<t0||t>t1+.25)return;const n=SEAL_NAMES.length,dt=(t1-t0)/n,i=Math.min(n-1,Math.floor((t-t0)/dt)),ph=Math.min(1,((t-t0)-i*dt)/dt),fade=t>t1?1-(t-t1)/.25:1;
 f.save();f.globalCompositeOperation='lighter';orb(f,x,y,12+6*(1-ph),[[0,`rgba(${col},${.8*fade*(1-ph*.5)})`],[1,`rgba(${col},0)`]]);
 f.globalCompositeOperation='source-over';f.font='bold 9px sans-serif';f.textAlign='center';f.fillStyle=`rgba(230,246,255,${fade*(1-ph*.6)})`;f.strokeStyle=`rgba(20,60,140,${fade})`;f.lineWidth=2;f.strokeText(SEAL_NAMES[i],x,y-12-ph*4);f.fillText(SEAL_NAMES[i],x,y-12-ph*4);
 ringFX(f,x,y,6+14*ph,1,`rgba(${col},${.7*(1-ph)*fade})`);f.restore();}
/* Dragao de Agua: espinha com onda lateral, corpo em fita (casca escura, miolo claro, barriga, escamas e nadadeiras), cabeca com chifres, bigodes e mandibula, coluna de agua na origem e onda que desaba no alvo */
function dragonSpine(tauH,x0,x1,time,N,lag,lift){lift=lift||0;const P=[];for(let i=0;i<=N;i++){const s=i/N,tau=Math.max(0,tauH-s*lag),e=tau*tau*(3-2*tau);
  const x=x0+(x1-x0)*e,y=GY-22-Math.sin(tau*Math.PI)*50-lift*tau*tau,w=Math.sin(s*9.5-time*7)*7.5*Math.min(1,s*5)*(1-.3*tau);P.push([x,y+w]);}return P;}
function dragonR(s){return s<.08?6.5+s/.08*5.5:12*Math.pow(1-(s-.08)/.92,.62)+1.4;}
function suiryudanFX(c,fat){const {f,t,time,sx0,nx0}=c,x0=sx0+12,x1=nx0-(fat?34:8),hitAt=2.3,lift=fat?fatLift(t)+26*scaleAt(0,1,2.3,3.0,t)*(1-scaleAt(0,1,FAT_POP,FAT_POP+.5,t)):0;
 sealFX(f,x0-3,GY-44,t,.62,1.5,time,'120,200,255');
 /* coluna de agua em espiral subindo no Kakashi */
 const col=scaleAt(0,1,.7,1.2,t)*(1-scaleAt(0,1,1.6,2.1,t));
 if(col>0){f.save();for(let r=0;r<6;r++){const ph=(time*1.1+r/6)%1,y=GY-ph*54,rw=(6+8*Math.sin(ph*Math.PI))*col;f.strokeStyle=`rgba(${120+r*14},${190+r*8},255,${(1-ph)*.85*col})`;f.lineWidth=1.3;f.beginPath();f.ellipse(x0,y,rw,rw*.28,0,0,TAU);f.stroke();}
  f.globalCompositeOperation='lighter';orb(f,x0,GY-26,22*col,[[0,'rgba(190,230,255,.45)'],[1,'rgba(30,110,230,0)']]);const r2=R(8);for(let i=0;i<26;i++){const a=r2()*TAU+time*3,rr=(4+r2()*20)*(1-col*.3);f.fillStyle=`rgba(170,220,255,${.7*col})`;f.fillRect(Math.round(x0+Math.cos(a)*rr),Math.round(GY-8-r2()*40+Math.sin(a)*3),1,1);}f.restore();}
 const tauH=scaleAt(0,1,1.15,hitAt,t);if(tauH<=0||t>(fat?5.7:3.7))return;
 const fade=fat?1-scaleAt(0,1,5.0,5.45,t):1-scaleAt(0,1,hitAt+.05,hitAt+.55,t),N=64,P=dragonSpine(tauH,x0,x1,time,N,.52,lift);if(fade<=0)return;
 const grow=.45+.55*scaleAt(0,1,0,.25,tauH),sc=grow*(.4+.6*fade),nrm=[];
 for(let i=0;i<=N;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(N,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const L=Math.hypot(dx,dy)||1;let nx=-dy/L,ny=dx/L;if(ny>0){nx=-nx;ny=-ny;}nrm.push([nx,ny]);}
 const edge=(k0,k1,o)=>{const A=[],B=[];for(let i=0;i<=N;i++){const r=dragonR(i/N)*sc,[nx,ny]=nrm[i];A.push([P[i][0]+nx*r*k0,P[i][1]+ny*r*k0]);B.push([P[i][0]+nx*r*k1,P[i][1]+ny*r*k1]);}return A.concat(B.reverse());};
 const poly=(pts,fill,stroke)=>{f.beginPath();pts.forEach((q,i)=>i?f.lineTo(q[0],q[1]):f.moveTo(q[0],q[1]));f.closePath();f.fillStyle=fill;f.fill();if(stroke){f.strokeStyle=stroke;f.lineWidth=.8;f.stroke();}};
 f.save();f.globalAlpha=fade;
 /* crina de agua ao longo do pescoco e do dorso (atras do corpo) */
 for(let i=2;i<N-6;i+=2){const r=dragonR(i/N)*sc,[nx,ny]=nrm[i],[px,py]=P[i],len=(15-i*.17)*sc,sw=Math.sin(time*6+i*.5)*1.6;f.fillStyle=i%4?'#2f86e6':'#8fd0ff';f.beginPath();f.moveTo(px+nx*r*.7-2.2,py+ny*r*.7);f.quadraticCurveTo(px+nx*(r+len*.6)-1+sw,py+ny*(r+len*.6)-1,px+nx*(r+len)-4.5+sw,py+ny*(r+len)+1);f.lineTo(px+nx*r*.7+2.2,py+ny*r*.7);f.closePath();f.fill();}
 /* ponta da cauda em penacho de agua */
 {const [tx,ty]=P[N],[ux,uy]=nrm[N];f.fillStyle='#2f86e6';for(let q=-2;q<=2;q++){f.beginPath();f.moveTo(tx,ty);f.quadraticCurveTo(tx-8*sc+q*1.4,ty+q*5*sc-4,tx-17*sc+Math.sin(time*7+q)*2,ty+q*7*sc+Math.cos(time*6+q)*2);f.quadraticCurveTo(tx-8*sc,ty+q*3*sc+3,tx,ty);f.fill();}}
 poly(edge(1,-1),'#1d63bd','#0c3a80');
 poly(edge(.8,-.2),'#3392ee');
 poly(edge(-.25,-.85),'#9fd8ff');
 f.strokeStyle='rgba(230,248,255,.9)';f.lineWidth=.9;f.beginPath();for(let i=0;i<=N;i++){const r=dragonR(i/N)*sc*.72,[nx,ny]=nrm[i],x=P[i][0]+nx*r,y=P[i][1]+ny*r;i?f.lineTo(x,y):f.moveTo(x,y);}f.stroke();
 f.strokeStyle='rgba(235,250,255,.4)';f.lineWidth=.6;for(let i=5;i<N-2;i+=3){const r=dragonR(i/N)*sc,[nx,ny]=nrm[i],[px,py]=P[i];f.beginPath();f.moveTo(px+nx*r*.7,py+ny*r*.7);f.quadraticCurveTo(px+nx*r*.1+1.5,py+ny*r*.1,px-nx*r*.5,py-ny*r*.5);f.stroke();}
 /* cabeca de dragao oriental: cranio com cenho, focinho longo com nariz bulboso, presas, lingua, barba, chifres curvos, juba e bigodes */
 const hd=P[0],nk=P[3],ang=Math.atan2(hd[1]-nk[1],hd[0]-nk[0]),hr=18*sc,open=Math.max(0,(.5+.22*Math.sin(time*7))*(1-scaleAt(0,1,hitAt-.35,hitAt,t))),sw=Math.sin(time*6);
 f.translate(hd[0],hd[1]);f.rotate(ang);f.lineJoin='round';
 const path=(pts,close)=>{f.beginPath();pts.forEach((q,i)=>i?f.lineTo(q[0]*hr,q[1]*hr):f.moveTo(q[0]*hr,q[1]*hr));if(close)f.closePath();};
 /* juba: mechas de agua que fluem para tras da nuca */
 for(let q=0;q<7;q++){const y0=-.7+q*.17;f.fillStyle=q%2?'#2f86e6':'#9fd8ff';f.beginPath();f.moveTo(-.5*hr,y0*hr);f.quadraticCurveTo(-1.5*hr,(y0-.5+sw*.12)*hr,-2.6*hr,(y0+.2+Math.sin(time*5+q)*.25)*hr);f.quadraticCurveTo(-1.5*hr,(y0+.25)*hr,-.5*hr,(y0+.2)*hr);f.closePath();f.fill();}
 /* barba pendurada no queixo */
 f.fillStyle='#9fd8ff';for(let q=0;q<3;q++){f.beginPath();f.moveTo((.3+q*.28)*hr,.7*hr);f.quadraticCurveTo((.15+q*.28)*hr,(1.3+q*.2)*hr,(-.2+q*.3+sw*.12)*hr,(1.9+q*.15)*hr);f.quadraticCurveTo((.45+q*.28)*hr,1.3*hr,(.5+q*.28)*hr,.7*hr);f.closePath();f.fill();}
 /* chifres grossos e curvos para tras, com aneis */
 for(const h of [[-.1,-.85,1],[.35,-.9,.8]]){const[x0,y0,k]=h;f.fillStyle='#eaf6ff';f.strokeStyle='#7fb2e8';f.lineWidth=.8;f.beginPath();f.moveTo(x0*hr,y0*hr);f.bezierCurveTo((x0-.5)*hr,(y0-.9*k)*hr,(x0-1.4)*hr,(y0-1.1*k)*hr,(x0-2.3*k)*hr,(y0-.7*k)*hr);f.bezierCurveTo((x0-1.4)*hr,(y0-.75*k)*hr,(x0-.7)*hr,(y0-.45)*hr,(x0+.35)*hr,(y0+.15)*hr);f.closePath();f.fill();f.stroke();
  f.strokeStyle='#9cc8f0';f.lineWidth=.7;for(let q=1;q<4;q++){f.beginPath();f.moveTo((x0-q*.45)*hr,(y0-.55*k*q*.55)*hr);f.lineTo((x0-q*.45+.05)*hr,(y0-.1-.3*k*q*.55)*hr);f.stroke();}}
 /* mandibula de baixo */
 f.save();f.rotate(open*.55);f.fillStyle='#1d63bd';f.strokeStyle='#0c3a80';f.lineWidth=.8;path([[-.55,.1],[.2,.12],[1.75,.2]]);f.bezierCurveTo(1.95*hr,.5*hr,1.4*hr,.72*hr,.6*hr,.8*hr);f.bezierCurveTo(-.1*hr,.95*hr,-.55*hr,.8*hr,-.55*hr,.1*hr);f.closePath();f.fill();f.stroke();
 f.fillStyle='#d94a6a';f.beginPath();f.moveTo(-.1*hr,.25*hr);f.bezierCurveTo(.6*hr,.12*hr,1.3*hr,.2*hr,1.6*hr,.15*hr);f.bezierCurveTo(1.3*hr,.4*hr,.5*hr,.45*hr,-.1*hr,.25*hr);f.closePath();f.fill();
 f.fillStyle='#fff';for(let q=0;q<4;q++){f.beginPath();f.moveTo((.6+q*.3)*hr,.2*hr);f.lineTo((.7+q*.3)*hr,-.1*hr);f.lineTo((.8+q*.3)*hr,.21*hr);f.closePath();f.fill();}f.restore();
 /* cranio + focinho */
 f.fillStyle='#1d63bd';f.strokeStyle='#0c3a80';f.lineWidth=.9;f.beginPath();f.moveTo(-.95*hr,-.45*hr);f.bezierCurveTo(-.7*hr,-.95*hr,-.1*hr,-1.0*hr,.35*hr,-.92*hr);f.bezierCurveTo(.7*hr,-.88*hr,.8*hr,-.62*hr,1.1*hr,-.62*hr);f.bezierCurveTo(1.6*hr,-.62*hr,2.0*hr,-.58*hr,2.3*hr,-.45*hr);f.bezierCurveTo(2.5*hr,-.35*hr,2.45*hr,-.1*hr,2.2*hr,-.05*hr);f.lineTo(1.8*hr,.08*hr);f.lineTo(.3*hr,.08*hr);f.bezierCurveTo(-.4*hr,.15*hr,-.95*hr,.35*hr,-.95*hr,-.45*hr);f.closePath();f.fill();f.stroke();
 f.fillStyle='#3392ee';f.beginPath();f.moveTo(-.7*hr,-.5*hr);f.bezierCurveTo(-.4*hr,-.82*hr,.3*hr,-.82*hr,.7*hr,-.7*hr);f.bezierCurveTo(1.3*hr,-.56*hr,1.9*hr,-.5*hr,2.2*hr,-.4*hr);f.bezierCurveTo(1.4*hr,-.35*hr,.4*hr,-.3*hr,-.7*hr,-.15*hr);f.closePath();f.fill();
 /* cenho (ruga acima do olho) e nariz bulboso com narina */
 f.strokeStyle='#cfeaff';f.lineWidth=1.1;f.beginPath();f.moveTo(.1*hr,-.78*hr);f.bezierCurveTo(.5*hr,-.95*hr,.9*hr,-.78*hr,1.15*hr,-.6*hr);f.stroke();
 f.fillStyle='#2a78d0';f.beginPath();f.arc(2.18*hr,-.36*hr,.24*hr,0,TAU);f.fill();f.strokeStyle='#0c3a80';f.lineWidth=.7;f.stroke();f.fillStyle='#071e44';f.beginPath();f.ellipse(2.25*hr,-.4*hr,.07*hr,.045*hr,-.4,0,TAU);f.fill();
 /* presas grandes na frente e dentes menores */
 f.fillStyle='#fff';for(const [x,l] of [[1.95,.5],[1.5,.38]]){f.beginPath();f.moveTo(x*hr,.05*hr);f.lineTo((x+.1)*hr,(.05+l)*hr);f.lineTo((x+.2)*hr,.05*hr);f.closePath();f.fill();}
 for(let q=0;q<3;q++){f.beginPath();f.moveTo((.5+q*.28)*hr,.07*hr);f.lineTo((.58+q*.28)*hr,.3*hr);f.lineTo((.66+q*.28)*hr,.07*hr);f.closePath();f.fill();}
 /* olho feroz amendoado, com brilho e pupila em fenda */
 f.fillStyle='#071e44';f.beginPath();f.moveTo(.15*hr,-.3*hr);f.quadraticCurveTo(.55*hr,-.62*hr,1.0*hr,-.36*hr);f.quadraticCurveTo(.6*hr,-.22*hr,.15*hr,-.3*hr);f.closePath();f.fill();
 f.fillStyle='#ffe85a';f.beginPath();f.moveTo(.22*hr,-.31*hr);f.quadraticCurveTo(.55*hr,-.55*hr,.93*hr,-.37*hr);f.quadraticCurveTo(.6*hr,-.27*hr,.22*hr,-.31*hr);f.closePath();f.fill();
 f.fillStyle='#8a1010';f.fillRect(Math.round(.58*hr),Math.round(-.5*hr),1.6,Math.max(2,Math.round(.2*hr)));f.fillStyle='#fff';f.fillRect(Math.round(.7*hr),Math.round(-.44*hr),1,1);
 f.strokeStyle='#04183a';f.lineWidth=1.3;f.beginPath();f.moveTo(.0*hr,-.45*hr);f.lineTo(1.05*hr,-.36*hr);f.stroke();
 /* escamas da bochecha */
 f.strokeStyle='rgba(220,244,255,.55)';f.lineWidth=.6;for(let q=0;q<3;q++)for(let r=0;r<2;r++){f.beginPath();f.arc((-.5+q*.28)*hr,(-.1+r*.22)*hr,.1*hr,Math.PI*.1,Math.PI*.9);f.stroke();}
 /* bigodes longos de agua */
 f.strokeStyle='rgba(205,238,255,.95)';f.lineWidth=1;for(let w=0;w<2;w++){const m=w?1:-1;f.beginPath();f.moveTo(1.9*hr,m*.08*hr-.25*hr);f.bezierCurveTo(2.4*hr,(m*.7-.25+sw*.2)*hr,.6*hr,(m*1.6)*hr,-1.6*hr,(m*1.3+Math.sin(time*5+w)*.5)*hr);f.stroke();}
 f.restore();
 /* espuma e gotas soltas pelo corpo */
 f.save();f.globalCompositeOperation='lighter';const r3=R(123);for(let i=0;i<46;i++){const k=Math.floor(r3()*N),[px,py]=P[k],ph=(time*1.4+r3())%1;f.fillStyle=`rgba(200,236,255,${(1-ph)*.8*fade})`;f.fillRect(Math.round(px-ph*10*(r3()+.3)),Math.round(py-ph*8+ph*ph*20+(r3()-.5)*8),1+(i%3===0?1:0),1);}f.restore();
 /* impacto: onda que desaba, brilho, aneis e gotas */
 const a=fat?-1:t-hitAt;if(a>=0&&a<1.1){const k=a/1.1,h=58*Math.sin(Math.PI*Math.min(1,Math.pow(k/.7,.8)))*(k<.7?1:Math.max(0,1-(k-.7)/.3));
  if(h>0){f.save();f.globalAlpha=Math.min(1,(1-k)*1.6);const gr=f.createLinearGradient(0,GY-h,0,GY);gr.addColorStop(0,'rgba(200,236,255,.85)');gr.addColorStop(.4,'rgba(60,150,240,.8)');gr.addColorStop(1,'rgba(20,80,190,.85)');f.fillStyle=gr;f.beginPath();f.moveTo(x1-40,GY);for(let u=0;u<=20;u++){const q=u/20,yy=GY-h*Math.pow(Math.sin(Math.PI*q),.8)*(1+.12*Math.sin(q*14+time*10));f.lineTo(x1-40+q*80+(q<.5?-1:1)*Math.sin(q*Math.PI)*10*k,yy);}f.lineTo(x1+40,GY);f.closePath();f.fill();
   f.strokeStyle='rgba(255,255,255,.9)';f.lineWidth=1.2;f.beginPath();for(let u=0;u<=20;u++){const q=u/20,yy=GY-h*Math.pow(Math.sin(Math.PI*q),.8);u?f.lineTo(x1-40+q*80,yy):f.moveTo(x1-40,yy);}f.stroke();f.restore();}
  f.save();f.globalCompositeOperation='lighter';orb(f,x1,GY-34,46*(1-k*.5),[[0,`rgba(230,248,255,${.8*(1-k)})`],[.4,`rgba(80,170,255,${.5*(1-k)})`],[1,'rgba(20,80,200,0)']]);
  ringFX(f,x1,GY-34,6+84*(1-(1-k)*(1-k)),2.6*(1-k)+.2,`rgba(190,230,255,${1-k})`);ringFX(f,x1,GY-3,4+76*k,1.8*(1-k)+.2,`rgba(150,210,255,${.8*(1-k)})`);f.restore();
  const r2=R(91);for(let i=0;i<34;i++){const ang2=-Math.PI*(.1+r2()*.8),sp=30+r2()*60,x=x1+Math.cos(ang2)*sp*k*(r2()<.5?-1:1),y=GY-30+Math.sin(ang2)*sp*k+k*k*64;f.fillStyle=`rgba(${160+(r2()*70|0)},${210+(r2()*40|0)},255,${1-k})`;f.fillRect(Math.round(x),Math.round(y),2,2);}}}
ANIMS.suiryudan={dur:4.2,hold:2.3,hitT:2.3,dmg:36,cost:30,noLift:true,
 sP:[[0,READY],[.4,READY],[.55,READY],...sealPoses(.62,1.5),[1.75,READY],[2.6,READY],[4.2,READY]],
 nP:[[0,N_READY],[2.2,N_READY],[2.3,N_HIT],[2.9,N_STAG],[3.6,N_READY],[4.2,N_READY]],
 nX:[[0,288],[2.28,288],[2.5,304],[3.0,298],[3.8,288],[4.2,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.8,{z:1.9,cx:120,cy:124}],[1.4,{z:1.5,cx:150,cy:122}],[1.9,{z:1.15,cx:210,cy:116}],[2.3,{z:1.55,cx:262,cy:128}],[3.0,{z:1.3,cx:240,cy:124}],[3.7,{z:1.04,cx:192,cy:116}],[4.2,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const a=t-2.3,k=scaleAt(0,1,.5,1.0,t)*(1-scaleAt(0,1,3.0,3.8,t)),E={dim:.2*k,tint:`rgba(10,40,100,${.25*k})`};if(a>0&&a<.6)E.shk=9*(1-a/.6);if(a>=0&&a<.04)E.flash=.5;return E;},
 fx:c=>suiryudanFX(c)};

KAKASHI_JUTSUS.push(
 {id:'suijinheki',name:'Suiton: Suijinheki',cost:18,col:'#6cc0ff',desc:'Parede de Água: fica de pé até o inimigo atacar e absorve 80% do dano desse golpe.',live:true,ok:()=>!wallS,onUse:()=>{wallS=true;wallShow=true;wallBreakX=WALL_X;later(1700,()=>toast('Parede de água erguida: fica de pé até o inimigo atacar'));}},
 {id:'suiryudan',name:'Suiton: Suiryūdan no Jutsu',cost:30,col:'#2f86e6',desc:'Molda a água em um dragão que devora o inimigo (36 de dano).',live:true,shout:'Suiton: Suiryūdan no Jutsu!'});

/* ---------- Fatality do Suiryudan: o dragao morde o Naruto e o ergue, uma bolha de agua o prende e o esmaga, e explode ---------- */
const FAT_UP=[2.3,3.0],FAT_POP=5.0;
function fatLift(t){const up=scaleAt(0,1,FAT_UP[0],FAT_UP[1],t),d=scaleAt(0,1,FAT_POP,FAT_POP+.6,t);return 58*up*(1-d*d);}
function suiFatalFX(c){const {f,t,time,nx0}=c,tt=c.A?t:99;
 if(tt<99)suiryudanFX(c,true);
 const cx=nx0,cy=GY-34-fatLift(tt);
 /* bolha de agua em volta do Naruto: cresce, pulsa, comprime e racha */
 const grow=scaleAt(0,1,2.5,3.3,tt),sq=scaleAt(0,1,4.2,FAT_POP,tt);
 if(tt<FAT_POP&&grow>0){const R0=(10+22*grow)*(1-.42*sq),wob=1+Math.sin(time*9)*.04*(1+sq*2),rr=R0*wob;f.save();
  const gr=f.createRadialGradient(cx-rr*.3,cy-rr*.3,rr*.1,cx,cy,rr);gr.addColorStop(0,'rgba(190,230,255,.28)');gr.addColorStop(.7,'rgba(70,150,235,.38)');gr.addColorStop(1,'rgba(20,90,200,.62)');
  f.fillStyle=gr;f.beginPath();f.ellipse(cx,cy,rr*.9,rr,0,0,TAU);f.fill();f.strokeStyle='rgba(225,245,255,.85)';f.lineWidth=1;f.stroke();
  f.strokeStyle='rgba(255,255,255,.8)';f.lineWidth=1.4;f.beginPath();f.arc(cx,cy,rr*.78,Math.PI*1.15,Math.PI*1.45);f.stroke();
  f.globalCompositeOperation='lighter';const r2=R(33);for(let i=0;i<22;i++){const ph=(time*.7+r2())%1,bx=cx+(r2()-.5)*rr*1.4,by=cy+rr*.8-ph*rr*1.6;f.fillStyle=`rgba(210,240,255,${(1-ph)*.9})`;f.beginPath();f.arc(bx,by,.7+r2()*1.3,0,TAU);f.fill();}
  if(sq>0){f.strokeStyle=`rgba(255,255,255,${sq})`;f.lineWidth=.8;for(let i=0;i<7;i++){const a=i*.9+1,l=rr*(.5+.5*Math.sin(i*3.1));f.beginPath();f.moveTo(cx+Math.cos(a)*rr*.3,cy+Math.sin(a)*rr*.3);f.lineTo(cx+Math.cos(a+.2)*l,cy+Math.sin(a+.2)*l);f.stroke();}}
  f.restore();}
 /* mordida: respingo ao fechar a mandibula */
 const b=tt-2.3;if(b>=0&&b<.7){const k=b/.7;f.save();f.globalCompositeOperation='lighter';orb(f,cx-6,cy-4,26*(1-k*.5),[[0,`rgba(230,248,255,${.7*(1-k)})`],[1,'rgba(40,120,230,0)']]);ringFX(f,cx-6,cy,6+40*k,2*(1-k)+.2,`rgba(190,230,255,${1-k})`);f.restore();}
 /* explosao final: a bolha estoura, onda enorme, aneis, gotas e chuva */
 const a=tt-FAT_POP;if(a>=0&&a<1.6){const k=a/1.6,e=1-(1-k)*(1-k);f.save();f.globalCompositeOperation='lighter';
  orb(f,cx,cy,90*(1-k*.4),[[0,`rgba(240,252,255,${.9*(1-k)})`],[.35,`rgba(100,190,255,${.6*(1-k)})`],[1,'rgba(20,80,200,0)']]);
  for(let q=0;q<3;q++){const kk=Math.max(0,Math.min(1,k*1.4-q*.15));ringFX(f,cx,cy,8+130*kk,3*(1-kk)+.2,`rgba(${q?'130,200,255':'220,244,255'},${1-kk})`);}
  ringFX(f,cx,GY-3,6+110*e,2*(1-k)+.2,`rgba(160,215,255,${.9*(1-k)})`);f.restore();
  const r2=R(404);for(let i=0;i<70;i++){const an=r2()*TAU,sp=40+r2()*110,x=cx+Math.cos(an)*sp*e,y=cy+Math.sin(an)*sp*e*.8+k*k*90;f.fillStyle=`rgba(${160+(r2()*80|0)},${215+(r2()*40|0)},255,${1-k})`;f.fillRect(Math.round(x),Math.round(y),2,2);}
  f.fillStyle=`rgba(120,190,255,${.35*(1-k)})`;for(let i=0;i<28;i++){const x=cx-70+r2()*140,y=GY-120+((k*1.6+r2())%1)*120;f.fillRect(Math.round(x),Math.round(y),1,4);}}
 /* bracos arrancados pela explosao: voam girando, deixam sangue e caem na poca */
 {const a2=tt-FAT_POP;if(a2>=0){f.save();f.globalCompositeOperation='source-over';f.globalAlpha=1;const gg=c.g;gg.save();setCam(gg,c.z,c.sx,c.sy,c.ccx,c.ccy);gg.globalAlpha=1;gg.globalCompositeOperation='source-over';const bx=288,by=GY-34-fatLift(FAT_POP);
  for(let q=0;q<2;q++){const dir=q?1:-1,vx=q?27:-40,vy0=q?-92:-66,g0=210;let x=bx+dir*8,y=by-10,vy=vy0,ang=0,land=false;const steps=Math.min(a2,3.0)/.02;
   for(let k=0;k<steps;k++){if(land)break;x+=vx*.02;vy+=g0*.02;y+=vy*.02;ang+=dir*.18;if(y>=GY-1){y=GY-1;land=true;ang=dir*(.12+q*.25);y=GY-2;}}
   (q?suiHand:suiArmHalf)(gg,x,y,ang);
   if(!land&&a2<1.4){bloodSpray(f,x,y,a2*.7,610+q*13,6,dir);}
   if(land){gg.fillStyle='rgba(140,10,20,.75)';gg.beginPath();gg.ellipse(x-dir*10,GY+1,9,1.8,0,0,TAU);gg.fill();}}
  if(a2<1.1){bloodSpray(f,bx-8,by-10,a2,621,16,-1);bloodSpray(f,bx+8,by-10,a2,622,16,1);}gg.restore();f.restore();}
 }
 /* depois: poca de agua no chao */
 const pu=tt>=FAT_POP+.5?scaleAt(0,1,FAT_POP+.5,FAT_POP+1.8,tt):0;if(pu>0){f.save();f.fillStyle=`rgba(80,160,235,${.4*pu})`;f.beginPath();f.ellipse(nx0+4,GY+2,40*pu,6*pu,0,0,TAU);f.fill();f.strokeStyle=`rgba(210,240,255,${.6*pu})`;f.lineWidth=.7;f.stroke();f.restore();}}
/* braco arrancado: manga laranja com dobras, punho, mao com dedos e a ponta cortada em carne sangrando */
function suiArm(f,x,y,ang){f.save();f.translate(Math.round(x),Math.round(y));f.rotate(ang);
 f.fillStyle='#8a380a';f.fillRect(-12,-3,17,7);f.fillStyle='#cf620e';f.fillRect(-12,-3,17,5);f.fillStyle='#f58a18';f.fillRect(-12,-3,17,3);f.fillStyle='#ffb347';f.fillRect(-10,-3,12,1);
 f.fillStyle='#8a380a';for(let q=0;q<3;q++)f.fillRect(-9+q*5,-3,1,7);
 f.fillStyle='#e9e4d0';f.fillRect(5,-2,3,5);
 f.fillStyle='#de9c70';f.fillRect(8,-3,6,7);f.fillStyle='#f6c9a0';f.fillRect(8,-3,6,4);
 f.fillStyle='#b06c4c';for(let q=0;q<4;q++)f.fillRect(14,-3+q*2,3,1);
 f.fillStyle='#7a0a14';f.fillRect(-15,-4,3,9);f.fillStyle='#d01828';f.fillRect(-14,-3,2,6);f.fillStyle='#f5e6d8';f.fillRect(-14,-1,1,2);
 f.restore();}
/* metade de um braco (manga laranja cortada nas duas pontas) e uma mao solta */
function suiArmHalf(f,x,y,ang){f.save();f.translate(Math.round(x),Math.round(y));f.rotate(ang);
 f.fillStyle='#8a380a';f.fillRect(-8,-3,13,7);f.fillStyle='#cf620e';f.fillRect(-8,-3,13,5);f.fillStyle='#f58a18';f.fillRect(-8,-3,13,3);f.fillStyle='#ffb347';f.fillRect(-6,-3,8,1);
 f.fillStyle='#8a380a';f.fillRect(-3,-3,1,7);
 f.fillStyle='#7a0a14';f.fillRect(-11,-4,3,9);f.fillStyle='#d01828';f.fillRect(-10,-3,2,6);f.fillStyle='#f5e6d8';f.fillRect(-10,-1,1,2);
 f.fillStyle='#7a0a14';f.fillRect(5,-4,3,9);f.fillStyle='#d01828';f.fillRect(5,-3,2,6);f.fillStyle='#f5e6d8';f.fillRect(6,0,1,2);f.restore();}
function suiHand(f,x,y,ang){f.save();f.translate(Math.round(x),Math.round(y));f.rotate(ang);
 f.fillStyle='#e9e4d0';f.fillRect(-4,-2,3,5);f.fillStyle='#de9c70';f.fillRect(-1,-3,6,7);f.fillStyle='#f6c9a0';f.fillRect(-1,-3,6,4);
 f.fillStyle='#b06c4c';for(let q=0;q<4;q++)f.fillRect(5,-3+q*2,3,1);f.fillRect(0,4,3,1);
 f.fillStyle='#7a0a14';f.fillRect(-6,-3,2,7);f.fillStyle='#d01828';f.fillRect(-6,-2,1,5);f.restore();}
ANIMS.suiryudan.L={g:true,dur:8.0,koAt:7.3,bannerAt:5.05,banner:['水龍弾','FATALITY','Suiryūdan','#4aa8ff'],latchT:2.3,line:'Respire fundo. Pela última vez.',speakAt:3.5,speechPos:['18%','14%'],
 map:[[0,0],[99,99]],
 sP:[[0,READY],[.4,READY],[.55,READY],...sealPoses(.62,1.5),[1.75,READY],[99,READY]],
 nP:[[0,N_READY],[2.2,N_READY],[2.3,N_HIT],[2.55,N_CROSS2],[4.2,N_CROSS2],[4.9,N_CROSS],[5.0,N_CROSS],[5.3,N_BOUND2],[99,N_BOUND2]],
 nX:[[0,288],[5.2,288],[5.9,246],[99,246]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.8,{z:1.9,cx:120,cy:124}],[1.4,{z:1.5,cx:150,cy:122}],[1.9,{z:1.15,cx:210,cy:116}],[2.3,{z:1.55,cx:262,cy:128}],[3.0,{z:1.5,cx:262,cy:92}],[4.3,{z:1.8,cx:280,cy:86}],[5.0,{z:2.0,cx:288,cy:88}],[5.2,{z:1.5,cx:288,cy:120}],[6.2,{z:1.4,cx:245,cy:132}],[7.3,{z:1.3,cx:235,cy:136}],[8.0,{z:1.04,cx:192,cy:116}]],
 nRot:t=>{const k=scaleAt(0,1,5.3,6.1,t),sw=t<FAT_POP?Math.sin(t*3.2)*.12*scaleAt(0,1,2.6,3.2,t):0;return sw-1.45*k*k;},
 nY:t=>{const k=scaleAt(0,1,5.3,6.1,t);return -fatLift(t)+32*k*k;},
 stat:{nx0:246,nP:N_BOUND2},
 env:(raw,t)=>{const E={},a=raw-2.3,sq=scaleAt(0,1,4.2,FAT_POP,raw),p=raw-FAT_POP;if(a>0&&a<.5)E.shk=8*(1-a/.5);if(sq>0&&p<0)E.shk=Math.max(E.shk||0,1.5+4*sq);if(p>0&&p<.9)E.shk=Math.max(E.shk||0,14*(1-p/.9));if(p>=0&&p<.05)E.flash=1;else if(p>=.05&&p<.2)E.flash=.4;
  const k=scaleAt(0,1,.5,1.0,raw)*(1-scaleAt(0,1,6.8,7.6,raw));E.dim=.3*k;E.tint=`rgba(8,40,100,${.3*k})`;E.bars=12*scaleAt(0,1,2.2,2.8,raw)*(1-scaleAt(0,1,7.0,7.8,raw));return E;},
 fx:c=>suiFatalFX(c),fxStatic:c=>suiFatalFX(c)};
function sfxFatalSui(){
 nz(1.4,'lowpass',1200,400,.5,1.0);tone('sine',70,45,1.6,.45,1.2);nz(.8,'bandpass',600,2200,.3,1.6);tone('sawtooth',200,520,.7,.05,1.8);
 nz(.3,'lowpass',2200,200,.8,2.3);tone('sine',80,30,.7,.9,2.3);nz(.5,'highpass',3000,8000,.3,2.3);
 nz(2.4,'bandpass',300,900,.25,2.6);tone('sine',120,260,2.2,.06,2.6,6);[3.2,3.9,4.5].forEach((a,i)=>{tone('sine',900+i*200,500,.3,.05,a);nz(.2,'highpass',3500,9000,.15,a);});
 tone('sine',60,200,.8,.2,4.2);nz(.5,'highpass',3000,9000,.35,4.9);
 nz(.6,'lowpass',2600,120,1,5.0);tone('sine',70,24,1.2,1.0,5.0);nz(.8,'highpass',2500,8000,.5,5.02);nz(2.0,'bandpass',500,1800,.25,5.2);tone('sine',55,36,1.4,.5,5.6);}
ANIMS.suiryudan.L.sfxFn=sfxFatalSui;


/* ---------- Doton: Tsuiga no Jutsu (Tecnica da Perseguicao Presa) ----------
   O Kakashi bate a palma no chao, uma rachadura corre ate o inimigo e os caes ninja saem da terra, mordem e o prendem (ele perde o turno).
   Fatality: os caes arrastam o Naruto para dentro da terra, que se fecha sobre ele e deixa so uma mao para fora. */
/* os ninken da referencia (sprites em pixel/ninken.js): Bull (buldogue grande com coleira de espinhos), Pakkun, dois shibas, um cinza e um filhote */
const DOG_SC={bull:1.1,pug:.84,shiba:.86,gray:.86,pup:.58};
const TS_DOGS=[
 {sx:-52,bx:-14,by:-8,face:1,ang:-.3,d:0,ty:'shiba'},{sx:-34,bx:-14,by:-28,face:1,ang:-.6,d:.1,ty:'shiba'},
 {sx:44,bx:10,by:-9,face:-1,ang:-.3,d:.05,ty:'gray'},{sx:36,bx:13,by:-33,face:-1,ang:-.55,d:.14,ty:'pakkun'},
 {sx:-18,bx:-5,by:-47,face:1,ang:-.9,d:.18,ty:'bull'},{sx:16,bx:3,by:-24,face:-1,ang:-.8,d:.22,ty:'pup'}];
/* desenha objetos solidos direto na camada principal (a camada de FX recebe brilho/bloom, que estoura cores escuras) */
function withG(c,fn){const g=c.g;g.save();setCam(g,c.z,c.sx,c.sy,c.ccx,c.ccy);g.globalAlpha=1;g.globalCompositeOperation='source-over';fn(g);g.restore();}
/* cao em pixel art: gira em torno do centro do corpo; (face -1 espelha para olhar para a esquerda) */
function dogDrawS(G,x,y,face,ang,kind,pose,jaw,al){const S=ninkenSprite(kind,pose,jaw),sc=DOG_SC[kind];G.save();G.imageSmoothingEnabled=false;G.globalAlpha=al;G.translate(Math.round(x),Math.round(y));G.scale(face*sc,sc);G.rotate(ang);G.drawImage(S.c,-S.ax,-S.ay);G.restore();}
/* posicao do cao i em um instante: salto do chao ate a mordida, mantem, e (so na versao normal) volta para o chao */
function dogState(d,t,nx0,fat,rel0){const st=2.0+d.d,u=scaleAt(0,1,st,st+.4,t),rel=rel0!=null?rel0:(fat?99:3.4+d.d),v=scaleAt(0,1,rel,rel+.5,t),rr=20*DOG_SC[d.ty];
 const fx=Math.cos(d.ang)*rr*d.face,fy=Math.sin(d.ang)*rr,bpx=nx0+d.bx,bpy=GY+d.by,cx=bpx-fx,cy=bpy-fy,sx=nx0+d.sx,sy=GY;
 let x=sx+(cx-sx)*u,y=sy+(cy-sy)*u-Math.sin(Math.PI*u)*16,ang=d.ang+(1-u)*-.9;
 let al=1,jaw=u<1?.7:Math.max(0,.1+.05*Math.sin(t*14));
 if(v>0){x=cx+(sx-cx)*v;y=cy+(sy-cy)*v-Math.sin(Math.PI*v)*10;al=1-v;ang=d.ang*(1-v);jaw=.4*v;}
 if(u>=1&&v<=0){const w=Math.sin(t*14+d.sx),tug=w*1.6;x+=Math.cos(d.ang)*d.face*tug*-1;y+=Math.sin(d.ang)*tug*-1+Math.cos(t*29+d.sx)*.4;jaw=Math.max(0,1.2+1.2*Math.sin(t*11+d.sx*.1));}
 return{x,y,ang,jaw,al,u,v,bx:bpx,by:bpy,face:d.face,st};}
function tsPull(t){return scaleAt(0,1,2.9,4.3,t);}
function moundFX(f,x,k,time){if(k<=0)return;f.save();
 f.fillStyle='#2a160a';f.beginPath();f.ellipse(x,GY+2,34*k,6*k,0,0,TAU);f.fill();
 f.fillStyle='#6a4524';f.beginPath();f.moveTo(x-30*k,GY+2);for(let i=0;i<=10;i++){const u=i/10,hh=(15+Math.sin(i*2.3)*3)*k*Math.sin(Math.PI*u)**.8;f.lineTo(x-30*k+u*60*k,GY+2-hh);}f.lineTo(x+30*k,GY+2);f.closePath();f.fill();
 f.fillStyle='#8a6034';f.beginPath();f.moveTo(x-20*k,GY+2);for(let i=0;i<=8;i++){const u=i/8,hh=(11+Math.sin(i*1.9)*2)*k*Math.sin(Math.PI*u)**.8;f.lineTo(x-20*k+u*40*k,GY+2-hh);}f.lineTo(x+20*k,GY+2);f.closePath();f.fill();
 const r2=R(808);f.fillStyle='#4a2c14';for(let i=0;i<16;i++)f.fillRect(Math.round(x-26*k+r2()*52*k),Math.round(GY-r2()*10*k),2,2);
 f.fillStyle='rgba(120,8,16,.8)';f.beginPath();f.ellipse(x+4,GY+1,16*k,2.4*k,0,0,TAU);f.fill();f.restore();}
function tsuigaFX(c,fat){const {f,t,time,sx0,nx0}=c,tt=c.A?t:99;
 /* rachadura correndo pelo chao ate o inimigo */
 const p=scaleAt(0,1,1.5,2.05,tt);
 if(p>0&&tt<(fat?5.2:3.9)){const x0=sx0+16,x1=nx0-6,r2=R(66);f.save();f.strokeStyle='#1c0e06';f.lineWidth=1.3;f.beginPath();f.moveTo(x0,GY+1);const n=Math.round(30*p);for(let i=1;i<=n;i++){const u=i/30;f.lineTo(x0+(x1-x0)*u,GY+1+Math.sin(i*1.7)*1.3+(r2()-.5)*1.4);}f.stroke();
  f.fillStyle='#7a5630';for(let i=0;i<n;i+=2){const u=i/30,x=x0+(x1-x0)*u,ph=((tt*3+i*.37)%1);f.fillRect(Math.round(x),Math.round(GY-1-ph*7),2,2);}f.restore();}
 /* caes */
 const dodged=!fat&&anim&&anim.dodge;
 for(const [i,d] of TS_DOGS.entries()){const s=dogState(d,tt,nx0,fat,fat?undefined:(dodged?3.4+d.d:999));if(tt<s.st||s.al<=0)continue;
  const pull=fat?tsPull(tt):0,fadeD=fat?1-scaleAt(0,1,4.1,4.5,tt):1;
  if(tt<s.st+.5){const k=(tt-s.st)/.5;f.save();f.fillStyle=`rgba(130,92,52,${.8*(1-k)})`;const r2=R(900+i);for(let q=0;q<14;q++){const a=-Math.PI*(.05+r2()*.9),sp=8+r2()*22;f.fillRect(Math.round(nx0+d.sx+Math.cos(a)*sp*k),Math.round(GY+Math.sin(a)*sp*k+k*k*18),2,2);}f.restore();}
  const pose=s.u<1||s.v>0?'leap':'bite';withG(c,G=>dogDrawS(G,s.x,s.y+pull*30,s.face,s.ang+(fat?pull*.45*s.face:0),d.ty,pose,Math.round(s.jaw),s.al*fadeD));
  const a=tt-(s.st+.4);if(a>=0&&a<1.0)bloodSpray(f,s.bx,s.by+pull*30,a,700+i*11,6,s.face);}
 /* fatality: terra se fecha sobre ele */
 if(fat){const k=scaleAt(0,1,3.7,4.7,tt);if(k>0){withG(c,G=>moundFX(G,nx0,k,time));
   const a=tt-4.3;if(a>=0&&a<1.3){const r2=R(77);bloodSpray(f,nx0+2,GY-8,a,801,24,-1);bloodSpray(f,nx0+4,GY-8,a,802,24,1);
    for(let i=0;i<30;i++){const an=-Math.PI*(.1+r2()*.8),sp=30+r2()*70,x=nx0+Math.cos(an)*sp*a*(r2()<.5?-1:1),y=GY-6+Math.sin(an)*sp*a+a*a*80;f.fillStyle=r2()<.5?'#6a4524':'#8a6034';f.fillRect(Math.round(x),Math.round(y),2,2);}}
   if(k>.85){const sh=scaleAt(0,1,4.7,5.3,tt);withG(c,G=>{G.translate(nx0+3,GY-14-sh*2);G.rotate(-Math.PI/2+.25);suiHand(G,0,0,0);});}}}}
function tsuigaNOpt(o,type,t,A,fk,out){if(A&&type==='tsuiga'&&LG(type)){o.alpha=1-scaleAt(0,1,3.4,4.2,t);}else if(!A&&fk==='tsuiga'&&out==='S')o.alpha=0;}
ANIMS.tsuiga={dur:4.4,hold:2.4,hitT:2.4,dmg:18,cost:22,noLift:true,
 sP:[[0,READY],[.4,READY],[.7,SUI_SEAL],[1.4,SUI_SEAL],[1.7,READY],[4.4,READY]],
 nP:[[0,N_READY],[2.3,N_READY],[2.4,N_HIT],[2.7,N_STAG],[3.9,N_STAG],[4.3,N_READY],[4.4,N_READY]],
 nX:[[0,288],[4.4,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.8,{z:1.9,cx:120,cy:124}],[1.5,{z:1.35,cx:180,cy:128}],[2.1,{z:1.6,cx:260,cy:132}],[2.5,{z:1.85,cx:282,cy:128}],[3.5,{z:1.6,cx:270,cy:128}],[4.1,{z:1.04,cx:192,cy:116}],[4.4,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const a=t-2.4,k=scaleAt(0,1,.5,1.0,t)*(1-scaleAt(0,1,3.6,4.2,t)),E={dim:.15*k,tint:`rgba(60,34,10,${.2*k})`};if(a>0&&a<.4)E.shk=6*(1-a/.4);if(a>=0&&a<.04)E.flash=.3;return E;},
 fx:c=>tsuigaFX(c,false)};
ANIMS.tsuiga.L={g:true,dur:7.4,koAt:6.8,bannerAt:4.4,banner:['追牙','FATALITY','Doton: Tsuiga','#c99a5a'],latchT:2.4,line:'Não tem para onde fugir.',speakAt:2.0,speechPos:['18%','14%'],
 map:[[0,0],[99,99]],
 sP:[[0,READY],[.4,READY],[.7,SUI_SEAL],[1.4,SUI_SEAL],[1.7,READY],[99,READY]],
 nP:[[0,N_READY],[2.3,N_READY],[2.4,N_HIT],[2.7,N_STAG],[4.3,N_STAG],[4.5,N_BOUND2],[99,N_BOUND2]],
 nX:[[0,288],[99,288]],
 nY:t=>30*tsPull(t),
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.8,{z:1.9,cx:120,cy:124}],[1.5,{z:1.35,cx:180,cy:128}],[2.1,{z:1.6,cx:260,cy:132}],[2.6,{z:1.9,cx:284,cy:126}],[3.8,{z:2.1,cx:288,cy:140}],[4.5,{z:2.3,cx:288,cy:146}],[5.6,{z:1.6,cx:288,cy:140}],[6.6,{z:1.3,cx:262,cy:134}],[7.4,{z:1.1,cx:240,cy:128}]],
 stat:{nx0:288,nP:N_BOUND2},
 env:(raw,t)=>{const E={},a=raw-2.4,pl=scaleAt(0,1,2.9,4.3,raw),p=raw-4.3;if(a>0&&a<.4)E.shk=6*(1-a/.4);if(pl>0&&p<0)E.shk=Math.max(E.shk||0,2+3*pl);if(p>0&&p<.8)E.shk=Math.max(E.shk||0,10*(1-p/.8));if(p>=0&&p<.05)E.flash=.7;
  const k=scaleAt(0,1,.5,1.0,raw)*(1-scaleAt(0,1,6.4,7.2,raw));E.dim=.3*k;E.tint=`rgba(70,40,12,${.3*k})`;E.bars=12*scaleAt(0,1,2.2,2.8,raw)*(1-scaleAt(0,1,6.8,7.4,raw));return E;},
 fx:c=>tsuigaFX(c,true),fxStatic:c=>tsuigaFX(c,true)};
function sfxFatalTsuiga(){
 nz(.9,'lowpass',500,150,.5,1.5);tone('sine',60,40,1.0,.5,1.5);[2.0,2.12,2.2,2.3,2.4,2.5].forEach((a,i)=>{tone('sawtooth',420+i*40,220,.22,.07,a);nz(.1,'bandpass',900,300,.35,a+.1);});
 nz(.5,'lowpass',1600,200,.6,2.4);tone('sine',90,40,.4,.6,2.4);
 nz(1.6,'bandpass',200,700,.3,2.9);tone('sawtooth',90,60,1.4,.08,2.9,7);[3.1,3.4,3.7].forEach(a=>{tone('sawtooth',380,200,.25,.07,a);nz(.15,'bandpass',800,300,.4,a);});
 nz(.7,'lowpass',1400,100,.9,4.3);tone('sine',70,24,1.0,1.0,4.3);nz(.8,'highpass',2500,8000,.4,4.35);nz(1.2,'bandpass',300,1200,.25,4.5);}
ANIMS.tsuiga.L.sfxFn=sfxFatalTsuiga;
KAKASHI_JUTSUS.push({id:'tsuiga',name:'Doton: Tsuiga no Jutsu',cost:22,col:'#c99a5a',desc:'Cães ninja saem da terra, mordem e prendem o alvo: 18 de dano e ele fica imobilizado por 2 turnos, com os cães mordendo. Só 1 uso por batalha.',live:true,ok:()=>!tsK,
 onUse:()=>{if(immN)later(2400,()=>toast('Naruto se soltou dos cães!'));else{stunN=true;later(2200,()=>{tsHold=2;tsRelT=-9;toast('Os cães prendem o Naruto: ele perde os próximos 2 turnos');});}}});

/* ---- Tsuiga: o alvo fica preso por 2 turnos dele; os caes continuam mordendo e soltam no fim ---- */
let tsHold=0,tsRelT=-9,tsK=false; /* tsK: Tsuiga so 1 vez por batalha */
 /* turnos do inimigo ainda presos (visual e logica) */
function tsTurn(){if(tsHold<=0)return null;tsHold--;hp.n=Math.max(1,hp.n-4);dmgPop(4);setBars();const more=tsHold>0;if(!more)tsRelT=performance.now()/1000;
 return{more,msg:more?'Os cães seguram o Naruto: ele perde o turno (falta mais 1)':'Os cães soltam o Naruto: ele perde o turno'};}
function tsStatic(c){const {time,nx0}=c,now=performance.now()/1000;
 for(const [i,d] of TS_DOGS.entries()){const rel=tsHold>0?999:tsRelT;const s=dogState(d,tsHold>0?99:now-tsRelT+2.0+d.d+.0,nx0,false,tsHold>0?999:2.0+d.d+0);
  if(tsHold>0){const pose='bite';withG(c,G=>dogDrawS(G,s.x,s.y,s.face,s.ang,d.ty,pose,Math.round(s.jaw),1));
   const r2=R(300+i);if(Math.floor(time*6+i)%3===0){c.f.fillStyle='rgba(150,10,22,.8)';c.f.fillRect(Math.round(s.bx+(r2()-.5)*4),Math.round(s.by+(r2()-.3)*4),2,2);}}
  else{const k=(now-tsRelT)/.7;if(k<1){const x=s.bx+(nx0+d.sx-s.bx)*k,y=s.by+(GY-s.by)*k-Math.sin(Math.PI*k)*10;withG(c,G=>dogDrawS(G,x,y,s.face,s.ang*(1-k),d.ty,'leap',1,1-k));}}}}


/* ---------- Doton: Doryuheki (Parede de Estilo Terra) ----------
   Muro de pedra na frente do Kakashi. Absorve 88% do dano dos ataques do inimigo por 2 turnos DELE, racha a cada pancada e desmorona no fim.
   Fica de pe no cenario enquanto durar (stoneShow); so 1 uso por batalha. */
let stoneT=0,stoneShow=false,stoneK=false,stoneBreakT=-9,stoneHit=0,stoneHitT=-9;
const STONE_COLS=['#7a5632','#8c6540','#6a4828','#9a7248'];
/* pedacos de terra para a animacao de desmoronar (grade de 3 x 9 torroes) */
function stoneBlocks(x0){const B=[],r2=R(414);for(let r=0;r<9;r++)for(let c=0;c<3;c++)B.push({x:x0-13+c*8.6+(r2()-.5)*3,y:GY-(r+1)*8.2,w:8+r2()*3,h:8+r2()*3,col:STONE_COLS[Math.floor(r2()*4)],r,c});return B;}
/* muro de terra/lama: massa unica de topo irregular, camadas, torroes, pedras e brilho de umidade (nada de tijolo) */
function stoneWallDraw(G,x0,k,hits,time){if(k<=0)return;const W=26,H=74*Math.min(1,k*1.08),xl=x0-W/2,r2=R(414);G.save();G.beginPath();G.rect(x0-40,0,80,GY+1);G.clip();
 const cols=13,top=[];for(let i=0;i<=cols;i++){let h=H+(r2()-.5)*7-(i===0||i===cols?7:0);if(hits>=1&&i>=8&&i<=10)h-=15;if(hits>=2&&i>=1&&i<=4)h-=13;top.push(Math.max(3,h));}
 const mass=()=>{G.beginPath();G.moveTo(xl-1.5,GY+1);for(let i=0;i<=cols;i++)G.lineTo(xl+i*W/cols+(i%2?.9:-.6),GY-top[i]);G.lineTo(xl+W+1.5,GY+1);G.closePath();};
 mass();const gr=G.createLinearGradient(0,GY-H,0,GY);gr.addColorStop(0,'#a07a50');gr.addColorStop(.35,'#7e5834');gr.addColorStop(1,'#432714');G.fillStyle=gr;G.fill();
 G.save();mass();G.clip();
 for(let q=0;q<9;q++){const y=GY-H*(q+1)/10+(r2()-.5)*3;G.strokeStyle='rgba(30,16,6,.32)';G.lineWidth=.9;G.beginPath();for(let x=0;x<=W;x+=2){const yy=y+Math.sin(x*.7+q*2)*1.6;x?G.lineTo(xl+x,yy):G.moveTo(xl,yy);}G.stroke();}
 for(let q=0;q<26;q++){const x=xl+r2()*W,y=GY-r2()*H,rx=1.4+r2()*3.2,ry=1+r2()*2;G.fillStyle=r2()<.5?'rgba(205,165,115,.2)':'rgba(25,12,4,.22)';G.beginPath();G.ellipse(x,y,rx,ry,r2()*2,0,TAU);G.fill();}
 for(let q=0;q<9;q++){const x=xl+1+r2()*(W-2),y=GY-4-r2()*(H-8),rx=.9+r2()*1.3;G.fillStyle='#2c1c10';G.beginPath();G.ellipse(x+.4,y+.5,rx+.4,rx*.8+.4,0,0,TAU);G.fill();G.fillStyle=r2()<.5?'#6e6455':'#5a5044';G.beginPath();G.ellipse(x,y,rx,rx*.8,0,0,TAU);G.fill();G.fillStyle='rgba(255,255,255,.25)';G.fillRect(Math.round(x-rx*.4),Math.round(y-rx*.5),1,1);}
 G.fillStyle='rgba(255,226,180,.13)';G.fillRect(xl,GY-H,5,H);G.fillStyle='rgba(20,8,0,.22)';G.fillRect(xl+W-5,GY-H,5,H);
 for(let q=0;q<7;q++){const x=xl+2+r2()*(W-4),y0=GY-H*(.2+r2()*.7),l=6+r2()*16;G.strokeStyle='rgba(255,235,200,.22)';G.lineWidth=.8;G.beginPath();G.moveTo(x,y0);G.lineTo(x+(r2()-.5)*1.5,y0+l);G.stroke();}
 if(hits>=1){G.strokeStyle='rgba(14,6,0,.85)';G.lineWidth=1;G.beginPath();let cx=xl+W*.62,cy=GY-H*.82;G.moveTo(cx,cy);for(let q=0;q<7;q++){cx+=(r2()-.5)*6;cy+=7+r2()*3;G.lineTo(cx,cy);}G.stroke();}
 if(hits>=2){G.strokeStyle='rgba(14,6,0,.85)';G.lineWidth=1;G.beginPath();let cx=xl+W*.25,cy=GY-H*.7;G.moveTo(cx,cy);for(let q=0;q<6;q++){cx+=(r2()-.5)*6;cy+=6+r2()*3;G.lineTo(cx,cy);}G.stroke();}
 G.restore();mass();G.lineWidth=1.2;G.strokeStyle='#241406';G.stroke();
 G.fillStyle='#3a2512';G.beginPath();G.ellipse(x0,GY+1.5,W*.62,2.6,0,0,TAU);G.fill();
 G.restore();}
function stoneImpact(){stoneHit++;stoneHitT=performance.now()/1000;}
function stoneTick(){if(stoneT<=0)return;stoneT--;if(stoneT<=0){stoneShow=false;stoneBreakT=performance.now()/1000;toast('A parede de pedra desmoronou');}}
function stoneStatic(c){const now=performance.now()/1000,x0=STONE_X;
 if(stoneShow){withG(c,G=>stoneWallDraw(G,x0,1,stoneHit,c.time));
  const a=now-stoneHitT;if(a>=0&&a<.5){const r2=R(77);for(let i=0;i<16;i++){const an=-Math.PI*(.1+r2()*.8),sp=14+r2()*30,x=x0+9+Math.cos(an)*sp*a*(r2()<.5?-1:1),y=GY-40+Math.sin(an)*sp*a+a*a*60;c.f.fillStyle=`rgba(190,178,150,${1-a*2})`;c.f.fillRect(Math.round(x),Math.round(y),2,2);}}}
 else{const a=now-stoneBreakT;if(a>=0&&a<1.1){const B=stoneBlocks(x0),r2=R(515);withG(c,G=>{for(const b of B){const vx=(r2()-.4)*30,vy=-r2()*30,y=b.y+vy*a+120*a*a,x=b.x+vx*a;if(y>GY-b.h+1)continue;G.globalAlpha=1-a/1.1;G.fillStyle=b.col;G.save();G.translate(x+b.w/2,y+b.h/2);G.rotate(a*(r2()-.5)*8);G.beginPath();G.ellipse(0,0,b.w/2.1,b.h/2.1,0,0,TAU);G.fill();G.strokeStyle='#2a180a';G.lineWidth=.8;G.stroke();G.restore();}});
  c.f.fillStyle=`rgba(140,104,66,${.5*(1-a/1.1)})`;for(let i=0;i<24;i++){const r3=R(600+i),x=x0-12+r3()*24,y=GY-4-r3()*50*a;c.f.fillRect(Math.round(x),Math.round(y),3,3);}}}}
function doryuhekiFX(c){const {f,t,time}=c,x0=STONE_X,k=scaleAt(0,1,1.3,2.0,t);
 if(t>1.0&&t<2.4){const q=scaleAt(0,1,1.0,1.4,t),r2=R(91);f.save();f.strokeStyle='#1c1208';f.lineWidth=1.2;f.beginPath();f.moveTo(x0-18*q,GY+1);f.lineTo(x0+18*q,GY+1);f.stroke();
  for(let i=0;i<22;i++){const ph=(time*2.5+r2())%1;f.fillStyle=`rgba(150,132,104,${(1-ph)*.8})`;f.fillRect(Math.round(x0-14+r2()*28),Math.round(GY-ph*(10+k*30)),2,2);}f.restore();}
 withG(c,G=>stoneWallDraw(G,x0,k,0,time));
 const a=t-1.5;if(a>0&&a<.7){const r2=R(33);for(let i=0;i<20;i++){const an=-Math.PI*(.15+r2()*.7),sp=20+r2()*40,x=x0+Math.cos(an)*sp*a*(r2()<.5?-1:1),y=GY+Math.sin(an)*sp*a+a*a*70;f.fillStyle=`rgba(170,155,125,${1-a/.7})`;f.fillRect(Math.round(x),Math.round(y),2,2);}}}
const DORY_POSE=mk({tilt:.14,crouch:9,lean:3,fbx:-10,ffx:8,hxF:12,hyF:14,hxB:6,hyB:10,expr:2,tw:.9});
ANIMS.doryuheki={dur:3.4,hold:1.6,hitT:1.6,dmg:0,cost:20,noLift:true,
 sP:[[0,READY],[.4,READY],[.7,SUI_SEAL],[1.2,SUI_SEAL],[1.35,DORY_POSE],[2.0,DORY_POSE],[2.4,READY],[3.4,READY]],
 nP:[[0,N_READY],[3.4,N_READY]],nX:[[0,288],[3.4,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.5,{z:1.04,cx:192,cy:116}],[.9,{z:1.8,cx:125,cy:126}],[1.8,{z:1.5,cx:140,cy:128}],[2.8,{z:1.04,cx:192,cy:116}],[3.4,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={},a=t-1.4;if(a>0&&a<.6)E.shk=6*(1-a/.6);const k=scaleAt(0,1,.5,1.0,t)*(1-scaleAt(0,1,2.4,3.0,t));E.dim=.15*k;E.tint=`rgba(60,44,20,${.2*k})`;return E;},
 fx:c=>doryuhekiFX(c)};
KAKASHI_JUTSUS.push({id:'doryuheki',name:'Doton: Doryūheki',cost:20,col:'#b8a888',desc:'Parede de Estilo Terra: um muro de pedra que absorve 88% do dano por 2 turnos do inimigo. Só 1 uso por batalha.',live:true,ok:()=>!stoneK&&!stoneShow,
 onUse:()=>{stoneK=true;stoneT=2;stoneShow=true;stoneHit=0;later(1900,()=>toast('Muro de pedra erguido: protege por 2 turnos do inimigo'));}});


/* ---------- Sennen Gorōshi (Mil Anos de Morte) ----------
   Kakashi some numa nuvem de folhas, reaparece ATRAS do alvo (virado para ele) e enfia os dedos no ponto cego.
   Normal: o alvo da um salto mortal de susto, cai de dor e perde o proximo turno. So 1 uso por batalha.
   Fatality: o chakra dos dedos entra no corpo, o Naruto levita rigido, racha em luz e explode no ar em fogos de artificio e gore. */
let senK=false;
const SEN_BEHIND=318;
function senLiftF(t){return 46*scaleAt(0,1,2.2,3.2,t);}
function senFlip(type,t,A){if(type!=='sennen'||!A)return false;return LG(type)?(t>1.0&&t<3.74):(t>1.0&&t<3.3);}
function senSOpt(o,type,t,A){if(type!=='sennen'||!A)return;const L=LG(type);if((t>.86&&t<.98)||(L?(t>3.74&&t<3.9):(t>3.28&&t<3.42)))o.alpha=0;}
function senNOpt(o,type,t,A,fk,out){
 if(A&&type==='sennen'&&LG(type)){if(t>3.5)o.alpha=0;}
 else if(!A&&fk==='sennen'&&out==='S')o.alpha=0;}
function senStar(f,x,y,r,rot,col,al){f.save();f.translate(x,y);f.rotate(rot);f.fillStyle=col;f.globalAlpha=al;f.beginPath();for(let i=0;i<16;i++){const rr=i%2?r*.42:r,a=i*Math.PI/8;i?f.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):f.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}f.closePath();f.fill();f.restore();}
/* nuvem de fumaca com folhas do shunshin */
function senPuff(f,x,t,t0,time){const a=t-t0;if(a<0||a>.7)return;const k=a/.7,r2=R(Math.round(t0*100));f.save();
 for(let i=0;i<9;i++){const an=r2()*TAU,d=(4+r2()*14)*k,rr=(5+r2()*6)*(.6+k*.7);f.fillStyle=`rgba(${225+(r2()*25|0)},${225+(r2()*25|0)},${230},${.75*(1-k)})`;f.beginPath();f.arc(x+Math.cos(an)*d,GY-22+Math.sin(an)*d*.9,rr,0,TAU);f.fill();}
 for(let i=0;i<10;i++){const an=r2()*TAU,d=(8+r2()*26)*k,lx=x+Math.cos(an)*d,ly=GY-22+Math.sin(an)*d*.8-k*10;f.save();f.translate(lx,ly);f.rotate(an+time*4);f.fillStyle=`rgba(${70+(r2()*60|0)},${150+(r2()*60|0)},60,${1-k})`;f.fillRect(-2,-1,4,2);f.restore();}
 f.restore();}
function senPoseTime(t){return t;}
const N_SEN=Object.assign({},N_HIT,{scream:1,expr:3});
const SEN_PREP=mk({tilt:.06,crouch:7,lean:1,fbx:-9,ffx:7,hxF:12,hyF:-3,hxB:11,hyB:-2,expr:2,tw:.9});
function senNormalFX(c){const {f,t,time,nx0}=c;
 senPuff(f,96,t,.86,time);senPuff(f,SEN_BEHIND,t,.98,time);senPuff(f,SEN_BEHIND,t,3.28,time);senPuff(f,96,t,3.42,time);
 /* o toque: nuvem de poeira em explosao (como no anime) com estrela de espinhos, e linhas de velocidade atras do Naruto */
 const a=t-2.2;if(a>=0&&a<1.3){const k=Math.min(1,a/.45),fade=1-scaleAt(0,1,.8,1.3,a),cx=nx0+16,cy=GY-12,e=1-(1-k)*(1-k);
  withG(c,G=>{G.save();G.globalAlpha=fade;
   G.fillStyle='#6a4a28';G.beginPath();for(let q=0;q<22;q++){const rr=(q%2?26:52)*e,an=q*TAU/22;q?G.lineTo(cx+Math.cos(an)*rr*1.15,cy+Math.sin(an)*rr*.8):G.moveTo(cx+Math.cos(an)*rr*1.15,cy+Math.sin(an)*rr*.8);}G.closePath();G.fill();
   G.fillStyle='#f4e8c4';G.beginPath();for(let q=0;q<22;q++){const rr=(q%2?24:48)*e,an=q*TAU/22;q?G.lineTo(cx+Math.cos(an)*rr*1.12,cy+Math.sin(an)*rr*.78):G.moveTo(cx+Math.cos(an)*rr*1.12,cy+Math.sin(an)*rr*.78);}G.closePath();G.fill();
   const B=[[-14,2,14],[0,-5,17],[15,1,14],[-6,-14,12],[9,-12,13],[26,6,9],[-26,6,9],[2,6,15]];
   for(const [dx,dy,r0] of B){const rr=r0*e;G.fillStyle='#8a6a40';G.beginPath();G.arc(cx+dx*e*1.2,cy+dy*e,rr+1.3,0,TAU);G.fill();}
   for(const [dx,dy,r0] of B){const rr=r0*e;G.fillStyle='#e0c492';G.beginPath();G.arc(cx+dx*e*1.2,cy+dy*e,rr,0,TAU);G.fill();G.fillStyle='#f2dcae';G.beginPath();G.arc(cx+dx*e*1.2-rr*.25,cy+dy*e-rr*.3,rr*.55,0,TAU);G.fill();}
   G.restore();});}
 const fl=t-2.25;if(fl>0&&fl<.8){const y=GY-34-(-interp([[0,0],[.3,-80],[.55,-84],[.9,0]],fl)),x=nx0+interp([[0,0],[.5,-30],[.9,-50]],fl);f.save();f.strokeStyle='rgba(255,255,255,.75)';f.lineWidth=1;for(let q=0;q<7;q++){const o=q*4-12;f.beginPath();f.moveTo(x+6+o*.4,y+8+o);f.lineTo(x+40+o*.4,y+36+o);f.stroke();}f.restore();}
 /* estrelinhas de tontura em volta da cabeca depois da queda */
 const d=t-3.2;if(d>0&&d<1.1){const y=GY-60;for(let i=0;i<4;i++){const an=time*5+i*TAU/4;senStar(f,nx0-4+Math.cos(an)*12,y+Math.sin(an)*3,3.4,an,'#ffe45a',Math.min(1,d*4)*(1-scaleAt(0,1,.8,1.1,d)));}}
 const l=t-3.1;if(l>=0&&l<.6){const k=l/.6;f.save();ringFX(f,nx0,GY-3,6+44*k,1.8*(1-k)+.2,`rgba(220,200,160,${.9*(1-k)})`);f.restore();}}
ANIMS.sennen={dur:4.6,hold:2.2,hitT:2.2,dmg:16,cost:18,noLift:true,
 sP:[[0,READY],[.4,READY],[.55,SUI_SEAL],[.86,SUI_SEAL],[.9,SEN_PREP],[1.0,SEN_PREP],[1.9,SEN_PREP],[2.0,PN_W],[2.2,PN_P],[2.5,PN_P],[2.9,READY],[4.6,READY]],
 sX:[[0,96],[.86,96],[.9,SEN_BEHIND],[1.9,SEN_BEHIND],[2.2,SEN_BEHIND-14],[2.5,SEN_BEHIND-14],[2.9,SEN_BEHIND],[3.3,SEN_BEHIND],[3.34,96],[4.6,96]],
 nP:[[0,N_READY],[2.15,N_READY],[2.2,N_SEN],[2.9,N_SEN],[3.15,N_STAG],[4.3,N_STAG],[4.6,N_READY]],
 nX:[[0,288],[2.2,288],[2.7,258],[3.15,236],[3.7,236],[4.4,288],[4.6,288]],
 nYf:t=>interp([[0,0],[2.2,0],[2.5,-82],[2.75,-86],[3.15,0],[99,0]],t),
 nRotf:t=>-.55*scaleAt(0,1,2.25,2.5,t)*(1-scaleAt(0,1,2.9,3.12,t)),
 cam:[[0,{z:1.04,cx:192,cy:116}],[.5,{z:1.04,cx:192,cy:116}],[.9,{z:1.3,cx:150,cy:122}],[1.2,{z:1.8,cx:300,cy:128}],[2.2,{z:2.0,cx:298,cy:124}],[2.6,{z:1.3,cx:300,cy:104}],[3.1,{z:1.4,cx:300,cy:128}],[3.9,{z:1.3,cx:250,cy:124}],[4.6,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={},a=t-2.2,l=t-3.1;if(a>0&&a<.3)E.shk=5*(1-a/.3);if(l>0&&l<.5)E.shk=Math.max(E.shk||0,7*(1-l/.5));if(a>=0&&a<.04)E.flash=.5;return E;},
 fx:c=>senNormalFX(c)};
/* ---- fatality: o Naruto sai voando para longe com cara de pateta e o traseiro sangrando; a camera volta ao Kakashi, que abre o livro do Jiraiya e continua a leitura ---- */
const SEN_FLY_X=[[0,288],[2.2,288],[2.45,214],[2.8,96],[3.2,-30],[99,-30]],SEN_FLY_Y=[[0,0],[2.2,0],[2.5,-62],[2.9,-104],[3.3,-118],[99,-118]];
function senFlyPos(t){return[interp(SEN_FLY_X,t),GY-34+interp(SEN_FLY_Y,t)];}
function senFlyRot(t){return -.65*scaleAt(0,1,2.22,2.45,t)+Math.sin(t*14)*.12*scaleAt(0,1,2.4,3.2,t);}
/* cara engracada em cima da cabeca do Naruto: olhos esbugalhados vesgos, boca escancarada com lingua, sobrancelhas no alto e gotas de suor */
function senFace(G,x,y,rot,time,k){G.save();G.translate(x,y);G.rotate(rot);const s=1+.12*Math.sin(time*18)*k;G.scale(s,s);
 G.fillStyle='#fff';G.strokeStyle='#1a1024';G.lineWidth=.8;for(const ex of [-3.6,3.6]){G.beginPath();G.ellipse(ex,-1,2.9,3.4,0,0,TAU);G.fill();G.stroke();}
 G.fillStyle='#1a1024';G.fillRect(-2.9,-1,1.4,1.6);G.fillRect(2.4,-1,1.4,1.6);
 G.strokeStyle='#1a1024';G.lineWidth=1;G.beginPath();G.moveTo(-6.4,-5.4);G.lineTo(-1.6,-6.8);G.moveTo(6.4,-5.4);G.lineTo(1.6,-6.8);G.stroke();
 G.fillStyle='#5a0a14';G.beginPath();G.ellipse(0,5.4,4.6,3.8,0,0,TAU);G.fill();G.strokeStyle='#1a1024';G.lineWidth=.8;G.stroke();
 G.fillStyle='#f0708a';G.beginPath();G.ellipse(0,7,2.8,1.8,0,0,TAU);G.fill();G.fillStyle='#fff';G.fillRect(-3,2.4,6,1.4);
 G.fillStyle='#7fd0ff';G.beginPath();G.arc(-8,-3,1.1,0,TAU);G.fill();G.beginPath();G.arc(8.5,0,1,0,TAU);G.fill();
 G.restore();}
/* livro do Jiraiya (capa laranja com coracao), aberto na frente do rosto do Kakashi, com virada de pagina */
function senBook(G,x,y,time){G.save();G.translate(Math.round(x),Math.round(y));
 G.fillStyle='#7a3a0a';G.fillRect(-9,-8,17,13);G.fillStyle='#e8801c';G.fillRect(-8,-7,15,11);G.fillStyle='#ffb04a';G.fillRect(-8,-7,15,2);
 G.fillStyle='#ff6a8a';G.beginPath();G.moveTo(-1,2);G.lineTo(-4.4,-1.2);G.lineTo(-3,-3);G.lineTo(-1,-1.6);G.lineTo(1,-3);G.lineTo(2.4,-1.2);G.closePath();G.fill();
 G.fillStyle='#fff';G.fillRect(-6,-5,4,1);G.fillRect(1,-5,4,1);
 const fl=(time%2.4)/.4;if(fl<1){G.fillStyle='#f6f0e0';G.fillRect(8,-7+fl*3,1+Math.sin(fl*Math.PI)*5,10);}
 G.restore();}
function senReadFX(c,tt){const {f,time,sx0}=c,hx=(tt<99?sx0:96)+11,hy=GY-45;
 withG(c,G=>senBook(G,hx,hy,time));
 const r2=R(22);for(let i=0;i<4;i++){const ph=(time*.5+i*.27)%1,x=hx-10+i*6+Math.sin(time*3+i)*2,y=hy-16-ph*26;f.save();f.fillStyle=`rgba(255,110,150,${(1-ph)*.9})`;f.beginPath();f.moveTo(x,y+2.4);f.lineTo(x-3,y-.4);f.lineTo(x-1.5,y-2);f.lineTo(x,y-.8);f.lineTo(x+1.5,y-2);f.lineTo(x+3,y-.4);f.closePath();f.fill();f.restore();}
 f.fillStyle='#7fd0ff';f.fillRect(Math.round(hx-14),Math.round(hy-18+Math.sin(time*2)*1),2,3);}
function senFatalFX(c){const {f,t,time,nx0}=c,tt=c.A?t:99;
 senPuff(f,96,tt,.86,time);senPuff(f,SEN_BEHIND,tt,.98,time);senPuff(f,SEN_BEHIND,tt,3.74,time);senPuff(f,96,tt,3.9,time);
 /* o toque: nuvem de poeira em explosao com estrela de espinhos (como no anime) */
 const a=tt-2.2;if(a>=0&&a<1.3){const k=Math.min(1,a/.45),fade=1-scaleAt(0,1,.8,1.3,a),cx=SEN_BEHIND-14-6,cy=GY-12,e=1-(1-k)*(1-k);
  withG(c,G=>{G.save();G.globalAlpha=fade;
   const star=(rr0,col)=>{G.fillStyle=col;G.beginPath();for(let q=0;q<22;q++){const rr=(q%2?rr0*.5:rr0)*e,an=q*TAU/22;q?G.lineTo(cx+Math.cos(an)*rr*1.15,cy+Math.sin(an)*rr*.8):G.moveTo(cx+Math.cos(an)*rr*1.15,cy+Math.sin(an)*rr*.8);}G.closePath();G.fill();};
   star(54,'#6a4a28');star(50,'#f4e8c4');
   const B=[[-14,2,14],[0,-5,17],[15,1,14],[-6,-14,12],[9,-12,13],[26,6,9],[-26,6,9],[2,6,15]];
   for(const [dx,dy,r0] of B){G.fillStyle='#8a6a40';G.beginPath();G.arc(cx+dx*e*1.2,cy+dy*e,r0*e+1.3,0,TAU);G.fill();}
   for(const [dx,dy,r0] of B){const rr=r0*e;G.fillStyle='#e0c492';G.beginPath();G.arc(cx+dx*e*1.2,cy+dy*e,rr,0,TAU);G.fill();G.fillStyle='#f2dcae';G.beginPath();G.arc(cx+dx*e*1.2-rr*.25,cy+dy*e-rr*.3,rr*.55,0,TAU);G.fill();}
   G.restore();});}
 /* voo do Naruto: cara engracada, linhas de velocidade e sangue saindo do traseiro */
 if(tt>2.2&&tt<3.6){const [px,py]=senFlyPos(tt),rot=senFlyRot(tt),pivY=py-0;
  const pivot=[px,py+34-30+(-34+34)],hx=px+(-0)*Math.cos(rot)-(-28)*Math.sin(rot)*-1,hy=py+34-30+(-28)*Math.cos(rot);
  withG(c,G=>senFace(G,px-Math.sin(rot)*26.6,py+34-30-Math.cos(rot)*28*.95,rot,time,1));
  f.save();f.strokeStyle='rgba(255,255,255,.8)';f.lineWidth=1;for(let q=0;q<8;q++){const o=q*4-14;f.beginPath();f.moveTo(px+10+o*.5,py+6+o);f.lineTo(px+60+o*.5,py+30+o);f.stroke();}
  for(let i=0;i<36;i++){const tg=tt-i*.03;if(tg<2.25)break;const [qx,qy]=senFlyPos(tg),age=i*.03,fy=qy+6+age*age*160;f.fillStyle=`rgba(${190-i},10,24,${1-i/36})`;f.fillRect(Math.round(qx+8+(i%3)*1.4),Math.round(fy),2,2+(i%2));}
  f.restore();}
 /* sumiu no horizonte: estrelinha de brilho */
 const p=tt-3.45;if(p>=0&&p<1.0){const k=p/1.0;f.save();f.globalCompositeOperation='lighter';senStar(f,22,34,6+16*Math.sin(Math.min(1,k*1.6)*Math.PI),k*3,'#fff6b0',1-k);f.restore();}
 /* depois: o Kakashi abre o livro e continua a leitura */
 if(tt>4.35)senReadFX(c,tt);}
ANIMS.sennen.L={g:true,dur:10.2,koAt:9.5,bannerAt:2.5,banner:['千年殺し','FATALITY','Sennen Gorōshi','#ffd23a'],latchT:2.2,line:'Bom... onde é que eu estava mesmo?',speakAt:5.0,speechPos:['10%','14%'],
 map:[[0,0],[99,99]],
 sP:[[0,READY],[.4,READY],[.55,SUI_SEAL],[.86,SUI_SEAL],[.9,SEN_PREP],[1.0,SEN_PREP],[1.9,SEN_PREP],[2.0,PN_W],[2.2,PN_P],[3.2,PN_P],[3.7,READY],[3.9,SUI_SEAL],[99,SUI_SEAL]],
 sX:[[0,96],[.86,96],[.9,SEN_BEHIND],[1.9,SEN_BEHIND],[2.2,SEN_BEHIND-14],[3.2,SEN_BEHIND-14],[3.7,SEN_BEHIND],[3.74,SEN_BEHIND],[3.78,96],[99,96]],
 nP:[[0,N_READY],[2.15,N_READY],[2.2,N_SEN],[99,N_SEN]],
 nX:SEN_FLY_X,
 nY:t=>interp(SEN_FLY_Y,t),
 nRot:t=>senFlyRot(t),
 cam:[[0,{z:1.04,cx:192,cy:116}],[.5,{z:1.04,cx:192,cy:116}],[.9,{z:1.3,cx:150,cy:122}],[1.2,{z:1.8,cx:300,cy:128}],[2.2,{z:1.8,cx:290,cy:124}],[2.5,{z:1.4,cx:230,cy:96}],[3.0,{z:1.2,cx:110,cy:70}],[3.5,{z:1.15,cx:70,cy:60}],[4.1,{z:1.5,cx:100,cy:100}],[4.8,{z:2.0,cx:112,cy:118}],[8.6,{z:2.0,cx:112,cy:118}],[10.2,{z:1.3,cx:150,cy:120}]],
 stat:{nx0:288,nP:N_READY,sx0:96,sP:SUI_SEAL},
 env:(raw,t)=>{const E={},a=raw-2.2;if(a>0&&a<.3)E.shk=6*(1-a/.3);if(a>=0&&a<.04)E.flash=.5;E.bars=12*scaleAt(0,1,2.2,2.8,raw)*(1-scaleAt(0,1,9.2,10.0,raw));return E;},
 fx:c=>senFatalFX(c),fxStatic:c=>senFatalFX(c)};
function sfxFatalSen(){
 nz(.3,'highpass',2500,8000,.3,.88);nz(.25,'highpass',2500,8000,.3,1.0);tone('sine',300,900,.12,.25,2.2);nz(.2,'bandpass',1200,500,.5,2.2);
 tone('sawtooth',1200,300,1.3,.09,2.3,12);tone('sine',900,200,1.4,.07,2.4);nz(.6,'bandpass',1500,500,.2,2.3);
 tone('sine',2400,3200,.5,.05,3.5);nz(.15,'highpass',4000,9000,.3,3.5);
 nz(.3,'highpass',2500,8000,.3,3.74);nz(.25,'highpass',2500,8000,.3,3.9);
 [5.0,6.4,7.8].forEach(a=>{nz(.12,'bandpass',3000,1500,.18,a);tone('sine',260,200,.1,.05,a);});[5.6,7.1].forEach(a=>tone('sine',700,1000,.12,.04,a));}
ANIMS.sennen.L.sfxFn=sfxFatalSen;
KAKASHI_JUTSUS.push({id:'sennen',name:'Sennen Gorōshi (Mil Anos de Morte)',cost:18,col:'#ffd23a',desc:'Técnica Secreta de Taijutsu da Folha: surge atrás do alvo e enfia os dedos no ponto cego. 16 de dano e o alvo, em pânico, perde o próximo turno. Só 1 uso por batalha.',live:true,ok:()=>!senK,
 onUse:()=>{senK=true;later(2350,()=>speak('AAAAAAAAHH!!',['60%','12%']));if(immN)later(2300,()=>toast('Naruto desviou do ataque!'));else{stunN=true;later(3300,()=>toast('Naruto está paralisado de dor: perde o próximo turno'));}}});
