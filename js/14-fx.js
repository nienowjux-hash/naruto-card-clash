/* ---------- fx ---------- */
function chidoriFX(c,x,y,p,fr,time){
 if(p<=0)return;const pp=Math.min(1.25,p),r=1.4+pp*3.4;c.globalCompositeOperation='lighter';
 orb(c,x,y,r*8,[[0,'rgba(90,160,255,.55)'],[.35,'rgba(40,90,255,.22)'],[1,'rgba(20,40,255,0)']]);
 for(let k=0;k<2;k++){const ph=((time*2.2+k*.5)%1);c.strokeStyle=`rgba(150,225,255,${(1-ph)*.7})`;c.lineWidth=.45;c.beginPath();c.arc(x,y,r*1.5+ph*r*5,0,TAU);c.stroke();}
 const n=Math.round(10+pp*14);let lines=[];
 for(let i=0;i<n;i++){const rn=R(fr*131+i*17+5);const ang=rn()*TAU,len=(6+rn()*19)*pp;lines.push(...boltLines(x,y,ang,len,fr*977+i*31,true));}
 drawBolts(c,lines,1);
 for(let i=0;i<4;i++){const a=time*9+i*1.57,rr=r*1.8;orb(c,x+Math.cos(a)*rr,y+Math.sin(a)*rr*.8,1.2,[[0,'#fff'],[1,'rgba(120,200,255,0)']]);}
 orb(c,x,y,r*2.6,[[0,'#ffffff'],[.3,'rgba(220,248,255,.95)'],[.65,'rgba(110,190,255,.45)'],[1,'rgba(60,120,255,0)']]);
 c.globalCompositeOperation='source-over';
}
function eBird(c,x,y,ang,sz,flap,fr){
 const cs=Math.cos(ang),sn=Math.sin(ang),w=Math.sin(flap)*5,rn=R(fr*31+Math.floor(x));
 const P=(fx,fy)=>[x+(fx*cs-fy*sn)*sz+(rn()-.5)*.5,y+(fx*sn+fy*cs)*sz+(rn()-.5)*.5];
 const lines=[[P(-6,0),P(-2,0),P(3,0),P(7,-1)],[P(1,0),P(-2,-5-w),P(-6,-9-w*1.4),P(-9.5,-8-w*1.6)],[P(1,0),P(-2,5+w),P(-6,9+w*1.4),P(-9.5,8+w*1.6)],[P(-6,0),P(-10,-1.5),P(-13.5,1)],[P(7,-1),P(9.5,-.4),P(8,1.4)]];
 f.globalCompositeOperation='lighter';drawBolts(c,lines,.85);
 orb(c,x,y,3.2*sz,[[0,'rgba(255,255,255,.9)'],[1,'rgba(120,200,255,0)']]);c.globalCompositeOperation='source-over';}
function tongue(c,x,y,h,w,ph,col){c.fillStyle=col;c.beginPath();c.moveTo(x-w,y);c.bezierCurveTo(x-w*1.1,y-h*.45,x-w*.3+Math.sin(ph)*w*.8,y-h*.75,x+Math.sin(ph*1.3)*w*.9,y-h);c.bezierCurveTo(x+w*.4+Math.sin(ph)*w*.6,y-h*.7,x+w*1.1,y-h*.4,x+w,y);c.closePath();c.fill();}
function flame(c,x,y,h,w,ph){c.globalCompositeOperation='lighter';orb(c,x,y-h*.4,h*.9,[[0,'rgba(255,140,40,.35)'],[1,'rgba(255,60,0,0)']]);c.globalCompositeOperation='source-over';
 tongue(c,x,y,h,w,ph,'#b8281a');tongue(c,x,y,h*.82,w*.78,ph+.5,'#ff6a1a');tongue(c,x,y,h*.6,w*.52,ph+1,'#ffb02e');tongue(c,x,y,h*.36,w*.28,ph+1.5,'#fff0a0');}
function ameInt(a){if(a<0)return 0;const grow=clamp(a/.7,0,1),fade=a<1.5?1:Math.max(.5,1-(a-1.5)/1.7);return grow*fade;}
function lick(c,x,y,h,w,ph,col){const n=12,L=[],Rr=[];for(let k=0;k<=n;k++){const u=k/n,yy=y-h*u,ww=w*Math.pow(1-u,.8)+.15,xx=x+Math.sin(ph+u*4.2)*w*.9*u;L.push([xx-ww,yy]);Rr.push([xx+ww,yy]);}
 c.fillStyle=col;c.beginPath();L.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));for(let i=n;i>=0;i--)c.lineTo(Rr[i][0],Rr[i][1]);c.closePath();c.fill();}
function bFlame(c,x,y,h,w,ph){lick(c,x,y,h,w*1.15,ph,'#2c0e2c');lick(c,x,y,h*.95,w*.98,ph+.35,'#100318');lick(c,x,y,h*.82,w*.72,ph+.8,'#000000');
 c.strokeStyle='rgba(110,40,100,.45)';c.lineWidth=.35;c.lineCap='round';c.beginPath();c.moveTo(x-w*.4,y-h*.1);c.quadraticCurveTo(x-w*.5+Math.sin(ph)*w*.4,y-h*.5,x+Math.sin(ph+3)*w*.7,y-h*.82);c.stroke();}
function ameFlames(c,nx,a,fr,ovr,rN,ny){const ii=ovr!=null?ovr:ameInt(a),grow=clamp(a/.7,0,1);if(ii<.02)return;
 orb(c,nx,GY-30,80,[[0,'rgba(2,0,4,'+.55*ii+')'],[.6,'rgba(8,0,10,'+.22*ii+')'],[1,'rgba(4,0,6,0)']]);
 const pts=[],X=p=>nx-p[0],Y=p=>GY+(ny||0)+p[1];
 if(rN){const Ln=(p,q,n)=>{for(let i=0;i<n;i++){const k=(i+.5)/n;pts.push([p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k,1]);}};
  const E=o=>[o.ex,o.ey],H=o=>[o.hx,o.hy];
  pts.push([rN.C[0],rN.C[1]-4,1.35]);Ln(rN.S,rN.Hp,4);
  Ln(rN.shF,E(rN.hf),2);Ln(E(rN.hf),H(rN.hf),2);Ln(rN.shB,E(rN.hb),2);Ln(E(rN.hb),H(rN.hb),2);
  Ln(rN.hip,E(rN.lf),2);Ln(E(rN.lf),H(rN.lf),2);Ln(rN.hip,E(rN.lb),2);Ln(E(rN.lb),H(rN.lb),2);}
 else for(let i=0;i<10;i++)pts.push([(i-5)*3,-i*5-4,1]);
 if(rN){const segs=[[rN.S,rN.Hp],[rN.shF,[rN.hf.ex,rN.hf.ey]],[[rN.hf.ex,rN.hf.ey],[rN.hf.hx,rN.hf.hy]],[rN.shB,[rN.hb.ex,rN.hb.ey]],[[rN.hb.ex,rN.hb.ey],[rN.hb.hx,rN.hb.hy]],[rN.hip,[rN.lf.ex,rN.lf.ey]],[[rN.lf.ex,rN.lf.ey],[rN.lf.hx,rN.lf.hy]],[rN.hip,[rN.lb.ex,rN.lb.ey]],[[rN.lb.ex,rN.lb.ey],[rN.lb.hx,rN.lb.hy]]];
  c.lineCap='round';for(const [lw,col,al] of [[11,'#2a0c2a',.5],[8.5,'#0c0314',.9],[6,'#000000',.97]]){c.strokeStyle=col;c.globalAlpha=al*Math.min(1,ii*1.3);c.lineWidth=lw*(.6+.4*grow);for(const sg of segs){c.beginPath();c.moveTo(X(sg[0])+Math.sin(fr*.3+sg[0][1])*.6,Y(sg[0]));c.lineTo(X(sg[1])+Math.sin(fr*.3+sg[1][1])*.6,Y(sg[1]));c.stroke();}
   c.beginPath();c.arc(X(rN.C),Y(rN.C),lw*.62*(.6+.4*grow),0,TAU);c.fillStyle=col;c.fill();}c.globalAlpha=1;}
 pts.forEach((p,i)=>{const px=X(p)+Math.sin(fr*.3+i*1.9)*1.1,py=Y(p),hh=(15+9*Math.sin(fr*.45+i*2.3))*ii*grow*(p[2]||1);bFlame(c,px,py,hh,hh*.3,fr*.32+i);});
 const rad=8+grow*30;for(let i=0;i<15;i++){const u=(i-7)/7,px=nx+u*rad*1.1+Math.sin(fr*.3+i*1.7)*1.2,hh=(12+8*Math.sin(fr*.4+i*2.1)+(1-Math.abs(u))*24)*ii*(.4+.6*grow);bFlame(c,px,GY+2,hh,hh*.34,fr*.35+i);}
 const r2=R(Math.floor(fr/2)*7+3);
 for(let i=0;i<14;i++){const ph=(a*.6+i*.17)%1,x0=nx+(r2()-.5)*26,y0=GY-ph*70;c.save();c.translate(x0,y0);c.rotate(ph*6+i);c.globalAlpha=(1-ph)*.85*ii;c.fillStyle='#0a0408';c.fillRect(-.9,-.5,1.8,1);c.restore();}
 c.globalCompositeOperation='lighter';for(let i=0;i<14;i++){const ph=(a*.8+i*.113)%1;c.fillStyle='rgba(110,28,90,'+(1-ph)*.35*ii+')';c.fillRect(nx+(r2()-.5)*30,GY-ph*80,.7,.7);}c.globalCompositeOperation='source-over';}
/* circulo cheio em celulas de 1 pixel (fumaca e nuvens no estilo dos sprites) */
function pxDisc(c,cx,cy,r){const x0=Math.floor(cx-r),x1=Math.ceil(cx+r),y0=Math.floor(cy-r),y1=Math.ceil(cy+r);for(let y=y0;y<=y1;y++){const dy=y+.5-cy;const w=Math.sqrt(Math.max(0,r*r-dy*dy));if(w<=0)continue;const a=Math.round(cx-w),b=Math.round(cx+w);if(b>a)c.fillRect(a,y,b-a,1);}}
function puff(c,x,y,age,seed){if(age<0||age>.75)return; /* fumaca do jutsu em pixel: nuvem cinza com contorno e brilho rapido no centro */
 if(age<.12){const k=1-age/.12;c.fillStyle='rgba(255,255,255,'+(.85*k)+')';pxDisc(c,x,y,16*(1-k*.4));}
 const al=Math.max(0,1-age/.75),pts=[];
 for(let i=0;i<12;i++){const r=R(seed*17+i),an=r()*TAU,sp=10+r()*18;pts.push([x+Math.cos(an)*(4+sp*age*1.1),y+Math.sin(an)*(6+sp*age*.8)-age*8,(5+r()*5)*(.8+age*1.3)]);}
 c.save();c.globalAlpha=al;
 c.fillStyle='#4a4a62';for(const [px,py,rad] of pts)pxDisc(c,px,py+1,rad+1);
 c.fillStyle='#a6a8bc';for(const [px,py,rad] of pts)pxDisc(c,px,py,rad);
 c.fillStyle='#e8e8f2';for(const [px,py,rad] of pts)pxDisc(c,px-rad*.25,py-rad*.3,rad*.6);
 c.restore();}
function logShape(c){const g1=c.createLinearGradient(-6,0,6,0);g1.addColorStop(0,'#5a3414');g1.addColorStop(.5,'#9a6a36');g1.addColorStop(1,'#6a4020');
 c.beginPath();c.roundRect(-6,-34,12,34,1.2);c.fillStyle=g1;c.fill();c.strokeStyle='#2a1608';c.lineWidth=.7;c.stroke();
 c.strokeStyle='rgba(40,20,8,.6)';c.lineWidth=.4;for(let i=0;i<6;i++){c.beginPath();c.moveTo(-5+i*2,-33);c.lineTo(-5.6+i*2.2,-1);c.stroke();}
 c.fillStyle='#d9a96a';c.beginPath();c.ellipse(0,-34,6,2.1,0,0,TAU);c.fill();c.strokeStyle='#7a4a24';c.lineWidth=.4;c.beginPath();c.ellipse(0,-34,3.6,1.2,0,0,TAU);c.stroke();c.beginPath();c.ellipse(0,-34,1.4,.5,0,0,TAU);c.stroke();
 c.strokeStyle='#d8c08a';c.lineWidth=1.4;c.beginPath();c.moveTo(-6,-22);c.lineTo(6,-20);c.moveTo(-6,-14);c.lineTo(6,-12);c.stroke();c.strokeStyle='#7a6030';c.lineWidth=.3;c.stroke();}
function drawLog(c,x,t){const age=t-1.62;if(age<0)return;
 const LS=USE_SPR&&SPR.log,logD=c=>{if(LS){c.imageSmoothingEnabled=false;c.drawImage(SPR.log.c,-SPR.log.ax,-SPR.log.ay);}else logShape(c);},cw=LS?16:12,ch=LS?80:40;
 if(age<.16){c.save();c.translate(x+Math.sin(age*90)*1.3,GY);logD(c);c.restore();return;}
 const q=age-.16,al=clamp(1.2-q/1.0,0,1);if(al<=0)return;c.globalAlpha=al;
 for(const sd of [-1,1]){c.save();c.translate(x+sd*(2+q*46),GY-Math.sin(Math.min(1,q/.6)*Math.PI)*12*(1)+Math.max(0,q-.6)*0);c.rotate(sd*q*3.4);c.beginPath();if(sd<0)c.rect(-cw,-ch,cw,ch+4);else c.rect(0,-ch,cw,ch+4);c.clip();logD(c);c.restore();}
 const r2=R(5);for(let i=0;i<16;i++){const an=-Math.PI/2+(r2()-.5)*2.6,sp=30+r2()*70,px=x+Math.cos(an)*sp*q,py=GY-16+Math.sin(an)*sp*q+140*q*q;if(py>GY+3)continue;c.save();c.translate(px,py);c.rotate(q*10+i);c.fillStyle=i%2?'#9a6a36':'#5a3414';c.fillRect(-1.2,-.6,2.4,1.2);c.restore();}
 c.globalAlpha=1;}
/* Rasengan em pixel art: esfera giratoria de bandas em espiral (3 tons de azul + nucleo branco), contorno escuro e faiscas orbitando */
const RPN=128,rasPix=document.createElement('canvas');rasPix.width=rasPix.height=RPN;const rasPx=rasPix.getContext('2d',{willReadFrequently:true});
function rasengan(c,x,y,r,time,fr,al,clipX){c.save();c.globalAlpha=al==null?1:al;
 f.save();f.globalCompositeOperation='lighter';orb(f,x,y,r*2.6,kyuT>0?[[0,'rgba(255,90,40,'+(.4*(al==null?1:al))+')'],[1,'rgba(200,10,0,0)']]:[[0,'rgba(150,205,255,'+(.3*(al==null?1:al))+')'],[1,'rgba(40,90,255,0)']]);f.restore(); /* brilho no layer de efeitos; o pixel art fica nitido */
 const C=RPN/2,R0=Math.max(2,Math.min(C-8,Math.round(r))),id=rasPx.createImageData(RPN,RPN),d=id.data,spin=time*13,
  put=(px,py,rgb)=>{if(px<0||py<0||px>=RPN||py>=RPN)return;const i=(py*RPN+px)*4;d[i]=rgb[0];d[i+1]=rgb[1];d[i+2]=rgb[2];d[i+3]=255;},
  P3=kyuT>0?[[255,250,230],[255,200,150],[255,120,60],[220,40,24],[150,14,14],[70,4,8]]:[[255,255,255],[205,240,255],[130,200,255],[70,145,245],[34,84,196],[16,38,120]]; /* com o chakra da raposa o Rasengan fica vermelho */
 const y0=Math.max(0,C-R0-6),y1=Math.min(RPN-1,C+R0+6);
 for(let py=y0;py<=y1;py++)for(let px=y0;px<=y1;px++){const dx=px+.5-C,dy=py+.5-C,dd=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
  if(dd<=R0+1){
   if(dd>R0){put(px,py,P3[5]);continue;}
   if(dd>R0-1.2){put(px,py,P3[4]);continue;}
   /* bandas em espiral que giram; o nucleo e branco e a borda escurece */
   const u=((a+dd*.6-spin)/(TAU/5))%1,fq=u<0?u+1:u;let k=dd<R0*.26?0:fq<.2?0:fq<.48?1:fq<.76?2:3;if(dd>R0*.82&&k<3)k++;
   /* brilho de esfera: canto de cima clareia */
   if(dx<-R0*.15&&dy<-R0*.15&&dd>R0*.45&&dd<R0*.7&&k>1)k--;
   put(px,py,P3[k]);continue;}
  /* aneis de vento girando em volta (tracos com falhas) */
  for(const [rr,sp,gap] of [[R0+2.5,-9,.55],[R0+4.5,7,.62]]){if(Math.abs(dd-rr)<.6){const v=((a*3+time*sp)/TAU)%1;if((v<0?v+1:v)<gap)put(px,py,P3[dd<R0+3.5?2:1]);}}}
 for(let i=0;i<10;i++){const aa=time*8+i*TAU/10,rr=R0+6+((i*5)%3),px=Math.round(C+Math.cos(aa)*rr),py=Math.round(C+Math.sin(aa)*rr*.9);put(px,py,P3[i%2?0:1]);}
 rasPx.putImageData(id,0,0);c.imageSmoothingEnabled=false;
 if(clipX!=null){c.beginPath();c.rect(clipX-400,-400,400,1000);c.clip();}
 c.drawImage(rasPix,Math.round(x)-C,Math.round(y)-C);
 c.restore();}
/* fatality do Rasengan: a esfera empurra as costas do Sasuke (calombo girando), estoura abrindo um rombo, sai voando e explode, com sangue e pedacos de roupa e carne em pixel */
function rasFatalFX(g,f,t,raw,time,fr,sx0,z,sx,sy,ccx,ccy){const L=ANIMS.rasengan.LR,B=L.burst,cy=GY-38,back=sx0-7;
 g.save();setCam(g,z,sx,sy,ccx,ccy);
 if(rasKyu&&t>=2.2&&t<B){const k=scaleAt(0,1,2.2,B,t);rasengan(g,sx0-1,cy,10+k*14+Math.sin(time*40)*1.2,time*1.6,fr,1);} /* na Kyubi a esfera vermelha cresce moendo o Sasuke por inteiro */
 if(!rasKyu&&t>=2.3&&t<B){const k=scaleAt(0,1,2.3,B,t);rasengan(g,back+1+k*3,cy,2+k*7+Math.sin(time*40)*.5,time*1.3,fr,1,back+1); /* so a parte que ja passou das costas aparece */
  const r2=R(fr*11);for(let i=0;i<10*k;i++){g.fillStyle=r2()<.5?'#9a0f1c':'#d4202e';g.fillRect(Math.round(back-r2()*6),Math.round(cy+(r2()-.5)*14),1,1);}}
 const a=t-B;
 if(a>=0&&a<.3){const k=a/.3;rasengan(g,back-2-k*4,cy,(rasKyu?24:9)+k*(rasKyu?14:8),time*1.8,fr,1-k);} /* a esfera nao sai voando: abre o rombo e se desfaz ali mesmo */
 g.restore();
 if(a>=0&&a<1.6){
  bloodSpray(f,back,cy,a*1.1,71,70,-1.4);bloodSpray(f,back,cy+3,a*.9,72,50,-1.1);bloodSpray(f,back,cy-4,a*1.3,73,40,-1.6);
  scraps(f,back,cy,a,74,22,[[42,79,184],[30,50,130],[236,190,160],[150,16,24]],-1);
  if(a<.3){f.save();f.globalCompositeOperation='lighter';const k=a/.3;ringFX(f,back,cy,4+40*k,2*(1-k)+.2,`rgba(255,255,255,${1-k})`);ringFX(f,back,cy,(4+40*k)*.75,1.4*(1-k)+.2,`rgba(130,200,255,${1-k})`);f.restore();}}
 const pop=a;if(pop>=0&&pop<(rasKyu?.8:.45)){const px=back-3,k=pop/(rasKyu?.8:.45);f.save();f.globalCompositeOperation='lighter';
  if(rasKyu){orb(f,px,cy,70*(1-k*.3),[[0,`rgba(255,230,200,${.9*(1-k)})`],[.35,`rgba(255,90,30,${.6*(1-k)})`],[1,'rgba(160,10,0,0)']]);ringFX(f,px,cy,8+130*(1-(1-k)*(1-k)),3*(1-k)+.3,`rgba(255,140,60,${1-k})`);ringFX(f,px,cy,(8+130*(1-(1-k)*(1-k)))*.7,2*(1-k)+.2,`rgba(255,60,20,${1-k})`);}
  else{orb(f,px,cy,30*(1-k*.4),[[0,`rgba(230,245,255,${.8*(1-k)})`],[.4,`rgba(120,190,255,${.45*(1-k)})`],[1,'rgba(40,90,255,0)']]);ringFX(f,px,cy,6+60*(1-(1-k)*(1-k)),2.2*(1-k)+.2,`rgba(200,235,255,${1-k})`);}f.restore();}
 if(rasKyu&&a>=0){ /* espiral queimada no chao e brasas vermelhas subindo do corpo */
  const k=Math.min(1,a/.3);g.save();setCam(g,z,sx,sy,ccx,ccy);g.globalAlpha=.85*k;for(let i=0;i<120;i++){const u=i/120,ang=u*TAU*2.4,rr=4+u*46*k;g.fillStyle=i%2?'#2a0806':'#6a1208';g.fillRect(Math.round(sx0+Math.cos(ang)*rr),Math.round(GY+1+Math.sin(ang)*rr*.2),2,1);}g.restore();
  if(a<4){const r2=R(2500);for(let i=0;i<26;i++){const ph=((time*.7+r2())%1);f.fillStyle=`rgba(255,${80+Math.floor(r2()*100)},30,${(1-ph)*Math.max(0,1-a/4)})`;f.fillRect(Math.round(sx0-14+r2()*28),Math.round(GY-6-ph*50),1,2);}}}
 if(t>=3.6&&t<7.5){const k=clamp((t-3.6)/.3,0,1),wy=cy+5;for(let i=0;i<5;i++){const ph=((t*(.4+i*.07)+i*.23)%1),x0=sx0+((i*53)%7)-3,yy=wy+ph*(GY-wy-2);f.fillStyle=`rgba(${120+(i*13)%40},8,18,${.9*k})`;f.fillRect(Math.round(x0),Math.round(yy),1,2);}
  const pr=Math.min(14,(t-3.8)*3.6);if(pr>0){f.fillStyle='rgba(110,6,14,.6)';f.beginPath();f.ellipse(sx0-4,GY+2,pr,pr*.24,0,0,TAU);f.fill();}}
}
function ringFX(c,cx,cy,r,w,col){c.strokeStyle=col;c.lineWidth=Math.max(.1,w);c.beginPath();c.ellipse(cx,cy,r,r*.92,0,0,TAU);c.stroke();}
function explosionFX(c,x,y,a,fr){
 const k=Math.min(1,a/.26),rr=10+30*(1-(1-k)*(1-k)),fade=a<.5?1:Math.max(0,1-(a-.5)/.45);if(fade<=0)return;const r=rr*(.55+.45*fade),ph=fr*.9,up=a*14;
 c.globalCompositeOperation='lighter';orb(c,x,y-up,r*2.6,[[0,`rgba(255,170,60,${.75*fade})`],[1,'rgba(255,80,0,0)']]);c.globalCompositeOperation='source-over';
 blob(c,x,y-up*.6,r,'#4a0c0c',ph,.3);blob(c,x,y-up*.8,r*.86,'#c42a16',ph+1,.3);blob(c,x,y-up,r*.66,'#ff6a1a',ph+2,.3);blob(c,x,y-up*1.2,r*.46,'#ffb02e',ph+3,.3);blob(c,x,y-up*1.3,r*.26,'#ffe680',ph+4,.25);blob(c,x,y-up*1.3,r*.1,'#fffbe8',ph+5,.2);
}
function smoke(c,x,y,r,a){const gr=c.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(30,22,40,${a})`);gr.addColorStop(1,'rgba(30,22,40,0)');c.fillStyle=gr;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
function waterColumn(c,x,a,w,hgt){const k=Math.min(1,a/.25),h=hgt*(1-(1-k)*(1-k)),fade=a<.3?1:Math.max(0,1-(a-.3)/.45);if(fade<=0)return;
 const gr=c.createLinearGradient(0,GY-h,0,GY);gr.addColorStop(0,`rgba(235,248,255,${.0})`);gr.addColorStop(.3,`rgba(235,248,255,${.8*fade})`);gr.addColorStop(1,`rgba(120,180,240,${.5*fade})`);
 c.fillStyle=gr;c.beginPath();c.moveTo(x-w,GY);c.quadraticCurveTo(x-w*.8,GY-h*.6,x-w*.3*(1+a),GY-h);c.quadraticCurveTo(x,GY-h*1.08,x+w*.3*(1+a),GY-h);c.quadraticCurveTo(x+w*.8,GY-h*.6,x+w,GY);c.closePath();c.fill();
 const r2=R(Math.floor(a*20)+3);for(let i=0;i<22;i++){const ang=-Math.PI/2+(r2()-.5)*1.6,sp=40+r2()*70,px=x+Math.cos(ang)*sp*a,py=GY-4+Math.sin(ang)*sp*a+120*a*a;if(py>GY+2)continue;c.fillStyle=`rgba(240,250,255,${fade})`;c.beginPath();c.arc(px,py,.45+r2()*.5,0,TAU);c.fill();}}

