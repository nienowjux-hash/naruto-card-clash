/* Quadros de transicao do Sasuke, derivados das poses desenhadas a mao.
   sasukePunchWind: preparar o soco - tronco e cabeca recuados, punho da frente puxado perto do ombro. */
function sasukePunchWind(){const src=sasukePunch(),g=PixGrid(56,80),W=56,H=80;
 /* o braco da frente esticado sai (so a parte distal) para ser redesenhado dobrado */
 const armGone=(x,y)=>x>=43&&y>=24&&y<=36;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=src.G[y][x];if(ch==='.'||armGone(x,y))continue;
  const back=y<46?Math.round((46-y)*.1):0; /* coluna do tronco para tras, mais quanto mais alto */
  const nx=x-back;if(nx>=0)g.G[y][nx]=ch;}
 /* antebraco dobrado: sai do ombro, sobe um pouco e o punho fica a frente do peito */
 g.poly([[38,28],[43,29],[44,34],[38,35]],'C');g.shade([[37,31],[45,31],[45,36],[37,36]],['C'],'c');
 g.poly([[40,33],[45,33],[45,38],[40,38]],'S');g.shade([[39,36],[46,36],[46,39],[39,39]],['S'],'s');
 g.poly([[40.5,36],[45,36],[45,39],[40.5,39]],'A');g.line(42,37,42,38,'a');
 g.poly([[43,30],[48,30],[49,34],[48,38],[43,38]],'S');g.shade([[42,36],[49,36],[49,39],[42,39]],['S'],'s');
 g.line(44,32,47,32,'t');g.line(44,34,48,34,'t');g.put(46,31,'W');
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}

/* preparar o chute: tronco um pouco para tras e a perna da frente recolhida (joelho para cima) */
function sasukeKickWind(){const src=sasukeGuard(),g=PixGrid(56,80),W=56,H=80;
 const leg=(x,y)=>x>=33&&y>=58; /* canela e pe da frente */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=src.G[y][x];if(ch==='.')continue;
  if(leg(x,y)){const nx=x-3,ny=y-6;if(nx>=0&&ny>=0)g.G[ny][nx]=ch;continue;}
  const back=y<46?Math.round((46-y)*.08):0;const nx=x-back;if(nx>=0)g.G[y][nx]=ch;}
 /* liga o joelho a canela erguida */
 g.poly([[34,55],[41,54],[40,60],[33,62]],'S');g.shade([[33,56],[37,56],[36,62],[33,62]],['S'],'s');
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}
