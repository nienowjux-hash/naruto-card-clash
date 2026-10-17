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
function gachaCard(r,i){const rr=RARITY[r.rar];return`<div class="gc${r.fresh?' new':''} r${r.rar}" style="--rc:${rr.col};--d:${i*.28}s"><i class="gb"></i><canvas class="gpt" data-c="${r.id}" width="64" height="64"></canvas><b>${CHARS[r.id].name.split(' ')[0]}</b><em style="color:${rr.col}">${rr.name}</em><small>${r.fresh?'NOVO!':'+'+r.gain+' fragmentos'}</small></div>`;}
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
document.getElementById('g1').onclick=()=>gachaConfirm(1);document.getElementById('g10').onclick=()=>gachaConfirm(10);}

/* ---- confirmacao antes de gastar ---- */
function gachaConfirm(n){
 if(GACHA.scrolls<n){toast('Faltam pergaminhos de invocação');return;}
 const m=document.createElement('div');m.id='gcf';
 m.innerHTML=`<div class="gcfbox"><h3>Invocar ×${n}?</h3><p>Vão ser gastos <b>${n} pergaminho${n>1?'s':''}</b>.<br>Você tem <b>${GACHA.scrolls}</b> e ficará com <b>${GACHA.scrolls-n}</b>.</p>
  <p class="sm">Faltam ${Math.max(0,GACHA_PITY.rare-GACHA.pityRare)} invocações para um Raro garantido e ${Math.max(0,GACHA_PITY.leg-GACHA.pityLeg)} para o Lendário.</p>
  <div class="gcfact"><button class="learn alt" id="gcn">Cancelar</button><button class="learn" id="gcy">Invocar</button></div></div>`;
 document.getElementById('gacha').appendChild(m);
 const close=()=>{m.remove();window.removeEventListener('keydown',key,true);};
 const key=e=>{if(e.key==='Escape'){e.stopImmediatePropagation();close();}else if(e.key==='Enter'){e.stopImmediatePropagation();yes();}};
 const yes=()=>{close();const r=gachaPull(n);if(!r)return;gachaShown=null;renderGacha();gachaSummon(r,()=>{gachaShown=r;renderGacha();});};
 window.addEventListener('keydown',key,true);
 document.getElementById('gcn').onclick=close;document.getElementById('gcy').onclick=yes;document.getElementById('gcy').focus();}

/* ---- efeito de invocacao: circulo de selo girando, particulas em espiral, brilho na cor da melhor raridade e clarao ---- */
function gachaSummon(res,done){
 const best=Math.max(...res.map(r=>r.rar)),col=RARITY[best].col;
 const ov=document.createElement('div');ov.id='gsum';const cv=document.createElement('canvas');ov.appendChild(cv);const sk=document.createElement('button');sk.textContent='Pular ▸';ov.appendChild(sk);
 document.getElementById('gacha').appendChild(ov);
 const W=cv.width=ov.clientWidth,H=cv.height=ov.clientHeight,g=cv.getContext('2d'),cx=W/2,cy=H/2,R=Math.min(W,H)*.28,T=best>=4?3.2:best>=3?2.6:2.2,t0=performance.now();
 const n0=parseInt(col.slice(1),16),cr=n0>>16,cg=n0>>8&255,cb=n0&255;
 const parts=Array.from({length:90},()=>({a:Math.random()*6.28,r:R*(.9+Math.random()*1.6),s:.4+Math.random()*.9,z:1+Math.random()*2.4,ph:Math.random()}));
 let raf=0,ended=false;
 const end=()=>{if(ended)return;ended=true;cancelAnimationFrame(raf);ov.classList.add('out');setTimeout(()=>ov.remove(),420);done();};
 sk.onclick=e=>{e.stopPropagation();end();};ov.onclick=end;
 const ring=(r,n,len,rot,w,al)=>{g.save();g.translate(cx,cy);g.rotate(rot);g.lineWidth=w;g.strokeStyle=`rgba(${cr},${cg},${cb},${al})`;for(let i=0;i<n;i++){g.rotate(6.2832/n);g.beginPath();g.moveTo(r,0);g.lineTo(r+len,0);g.stroke();}g.restore();};
 const tri=(rad,off)=>{g.beginPath();for(let i=0;i<3;i++){const a=i*2.0944+off;g.lineTo(Math.cos(a)*rad,Math.sin(a)*rad);}g.closePath();g.stroke();};
 const frame=now=>{const t=(now-t0)/1000,k=Math.min(1,t/T),e=k*k*(3-2*k);
  g.clearRect(0,0,W,H);
  const bg=g.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.7);bg.addColorStop(0,`rgba(${cr*.25|0},${cg*.25|0},${cb*.25|0},.92)`);bg.addColorStop(1,'rgba(2,2,10,.97)');g.fillStyle=bg;g.fillRect(0,0,W,H);
  const rr=R*(.35+.65*Math.min(1,t/.7)),al=Math.min(1,t/.5);
  g.save();g.translate(cx,cy);g.shadowColor=col;g.shadowBlur=18+e*40;g.strokeStyle=`rgba(${cr},${cg},${cb},${al})`;g.lineWidth=3;g.beginPath();g.arc(0,0,rr,0,6.2832);g.stroke();g.lineWidth=1.5;g.beginPath();g.arc(0,0,rr*.82,0,6.2832);g.stroke();g.beginPath();g.arc(0,0,rr*1.12,0,6.2832);g.stroke();
  g.save();g.rotate(t*.6);tri(rr*.82,0);g.restore();g.save();g.rotate(-t*.9);tri(rr*.82,1.047);g.restore();g.restore();
  g.save();g.shadowColor=col;g.shadowBlur=10;ring(rr*1.14,48,10,t*.5,2,al);ring(rr*.78,24,8,-t*.9,2,al*.8);g.restore();
  for(const p of parts){const pr=p.r*(1-e*.92)+6,a=p.a+t*p.s*1.6,x=cx+Math.cos(a)*pr,y=cy+Math.sin(a)*pr*.55-t*6*p.s;g.fillStyle=`rgba(${cr},${cg},${cb},${.2+.7*(1-Math.abs(((t*p.s+p.ph)%1)-.5)*2)})`;g.fillRect(x|0,y|0,p.z,p.z);}
  const gr=g.createRadialGradient(cx,cy,0,cx,cy,R*(.2+e*.9));gr.addColorStop(0,`rgba(255,255,255,${.35+e*.6})`);gr.addColorStop(.35,`rgba(${cr},${cg},${cb},${.4+e*.4})`);gr.addColorStop(1,`rgba(${cr},${cg},${cb},0)`);g.fillStyle=gr;g.fillRect(0,0,W,H);
  if(best>=4&&t>T*.6){g.save();g.translate(cx,cy);g.rotate(t*.4);const n=best>=5?16:10;for(let i=0;i<n;i++){g.rotate(6.2832/n);g.fillStyle=`rgba(${cr},${cg},${cb},${.18*Math.min(1,(t-T*.6)*2)})`;g.beginPath();g.moveTo(0,0);g.lineTo(W,-26);g.lineTo(W,26);g.fill();}g.restore();}
  if(t>T-.45){const f=Math.min(1,(t-(T-.45))/.45);g.fillStyle=`rgba(255,255,255,${f})`;g.fillRect(0,0,W,H);}
  if(t>=T){end();return;}
  raf=requestAnimationFrame(frame);};
 raf=requestAnimationFrame(frame);}

(function(){const b=document.createElement('button');b.id='gachabtn';b.textContent='Invocação';b.onclick=openGacha;const c=document.querySelector('.ctl');if(c)c.insertBefore(b,c.children[1]||null);})();
window.addEventListener('keydown',e=>{const t=document.getElementById('gacha');if(e.key==='Escape'&&t&&!t.hidden){closeGacha();e.stopImmediatePropagation();}},true);
