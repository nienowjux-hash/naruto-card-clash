/* ---------- Irmaos Demonios (Gozu e Meizu): golpes e fatalities ----------
   Eles lutam com a aparencia de pixel/kirigakure.js (enc.skin). Cada golpe e uma animacao "enemy" (o atacante e o lado da direita; o heroi apanha em x=96):
   dmShunshin  Shunshin no Jutsu: some numa nuvem e acerta pelas costas.        Fatality: decapita com a garra.
   dmSuigakure Suiton: Suigakure no Jutsu: some numa poca e surge debaixo dele.  Fatality: a garra atravessa o peito e o levanta.
   dmGarras    Garras Envenenadas: tres golpes de garra e veneno (3 turnos).     Fatality: convulsao com veneno ate cair.
   dmKusari    Corrente de Shuriken: os dois irmaos prendem o alvo e puxam.      Fatality: corta ao meio.
   dmInstinto  Instinto de Assassinato Compartilhado: cruzam em X (1x por luta).  Fatality: o corpo se desfaz em 3 pedacos. */
let poisonS=0,dmKCd=0,dmInstK=false,eFatalKind=null;
function sayNq(line,pos){speak(line,pos,roleN?'s':'n',true);} /* fala durante a acao: nao move a camera */
const DM_BASE={z:1.04,cx:192,cy:116};
function dmOther(){return nSkin()==='gozu'?'meizu':'gozu';}
function dmBrother(c,x,y,flip,pose,alpha){withG(c,G=>blit(x,y,flip,NARUTO,pose,c.time,{skin:dmOther(),alpha:alpha==null?1:alpha}));}
function poisonTick(){if(poisonS<=0)return;poisonS--;hp.s=Math.max(1,hp.s-3);dmgPop(3,'S');setBars();toast('Veneno: '+HN()+' perde 3 de vida'+(poisonS?' (mais '+poisonS+' turno'+(poisonS>1?'s':'')+')':''));}
/* garras: tres riscos em arco no ponto do golpe */
function dmClaws(f,x,y,age,col,dir){if(age<0||age>.35)return;const k=age/.35;f.save();f.globalCompositeOperation='lighter';f.lineCap='round';
 for(let i=0;i<3;i++){const o=(i-1)*6,len=26*Math.min(1,k*2.2);f.strokeStyle=`rgba(${col},${1-k})`;f.lineWidth=2.2*(1-k)+.5;f.beginPath();f.moveTo(x-dir*13+o*.6,y-15+o);f.lineTo(x-dir*13+o*.6+dir*len,y-15+o+len*.8);f.stroke();}
 f.restore();}
/* corrente com elos entre os dois pontos (camada principal, nao brilha) */
function dmChain(G,pts){G.save();G.lineCap='round';G.lineJoin='round';G.strokeStyle='#14161e';G.lineWidth=2.6;G.beginPath();pts.forEach((p,i)=>i?G.lineTo(p[0],p[1]):G.moveTo(p[0],p[1]));G.stroke();
 G.strokeStyle='#b4bccc';G.lineWidth=1.4;G.setLineDash([2.2,1.8]);G.beginPath();pts.forEach((p,i)=>i?G.lineTo(p[0],p[1]):G.moveTo(p[0],p[1]));G.stroke();G.setLineDash([]);G.restore();}
/* manopla de metal com tres garras presas ao pulso */
function dmGauntlet(G,x,y,dir){G.save();G.translate(x,y);G.scale(dir,1);G.fillStyle='#14161e';G.fillRect(-3,-3,7,6);G.fillStyle='#8f98aa';G.fillRect(-2,-2,5,4);G.fillStyle='#d4dae8';G.fillRect(-2,-2,5,1);
 G.fillStyle='#e8eef8';for(const d of [-2,0,2]){G.beginPath();G.moveTo(4,d-.8);G.lineTo(10,d);G.lineTo(4,d+.8);G.closePath();G.fill();}G.fillStyle='#7ad070';G.fillRect(8,-2.4,1.6,.8);G.fillRect(8,1.6,1.6,.8);G.restore();}
function dmShuriken(G,x,y,rot,r){G.save();G.translate(x,y);G.rotate(rot);G.fillStyle='#14161e';G.beginPath();for(let i=0;i<8;i++){const rr=i%2?r*.38:r,a=i*Math.PI/4;i?G.lineTo(Math.cos(a)*(rr+1),Math.sin(a)*(rr+1)):G.moveTo(Math.cos(a)*(rr+1),Math.sin(a)*(rr+1));}G.closePath();G.fill();
 G.fillStyle='#c8d0e0';G.beginPath();for(let i=0;i<8;i++){const rr=i%2?r*.34:r*.9,a=i*Math.PI/4;i?G.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):G.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}G.closePath();G.fill();
 G.fillStyle='#14161e';G.beginPath();G.arc(0,0,r*.2,0,TAU);G.fill();G.restore();}
const DM_DASH=[[0,0]];
/* ---------------- Shunshin ---------------- */
ANIMS.dmShunshin={enemy:true,dur:3.2,hold:1.5,hitT:1.5,hits:[{t:1.5,dmg:12}],cost:6,noLift:true,
 sP:[[0,READY],[1.45,READY],[1.52,S_HIT],[2.2,S_STAG],[3.0,READY]],sX:[[0,96],[1.5,96],[1.7,112],[2.4,100],[2.9,96]],
 nP:[[0,N_READY],[.4,N_READY],[.55,PN_W],[1.25,PN_W],[1.38,PN_W],[1.45,PN_P],[1.9,PN_P],[2.3,N_READY],[3.2,N_READY]],
 nX:[[0,288],[.5,288],[.52,66],[1.45,66],[1.7,72],[2.4,66],[2.45,288],[3.2,288]],
 cam:[[0,DM_BASE],[.5,{z:1.3,cx:192,cy:118}],[1.2,{z:1.9,cx:96,cy:124}],[1.5,{z:2.1,cx:92,cy:126}],[2.3,{z:1.4,cx:130,cy:122}],[3.0,DM_BASE],[3.2,DM_BASE]],
 env:(raw,t)=>{const E={},a=t-1.5;if(a>0&&a<.4)E.shk=5*(1-a/.4);if(a>=0&&a<.04)E.flash=.3;return E;},
 fx:c=>dmShunshinFX(c),
 start:(an,i)=>{later(500,()=>banner('瞬身の術','SHUNSHIN NO JUTSU','Deslocamento Instantâneo','#bfe4ff'));later(520,()=>sayNq('Você não me viu...',['70%','14%']));
  later(500,()=>{nz(.3,'highpass',2500,8000,.3,0);tone('sine',800,2400,.25,.05,0);});}};
function dmShunshinFX(c){const {f,t,time}=c,A=ANIMS.dmShunshin;senPuff(f,288,t,.5,time);senPuff(f,66,t,1.2,time);
 if(t>.5&&t<1.0){const k=(t-.5)/.5;f.save();f.strokeStyle=`rgba(230,240,255,${.8*(1-k)})`;f.lineWidth=1;for(let q=0;q<8;q++){const y=GY-14-q*7,x0=288-(288-66)*k;f.beginPath();f.moveTo(x0,y);f.lineTo(x0+60*(1-k*.5),y);f.stroke();}f.restore();}
 dmClaws(f,96,GY-34,t-1.5,'255,255,255',-1);impactFX(f,88,GY-42,t-1.5,5,false);}
/* ---------------- Suigakure ---------------- */
ANIMS.dmSuigakure={enemy:true,dur:3.9,hold:2.0,hitT:2.0,hits:[{t:2.0,dmg:15}],cost:12,noLift:true,
 sP:[[0,READY],[1.9,READY],[2.0,S_HIT],[2.6,S_STAG],[3.5,READY]],sX:[[0,96],[99,96]],
 sYf:t=>interp([[0,0],[2.0,0],[2.2,-16],[2.5,0],[99,0]],t),
 nP:[[0,N_READY],[.3,N_READY],[.45,SEAL_A],[.6,SEAL_B],[.75,TIGER],[.95,TIGER],[1.95,PN_W],[2.0,PN_P],[2.6,PN_P],[3.0,N_READY],[3.9,N_READY]],
 nX:[[0,288],[.95,288],[1.0,104],[3.2,104],[3.5,288],[99,288]],
 cam:[[0,DM_BASE],[.4,{z:1.6,cx:272,cy:128}],[1.0,{z:1.2,cx:200,cy:122}],[1.8,{z:1.9,cx:104,cy:130}],[2.0,{z:2.2,cx:100,cy:128}],[2.8,{z:1.5,cx:130,cy:124}],[3.4,DM_BASE],[3.9,DM_BASE]],
 env:(raw,t)=>{const E={},a=t-2.0,k=scaleAt(0,1,.5,1.0,t)*(1-scaleAt(0,1,3.0,3.6,t));E.dim=.15*k;E.tint=`rgba(10,40,90,${.2*k})`;if(a>0&&a<.4)E.shk=5*(1-a/.4);if(a>=0&&a<.04)E.flash=.3;return E;},
 fx:c=>dmSuigakureFX(c),
 start:(an,i)=>{later(450,()=>banner('水遁・水隠れの術','SUITON: SUIGAKURE','Ocultação na Água','#6cc0ff'));later(500,()=>sayNq('Suiton...',['70%','14%']));later(1700,()=>sayNq('Embaixo de você.',['60%','14%']));
  later(2000,()=>{nz(.5,'lowpass',1800,300,.5,0);tone('sine',200,700,.3,.4,0);});}};
function dmPuddle(f,x,k,time){if(k<=0)return;f.save();f.fillStyle=`rgba(40,120,210,${.5*k})`;f.beginPath();f.ellipse(x,GY+2,20*k,3.6*k,0,0,TAU);f.fill();f.strokeStyle=`rgba(210,240,255,${.8*k})`;f.lineWidth=.8;f.stroke();
 for(let q=0;q<2;q++){const ph=(time*.9+q*.5)%1;ringFX(f,x,GY+2,(6+16*ph)*k,.8*(1-ph)+.1,`rgba(210,240,255,${.7*(1-ph)*k})`);}f.restore();}
function dmSuigakureFX(c){const {f,t,time}=c,k0=scaleAt(0,1,.8,1.05,t)*(1-scaleAt(0,1,3.0,3.3,t));
 if(t>=.8&&t<1.0)dmPuddle(f,288,scaleAt(0,1,.8,1.0,t),time);
 if(t>=1.0&&t<1.95){const u=(t-1.0)/.95,x=288-(288-104)*u;for(let q=0;q<5;q++){const xx=x+q*9,a=1-q/5;ringFX(f,xx,GY+2,5+q*1.5,.9*a+.1,`rgba(200,235,255,${.8*a})`);}f.save();f.fillStyle='rgba(60,150,230,.55)';f.beginPath();f.ellipse(x,GY+2,12,2.4,0,0,TAU);f.fill();f.restore();}
 if(t>=1.95&&t<3.2)dmPuddle(f,104,Math.min(1,k0+(t>=1.95?1:0)),time);
 if(t>=3.0&&t<3.5)dmPuddle(f,288,scaleAt(0,1,3.0,3.2,t)*(1-scaleAt(0,1,3.3,3.5,t)),time);
 const a=t-2.0;if(a>=0&&a<.8){const k=a/.8;f.save();f.globalCompositeOperation='lighter';orb(f,104,GY-26,34*(1-k*.4),[[0,`rgba(230,248,255,${.8*(1-k)})`],[1,'rgba(40,120,230,0)']]);ringFX(f,104,GY-4,8+44*k,2*(1-k)+.2,`rgba(190,230,255,${1-k})`);f.restore();
  const r2=R(66);for(let i=0;i<22;i++){const an=-Math.PI*(.1+r2()*.8),sp=24+r2()*46,x=104+Math.cos(an)*sp*k*(r2()<.5?-1:1),y=GY-8+Math.sin(an)*sp*k+k*k*50;f.fillStyle=`rgba(${160+(r2()*70|0)},${210+(r2()*40|0)},255,${1-k})`;f.fillRect(Math.round(x),Math.round(y),2,2);}}
 dmClaws(f,96,GY-44,a,'180,235,255',1);}
/* ---------------- Garras envenenadas ---------------- */
ANIMS.dmGarras={enemy:true,dur:4.2,hold:1.35,hitT:1.35,hits:[{t:1.35,dmg:4},{t:1.7,dmg:4},{t:2.05,dmg:4}],cost:8,noLift:true,
 sP:[[0,READY],[1.3,READY],[1.37,S_HIT],[1.6,S_STAG],[1.72,S_HIT],[1.95,S_STAG],[2.07,S_HIT],[2.55,S_STAG],[3.4,READY]],sX:[[0,96],[1.3,96],[1.4,102],[1.72,100],[2.07,106],[2.3,112],[3.2,98],[99,96]],
 nP:[[0,N_READY],[.3,N_READY],[.5,PN_W],[.8,PN_W],[.85,DASH],[1.15,DASH],[1.25,PN_W],[1.3,PN_W],[1.35,PN_P],[1.5,PN_P],[1.55,PN_W],[1.68,PN_W],[1.7,PN_P],[1.85,PN_P],[1.9,PN_W],[2.03,PN_W],[2.05,PN_P],[2.45,PN_P],[2.75,N_READY],[3.0,DASH],[3.7,DASH],[3.8,N_READY],[4.2,N_READY]],
 nX:[[0,288],[.8,288],[1.2,138],[2.7,138],[3.0,138],[3.7,288],[99,288]],
 cam:[[0,DM_BASE],[.35,{z:1.5,cx:252,cy:126}],[.8,{z:1.5,cx:240,cy:126}],[1.2,{z:1.8,cx:150,cy:126}],[1.35,{z:2.1,cx:114,cy:128}],[1.7,{z:2.3,cx:110,cy:126}],[2.05,{z:2.7,cx:108,cy:126}],[2.5,{z:2.0,cx:116,cy:126}],[3.0,{z:1.35,cx:160,cy:124}],[3.6,DM_BASE],[4.2,DM_BASE]],
 env:(raw,t)=>{const E={};for(const [h,pw] of [[1.35,3],[1.7,4],[2.05,7]]){const a=t-h;if(a>0&&a<.3)E.shk=Math.max(E.shk||0,pw*(1-a/.3));if(a>=0&&a<.04)E.flash=Math.max(E.flash||0,.15+pw*.03);}E.dim=.18*scaleAt(0,1,.3,.8,t)*(1-scaleAt(0,1,2.6,3.2,t));E.tint=`rgba(20,70,20,${.16*scaleAt(0,1,.3,.9,t)*(1-scaleAt(0,1,2.6,3.2,t))})`;return E;},
 fx:c=>dmGarrasFX(c),
 start:(an,i)=>{later(350,()=>banner('毒爪','GARRAS ENVENENADAS','Veneno Paralisante','#7ad070'));later(700,()=>sayNq('Um arranhão basta.',['70%','14%']));
  later(450,()=>{tone('sine',300,900,.5,.07,0);nz(.4,'bandpass',900,2400,.12,0);});later(850,()=>{nz(.3,'highpass',2500,8000,.3,0);tone('sine',700,300,.3,.15,0);});
  [[1350,1.0],[1700,1.0],[2050,1.5]].forEach(([ms,m])=>later(ms,()=>{nz(.14*m,'highpass',3000,8000,.35,0);tone('sine',1500,500,.14*m,.22,0);tone('sine',90,50,.18*m,.4,0);nz(.2,'bandpass',600,300,.25,0);}));
  if(!i.dodge&&!i.isLR)later(2150,()=>{poisonS=3;toast(''+HN()+' foi envenenado: perde 3 de vida por turno (3 turnos)');});}};
/* aparencia do proprio atacante (aura, rastro) */
function dmSelf(c,x,y,flip,pose,alpha){withG(c,G=>blit(x,y,flip,NARUTO,pose,c.time,{alpha:alpha,noRefl:true}));}
/* corte curvo e afilado (da garra): cabeca branca, miolo verde-claro e halo de veneno; varre de p0 a p1 em ~0.1s e some */
function dmSlash(f,p0,p1,bend,age,w){if(age<0||age>.34)return;const k=age/.34,sw=Math.min(1,age/.09),tail=Math.max(0,sw-.7+k*.5),mx=(p0[0]+p1[0])/2+bend,my=(p0[1]+p1[1])/2-bend*.6;
 const pt=u=>{const v=1-u;return[v*v*p0[0]+2*v*u*mx+u*u*p1[0],v*v*p0[1]+2*v*u*my+u*u*p1[1]];};
 f.save();f.globalCompositeOperation='lighter';f.lineCap='round';
 for(const [lw,col] of [[w*3.2,`rgba(60,200,60,${.45*(1-k)})`],[w*1.8,`rgba(150,255,130,${.8*(1-k)})`],[w*.8,`rgba(255,255,255,${1-k})`]]){f.strokeStyle=col;f.lineWidth=Math.max(.3,lw*(1-k*.6));f.beginPath();for(let i=0;i<=14;i++){const q=pt(tail+(sw-tail)*i/14);i?f.lineTo(q[0],q[1]):f.moveTo(q[0],q[1]);}f.stroke();}
 f.restore();}
function dmGarrasFX(c){const {f,t,time}=c,A=ANIMS.dmGarras,nxi=tt=>interp(A.nX,tt),hit=[1.35,1.7,2.05],VX=96,VY=GY-40;
 /* veneno acumulando nas garras: orbe verde que cresce e pinga ate o ultimo golpe */
 if(t>.45&&t<2.9){const nx=nxi(t),g=scaleAt(0,1,.45,.9,t)*(1-scaleAt(0,1,2.6,2.9,t)),hx=nx-17,hy=GY-26;f.save();f.globalCompositeOperation='lighter';orb(f,hx,hy,(5+3*Math.sin(time*20))*g,[[0,`rgba(230,255,200,${.9*g})`],[.5,`rgba(100,230,90,${.6*g})`],[1,'rgba(30,140,40,0)']]);
  for(let q=0;q<4;q++){const ph=((time*1.6+q*.27)%1);f.fillStyle=`rgba(140,255,120,${(1-ph)*g})`;f.fillRect(Math.round(hx-2+q*1.5),Math.round(hy+3+ph*10),1,2);}f.restore();}
 /* avanço: rastro de imagens e poeira, linhas de velocidade */
 if(t>.8&&t<1.3){const k=(t-.8)/.5;for(let i=1;i<=4;i++){const tg=t-i*.045;if(tg<.8)continue;dmSelf(c,nxi(tg),GY,true,DASH,.3-i*.06);}
  f.save();f.strokeStyle=`rgba(230,240,230,${.55*(1-k*.6)})`;f.lineWidth=1;for(let q=0;q<6;q++){const y=GY-10-q*8,x0=nxi(t)+16;f.beginPath();f.moveTo(x0,y);f.lineTo(x0+46+q*4,y);f.stroke();}
  f.fillStyle='rgba(150,130,100,.5)';const r2=R(5);for(let i=0;i<10;i++){const x=nxi(t)+10+r2()*40,y=GY-r2()*8-1;f.fillRect(Math.round(x),Math.round(y),2,2);}f.restore();}
 /* os tres golpes: cortes curvos em sentidos diferentes e, no ultimo, X com estocada */
 const S1=[[VX-18,GY-70],[VX+16,GY-16]],S2=[[VX+18,GY-68],[VX-18,GY-14]],S3a=[[VX-20,GY-62],[VX+22,GY-20]],S3b=[[VX+22,GY-64],[VX-20,GY-18]];
 dmSlash(f,S1[0],S1[1],10,t-hit[0],2.2);dmSlash(f,S2[0],S2[1],-10,t-hit[1],2.2);dmSlash(f,S3a[0],S3a[1],12,t-hit[2],3);dmSlash(f,S3b[0],S3b[1],-12,t-hit[2]-.03,3);
 for(const [h,pw] of [[hit[0],1],[hit[1],1],[hit[2],1.8]]){const a=t-h;if(a>=0&&a<.5){const k=a/.5;f.save();f.globalCompositeOperation='lighter';orb(f,VX+4,VY,(16+14*pw)*(1-k*.5),[[0,`rgba(235,255,225,${.8*(1-k)})`],[.5,`rgba(110,230,100,${.5*(1-k)})`],[1,'rgba(30,140,40,0)']]);
   ringFX(f,VX+4,VY,5+30*pw*k,1.8*(1-k)+.2,`rgba(180,255,160,${1-k})`);f.restore();
   const r2=R(Math.round(h*100));for(let i=0;i<Math.round(12*pw);i++){const an=-Math.PI*(.05+r2()*.9),sp=18+r2()*40*pw,x=VX+Math.cos(an)*sp*a*(r2()<.5?-1:1),y=VY+Math.sin(an)*sp*a+a*a*60;f.fillStyle=`rgba(${110+(r2()*70|0)},255,${100+(r2()*60|0)},${1-k})`;f.fillRect(Math.round(x),Math.round(y),2,2);}}}
 /* gotas de veneno escorrendo dos cortes e bolhas subindo em volta do alvo (fica ate o fim do golpe) */
 if(t>1.45&&t<3.2){const g=scaleAt(0,1,1.45,1.9,t)*(1-scaleAt(0,1,2.8,3.2,t)),r2=R(41);f.save();for(let i=0;i<9;i++){const ph=((time*.9+r2())%1),x=VX-12+r2()*24,y=VY-24+ph*38;f.fillStyle=`rgba(120,255,110,${(1-ph)*.8*g})`;f.fillRect(Math.round(x),Math.round(y),1,2+(i%2));}
  f.globalCompositeOperation='lighter';for(let i=0;i<10;i++){const ph=((time*.5+r2())%1),x=VX-16+r2()*32+Math.sin(time*3+i)*2,y=GY-4-ph*64;f.strokeStyle=`rgba(170,255,150,${(1-ph)*.7*g})`;f.lineWidth=.7;f.beginPath();f.arc(x,y,1+r2()*1.6,0,TAU);f.stroke();}f.restore();}
 /* ultimo gesto: sacode o veneno das garras */
 if(t>=2.5&&t<2.8){const k=(t-2.5)/.3,nx=nxi(t);f.save();for(let i=0;i<10;i++){const an=Math.PI*(.9+i*.05),sp=14+i*3;f.fillStyle=`rgba(130,255,110,${1-k})`;f.fillRect(Math.round(nx-17+Math.cos(an)*sp*k),Math.round(GY-26+Math.sin(an)*sp*k*.6+k*k*16),2,2);}f.restore();}}
/* ---------------- Kusari (corrente de shuriken) ---------------- */
function dmKusariGeom(t){ /* posicoes do Meizu e pontos da corrente nos tempos t */
 const gx=274,gy=GY-38;let mx,my=0;
 if(t<.3)mx=330;else if(t<.8)mx=312;else if(t<1.6){const u=(t-.8)/.8;mx=312-(312-44)*u;my=-Math.sin(u*Math.PI)*46;}else mx=44;
 const hx=mx+(mx<96?14:-14),hy=GY-38+my;
 let pts;const tight=scaleAt(0,1,1.65,2.5,t),pull=scaleAt(0,1,2.5,2.62,t);
 if(t<1.6){const mid=[(gx+hx)/2,Math.max(gy,hy)+16+Math.sin(t*12)*2];pts=[[gx,gy],[(gx+mid[0])/2,mid[1]-4],mid,[(mid[0]+hx)/2,mid[1]-4],[hx,hy]];}
 else{const r=26-tight*18+pull*-6;pts=[[gx,gy],[150,GY-40],[96+r,GY-44],[96+r*.4,GY-52],[96-r,GY-44],[82-r*.2,GY-36],[hx,hy]];if(pull>0)pts=[[gx,gy],[96+4,GY-38],[96-4,GY-38],[hx,hy]];}
 return{mx,my,gx,gy,hx,hy,pts,tight,pull};}
ANIMS.dmKusari={enemy:true,dur:4.3,hold:2.6,hitT:2.6,hits:[{t:2.6,dmg:20}],cost:18,noLift:true,
 sP:[[0,READY],[1.55,READY],[1.8,S_STAG],[2.55,S_GUARD],[2.62,S_HIT],[3.2,S_STAG],[4.0,READY]],sX:[[0,96],[2.6,96],[2.8,92],[3.3,96],[99,96]],
 nP:[[0,N_READY],[.4,N_READY],[.9,PN_W],[2.4,PN_W],[2.55,PN_W],[3.3,N_READY],[4.3,N_READY]],nX:[[0,288],[99,288]],
 cam:[[0,DM_BASE],[.4,{z:1.2,cx:240,cy:122}],[1.0,{z:1.25,cx:170,cy:116}],[1.6,{z:1.6,cx:96,cy:122}],[2.5,{z:2.2,cx:96,cy:128}],[3.1,{z:1.5,cx:110,cy:124}],[3.8,DM_BASE],[4.3,DM_BASE]],
 env:(raw,t)=>{const E={},a=t-2.6;if(a>0&&a<.4)E.shk=5*(1-a/.4);if(a>=0&&a<.04)E.flash=.35;E.dim=.12*scaleAt(0,1,1.0,1.6,t)*(1-scaleAt(0,1,3.2,3.8,t));return E;},
 fx:c=>dmKusariFX(c,false),clonesFn:c=>dmKusariBros(c,false),
 start:(an,i)=>{later(300,()=>banner('鎖手裏剣','KUSARI SHURIKEN','Corrente de Shuriken','#c8d0e0'));later(900,()=>sayNq('Gozu! Agora!',['68%','14%']));later(1700,()=>sayNq('Presa.',['40%','14%']));
  later(2600,()=>{nz(.3,'highpass',2500,8000,.4,0);tone('sine',200,60,.3,.5,0);});
  if(!i.dodge&&!i.isLR)later(2650,()=>{stunS=Math.max(stunS,1);toast(''+HN()+' foi preso pela corrente e perde o próximo turno');});}};
function dmKusariBros(c,lethal){const {t,nx0}=c,G=dmKusariGeom(t);const vis=t>=.3&&t<(lethal?99:3.4);if(!vis)return;
 const al=lethal?1:1-scaleAt(0,1,3.1,3.4,t),flip=G.mx>96;dmBrother(c,G.mx,GY+G.my,flip?true:false,t>=.8&&t<1.6?PN_W:PN_W,al);}
function dmKusariFX(c,lethal){const {f,t,time,nx0}=c;if(t<.3)return;senPuff(f,312,t,.3,time);
 const G=dmKusariGeom(t);
 if(t>=.4&&!(lethal&&t>2.62)&&t<(lethal?99:3.5)){withG(c,Gc=>{let pts=G.pts;if(!lethal&&t>3.0){const k=scaleAt(0,1,3.0,3.5,t);pts=[[G.gx,G.gy],[G.gx-(G.gx-G.hx)*.5*(1-k)-k*10,G.gy+10*(1-k)],[G.hx,G.hy]];}dmChain(Gc,pts);dmGauntlet(Gc,G.gx,G.gy,-1);dmGauntlet(Gc,G.hx,G.hy,G.hx<96?1:-1);
   const mid=pts[Math.floor(pts.length/2)];if(t>=.9&&t<3.4)dmShuriken(Gc,mid[0],mid[1]+((t<1.6)?2:0),time*(t>1.65?22:10),9);});}
 const p=t-2.6;if(p>=0&&p<.5){f.save();f.globalCompositeOperation='lighter';ringFX(f,96,GY-38,6+30*(p/.5),2*(1-p/.5)+.2,`rgba(220,235,255,${1-p/.5})`);f.restore();}}
/* ---------------- Instinto de Assassinato Compartilhado ---------------- */
function dmInstGeom(t){let gx,mx;
 if(t<1.2){gx=288;mx=t<.3?330:312;}else if(t<1.9){gx=152;mx=42;}else if(t<2.5){const u=scaleAt(0,1,1.9,2.5,t),e=u*u*(3-2*u);gx=152-(152-36)*e;mx=42+(152-42)*e;}else if(t<3.3){gx=36;mx=152;}else{gx=288;mx=312;}
 return{gx,mx};}
ANIMS.dmInstinto={enemy:true,dur:4.6,hold:2.5,hitT:2.5,hits:[{t:2.5,dmg:30}],cost:28,noLift:true,
 sP:[[0,READY],[2.4,READY],[2.5,S_HIT],[3.2,S_STAG],[4.2,READY]],sX:[[0,96],[2.5,96],[2.7,92],[3.3,96],[99,96]],
 nP:[[0,N_READY],[.5,N_READY],[.8,PN_W],[1.2,PN_W],[1.3,N_READY],[1.9,PN_W],[2.2,DASH],[2.55,DASH],[2.7,PN_P],[3.2,N_READY],[3.4,N_READY],[4.6,N_READY]],
 nX:[[0,288],[1.2,288],[1.3,152],[1.9,152],[2.5,36],[3.3,36],[3.34,288],[99,288]],
 cam:[[0,DM_BASE],[.4,{z:1.25,cx:240,cy:122}],[1.0,{z:1.3,cx:200,cy:120}],[1.5,{z:1.35,cx:96,cy:124}],[2.1,{z:1.7,cx:96,cy:126}],[2.5,{z:2.4,cx:96,cy:128}],[3.1,{z:1.5,cx:100,cy:124}],[3.8,DM_BASE],[4.6,DM_BASE]],
 env:(raw,t)=>{const E={},a=t-2.5;if(a>0&&a<.5)E.shk=7*(1-a/.5);if(a>=0&&a<.05)E.flash=.9;else if(a>=.05&&a<.2)E.flash=.35;E.dim=.25*scaleAt(0,1,1.9,2.4,t)*(1-scaleAt(0,1,3.0,3.8,t));E.bars=10*scaleAt(0,1,1.9,2.4,t)*(1-scaleAt(0,1,3.4,3.9,t));return E;},
 fx:c=>dmInstintoFX(c,false),clonesFn:c=>dmInstintoBro(c,false),
 start:(an,i)=>{dmInstK=true;later(300,()=>banner('殺意共有','ASSASSINATO COMPARTILHADO','Instinto de Matar em Dupla','#ff5a5a'));later(800,()=>sayNq('Um só instinto.',['68%','14%']));later(1950,()=>sayNq('Dois golpes.',['50%','14%']));
  later(2500,()=>{nz(.2,'highpass',3000,9000,.5,0);tone('sine',1800,400,.2,.4,0);});}};
function dmInstintoBro(c,lethal){const {t}=c,G=dmInstGeom(t);if(t<.3)return;const gone=t>=3.3&&!lethal;if(gone)return;
 const flip=t<2.5?false:true,al=t>=1.2&&t<1.3?0:1,pose=t>=2.2&&t<3.3?DASH:(t>=1.9&&t<2.2?PN_W:N_READY);dmBrother(c,G.mx,GY,!flip?false:true,pose,al);
 if(t>=1.9&&t<2.55){for(let i=1;i<=3;i++){const tg=t-i*.05,Gg=dmInstGeom(tg);dmBrother(c,Gg.mx,GY,false,DASH,.28-i*.07);}}}
function dmInstintoFX(c,lethal){const {f,t,time}=c,G=dmInstGeom(t);senPuff(f,312,t,.3,time);senPuff(f,288,t,1.2,time);senPuff(f,152,t,1.3,time);senPuff(f,42,t,1.3,time);if(!lethal){senPuff(f,36,t,3.3,time);senPuff(f,288,t,3.34,time);}
 if(t>=1.9&&t<2.55){f.save();f.strokeStyle='rgba(255,255,255,.7)';f.lineWidth=1;for(let q=0;q<6;q++){const y=GY-12-q*9;f.beginPath();f.moveTo(40,y);f.lineTo(160,y);f.stroke();}f.restore();}
 const a=t-2.5;if(a>=0&&a<.6){const k=a/.6;f.save();f.globalCompositeOperation='lighter';f.lineCap='round';
  for(const [dx,dy,w] of [[1,1,2.6],[1,-1,2.6]]){f.strokeStyle=`rgba(255,${230-60*k|0},${230-120*k|0},${1-k})`;f.lineWidth=w*(1-k)+.4;f.beginPath();f.moveTo(96-dx*34*Math.min(1,k*3),GY-40+dy*40*Math.min(1,k*3));f.lineTo(96+dx*34*Math.min(1,k*3),GY-40-dy*40*Math.min(1,k*3));f.stroke();}
  orb(f,96,GY-40,36*(1-k*.5),[[0,`rgba(255,200,200,${.6*(1-k)})`],[1,'rgba(255,40,40,0)']]);f.restore();bloodSpray(f,96,GY-42,a,550,16,-1);bloodSpray(f,96,GY-42,a,551,16,1);}}
/* ---------------- fatalities ---------------- */
const SL_CUT_NECK=28,SL_CUT_WAIST=50;
/* faixas do corpo do heroi: [y0,y1] em linhas do sprite (sprite 56x80, ancora nos pes em (27,75)) */
function slice(y0,y1,dx,dy,rot,piv){return{y0,y1,dx,dy,rot,piv};}
const DM_FALL=(a,a0,a1,r)=>r*Math.min(1,Math.max(0,(a-a0)/(a1-a0)));
/* decapitacao: a cabeca voa girando e o corpo cai para a frente */
function dmHeadFlight(a){const g=240,v0=70,vx=34,dyL=58,tl=(v0+Math.sqrt(v0*v0+4*(g/2)*dyL))/g,tt=Math.min(a,tl);return{dx:vx*tt,dy:-v0*tt+.5*g*tt*tt,rot:Math.min(a,tl)*7,land:a>=tl};}
const DM_S={
 dmShunshin:(o,t,L)=>{if(!L||t<1.52)return;const a=t-1.52,h=dmHeadFlight(a);o.slices=[slice(SL_CUT_NECK,80,0,0,DM_FALL(a,.45,1.15,-1.5),[0,0]),slice(0,SL_CUT_NECK,h.dx,h.dy,h.rot,[0,-61])];o.hurt=0;},
 dmSuigakure:(o,t,L)=>{if(!L||t<2.0)return;o.hole=clamp((t-2.0)/.12,0,1)*2.2;},
 dmGarras:(o,t,L)=>{if(L){if(t<2.05)return;const k=scaleAt(0,1,2.1,3.2,t);o.tint=[40,170,60];o.tk=.1+.5*k;return;}const k=scaleAt(0,1,1.4,2.3,t)*(1-scaleAt(0,1,3.0,3.8,t));if(k>0){o.tint=[40,170,60];o.tk=.3*k;}},
 dmKusari:(o,t,L)=>{if(!L||t<2.62)return;const a=t-2.62;o.slices=[slice(0,SL_CUT_WAIST,-34*Math.min(1,a/.5),27*Math.pow(Math.min(1,Math.max(0,(a-.5)/.5)),2),DM_FALL(a,.1,.8,-1.45),[8,-25]),slice(SL_CUT_WAIST,80,0,0,DM_FALL(a,.45,1.2,1.45),[0,0])];},
 dmInstinto:(o,t,L)=>{if(!L||t<2.55)return;const a=t-2.55,sh=Math.min(1,a/.25)*0;o.slices=[slice(0,26,-20*Math.min(1,a/.5),-6*Math.sin(Math.min(1,a/.5)*Math.PI)+55*Math.pow(Math.min(1,Math.max(0,(a-.4)/.6)),2),DM_FALL(a,.1,1.0,-1.35),[0,-61]),slice(26,52,18*Math.min(1,a/.5),20*Math.pow(Math.min(1,Math.max(0,(a-.5)/.6)),2),DM_FALL(a,.3,1.1,.9),[0,-38]),slice(52,80,-6*Math.min(1,a/.6),0,DM_FALL(a,.5,1.3,1.45),[0,0])];}};
function dmSOpt(o,type,t,A,out){if(!A&&!out&&typeof poisonS!=='undefined'&&poisonS>0){o.tint=[40,170,60];o.tk=.12+.05*Math.sin(performance.now()/260);}if(A&&type&&type.slice(0,2)==='dm'&&DM_S[type]){DM_S[type](o,t,LE(type));}else if(!A&&out==='N'&&typeof eFatalKind!=='undefined'&&eFatalKind&&DM_S[eFatalKind])DM_S[eFatalKind](o,99,true);}
const DM_N={
 dmShunshin:(o,t,L)=>{if(t>.5&&t<1.25)o.alpha=0;if(t>=1.2&&t<(L?3.2:2.3))o.flipN=false;if(!L&&t>2.3&&t<2.5)o.alpha=0;},
 dmSuigakure:(o,t,L)=>{if(t>.9&&t<1.95)o.alpha=0;else if(t>=1.95&&t<2.08)o.alpha=scaleAt(0,1,1.95,2.08,t);else if(!L&&t>=3.0&&t<3.2)o.alpha=1-scaleAt(0,1,3.0,3.2,t);else if(!L&&t>=3.2&&t<3.5)o.alpha=0;else if(!L&&t>=3.5&&t<3.7)o.alpha=scaleAt(0,1,3.5,3.7,t);},
 dmKusari:()=>{},
 dmInstinto:(o,t,L)=>{if(t>=1.2&&t<1.3)o.alpha=0;if(t>=2.5&&t<(L?99:3.3))o.flipN=false;if(!L&&t>=3.3&&t<3.34)o.alpha=0;}};
function dmNOpt(o,type,t,A,out){if(A&&type&&type.slice(0,2)==='dm'&&DM_N[type])DM_N[type](o,t,LE(type));}
const DM_LR_SP=(extra)=>extra;
/* ---- Shunshin: decapitacao ---- */
ANIMS.dmShunshin.LR={dur:8.4,koAt:7.6,bannerAt:2.8,speakAt:4.2,line:'Nem viu o que aconteceu.',speechPos:['68%','14%'],banner:['首','FATALITY','Shunshin: Decapitação','#bfe4ff'],map:[[0,0],[99,99]],
 sP:[[0,READY],[99,READY]],sX:[[0,96],[99,96]],
 nP:[[0,N_READY],[.4,N_READY],[.55,PN_W],[1.25,PN_W],[1.38,PN_W],[1.45,PN_P],[2.6,PN_P],[3.2,N_READY],[99,N_READY]],
 nX:[[0,288],[.5,288],[.52,66],[1.45,66],[1.62,132],[1.85,172],[99,172]],
 cam:[[0,DM_BASE],[.5,{z:1.3,cx:192,cy:118}],[1.2,{z:1.9,cx:96,cy:124}],[1.5,{z:2.2,cx:100,cy:110}],[2.2,{z:1.7,cx:110,cy:100}],[3.0,{z:1.5,cx:118,cy:124}],[4.6,{z:1.7,cx:116,cy:134}],[6.4,{z:1.3,cx:150,cy:124}],[8.4,DM_BASE]],
 stat:{sP:READY,sx0:96,nP:N_READY,nx0:172},
 sfxFn:()=>{nz(.3,'highpass',2500,8000,.3,.5);nz(.3,'highpass',2500,8000,.4,1.2);tone('sine',1500,300,.3,.5,1.5);nz(.3,'bandpass',900,300,.6,1.5);[2.4,3.0].forEach(a=>{tone('sine',70,40,.3,.5,a);nz(.2,'lowpass',1200,200,.5,a);});},
 fx:c=>dmShunshinLethalFX(c),fxStatic:c=>dmShunshinLethalFX(c)};
function dmShunshinLethalFX(c){const {f,t,time}=c,tt=c.A?t:99;senPuff(f,288,tt,.5,time);senPuff(f,66,tt,1.2,time);
 if(tt>.5&&tt<1.0){const k=(tt-.5)/.5;f.save();f.strokeStyle=`rgba(230,240,255,${.8*(1-k)})`;f.lineWidth=1;for(let q=0;q<8;q++){const y=GY-14-q*7,x0=288-(288-66)*k;f.beginPath();f.moveTo(x0,y);f.lineTo(x0+60*(1-k*.5),y);f.stroke();}f.restore();}
 dmClaws(f,100,GY-62,tt-1.52,'255,255,255',1);
 /* sangue do pescoco: jorra enquanto o corpo ainda esta de pe, depois escorre */
 if(tt>=1.52){const a=tt-1.52;if(tt<99){bloodSpray(f,96,GY-60,a,610,26,1);bloodSpray(f,96,GY-60,a-.4,611,22,-1);bloodSpray(f,96,GY-56,a-.9,612,16,1);}
  const pool=scaleAt(0,1,1.4,3.6,tt);f.save();f.fillStyle=`rgba(130,8,18,${.8*pool})`;f.beginPath();f.ellipse(72,GY+2,34*pool,3.6*pool,0,0,TAU);f.fill();f.restore();}}
/* ---- Suigakure: a garra atravessa o peito e o levanta, depois o joga longe ---- */
ANIMS.dmSuigakure.LR={dur:9.0,koAt:8.2,bannerAt:2.6,speakAt:3.6,line:'Fim da linha.',speechPos:['68%','14%'],banner:['水遁','FATALITY','Suigakure: Garra Ascendente','#6cc0ff'],map:[[0,0],[99,99]],
 sP:[[0,READY],[1.9,READY],[2.0,S_HIT],[2.3,S_STAG],[4.0,S_STAG],[4.2,S_HIT],[4.9,S_DOWN],[99,S_DOWN]],
 sX:[[0,96],[4.0,96],[4.2,84],[4.8,44],[99,44]],sYf:t=>interp([[0,0],[2.0,0],[2.3,-30],[4.0,-34],[4.25,-20],[4.7,-8],[4.9,0],[99,0]],t),
 sSpin:[4.05,4.8,-.55],
 nP:[[0,N_READY],[.3,N_READY],[.45,SEAL_A],[.6,SEAL_B],[.75,TIGER],[.95,TIGER],[1.95,PN_W],[2.0,PN_P],[3.9,PN_P],[4.1,PN_W],[4.5,N_READY],[99,N_READY]],
 nX:[[0,288],[.95,288],[1.0,104],[99,104]],
 cam:[[0,DM_BASE],[.4,{z:1.6,cx:272,cy:128}],[1.0,{z:1.2,cx:200,cy:122}],[1.8,{z:1.9,cx:104,cy:130}],[2.1,{z:2.2,cx:102,cy:112}],[3.4,{z:1.8,cx:100,cy:100}],[4.2,{z:1.5,cx:90,cy:120}],[5.2,{z:1.5,cx:70,cy:134}],[7.2,{z:1.2,cx:110,cy:126}],[9.0,DM_BASE]],
 stat:{sP:S_DOWN,sx0:44,nP:N_READY,nx0:104},
 sfxFn:()=>{nz(.5,'lowpass',1800,300,.5,2.0);tone('sine',200,700,.3,.4,2.0);nz(.4,'lowpass',2000,150,.8,2.05);tone('sine',70,26,.8,.9,2.05);[3.0,3.4,3.8].forEach(a=>nz(.2,'lowpass',900,200,.4,a));nz(.5,'highpass',2500,8000,.4,4.1);tone('sine',80,30,.4,.7,4.8);},
 fx:c=>dmSuigLethalFX(c),fxStatic:c=>dmSuigLethalFX(c)};
function dmSuigLethalFX(c){const {f,t,time}=c,tt=c.A?t:99;
 if(tt>=.8&&tt<1.0)dmPuddle(f,288,scaleAt(0,1,.8,1.0,tt),time);
 if(tt>=1.0&&tt<1.95){const u=(tt-1.0)/.95,x=288-(288-104)*u;for(let q=0;q<5;q++){const a=1-q/5;ringFX(f,x+q*9,GY+2,5+q*1.5,.9*a+.1,`rgba(200,235,255,${.8*a})`);}}
 if(tt>=1.95){const red=scaleAt(0,1,2.0,4.0,tt);f.save();f.fillStyle=`rgba(${40+90*red|0},${120-90*red|0},${210-170*red|0},.55)`;f.beginPath();f.ellipse(104,GY+2,22,3.8,0,0,TAU);f.fill();f.strokeStyle='rgba(210,240,255,.7)';f.lineWidth=.8;f.stroke();f.restore();}
 const a=tt-2.0;if(a>=0&&a<.8){const k=a/.8;f.save();f.globalCompositeOperation='lighter';orb(f,104,GY-26,34*(1-k*.4),[[0,`rgba(230,248,255,${.8*(1-k)})`],[1,'rgba(40,120,230,0)']]);ringFX(f,104,GY-4,8+44*k,2*(1-k)+.2,`rgba(190,230,255,${1-k})`);f.restore();}
 if(tt>=2.0&&tt<4.1){bloodSpray(f,98,GY-62,tt-2.0,700,18,1);bloodSpray(f,98,GY-62,tt-2.5,701,14,-1);bloodSpray(f,98,GY-52,tt-3.0,702,12,1);const dr=R(8);f.fillStyle='rgba(150,10,22,.85)';for(let i=0;i<8;i++){const ph=((tt*1.2+dr())%1),x=98+(dr()-.5)*14,y=GY-60+ph*(40+dr()*20);f.fillRect(Math.round(x),Math.round(y),1,2);}}
 if(tt>=4.8){const pool=scaleAt(0,1,4.8,6.4,tt);f.save();f.fillStyle=`rgba(130,8,18,${.8*pool})`;f.beginPath();f.ellipse(48,GY+2,36*pool,3.6*pool,0,0,TAU);f.fill();f.restore();}}
/* ---- Garras: veneno ---- */
ANIMS.dmGarras.LR={dur:9.0,koAt:8.2,bannerAt:2.6,speakAt:4.6,line:'O veneno já está em você.',speechPos:['68%','14%'],banner:['毒','FATALITY','Garras Envenenadas','#7ad070'],map:[[0,0],[99,99]],
 sP:[[0,READY],[1.3,READY],[1.37,S_HIT],[1.6,S_STAG],[1.72,S_HIT],[1.95,S_STAG],[2.07,S_HIT],[2.6,S_STAG],[3.4,S_STAG],[3.9,S_DOWN],[99,S_DOWN]],sX:[[0,96],[1.3,96],[1.4,102],[1.75,100],[2.1,104],[3.0,98],[3.9,92],[99,88]],
 nP:[[0,N_READY],[.3,N_READY],[.5,PN_W],[.8,PN_W],[.85,DASH],[1.15,DASH],[1.25,PN_W],[1.3,PN_W],[1.35,PN_P],[1.5,PN_P],[1.55,PN_W],[1.68,PN_W],[1.7,PN_P],[1.85,PN_P],[1.9,PN_W],[2.03,PN_W],[2.05,PN_P],[2.4,PN_P],[2.7,N_READY],[99,N_READY]],
 nX:[[0,288],[.8,288],[1.2,138],[99,138]],
 cam:[[0,DM_BASE],[.35,{z:1.5,cx:252,cy:126}],[.8,{z:1.5,cx:240,cy:126}],[1.2,{z:1.8,cx:150,cy:126}],[1.35,{z:2.1,cx:114,cy:128}],[1.7,{z:2.3,cx:110,cy:126}],[2.05,{z:2.7,cx:108,cy:126}],[3.2,{z:2.2,cx:100,cy:128}],[4.4,{z:2.0,cx:96,cy:140}],[6.4,{z:1.4,cx:120,cy:132}],[9.0,DM_BASE]],
 stat:{sP:S_DOWN,sx0:88,nP:N_READY,nx0:136},
 sfxFn:()=>{[1.35,1.7,2.05].forEach(a=>{nz(.12,'highpass',3000,8000,.3,a);tone('sine',1400,600,.12,.2,a);});tone('sine',300,120,2.0,.08,2.6,14);nz(1.5,'bandpass',300,900,.12,2.8);tone('sine',70,30,.6,.8,3.9);},
 fx:c=>dmGarrasLethalFX(c),fxStatic:c=>dmGarrasLethalFX(c)};
function dmGarrasLethalFX(c){const {f,t,time}=c,tt=c.A?t:99;dmGarrasFX(c);
 if(tt>2.2){const k=scaleAt(0,1,2.2,3.2,tt),sx=96+(tt<3.9?Math.sin(tt*45)*1.4*k:0);
  if(tt<3.9){f.save();for(let i=0;i<10;i++){const ph=((time*1.4+i*.17)%1),x=sx+10+Math.sin(i*3+time*6)*3,y=GY-46+ph*14;f.fillStyle=`rgba(${200-i*6},255,${190-i*4},${(1-ph)*k})`;f.beginPath();f.arc(x,y,1+ph*1.4,0,TAU);f.fill();}f.restore();}
  if(tt>=3.9){const g=scaleAt(0,1,3.9,5.0,tt);f.save();f.fillStyle=`rgba(90,200,80,${.55*g})`;f.beginPath();f.ellipse(94,GY+2,32*g,3.4*g,0,0,TAU);f.fill();f.fillStyle=`rgba(220,255,210,${.6*g})`;for(let i=0;i<8;i++){f.beginPath();f.arc(78+i*4,GY+1-((i*7)%3),1.2+(i%2),0,TAU);f.fill();}f.restore();}}}
/* ---- Kusari: corte ao meio ---- */
ANIMS.dmKusari.LR={dur:9.0,koAt:8.2,bannerAt:2.9,speakAt:4.4,line:'Corte limpo.',speechPos:['68%','14%'],banner:['鎖','FATALITY','Kusari: Corte ao Meio','#c8d0e0'],map:[[0,0],[99,99]],
 sP:[[0,READY],[99,READY]],sX:[[0,96],[99,96]],
 nP:[[0,N_READY],[.4,N_READY],[.9,PN_W],[2.4,PN_W],[2.55,PN_W],[3.4,PN_W],[4.2,N_READY],[99,N_READY]],nX:[[0,288],[99,288]],
 cam:[[0,DM_BASE],[.4,{z:1.2,cx:240,cy:122}],[1.0,{z:1.25,cx:170,cy:116}],[1.6,{z:1.6,cx:96,cy:122}],[2.5,{z:2.2,cx:96,cy:128}],[3.0,{z:2.3,cx:92,cy:122}],[4.4,{z:1.8,cx:90,cy:132}],[6.4,{z:1.3,cx:120,cy:126}],[9.0,DM_BASE]],
 stat:{sP:READY,sx0:96,nP:N_READY,nx0:288},
 sfxFn:()=>{nz(.3,'highpass',2500,8000,.4,2.6);tone('sine',1800,200,.3,.5,2.6);nz(.6,'lowpass',1800,150,1,2.7);tone('sine',70,26,.8,.9,2.7);[3.3,3.7].forEach(a=>{nz(.2,'lowpass',1000,200,.5,a);tone('sine',90,40,.2,.5,a);});},
 env:null,fx:c=>dmKusariFX(c,true),clonesFn:c=>dmKusariBros(c,true),fxStatic:c=>dmKusariDone(c)};
function dmKusariDone(c){const {f}=c,pool=1;f.save();f.fillStyle='rgba(130,8,18,.8)';f.beginPath();f.ellipse(92,GY+2,40,3.8,0,0,TAU);f.fill();f.restore();withG(c,G=>{const hx=44+14,gx=274;dmChain(G,[[gx,GY-3],[190,GY-2],[120,GY-2],[hx+30,GY-2]]);dmShuriken(G,150,GY-2,.3,8);});const G=dmKusariGeom(99);dmBrother(c,44,GY,false,N_READY,1);}
/* a fatality do kusari usa o mesmo fx do golpe normal ate o corte; depois sangue e a corrente caida */
const _dmKusariFX0=dmKusariFX;
dmKusariFX=function(c,lethal){_dmKusariFX0(c,lethal);if(!lethal)return;const tt=c.A?c.t:99;if(tt<2.62)return;const a=tt-2.62;
 if(a<1.5){bloodSpray(c.f,96,GY-26,a,640,24,-1);bloodSpray(c.f,96,GY-26,a,641,24,1);bloodSpray(c.f,96,GY-26,a-.5,642,16,-1);}
 const pool=scaleAt(0,1,.5,3.0,a);c.f.save();c.f.fillStyle=`rgba(130,8,18,${.8*pool})`;c.f.beginPath();c.f.ellipse(92,GY+2,40*pool,3.8*pool,0,0,TAU);c.f.fill();c.f.restore();
 if(a>.3&&tt<99)withG(c,G=>{const gx=274,fall=scaleAt(0,1,.3,1.0,a);dmChain(G,[[gx,GY-38+(GY-3-(GY-38))*fall],[190,GY-6-(1-fall)*30],[120,GY-3],[60,GY-3]]);dmShuriken(G,140,GY-3-(1-fall)*18,a*8*(1-fall),8);});};
/* ---- Instinto: o corpo se desfaz em tres pedacos ---- */
ANIMS.dmInstinto.LR={dur:9.0,koAt:8.2,bannerAt:2.9,speakAt:4.4,line:'Dois irmãos. Um só instinto.',speechPos:['68%','14%'],banner:['殺','FATALITY','Instinto de Assassinato','#ff5a5a'],map:[[0,0],[99,99]],
 sP:[[0,READY],[99,READY]],sX:[[0,96],[99,96]],
 nP:[[0,N_READY],[.5,N_READY],[.8,PN_W],[1.2,PN_W],[1.3,N_READY],[1.9,PN_W],[2.2,DASH],[2.55,DASH],[2.7,PN_P],[3.2,N_READY],[99,N_READY]],
 nX:[[0,288],[1.2,288],[1.3,152],[1.9,152],[2.5,36],[99,36]],
 cam:[[0,DM_BASE],[.4,{z:1.25,cx:240,cy:122}],[1.0,{z:1.3,cx:200,cy:120}],[1.5,{z:1.35,cx:96,cy:124}],[2.1,{z:1.7,cx:96,cy:126}],[2.5,{z:2.4,cx:96,cy:128}],[3.2,{z:2.1,cx:96,cy:122}],[4.6,{z:1.8,cx:92,cy:134}],[6.6,{z:1.3,cx:110,cy:126}],[9.0,DM_BASE]],
 stat:{sP:READY,sx0:96,nP:N_READY,nx0:36},
 sfxFn:()=>{nz(.2,'highpass',3000,9000,.5,2.5);tone('sine',1800,400,.2,.4,2.5);nz(.7,'lowpass',2200,150,1,2.6);tone('sine',70,24,.9,1,2.6);[3.2,3.6,4.0].forEach(a=>{nz(.2,'lowpass',1000,200,.5,a);tone('sine',90,40,.2,.5,a);});},
 fx:c=>dmInstLethalFX(c),clonesFn:c=>dmInstintoBro(c,true),fxStatic:c=>dmInstLethalFX(c)};
function dmInstLethalFX(c){const {f,t,time}=c,tt=c.A?t:99;dmInstintoFX(c,true);
 if(tt>=2.55){const a=tt-2.55;if(a<1.6){bloodSpray(f,96,GY-60,a,560,18,-1);bloodSpray(f,96,GY-40,a,561,22,1);bloodSpray(f,96,GY-24,a,562,16,-1);}
  const pool=scaleAt(0,1,.6,3.0,a);f.save();f.fillStyle=`rgba(130,8,18,${.8*pool})`;f.beginPath();f.ellipse(92,GY+2,44*pool,3.8*pool,0,0,TAU);f.fill();f.restore();}}
/* ---------------- IA dos Irmaos Demonios ---------------- */
function demonPick(){if(enemySkin!=='gozu'&&enemySkin!=='meizu')return null;const a=CAMP.active,lvl=a?NODES[a.node].lvl:3,SM=aiSmart(),opts=[];if(dmKCd>0)dmKCd--;
 const add=(id,w,min)=>{if(lvl>=min&&w>0&&ANIMS[id]&&ANIMS[id].cost<=ck.n)opts.push([id,w]);};
 add('nsoco',2.2,1);add('nchute',1.6,1);add('dmShunshin',2.4,1);add('dmGarras',poisonS>0?.5:2.8,2);add('dmSuigakure',2.4,3);add('dmKusari',dmKCd>0?0:2.8,3);add('dmInstinto',(!dmInstK&&hp.s<75)?3.4:0,4);
 if(!opts.length)return'concentrate';
 if(SM>.2&&Math.random()<.35+SM*.5){const k=opts.filter(o=>{const A=ANIMS[o[0]];return A.hits&&A.hits.reduce((s,h)=>s+h.dmg,0)*1.1>=hp.s;}).sort((x,y)=>ANIMS[x[0]].cost-ANIMS[y[0]].cost)[0];if(k)return k[0];}
 const p=aiPickW(opts,x=>x[1])[0];if(p==='dmKusari')dmKCd=2;return p;}

/* ---------------- Gozu e Meizu jogaveis ----------------
   Eles jogam do lado da direita (tela espelhada, como o Naruto) com os mesmos golpes da IA; o Sasuke e a IA. Menu proprio. */
function showDemonMenu(){menuOpen='main';const h=$('hand'),me=playSkin,nm=NN();h.innerHTML='';setHead('JUTSUS DE '+nm.toUpperCase());
 const add=(name,desc,col,k,cost,fn,ok,mv)=>{const b=document.createElement('button');b.className='cmd';b.style.setProperty('--cc',col);b._ok=ok||null;b.innerHTML=`<span class="ic">${h.children.length+1}</span><span class="tx"><b>${name}${elemChip(mv||moveByName(name))}</b><small>${desc}</small></span>`+(cost!=null?`<span class="cost">${cost}<em>CK</em></span>`:'<span></span>');b.onclick=fn;b._cost=cost;h.appendChild(b);};
 const un=id=>moveUnlocked(me,id);
 if(un('kunai'))add('Kunai','Arremessa um kunai direto no alvo (8 de dano, sem custo).','#b8c4d8',0,null,()=>enemyTurn('gkunai'));
 if(un('shuriken'))add('Shuriken','Lança três shurikens seguidas (sem custo).','#9fb0c8',0,null,()=>enemyTurn('gshuriken'));
 if(un('soco'))add('Soco','Avança e acerta um soco no rosto (sem custo).','#ffb04a',0,null,()=>enemyTurn('nsoco'));
 if(un('chute'))add('Chute','Salta e acerta um chute (sem custo).','#ff8a4a',0,null,()=>enemyTurn('nchute'));
 const J=[['dmShunshin','Shunshin no Jutsu','Some numa nuvem e acerta pelas costas (12 de dano). Fatality: decapitação.','#bfe4ff'],
  ['dmGarras','Garras Envenenadas','Três golpes de garra (12 de dano) e veneno: 3 de vida por turno durante 3 turnos. Fatality: convulsão.','#7ad070'],
  ['dmSuigakure','Suiton: Suigakure no Jutsu','Some numa poça e surge debaixo do alvo (15 de dano). Fatality: a garra atravessa o peito.','#6cc0ff'],
  ['dmKusari','Kusari: Corrente de Shuriken','A corrente prende o alvo (20 de dano) e ele perde o próximo turno. Fatality: corta ao meio.','#c8d0e0'],
  ['dmInstinto','Assassinato Compartilhado','Os dois irmãos cruzam em X (30 de dano). Só 1 vez por luta. Fatality: o corpo se desfaz em três pedaços.','#ff5a5a']];
 for(const [id,name,desc,col] of J)if(un(id))add(name,desc,col,0,ANIMS[id].cost,()=>enemyTurn(id),id==='dmInstinto'?()=>!dmInstK:null,MOVES[id]);
 add('Defender','Corta o próximo dano pela metade e recupera chakra.','#8fb4ff',0,null,()=>idleActN('defend'));
 add('Concentrar','Recupera chakra.','#7fd4ff',0,null,()=>idleActN('charge'));
 consumables().forEach(id=>add(ITEMS[id].name+' ×'+bagQty(id),ITEMS[id].d,RARITY[ITEMS[id].rar].col,0,null,()=>idleActN('item:'+id)));
 if(un('kawarimi'))add('Kawarimi no Jutsu','Troca de lugar com um tronco: evita por completo o próximo golpe (restam '+(KAWARIMI_MAX-kawUseN)+' de '+KAWARIMI_MAX+').','#c9b27a',0,KAWARIMI_COST,()=>idleActN('kawarimi'),()=>!kawN&&kawUseN<KAWARIMI_MAX);
 setCommands(!anim&&!outcome&&!turnLock);}
for(const [id,v] of [['ptG','gozu'],['ptM','meizu']])portrait(id,NARUTO,mk({expr:5}));
if(roleN&&playSkin&&typeof showMenu==='function')showMenu('main');
