/* Corrida do Naruto: mesmos 4 quadros do Sasuke, com a roupa do Naruto */
const NAR_RUN=Object.assign({},NAR_STD,{collar:(x,y)=>(y>=26&&y<=32&&x>=23&&x<=40)?1:(y>=32&&y<=36&&x>=18&&x<=44)?2:(y>=44)?2:0,cover:(x,y)=>y>=50&&y<=69,folds:[[20,57,16,61,'m'],[41,58,43,62,'m']],extra:g=>{for(const [x,y] of [[26,33],[29,33],[32,32],[35,32]])if(g.G[y]&&g.G[y][x]!=='.')g.G[y][x]='W';}});
const naruRun0=naruFrom(()=>sasukeRunFrame(0),NAR_RUN),naruRun1=naruFrom(()=>sasukeRunFrame(1),NAR_RUN),naruRun2=naruFrom(()=>sasukeRunFrame(2),NAR_RUN),naruRun3=naruFrom(()=>sasukeRunFrame(3),NAR_RUN);
