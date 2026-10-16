/* ---------- comandos do RPG (menu de jutsus e golpes) ---------- */
function iconBG(c,a,b){const gr=c.createLinearGradient(0,0,0,80);gr.addColorStop(0,a);gr.addColorStop(1,b);c.fillStyle=gr;c.fillRect(0,0,64,80);}
const SASUKE_JUTSUS=[
 {id:'chidori',name:'Chidori',cost:3,col:'#7fd4ff',desc:'Sasuke concentra relâmpagos na mão e perfura o inimigo em alta velocidade.',live:true,
  icon:c=>{iconBG(c,'#050a30','#2a5bd0');c.globalCompositeOperation='lighter';orb(c,32,42,34,[[0,'rgba(120,190,255,.7)'],[1,'rgba(30,70,255,0)']]);let L=[];for(let i=0;i<16;i++){const r2=R(i*9+4);L.push(...boltLines(32,42,r2()*TAU,12+r2()*18,i*31+7,true));}drawBolts(c,L,.9);orb(c,32,42,10,[[0,'#fff'],[.4,'rgba(210,245,255,.9)'],[1,'rgba(90,170,255,0)']]);c.globalCompositeOperation='source-over';}},
 {id:'katon',name:'Katon: Bola de Fogo',cost:2,col:'#ffa43a',desc:'Uma enorme bola de fogo sai da boca e explode no alvo, causando queimadura.',live:true,
  icon:c=>{iconBG(c,'#2a0a14','#8a2a10');fireBlob(c,32,44,17,1.2);const r2=R(3);c.globalCompositeOperation='lighter';for(let i=0;i<16;i++){c.fillStyle=r2()<.5?'#ffd860':'#ff6a1a';c.fillRect(8+r2()*48,12+r2()*54,.7,.7);}c.globalCompositeOperation='source-over';}},
 {id:'amaterasu',name:'Amaterasu',cost:5,col:'#c75a8a',desc:'Chamas negras que não se apagam. O olho sangra e o alvo queima.',live:true,
  icon:c=>{iconBG(c,'#14041c','#3a0a3a');c.globalCompositeOperation='lighter';orb(c,32,40,30,[[0,'rgba(220,30,110,.4)'],[1,'rgba(220,30,110,0)']]);c.globalCompositeOperation='source-over';for(let i=0;i<5;i++)blob(c,32+(i-2)*6,54-i%2*4,12-Math.abs(i-2)*2,'#05020a',i*1.7,.35,1.5);for(let i=0;i<5;i++)blob(c,32+(i-2)*6,50-i%2*4,5,'#3a0a3e',i*2.3,.35,1.6);orb(c,32,24,10,[[0,'rgba(255,60,80,.8)'],[1,'rgba(255,60,80,0)']]);c.fillStyle='#e8d8d8';c.beginPath();c.arc(32,24,7,0,TAU);c.fill();c.fillStyle='#d81020';c.beginPath();c.arc(32,24,5,0,TAU);c.fill();c.fillStyle='#000';for(let i=0;i<3;i++){const a=i*TAU/3;c.beginPath();c.arc(32+Math.cos(a)*3,24+Math.sin(a)*3,1,0,TAU);c.fill();}c.beginPath();c.arc(32,24,1,0,TAU);c.fill();}}
];
let guard=false,menuOpen='main',copied=null,lastEnemy=null,sealT=0,seal2T=0,lastP2=false,stunN=false;
SASUKE_JUTSUS.push({id:'copy',name:'Copiar Técnica (Sharingan)',cost:8,col:'#e0306c',desc:()=>lastEnemy?('Copia '+(lastEnemy==='rasengan'?'o Rasengan':'o Kage Bunshin')+'. Gasta o turno. A cópia vale 1 uso, 75% do dano e 60% do chakra.'):'Precisa que o Naruto use uma técnica antes.',live:true,ok:()=>!!lastEnemy&&!copied,onUse:()=>{copied=lastEnemy;}},
{id:'cop_rasengan',name:'Cópia: Rasengan',cost:18,col:'#6fb8ff',desc:'Rasengan copiado: 22 de dano, uso único.',live:true,show:()=>copied==='rasengan',onUse:()=>{copied=null;}},
{id:'cop_bunshin',name:'Cópia: Kage Bunshin',cost:15,col:'#ffa43a',desc:'Kage Bunshin copiado: 24 de dano, uso único.',live:true,show:()=>copied==='bunshin',onUse:()=>{copied=null;}},
{id:'genjutsu',name:'Genjutsu Sharingan',cost:12,col:'#e0306c',desc:'Prende o alvo numa ilusão: 14 de dano e ele perde o próximo turno (não funciona em turnos seguidos).',live:true,onUse:()=>{if(immN)toast('Naruto resistiu à ilusão!');else stunN=true;}},
{id:'shishi',name:'Shishi Rendan',cost:25,col:'#ffb04a',desc:'Barragem de Leões: combo aéreo de taijutsu copiado de Rock Lee.',live:true},
{id:'selo',name:'Selo Amaldiçoado (Nível 1)',cost:20,col:'#9a9aa8',desc:'Libera o selo: perde 8 de vida. Por 3 turnos fica mais forte e rápido: +30% de dano, +10 de chakra por turno e 30% de chance de desviar.',live:true,noSeal:true,ok:()=>sealT===0&&seal2T===0,onUse:()=>{hp.s=Math.max(1,hp.s-8);sealT=4;setBars();}},
{id:'selo2',name:'Selo Amaldiçoado (Nível 2)',cost:40,col:'#8a7ab8',desc:'Transformação: perde 15 de vida. Por 3 turnos: +60% de dano, +15 de chakra por turno, 40% de chance de desviar e libera o Chidori Sombrio.',live:true,noSeal:true,ok:()=>seal2T===0,onUse:()=>{hp.s=Math.max(1,hp.s-15);seal2T=4;sealT=0;setBars();}},
{id:'selochidori',name:'Chidori Sombrio (Nível 2)',cost:35,col:'#8a50c8',desc:'O Chidori negro e roxo da transformação. Dano alto e fatality.',live:true,show:()=>seal2T>0,ok:()=>seal2T>0,onUse:()=>{hp.s=Math.max(1,hp.s-6);setBars();}},
{id:'soushuken',name:'Sōshūken no Jutsu',cost:17,col:'#9fc8ff',desc:'Shuriken e kunai guiados por fios invisíveis atacam de ângulos surpresa.',live:true},{id:'kagesh',name:'Shuriken Kage no Jutsu',cost:16,col:'#8a7ad0',desc:'Uma shuriken escondida na sombra de outra surpreende o alvo.',live:true});
const CMDS=[
 {name:'Atacar',desc:'Kunai, Shuriken, Soco ou Chute',col:'#ffb04a',run:()=>showMenu('atk')},
 {name:'Jutsu',desc:'Escolher uma técnica',col:'#7fd4ff',run:()=>showMenu('jutsu')},
 {name:'Defender',desc:'Reduz à metade o próximo dano e recupera 10 de chakra',col:'#c9b27a',run:()=>idleAct('defend')},
 {name:'Concentrar',desc:'Recupera 25 de chakra',col:'#9fe0ff',run:()=>idleAct('focus')},
 {name:'Itens',desc:()=>'Usa uma pílula ou pergaminho da mochila (gasta o turno)',col:'#9fe0a0',ok:()=>consumables().length>0,run:()=>showMenu('itens')},
 {name:'Kawarimi',desc:()=>'Troca de lugar com um tronco: evita por completo o próximo golpe, sem que o inimigo perceba (restam '+(KAWARIMI_MAX-kawUseS)+' de '+KAWARIMI_MAX+')',col:'#c9b27a',cost:KAWARIMI_COST,ok:()=>!kawS&&kawUseS<KAWARIMI_MAX,run:()=>idleAct('kawarimi')}];
function showMenu(m){if(roleN){showNarutoMenu();return;}menuOpen=m;const h=$('hand');h.innerHTML='';setHead(m==='main'?'COMANDOS':m==='atk'?'ATACAR':m==='itens'?'ITENS':'JUTSU');
 const add=(name,desc,col,k,cost,fn,ok,mv)=>{const b=document.createElement('button');b.className='cmd';b.style.setProperty('--cc',col);b.innerHTML=`<span class="ic">${k}</span><span class="tx"><b>${name}${elemChip(mv||moveByName(name))}</b><small>${desc}</small></span>`+(cost!=null?`<span class="cost">${cost}<em>CK</em></span>`:'<span></span>');b.onclick=fn;b._cost=cost;b._ok=ok||null;h.appendChild(b);};
 if(m==='main')CMDS.forEach((c,i)=>add(c.name,typeof c.desc==='function'?c.desc():c.desc,c.col,i+1,c.cost==null?null:c.cost,c.run,c.ok));
 else if(m==='itens'){consumables().forEach((id,i)=>add(ITEMS[id].name+' ×'+bagQty(id),ITEMS[id].d,RARITY[ITEMS[id].rar].col,i+1,null,()=>idleAct('item:'+id)));add('Voltar','Menu principal','#888','Esc',null,()=>showMenu('main'));}
 else{(m==='atk'?ATKS:SASUKE_JUTSUS.filter(cd=>!cd.show||cd.show())).filter(cd=>moveUnlocked('sasuke',cd.id)).forEach((cd,i)=>add(cd.name,typeof cd.desc==='function'?cd.desc():cd.desc,cd.col,i+1,ANIMS[cd.id]?ANIMS[cd.id].cost:cd.cost,()=>play(cd),cd.ok,MOVES[cd.id]));add('Voltar','Menu principal','#888','Esc',null,()=>showMenu('main'));}
 setCommands(!anim&&!outcome&&!turnLock);}
function buildMenu(){showMenu('main');}
function setCommands(on){[...$('hand').children].forEach(b=>{b.disabled=!on||(b._cost!=null&&(roleN?ck.n:ck.s)<b._cost)||(b._ok&&!b._ok());});}
function speak(line,pos){const s=$('speech');s.textContent=line;s.style.left=pos?pos[0]:'31%';s.style.top=pos?pos[1]:'18%';s.classList.remove('on');void s.offsetWidth;s.classList.add('on');later(2200,()=>s.classList.remove('on'));}
function idleAct(t){if(anim||frozen||outcome||turnLock)return;battleOn=true;ensureAudio();turnLock=true;
 if(t==='kawarimi'){if(kawS||kawUseS>=KAWARIMI_MAX||ck.s<KAWARIMI_COST){turnLock=false;return;}ck.s=Math.max(0,ck.s-KAWARIMI_COST);kawS=true;kawUseS++;toast('Kawarimi preparado: o próximo golpe será evitado ('+(KAWARIMI_MAX-kawUseS)+' uso'+(KAWARIMI_MAX-kawUseS===1?'':'s')+' restante'+(KAWARIMI_MAX-kawUseS===1?'':'s')+')');}else if(t.indexOf('item:')===0){if(!useItem('s',t.slice(5))){turnLock=false;return;}}else if(t==='defend'){guard=true;ck.s=Math.min(100,ck.s+10);toast('Sasuke se defende: próximo dano cai pela metade');}
 else{ck.s=Math.min(100,ck.s+25);toast('Sasuke concentra chakra');}
 setBars();setCommands(false);setTimeout(()=>{if(!outcome&&!anim)enemyTurn();},900);}
function play(cd){
 if(anim||frozen)return;
 if(!cd.live){toast(cd.name+': ainda não animada nesta demo');return;}
 if(outcome||turnLock)return;battleOn=true;const A=ANIMS[cd.id];if(ck.s<A.cost){toast('Chakra insuficiente para '+cd.name);return;}ensureAudio();const dodge=kawN&&!bunta&&effDmg(cd,A)>0,em=bunta?1:elemMult((MOVES[cd.id]||{}).elem,'naruto'),dm=dodge?0:Math.round(effDmg(cd,A)*em*(bunta?1:dmgMod('s','n',(MOVES[cd.id]||{}).elem))*(gdN?.5:1)),lethal=dm>0&&!bunta&&hp.n-dm<=0;if(dodge)kawN=false;if(gdN&&dm>0)gdN=false;if(!dodge&&em!==1&&dm>0)later(A.hitT*1000,()=>toast(elemMsg(em)));turnLock=true;if(cd.onUse&&!(dodge&&cd.id==='genjutsu'))cd.onUse();
 anim={type:cd.id,t0:performance.now(),dur:((lethal&&A.L)?A.L.dur:A.dur)+HS,lethal,dodge:dodge?mkDodge('N',A):null};setCommands(false);ck.s=Math.max(0,ck.s-A.cost);setBars();if(!(lethal&&A.L&&A.L.g))sfx(cd.id);
 const BNR=({selo2:[1000,'呪印','SELO AMALDIÇOADO','Nível 2','#8a7ab8'],chidori:[1350,'千鳥','CHIDORI','Mil Pássaros','#7fd4ff'],soushuken:[700,'操手剣','SŌSHŪKEN NO JUTSU','Manipulação da Shuriken','#9fc8ff'],kagesh:[700,'手裏剣影','SHURIKEN KAGE NO JUTSU','Técnica da Shuriken Sombra','#8a7ad0'],copy:[600,'写輪眼','SHARINGAN','Cópia de Técnicas','#e0306c'],genjutsu:[600,'幻術','GENJUTSU SHARINGAN','Ilusão do Sharingan','#e0306c'],shishi:[600,'獅子連弾','SHISHI RENDAN','Barragem de Leões','#ffb04a'],selochidori:[900,'呪印','SELO AMALDIÇOADO','Chidori Sombrio','#8a50c8'],cop_rasengan:[800,'螺旋丸','RASENGAN COPIADO','Sharingan: Cópia de Técnica','#6fb8ff'],cop_bunshin:[900,'影分身の術','KAGE BUNSHIN COPIADO','Sharingan: Cópia de Técnica','#ffa43a'],selo:[900,'呪印','SELO AMALDIÇOADO','Nível 1','#9a9aa8'],kawarimi:[1550,'変わり身の術','KAWARIMI NO JUTSU','Técnica da Substituição','#d9b878'],amaterasu:[1500,'天照','AMATERASU','Chamas Negras','#e0306c'],katon:[1500,'豪火球の術','KATON: GOUKAKYUU','Bola de Fogo Suprema','#ffa43a']})[cd.id];if(BNR)later(BNR[0],()=>banner(BNR[1],BNR[2],BNR[3],BNR[4]));
 later(A.hitT*1000,()=>{if(bunta){bunta.hp=Math.max(0,bunta.hp-dm);if(dm>0)dmgPop(dm);if(bunta.hp<=0)buntaDie();}else{hp.n=Math.max(0,hp.n-dm);if(dm>0){dmgPop(dm);applyDamage(cd.id);}if(cd.id==='amaterasu'&&!dodge)burning=true;}setBars();});
 if(dodge)later(A.hitT*1000,()=>{missPop('N');toast('Naruto usou o Kawarimi e evitou o golpe!');sfxDodge();setBars();});
 if(cd.id==='amaterasu')later(1250,()=>{WOUNDS.s.push({k:'eyeBlood',part:'face',t0:performance.now()/1000,seed:1,r:1});});
 if(lethal&&A.L){if(A.L.line)later(A.L.speakAt*1000,()=>speak(A.L.line,A.L.speechPos));later(A.L.bannerAt*1000,()=>banner(...(A.L.banner||['死','FATALITY','Chidori','#e0102a'])));(A.L.sfxFn||sfxFatal)();}
 if(lethal)later(((A.L?A.L.koAt:A.hitT+1.3))*1000,()=>{outcome='S';outcomeT=performance.now()/1000;const k=$('ko');k.classList.remove('on');void k.offsetWidth;k.classList.add('on');setCommands(false);});
}
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuOpen!=='main'){showMenu('main');return;}const n=parseInt(e.key,10);if(!(n>=1))return;const b=$('hand').children[n-1];if(b&&!b.disabled)b.click();});
$('rst').onclick=()=>{pending.forEach(clearTimeout);pending=[];gdN=false;rasKyu=false;rasKill=false;uzKill=false;kmKill=false;tpKill=false;stunS=0;immN=false;immS=false;toadUsed=false;kawS=false;kawN=false;kawUseS=0;kawUseN=0;kyuT=0;kyuUsed=false;bunta=null;buntaGone=0;chestHole=0;burnt=0;ashed=0;fatalKind=null;copied=null;lastEnemy=null;sealT=0;seal2T=0;stunN=false;$('speech').classList.remove('on');anim=null;outcome=null;burning=false;turnLock=false;guard=false;showMenu('main');WOUNDS.s.length=0;WOUNDS.n.length=0;$('ko').querySelector('span').textContent='SASUKE VENCEU';$('ko').classList.remove('on');battleOn=false;syncHpMax(true);ck={s:100,n:100};setBars();setCommands(true);$('banner').classList.remove('on');$('dmg').classList.remove('on');};
$('mute').onclick=()=>{sound=!sound;$('mute').textContent='Som: '+(sound?'ligado':'desligado');ensureAudio();};
buildMenu();setBars();
$('nmbtn').textContent='Jogar como: '+(roleN?'Naruto':'Sasuke');$('nmbtn').onclick=()=>{try{localStorage.setItem('playNaruto',roleN?'0':'1');}catch(e){}location.reload();};
$('sprbtn').textContent='Sasuke: '+(USE_SPR?'pixel art':'desenho antigo');$('sprbtn').onclick=()=>{try{localStorage.setItem('sasukeSprites',USE_SPR?'0':'1');}catch(e){}location.reload();};
portrait('ptS',SASUKE,mk({red:1,expr:1,hr:.05}));portrait('ptN',NARUTO,mk({expr:5}));

function sheet(mode){let cs=document.getElementById('sheet');if(!cs){cs=document.createElement('canvas');cs.id='sheet';cs.width=1280;cs.height=720;cs.style.cssText='position:absolute;left:0;top:0;width:100%;z-index:50';$('stage').appendChild(cs);}
 if(mode===0){cs.remove();return;}
 const c=cs.getContext('2d');c.setTransform(1,0,0,1,0,0);const gr=c.createLinearGradient(0,0,0,720);gr.addColorStop(0,'#3a3f7a');gr.addColorStop(1,'#14163a');c.fillStyle=gr;c.fillRect(0,0,1280,720);
 const items=mode===2?[[SASUKE,mk({red:0,expr:0}),0],[SASUKE,mk({red:1,expr:1}),1],[NARUTO,mk({expr:5}),2],[NARUTO,mk({expr:2}),3]]:[[SASUKE,READY,0],[SASUKE,CHARGE,1],[NARUTO,N_READY,2],[NARUTO,N_GUARD,3]];
 for(const [d,P,i] of items){c.save();if(mode===2){c.translate(160+i*320,330);c.scale(11.5/HEADS,11.5/HEADS);const r=rig(P);c.translate(-r.C[0],-r.C[1]);drawHead(c,d,P,r,1);}else{c.translate(150+i*320,680);c.scale(6.2,6.2);drawFig(c,d,P,1);}c.restore();}}
window.debug={hurt:applyDamage,burn:()=>{burning=true},sheet,freeze:(type,t)=>{frozen=type?{type,t}:null},play:id=>play(SASUKE_JUTSUS.concat(ATKS).find(c=>c.id===id))};
/* tela cheia de verdade (esconde a barra do navegador): botao ou tecla F */
function toggleFull(){const d=document;if(!d.fullscreenElement)(d.documentElement.requestFullscreen||d.documentElement.webkitRequestFullscreen||(()=>{})).call(d.documentElement);else(d.exitFullscreen||d.webkitExitFullscreen).call(d);}
$('fsbtn').onclick=toggleFull;
window.addEventListener('keydown',e=>{if((e.key==='f'||e.key==='F')&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&!/INPUT|TEXTAREA/.test((e.target||{}).tagName||''))toggleFull();});
document.addEventListener('fullscreenchange',()=>{$('fsbtn').textContent=document.fullscreenElement?'Sair da tela cheia (F)':'Tela cheia (F)';});
/* telas grandes (arvore, equipamentos): o conteudo foi desenhado para ~1300x800, entao ampliamos (zoom) para ocupar a janela toda,
   e a arvore ainda e esticada para preencher a area de rolagem */
const FIT_MODALS=[['#tree .tbox',1320,840],['#inv .ibox',1180,760]];
function fitModals(){const vw=innerWidth-24,vh=innerHeight-24;for(const [sel,dw,dh] of FIT_MODALS){const e=document.querySelector(sel);if(!e)continue;const z=Math.max(1,Math.min(vw/dw,vh/dh,2.2));e.style.zoom=z;e.style.width=(vw/z)+'px';e.style.height=(vh/z)+'px';}
 const sc=document.querySelector('#tree .tscroll'),cv=document.querySelector('#tree .tcanvas');if(sc&&cv){cv.style.zoom='';const w=parseFloat(cv.style.width)||cv.offsetWidth,h=parseFloat(cv.style.height)||cv.offsetHeight,z=Math.max(1,Math.min((sc.clientWidth-12)/w,(sc.clientHeight-12)/h,1.8));cv.style.zoom=z;}}
window.addEventListener('resize',fitModals);
new MutationObserver(()=>{requestAnimationFrame(fitModals);}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
