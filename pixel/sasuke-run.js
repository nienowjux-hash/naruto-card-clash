/* Ciclo de corrida do Sasuke (4 quadros), 56x80, olhando para a direita, tronco inclinado para a frente.
   Quadro 0: perna de perto a frente (contato). 1: passagem. 2: perna de perto atras. 3: passagem (outro lado). */
function runLimb(g,a,b,w,fill,shade){ /* segmento grosso de a ate b, com sombra do lado de baixo */
 const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L*w/2,ny=dx/L*w/2;
 g.poly([[a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]],fill);
 g.poly([[a[0],a[1]],[b[0],b[1]],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]],shade);
 g.ell(a[0],a[1],w/2,w/2,fill);g.ell(b[0],b[1],w/2,w/2,fill);}
function runLeg(g,hip,knee,ank,near){
 const sk=near?'S':'s',sh=near?'s':'t',wrap=near?'A':'a',wsh=near?'a':'r',shoe=near?'N':'n',hi=near?'D':'v';
 runLimb(g,hip,knee,6,sk,sh);                         /* coxa */
 runLimb(g,knee,ank,5,sk,sh);                         /* canela */
 const m=[knee[0]+(ank[0]-knee[0])*.45,knee[1]+(ank[1]-knee[1])*.45];runLimb(g,m,[ank[0],ank[1]-1],5,wrap,wsh); /* atadura */
 for(let i=1;i<4;i++){const q=[m[0]+(ank[0]-m[0])*i/4,m[1]+(ank[1]-m[1])*i/4];g.line(q[0]-2,q[1],q[0]+2,q[1],wsh,[wrap]);}
 /* sandalia: bico para a frente */
 const x=ank[0],y=ank[1];
 g.poly([[x-3,y-1],[x+3,y-1],[x+6.5,y+2],[x+6.5,y+4],[x-3,y+4.5]],shoe);g.line(x-2,y+4,x+6,y+4,near?'n':'1');g.line(x-2,y,x+3,y,hi);g.put(x+5,y+2,near?'SS':'ss');}
function runArm(g,sh,el,ha,near){
 const sl=near?'C':'c',shd=near?'c':'d';
 runLimb(g,sh,el,5,sl,shd);                           /* manga */
 const m=[el[0]+(ha[0]-el[0])*.5,el[1]+(ha[1]-el[1])*.5];
 runLimb(g,el,m,4,near?'S':'s',near?'s':'t');          /* antebraco */
 runLimb(g,m,ha,4,near?'A':'a',near?'a':'r');          /* atadura */
 g.ell(ha[0]+(ha[0]-el[0])*.1,ha[1]+(ha[1]-el[1])*.1,2.6,2.6,near?'S':'s');
 g.line(ha[0]-1,ha[1]+1,ha[0]+2,ha[1]+1,near?'t':'t',[near?'S':'s']);}
const RUN_POSE=[
 /* near=perto da camera; far=longe. hip fixo, joelho e tornozelo variam */
 {nearK:[36,58],nearA:[41,70],farK:[21,62],farA:[12,69],nearArm:[[28,36],[22,40]],farArm:[[33,40],[40,35]],bob:0},
 {nearK:[28,60],nearA:[27,71],farK:[34,57],farA:[24,63],nearArm:[[27,40],[22,45]],farArm:[[32,38],[35,43]],bob:1},
 {nearK:[21,62],nearA:[12,69],farK:[36,58],farA:[41,70],nearArm:[[33,40],[40,35]],farArm:[[28,36],[22,40]],bob:0},
 {nearK:[34,57],nearA:[24,63],farK:[28,60],farA:[27,71],nearArm:[[32,38],[35,43]],farArm:[[27,40],[22,45]],bob:1}];
function sasukeRunFrame(i){const P=RUN_POSE[i%4],g=PixGrid(56,80),b=P.bob; /* b: sobe 1 pixel na passagem */
 const hip=[26,47-b];
 /* braco de longe e perna de longe ficam atras do tronco */
 runArm(g,[32,31-b],[P.farArm[0][0],P.farArm[0][1]-b],[P.farArm[1][0],P.farArm[1][1]-b],false);
 runLeg(g,hip,P.farK,P.farA,false);
 /* bermuda caqui */
 g.poly([[20,45-b],[34,45-b],[37,50-b],[36,55-b],[30,56-b],[26,52-b],[22,55-b],[18,53-b],[18,49-b]],'P');
 g.shade([[16,44],[23,44],[22,57],[16,57]],['P'],'p');g.shade([[24,50],[30,50],[30,57],[24,57]],['P'],'p');
 g.line(19,53-b,23,54-b,'q');g.line(31,54-b,35,53-b,'q');g.line(27,47-b,27,51-b,'q');g.put(34,48-b,'W');
 runLeg(g,hip,P.nearK,P.nearA,true);
 /* tronco inclinado: ombros a frente do quadril */
 g.poly([[20,34-b],[27,28-b],[36,28-b],[40,31-b],[39,37-b],[35,44-b],[34,46-b],[20,46-b],[19,41-b]],'C');
 g.shade([[18,28],[26,28],[25,47],[18,47]],['C'],'c');g.shade([[18,28],[21,28],[22,47],[18,47]],['c'],'d');
 g.shade([[36,30],[41,30],[39,38],[36,38]],['C'],'D');
 g.line(27,31-b,38,30-b,'c',['C','D']);g.line(25,40-b,28,43-b,'c');g.line(31,45-b,34,41-b,'c');g.line(30,36-b,32,38-b,'c');
 g.line(20,45-b,34,45-b,'d');
 /* pescoco e gola */
 g.poly([[31,27-b],[36,27-b],[37,31-b],[31,31-b]],'S');g.shade([[30,27],[33,27],[33,32],[30,32]],['S'],'s');
 g.poly([[26,28-b],[29,29-b],[36,29-b],[39,28-b],[40,32-b],[25,32-b]],'c');g.shade([[24,27],[28,27],[28,33],[24,33]],['c'],'d');g.line(29,30-b,37,30-b,'D');
 putHead(g,11,7-b);
 /* braco de perto por cima do tronco */
 runArm(g,[34,32-b],[P.nearArm[0][0],P.nearArm[0][1]-b],[P.nearArm[1][0],P.nearArm[1][1]-b],true);
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}
const sasukeRun0=()=>sasukeRunFrame(0),sasukeRun1=()=>sasukeRunFrame(1),sasukeRun2=()=>sasukeRunFrame(2),sasukeRun3=()=>sasukeRunFrame(3);
