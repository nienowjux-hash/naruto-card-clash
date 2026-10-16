/* ---------- Mapa da campanha ----------
   Mapa pintado por codigo (oceano, terras, regioes, caminhos). Escolha um local, a equipe e parta para a batalha.
   O cenario da luta vem do local (setScene) e o inimigo recebe a escala e os elementos do local. */
let mapSel=null,mapHero='sasuke',mapRAF=null,mapBG=null,mapTok=null,mapMoving=false,mapHover=null;
const NODE_GLYPH={konoha:'葉',treino:'修',floresta:'森',deserto:'砂',neve:'雪',vale:'終'};
const ORIG_NAMES={s:'SASUKE UCHIHA',n:'NARUTO UZUMAKI'};
function mapEl(){let t=document.getElementById('map');if(t)return t;t=document.createElement('div');t.id='map';t.hidden=true;document.body.appendChild(t);return t;}

/* ---- caminhos entre locais (caminho mais curto passando por locais ja abertos) ---- */
function mapPath(from,to){const q=[[from]],seen={[from]:1};while(q.length){const p=q.shift(),n=p[p.length-1];if(n===to)return p;for(const m of nodeNeighbors(n)){if(seen[m]||nodeState(m)==='locked')continue;seen[m]=1;q.push(p.concat(m));}}return null;}
function edgePts(a,b){const A=NODES[a],B=NODES[b],mx=(A.x+B.x)/2,my=(A.y+B.y)/2,nx=-(B.y-A.y),ny=B.x-A.x,L=Math.hypot(nx,ny)||1,k=(a<b?1:-1)*.12;return{a:[A.x,A.y],b:[B.x,B.y],c:[mx+nx/L*L*k,my+ny/L*L*k]};}
const bez=(e,t)=>[(1-t)*(1-t)*e.a[0]+2*(1-t)*t*e.c[0]+t*t*e.b[0],(1-t)*(1-t)*e.a[1]+2*(1-t)*t*e.c[1]+t*t*e.b[1]];

/* ---- painel lateral ---- */
function enemyCharOf(hero){return hero==='sasuke'?'naruto':'sasuke';}
function mapPanel(){
 if(!mapSel)return'<p class="hint">Clique em um local do mapa para ver os detalhes.</p>';
 const n=NODES[mapSel],st=nodeState(mapSel),stTxt={cleared:'Concluído',open:'Disponível',locked:'Bloqueado'}[st];
 const party=['sasuke','naruto'].map(h=>`<button class="hero${mapHero===h?' on':''}" data-h="${h}"><b>${CHARS[h].name.split(' ')[0]}</b><small>Nível ${PROG[h].level}</small></button>`).join('')+'<div class="hero empty"><b>Vazio</b><small>em breve</small></div><div class="hero empty"><b>Vazio</b><small>em breve</small></div>';
 let body='';
 if(n.kind==='vila'){body=`<p class="desc">${n.d}</p><div class="act"><button class="learn" id="mp-tree">Árvore de habilidades</button><button class="learn alt" id="mp-inv">Equipamentos</button></div>`;}
 else{const af=n.enc.afin||CHARS[enemyCharOf(mapHero)].afin,vant=['fogo','agua','terra','vento','raio'].filter(b=>elemMatch(b,af)>0).map(b=>ELEMENTS[b].name);
  body=`<p class="desc">${n.d}</p><div class="enc"><small>Inimigo</small><h4>${n.enc.name} <span class="lvl">Nv ${n.lvl}</span></h4>
  <div class="chips">${af.map(e=>`<em class="el" style="--ec:${ELEMENTS[e].col}">${ELEMENTS[e].name}</em>`).join('')}</div>
  <div class="stats"><div><small>Nível</small><b>${n.lvl}</b></div><div><small>XP</small><b>${n.xp}</b></div><div><small>Ryo</small><b>${n.ryo}</b></div></div>
  <p class="tip">${vant.length?'Dica: golpes de <b>'+vant.join(', ')+'</b> causam +40% de dano.':'Sem fraqueza elemental conhecida.'}</p></div>
  <small class="lab">Equipe (escolha quem vai lutar)</small><div class="party">${party}</div>
  <div class="act">${st==='locked'?'<span class="why">Vença um local vizinho para liberar.</span>':`<button class="learn" id="mp-go">${st==='cleared'?'Lutar de novo':'Partir para a batalha'} com ${CHARS[mapHero].name.split(' ')[0]}</button>`}</div>`;}
 return`<h3>${n.name}</h3><span class="tag ${st}">${stTxt}</span>${body}`;}
function renderMap(){
 const t=mapEl();
 t.innerHTML=`<div class="mbox"><div class="thead"><h2>Mapa da campanha</h2><div class="ryo"><b>${INV.ryo}</b><small>ryo</small></div><div class="ptl">${['sasuke','naruto'].map(h=>`<span><b>${CHARS[h].name.split(' ')[0]}</b> Nv ${PROG[h].level}${PROG[h].pts?` · <i>${PROG[h].pts} pt</i>`:''}</span>`).join('')}</div><button class="x" id="mapx">Voltar à luta ✕</button></div>
 <div class="mmain"><div class="mwrap"><canvas id="mapcv" width="${MAP_W}" height="${MAP_H}"></canvas></div><aside class="mside">${mapPanel()}</aside></div>
 <div class="tdev"><span class="lg"><i class="a"></i>Concluído <i class="b"></i>Disponível <i class="c"></i>Bloqueado</span><button id="mprs">Reiniciar campanha</button></div></div>`;
 const cv=document.getElementById('mapcv'),pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*MAP_W/r.width,(e.clientY-r.top)*MAP_H/r.height];};
 const hit=e=>{const[x,y]=pos(e);for(const id in NODES)if(Math.hypot(x-NODES[id].x,y-NODES[id].y)<34)return id;return null;};
 cv.onmousemove=e=>{const h=hit(e);if(h!==mapHover){mapHover=h;cv.style.cursor=h?'pointer':'default';}};
 cv.onclick=e=>{const h=hit(e);if(h){mapSel=h;renderMap();}};
 t.querySelectorAll('.hero[data-h]').forEach(b=>b.onclick=()=>{mapHero=b.dataset.h;renderMap();});
 const go=document.getElementById('mp-go');if(go)go.onclick=()=>travelAndFight(mapSel);
 const tr=document.getElementById('mp-tree');if(tr)tr.onclick=()=>{closeMap(true);openTree();};
 const iv=document.getElementById('mp-inv');if(iv)iv.onclick=()=>{closeMap(true);openInv();};
 document.getElementById('mapx').onclick=()=>closeMap();
 document.getElementById('mprs').onclick=()=>{if(confirm('Reiniciar a campanha? (o nível, os itens e as habilidades continuam)')){resetCamp();mapSel=null;mapTok=null;renderMap();}};
 if(!mapRAF)mapRAF=requestAnimationFrame(mapDraw);}
function openMap(){if(!mapSel)mapSel=CAMP.at;mapEl().hidden=false;renderMap();}
function closeMap(keepMenu){mapEl().hidden=true;if(mapRAF){cancelAnimationFrame(mapRAF);mapRAF=null;}if(!keepMenu&&!anim&&!outcome&&!turnLock)showMenu('main');}

/* ---- viagem e inicio da batalha ---- */
function travelAndFight(id){
 if(mapMoving)return;const path=mapPath(CAMP.at,id);if(!path){toast('Sem caminho aberto até lá');return;}
 mapMoving=true;const pts=[];for(let i=0;i<path.length-1;i++){const e=edgePts(path[i],path[i+1]);for(let k=0;k<=24;k++)pts.push(bez(e,k/24));}
 let i=0;const step=()=>{if(i>=pts.length){mapTok=null;CAMP.at=id;saveCamp();mapMoving=false;startEncounter(id,mapHero);return;}mapTok={x:pts[i][0],y:pts[i][1]};i+=pts.length>30?1:1;setTimeout(step,16);};step();}
function startEncounter(id,hero){
 const n=NODES[id];if(!n||!n.enc)return;
 CAMP.active={node:id,hero,afin:n.enc.afin,hp:1,atk:1,name:n.enc.name};saveCamp();
 if((hero==='naruto')!==roleN){try{localStorage.setItem('playNaruto',hero==='naruto'?'1':'0');}catch(e){}location.reload();return;}
 applyEncounter();}
function setEnemyName(nm){const side=roleN?'s':'n',b=document.querySelector(side==='n'?'.pl.r b':'.pl b');if(b&&b.firstChild&&b.firstChild.nodeType===3)b.firstChild.nodeValue=(nm||ORIG_NAMES[side]).toUpperCase();}
function applyEncounter(){
 const a=CAMP.active;if(!a)return;setScene(NODES[a.node].scene);setEnemyName(a.name);
 mapEl().hidden=true;if(mapRAF){cancelAnimationFrame(mapRAF);mapRAF=null;}
 $('rst').onclick();toast(NODES[a.node].name+' — '+a.name);}
/* fim de luta: marca o local, e volta ao mapa */
function campaignResult(won){const a=CAMP.active;if(!a)return;
 if(won&&!CAMP.cleared.includes(a.node)){CAMP.cleared.push(a.node);}CAMP.at=a.node;saveCamp();
 setTimeout(()=>{CAMP.active=null;saveCamp();setEnemyName(null);setScene('vale');mapSel=a.node;openMap();},6200);}
window.addEventListener('keydown',e=>{const t=document.getElementById('map');if(e.key==='Escape'&&t&&!t.hidden){closeMap();e.stopImmediatePropagation();}},true);
(function(){const b=document.createElement('button');b.id='mapbtn';b.textContent='Mapa';b.onclick=openMap;const c=document.querySelector('.ctl');if(c)c.insertBefore(b,c.firstChild);})();
/* ao carregar: continua a luta em andamento ou abre o mapa */
if(CAMP.active&&((CAMP.active.hero==='naruto')===roleN))setTimeout(applyEncounter,50);else{CAMP.active=null;setTimeout(openMap,200);}
