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

/* Amaterasu: a mao tampa o olho que sangra (como no anime). Base: a base de luta, com o braco da frente refeito subindo ate o rosto. */
SAS2_PAL.x='#a8101c';SAS2_PAL.X='#e02a3c';
function sasukeEyeHand(){const src=sasukeGuard(),g=PixGrid(56,80),W=56,H=80;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=src.G[y][x];if(ch==='.')continue;if(x>=42&&y>=26&&y<=52)continue;g.G[y][x]=ch;}
 g.poly([[37,29],[45,30],[46,35],[38,36]],'C');g.shade([[36,33],[47,33],[47,37],[36,37]],['C'],'c');g.line(39,30,44,31,'D');
 g.poly([[43,31],[47,32],[42,22],[38,23]],'S');g.shade([[41,27],[47,27],[44,33],[41,33]],['S'],'s');
 g.poly([[40.5,25.5],[44.5,27.5],[43.5,29],[39.5,27]],'A');g.line(41,26,44,28,'a');
 g.poly([[29,14],[38,14],[39,22],[30,23.5]],'S');g.shade([[29,20],[39,20],[39,24],[29,24]],['S'],'s');
 g.line(32,15,32,21,'t');g.line(34,15,34,21,'t');g.line(36,15,36,21,'t');g.line(30,22,38,22,'t');
 for(const [x,y] of [[34,24],[34,25],[35,26],[35,27],[34,28],[36,25],[33,23]])g.put(x,y,'x');g.put(34,26,'X');g.put(35,28,'x');g.put(31,23,'X');
 g.outline('K');g.selout('K',SAS_DARK);
 return g;}
