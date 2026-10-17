/* ---------- Inimigos comuns: golpes proprios, kits e IA ----------
   Lobo, Bandido e Ninja Renegado nao usam jutsus de personagens: cada um so tem o que combina com ele (CM_KIT).
   Os golpes novos (cmMordida, cmArranhao, cmInvestida, cmFaca, cmPorrete, cmGolpeKunai) sao animacoes proprias; cada um existe nos dois lados da tela:
   ANIMS.<id> (atacante na esquerda, quando o inimigo e o lado do Sasuke) e ANIMS.n<id> (atacante na direita, versao espelhada). */

/* ---- desenho: garras, presas, poeira, onda de choque e armas (armas no layer principal, para nao ficarem borradas pelo brilho) ---- */
function cmWeapon(c,kind,x,y,ang,dir){withG(c,g=>{g.save();g.translate(x,y);g.scale(dir,1);g.rotate(ang);
 if(kind==='club'){g.fillStyle='#3a2210';g.fillRect(-4,-2.4,28,5);g.fillStyle='#6a4524';g.fillRect(-4,-2.4,28,1.6);g.fillStyle='#3a2210';g.beginPath();g.ellipse(25,0,7,6,0,0,TAU);g.fill();g.fillStyle='#7a5230';g.beginPath();g.ellipse(24,-1.4,5,3,0,0,TAU);g.fill();g.fillStyle='#aab2c4';for(const [px,py] of [[22,-3],[27,0],[23,3]])g.fillRect(px,py,2,2);}
 else if(kind==='knife'){g.fillStyle='#4a2c14';g.fillRect(-3,-1.6,6,3.2);g.fillStyle='#c8a050';g.fillRect(3,-3,2,6);g.fillStyle='#e8eef8';g.beginPath();g.moveTo(5,-2.4);g.lineTo(19,0);g.lineTo(5,2.2);g.closePath();g.fill();g.fillStyle='#8a94aa';g.beginPath();g.moveTo(5,0.2);g.lineTo(19,0);g.lineTo(5,2.2);g.closePath();g.fill();}
 else{g.fillStyle='#22222c';g.fillRect(-4,-1.6,8,3.2);g.fillStyle='#8a94aa';g.beginPath();g.arc(-6,0,3,0,TAU);g.fill();g.fillStyle='#14141c';g.beginPath();g.arc(-6,0,1.4,0,TAU);g.fill();
  g.fillStyle='#dfe6f4';g.beginPath();g.moveTo(4,-3);g.lineTo(20,0);g.lineTo(4,3);g.closePath();g.fill();g.fillStyle='#8590aa';g.beginPath();g.moveTo(4,0.4);g.lineTo(20,0);g.lineTo(4,3);g.closePath();g.fill();}
 g.restore();});}
function cmClaws(f,x,y,a0,a,dir,flip){const p=Math.min(1,Math.max(0,(a-a0)/.1)),k=(a-a0)/.4;if(a<a0||k>1)return;f.save();f.lineCap='round';
 for(let i=-1;i<=1;i++){const sx=x+i*7*dir,sy=y-22,ex=sx+dir*flip*16*p,ey=sy+42*p;f.strokeStyle=`rgba(255,${i?240:200},${i?230:190},${1-k})`;f.lineWidth=2.6*(1-k)+.4;f.beginPath();f.moveTo(sx,sy);f.lineTo(ex,ey);f.stroke();}f.restore();}
function cmFangs(f,x,y,gap,al){f.save();f.fillStyle=`rgba(255,255,255,${al})`;for(let i=0;i<4;i++){const ox=x+(i-1.5)*5;f.beginPath();f.moveTo(ox-2.2,y-4-gap);f.lineTo(ox+2.2,y-4-gap);f.lineTo(ox,y+3-gap);f.fill();f.beginPath();f.moveTo(ox-2.2,y+4+gap);f.lineTo(ox+2.2,y+4+gap);f.lineTo(ox,y-3+gap);f.fill();}f.restore();}
function cmDust(f,ax,dir,t,t0,t1){if(t<t0||t>t1+.35)return;const k=(t-t0)/(t1-t0);f.save();for(let i=0;i<6;i++){const age=Math.max(0,Math.min(1,k-i*.09));if(age<=0&&k<1)continue;const x=ax-dir*(8+i*13),r=4+i*1.6+age*5,al=Math.max(0,.5-i*.07-Math.max(0,t-t1)*1.4);f.fillStyle=`rgba(214,190,150,${al})`;f.beginPath();f.ellipse(x,GY-4-i*.6,r*1.4,r*.8,0,0,TAU);f.fill();}f.restore();}
function cmShock(f,x,a,big){if(a<0||a>.5)return;const k=a/.5;f.save();f.strokeStyle=`rgba(255,235,190,${1-k})`;f.lineWidth=(big?3:2)*(1-k)+.4;f.beginPath();f.ellipse(x,GY-2,8+(big?80:50)*k,3+(big?16:10)*k,0,0,TAU);f.stroke();f.restore();}
const cmClamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const cmLerp=(a,b,k)=>a+(b-a)*cmClamp(k,0,1);

/* ---- coreografia de cada golpe (atacante na esquerda = ANIMS.<id>; versao espelhada para o atacante da direita = ANIMS.n<id>) ----
   Cada golpe e montado a partir de: x do atacante (sX), altura (sYf), poses (sP), reacao da vitima (nP/nX/nYf), camera, hits e efeitos.
   mot(t) devolve inclinacao (rot), achatamento (flat) e escala (sc) do corpo do atacante, aplicados nas opcoes do blit. */
const cmPulse=(t,h,w)=>Math.exp(-Math.pow((t-h)/(w||.06),2));
const cmKeys=(fn,t0,t1,dt)=>{const a=[];for(let t=t0;t<=t1+1e-6;t+=dt||.03)a.push([+t.toFixed(3),fn(t)]);return a;};
const cmCam=(h,far)=>[[0,{z:1.04,cx:192,cy:116}],[h-.55,{z:1.04,cx:192,cy:116}],[h-.25,{z:1.3,cx:178,cy:128}],[h,{z:far?1.4:1.55,cx:far?240:262,cy:128}],[h+.6,{z:1.45,cx:252,cy:130}],[h+1.1,{z:1.15,cx:205,cy:122}],[h+1.6,{z:1.04,cx:192,cy:116}],[99,{z:1.04,cx:192,cy:116}]];
const CM_ENV=(h,sh)=>(raw,t)=>{const a=t-h,E={};if(a>0&&a<.45)E.shk=sh*(1-a/.45);if(a>=0&&a<.03)E.flash=.3;else if(a>=.03&&a<.1)E.flash=.1;return E;};

const CM_DEF={
 /* LOBO: agacha, salta num arco com a boca aberta, fecha as presas e sacode a presa; solta e recua */
 cmMordida:{dur:3.4,hits:[[1.05,5],[1.4,4]],kind:'mordida',
  sX:[[0,96],[.35,96],[.62,86],[.7,86],[1.04,246],[1.5,250],[1.56,248],[1.9,150],[2.3,96],[99,96]],
  sYf:t=>{if(t<.7)return 0;if(t<1.04){const k=(t-.7)/.34;return-(Math.sin(k*Math.PI)*30+10*k);}if(t<1.5)return-10+Math.sin(t*46)*1.4;if(t<1.6)return-10*(1-(t-1.5)/.1);if(t<1.9){const k=(t-1.6)/.3;return-Math.sin(k*Math.PI)*14;}return 0;},
  sP:[[0,READY],[.35,READY],[.7,READY],[.72,CK_K],[1.02,CK_K],[1.05,PN_P],[1.5,PN_P],[1.56,CK_K],[1.95,READY],[99,READY]],
  mot:t=>{if(t<.35)return{};if(t<.7){const k=(t-.35)/.35;return{flat:1-.2*Math.min(1,k*2),rot:.12*k};}if(t<1.04){const k=(t-.7)/.34;return{rot:-.5+1.0*k};}if(t<1.52)return{rot:.45+Math.sin(t*38)*.26};if(t<1.9)return{rot:-.25};return{};},
  nP:[[0,N_READY],[1.0,N_READY],[1.05,N_HIT],[1.4,N_HIT],[1.45,N_HITB],[1.55,N_HITB],[1.6,N_STAG],[2.4,N_READY],[99,N_READY]],
  nX:cmKeys(t=>t<1.04?288:t<1.55?288+Math.sin(t*44)*3.2+Math.min(8,(t-1.04)*18):t<2.2?296-(t-1.55)*12:288,0,2.4).concat([[99,288]]),
  cam:cmCam(1.05)},
 /* LOBO: corre baixo, levanta nas patas de tras e rasga tres vezes */
 cmArranhao:{dur:3.3,hits:[[1.0,3],[1.2,3],[1.4,4]],kind:'arranhao',
  sX:[[0,96],[.4,96],[.55,120],[.95,230],[1.45,236],[1.7,234],[2.1,112],[2.5,96],[99,96]],
  sYf:t=>(t>.95&&t<1.6)?-4-Math.sin((t-.95)*9)*1.2:(t>.55&&t<.95)?-Math.abs(Math.sin(t*22))*3:0,
  sP:[[0,READY],[.4,READY],[.55,PN_D],[.95,PN_D],[1.0,CK_K],[1.55,CK_K],[1.7,READY],[99,READY]],
  mot:t=>{if(t<.4)return{};if(t<.95)return{rot:.14,flat:.92};if(t<1.6)return{rot:-.55+.32*(cmPulse(t,1.0)+cmPulse(t,1.2)+cmPulse(t,1.4))};if(t<1.8)return{rot:-.2};return{};},
  nP:[[0,N_READY],[.98,N_READY],[1.0,N_HIT],[1.2,N_HITB],[1.4,N_HIT],[1.7,N_STAG],[2.3,N_READY],[99,N_READY]],
  nX:[[0,288],[.98,288],[1.0,294],[1.2,300],[1.4,306],[1.9,300],[2.4,288],[99,288]],cam:cmCam(1.0)},
 /* LOBO: recua, junta forca e dispara com tudo contra o alvo */
 cmInvestida:{dur:3.7,hits:[[1.35,13]],kind:'investida',
  sX:[[0,96],[.4,96],[.75,70],[1.0,66],[1.33,252],[1.5,262],[1.8,258],[2.4,120],[2.95,96],[99,96]],
  sYf:t=>(t>1.0&&t<1.33)?-Math.abs(Math.sin(t*30))*3:0,
  sP:[[0,READY],[.4,READY],[.75,READY],[1.0,READY],[1.02,PN_D],[1.33,PN_D],[1.36,PN_P],[1.8,PN_P],[1.9,READY],[99,READY]],
  mot:t=>{if(t<.4)return{};if(t<1.0){const k=Math.min(1,(t-.4)/.4);return{flat:1-.24*k,rot:.16*k};}if(t<1.33)return{rot:.2,flat:.9};if(t<1.7)return{rot:.42-.3*cmPulse(t,1.5,.2)};return{};},
  nP:[[0,N_READY],[1.33,N_READY],[1.37,N_HIT],[1.5,N_HITB],[2.1,N_HITB],[2.3,N_STAG],[3.0,N_READY],[99,N_READY]],
  nX:[[0,288],[1.33,288],[1.4,300],[1.6,336],[2.3,346],[3.0,300],[3.6,288],[99,288]],
  nYf:t=>(t>1.37&&t<1.9)?-Math.sin((t-1.37)/.53*Math.PI)*16:0,cam:cmCam(1.35,true)},
 /* BANDIDO / RENEGADO: avanca com a faca, corta de cima para baixo e volta com um golpe de costas */
 cmFaca:{dur:3.4,hits:[[1.05,5],[1.3,4]],kind:'faca',
  sX:[[0,96],[.4,96],[.55,112],[.85,200],[1.0,236],[1.3,240],[1.5,238],[1.9,130],[2.4,96],[99,96]],
  sYf:t=>(t>.55&&t<.95)?-Math.abs(Math.sin(t*18))*4:0,
  sP:[[0,READY],[.4,READY],[.5,PN_W],[.7,PN_W],[.75,PN_D],[.98,PN_D],[1.02,PN_P],[1.24,PN_P],[1.28,PN_W],[1.34,PN_P],[1.55,PN_P],[1.62,READY],[99,READY]],
  mot:()=>({}),
  wpn:{kind:'knife',ang:t=>t<.45?-.4:t<.75?cmLerp(-.4,-1.8,(t-.45)/.3):t<1.05?cmLerp(-1.8,.95,(t-.9)/.15):t<1.3?cmLerp(.95,-1.0,(t-1.18)/.12):cmLerp(-1.0,0,(t-1.35)/.2),t0:.45,t1:1.75},
  nP:[[0,N_READY],[1.0,N_READY],[1.05,N_HIT],[1.3,N_HITB],[1.45,N_HIT],[1.7,N_STAG],[2.3,N_READY],[99,N_READY]],
  nX:[[0,288],[1.0,288],[1.05,294],[1.3,300],[1.6,296],[2.2,288],[99,288]],cam:cmCam(1.05)},
 /* BANDIDO: salta e desce o porrete com as duas maos (pancada pesada) */
 cmPorrete:{dur:3.9,hits:[[1.5,14]],kind:'porrete',
  sX:[[0,96],[.4,96],[.6,120],[1.0,205],[1.25,232],[1.5,236],[1.9,236],[2.3,150],[2.8,96],[99,96]],
  sYf:t=>(t>1.1&&t<1.52)?-Math.sin((t-1.1)/.42*Math.PI)*24:0,
  sP:[[0,READY],[.4,READY],[.55,PN_W],[1.4,PN_W],[1.46,PN_P],[1.95,PN_P],[2.05,READY],[99,READY]],
  mot:t=>t>1.1&&t<1.52?{rot:-.08+.2*((t-1.1)/.42)}:{},
  wpn:{kind:'club',ang:t=>t<.5?-.3:t<1.2?cmLerp(-.3,-2.55,(t-.5)/.7):t<1.42?-2.55:cmLerp(-2.55,.62,(t-1.42)/.1),t0:.5,t1:2.05},
  nP:[[0,N_READY],[1.48,N_READY],[1.52,N_HIT],[1.8,N_HITB],[2.3,N_STAG],[3.0,N_READY],[99,N_READY]],
  nX:[[0,288],[1.48,288],[1.55,296],[1.9,300],[2.6,292],[3.2,288],[99,288]],
  nYf:t=>0,cam:cmCam(1.5)},
 /* RENEGADO: avanca rapido e crava o kunai tres vezes, terminando com um chute */
 cmGolpeKunai:{dur:3.3,hits:[[1.0,3],[1.14,3],[1.28,3],[1.5,2]],kind:'kunaistab',
  sX:[[0,96],[.35,96],[.5,112],[.85,222],[1.0,232],[1.3,238],[1.62,240],[2.0,140],[2.5,96],[99,96]],
  sYf:t=>(t>.5&&t<.9)?-Math.abs(Math.sin(t*20))*3:0,
  sP:[[0,READY],[.35,READY],[.5,PN_W],[.8,PN_D],[.98,PN_D],[1.0,PN_P],[1.07,PN_W],[1.14,PN_P],[1.21,PN_W],[1.28,PN_P],[1.36,READY],[1.45,CK_W],[1.5,CK_K],[1.7,CK_K],[1.8,READY],[99,READY]],
  mot:()=>({}),
  wpn:{kind:'kunai',ang:t=>0,t0:.5,t1:1.4,ext:t=>14*(cmPulse(t,1.0,.045)+cmPulse(t,1.14,.045)+cmPulse(t,1.28,.045))},
  nP:[[0,N_READY],[.98,N_READY],[1.0,N_HIT],[1.14,N_HIT],[1.28,N_HIT],[1.5,N_HITB],[1.8,N_STAG],[2.4,N_READY],[99,N_READY]],
  nX:[[0,288],[.98,288],[1.0,292],[1.28,298],[1.5,308],[1.9,298],[2.4,288],[99,288]],cam:cmCam(1.0)}};

/* efeitos: tudo e calculado a partir dos hits do golpe (A.cmHits), entao funciona igual dos dois lados */
function cmFxMaker(name,id,isN){const D=CM_DEF[name];return c=>{
 const {f,t}=c,A=ANIMS[id],dir=isN?-1:1,yAtt=(isN?A.nYf:A.sYf)?((isN?A.nYf:A.sYf)(t)):0,ax=interp(isN?A.nX:A.sX,t),vx=interp(isN?A.sX:A.nX,t),ix=vx-dir*6,hx=ax+dir*14,hy=GY-50+yAtt,H=A.cmHits||A.hits,k=D.kind;
 dashLines(f,c,H[0].t-.45,H[0].t,5);
 if(D.wpn&&t>D.wpn.t0&&t<D.wpn.t1)cmWeapon(c,D.wpn.kind,hx+dir*(D.wpn.ext?D.wpn.ext(t):0),hy-(k==='porrete'?6:0),D.wpn.ang(t),dir);
 H.forEach((h,i)=>{const a=t-h.t,last=i===H.length-1;
  if(k==='mordida'){const g=Math.max(0,1-a/.1)*11;if(a>=0&&a<.34)cmFangs(f,ix,GY-48,g,1-a/.4);impactFX(f,ix,GY-48,a,5+i,false);if(a>=0)bloodSpray(f,ix,GY-46,a,7+i,8,-dir);}
  else if(k==='arranhao'){cmClaws(f,ix+dir*i*2,GY-46,h.t,t,dir,i%2?-1:1);impactFX(f,ix,GY-46,a,5+i,false);if(a>=0)bloodSpray(f,ix,GY-46,a,7+i,6,-dir);}
  else if(k==='investida'){cmShock(f,ix,a,true);impactFX(f,ix,GY-40,a,6,true);if(a>=0)bloodSpray(f,ix,GY-40,a,8,12,-dir);}
  else if(k==='faca'){if(a>=0&&a<.3){const q=a/.3;f.save();f.translate(ix,GY-46+(i?4:0));f.scale(dir,1);f.strokeStyle=`rgba(255,${i?235:255},${i?230:255},${1-q})`;f.lineWidth=3.2*(1-q)+.5;f.lineCap='round';f.beginPath();f.arc(-4,0,16+9*q,i?1.25:-1.25,i?-1.25:1.25,!!i);f.stroke();f.restore();}
   impactFX(f,ix,GY-46,a,5+i,false);if(a>=0)bloodSpray(f,ix,GY-44,a,7+i,10,-dir);}
  else if(k==='porrete'){cmShock(f,ix,a,true);impactFX(f,ix,GY-52,a,5,true);if(a>=0)bloodSpray(f,ix,GY-50,a,7,14,-dir);
   if(a>=0&&a<.7){f.save();f.strokeStyle=`rgba(40,26,14,${1-a/.7})`;f.lineWidth=1.4;for(let q=-2;q<=2;q++){f.beginPath();f.moveTo(ix+q*3,GY-1);f.lineTo(ix+q*9+(q%2?3:-3),GY-1+5*Math.min(1,a/.15));f.stroke();}f.restore();}}
  else if(k==='kunaistab'){impactFX(f,ix,GY-48+(i%2?3:-3),a,5+i,i===H.length-1&&last);if(a>=0)bloodSpray(f,ix,GY-46,a,7+i,6,-dir);}
 });
 if(k==='investida')cmDust(f,ax,dir,t,H[0].t-.4,H[0].t);
 if(k==='mordida'||k==='arranhao')cmDust(f,ax,dir,t,.62,.72);
};}
/* cria o golpe nos dois lados */
function cmMirror(name){const B=ANIMS[name],mir=arr=>arr.map(([t,x])=>[t,384-x]);
 const vic=p=>p===N_HIT||p===N_HITB?S_HIT:p===N_STAG?S_STAG:READY;
 const N={enemy:true,dur:B.dur,hold:B.hold,hitT:B.hitT,hits:B.cmHits.map(h=>({t:h.t,dmg:h.dmg})),cost:0,noLift:true,tpN:B.tp,
  nP:B.sP,nX:mir(B.sX),sP:B.nP.map(([t,p])=>[t,vic(p)]),sX:mir(B.nX),
  cam:B.cam.map(([t,cm])=>[t,Object.assign({},cm,{cx:384-cm.cx})]),env:B.env};
 if(B.sYf){N.nYf=B.sYf;N.noLift=false;}if(B.nYf)N.sYf=B.nYf;return N;}
function defCm(name){const D=CM_DEF[name];
 const A={dur:D.dur,hold:D.hits[0][0],hitT:D.hits[0][0],dmg:D.hits.reduce((s,h)=>s+h[1],0),cost:0,tp:[D.hits[D.hits.length-1][0]+.4],sP:D.sP,sX:D.sX,nP:D.nP,nX:D.nX,cam:D.cam};
 if(D.sYf)A.sYf=D.sYf;if(D.nYf)A.nYf=D.nYf;
 A.env=CM_ENV(D.hits[0][0],D.kind==='porrete'?10:D.kind==='investida'?8:4);
 A.cmHits=D.hits.map(([t,dmg])=>({t,dmg}));
 A.fx=cmFxMaker(name,name,false);ANIMS[name]=A;
 const N=cmMirror(name);N.fx=cmFxMaker(name,'n'+name,true);ANIMS['n'+name]=N;}
Object.keys(CM_DEF).forEach(defCm);
/* inclinacao/achatamento do corpo do atacante (lobo se agacha e salta, porretada etc.) */
function cmMotOpt(o,type,t,isNSide){const m=/^(n?)(cm[A-Z]\w+)$/.exec(type||'');if(!m)return;const D=CM_DEF[m[2]];if(!D||!D.mot)return;if((m[1]==='n')!==isNSide)return;
 const r=D.mot(t);if(r.rot)o.rot=r.rot;if(r.flat)o.flat=r.flat;if(r.sc)o.sc=r.sc;}
{const _dn=dmNOpt,_ds=dmSOpt;dmNOpt=function(o,type,t,A,out){_dn.apply(this,arguments);cmMotOpt(o,type,t,true);};dmSOpt=function(o,type,t,A,out){_ds.apply(this,arguments);cmMotOpt(o,type,t,false);};}

/* ---- kits: so os golpes que combinam com cada inimigo (peso, nivel minimo) ---- */
const CM_LABEL={cmMordida:'Mordida',cmArranhao:'Arranhão',cmInvestida:'Investida',cmFaca:'Facada',cmPorrete:'Porretada',cmGolpeKunai:'Golpe de Kunai',soco:'Soco',chute:'Chute',kunai:'Kunai',shuriken:'Shuriken'};
const CM_KIT={
 lobo:{moves:[['cmMordida',3],['cmArranhao',2.4],['cmInvestida',1.6,2]]},
 bandido:{moves:[['soco',1.6],['chute',1.2],['cmFaca',2.8],['cmPorrete',1.8,2]]},
 renegado:{moves:[['soco',1.2],['chute',1],['kunai',2],['shuriken',2],['cmGolpeKunai',2.4]],kaw:true},
 /* Irmaos Demonios: os golpes deles sao do lado direito (demonPick); no lado esquerdo (heroi Naruto/Gozu/Meizu) so os basicos de ninja */
 gozu:{moves:[['soco',1.4],['chute',1.1],['kunai',1.8],['shuriken',1.8]]},meizu:{moves:[['soco',1.4],['chute',1.1],['kunai',1.8],['shuriken',1.8]]}};
const CM_NID={soco:'nsoco',chute:'nchute',kunai:'gkunai',shuriken:'gshuriken'};
const cmOpts=kit=>kit.moves.filter(m=>(m[2]||1)<=actLvl()).map(m=>[m[0],m[1]]);
/* lado da direita (heroi do Sasuke/Sakura/Kakashi): devolve o golpe para o enemyTurn */
function commonPick(){const kit=CM_KIT[enemySkin];if(!kit||enemySkin==='gozu'||enemySkin==='meizu')return null;
 if(kit.kaw&&!kawN&&kawUseN<KAWARIMI_MAX&&ck.n>=KAWARIMI_COST&&hp.n<70&&Math.random()<.2)return'nkawarimi';
 const id=aiPickW(cmOpts(kit),o=>o[1])[0],nm=CAMP.active?CAMP.active.name:'O inimigo';
 setTimeout(()=>toast(nm+' usa '+CM_LABEL[id]),250);
 return CM_NID[id]||('n'+id);}
/* lado da esquerda (heroi Naruto/Gozu/Meizu): joga o turno da IA com o mesmo kit */
function cmAiS(){const kit=CM_KIT[enemySkin];if(!kit)return false;if(outcome||anim)return true;turnLock=false;
 const nm=CAMP.active?CAMP.active.name:'O inimigo';
 if(kit.kaw&&!kawS&&kawUseS<KAWARIMI_MAX&&ck.s>=KAWARIMI_COST&&hp.s<70&&Math.random()<.2){ck.s=Math.max(0,ck.s-KAWARIMI_COST);kawS=true;kawUseS++;setBars();toast(nm+' se prepara...');turnLock=true;setTimeout(()=>{turnLock=false;showMenu('main');setCommands(true);},1100);return true;}
 const id=aiPickW(cmOpts(kit),o=>o[1])[0];
 const cd=(typeof ATKS!=='undefined'&&ATKS.find(x=>x.id===id))||{id,name:CM_LABEL[id],col:'#fff',live:true,desc:'',cost:0};
 toast(nm+' usa '+CM_LABEL[id]);play(cd);return true;}

/* ---- sons: golpes novos usam o som do soco ---- */
{const _sfx=sfx;sfx=function(type){if(typeof type==='string'&&/^n?cm[A-Z]/.test(type))type='soco';return _sfx.apply(this,arguments);};}

/* ---- inimigo no lado esquerdo (heroi Naruto/Gozu/Meizu): usa os quadros do inimigo vestido, mapeados para as poses do Sasuke ---- */
{const KEYMAP={idle:'guard',guard:'guard',block:'block',katon:'seal',seal:'seal',eh:'seal',chidori:'charge',pw:'pw',kw:'kick',punch:'punch',kick:'kick',hit:'hit',down:'down',run:'run',tw:'punch',tt:'punch',te:'punch'};
 for(const k in SPRE){const set=SPRE[k];if(!set||!set.guard)continue;const S2={};for(const key in SPR)S2[key]=set[KEYMAP[key]]||set.guard;SPRES[k]=S2;}}

/* ---- nomes na tela: quem venceu e quem sofre o golpe aparecem com o nome certo (heroi do jogador ou o inimigo da fase) ---- */
const cmShort=n=>String(n).replace(/\s*\(.*\)/,'');
function cmEnemyName(){const a=(typeof hubMode!=='undefined'&&hubMode)?null:CAMP.active;if(a&&a.name)return cmShort(a.name);return roleN?'Sasuke':(nSkin()?nSkin().charAt(0).toUpperCase()+nSkin().slice(1):'Naruto');}
function cmHeroName(){return roleN?NN():HN();}
function koName(w){return String((w==='N')===roleN?cmHeroName():cmEnemyName()).toUpperCase();}
/* avisos antigos falam sempre 'Naruto' ou 'Sasuke': troca pelo nome de quem esta em cena */
{const _toast=toast;toast=function(msg){if(typeof msg==='string'&&CAMP.active&&!(typeof hubMode!=='undefined'&&hubMode)){const en=cmEnemyName(),he=cmHeroName();
  msg=roleN?msg.replace(/Sasuke/g,en).replace(/Naruto/g,he):msg.replace(/Naruto/g,en);}
  return _toast.call(this,msg);};}
