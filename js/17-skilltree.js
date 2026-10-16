/* ---------- Tela da arvore de habilidades (por personagem) ----------
   Mostra nivel, XP e pontos; os golpes ficam em nos ligados por linhas. Clique no no para ver detalhes e aprender. */
let treeChar='sasuke',treePick=null;
const NODE=76,CELL_W=122,CELL_H=138,PAD_X=24,PAD_T=64,PAD_B=24;
function treeEl(){let t=document.getElementById('tree');if(t)return t;t=document.createElement('div');t.id='tree';t.hidden=true;document.body.appendChild(t);return t;}
function closeTree(){stopPreview();treeEl().hidden=true;if(!anim&&!outcome&&!turnLock){showMenu('main');}}
function treeSkillDesc(id){const n=treeNode(treeChar,id);return n?n.d:'';}
/* simbolo (kanji) de cada golpe no medalhao do no */
const SKILL_GLYPH={chute:'蹴',kunai:'刃',kawarimi:'替',soco:'拳',shishi:'獅',shuriken:'手',soushuken:'操',kagesh:'影',katon:'火',amaterasu:'天',chidori:'千',genjutsu:'幻',copy:'写',selo:'呪',selo2:'魔',selochidori:'雷',bunshin:'分',uzumaki:'渦',kuchiyose:'蛙',rasengan:'螺',kamikaze:'嵐',kyuubi:'狐',oiroke:'色',harem:'艶',cura:'癒',cura2:'医',shannaro:'怪',raikiri:'雷'};
const TREE_BRANCH={sasuke:['Taijutsu','Armas','Fogo','Raio','Sharingan','Selo','Básico'],naruto:['Clones','Vento','Ilusão','Básico','Armas'],sakura:['Taijutsu','Armas','Suporte','Medicina','Chakra'],kakashi:['Taijutsu','Armas','Suporte','Fogo','Raio','Sharingan']};
/* ---- previa animada: grava quadros da propria animacao do golpe (o motor desenha o golpe congelado em cada instante) e toca em loop ---- */
const PREV={};let prevTimer=null,prevToken=0;
async function buildPreview(id){
 if(PREV[id])return PREV[id];
 if(anim||frozen||turnLock||outcome||!ANIMS[id])return null;
 const cv=document.getElementById('c'),A=ANIMS[id],N=24,out=[];
 try{for(let i=0;i<N;i++){frozen={type:id,t:Math.max(.02,A.dur*.97*i/(N-1))};
   render(performance.now());if(i%4===3)await new Promise(r=>setTimeout(r,0)); /* desenha o quadro na hora (sem esperar o rAF) */
   const f=document.createElement('canvas');f.width=560;f.height=Math.round(560*cv.height/cv.width);f.getContext('2d').drawImage(cv,0,0,f.width,f.height);out.push(f);}}
 finally{frozen=null;}
 PREV[id]={frames:out,dur:A.dur};return PREV[id];}
function stopPreview(){if(prevTimer){clearInterval(prevTimer);prevTimer=null;}prevToken++;}
function playPreview(id){
 stopPreview();const tok=prevToken,box=document.getElementById('pvbox');if(!box)return;
 const show=async()=>{
  const p=PREV[id]||await buildPreview(id);if(tok!==prevToken)return;
  if(!p){box.innerHTML=ANIMS[id]?'<div class="pvmsg">Prévia indisponível durante uma luta.<br>Feche a árvore e termine o turno.</div>':'<div class="pvmsg">Golpe de defesa: sem prévia animada.<br>Na luta, o inimigo não vê quando você o usa.</div>';return;}
  const cv=document.createElement('canvas');cv.width=p.frames[0].width;cv.height=p.frames[0].height;box.innerHTML='';box.appendChild(cv);
  const g=cv.getContext('2d');let i=0,hold=0;const step=Math.max(60,p.dur*1000/p.frames.length);
  prevTimer=setInterval(()=>{if(hold>0){hold--;return;}g.drawImage(p.frames[i],0,0);i++;if(i>=p.frames.length){i=0;hold=Math.round(900/step);}},step);};
 if(!PREV[id])box.innerHTML='<div class="pvmsg">Gerando prévia…</div>';show();}
/* ---- texto explicativo gerado a partir dos numeros reais do jogo ---- */
function skillStats(id){const A=ANIMS[id]||{},m=MOVES[id];
 const dmg=A.hits?A.hits.reduce((a,h)=>a+h.dmg,0):A.dmg||0;
 let forte=[],fraco=[];for(const b of ['fogo','agua','terra','vento','raio']){const k=elemMatch(m.elem,b);if(k>0)forte.push(ELEMENTS[b].name);else if(k<0)fraco.push(ELEMENTS[b].name);}
 return{dmg,cost:id==='kawarimi'?KAWARIMI_COST:(A.cost||0),forte,fraco};}
const TIPO_TXT={ninjutsu:'Ninjutsu: técnica de chakra',genjutsu:'Genjutsu: ilusão que age na mente do alvo',taijutsu:'Taijutsu: combate corpo a corpo, sem elemento',arma:'Arma ninja: kunai, shuriken e variações',invocacao:'Invocação: chama um aliado para a luta',suporte:'Suporte: fortalece quem usa'};
function openTree(){treeEl().hidden=false;const P=PROG[treeChar];if(!treePick||!treeNode(treeChar,treePick))treePick=(TREES[treeChar].find(n=>!P.learned.includes(n.id)&&!learnBlock(treeChar,n.id))||TREES[treeChar].find(n=>!P.learned.includes(n.id))||TREES[treeChar][0]).id;renderTree();}
function renderTree(){
 const t=treeEl(),P=PROG[treeChar],nodes=TREES[treeChar],maxX=Math.max(...nodes.map(n=>n.x)),maxY=Math.max(...nodes.map(n=>n.y));
 const W=PAD_X*2+(maxX+1)*CELL_W,H=PAD_T+(maxY+1)*CELL_H+PAD_B;
 const ctr=n=>({x:PAD_X+n.x*CELL_W+CELL_W/2,y:PAD_T+n.y*CELL_H+NODE/2+4});
 const need=P.level>=MAX_LEVEL?0:xpNeed(P.level),pct=P.level>=MAX_LEVEL?100:Math.round(P.xp/need*100);
 let lines='';for(const n of nodes)for(const r of n.req){const a=ctr(treeNode(treeChar,r)),b=ctr(n),on=P.learned.includes(r)&&P.learned.includes(n.id),open=P.learned.includes(r)&&!P.learned.includes(n.id);
  const my=(a.y+b.y)/2;lines+=`<path d="M${a.x},${a.y} C${a.x},${my} ${b.x},${my} ${b.x},${b.y}" class="${on?'on':open?'open':''}"/>`;}
 const heads=(TREE_BRANCH[treeChar]||[]).map((nm,i)=>`<div class="bh" style="left:${PAD_X+i*CELL_W}px;width:${CELL_W}px">${nm}</div>`).join('');
 const boxes=nodes.map(n=>{const c=ctr(n),m=MOVES[n.id],e=ELEMENTS[m.elem],got=P.learned.includes(n.id),can=!got&&!learnBlock(treeChar,n.id),st=got?'got':can?'can':'lock',rr=RARITY[m.rar||1];
  return `<button class="nd ${st}${treePick===n.id?' sel':''}" data-id="${n.id}" style="left:${c.x-CELL_W/2}px;top:${c.y-NODE/2}px;width:${CELL_W}px;--ec:${e.col};--rc:${rr.col}"><span class="orb"><span class="gl">${SKILL_GLYPH[n.id]||'?'}</span>${got?'':`<i class="lv">${m.lvl}</i>`}</span><b>${m.name.replace(/ \(Nível (\d)\)/,' $1').replace(/ \(.*\)/,'').replace(/^Katon: /,'')}</b><small class="rr">${rr.name}${n.pt?' · '+n.pt+' pt':''}</small></button>`;}).join('');
 let side='<p class="hint">Escolha um golpe na árvore.</p>';
 if(treePick){const n=treeNode(treeChar,treePick),m=MOVES[treePick],e=ELEMENTS[m.elem],got=P.learned.includes(treePick),why=learnBlock(treeChar,treePick),S=skillStats(treePick);
  const reqs=n.req.length?n.req.map(r=>`<li class="${P.learned.includes(r)?'y':'n'}">${MOVES[r].name}</li>`).join(''):'<li class="y">Nenhum</li>';
  side=`<div class="pv"><div id="pvbox"></div><span class="pvtag">PRÉVIA</span></div>
   <h3>${m.name}</h3><div class="chips"><em class="el" style="--ec:${RARITY[m.rar||1].col}">${RARITY[m.rar||1].name}</em><em class="el" style="--ec:${e.col}">${e.name}</em><em class="el" style="--ec:#aab0c8">${m.tipo}</em></div>
   <p class="desc">${n.d}</p><p class="tipo">${TIPO_TXT[m.tipo]||''}</p>
   <div class="stats"><div><small>Dano base</small><b>${S.dmg||'—'}</b></div><div><small>Custo</small><b>${S.cost?S.cost+' CK':'Grátis'}</b></div><div><small>Nível mín.</small><b>${m.lvl}</b></div><div><small>Pontos</small><b>${n.pt}</b></div></div>
   <div class="elx">${S.forte.length?`<span class="g">▲ Forte contra: ${S.forte.join(', ')}</span>`:''}${S.fraco.length?`<span class="r">▼ Fraco contra: ${S.fraco.join(', ')}</span>`:''}${!S.forte.length&&!S.fraco.length?'<span>Sem vantagem ou desvantagem elemental</span>':''}</div>
   <div class="req"><small>Requisitos</small><ul>${reqs}</ul></div>
   <div class="act">${got?'<span class="ok">✔ Já aprendido</span>':why?`<span class="why">${why}</span>`:`<button class="learn" id="learnbtn">Aprender · ${n.pt} ponto(s)</button>`}</div>`;}
 t.innerHTML=`<div class="tbox"><div class="thead"><div class="tabs">${Object.keys(TREES).map(c=>`<button class="tab${c===treeChar?' on':''}" data-c="${c}">${CHARS[c].name.split(' ')[0]} ${charRar(c)}</button>`).join('')}</div>
  <div class="lvl"><b>Nível ${P.level}${P.level>=MAX_LEVEL?' (máx.)':''}</b><div class="xp"><i style="width:${pct}%"></i></div><small>${P.level>=MAX_LEVEL?'XP completo':P.xp+' / '+need+' XP'}</small></div>
  <div class="pts"><b>${P.pts}</b><small>pontos de habilidade</small></div><button class="x" id="treex">Fechar (Esc) ✕</button></div>
  <div class="tmain"><div class="tscroll"><div class="tcanvas" style="width:${W}px;height:${H}px"><svg width="${W}" height="${H}">${lines}</svg>${heads}${boxes}</div></div><aside class="tside">${side}</aside></div>
  <div class="tdev"><span class="lg"><i class="a"></i>Aprendido <i class="b"></i>Disponível <i class="c"></i>Bloqueado</span><button id="tlv">+1 nível (teste)</button><button id="trs">Zerar progresso</button></div></div>`;
 t.querySelectorAll('.nd').forEach(b=>b.onclick=()=>{if(treePick===b.dataset.id)return;treePick=b.dataset.id;renderTree();});
 t.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{treeChar=b.dataset.c;treePick=null;openTree();});
 const lb=document.getElementById('learnbtn');if(lb)lb.onclick=()=>{if(learnSkill(treeChar,treePick))toast('Aprendeu '+MOVES[treePick].name+'!');renderTree();};
 document.getElementById('treex').onclick=closeTree;
 document.getElementById('tlv').onclick=()=>{const P2=PROG[treeChar];if(P2.level<MAX_LEVEL){P2.level++;P2.pts++;P2.xp=0;saveProg();}renderTree();};
 document.getElementById('trs').onclick=()=>{if(confirm('Zerar o progresso de todos os personagens?')){resetProg();treePick=null;openTree();}};
 if(treePick)playPreview(treePick);}
window.addEventListener('keydown',e=>{const t=document.getElementById('tree');if(e.key==='Escape'&&t&&!t.hidden){closeTree();e.stopImmediatePropagation();}},true);
(function(){const b=document.createElement('button');b.id='treebtn';b.textContent='Árvore de habilidades';b.onclick=openTree;const c=document.querySelector('.ctl');if(c)c.insertBefore(b,c.firstChild);})();
/* XP no fim da luta: quem o jogador controla ganha XP por vitoria (mais) ou derrota (menos) */
function giveBattleXp(winner){const me=roleN?'naruto':sideChar('s'),won=(winner==='N')===roleN,nd=CAMP.active?NODES[CAMP.active.node]:null,fx=nd?Math.min(1.3,Math.max(.1,1+(nd.lvl-PROG[me].level)*.08)):1,xp=Math.max(1,Math.round(((nd&&nd.xp)||8)*fx*(won?1:.15))),up=awardXp(me,xp);
 if(typeof giveBattleLoot==='function')giveBattleLoot(won);if(typeof campaignResult==='function')campaignResult(won);
 setTimeout(()=>toast(CHARS[me].name.split(' ')[0]+' ganhou '+xp+' XP'+(up?' · subiu para o nível '+PROG[me].level+'! (+'+up+' pt)':'')),2600);}
