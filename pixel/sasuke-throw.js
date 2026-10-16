/* Arremesso de kunai/shuriken do Sasuke: 3 quadros na base de luta (mesmas pernas, bermuda, tronco e cabeca da base).
   0 = preparar (braco armado atras, o outro mira), 1 = lancar (braco esticado a frente), 2 = terminar (braco desce). 56x80, olhando para a direita. */
const THROW_ARMS=[
 {near:[[36,29],[30,34],[23,30]],far:[[22,29],[32,36],[44,34]],sx:-1},
 {near:[[37,29],[44,28],[51,27]],far:[[22,29],[15,34],[9,40]],sx:1},
 {near:[[37,29],[43,34],[47,41]],far:[[22,29],[17,36],[13,43]],sx:1}];
function sasukeThrowFrame(k){const A=THROW_ARMS[k],g=PixGrid(56,80),sx=A.sx;
 /* braco de longe (atras do tronco) */
 runArm(g,A.far[0],A.far[1],A.far[2],false);
 /* ---- perna de tras: joelho aberto para a esquerda ---- */
 g.poly([[17,50],[23.5,52],[16.5,62],[10,59]],'s');g.shade([[9,52],[16,52],[12,62],[9,62]],['s'],'t');g.line(19,53,14,59,'S',['s']);
 g.poly([[10,58],[16.5,60],[14.5,71],[8,71]],'s');g.shade([[7,58],[11,58],[10,71],[7,71]],['s'],'t');g.put(12,59,'S');g.put(13,60,'S');
 g.poly([[9,64],[15.5,64],[14.6,71],[8,71]],'a');for(let y=65;y<71;y+=2)g.line(9,y,14,y,'r');g.line(12,64,14,64,'A');
 g.poly([[6,70],[15,70],[16.5,72],[16.5,75],[4.5,75],[4.5,72]],'n');g.line(6,71,14,71,'N');g.line(5,74,16,74,'1');g.put(5,72,'ss');g.put(5,73,'ts');g.line(8,72,12,72,'v');
 /* ---- perna da frente ---- */
 g.poly([[31,50],[37,49],[44.5,57],[38.5,61]],'S');g.shade([[30,50],[34,50],[40,61],[37,61]],['S'],'s');g.put(42,56,'W');g.put(41,55,'W');
 g.poly([[38,57],[44.5,56],[45.5,71],[39,71]],'S');g.shade([[37,57],[41,57],[41.5,71],[38,71]],['S'],'s');g.line(42,58,44,58,'t');
 g.poly([[39,64],[45.3,64],[45.5,71],[39,71]],'A');g.shade([[38,64],[41,64],[41,71],[38,71]],['A'],'a');for(let y=65;y<71;y+=2)g.line(41,y,45,y,'a');
 g.poly([[37,70],[46,70],[49.5,72],[49.5,75],[37,75]],'N');g.line(37,74,49,74,'n');g.line(38,71,44,71,'v');g.put(46,72,'SSS');g.put(46,73,'sSs');g.line(39,72,43,72,'D');
 /* ---- bermuda caqui ---- */
 g.poly([[19,45],[36,45],[40,51],[37,56],[31,53],[28,50],[24,53],[18,56],[15,51]],'P');
 g.shade([[14,45],[22,45],[21,57],[14,57]],['P'],'p');g.shade([[24,48],[31,48],[31,54],[24,54]],['P'],'p');g.shade([[26,49],[29,49],[29,52],[26,52]],['p'],'q');
 g.line(16,52,21,55,'q');g.line(32,53,37,55,'q');g.line(28,46,28,49,'q');g.line(34,47,38,51,'p');g.line(20,48,22,52,'q');
 g.line(33,49,35,52,'q');g.line(17,49,19,51,'p');g.put(36,47,'W');g.put(37,48,'W');
 /* ---- tronco: no preparar gira um pouco para tras, no lancar vai a frente ---- */
 const t=sx;
 g.poly([[20+t,29],[25+t,27],[35+t,27],[39+t,29],[39+t,34],[37,40],[35.5,46],[20,46],[19,40],[19+t,34]],'C');
 g.shade([[18,26],[25,26],[24,47],[18,47]],['C'],'c');g.shade([[18,26],[21.5,26],[21,47],[18,47]],['c'],'d');
 g.shade([[35+t,28],[40+t,28],[38,38],[35.5,38]],['C'],'D');
 g.line(25+t,30,35+t,29,'c',['C','D']);g.line(24,41,26,44,'c');g.line(31,44,33,41,'c');g.line(29,34,31,36,'c');g.line(27,38,28,42,'c');
 g.line(20,45,35,45,'d');g.line(26,46,30,46,'c');
 /* ---- pescoco, gola e cabeca ---- */
 g.poly([[28+t,25],[33+t,25],[33+t,29],[28+t,29]],'S');g.shade([[27+t,25],[30+t,25],[30+t,30],[27+t,30]],['S'],'s');g.line(29+t,27,32+t,27,'t');
 g.poly([[24+t,26],[27+t,27],[33+t,27],[36+t,26],[37+t,30.5],[23+t,30.5]],'c');g.shade([[22,25],[26,25],[26,31],[22,31]],['c'],'d');g.line(27+t,28,33+t,28,'D');
 putHead(g,8+t,6);
 /* braco de perto por cima do tronco */
 runArm(g,A.near[0],A.near[1],A.near[2],true);
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}
const sasukeThrowWind=()=>sasukeThrowFrame(0),sasukeThrow=()=>sasukeThrowFrame(1),sasukeThrowEnd=()=>sasukeThrowFrame(2);
