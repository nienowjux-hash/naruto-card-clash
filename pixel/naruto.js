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
/* cabeca do Naruto no mesmo tamanho e jeito da do Sasuke (rosto ~16px de largura, de frente, levemente para a direita) */
function naruHead(g,ox,oy,mod){
 const T=pts=>pts.map(p=>[p[0]+ox,p[1]+oy]),L=(a,b,c,d,k,o)=>g.line(a+ox,b+oy,c+ox,d+oy,k,o),P=(x,y,s)=>g.put(x+ox,y+oy,s);
 /* cabelo: massa fina + espetos apontando para tras (esquerda) e para cima, como o cabelo do Sasuke */
 g.poly(T([[13,12],[17,7],[30,6],[35,10],[35,15],[13,16]]),'Y');
 for(const s of [[[13,11],[5,5],[15,8]],[[12,14],[2,12],[13,17]],[[13,17],[4,21],[14,18]],[[16,8],[17,0],[22,7]],[[21,7],[26,-1],[28,7]],[[27,7],[34,0],[33,9]],[[32,9],[39,5],[36,12]]])g.poly(T(s),'Y');
 g.shade(T([[0,12],[24,12],[24,24],[0,24]]),['Y'],'y');
 g.shade(T([[21,-1],[27,-1],[26,7],[22,7]]),['Y','y'],'X');g.shade(T([[28,0],[34,0],[33,7],[29,7]]),['Y'],'X');g.shade(T([[16,0],[19,0],[19,7],[16,7]]),['Y','y'],'X');
 L(14,12,6,9,'x',['y']);L(14,16,4,16,'x',['y']);L(14,19,6,21,'x',['y']);L(23,7,24,2,'y',['Y','X']);L(30,7,32,2,'y',['Y','X']);L(18,7,18,3,'y',['Y','X']);
 /* orelha */
 g.ell(16+ox,19.5+oy,1.3,2,'S');P(16,19,'t');
 /* rosto estreito */
 g.poly(T([[17,13],[32,13],[33,18],[32,23],[28,27],[22,27],[18,23],[16,18]]),'S');
 g.shade(T([[15,13],[20,13],[19,28],[15,28]]),['S'],'s');g.shade(T([[19,24],[31,24],[28,28],[21,28]]),['S'],'s');
 g.shade(T([[27,15],[32,15],[32,21],[29,21]]),['S'],'k');
 /* bandana fina + placa pequena */
 g.poly(T([[11,11],[36,10],[36,13.6],[11,14.6]]),'B');g.shade(T([[11,13],[36,12],[36,13.8],[11,14.8]]),['B'],'b');L(12,11.4,35,10.4,'j',['B']);
 g.poly(T([[19.5,10.3],[27.5,10],[27.9,13.7],[19.9,14]]),'M');g.edge(T([[19.5,10.3],[27.5,10],[27.9,13.7],[19.9,14]]),'L');P(22,12,'L');P(23,11,'LL');P(24,12,'L');
 P(10,13,'bB');P(8,14,'bBBb');P(7,16,'bB');P(8,18,'b');
 /* mecha da franja */
 g.poly(T([[17,14],[20,14],[18,19]]),'Y');g.poly(T([[28,14],[31,14],[30,18]]),'Y');L(18,14,18,17,'y',['Y']);
 /* olhos (pequenos como o do Sasuke), sobrancelhas, nariz */
 const shut=mod&&mod.shut;
 if(shut){L(19,19,22,20,'K');L(26,20,29,19,'K');L(19,17,22,17,'x',['S','s']);L(26,17,29,17,'x',['S','s']);}
 else{L(19,16,22,16,'x',['S','s']);L(26,16,29,16,'x',['S','s']);
  L(19,17,22,17,'K');L(26,17,29,17,'K');P(19,18,'WeeE');P(26,18,'EeeW');P(20,19,'ee');P(27,19,'ee');}
 P(24,21,'s');P(24,22,'t');
 /* bigodes: 3 riscos curtos em cada bochecha */
 L(17,21,19,21,'t',['S','s']);L(17,23,19,22,'t',['S','s']);L(17,19,18,19,'t',['S','s']);
 L(30,21,32,21,'t',['S','s']);L(30,23,32,22,'t',['S','s']);L(30,19,31,19,'t',['S','s']);
 /* boca */
 if(mod&&mod.mouth){g.ell(25+ox,25+oy,2.3,1.4,'K');P(24,26,'oo');}
 else{L(22,25,27,25,'K');P(21,24,'o');P(28,24,'o');P(23,26,'WW');}
}/* cabeca deitada */
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
 pxLimb(g,hip,knee,6.6,6.0,NM);pxLimb(g,knee,foot,5.8,5.0,NM);
 g.put(Math.round(knee[0]+(front?2:-1)),Math.round(knee[1]-1),'k');
 if(wrap){const a=[knee[0]+(foot[0]-knee[0])*.55,knee[1]+(foot[1]-knee[1])*.55];pxLimb(g,a,[foot[0],foot[1]-.5],6,5.2,{base:'A',shade:'a',hi:'W',dark:'r',fold:'r'});for(let i=0;i<3;i++){const u=.1+i*.3,c=[a[0]+(foot[0]-a[0])*u,a[1]+(foot[1]-a[1])*u];g.line(c[0]-3,c[1],c[0]+3,c[1]+.6,'r',['A','a']);}}
}
/* um braco com manga laranja e a mao */
function naruArm(g,sh,el,ha,hdir,open){
 pxLimb(g,sh,el,5.4,4.8,NM);pxLimb(g,el,ha,4.8,4.0,NM,'m');
 g.ell(sh[0],sh[1]+.5,3.1,3.3,'O');g.put(Math.round(sh[0]-1),Math.round(sh[1]-1),'Q');g.put(Math.round(sh[0]-2),Math.round(sh[1]+1),'q');
 pxHand(g,[ha[0]+Math.cos(hdir)*2,ha[1]+Math.sin(hdir)*2],hdir,open);
}
function naruFinish(g){g.outline('K');g.selout('K',NAR_DARK);return g;}
/* pelve da calca ligando o tronco as duas pernas */
function naruPelvis(g,hB,hF,yTop){
 const mx=(hB[0]+hF[0])/2;
 g.poly([[hB[0]-5,yTop],[hF[0]+4,yTop],[hF[0]+7,hF[1]+1],[hF[0]+2,hF[1]+5],[mx,hF[1]+1],[hB[0]+1,hB[1]+5],[hB[0]-5,hB[1]+1]],'O');
 g.poly([[hB[0]-5,yTop],[hB[0]+1,yTop],[hB[0]+1,hB[1]+5],[hB[0]-5,hB[1]+1]],'q');g.line(hB[0]-4,hB[1]+1,hB[0],hB[1]+4,'m',['q']);
 g.poly([[hF[0]-2,yTop+2],[hF[0]+4,yTop+1],[hF[0]+7,hF[1]+1],[hF[0]+3,hF[1]+4]],'Q');
 g.line(mx-1,yTop+2,mx,hF[1]+1,'m');g.line(hB[0]+1,hB[1]-3,hB[0]+4,hB[1]+1,'m',['O','q']);g.line(hF[0]-1,hF[1]-3,hF[0]+2,hF[1]+1,'q',['O','Q']);g.put(Math.round(hF[0]+5),Math.round(yTop+3),'k');}
/* monta um Naruto a partir das juntas */
function naruBuild(c){const g=PixGrid(56,80);
 naruLeg(g,c.bl[0],c.bl[1],c.bl[2],false,false);if(c.bs!=null)sandal(g,c.bs,false);
 naruLeg(g,c.fl[0],c.fl[1],c.fl[2],true,true);if(c.fs!=null)sandal(g,c.fs,true);
 if(c.extra)c.extra(g,'legs');
 naruArm(g,c.ba[0],c.ba[1],c.ba[2],c.ba[3],false);
 naruPelvis(g,c.bl[0],c.fl[0],c.H[1]-2);
 naruTorso(g,c.S,c.H,c.ws||16,c.wh||13);
 naruHead(g,c.head[0],c.head[1],c.head[2]);
 if(c.mid)c.mid(g);
 naruArm(g,c.fa[0],c.fa[1],c.fa[2],c.fa[3],!!c.fa[4]);
 if(c.extra)c.extra(g,'top');
 return naruFinish(g);}
const naruGuard=()=>naruBuild({bl:[[19,51],[13,60.5],[11,71]],bs:5,fl:[[34,51],[42.5,58],[43.5,71]],fs:38.5,S:[29,29],H:[28,46],head:[6,7],ba:[[22,31],[15,36],[8,44],2.2],fa:[[37,30],[43,35],[49,43],.7]});
const naruPunch=()=>naruBuild({bl:[[20,51],[13,60],[7,70.5]],bs:0,fl:[[34,50],[43,56],[44.5,71]],fs:38.5,S:[31,29],H:[28,46],head:[8,7,{mouth:true}],ba:[[23,31],[17,38],[17,45],1.6],fa:[[39,29],[47,30],[54,30],0]});
const naruHit=()=>naruBuild({bl:[[19,51],[16,61],[14,71]],bs:8,fl:[[32,51],[37,61],[38,71]],fs:32.5,S:[25,29],H:[26,46],ws:17,head:[2,5,{shut:true,mouth:true}],ba:[[18,31],[12,36],[5,41],2.5],fa:[[31,29],[37,33],[42,38],.9]});
const naruKick=()=>naruBuild({bl:[[22,51],[21,61],[20,71]],bs:14,fl:[[34,47],[44,46.5],[52,46]],S:[26,28],H:[26,45],head:[3,4],ba:[[17,29],[11,31.5],[4,34],3.3],fa:[[31,28],[36,29],[38,23],-1.3],
 extra:(g,w)=>{if(w==='legs'){g.poly([[50.5,41],[53.5,41],[55.5,43],[55.5,51],[50.5,51]],'N');g.line(55,42,55,50,'n');g.line(51,42,51,50,'v');g.put(52,42,'S');}}});
const naruSeal=()=>naruBuild({bl:[[19,51],[13,60.5],[11,71]],bs:5,fl:[[34,51],[42.5,58],[43.5,71]],fs:38.5,S:[29,29],H:[28,46],head:[6,7],ba:[[22,31],[26,36],[31,36],0],fa:[[37,30],[41,35],[36,36],3.0],
 extra:(g,w)=>{if(w==='top'){g.poly([[31.5,25],[34.5,25],[34.5,31.5],[31.5,31.5]],'S');g.line(33,25,33,30,'t');g.put(32,25,'W');}}});
const naruBlock=()=>naruBuild({bl:[[19,51],[13,60.5],[11,71]],bs:5,fl:[[34,51],[42.5,58],[43.5,71]],fs:38.5,S:[29,31],H:[28,47],head:[6,9,{shut:true}],ba:[[22,33],[28,38],[37,27],-.8],fa:[[37,32],[40,37],[31,26],-2.3]});
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