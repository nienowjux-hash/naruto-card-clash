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
/* vantagem elemental de um membro da equipe contra um inimigo: 1 vantagem, -1 desvantagem, 0 neutro */
function heroAdv(c,foeAf){if(!foeAf||!foeAf.length)return 0;const ms=(CHARS[c].afin||[]).map(e=>elemMatch(e,foeAf));if(ms.some(m=>m>0))return 1;if(ms.length&&ms.every(m=>m<0))return -1;return 0;}
const firstName=c=>CHARS[c].name.split(' ')[0];
/* sugere quem enfrenta quem: quem tem vantagem primeiro, sem sobrecarregar um so personagem */
function suggestAssign(team,foes,n,alive){const live=team.filter(alive),load={},out=[];live.forEach(c=>load[c]=0);
 foes.forEach((f,i)=>{if(!live.length){out.push(null);return;}const af=foeElems(f,n);const best=live.slice().sort((a,b)=>(heroAdv(b,af)-heroAdv(a,af))||(load[a]-load[b]))[0];load[best]++;out.push(best);});return out;}

function beginPhase(id){const n=NODES[id],team=teamNow().slice(),foes=nodeFoes(id);
 const u={};team.forEach(c=>u[c]={hp:null,ck:100,alive:true,fought:false});
 CAMP.phase={node:id,team,u,foes:foes.map(()=>({done:false})),assign:autoAssign(team,foes.length,mapAssign),loot:{ryo:0,items:{}}};CAMP.at=id;saveCamp();mapSel=id;renderMap();}
function abandonPhase(){CAMP.phase=null;saveCamp();renderMap();}

function phasePanel(id,st,n){
 const p=phaseAt(id),foes=nodeFoes(id),team=p?p.team:teamNow();
 const alive=c=>!p||(p.u[c]&&p.u[c].alive);
 if(!p)mapAssign=autoAssign(team,foes.length,mapAssign);
 const asg=p?p.assign:mapAssign;
 const total=foes.reduce((s,f)=>s+foeXp(n,f),0);
 const advLine=(tm,af)=>{const ok=tm.filter(c=>heroAdv(c,af)>0).map(firstName),bad=tm.filter(c=>heroAdv(c,af)<0).map(firstName);return(ok.length?`<span class="adv up">▲ Vantagem: <b>${ok.join(', ')}</b></span>`:'')+(bad.length?`<span class="adv dn">▼ Desvantagem: ${bad.join(', ')}</span>`:'')+(!ok.length&&!bad.length?'<span class="adv">Sem vantagem de ninguém da equipe</span>':'');};
 const rows=foes.map((f,i)=>{const done=p&&p.foes[i].done,af=foeElems(f,n),lvl=n.lvl+(f.dl||0);
  const opts=team.filter(alive).map(c=>`<option value="${c}"${asg[i]===c?' selected':''}>${CHARS[c].name.split(' ')[0]}</option>`).join('');
  return`<div class="foe${done?' done':''}"><div class="fi"><b>${f.name}</b><small>Nv ${lvl} · ${af.map(e=>`<em class="el" style="--ec:${ELEMENTS[e].col}">${ELEMENTS[e].name}</em>`).join('')||'—'}</small>${done?'':advLine(team.filter(alive),af)}</div>
  ${done?'<span class="ok">✓ Derrotado</span>':`<select data-f="${i}">${opts}</select>${p?`<button class="learn" data-fight="${i}">Lutar</button>`:''}`}</div>`;}).join('');
 const teamHtml=p?`<div class="tm">${team.map(c=>{const u=p.u[c],mx=100+(statsOf(c).hp||0),pc=u.hp==null?100:Math.round(Math.max(0,u.hp)/mx*100);return`<div class="tu${u.alive?'':' dead'}"><b>${CHARS[c].name.split(' ')[0]}</b><small>${u.alive?pc+'% de vida':'Fora da fase'}</small><div class="bar"><i style="width:${u.alive?pc:0}%"></i></div></div>`;}).join('')}</div>`
  :`<small class="lab">Equipe (até ${PHASE_MAX_TEAM}) — clique para montar</small><div class="party">${ownedChars(['sasuke','sakura','kakashi','naruto','gozu','meizu']).map(h=>`<button class="hero${team.includes(h)?' on':''}" data-team="${h}"><b>${CHARS[h].name.split(' ')[0]}</b><small>Nível ${PROG[h].level}</small>${charRar(h)}</button>`).join('')}</div>`;
 const act=st==='locked'?'<span class="why">Vença um local vizinho para liberar.</span>':p?'<button class="learn alt" id="ph-quit">Desistir da fase</button>':`<button class="learn" id="mp-go">${st==='cleared'?'Jogar a fase de novo':'Iniciar a fase'} com ${team.length} ${team.length>1?'personagens':'personagem'}</button>`;
 const lootHtml=p&&p.loot&&(p.loot.ryo||Object.keys(p.loot.items).length)?`<p class="tip">Butim acumulado (pago ao concluir): <b>${p.loot.ryo} ryo</b> ${Object.keys(p.loot.items).map(i=>`<span class="lt">${icoImg(i,'sm')}${p.loot.items[i]>1?'×'+p.loot.items[i]:''}</span>`).join('')}</p>`:'';
 return`<div class="enc"><small>Inimigos da fase (${foes.length}) · recompensa ao concluir</small><div class="stats"><div><small>XP total</small><b>${total}</b></div><div><small>Ryo (+ bônus)</small><b>${Math.round(n.ryo*1.5)}</b></div><div><small>Pergaminhos</small><b>${n.kind==='chefe'?'4+':'1+'}</b></div></div>
 <div class="foes">${rows}</div>${p?'':'<button class="learn alt" id="ph-sug">Sugerir escalação pela vantagem elemental</button>'}
 <div class="chart"><small>Quem vence quem (+40% de dano; em desvantagem, -25%)</small><div>${Object.keys(ELEM_BEATS).map(a=>`<span class="cc"><em class="el" style="--ec:${ELEMENTS[a].col}">${ELEMENTS[a].name}</em> vence <em class="el" style="--ec:${ELEMENTS[ELEM_BEATS[a]].col}">${ELEMENTS[ELEM_BEATS[a]].name}</em></span>`).join('')}</div></div><p class="tip">Escolha quem enfrenta cada inimigo. Quem perde sai da fase; quem vence segue com a vida que sobrou. Cada inimigo solta ryo e talvez um item (animais: pílulas; bandidos: armas e roupas; ninjas: qualquer item; líderes sempre soltam). O XP vai igual para todos que lutaram.</p></div>${lootHtml}${teamHtml}<div class="act">${act}</div>`;}

function bindPhase(t){
 const p=CAMP.phase&&CAMP.phase.node===mapSel?CAMP.phase:null;
 t.querySelectorAll('[data-team]').forEach(b=>b.onclick=()=>{const c=b.dataset.team,tm=teamNow();const i=tm.indexOf(c);if(i>=0){if(tm.length>1)tm.splice(i,1);}else if(tm.length<PHASE_MAX_TEAM)tm.push(c);else{toast('Equipe cheia (máx. '+PHASE_MAX_TEAM+')');return;}mapTeam=tm;renderMap();});
 t.querySelectorAll('select[data-f]').forEach(s=>s.onchange=()=>{(p?p.assign:mapAssign)[+s.dataset.f]=s.value;if(p)saveCamp();});
 t.querySelectorAll('[data-fight]').forEach(b=>b.onclick=()=>{const i=+b.dataset.fight,h=p.assign[i];if(!h||!p.u[h]||!p.u[h].alive){toast('Escolha um personagem em pé');return;}startEncounter(p.node,h,i);});
 const sg=document.getElementById('ph-sug');if(sg)sg.onclick=()=>{const n=NODES[mapSel],foes=nodeFoes(mapSel),tm=teamNow();mapAssign=suggestAssign(tm,foes,n,()=>true);renderMap();};
 const q=document.getElementById('ph-quit');if(q)q.onclick=()=>{if(confirm('Desistir da fase? Nenhum XP é ganho.'))abandonPhase();};}

/* ---- butim: cada inimigo derrotado solta ryo e talvez um item; o butim vai para CAMP.phase.loot e so e pago no fim ---- */
const DROP_KIND={lobo:'animal',bandido:'bandido'};
const dropKind=f=>DROP_KIND[f.skin]||'ninja';
/* sorteia item por raridade (como rollDrop), so entre os itens aceitos por ok(); max = nivel usado no teto de raridade */
function rollDropBy(max,ok){const w={1:55,2:28,3:12,4:4,5:1},lim=(max||99)+8,ids=Object.keys(ITEMS).filter(i=>ok(ITEMS[i])&&(ITEM_LVL[ITEMS[i].rar]||1)<=lim);let tot=0;const pool=ids.map(i=>{const x=w[ITEMS[i].rar]||1;tot+=x;return[i,x];});let r=Math.random()*tot;for(const[i,x]of pool){if((r-=x)<=0)return i;}return ids[0];}
function rollFoeDrop(f,n){const k=dropKind(f),boss=(f.dl||0)>=1,mult={animal:.6,bandido:1.4,ninja:1}[k],ryo=Math.max(1,Math.round(n.ryo/4*mult*(.8+Math.random()*.4)*(boss?1.5:1)));
 const chance=boss?1:{animal:.45,bandido:.35,ninja:.4}[k];let item=null;
 if(Math.random()<chance){const lv=n.lvl+(f.dl||0);
  if(k==='animal'&&!boss)item=Math.random()<.7?'pilula_vida':'pilula_ck';
  else if(k==='bandido'&&!boss)item=rollDropBy(lv,it=>it.slot==='arma'||it.slot==='corpo'||it.slot==='cons');
  else item=rollDropBy(boss?lv+6:lv,it=>true);}
 return{ryo,item};}
const lootTxt=l=>(l.ryo?l.ryo+' ryo':'')+Object.keys(l.items||{}).map(i=>' · '+ITEMS[i].name+(l.items[i]>1?' ×'+l.items[i]:'')).join('');

/* vida e chakra que o personagem levou do duelo anterior */
function phaseCarry(){const a=CAMP.active,p=CAMP.phase;if(!a||!p||a.foe==null)return;const u=p.u[a.hero],m=roleN?'n':'s';if(u&&u.hp!=null){hp[m]=Math.max(1,Math.min(HPMAX[m],u.hp));ck[m]=Math.max(0,Math.min(100,u.ck));setBars();}}

/* fim de um duelo da fase: guarda vida/chakra, tira quem perdeu e encerra a fase se acabou */
function phaseDuelEnd(me,won){
 const p=CAMP.phase,a=CAMP.active,m=roleN?'n':'s',u=p.u[me];if(!u)return;
 u.fought=true;u.ck=ck[m];
 let drop=null;
 if(won){u.hp=Math.max(1,hp[m]);p.foes[a.foe].done=true;p.loot=p.loot||{ryo:0,items:{}};drop=rollFoeDrop(nodeFoes(p.node)[a.foe],NODES[p.node]);p.loot.ryo+=drop.ryo;if(drop.item)p.loot.items[drop.item]=(p.loot.items[drop.item]||0)+1;}else{u.hp=0;u.alive=false;}
 const left=p.foes.filter(f=>!f.done).length,alive=Object.keys(p.u).filter(c=>p.u[c].alive).length,done=!left,fail=!done&&!alive;
 if(done||fail)phaseReward(done);
 else setTimeout(()=>toast(won?CHARS[me].name.split(' ')[0]+' venceu! +'+drop.ryo+' ryo'+(drop.item?' · '+ITEMS[drop.item].name:'')+' · faltam '+left:CHARS[me].name.split(' ')[0]+' caiu e sai da fase'),2600);
 saveCamp();campaignResult(done);}
function phaseReward(win){
 const p=CAMP.phase,n=NODES[p.node],tot=nodeFoes(p.node).reduce((s,f)=>s+foeXp(n,f),0),msgs=[];
 Object.keys(p.u).filter(c=>p.u[c].fought).forEach(c=>{const fx=Math.min(1.3,Math.max(.1,1+(n.lvl-PROG[c].level)*.08)),xp=Math.max(1,Math.round(tot*fx*(win?1:.15))),up=awardXp(c,xp);msgs.push(CHARS[c].name.split(' ')[0]+' +'+xp+(up?' (Nv '+PROG[c].level+')':''));});
 const L=p.loot||{ryo:0,items:{}};let sc=0,bonus='';
 if(win){const bi=rollDropBy(n.lvl+4,it=>true),br=Math.round(n.ryo*.5);INV.ryo+=L.ryo+br;for(const i in L.items)addItem(i,L.items[i]);addItem(bi,1);sc=typeof gachaReward==='function'?gachaReward(true):0;bonus='Bônus da fase: '+br+' ryo · '+ITEMS[bi].name+(sc?' · +'+sc+' pergaminho'+(sc>1?'s':''):'');}
 else INV.ryo+=Math.floor(L.ryo/2);
 saveInv();
 setTimeout(()=>toast((win?'Fase concluída! ':'Fase perdida. ')+'XP: '+msgs.join(' · ')),2600);
 setTimeout(()=>toast((win?'Butim: ':'Butim salvo (metade do ryo): ')+(win?lootTxt(L):Math.floor(L.ryo/2)+' ryo')+(bonus?' — '+bonus:'')),5200);
 CAMP.phase=null;}
