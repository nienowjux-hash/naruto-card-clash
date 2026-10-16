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
 kunai:{name:'Kunai',elem:'neutro',tipo:'arma',lvl:1,rar:1},
 shuriken:{name:'Shuriken',elem:'neutro',tipo:'arma',lvl:1,rar:1},
 soco:{name:'Soco',elem:'neutro',tipo:'taijutsu',lvl:1,rar:1},
 chute:{name:'Chute',elem:'neutro',tipo:'taijutsu',lvl:1,rar:1},
 chidori:{name:'Chidori',elem:'raio',tipo:'ninjutsu',lvl:14,rar:3},
 katon:{name:'Katon: Bola de Fogo',elem:'fogo',tipo:'ninjutsu',lvl:1,rar:2},
 amaterasu:{name:'Amaterasu',elem:'fogo',tipo:'ninjutsu',lvl:35,rar:5,futuro:true} /* guardado para o Sasuke adulto: fora do jogo por enquanto */,
 copy:{name:'Copiar Técnica (Sharingan)',elem:'neutro',tipo:'suporte',lvl:26,rar:3},
 cop_rasengan:{name:'Cópia: Rasengan',elem:'vento',tipo:'ninjutsu',lvl:26,rar:3},
 cop_bunshin:{name:'Cópia: Kage Bunshin',elem:'neutro',tipo:'ninjutsu',lvl:26,rar:3},
 genjutsu:{name:'Genjutsu Sharingan',elem:'yin',tipo:'genjutsu',lvl:6,rar:2},
 shishi:{name:'Shishi Rendan',elem:'neutro',tipo:'taijutsu',lvl:10,rar:2},
 selo:{name:'Selo Amaldiçoado (Nível 1)',elem:'neutro',tipo:'suporte',lvl:30,rar:4},
 selo2:{name:'Selo Amaldiçoado (Nível 2)',elem:'neutro',tipo:'suporte',lvl:40,rar:5},
 selochidori:{name:'Chidori Sombrio (Nível 2)',elem:'raio',tipo:'ninjutsu',lvl:45,rar:5},
 soushuken:{name:'Sōshūken no Jutsu',elem:'neutro',tipo:'arma',lvl:18,rar:2},
 kagesh:{name:'Shuriken Kage no Jutsu',elem:'neutro',tipo:'arma',lvl:22,rar:2},
 kawarimi:{name:'Kawarimi',elem:'neutro',tipo:'suporte',lvl:1,rar:1},
 /* Sakura */
 raikiri:{name:'Raikiri',elem:'raio',tipo:'ninjutsu',lvl:10,rar:3},
 cura:{name:'Cura Médica',elem:'yin',tipo:'suporte',lvl:1,rar:1},
 cura2:{name:'Cura Intensiva',elem:'yin',tipo:'suporte',lvl:12,rar:3},
 shannaro:{name:'Shannarō! Soco de Chakra',elem:'terra',tipo:'taijutsu',lvl:6,rar:2},
 /* Naruto */
 rasengan:{name:'Rasengan',elem:'vento',tipo:'ninjutsu',lvl:14,rar:3},
 bunshin:{name:'Kage Bunshin',elem:'neutro',tipo:'ninjutsu',lvl:1,rar:1},
 uzumaki:{name:'Uzumaki Rendan',elem:'neutro',tipo:'taijutsu',lvl:8,rar:2},
 oiroke:{name:'Oiroke no Jutsu',elem:'neutro',tipo:'genjutsu',lvl:3,rar:2},
 harem:{name:'Harem no Jutsu',elem:'neutro',tipo:'genjutsu',lvl:10,rar:3},
 kamikaze:{name:'Kamikaze',elem:'vento',tipo:'ninjutsu',lvl:20,rar:3},
 kuchiyose:{name:'Kuchiyose: Gama Bunta',elem:'neutro',tipo:'invocacao',lvl:28,rar:4},
 kyuubi:{name:'Chakra da Kyūbi',elem:'yang',tipo:'suporte',lvl:40,rar:5}};
/* alias para nomes que aparecem no menu com texto diferente do cadastro */
const MOVE_ALIAS={'Rasengan da Kyūbi':'rasengan','Kawarimi no Jutsu':'kawarimi'};
function moveIdByName(n){if(MOVE_ALIAS[n])return MOVE_ALIAS[n];for(const k in MOVES)if(MOVES[k].name===n)return k;return null;}
function moveByName(n){const id=MOVE_ALIAS[n];if(id)return MOVES[id];for(const k in MOVES)if(MOVES[k].name===n)return MOVES[k];return null;}

/* Fichas de personagem: atributos-base e elementos de afinidade. Nivel, XP e golpes aprendidos ficam em PROG (progresso salvo). */
const CHARS={
 sasuke:{id:'sasuke',name:'Sasuke Uchiha',rar:2,hp:100,ck:100,afin:['fogo','raio'],extras:['yin']},
 naruto:{id:'naruto',name:'Naruto Uzumaki',rar:2,hp:100,ck:100,afin:['vento'],extras:['yang']},
 sakura:{id:'sakura',name:'Sakura Haruno',rar:1,hp:100,ck:100,afin:['terra'],extras:['yin']},
 kakashi:{id:'kakashi',name:'Kakashi Hatake',rar:3,hp:100,ck:100,afin:['raio','terra'],extras:['yang']}};
/* raridade do personagem: comum a lendario */
function charRar(id){const r=RARITY[(CHARS[id]||{}).rar||1];return `<em class="crar" style="--rc:${r.col}">${r.name}</em>`;}
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
function elemMult(att,defCharId){const c=CHARS[defCharId];if(!att||!c)return 1;const a=CAMP.active,af=(a&&a.afin&&defCharId===(a.hero==='naruto'?'sasuke':'naruto'))?a.afin:c.afin,m=elemMatch(att,af);return m>0?ELEM_ADV:m<0?ELEM_DIS:1;}
function elemMsg(mult){return mult>1?'Vantagem elemental! (+40%)':mult<1?'Elemento fraco contra o alvo (-25%)':'';}

/* ---------- Arvore de habilidades ----------
   Cada no e um golpe: x/y = posicao na tela, req = golpes que precisam estar aprendidos, pt = pontos de habilidade, d = descricao curta.
   base = ja nasce aprendido (sem custo); start = aprendido no nivel 1. O nivel minimo vem de MOVES[id].lvl. */
const TREES={
 sasuke:[
  {id:'soco',x:0,y:0,req:[],pt:0,base:1,d:'Avança e acerta um soco no rosto.'},
  {id:'chute',x:0,y:1,req:[],pt:0,base:1,d:'Salta e acerta um chute giratório.'},
  {id:'shishi',x:0,y:2,req:['soco','chute'],pt:2,d:'Barragem de Leões: combo aéreo de taijutsu copiado de Rock Lee.'},
  {id:'shuriken',x:1,y:0,req:[],pt:0,base:1,d:'Lança estrelas ninja que giram até o alvo.'},
  {id:'soushuken',x:1,y:1,req:['shuriken'],pt:2,d:'Shuriken e kunai guiados por fios invisíveis atacam de ângulos surpresa.'},
  {id:'kagesh',x:1,y:2,req:['soushuken'],pt:2,d:'Uma shuriken escondida na sombra de outra surpreende o alvo.'},
  {id:'katon',x:2,y:0,req:[],pt:0,start:1,d:'Uma enorme bola de fogo sai da boca e explode no alvo, causando queimadura.'},
  {id:'chidori',x:3,y:0,req:[],pt:4,d:'Relâmpagos concentrados na mão: perfura o inimigo em alta velocidade.'},
  {id:'genjutsu',x:4,y:0,req:[],pt:2,d:'Prende o alvo numa ilusão: ele perde o próximo turno.'},
  {id:'copy',x:4,y:1,req:['genjutsu'],pt:4,d:'Sharingan: copia o jutsu do inimigo para usar uma vez (Rasengan e Kage Bunshin).'},
  {id:'selo',x:5,y:0,req:[],pt:7,d:'Selo Amaldiçoado nível 1: mais dano, chakra e esquiva por 3 turnos.'},
  {id:'selo2',x:5,y:1,req:['selo'],pt:12,d:'Transformação nível 2: poder maior e libera o Chidori Sombrio.'},
  {id:'selochidori',x:4,y:2,req:['chidori','selo2'],pt:12,d:'O Chidori negro e roxo da transformação. Dano alto e fatality.'},
  {id:'kunai',x:6,y:0,req:[],pt:0,base:1,d:'Arremessa um kunai direto no alvo.'},
  {id:'kawarimi',x:6,y:1,req:[],pt:0,base:1,d:'Jutsu de Substituição: troca de lugar com um tronco e evita por completo o próximo golpe, sem o inimigo perceber (2 usos por luta).'}],
 naruto:[
  {id:'bunshin',x:0,y:0,req:[],pt:0,start:1,d:'Clones das sombras atacam em sequência.'},
  {id:'uzumaki',x:0,y:1,req:['bunshin'],pt:2,d:'Clones chutam o inimigo para o alto e o Naruto desce com o calcanhar.'},
  {id:'kuchiyose',x:0,y:2,req:['bunshin'],pt:7,d:'Invoca o sapo chefe Gama Bunta (uma vez por luta).'},
  {id:'rasengan',x:1,y:0,req:[],pt:4,d:'Esfera giratória de chakra de Vento no inimigo.'},
  {id:'kamikaze',x:1,y:1,req:['rasengan'],pt:4,d:'Gira como um tornado com clones e atravessa o inimigo.'},
  {id:'kyuubi',x:1,y:2,req:['rasengan'],pt:12,d:'Chakra da Kyūbi: manto de raposa, cura e +35% de dano.'},
  {id:'oiroke',x:2,y:0,req:[],pt:2,d:'Vira uma garota para distrair o inimigo: ele pode perder o turno.'},
  {id:'harem',x:2,y:1,req:['oiroke'],pt:4,d:'Várias garotas com clones: quase sempre o inimigo perde o turno.'},
  {id:'kawarimi',x:3,y:0,req:[],pt:0,base:1,d:'Jutsu de Substituição: troca de lugar com um tronco e evita por completo o próximo golpe, sem o inimigo perceber (2 usos por luta).'},
  {id:'soco',x:3,y:1,req:[],pt:0,base:1,d:'Avança e acerta um soco no rosto.'},
  {id:'chute',x:3,y:2,req:[],pt:0,base:1,d:'Salta e acerta um chute.'},
  {id:'kunai',x:4,y:0,req:[],pt:0,base:1,d:'Arremessa um kunai direto no alvo.'},
  {id:'shuriken',x:4,y:1,req:[],pt:0,base:1,d:'Lança três shurikens seguidas.'}],
 sakura:[
  {id:'soco',x:0,y:0,req:[],pt:0,base:1,d:'Avança e acerta um soco no rosto.'},
  {id:'chute',x:0,y:1,req:[],pt:0,base:1,d:'Salta e acerta um chute.'},
  {id:'kunai',x:1,y:0,req:[],pt:0,base:1,d:'Arremessa um kunai direto no alvo.'},
  {id:'shuriken',x:1,y:1,req:[],pt:0,base:1,d:'Lança estrelas ninja que giram até o alvo.'},
  {id:'kawarimi',x:2,y:0,req:[],pt:0,base:1,d:'Jutsu de Substituição: troca de lugar com um tronco e evita por completo o próximo golpe (2 usos por luta).'},
  {id:'cura',x:3,y:0,req:[],pt:0,start:1,d:'Ninjutsu médico: as palmas brilham em verde e fecham os ferimentos. Recupera 30 de vida.'},
  {id:'cura2',x:3,y:1,req:['cura'],pt:4,d:'Cura Intensiva: muito mais chakra nas mãos. Recupera 65 de vida.'},
  {id:'shannaro',x:4,y:0,req:[],pt:3,d:'Concentra todo o chakra no punho (controle perfeito) e acerta um soco devastador.'}],
 kakashi:[
  {id:'soco',x:0,y:0,req:[],pt:0,base:1,d:'Avança e acerta um soco no rosto.'},
  {id:'chute',x:0,y:1,req:[],pt:0,base:1,d:'Salta e acerta um chute.'},
  {id:'kunai',x:1,y:0,req:[],pt:0,base:1,d:'Arremessa um kunai direto no alvo.'},
  {id:'shuriken',x:1,y:1,req:[],pt:0,base:1,d:'Lança estrelas ninja que giram até o alvo.'},
  {id:'kawarimi',x:2,y:0,req:[],pt:0,base:1,d:'Jutsu de Substituição: troca de lugar com um tronco e evita por completo o próximo golpe (2 usos por luta).'},
  {id:'katon',x:3,y:0,req:[],pt:0,start:1,d:'Katon copiado com o Sharingan: bola de fogo que explode no alvo, causando queimadura.'},
  {id:'raikiri',x:4,y:0,req:[],pt:4,d:'Raikiri: relâmpagos na mão, a técnica que corta o raio. Dano alto e fatality.'},
  {id:'genjutsu',x:5,y:0,req:[],pt:2,d:'Prende o alvo numa ilusão do Sharingan: ele perde o próximo turno.'},
  {id:'copy',x:5,y:1,req:['genjutsu'],pt:4,d:'Ninja Copiador: copia o jutsu do inimigo para usar uma vez (Rasengan e Kage Bunshin).'}]};
/* golpes guardados para personagens/fases futuras (nao aparecem na arvore nem no menu): o no pronto para recolocar */
const TREES_FUTURO={naruto:[
  {id:'odama',x:1,y:3,req:['rasengan'],pt:4,rar:3,lvl:20,elem:'vento',d:'Rasengan Gigante: uma esfera enorme, mais dano e mais chakra.'},
  {id:'rasenshuriken',x:1,y:4,req:['odama'],pt:12,rar:5,lvl:45,elem:'vento',d:'Rasenshuriken: o Rasengan com lâminas de vento. Lendário.'}],sasuke:[{id:'amaterasu',x:2,y:1,req:['katon'],pt:12,d:'Chamas negras que não se apagam. O olho sangra e o alvo queima.'}]};
const MAX_LEVEL=50,PROG_KEY='rpgProgV2';
const xpNeed=lv=>Math.round(30*lv*(1+lv/12)); /* XP para sair do nivel lv */
function progDefault(){const p={};for(const c in TREES)p[c]={level:1,xp:0,pts:0,learned:TREES[c].filter(n=>n.base||n.start).map(n=>n.id)};return p;}
let PROG=progDefault();
try{const j=JSON.parse(localStorage.getItem(PROG_KEY)||'null');if(j)for(const c in PROG)if(j[c])Object.assign(PROG[c],j[c]);}catch(e){}
/* golpes base novos entram sozinhos em progressos salvos antes */
for(const c in PROG)for(const n of TREES[c])if(n.base&&!PROG[c].learned.includes(n.id))PROG[c].learned.push(n.id);
function saveProg(){try{localStorage.setItem(PROG_KEY,JSON.stringify(PROG));}catch(e){}}
function treeNode(charId,id){return (TREES[charId]||[]).find(n=>n.id===id);}
/* golpe liberado? Copias valem se 'copy' foi aprendido; golpes fora da arvore sao sempre livres */
function moveUnlocked(charId,id){if(MOVES[id]&&MOVES[id].futuro)return false;const P=PROG[charId];if(!P)return true;if(id==='cop_rasengan'||id==='cop_bunshin')id='copy';return !treeNode(charId,id)||P.learned.includes(id);}
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
/* nivel minimo para vestir, por raridade: quanto mais raro, mais nivel */
const ITEM_LVL=[0,1,8,16,28,40];
const ITEMS={
 /* armas */
 kunai_ferro:{name:'Kunai de Ferro',slot:'arma',rar:1,g:'刃',stats:{atk:.03},d:'Uma kunai comum, bem afiada.'},
 lamina_chakra:{name:'Lâmina de Chakra',slot:'arma',rar:2,g:'刃',stats:{atk:.05},d:'Lâmina que conduz o chakra do usuário.'},
 katana_anbu:{name:'Katana da Anbu',slot:'arma',rar:3,g:'剣',stats:{atk:.07},d:'Lâmina curta usada pelos esquadrões de elite.'},
 kunai_tri:{name:'Kunai Trifurcado',slot:'arma',rar:4,g:'刃',stats:{atk:.08,elem:'vento',pct:.10},d:'Kunai de três pontas, leve e rápida.',only:['naruto']},
 kusanagi:{name:'Kusanagi',slot:'arma',rar:4,g:'剣',stats:{atk:.09,elem:'raio',pct:.12},d:'A espada que conduz relâmpagos.',only:['sasuke']},
 kubikiri:{name:'Kubikiribōchō',slot:'arma',rar:5,g:'斬',stats:{atk:.14},d:'A gigantesca espada do Demônio da Névoa Oculta.'},
 /* corpo */
 colete:{name:'Colete Shinobi',slot:'corpo',rar:1,g:'衣',stats:{hp:5,def:.04},d:'Colete tático padrão de Konoha.'},
 roupa_peso:{name:'Roupa de Treino Pesada',slot:'corpo',rar:2,g:'衣',stats:{hp:10},d:'Pesos nas roupas fortalecem o corpo.'},
 armadura_anbu:{name:'Armadura da Anbu',slot:'corpo',rar:3,g:'甲',stats:{hp:10,def:.08},d:'Proteção leve das forças especiais.'},
 manto_nuvem:{name:'Manto da Nuvem Vermelha',slot:'corpo',rar:4,g:'衣',stats:{hp:12,def:.10},d:'Manto negro com nuvens vermelhas.'},
 traje_sabio:{name:'Traje do Sábio',slot:'corpo',rar:5,g:'聖',stats:{hp:25,def:.14},d:'Roupa de quem domina a energia natural.'},
 /* acessorios */
 bandana:{name:'Bandana de Konoha',slot:'acc',rar:1,g:'護',stats:{hp:4,def:.01},d:'Símbolo da vila escondida na folha.'},
 talisma_fogo:{name:'Talismã de Fogo',slot:'acc',rar:2,g:'火',stats:{elem:'fogo',pct:.10},d:'Reforça golpes de Fogo.'},
 talisma_agua:{name:'Talismã de Água',slot:'acc',rar:2,g:'水',stats:{elem:'agua',pct:.10},d:'Reforça golpes de Água.'},
 talisma_terra:{name:'Talismã de Terra',slot:'acc',rar:2,g:'土',stats:{elem:'terra',pct:.10},d:'Reforça golpes de Terra.'},
 talisma_vento:{name:'Talismã de Vento',slot:'acc',rar:2,g:'風',stats:{elem:'vento',pct:.10},d:'Reforça golpes de Vento.'},
 talisma_raio:{name:'Talismã de Raio',slot:'acc',rar:2,g:'雷',stats:{elem:'raio',pct:.10},d:'Reforça golpes de Raio.'},
 amuleto_sorte:{name:'Amuleto da Sorte',slot:'acc',rar:3,g:'福',stats:{hp:15},d:'Dizem que protege quem o carrega.'},
 selo_protecao:{name:'Selo de Proteção',slot:'acc',rar:4,g:'封',stats:{hp:12,def:.05},d:'Um selo que desvia parte do dano.'},
 colar_hashirama:{name:'Colar de Hashirama',slot:'acc',rar:5,g:'珠',stats:{hp:30,atk:.05},d:'Cristal lendário que pulsa com vitalidade.'},
 /* consumiveis */
 pilula_vida:{name:'Pílula de Soldado',slot:'cons',rar:1,g:'薬',use:{hp:50},d:'Recupera 50 de vida. Gasta o turno.'},
 pilula_ck:{name:'Pílula de Chakra',slot:'cons',rar:1,g:'気',use:{ck:40},d:'Recupera 40 de chakra. Gasta o turno.'},
 pergaminho_med:{name:'Pergaminho Médico',slot:'cons',rar:3,g:'巻',use:{hp:100},d:'Recupera 100 de vida. Gasta o turno.'},
 elixir_sabio:{name:'Elixir do Sábio',slot:'cons',rar:4,g:'丹',use:{hp:100,ck:50},d:'Recupera 100 de vida e 50 de chakra. Gasta o turno.'}};
const RARITY={1:{name:'Comum',col:'#aab0c8'},2:{name:'Incomum',col:'#5cc878'},3:{name:'Raro',col:'#4aa8ff'},4:{name:'Épico',col:'#b070ff'},5:{name:'Lendário',col:'#ffa43a'}};
const INV_KEY='rpgInvV1';
function invDefault(){return{ryo:0,bag:{kunai_ferro:1,colete:1,bandana:1,pilula_vida:3,pilula_ck:3},eq:{sasuke:{},naruto:{},sakura:{},kakashi:{}}};}
let INV=invDefault();
try{const j=JSON.parse(localStorage.getItem(INV_KEY)||'null');if(j){INV.ryo=j.ryo||0;INV.bag=j.bag||INV.bag;INV.eq=Object.assign({sasuke:{},naruto:{},sakura:{},kakashi:{}},j.eq||{});}}catch(e){}
function saveInv(){try{localStorage.setItem(INV_KEY,JSON.stringify(INV));}catch(e){}}
function bagQty(id){return INV.bag[id]||0;}
function addItem(id,n){INV.bag[id]=bagQty(id)+(n||1);saveInv();}
function equipBlock(charId,id){const it=ITEMS[id];if(!it||it.slot==='cons')return 'Não é equipável';if(it.only&&!it.only.includes(charId))return 'Este personagem não pode equipar';const need=ITEM_LVL[it.rar]||1;if(PROG[charId]&&PROG[charId].level<need)return 'Precisa do nível '+need;return '';}
function canEquip(charId,id){return !equipBlock(charId,id);}
/* equipa tirando da mochila; o item que estava no slot volta para a mochila */
function equipItem(charId,id){if(!canEquip(charId,id)||bagQty(id)<1)return false;const it=ITEMS[id],old=INV.eq[charId][it.slot];if(old)INV.bag[old]=bagQty(old)+1;INV.bag[id]--;if(INV.bag[id]<=0)delete INV.bag[id];INV.eq[charId][it.slot]=id;saveInv();return true;}
function unequipItem(charId,slot){const id=INV.eq[charId][slot];if(!id)return false;addItem(id,1);delete INV.eq[charId][slot];saveInv();return true;}
/* soma dos bonus do que o personagem veste */
function statsOf(charId){const s={hp:0,atk:0,def:0,elem:{}};for(const slot in INV.eq[charId]||{}){const it=ITEMS[INV.eq[charId][slot]];if(!it||!it.stats)continue;const st=it.stats;s.hp+=st.hp||0;s.atk+=st.atk||0;s.def+=st.def||0;if(st.elem)s.elem[st.elem]=(s.elem[st.elem]||0)+(st.pct||0);}s.def=Math.min(.6,s.def);return s;}
function resetInv(){INV=invDefault();saveInv();}
/* sorteia um item de recompensa (pesos por raridade) */
function rollDrop(nodeLvl){const w={1:55,2:28,3:12,4:4,5:1},lim=(nodeLvl||99)+8,ids=Object.keys(ITEMS).filter(i=>(ITEM_LVL[ITEMS[i].rar]||1)<=lim);let tot=0;const pool=ids.map(i=>{const x=w[ITEMS[i].rar]||1;tot+=x;return[i,x];});let r=Math.random()*tot;for(const[i,x]of pool){if((r-=x)<=0)return i;}return ids[0];}

/* ---------- Mapa da campanha ----------
   Locais ligados por caminhos. Um local de luta libera quando algum vizinho foi vencido (Konoha ja nasce vencida).
   enc: inimigo (hp/atk = escala sobre o valor base, afin = elementos do inimigo), scene = cenario da batalha, xp/ryo = recompensa. */
const MAP_W=1180,MAP_H=640;
const NODES={
 konoha:{name:'Konoha',kind:'vila',x:130,y:330,scene:'vila',d:'Sua vila. Prepare a equipe (habilidades e equipamentos) antes de partir.'},
 treino:{name:'Campo de Treino',kind:'luta',x:340,y:310,scene:'treino',lvl:1,xp:8,ryo:60,enc:{name:'Genin Rival',afin:['terra']},d:'Um campo aberto ao amanhecer, onde genins testam suas técnicas.'},
 floresta:{name:'Floresta da Morte',kind:'luta',x:550,y:160,scene:'floresta',lvl:10,xp:55,ryo:90,enc:{name:'Ninja Perdido',afin:['agua']},d:'Mata densa e perigosa. Quem entra sem preparo raramente volta.'},
 deserto:{name:'Deserto do Vento',kind:'luta',x:540,y:480,scene:'deserto',lvl:15,xp:100,ryo:120,enc:{name:'Ninja da Areia',afin:['terra']},d:'Dunas sem fim e um calor que drena o chakra.'},
 neve:{name:'Passo Nevado',kind:'luta',x:810,y:500,scene:'neve',lvl:20,xp:160,ryo:160,enc:{name:'Guardião do Gelo',afin:['gelo']},d:'Um desfiladeiro congelado vigiado por um ninja de gelo.'},
 vale:{name:'Vale do Fim',kind:'chefe',x:985,y:285,scene:'vale',lvl:30,xp:315,ryo:300,enc:{name:'Rival Final',afin:null},d:'O local do confronto final, entre as estátuas e a cachoeira.'}};
const EDGES=[['konoha','treino'],['treino','floresta'],['treino','deserto'],['floresta','vale'],['deserto','neve'],['neve','vale']];
const CAMP_KEY='rpgCampV1';
let CAMP={cleared:['konoha'],at:'konoha',active:null};
try{const j=JSON.parse(localStorage.getItem(CAMP_KEY)||'null');if(j){CAMP.cleared=j.cleared||CAMP.cleared;CAMP.at=j.at||CAMP.at;CAMP.active=j.active||null;}}catch(e){}
function saveCamp(){try{localStorage.setItem(CAMP_KEY,JSON.stringify(CAMP));}catch(e){}}
function nodeNeighbors(id){return EDGES.filter(e=>e.includes(id)).map(e=>e[0]===id?e[1]:e[0]);}
function nodeState(id){if(CAMP.cleared.includes(id))return'cleared';return nodeNeighbors(id).some(n=>CAMP.cleared.includes(n))?'open':'locked';}
function resetCamp(){CAMP={cleared:['konoha'],at:'konoha',active:null};saveCamp();}

/* Kit do inimigo da campanha: so os golpes da arvore com nivel minimo ate o nivel do local (mais os basicos). Fora da campanha vale o kit completo. */
function enemyKit(charId,lvl){return new Set(TREES[charId].filter(n=>n.base||n.start||MOVES[n.id].lvl<=lvl).map(n=>n.id));}
function enemyKitOf(charId){const a=CAMP.active;if(!a)return null;if(charId!==(a.hero==='naruto'?'sasuke':'naruto'))return null;return enemyKit(charId,NODES[a.node].lvl);}
