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
function moveByName(n){const id=MOVE_ALIAS[n];if(id)return MOVES[id];for(const k in MOVES)if(MOVES[k].name===n)return MOVES[k];return null;}

/* Fichas de personagem: nivel atual, atributos-base e elementos de afinidade. Os golpes liberados saem de MOVES (lvl <= nivel). */
const CHARS={
 sasuke:{id:'sasuke',name:'Sasuke Uchiha',level:10,hp:100,ck:100,afin:['fogo','raio'],extras:['yin']},
 naruto:{id:'naruto',name:'Naruto Uzumaki',level:10,hp:100,ck:100,afin:['vento'],extras:['yang']}};
function moveUnlocked(charId,moveId){const m=MOVES[moveId],c=CHARS[charId];return !m||!c||m.lvl<=c.level;}
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
function elemMult(att,defCharId){const c=CHARS[defCharId];if(!att||!c)return 1;const m=elemMatch(att,c.afin);return m>0?ELEM_ADV:m<0?ELEM_DIS:1;}
function elemMsg(mult){return mult>1?'Vantagem elemental! (+40%)':mult<1?'Elemento fraco contra o alvo (-25%)':'';}
