/* Ninken (cães ninja do Kakashi) em pixel art, olhando para a direita, grade 36x24 (chão em y=23).
   kind: bull (buldogue grande com coleira de espinhos), pug (Pakkun), shiba (laranja e branco), gray (cinza de orelha caída), pup (filhote).
   pose: 'bite' (patas firmes, cabeça para a frente) ou 'leap' (patas esticadas no salto). jaw: 0 fechada .. 3 bem aberta. */
const NINKEN_PAL={K:'#1a0f08',E:'#140a06',W:'#f6f2ea',R:'#b02440',r:'#7a1428',N:'#1a1210',
 B:'#2f45a8',b:'#1c2c70',M:'#cfd5e0',m:'#8a93a6',S:'#585b68',s:'#d0d4e0'};
const NINKEN_KIND={
 bull:{T:'#6a4428',t:'#4a2e18',D:'#2e1c0e',L:'#9c7a54'},
 pug:{T:'#b38a4c',t:'#8a6630',D:'#3a281a',L:'#e2cd9c'},
 shiba:{T:'#de8c30',t:'#b0601a',D:'#7a3e10',L:'#f6ecd8'},
 gray:{T:'#9a9aa2',t:'#70707a',D:'#40404a',L:'#dcdce2'},
 pup:{T:'#c09254',t:'#966a34',D:'#5a3c1e',L:'#ecdcb2'}};
function ninkenGrid(kind,pose,jaw){
 const g=PixGrid(36,24),bull=kind==='bull',pug=kind==='pug'||kind==='pup',shiba=kind==='shiba',leap=pose==='leap';
 /* cauda */
 const tail=shiba||pug?[[4,10],[2,8],[3,5],[5,4]]:[[4,11],[2,8],[1,5]];
 for(let i=0;i<tail.length-1;i++){g.line(tail[i][0],tail[i][1],tail[i+1][0],tail[i+1][1],'T');g.line(tail[i][0]+1,tail[i][1],tail[i+1][0]+1,tail[i+1][1],'T');}
 if(shiba)g.put(4,3,'L');
 /* patas de tras e da frente (as do outro lado, mais escuras, ficam atras do corpo) */
 const bl=leap?[[[8,15],[12,15],[7,21],[3,21]],[[5,15],[9,15],[3,19],[0,19]]]:[[[11,16],[14,16],[14,23],[11,23]],[[6,15],[10,15],[9,23],[6,23]]];
 const fl=leap?[[[22,16],[25,16],[32,19],[34,18]],[[19,16],[22,16],[29,21],[31,20]]]:[[[19,16],[22,16],[22,23],[19,23]],[[23,16],[26,16],[26,23],[23,23]]];
 g.poly(bl[0],'t');g.poly(fl[0],'t');
 /* corpo */
 g.ell(13,12,bull?10.2:9.4,bull?6:5.2,'T');g.ell(8,13,bull?5.4:4.8,5.6,'t');g.ell(19,12.5,bull?6.4:5.4,bull?6.4:5.6,'T');g.ell(13,16,7,2.1,'L');
 g.poly(bl[1],'T');g.poly(fl[1],'T');
 if(!leap){g.put(6,22,'LLLL');g.put(11,22,'LLL');g.put(19,22,'LLL');g.put(23,22,'LLL');}else{g.put(2,19,'LL');g.put(33,18,'LL');g.put(30,20,'LL');g.put(5,21,'L');}
 g.shade([[4,14],[24,14],[24,20],[4,20]],['T'],'t');
 /* colete ninja azul com friso */
 g.poly([[16,7],[21,8],[21,16],[16,16]],'B');g.poly([[16,13],[21,13],[21,16],[16,16]],'b');g.line(16,7,21,8,'M');
 if(shiba){g.put(17,10,'MM');}
 /* pescoco e cabeca */
 g.ell(22,9,bull?5:4,bull?6:5,'T');
 g.ell(26.5,8,bull?5.4:4.7,bull?4.8:4.3,'T');
 const sn=bull?32:pug?32:34;
 /* focinho */
 g.poly([[28,6.5],[sn,7.5],[sn+1,10.5],[28,11]],pug||bull?'T':'T');
 if(pug||bull){g.poly([[29,7],[sn+1,8],[sn+1,11],[29,11]],'D');}else{g.poly([[29,9],[sn,10],[sn,11.5],[29,11.5]],'L');}
 g.put(sn,7,'NN');g.put(sn,8,'NN');
 /* mandibula */
 const j=Math.max(0,Math.min(3,jaw|0)),dy=j*1.7,jx=sn-1;
 if(j>0)g.poly([[28,11],[jx,10.8],[jx,10.8+dy],[28,11+dy*.4]],'R');
 g.poly([[28,11+dy*.35],[jx,11+dy*.9],[jx-1,13+dy*1.1],[28,13+dy*.45]],bull?'T':'L');
 if(bull)g.put(jx-2,11+Math.round(dy),'W');
 g.put(jx-3,10,'W');g.put(jx-1,10,'W');
 if(j>0){g.put(jx-3,11+Math.round(dy*.9),'W');g.put(jx-1,11+Math.round(dy),'W');}
 /* orelha */
 if(shiba)g.poly([[23,5],[24,-1],[28,4]],'D');else g.poly([[22,3],[26,2],[27,7],[23,8]],'D');
 /* olho */
 g.put(29,6,'WE');g.put(29,7,'EE');if(bull)g.put(28,5,'KKK');
 /* testeira ninja: faixa azul com placa de metal */
 g.poly([[21,5],[30,4],[30,6],[21,7]],'B');g.line(21,7,30,6,'b');g.poly([[24,4],[27,4],[27,7],[24,7]],'M');g.line(24,7,27,7,'m');
 /* coleira de espinhos (Bull) */
 if(bull){g.poly([[19,5],[23,5],[24,13],[20,14]],'S');for(const [x,y] of [[18,5],[18,8],[18,11],[19,13],[23,3],[22,2]])g.put(x,y,'s');}
 if(pug)g.put(31,5,'tt'.replace(/t/g,'D'));
 g.outline('K');
 return g;}
const NINKEN_CACHE={};
function ninkenSprite(kind,pose,jaw){const k=kind+pose+(jaw|0);if(NINKEN_CACHE[k])return NINKEN_CACHE[k];
 const g=ninkenGrid(kind,pose,jaw),c=document.createElement('canvas');g.draw(c,Object.assign({},NINKEN_PAL,NINKEN_KIND[kind]),1);
 return NINKEN_CACHE[k]={c,w:g.w,h:g.h,ax:14,ay:13};}
