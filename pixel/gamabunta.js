/* Gama Bunta em pixel art (190x140, olhando para a direita), sentado como no anime:
   sapo gigante marrom-avermelhado com verrugas, marcas escuras em volta dos olhos, olhos amarelos de pupila em fenda,
   cicatriz no olho de tras, haori azul nas costas com o kanji, cachimbo na boca e a tanto atravessada na cintura. */
const BUNTA_PAL={K:'#140a10',
 D:'#e8784a',R:'#c4542e',r:'#9c3c22',d:'#702616',x:'#4e180e',
 L:'#f2c896',l:'#d8a070',m:'#b47c52',
 B:'#30509e',b:'#1e3270',n:'#141f4a',v:'#5c80d8',W:'#f4f0e4',w:'#c8c4bc',
 Y:'#ffd83c',y:'#e0a420',o:'#a8701a',E:'#100810',
 P:'#7a4a26',p:'#4a2c16',S:'#c4c8d2',s:'#7e8292',H:'#2c1c18',h:'#5a3a2a'};
function gamaBunta(){const g=PixGrid(190,140),hs=(a,b)=>((a*73856093)^(b*19349663))>>>0;
 /* ---- pata de tras, dobrada no chao ---- */
 g.ell(48,120,34,17,'R');g.shade([[8,122],[90,122],[90,140],[8,140]],['R'],'r');
 g.poly([[10,128],[70,128],[78,139],[4,139]],'R');g.shade([[4,134],[80,134],[80,140],[4,140]],['R'],'r');
 for(const x of [16,30,44,58,70])g.line(x,130,x-3,139,'d');
 /* ---- corpo ---- */
 g.ell(94,92,80,44,'R');
 g.shade([[10,96],[176,96],[176,140],[10,140]],['R'],'r');g.shade([[10,118],[176,118],[176,140],[10,140]],['r'],'d');
 /* ---- cabeca larga ---- */
 g.ell(122,62,56,34,'R');g.shade([[72,74],[188,74],[188,98],[72,98]],['R'],'r');g.shade([[86,34],[172,34],[172,44],[86,44]],['R'],'D');
 /* ---- barriga clara com dobras ---- */
 g.ell(124,110,44,22,'L');g.shade([[78,116],[170,116],[170,134],[78,134]],['L'],'l');
 for(let y=96;y<132;y+=5)g.line(84,y,166,y,'m',['L','l']);
 /* ---- verrugas espalhadas (pontos claros com sombra) ---- */
 for(let y=36;y<126;y+=3)for(let x=8;x<186;x+=3){if(hs(x,y)%23)continue;const c=g.G[y]&&g.G[y][x];if(c==='R'||c==='r'||c==='D'){g.set(x,y,'D');g.set(x+1,y+1,'d');}}
 /* ---- manchas escuras ---- */
 for(const [x,y,rx,ry] of [[96,50,6,4],[84,66,5,3],[150,46,4,3],[70,104,6,4],[30,112,5,3],[160,80,4,3]])g.ell(x,y,rx,ry,'d');
 /* ---- olhos saltados ---- */
 for(const ex of [106,146]){
  g.ell(ex,30,16,14,'R');g.shade([[ex-16,34],[ex+16,34],[ex+16,46],[ex-16,46]],['R'],'r');
  /* marca escura em volta do olho */
  g.ell(ex,31,13,11,'x');
  g.ell(ex,31,11,9,'Y');g.shade([[ex-11,33],[ex+11,33],[ex+11,41],[ex-11,41]],['Y'],'y');g.shade([[ex-11,38],[ex+11,38],[ex+11,41],[ex-11,41]],['y'],'o');
  g.line(ex-9,31,ex+9,31,'E');g.line(ex-8,30,ex+8,30,'E');g.line(ex-6,32,ex+6,32,'E');
  g.put(ex-5,26,'WW');g.put(ex-4,27,'W');
  /* palpebra de cima */
  g.line(ex-12,22,ex+12,22,'d');g.line(ex-10,21,ex+10,21,'r');}
 /* cicatriz no olho de tras */
 g.line(96,10,116,52,'x');g.line(97,10,117,52,'K',['Y','y','o','E','x']);g.line(95,11,115,52,'d',['R','D','r']);
 /* ---- boca larga, labio e bochecha ---- */
 g.line(96,80,136,78,'K');g.line(136,78,176,70,'K');g.line(96,81,136,79,'x');g.line(136,79,174,72,'x');
 g.line(100,84,172,76,'r',['R','D']);g.ell(104,86,8,5,'r');
 g.put(166,54,'KK');g.put(172,54,'KK');
 /* ---- haori azul nas costas ---- */
 const hao=[[12,72],[26,50],[56,40],[80,44],[86,66],[82,96],[74,118],[54,128],[24,126],[10,104]];
 g.poly(hao,'B');
 g.shade([[4,100],[104,100],[104,140],[4,140]],['B'],'b');g.shade([[22,42],[64,42],[56,54],[22,60]],['B'],'v');
 /* gola e borda da frente mais escuras */
 g.poly([[76,44],[82,44],[88,66],[84,96],[76,120],[70,120],[78,96],[82,66]],'n');
 /* dobras do tecido */
 for(const [a,b,c,d] of [[24,72,20,110],[62,62,60,116],[16,84,14,104]])g.line(a,b,c,d,'b',['B','v']);
 g.edge(hao,'n');
 /* emblema nas costas: circulo branco com o kanji (油) */
 g.ell(42,84,17,17,'W');g.ell(42,84,14,14,'B');
 for(const [x,y] of [[32,77],[33,83],[32,90]])g.put(x,y,'WW');
 g.poly([[37,78],[51,78],[51,94],[37,94]],'W');g.poly([[39,80],[49,80],[49,92],[39,92]],'B');g.line(39,86,49,86,'W');g.line(44,72,44,92,'W');g.line(43,72,45,72,'W');
 /* ---- tanto na cintura: bainha escura e cabo trancado ---- */
 g.line(66,124,138,110,'H');g.line(66,125,138,111,'H');g.line(67,126,138,112,'h');g.line(65,124,65,126,'Y');
 g.poly([[138,106],[154,103],[156,111],[140,114]],'p');for(let x=140;x<154;x+=3){g.line(x,105,x+2,112,'W');}g.line(137,104,137,116,'Y');g.line(138,104,138,116,'o');
 /* ---- pata da frente ---- */
 g.poly([[134,88],[158,92],[172,124],[186,139],[132,139],[140,116]],'R');
 g.shade([[132,112],[188,112],[188,140],[132,140]],['R'],'r');g.line(150,96,156,124,'d',['R','r']);
 for(const x of [140,152,164,176])g.line(x,132,x+3,139,'d');
 /* ---- cachimbo ---- */
 g.line(158,76,178,62,'P');g.line(158,77,178,63,'P');g.line(159,78,178,64,'p');
 g.poly([[176,50],[186,50],[186,64],[176,64]],'P');g.shade([[176,58],[187,58],[187,64],[176,64]],['P'],'p');g.line(176,50,186,50,'H');g.put(178,51,'hhhhh');g.put(179,52,'DD');
 g.outline('K');
 return g;}
