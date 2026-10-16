/* Gama Bunta em pixel art (160x126), de frente e agachado, seguindo a referencia:
   pele marrom-avermelhada cheia de verrugas, labios e marcas em volta dos olhos em vermelho carmim, olhos amarelos pequenos e bravos,
   cicatriz clara no olho direito, cachimbo esverdeado no canto da boca, haori azul-escuro de manga curta com gola branca e dois emblemas,
   faixa branca na cintura, bracos e maos carmim com garras apoiados no chao e a tanto nas costas. */
const BUNTA_PAL={K:'#1a0c10',
 S:'#a8665a',R:'#86483e',r:'#6c3832',d:'#4e2624',
 C:'#c42a40',c:'#921c32',e:'#5c1020',
 Y:'#f2c424',y:'#a87414',E:'#1a0c10',Z:'#ecdcb4',
 B:'#3c4470',b:'#282e50',n:'#171b34',W:'#f4f2ec',w:'#c4c4d0',
 G:'#ccc468',g:'#8c8644',H:'#4a4220',T:'#bcbcc6',t:'#6c6c7a'};
function gamaBunta(){const g=PixGrid(160,126),hs=(a,b)=>((a*73856093)^(b*19349663))>>>0,M=x=>159-x;
 const sym=(pts,k)=>{g.poly(pts,k);g.poly(pts.map(([x,y])=>[160-x,y]),k);};
 /* ---- tanto nas costas, saindo por tras do ombro esquerdo ---- */
 g.line(14,26,36,62,'T');g.line(15,26,37,62,'T');g.line(16,26,38,62,'t');g.poly([[10,18],[16,16],[20,26],[14,28]],'n');g.line(12,28,22,24,'Y');
 /* ---- pernas agachadas ---- */
 g.ell(44,108,30,14,'R');g.ell(116,108,30,14,'R');g.shade([[10,110],[150,110],[150,126],[10,126]],['R'],'r');
 /* ---- tronco ---- */
 g.ell(80,82,44,32,'R');g.shade([[34,96],[126,96],[126,116],[34,116]],['R'],'r');
 /* tatuagem carmim no peito */
 for(const s of [1,-1]){const X=x=>80+s*(x-80);g.line(X(70),68,X(64),78,'C');g.line(X(64),78,X(70),86,'C');g.line(X(70),86,X(66,),92,'c');g.line(X(74),72,X(70),80,'c');}
 g.line(80,64,80,74,'c');
 /* ---- faixa branca na cintura ---- */
 g.poly([[40,92],[120,92],[122,106],[38,106]],'W');g.shade([[36,101],[124,101],[124,107],[36,107]],['W'],'w');
 for(const x of [56,72,88,104])g.line(x,93,x+3,105,'w');
 /* ---- haori de manga curta ---- */
 sym([[34,50],[60,52],[66,64],[60,100],[40,104],[26,88],[22,62]],'B');
 sym([[22,58],[36,52],[34,84],[14,86],[12,66]],'B');
 g.shade([[8,82],[152,82],[152,108],[8,108]],['B'],'b');
 /* gola branca descendo pela frente */
 sym([[58,52],[64,52],[70,64],[64,100],[60,100],[64,64]],'W');g.shade([[60,80],[100,80],[100,104],[60,104]],['W'],'w');
 /* emblemas brancos */
 for(const ex of [44,116]){g.ell(ex,72,5,5,'W');g.ell(ex,72,3,3,'b');g.put(ex-1,71,'W');g.put(ex,73,'W');}
 /* dobras */
 for(const s of [1,-1]){const X=x=>80+s*(x-80);g.line(X(30),64,X(28),84,'n',['B','b']);g.line(X(46),84,X(44),100,'n',['B','b']);}
 /* ---- bracos carmim com garras no chao ---- */
 sym([[14,72],[30,70],[32,86],[30,104],[38,116],[40,124],[2,124],[6,112],[12,100],[10,84]],'C');
 g.shade([[0,70],[12,70],[12,126],[0,126]],['C'],'c');g.shade([[148,70],[160,70],[160,126],[148,126]],['C'],'c');
 g.shade([[0,100],[160,100],[160,126],[0,126]],['C'],'c');
 for(let y=78;y<122;y+=4)for(let x=0;x<160;x+=4){if(hs(x,y)%5)continue;if(g.G[y][x]==='C'||g.G[y][x]==='c')g.ell(x,y,1.6,1.2,'e');}
 for(const s of [1,-1]){const X=x=>s>0?x:159-x;for(const x of [8,17,26,35]){g.line(X(x),114,X(x-3),125,'e');g.line(X(x+1),114,X(x-2),125,'e');g.set(X(x-3),125,'Z');g.set(X(x-2),125,'Z');}}
 /* ---- cabeca larga ---- */
 g.ell(80,40,46,25,'R');g.ell(80,56,40,12,'R');g.ell(74,24,22,8,'S');g.shade([[32,54],[128,54],[128,70],[32,70]],['R'],'r');
 /* verrugas */
 for(let y=16;y<66;y+=3)for(let x=36;x<125;x+=3){if(hs(x,y)%9)continue;const k=g.G[y][x];if(k==='R'||k==='S'||k==='r'){g.set(x,y,k==='S'?'R':'d');g.set(x+1,y,'S');}}
 /* marcas carmim em volta dos olhos e testa franzida */
 for(const s of [1,-1]){const X=x=>80+s*(x-80);
  g.ell(X(62),34,9,6,'C');g.line(X(52),28,X(72),32,'c');g.line(X(52),27,X(70),30,'C');
  g.ell(X(62),34,5,3,'Y');g.line(X(58),36,X(66),36,'y');g.put(Math.min(X(61),X(63)),34,'EE');
  g.line(X(54),40,X(50),48,'C');g.line(X(70),40,X(72),46,'c');}
 /* cicatriz no olho direito (do ponto de vista dele) */
 g.line(104,16,110,52,'Z');g.line(105,16,111,52,'Z');g.line(106,17,112,51,'d',['R','r','S']);
 /* narinas */
 g.put(75,48,'dd');g.put(84,48,'dd');
 /* boca larga: labios carmim grossos */
 const mouth=x=>Math.round(55+((x-80)/38)**2*7-(Math.abs(x-80)<5?-1:0)); /* boca de sapo bravo: cantos caidos */
 for(let x=42;x<=118;x++){const y=mouth(x);g.set(x,y-2,'C');g.set(x,y-1,'C');g.set(x,y,'K');g.set(x,y+1,'c');g.set(x,y+2,'C');if(Math.abs(x-80)<26)g.set(x,y+3,'c');}
 g.line(78,68,80,70,'c');g.line(80,70,82,68,'c');
 /* ---- cachimbo no canto da boca ---- */
 g.line(112,56,126,50,'G');g.line(112,57,126,51,'g');
 g.poly([[124,40],[132,40],[133,52],[124,52]],'G');g.shade([[124,47],[134,47],[134,53],[124,53]],['G'],'g');g.line(124,40,132,40,'H');g.put(126,41,'HHHH');
 g.outline('K');
 return g;}
