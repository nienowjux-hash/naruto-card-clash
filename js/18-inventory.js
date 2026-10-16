/* ---------- Tela de equipamentos e mochila (por personagem) ----------
   Slots de Arma, Corpo e Acessorio, resumo de atributos com previa da troca e lista de itens da mochila. */
let invChar='sasuke',invPick=null;
function invEl(){let t=document.getElementById('inv');if(t)return t;t=document.createElement('div');t.id='inv';t.hidden=true;document.body.appendChild(t);return t;}
function openInv(){invEl().hidden=false;renderInv();}
function closeInv(){invEl().hidden=true;if(!anim&&!outcome&&!turnLock)showMenu('main');}
const pctTxt=v=>Math.round(v*100)+'%';
function statLines(st){if(!st)return[];const L=[];if(st.hp)L.push('+'+st.hp+' de vida máxima');if(st.atk)L.push('+'+pctTxt(st.atk)+' de ataque');if(st.def)L.push('-'+pctTxt(st.def)+' de dano recebido');if(st.elem)L.push('+'+pctTxt(st.pct)+' de dano de '+ELEMENTS[st.elem].name);return L;}
function statsWith(charId,slot,id){const keep=INV.eq[charId];const copy=Object.assign({},keep);if(id)copy[slot]=id;else delete copy[slot];const old=INV.eq[charId];INV.eq[charId]=copy;const s=statsOf(charId);INV.eq[charId]=old;return s;}
function invLocked(){return battleOn&&!outcome;}
function renderInv(){
 const t=invEl(),eq=INV.eq[invChar],S=statsOf(invChar),locked=invLocked();
 const pick=invPick&&ITEMS[invPick]?ITEMS[invPick]:null;
 const P=pick&&pick.slot!=='cons'&&canEquip(invChar,invPick)?statsWith(invChar,pick.slot,invPick):null;
 const diff=(cur,nw,fmt)=>{const a=fmt(cur),b=fmt(nw);return P&&nw!==cur?`<b>${a}</b> <i class="${nw>cur?'up':'dn'}">→ ${b}</i>`:`<b>${a}</b>`;};
 const elems=Object.keys(S.elem).concat(P?Object.keys(P.elem):[]).filter((e,i,a)=>a.indexOf(e)===i);
 const slots=Object.keys(SLOTS).map(sl=>{const id=eq[sl],it=id&&ITEMS[id];
  return `<button class="slot${it?' full':''}" data-slot="${sl}" style="--rc:${it?RARITY[it.rar].col:'#3a2f14'}"><span class="si">${it?it.g:'＋'}</span><span class="st"><small>${SLOTS[sl]}</small><b>${it?it.name:'Vazio'}</b>${it?`<em>${statLines(it.stats).join(' · ')}</em>`:''}</span>${it?'<i class="rm" title="Desequipar">✕</i>':''}</button>`;}).join('');
 const bagIds=Object.keys(INV.bag).filter(id=>ITEMS[id]),order=id=>(ITEMS[id].slot==='cons'?9:0)+ITEMS[id].rar*-1;
 bagIds.sort((a,b)=>order(a)-order(b));
 const cards=bagIds.map(id=>{const it=ITEMS[id],ok=it.slot==='cons'||canEquip(invChar,id);return `<button class="it${invPick===id?' sel':''}${ok?'':' no'}" data-id="${id}" style="--rc:${RARITY[it.rar].col}"><span class="gi">${it.g}</span><b>${it.name}</b><small>${it.slot==='cons'?'Consumível':SLOTS[it.slot]}</small>${INV.bag[id]>1?`<i class="qt">×${INV.bag[id]}</i>`:''}</button>`;}).join('')||'<p class="hint">Mochila vazia. Vença lutas para ganhar itens.</p>';
 let det='<p class="hint">Escolha um item da mochila para ver os detalhes.</p>';
 if(pick){const ok=pick.slot==='cons'||canEquip(invChar,invPick);
  det=`<div class="dtx"><h4 style="color:${RARITY[pick.rar].col}">${pick.name}</h4><small>${RARITY[pick.rar].name} · ${pick.slot==='cons'?'Consumível':SLOTS[pick.slot]}${pick.only?' · só '+pick.only.map(c=>CHARS[c].name.split(' ')[0]).join(', '):''}</small><p>${pick.d}</p>`
   +(pick.slot==='cons'?`<p class="eff">${Object.keys(pick.use).map(k=>'+'+pick.use[k]+(k==='hp'?' de vida':' de chakra')).join(' · ')} — use pelo comando Itens durante a luta.</p>`:`<p class="eff">${statLines(pick.stats).join('<br>')}</p>`)+'</div>'
   +(pick.slot==='cons'?'':!ok?'<span class="why">Este personagem não pode equipar</span>':locked?'<span class="why">Troque de equipamento fora da luta (use Resetar luta)</span>':`<button class="learn" id="eqbtn">Equipar em ${CHARS[invChar].name.split(' ')[0]}</button>`);}
 t.innerHTML=`<div class="ibox"><div class="thead"><div class="tabs">${Object.keys(CHARS).map(c=>`<button class="tab${c===invChar?' on':''}" data-c="${c}">${CHARS[c].name.split(' ')[0]}</button>`).join('')}</div><div class="ryo"><b>${INV.ryo}</b><small>ryo</small></div><button class="x" id="invx">Fechar (Esc) ✕</button></div>
  <div class="imain"><section class="ileft"><div class="who"><canvas id="invpt" width="96" height="96"></canvas><div><h3>${CHARS[invChar].name}</h3><small>Nível ${PROG[invChar].level}</small></div></div>
   <div class="slots">${slots}</div>
   <div class="sum"><h5>Atributos</h5><div class="row"><span>Vida máxima</span>${diff(S.hp,P?P.hp:S.hp,v=>100+v)}</div><div class="row"><span>Ataque</span>${diff(S.atk,P?P.atk:S.atk,v=>'+'+pctTxt(v))}</div><div class="row"><span>Defesa</span>${diff(S.def,P?P.def:S.def,v=>pctTxt(v))}</div>
   ${elems.map(e=>`<div class="row"><span>Dano de ${ELEMENTS[e].name}</span>${diff(S.elem[e]||0,P?(P.elem[e]||0):(S.elem[e]||0),v=>'+'+pctTxt(v))}</div>`).join('')}</div>
   ${locked?'<p class="why lock">Luta em andamento: equipamentos travados.</p>':''}</section>
  <section class="iright"><h5>Mochila</h5><div class="grid">${cards}</div><div class="idet">${det}</div></section></div>
  <div class="tdev"><button id="invdrop">+ item aleatório (teste)</button><button id="invrs">Zerar mochila</button></div></div>`;
 const pc=document.getElementById('invpt'),src=document.getElementById(invChar==='sasuke'?'ptS':'ptN');if(pc&&src){const g=pc.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(src,0,0,96,96);}
 t.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{invChar=b.dataset.c;renderInv();});
 t.querySelectorAll('.it').forEach(b=>b.onclick=()=>{invPick=b.dataset.id;renderInv();});
 t.querySelectorAll('.slot').forEach(b=>b.onclick=()=>{if(locked){toast('Troque de equipamento fora da luta');return;}if(unequipItem(invChar,b.dataset.slot)){syncHpMax(false);}renderInv();});
 const eb=document.getElementById('eqbtn');if(eb)eb.onclick=()=>{if(equipItem(invChar,invPick)){toast('Equipou '+ITEMS[invPick].name);syncHpMax(false);if(!INV.bag[invPick])invPick=null;}renderInv();};
 document.getElementById('invx').onclick=closeInv;
 document.getElementById('invdrop').onclick=()=>{addItem(rollDrop(),1);renderInv();};
 document.getElementById('invrs').onclick=()=>{if(confirm('Zerar mochila e equipamentos?')){resetInv();invPick=null;syncHpMax(false);renderInv();}};}
window.addEventListener('keydown',e=>{const t=document.getElementById('inv');if(e.key==='Escape'&&t&&!t.hidden){closeInv();e.stopImmediatePropagation();}},true);
(function(){const b=document.createElement('button');b.id='invbtn';b.textContent='Equipamentos';b.onclick=openInv;const c=document.querySelector('.ctl');if(c)c.insertBefore(b,c.firstChild);})();
/* recompensa de luta: ryo e um item (70% de chance) */
function giveBattleLoot(won){if(!won)return;const ryo=100;INV.ryo+=ryo;let nm='';if(Math.random()<.7){const id=rollDrop();addItem(id,1);nm=ITEMS[id].name;}saveInv();
 setTimeout(()=>toast('+'+ryo+' ryo'+(nm?' · item: '+nm:'')),4600);}
syncHpMax(true);
