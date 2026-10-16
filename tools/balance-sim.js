/* Simulador de equilibrio do RPG: roda milhares de lutas Sasuke x Naruto com os numeros do jogo (custos, danos, buffs, stuns, sapo, Kyubi)
   e varias estrategias, com e sem as regras de equilibrio. Uso: node tools/balance-sim.js [partidas] [antes|atual|todos] [ajustes JSON, ex.: '{"kagesh.c":18}']
   Os numeros espelham js/ (ANIMS.*.cost/dmg/hits e regras de turno): se mudar um numero no jogo, mude aqui tambem. */
const N=+process.argv[2]||4000;
const rnd=()=>Math.random();
/* regras em teste:
   imunidade: depois de perder um turno por stun, o alvo nao pode ser atordoado de novo no turno seguinte
   iaChakra : a IA do Naruto so escolhe golpes que consegue pagar (senao concentra)
   iaEsperta: a IA do Sasuke prefere golpes eficientes e usa o Genjutsu com criterio */
let CFG={imunidade:false,iaChakra:false,iaEsperta:false};
const TOAD={hp:40,shot:6,throwKunai:3,throwShuriken:6,cd:0,once:1};const CFG_TUNE={cs0:100,cn0:100,regS:15,regN:15};
const SM={ /* Sasuke: custo c, dano base d */
 chidori:{c:30,d:34},katon:{c:20,d:26},amaterasu:{c:50,d:40,burn:true},
 genjutsu:{c:12,d:14,stun:true},shishi:{c:25,d:36},soushuken:{c:17,d:28},kagesh:{c:16,d:30},
 kunai:{c:0,d:8},shuriken:{c:0,d:12},soco:{c:0,d:10},chute:{c:0,d:12},
 selo:{c:20,d:0,buff:1},selo2:{c:40,d:0,buff:2},selochidori:{c:35,d:44,needs2:true,noSeal:true},
 copRas:{c:18,d:22,once:true,needsCopy:'rasengan'},copBun:{c:15,d:24,once:true,needsCopy:'bunshin'},copy:{c:8,d:0,copy:true}};
const NM={ /* Naruto: custo c, acertos h */
 rasengan:{c:30,h:[30]},bunshin:{c:25,h:[6,6,6,14]},uzumaki:{c:35,h:[6,6,6,6,16]},kamikaze:{c:30,h:[5,5,5,5,14]},
 kuchiyose:{c:45,h:[32],summon:true},oiroke:{c:10,h:[],stun:.6,stunN:1},harem:{c:20,h:[],stun:.9,stunN:2}};
function applyTune(obj){for(const [k,v] of Object.entries(obj)){const [mv,f]=k.split('.');if(SM[mv]&&f in SM[mv])SM[mv][f]=v;else if(NM[mv]&&f in NM[mv])NM[mv][f]=v;else if(mv==='toad')TOAD[f]=v;else if(mv==='cfg')CFG_TUNE[f]=v;else console.log('parametro desconhecido',k);}}
const ANTES={'toad.hp':70,'toad.shot':14,'toad.throwKunai':6,'toad.throwShuriken':14,'toad.once':0,'kagesh.c':12,'soushuken.c':15,'cfg.regS':20};
if(process.argv[4])applyTune(JSON.parse(process.argv[4]));
const toadOK=st=>!(st.toadCD>0)&&!(TOAD.once&&st.toadUsed);
const NAR_MOVES=['rasengan','bunshin','uzumaki','kamikaze','kuchiyose','oiroke','harem'];
const tot=k=>NM[k].h.reduce((a,v)=>a+v,0);
const KAW_MAX=2; /* usos do Kawarimi por luta (cada personagem) */
function newState(){return{kuS:0,kuN:0,kawS:false,kawN:false,toadCD:0,toadUsed:false,hs:100,hn:100,cs:CFG_TUNE.cs0,cn:CFG_TUNE.cn0,sealT:0,seal2T:0,stunN:false,stunS:0,immN:false,immS:false,guardS:false,kyuT:0,kyuUsed:false,bunta:null,burning:false,copied:null,usedCopy:{},lastN:null,turns:0};}
/* ---------- Sasuke ---------- */
function can(st,k){const m=SM[k];if(st.cs<m.c)return false;if(m.needs2&&st.seal2T<=0)return false;if(m.needsCopy&&(st.copied!==m.needsCopy||st.usedCopy[k]))return false;
 if(m.buff===1&&(st.sealT>0||st.seal2T>0))return false;if(m.buff===2&&st.seal2T>0)return false;if(m.copy&&!(st.lastN==='rasengan'||st.lastN==='bunshin'))return false;return true;}
function effD(st,m){if(!m.d)return 0;const mult=m.noSeal?1:st.seal2T>0?1.6:st.sealT>0?1.3:1;return Math.round(m.d*mult);}
function sasukeAct(st,k){const m=SM[k];st.cs=Math.max(0,st.cs-m.c);
 if(m.buff===1){st.hs=Math.max(1,st.hs-8);st.sealT=3;}if(m.buff===2){st.hs=Math.max(1,st.hs-15);st.seal2T=4;st.sealT=0;}if(k==='selochidori')st.hs=Math.max(1,st.hs-6);
 if(m.copy)st.copied=st.lastN;if(m.once)st.usedCopy[k]=true;
 const dm=effD(st,m),dodgeN=!!(st.kawN&&!st.bunta&&dm>0);if(dodgeN)st.kawN=false;
 if(m.d){if(st.bunta){st.bunta.hp-=dm;if(st.bunta.hp<=0){st.bunta=null;st.toadCD=TOAD.cd;}}else if(!dodgeN)st.hn=Math.max(0,st.hn-dm);}
 if(m.stun&&!dodgeN){if(CFG.imunidade&&st.immN){}else st.stunN=true;}
 if(m.burn&&!dodgeN)st.burning=true;st.guardS=false;}
const SAS_CONC=st=>{st.cs=Math.min(100,st.cs+25);};
const SAS_DEF=st=>{st.guardS=true;st.cs=Math.min(100,st.cs+10);};
/* estrategias do jogador Sasuke */
const SAS={
 esquivador:st=>{if(!st.kawS&&st.kuS<KAW_MAX&&st.cs>=10&&st.hs<60)return'K';return SAS.eficiente(st);},
 aleatorio:st=>{const pool=Object.keys(SM).filter(k=>can(st,k));if(!pool.length||st.cs<12||rnd()<.1)return'C';if(st.hn<=40)return pool.sort((a,b)=>effD(st,SM[b])-effD(st,SM[a]))[0];return pool[Math.floor(rnd()*pool.length)];},
 eficiente:st=>{const pool=Object.keys(SM).filter(k=>can(st,k)&&SM[k].d>0&&!SM[k].once);if(!pool.length)return'C';
  if(!st.stunN&&can(st,'genjutsu')&&!st.bunta&&st.cn>20)return'genjutsu';
  const dr=k=>effD(st,SM[k])/Math.max(5,SM[k].c);const best=pool.sort((a,b)=>dr(b)-dr(a))[0];if(st.cs<=12&&SM[best].c>st.cs)return'C';return best;},
 forte:st=>{const pool=Object.keys(SM).filter(k=>can(st,k)&&SM[k].d>0);if(!pool.length)return'C';return pool.sort((a,b)=>effD(st,SM[b])-effD(st,SM[a]))[0];},
 selo2:st=>{if(can(st,'selo2')&&st.seal2T<=0&&st.hs>40&&!st.bunta)return'selo2';if(st.seal2T>0&&can(st,'selochidori'))return'selochidori';return SAS.eficiente(st);},
 defensivo:st=>{if(st.hs<45&&!st.guardS)return'D';if(st.cs<25)return'C';return SAS.eficiente(st);}};
/* IA do Sasuke (quando o jogador e o Naruto) */
function aiSasuke(st){const pool=Object.keys(SM).filter(k=>can(st,k));if(!st.kawS&&st.kuS<KAW_MAX&&st.cs>=10&&st.hs<70&&rnd()<(st.hs<45?.3:.12))return'K';
 if(CFG.iaEsperta){const dmg=pool.filter(k=>SM[k].d>0&&!SM[k].once);if(!dmg.length||st.cs<12)return'C';
  if(st.hn<=40||st.bunta)return dmg.sort((a,b)=>effD(st,SM[b])-effD(st,SM[a]))[0]; /* com o sapo em campo: derruba o sapo logo */
  if(!st.stunN&&can(st,'genjutsu')&&!st.bunta&&rnd()<.5)return'genjutsu';
  const dr=k=>effD(st,SM[k])/Math.max(5,SM[k].c);const w=dmg.map(k=>[k,dr(k)+.4]);const sum=w.reduce((a,x)=>a+x[1],0);let r=rnd()*sum;for(const [k,v] of w){r-=v;if(r<=0)return k;}return w[0][0];}
 if(!pool.length||st.cs<12||rnd()<.1)return'C';if(st.hn<=40)return pool.sort((a,b)=>effD(st,SM[b])-effD(st,SM[a]))[0];return pool[Math.floor(rnd()*pool.length)];}
/* ---------- Naruto ---------- */
function naruAct(st,k){
 if(k==='kyuubi'){st.kyuUsed=true;st.kyuT=3;return;}
 const m=NM[k];st.cn=Math.max(0,st.cn-m.c);if(k==='rasengan'||k==='bunshin')st.lastN=k;
 const gm=(st.guardS?.5:1)*(st.kyuT>0?1.35:1);st.guardS=false;
 const dodgeS=!!(st.kawS&&m.h.some(h=>h>0));if(dodgeS)st.kawS=false;
 if(!dodgeS)for(const h of m.h)st.hs=Math.max(0,st.hs-Math.max(1,Math.round(h*gm)));
 if(m.summon){st.bunta={hp:TOAD.hp};st.toadUsed=true;}
 if(m.stun&&rnd()<m.stun){if(CFG.imunidade&&st.immS){}else st.stunS=m.stunN;}}
function toadShot(st,kind){ /* em cima do sapo: kunai(6)/shuriken(14) do Naruto e depois o Teppodama (14) */
 const gm=st.guardS?.5:1;st.guardS=false;if(st.kawS)st.kawS=false;else st.hs=Math.max(0,st.hs-Math.max(1,Math.round((kind==='nkunai'?TOAD.throwKunai:TOAD.throwShuriken)*gm)));if(st.hs>0)st.hs=Math.max(0,st.hs-TOAD.shot);}
function afterNaru(st){if(st.toadCD>0)st.toadCD--;if(st.seal2T>0){st.seal2T--;st.hs=Math.max(1,st.hs-3);st.cs=Math.min(100,st.cs+15);}else if(st.sealT>0){st.sealT--;st.hs=Math.max(1,st.hs-2);st.cs=Math.min(100,st.cs+10);}
 st.cs=Math.min(100,st.cs+CFG_TUNE.regS);st.cn=Math.min(100,st.cn+CFG_TUNE.regN);if(st.kyuT>0){st.hn=Math.min(100,st.hn+8);st.kyuT--;}}
/* IA do jogo para o Naruto (sem a correcao ela ignora o proprio chakra) */
function naruAI(st){if(st.bunta)return rnd()<.5?'nkunai':'nshuriken';if(!st.kawN&&st.kuN<KAW_MAX&&st.cn>=10&&st.hn<80&&rnd()<(st.hn<50?.3:.12))return'nkawarimi';if(!st.kyuUsed&&st.hn<=40)return'kyuubi';
 const r=rnd(),p=r<.26?'rasengan':r<.48?'bunshin':r<.66?'uzumaki':r<.8?'kamikaze':r<.9?'kuchiyose':r<.96?'oiroke':'harem';
 if(p==='kuchiyose'&&!toadOK(st))return 'rasengan';
 if(CFG.iaChakra&&NM[p].c>st.cn){const ok=NAR_MOVES.filter(k=>NM[k].c<=st.cn&&(k!=='kuchiyose'||toadOK(st)));return ok.length&&rnd()<.75?ok[Math.floor(rnd()*ok.length)]:'C';}return p;}
/* estrategias do jogador Naruto */
const NAR={
 esquivador:st=>{if(!st.bunta&&!st.kawN&&st.kuN<KAW_MAX&&st.cn>=10&&st.hn<60)return'nkawarimi';return NAR.forte(st);},
 aleatorio:st=>{if(st.bunta)return rnd()<.5?'nkunai':'nshuriken';if(!st.kyuUsed&&st.hn<=50)return'kyuubi';const pool=NAR_MOVES.filter(k=>NM[k].c<=st.cn&&(k!=='kuchiyose'||toadOK(st)));return pool.length?pool[Math.floor(rnd()*pool.length)]:'C';},
 forte:st=>{if(st.bunta)return'nshuriken';if(!st.kyuUsed&&st.hn<=50)return'kyuubi';const pool=['rasengan','bunshin','uzumaki','kamikaze','kuchiyose'].filter(k=>NM[k].c<=st.cn&&(k!=='kuchiyose'||toadOK(st)));if(!pool.length)return'C';return pool.sort((a,b)=>tot(b)/NM[b].c-tot(a)/NM[a].c)[0];},
 haremspam:st=>{if(st.bunta)return'nshuriken';if(!st.kyuUsed&&st.hn<=50)return'kyuubi';if(st.stunS<=0&&NM.harem.c<=st.cn)return'harem';return NAR.forte(st);},
 kuchiyose:st=>{if(st.bunta)return'nshuriken';if(!st.kyuUsed&&st.hn<=50)return'kyuubi';if(NM.kuchiyose.c<=st.cn&&toadOK(st))return'kuchiyose';return NAR.forte(st);}};
/* ---------- uma rodada de acao do Naruto (IA ou jogador): devolve nada, altera o estado ---------- */
function naruTurn(st,pick){
 if(st.stunN){st.stunN=false;st.immN=true;st.cn=Math.min(100,st.cn+15);st.cs=Math.min(100,st.cs+10);return;}
 if(!st.isNarutoPlayer&&((st.sealT>0&&rnd()<.3)||(st.seal2T>0&&rnd()<.4))){ /* desvio do selo */
  if(st.seal2T>0){st.seal2T--;st.hs=Math.max(1,st.hs-3);st.cs=Math.min(100,st.cs+15);}else{st.sealT--;st.hs=Math.max(1,st.hs-2);st.cs=Math.min(100,st.cs+10);}
  st.cn=Math.min(100,st.cn+15);st.cs=Math.min(100,st.cs+10);return;}
 st.immN=false;const k=pick(st);
 if(k==='C'){st.cn=Math.min(100,st.cn+25);afterNaru(st);return;}
 if(k==='nkawarimi'){st.cn=Math.max(0,st.cn-10);st.kawN=true;st.kuN++;afterNaru(st);return;}
 if(k==='nkunai'||k==='nshuriken'){toadShot(st,k);afterNaru(st);return;}
 naruAct(st,k);afterNaru(st);}
/* ---------- luta: jogador = Sasuke, IA = Naruto ---------- */
function fightSasukePlayer(strat){const st=newState();
 while(st.hs>0&&st.hn>0&&st.turns<200){st.turns++;
  const a=SAS[strat](st);if(a==='C')SAS_CONC(st);else if(a==='D')SAS_DEF(st);else if(a==='K'){st.cs=Math.max(0,st.cs-10);st.kawS=true;st.kuS++;}else sasukeAct(st,a);
  if(st.burning&&st.hn>0)st.hn=Math.max(0,st.hn-2);
  if(st.hn<=0)break;
  let again=true;while(again&&st.hn>0&&st.hs>0){again=false;naruTurn(st,naruAI);
   if(st.stunS>0){st.stunS--;if(st.stunS===0)st.immS=true;again=true;}else st.immS=false;}}
 return{win:st.hn<=0&&st.hs>0?'S':st.hs<=0?'N':'T',turns:st.turns,left:st.hs};}
/* ---------- luta: jogador = Naruto, IA = Sasuke ---------- */
function fightNarutoPlayer(strat){const st=newState();st.isNarutoPlayer=true;
 while(st.hs>0&&st.hn>0&&st.turns<200){st.turns++;
  naruTurn(st,NAR[strat]);if(st.hs<=0)break;
  if(st.stunS>0){st.stunS--;if(st.stunS===0)st.immS=true;st.cs=Math.min(100,st.cs+10);continue;}
  st.immS=false;const a=aiSasuke(st);if(a==='C')SAS_CONC(st);else if(a==='K'){st.cs=Math.max(0,st.cs-10);st.kawS=true;st.kuS++;}else sasukeAct(st,a);if(st.burning&&st.hn>0)st.hn=Math.max(0,st.hn-2);}
 return{win:st.hs<=0&&st.hn>0?'N':st.hn<=0?'S':'T',turns:st.turns,left:st.hn};}
/* ---------- relatorio ---------- */
function run(title,fn,strats){console.log('\n'+title);for(const s of strats){const w={S:0,N:0,T:0};let turns=0,left=0,wins=0;for(let i=0;i<N;i++){const r=fn(s);w[r.win]++;turns+=r.turns;if(r.win!=='T'){left+=r.left;wins++;}}
 console.log(' '+s.padEnd(10)+' Sasuke '+(100*w.S/N).toFixed(0).padStart(3)+'% | Naruto '+(100*w.N/N).toFixed(0).padStart(3)+'% | turnos '+(turns/N).toFixed(1).padStart(4)+(wins?' | vida do vencedor '+(left/wins).toFixed(0):''));}}
function relatorio(nome,cfg){CFG=cfg;console.log('\n=== '+nome+' ('+JSON.stringify(cfg)+') ===');
 run('Voce joga de SASUKE contra a IA do Naruto:',fightSasukePlayer,Object.keys(SAS));
 run('Voce joga de NARUTO contra a IA do Sasuke:',fightNarutoPlayer,Object.keys(NAR));}
const modo=process.argv[3]||'todos';
if(modo==='todos'||modo==='antes'){applyTune(ANTES);relatorio('ANTES DAS CORRECOES (regras e numeros antigos)',{imunidade:false,iaChakra:false,iaEsperta:false});applyTune({'toad.hp':40,'toad.shot':6,'toad.throwKunai':3,'toad.throwShuriken':6,'toad.once':1,'kagesh.c':16,'soushuken.c':17,'cfg.regS':15});}
if(modo==='todos'||modo==='atual'||modo==='novo')relatorio('JOGO ATUAL (com as correcoes)'+(process.argv[4]?' + '+process.argv[4]:''),{imunidade:true,iaChakra:true,iaEsperta:true});
