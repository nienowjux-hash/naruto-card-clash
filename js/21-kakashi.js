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
function dragonSpine(tauH,x0,x1,time,N,lag,lift){lift=lift||0;const P=[];for(let i=0;i<=N;i++){const s=i/N,tau=Math.max(0,tauH-s*lag),e=tau*tau*(3-2*tau);
  const x=x0+(x1-x0)*e,y=GY-22-Math.sin(tau*Math.PI)*50-lift*tau*tau,w=Math.sin(s*9.5-time*7)*7.5*Math.min(1,s*5)*(1-.3*tau);P.push([x,y+w]);}return P;}
function dragonR(s){return s<.08?6.5+s/.08*5.5:12*Math.pow(1-(s-.08)/.92,.62)+1.4;}
function suiryudanFX(c,fat){const {f,t,time,sx0,nx0}=c,x0=sx0+12,x1=nx0-(fat?34:8),hitAt=2.3,lift=fat?fatLift(t)+26*scaleAt(0,1,2.3,3.0,t)*(1-scaleAt(0,1,FAT_POP,FAT_POP+.5,t)):0;
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
 sP:[[0,READY],[.4,READY],[.7,SUI_SEAL],[1.5,SUI_SEAL],[1.75,READY],[2.6,READY],[4.2,READY]],
 nP:[[0,N_READY],[2.2,N_READY],[2.3,N_HIT],[2.9,N_STAG],[3.6,N_READY],[4.2,N_READY]],
 nX:[[0,288],[2.28,288],[2.5,304],[3.0,298],[3.8,288],[4.2,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.8,{z:1.9,cx:120,cy:124}],[1.4,{z:1.5,cx:150,cy:122}],[1.9,{z:1.15,cx:210,cy:116}],[2.3,{z:1.55,cx:262,cy:128}],[3.0,{z:1.3,cx:240,cy:124}],[3.7,{z:1.04,cx:192,cy:116}],[4.2,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const a=t-2.3,k=scaleAt(0,1,.5,1.0,t)*(1-scaleAt(0,1,3.0,3.8,t)),E={dim:.2*k,tint:`rgba(10,40,100,${.25*k})`};if(a>0&&a<.6)E.shk=9*(1-a/.6);if(a>=0&&a<.04)E.flash=.5;return E;},
 fx:c=>suiryudanFX(c)};

KAKASHI_JUTSUS.push(
 {id:'suijinheki',name:'Suiton: Suijinheki',cost:18,col:'#6cc0ff',desc:'Parede de Água: fica de pé até o inimigo atacar e absorve 80% do dano desse golpe.',live:true,ok:()=>!wallS,onUse:()=>{wallS=true;wallShow=true;wallBreakX=96+16;later(1700,()=>toast('Parede de água erguida: fica de pé até o inimigo atacar'));}},
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
 /* depois: poca de agua no chao */
 const pu=tt>=FAT_POP+.5?scaleAt(0,1,FAT_POP+.5,FAT_POP+1.8,tt):0;if(pu>0){f.save();f.fillStyle=`rgba(80,160,235,${.4*pu})`;f.beginPath();f.ellipse(nx0+4,GY+2,40*pu,6*pu,0,0,TAU);f.fill();f.strokeStyle=`rgba(210,240,255,${.6*pu})`;f.lineWidth=.7;f.stroke();f.restore();}}
ANIMS.suiryudan.L={g:true,dur:8.0,koAt:7.3,bannerAt:5.05,banner:['水龍弾','FATALITY','Suiryūdan','#4aa8ff'],latchT:2.3,line:'Respire fundo. Pela última vez.',speakAt:3.5,speechPos:['18%','14%'],
 map:[[0,0],[99,99]],
 sP:[[0,READY],[.4,READY],[.7,SUI_SEAL],[1.5,SUI_SEAL],[1.75,READY],[99,READY]],
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
