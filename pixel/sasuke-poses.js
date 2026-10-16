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

/* cores do raio (Chidori) */
Object.assign(SAS2_PAL,{R:'#d8142a',X:'#f4fbff',x:'#8fd8ff',Z:'#3a7cff',z:'#1c3a9a'});
/* pernas da base de luta agachada (iguais ao sprite de base), reaproveitadas no Chidori e no selo */
function guardLegs(g){
 g.poly([[17,50],[23.5,52],[16.5,62],[10,59]],'s');g.shade([[9,52],[16,52],[12,62],[9,62]],['s'],'t');g.line(19,53,14,59,'S',['s']);
 g.poly([[10,58],[16.5,60],[14.5,71],[8,71]],'s');g.shade([[7,58],[11,58],[10,71],[7,71]],['s'],'t');g.put(12,59,'S');g.put(13,60,'S');
 g.poly([[9,64],[15.5,64],[14.6,71],[8,71]],'a');for(let y=65;y<71;y+=2)g.line(9,y,14,y,'r');g.line(12,64,14,64,'A');
 g.poly([[6,70],[15,70],[16.5,72],[16.5,75],[4.5,75],[4.5,72]],'n');g.line(6,71,14,71,'N');g.line(5,74,16,74,'1');g.put(5,72,'ss');g.put(5,73,'ts');g.line(8,72,12,72,'v');
 g.poly([[31,50],[37,49],[44.5,57],[38.5,61]],'S');g.shade([[30,50],[34,50],[40,61],[37,61]],['S'],'s');g.put(42,56,'W');g.put(41,55,'W');
 g.poly([[38,57],[44.5,56],[45.5,71],[39,71]],'S');g.shade([[37,57],[41,57],[41.5,71],[38,71]],['S'],'s');g.line(42,58,44,58,'t');
 g.poly([[39,64],[45.3,64],[45.5,71],[39,71]],'A');g.shade([[38,64],[41,64],[41,71],[38,71]],['A'],'a');for(let y=65;y<71;y+=2)g.line(41,y,45,y,'a');
 g.poly([[37,70],[46,70],[49.5,72],[49.5,75],[37,75]],'N');g.line(37,74,49,74,'n');g.line(38,71,44,71,'v');g.put(46,72,'SSS');g.put(46,73,'sSs');g.line(39,72,43,72,'D');
 g.poly([[19,45],[36,45],[40,51],[37,56],[31,53],[28,50],[24,53],[18,56],[15,51]],'P');
 g.shade([[14,45],[22,45],[21,57],[14,57]],['P'],'p');g.shade([[24,48],[31,48],[31,54],[24,54]],['P'],'p');g.shade([[26,49],[29,49],[29,52],[26,52]],['p'],'q');
 g.line(16,52,21,55,'q');g.line(32,53,37,55,'q');g.line(28,46,28,49,'q');g.line(34,47,38,51,'p');g.line(20,48,22,52,'q');
 g.line(33,49,35,52,'q');g.line(17,49,19,51,'p');g.put(36,47,'W');g.put(37,48,'W');}
/* tronco, pescoco e gola da base de luta, deslocados por (dx,dy) */
function guardTorso(g,dx,dy){const T=pts=>pts.map(p=>[p[0]+dx,p[1]+dy]),Lr=(a,b,c,d,k,o)=>g.line(a+dx,b+dy,c+dx,d+dy,k,o);
 g.poly(T([[20,29],[25,27],[35,27],[39,29],[39,34],[37,40],[35.5,46],[20,46],[19,40],[19,34]]),'C');
 g.shade(T([[18,26],[25,26],[24,47],[18,47]]),['C'],'c');g.shade(T([[18,26],[21.5,26],[21,47],[18,47]]),['c'],'d');
 g.shade(T([[35,28],[40,28],[38,38],[35.5,38]]),['C'],'D');
 Lr(25,30,35,29,'c',['C','D']);Lr(24,41,26,44,'c');Lr(31,44,33,41,'c');Lr(29,34,31,36,'c');Lr(27,38,28,42,'c');
 Lr(20,45,35,45,'d');Lr(26,46,30,46,'c');
 g.poly(T([[28,25],[33,25],[33,29],[28,29]]),'S');g.shade(T([[27,25],[30,25],[30,30],[27,30]]),['S'],'s');Lr(29,27,32,27,'t');
 g.poly(T([[24,26],[27,27],[33,27],[36,26],[37,30.5],[23,30.5]]),'c');g.shade(T([[22,25],[26,25],[26,31],[22,31]]),['c'],'d');Lr(27,28,33,28,'D');Lr(36,27,36,29,'C');}

/* ---- Chute lateral: perna da frente esticada na altura do quadril, corpo inclinado para tras ---- */
function sasukeKick(){const g=PixGrid(56,80);
 /* braco de tras aberto para equilibrar */
 g.poly([[15,28],[19.5,30.5],[13.5,33.5],[10,31]],'c');g.shade([[9,28],[14,28],[13,35],[9,35]],['c'],'d');
 g.poly([[10,30.5],[13.5,33.5],[7.5,35.5],[5,33]],'s');g.shade([[4,33],[9,33],[8,36],[4,36]],['s'],'t');
 g.poly([[5.5,32.5],[8,34.5],[6,36.5],[3,34.5]],'a');
 g.poly([[0.5,33],[4,32.5],[4.5,36.5],[1,37.5]],'s');g.line(2,34,2,36,'t');
 /* perna de apoio */
 g.poly([[19,50],[25,51],[23.5,61],[17.5,61]],'s');g.shade([[16,50],[20,50],[19,61],[16,61]],['s'],'t');
 g.poly([[17.5,60],[23.5,60],[23,71],[17,71]],'s');g.shade([[16,60],[19.5,60],[19,71],[16,71]],['s'],'t');
 g.poly([[17,64],[23,64],[23,71],[17,71]],'a');for(let y=65;y<71;y+=2)g.line(17,y,22,y,'r');
 sandal(g,14,false);
 /* bermuda */
 g.poly([[18,45],[33,44],[38,46],[37,51],[29,51],[25,53],[18,55],[15.5,50]],'P');
 g.shade([[14,45],[21,45],[20,57],[14,57]],['P'],'p');g.line(17,51,22,53,'q');g.line(27,46,27,50,'q');g.line(30,49,35,50,'q');g.put(35,46,'W');
 /* perna da frente esticada: coxa, canela, faixa e sandalia de lado */
 g.poly([[31,44],[39,43],[44,44.5],[43.5,50],[33,51]],'S');g.shade([[31,48],[44,48],[44,51],[31,51]],['S'],'s');g.put(40,44,'W');g.put(41,44,'W');
 g.poly([[42.5,44],[47,44],[47,49.5],[43,50]],'S');g.shade([[42,48],[48,48],[48,51],[42,51]],['S'],'s');
 g.poly([[46,43.5],[51,43.5],[51,49.5],[46,49.5]],'A');g.shade([[45,47.5],[52,47.5],[52,50],[45,50]],['A'],'a');for(let x=47;x<51;x+=2)g.line(x,44,x,49,'a');
 g.poly([[50.5,41],[53.5,41],[55.5,43],[55.5,51],[50.5,51]],'N');g.line(55,42,55,50,'n');g.line(51,42,51,50,'v');g.put(52,42,'S');g.put(52,43,'S');g.put(53,42,'s');
 /* tronco inclinado para tras */
 g.poly([[16,29],[21,26],[31,26],[34,28],[35,33],[35,39],[34,45],[18,45],[17,39],[16,33]],'C');
 g.shade([[15,25],[22,25],[21,46],[15,46]],['C'],'c');g.shade([[15,25],[18.5,25],[18,46],[15,46]],['c'],'d');
 g.shade([[31,27],[36,27],[35,37],[31,37]],['C'],'D');
 g.line(21,29,31,28,'c',['C','D']);g.line(21,39,23,42,'c');g.line(28,42,30,39,'c');g.line(25,32,27,34,'c');g.line(18,44,33,44,'d');
 g.poly([[22,23],[27,23],[27,27],[22,27]],'S');g.shade([[21,23],[24,23],[24,28],[21,28]],['S'],'s');
 g.poly([[18,25],[21,26],[27,26],[30,25],[31,29.5],[17,29.5]],'c');g.shade([[16,24],[20,24],[20,30],[16,30]],['c'],'d');g.line(21,27,27,27,'D');
 putHead(g,2,3,{});
 /* braco da frente protegendo o queixo */
 g.poly([[29,26],[34,27],[35,32.5],[30,33.5]],'C');g.shade([[28,29],[36,29],[36,34],[28,34]],['C'],'c');g.line(31,27,33,27,'D');
 g.poly([[31,32.5],[35,32],[38.5,26.5],[35,25]],'S');g.shade([[31,29],[34,29],[35,33],[31,33]],['S'],'s');
 g.poly([[34.5,27.5],[38,28.5],[39.5,25.5],[36,24.5]],'A');g.line(36,27,38,26,'a');
 g.poly([[36,20.5],[40.5,20.5],[41.5,22],[41,25.5],[37,26],[36,24]],'S');g.line(38,21,38,24,'t');g.line(40,21,40,24,'t');g.put(40,21,'W');
 g.edge([[29,26],[34,27],[35,32.5],[30,33.5]],'d');
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}

/* ---- Selo de maos (Tigre): base firme, maos juntas no peito com os indicadores para cima ---- */
function sasukeSeal(){const g=PixGrid(56,80);
 guardLegs(g);guardTorso(g,0,0);
 putHead(g,8,6,{});
 /* braco de tras: do ombro ate o centro do peito */
 g.poly([[22,28],[26.5,29],[28,34.5],[23,35]],'c');g.shade([[21,28],[24,28],[24,36],[21,36]],['c'],'d');
 g.poly([[24,33.5],[28.5,33],[33,35],[31,38.5]],'s');g.shade([[24,36],[33,36],[33,39],[24,39]],['s'],'t');
 g.poly([[27,34],[30.5,34.5],[30,38.5],[26.5,38]],'a');
 /* braco da frente: do ombro ate o centro */
 g.poly([[35,27],[41,29],[41,34],[36,34.5]],'C');g.shade([[34,27],[38,27],[38,35],[34,35]],['C'],'c');g.line(38,28,40,29,'D');g.line(37,34,41,33,'d');
 g.poly([[36,33],[41,33],[39,38],[35,38]],'S');g.shade([[35,36],[41,36],[41,39],[35,39]],['S'],'s');
 g.poly([[35,34],[38.5,34],[37.5,38.5],[34,38.5]],'A');g.line(35,36,37,36,'a');
 /* maos entrelacadas e os dois indicadores para cima */
 g.poly([[30,31],[35.5,31],[36,37],[34,39],[30.5,39],[29.5,36]],'S');g.shade([[29,35],[37,35],[37,40],[29,40]],['S'],'s');
 g.line(31,33,35,33,'t');g.line(31,35,35,35,'t');g.put(33,37,'t');
 g.poly([[31.5,25],[34.5,25],[34.5,31.5],[31.5,31.5]],'S');g.line(33,25,33,30,'t');g.put(32,25,'W');
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}

/* ---- Chidori: agachado, mao da frente para baixo com o raio, a outra mao segurando o pulso ---- */
function sasukeChidori(){const g=PixGrid(56,80);
 /* raios que descem ate o chao (atras do corpo) */
 const bolt=(pts,k)=>{for(let i=0;i<pts.length-1;i++)g.line(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],k);};
 bolt([[44,48],[42,53],[45,57],[43,62],[46,67],[44,72],[47,75]],'Z');bolt([[48,49],[51,54],[49,59],[53,64],[51,70],[54,75]],'Z');
 bolt([[44,48],[42,53],[45,57],[43,62],[46,67]],'x');bolt([[48,49],[51,54],[49,59],[53,64]],'x');
 guardLegs(g);guardTorso(g,2,1);
 putHead(g,10,8,{});
 /* olho com Sharingan */
 g.put(28,21,'RR');g.put(35,21,'RR');
 /* braco de tras cruzando o corpo para segurar o pulso */
 g.poly([[24,30],[29,30],[31,35.5],[26,36.5]],'c');g.shade([[23,30],[26,30],[26,37],[23,37]],['c'],'d');
 g.poly([[27,35],[31,34],[39,38.5],[37,41.5]],'s');g.shade([[27,38],[39,38],[39,42],[27,42]],['s'],'t');
 g.poly([[31,36],[35,37],[34,40.5],[30,39.5]],'a');
 /* braco da frente para baixo, mao aberta no raio */
 g.poly([[37,28],[43,30],[44,35.5],[38.5,36]],'C');g.shade([[36,28],[40,28],[40,37],[36,37]],['C'],'c');g.line(40,29,42,30,'D');
 g.poly([[39.5,35],[44,35],[46.5,42],[42.5,43]],'S');g.shade([[39,38],[43,38],[44,43],[40,43]],['S'],'s');
 g.poly([[42,40],[46,39.5],[47,43],[43,44]],'A');g.line(43,42,46,41,'a');
 /* mao da outra segurando o pulso */
 g.poly([[38,37.5],[42,37],[42.5,41],[39,41.5]],'s');g.line(40,38,40,40,'t');
 /* bola de raio na mao */
 g.ell(47,47,7.5,6.5,'Z');g.ell(47,47,5.5,4.8,'x');g.ell(47,47,3,2.6,'X');
 for(const [a,b,c,d] of [[47,47,55,41],[47,47,55,50],[47,47,40,52],[47,47,50,38],[47,47,39,44],[47,47,53,55]])g.line(a,b,c,d,'x');
 for(const [x,y] of [[55,41],[55,50],[40,52],[50,38],[39,44],[53,55],[54,44],[41,49]])g.set(x,y,'X');
 g.put(44,45,'S');g.put(45,46,'S');g.put(44,46,'s'); /* dedos aparecendo no meio do raio */
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}

/* cores do fogo (Katon) e da madeira (Kawarimi) */
Object.assign(SAS2_PAL,{F:'#fff6c8',f:'#ffd23a',G:'#ff9a1e',g:'#e8481a',h:'#a02010',Y:'#5a1408',
 W1:'#c68a4e',W2:'#8a5a2e',W3:'#5a3818',W4:'#d9a96a',W5:'#3a2410',U:'#eef2f6',u:'#c8d0dc'});

/* ---- Katon: de pe, inclina o corpo e solta uma coluna de fogo pela boca ---- */
function sasukeKaton(){const g=PixGrid(80,80);
 /* o fogo e desenhado pelo jogo (efeito); o sprite so mostra a pose */
 /* pernas: base de luta aberta, peso para tras */
 guardLegs(g);
 /* tronco inclinado para a frente */
 guardTorso(g,2,2);
 /* cabeca para frente, olhos fechados de esforco e bochechas cheias */
 putHead(g,12,11,{shut:true});
 g.put(33,25,'S');g.put(34,26,'S');g.line(35,27,38,27,'S');
 /* mao em tigre diante da boca: dois indicadores */
 g.poly([[38,26],[43,26],[44,32],[39,32]],'S');g.shade([[38,30],[44,30],[44,33],[38,33]],['S'],'s');g.line(40,27,40,31,'t');g.line(42,27,42,31,'t');
 g.poly([[39,21],[42,21],[42,27],[39,27]],'S');g.put(40,21,'W');
 /* bracos: do ombro ate o centro */
 g.poly([[22,31],[27,31],[29,37],[24,38]],'c');g.shade([[21,31],[24,31],[24,39],[21,39]],['c'],'d');
 g.poly([[26,36],[30,36],[34,33],[32,30]],'s');g.poly([[27,36],[30,36],[31,38],[28,39]],'a');
 g.poly([[37,30],[43,32],[44,37],[38,38]],'C');g.shade([[36,30],[40,30],[40,39],[36,39]],['C'],'c');g.line(40,31,42,32,'D');
 g.poly([[38,36],[43,36],[44,32],[39,31]],'S');g.line(41,33,43,33,'t');
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}

/* ---- Kawarimi: o Sasuke some e deixa um tronco no lugar, com fumaca, folhas e a corda do selo ---- */
function sasukeLog(){const g=PixGrid(56,80);
 const cx=28;
 /* tronco de pe, de lado, mais largo que um boneco */
 g.poly([[cx-10,16],[cx+10,16],[cx+11,70],[cx-11,70]],'W1');
 g.shade([[cx-12,14],[cx-3,14],[cx-4,72],[cx-12,72]],['W1'],'W2');g.shade([[cx-12,14],[cx-8,14],[cx-8,72],[cx-12,72]],['W2'],'W3');
 g.shade([[cx+6,14],[cx+12,14],[cx+12,72],[cx+6,72]],['W1'],'W4');
 for(const [y,a,b] of [[22,-8,-2],[27,2,8],[33,-9,-4],[39,-1,6],[46,-8,-3],[52,3,9],[58,-7,-1],[64,-2,5]]){g.line(cx+a,y,cx+b,y+1,'W5');g.line(cx+a+1,y+1,cx+b-1,y+2,'W3');}
 g.put(cx-4,30,'W3');g.put(cx+3,48,'W3');
 /* topo cortado (anel de crescimento) */
 g.ell(cx,17,10,3.5,'W4');g.ell(cx,17,7,2.4,'W1');g.ell(cx,17,4,1.4,'W4');g.ell(cx,17,1.5,.6,'W2');
 /* corda enrolada */
 g.poly([[cx-11,40],[cx+11,41],[cx+11,44],[cx-11,43]],'U');g.shade([[cx-12,43],[cx+12,44],[cx+12,46],[cx-12,46]],['U'],'u');
 for(let x=-10;x<11;x+=3)g.line(cx+x,40,cx+x+1,44,'u');
 g.poly([[cx+8,43],[cx+11,43],[cx+13,50],[cx+10,51]],'U');g.line(cx+10,45,cx+11,49,'u');
 /* galho e folha */
 g.line(cx-10,26,cx-15,22,'W3');g.line(cx-15,22,cx-17,19,'W3');g.ell(cx-18,18,2.4,1.4,'g');g.line(cx-20,18,cx-16,18,'h');
 /* fumaca do Kage Bunshin em volta da base */
 for(const [x,y,r] of [[14,66,6],[8,60,5],[22,72,6],[42,68,7],[48,62,5],[36,74,6],[18,58,4],[40,60,4],[48,72,4]]){g.ell(x,y,r,r*.85,'U');g.ell(x-1,y+1,r*.65,r*.55,'u');}
 g.put(6,57,'U');g.put(50,58,'U');g.put(12,50,'u');g.put(44,52,'u');
 /* folhas voando */
 for(const [x,y] of [[10,36],[46,30],[6,24],[50,44],[18,10],[38,8],[52,18]]){g.put(x,y,'gh');g.set(x,y+1,'h');}
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}
/* ---- Defesa: bracos em X diante do peito, queixo baixo, olhos fechados ---- */
function sasukeBlock(){const g=PixGrid(56,80);
 guardLegs(g);guardTorso(g,0,2);
 putHead(g,8,8,{shut:true});
 /* manga de cada ombro descendo para o centro */
 g.poly([[22,31],[27,31],[30,37],[25,38]],'c');g.shade([[21,31],[24,31],[24,39],[21,39]],['c'],'d');
 g.poly([[36,29],[42,31],[42,36],[37,37]],'C');g.shade([[35,29],[39,29],[39,38],[35,38]],['C'],'c');g.line(39,30,41,31,'D');
 /* antebraco de tras: sobe da esquerda para o rosto (pele + faixa branca) */
 g.poly([[26,38],[31,37],[39,28],[35,25]],'s');g.shade([[26,36],[33,36],[33,39],[26,39]],['s'],'t');
 g.poly([[33,32],[38.5,31],[41,26],[37,23.5]],'A');g.shade([[33,31],[37,31],[37,33],[33,33]],['A'],'a');g.line(34,30,39,25,'a');
 /* antebraco da frente: cruza de baixo para cima por cima do outro */
 g.poly([[38,37],[43,35],[33,26],[29,29]],'S');g.shade([[29,28],[36,28],[36,31],[29,31]],['S'],'s');
 g.poly([[40,34],[44,32],[37,28],[34,31]],'A');g.shade([[38,29],[42,29],[42,32],[38,32]],['A'],'a');g.line(36,31,41,33,'a');
 /* punhos fechados no alto de cada antebraco */
 g.poly([[32,21],[37,21],[38,26],[33,27],[30,25]],'S');g.line(33,22,33,25,'t');g.line(35,22,35,25,'t');g.put(34,21,'W');
 g.poly([[39,21],[44,21],[45,25],[41,27],[38,25]],'S');g.line(40,22,40,25,'t');g.line(42,22,42,25,'t');g.put(43,21,'W');
 g.edge([[36,29],[42,31],[42,36],[37,37]],'d');
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}