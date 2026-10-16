/* Manto da Kyubi: o Naruto de quatro em varias poses (agachar, galope em 2 quadros e bote) para a animacao do Rasengan.
   Mesmo estilo do naruFours (pixel/naruto.js): membros de capsulas com luz e sombra, 96x58, ancora no chao (ax 48, ay 56), olhando para a direita.
   Cada quadro e descrito por pontos (quadril, ombro, joelho/cotovelo, pe/mao); o desenho e o mesmo para todos. */
function capLit(g,x0,y0,x1,y1,w0,w1,k,dk,lk){const n=Math.max(2,Math.ceil(Math.hypot(x1-x0,y1-y0)*1.2)),cs=[];
 for(let i=0;i<=n;i++){const u=i/n;cs.push([x0+(x1-x0)*u,y0+(y1-y0)*u,(w0+(w1-w0)*u)/2]);}
 for(const [cx,cy,w] of cs)g.ell(cx,cy,w,w,k);
 for(const [cx,cy,w] of cs){for(let y=Math.floor(cy-w);y<=cy+w;y++)for(let x=Math.floor(cx-w);x<=cx+w;x++){
  if(y<0||x<0||y>=g.h||x>=g.w||g.G[y][x]!==k)continue;const dx=x+.5-cx,dy=y+.5-cy;if(dx*dx+dy*dy>w*w)continue;
  if(dy>w*.28&&dk)g.G[y][x]=dk;else if(dy<-w*.5&&lk)g.G[y][x]=lk;}}}
function fourHand(g,x,y,k){g.ell(x,y,5,2.6,k);g.shade([[x-6,y+1],[x+6,y+1],[x+6,y+4],[x-6,y+4]],[k],'s');for(let i=0;i<4;i++){g.line(x-3.5+i*2.4,y+1.5,x-2.5+i*2.4,y+3.5,'t');g.set(Math.round(x-2+i*2.4),Math.round(y+4),'W');}}
function fourShoe(g,x,y,front){const k=front?'N':'n',hi=front?'v':'b';g.poly([[x-8,y-3],[x+2,y-3],[x+4,y+3],[x-9,y+3]],k);g.line(Math.round(x-7),Math.round(y+2),Math.round(x+2),Math.round(y+2),hi);g.put(Math.round(x-6),Math.round(y-2),'SS');}
const FOUR_OX=8; /* margem a esquerda para os pes de tras nao cortarem: a ancora destes quadros e x=48 */
function naruFourFrame(P0){const sh=p=>[p[0]+FOUR_OX,p[1]],P={hip:sh(P0.hip),sh:sh(P0.sh),farLeg:{k:sh(P0.farLeg.k),f:sh(P0.farLeg.f)},nearLeg:{k:sh(P0.nearLeg.k),f:sh(P0.nearLeg.f)},farArm:{e:sh(P0.farArm.e),h:sh(P0.farArm.h)},nearArm:{e:sh(P0.nearArm.e),h:sh(P0.nearArm.h)}};const g=PixGrid(96,58);HEADHOOK=null;const hx=P.hip[0],hy=P.hip[1],sx=P.sh[0],sy=P.sh[1],mx=(hx+sx)/2,my=(hy+sy)/2+1;
 /* ---- perna e braco de longe (escuros) ---- */
 capLit(g,hx+2,hy+4,P.farLeg.k[0],P.farLeg.k[1],8,6,'q');capLit(g,P.farLeg.k[0],P.farLeg.k[1],P.farLeg.f[0],P.farLeg.f[1],6,5,'q');fourShoe(g,P.farLeg.f[0],P.farLeg.f[1],false);
 capLit(g,sx,sy+2,P.farArm.e[0],P.farArm.e[1],7,6,'q');capLit(g,P.farArm.e[0],P.farArm.e[1],P.farArm.h[0],P.farArm.h[1],6,5,'q');fourHand(g,P.farArm.h[0],P.farArm.h[1],'s');
 /* ---- tronco de raposa: costas na luz, barriga em sombra ---- */
 capLit(g,hx,hy,mx,my,18,19,'O','q','Q');capLit(g,mx,my,sx,sy,19,17,'O','q','Q');
 /* faixa azul dos ombros e costas, e a linha do cinto */
 const bx=sx-46,by=sy-30;g.poly([[30+bx,18+by],[44+bx,20+by],[48+bx,26+by],[44+bx,30+by],[34+bx,26+by]],'N');g.shade([[30+bx,26+by],[50+bx,26+by],[50+bx,31+by],[30+bx,31+by]],['N'],'n');g.line(31+bx,19+by,43+bx,21+by,'v');
 g.line(Math.round(hx+6),Math.round(hy-7),Math.round(hx+8),Math.round(hy+11),'m',['O','Q','q']);
 /* ---- perna de perto: coxa, canela com atadura e sandalia ---- */
 capLit(g,hx+8,hy+4,P.nearLeg.k[0],P.nearLeg.k[1],9,8,'O','q','Q');capLit(g,P.nearLeg.k[0],P.nearLeg.k[1],P.nearLeg.f[0],P.nearLeg.f[1],7,6,'O','q','Q');
 {const kx=P.nearLeg.k[0],ky=P.nearLeg.k[1],fx=P.nearLeg.f[0],fy=P.nearLeg.f[1];capLit(g,kx+(fx-kx)*.45,ky+(fy-ky)*.45,fx,fy-1,6,5,'A','a','A');}
 fourShoe(g,P.nearLeg.f[0],P.nearLeg.f[1],true);
 /* ---- gola de pelo e cabeca ---- */
 g.ell(sx+1,sy-3,5,4,'W');g.shade([[sx-4,sy-1],[sx+8,sy-1],[sx+8,sy+3],[sx-4,sy+3]],['W'],'A');
 naruHead(g,sx-8,sy-23,{mouth:true});
 /* ---- braco de perto: manga laranja, atadura azul no pulso e mao em garra ---- */
 capLit(g,sx+4,sy,P.nearArm.e[0],P.nearArm.e[1],8,7,'O','q','Q');capLit(g,P.nearArm.e[0],P.nearArm.e[1],P.nearArm.h[0],P.nearArm.h[1],7,6,'O','q','Q');
 {const ex=P.nearArm.e[0],ey=P.nearArm.e[1],ax=P.nearArm.h[0],ay=P.nearArm.h[1];capLit(g,ex+(ax-ex)*.55,ey+(ay-ey)*.55,ax-(ax-ex)*.08,ay-(ay-ey)*.08,6,5.5,'N','n','v');}
 fourHand(g,P.nearArm.h[0],P.nearArm.h[1],'S');
 g.outline('K');g.selout('K',NAR_DARK);
 return g;}
/* quadros: agachar (carregando a esfera), galope A (patas da frente esticadas), galope B (patas de tras esticadas) e bote (golpe) */
const FOUR_POSES={
 coil:{hip:[14,24],sh:[44,35],farLeg:{k:[24,43],f:[13,51]},nearLeg:{k:[30,44],f:[18,52]},farArm:{e:[50,45],h:[56,52]},nearArm:{e:[58,44],h:[66,52]}},
 runA:{hip:[14,25],sh:[46,28],farLeg:{k:[24,44],f:[17,51]},nearLeg:{k:[28,42],f:[22,50]},farArm:{e:[54,33],h:[64,40]},nearArm:{e:[58,29],h:[70,34]}},
 runB:{hip:[10,27],sh:[44,32],farLeg:{k:[11,41],f:[2,47]},nearLeg:{k:[13,38],f:[3,43]},farArm:{e:[52,42],h:[49,51]},nearArm:{e:[57,41],h:[55,50]}},
 lunge:{hip:[10,28],sh:[46,28],farLeg:{k:[10,43],f:[2,50]},nearLeg:{k:[14,36],f:[4,42]},farArm:{e:[56,38],h:[64,46]},nearArm:{e:[62,29],h:[75,32]}}};
const naruFourCoil=()=>naruFourFrame(FOUR_POSES.coil),naruFourRunA=()=>naruFourFrame(FOUR_POSES.runA),naruFourRunB=()=>naruFourFrame(FOUR_POSES.runB),naruFourLunge=()=>naruFourFrame(FOUR_POSES.lunge);
