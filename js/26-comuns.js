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

/* efeitos de cada golpe: o mesmo codigo serve para o atacante dos dois lados */
function cmFxMaker(kind,id,isN){return c=>{
 const {f,t}=c,A=ANIMS[id],dir=isN?-1:1,ax=interp(isN?A.nX:A.sX,t),vx=interp(isN?A.sX:A.nX,t),a=t-A.hitT,ix=vx-dir*6,hy=GY-50,hx=ax+dir*14;
 dashLines(f,c,A.hitT-.4,A.hitT,5);
 if(kind==='mordida'){
  const g1=Math.max(0,1-a/.1)*11,g2=Math.max(0,1-(a-.2)/.1)*8;
  if(a>=0&&a<.2)cmFangs(f,ix,GY-48,g1,1-a/.45);else if(a>=.2&&a<.5)cmFangs(f,ix,GY-48,g2,Math.max(0,1-(a-.2)/.3));
  impactFX(f,ix,GY-48,a,5,false);impactFX(f,ix,GY-48,a-.2,6,false);if(a>=0)bloodSpray(f,ix,GY-46,a,7,10,-dir);}
 else if(kind==='arranhao'){
  cmClaws(f,ix,GY-46,0,a,dir,1);cmClaws(f,ix+dir*3,GY-46,.14,a,dir,-1);
  impactFX(f,ix,GY-46,a,5,false);impactFX(f,ix,GY-46,a-.14,6,false);if(a>=0)bloodSpray(f,ix,GY-46,a,7,10,-dir);}
 else if(kind==='investida'){
  cmDust(f,ax,dir,t,A.hitT-.45,A.hitT);cmShock(f,ix,a,true);
  impactFX(f,ix,GY-40,a,6,true);if(a>=0)bloodSpray(f,ix,GY-40,a,8,12,-dir);}
 else if(kind==='faca'){
  const ang=t<A.hitT-.1?cmLerp(-1.9,.2,(t-(A.hitT-.45))/.35):cmLerp(.2,1.1,(t-(A.hitT-.1))/.12);
  if(t>A.hitT-.6&&t<A.hitT+.3){cmWeapon(c,'knife',hx,hy,t<A.hitT-.45?-.5:ang,dir);}
  if(a>=0&&a<.3){const k=a/.3;f.save();f.translate(ix,GY-46);f.scale(dir,1);f.strokeStyle=`rgba(255,255,255,${1-k})`;f.lineWidth=3*(1-k)+.5;f.lineCap='round';f.beginPath();f.arc(-4,0,16+8*k,-1.2,1.2);f.stroke();f.restore();}
  if(a>=.16&&a<.46){const k=(a-.16)/.3;f.save();f.translate(ix,GY-42);f.scale(dir,1);f.strokeStyle=`rgba(255,235,230,${1-k})`;f.lineWidth=2.4*(1-k)+.4;f.lineCap='round';f.beginPath();f.arc(-2,0,14+8*k,1.2,-1.2,true);f.stroke();f.restore();}
  impactFX(f,ix,GY-46,a,5,false);impactFX(f,ix,GY-42,a-.16,6,false);if(a>=0)bloodSpray(f,ix,GY-44,a,7,12,-dir);}
 else if(kind==='porrete'){
  const ang=t<A.hitT-.05?cmLerp(-2.5,-2.4,(t-(A.hitT-.6))/.4)+(t>A.hitT-.3?cmLerp(0,3.0,(t-(A.hitT-.3))/.25):0):cmLerp(.55,.55,0);
  if(t>A.hitT-.75&&t<A.hitT+.45)cmWeapon(c,'club',hx,hy-6,Math.min(.6,ang),dir);
  cmShock(f,ix,a,true);impactFX(f,ix,GY-52,a,5,true);if(a>=0)bloodSpray(f,ix,GY-50,a,7,14,-dir);}
 else if(kind==='kunaistab'){
  let ext=0;for(const dt of [0,.14,.28])ext+=14*Math.exp(-Math.pow((t-(A.hitT+dt))/.045,2));
  if(t>A.hitT-.5&&t<A.hitT+.55)cmWeapon(c,'kunai',hx+dir*ext,hy+2,0,dir);
  for(const [i,dt] of [[5,0],[6,.14],[7,.28]]){impactFX(f,ix,GY-48+(dt?(dt>.2?3:-3):0),a-dt,i,false);}
  if(a>=0)bloodSpray(f,ix,GY-46,a,7,10,-dir);}
};}

/* cria o golpe nos dois lados a partir de uma animacao-base (soco ou chute): o.k estica o tempo, o.hits = [[atraso,dano],...] */
function cmMirror(name){const B=ANIMS[name],mir=arr=>arr.map(([t,x])=>[t,384-x]);
 const vic=p=>p===N_HIT||p===N_HITB?S_HIT:p===N_STAG?S_STAG:READY;
 return{enemy:true,dur:B.dur,hold:B.hold,hitT:B.hitT,hits:B.cmHits.map(h=>({t:h.t,dmg:h.dmg})),cost:0,noLift:true,tpN:B.tp,
  nP:B.sP,nX:mir(B.sX),sP:B.nP.map(([t,p])=>[t,vic(p)]),sX:mir(B.nX),
  cam:B.cam.map(([t,cm])=>[t,Object.assign({},cm,{cx:384-cm.cx})]),env:B.env};}
function defCm(name,base,o){const B=ANIMS[base],k=o.k||1,sc=arr=>arr.map(r=>[r[0]*k].concat(r.slice(1)));
 const A={dur:B.dur*k,hold:B.hold*k,hitT:B.hitT*k,dmg:o.hits.reduce((s,h)=>s+h[1],0),cost:0,tp:B.tp.map(x=>x*k),sP:sc(B.sP),sX:sc(B.sX),nP:sc(B.nP),nX:sc(B.nX),cam:sc(B.cam)};
 if(B.sArc)A.sArc=[B.sArc[0]*k,B.sArc[1]*k,B.sArc[2]];
 A.env=(raw,t)=>{const a=t-A.hitT,E={};if(a>0&&a<.4)E.shk=(o.shk||5)*(1-a/.4);if(a>=0&&a<.03)E.flash=.3;else if(a>=.03&&a<.1)E.flash=.1;return E;};
 A.cmHits=o.hits.map(([dt,dmg])=>({t:A.hitT+dt,dmg}));
 A.fx=cmFxMaker(o.kind,name,false);ANIMS[name]=A;
 const N=cmMirror(name);N.fx=cmFxMaker(o.kind,'n'+name,true);ANIMS['n'+name]=N;}
defCm('cmMordida','soco',{kind:'mordida',hits:[[0,9]],shk:4});
defCm('cmArranhao','soco',{kind:'arranhao',hits:[[0,4],[.14,4]],shk:3});
defCm('cmInvestida','chute',{kind:'investida',hits:[[0,13]],k:1.05,shk:8});
defCm('cmFaca','soco',{kind:'faca',hits:[[0,5],[.16,4]],shk:3});
defCm('cmPorrete','soco',{kind:'porrete',hits:[[0,14]],k:1.3,shk:9});
defCm('cmGolpeKunai','soco',{kind:'kunaistab',hits:[[0,4],[.14,4],[.28,3]],shk:3});

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
