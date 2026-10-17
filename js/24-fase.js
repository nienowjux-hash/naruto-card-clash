/* ---------- Fases em duelos 1x1 ----------
   Cada local de luta e uma fase com varios inimigos (nodeFoes). O jogador monta a equipe (ate 4), liga um membro a cada inimigo e luta na ordem que quiser.
   Quem perde sai da fase (volta no fim dela); quem ganha continua, levando a vida e o chakra que sobraram. A fase acaba quando todos os inimigos caem
   (vitoria) ou quando toda a equipe cai (derrota). O XP sai no fim e e o mesmo para todos que lutaram (15% na derrota). Estado em CAMP.phase:
   {node, team:[ids], u:{id:{hp,ck,alive,fought}}, foes:[{done}], assign:[ids]}   (hp null = vida cheia). */
let mapTeam=null,mapAssign=[];
const PHASE_MAX_TEAM=4;
function teamNow(){if(!mapTeam||!mapTeam.length)mapTeam=ownedChars(['sasuke','sakura','kakashi','naruto','gozu','meizu']).slice(0,PHASE_MAX_TEAM);mapTeam=mapTeam.filter(gachaOwned);if(!mapTeam.length)mapTeam=['sasuke'];return mapTeam;}
const phaseAt=id=>(CAMP.phase&&CAMP.phase.node===id)?CAMP.phase:null;
const foeXp=(n,f)=>f.xp||Math.round((n.xp||8)/2);
function autoAssign(team,nf,old){const a=[];for(let i=0;i<nf;i++)a.push(old&&team.includes(old[i])?old[i]:team[i%team.length]);return a;}
function foeElems(f,n){return f.afin||n.enc.afin||[];}

function beginPhase(id){const n=NODES[id],team=teamNow().slice(),foes=nodeFoes(id);
 const u={};team.forEach(c=>u[c]={hp:null,ck:100,alive:true,fought:false});
 CAMP.phase={node:id,team,u,foes:foes.map(()=>({done:false})),assign:autoAssign(team,foes.length,mapAssign)};CAMP.at=id;saveCamp();mapSel=id;renderMap();}
function abandonPhase(){CAMP.phase=null;saveCamp();renderMap();}

function phasePanel(id,st,n){
 const p=phaseAt(id),foes=nodeFoes(id),team=p?p.team:teamNow();
 const alive=c=>!p||(p.u[c]&&p.u[c].alive);
 if(!p)mapAssign=autoAssign(team,foes.length,mapAssign);
 const asg=p?p.assign:mapAssign;
 const total=foes.reduce((s,f)=>s+foeXp(n,f),0);
 const rows=foes.map((f,i)=>{const done=p&&p.foes[i].done,af=foeElems(f,n),lvl=n.lvl+(f.dl||0);
  const opts=team.filter(alive).map(c=>`<option value="${c}"${asg[i]===c?' selected':''}>${CHARS[c].name.split(' ')[0]}</option>`).join('');
  return`<div class="foe${done?' done':''}"><div class="fi"><b>${f.name}</b><small>Nv ${lvl} · ${af.map(e=>ELEMENTS[e].name).join('/')||'—'}</small></div>
  ${done?'<span class="ok">✓ Derrotado</span>':`<select data-f="${i}">${opts}</select>${p?`<button class="learn" data-fight="${i}">Lutar</button>`:''}`}</div>`;}).join('');
 const teamHtml=p?`<div class="tm">${team.map(c=>{const u=p.u[c],mx=100+(statsOf(c).hp||0),pc=u.hp==null?100:Math.round(Math.max(0,u.hp)/mx*100);return`<div class="tu${u.alive?'':' dead'}"><b>${CHARS[c].name.split(' ')[0]}</b><small>${u.alive?pc+'% de vida':'Fora da fase'}</small><div class="bar"><i style="width:${u.alive?pc:0}%"></i></div></div>`;}).join('')}</div>`
  :`<small class="lab">Equipe (até ${PHASE_MAX_TEAM}) — clique para montar</small><div class="party">${ownedChars(['sasuke','sakura','kakashi','naruto','gozu','meizu']).map(h=>`<button class="hero${team.includes(h)?' on':''}" data-team="${h}"><b>${CHARS[h].name.split(' ')[0]}</b><small>Nível ${PROG[h].level}</small>${charRar(h)}</button>`).join('')}</div>`;
 const act=st==='locked'?'<span class="why">Vença um local vizinho para liberar.</span>':p?'<button class="learn alt" id="ph-quit">Desistir da fase</button>':`<button class="learn" id="mp-go">${st==='cleared'?'Jogar a fase de novo':'Iniciar a fase'} com ${team.length} ${team.length>1?'personagens':'personagem'}</button>`;
 return`<div class="enc"><small>Inimigos da fase (${foes.length}) · recompensa ao concluir</small><div class="stats"><div><small>XP total</small><b>${total}</b></div><div><small>Ryo</small><b>${n.ryo}</b></div><div><small>Pergaminhos</small><b>${n.kind==='chefe'?'4+':'1+'}</b></div></div>
 <div class="foes">${rows}</div><p class="tip">Escolha quem enfrenta cada inimigo. Quem perde sai da fase; quem vence segue com a vida que sobrou. O XP vai igual para todos que lutaram.</p></div>${teamHtml}<div class="act">${act}</div>`;}

function bindPhase(t){
 const p=CAMP.phase&&CAMP.phase.node===mapSel?CAMP.phase:null;
 t.querySelectorAll('[data-team]').forEach(b=>b.onclick=()=>{const c=b.dataset.team,tm=teamNow();const i=tm.indexOf(c);if(i>=0){if(tm.length>1)tm.splice(i,1);}else if(tm.length<PHASE_MAX_TEAM)tm.push(c);else{toast('Equipe cheia (máx. '+PHASE_MAX_TEAM+')');return;}mapTeam=tm;renderMap();});
 t.querySelectorAll('select[data-f]').forEach(s=>s.onchange=()=>{(p?p.assign:mapAssign)[+s.dataset.f]=s.value;if(p)saveCamp();});
 t.querySelectorAll('[data-fight]').forEach(b=>b.onclick=()=>{const i=+b.dataset.fight,h=p.assign[i];if(!h||!p.u[h]||!p.u[h].alive){toast('Escolha um personagem em pé');return;}startEncounter(p.node,h,i);});
 const q=document.getElementById('ph-quit');if(q)q.onclick=()=>{if(confirm('Desistir da fase? Nenhum XP é ganho.'))abandonPhase();};}

/* vida e chakra que o personagem levou do duelo anterior */
function phaseCarry(){const a=CAMP.active,p=CAMP.phase;if(!a||!p||a.foe==null)return;const u=p.u[a.hero],m=roleN?'n':'s';if(u&&u.hp!=null){hp[m]=Math.max(1,Math.min(HPMAX[m],u.hp));ck[m]=Math.max(0,Math.min(100,u.ck));setBars();}}

/* fim de um duelo da fase: guarda vida/chakra, tira quem perdeu e encerra a fase se acabou */
function phaseDuelEnd(me,won){
 const p=CAMP.phase,a=CAMP.active,m=roleN?'n':'s',u=p.u[me];if(!u)return;
 u.fought=true;u.ck=ck[m];
 if(won){u.hp=Math.max(1,hp[m]);p.foes[a.foe].done=true;}else{u.hp=0;u.alive=false;}
 const left=p.foes.filter(f=>!f.done).length,alive=Object.keys(p.u).filter(c=>p.u[c].alive).length,done=!left,fail=!done&&!alive;
 if(done||fail)phaseReward(done);
 else setTimeout(()=>toast(won?CHARS[me].name.split(' ')[0]+' venceu! Faltam '+left+' inimigo'+(left>1?'s':''):CHARS[me].name.split(' ')[0]+' caiu e sai da fase'),2600);
 saveCamp();campaignResult(done);}
function phaseReward(win){
 const p=CAMP.phase,n=NODES[p.node],tot=nodeFoes(p.node).reduce((s,f)=>s+foeXp(n,f),0),msgs=[];
 Object.keys(p.u).filter(c=>p.u[c].fought).forEach(c=>{const fx=Math.min(1.3,Math.max(.1,1+(n.lvl-PROG[c].level)*.08)),xp=Math.max(1,Math.round(tot*fx*(win?1:.15))),up=awardXp(c,xp);msgs.push(CHARS[c].name.split(' ')[0]+' +'+xp+(up?' (Nv '+PROG[c].level+')':''));});
 if(win&&typeof giveBattleLoot==='function')giveBattleLoot(true);
 setTimeout(()=>toast((win?'Fase concluída! ':'Fase perdida. ')+'XP: '+msgs.join(' · ')),2600);
 CAMP.phase=null;}
