/* ---------- state ---------- */
let outcome=null,anim=null,frozen=null,hp={s:100,n:100},HPMAX={s:100,n:100},battleOn=false,ck={s:100,n:100},sound=true,pending=[];
function setBars(){{let ks=false,kn=false,rn=false;try{ks=kawS;kn=kawN;rn=roleN;}catch(e){}const eS=$('kawS'),eN=$('kawN');if(eS)eS.classList.toggle('on',!!ks&&!rn);if(eN)eN.classList.toggle('on',!!kn&&rn);}
 {const ps=Math.max(0,hp.s/HPMAX.s*100),pn=Math.max(0,hp.n/HPMAX.n*100);$('hpS').style.width=ps+'%';$('hpSg').style.width=ps+'%';$('hpN').style.width=pn+'%';$('hpNg').style.width=pn+'%';}$('ckS').style.width=ck.s+'%';$('ckN').style.width=ck.n+'%';
 $('hpSn').textContent=Math.round(hp.s)+' / '+HPMAX.s;$('hpNn').textContent=Math.round(hp.n)+' / '+HPMAX.n;$('ckSn').textContent=Math.round(ck.s);$('ckNn').textContent=Math.round(ck.n);
 let sb=null;try{sb=bunta;}catch(e){}$('sumRow').classList.toggle('on',!!sb);if(sb){$('smV').style.width=(100*sb.hp/sb.max)+'%';$('smN').textContent=Math.round(sb.hp)+' / '+sb.max;}}
function setHead(t){if(kyuT>0)t+=' · 🔥 KYŪBI '+kyuT;$('cmdhead').innerHTML=(menuOpen!=='main'?'<button class="back" id="cmdback">← Voltar <small>Esc</small></button>':'')+'<b>'+t+'</b><span>Vez do '+(roleN?NN():HN())+' · tecle o número</span>';const bk=$('cmdback');if(bk)bk.onclick=()=>showMenu('main');}
function later(ms,fn){pending.push(setTimeout(fn,ms))}
function banner(jp,nm,sb,col){const b=$('banner');b.style.setProperty('--bc',col);b.querySelector('.jp').textContent=jp;b.querySelector('.nm').textContent=nm;b.querySelector('.sb').textContent=sb;b.classList.remove('on');void b.offsetWidth;b.classList.add('on');}
function dmgPop(n,side){const d=$('dmg');d.style.left=((side==='S')!==roleN)?'16%':'70%';d.style.color='';d.textContent='-'+n;d.classList.remove('on');void d.offsetWidth;d.classList.add('on');}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),1800);}
function missPop(side){const d=$('dmg');d.style.left=((side==='S')!==roleN)?'16%':'70%';d.style.color='';d.textContent='ESQUIVOU!';d.classList.remove('on');void d.offsetWidth;d.classList.add('on');}

/* ---- equipamento na batalha: so o personagem que o jogador controla recebe os bonus ---- */
function sideChar(side){return side==='s'?heroS:((typeof roleN!=='undefined'&&roleN&&playSkin)?playSkin:'naruto');}
function NN(){return(typeof roleN!=='undefined'&&roleN&&playSkin)?({gozu:'Gozu',meizu:'Meizu'}[playSkin]):'Naruto';}
function HN(){return{sakura:'Sakura',kakashi:'Kakashi'}[heroS]||'Sasuke';}
function fightStats(side){const mine=roleN?'n':'s';if(side===mine)return statsOf(sideChar(side));const a=CAMP.active;return a?{hp:Math.round(100*(a.hp-1)),atk:a.atk-1,def:0,elem:{}}:{hp:0,atk:0,def:0,elem:{}};}
function dmgMod(att,def,elem){const a=fightStats(att),d=fightStats(def);return(1+a.atk)*(1+((a.elem||{})[elem]||0))*(1-d.def);}
/* recalcula a vida maxima; full = enche a vida, senao mantem a proporcao */
function syncHpMax(full){const o={s:HPMAX.s,n:HPMAX.n};HPMAX={s:100+fightStats('s').hp,n:100+fightStats('n').hp};
 if(full){hp={s:HPMAX.s,n:HPMAX.n};}else{hp.s=Math.min(HPMAX.s,Math.round(hp.s*HPMAX.s/o.s));hp.n=Math.min(HPMAX.n,Math.round(hp.n*HPMAX.n/o.n));}setBars();}
function consumables(){return Object.keys(ITEMS).filter(id=>ITEMS[id].slot==='cons'&&bagQty(id)>0);}
function useItem(side,id){const it=ITEMS[id];if(!it||bagQty(id)<1)return false;INV.bag[id]--;if(INV.bag[id]<=0)delete INV.bag[id];saveInv();
 const who=side==='s'?HN():NN(),m=[];if(it.use.hp){const h=Math.min(it.use.hp,HPMAX[side]-hp[side]);hp[side]+=h;m.push('+'+h+' de vida');}
 if(it.use.ck){const c=Math.min(it.use.ck,100-ck[side]);ck[side]+=c;m.push('+'+c+' de chakra');}toast(who+' usa '+it.name+' ('+m.join(', ')+')');return true;}
