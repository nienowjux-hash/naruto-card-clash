/* ---------- Modo vila ----------
   Fora de um duelo da campanha o jogador fica na vila (cenario de Konoha, menu proprio, sem HUD nem comandos de luta).
   O duelo so comeca ao clicar em "Lutar" numa fase; "Abandonar luta" (ctl) larga o duelo e volta para a vila.
   "Treino livre" abre o combate de teste antigo (Sasuke x Naruto) fora da campanha. */
let hubMode=!(CAMP.active&&(NHEROES.includes(CAMP.active.hero)===roleN));
function enterHub(){hubMode=true;document.body.classList.add('hub');CAMP.active=null;saveCamp();enemySkin=null;playSkin=null;try{applyHero('sasuke');setEnemyName(null);}catch(e){}setScene('vila');showHubMenu();}
function leaveHub(){hubMode=false;document.body.classList.remove('hub');}
function showHubMenu(){menuOpen='main';const h=$('hand');h.innerHTML='';setHead('VILA DE KONOHA');
 const add=(ic,name,desc,col,fn)=>{const b=document.createElement('button');b.className='cmd';b.style.setProperty('--cc',col);b.innerHTML=`<span class="ic">${ic}</span><span class="tx"><b>${name}</b><small>${desc}</small></span><span></span>`;b.onclick=fn;h.appendChild(b);};
 add('地','Mapa da campanha','Escolha o local, monte a equipe e parta para as fases.','#ffd97a',()=>openMap());
 add('技','Árvore de habilidades','Gaste pontos para aprender golpes.','#7fd4ff',()=>openTree());
 add('装','Equipamentos','Armas, roupas e acessórios da equipe.','#9fe0a0',()=>openInv());
 add('買','Loja do Armeiro','Compre e venda itens com ryo.','#ffd97a',()=>openShop());
 add('麺','Ichiraku Ramen','Um prato com bônus para a próxima fase.','#ffb070',()=>openRamen());
 add('召','Invocação','Gaste pergaminhos para chamar novos ninjas.','#c090ff',()=>openGacha());
 add('消','Reiniciar o jogo','Apaga campanha, níveis, itens e personagens obtidos.','#ff6a6a',()=>resetAll());
 add('練','Treino livre','Luta de teste, fora da campanha.','#ff9a6a',()=>{leaveHub();syncCtl();CAMP.active=null;setScene('vale');$('rst').onclick();showMenu('main');});
 syncCtl();}
/* "Abandonar luta" so aparece com uma luta em andamento */
function syncCtl(){const b=document.getElementById('abandon');if(b)b.style.display=hubMode?'none':'';}
function abandonDuel(){
 if(hubMode||outcome)return;
 if(!confirm('Abandonar a luta? O inimigo não é derrotado e a fase continua do ponto em que está.'))return;
 const a=CAMP.active,p=CAMP.phase;
 if(p&&a&&a.foe!=null){const u=p.u[a.hero],m=roleN?'n':'s';if(u){u.hp=Math.max(1,hp[m]);u.ck=ck[m];}}
 const node=a?a.node:CAMP.at;$('rst').onclick();mapSel=node;enterHub();saveCamp();openMap();}
(function(){const c=document.querySelector('.ctl');if(!c)return;const b=document.createElement('button');b.id='abandon';b.textContent='Abandonar luta';b.onclick=abandonDuel;c.insertBefore(b,c.firstChild);
 const st=document.createElement('style');st.textContent='body.hub .hud,body.hub #rst,body.hub #nmbtn,body.hub #sprbtn{display:none!important}body.hub #stage{pointer-events:none}';document.head.appendChild(st);})();
/* o menu de luta nunca aparece na vila */
const _showMenuBattle=showMenu;
showMenu=function(m){if(hubMode){showHubMenu();return;}return _showMenuBattle.apply(this,arguments);};
if(hubMode){document.body.classList.add('hub');setScene('vila');showHubMenu();}else syncCtl();

/* Reiniciar: zera TUDO (campanha, niveis, habilidades, itens, ryo, pergaminhos, personagens obtidos e butim) */
function resetAll(){
 if(!confirm('REINICIAR O JOGO? Isso apaga TUDO: campanha, níveis, habilidades, itens, ryo, pergaminhos e os personagens obtidos na invocação (Gozu e Meizu voltam a ficar bloqueados).'))return;
 resetCamp();resetProg();resetInv();if(typeof resetShop==='function')resetShop();
 GACHA={scrolls:12,owned:[],frags:{},pityRare:0,pityLeg:0,pulls:0};saveGacha();
 mapTeam=null;mapAssign=[];mapSel=null;mapTok=null;mapHero='sasuke';
 try{syncHpMax(true);}catch(e){}
 enterHub();renderMap();toast('Jogo reiniciado');}

/* "Fugir da luta": ultimo comando do menu principal (em qualquer heroi). Mesmo efeito de Abandonar luta */
function addFleeCmd(){if(hubMode||menuOpen!=='main')return;const h=$('hand');if(!h||h.querySelector('.cmd.flee'))return;
 const b=document.createElement('button');b.className='cmd flee';b.style.setProperty('--cc','#ff6a6a');
 b.innerHTML='<span class="ic">逃</span><span class="tx"><b>Fugir da luta</b><small>Larga o duelo e volta para a vila. O inimigo não é derrotado e a fase continua.</small></span><span></span>';
 b.onclick=()=>{if(anim||turnLock||outcome)return;abandonDuel();};
 if(anim||turnLock||outcome)b.disabled=true;h.appendChild(b);}
for(const nm of ['showMenu','showNarutoMenu','showDemonMenu']){const fn=window[nm];if(typeof fn!=='function')continue;window[nm]=function(){const r=fn.apply(this,arguments);addFleeCmd();return r;};}

/* dano base de cada golpe, visivel antes de escolher (menu de jutsus/ataques de qualquer heroi) */
const mvNorm=t=>String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\(.*?\)/g,'').replace(/ no jutsu/g,'').replace(/[^a-z0-9: ]/g,'').replace(/\s+/g,' ').trim();
function moveIdByName(n){if(typeof MOVE_ALIAS!=='undefined'&&MOVE_ALIAS[n])return MOVE_ALIAS[n];for(const L of [typeof ATKS!=='undefined'?ATKS:[],typeof SASUKE_JUTSUS!=='undefined'?SASUKE_JUTSUS:[],typeof SAKURA_JUTSUS!=='undefined'?SAKURA_JUTSUS:[],typeof KAKASHI_JUTSUS!=='undefined'?KAKASHI_JUTSUS:[]]){const cd=L.find(c=>c.name===n);if(cd)return cd.id;}for(const k in MOVES)if(MOVES[k].name===n)return k;const q=mvNorm(n);for(const k in MOVES)if(mvNorm(MOVES[k].name)===q)return k;return null;}
function baseDmg(id){const A=ANIMS[id];if(!A)return 0;if(A.dmg)return A.dmg;return A.hits?A.hits.reduce((s,h)=>s+(h.dmg||0),0):0;}
function addDmgChips(){const h=$('hand');if(!h||hubMode)return;h.querySelectorAll('.cmd').forEach(b=>{if(b.querySelector('.dmgc')||b.classList.contains('flee'))return;const bb=b.querySelector('b');if(!bb||!bb.firstChild||bb.firstChild.nodeType!==3)return;
 const id=moveIdByName(bb.firstChild.nodeValue.trim());if(!id)return;const d=baseDmg(id);if(!d)return;
 const A=ANIMS[id],hits=A.hits&&A.hits.length>1?A.hits.length:0,i=document.createElement('i');i.className='dmgc';i.title='Dano base (antes de elemento, equipamentos e defesa)';i.textContent='⚔ '+d+(hits?' ('+hits+' golpes)':'');bb.appendChild(i);});}
for(const nm of ['showMenu','showNarutoMenu','showDemonMenu']){const fn=window[nm];if(typeof fn!=='function')continue;window[nm]=function(){const r=fn.apply(this,arguments);addDmgChips();return r;};}

/* predios clicaveis da vila: botoes sobre o canvas (posicao em % do mundo 384x216) */
function konSpots(){document.querySelectorAll('.konhot').forEach(e=>e.remove());if(!hubMode)return;const st=document.getElementById('stage');if(!st||typeof KON_SPOTS==='undefined')return;
 KON_SPOTS.forEach(s=>{const b=document.createElement('button');b.className='konhot';b.style.left=(s.x/384*100)+'%';b.style.top=(s.y/216*100)+'%';b.innerHTML=`<b>${s.name}</b><small>${s.sub}</small>`;b.onclick=s.go;st.appendChild(b);});}
{const _enter=enterHub,_leave=leaveHub;enterHub=function(){const r=_enter.apply(this,arguments);konSpots();return r;};leaveHub=function(){const r=_leave.apply(this,arguments);konSpots();return r;};}
konSpots();
