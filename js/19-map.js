/* ---------- Mapa da campanha ----------
   Mapa pintado por codigo (oceano, terras, regioes, caminhos). Escolha um local, a equipe e parta para a batalha.
   O cenario da luta vem do local (setScene) e o inimigo recebe a escala e os elementos do local. */
let mapSel=null,mapHero='sasuke',mapRAF=null,mapBG=null,mapTok=null,mapMoving=false,mapHover=null;
const NODE_GLYPH={konoha:'葉',treino:'修',floresta:'森',deserto:'砂',neve:'雪',vale:'終'};
const ORIG_NAMES={s:'SASUKE UCHIHA',n:'NARUTO UZUMAKI'};
function mapEl(){let t=document.getElementById('map');if(t)return t;t=document.createElement('div');t.id='map';t.hidden=true;document.body.appendChild(t);return t;}

/* ---- pintura do mapa (uma vez, guardada em cache) ---- */
function paintMap(){
 const cv=document.createElement('canvas');cv.width=MAP_W;cv.height=MAP_H;const c=cv.getContext('2d');
 let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 const blob=(cx,cy,rx,ry,ph)=>{c.beginPath();for(let i=0;i<=56;i++){const a=i/56*Math.PI*2,k=1+.16*Math.sin(3*a+ph)+.1*Math.sin(5*a+ph*2)+.05*Math.sin(9*a+ph*3);const x=cx+Math.cos(a)*rx*k,y=cy+Math.sin(a)*ry*k;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();};
 /* oceano */
 let g=c.createLinearGradient(0,0,0,MAP_H);g.addColorStop(0,'#0e2a4a');g.addColorStop(1,'#08182e');c.fillStyle=g;c.fillRect(0,0,MAP_W,MAP_H);
 c.strokeStyle='rgba(120,180,230,.13)';c.lineWidth=1.5;for(let i=0;i<150;i++){const x=rnd()*MAP_W,y=rnd()*MAP_H,w=14+rnd()*22;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+w/2,y-5,x+w,y);c.stroke();}
 /* terras */
 const LAND=[[210,335,250,190,1],[590,300,330,250,2],[900,330,270,230,3],[140,330,150,130,4]];
 c.save();c.shadowColor='#000';c.shadowBlur=30;c.shadowOffsetY=10;c.fillStyle='#e6d49a';for(const[a,b,rx,ry,p]of LAND){blob(a,b,rx+10,ry+10,p);c.fill();}c.restore();
 g=c.createLinearGradient(0,60,0,600);g.addColorStop(0,'#5b7a45');g.addColorStop(1,'#46603a');c.fillStyle=g;for(const[a,b,rx,ry,p]of LAND){blob(a,b,rx,ry,p);c.fill();}
 /* regioes */
 const reg=(x,y,r,col,ry)=>{const gr=c.createRadialGradient(x,y,r*.15,x,y,r);gr.addColorStop(0,col);gr.addColorStop(.72,col);gr.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=gr;c.beginPath();c.ellipse(x,y,r,ry||r*.85,0,0,7);c.fill();};
 reg(550,165,190,'#2a5430');reg(540,485,185,'#cfa862',150);reg(805,490,150,'#e9f1f8',120);reg(985,290,170,'#6c7088',150);reg(135,330,120,'#7c9a50');reg(340,310,120,'#a5c46e',100);
 /* arvores */
 const tree=(x,y,s,col,top)=>{c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(x,y+s*.9,s*.7,s*.25,0,0,7);c.fill();c.fillStyle=col;for(let i=0;i<3;i++){const w=s*(1-i*.22);c.beginPath();c.moveTo(x,y-s*(1.1+i*.55));c.lineTo(x-w*.62,y-s*(.1+i*.55)+s*.1);c.lineTo(x+w*.62,y-s*(.1+i*.55)+s*.1);c.closePath();c.fill();}if(top){c.fillStyle=top;c.beginPath();c.moveTo(x,y-s*2.2);c.lineTo(x-s*.28,y-s*1.75);c.lineTo(x+s*.28,y-s*1.75);c.fill();}};
 const scatter=(n,cx,cy,rx,ry,fn)=>{for(let i=0;i<n;i++){const a=rnd()*7,r=Math.sqrt(rnd());fn(cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r);}};
 scatter(95,550,165,175,120,(x,y)=>tree(x,y,9+rnd()*5,rnd()<.5?'#1c4426':'#245a2e'));
 scatter(20,135,330,100,90,(x,y)=>tree(x,y,6+rnd()*3,'#3d6a34'));
 scatter(18,340,310,100,80,(x,y)=>tree(x,y,6+rnd()*3,'#56863f'));
 scatter(16,800,490,120,95,(x,y)=>tree(x,y,7+rnd()*3,'#dfe9ee','#ffffff'));
 /* dunas */
 c.strokeStyle='rgba(120,80,30,.35)';c.lineWidth=2;scatter(40,540,485,160,115,(x,y)=>{c.beginPath();c.arc(x,y,12+rnd()*16,Math.PI*1.1,Math.PI*1.9);c.stroke();});
 /* montanhas */
 const mount=(x,y,s,col)=>{c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.moveTo(x-s*1.1,y+s*.5);c.lineTo(x+s*1.4,y+s*.5);c.lineTo(x+s*.3,y-s*.4);c.fill();c.fillStyle=col;c.beginPath();c.moveTo(x-s,y+s*.4);c.lineTo(x,y-s);c.lineTo(x+s,y+s*.4);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.moveTo(x,y-s);c.lineTo(x-s*.3,y-s*.45);c.lineTo(x+s*.05,y-s*.55);c.lineTo(x+s*.3,y-s*.42);c.closePath();c.fill();};
 for(const[x,y,s]of [[690,420,38],[735,395,30],[880,570,34],[935,545,28],[1060,400,30],[1090,230,34],[930,150,32],[1040,170,28],[420,130,26],[280,470,26],[200,215,24]])mount(x,y,s,'#7c8294');
 /* cachoeira e estatuas no Vale do Fim */
 c.fillStyle='rgba(170,215,255,.85)';c.fillRect(973,262,24,46);c.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<6;i++)c.fillRect(975+i*4,264,1.5,42);
 c.fillStyle='#4a4e66';c.fillRect(935,270,26,40);c.fillRect(1010,270,26,40);c.fillStyle='#5d6280';c.beginPath();c.arc(948,264,9,0,7);c.arc(1023,264,9,0,7);c.fill();
 /* rio da vila */
 c.strokeStyle='#4a88c8';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(130,170);c.bezierCurveTo(60,260,210,330,130,470);c.stroke();c.strokeStyle='#9fd0f0';c.lineWidth=2.5;c.stroke();
 /* casas de Konoha */
 for(const[x,y]of [[82,360],[112,378],[150,372],[178,350],[94,306],[160,300]]){c.fillStyle='#8b5a2b';c.fillRect(x-9,y-6,18,12);c.fillStyle='#b8452a';c.beginPath();c.moveTo(x-12,y-6);c.lineTo(x,y-16);c.lineTo(x+12,y-6);c.fill();}
 /* bussola e moldura */
 c.save();c.translate(1100,570);c.strokeStyle='rgba(240,220,160,.7)';c.fillStyle='rgba(240,220,160,.7)';c.lineWidth=1.5;c.beginPath();c.arc(0,0,26,0,7);c.stroke();c.beginPath();c.moveTo(0,-34);c.lineTo(7,0);c.lineTo(0,34);c.lineTo(-7,0);c.closePath();c.fill();c.font='700 13px Georgia';c.textAlign='center';c.fillText('N',0,-40);c.restore();
 c.strokeStyle='#b8924a';c.lineWidth=6;c.strokeRect(3,3,MAP_W-6,MAP_H-6);
 g=c.createRadialGradient(MAP_W/2,MAP_H/2,MAP_H*.45,MAP_W/2,MAP_H/2,MAP_W*.62);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,10,.55)');c.fillStyle=g;c.fillRect(0,0,MAP_W,MAP_H);
 return cv;}

/* ---- caminhos entre locais (caminho mais curto passando por locais ja abertos) ---- */
function mapPath(from,to){const q=[[from]],seen={[from]:1};while(q.length){const p=q.shift(),n=p[p.length-1];if(n===to)return p;for(const m of nodeNeighbors(n)){if(seen[m]||nodeState(m)==='locked')continue;seen[m]=1;q.push(p.concat(m));}}return null;}
function edgePts(a,b){const A=NODES[a],B=NODES[b],mx=(A.x+B.x)/2,my=(A.y+B.y)/2,nx=-(B.y-A.y),ny=B.x-A.x,L=Math.hypot(nx,ny)||1,k=(a<b?1:-1)*.12;return{a:[A.x,A.y],b:[B.x,B.y],c:[mx+nx/L*L*k,my+ny/L*L*k]};}
const bez=(e,t)=>[(1-t)*(1-t)*e.a[0]+2*(1-t)*t*e.c[0]+t*t*e.b[0],(1-t)*(1-t)*e.a[1]+2*(1-t)*t*e.c[1]+t*t*e.b[1]];

/* ---- desenho animado ---- */
function mapDraw(ts){
 const cv=document.getElementById('mapcv');if(!cv){mapRAF=null;return;}
 const c=cv.getContext('2d'),t=ts/1000;if(!mapBG)mapBG=paintMap();c.drawImage(mapBG,0,0);
 for(const[a,b]of EDGES){const e=edgePts(a,b),sa=nodeState(a),sb=nodeState(b),on=sa==='cleared'&&sb==='cleared',open=sa!=='locked'&&sb!=='locked';
  c.save();c.lineCap='round';c.strokeStyle='rgba(0,0,0,.45)';c.lineWidth=9;c.beginPath();c.moveTo(...e.a);c.quadraticCurveTo(...e.c,...e.b);c.stroke();
  c.strokeStyle=on?'#ffd97a':open?'#e8d9a8':'#6e6650';c.lineWidth=4;c.setLineDash(on?[1,10]:[10,10]);c.lineDashOffset=on?-t*12:0;if(on){c.shadowColor='#ffb400';c.shadowBlur=10;}c.beginPath();c.moveTo(...e.a);c.quadraticCurveTo(...e.c,...e.b);c.stroke();c.restore();}
 for(const id in NODES){const n=NODES[id],st=nodeState(id),sel=mapSel===id,hov=mapHover===id,r=27+(sel?3:0)+(hov?2:0);
  c.save();c.translate(n.x,n.y);
  if(st==='open'||sel){const p=(Math.sin(t*3)+1)/2;c.strokeStyle=`rgba(255,217,122,${.35+.4*p})`;c.lineWidth=3;c.beginPath();c.arc(0,0,r+7+p*5,0,7);c.stroke();}
  c.shadowColor='#000';c.shadowBlur=12;c.shadowOffsetY=4;
  const gr=c.createRadialGradient(-8,-9,3,0,0,r);const col=n.kind==='chefe'?['#ff9a8a','#8a1c1c']:n.kind==='vila'?['#9fe8a8','#2c6a3c']:['#ffe9a8','#8a6420'];
  gr.addColorStop(0,st==='locked'?'#6a6a78':col[0]);gr.addColorStop(1,st==='locked'?'#26262e':col[1]);c.fillStyle=gr;c.beginPath();c.arc(0,0,r,0,7);c.fill();c.shadowBlur=0;
  c.lineWidth=4;c.strokeStyle=st==='cleared'?'#ffd97a':st==='open'?'#fff2c0':'#4a4a58';c.stroke();
  c.fillStyle=st==='locked'?'#9a9aa8':'#fff';c.font="700 26px 'Yu Mincho','MS Mincho','Noto Serif JP',serif";c.textAlign='center';c.textBaseline='middle';c.fillText(NODE_GLYPH[id]||'?',0,2);
  if(st==='cleared'&&n.kind!=='vila'){c.fillStyle='#2c8a4c';c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(r*.72,-r*.72,10,0,7);c.fill();c.stroke();c.fillStyle='#fff';c.font='700 13px Georgia';c.fillText('✔',r*.72,-r*.72+1);}
  if(st==='locked'){c.font='16px serif';c.fillText('🔒',r*.72,-r*.72);}
  c.font='700 15px Georgia,serif';c.lineWidth=4;c.strokeStyle='rgba(0,0,0,.85)';c.fillStyle=st==='locked'?'#a8a8b8':'#fff6d8';c.strokeText(n.name,0,r+18);c.fillText(n.name,0,r+18);
  c.restore();}
 /* ficha da equipe no local atual (ou em movimento) */
 const tk=mapTok||{x:NODES[CAMP.at].x,y:NODES[CAMP.at].y};const bob=Math.sin(t*4)*2;
 c.save();c.translate(tk.x,tk.y-46+bob);c.shadowColor='#000';c.shadowBlur=8;c.fillStyle='#14102a';c.strokeStyle='#ffd97a';c.lineWidth=3;c.beginPath();c.arc(0,0,17,0,7);c.fill();c.stroke();c.shadowBlur=0;
 const pt=document.getElementById(mapHero==='sasuke'?'ptS':'ptN');if(pt){c.save();c.beginPath();c.arc(0,0,14,0,7);c.clip();c.imageSmoothingEnabled=false;c.drawImage(pt,-14,-14,28,28);c.restore();}
 c.fillStyle='#ffd97a';c.beginPath();c.moveTo(-6,16);c.lineTo(6,16);c.lineTo(0,25);c.fill();c.restore();
 mapRAF=requestAnimationFrame(mapDraw);}

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
  <div class="stats"><div><small>Vida</small><b>${Math.round(n.enc.hp*100)}%</b></div><div><small>Ataque</small><b>${Math.round(n.enc.atk*100)}%</b></div><div><small>XP</small><b>${n.xp}</b></div><div><small>Ryo</small><b>${n.ryo}</b></div></div>
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
 const vs=n.enc.vs&&n.enc.vs[hero];CAMP.active={node:id,hero,afin:n.enc.afin,hp:vs?vs[0]:n.enc.hp,atk:vs?vs[1]:n.enc.atk,name:n.enc.name};saveCamp();
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
