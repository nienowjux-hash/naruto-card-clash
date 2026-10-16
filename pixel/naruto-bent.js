/* Naruto de lado, curvado para a frente com as maos nos joelhos e o traseiro empinado para tras, olhando para a frente.
   Grade 56x80 olhando para a direita (o jogo espelha), pes no chao em y=75; mesma paleta e cabeca dos outros sprites dele.
   Usado no Sennen Gorōshi (o Kakashi chega por tras). */
function naruBent(){const g=PixGrid(56,80);
 /* perna de tras (mais escura) */
 g.poly([[14,50],[21,52],[24,62],[22,72],[17,72],[19,62]],'q');g.line(18,60,21,70,'m',['q']);
 g.poly([[16,71],[24,71],[25,75],[14,75]],'n');g.line(16,72,23,72,'N',['n']);
 /* traseiro e quadril: bem empinado para tras (esquerda), redondo, com vinco */
 g.ell(16,49,9,7.2,'O');g.ell(14.5,46.5,5.5,3.6,'Q');g.shade([[6,51],[26,51],[26,57],[6,57]],['O','Q'],'q');
 g.line(9,44,8,51,'q',['O','Q']);g.line(12,53,20,55,'m',['q']);
 /* perna da frente: coxa ate o joelho, canela ate o pe, bolsinha azul na coxa e atadura branca na canela */
 g.poly([[18,52],[27,52],[35,60],[31,64]],'O');g.poly([[31,59],[36,61],[34,72],[29,72]],'O');
 g.shade([[18,57],[34,62],[31,64],[18,59]],['O'],'q');g.line(22,53,32,59,'Q',['O']);g.line(33,62,32,70,'q',['O']);
 g.poly([[22,55],[26,56],[25,60],[21,59]],'N');g.line(22,55,26,56,'v',['N']);
 g.poly([[29,66],[34,66],[34,70],[29,70]],'W');g.line(29,68,34,68,'A');
 g.poly([[27,71],[37,71],[39,75],[26,75]],'N');g.line(27,74,38,74,'n');g.line(28,72,35,72,'v',['N']);g.put(35,72,'SS');
 /* tronco do casaco: das costas (quadril) ate os ombros, inclinado para a frente, com dobras */
 g.poly([[9,44],[27,28],[38,32],[40,38],[27,52],[14,53]],'O');
 g.shade([[14,47],[40,39],[27,52],[14,53]],['O'],'q');g.line(11,44,27,30,'Q',['O']);g.line(13,45,28,31,'Q',['O']);
 for(const [a,b,c,d] of [[16,44,24,40],[19,48,28,43],[22,51,31,46],[15,40,22,36]])g.line(a,b,c,d,'q',['O']);
 g.line(9,45,14,53,'m',['O','q']);
 /* faixa azul dos ombros e gola branca */
 g.poly([[25,29],[33,27],[40,32],[38,35],[30,33]],'N');g.line(26,30,37,32,'v',['N']);g.line(29,33,38,35,'n',['N']);
 g.poly([[33,26],[39,26],[42,30],[37,31]],'W');g.line(34,30,41,30,'A',['W']);
 /* braco de tras (atras do corpo) descendo ate o joelho de tras */
 g.poly([[30,35],[34,35],[31,48],[27,48]],'q');g.line(31,37,29,47,'m',['q']);g.ell(27.5,50,2.8,2.6,'s');g.put(26,51,'tt');
 /* braco da frente: ombro -> cotovelo -> mao apoiada no joelho da frente, com contorno da manga sobre o tronco */
 g.poly([[34,33],[40,35],[39,41],[38,47],[33,47],[34,41]],'O');g.line(36,35,38,46,'Q',['O']);g.line(34,36,33,46,'q',['O']);
 g.poly([[33,46],[38,46],[37,49],[33,49]],'m');
 g.ell(35,53,3.4,3,'S');g.line(32,55,37,55,'t');g.put(36,51,'s');g.put(32,53,'s');
 g.seam(['O','Q'],['q'],'m');
 /* pescoco e cabeca olhando para a frente */
 g.poly([[36,24],[41,24],[41,28],[36,28]],'s');
 naruHead(g,20,6,{});
 g.outline('K');
 return g;}
