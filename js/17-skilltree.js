/* ---------- Tela da arvore de habilidades (por personagem) ----------
   Mostra nivel, XP e pontos; os golpes ficam em nos ligados por linhas. Clique no no para ver detalhes e aprender. */
let treeChar='sasuke',treePick=null;
const NODE_W=132,NODE_H=60,GAP_X=26,GAP_Y=34,PAD=18;
function treeEl(){let t=document.getElementById('tree');if(t)return t;t=document.createElement('div');t.id='tree';t.hidden=true;document.body.appendChild(t);return t;}
function openTree(){treeEl().hidden=false;renderTree();}
function closeTree(){treeEl().hidden=true;if(!anim&&!outcome&&!turnLock){showMenu('main');}}
function treeSkillDesc(id){const n=treeNode(treeChar,id);return n?n.d:'';}
function renderTree(){
 const t=treeEl(),P=PROG[treeChar],nodes=TREES[treeChar],maxX=Math.max(...nodes.map(n=>n.x)),maxY=Math.max(...nodes.map(n=>n.y));
 const W=PAD*2+(maxX+1)*NODE_W+maxX*GAP_X,H=PAD*2+(maxY+1)*NODE_H+maxY*GAP_Y;
 const pos=n=>({x:PAD+n.x*(NODE_W+GAP_X),y:PAD+n.y*(NODE_H+GAP_Y)});
 const need=P.level>=MAX_LEVEL?0:xpNeed(P.level),pct=P.level>=MAX_LEVEL?100:Math.round(P.xp/need*100);
 let lines='';for(const n of nodes)for(const r of n.req){const a=pos(treeNode(treeChar,r)),b=pos(n),on=P.learned.includes(r)&&P.learned.includes(n.id);
  lines+=`<path d="M${a.x+NODE_W/2},${a.y+NODE_H} C${a.x+NODE_W/2},${a.y+NODE_H+22} ${b.x+NODE_W/2},${b.y-22} ${b.x+NODE_W/2},${b.y}" class="${on?'on':''}"/>`;}
 const boxes=nodes.map(n=>{const p=pos(n),m=MOVES[n.id],e=ELEMENTS[m.elem],got=P.learned.includes(n.id),can=!got&&!learnBlock(treeChar,n.id),st=got?'got':can?'can':'lock';
  return `<button class="nd ${st}${treePick===n.id?' sel':''}" data-id="${n.id}" style="left:${p.x}px;top:${p.y}px;width:${NODE_W}px;height:${NODE_H}px;--ec:${e.col}"><b>${m.name}</b><span><i class="dot"></i>${e.name} · ${m.tipo}</span><em>${got?'✔ aprendido':'Nv '+m.lvl+(n.pt?' · '+n.pt+' pt':'')}</em></button>`;}).join('');
 let det='<p class="hint">Clique em um golpe para ver os detalhes.</p>';
 if(treePick){const n=treeNode(treeChar,treePick),m=MOVES[treePick],e=ELEMENTS[m.elem],got=P.learned.includes(treePick),why=learnBlock(treeChar,treePick);
  det=`<div class="dtx"><h4>${m.name} <em class="el" style="--ec:${e.col}">${e.name}</em></h4><p>${n.d}</p><small>Tipo: ${m.tipo} · Nível mínimo ${m.lvl} · Custo ${n.pt} ponto(s)</small></div>`
   +(got?'<span class="ok">✔ Aprendido</span>':why?`<span class="why">${why}</span>`:`<button class="learn" id="learnbtn">Aprender (${n.pt} pt)</button>`);}
 t.innerHTML=`<div class="tbox"><div class="thead"><div class="tabs">${Object.keys(TREES).map(c=>`<button class="tab${c===treeChar?' on':''}" data-c="${c}">${CHARS[c].name.split(' ')[0]}</button>`).join('')}</div>
  <div class="lvl"><b>Nível ${P.level}${P.level>=MAX_LEVEL?' (máx.)':''}</b><div class="xp"><i style="width:${pct}%"></i></div><small>${P.level>=MAX_LEVEL?'XP completo':P.xp+' / '+need+' XP'}</small></div>
  <div class="pts"><b>${P.pts}</b><small>pontos</small></div><button class="x" id="treex">Fechar ✕</button></div>
  <div class="tscroll"><div class="tcanvas" style="width:${W}px;height:${H}px"><svg width="${W}" height="${H}">${lines}</svg>${boxes}</div></div>
  <div class="tdet">${det}</div>
  <div class="tdev"><button id="tlv">+1 nível (teste)</button><button id="trs">Zerar progresso</button></div></div>`;
 t.querySelectorAll('.nd').forEach(b=>b.onclick=()=>{treePick=b.dataset.id;renderTree();});
 t.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{treeChar=b.dataset.c;treePick=null;renderTree();});
 const lb=document.getElementById('learnbtn');if(lb)lb.onclick=()=>{if(learnSkill(treeChar,treePick))toast('Aprendeu '+MOVES[treePick].name+'!');renderTree();};
 document.getElementById('treex').onclick=closeTree;
 document.getElementById('tlv').onclick=()=>{const P2=PROG[treeChar];if(P2.level<MAX_LEVEL){P2.level++;P2.pts++;P2.xp=0;saveProg();}renderTree();};
 document.getElementById('trs').onclick=()=>{if(confirm('Zerar o progresso de todos os personagens?')){resetProg();treePick=null;renderTree();}};}
window.addEventListener('keydown',e=>{const t=document.getElementById('tree');if(e.key==='Escape'&&t&&!t.hidden){closeTree();e.stopImmediatePropagation();}},true);
(function(){const b=document.createElement('button');b.id='treebtn';b.textContent='Árvore de habilidades';b.onclick=openTree;const c=document.querySelector('.ctl');if(c)c.insertBefore(b,c.firstChild);})();
/* XP no fim da luta: quem o jogador controla ganha XP por vitoria (mais) ou derrota (menos) */
function giveBattleXp(winner){const me=roleN?'naruto':'sasuke',won=(winner==='N')===roleN,xp=won?80:25,up=awardXp(me,xp);
 setTimeout(()=>toast(CHARS[me].name.split(' ')[0]+' ganhou '+xp+' XP'+(up?' · subiu para o nível '+PROG[me].level+'! (+'+up+' pt)':'')),2600);}
