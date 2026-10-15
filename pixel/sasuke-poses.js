/* Mais poses do Sasuke no mesmo estilo dos sprites a mao (paleta SAS2_PAL, cabeca SAS_HEAD, contorno seletivo) */

/* cabeca com variacoes: olhos fechados de dor ou boca aberta */
function sasHeadRows(mod){
 const rows=SAS_HEAD.map(r=>r.join('').split(''));
 const set=(y,x,s)=>{for(let i=0;i<s.length;i++)rows[y][x+i]=s[i];};
 if(mod&&mod.shut){ /* olhos apertados: sobrancelhas franzidas e uma linha no lugar do olho */
  set(13,16,'sSKKKSSS');set(13,24,'SKKKSK22');
  set(14,16,'SSSSSSSS');set(14,24,'SSSSSK2K');}
 if(mod&&mod.mouth){set(18,20,'oKKo');}
 return rows;}
function putHead(g,ox,oy,mod){sasHeadRows(mod).forEach((r,y)=>g.put(ox,y+oy,r.join('')));
 const dx=ox-4,dy=oy-1,L=(a,b,c,d,k)=>g.line(a+dx,b+dy,c+dx,d+dy,k,['3']);
 L(33,7,24,6,'2');L(28,5,17,7,'2');L(21,6,11,9,'2');L(16,9,8,11,'2');
 L(33,6,25,5,'4');L(27,4,18,6,'4');L(20,5,12,8,'4');L(15,8,9,10,'4');
 g.put(29+dx,4+dy,'5');g.put(21+dx,5+dy,'5');g.put(14+dx,6+dy,'5');
 g.put(14+dx,10+dy,'b');g.put(12+dx,11+dy,'bBb');g.put(11+dx,12+dy,'bBB');g.put(10+dx,13+dy,'bB');g.put(10+dx,14+dy,'b');g.put(14+dx,13+dy,'Bb');g.put(15+dx,14+dy,'b');}
/* cabeca deitada (girada 90 graus: topo para a esquerda, rosto para cima); o que passa do chao nao e desenhado */
function putHeadLying(g,ox,oy,groundY,mod){const rows=sasHeadRows(mod),Wd=rows[0].length;
 for(let y=0;y<rows.length;y++)for(let x=0;x<Wd;x++){const ch=rows[y][x];if(ch==='.')continue;const nx=ox+y,ny=oy+(Wd-1-x);if(ny<=groundY)g.set(nx,ny,ch);}}
/* sandalia (reuso) */
function sandal(g,x0,front){const k=front?'N':'n',hi=front?'D':'v',sk=front?'S':'s';
 g.poly([[x0,70],[x0+9,70],[x0+12.5,72],[x0+12.5,75],[x0,75]],k);g.line(x0,74,x0+12,74,front?'n':'1');g.line(x0+1,71,x0+7,71,front?'v':'N');g.put(x0+9,72,sk+sk+sk);g.put(x0+9,73,front?'sSs':'tst');g.line(x0+2,72,x0+6,72,hi);}

/* ---- Soco: avanco em base longa, braco da frente esticado ---- */
function sasukePunch(){const g=PixGrid(56,80);
 /* braco de tras: punho recolhido na cintura */
 g.poly([[19,29],[24,29],[20,36],[14,34]],'c');g.shade([[13,28],[18,28],[17,37],[13,37]],['c'],'d');
 g.poly([[14,33.5],[20,35.5],[21.5,41],[15.5,41.5]],'s');g.shade([[13,33],[17,33],[17,42],[13,42]],['s'],'t');
 g.poly([[15.5,38],[21.5,38],[22,42],[16,42.5]],'a');g.line(16,40,21,40,'r');
 g.poly([[15,42],[22,42],[22.5,46],[16,46.5]],'s');g.line(17,43,17,45,'t');g.line(19,43,19,45,'t');g.line(16,45,21,45,'t');
 /* perna de tras esticada para tras */
 g.poly([[18,49],[24,51],[16,61],[10.5,58]],'s');g.shade([[9,52],[15,52],[12,62],[9,62]],['s'],'t');g.line(19,53,13,59,'S',['s']);
 g.poly([[10.5,57.5],[16,61],[10.5,71],[4,70]],'s');g.shade([[3,60],[9,60],[7,71],[3,71]],['s'],'t');
 g.poly([[6,64],[13,64],[10.5,71],[4,70]],'a');for(let y=65;y<71;y+=2)g.line(5,y,11,y,'r');
 sandal(g,0,false);
 /* perna da frente em avanco */
 g.poly([[30,49],[37,48],[45.5,55],[39.5,60]],'S');g.shade([[29,49],[33,49],[41,60],[38,60]],['S'],'s');g.put(43,54,'W');g.put(42,53,'W');
 g.poly([[39,56],[45.5,55],[47,71],[40.5,71]],'S');g.shade([[38,56],[42,56],[43,71],[39,71]],['S'],'s');g.line(43,57,45,57,'t');
 g.poly([[40.5,64],[46.7,64],[47,71],[40.5,71]],'A');g.shade([[39,64],[42.5,64],[42.5,71],[39,71]],['A'],'a');for(let y=65;y<71;y+=2)g.line(43,y,46,y,'a');
 sandal(g,38.5,true);
 /* bermuda */
 g.poly([[19,45],[37,45],[40,50],[37,55],[31,52],[28,50],[24,52],[18,55],[15,50]],'P');
 g.shade([[14,45],[22,45],[21,57],[14,57]],['P'],'p');g.shade([[24,48],[31,48],[31,53],[24,53]],['P'],'p');g.shade([[26,49],[29,49],[29,52],[26,52]],['p'],'q');
 g.line(16,51,21,54,'q');g.line(32,52,37,54,'q');g.line(28,46,28,49,'q');g.line(34,47,38,50,'p');g.put(37,47,'W');
 /* tronco inclinado para a frente, ombro da frente avancado */
 g.poly([[22,29],[27,27],[37,27],[41,29],[41,34],[38,40],[36.5,46],[20,46],[19,40],[20,34]],'C');
 g.shade([[18,26],[26,26],[25,47],[18,47]],['C'],'c');g.shade([[18,26],[22.5,26],[22,47],[18,47]],['c'],'d');
 g.shade([[37,28],[42,28],[40,37],[37,37]],['C'],'D');
 g.line(26,30,37,29,'c',['C','D']);g.line(25,41,27,44,'c');g.line(32,44,34,41,'c');g.line(30,34,32,36,'c');
 g.line(20,45,36,45,'d');g.line(27,46,31,46,'c');
 /* pescoco e gola */
 g.poly([[30,25],[35,25],[35,29],[30,29]],'S');g.shade([[29,25],[32,25],[32,30],[29,30]],['S'],'s');g.line(31,27,34,27,'t');
 g.poly([[26,26],[29,27],[35,27],[38,26],[39,30.5],[25,30.5]],'c');g.shade([[24,25],[28,25],[28,31],[24,31]],['c'],'d');g.line(29,28,35,28,'D');
 /* cabeca para a frente */
 putHead(g,10,6,{mouth:true});
 /* braco da frente esticado: manga, antebraco, faixa branca e punho */
 g.poly([[37,27],[44,27.5],[44.5,32.5],[38,34]],'C');g.shade([[36,30],[45,30],[45,35],[36,35]],['C'],'c');g.line(39,28,43,28,'D');
 g.poly([[44,28],[48,28],[48,32.5],[44,32.5]],'S');g.shade([[43,31],[49,31],[49,33],[43,33]],['S'],'s');
 g.poly([[47.5,27.5],[51,27.5],[51,33],[47.5,33]],'A');g.shade([[47,31],[52,31],[52,34],[47,34]],['A'],'a');g.line(49,28,49,32,'a');
 g.poly([[50.5,26.5],[54.5,26.5],[55.5,28],[55.5,32.5],[54,34],[50.5,34]],'S');g.shade([[50,32],[56,32],[56,35],[50,35]],['S'],'s');
 g.line(53,27,53,31,'t');g.line(55,28,55,31,'t');g.line(51,33,54,33,'t');g.put(54,27,'W');
 g.edge([[37,27],[44,27.5],[44.5,32.5],[38,34]],'d');
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}

/* ---- Dano: jogado para tras, cabeca para tras, olhos apertados, bracos soltos ---- */
function sasukeHit(){const g=PixGrid(56,80);
 /* braco de tras jogado para tras e para baixo */
 g.poly([[15,28],[20,30],[15,35],[10.5,32]],'c');g.shade([[9,28],[14,28],[13,36],[9,36]],['c'],'d');
 g.poly([[10.5,31.5],[15,35],[10.5,40],[6,36.5]],'s');g.shade([[5,33],[9,33],[8,41],[5,41]],['s'],'t');
 g.poly([[6.5,36],[10.5,38.5],[8,41],[4,39]],'a');g.line(5,38,9,40,'r');
 g.poly([[2,38.5],[7.5,39],[8,43],[3.5,44],[1.5,42]],'s');g.line(3,41,6,41,'t');g.line(4,43,7,43,'t');
 /* perna de tras dobrada segurando o peso */
 g.poly([[17,50],[23.5,51],[19,61],[12.5,60]],'s');g.shade([[11,52],[17,52],[15,62],[11,62]],['s'],'t');
 g.poly([[12.5,59],[19,61],[17.5,71],[11,71]],'s');g.shade([[10,59],[14,59],[13,71],[10,71]],['s'],'t');
 g.poly([[11.5,64],[18,64],[17.5,71],[11,71]],'a');for(let y=65;y<71;y+=2)g.line(12,y,17,y,'r');
 sandal(g,8,false);
 /* perna da frente escorregando para a frente */
 g.poly([[29,50],[35,49],[39,60],[32.5,61]],'S');g.shade([[28,50],[32,50],[35,61],[32,61]],['S'],'s');g.put(37,57,'W');
 g.poly([[32.5,60],[39,60],[41,71],[34.5,71]],'S');g.shade([[31,60],[35,60],[37,71],[33,71]],['S'],'s');
 g.poly([[34,64],[40.3,64],[41,71],[34.5,71]],'A');g.shade([[33,64],[36.5,64],[36.5,71],[33,71]],['A'],'a');for(let y=65;y<71;y+=2)g.line(37,y,40,y,'a');
 sandal(g,32.5,true);
 /* bermuda */
 g.poly([[18,45],[34,45],[37,50],[35,55],[30,52],[27,50],[24,52],[18,55],[15,50]],'P');
 g.shade([[14,45],[21,45],[20,57],[14,57]],['P'],'p');g.shade([[23,48],[30,48],[30,53],[23,53]],['P'],'p');
 g.line(16,51,21,54,'q');g.line(31,52,35,54,'q');g.line(27,46,27,49,'q');g.put(34,47,'W');
 /* tronco curvado para tras */
 g.poly([[16,30],[21,27],[31,27],[34,29],[35,34],[35,40],[34,46],[18,46],[17,40],[16,34]],'C');
 g.shade([[15,26],[22,26],[21,47],[15,47]],['C'],'c');g.shade([[15,26],[18.5,26],[18,47],[15,47]],['c'],'d');
 g.shade([[31,28],[36,28],[35,38],[31,38]],['C'],'D');
 g.line(21,30,31,29,'c',['C','D']);g.line(21,40,23,43,'c');g.line(28,43,30,40,'c');g.line(25,33,27,35,'c');
 g.line(18,45,33,45,'d');
 /* pescoco e gola */
 g.poly([[22,24],[27,24],[27,28],[22,28]],'S');g.shade([[21,24],[24,24],[24,29],[21,29]],['S'],'s');
 g.poly([[18,26],[21,27],[27,27],[30,26],[31,30.5],[17,30.5]],'c');g.shade([[16,25],[20,25],[20,31],[16,31]],['c'],'d');g.line(21,28,27,28,'D');
 /* cabeca jogada para tras, olhos apertados */
 putHead(g,1,4,{shut:true,mouth:true});
 /* braco da frente mole, balancando para a frente e para baixo com o impacto */
 g.poly([[29,27],[34,28],[38,33],[33.5,35]],'C');g.shade([[28,31],[39,31],[39,36],[28,36]],['C'],'c');g.line(33,28,36,30,'D');
 g.poly([[34,34],[38,32.5],[42,37],[38.5,39]],'S');g.shade([[34,37],[43,37],[43,40],[34,40]],['S'],'s');
 g.poly([[37.5,35.5],[41,34],[42.5,37.5],[39,39]],'A');g.line(39,36,41,35,'a');
 g.poly([[41,36],[45,36],[46,39.5],[43.5,41.5],[40.5,40]],'S');g.line(43,37,43,40,'t');g.line(45,37,45,39,'t');g.put(44,36,'W');
 g.edge([[29,27],[34,28],[38,33],[33.5,35]],'d');
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}

/* ---- Caido (K.O.): deitado de costas, cabeca para a esquerda, joelhos dobrados ---- */
function sasukeDown(){const g=PixGrid(84,48),GYd=45;
 /* braco de tras esticado no chao, acima da cabeca */
 g.poly([[16,40],[24,38],[25,42],[16,44]],'s');g.shade([[15,42],[25,42],[25,45],[15,45]],['s'],'t');
 /* perna de tras dobrada (mais escura, atras) */
 g.poly([[44,37],[48.5,40],[55,30],[51,27]],'s');g.shade([[44,33],[55,33],[55,41],[44,41]],['s'],'t');
 g.poly([[51,27],[55,30],[57.5,42],[53.5,42.5]],'s');g.shade([[53,35],[58,35],[58,43],[53,43]],['s'],'t');
 g.poly([[52.5,36],[56.5,35],[57.5,42],[53.5,42.5]],'a');g.line(53,38,57,38,'r');g.line(53,40,57,40,'r');
 g.poly([[51,42],[59,42],[61,43.5],[61,45],[51,45]],'n');g.line(52,44,60,44,'1');
 /* perna da frente dobrada com o joelho para cima */
 g.poly([[48,35],[52.5,39],[61,28],[56.5,24.5]],'S');g.shade([[48,33],[60,33],[60,40],[48,40]],['S'],'s');g.put(58,25,'W');g.put(59,26,'W');
 g.poly([[56.5,24.5],[61,27.5],[65.5,41],[61,42]],'S');g.shade([[56,26],[59,26],[63,42],[60,42]],['S'],'s');g.line(60,30,61,33,'t');
 g.poly([[59.5,34],[64,33],[65.5,41],[61,42]],'A');g.shade([[59,34],[61.5,34],[62.5,42],[60,42]],['A'],'a');g.line(61,36,64,35,'a');g.line(61,38,64,37,'a');
 g.poly([[59,41.5],[67.5,40.5],[70,42.5],[70,45],[59,45]],'N');g.line(60,44,69,44,'n');g.line(60,42,65,42,'v');g.put(66,42,'SSS');
 /* bermuda */
 g.poly([[40,32],[47,31],[52,35],[52,42],[48,45],[40,45]],'P');g.shade([[39,41],[55,41],[55,46],[39,46]],['P'],'p');g.line(44,36,50,36,'q');g.line(47,40,52,39,'p');
 /* tronco deitado */
 g.poly([[21,33],[25,31],[40,31],[42,33],[42,44],[22,45],[20,41]],'C');
 g.shade([[19,40],[43,40],[43,46],[19,46]],['C'],'c');g.shade([[19,43],[43,43],[43,46],[19,46]],['c'],'d');
 g.shade([[24,30],[40,30],[40,33],[24,33]],['C'],'D');
 g.line(26,36,38,36,'c',['C','D']);g.line(32,38,35,40,'c');g.line(40,33,40,44,'d');
 /* gola e pescoco */
 g.poly([[18,34],[22,33],[22,43],[18,43]],'c');g.shade([[17,40],[23,40],[23,44],[17,44]],['c'],'d');g.line(19,35,19,41,'D');
 /* cabeca deitada, olhos fechados */
 putHeadLying(g,-2,19,GYd,{shut:true});
 /* braco da frente caido sobre a barriga */
 g.poly([[24,33],[30,32],[33,36],[28,38]],'C');g.shade([[24,35],[33,35],[33,39],[24,39]],['C'],'c');
 g.poly([[28,36.5],[33,35.5],[38,38],[35,41]],'S');g.shade([[29,39],[39,39],[39,42],[29,42]],['S'],'s');
 g.poly([[34,37],[38,37.5],[39,41],[35,41.5]],'A');
 g.poly([[38,37],[42.5,37],[43.5,40.5],[39.5,41.5]],'S');g.line(40,38,40,40,'t');
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}
