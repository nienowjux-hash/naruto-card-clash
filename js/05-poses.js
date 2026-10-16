/* ---------- poses ---------- */
const READY=mk({tilt:0.08,crouch:3,lean:2,fbx:-8,ffx:7,hxF:10,hyF:4,hxB:6,hyB:6,expr:1,tw:.92,hr:.04});
const SEAL_A=mk({tilt:0.04,crouch:3,lean:1,fbx:-7,ffx:6,hxF:9,hyF:0,hxB:8,hyB:2,expr:1,hF:2,hB:2,tw:.85});
const SEAL_B=mk({tilt:-0.02,crouch:3,lean:1,fbx:-7,ffx:6,hxF:9,hyF:-5,hxB:8,hyB:-4,expr:1,hF:2,hB:2,tw:.85,hr:-.05});
const SEAL_C=mk({tilt:0.05,crouch:3,lean:1,fbx:-7,ffx:6,hxF:8,hyF:5,hxB:7,hyB:6,expr:1,hF:2,hB:2,tw:.85});
const PREP=mk({tilt:-0.06,crouch:5,lean:-1,fbx:-10,ffx:7,hxF:5,hyF:12,hxB:6,hyB:10,expr:1,red:1,hF:3,hB:3,tw:.88,hr:.06});
const CHARGE=mk({tilt:0.06,crouch:5,lean:0,fbx:-10,ffx:8,hxF:14,hyF:8,hxB:12,hyB:7,red:1,expr:1,hF:1,hB:3,tw:.9,hr:.08});
const COIL=mk({tilt:-0.2,crouch:8,lean:-4,fbx:-13,ffx:9,hxF:13,hyF:10,hxB:8,hyB:7,red:1,expr:1,hF:1,hB:3,hdx:-1,tw:.9,hr:.1});
const DASH=mk({tilt:0.42,crouch:7,lean:3,fbx:-16,fby:-4,ffx:-4,ffy:-6,hxF:17,hyF:-5,hxB:-9,hyB:3,hdx:3,hdy:1,red:1,expr:1,hF:1,hB:0,tw:.8,hr:-.1,wind:1});
const HIT=mk({tilt:0.32,crouch:6,lean:3,fbx:-12,ffx:7,hxF:17,hyF:-6,hxB:-8,hyB:3,hdx:3,hdy:1,red:1,expr:2,hF:1,hB:0,tw:.8,hr:-.08,wind:.6});
const HOP=mk({tilt:-0.14,crouch:2,lean:-3,fbx:-3,fby:-5,ffx:4,ffy:-5,hxF:4,hyF:9,hxB:-4,hyB:8,red:1,expr:1,tw:.95,wind:.3});
const TIGER=mk({tilt:0.02,crouch:3,lean:0,fbx:-7,ffx:6,hxF:8,hyF:-7,hxB:7,hyB:-6,red:1,expr:1,hF:2,hB:2,tw:.85});
const INH=mk({tilt:-0.2,crouch:2,lean:-3,fbx:-9,ffx:6,hdx:-1,hdy:-1,hxF:8,hyF:-7,hxB:7,hyB:-6,red:1,expr:1,hF:2,hB:2,tw:.85,hr:-.12});
const EXH=mk({tilt:0.2,crouch:5,lean:5,fbx:-12,ffx:7,hdx:2,hdy:1,hxF:9,hyF:-6,hxB:8,hyB:-5,expr:4,red:1,hF:2,hB:2,tw:.85,hr:.12});
const N_READY=mk({tilt:0.08,crouch:3,lean:2,fbx:-8,ffx:7,hxF:12,hyF:0,hxB:3,hyB:9,expr:5,tw:.92});
const N_SURP=mk({tilt:-0.16,crouch:2,lean:-2,fbx:-7,ffx:6,hxF:6,hyF:8,hxB:4,hyB:9,expr:2,tw:1,hdy:-1,hr:-.06});
const N_GUARD=mk({tilt:-0.05,crouch:5,lean:-1,fbx:-9,ffx:7,hxF:11,hyF:-9,hxB:10,hyB:-8,hdy:1,expr:1,tw:.8,hF:0,hB:0});
const N_HIT=mk({tilt:-0.4,lean:-3,crouch:-1,fbx:-2,fby:-5,ffx:7,ffy:-3,hxF:-5,hyF:3,hxB:-9,hyB:-5,hdx:-3,hdy:-2,expr:3,tw:1,hr:-.25,wind:.8});
const N_STAG=mk({tilt:-0.22,lean:-5,crouch:6,fbx:-8,ffx:6,hxF:3,hyF:11,hxB:-3,hyB:11,hdx:-1,hdy:2,expr:3,tw:1,hr:-.1,wind:.2});
const AMA_A=mk({tilt:-0.1,crouch:2,hxF:3,hyF:11,hxB:-1,hyB:11,hr:-0.2,hdy:-1,red:2,expr:1,tw:.95});
const AMA_CLUTCH=mk({tilt:0.05,crouch:4,hxF:2,hyF:-14,hxB:2,hyB:10,hr:0.14,hdy:1,red:2,expr:1,tw:.9,hF:3});
const AMA_A2=mk({tilt:-0.06,crouch:0,hxF:2,hyF:12,hxB:-1,hyB:12,hr:-0.1,red:2,expr:1,tw:.95});
const AMA_CL2=Object.assign({},AMA_CLUTCH,{crouch:5,hr:.2,hdy:2,hxF:1.2,hyF:-9.2,hF:1,hxB:2,hyB:9,tilt:.08});
const N_BURN1=mk({tilt:-0.25,crouch:2,lean:-2,hxF:-4,hyF:-9,hxB:-6,hyB:-7,hdx:-2,hr:-0.2,expr:3,fby:-3,tw:1,wind:.5});
const N_BURN2=mk({tilt:0.15,crouch:5,lean:2,hxF:9,hyF:-8,hxB:7,hyB:-9,hr:0.15,expr:2,ffy:-3,tw:.9});
const S_GUARD=mk({tilt:-0.05,crouch:5,fbx:-9,ffx:7,hxF:10,hyF:-8,hxB:9,hyB:-6,expr:1,red:1,tw:.8,hF:0,hB:0});
const S_FLINCH=mk({tilt:-0.22,crouch:4,lean:-2,fbx:-9,ffx:6,hxF:9,hyF:-6,hxB:8,hyB:-5,expr:3,red:1,tw:.85,hr:-0.14});
const S_HIT=mk({tilt:-0.4,lean:-3,crouch:-1,fbx:-2,fby:-5,ffx:7,ffy:-3,hxF:-5,hyF:3,hxB:-9,hyB:-5,hdx:-3,hdy:-2,expr:3,tw:1,hr:-0.25,wind:.8});
const S_STAG=mk({tilt:-0.22,crouch:6,lean:-5,fbx:-8,ffx:6,hxF:3,hyF:11,hxB:-3,hyB:11,hdx:-1,hdy:2,expr:3,tw:1,hr:-0.1});
const S_DOWN=mk({tilt:-0.5,crouch:15,lean:-4,fbx:-14,ffx:6,hxF:1,hyF:14,hxB:-2,hyB:14,hdx:-2,hdy:3,hr:-0.45,expr:3,tw:1});
const N_RAS_WIND=mk({tilt:0.1,crouch:6,lean:1,fbx:-11,ffx:8,hxF:13,hyF:2,hxB:12,hyB:4,hF:1,hB:1,expr:2,tw:.85,hr:-0.05});
const N_RAS_DASH=mk({tilt:0.42,crouch:7,lean:3,fbx:-15,fby:-4,ffx:-4,ffy:-5,hxF:16,hyF:0,hxB:-8,hyB:3,hF:1,expr:2,tw:.8,hr:-0.1,wind:1});
const N_RAS_HIT=mk({tilt:0.34,crouch:6,lean:3,fbx:-12,ffx:6,hxF:17,hyF:-1,hxB:-7,hyB:3,hF:1,expr:2,tw:.8,wind:.6});
const N_VICT=mk({tilt:-0.1,crouch:-1,hxF:9,hyF:-11,hxB:3,hyB:5,hF:0,expr:6,tw:.95,hr:-0.12});
const N_SEAL=mk({crouch:4,tilt:0.04,hxF:9,hyF:-3,hxB:8,hyB:-2,hF:2,hB:2,expr:2,tw:.85});
const N_UPPER=mk({tilt:0.28,crouch:5,lean:2,fbx:-12,fby:-3,ffx:6,ffy:-5,hxF:11,hyF:-16,hxB:-7,hyB:4,hF:0,expr:2,tw:.85,wind:.5});
const N_COIL=mk({tilt:-0.2,crouch:8,lean:-3,fbx:-12,ffx:8,hxF:-3,hyF:3,hxB:6,hyB:5,expr:1,tw:.9});
const N_DASHP=mk({tilt:0.42,crouch:7,lean:3,fbx:-15,fby:-4,ffx:-4,ffy:-5,hxF:15,hyF:-4,hxB:-8,hyB:3,expr:2,tw:.8,hr:-0.1,wind:1});
const N_PUNCH=mk({tilt:0.34,crouch:6,lean:3,fbx:-12,ffx:6,hxF:17,hyF:-4,hxB:-7,hyB:3,expr:2,tw:.8,wind:.6});
const N_HITB=mk({tilt:0.38,crouch:2,lean:3,fby:-4,ffx:7,hxF:12,hyF:-7,hxB:11,hyB:-6,hdx:3,hr:0.2,expr:3,tw:1,wind:.8});
const K_WIND=mk({tilt:-0.2,crouch:3,lean:-2,fbx:-6,ffx:3,hxF:-4,hyF:6,hxB:9,hyB:-1,hr:0.1,expr:1,red:1,tw:.9});
const KICK=mk({tilt:-0.14,crouch:2,lean:-1,fbx:-7,ffx:17,ffy:-17,hxF:-5,hyF:5,hxB:10,hyB:-3,hr:0.12,expr:1,red:1,tw:.9,wind:.4});
const N_DOWN=mk({tilt:-0.5,crouch:15,lean:-4,fbx:-14,ffx:6,hxF:1,hyF:14,hxB:-2,hyB:14,hdx:-2,hdy:3,hr:-0.45,expr:3,tw:1,wind:0});
const VICTORY=mk({tilt:-0.06,crouch:-1,lean:-1,fbx:-4,ffx:4,hxF:3,hyF:13,hxB:5,hyB:6,hr:-0.14,hdy:-1,expr:7,tw:.95});
function buildLethal(A){if(A.sPL)return;if(A.L){A.sPL=A.L.sP;A.nPL=A.L.nP;A.nXL=A.L.nX;return;}const h=A.hitT,cut=k=>k[0]<=h+.45;
 A.nPL=A.nP.filter(cut).concat([[h+.95,N_STAG],[h+1.6,N_DOWN],[99,N_DOWN]]);
 A.nXL=A.nX.filter(cut).concat([[h+.9,306],[99,306]]);
 A.sPL=A.sP.filter(k=>k[0]<A.dur-1.0).concat([[A.dur-.4,VICTORY],[99,VICTORY]]);}
function interp(keys,t,os){const n=keys.length;if(t<=keys[0][0])return keys[0][1];if(t>=keys[n-1][0])return keys[n-1][1];
 let i=0;while(t>keys[i+1][0])i++;const [t0,a]=keys[i],[t1,b]=keys[i+1];let k=(t-t0)/(t1-t0);
 if(os&&(t1-t0)<.4){const c1=1.15;k=1+(c1+1)*Math.pow(k-1,3)+c1*Math.pow(k-1,2);}else k=k*k*(3-2*k);
 if(typeof a==='number')return a+(b-a)*k;const o={};for(const q in a)o[q]=a[q]+(b[q]-a[q])*k;return o;}
/* Animacao em cadeia: quadril/pes lideram, depois tronco, bracos e por ultimo a cabeca.
   Cada grupo tem atraso proprio, "mola" (overshoot) propria e curva que depende da velocidade do movimento. */
const CH_SCALE={crouch:5,fbx:6,fby:5,ffx:6,ffy:5,tw:.3,wind:1,tilt:.25,lean:3,hxF:8,hyF:8,hxB:8,hyB:8,hdx:2,hdy:2,hr:.15};
const CH_GROUPS=[
 {ch:['crouch','fbx','fby','ffx','ffy','tw','wind'],lag:0,back:.6,ant:0},
 {ch:['tilt','lean'],lag:.045,back:1.0,ant:.7},
 {ch:['hxF','hyF'],lag:.07,back:1.6,ant:1.0},
 {ch:['hxB','hyB'],lag:.095,back:1.6,ant:1.0},
 {ch:['hdx','hdy','hr'],lag:.12,back:1.3,ant:.6}];
function easeSeg(k,d,m,gp){
 if(d<.1)return 1-Math.pow(1-k,3);                       /* impacto: estoura na hora, sem antecipar */
 if(d<.3&&m>.45&&gp.ant>0){const c=1.1*gp.ant;return k*k*((c+1)*k-c);}  /* golpe: recua um pouco e acelera */
 if(d<.45&&gp.back>0){const c=1.15*gp.back;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);} /* chega e assenta */
 return .5-.5*Math.cos(Math.PI*k);                       /* lento: sai e chega suave */}
function seg(keys,t){const n=keys.length;if(t<=keys[0][0])return[0,0,0];if(t>=keys[n-1][0])return[n-1,n-1,0];let i=0;while(t>keys[i+1][0])i++;return[i,i+1,(t-keys[i][0])/(keys[i+1][0]-keys[i][0])];}
function evalPose(keys,t){const o=Object.assign({},interp(keys,t));
 for(const gp of CH_GROUPS){const [i0,i1,k]=seg(keys,t-gp.lag);if(i0===i1){const v=keys[i0][1];for(const q of gp.ch)o[q]=v[q];continue;}
  const a=keys[i0][1],b=keys[i1][1],d=keys[i1][0]-keys[i0][0];
  for(const q of gp.ch){const m=Math.abs(b[q]-a[q])/CH_SCALE[q];o[q]=a[q]+(b[q]-a[q])*easeSeg(k,d,m,gp);}}
 o.fby=Math.min(0,o.fby);o.ffy=Math.min(0,o.ffy);return o;}
const ANIMS={
 chidori:{dur:4.7,hold:2.58,
  sP:[[0,READY],[.45,READY],[.55,SEAL_A],[.85,SEAL_B],[1.15,SEAL_C],[1.4,PREP],[1.6,CHARGE],[2.0,CHARGE],[2.15,COIL],[2.33,DASH],[2.55,DASH],[2.58,HIT],[3.12,HIT],[3.18,READY],[4.4,READY]],
  nP:[[0,N_READY],[2.12,N_READY],[2.28,N_SURP],[2.42,N_GUARD],[2.55,N_GUARD],[2.58,N_HIT],[3.0,N_HIT],[3.4,N_STAG],[4.0,N_READY]],
  nX:[[0,288],[2.55,288],[2.58,290],[3.0,318],[3.5,312],[4.2,288]],
  cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.9,{z:1.3,cx:100,cy:128}],[1.4,{z:1.5,cx:104,cy:132}],[2.1,{z:1.55,cx:108,cy:132}],[2.2,{z:1.25,cx:150,cy:130}],[2.5,{z:1.3,cx:240,cy:132}],[2.58,{z:1.5,cx:262,cy:132}],[3.05,{z:1.4,cx:266,cy:132}],[3.3,{z:1.25,cx:215,cy:122}],[3.7,{z:1.04,cx:192,cy:116}],[4.0,{z:1.04,cx:192,cy:116}]],
  tp:[3.15],hitT:2.58,dmg:31,cost:30},
 katon:{dur:4.5,hold:2.4,
  sP:[[0,READY],[.4,READY],[.5,SEAL_A],[.7,SEAL_B],[.9,SEAL_C],[1.1,SEAL_A],[1.3,SEAL_B],[1.5,TIGER],[1.8,INH],[1.84,EXH],[2.5,EXH],[3.0,READY],[3.8,READY]],
  nP:[[0,N_READY],[1.9,N_READY],[2.05,N_SURP],[2.18,N_GUARD],[2.36,N_GUARD],[2.4,N_HIT],[2.85,N_HIT],[3.2,N_STAG],[3.8,N_READY]],
  nX:[[0,288],[2.38,288],[2.42,290],[2.9,312],[3.4,306],[4.0,288]],
  cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.9,{z:1.3,cx:104,cy:128}],[1.5,{z:1.6,cx:104,cy:126}],[1.9,{z:1.3,cx:170,cy:130}],[2.3,{z:1.3,cx:256,cy:132}],[2.42,{z:1.5,cx:272,cy:130}],[3.0,{z:1.3,cx:262,cy:132}],[3.6,{z:1.04,cx:192,cy:116}]],
  hitT:2.4,dmg:23,cost:20}
};
/* ---- golpe final do Chidori: o braco atravessa o peito, e o Sasuke puxa de volta sangrando ---- */
const CH_PULL=mk({tilt:.2,crouch:5,lean:2,fbx:-12,ffx:7,hxF:9,hyF:-2,hxB:-6,hyB:4,red:1,expr:2,tw:.88,hr:.06,wind:.5});
const N_IMP=mk({tilt:-.18,lean:-3,crouch:1,fbx:-6,fby:-2,ffx:5,ffy:-2,hxF:-6,hyF:3,hxB:-8,hyB:2,hdx:-2,hdy:1,hr:-.3,expr:3,tw:1,wind:.4,turn:.5,torn:1});
const N_IMP2=mk({tilt:-.08,lean:-2,crouch:3,fbx:-6,fby:-3,ffx:5,ffy:-3,hxF:-2,hyF:10,hxB:-3,hyB:11,hdx:1,hdy:3,hr:.28,expr:3,tw:1,turn:.55,torn:1});
const N_SLUMP=mk({tilt:.1,lean:-3,crouch:9,fbx:-9,ffx:6,hxF:2,hyF:12,hxB:0,hyB:12,hdx:1,hdy:4,hr:.45,expr:3,tw:1,turn:.7,torn:1});
const HIT_B=Object.assign({},HIT,{tilt:.38,hdx:4.5,hdy:2,hr:.1,hxF:17,hyF:-4,hxB:-9,hyB:5,crouch:7});
const CH_WIND=Object.assign({},HIT,{tilt:.5,lean:4,crouch:9,hxF:14,hyF:-3,hxB:-10,hyB:6,hr:.14,hdx:5,hdy:3});
const CH_RIP=mk({tilt:-.3,crouch:3,lean:-5,fbx:-9,ffx:6,hxF:7,hyF:-6,hxB:-7,hyB:6,red:1,expr:2,tw:.9,hr:-.22,hdx:-2,hdy:-1,wind:1});
const CH_DRIP=mk({tilt:-.06,crouch:2,lean:-2,fbx:-6,ffx:5,hxF:4,hyF:11,hxB:5,hyB:8,red:1,expr:7,tw:.95,hr:-.1,hdy:-1});
const N_IMP_B=Object.assign({},N_IMP,{tilt:-.3,lean:-4,hr:-.5,hdy:-1,hxF:-8,hyF:-1,hxB:-10,hyB:-2,expr:3});
const N_JERK=mk({tilt:.08,lean:1,crouch:1.5,fbx:-5,ffx:5,hxF:1.5,hyF:12,hxB:-1.5,hyB:11,hdx:1,hdy:2,hr:.16,expr:3,tw:1,wind:.8,turn:.85,torn:1});
const N_SWAY1=mk({tilt:0,lean:0,crouch:-.6,fbx:-4,ffx:4,hxF:1.8,hyF:13,hxB:-1.8,hyB:13,hdx:0,hdy:.5,hr:.05,expr:3,tw:1,turn:1,torn:1});
const N_SWAY2=mk({tilt:.02,lean:0,crouch:-.5,fbx:-4,ffx:4,hxF:1.8,hyF:13,hxB:-1.8,hyB:13,hdx:0,hdy:1.2,hr:.08,expr:3,tw:1,turn:1,torn:1});
const N_DOWN_T=Object.assign({},N_DOWN,{turn:.35,torn:1});
ANIMS.chidori.L={dur:10.6,koAt:9.6,speakAt:7.4,bannerAt:8.6,line:'Você é fraco!',
 /* mapa raw->t: pausa no impacto, camera lenta com o braco cravado, lentissima no arranque, depois normal */
 map:[[0,0],[2.58,2.58],[3.0,2.63],[5.0,3.5],[5.9,3.78],[7.3,4.6],[99,96.3]],
 sP:ANIMS.chidori.sP.filter(k=>k[0]<=2.58).concat([[3.0,HIT_B],[3.45,HIT_B],[3.58,CH_WIND],[3.66,CH_RIP],[4.2,CH_DRIP],[4.9,VICTORY],[99,VICTORY]]),
 nP:ANIMS.chidori.nP.filter(k=>k[0]<=2.55).concat([[2.6,N_IMP],[3.0,N_IMP_B],[3.5,N_IMP2],[3.64,N_JERK],[3.95,N_SWAY1],[4.9,N_SWAY2],[5.6,N_SWAY2],[6.0,N_SLUMP],[6.4,N_DOWN_T],[99,N_DOWN_T]]),
 nX:[[0,288],[2.55,288],[2.6,291],[3.55,291],[3.66,285],[3.95,289],[5.6,289],[6.4,300],[99,300]],
 sX:[[2.55,246],[2.64,262],[3.5,262],[3.58,258],[3.66,236],[4.2,232],[6.8,232],[7.7,96],[99,96]],
 cam:ANIMS.chidori.cam.filter(k=>k[0]<=2.5).concat([[2.6,{z:1.6,cx:272,cy:130}],[2.7,{z:2.05,cx:280,cy:129}],[3.0,{z:2.4,cx:284,cy:131}],[3.25,{z:3.0,cx:276,cy:131}],[3.5,{z:2.3,cx:283,cy:132}],[3.62,{z:2.6,cx:272,cy:130}],[3.85,{z:3.1,cx:284,cy:140}],[4.3,{z:3.2,cx:284,cy:140}],[4.7,{z:2.5,cx:262,cy:138}],[5.6,{z:2.3,cx:260,cy:137}],[6.2,{z:1.9,cx:268,cy:130}],[7.2,{z:1.5,cx:230,cy:122}],[7.9,{z:1.25,cx:200,cy:120}]])};
const mapL=raw=>{const M=ANIMS.chidori.L.map;if(raw<=0)return raw;let i=0;while(i<M.length-2&&raw>M[i+1][0])i++;const a=M[i],b=M[i+1];return a[1]+(b[1]-a[1])*(raw-a[0])/(b[0]-a[0]);};
let chestHole=0;
/* ---- golpe final do Katon: o Naruto vira uma tocha, grita de dor de frente para a camera e fica carbonizado ---- */
const LK=type=>type==='katon'&&!!ANIMS.katon.L&&((anim&&anim.lethal)||!!window.__LETHK);
let burnt=0;
const K_RECOIL=Object.assign({},N_HIT,{turn:.5,scream:1});
const KB_A=mk({tilt:0,lean:0,crouch:1,fbx:-4,ffx:4,hxF:3,hyF:-12,hxB:-3,hyB:-12,hdx:0,hdy:-1,hr:-.12,expr:3,tw:1,turn:1,scream:1,wind:1});
const KB_B=mk({tilt:.04,lean:0,crouch:2,fbx:-4,ffx:4,hxF:9,hyF:-6,hxB:-9,hyB:-6,hdx:0,hdy:-2,hr:.1,expr:3,tw:1,turn:1,scream:1,wind:1});
const KB_C=mk({tilt:-.04,lean:0,crouch:0,fbx:-4,ffx:4,hxF:2,hyF:-14,hxB:-2,hyB:-14,hdx:0,hdy:-3,hr:-.18,expr:3,tw:1,turn:1,scream:1,wind:1});
const KB_KNEEL=mk({tilt:.08,lean:0,crouch:10,fbx:-6,ffx:6,hxF:3,hyF:-6,hxB:-3,hyB:-6,hdx:0,hdy:1,hr:.2,expr:3,tw:1,turn:1,scream:1,wind:.6});
const KB_STAT=mk({tilt:.14,lean:0,crouch:12,fbx:-6,ffx:6,hxF:3,hyF:-3,hxB:-3,hyB:-3,hdx:0,hdy:3,hr:.3,expr:3,tw:1,turn:1,scream:.4,wind:.2});
const KB_DOWN=Object.assign({},N_DOWN,{turn:.35});
ANIMS.katon.L={dur:9.6,koAt:8.6,bannerAt:7.4,speakAt:3.4,line:'Queime!',speechPos:['24%','24%'],banner:['火','FATALITY','Katon','#ff7a1a'],sfxFn:null,
 /* mapa raw->t: pausa no impacto, camera lenta enquanto o fogo toma conta, depois quase normal */
 map:[[0,0],[2.4,2.4],[2.75,2.44],[4.5,3.5],[8.0,6.4],[99,97.4]],
 sP:ANIMS.katon.sP.filter(k=>k[0]<=2.5).concat([[3.6,EXH],[4.2,READY],[5.4,READY],[6.0,VICTORY],[99,VICTORY]]),
 nP:ANIMS.katon.nP.filter(k=>k[0]<=2.36).concat([[2.4,K_RECOIL],[2.6,KB_A],[3.0,KB_B],[3.35,KB_C],[3.7,KB_B],[4.1,KB_A],[4.5,KB_C],[4.9,KB_B],[5.3,KB_KNEEL],[5.7,KB_STAT],[6.1,KB_STAT],[6.7,KB_DOWN],[99,KB_DOWN]]),
 nX:[[0,288],[2.38,288],[2.42,291],[2.8,285],[3.3,293],[3.8,284],[4.3,292],[4.8,286],[5.3,290],[6.1,290],[6.7,300],[99,300]],
 cam:ANIMS.katon.cam.filter(k=>k[0]<=2.3).concat([[2.45,{z:1.7,cx:278,cy:132}],[2.8,{z:2.3,cx:286,cy:126}],[3.5,{z:2.0,cx:285,cy:128}],[4.4,{z:1.7,cx:274,cy:130}],[5.2,{z:2.0,cx:288,cy:140}],[5.9,{z:2.4,cx:290,cy:140}],[6.5,{z:1.8,cx:286,cy:148}],[7.2,{z:1.35,cx:236,cy:130}],[7.9,{z:1.04,cx:192,cy:116}]])};
const mapK=raw=>{const M=ANIMS.katon.L.map;if(raw<=0)return raw;let i=0;while(i<M.length-2&&raw>M[i+1][0])i++;const a=M[i],b=M[i+1];return a[1]+(b[1]-a[1])*(raw-a[0])/(b[0]-a[0]);};
ANIMS.katon.L.sfxFn=(...a)=>sfxFatalK(...a); /* sfxFatalK e definida em outro arquivo (js/11-kyubi.js): resolve so na hora de tocar */


const FLICK=mk({tilt:.02,crouch:2,lean:0,fbx:-7,ffx:5,hxF:3,hyF:10,hxB:5,hyB:8,red:1,expr:7,tw:.95,hr:.05});
ANIMS.amaterasu={dur:5.0,hold:2.0,
  sP:[[0,READY],[.45,READY],[.65,AMA_A],[1.0,AMA_CLUTCH],[1.55,AMA_CLUTCH],[1.9,AMA_A2],[2.7,AMA_A2],[3.0,AMA_CL2],[4.2,AMA_CL2],[4.6,READY],[5.0,READY]],
  nP:[[0,N_READY],[1.7,N_READY],[1.95,N_SURP],[2.05,N_BURN1],[2.35,N_BURN2],[2.65,N_BURN1],[2.95,N_BURN2],[3.3,N_BURN1],[3.9,N_STAG],[4.5,N_READY]],
  nX:[[0,288],[2.0,288],[2.5,293],[3.0,283],[3.5,291],[4.4,288]],
  cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.65,{z:1.5,cx:104,cy:126}],[1.0,{z:2.7,cx:106,cy:128}],[1.6,{z:2.7,cx:106,cy:128}],[1.9,{z:1.6,cx:240,cy:128}],[2.1,{z:1.5,cx:272,cy:128}],[2.6,{z:1.4,cx:266,cy:128}],[2.95,{z:2.5,cx:110,cy:126}],[4.2,{z:2.7,cx:106,cy:127}],[4.8,{z:1.04,cx:192,cy:116}],[5.0,{z:1.04,cx:192,cy:116}]],
  hitT:2.0,dmg:28,cost:50};
/* ---- golpe final do Amaterasu: o Naruto tenta apagar as chamas negras, vira cinzas, e a camera volta para o Sasuke com a mao no olho ---- */
const LA=type=>type==='amaterasu'&&!!ANIMS.amaterasu.L&&((anim&&anim.lethal)||!!window.__LETHA);
let ashed=0;
const PAT_A=mk({tilt:.1,lean:1,crouch:3,fbx:-6,ffx:6,hxF:-3,hyF:-2,hxB:2,hyB:-5,hdx:0,hdy:1,hr:.15,expr:3,tw:1,wind:.8});
const PAT_B=mk({tilt:.25,lean:2,crouch:6,fbx:-7,ffx:6,hxF:5,hyF:11,hxB:-2,hyB:9,hdx:1,hdy:2,hr:.3,expr:3,tw:1,wind:.8});
const PAT_C=mk({tilt:-.1,lean:0,crouch:3,fbx:-6,ffx:6,hxF:9,hyF:-8,hxB:-8,hyB:-10,hdx:0,hdy:0,hr:-.2,expr:3,tw:1,wind:.8});
const N_AKNEEL=mk({tilt:.2,lean:0,crouch:11,fbx:-7,ffx:6,hxF:6,hyF:8,hxB:3,hyB:10,hdx:0,hdy:3,hr:.3,expr:3,tw:1,wind:.6});
const N_AKNEEL2=mk({tilt:.28,lean:0,crouch:13,fbx:-8,ffx:6,hxF:4,hyF:12,hxB:2,hyB:12,hdx:0,hdy:4,hr:.4,expr:3,tw:1,wind:.4});

ANIMS.amaterasu.L={dur:10.8,koAt:10.0,bannerAt:8.2,banner:['焼','FATALITY','Amaterasu','#e0306c'],sfxFn:null,
 /* mapa raw->t: pausa no acender das chamas, camera lenta no desespero e nas cinzas, volta ao Sasuke ainda lenta */
 map:[[0,0],[2.0,2.0],[2.3,2.04],[7.6,5.5],[9.4,6.9],[99,103.5]],
 sP:ANIMS.amaterasu.sP.filter(k=>k[0]<=1.55).concat([[1.9,AMA_A2],[5.6,AMA_A2],[6.1,AMA_CL2],[99,AMA_CL2]]),
 nP:ANIMS.amaterasu.nP.filter(k=>k[0]<=1.95).concat([[2.05,N_BURN1],[2.4,PAT_A],[2.75,PAT_B],[3.1,PAT_C],[3.45,PAT_A],[3.8,PAT_B],[4.15,PAT_C],[4.5,N_AKNEEL],[5.2,N_AKNEEL2],[99,N_AKNEEL2]]),
 nX:[[0,288],[2.0,288],[2.6,296],[3.1,281],[3.6,293],[4.1,284],[4.6,289],[99,289]],
 cam:ANIMS.amaterasu.cam.filter(k=>k[0]<=1.9).concat([[2.1,{z:1.5,cx:272,cy:128}],[2.8,{z:2.0,cx:288,cy:134}],[3.6,{z:1.8,cx:290,cy:136}],[4.5,{z:2.2,cx:288,cy:142}],[5.2,{z:2.4,cx:288,cy:142}],[5.6,{z:2.0,cx:200,cy:130}],[6.0,{z:2.7,cx:108,cy:134}],[7.6,{z:2.9,cx:108,cy:134}],[8.2,{z:1.3,cx:150,cy:120}]])};
const mapA=raw=>{const M=ANIMS.amaterasu.L.map;if(raw<=0)return raw;let i=0;while(i<M.length-2&&raw>M[i+1][0])i++;const a=M[i],b=M[i+1];return a[1]+(b[1]-a[1])*(raw-a[0])/(b[0]-a[0]);};
const ameLInt=t=>.5*scaleAt(0,1,2.0,2.6,t)*(1+.25*scaleAt(0,1,3.5,4.4,t))*(1-scaleAt(0,1,5.0,5.8,t));
ANIMS.amaterasu.L.sfxFn=(...a)=>sfxFatalA(...a); /* sfxFatalA e definida em js/11-kyubi.js: resolve so na hora de tocar */
