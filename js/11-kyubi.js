/* ===== Manto da Kyubi em pixel art (como no anime) =====
   O Naruto continua visivel por dentro, avermelhado. Por cima vai uma casca de chakra translucida que acompanha a silhueta
   do proprio sprite, com borda borbulhante (escura por fora, clara por dentro), duas orelhas de raposa e uma cauda grossa
   que sai do quadril e curva para cima. E gerado do alfa do sprite e guardado em cache: 4 quadros que se alternam. */
const KYU_HINT={four:{ears:[[52,9],[63,8]],tail:[14,20]},def:{ears:[[22,7],[34,6]],tail:[14,46],tailPts:[[0,0],[-10,-8],[-14,-24],[-8,-40],[4,-46]]}};
const kyuCache={};
function buildCloak(S,hint,fr){const P=34,W=S.w+P*2,H=S.h+P*2,cx=S.c.getContext('2d').getImageData(0,0,S.w,S.h).data;
 const body=new Uint8Array(W*H);for(let y=0;y<S.h;y++)for(let x=0;x<S.w;x++)if(cx[(y*S.w+x)*4+3]>0)body[(y+P)*W+x+P]=1;
 const cloak=new Uint8Array(W*H),tail=new Uint8Array(W*H);
 /* casca: tudo a ate ~3px do corpo, com o raio ondulando (bolhas que mudam a cada quadro) */
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const rr=3.2+1.4*Math.sin(x*.55+fr*1.57)*Math.sin(y*.47-fr*1.1)+.8*Math.sin((x+y)*.31+fr*2.1);let hit=0;
  for(let dy=-5;dy<=5&&!hit;dy++)for(let dx=-5;dx<=5;dx++){if(dx*dx+dy*dy>rr*rr)continue;if(body[(y+dy)*W+x+dx]){hit=1;break;}}if(hit)cloak[y*W+x]=1;}
 const stamp=(arr,px,py,r)=>{for(let y=Math.floor(py-r);y<=py+r;y++)for(let x=Math.floor(px-r);x<=px+r;x++){if(x<0||y<0||x>=W||y>=H)continue;const dx=x+.5-px,dy=y+.5-py;if(dx*dx+dy*dy<=r*r)arr[y*W+x]=1;}};
 /* orelhas de raposa: triangulos inclinados para tras saindo do topo da cabeca */
 for(const [ex,ey] of hint.ears){const bx=ex+P,by=ey+P;for(let t=0;t<=12;t++){const u=t/12,r=3.4*(1-u)+.6;stamp(cloak,bx-u*3.5,by-u*11,r);}}
 /* cauda: espinha que sai do quadril, sobe e faz a curva para a frente, grossa na base e fina na ponta, balancando */
 /* pontos de controle (coordenadas do sprite olhando para a direita): sai do quadril, sobe para tras e curva por cima das costas */
 const ctl=(hint.tailPts||[[0,0],[-12,-14],[-10,-32],[4,-40],[16,-34]]).map(([dx,dy],i)=>[hint.tail[0]+P+dx+(i>1?Math.sin(fr*1.57+i)*1.6:0),hint.tail[1]+P+dy+(i>1?Math.cos(fr*1.57+i)*1.2:0)]);
 const cr=(a,b,c,d,u)=>{const u2=u*u,u3=u2*u;return .5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u2+(-a+3*b-3*c+d)*u3);},sp=[];
 const pts=[ctl[0]].concat(ctl,[ctl[ctl.length-1]]);for(let s2=0;s2<pts.length-3;s2++)for(let i=0;i<12;i++){const u=i/12,px=cr(pts[s2][0],pts[s2+1][0],pts[s2+2][0],pts[s2+3][0],u),py=cr(pts[s2][1],pts[s2+1][1],pts[s2+2][1],pts[s2+3][1],u);sp.push([px,py]);}
 sp.forEach((q,i)=>q.push(9.5-7*(i/(sp.length-1))));
 /* a cauda e chakra, nao carne: entra na mesma casca translucida, com a borda borbulhando e bolhas se soltando */
 sp.forEach(([px,py,r],i)=>{const w=r*(1+.22*Math.sin(i*.9+fr*1.9)+.12*Math.sin(i*2.3-fr*2.7));stamp(cloak,px,py,w);stamp(tail,px,py,Math.max(1,w*.42));});
 for(let i=0;i<9;i++){const q=sp[Math.floor(((i*37+fr*11)%97)/97*(sp.length-1))],a=(i*2.4+fr*.8),d=q[2]+2+((i+fr)%4);stamp(cloak,q[0]+Math.cos(a)*d,q[1]+Math.sin(a)*d-((fr+i)%4)*1.5,1.2+((i*3+fr)%3)*.6);}
 for(let i=0;i<6;i++){const a=i*1.05+fr*.7,bx=W/2+Math.cos(a)*(W*.3),by=P+S.h*.5-((fr*3+i*7)%20)-S.h*.2;stamp(cloak,bx,by,1+(i%2));} /* bolhas soltas em volta do corpo */
 /* pinta: fill (translucido, por cima do corpo) e linhas (opacas) */
 const mk=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c;};const fill=mk(),line=mk(),fx=fill.getContext('2d'),lx=line.getContext('2d'),fd=fx.createImageData(W,H),ld=lx.createImageData(W,H);
 const put=(d,x,y,c,a)=>{const i=(y*W+x)*4;d.data[i]=c[0];d.data[i+1]=c[1];d.data[i+2]=c[2];d.data[i+3]=a;};
 const C_OUT=[110,10,4],C_RIM=[255,150,70],C_FILL=[240,70,24],C_T1=[150,22,8],C_T2=[226,58,20],C_T3=[255,120,50],C_T4=[255,196,140];
 const any=(arr,x,y)=>x>=0&&y>=0&&x<W&&y<H&&arr[y*W+x];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;
  if(!cloak[i])continue;
  const edge=!any(cloak,x-1,y)||!any(cloak,x+1,y)||!any(cloak,x,y-1)||!any(cloak,x,y+1);
  if(edge){put(ld,x,y,C_OUT,255);continue;}
  const rim=!any(cloak,x-2,y)||!any(cloak,x+2,y)||!any(cloak,x,y-2)||!any(cloak,x,y+2);
  if(rim&&!body[i]){put(ld,x,y,C_RIM,235);continue;}
  put(fd,x,y,C_FILL,255);
  if(tail[i]){const core=!any(tail,x,y-1)||!any(tail,x-1,y);put(ld,x,y,core?[255,224,180]:[255,140,64],core?200:130);}
  /* bolhas: pontinhos claros perto da borda */
  if(!body[i]&&((x*7+y*13+fr*5)%23===0))put(ld,x,y,[255,200,150],220);}
 for(let n=0;n<4;n++){const q=sp[Math.floor((n+1)/5*(sp.length-1))],r0=q[2]*.45;for(let a=0;a<5.2;a+=.35){const rr=r0*(a/5.2),x=Math.round(q[0]+Math.cos(a+fr+n)*rr),y=Math.round(q[1]+Math.sin(a+fr+n)*rr);if(x>=0&&y>=0&&x<W&&y<H&&cloak[y*W+x])put(ld,x,y,[150,24,8],160);}}
 fx.putImageData(fd,0,0);lx.putImageData(ld,0,0);return {fill,line,P,W,H,sp};}
function getCloak(key,fr){const k=key+':'+fr;if(kyuCache[k])return kyuCache[k];const S=SPRN[key];if(!S)return null;return kyuCache[k]=buildCloak(S,KYU_HINT[key]||KYU_HINT.def,fr);}
/* desenha o manto do sprite que o Naruto esta usando agora */
function kyuAura(g,x,y,time,k,front,dir,four,key){if(k<=0||!key)return;const fr=Math.floor(time*7)%4,C=getCloak(key,fr),S=SPRN[key];if(!C)return;
 g.save();g.imageSmoothingEnabled=false;g.translate(x,y);g.scale(dir>0?-1:1,1);
 if(front){g.globalAlpha=.42*Math.min(1,k);g.drawImage(C.fill,-S.ax-C.P,-S.ay-C.P);g.globalAlpha=Math.min(1,k);g.drawImage(C.line,-S.ax-C.P,-S.ay-C.P);
  /* brilho de chakra ao longo da cauda (no layer de efeitos, com bloom) */
  const M=g.getTransform();f.save();f.setTransform(M);f.globalCompositeOperation='lighter';C.sp.forEach(([px,py,r],i)=>{if(i%4)return;orb(f,px-S.ax-C.P,py-S.ay-C.P,r*2.2,[[0,`rgba(255,120,40,${.22*Math.min(1,k)})`],[1,'rgba(255,60,0,0)']]);});f.restore();}
 else{ /* aura escura atras e ondas na agua */
  g.globalAlpha=.25*Math.min(1,k);g.drawImage(C.fill,-S.ax-C.P,-S.ay-C.P);}
 g.restore();
 if(!front){g.save();g.strokeStyle='rgba(255,170,120,.6)';g.lineWidth=1;for(let i=0;i<3;i++){const rr=20+i*14+((time*8)%14);g.globalAlpha=Math.min(1,k)*.6*(1-rr/64);g.beginPath();g.ellipse(x,y+1,rr*1.4,rr*.25,0,0,TAU);g.stroke();}g.restore();}
 else{g.save();for(let i=0;i<16;i++){const r=R(i+2100),ph=(time*(.5+r()*.5)+r())%1,px=x+(r()-.5)*(four?64:34),py=y-6-ph*(four?56:76);g.globalAlpha=Math.min(1,k)*(1-ph)*.85;g.fillStyle=ph<.5?'#ffb070':'#ff6a2a';g.fillRect(Math.round(px),Math.round(py),2,2);}g.restore();}}
/* coracoezinhos em pixel saindo dela e, se o Sasuke cair na distracao, sangue do nariz */
function oirokeFX(f,t,time,nx0,sx0){
 for(let i=0;i<7;i++){const st=OIR_ON+.15+i*.17,a=t-st;if(a<0||a>1.1)continue;const x=Math.round(nx0-14+((i*7)%12)-a*8),y=Math.round(GY-50-a*26),al=1-a/1.1;
  f.fillStyle=`rgba(255,110,150,${al})`;for(const [dx,dy] of [[0,0],[2,0],[-1,1],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2],[2,2],[1,3]])f.fillRect(x+dx,y+dy,1,1);}
 if(anim&&anim.oirHit&&t>2.75&&t<4.1){const k=scaleAt(0,1,2.75,2.9,t);for(let i=0;i<5;i++){const ph=(time*1.4+i*.2)%1;f.fillStyle=`rgba(190,14,28,${k*(1-ph*.5)})`;f.fillRect(Math.round(sx0+6),Math.round(GY-55+ph*20),1,2);}
  f.fillStyle=`rgba(190,14,28,${k})`;f.fillRect(Math.round(sx0+6),GY-56,1,3);}}
/* ---- fatality do Rasengan: a camera vai para as costas do Sasuke e a esfera estoura as costas dele, abrindo um rombo ---- */
ANIMS.rasengan.LR={dur:10.6,koAt:10.0,bannerAt:9.0,speakAt:7.3,line:'Eu sou Naruto Uzumaki, tô certo!',mirror:null,burst:2.9,
 map:[[0,0],[2.2,2.2],[2.4,2.28],[5.4,3.6],[6.2,4.2],[99,97]],
 sP:ANIMS.rasengan.sP.filter(k=>k[0]<=2.15).concat([[2.2,S_HIT],[3.7,S_HIT],[4.05,S_STAG],[4.7,S_DOWN],[99,S_DOWN]]),
 sX:[[0,96],[3.7,96],[4.7,86],[99,86]],
 nP:ANIMS.rasengan.nP.filter(k=>k[0]<=2.15).concat([[2.2,N_RAS_HIT],[3.75,N_RAS_HIT],[4.4,N_READY],[5.4,N_VICT],[99,N_VICT]]),
 nX:ANIMS.rasengan.nX.filter(k=>k[0]<=2.1).concat([[3.75,130],[4.5,158],[99,158]]),
 cam:ANIMS.rasengan.cam.filter(k=>k[0]<=2.2).concat([[2.3,{z:1.9,cx:104,cy:130}],[2.9,{z:2.2,cx:98,cy:132}],[3.15,{z:1.8,cx:90,cy:128}],[3.6,{z:1.8,cx:100,cy:130}],[4.7,{z:1.7,cx:100,cy:136}],[5.1,{z:2.3,cx:156,cy:126}],[7.2,{z:2.5,cx:158,cy:124}],[7.9,{z:1.04,cx:192,cy:116}],[99,{z:1.04,cx:192,cy:116}]])};
ANIMS.bunshin={enemy:true,dur:5.2,hold:3.6,hitT:3.6,hits:[{t:1.9,dmg:6},{t:2.45,dmg:6},{t:3.0,dmg:6},{t:3.6,dmg:14}],cost:25,
  clones:[{x0:250,r0:2.65,h:3.0},{x0:218,r0:2.1,h:2.45},{x0:186,r0:1.5,h:1.9}],
  sP:[[0,READY],[.45,READY],[1.8,S_GUARD],[1.88,S_GUARD],[1.92,S_FLINCH],[2.15,S_GUARD],[2.43,S_GUARD],[2.47,S_FLINCH],[2.7,S_GUARD],[2.98,S_GUARD],[3.02,S_FLINCH],[3.3,S_GUARD],[3.58,S_GUARD],[3.62,S_HIT],[4.3,S_HIT],[4.6,S_STAG],[5.0,READY],[5.2,READY]],
  nP:[[0,N_READY],[.5,N_READY],[.65,N_SEAL],[1.0,N_SEAL],[1.15,N_READY],[3.0,N_READY],[3.15,N_COIL],[3.3,N_DASHP],[3.55,N_DASHP],[3.6,N_UPPER],[4.2,N_UPPER],[4.48,N_UPPER],[4.52,N_READY],[5.2,N_READY]],
  sX:[[0,96],[1.85,96],[1.95,90],[2.45,90],[2.5,82],[3.0,82],[3.05,74],[3.6,74],[3.65,74],[4.0,40],[4.4,44],[5.0,96]],sArc:[3.6,4.3,40],sSpin:[3.62,4.3,-1],
  tpN:[4.5],nX:[[0,288],[3.1,288],[3.25,270],[3.55,134],[4.2,134],[4.49,134],[4.51,288],[5.2,288]],nArc:[3.55,4.0,10],
  cam:[[0,{z:1.04,cx:192,cy:116}],[.5,{z:1.04,cx:192,cy:116}],[.9,{z:1.4,cx:262,cy:128}],[1.5,{z:1.3,cx:200,cy:128}],[1.9,{z:1.5,cx:120,cy:128}],[3.0,{z:1.4,cx:130,cy:128}],[3.6,{z:1.7,cx:112,cy:126}],[4.4,{z:1.3,cx:100,cy:128}],[5.0,{z:1.04,cx:192,cy:116}],[5.2,{z:1.04,cx:192,cy:116}]]};
function buildLethalE(A){if(A.sPL)return;if(A.LR){A.sPL=A.LR.sP;A.sXL=A.LR.sX;A.nPL=A.LR.nP;A.nXL=A.LR.nX;return;}const h=A.hitT,cut=k=>k[0]<=h+.4;
 A.sPL=A.sP.filter(cut).concat([[h+.9,S_STAG],[h+1.5,S_DOWN],[99,S_DOWN]]);
 A.sXL=A.sX.filter(cut).concat([[h+.9,50],[99,50]]);
 A.nPL=A.nP.filter(k=>k[0]<A.dur-1.0).concat([[A.dur-.4,N_VICT],[99,N_VICT]]);
 A.nXL=A.nX.filter(k=>k[0]<A.dur-1.0).concat([[A.dur-.3,288],[99,288]]);}
function cloneTX(c){return interp(ANIMS.bunshin.sX,c.h)+36;} /* cada clone para na frente do Sasuke, onde ele estiver */
function drawClones(t,time){const A=ANIMS.bunshin;A.clones.forEach((c,ci)=>{if(t<1.15||t>c.h+.28)return;const tx=cloneTX(c),st=ci%2?N_GUARD:N_READY;
 const xk=[[0,c.x0],[c.r0,c.x0],[c.r0+.12,c.x0+7],[c.h-.05,tx],[c.h+.4,tx]],pk=[[0,st],[c.r0-.12,st],[c.r0,N_COIL],[c.r0+.12,N_COIL],[c.r0+.2,N_DASHP],[c.h-.04,N_DASHP],[c.h,N_PUNCH],[c.h+.4,N_PUNCH]];
 const x=interp(xk,t),v=(interp(xk,t+.02)-interp(xk,t-.02))/.04;let P=evalPose(pk,t);P=gait(P,x,-1,v,1,time,t<c.r0-.1,c.x0*.1);blit(x,GY,true,NARUTO,P,time,{alpha:.97,vel:v});});}
function puffs(c,t){const A=ANIMS.bunshin;for(const cl of A.clones){puff(c,cl.x0,GY-26,t-1.15,cl.x0);const x=cloneTX(cl);puff(c,x,GY-26,t-(cl.h+.28),cl.h*7);}}
// ---------- Sasuke damage
function applyDamageS(kind,idx){const S_=WOUNDS.s,t0=performance.now()/1000;
 const add=w=>{w.t0=t0;S_.push(w);if(S_.length>70)S_.shift();},rs=()=>Math.floor(Math.random()*9999);
 const F=k=>add({k,part:'face',seed:rs(),r:1});
 const B=(part,u,v,r,drip)=>add({k:'blood',part,u,v,r,seed:rs(),drip:drip||0});
 const TE=(part,u,v,r,under,cloth)=>add({k:'tear',part,u,v,r,seed:rs(),under,cloth});
 const CU=(part,u,v,r,rot)=>add({k:'cut',part,u,v,r,rot,seed:rs()});
 const BR=(part,u,v,r)=>add({k:'bruise',part,u,v,r,seed:rs()});
 if(kind==='rasengan'){TE('torso',.4,.55,3.2,'#d9b090','#1d2760');for(let i=0;i<3;i++)CU('torso',.35+i*.1,.45,2.2,.5+i*.3);B('torso',.5,.5,2.8,1);BR('armF',.5,0,2.4);B('armF',.6,0,1.2,1);TE('armF',.45,0,2,'#d9b090','#1d2760');F('eyeBruise');F('nose');F('lip');F('cheekCut');}
 else if(kind==='bunshin'){if(idx===0){F('lip');BR('torso',.35,.5,2.6);}else if(idx===1){F('cheekCut');BR('armF',.5,0,2.4);CU('armF',.4,0,2,.4);}else if(idx===2){F('eyeBruise');B('torso',.55,.45,2,1);TE('torso',.6,.5,2.2,'#d9b090','#1d2760');}else{F('nose');F('brow');B('torso',.45,.5,3,1);CU('torso',.5,.4,2.6,-.4);BR('legF',.4,0,2.4);}}}
function showKO(w){const k=$('ko');k.querySelector('span').textContent=w==='N'?'NARUTO VENCEU':'SASUKE VENCEU';k.classList.remove('on');void k.offsetWidth;k.classList.add('on');}
let turnLock=false;
function afterAnim(was){if(!was)return;
 if(was.chainKill&&bunta&&!outcome){turnLock=true;setCommands(false);setTimeout(()=>{if(!outcome&&!anim)enemyTurn('teppodama');},400);return;}
 if(was.enemy&&bunta&&!outcome&&was.type!=='teppodama'&&was.type!=='kuchiyose'){turnLock=true;setCommands(false);setTimeout(()=>{if(!outcome&&!anim)enemyTurn('teppodama');},500);return;}
 if(was.enemy){if(seal2T>0){seal2T--;hp.s=Math.max(1,hp.s-3);ck.s=Math.min(100,ck.s+15);if(!seal2T)toast('A transformação se desfaz');}else if(sealT>0){sealT--;hp.s=Math.max(1,hp.s-2);ck.s=Math.min(100,ck.s+10);if(!sealT)toast('O selo amaldiçoado se acalma');}ck.s=Math.min(100,ck.s+15);ck.n=Math.min(100,ck.n+15);setBars();endEnemyTurn();}
 else if(outcome){setCommands(false);}
 else if(roleN){turnLock=false;if(stunN){stunN=false;immN=true;toast('Naruto está preso na ilusão e perde o turno');turnLock=true;setCommands(false);setTimeout(()=>{if(!outcome&&!anim)aiSasuke();},1300);}else{showMenu('main');setCommands(true);}}
 else{setCommands(false);setTimeout(()=>{if(!outcome&&!anim)enemyTurn();},1000);}}
function skipEnemy(msg){toast(msg);if(seal2T>0){seal2T--;hp.s=Math.max(1,hp.s-3);ck.s=Math.min(100,ck.s+15);if(!seal2T)toast('A transformação se desfaz');}else if(sealT>0){sealT--;hp.s=Math.max(1,hp.s-2);ck.s=Math.min(100,ck.s+10);if(!sealT)toast('O selo amaldiçoado se acalma');}ck.n=Math.min(100,ck.n+15);ck.s=Math.min(100,ck.s+10);setBars();if(roleN)turnLock=true;endEnemyTurn();}
/* modo "jogar como Naruto": a tela e espelhada (Naruto a esquerda), o jogador escolhe os jutsus do Naruto e o Sasuke e jogado pela IA */
let rasKyu=false;const RAS_KYU_TXT={line:'GRRRAAAAAAH!!!',banner:['九尾螺旋丸','FATALITY','Rasengan da Kyūbi','#ff3a14']};
let roleN=false,gdN=false,rasKill=false,uzKill=false,kmKill=false,tpKill=false,stunS=0,immN=false,immS=false,toadUsed=false,kawS=false,kawN=false,kawUseS=0,kawUseN=0;try{roleN=localStorage.getItem('playNaruto')==='1';}catch(e){}
document.body.classList.toggle('roleN',roleN);
function showNarutoMenu(){menuOpen='main';const h=$('hand');h.innerHTML='';setHead(bunta?'COMANDOS · GAMA BUNTA EM CAMPO':'JUTSUS DO NARUTO');
 const add=(name,desc,col,k,cost,fn,ok)=>{const b=document.createElement('button');b.className='cmd';b.style.setProperty('--cc',col);b._ok=ok||null;b.innerHTML=`<span class="ic">${h.children.length+1}</span><span class="tx"><b>${name}</b><small>${desc}</small></span>`+(cost!=null?`<span class="cost">${cost}<em>CK</em></span>`:'<span></span>');b.onclick=fn;b._cost=cost;h.appendChild(b);};
 if(bunta){
  add('Kunai','Arremessa um kunai de cima do sapo (3 de dano).','#b8c4d8',1,null,()=>enemyTurn('nkunai'));
  add('Shuriken','Três shurikens de cima do sapo (6 de dano).','#9fb0c8',2,null,()=>enemyTurn('nshuriken'));
  add('Defender','Corta o próximo dano pela metade e recupera chakra.','#8fb4ff',3,null,()=>idleActN('defend'));
  add('Concentrar','Recupera chakra.','#7fd4ff',4,null,()=>idleActN('charge'));
  setCommands(!anim&&!outcome&&!turnLock);return;}
 add(kyuT>0?'Rasengan da Kyūbi':'Rasengan',kyuT>0?'Rasengan vermelho com o chakra da raposa (+35%).':'Esfera giratória no Sasuke (30 de dano).',kyuT>0?'#ff4a1a':'#6fb8ff',1,ANIMS.rasengan.cost,()=>enemyTurn('rasengan'),()=>!bunta);
 add('Kage Bunshin','Clones das sombras atacam em sequência.','#ffa43a',2,ANIMS.bunshin.cost,()=>enemyTurn('bunshin'),()=>!bunta);
 add('Oiroke no Jutsu','Vira uma garota para distrair o Sasuke: ele pode perder o turno.','#ff8ab0',4,ANIMS.oiroke.cost,()=>enemyTurn('oiroke'),()=>!bunta);
 add('Harem no Jutsu','Várias garotas com clones: quase sempre o Sasuke perde o turno.','#ff6aa0',5,ANIMS.harem.cost,()=>enemyTurn('harem'),()=>!bunta);
 add('Kamikaze','Gira como um tornado com clones e atravessa o Sasuke.','#ffb347',6,ANIMS.kamikaze.cost,()=>enemyTurn('kamikaze'),()=>!bunta);
 add('Kuchiyose: Gama Bunta','Invoca o sapo chefe (uma vez por luta): ele absorve golpes e atira balas de água.','#e8703a',7,ANIMS.kuchiyose.cost,()=>enemyTurn('kuchiyose'),()=>!bunta&&!toadUsed);
 add('Chakra da Kyūbi',kyuUsed?'Já usado nesta luta.':'Com a vida em 50 ou menos: 3 turnos de cura (+8) e +35% de dano.','#ff4a1a',8,null,()=>enemyTurn('kyuubi'),()=>!bunta&&!kyuUsed&&kyuT<=0&&hp.n<=50);
 add('Uzumaki Rendan','Clones chutam o Sasuke para o alto e o Naruto desce com o calcanhar.','#ff7a2a',3,ANIMS.uzumaki.cost,()=>enemyTurn('uzumaki'),()=>!bunta);
 add('Defender','Corta o próximo dano pela metade e recupera chakra.','#8fb4ff',8,null,()=>idleActN('defend'));
 add('Concentrar','Recupera chakra.','#7fd4ff',9,null,()=>idleActN('charge'));
add('Kawarimi no Jutsu','Troca de lugar com um tronco: evita por completo o próximo golpe do Sasuke, sem que ele perceba (restam '+(KAWARIMI_MAX-kawUseN)+' de '+KAWARIMI_MAX+').','#c9b27a',10,KAWARIMI_COST,()=>idleActN('kawarimi'),()=>!bunta&&!kawN&&kawUseN<KAWARIMI_MAX);
 setCommands(!anim&&!outcome&&!turnLock);}
function idleActN(t){if(anim||outcome||turnLock)return;ensureAudio();turnLock=true;
 if(t==='kawarimi'){if(kawN||kawUseN>=KAWARIMI_MAX||ck.n<KAWARIMI_COST){turnLock=false;return;}ck.n=Math.max(0,ck.n-KAWARIMI_COST);kawN=true;kawUseN++;toast('Kawarimi preparado: o próximo golpe será evitado ('+(KAWARIMI_MAX-kawUseN)+' uso'+(KAWARIMI_MAX-kawUseN===1?'':'s')+' restante'+(KAWARIMI_MAX-kawUseN===1?'':'s')+')');}else if(t==='defend'){gdN=true;ck.n=Math.min(100,ck.n+10);toast('Naruto se defende: próximo dano cai pela metade');}else{ck.n=Math.min(100,ck.n+25);toast('Naruto concentra chakra');}
 setBars();setCommands(false);setTimeout(()=>{if(outcome||anim)return;if(bunta)enemyTurn('teppodama');else aiSasuke();},900);}
/* o Sasuke (IA): escolhe um golpe que consegue pagar; com a vida do Naruto baixa, vai no mais forte */
function aiSasuke(){if(outcome||anim)return;turnLock=false;
 const pool=ATKS.concat(SASUKE_JUTSUS).filter(cd=>cd.live&&ANIMS[cd.id]&&(!cd.show||cd.show())&&(!cd.ok||cd.ok())&&ck.s>=ANIMS[cd.id].cost);
 if(!kawS&&kawUseS<KAWARIMI_MAX&&ck.s>=KAWARIMI_COST&&hp.s<70&&Math.random()<(hp.s<45?.3:.12)){ck.s=Math.max(0,ck.s-KAWARIMI_COST);kawS=true;kawUseS++;setBars();toast('Sasuke se prepara...');turnLock=true;setTimeout(()=>{turnLock=false;showMenu('main');setCommands(true);},1100);return;}
 const eff=cd=>effDmg(cd,ANIMS[cd.id]),dmg=pool.filter(cd=>eff(cd)>0);
 if(!dmg.length||ck.s<12||Math.random()<.08){ck.s=Math.min(100,ck.s+25);setBars();toast('Sasuke concentra chakra');turnLock=true;setTimeout(()=>{turnLock=false;showMenu('main');setCommands(true);},1100);return;}
 let cd=null;
 /* com a vida do Naruto baixa, ou com o sapo em campo, vai no golpe mais forte (derruba o sapo logo) */
 if(hp.n<=40||bunta)cd=dmg.slice().sort((a,b)=>eff(b)-eff(a))[0];
 else{
  const s2=pool.find(c=>c.id==='selo2');if(s2&&seal2T<=0&&hp.s>55&&ck.s>=55&&Math.random()<.3)cd=s2;
  const gj=dmg.find(c=>c.id==='genjutsu');if(!cd&&gj&&!stunN&&!immN&&Math.random()<.45)cd=gj;
  if(!cd){const w=dmg.map(c=>[c,eff(c)/Math.max(5,ANIMS[c.id].cost)+.4]),sum=w.reduce((x,y)=>x+y[1],0);let r=Math.random()*sum;for(const [c,v] of w){r-=v;if(r<=0){cd=c;break;}}if(!cd)cd=w[0][0];}}
 play(cd);}
/* fim do turno do jogador (Naruto): no modo normal volta o menu, no modo Naruto passa a vez para o Sasuke */
function kyuTick(){if(kyuT<=0||outcome)return;const h=Math.min(KY_HEAL,100-hp.n);hp.n+=h;kyuT--;setBars();toast(kyuT>0?`Chakra da Kyūbi: +${h} de vida (${kyuT} turno${kyuT>1?'s':''})`:`Chakra da Kyūbi: +${h} de vida. O manto se apaga`);}
function endEnemyTurn(){kyuTick();if(stunS>0&&!outcome){stunS--;if(stunS===0)immS=true;const msg=stunS>0?'Sasuke perde o turno (ainda falta 1)':'Sasuke perde o turno';if(roleN){toast(msg);turnLock=false;showMenu('main');setCommands(true);}else{toast(msg);turnLock=true;setCommands(false);setTimeout(()=>{if(!outcome&&!anim)enemyTurn();},1300);}return;}
 immS=false;
 if(roleN){if(outcome){setCommands(false);return;}turnLock=true;setCommands(false);setTimeout(()=>{if(!outcome&&!anim)aiSasuke();},900);}else{turnLock=false;showMenu('main');setCommands(!outcome);}}
function enemyTurn(force){if(typeof force!=='string')force=null;if(outcome||anim)return;const isToad=force==='teppodama';if(!isToad&&stunN&&!roleN){stunN=false;immN=true;skipEnemy('Naruto está preso na ilusão e perde o turno');return;}if(!isToad&&((sealT>0&&Math.random()<.3)||(seal2T>0&&Math.random()<.4))){skipEnemy('Sasuke desvia com a velocidade do selo!');return;} if(!isToad)immN=false; const type=force||(!bunta&&!kyuUsed&&hp.n<=40?'kyuubi':null)||(bunta?(Math.random()<.5?'nkunai':'nshuriken'):null)||(()=>{if(!roleN&&!kawN&&kawUseN<KAWARIMI_MAX&&ck.n>=KAWARIMI_COST&&hp.n<80&&Math.random()<(hp.n<50?.3:.12))return'nkawarimi';const r=Math.random();const pick=r<.26?'rasengan':r<.48?'bunshin':r<.66?'uzumaki':r<.8?'kamikaze':r<.9?'kuchiyose':r<.96?'oiroke':'harem';let p=pick;if(p==='kuchiyose'&&(bunta||toadUsed))p='rasengan';if((p==='oiroke'||p==='harem')&&(stunS>0||immS))p='rasengan';
  if(!roleN&&ANIMS[p].cost>ck.n){const ok=['rasengan','bunshin','uzumaki','kamikaze'].concat((bunta||toadUsed)?[]:['kuchiyose']).concat((stunS>0||immS)?[]:['oiroke','harem']).filter(k=>ANIMS[k].cost<=ck.n);p=(ok.length&&Math.random()<.75)?ok[Math.floor(Math.random()*ok.length)]:'concentrate';}
  return p;})();
 if(type==='concentrate'){ck.n=Math.min(100,ck.n+10);skipEnemy('Naruto concentra chakra');return;}
 if(type==='nkawarimi'){ck.n=Math.max(0,ck.n-KAWARIMI_COST);kawN=true;kawUseN++;skipEnemy('Naruto se prepara...');return;} /* em segredo: nada indica que e o Kawarimi */
 const A=ANIMS[type];if(roleN&&!isToad){if(turnLock||ck.n<A.cost){if(!turnLock)toast('Chakra insuficiente para '+(type==='rasengan'?'o Rasengan':'o Kage Bunshin'));return;}turnLock=true;}if(type==='rasengan'||type==='bunshin')lastEnemy=type;ensureAudio();
 const gm=(guard?.5:1)*(kyuT>0&&!isToad?KY_POW:1);guard=false;const dodge=kawS&&A.hits.some(h=>h.dmg>0);if(dodge)kawS=false;let dm=dodge?(h=>0):(h=>Math.max(1,Math.round(h.dmg*gm)));
 /* golpe final com o sapo em campo (ou na propria invocacao): quem mata e sempre o Gama Bunta, para o fatality dele acontecer */
 let chainKill=false;if((type==='kuchiyose'||type==='nkunai'||type==='nshuriken')&&hp.s-A.hits.reduce((a,h)=>a+dm(h),0)<=0){chainKill=true;let left=hp.s-1;const d0=dm;dm=h=>{const v=Math.min(d0(h),Math.max(0,left));left-=v;return v;};}
 const dmv=A.hits.map(h=>dm(h)),total=dmv.reduce((a,v)=>a+v,0),lethal=!chainKill&&hp.s-total<=0;
 const isLR=lethal&&A.LR;if(type==='rasengan')rasKyu=!!(isLR&&kyuT>0);const LRc=(type==='rasengan'&&rasKyu)?Object.assign({},A.LR||{},RAS_KYU_TXT):A.LR;if(isLR){if(type==='rasengan')rasKill=true;if(type==='uzumaki')uzKill=true;if(type==='kamikaze')kmKill=true;if(type==='teppodama')tpKill=true;}
 anim={type,t0:performance.now(),dur:isLR?A.LR.dur:A.dur+HS,lethal,enemy:true,chainKill,dodge:dodge?mkDodge('S',A):null};if(isLR){later(LRc.speakAt*1000,()=>speak(LRc.line,LRc.speechPos||['44%','14%']));later(LRc.bannerAt*1000,()=>banner(...(LRc.banner||['螺旋丸','FATALITY','Rasengan','#7fd4ff'])));sfxFatal();}setCommands(false);ck.n=Math.max(0,ck.n-A.cost);setBars();sfx(type);
 if(type==='kyuubi'){kyuUsed=true;later(500,()=>speak('Grrrraaaah!!',[roleN?'40%':'58%','14%']));later(KY_ON*1000,()=>{kyuT=KY_TURNS;banner('九尾','CHAKRA DA KYŪBI','Manto da Raposa: cura e força','#ff4a1a');setBars();});}
 if(type==='kuchiyose'){toadUsed=true;later(KU_IN*1000,()=>{bunta={hp:40,max:40};setBars();});}
 if(type==='teppodama')later(TP_FIRE*1000-300,()=>speak('Teppōdama!',[roleN?'24%':'52%','10%']));
 if(type==='kuchiyose'){later(1150,()=>speak('Kuchiyose no Jutsu!',[roleN?'40%':'56%','16%']));later(1650,()=>banner('口寄せの術','KUCHIYOSE NO JUTSU','Invocação: Gama Bunta','#e8703a'));later(2150,()=>speak('Quem me chamou, moleque?!',[roleN?'24%':'52%','10%']));later(2650,()=>speak('Suiton: Teppōdama!',[roleN?'28%':'48%','10%']));}
 if(type==='kamikaze')later(700,()=>banner('うずまきナルト神風','UZUMAKI NARUTO KAMIKAZE','Tornado com clones','#ffb347'));
 if(type==='harem'){const hit=Math.random()<.9&&!(stunS>0||immS);anim.oirHit=hit;later(450,()=>speak('Harem no Jutsu!',[roleN?'40%':'58%','16%']));later(OIR_ON*1000+300,()=>speak('Sasuke-kuuun~ ♥♥♥',[roleN?'34%':'48%','14%']));
  later(3050,()=>{speak(hit?'!!!!!':'...isso é ridículo.',[roleN?'52%':'18%','14%']);if(hit){stunS=2;toast('Sasuke voou longe! Fica 2 turnos sem se mexer');}else toast('Não funcionou no Sasuke');});}
 else if(type==='oiroke'){const hit=Math.random()<.6&&!(stunS>0||immS);anim.oirHit=hit;later(450,()=>speak('Oiroke no Jutsu!',[roleN?'40%':'58%','16%']));later(OIR_ON*1000+250,()=>speak('Oi, Sasuke-kun~ ♥',[roleN?'38%':'52%','14%']));
  later(2850,()=>{speak(hit?'...!!':'Patético.',[roleN?'52%':'18%','14%']);if(hit){stunS=1;toast('Sasuke ficou sem reação e vai perder o próximo turno');}else toast('Não funcionou no Sasuke');});}
 else if(type==='uzumaki'){later(700,()=>banner('うずまきナルト連弾','UZUMAKI NARUTO RENDAN','Rajada Naruto Uzumaki','#ff7a2a'));['U!','ZU!','MA!','KI!'].forEach((w,i)=>later(UZK[i]*1000,()=>speak(w,[(roleN?62-i*3:30+i*3)+'%','44%'])));later((UZ_SLAM-.15)*1000,()=>speak('NARUTO UZUMAKI RENDAN!',[roleN?'52%':'22%','12%']));}
 else if(type==='rasengan')later(1500,()=>kyuT>0?banner('九尾螺旋丸','RASENGAN DA KYŪBI','Infundido com o chakra da raposa','#ff4a1a'):banner('螺旋丸','RASENGAN','Esfera Giratória','#7fd4ff'));else if(type==='bunshin')later(1100,()=>banner('影分身の術','KAGE BUNSHIN','Clones das Sombras','#ffa43a'));
 A.hits.forEach((h,i)=>later(h.t*1000,()=>{const v=dmv[i];hp.s=Math.max(0,hp.s-v);setBars();if(v>0)dmgPop(v,'S');if(!dodge)applyDamageS(type,i);}));
 if(dodge)later(anim.dodge.tb*1000,()=>{missPop('S');toast('Sasuke usou o Kawarimi e evitou o golpe!');sfxDodge();setBars();});
 if(lethal)later((isLR?A.LR.koAt:A.hits[A.hits.length-1].t+1.3)*1000,()=>{outcome='N';outcomeT=performance.now()/1000;showKO('N');setCommands(false);});}
const HS=.09;
const LR=type=>type==='rasengan'&&!!ANIMS.rasengan.LR&&((anim&&anim.lethal)||!!window.__LETHR);
/* golpe final de um jutsu do Naruto que tem fatality proprio (LR): Rasengan, Uzumaki Rendan */
const LE=type=>!!(type&&ANIMS[type]&&ANIMS[type].LR&&((anim&&anim.lethal)||window.__LETHE===type||(type==='rasengan'&&!!window.__LETHR)));
const LU=type=>type==='uzumaki'&&LE(type);
function warp(type,raw){if(LE(type))return mapGen(ANIMS[type].LR.map,raw);if(LC(type))return mapL(raw);if(LK(type))return mapK(raw);if(LA(type))return mapA(raw);if(LG(type))return mapGen(ANIMS[type].L.map,raw);const h=ANIMS[type].hold;if(raw<h)return raw;if(raw<h+HS)return h+(raw-h)*.06;return raw-HS*.94;}
const LC=type=>type==='chidori'&&!!ANIMS.chidori.L&&((anim&&anim.lethal)||!!window.__LETH);
function sasX(type,t){{const a_=ANIMS[type];if(LG(type)&&a_.L.sX)return interp(a_.L.sX,t);if(a_&&a_.sX)return interp(a_.sX,t);}if(LC(type)&&t>=2.55)return interp(ANIMS.chidori.L.sX,t);if(type==='chidori'){if(t<2.15)return 96;if(t<2.55){const k=(t-2.15)/.4;return 96+(246-96)*Math.pow(k,1.7);}if(t<3.15)return 246;return 96;}return 96;}
function sasY(type,t){if(LG(type)&&ANIMS[type].L.sYf)return ANIMS[type].L.sYf(t);if(!LG(type)&&ANIMS[type].sYf)return ANIMS[type].sYf(t);if(LG(type)){const q=ANIMS[type].L.sArc;if(q&&t>q[0]&&t<q[1])return -Math.sin((t-q[0])/(q[1]-q[0])*Math.PI)*q[2];return 0;}if(LC(type)&&t>3.0)return 0;{const a_=ANIMS[type];if(a_&&a_.sArc){const q=a_.sArc;if(t>q[0]&&t<q[1])return -Math.sin((t-q[0])/(q[1]-q[0])*Math.PI)*q[2];return 0;}}return 0;}
function sRotF(type,t){if(LG(type)){const q=ANIMS[type].L.sSpin;if(q&&t>q[0]&&t<q[1]){const k=(t-q[0])/(q[1]-q[0]),e=k*k*(3-2*k);return q[2]*TAU*e;}return 0;}if(LC(type)&&t>3.0)return 0;{const a_=ANIMS[type];if(a_&&a_.sSpin){const q=a_.sSpin;if(t>q[0]&&t<q[1]){const k=(t-q[0])/(q[1]-q[0]),e=k*k*(3-2*k);return q[2]*TAU*e;}return 0;}}if(type==='chidori'&&t>3.12&&t<3.56){const k=(t-3.12)/.44,e=k*k*(3-2*k);return -TAU*e;}return 0;}
function nY(type,t){if(LG(type))return ANIMS[type].L.nY?ANIMS[type].L.nY(t):0;if(ANIMS[type].nYf)return ANIMS[type].nYf(t);if(ANIMS[type].noLift)return 0;if(LC(type)||LK(type)||LA(type))return 0;{const a_=ANIMS[type];if(a_.enemy){const q=a_.nArc;if(q&&t>q[0]&&t<q[1])return -Math.sin((t-q[0])/(q[1]-q[0])*Math.PI)*q[2];return 0;}}const h=ANIMS[type].hitT;if(t>h&&t<h+.5){return -Math.sin((t-h)/.5*Math.PI)*(type==='chidori'?18:10);}return 0;}
function nRotF(type,t){if(LG(type))return ANIMS[type].L.nRot?ANIMS[type].L.nRot(t):0;if(ANIMS[type].nRotf)return ANIMS[type].nRotf(t);if(ANIMS[type].enemy||LC(type))return 0;const h=ANIMS[type].hitT;if(type==='chidori'&&t>h+.02&&t<h+.5){const k=(t-h-.02)/.48,e=k*k*(3-2*k);return (type==='chidori'?-1:1)*TAU*e;}return 0;}
/* Passos com o pe preso ao chao: durante o apoio o pe anda para tras na mesma velocidade do corpo (sem patinar);
   na passada ele sobe em arco e pousa na frente. Cada pouso gera uma ondulacao na agua. */
const STRIDE=18,STEPS=[],GSTATE=[{c:null},{c:null}];
const FOOTK=.85*BS;
function gait(P,x,face,v,ground,time,idle,ph0,gs){
 const o=Object.assign({},P),av=Math.abs(v),a0=clamp((av-4)/12,0,1),amt=a0*a0*(3-2*a0)*ground;
 const xs=x*face,pc=xs/(2*STRIDE),p=pc-Math.floor(pc);
 if(amt>0){
  const lift=av>120?7:5,foot=u=>{if(u<.5)return{x:(STRIDE/2-2*STRIDE*u)/FOOTK,y:0};const q=(u-.5)*2,e=q*q*(3-2*q);return{x:(-STRIDE/2+STRIDE*e)/FOOTK,y:Math.sin(Math.PI*q)*lift};};
  const f=foot(p),b=foot((p+.5)%1);
  o.ffx+=f.x*amt;o.fbx+=b.x*amt;o.ffy-=f.y*amt;o.fby-=b.y*amt;
  o.crouch+=(Math.abs(Math.sin(2*Math.PI*p))*1.2+Math.max(f.y,b.y)*.08)*amt;   /* corpo desce no contato, sobe na passada */
  o.tilt+=(v*face>0?.07:-.05)*amt;
  if(gs&&ground){const c=Math.floor(xs/STRIDE);if(gs.c!==null&&c!==gs.c&&av>4){const isF=(((c%2)+2)%2)===0;STEPS.push({x:x+face*(STRIDE/2+(isF?P.ffx:P.fbx)*1.2),t:time,s:Math.min(1,av/160)});if(STEPS.length>40)STEPS.shift();}gs.c=c;}}
 else if(idle){const s=Math.sin(time*1.05+ph0);                       /* parado: so desloca o peso de um pe para o outro */
  o.fby-=Math.max(0,s)*.7;o.ffy-=Math.max(0,-s)*.7;o.crouch+=s*.25;o.tilt+=s*.012;
  const br=Math.sin(time*2.3+ph0*1.7),br2=Math.sin(time*2.3+ph0*1.7-.6);   /* respiracao: ombros e maos sobem, cabeca acompanha com atraso */
  o.hyF-=br2*.35;o.hyB-=br2*.3;o.hxF+=Math.sin(time*.8+ph0)*.25;o.hdy-=br*.22;o.hr+=Math.sin(time*.55+ph0*2)*.025;o.lean+=br*.12;if(gs)gs.c=null;}
 else if(gs)gs.c=null;
 return o;}
/* Fatality do Amaterasu: flocos de cinza saindo do corpo, monte de cinza na agua, e o olho sangrando do Sasuke. */
function ashFlakes(f,t,time,nx0,ny0,P){
 const rg=rigW(P),E=o=>[o.ex,o.ey],H=o=>[o.hx,o.hy],mid=[(rg.S[0]+rg.Hp[0])/2,(rg.S[1]+rg.Hp[1])/2];
 const pts=[[rg.C[0],rg.C[1]],rg.S,mid,rg.Hp,E(rg.hf),H(rg.hf),E(rg.hb),H(rg.hb),E(rg.lf),H(rg.lf),E(rg.lb),H(rg.lb)];
 const X=p=>nx0-p[0],Y=p=>GY+ny0+p[1];
 for(let i=0;i<110;i++){const r=R(500+i),tb=4.4+r()*1.7,age=t-tb;if(age<0||age>2.6)continue;const p=pts[i%pts.length],al=(1-age/2.6)*.9;
  const x=X(p)+(r()-.5)*5+(14+r()*20)*age,y=Y(p)+(r()-.5)*6-(8+r()*18)*age+5*age*age;
  f.fillStyle=r()<.22?`rgba(40,34,40,${al})`:r()<.3?`rgba(255,${90+(r()*80|0)},40,${al*.8})`:`rgba(${170+(r()*60|0)},${170+(r()*60|0)},${176+(r()*50|0)},${al})`;
  const s=.6+r()*1.1;f.fillRect(x,y,s,s*.8);}
}
/* o monte de cinza que sobra no lugar do corpo (cresce durante a dissolucao e fica) */
function ashPile(f,time,nx0,grow){
 if(grow<=0)return;const g=f.createRadialGradient(nx0,GY,1,nx0,GY,14);g.addColorStop(0,`rgba(120,118,126,${.9*grow})`);g.addColorStop(.6,`rgba(70,68,76,${.8*grow})`);g.addColorStop(1,'rgba(40,38,46,0)');
 f.fillStyle=g;f.beginPath();f.ellipse(nx0,GY+.5,15*grow,4.2*grow,0,0,TAU);f.fill();
 f.fillStyle=`rgba(160,158,166,${.55*grow})`;for(let i=0;i<14;i++){const r=R(900+i);f.fillRect(nx0+(r()-.5)*20*grow,GY-r()*3.2*grow,.9,.7);}
 for(let i=0;i<7;i++){const ph=((time*.25+i*.151)%1),r=R(950+i);f.fillStyle=`rgba(150,148,156,${(1-ph)*.55*grow})`;f.fillRect(nx0+(r()-.5)*10+ph*26,GY-2-ph*18,.8,.8);}
 f.fillStyle='rgba(255,90,30,.6)';for(let i=0;i<3;i++){const r=R(990+i);if(Math.sin(time*5+i*2)>0)f.fillRect(nx0+(r()-.5)*10,GY-1,.7,.6);}
}
/* o olho do Sasuke: brilho, lagrimas de sangue escorrendo entre os dedos e pingando */
function eyeBleedFX(f,t,time,sx0,sy0,rS){
 const ex=sx0+rS.C[0]+.5,ey=GY+sy0+rS.C[1]+.5,k=scaleAt(0,1,5.8,6.4,t),pu=.65+.35*Math.sin(time*5);
 f.globalCompositeOperation='lighter';orb(f,ex,ey,16*pu*k,[[0,'rgba(255,40,60,.9)'],[.4,'rgba(200,10,40,.4)'],[1,'rgba(120,0,20,0)']]);f.globalCompositeOperation='source-over';
 f.lineCap='round';
 for(let i=0;i<3;i++){const ph=((time*.35+i*.33)%1),x0=ex+(i-1)*.9,len=18+i*5;f.strokeStyle=`rgba(125,6,14,${.9*k})`;f.lineWidth=.9-i*.15;f.beginPath();f.moveTo(x0,ey+1);f.bezierCurveTo(x0+.8,ey+len*.3,x0-.6,ey+len*.6,x0+.2,ey+1+ph*len);f.stroke();
  f.fillStyle=`rgba(135,8,16,${.95*k})`;f.beginPath();f.ellipse(x0+.2,ey+1+ph*len+1,.7,1.2,0,0,TAU);f.fill();}
 for(let i=0;i<5;i++){const ph=((time*.8+i*.21)%1);f.fillStyle=`rgba(140,8,18,${(1-ph)*.9*k})`;f.beginPath();f.ellipse(ex+(i-2)*.9,ey+14+ph*ph*(GY-ey-18),.6,1,0,0,TAU);f.fill();}
}
/* Som do fatality do Amaterasu (segundos reais): chamas negras graves, tapas no corpo, cinzas, batimento e zumbido no olho. */
function sfxFatalA(){
 tone('sine',60,40,1.8,.4,2.0);nz(.6,'lowpass',900,100,.7,2.0);nz(7.5,'lowpass',500,260,.3,2.2);nz(6.5,'bandpass',200,500,.12,2.4);
 [2.7,3.0,3.5,3.9,4.4,4.8,5.3].forEach(a=>{nz(.12,'lowpass',900,200,.4,a);});
 [4.3,4.6,5.0,5.4,5.9,6.4].forEach(a=>nz(.5,'highpass',3500,7000,.08,a));
 nz(3.5,'highpass',2500,6000,.07,4.8);
 [7.6,8.4,9.2,10.0].forEach((a,i)=>{tone('sine',58,36,.22,.5,a);tone('sine',54,34,.22,.4,a+.28);});
 tone('sine',3300,3300,3.2,.02,7.6);
 [8.0,8.7,9.5].forEach(a=>tone('sine',420,150,.08,.1,a));}
/* Fatality do Katon: chamas por todo o corpo, brilho, faiscas e fumaca; depois vira cinza e brasa. */
function burnFX(f,t,time,fr,nx0,ny0,P){
 const rg=rigW(P),inten=scaleAt(0,1,2.45,2.95,t)*(1-.72*scaleAt(0,1,5.2,6.4,t));
 if(inten<=0)return;
 const X=p=>nx0-p[0],Y=p=>GY+ny0+p[1],mid=[(rg.S[0]+rg.Hp[0])/2,(rg.S[1]+rg.Hp[1])/2];
 const pts=[[[rg.C[0],rg.C[1]-5],7,2.2],[rg.S,13,4],[mid,14,4.5],[rg.Hp,12,4],[[rg.hf.ex,rg.hf.ey],10,2.8],[[rg.hf.hx,rg.hf.hy],9,2.6],[[rg.hb.ex,rg.hb.ey],10,2.8],[[rg.hb.hx,rg.hb.hy],9,2.6],[[rg.lf.ex,rg.lf.ey],11,3.4],[[rg.lf.hx,rg.lf.hy],9,3],[[rg.lb.ex,rg.lb.ey],11,3.4],[[rg.lb.hx,rg.lb.hy],9,3]];
 pts.forEach((q,i)=>{const h=q[1]*(.8+.4*Math.sin(fr*.5+i*1.7))*inten*(1+.3*(P.scream||0)),w=q[2]*inten;flame(f,X(q[0])+Math.sin(fr*.35+i)*1.2,Y(q[0])+2,h,w,fr*.4+i*1.3);});
 f.globalCompositeOperation='lighter';
 orb(f,nx0,GY+ny0-30,46*inten,[[0,`rgba(255,140,40,${.26*inten})`],[1,'rgba(255,60,0,0)']]);
 for(let i=0;i<30;i++){const ph=((time*.9+i*.173)%1),x=nx0+Math.sin(i*7.1)*12+Math.sin(time*2+i)*5,y=GY+ny0-8-ph*72;f.fillStyle=`rgba(255,${130+i*3},40,${(1-ph)*inten})`;f.fillRect(x,y,.7,.7);}
 f.globalCompositeOperation='source-over';
 for(let i=0;i<6;i++){const ph=((time*.35+i*.19)%1);smoke(f,nx0+Math.sin(time+i*2)*6+(i-3)*3,GY+ny0-55-ph*70,10+ph*22,.5*(1-ph)*Math.min(1,inten*1.6));}
}
/* depois da luta: o corpo carbonizado solta fumaca e brasas */
function ashFX(f,time,fr,nx0){
 for(let i=0;i<4;i++){const ph=((time*.18+i*.27)%1);smoke(f,nx0-2+Math.sin(time*.8+i*2)*4,GY-24-ph*46,8+ph*16,.32*(1-ph));}
 f.globalCompositeOperation='lighter';for(let i=0;i<8;i++){const ph=((time*.4+i*.131)%1);f.fillStyle=`rgba(255,${110+i*10},40,${(1-ph)*.7})`;f.fillRect(nx0-8+Math.sin(i*5.3)*12,GY-6-ph*30,.7,.7);}f.globalCompositeOperation='source-over';}
/* rachaduras incandescentes na pele carbonizada, desenhadas dentro do sprite */
function charCracks(sc,P,amt,time){
 const rg=rigW(P),rn=R(91),E=o=>[o.ex,o.ey],H=o=>[o.hx,o.hy];
 const segs=[[rg.S,rg.Hp],[rg.hip,E(rg.lf)],[E(rg.lf),H(rg.lf)],[rg.hip,E(rg.lb)],[E(rg.lb),H(rg.lb)],[rg.shF,E(rg.hf)],[E(rg.hf),H(rg.hf)],[rg.shB,E(rg.hb)],[E(rg.hb),H(rg.hb)],[rg.C,[rg.C[0],rg.C[1]+5]]];
 sc.save();sc.setTransform(1,0,0,1,0,0);sc.globalCompositeOperation='source-atop';sc.lineCap='round';sc.lineJoin='round';
 segs.forEach((s,si)=>{const n=si===0?9:5;for(let k=0;k<n;k++){const u=rn(),px=s[0][0]+(s[1][0]-s[0][0])*u,py=s[0][1]+(s[1][1]-s[0][1])*u,L=1.2+rn()*2.6;let x=px+(rn()-.5)*3,y=py+(rn()-.5)*3,a=rn()*TAU;
  const al=amt*(.5+.5*Math.sin(time*(4+k)+si*2+k));sc.strokeStyle=`rgba(255,${70+(rn()*70|0)},20,${al*.9})`;sc.lineWidth=(.35+rn()*.35)*SR;
  sc.beginPath();sc.moveTo((OXU+x)*SR,(OYU+y)*SR);for(let j=0;j<4;j++){a+=(rn()-.5)*1.6;x+=Math.cos(a)*L*.5;y+=Math.sin(a)*L*.5;sc.lineTo((OXU+x)*SR,(OYU+y)*SR);}sc.stroke();}});
 sc.restore();}
/* Som do fatality do Katon (segundos reais): explosao, rugido do fogo, grito, estalos, queda. */
function sfxFatalK(){
 nz(.45,'lowpass',2200,150,.85,2.4);tone('sine',120,30,1.3,.8,2.42);nz(1.6,'bandpass',500,2600,.42,2.4);
 nz(5.2,'lowpass',950,500,.26,2.55);
 [2.9,3.1,3.35,3.6,3.9,4.2,4.5,4.9,5.3,5.8,6.2].forEach(a=>nz(.06,'highpass',3000,7000,.3,a));
 nz(2.6,'bandpass',700,1800,.18,2.6);nz(2.8,'bandpass',900,1400,.14,5.0);nz(2.2,'highpass',2500,5000,.07,3.0);
 tone('sine',90,32,.5,.7,7.9);nz(.5,'lowpass',1500,150,.6,7.9);nz(1.6,'highpass',4000,7000,.1,8.0);}
/* Efeitos de "lente" do fatality(em pixels da tela): linhas de velocidade, vinheta de batimento e sangue escorrendo na camera. */
function fatalLens(g,raw,t,time,ccx,ccy,z,nx0){
 const sxp=x=>(x-ccx)*K*z+PW/2,syp=y=>(y-ccy)*K*z+PH/2,a=raw-2.58;
 if(a>=0&&a<.5){const cx=sxp(nx0-6),cy=syp(GY-42),r2=R(77);g.save();g.lineCap='round';
  for(let i=0;i<46;i++){const an=r2()*TAU,r0=70+r2()*120+a*500,r1=r0+120+r2()*380;g.strokeStyle=`rgba(255,255,255,${(1-a/.5)*(.35+r2()*.5)})`;g.lineWidth=1+r2()*3.4;g.beginPath();g.moveTo(cx+Math.cos(an)*r0,cy+Math.sin(an)*r0);g.lineTo(cx+Math.cos(an)*r1,cy+Math.sin(an)*r1);g.stroke();}g.restore();}
 const hv=scaleAt(0,1,2.7,3.2,raw)*(1-scaleAt(0,1,6.3,7.4,raw));
 if(hv>0){const pulse=.5+.5*Math.pow(Math.max(0,Math.sin(raw*5.2)),4),vg=g.createRadialGradient(PW/2,PH/2,PH*.3,PW/2,PH/2,PW*.65);vg.addColorStop(0,'rgba(90,0,8,0)');vg.addColorStop(1,`rgba(110,0,10,${.6*hv*pulse+.12*hv})`);g.fillStyle=vg;g.fillRect(0,0,PW,PH);}
 const SPL=[[2.6,.18,.2,60,1],[2.62,.8,.3,46,2],[2.7,.5,.12,34,3],[3.0,.9,.78,40,4],[5.26,.3,.25,70,5],[5.28,.72,.16,56,6],[5.34,.2,.8,64,7],[5.45,.1,.55,44,8],[5.6,.85,.5,38,9],[5.78,.4,.85,30,10]];
 const fade=1-scaleAt(0,1,9.2,10.4,raw);if(fade<=0)return;
 for(const s of SPL){const age=raw-s[0];if(age<0)continue;const x=s[1]*PW,y=s[2]*PH+age*s[3]*.4*Math.min(1,age),sz=s[3]*(.55+Math.min(1,age*5)*.45);
  const len=Math.min(age*s[3]*.9,s[3]*2.2);g.save();g.lineCap='round';g.strokeStyle=`rgba(104,4,12,${fade*.8})`;g.lineWidth=sz*.2;g.beginPath();g.moveTo(x,y);g.lineTo(x,y+len);g.stroke();
  g.globalAlpha=fade*.88;g.translate(x,y);g.fillStyle='rgb(112,5,13)';blobPath(g,sz,s[4],.3);g.fill();g.fillStyle='rgba(165,15,24,.55)';g.translate(-sz*.12,-sz*.14);blobPath(g,sz*.45,s[4]+1,.3);g.fill();g.restore();}
}
/* Efeitos do golpe final do Chidori: sangue na saida da mao, relampagos, braco sujo de sangue pingando e ferida escorrendo. */
function pierceFX(f,t,time,fr,nx0,sx0,sy0,rS,hw,ny0){
 const a=t-2.58,r2=R((fr>>1)*37+5),cx=nx0-1.5,cy=GY-40+ny0,fb=fr>>1;f.lineCap='round';
 if(t<3.6){ /* braco cravado: o Chidori crepita dentro do peito e a energia vaza pelo corpo todo */
  f.globalCompositeOperation='lighter';
  const gl=.55+.25*Math.sin(time*40);orb(f,cx,cy,19,[[0,`rgba(190,240,255,${gl*.4})`],[.4,`rgba(90,170,255,${gl*.2})`],[1,'rgba(40,90,255,0)']]);
  const tg=[[nx0-2,GY-60+ny0],[nx0-15,GY-33+ny0],[nx0+9,GY-30+ny0],[nx0-7,GY-2],[nx0+6,GY-2],[nx0-11,GY-50+ny0],[nx0+8,GY-48+ny0]];
  let L=[];for(let i=0;i<tg.length;i++){if(((fb+i)%2)===0)continue;L.push(...jagLines(cx,cy,tg[i][0],tg[i][1],fb*17+i*5,5));}
  for(let i=0;i<2;i++)L.push(...boltLines(cx,cy,r2()*TAU,8+r2()*12,fb*31+i,true));drawBolts(f,L,.5);
  f.globalCompositeOperation='source-over';
  for(let k=0;k<4;k++){const ak=a-k*.3;if(ak>=0&&ak<.85){bloodSpray(f,nx0+7,cy,ak,11+k,k?12:24,1);bloodSpray(f,nx0-8,cy+1,ak,21+k,k?8:16,-1);}}}
 const rp=t-3.58;
 if(rp>=0&&rp<1.2){ /* arranque: explosao de sangue e energia quando o braco sai */
  bloodSpray(f,cx-3,cy,rp*1.4,41,46,-1);bloodSpray(f,cx-3,cy+2,rp*1.1,42,30,-1);bloodSpray(f,cx+5,cy,rp*1.2,43,34,1);
  if(rp<.35){f.globalCompositeOperation='lighter';const k=rp/.35;
   orb(f,cx,cy,50*(1-k*.6),[[0,`rgba(255,255,255,${.8*(1-k)})`],[.35,`rgba(150,225,255,${.5*(1-k)})`],[1,'rgba(60,120,255,0)']]);
   ringFX(f,cx,cy,8+60*(1-(1-k)*(1-k)),2*(1-k)+.2,`rgba(200,235,255,${1-k})`);
   let L=[];for(let i=0;i<9;i++)L.push(...boltLines(cx,cy,r2()*TAU,(12+r2()*30)*(1-k*.7),fb*13+i,true));drawBolts(f,L,1);f.globalCompositeOperation='source-over';}
  for(let i=0;i<30;i++){const r=R(300+i),vx=-(30+r()*130),vy=-(10+r()*100),x=cx-2+vx*rp,y=cy+vy*rp+150*rp*rp;if(y>GY+2||rp>1.0)continue;
   const q=r(),sz=q<.25?3:2;f.fillStyle=q<.3?'#4a0610':q<.55?'#8a0e1a':q<.8?'#c4202c':'#e8a090';f.fillRect(Math.floor(x),Math.floor(y),sz,sz-1);}}
 const pull=clamp((t-3.58)/.2,0,1);
 if(pull>0){ /* braco sujo de sangue, pingando */
  const el=[sx0+rS.hf.ex,GY+sy0+rS.hf.ey],ha=hw,mid=[el[0]+(ha[0]-el[0])*.3,el[1]+(ha[1]-el[1])*.3];
  f.globalAlpha=.72*pull;f.strokeStyle='rgba(96,4,12,1)';f.lineWidth=4;f.beginPath();f.moveTo(mid[0],mid[1]);f.lineTo(ha[0],ha[1]);f.stroke();
  f.strokeStyle='rgba(140,12,20,.8)';f.lineWidth=1.6;f.beginPath();f.moveTo(mid[0]+.4,mid[1]-.6);f.lineTo(ha[0]+.4,ha[1]-.6);f.stroke();
  f.fillStyle='rgba(110,6,14,1)';f.beginPath();f.arc(ha[0],ha[1],2.8,0,TAU);f.fill();f.globalAlpha=1;
  if(t<7.6){for(let i=0;i<6;i++){const ph=((t*1.5+i*.31)%1),x=ha[0]+(i-2.5)*.8,y=ha[1]+2+ph*ph*(GY-ha[1]-2);
    f.fillStyle=`rgba(150,10,20,${(1-ph*.6)*pull})`;f.beginPath();f.ellipse(x,y,.7*(1-ph*.3),1.1+ph*.9,0,0,TAU);f.fill();}
   const pr=Math.min(7,Math.max(0,(t-3.9)*3));if(pr>0){f.fillStyle='rgba(105,6,14,.7)';f.beginPath();f.ellipse(ha[0],GY+1.5,pr,pr*.24,0,0,TAU);f.fill();}}}
 if(t>3.6&&t<7.9){ /* buraco no peito: sangue escorrendo pela borda e poca crescendo */
  const k=clamp((t-3.6)/.3,0,1),wy=cy+5;
  /* sangue escorrendo da borda do buraco: filetes de largura e velocidade diferentes que serpenteiam e terminam numa gota */
  for(let i=0;i<6;i++){const sp=.35+((i*29)%7)/14,ph=((t*sp+i*.23)%1),x0=cx+(((i*53)%9)-4)*1.1,len=(GY-wy)*(.45+((i*17)%5)/9),yy=wy+ph*len,w=.5+((i*13)%4)*.28;
   f.strokeStyle=`rgba(${110+(i*11)%40},6,14,${.88*k})`;f.lineWidth=w;f.beginPath();f.moveTo(x0,wy-1);f.bezierCurveTo(x0+Math.sin(t*2+i)*.9,wy+ph*len*.35,x0-Math.sin(t*1.7+i*2)*.9,wy+ph*len*.7,x0+Math.sin(t+i)*.4,yy);f.stroke();
   f.fillStyle=`rgba(125,6,14,${.9*k})`;f.beginPath();f.ellipse(x0+Math.sin(t+i)*.4,yy+w,w*.9,w*1.5,0,0,TAU);f.fill();}
  const pr=Math.min(13,(t-3.8)*3.4);if(pr>0){f.fillStyle='rgba(110,6,14,.6)';f.beginPath();f.ellipse(nx0-3,GY+2,pr,pr*.24,0,0,TAU);f.fill();}}
}
/* Cabelo/faixa/jaqueta com inercia: uma mola segue a velocidade da cabeca, balanca ao parar e se acalma sozinha. */
const HAIR=[{t:null},{t:null}];
function hairStep(h,P,x,y,face,time){
 const hx=x*face+P.tilt*38+P.lean*1.4+P.hdx*1.4,hy=y+P.crouch*1.6+P.hdy*1.4;
 if(h.t===null||time<h.t||time-h.t>.1){h.ox=h.oy=h.vx=h.vy=0;h.t=time;h.x=hx;h.y=hy;P.hix=P.hiy=0;return;}
 const dt=time-h.t;
 if(dt>0){const vx=(hx-h.x)/dt/BS,vy=(hy-h.y)/dt/BS,tx=clamp(-vx*.035,-6,6),ty=clamp(-vy*.035,-4,4),n=4,s=dt/n;
  for(let i=0;i<n;i++){h.vx+=(150*(tx-h.ox)-9*h.vx)*s;h.vy+=(150*(ty-h.oy)-9*h.vy)*s;h.ox+=h.vx*s;h.oy+=h.vy*s;}
  h.t=time;h.x=hx;h.y=hy;}
 P.hix=clamp(h.ox,-7,7);P.hiy=clamp(h.oy,-5,5);}
function drawSteps(c,time){for(let i=STEPS.length-1;i>=0;i--){const s=STEPS[i],a=time-s.t;if(a<0||a>.7){if(a>.7||a<-1)STEPS.splice(i,1);continue;}const k=a/.7,r=2.5+k*(9+s.s*8);
  c.strokeStyle=`rgba(210,232,255,${(1-k)*(.35+s.s*.4)})`;c.lineWidth=.5;c.beginPath();c.ellipse(s.x,GY+1,r,r*.24,0,0,TAU);c.stroke();
  const rn=R(Math.round(s.t*1000)%9973);c.fillStyle=`rgba(225,240,255,${(1-k)*.7*s.s})`;
  for(let j=0;j<4;j++){const an=-Math.PI/2+(rn()-.5)*2.2,sp=14+rn()*22*s.s,px=s.x+Math.cos(an)*sp*a,py=GY+Math.sin(an)*sp*a+90*a*a;if(py>GY+1)continue;c.fillRect(px,py,.7,.7);}}}
let fxLights=[];
