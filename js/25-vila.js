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
 add('召','Invocação','Gaste pergaminhos para chamar novos ninjas.','#c090ff',()=>openGacha());
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
