/* Segundo quadro de respiracao para qualquer pose de pe: tudo acima da cintura sobe 1 pixel (cabeca, ombros, bracos)
   e a linha da cintura e repetida para nao abrir buraco. Pernas e pes ficam parados. */
function breathOf(g,waistY){
 const o=PixGrid(g.w,g.h);
 for(let y=0;y<g.h;y++){
  const sy=y<waistY-1?y+1:y<waistY?waistY:y; /* acima da cintura puxa a linha de baixo; a linha da cintura aparece duas vezes */
  for(let x=0;x<g.w;x++)o.G[y][x]=g.G[Math.min(sy,g.h-1)][x];}
 return o;}
const sasukeGuardB=()=>breathOf(sasukeGuard(),45);
const naruGuardB=()=>breathOf(naruGuard(),45);
