/* Naruto em pixel art, desenhado de verdade (nao e mais o Sasuke pintado de laranja).
   Grade 56x80 olhando para a direita, mesma paleta de contorno do Sasuke.
   Cada membro e uma "peca" (manga ou perna da calca) com 4 tons: base, sombra, luz e dobras. */
const NAR_PAL=Object.assign({},SAS2_PAL,{
 Y:'#ffd93a',y:'#e9a91d',x:'#b57a14',z:'#7a4a0a',X:'#fff6b0',
 O:'#f58a18',Q:'#ffb347',q:'#cf620e',m:'#8a380a',k:'#ffd27a',
 B:'#2f48aa',b:'#1a2a70',j:'#6a86e0',M:'#eef1f8',L:'#7c86a8',
 C:'#2c4aae',c:'#1f358a',d:'#14225e',D:'#5a7ee0',
 N:'#2e4ab0',n:'#1b2b72',v:'#5a78d8',
 W:'#ffffff',E:'#16102a',e:'#2c6ee8'});
const NAR_DARK=Object.assign({},SAS_DARK,{Y:'x',y:'z',X:'y',O:'q',Q:'O',q:'m',m:'m',x:'z',z:'z',C:'d',c:'d',D:'d'});
const NM={base:'O',shade:'q',hi:'Q',dark:'m',fold:'m'};

/* peca cilindrica de a ate b, largura w0->w1: base + sombra do lado de baixo/esquerda + luz no lado oposto + dobras */
function pxLimb(g,a,b,w0,w1,m,cuff){
 const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,P=(p,n,w)=>[p[0]+nx*n*w,p[1]+ny*n*w];
 g.poly([P(a,1,w0/2),P(b,1,w1/2),P(b,-1,w1/2),P(a,-1,w0/2)],m.base);
 const s=(-nx+ny)>=0?1:-1;
 g.poly([P(a,s,w0*.12),P(b,s,w1*.12),P(b,s,w1/2),P(a,s,w0/2)],m.shade);
 const h0=P(a,-s,w0*.28),h1=P(b,-s,w1*.28);g.line(h0[0],h0[1],h1[0],h1[1],m.hi,[m.base]);
 /* dobras: pequenos riscos de sombra na parte de dentro da curva */
 for(let i=1;i<3;i++){const u=i/3,c0=[a[0]+dx*u,a[1]+dy*u],f0=P(c0,s,w0*.1+(w1-w0)*u*.1),f1=P(c0,s,(w0+(w1-w0)*u)*.46);g.line(f0[0],f0[1],f1[0],f1[1],m.fold,[m.base,m.shade]);}
 if(cuff){const c0=[b[0]-dx/L*1.2,b[1]-dy/L*1.2];g.line(...P(c0,1,w1/2),...P(c0,-1,w1/2),cuff);}
}
/* mao fechada ou aberta: palma e dedos com sombra, apontando na direcao do antebraco */
function pxHand(g,p,dir,open){
 const fx=Math.cos(dir),fy=Math.sin(dir),nx=-fy,ny=fx,Q=(f,n)=>[p[0]+fx*f+nx*n,p[1]+fy*f+ny*n];
 g.poly([Q(-1.5,-2.2),Q(2.5,-2.4),Q(3.6,-.6),Q(3.6,1.8),Q(2.3,2.8),Q(-1.5,2.4)],'S');
 g.poly([Q(-1.5,.9),Q(3.2,1),Q(3.5,2.4),Q(-1.5,2.4)],'s');
 for(let i=0;i<4;i++){const q=Q(2.6,-1.8+i*1.15);g.line(q[0],q[1],Q(open?5.4:3.9,-1.8+i*1.15)[0],Q(open?5.4:3.9,-1.8+i*1.15)[1],'t',['S','s']);}
 const th=Q(1.2,-2.7);g.put(Math.round(th[0]),Math.round(th[1]),'S');g.put(Math.round(Q(2.8,-2.8)[0]),Math.round(Q(2.8,-2.8)[1]),'W');
}
/* cabeca do Naruto, pixel a pixel por regioes: (ox,oy) como a cabeca do Sasuke */
function naruHead(g,ox,oy,mod){
 const T=pts=>pts.map(p=>[p[0]+ox,p[1]+oy]),L=(a,b,c,d,k,o)=>g.line(a+ox,b+oy,c+ox,d+oy,k,o),P=(x,y,s)=>g.put(x+ox,y+oy,s);
 /* cabelo de tras: espetos para a esquerda */
 g.poly(T([[17,11],[9,7],[3,4],[7,10],[1,12],[8,14],[2,19],[10,18],[7,24],[15,20],[20,18]]),'Y');
 g.shade(T([[1,12],[20,14],[20,26],[6,26]]),['Y'],'y');g.shade(T([[1,17],[12,17],[12,26],[5,26]]),['y'],'x');
 L(15,12,5,8,'x',['Y','y']);L(15,15,4,13,'x',['Y','y']);L(15,18,8,20,'x',['Y','y']);L(8,9,4,5,'X',['Y']);L(6,12,2,12,'X',['Y']);
 g.put(ox+3,oy+4,'X');g.put(ox+2,oy+12,'X');
 /* cabelo do alto: tres espetos grandes */
 g.poly(T([[16,12],[15,3],[20,9],[22,0],[27,7],[32,1],[34,8],[38,5],[37,13]]),'Y');
 g.shade(T([[15,3],[22,3],[20,13],[15,13]]),['Y'],'y');g.shade(T([[22,0],[26,0],[25,9],[22,9]]),['Y'],'X');g.shade(T([[32,1],[35,1],[35,8],[33,8]]),['Y'],'X');g.shade(T([[36,6],[38,6],[37,12],[36,12]]),['Y'],'y');
 L(18,10,17,5,'y',['Y']);L(25,8,24,2,'y',['Y']);L(31,8,32,3,'y',['Y']);L(23,5,23,1,'k',['Y','X']);
 /* rosto */
 g.poly(T([[19,13],[36,12],[38,17],[37,22],[33,26],[25,26],[20,22]]),'S');
 g.shade(T([[18,11],[24,11],[22,27],[18,27]]),['S'],'s');g.shade(T([[20,23],[35,23],[33,27],[24,27]]),['S'],'s');
 g.shade(T([[19,17],[22,17],[22,23],[19,23]]),['s'],'t');
 P(19,17,'sss');P(20,18,'ts'); /* orelha */
 /* testa */
 g.shade(T([[30,13],[37,13],[37,15],[30,15]]),['S'],'k');
 /* bandana: faixa azul com placa metalica e o no atras */
 g.poly(T([[12,10],[38,9],[39,13],[12,14.4]]),'B');g.shade(T([[12,12.6],[39,11.4],[39,13.6],[12,15]]),['B'],'b');g.line(14+ox,11+oy,36+ox,10+oy,'j',['B']);
 g.poly(T([[23,9.4],[34,8.6],[34.6,13.2],[23.6,14]]),'M');g.edge(T([[23,9.4],[34,8.6],[34.6,13.2],[23.6,14]]),'L');g.shade(T([[24,12],[34,11.4],[34,13.2],[24,13.6]]),['M'],'L');
 P(27,10,'L');P(28,11,'L');P(29,10,'L');P(28,12,'L');
 P(11,13,'bB');P(8,14,'bBBb');P(7,15,'bBb');P(6,17,'bB');P(7,18,'b');P(10,15,'b');
 /* franja por cima da bandana */
 g.poly(T([[17,11],[20,3],[25,11]]),'Y');g.poly(T([[24,10],[28,1],[32,10]]),'Y');g.poly(T([[31,10],[36,4],[38,11]]),'Y');
 L(19,4,18,10,'y',['Y']);L(27,3,26,9,'y',['Y']);L(35,6,33,10,'y',['Y']);P(20,4,'X');P(28,2,'X');P(36,5,'X');
 /* olho, sobrancelha, bigodes, nariz e boca */
 const shut=mod&&mod.shut;
 if(shut){L(27,17,33,18,'K');L(27,15,33,15,'x',['S','s']);}
 else{L(27,14,34,14,'x',['S','s']);L(28,15,34,15,'K');P(28,16,'W');P(29,16,'WeeW');P(29,17,'WeEe');P(30,18,'s');P(34,16,'W');}
 L(23,19,29,18,'t');L(22,21,29,21,'t');L(23,23,29,24,'t',['S','s']);
 P(35,19,'s');P(36,20,'o');
 if(mod&&mod.mouth){L(30,24,35,24,'K');P(31,25,'oo');}else{L(31,24,35,23,'o');P(32,24,'s');}
}
/* cabeca deitada */
function naruHeadLying(g,ox,oy,groundY,mod){
 const tmp=PixGrid(40,28);naruHead(tmp,0,0,mod);const rows=tmp.G,Wd=40;
 for(let y=0;y<rows.length;y++)for(let x=0;x<Wd;x++){const ch=rows[y][x];if(ch==='.')continue;const nx=ox+y,ny=oy+(Wd-1-x);if(ny<=groundY)g.set(nx,ny,ch);}}
/* tronco com gola azul alta; J = juntas {S: centro dos ombros, H: centro do quadril} */
function naruTorso(g,S,H,ws,wh,lean){
 const dx=H[0]-S[0],dy=H[1]-S[1];
 g.poly([[S[0]-ws/2,S[1]],[S[0]+ws/2,S[1]-.5],[H[0]+wh/2+1,H[1]],[H[0]-wh/2-1,H[1]]],'O');
 g.poly([[S[0]-ws/2,S[1]],[S[0]-ws/2+4,S[1]],[H[0]-wh/2+2,H[1]],[H[0]-wh/2-1,H[1]]],'q');
 g.poly([[S[0]-ws/2,S[1]],[S[0]-ws/2+2,S[1]],[H[0]-wh/2+.5,H[1]],[H[0]-wh/2-1,H[1]]],'m');
 g.poly([[S[0]+ws/2-3,S[1]],[S[0]+ws/2,S[1]-.5],[H[0]+wh/2+1,H[1]],[H[0]+wh/2-1.5,H[1]]],'Q');
 /* zíper e dobras */
 g.line(S[0]+1,S[1]+4,H[0]+1,H[1]-1,'m',['O','q','Q']);g.line(S[0]+2,S[1]+5,H[0]+2,H[1]-1,'k',['O']);
 g.line(S[0]-4,S[1]+9,S[0]-1,S[1]+12,'q',['O']);g.line(S[0]+5,S[1]+10,S[0]+7,S[1]+13,'q',['O','Q']);
 g.line(H[0]-wh/2,H[1]-1,H[0]+wh/2,H[1]-1,'m');g.line(H[0]-wh/2+1,H[1]-3,H[0]-wh/2+4,H[1]-2,'q',['O']);
 /* pescoco e gola azul alta */
 const nx=S[0]+1,ny=S[1];
 g.poly([[nx-2,ny-5],[nx+3,ny-5],[nx+3,ny],[nx-2,ny]],'S');g.shade([[nx-3,ny-5],[nx,ny-5],[nx,ny+1],[nx-3,ny+1]],['S'],'s');g.line(nx-1,ny-3,nx+2,ny-3,'t');
 g.poly([[nx-6,ny-2],[nx-3,ny-3.5],[nx+4,ny-3.5],[nx+7.5,ny-2],[nx+8.5,ny+3],[nx-7,ny+3]],'C');
 g.shade([[nx-8,ny-4],[nx-2,ny-4],[nx-2,ny+4],[nx-8,ny+4]],['C'],'c');g.shade([[nx-8,ny-4],[nx-5,ny-4],[nx-5,ny+4],[nx-8,ny+4]],['c'],'d');
 g.line(nx-2,ny-2,nx+5,ny-2,'D');g.line(nx+7,ny-1,nx+8,ny+2,'D');g.line(nx-6,ny+2,nx+7,ny+3,'d',['C','c']);
}
/* uma perna: coxa -> joelho -> pe, calca laranja, com ataduras brancas na canela da frente */
function naruLeg(g,hip,knee,foot,front,wrap){
 pxLimb(g,hip,knee,7.6,6.8,NM);pxLimb(g,knee,foot,6.6,5.6,NM);
 g.put(Math.round(knee[0]+(front?2:-1)),Math.round(knee[1]-1),'k');
 if(wrap){const a=[knee[0]+(foot[0]-knee[0])*.55,knee[1]+(foot[1]-knee[1])*.55];pxLimb(g,a,[foot[0],foot[1]-.5],6,5.2,{base:'A',shade:'a',hi:'W',dark:'r',fold:'r'});for(let i=0;i<3;i++){const u=.1+i*.3,c=[a[0]+(foot[0]-a[0])*u,a[1]+(foot[1]-a[1])*u];g.line(c[0]-3,c[1],c[0]+3,c[1]+.6,'r',['A','a']);}}
}
/* um braco com manga laranja e a mao */
function naruArm(g,sh,el,ha,hdir,open){
 pxLimb(g,sh,el,6.4,5.6,NM);pxLimb(g,el,ha,5.6,4.6,NM,'m');
 g.ell(sh[0],sh[1]+.5,3.1,3.3,'O');g.put(Math.round(sh[0]-1),Math.round(sh[1]-1),'Q');g.put(Math.round(sh[0]-2),Math.round(sh[1]+1),'q');
 pxHand(g,[ha[0]+Math.cos(hdir)*2,ha[1]+Math.sin(hdir)*2],hdir,open);
}
function naruFinish(g){g.outline('K');g.selout('K',NAR_DARK);return g;}
/* pelve da calca ligando o tronco as duas pernas */
function naruPelvis(g,hB,hF,yTop){
 const mx=(hB[0]+hF[0])/2;
 g.poly([[hB[0]-5,yTop],[hF[0]+4,yTop],[hF[0]+7,hF[1]+1],[hF[0]+2,hF[1]+5],[mx,hF[1]+1],[hB[0]+1,hB[1]+5],[hB[0]-5,hB[1]+1]],'O');
 g.poly([[hB[0]-5,yTop],[hB[0]+3,yTop],[hB[0]+2,hB[1]+6],[hB[0]-5,hB[1]+1]],'q');g.shade([[hB[0]-5,hB[1]-1],[hB[0]+2,hB[1]-1],[hB[0]+2,hB[1]+6],[hB[0]-5,hB[1]+6]],['q'],'m');
 g.poly([[hF[0]-2,yTop+2],[hF[0]+4,yTop+1],[hF[0]+7,hF[1]+1],[hF[0]+3,hF[1]+4]],'Q');
 g.line(mx-1,yTop+2,mx,hF[1]+1,'m');g.line(hB[0]+1,hB[1]-3,hB[0]+4,hB[1]+1,'m',['O','q']);g.line(hF[0]-1,hF[1]-3,hF[0]+2,hF[1]+1,'q',['O','Q']);g.put(Math.round(hF[0]+5),Math.round(yTop+3),'k');}
/* monta um Naruto a partir das juntas */
function naruBuild(c){const g=PixGrid(56,80);
 naruLeg(g,c.bl[0],c.bl[1],c.bl[2],false,false);if(c.bs!=null)sandal(g,c.bs,false);
 naruLeg(g,c.fl[0],c.fl[1],c.fl[2],true,true);if(c.fs!=null)sandal(g,c.fs,true);
 if(c.extra)c.extra(g,'legs');
 naruArm(g,c.ba[0],c.ba[1],c.ba[2],c.ba[3],false);
 naruPelvis(g,c.bl[0],c.fl[0],c.H[1]-2);
 naruTorso(g,c.S,c.H,c.ws||18,c.wh||15);
 naruHead(g,c.head[0],c.head[1],c.head[2]);
 if(c.mid)c.mid(g);
 naruArm(g,c.fa[0],c.fa[1],c.fa[2],c.fa[3],!!c.fa[4]);
 if(c.extra)c.extra(g,'top');
 return naruFinish(g);}
const naruGuard=()=>naruBuild({bl:[[19,51],[13,60.5],[11,71]],bs:5,fl:[[34,51],[42.5,58],[43.5,71]],fs:38.5,S:[29,29],H:[28,46],head:[8,6],ba:[[22,31],[15,36],[8,44],2.2],fa:[[37,30],[43,35],[49,43],.7]});
const naruPunch=()=>naruBuild({bl:[[20,51],[13,60],[7,70.5]],bs:0,fl:[[34,50],[43,56],[44.5,71]],fs:38.5,S:[31,29],H:[28,46],head:[10,6,{mouth:true}],ba:[[23,31],[17,38],[17,45],1.6],fa:[[39,29],[47,30],[54,30],0]});
const naruHit=()=>naruBuild({bl:[[19,51],[16,61],[14,71]],bs:8,fl:[[32,51],[37,61],[38,71]],fs:32.5,S:[25,29],H:[26,46],ws:17,head:[1,4,{shut:true,mouth:true}],ba:[[18,31],[12,36],[5,41],2.5],fa:[[31,29],[37,33],[42,38],.9]});
const naruKick=()=>naruBuild({bl:[[22,51],[21,61],[20,71]],bs:14,fl:[[34,47],[44,46.5],[52,46]],S:[26,28],H:[26,45],head:[2,3],ba:[[17,29],[11,31.5],[4,34],3.3],fa:[[31,28],[36,29],[38,23],-1.3],
 extra:(g,w)=>{if(w==='legs'){g.poly([[50.5,41],[53.5,41],[55.5,43],[55.5,51],[50.5,51]],'N');g.line(55,42,55,50,'n');g.line(51,42,51,50,'v');g.put(52,42,'S');}}});
const naruSeal=()=>naruBuild({bl:[[19,51],[13,60.5],[11,71]],bs:5,fl:[[34,51],[42.5,58],[43.5,71]],fs:38.5,S:[29,29],H:[28,46],head:[8,6],ba:[[22,31],[26,36],[31,36],0],fa:[[37,30],[41,35],[36,36],3.0],
 extra:(g,w)=>{if(w==='top'){g.poly([[31.5,25],[34.5,25],[34.5,31.5],[31.5,31.5]],'S');g.line(33,25,33,30,'t');g.put(32,25,'W');}}});
const naruBlock=()=>naruBuild({bl:[[19,51],[13,60.5],[11,71]],bs:5,fl:[[34,51],[42.5,58],[43.5,71]],fs:38.5,S:[29,31],H:[28,47],head:[8,8,{shut:true}],ba:[[22,33],[28,38],[37,27],-.8],fa:[[37,32],[40,37],[31,26],-2.3]});
/* caido: deitado de costas, grade mais larga */
function naruDown(){const g=PixGrid(84,48),GYd=45;
 pxLimb(g,[44,38],[53,28],7,6.4,NM);pxLimb(g,[53,28],[58,42],6.4,5.6,NM);g.poly([[57,40],[66,39.5],[69,41.5],[69,45],[57,45]],'N');g.line(58,44,68,44,'n');g.line(58,41,63,41,'v');
 pxLimb(g,[47,37],[58,25],7.4,6.8,NM);pxLimb(g,[58,25],[64,41],6.6,5.6,NM);
 g.poly([[59.5,34],[64.5,33],[66,41],[61,42]],'A');g.shade([[59,34],[62,34],[62.5,42],[60,42]],['A'],'a');g.poly([[59,41.5],[67.5,40.5],[70,42.5],[70,45],[59,45]],'N');g.line(60,44,69,44,'n');g.line(60,42,65,42,'v');
 g.poly([[39,32],[47,31],[52,35],[52,42],[48,45],[40,45]],'O');g.shade([[38,41],[53,41],[53,46],[38,46]],['O'],'q');g.line(44,36,50,36,'m');
 g.poly([[21,33],[25,31],[40,31],[42,33],[42,44],[22,45],[20,41]],'O');g.shade([[19,40],[43,40],[43,46],[19,46]],['O'],'q');g.shade([[24,30],[40,30],[40,33],[24,33]],['O'],'Q');g.line(26,36,38,36,'m',['O']);g.line(32,38,35,40,'q',['O']);g.line(40,33,40,44,'m');
 g.poly([[17,34],[22,33],[22,44],[17,44]],'C');g.shade([[16,40],[23,40],[23,45],[16,45]],['C'],'c');g.line(18,35,18,41,'D');
 naruHeadLying(g,-2,19,GYd,{shut:true});
 pxLimb(g,[24,34],[31,37],5.6,5,NM);pxLimb(g,[31,37],[40,39],5,4.4,NM,'m');pxHand(g,[42,40],.3,false);
 return naruFinish(g);}