/* ---------- Invocacao de personagens (gacha) ----------
   Pergaminhos de Invocacao se ganham jogando (vitorias na campanha). Cada invocacao sorteia um personagem pela raridade.
   Garantias (pity): Raro ou melhor a cada 10 invocacoes; Lendario garantido na 60a, com a chance subindo a partir da 40a.
   Personagem repetido vira fragmentos, que dao estrelas (+vida e +ataque). Tudo vive em GACHA; para o modo online, so rollGacha() muda de lugar (vai para o servidor). */
const GACHA_KEY='rpgGachaV1',GACHA_STARTERS=['sasuke','naruto','sakura','kakashi'],GACHA_RATE={1:50,2:30,3:15,4:4,5:1},GACHA_PITY={rare:10,leg:60,soft:40},GACHA_DUPE={1:6,2:10,3:18,4:35,5:70},GACHA_STAR=[10,30,60,100,150];
let GACHA={scrolls:12,owned:[],frags:{},pityRare:0,pityLeg:0,pulls:0};
try{const j=JSON.parse(localStorage.getItem(GACHA_KEY)||'null');if(j)Object.assign(GACHA,j);else for(const c in CHARS)if(!GACHA_STARTERS.includes(c)&&PROG[c]&&PROG[c].level>1)GACHA.owned.push(c);}catch(e){}
function saveGacha(){try{localStorage.setItem(GACHA_KEY,JSON.stringify(GACHA));}catch(e){}}
const gachaOwned=c=>GACHA_STARTERS.includes(c)||GACHA.owned.includes(c);
const ownedChars=list=>(list||Object.keys(CHARS)).filter(gachaOwned);
const gachaPool=()=>Object.keys(CHARS).filter(c=>!GACHA_STARTERS.includes(c));
function starsOf(c){const f=GACHA.frags[c]||0;return GACHA_STAR.filter(n=>f>=n).length;}
/* chance atual do Lendario: 1% ate a 40a, sobe em rampa ate 100% na 60a */
function gachaLegChance(n){const p=GACHA_PITY;return n>=p.leg?1:n>p.soft?.01+(n-p.soft)/(p.leg-p.soft)*.99:.01;}
function rollGacha(){
 GACHA.pityRare++;GACHA.pityLeg++;GACHA.pulls++;
 let tier;
 if(Math.random()<gachaLegChance(GACHA.pityLeg))tier=5;
 else{const w=[1,2,3,4].map(t=>GACHA_RATE[t]);let x=Math.random()*w.reduce((a,b)=>a+b,0);tier=1;for(let i=0;i<4;i++){if((x-=w[i])<=0){tier=i+1;break;}}}
 if(GACHA.pityRare>=GACHA_PITY.rare&&tier<3)tier=3;
 if(tier>=3)GACHA.pityRare=0;
 if(tier===5)GACHA.pityLeg=0;
 /* sem personagem nessa raridade: cai para a mais proxima abaixo (e depois acima) */
 const pool=gachaPool(),by=t=>pool.filter(c=>(CHARS[c].rar||1)===t);
 let t=tier;while(t>1&&!by(t).length)t--;if(!by(t).length){t=tier;while(t<5&&!by(t).length)t++;}
 const list=by(t),id=list[Math.floor(Math.random()*list.length)],fresh=!gachaOwned(id);
 let gain=0;if(fresh)GACHA.owned.push(id);else{gain=GACHA_DUPE[CHARS[id].rar||1];GACHA.frags[id]=(GACHA.frags[id]||0)+gain;}
 return{id,rar:CHARS[id].rar||1,fresh,gain,stars:starsOf(id)};}
function gachaPull(n){if(GACHA.scrolls<n){toast('Faltam pergaminhos de invocação');return null;}
 GACHA.scrolls-=n;const out=[];for(let i=0;i<n;i++)out.push(rollGacha());saveGacha();return out;}
/* recompensa de luta: 1 pergaminho por vitoria, +2 na primeira vez no local, +3 em chefes */
function gachaReward(won){if(!won)return 0;const a=CAMP.active,nd=a?NODES[a.node]:null;let n=1;if(nd){if(!CAMP.cleared.includes(a.node))n+=2;if(nd.kind==='chefe')n+=3;}GACHA.scrolls+=n;saveGacha();return n;}

/* ---- tela ---- */
let gachaShown=null;
function gachaEl(){let t=document.getElementById('gacha');if(t)return t;t=document.createElement('div');t.id='gacha';t.hidden=true;document.body.appendChild(t);return t;}
function openGacha(){gachaShown=null;gachaEl().hidden=false;renderGacha();}
function closeGacha(){gachaEl().hidden=true;if(typeof mapEl==='function'&&!mapEl().hidden&&typeof renderMap==='function')renderMap();if(!anim&&!outcome&&!turnLock)showMenu('main');}
function gachaCard(r,i){const rr=RARITY[r.rar];return`<div class="gc${r.fresh?' new':''}" style="--rc:${rr.col};--d:${i*.12}s"><canvas class="gpt" data-c="${r.id}" width="64" height="64"></canvas><b>${CHARS[r.id].name.split(' ')[0]}</b><em style="color:${rr.col}">${rr.name}</em><small>${r.fresh?'NOVO!':'+'+r.gain+' fragmentos'}</small></div>`;}
function renderGacha(){
 const t=gachaEl(),P=GACHA_PITY,pool=gachaPool();
 const row=pool.map(c=>{const o=gachaOwned(c),rr=RARITY[CHARS[c].rar||1],f=GACHA.frags[c]||0,s=starsOf(c);return`<div class="gr${o?'':' lk'}" style="--rc:${rr.col}"><canvas class="gpt" data-c="${c}" width="64" height="64"></canvas><b>${CHARS[c].name.split(' ')[0]}</b><em style="color:${rr.col}">${rr.name}</em><small>${o?'★'.repeat(s)+'☆'.repeat(5-s)+' · '+f+' frag.':'Não obtido'}</small></div>`;}).join('');
 t.innerHTML=`<div class="gbox"><div class="thead"><h2>Invocação</h2><div class="gscr"><b>${GACHA.scrolls}</b><small>pergaminhos</small></div><button class="x" id="gx">Fechar ✕</button></div>
 <div class="gmain"><section class="gleft"><div class="gres">${gachaShown?gachaShown.map(gachaCard).join(''):'<p class="hint">Use pergaminhos de invocação para chamar novos ninjas para a equipe. Pergaminhos vêm de vitórias na campanha (mais na primeira vez em cada local e em chefes).</p>'}</div>
  <div class="gact"><button class="learn" id="g1"${GACHA.scrolls<1?' disabled':''}>Invocar ×1 <small>1 pergaminho</small></button><button class="learn alt" id="g10"${GACHA.scrolls<10?' disabled':''}>Invocar ×10 <small>10 pergaminhos</small></button></div></section>
 <aside class="gside"><h4>Garantias</h4><div class="pity"><small>Raro ou melhor em</small><b>${Math.max(0,P.rare-GACHA.pityRare)} invocações</b><div class="bar"><i style="width:${GACHA.pityRare/P.rare*100}%"></i></div></div>
 <div class="pity"><small>Lendário garantido em</small><b>${Math.max(0,P.leg-GACHA.pityLeg)} invocações</b><div class="bar leg"><i style="width:${GACHA.pityLeg/P.leg*100}%"></i></div></div>
 <p class="hint">Chances: ${[5,4,3,2,1].map(r=>RARITY[r].name+' '+(r===5?'1%+':GACHA_RATE[r]+'%')).join(' · ')}. A chance do Lendário sobe a partir da invocação ${P.soft}. Repetidos viram fragmentos que dão estrelas (+vida e +ataque).</p>
 <h4>Personagens</h4><div class="glist">${row}</div></aside></div></div>`;
 t.querySelectorAll('.gpt').forEach(cv=>{const id=cv.dataset.c,src=document.getElementById((typeof HERO_PT!=='undefined'&&HERO_PT[id])||'');if(src)cv.getContext('2d').drawImage(src,0,0,src.width,src.height,0,0,64,64);});
 document.getElementById('gx').onclick=closeGacha;
 const go=n=>()=>{const r=gachaPull(n);if(!r)return;gachaShown=r;renderGacha();};
 document.getElementById('g1').onclick=go(1);document.getElementById('g10').onclick=go(10);}
(function(){const b=document.createElement('button');b.id='gachabtn';b.textContent='Invocação';b.onclick=openGacha;const c=document.querySelector('.ctl');if(c)c.insertBefore(b,c.children[1]||null);})();
window.addEventListener('keydown',e=>{const t=document.getElementById('gacha');if(e.key==='Escape'&&t&&!t.hidden){closeGacha();e.stopImmediatePropagation();}},true);
