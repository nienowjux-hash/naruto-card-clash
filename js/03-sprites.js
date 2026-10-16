/* ================== Sasuke em pixel art (sprites feitos a mao em pixel/) ==================
   Cada quadro da animacao continua sendo uma pose do esqueleto; aqui ela e trocada pelo sprite mais parecido.
   1 pixel do sprite = 1 unidade do mundo, e o sprite e desenhado sem suavizacao. */
let USE_SPR=typeof PixGrid==='function';
try{if(localStorage.getItem('sasukeSprites')==='0')USE_SPR=false;}catch(e){}
const SPR={};
/* Sharingan: mesma pose com a iris vermelha (selo nivel 1, genjutsu, copia...) */
const SHARI={E:'#b8101e',e:'#ff4636'};
if(USE_SPR){const mkS=(fn,pal,ax,ay)=>{const gr=fn(),c=document.createElement('canvas'),c2=document.createElement('canvas');gr.draw(c,pal,1);gr.draw(c2,Object.assign({},pal,SHARI),1);return{c,csh:c2,w:gr.w,h:gr.h,ax,ay};};
 SPR.idle=mkS(sasukeIdle,SAS2_PAL,27,75);if(typeof sasukeIdleB==='function'){const gb=sasukeIdleB(1),cb=document.createElement('canvas'),cs=document.createElement('canvas');gb.draw(cb,SAS2_PAL,1);gb.draw(cs,Object.assign({},SAS2_PAL,SHARI),1);SPR.idle.cb=cb;SPR.idle.cbsh=cs;} /* mesma paleta das outras poses: a bermuda nao pisca de cor ao trocar de sprite */SPR.guard=mkS(sasukeGuard,SAS2_PAL,27,75);SPR.punch=mkS(sasukePunch,SAS2_PAL,27,75);if(typeof sasukePunchWind==='function')SPR.pw=mkS(sasukePunchWind,SAS2_PAL,27,75);if(typeof sasukeEyeHand==='function')SPR.eh=mkS(sasukeEyeHand,SAS2_PAL,27,75);if(typeof sasukeKickWind==='function')SPR.kw=mkS(sasukeKickWind,SAS2_PAL,27,75);
 SPR.hit=mkS(sasukeHit,SAS2_PAL,25,75);SPR.down=mkS(sasukeDown,SAS2_PAL,40,45);SPR.kick=mkS(sasukeKick,SAS2_PAL,22,75);
 SPR.seal=mkS(sasukeSeal,SAS2_PAL,27,75);SPR.chidori=mkS(sasukeChidori,SAS2_PAL,27,75);SPR.katon=mkS(sasukeKaton,SAS2_PAL,27,75);SPR.block=mkS(sasukeBlock,SAS2_PAL,27,75);SPR.log=mkS(sasukeLog,SAS2_PAL,28,70);}
const SPRL2={};if(USE_SPR&&typeof LV2_POSES!=='undefined'){for(const k in LV2_POSES){const gr=lv2From(LV2_POSES[k])(),c=document.createElement('canvas');gr.draw(c,LV2_PAL,1);const S0=SPR[k];SPRL2[k]={c,w:gr.w,h:gr.h,ax:S0?S0.ax:27,ay:S0?S0.ay:75};}}
const KYU_EYES={e:'#d81818',j:'#ff7a2a',E:'#2a0408'}; /* chakra da Kyuubi: olho vermelho e pupila em fenda */
const SPRN={};if(USE_SPR&&typeof naruGuard==='function'){const mkN=(fn,ax,ay)=>{const gr=fn(),c=document.createElement('canvas'),c2=document.createElement('canvas');gr.draw(c,NAR_PAL,1);gr.draw(c2,Object.assign({},NAR_PAL,KYU_EYES),1);return{c,csh:c2,w:gr.w,h:gr.h,ax,ay};};SPRN.guard=mkN(naruGuard,27,75);SPRN.punch=mkN(naruPunch,27,75);SPRN.hit=mkN(naruHit,25,75);SPRN.down=mkN(naruDown,40,45);SPRN.kick=mkN(naruKick,22,75);SPRN.seal=mkN(naruSeal,27,75);SPRN.block=mkN(naruBlock,27,75);if(typeof naruCharge==='function')SPRN.charge=mkN(naruCharge,27,75);if(typeof naruPunchWind!=='undefined'&&naruPunchWind)SPRN.pw=mkN(naruPunchWind,27,75);if(typeof naruSexy==='function')SPRN.sexy=mkN(naruSexy,27,75);if(typeof naruFours==='function')SPRN.four=mkN(naruFours,40,56);}
if(USE_SPR&&typeof breathOf==='function'){const mkB=(fn,pal,sh)=>{const gb=fn(),a=document.createElement('canvas'),b=document.createElement('canvas');gb.draw(a,pal,1);gb.draw(b,Object.assign({},pal,sh),1);return[a,b];};
 if(SPR.guard){const r=mkB(sasukeGuardB,SAS2_PAL,SHARI);SPR.guard.cb=r[0];SPR.guard.cbsh=r[1];}
 if(typeof SPRN!=='undefined'&&SPRN.guard&&typeof naruGuardB==='function'){const r=mkB(naruGuardB,NAR_PAL,KYU_EYES);SPRN.guard.cb=r[0];SPRN.guard.cbsh=r[1];}}
/* ciclo de corrida: 4 quadros por personagem; o quadro e escolhido pelo tempo (ver blitSprite) */
if(USE_SPR&&typeof sasukeRunFrame==='function'){const mk4=(fn,pal,sh)=>[0,1,2,3].map(i=>{const gr=fn(i),a=document.createElement('canvas'),b=document.createElement('canvas');gr.draw(a,pal,1);gr.draw(b,Object.assign({},pal,sh),1);return{c:a,csh:b};});
 const fs4=mk4(sasukeRunFrame,SAS2_PAL,SHARI);SPR.run={c:fs4[0].c,csh:fs4[0].csh,fr:fs4,w:56,h:80,ax:27,ay:75};
 if(typeof SPRN!=='undefined'&&SPRN.guard&&typeof naruRun0==='function'){const nf=mk4(i=>[naruRun0,naruRun1,naruRun2,naruRun3][i](),NAR_PAL,KYU_EYES);SPRN.run={c:nf[0].c,csh:nf[0].csh,fr:nf,w:56,h:80,ax:27,ay:75};}
 if(typeof lv2From==='function'&&typeof LV2_PAL!=='undefined'){const lf=[0,1,2,3].map(i=>{const gr=lv2From(()=>sasukeRunFrame(i))(),c=document.createElement('canvas');gr.draw(c,LV2_PAL,1);return{c,csh:c};});SPRL2.run={c:lf[0].c,fr:lf,w:56,h:80,ax:27,ay:75};}}
/* arremesso de kunai/shuriken: preparar (tw), lancar (tt) e terminar (te) */
if(USE_SPR&&typeof sasukeThrowFrame==='function'){const mkT=i=>{const gr=sasukeThrowFrame(i),a=document.createElement('canvas'),b=document.createElement('canvas');gr.draw(a,SAS2_PAL,1);gr.draw(b,Object.assign({},SAS2_PAL,SHARI),1);return{c:a,csh:b,w:56,h:80,ax:27,ay:75};};
 SPR.tw=mkT(0);SPR.tt=mkT(1);SPR.te=mkT(2);
 if(typeof lv2From==='function'&&typeof LV2_PAL!=='undefined')['tw','tt','te'].forEach((k,i)=>{const gr=lv2From(()=>sasukeThrowFrame(i))(),c=document.createElement('canvas');gr.draw(c,LV2_PAL,1);SPRL2[k]={c,w:56,h:80,ax:27,ay:75};});}
/* Sakura (Parte 1): mesmas poses do Sasuke com a cabeca/roupa dela; quem nao tem sprite proprio usa o do Sasuke. heroS diz quem joga no lado esquerdo */
let heroS=(typeof CAMP!=='undefined'&&CAMP.active&&(CAMP.active.hero==='sakura'||CAMP.active.hero==='kakashi'))?CAMP.active.hero:'sasuke';
/* conjunto de sprites de um heroi que usa as poses do Sasuke com cabeca/roupa propria; o que nao tem sprite proprio usa o do Sasuke */
function buildHeroSet(from,pal,fromSh){const S2={};if(!USE_SPR||typeof from!=='function')return S2;
 const mkK=(fn,ax,ay)=>{const gr=from(fn)(),c=document.createElement('canvas');gr.draw(c,pal,1);let c2=c;if(fromSh){c2=document.createElement('canvas');fromSh(fn)().draw(c2,pal,1);}return{c,csh:c2,w:gr.w,h:gr.h,ax,ay};};
 const defs={idle:[sasukeIdle,27,75],guard:[sasukeGuard,27,75],punch:[sasukePunch,27,75],hit:[sasukeHit,25,75],down:[sasukeDown,40,45],kick:[sasukeKick,22,75],seal:[sasukeSeal,27,75],chidori:[sasukeChidori,27,75],katon:[sasukeKaton,27,75],block:[sasukeBlock,27,75]};
 if(typeof sasukePunchWind==='function')defs.pw=[sasukePunchWind,27,75];if(typeof sasukeEyeHand==='function')defs.eh=[sasukeEyeHand,27,75];if(typeof sasukeKickWind==='function')defs.kw=[sasukeKickWind,27,75];
 for(const k in defs)S2[k]=mkK(...defs[k]);
 if(S2.idle&&typeof sasukeIdleB==='function'){const k=mkK(()=>sasukeIdleB(1),27,75);S2.idle.cb=k.c;S2.idle.cbsh=k.csh;}
 if(S2.guard&&typeof sasukeGuardB==='function'){const k=mkK(sasukeGuardB,27,75);S2.guard.cb=k.c;S2.guard.cbsh=k.csh;}
 if(typeof sasukeRunFrame==='function'){const fr=[0,1,2,3].map(i=>mkK(()=>sasukeRunFrame(i),27,75));S2.run={c:fr[0].c,csh:fr[0].csh,fr:fr,w:56,h:80,ax:27,ay:75};}
 if(typeof sasukeThrowFrame==='function')['tw','tt','te'].forEach((k,i)=>{S2[k]=mkK(()=>sasukeThrowFrame(i),27,75);});
 for(const k in SPR)if(!S2[k])S2[k]=SPR[k];return S2;}
const SPRK=typeof sakuraFrom==='function'?buildHeroSet(sakuraFrom,SAK_PAL):{},SPRKA=typeof kakashiFrom==='function'?buildHeroSet(kakashiFrom,KAK_PAL,fn=>kakashiFrom(fn,true)):{};
const SPRX=()=>heroS==='sakura'&&SPRK.guard?SPRK:heroS==='kakashi'&&SPRKA.guard?SPRKA:SPR;
/* Naruto de quatro (manto da Kyubi): quadros de agachar, galope e bote, escolhidos pela pose (fourKeyFor) */
if(USE_SPR&&SPRN.four&&typeof naruFourCoil==='function'){const mkF=fn=>{const gr=fn(),a=document.createElement('canvas'),b=document.createElement('canvas');gr.draw(a,NAR_PAL,1);gr.draw(b,Object.assign({},NAR_PAL,KYU_EYES),1);return{c:a,csh:b,w:gr.w,h:gr.h,ax:48,ay:56};};
 SPRN.fourCoil=mkF(naruFourCoil);SPRN.fourRunA=mkF(naruFourRunA);SPRN.fourRunB=mkF(naruFourRunB);SPRN.fourLunge=mkF(naruFourLunge);}
let FOUR_REF=null;
/* qual quadro de quatro usar: o Rasengan carrega agachado, corre em galope (2 quadros alternando) e golpeia em bote */
function fourKeyFor(P,time){if(!SPRN.fourCoil)return'four';
 if(!FOUR_REF){const L=[],add=(k,p)=>{if(p)L.push([k,p]);};add('four',N_READY);add('four',N_GUARD);add('four',N_SURP);add('four',N_HIT);add('four',N_STAG);add('four',N_HITB);add('fourCoil',N_COIL);add('fourCoil',N_RAS_WIND);add('fourRun',N_DASHP);add('fourRun',N_RAS_DASH);add('fourLunge',N_PUNCH);add('fourLunge',N_RAS_HIT);add('fourLunge',typeof N_UPPER!=='undefined'?N_UPPER:null);FOUR_REF=L;}
 const k=sprPick(P,FOUR_REF);return k==='fourRun'?(Math.floor(time*13)%2?'fourRunB':'fourRunA'):k;}
/* poses de referencia: cada pose do jogo cai no sprite cuja referencia estiver mais perto */
let SPR_REF=null;
function sprRefs(){if(SPR_REF)return SPR_REF;const L=[];const add=(k,...ps)=>ps.forEach(p=>{if(p)L.push([k,p]);});
 add('block',S_GUARD);add('katon',TIGER,INH,EXH);add('guard',READY,K_WIND,(SPR.tw?false:(typeof KT_W!=='undefined'&&KT_W)),typeof SH_W!=='undefined'&&SH_W,typeof GZ!=='undefined'&&GZ,typeof GZ2!=='undefined'&&GZ2,typeof SEL_B!=='undefined'&&SEL_B);
 add('idle',VICTORY,AMA_A,AMA_A2,typeof FLICK!=='undefined'&&FLICK,typeof SEL_S!=='undefined'&&SEL_S,typeof PN_S!=='undefined'&&PN_S,typeof PN_R!=='undefined'&&PN_R);
 if(SPR.eh)add('eh',AMA_CLUTCH,typeof AMA_CL2!=='undefined'&&AMA_CL2);
 add('seal',SEAL_A,SEAL_B,SEAL_C,SPR.eh?null:AMA_CLUTCH,typeof SEL_N!=='undefined'&&SEL_N,typeof SS_G!=='undefined'&&SS_G);
 add('chidori',PREP,CHARGE,COIL,typeof SEL_C!=='undefined'&&SEL_C,typeof RS_H!=='undefined'&&RS_H);
 if(SPR.pw)add('pw',PN_W);
 if(SPR.kw&&typeof CK_W!=='undefined')add('kw',CK_W);
 add('punch',DASH,HIT,typeof CH_PULL!=='undefined'&&CH_PULL,(SPR.run?false:(typeof PN_D!=='undefined'&&PN_D)),typeof PN_P!=='undefined'&&PN_P,(SPR.tw?false:(typeof KT_T!=='undefined'&&KT_T)),(SPR.tw?false:(typeof KT_F!=='undefined'&&KT_F)),typeof SS_T!=='undefined'&&SS_T,typeof SEL_D!=='undefined'&&SEL_D,typeof SEL_H!=='undefined'&&SEL_H,typeof RS_D!=='undefined'&&RS_D,typeof RS_P!=='undefined'&&RS_P,typeof SH_A!=='undefined'&&SH_A,typeof SH_TOP!=='undefined'&&SH_TOP);
 if(SPR.run&&typeof PN_D!=='undefined')add('run',PN_D);
 if(SPR.tw&&typeof KT_W!=='undefined'){add('tw',KT_W);add('tt',KT_T);add('te',KT_F);}
 add('kick',KICK,typeof CK_K!=='undefined'&&CK_K,typeof SH_UP!=='undefined'&&SH_UP,typeof SH_B!=='undefined'&&SH_B,typeof SH_HEEL!=='undefined'&&SH_HEEL);
 add('hit',S_HIT,S_FLINCH,S_STAG);add('guard',HOP);
 add('down',S_DOWN);
 return SPR_REF=L;}
let SPRN_REF=null;function sprRefsN(){if(SPRN_REF)return SPRN_REF;const L=[],add=(k,...ps)=>ps.forEach(p=>{if(p)L.push([k,p]);}),d=n=>typeof window[n]!=='undefined'?window[n]:null;
 add('guard',N_READY,N_GUARD,N_SURP,N_VICT,(typeof N_JUMP!=='undefined'?N_JUMP:null));add('block',(typeof N_GUARD!=='undefined'?N_GUARD:null));if(SPRN.pw)add('pw',N_COIL);else add('guard',N_COIL);add('seal',(typeof N_SEAL!=='undefined'?N_SEAL:null));add('charge',(typeof N_RAS_WIND!=='undefined'?N_RAS_WIND:null));if(SPRN.run)add('run',N_DASHP);add('punch',SPRN.run?null:N_DASHP,N_PUNCH,N_UPPER,(typeof N_RAS_DASH!=='undefined'?N_RAS_DASH:null),(typeof N_RAS_HIT!=='undefined'?N_RAS_HIT:null));add('kick',N_UPKICK);add('hit',N_HIT,N_STAG,N_HITB,N_BURN1,N_BURN2,(typeof N_AIR!=='undefined'?N_AIR:null),(typeof N_AIR2!=='undefined'?N_AIR2:null));add('down',N_DOWN);return SPRN_REF=L;}
const SPR_W={hxF:1,hyF:1,hxB:.6,hyB:.6,ffx:.9,ffy:1.4,fbx:.6,fby:1,crouch:1.2,lean:.8,tilt:30,hr:6};
let sprRefPose=null;
function sprPick(P,refs){let best='guard',bd=1e9;for(const [k,R0] of (refs||sprRefs())){let d=0;for(const q in SPR_W){const v=(P[q]||0)-(R0[q]||0);d+=SPR_W[q]*v*v;}if(d<bd){bd=d;best=k;sprRefPose=R0;}}return best;}
/* a diferenca entre a pose real e a pose do sprite escolhido vira um deslocamento em degraus de 1 pixel: tronco inclina (cisalhamento) e o corpo agacha/estica, assim o movimento fica continuo entre um sprite e outro */
function sprDraw(c,SB,S,P,R0,key,vf,sq){vf=vf||0;sq=sq||0;const dT=((P.tilt||0)-(R0&&R0.tilt||0)),dC=((P.crouch||0)-(R0&&R0.crouch||0)),dL=((P.lean||0)-(R0&&R0.lean||0));
 const av=Math.min(1,Math.abs(vf)/900),sh=key==='down'?0:Math.max(-.4,Math.min(.4,dT*.7+dL*.03+vf/900*.28-sq*.22)),sy=key==='down'?1:Math.max(.9,Math.min(1.08,1-dC*.014-av*.05-sq*.12)),sx=1+av*.14+sq*.1;
 if(Math.abs(sh)<.012&&Math.abs(sy-1)<.008&&av<.02&&sq<.02){c.drawImage(SB,0,0,S.w*4,S.h*4,-S.ax,-S.ay,S.w,S.h);return;}
 const hip=S.h*.6;for(let r=0;r<S.h;r++){const up=Math.max(0,hip-r),dx=Math.round(sh*up*(r<hip?1:0)*10)/10;c.drawImage(SB,0,r*4,S.w*4,4,(-S.ax)*sx+Math.round(sh*up),(r-S.ay)*sy,S.w*sx,sy+.03);}}

const sprTmp=document.createElement('canvas');sprTmp.width=96;sprTmp.height=96;const sprTx=sprTmp.getContext('2d',{willReadFrequently:true});
const sprBig=document.createElement('canvas');sprBig.width=384;sprBig.height=384;const sprBx=sprBig.getContext('2d');
function blitSprite(x,y,flip,P,time,o,isN){
 const key=(isN&&o.four&&SPRN.four)?((o.fourKey&&SPRN[o.fourKey])?o.fourKey:'four'):(isN&&o.sexy&&SPRN.sexy)?'sexy':sprPick(P,isN?sprRefsN():null),S=(isN?SPRN:(o.lv2px>0?(SPRL2[key]?SPRL2:(SPRL2.guard&&key==='idle'?{idle:SPRL2.guard}:SPR)):SPRX()))[key],al=o.alpha==null?1:o.alpha;
 sprTx.setTransform(1,0,0,1,0,0);sprTx.globalCompositeOperation='source-over';sprTx.clearRect(0,0,96,96);{const fr=(key==='run'&&S.fr)?S.fr[Math.floor(time*16+(isN?1:0))%4]:null,br=!fr&&(key==='idle'||key==='guard')&&S.cb&&Math.floor(time*1.15+(isN?.55:0))%2===1;sprTx.drawImage(fr?(o.sharingan&&fr.csh?fr.csh:fr.c):(o.sharingan&&S.csh?(br?S.cbsh:S.csh):(br?S.cb:S.c)),0,0);}
 sprTx.globalCompositeOperation='source-atop';
 if(o.light){const L=o.light;sprTx.globalAlpha=Math.min(.3,L.k*.25);sprTx.fillStyle=css(L.col,1,1);sprTx.fillRect(0,0,S.w,S.h);sprTx.globalAlpha=1;}
 if(o.tint){sprTx.fillStyle=css(o.tint,1,o.tk);sprTx.fillRect(0,0,S.w,S.h);}
 sprTx.globalCompositeOperation='source-over';
 /* efeitos especiais em pixel art, aplicados direto nos pixels do sprite */
 if(o.cracks>0||o.curse>0||o.hole||o.dissolve>0||P.torn||o.bleed>.04||P.hr<-1.6||o.noArms){
  const id=sprTx.getImageData(0,0,S.w,S.h),d=id.data,W2=S.w,H2=S.h,down=key==='down',hsh=(a,b)=>((a*73856093)^(b*19349663))>>>0;
  const bl=o.bleed||0,bleedAt=(x,y)=>y>=26&&(hsh((x>>2)*7+3,(y>>2)*5+1)%1000)/1000<Math.min(.5,bl*.22)&&(hsh(x*3+1,y*11+5)%4)!==0; /* manchas de sangue em blocos (nao ruido pixel a pixel) e so do pescoco para baixo */
  const isSkin=i=>d[i]>200&&d[i+1]>130&&d[i+1]<215&&d[i+2]>80&&d[i+2]<190&&d[i]-d[i+2]>50;
  const cx=down?30:28,cy=down?38:37; /* centro do peito no sprite */
  /* bracos arrancados: segmentos ombro->cotovelo->mao da pose de referencia do sprite, cortados a ~35% do braco */
  let ARMS=null;if(o.noArms){const rg=rigW(sprRefPose||P);ARMS=[[rg.shB,rg.hb],[rg.shF,rg.hf]].map(([s0,h0])=>{const sx=S.ax+s0[0],sy=S.ay+s0[1],ex=S.ax+h0.ex,ey=S.ay+h0.ey,hx=S.ax+h0.hx,hy=S.ay+h0.hy,qx=sx+(ex-sx)*.35,qy=sy+(ey-sy)*.35;return{c:[qx,qy],p:[[qx,qy],[ex,ey],[hx,hy]]};});}
  const dseg=(ax,ay,bx,by,px,py)=>{const vx=bx-ax,vy=by-ay,L=vx*vx+vy*vy||1,u=Math.max(0,Math.min(1,((px-ax)*vx+(py-ay)*vy)/L));return Math.hypot(px-(ax+vx*u),py-(ay+vy*u));};
  for(let yy=0;yy<H2;yy++)for(let xx=0;xx<W2;xx++){const i=(yy*W2+xx)*4;if(d[i+3]===0)continue;const h=hsh(xx,yy)%1000/1000;
   if(ARMS){let gone=false,stump=false;for(const a of ARMS){const dm=Math.min(dseg(a.p[0][0],a.p[0][1],a.p[1][0],a.p[1][1],xx+.5,yy+.5),dseg(a.p[1][0],a.p[1][1],a.p[2][0],a.p[2][1],xx+.5,yy+.5)),dc=Math.hypot(xx+.5-a.c[0],yy+.5-a.c[1]);if(dm<4.6)gone=true;else if(dm<6.2&&dc<8)stump=true;}
    if(gone){d[i+3]=0;continue;}if(stump){const fr=h<.45;d[i]=fr?210:130;d[i+1]=fr?24:10;d[i+2]=fr?34:20;}}
   /* cabeca girada para tras (pescoco quebrado): do rosto sobra so o cabelo, visto de tras */
   if(P.hr<-1.6&&!down&&yy>=17&&yy<=28&&xx>=19&&xx<=47){const edge=!d[i-3]||!d[i+5]||!d[i-W2*4+3]||!d[i+W2*4+3];
    if(!edge){const q=hsh(xx,yy*3)%5;d[i]=q<2?255:q<4?233:255;d[i+1]=q<2?217:q<4?169:246;d[i+2]=q<2?58:q<4?29:176;}}
   /* sem cabeca (decapitado): apaga tudo acima do pescoco */
   /* carbonizado: rachaduras incandescentes por cima da tinta escura */
   if(o.cracks>0&&h<.17*o.cracks&&((xx+yy)%3===0)){d[i]=255;d[i+1]=110+(h*900|0)%80;d[i+2]=30;}
   /* marcas do selo amaldicoado: riscos pretos so na pele */
   if(o.curse>0&&isSkin(i)&&((hsh(xx>>1,yy)%7)<2)&&h<o.curse){d[i]=10;d[i+1]=6;d[i+2]=14;}
   /* roupa rasgada no peito: pele com sangue */
   if(P.torn){const dx=xx-cx,dy=yy-cy;if(dx*dx/30+dy*dy/22<1){d[i]=h<.25?150:236;d[i+1]=h<.25?16:178;d[i+2]=h<.25?24:140;}}
   /* buraco do Chidori: furo irregular com borda vermelha */
   if(o.hole){const dx=xx-cx,dy=yy-cy,rr=(dx*dx+dy*dy)/(2.6*o.hole*2.6*o.hole)*(.8+h*.4);if(rr<1){d[i+3]=0;continue;}if(rr<1.9){d[i]=rr<1.4?60:150;d[i+1]=rr<1.4?4:14;d[i+2]=rr<1.4?10:22;}}
   /* ferimentos acumulados: manchas e escorridos de sangue em pixel, roupa rasgada nas bordas */
   if(bl>.04){const dark=d[i]<45&&d[i+1]<45&&d[i+2]<70;
    if(!dark){const sk=isSkin(i);
     if(bleedAt(xx,yy)){const fr=hsh(xx,yy+9)%100<35;d[i]=fr?205:128;d[i+1]=fr?26:12;d[i+2]=fr?36:22;}
     else if(bleedAt(xx,yy-1)&&h<.6){d[i]=108;d[i+1]=8;d[i+2]=18;}
     else if(yy>1&&bleedAt(xx,yy-2)&&h<.28){d[i]=96;d[i+1]=6;d[i+2]=16;}
     else if(bl>.3&&!sk&&yy>30&&h<(bl-.25)*.45){const l=d[i-4+3],r=d[i+4+3];if((xx>0&&l===0)||(xx<W2-1&&r===0)){d[i]=232;d[i+1]=172;d[i+2]=136;if(h<.5*(bl-.25))d[i+3]=0;}}}}
   /* virando cinzas: some de cima para baixo em pixels */
   if(o.dissolve>0&&h<o.dissolve*1.55-(yy/H2)*.55){d[i+3]=0;continue;}
  }
  sprTx.putImageData(id,0,0);}
 const ys=0;
 sprBx.imageSmoothingEnabled=false;sprBx.clearRect(0,0,384,384);sprBx.drawImage(sprTmp,0,0,S.w,S.h,0,0,S.w*4,S.h*4);const SB=sprBig;
 g.save();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
 if(!o.noRefl&&!o.rot){g.save();g.translate(x,GY);g.scale(flip?-1:1,-.5);g.globalAlpha=.16*al;g.drawImage(SB,0,0,S.w*4,S.h*4,-S.ax,-S.ay,S.w,S.h);g.restore();}
 if(o.vel&&!o.rot&&Math.abs(o.vel)>160){const dir=Math.sign(o.vel),va=Math.min(Math.abs(o.vel),900),ka=Math.min(1,(Math.abs(o.vel)-160)/220);for(let i=3;i>=1;i--){g.save();g.translate(x-dir*va*.011*i,y);g.scale(flip?-1:1,1);g.globalAlpha=al*(.34-.09*i)*ka;g.drawImage(SB,0,0,S.w*4,S.h*4,-S.ax,-S.ay+ys,S.w,S.h);g.restore();}}
 g.translate(x,y);if(o.rot){g.translate(0,-30);g.rotate(o.rot*(flip?-1:1));g.translate(0,30);}if(o.sc)g.scale(o.sc,o.sc);if(o.flat)g.scale(1+(1-o.flat)*.35,o.flat);g.scale(flip?-1:1,1);g.globalAlpha=al;
 sprDraw(g,SB,S,P,sprRefPose,key,(o.vel||0)*(flip?-1:1),o.sq);
 g.restore();
 return rigW(P);}
const wingc=document.createElement('canvas');wingc.width=SW;wingc.height=SH;const wgx=wingc.getContext('2d',{willReadFrequently:true});
function blit(x,y,flip,d,P,time,o){o=o||{};
 if(USE_SPR&&d===SASUKE&&o.lv2>0){ /* Selo nivel 2 em pixel art: maos-asa por tras (vetor) e o sprite recolorido */
  sc.setTransform(1,0,0,1,0,0);sc.clearRect(0,0,spW,spH);sc.globalCompositeOperation='source-over';drawWings(sc,P,o.lv2h!=null?o.lv2h:o.lv2,time);
  /* as maos-asa viram pixel art: reduz para 1 pixel por unidade, corta a transparencia e poe contorno escuro */
  wgx.clearRect(0,0,SW,SH);wgx.imageSmoothingEnabled=true;wgx.drawImage(sp,0,0,spW,spH,0,0,SW,SH);
  {const id=wgx.getImageData(0,0,SW,SH),d=id.data,n=SW*SH,on=new Uint8Array(n);
   for(let i=0;i<n;i++){const a=d[i*4+3];if(a<110){d[i*4+3]=0;continue;}on[i]=1;d[i*4+3]=255;for(let c=0;c<3;c++)d[i*4+c]=Math.round(d[i*4+c]/24)*24;}
   for(let i=0;i<n;i++){if(on[i])continue;const xx=i%SW;if((xx>0&&on[i-1])||(xx<SW-1&&on[i+1])||(i>=SW&&on[i-SW])||(i<n-SW&&on[i+SW])){d[i*4]=18;d[i*4+1]=11;d[i*4+2]=32;d[i*4+3]=255;}}
   wgx.putImageData(id,0,0);}
  g.save();g.imageSmoothingEnabled=false;g.translate(x,y);g.scale(flip?-1:1,1);g.globalAlpha=o.alpha==null?1:o.alpha;g.drawImage(wingc,0,0,SW,SH,-OXU,-OYU,SW,SH);g.restore();
  const p2=Math.min(1,o.lv2),al0=o.alpha==null?1:o.alpha;
  if(p2<1)blitSprite(x,y,flip,P,time,Object.assign({},o,{lv2px:0}),false);
  return blitSprite(x,y,flip,P,time,Object.assign({},o,{lv2px:1,alpha:al0*p2,noRefl:o.noRefl||p2<1}),false);}
 if(USE_SPR&&d===SASUKE&&!(o.lv2>0)&&!o.sharingan&&(P.red>.5||o.curse>0))o=Object.assign({},o,{sharingan:true});
 if(USE_SPR&&(d===SASUKE||(d===NARUTO&&SPRN.guard))&&!(o.lv2>0))return blitSprite(x,y,flip,P,time,o,d===NARUTO);if(o.lv2>0&&d.style==='s')d=lvDef(o.lv2);
 const cq=clamp(P.crouch-3,-4,6),fast=(P.tilt||0)>.25?1:0,sxq=1+cq*.006+fast*.045,syq=1-cq*.007-fast*.025;
 sc.setTransform(1,0,0,1,0,0);sc.clearRect(0,0,spW,spH);sc.globalCompositeOperation='source-over';
 if(o.lv2>0)drawWings(sc,P,o.lv2h!=null?o.lv2h:o.lv2,time);sc.setTransform(SR,0,0,SR,OXU*SR,OYU*SR);const r=drawFig(sc,d,P,time);drawDecals(sc,d,P,time);
 silhouette(o.lineCol);
 sc.setTransform(1,0,0,1,0,0);sc.globalCompositeOperation='source-atop';
 let sg=sc.createLinearGradient(0,0,spW,0);sg.addColorStop(0,'rgba(10,8,50,.34)');sg.addColorStop(.5,'rgba(10,8,50,.08)');sg.addColorStop(1,'rgba(255,190,140,0)');sc.fillStyle=sg;sc.fillRect(0,0,spW,spH);
 sg=sc.createLinearGradient(0,(OYU-96)*SR,0,OYU*SR);sg.addColorStop(0,'rgba(120,150,255,0)');sg.addColorStop(1,'rgba(10,30,90,.30)');sc.fillStyle=sg;sc.fillRect(0,0,spW,spH);
 if(o.light){const L=o.light,px=(OXU+L.x)*SR,py=(OYU+L.y)*SR,rr=L.r*SR;sg=sc.createRadialGradient(px,py,0,px,py,rr);sg.addColorStop(0,css(L.col,1,L.k));sg.addColorStop(1,css(L.col,1,0));sc.fillStyle=sg;sc.fillRect(0,0,spW,spH);}
 if(o.tint){sc.fillStyle=css(o.tint,1,o.tk);sc.fillRect(0,0,spW,spH);}
 if(o.cracks>0)charCracks(sc,P,o.cracks,time);if(o.curse>0)curseMarks(sc,P,o.curse,time);
 const rims=[{dx:1,dy:-.55,col:[255,226,184],a:.5,d:1.0}];
 for(const Lt of fxLights){const dxw=Lt.x-x,dyw=Lt.y-(y-34),dist=Math.hypot(dxw,dyw)||1;if(dist<Lt.r){const a=Lt.k*(1-dist/Lt.r);if(a>.03)rims.push({dx:dxw*(flip?-1:1)/dist,dy:dyw/dist,col:Lt.col,a:Math.min(1,a*1.5),d:1.5});}}
 for(const R2 of rims){const n=Math.hypot(R2.dx,R2.dy)||1,lx=R2.dx/n,ly=R2.dy/n,px=R2.d*SR;
  rimx.setTransform(1,0,0,1,0,0);rimx.globalCompositeOperation='source-over';rimx.clearRect(0,0,spW,spH);rimx.drawImage(sp,0,0,spW,spH,0,0,spW,spH);
  rimx.globalCompositeOperation='destination-out';rimx.drawImage(sp,0,0,spW,spH,-lx*px,-ly*px,spW,spH);
  rimx.globalCompositeOperation='source-in';rimx.fillStyle=css(R2.col,1,1);rimx.fillRect(0,0,spW,spH);
  sc.globalCompositeOperation='source-atop';sc.globalAlpha=R2.a;sc.drawImage(rimc,0,0,spW,spH,0,0,spW,spH);sc.globalAlpha=1;}
 sc.globalCompositeOperation='source-over';
 if(o.hole){ /* buraco de lado a lado no peito: borda queimada e sangrenta, e o cenario aparece pelo furo */
  const rg=rigW(P),cp=P.torn>0?chestPos(P):[(rg.S[0]+rg.Hp[0])/2+1.2,(rg.S[1]+rg.Hp[1])/2+.5],hx=(OXU+cp[0])*SR,hy=(OYU+cp[1])*SR,hr=o.hole*(4.0+(P.turn||0)*.9)*SR;
  sc.setTransform(1,0,0,1,0,0);sc.globalCompositeOperation='source-atop';
  /* buraco deformado, como carne rasgada por uma mao: contorno irregular, mais comprido na diagonal, com bordas dentadas e rachaduras */
  const rot=-.38,ptsIn=holePts(hr,7,.9,1.3,rot),ptsMid=holePts(hr*1.34,7,.92,1.28,rot),ptsOut=holePts(hr*1.75,11,.95,1.25,rot+.2);
  sc.fillStyle='rgba(95,8,14,.55)';holePath(sc,hx,hy,ptsOut);sc.fill();
  sc.fillStyle='rgba(38,3,9,.95)';holePath(sc,hx,hy,ptsMid);sc.fill();
  sc.strokeStyle='rgba(120,10,18,.85)';sc.lineWidth=.55*SR;sc.lineCap='round';
  for(let i=0;i<9;i++){const q=ptsIn[(i*2+1)%ptsIn.length],a=Math.atan2(q[1],q[0]),l=hr*(.5+((i*37)%10)/10*.9);sc.beginPath();sc.moveTo(hx+q[0],hy+q[1]);sc.lineTo(hx+q[0]+Math.cos(a)*l,hy+q[1]+Math.sin(a)*l);sc.stroke();}
  sc.strokeStyle='rgba(255,165,140,.4)';sc.lineWidth=.35*SR;holePath(sc,hx,hy,ptsMid);sc.stroke();
  sc.globalCompositeOperation='destination-out';sc.fillStyle='#000';holePath(sc,hx,hy,ptsIn);sc.fill();
  sc.globalCompositeOperation='source-over';}
 if(o.dissolve>0){const k=o.dissolve;sc.setTransform(1,0,0,1,0,0);sc.globalCompositeOperation='source-atop';sc.fillStyle='rgba(72,70,76,'+Math.min(.92,k*1.6)+')';sc.fillRect(0,0,spW,spH);sc.globalCompositeOperation='destination-out';sc.fillStyle='#000';
  const cs=2.2,x0=-42,y0=-72,nxc=Math.ceil(84/cs),nyc=Math.ceil(78/cs);for(let j=0;j<nyc;j++){for(let i=0;i<nxc;i++){const h=((i*73856093)^(j*19349663))>>>0,n=(h%1000)/1000,th=k*1.55-(j/nyc)*.55;if(n<th)sc.fillRect((OXU+x0+i*cs)*SR,(OYU+y0+j*cs)*SR,cs*SR+.5,cs*SR+.5);}}sc.globalCompositeOperation='source-over';}
 const al=o.alpha==null?1:o.alpha;
 if(!o.noRefl&&!o.rot){g.save();g.translate(x,GY);g.scale((flip?-1:1)*sxq,-.5*syq);g.globalAlpha=.16*al;g.drawImage(sp,0,0,spW,spH,-OXU,-OYU,SW,SH);g.restore();}
 if(o.vel&&!o.rot&&Math.abs(o.vel)>160){const dir=Math.sign(o.vel),va=Math.min(Math.abs(o.vel),900),ka=Math.min(1,(Math.abs(o.vel)-160)/220);for(let i=3;i>=1;i--){g.save();g.translate(x-dir*va*.011*i,y);g.scale((flip?-1:1)*sxq,syq);g.globalAlpha=al*(.34-.09*i)*ka;g.drawImage(sp,0,0,spW,spH,-OXU,-OYU,SW,SH);g.restore();}} /* rastro de velocidade nos movimentos rapidos */
 g.save();g.translate(x,y);if(o.rot){g.translate(0,-30);g.rotate(o.rot*(flip?-1:1));g.translate(0,30);}g.scale((flip?-1:1)*sxq,syq);g.globalAlpha=al;g.drawImage(sp,0,0,spW,spH,-OXU,-OYU,SW,SH);g.restore();
 return r;
}

