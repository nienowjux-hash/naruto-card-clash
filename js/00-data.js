/* ---------- DADOS DO RPG: elementos, golpes e fichas de personagem ----------
   Aqui fica o que e "conteudo". A batalha le daqui: quem pode usar cada golpe (nivel), de que elemento ele e, que tipo de tecnica e.
   Arquivo sem dependencias: carrega antes de todo o resto. */

/* Elementos (natureza de chakra). 'base' = um dos 5 basicos; 'mix' = combinacao (kekkei genkai); 'tri' = kekkei tota. */
const ELEMENTS={
 neutro:{name:'Neutro',col:'#aab0c8',tipo:'base'},
 fogo:{name:'Fogo',col:'#ff7a2a',tipo:'base'},
 agua:{name:'Água',col:'#4aa8ff',tipo:'base'},
 terra:{name:'Terra',col:'#b8894a',tipo:'base'},
 vento:{name:'Vento',col:'#7fe0c0',tipo:'base'},
 raio:{name:'Raio',col:'#f2e04a',tipo:'base'},
 madeira:{name:'Madeira',col:'#5cb860',tipo:'mix',de:['terra','agua']},
 gelo:{name:'Gelo',col:'#a8e8ff',tipo:'mix',de:['agua','vento']},
 lava:{name:'Lava',col:'#e0482a',tipo:'mix',de:['fogo','terra']},
 ebulicao:{name:'Ebulição',col:'#d89ae8',tipo:'mix',de:['fogo','agua']},
 magnetismo:{name:'Magnetismo',col:'#9aa0b8',tipo:'mix',de:['vento','terra']},
 queima:{name:'Queima',col:'#ffb860',tipo:'mix',de:['fogo','vento']},
 poeira:{name:'Poeira',col:'#d8c8a0',tipo:'tri',de:['fogo','vento','terra']},
 yin:{name:'Yin',col:'#c0509a',tipo:'esp'},
 yang:{name:'Yang',col:'#ffe08a',tipo:'esp'}};

/* Golpes: elemento, tipo (ninjutsu / genjutsu / taijutsu / arma / invocacao / suporte) e nivel minimo para liberar. */
const MOVES={
 kunai:{name:'Kunai',elem:'neutro',tipo:'arma',lvl:1},
 shuriken:{name:'Shuriken',elem:'neutro',tipo:'arma',lvl:1},
 soco:{name:'Soco',elem:'neutro',tipo:'taijutsu',lvl:1},
 chute:{name:'Chute',elem:'neutro',tipo:'taijutsu',lvl:1},
 chidori:{name:'Chidori',elem:'raio',tipo:'ninjutsu',lvl:1},
 katon:{name:'Katon: Bola de Fogo',elem:'fogo',tipo:'ninjutsu',lvl:1},
 amaterasu:{name:'Amaterasu',elem:'fogo',tipo:'ninjutsu',lvl:4},
 copy:{name:'Copiar Técnica (Sharingan)',elem:'neutro',tipo:'suporte',lvl:3},
 cop_rasengan:{name:'Cópia: Rasengan',elem:'vento',tipo:'ninjutsu',lvl:3},
 cop_bunshin:{name:'Cópia: Kage Bunshin',elem:'neutro',tipo:'ninjutsu',lvl:3},
 genjutsu:{name:'Genjutsu Sharingan',elem:'yin',tipo:'genjutsu',lvl:2},
 shishi:{name:'Shishi Rendan',elem:'neutro',tipo:'taijutsu',lvl:3},
 selo:{name:'Selo Amaldiçoado (Nível 1)',elem:'neutro',tipo:'suporte',lvl:5},
 selo2:{name:'Selo Amaldiçoado (Nível 2)',elem:'neutro',tipo:'suporte',lvl:8},
 selochidori:{name:'Chidori Sombrio (Nível 2)',elem:'raio',tipo:'ninjutsu',lvl:8},
 soushuken:{name:'Sōshūken no Jutsu',elem:'neutro',tipo:'arma',lvl:4},
 kagesh:{name:'Shuriken Kage no Jutsu',elem:'neutro',tipo:'arma',lvl:4},
 kawarimi:{name:'Kawarimi',elem:'neutro',tipo:'suporte',lvl:1},
 /* Naruto */
 rasengan:{name:'Rasengan',elem:'vento',tipo:'ninjutsu',lvl:1},
 bunshin:{name:'Kage Bunshin',elem:'neutro',tipo:'ninjutsu',lvl:1},
 uzumaki:{name:'Uzumaki Rendan',elem:'neutro',tipo:'taijutsu',lvl:2},
 oiroke:{name:'Oiroke no Jutsu',elem:'neutro',tipo:'genjutsu',lvl:1},
 harem:{name:'Harem no Jutsu',elem:'neutro',tipo:'genjutsu',lvl:2},
 kamikaze:{name:'Kamikaze',elem:'vento',tipo:'ninjutsu',lvl:3},
 kuchiyose:{name:'Kuchiyose: Gama Bunta',elem:'neutro',tipo:'invocacao',lvl:4},
 kyuubi:{name:'Chakra da Kyūbi',elem:'yang',tipo:'suporte',lvl:6}};
/* alias para nomes que aparecem no menu com texto diferente do cadastro */
const MOVE_ALIAS={'Rasengan da Kyūbi':'rasengan','Kawarimi no Jutsu':'kawarimi'};
function moveIdByName(n){if(MOVE_ALIAS[n])return MOVE_ALIAS[n];for(const k in MOVES)if(MOVES[k].name===n)return k;return null;}
function moveByName(n){const id=MOVE_ALIAS[n];if(id)return MOVES[id];for(const k in MOVES)if(MOVES[k].name===n)return MOVES[k];return null;}

/* Fichas de personagem: atributos-base e elementos de afinidade. Nivel, XP e golpes aprendidos ficam em PROG (progresso salvo). */
const CHARS={
 sasuke:{id:'sasuke',name:'Sasuke Uchiha',hp:100,ck:100,afin:['fogo','raio'],extras:['yin']},
 naruto:{id:'naruto',name:'Naruto Uzumaki',hp:100,ck:100,afin:['vento'],extras:['yang']}};
function elemChip(m){if(!m||!m.elem||m.elem==='neutro')return '';const e=ELEMENTS[m.elem];return `<em class="el" style="--ec:${e.col}">${e.name}</em>`;}

/* ---------- Vantagem entre elementos ----------
   Ciclo dos 5 basicos (igual ao anime): Fogo > Vento > Raio > Terra > Agua > Fogo. Quem ataca com vantagem causa mais dano.
   Elementos combinados e Poeira valem pelos seus componentes: vantagem so se algum componente vence e nenhum perde; o contrario da desvantagem; misto = neutro. Yin/Yang/Neutro nao entram no ciclo. */
const ELEM_BEATS={fogo:'vento',vento:'raio',raio:'terra',terra:'agua',agua:'fogo'};
const ELEM_ADV=1.4,ELEM_DIS=.75;
function elemParts(e){const x=ELEMENTS[e];return x&&x.de?x.de:(ELEM_BEATS[e]?[e]:[]);}
function elemMatch(att,def){ /* >0 vantagem, <0 desvantagem, 0 neutro */
 const A=elemParts(att),D=Array.isArray(def)?def.flatMap(elemParts):elemParts(def);let w=false,l=false;
 for(const a of A)for(const d of D){if(ELEM_BEATS[a]===d)w=true;if(ELEM_BEATS[d]===a)l=true;}
 return w&&!l?1:l&&!w?-1:0;}
function elemMult(att,defCharId){const c=CHARS[defCharId];if(!att||!c)return 1;const a=CAMP.active,af=(a&&a.afin&&defCharId===(a.hero==='sasuke'?'naruto':'sasuke'))?a.afin:c.afin,m=elemMatch(att,af);return m>0?ELEM_ADV:m<0?ELEM_DIS:1;}
function elemMsg(mult){return mult>1?'Vantagem elemental! (+40%)':mult<1?'Elemento fraco contra o alvo (-25%)':'';}

/* ---------- Arvore de habilidades ----------
   Cada no e um golpe: x/y = posicao na tela, req = golpes que precisam estar aprendidos, pt = pontos de habilidade, d = descricao curta.
   base = ja nasce aprendido (sem custo); start = aprendido no nivel 1. O nivel minimo vem de MOVES[id].lvl. */
const TREES={
 sasuke:[
  {id:'soco',x:0,y:0,req:[],pt:0,base:1,d:'Avança e acerta um soco no rosto.'},
  {id:'shishi',x:0,y:1,req:['soco'],pt:1,d:'Barragem de Leões: combo aéreo de taijutsu copiado de Rock Lee.'},
  {id:'shuriken',x:1,y:0,req:[],pt:0,base:1,d:'Lança estrelas ninja que giram até o alvo.'},
  {id:'soushuken',x:1,y:1,req:['shuriken'],pt:1,d:'Shuriken e kunai guiados por fios invisíveis atacam de ângulos surpresa.'},
  {id:'kagesh',x:1,y:2,req:['soushuken'],pt:1,d:'Uma shuriken escondida na sombra de outra surpreende o alvo.'},
  {id:'katon',x:2,y:0,req:[],pt:0,start:1,d:'Uma enorme bola de fogo sai da boca e explode no alvo, causando queimadura.'},
  {id:'amaterasu',x:2,y:1,req:['katon'],pt:1,d:'Chamas negras que não se apagam. O olho sangra e o alvo queima.'},
  {id:'chidori',x:3,y:0,req:[],pt:0,start:1,d:'Relâmpagos concentrados na mão: perfura o inimigo em alta velocidade.'},
  {id:'genjutsu',x:4,y:0,req:[],pt:1,d:'Prende o alvo numa ilusão: ele perde o próximo turno.'},
  {id:'copy',x:4,y:1,req:['genjutsu'],pt:1,d:'Sharingan: copia o jutsu do inimigo para usar uma vez (Rasengan e Kage Bunshin).'},
  {id:'selo',x:5,y:0,req:[],pt:1,d:'Selo Amaldiçoado nível 1: mais dano, chakra e esquiva por 3 turnos.'},
  {id:'selo2',x:5,y:1,req:['selo'],pt:2,d:'Transformação nível 2: poder maior e libera o Chidori Sombrio.'},
  {id:'selochidori',x:4,y:2,req:['chidori','selo2'],pt:2,d:'O Chidori negro e roxo da transformação. Dano alto e fatality.'}],
 naruto:[
  {id:'bunshin',x:0,y:0,req:[],pt:0,start:1,d:'Clones das sombras atacam em sequência.'},
  {id:'uzumaki',x:0,y:1,req:['bunshin'],pt:1,d:'Clones chutam o inimigo para o alto e o Naruto desce com o calcanhar.'},
  {id:'kuchiyose',x:0,y:2,req:['bunshin'],pt:2,d:'Invoca o sapo chefe Gama Bunta (uma vez por luta).'},
  {id:'rasengan',x:1,y:0,req:[],pt:0,start:1,d:'Esfera giratória de chakra de Vento no inimigo.'},
  {id:'kamikaze',x:1,y:1,req:['rasengan'],pt:1,d:'Gira como um tornado com clones e atravessa o inimigo.'},
  {id:'kyuubi',x:1,y:2,req:['rasengan'],pt:2,d:'Chakra da Kyūbi: manto de raposa, cura e +35% de dano.'},
  {id:'oiroke',x:2,y:0,req:[],pt:0,start:1,d:'Vira uma garota para distrair o inimigo: ele pode perder o turno.'},
  {id:'harem',x:2,y:1,req:['oiroke'],pt:1,d:'Várias garotas com clones: quase sempre o inimigo perde o turno.'}]};
const MAX_LEVEL=10,PROG_KEY='rpgProgV1';
const xpNeed=lv=>50*lv; /* XP para sair do nivel lv */
function progDefault(){const p={};for(const c in TREES)p[c]={level:1,xp:0,pts:0,learned:TREES[c].filter(n=>n.base||n.start).map(n=>n.id)};return p;}
let PROG=progDefault();
try{const j=JSON.parse(localStorage.getItem(PROG_KEY)||'null');if(j)for(const c in PROG)if(j[c])Object.assign(PROG[c],j[c]);}catch(e){}
function saveProg(){try{localStorage.setItem(PROG_KEY,JSON.stringify(PROG));}catch(e){}}
function treeNode(charId,id){return (TREES[charId]||[]).find(n=>n.id===id);}
/* golpe liberado? Copias valem se 'copy' foi aprendido; golpes fora da arvore sao sempre livres */
function moveUnlocked(charId,id){const P=PROG[charId];if(!P)return true;if(id==='cop_rasengan'||id==='cop_bunshin')id='copy';return !treeNode(charId,id)||P.learned.includes(id);}
/* motivo pelo qual um no ainda nao pode ser aprendido ('' = pode) */
function learnBlock(charId,id){const P=PROG[charId],n=treeNode(charId,id),m=MOVES[id];if(!n||!P)return 'Golpe inexistente';if(P.learned.includes(id))return 'Já aprendido';
 if(m.lvl>P.level)return 'Precisa do nível '+m.lvl;const miss=n.req.filter(r=>!P.learned.includes(r));if(miss.length)return 'Antes aprenda: '+miss.map(r=>MOVES[r].name).join(', ');
 if(P.pts<n.pt)return 'Faltam pontos ('+n.pt+' necessários)';return '';}
function learnSkill(charId,id){if(learnBlock(charId,id))return false;const P=PROG[charId];P.pts-=treeNode(charId,id).pt;P.learned.push(id);saveProg();return true;}
/* da XP ao personagem; cada nivel novo da 1 ponto de habilidade. Devolve quantos niveis subiu. */
function awardXp(charId,amount){const P=PROG[charId];if(!P)return 0;let up=0;if(P.level>=MAX_LEVEL){saveProg();return 0;}P.xp+=amount;while(P.level<MAX_LEVEL&&P.xp>=xpNeed(P.level)){P.xp-=xpNeed(P.level);P.level++;P.pts++;up++;}if(P.level>=MAX_LEVEL)P.xp=0;saveProg();return up;}
function resetProg(){PROG=progDefault();saveProg();}

/* ---------- Itens, equipamentos e mochila ----------
   slot: arma / corpo / acc (equipaveis) ou cons (consumivel). rar: 1 comum, 2 incomum, 3 raro.
   stats: hp (vida maxima extra), atk (+% de dano causado), def (-% de dano recebido), elem+pct (+% de dano de um elemento).
   use: efeito do consumivel (hp / ck). only: lista de personagens que podem equipar. */
const SLOTS={arma:'Arma',corpo:'Corpo',acc:'Acessório'};
const ITEMS={
 kunai_ferro:{name:'Kunai de Ferro',slot:'arma',rar:1,g:'刃',stats:{atk:.05},d:'Uma kunai comum, bem afiada.'},
 lamina_chakra:{name:'Lâmina de Chakra',slot:'arma',rar:2,g:'刃',stats:{atk:.08},d:'Lâmina que conduz o chakra do usuário.'},
 kunai_tri:{name:'Kunai Trifurcado',slot:'arma',rar:3,g:'刃',stats:{atk:.10,elem:'vento',pct:.10},d:'Kunai de três pontas, leve e rápida.',only:['naruto']},
 kusanagi:{name:'Kusanagi',slot:'arma',rar:3,g:'剣',stats:{atk:.12,elem:'raio',pct:.15},d:'A espada que conduz relâmpagos.',only:['sasuke']},
 colete:{name:'Colete Shinobi',slot:'corpo',rar:1,g:'衣',stats:{hp:8,def:.06},d:'Colete tático padrão de Konoha.'},
 roupa_peso:{name:'Roupa de Treino Pesada',slot:'corpo',rar:2,g:'衣',stats:{hp:15},d:'Pesos nas roupas fortalecem o corpo.'},
 manto_nuvem:{name:'Manto da Nuvem Vermelha',slot:'corpo',rar:3,g:'衣',stats:{hp:10,def:.12},d:'Manto negro com nuvens vermelhas.'},
 bandana:{name:'Bandana de Konoha',slot:'acc',rar:1,g:'護',stats:{hp:6,def:.02},d:'Símbolo da vila escondida na folha.'},
 talisma_fogo:{name:'Talismã de Fogo',slot:'acc',rar:2,g:'火',stats:{elem:'fogo',pct:.15},d:'Reforça golpes de Fogo.'},
 talisma_agua:{name:'Talismã de Água',slot:'acc',rar:2,g:'水',stats:{elem:'agua',pct:.15},d:'Reforça golpes de Água.'},
 talisma_terra:{name:'Talismã de Terra',slot:'acc',rar:2,g:'土',stats:{elem:'terra',pct:.15},d:'Reforça golpes de Terra.'},
 talisma_vento:{name:'Talismã de Vento',slot:'acc',rar:2,g:'風',stats:{elem:'vento',pct:.15},d:'Reforça golpes de Vento.'},
 talisma_raio:{name:'Talismã de Raio',slot:'acc',rar:2,g:'雷',stats:{elem:'raio',pct:.15},d:'Reforça golpes de Raio.'},
 amuleto_sorte:{name:'Amuleto da Sorte',slot:'acc',rar:3,g:'福',stats:{hp:20},d:'Dizem que protege quem o carrega.'},
 pilula_vida:{name:'Pílula de Soldado',slot:'cons',rar:1,g:'薬',use:{hp:30},d:'Recupera 30 de vida. Gasta o turno.'},
 pilula_ck:{name:'Pílula de Chakra',slot:'cons',rar:1,g:'気',use:{ck:30},d:'Recupera 30 de chakra. Gasta o turno.'},
 pergaminho_med:{name:'Pergaminho Médico',slot:'cons',rar:3,g:'巻',use:{hp:60},d:'Recupera 60 de vida. Gasta o turno.'}};
const RARITY={1:{name:'Comum',col:'#aab0c8'},2:{name:'Incomum',col:'#5cc878'},3:{name:'Raro',col:'#b070ff'}};
const INV_KEY='rpgInvV1';
function invDefault(){return{ryo:0,bag:{kunai_ferro:1,colete:1,bandana:1,pilula_vida:3,pilula_ck:3},eq:{sasuke:{},naruto:{}}};}
let INV=invDefault();
try{const j=JSON.parse(localStorage.getItem(INV_KEY)||'null');if(j){INV.ryo=j.ryo||0;INV.bag=j.bag||INV.bag;INV.eq=Object.assign({sasuke:{},naruto:{}},j.eq||{});}}catch(e){}
function saveInv(){try{localStorage.setItem(INV_KEY,JSON.stringify(INV));}catch(e){}}
function bagQty(id){return INV.bag[id]||0;}
function addItem(id,n){INV.bag[id]=bagQty(id)+(n||1);saveInv();}
function canEquip(charId,id){const it=ITEMS[id];return !!it&&it.slot!=='cons'&&(!it.only||it.only.includes(charId));}
/* equipa tirando da mochila; o item que estava no slot volta para a mochila */
function equipItem(charId,id){if(!canEquip(charId,id)||bagQty(id)<1)return false;const it=ITEMS[id],old=INV.eq[charId][it.slot];if(old)INV.bag[old]=bagQty(old)+1;INV.bag[id]--;if(INV.bag[id]<=0)delete INV.bag[id];INV.eq[charId][it.slot]=id;saveInv();return true;}
function unequipItem(charId,slot){const id=INV.eq[charId][slot];if(!id)return false;addItem(id,1);delete INV.eq[charId][slot];saveInv();return true;}
/* soma dos bonus do que o personagem veste */
function statsOf(charId){const s={hp:0,atk:0,def:0,elem:{}};for(const slot in INV.eq[charId]||{}){const it=ITEMS[INV.eq[charId][slot]];if(!it||!it.stats)continue;const st=it.stats;s.hp+=st.hp||0;s.atk+=st.atk||0;s.def+=st.def||0;if(st.elem)s.elem[st.elem]=(s.elem[st.elem]||0)+(st.pct||0);}s.def=Math.min(.6,s.def);return s;}
function resetInv(){INV=invDefault();saveInv();}
/* sorteia um item de recompensa (pesos por raridade) */
function rollDrop(){const w={1:60,2:30,3:10},ids=Object.keys(ITEMS);let tot=0;const pool=ids.map(i=>{const x=w[ITEMS[i].rar]||1;tot+=x;return[i,x];});let r=Math.random()*tot;for(const[i,x]of pool){if((r-=x)<=0)return i;}return ids[0];}

/* ---------- Mapa da campanha ----------
   Locais ligados por caminhos. Um local de luta libera quando algum vizinho foi vencido (Konoha ja nasce vencida).
   enc: inimigo (hp/atk = escala sobre o valor base, afin = elementos do inimigo), scene = cenario da batalha, xp/ryo = recompensa. */
const MAP_W=1180,MAP_H=640;
const NODES={
 konoha:{name:'Konoha',kind:'vila',x:130,y:330,scene:'vila',d:'Sua vila. Prepare a equipe (habilidades e equipamentos) antes de partir.'},
 treino:{name:'Campo de Treino',kind:'luta',x:340,y:310,scene:'treino',lvl:1,xp:60,ryo:60,enc:{name:'Genin Rival',hp:.7,atk:.8,afin:['terra']},d:'Um campo aberto ao amanhecer, onde genins testam suas técnicas.'},
 floresta:{name:'Floresta da Morte',kind:'luta',x:550,y:160,scene:'floresta',lvl:2,xp:80,ryo:90,enc:{name:'Ninja Perdido',hp:.9,atk:.95,afin:['agua']},d:'Mata densa e perigosa. Quem entra sem preparo raramente volta.'},
 deserto:{name:'Deserto do Vento',kind:'luta',x:540,y:480,scene:'deserto',lvl:3,xp:100,ryo:120,enc:{name:'Ninja da Areia',hp:1,atk:1,afin:['terra']},d:'Dunas sem fim e um calor que drena o chakra.'},
 neve:{name:'Passo Nevado',kind:'luta',x:810,y:500,scene:'neve',lvl:4,xp:130,ryo:160,enc:{name:'Guardião do Gelo',hp:1.1,atk:1.05,afin:['gelo']},d:'Um desfiladeiro congelado vigiado por um ninja de gelo.'},
 vale:{name:'Vale do Fim',kind:'chefe',x:985,y:285,scene:'vale',lvl:6,xp:200,ryo:300,enc:{name:'Rival Final',hp:1.3,atk:1.15,afin:null},d:'O local do confronto final, entre as estátuas e a cachoeira.'}};
const EDGES=[['konoha','treino'],['treino','floresta'],['treino','deserto'],['floresta','vale'],['deserto','neve'],['neve','vale']];
const CAMP_KEY='rpgCampV1';
let CAMP={cleared:['konoha'],at:'konoha',active:null};
try{const j=JSON.parse(localStorage.getItem(CAMP_KEY)||'null');if(j){CAMP.cleared=j.cleared||CAMP.cleared;CAMP.at=j.at||CAMP.at;CAMP.active=j.active||null;}}catch(e){}
function saveCamp(){try{localStorage.setItem(CAMP_KEY,JSON.stringify(CAMP));}catch(e){}}
function nodeNeighbors(id){return EDGES.filter(e=>e.includes(id)).map(e=>e[0]===id?e[1]:e[0]);}
function nodeState(id){if(CAMP.cleared.includes(id))return'cleared';return nodeNeighbors(id).some(n=>CAMP.cleared.includes(n))?'open':'locked';}
function resetCamp(){CAMP={cleared:['konoha'],at:'konoha',active:null};saveCamp();}
