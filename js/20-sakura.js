/* ---------- Sakura Haruno (Parte 1) ----------
   Joga no lugar do Sasuke (lado esquerdo) com sprites proprios (pixel/sakura.js) e um kit de apoio: Cura Medica recupera vida,
   Shannaro! e um soco de chakra concentrado. Kunai, Shuriken, Soco, Chute, Kawarimi, Defender, Concentrar e Itens sao os mesmos. */
function healPop(n){const d=$('dmg');d.style.left=roleN?'70%':'16%';d.style.color='#7dff9e';d.textContent='+'+n;d.classList.remove('on');void d.offsetWidth;d.classList.add('on');}

const SAKURA_JUTSUS=[
 {id:'cura',name:'Cura Médica',cost:12,col:'#6df0a0',desc:'As palmas brilham em verde e fecham os ferimentos: recupera 30 de vida.',live:true,heal:30,ok:()=>hp.s<HPMAX.s,
  icon:c=>{iconBG(c,'#062a1a','#14804a');c.globalCompositeOperation='lighter';orb(c,32,42,30,[[0,'rgba(190,255,200,.7)'],[1,'rgba(30,200,110,0)']]);c.globalCompositeOperation='source-over';c.fillStyle='#e8fff0';c.fillRect(29,28,6,28);c.fillRect(18,39,28,6);}},
 {id:'cura2',name:'Cura Intensiva',cost:30,col:'#46d9a0',desc:'Muito chakra nas mãos: recupera 65 de vida.',live:true,heal:65,ok:()=>hp.s<HPMAX.s,
  icon:c=>{iconBG(c,'#042a22','#10a070');c.globalCompositeOperation='lighter';orb(c,32,42,34,[[0,'rgba(220,255,230,.8)'],[1,'rgba(30,220,150,0)']]);c.globalCompositeOperation='source-over';c.fillStyle='#e8fff0';c.fillRect(28,24,8,34);c.fillRect(15,37,34,8);}},
 {id:'shannaro',name:'Shannarō! Soco de Chakra',cost:14,col:'#ffd23a',desc:'Concentra todo o chakra no punho e acerta um soco devastador (28 de dano).',live:true,shout:'SHANNAROOO!!',
  icon:c=>{iconBG(c,'#2a1a04','#c07a10');c.globalCompositeOperation='lighter';orb(c,40,40,28,[[0,'rgba(255,240,150,.8)'],[1,'rgba(255,150,30,0)']]);c.globalCompositeOperation='source-over';c.fillStyle='#ffe9a0';c.fillRect(26,32,18,16);c.fillStyle='#e8a050';c.fillRect(20,36,8,8);}}];

/* ---- Cura Medica: palmas verdes no peito, brilho que sobe pelo corpo ---- */
const SAK_HEAL=mk({tilt:.03,crouch:4,lean:1,fbx:-8,ffx:6,hxF:8,hyF:-5,hxB:9,hyB:-3,expr:2,tw:.9,hr:.02});
function curaFX(c){const {f,t,time,sx0}=c,on=scaleAt(0,1,.6,1.1,t)*(1-scaleAt(0,1,2.3,2.9,t));if(on<=0)return;
 const big=c.A===ANIMS.cura2?1.5:1,cx=sx0+8,cy=GY-34;f.save();f.globalCompositeOperation='lighter';
 orb(f,sx0+3,GY-34,30*on*big,[[0,'rgba(190,255,205,.5)'],[.5,'rgba(70,220,130,.28)'],[1,'rgba(20,140,70,0)']]);
 for(let i=0;i<2;i++)orb(f,cx+i*3,cy-2+i*5,(5.5+Math.sin(time*17+i)*.9)*on*big,[[0,'rgba(245,255,225,.95)'],[.5,'rgba(110,240,150,.6)'],[1,'rgba(30,170,90,0)']]);
 for(let q=0;q<2;q++){const k=(time*1.2+q*.5)%1;ringFX(f,sx0,GY-3,8+36*k*big,1.5*(1-k)+.2,`rgba(120,255,170,${.8*(1-k)*on})`);}
 const r2=R(77);for(let i=0;i<34;i++){const ph=(time*.55+r2())%1,x=sx0+(r2()-.5)*30,y=GY-4-ph*72;f.fillStyle=`rgba(${150+(r2()*80|0)},255,${150+(r2()*60|0)},${(1-ph)*on})`;f.fillRect(Math.round(x),Math.round(y),1,r2()<.3?2:1);}
 for(let i=0;i<6;i++){const ph=(time*.4+i*.17)%1,x=sx0-13+i*6+Math.sin(time*2+i)*3,y=GY-12-ph*64,a=(1-ph)*on;f.fillStyle=`rgba(170,255,195,${a})`;f.fillRect(Math.round(x)-1,Math.round(y),3,1);f.fillRect(Math.round(x),Math.round(y)-1,1,3);}
 f.restore();}
const curaEnv=(raw,t)=>{const k=scaleAt(0,1,.4,.9,t)*(1-scaleAt(0,1,2.4,2.9,t));return{dim:.28*k,tint:`rgba(8,60,34,${.22*k})`};};
const curaCam=[[0,{z:1.04,cx:192,cy:116}],[.5,{z:1.04,cx:192,cy:116}],[.9,{z:1.9,cx:112,cy:124}],[2.4,{z:1.9,cx:112,cy:124}],[3.0,{z:1.04,cx:192,cy:116}],[3.4,{z:1.04,cx:192,cy:116}]];
ANIMS.cura={dur:3.4,hold:1.6,hitT:1.6,dmg:0,cost:12,noLift:true,
 sP:[[0,READY],[.4,READY],[.75,SAK_HEAL],[2.4,SAK_HEAL],[2.9,READY],[3.4,READY]],
 nP:[[0,N_READY],[3.4,N_READY]],nX:[[0,288],[3.4,288]],cam:curaCam,env:curaEnv,fx:c=>curaFX(c)};
ANIMS.cura2=Object.assign({},ANIMS.cura,{cost:30});

/* ---- Shannaro!: o soco normal com o punho em chakra, onda de choque e rachaduras no chao ---- */
function shannaroFX(c){const {f,t,time,nx0,sx0}=c,a=t-.85,w=scaleAt(0,1,.3,.8,t)*(1-scaleAt(0,1,.9,1.1,t));
 f.save();f.globalCompositeOperation='lighter';
 if(w>0){const hx=sx0+scaleAt(0,1,.5,.82,t)*(nx0-sx0-16)+14,hy=GY-44;orb(f,hx,hy,(9+Math.sin(time*40)*1.2)*w,[[0,'rgba(255,250,200,.95)'],[.5,'rgba(255,200,60,.6)'],[1,'rgba(255,120,20,0)']]);}
 if(a>=0&&a<.6){const k=a/.6;orb(f,nx0-6,GY-52,38*(1-k*.4),[[0,`rgba(255,250,210,${.8*(1-k)})`],[.4,`rgba(255,190,60,${.5*(1-k)})`],[1,'rgba(255,100,10,0)']]);
  ringFX(f,nx0-6,GY-52,8+70*(1-(1-k)*(1-k)),2.6*(1-k)+.2,`rgba(255,235,160,${1-k})`);ringFX(f,nx0-4,GY-3,6+60*k,1.8*(1-k)+.2,`rgba(255,200,90,${.8*(1-k)})`);}
 f.restore();
 if(a>=0){const k=Math.min(1,a/.25),r2=R(31);f.strokeStyle='rgba(30,16,8,.9)';f.lineWidth=.8;f.beginPath();for(let i=0;i<7;i++){let x=nx0-10,y=GY+1;f.moveTo(x,y);const ang=(i-3)*.28,L=(14+r2()*26)*k;for(let s=1;s<=4;s++){x+=Math.cos(ang+(r2()-.5)*.8)*L/4*(i<3?-1:1)*(-1);y+=Math.abs(Math.sin(ang))*.8+(r2()-.3)*1.2;f.lineTo(x,y);}}f.stroke();
  for(let i=0;i<16;i++){const ph=Math.min(1,a*1.4),x=nx0-10+(r2()-.5)*60*ph,y=GY-ph*(18+r2()*24)+ph*ph*30;f.fillStyle=r2()<.5?'#6a5a48':'#9a8a70';f.fillRect(Math.round(x),Math.round(y),2,2);}}}
ANIMS.shannaro=Object.assign({},ANIMS.soco,{dmg:28,cost:14,
 env:(raw,t)=>{const a=t-.85,E={};if(a>0&&a<.6)E.shk=10*(1-a/.6);if(a>=0&&a<.04)E.flash=.55;else if(a>=.04&&a<.14)E.flash=.2;return E;},
 fx:c=>{socoFX(c);shannaroFX(c);}});
delete ANIMS.shannaro.L;delete ANIMS.shannaro.LR;

/* retratos escondidos usados pelo mapa e pelo inventario (o do HUD segue o heroi da luta) */
portrait('ptK',SASUKE,mk({red:1,expr:1,hr:.05}));portrait('ptS0',SASUKE,mk({red:1,expr:1,hr:.05}));
