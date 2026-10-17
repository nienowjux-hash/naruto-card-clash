/* Icones em pixel art dos itens (grade 24x24, mostrados em 2x). itemIcon(id) devolve um canvas; icoImg(id) devolve a tag <img> pronta para o HTML.
   Cada item tem seu desenho em ICON_DRAW; talismas usam uma paleta por elemento (E/e/L = cor, sombra e brilho). */
const ICON_PAL={K:'#120e08',M:'#e6ecf6',H:'#ffffff',m:'#9aa6bc',d:'#566078',
 Y:'#ffd860',y:'#c08a28',o:'#8a5a14',b:'#a8743e',B:'#6e4626',D:'#3e2614',
 C:'#5f8a48',c:'#43663a',G:'#7cb862',g:'#4a7a3c',
 N:'#3c5084',v:'#6c88c8',n:'#222e56',R:'#d83c4c',r:'#8c1c2c',F:'#ff8a6a',
 W:'#f6f2e6',w:'#c8c0aa',P:'#ead6a0',p:'#b89c60',Z:'#2a2a38',z:'#4c4c60',q:'#1a1a24',
 U:'#a060e0',u:'#6a38a0'};
const ICON_ELEM={fogo:{E:'#ff6a2a',e:'#b03a12',L:'#ffd0a0'},agua:{E:'#3aa0ff',e:'#1c60b0',L:'#c0e8ff'},terra:{E:'#b08850',e:'#6e5028',L:'#e8d0a0'},vento:{E:'#6ee0a0',e:'#2e9060',L:'#d0ffe4'},raio:{E:'#ffe040',e:'#b89a10',L:'#fffbc0'}};
/* lamina diagonal: de (x0,y0) a (x1,y1), com largura w; luz em cima */
function icoBlade(g,x0,y0,x1,y1,w,c1,c2,hi){const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy),nx=-dy/L*w/2,ny=dx/L*w/2,tip=[x1+dx/L*1.5,y1+dy/L*1.5];
 g.poly([[x0+nx,y0+ny],[x1+nx,y1+ny],tip,[x1-nx,y1-ny],[x0-nx,y0-ny]],c1);g.poly([[x0,y0],[x1,y1],tip,[x1-nx,y1-ny],[x0-nx,y0-ny]],c2);g.line(x0+nx,y0+ny,x1+nx,y1+ny,hi,[c1,c2]);}
function icoElemMark(g,el,cx,cy){cx=Math.round(cx);cy=Math.round(cy); /* simbolo do elemento, 7x7, em L sobre disco E */
 if(el==='fogo'){g.poly([[cx,cy-4],[cx+2,cy-1],[cx+3,cy+2],[cx,cy+4],[cx-3,cy+2],[cx-2,cy-1]],'L');g.poly([[cx,cy+0],[cx+1,cy+2],[cx,cy+3.5],[cx-1,cy+2]],'E');}
 else if(el==='agua'){g.poly([[cx,cy-4],[cx+3,cy+1],[cx+2,cy+3.5],[cx-2,cy+3.5],[cx-3,cy+1]],'L');g.put(cx-1,cy+1,'EE');g.put(cx-1,cy+2,'E');}
 else if(el==='terra'){g.poly([[cx,cy-4],[cx+4,cy],[cx,cy+4],[cx-4,cy]],'L');g.poly([[cx,cy-2],[cx+2,cy],[cx,cy+2],[cx-2,cy]],'e');}
 else if(el==='vento'){g.line(cx-4,cy-2,cx+2,cy-2,'L');g.line(cx+2,cy-2,cx+3,cy-1,'L');g.line(cx-4,cy+0,cx+3,cy+0,'L');g.line(cx-3,cy+2,cx+1,cy+2,'L');g.line(cx+1,cy+2,cx+2,cy+3,'L');g.put(cx-4,cy-2,'L');}
 else{g.poly([[cx+1,cy-4],[cx-3,cy+0.5],[cx-0.5,cy+0.5],[cx-1.5,cy+4],[cx+3,cy-1],[cx+0.5,cy-1]],'L');}}
function icoTalisman(el){return g=>{ /* medalhao redondo com cordao */
 g.line(8,2,11,8,'B');g.line(15,2,12,8,'B');g.line(8,2,15,2,'B');g.ell(11.5,15,8,8,'y');g.ell(11.5,15,7,7,'Y');g.ell(11.5,15,5.6,5.6,'E');g.shade([[4,16],[19,16],[19,22],[4,22]],['E'],'e');
 icoElemMark(g,el,11.5,14.5);g.line(5,10,9,6,'H',['Y']);g.put(11,7,'Y');};}
const ICON_DRAW={
 kunai_ferro:g=>{icoBlade(g,11,11,20,3,6,'M','m','H');g.poly([[10,10],[13,13],[9,17],[6,14]],'B');g.line(9,11,12,14,'D',['B']);g.line(7,13,10,16,'D',['B']);g.ell(4.5,19,2.6,2.6,'m');g.ell(4.5,19,1.2,1.2,'.');g.line(6,17,8,15,'d');},
 lamina_chakra:g=>{icoBlade(g,10,14,21,2,4.4,'v','N','H');g.ell(15,8,5.5,5.5,'.');icoBlade(g,10,14,21,2,4.4,'v','N','H');g.put(17,4,'L');g.put(9,11,'H');g.put(19,9,'H');g.poly([[7,13],[12,13],[13,16],[8,17]],'Y');g.line(7,13,12,13,'H',['Y']);g.poly([[7,16],[10,16],[4,22],[2,20]],'B');g.line(6,18,4,20,'D',['B']);},
 katana_anbu:g=>{icoBlade(g,9,14,21,2,2.6,'M','m','H');g.ell(8,15,2.7,2.7,'y');g.ell(8,15,1.2,1.2,'o');g.poly([[7,16],[9,18],[4,22],[2,20]],'Z');g.line(6,18,4,20,'z',['Z']);g.line(5,17,7,19,'z',['Z']);g.put(2,20,'RR');},
 kunai_tri:g=>{icoBlade(g,11,11,20,3,5,'M','m','H');g.poly([[11,9],[14,6],[14,9]],'M');g.poly([[14,12],[17,15],[14,15]],'M');g.poly([[10,10],[13,13],[9,17],[6,14]],'Y');g.line(9,11,12,14,'y',['Y']);g.line(7,13,10,16,'y',['Y']);g.ell(4.5,19,2.6,2.6,'m');g.ell(4.5,19,1.2,1.2,'.');g.put(19,5,'E');},
 kusanagi:g=>{icoBlade(g,8,15,21,2,3,'M','m','H');g.poly([[5,14],[11,14],[12,17],[6,18]],'y');g.line(5,14,11,14,'Y',['y']);g.poly([[7,17],[10,17],[4,22],[1,20]],'U');g.line(6,19,3,21,'u',['U']);g.put(15,7,'E');g.put(18,4,'E');g.put(12,10,'E');g.line(13,6,14,8,'L');g.line(17,9,19,7,'L');},
 kubikiri:g=>{g.poly([[10,16],[5,9],[12,3],[21,2],[23,9],[17,17]],'M');g.shade([[8,13],[23,6],[23,17],[10,17]],['M'],'m');g.line(5,9,12,3,'H',['M']);g.line(12,3,21,2,'H',['M']);g.line(23,9,17,17,'d',['M','m']);g.line(10,16,17,17,'d',['m']);for(const [x,y] of [[8,6],[12,4],[16,3]])g.ell(x,y,1.4,1.4,'.');g.ell(15,10,1.8,1.8,'d');g.ell(15,10,.9,.9,'.');g.poly([[10,16],[13,19],[5,23],[2,21]],'B');g.line(9,19,6,22,'D',['B']);g.put(10,17,'WW');g.put(8,19,'WW');g.put(6,21,'WW');},
 colete:g=>{g.poly([[6,3],[10,3],[12,7],[14,3],[18,3],[22,8],[19,12],[18,21],[6,21],[5,12],[2,8]],'C');g.shade([[12,3],[22,3],[22,21],[12,21]],['C'],'c');g.line(12,7,12,21,'G',['C','c']);g.line(11,7,11,21,'g');g.poly([[7,13],[10,13],[10,17],[7,17]],'c');g.poly([[14,13],[17,13],[17,17],[14,17]],'c');g.line(7,13,10,13,'G',['c']);g.line(14,13,17,13,'G',['c']);g.put(6,3,'GGGG');g.put(14,3,'GGGG');g.line(2,8,6,3,'G',['C']);},
 roupa_peso:g=>{g.poly([[7,3],[10,4],[12,6],[14,4],[17,3],[22,8],[19,12],[18,21],[6,21],[5,12],[2,8]],'v');g.shade([[12,3],[22,3],[22,21],[12,21]],['v'],'N');g.line(12,6,12,21,'n',['v','N']);g.line(3,8,7,3,'H',['v']);g.poly([[0,13],[4,13],[4,19],[0,19]],'d');g.poly([[20,13],[24,13],[24,19],[20,19]],'d');g.line(0,13,4,13,'M');g.line(20,13,24,13,'M');g.put(1,15,'mm');g.put(21,15,'mm');},
 armadura_anbu:g=>{g.poly([[6,3],[18,3],[22,7],[20,13],[18,21],[6,21],[4,13],[2,7]],'W');g.shade([[12,3],[22,3],[22,21],[12,21]],['W'],'w');g.poly([[1,6],[7,3],[7,9],[2,11]],'m');g.poly([[23,6],[17,3],[17,9],[22,11]],'d');g.line(1,6,7,3,'H',['m']);g.line(6,13,18,13,'r');g.line(6,14,18,14,'R');g.poly([[9,5],[15,5],[15,10],[12,12],[9,10]],'R');g.line(10,6,14,6,'F',['R']);g.line(10,8,14,10,'W');g.put(10,18,'ZZZZ');},
 manto_nuvem:g=>{g.poly([[5,2],[19,2],[23,8],[21,22],[3,22],[1,8]],'Z');g.poly([[5,2],[10,2],[12,9],[8,10]],'z');g.poly([[19,2],[14,2],[12,9],[16,10]],'z');g.line(12,9,12,22,'q');g.line(3,9,3,22,'q');g.line(21,9,21,22,'q');
  for(const [x,y] of [[6,14],[17,16],[7,19]]){g.ell(x,y,2.8,2,'W');g.ell(x,y,2.2,1.4,'R');g.ell(x+2,y-1,1.6,1.4,'W');g.ell(x+2,y-1,1,.8,'R');}g.line(5,2,10,2,'H');},
 traje_sabio:g=>{g.poly([[5,3],[19,3],[23,9],[21,22],[3,22],[1,9]],'R');g.shade([[12,3],[23,3],[23,22],[12,22]],['R'],'r');g.poly([[8,3],[16,3],[14,13],[10,13]],'W');g.line(8,3,16,3,'H');g.line(8,3,10,13,'Y');g.line(16,3,14,13,'Y');g.line(1,9,3,22,'Y');g.line(23,9,21,22,'Y');g.ell(12,17,3.4,3.4,'Y');g.ell(12,17,2.2,2.2,'y');g.ell(12,17,1,1,'Y');g.line(3,22,21,22,'Y');},
 bandana:g=>{g.poly([[2,8],[19,7],[20,15],[3,16]],'N');g.shade([[2,12],[20,12],[20,15],[3,16]],['N'],'n');g.line(2,8,19,7,'v');g.poly([[6,6],[16,6],[16,17],[6,17]],'M');g.shade([[6,13],[16,13],[16,17],[6,17]],['M'],'m');g.line(6,6,16,6,'H');g.line(6,6,6,17,'H',['M']);g.ell(11,11.5,3,3,'d');g.ell(11,11.5,2,2,'M');g.ell(11,11.5,1,1,'d');g.line(11,8.5,14,11.5,'d',['M']);g.poly([[19,9],[23,7],[23,11],[20,12]],'N');g.poly([[19,13],[23,16],[22,20],[19,16]],'N');g.line(19,9,23,7,'v',['N']);},
 talisma_fogo:icoTalisman('fogo'),talisma_agua:icoTalisman('agua'),talisma_terra:icoTalisman('terra'),talisma_vento:icoTalisman('vento'),talisma_raio:icoTalisman('raio'),
 amuleto_sorte:g=>{g.line(8,2,9,5,'Y');g.line(15,2,14,5,'Y');g.line(8,2,15,2,'Y');g.poly([[5,5],[19,5],[20,21],[4,21]],'R');g.shade([[12,5],[20,5],[20,21],[12,21]],['R'],'r');g.line(5,5,19,5,'F');g.line(4,10,20,10,'Y');g.line(4,11,20,11,'y');g.poly([[8,13],[16,13],[16,19],[8,19]],'Y');g.shade([[8,16],[16,16],[16,19],[8,19]],['Y'],'y');g.put(9,14,'rrrrrr');g.put(11,15,'r');g.put(11,16,'rr');g.put(10,17,'r');g.put(13,17,'r');g.line(4,21,20,21,'r');},
 selo_protecao:g=>{g.poly([[5,2],[19,2],[19,22],[5,22]],'P');g.shade([[12,2],[19,2],[19,22],[12,22]],['P'],'p');g.line(5,2,19,2,'W');g.line(7,5,17,5,'q');g.line(7,19,17,19,'q');g.ell(12,12,5.2,5.2,'R');g.ell(12,12,4.2,4.2,'F');g.ell(12,12,3,3,'R');g.line(12,9,12,15,'W');g.line(9,12,15,12,'W');g.put(11,8,'W');g.put(11,16,'W');g.put(8,11,'W');g.put(16,11,'W');g.put(3,10,'.');},
 colar_hashirama:g=>{g.poly([[3,3],[5,3],[11,13],[13,13],[19,3],[21,3],[14,17],[10,17]],'B');g.line(3,3,10,17,'b',['B']);g.poly([[12,12],[17,17],[12,23],[7,17]],'G');g.shade([[12,12],[17,17],[12,23],[12,17]],['G'],'g');g.poly([[12,13],[9,17],[11,18]],'L');g.ell(12,12,1.6,1.6,'y');g.put(10,18,'H');},
 pilula_vida:g=>{g.ell(8,15,5.5,5.5,'R');g.shade([[2,16],[14,16],[14,21],[2,21]],['R'],'r');g.ell(6,12.5,2,1.6,'F');g.put(5,12,'HH');g.ell(17,8,4.4,4.4,'R');g.shade([[12,9],[22,9],[22,13],[12,13]],['R'],'r');g.put(15,6,'HH');g.put(15,7,'F');g.put(10,9,'.');g.line(5,19,11,19,'r');},
 pilula_ck:g=>{g.ell(8,15,5.5,5.5,'v');g.shade([[2,16],[14,16],[14,21],[2,21]],['v'],'N');g.ell(6,12.5,2,1.6,'M');g.put(5,12,'HH');g.ell(17,8,4.4,4.4,'v');g.shade([[12,9],[22,9],[22,13],[12,13]],['v'],'N');g.put(15,6,'HH');g.put(15,7,'M');g.line(5,19,11,19,'n');},
 pergaminho_med:g=>{g.poly([[3,6],[21,6],[21,19],[3,19]],'P');g.shade([[3,15],[21,15],[21,19],[3,19]],['P'],'p');g.line(3,6,21,6,'W');g.poly([[1,4],[4,4],[4,21],[1,21]],'B');g.poly([[20,4],[23,4],[23,21],[20,21]],'B');g.line(2,4,2,21,'b',['B']);g.line(21,4,21,21,'b',['B']);g.ell(12,12.5,4.4,4.4,'g');g.ell(12,12.5,3.6,3.6,'G');g.poly([[11,9],[13,9],[13,11],[15,11],[15,13],[13,13],[13,15],[11,15],[11,13],[9,13],[9,11],[11,11]],'W');},
 elixir_sabio:g=>{g.poly([[9,2],[15,2],[15,5],[9,5]],'b');g.line(9,2,15,2,'Y');g.poly([[9,5],[15,5],[15,8],[19,14],[19,21],[5,21],[5,14],[9,8]],'M');g.poly([[10,9],[14,9],[17.5,14.5],[17.5,20],[6.5,20],[6.5,14.5]],'Y');g.shade([[6,16],[18,16],[18,20],[6,20]],['Y'],'y');g.line(9,12,9,18,'H');g.put(11,12,'L');g.put(13,14,'L');g.put(11,16,'L');g.line(10,9,14,9,'L',['Y']);g.line(9,5,9,8,'H',['M']);}
};
const ICON_CACHE={};
function itemIcon(id){if(ICON_CACHE[id])return ICON_CACHE[id];
 const it=ITEMS[id],g=PixGrid(24,24),fn=ICON_DRAW[id],pal=Object.assign({},ICON_PAL);
 if(fn){const m=/^talisma_(\w+)$/.exec(id);if(m)Object.assign(pal,ICON_ELEM[m[1]]);else if(id==='kusanagi'||id==='kunai_tri')Object.assign(pal,ICON_ELEM[id==='kusanagi'?'raio':'vento']);fn(g);}
 else{g.ell(12,12,8,8,'m');g.put(11,8,'HH');g.put(12,10,'H');g.put(11,15,'HH');}
 g.outline('K');
 const c=document.createElement('canvas');g.draw(c,pal,2);return ICON_CACHE[id]=c;}
const ICON_URL={};
function itemIconURL(id){return ICON_URL[id]||(ICON_URL[id]=itemIcon(id).toDataURL());}
function icoImg(id,cls){return`<img class="ico${cls?' '+cls:''}" src="${itemIconURL(id)}" alt="">`;}
