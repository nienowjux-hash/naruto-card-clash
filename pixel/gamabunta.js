/* Gama Bunta em pixel art (150x110), de lado, olhando para a ESQUERDA (para o Sasuke), no mesmo acabamento dos sprites
   do Naruto: formas em poligono, sombra por regiao, verrugas espacadas, contorno escuro e contorno seletivo.
   Sapo chefe agachado: cabeca larga e baixa, boca enorme com labios carmim, olho amarelo com marca vermelha e cicatriz,
   cachimbo no canto da boca, haori azul-escuro de manga curta com gola branca e emblema, faixa branca, braco carmim com garras
   apoiado no chao, perna dobrada atras e a tanto saindo das costas. */
const BUNTA_PAL={K:'#1a0c10',
 S:'#b8786a',R:'#92534a',r:'#74403a',d:'#52292a',
 C:'#c8303e',c:'#962034',e:'#601222',
 Y:'#f4c82a',y:'#b07c16',E:'#1a0c10',Z:'#eadcb2',
 B:'#3e4878',b:'#2a3056',n:'#181c36',v:'#56639a',W:'#f6f4ee',w:'#c6c6d2',
 L:'#d8a890',l:'#b88470',
 G:'#c8c070',g:'#8a8440',H:'#4a4220',T:'#c4c4cc',t:'#6e6e7c'};
const BUNTA_DARK={S:'R',R:'r',r:'d',d:'d',C:'c',c:'e',e:'e',Y:'y',y:'y',Z:'y',B:'b',b:'n',n:'n',v:'b',W:'w',w:'w',L:'l',l:'r',G:'g',g:'H',H:'H',T:'t',t:'t'};
function gamaBunta(){const g=PixGrid(150,110),hs=(a,b)=>((a*73856093)^(b*19349663))>>>0;
 const warts=(x0,y0,x1,y1,step,mod,keys)=>{for(let y=y0;y<y1;y+=step)for(let x=x0;x<x1;x+=step){if(hs(x,y)%mod)continue;const k=g.G[y]&&g.G[y][x];if(keys.includes(k)){g.set(x,y,'S');g.set(x+1,y,'S');g.set(x+1,y+1,'d');g.set(x,y+1,'r');}}};
 /* ---- tanto nas costas (atras de tudo) ---- */
 g.poly([[120,40],[124,38],[142,10],[139,8]],'T');g.line(123,39,140,10,'t');g.poly([[136,8],[146,2],[149,6],[140,14]],'n');g.line(137,12,143,8,'Y');
 /* ---- perna de tras dobrada, com o pe no chao ---- */
 g.poly([[98,70],[126,62],[146,74],[149,96],[138,108],[104,108],[94,96],[92,80]],'R');
 g.shade([[88,90],[150,90],[150,110],[88,110]],['R'],'r');
 g.poly([[104,98],[144,98],[149,108],[100,108]],'r');g.shade([[98,104],[150,104],[150,110],[98,110]],['r'],'d');for(const x of [110,122,134,144])g.line(x,99,x-3,108,'d');
 warts(94,64,148,100,3,13,['R','r']);
 /* ---- corpo: costas arredondadas, barriga caindo ate o chao ---- */
 g.poly([[52,58],[66,44],[92,40],[122,44],[142,58],[146,78],[138,96],[116,106],[80,108],[56,102],[44,88],[42,70]],'R');
 g.shade([[36,92],[150,92],[150,110],[36,110]],['R'],'r');
 /* barriga clara com dobras */
 g.poly([[48,76],[62,68],[90,72],[110,86],[106,102],[84,106],[60,102],[48,92]],'L');g.shade([[44,94],[112,94],[112,108],[44,108]],['L'],'l');
 for(let y=80;y<104;y+=4)g.line(50,y,106,y,'l',['L']);
 /* ---- faixa branca na cintura ---- */
 g.poly([[46,86],[112,82],[114,94],[48,98]],'W');g.shade([[44,92],[116,92],[116,99],[44,99]],['W'],'w');for(const x of [62,78,94])g.line(x,87,x+2,97,'w');
 /* ---- haori azul nas costas, manga curta caindo por tras ---- */
 const hao=[[60,52],[74,38],[104,32],[130,40],[146,58],[148,84],[134,94],[118,86],[106,70],[86,60],[68,62]];
 g.poly(hao,'B');g.shade([[100,76],[150,76],[150,98],[100,98]],['B'],'b');g.shade([[72,38],[118,36],[110,46],[72,50]],['B'],'v');
 for(const [a,b2,c2,d2] of [[116,46,122,86],[132,50,138,88],[92,46,100,64]])g.line(a,b2,c2,d2,'b',['B','v']);g.edge(hao,'n');
 /* gola branca descendo pela frente */
 g.poly([[60,52],[68,52],[88,60],[106,70],[104,76],[84,66],[64,60],[58,58]],'W');g.shade([[62,62],[110,62],[110,78],[62,78]],['W'],'w');
 /* emblema branco */
 g.ell(126,64,6,6,'W');g.ell(126,64,4,4,'B');g.put(125,63,'W');g.put(126,65,'W');
 /* ---- braco carmim: ombro sob a manga, cotovelo, antebraco e mao aberta no chao ---- */
 g.poly([[64,64],[78,66],[72,82],[58,90],[50,84],[56,72]],'C');            /* braco */
 g.poly([[50,84],[58,90],[56,100],[44,106],[34,104],[38,92]],'C');         /* antebraco */
 g.poly([[34,96],[56,98],[60,106],[52,109],[14,109],[12,104],[22,100]],'C'); /* mao */
 g.shade([[70,64],[82,64],[82,92],[70,92]],['C'],'c');g.shade([[10,103],[64,103],[64,110],[10,110]],['C'],'c');
 g.line(76,68,70,80,'e',['C','c']);g.line(56,92,50,100,'e',['C','c']);
 /* dedos com garras claras */
 for(const x of [20,30,40,50]){g.line(x,100,x,108,'e');g.line(x-3,109,x-1,106,'e');g.set(x-4,109,'Z');g.set(x-3,109,'Z');}
 for(let y=66;y<104;y+=3)for(let x=14;x<80;x+=3){if(hs(x,y)%9)continue;const k=g.G[y][x];if(k==='C')g.set(x,y,'e');}
 /* ---- cabeca larga e baixa, focinho arredondado ---- */
 const head=[[4,44],[8,34],[18,24],[34,16],[52,12],[74,12],[92,18],[104,30],[106,44],[100,54],[86,60],[64,62],[36,62],[16,58],[6,52]];
 g.poly(head,'R');
 g.poly([[8,50],[20,58],[50,61],[80,59],[98,52],[102,46],[90,54],[60,56],[28,54],[12,48]],'r'); /* queixo em sombra */
 g.poly([[22,20],[40,14],[70,13],[88,18],[80,22],[58,20],[34,22]],'S'); /* brilho no topo */
 warts(8,14,104,64,3,10,['R','S']);
 /* ---- olho saltado no topo, marca carmim em volta ---- */
 g.poly([[42,22],[50,10],[66,6],[80,10],[86,20],[78,32],[54,34]],'R');g.poly([[44,26],[54,34],[78,32],[84,24],[76,29],[56,30]],'r');g.set(48,12,'S');g.set(56,9,'S');
 g.poly([[46,22],[52,14],[64,11],[76,14],[82,21],[74,28],[54,30]],'C');
 g.poly([[50,22],[54,16],[64,14],[74,17],[78,22],[72,26],[56,27]],'Y');g.shade([[48,23],[80,23],[80,29],[48,29]],['Y'],'y');
 g.line(53,21,75,21,'E');g.line(55,20,73,20,'E');g.line(56,22,72,22,'E');g.put(58,16,'Z');g.set(59,17,'Z');
 /* sobrancelha carregada */
 g.line(46,16,60,11,'e');g.line(60,11,80,13,'e');
 /* cicatriz clara cortando o olho */
 g.line(72,4,66,34,'Z');g.line(73,4,67,34,'Z');g.line(74,5,68,34,'d',['R','r','S','C']);
 /* ---- boca enorme: labios carmim grossos, do focinho ate a bochecha ---- */
 const lip=x=>Math.round(44+((x-8)/96)**1.5*10);
 for(let x=6;x<=96;x++){const y=lip(x);g.set(x,y-3,'C');g.set(x,y-2,'C');g.set(x,y-1,'c');g.set(x,y,'K');g.set(x,y+1,'c');g.set(x,y+2,'C');g.set(x,y+3,'c');}
 g.line(94,54,100,50,'c');g.put(14,34,'dd');g.put(13,35,'d');
 /* ---- cachimbo no canto do focinho ---- */
 g.line(10,48,2,60,'G');g.line(11,49,3,61,'g');g.poly([[0,56],[8,56],[9,68],[0,68]],'G');g.shade([[0,63],[10,63],[10,69],[0,69]],['G'],'g');g.line(0,56,8,56,'H');g.put(2,57,'HHHH');
 g.outline('K');g.selout('K',BUNTA_DARK);
 return g;}
