/* Grade de pixel art: formas rasterizadas sem anti-aliasing, sombras por regiao, contorno automatico e pixels avulsos */
function PixGrid(w,h){
 const G=Array.from({length:h},()=>Array(w).fill('.'));
 const inb=(x,y)=>x>=0&&y>=0&&x<w&&y<h;
 const set=(x,y,k)=>{if(inb(x,y))G[y][x]=k;};
 const inside=(pts,px,py)=>{let c=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))c=!c;}return c;};
 const bbox=pts=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const [x,y] of pts){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}return[Math.floor(x0),Math.floor(y0),Math.ceil(x1),Math.ceil(y1)];};
 const api={G,w,h,set,
  /* preenche um poligono (centro do pixel dentro) */
  poly(pts,k,only){const [x0,y0,x1,y1]=bbox(pts);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(inb(x,y)&&inside(pts,x+.5,y+.5)&&(!only||only.includes(G[y][x])))G[y][x]=k;return api;},
  /* troca a cor so dentro do poligono: usado para sombra e brilho */
  shade(pts,from,to){const [x0,y0,x1,y1]=bbox(pts);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(inb(x,y)&&inside(pts,x+.5,y+.5)&&from.includes(G[y][x]))G[y][x]=to;return api;},
  ell(cx,cy,rx,ry,k){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry;if(dx*dx+dy*dy<=1)set(x,y,k);}return api;},
  /* linha de 1 pixel (Bresenham) */
  line(x0,y0,x1,y1,k,only){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
   for(;;){if(inb(x0,y0)&&(!only||only.includes(G[y0][x0])))G[y0][x0]=k;if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}return api;},
  /* contorno das bordas de um poligono, desenhado por dentro */
  edge(pts,k,only){for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];api.line(a[0],a[1],b[0],b[1],k,only);}return api;},
  /* fileira de pixels escrita a mao: '.' nao mexe */
  put(x,y,str){for(let i=0;i<str.length;i++)if(str[i]!=='.')set(x+i,y,str[i]);return api;},
  /* contorno externo de 1 pixel em volta da silhueta inteira */
  outline(k){const add=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(G[y][x]!=='.')continue;if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>inb(x+dx,y+dy)&&G[y+dy][x+dx]!=='.'&&G[y+dy][x+dx]!==k))add.push([x,y]);}for(const [x,y] of add)G[y][x]=k;return api;},
  /* contorno seletivo: no lado de cima/direita (luz) a borda usa um tom escuro do proprio material; embaixo/esquerda fica o contorno escuro */
  selout(k,dark){for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(G[y][x]!==k)continue;
   const below=inb(x,y+1)?G[y+1][x]:'.',left=inb(x-1,y)?G[y][x-1]:'.';
   const src=[below,left].find(c=>c!=='.'&&c!==k&&dark[c]);
   if(src&&(inb(x,y-1)?G[y-1][x]:'.')==='.'||src&&(inb(x+1,y)?G[y][x+1]:'.')==='.'){if(src)G[y][x]=dark[src];}}return api;},
  /* linha interna onde uma regiao encosta em outra (ex.: braco na frente do tronco) */
  seam(front,back,k){const add=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!front.includes(G[y][x]))continue;if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>inb(x+dx,y+dy)&&back.includes(G[y+dy][x+dx])))add.push([x,y]);}for(const [x,y] of add)G[y][x]=k;return api;},
  draw(cv,pal,s){cv.width=w*s;cv.height=h*s;const c=cv.getContext('2d');for(let y=0;y<h;y++)for(let x=0;x<w;x++){const k=G[y][x];if(k==='.')continue;c.fillStyle=pal[k]||'#f0f';c.fillRect(x*s,y*s,s,s);}}};
 return api;}
