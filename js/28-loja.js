/* ---------- Onde gastar o ryo: Loja do Armeiro e Ichiraku Ramen ----------
   Armeiro: compra (estoque que gira a cada fase vencida e cresce com o nivel do grupo) e venda (40% do preco) de itens da mochila.
   Ichiraku: prato de ramen que da bonus so na PROXIMA fase (vida, ataque, XP e ryo); o bonus fica guardado na fase (CAMP.phase.ramen) e some quando ela acaba.
   Preco, estoque e compras vivem em SHOP/funcoes aqui; no modo online tudo isso passa para o servidor. */
const SHOP_KEY='rpgShopV1';
let SHOP={rot:0,ramen:null};
try{const j=JSON.parse(localStorage.getItem(SHOP_KEY)||'null');if(j)Object.assign(SHOP,j);}catch(e){}
function saveShop(){try{localStorage.setItem(SHOP_KEY,JSON.stringify(SHOP));}catch(e){}}
function resetShop(){SHOP={rot:0,ramen:null};saveShop();}
const SHOP_SELL=.4;
function shopPrice(id){const it=ITEMS[id];if(!it)return 0;if(it.slot==='cons')return({pilula_vida:30,pilula_ck:30,pergaminho_med:180,elixir_sabio:480})[id]||100;return({1:45,2:130,3:380,4:950,5:2500})[it.rar]||100;}
const shopSellPrice=id=>Math.max(1,Math.round(shopPrice(id)*SHOP_SELL));
/* estoque: pilulas sempre; 8 equipamentos (ate Raro) sorteados por SHOP.rot entre os que o nivel do grupo permite */
function shopStock(){const maxLv=Math.max(1,...ownedChars().map(c=>PROG[c].level)),pool=Object.keys(ITEMS).filter(id=>ITEMS[id].slot!=='cons'&&ITEMS[id].rar<=3&&(ITEM_LVL[ITEMS[id].rar]||1)<=maxLv+6);
 const picks=pool.map(id=>[id,konHash(SHOP.rot*131+id.charCodeAt(0)*7+id.length,id.charCodeAt(id.length-1)+SHOP.rot)]).sort((a,b)=>a[1]-b[1]).slice(0,8).map(x=>x[0]);
 return['pilula_vida','pilula_ck'].concat(maxLv>=8?['pergaminho_med']:[],picks);}
function shopBuy(id){const p=shopPrice(id);if(INV.ryo<p){toast('Ryo insuficiente');return false;}INV.ryo-=p;addItem(id,1);saveInv();return true;}
function shopSell(id){if(bagQty(id)<1)return false;INV.bag[id]--;if(INV.bag[id]<=0)delete INV.bag[id];INV.ryo+=shopSellPrice(id);saveInv();return true;}

/* ---- Ramen ---- */
const RAMEN=[
 {id:'shoyu',name:'Ramen de Shoyu',price:60,hp:12,atk:.03,xp:0,ryo:0,d:'Caldo leve e quente.'},
 {id:'miso',name:'Ramen de Miso',price:130,hp:25,atk:.06,xp:.10,ryo:0,d:'Caldo encorpado: mais vida, ataque e um pouco de XP.'},
 {id:'especial',name:'Ramen Especial do Ichiraku',price:280,hp:40,atk:.08,xp:.25,ryo:.25,d:'Com ovo, narutomaki e carne extra. O melhor da casa!'}];
function ramenTxt(r){return[r.hp?'+'+r.hp+' de vida':'',r.atk?'+'+Math.round(r.atk*100)+'% de ataque':'',r.xp?'+'+Math.round(r.xp*100)+'% de XP':'',r.ryo?'+'+Math.round(r.ryo*100)+'% de ryo':''].filter(Boolean).join(' · ');}
function ramenBuy(id){const r=RAMEN.find(x=>x.id===id);if(!r||INV.ryo<r.price){toast('Ryo insuficiente');return false;}INV.ryo-=r.price;saveInv();SHOP.ramen={id:r.id,name:r.name,hp:r.hp,atk:r.atk,xp:r.xp,ryo:r.ryo};saveShop();return true;}
const ramenIcons={};
function ramenIcon(kind){if(ramenIcons[kind])return ramenIcons[kind];const g=PixGrid(28,24),P={K:'#1a0f08',W:'#f6f0e0',w:'#d8cfb8',R:'#c83a30',r:'#8a2018',Y:'#f4d078',y:'#c8a040',N:'#e8c870',n:'#c8a050',E:'#fffbe8',O:'#e88a2a',P:'#f0a0b0',G:'#5aa84a',B:'#6a4a30',S:'#ffffff'};
 g.ell(14,16,12,7,'W');g.poly([[2,14],[26,14],[22,23],[6,23]],'R');g.poly([[2,14],[26,14],[25,16],[3,16]],'r');g.line(4,15,24,15,'W');g.poly([[6,21],[22,21],[20,23],[8,23]],'r');g.ell(14,14,11,3.6,'Y');
 for(let i=0;i<5;i++){g.line(5+i*4,13,8+i*4,15,'n');g.line(6+i*4,12,9+i*4,14,'N');}
 if(kind!=='shoyu'){g.ell(9,12,3.4,2.6,'E');g.ell(9,12,1.4,1.2,'O');}
 if(kind==='especial'){g.ell(20,11,3.6,2.4,'W');g.ell(20,11,2,1.2,'P');g.line(18,11,22,11,'R');g.poly([[12,10],[16,10],[16,13],[12,13]],'B');g.set(24,13,'G');g.set(5,13,'G');g.set(14,9,'G');}
 g.set(11,6,'S');g.set(12,4,'S');g.set(13,2,'S');g.set(17,6,'S');g.set(16,4,'S');g.set(18,2,'S');g.outline('K');
 const c=document.createElement('canvas');g.draw(c,P,2);return ramenIcons[kind]=c.toDataURL();}

/* ---- telas ---- */
let shopTab='buy',shopPick=null;
function shopEl(){let t=document.getElementById('shop');if(t)return t;t=document.createElement('div');t.id='shop';t.hidden=true;document.body.appendChild(t);return t;}
function openShop(){shopTab='buy';shopPick=null;shopEl().hidden=false;renderShop();}
function closeShop(){shopEl().hidden=true;if(!anim&&!outcome&&!turnLock)showMenu('main');}
function shopRow(id,price,qty,sel){const it=ITEMS[id];return`<button class="sit${sel?' sel':''}" data-id="${id}" style="--rc:${RARITY[it.rar].col}"><span class="gi">${icoImg(id)}</span><span class="sn"><b>${it.name}</b><small>${RARITY[it.rar].name}${it.slot==='cons'?' · consumível':' · '+SLOTS[it.slot]}${qty?' · tem '+qty:''}</small></span><span class="sp">${price}<em>ryo</em></span></button>`;}
function renderShop(){
 const t=shopEl(),buy=shopTab==='buy',ids=buy?shopStock():Object.keys(INV.bag).filter(id=>ITEMS[id]);
 if(shopPick&&!ids.includes(shopPick))shopPick=null;
 ids.sort((a,b)=>(ITEMS[a].slot==='cons'?9:0)-(ITEMS[b].slot==='cons'?9:0)||ITEMS[b].rar-ITEMS[a].rar);
 const rows=ids.map(id=>shopRow(id,buy?shopPrice(id):shopSellPrice(id),buy?bagQty(id):bagQty(id),shopPick===id)).join('')||'<p class="hint">Sua mochila está vazia.</p>';
 let det='<p class="hint">Escolha um item para ver os detalhes.</p>';
 if(shopPick){const it=ITEMS[shopPick],pr=buy?shopPrice(shopPick):shopSellPrice(shopPick),can=buy?INV.ryo>=pr:true;
  det=`<div class="sdet">${icoImg(shopPick,'big')}<h4 style="color:${RARITY[it.rar].col}">${it.name}</h4><small>${RARITY[it.rar].name} · ${it.slot==='cons'?'Consumível':SLOTS[it.slot]+' · nível '+(ITEM_LVL[it.rar]||1)}${it.only?' · só '+it.only.map(c=>CHARS[c].name.split(' ')[0]).join(', '):''}</small><p>${it.d}</p>
   <p class="eff">${it.slot==='cons'?Object.keys(it.use).map(k=>'+'+it.use[k]+(k==='hp'?' de vida':' de chakra')).join(' · '):statLines(it.stats).join('<br>')}</p>
   <button class="learn${can?'':' off'}" id="sact">${buy?'Comprar':'Vender'} por ${pr} ryo</button></div>`;}
 t.innerHTML=`<div class="sbox"><div class="thead"><h2>Loja do Armeiro</h2><div class="tabs"><button class="tab${buy?' on':''}" data-t="buy">Comprar</button><button class="tab${buy?'':' on'}" data-t="sell">Vender</button></div><div class="ryo"><b>${INV.ryo}</b><small>ryo</small></div><button class="x" id="sinv">Equipamentos</button><button class="x" id="sx">Fechar ✕</button></div>
  <div class="smain"><section class="slist">${buy?`<p class="hint">O estoque muda a cada fase concluída e melhora com o nível do grupo. Armas e armaduras Épicas e Lendárias não se compram: só caem em fases ou na invocação.</p>`:`<p class="hint">Venda itens repetidos ou que você não usa por ${Math.round(SHOP_SELL*100)}% do preço. Itens equipados não aparecem aqui.</p>`}<div class="sgrid">${rows}</div></section><aside class="sside">${det}</aside></div></div>`;
 t.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{shopTab=b.dataset.t;shopPick=null;renderShop();});
 t.querySelectorAll('.sit').forEach(b=>b.onclick=()=>{shopPick=b.dataset.id;renderShop();});
 document.getElementById('sx').onclick=closeShop;document.getElementById('sinv').onclick=()=>{closeShop();openInv();};
 const a=document.getElementById('sact');if(a)a.onclick=()=>{const id=shopPick,pr=buy?shopPrice(id):shopSellPrice(id);
  if(buy){if(INV.ryo<pr){toast('Ryo insuficiente');return;}if(pr>=150&&!confirm('Comprar '+ITEMS[id].name+' por '+pr+' ryo?'))return;if(shopBuy(id))toast('Comprou '+ITEMS[id].name);}
  else{if(ITEMS[id].rar>=3&&!confirm('Vender '+ITEMS[id].name+' por '+pr+' ryo?'))return;if(shopSell(id))toast('Vendeu '+ITEMS[id].name+' (+'+pr+' ryo)');}
  renderShop();};}
function ramenEl(){let t=document.getElementById('ramen');if(t)return t;t=document.createElement('div');t.id='ramen';t.hidden=true;document.body.appendChild(t);return t;}
function openRamen(){ramenEl().hidden=false;renderRamen();}
function closeRamen(){ramenEl().hidden=true;if(!anim&&!outcome&&!turnLock)showMenu('main');}
function renderRamen(){
 const t=ramenEl(),cur=SHOP.ramen;
 t.innerHTML=`<div class="sbox rbox"><div class="thead"><h2>Ichiraku Ramen</h2><div class="ryo"><b>${INV.ryo}</b><small>ryo</small></div><button class="x" id="rx">Fechar ✕</button></div>
  <div class="rmain"><p class="hint">O bônus vale só para a <b>próxima fase</b> que você iniciar (e some quando ela acabar). Só um prato por vez: comer outro troca o anterior.</p>
  ${cur?`<div class="rcur">Prato ativo: <b>${cur.name}</b> — ${ramenTxt(cur)}</div>`:'<div class="rcur none">Nenhum prato ativo.</div>'}
  <div class="rgrid">${RAMEN.map(r=>`<div class="rc"><img class="ico big" src="${ramenIcon(r.id)}" alt=""><h4>${r.name}</h4><small>${r.d}</small><p class="eff">${ramenTxt(r)}</p><button class="learn${INV.ryo>=r.price?'':' off'}" data-r="${r.id}">Comer por ${r.price} ryo</button></div>`).join('')}</div></div></div>`;
 document.getElementById('rx').onclick=closeRamen;
 t.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const r=RAMEN.find(x=>x.id===b.dataset.r);if(SHOP.ramen&&!confirm('Já existe um prato ativo ('+SHOP.ramen.name+'). Trocar por '+r.name+'?'))return;if(ramenBuy(r.id)){toast('Itadakimasu! '+r.name+' pronto para a próxima fase');renderRamen();}});}
window.addEventListener('keydown',e=>{if(e.key!=='Escape')return;for(const [id,fn] of [['shop',closeShop],['ramen',closeRamen]]){const t=document.getElementById(id);if(t&&!t.hidden){fn();e.stopImmediatePropagation();return;}}},true);
