/* ---------- state ---------- */
let outcome=null,anim=null,frozen=null,hp={s:100,n:100},ck={s:100,n:100},sound=true,pending=[];
function setBars(){{let ks=false,kn=false;try{ks=kawS;kn=kawN;}catch(e){}const eS=$('kawS'),eN=$('kawN');if(eS)eS.classList.toggle('on',!!ks);if(eN)eN.classList.toggle('on',!!kn);}
 $('hpS').style.width=hp.s+'%';$('hpSg').style.width=hp.s+'%';$('hpN').style.width=hp.n+'%';$('hpNg').style.width=hp.n+'%';$('ckS').style.width=ck.s+'%';$('ckN').style.width=ck.n+'%';
 $('hpSn').textContent=Math.round(hp.s)+' / 100';$('hpNn').textContent=Math.round(hp.n)+' / 100';$('ckSn').textContent=Math.round(ck.s);$('ckNn').textContent=Math.round(ck.n);
 let sb=null;try{sb=bunta;}catch(e){}$('sumRow').classList.toggle('on',!!sb);if(sb){$('smV').style.width=(100*sb.hp/sb.max)+'%';$('smN').textContent=Math.round(sb.hp)+' / '+sb.max;}}
function setHead(t){if(kyuT>0)t+=' · 🔥 KYŪBI '+kyuT;$('cmdhead').innerHTML='<b>▶ '+t+'</b><span>Vez do '+(roleN?'Naruto':'Sasuke')+' · tecle o número do comando</span>';}
function later(ms,fn){pending.push(setTimeout(fn,ms))}
function banner(jp,nm,sb,col){const b=$('banner');b.style.setProperty('--bc',col);b.querySelector('.jp').textContent=jp;b.querySelector('.nm').textContent=nm;b.querySelector('.sb').textContent=sb;b.classList.remove('on');void b.offsetWidth;b.classList.add('on');}
function dmgPop(n,side){const d=$('dmg');d.style.left=((side==='S')!==roleN)?'16%':'70%';d.textContent='-'+n;d.classList.remove('on');void d.offsetWidth;d.classList.add('on');}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),1800);}
function missPop(side){const d=$('dmg');d.style.left=((side==='S')!==roleN)?'16%':'70%';d.textContent='ESQUIVOU!';d.classList.remove('on');void d.offsetWidth;d.classList.add('on');}
