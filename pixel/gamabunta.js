/* Gama Bunta em pixel art (130x100, olhando para a direita): sapo gigante vermelho-alaranjado com manchas,
   colete azul nas costas, olhos amarelos de pupila em fenda com cicatriz, cachimbo na boca e a tanto na cintura. */
const BUNTA_PAL={K:'#140a14',
 R:'#c8502c',r:'#a03a22',d:'#7a2818',D:'#e47040',L:'#f0b080',l:'#d08860',
 B:'#2e4aa0',b:'#1c2c6a',v:'#4a6ad0',W:'#f2f0e8',
 Y:'#ffd23a',y:'#d8a020',E:'#120a10',
 P:'#6a4020',p:'#3c2414',S:'#b8bcc8',s:'#7a7e8c',H:'#3a2a20'};
function gamaBunta(){const g=PixGrid(130,100);
 /* pata de tras dobrada */
 g.ell(30,86,22,11,'R');g.shade([[8,80],[52,80],[52,98],[8,98]],['R'],'r');
 g.poly([[10,92],[40,92],[44,99],[6,99]],'R');g.line(12,98,40,98,'d');for(const x of [14,22,30,38])g.line(x,93,x-2,99,'d');
 /* corpo */
 g.ell(62,64,54,30,'R');g.shade([[8,64],[116,64],[116,96],[8,96]],['R'],'r');
 /* barriga clara */
 g.ell(78,76,32,16,'L');g.shade([[46,80],[112,80],[112,94],[46,94]],['L'],'l');
 for(let y=66;y<92;y+=4)g.line(54,y,104,y,'l',['L']);
 /* cabeca larga na frente */
 g.ell(88,44,38,24,'R');g.shade([[50,52],[128,52],[128,70],[50,70]],['R'],'r');g.shade([[60,22],[110,22],[110,30],[60,30]],['R'],'D');
 /* manchas escuras */
 for(const [x,y,rx,ry] of [[40,52,6,4],[58,40,5,3],[28,66,5,4],[96,30,4,3],[70,58,4,3],[18,72,4,3],[110,40,3,2]])g.ell(x,y,rx,ry,'d');
 /* colete azul nas costas */
 g.poly([[8,52],[20,34],[46,26],[62,30],[58,58],[52,84],[22,90],[6,74]],'B');
 g.shade([[4,70],[60,70],[60,94],[4,94]],['B'],'b');g.shade([[18,28],[50,28],[44,38],[18,40]],['B'],'v');
 g.edge([[8,52],[20,34],[46,26],[62,30],[58,58],[52,84],[22,90],[6,74]],'b');
 /* simbolo branco no colete */
 g.ell(32,58,9,9,'W');g.ell(32,58,6,6,'B');g.line(24,58,40,58,'W');g.line(32,50,32,66,'W');
 /* olhos saltados em cima da cabeca */
 for(const [ex] of [[74],[102]]){g.ell(ex,22,11,9,'R');g.ell(ex,22,8,6,'Y');g.shade([[ex-8,24],[ex+8,24],[ex+8,28],[ex-8,28]],['Y'],'y');g.line(ex-6,22,ex+6,22,'E');g.line(ex-5,21,ex+5,21,'E');g.put(ex-3,19,'W');}
 /* cicatriz sobre o olho de tras */
 g.line(68,10,80,34,'d');g.line(69,10,81,34,'K',['Y','y','E']);
 /* boca larga */
 g.line(74,54,126,48,'K');g.line(74,55,120,50,'d');g.line(118,46,126,48,'K');
 /* narinas */
 g.put(118,38,'KK');g.put(122,38,'K');
 /* cachimbo */
 g.line(110,50,124,44,'P');g.line(110,51,124,45,'P');g.line(111,52,124,46,'p');
 g.poly([[122,36],[128,36],[128,46],[122,46]],'P');g.line(122,36,128,36,'H');g.line(123,46,127,46,'p');
 /* tanto na cintura */
 g.line(36,86,92,80,'S');g.line(36,87,92,81,'s');g.poly([[84,77],[96,76],[97,82],[85,83]],'H');g.line(80,76,80,84,'Y');
 /* pata da frente */
 g.poly([[96,68],[112,70],[120,96],[96,96]],'R');g.shade([[96,82],[122,82],[122,98],[96,98]],['R'],'r');
 g.poly([[92,94],[126,94],[128,99],[90,99]],'R');for(const x of [98,106,114,122])g.line(x,95,x+2,99,'d');
 g.outline('K');
 return g;}
