/* ================== Mecanica nova: Copia de Tecnicas, Genjutsu, Shishi Rendan, Selo Amaldicoado ================== */
const effDmg=(cd,A)=>{const base=A.dmg||0;if(!base)return 0;return Math.round(base*((seal2T>0&&!cd.noSeal)?1.6:(sealT>0&&!cd.noSeal)?1.3:1));};
const eyePos=(sx0,sy0,rS)=>[sx0+rS.C[0]+.5,GY+sy0+rS.C[1]+.5];
/* filtro "mundo vermelho" do Genjutsu: tudo vira monocromatico vermelho, mais escuro nas bordas */
function redWorld(g,k){if(k<=0)return;g.save();g.globalAlpha=Math.min(1,k);g.globalCompositeOperation='saturation';g.fillStyle='#808080';g.fillRect(0,0,PW,PH);g.globalCompositeOperation='multiply';
 const gr=g.createRadialGradient(PW/2,PH*.45,PH*.1,PW/2,PH*.5,PW*.7);gr.addColorStop(0,'#ff5a48');gr.addColorStop(.6,'#c01c20');gr.addColorStop(1,'#380408');g.fillStyle=gr;g.fillRect(0,0,PW,PH);g.restore();}
/* tomoe girando (olho do Sharingan) */
function tomoeRing(f,x,y,r,rot,al){f.save();f.translate(x,y);f.globalAlpha=al;f.strokeStyle='#e01830';f.lineWidth=.5;f.beginPath();f.arc(0,0,r,0,TAU);f.stroke();f.beginPath();f.arc(0,0,r*.38,0,TAU);f.fillStyle='#050203';f.fill();
 for(let i=0;i<3;i++){const a=rot+i*TAU/3;f.save();f.rotate(a);f.translate(r*.68,0);f.fillStyle='#050203';f.beginPath();f.arc(0,0,r*.2,0,TAU);f.fill();f.beginPath();f.moveTo(-r*.05,-r*.2);f.quadraticCurveTo(-r*.5,-r*.55,-r*.6,-r*.05);f.quadraticCurveTo(-r*.35,-r*.2,-r*.05,-r*.2);f.fill();f.restore();}f.restore();}
const GZ=mk({tilt:.02,crouch:3,lean:1,fbx:-7,ffx:5,hxF:6,hyF:2,hxB:5,hyB:3,expr:1,tw:.9,red:1,hr:.02});
const GZ2=mk({tilt:.06,crouch:4,lean:2,fbx:-8,ffx:6,hxF:9,hyF:-3,hxB:8,hyB:-1,expr:1,tw:.88,red:1,hr:.04,wind:.3});
/* ---- Cópia de Técnicas: o Sharingan lê a última técnica do inimigo ---- */
function copyFX(c){
 const {f,A,t,time,nx0,sx0,sy0,rS}=c,[ex,ey]=eyePos(sx0,sy0,rS);
 const k=scaleAt(0,1,.5,1.0,t)*(1-scaleAt(0,1,2.0,2.3,t));
 if(k>0){f.globalCompositeOperation='lighter';orb(f,ex,ey,14*k,[[0,'rgba(255,40,60,.7)'],[1,'rgba(160,10,30,0)']]);f.globalCompositeOperation='source-over';tomoeRing(f,ex+3.5,ey+1,3.2,time*5,k);}
 const g2=scaleAt(0,1,1.0,1.5,t)*(1-scaleAt(0,1,2.0,2.4,t));
 if(g2>0&&lastEnemy){f.globalCompositeOperation='lighter';
  if(lastEnemy==='rasengan'){rasengan(f,nx0-10,GY-42,7*g2,time,c.fr,.45*g2);}
  else{for(let i=0;i<3;i++){const x=nx0+(i-1)*16,y=GY-30;f.fillStyle=`rgba(255,120,60,${.22*g2})`;f.beginPath();f.ellipse(x,y,5,16,0,0,TAU);f.fill();orb(f,x,y-16,5,[[0,`rgba(255,200,120,${.3*g2})`],[1,'rgba(255,100,40,0)']]);}}
  f.globalCompositeOperation='source-over';
  /* linhas de leitura saindo do olho em direcao a tecnica */
  f.strokeStyle=`rgba(255,60,80,${.55*g2})`;f.lineWidth=.35;f.lineCap='round';for(let i=0;i<6;i++){const ph=((time*1.6+i*.17)%1);f.beginPath();f.moveTo(ex+(nx0-ex)*ph*.9,ey+(GY-40-ey)*ph*.9);f.lineTo(ex+(nx0-ex)*(ph*.9+.06),ey+(GY-40-ey)*(ph*.9+.06));f.stroke();}}
 if(t>1.6&&t<2.1){const kk=(t-1.6)/.5;f.globalCompositeOperation='lighter';ringFX(f,ex,ey,4+30*kk,1.2*(1-kk)+.2,`rgba(255,70,90,${1-kk})`);f.globalCompositeOperation='source-over';}
}
ANIMS.copy={dur:2.8,hold:1.0,hitT:1.0,dmg:0,cost:8,noLift:true,
 sP:[[0,READY],[.4,READY],[.6,GZ],[1.0,GZ2],[2.0,GZ2],[2.4,READY],[2.8,READY]],
 nP:[[0,N_READY],[.9,N_READY],[1.2,N_SURP],[2.0,N_SURP],[2.4,N_READY],[2.8,N_READY]],
 nX:[[0,288],[2.8,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:2.6,cx:104,cy:122}],[1.3,{z:2.6,cx:104,cy:122}],[1.7,{z:1.5,cx:200,cy:126}],[2.3,{z:1.15,cx:192,cy:118}],[2.8,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={};E.dim=.3*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,2.2,2.6,t));E.tint=`rgba(150,10,30,${.16*scaleAt(0,1,.5,1,t)*(1-scaleAt(0,1,2.0,2.4,t))})`;return E;},
 fx:c=>copyFX(c)};
/* ---- Genjutsu Sharingan ---- */
const N_GJ=mk({tilt:-.04,lean:-1,crouch:2,fbx:-6,ffx:5,hxF:1,hyF:11,hxB:0,hyB:11,hr:-.1,expr:2,tw:1});
function genjutsuFX(c){
 const {f,A,t,time,nx0,sx0,sy0,rS,fr}=c,[ex,ey]=eyePos(sx0,sy0,rS),k=scaleAt(0,1,.5,1.0,t)*(1-scaleAt(0,1,1.9,2.3,t));
 if(k>0){f.globalCompositeOperation='lighter';orb(f,ex,ey,16*k,[[0,'rgba(255,40,60,.75)'],[1,'rgba(160,10,30,0)']]);f.globalCompositeOperation='source-over';tomoeRing(f,ex+3.5,ey+1,3.4,time*7,k);}
 const w=scaleAt(0,1,.95,1.3,t)*(1-scaleAt(0,1,1.9,2.3,t));
 if(w>0){const cx=nx0-4,cy=GY-38;f.globalCompositeOperation='lighter';f.lineCap='round';
  for(let a=0;a<3;a++){f.strokeStyle=`rgba(255,${40+a*30},60,${.55*w})`;f.lineWidth=.45;f.beginPath();for(let q=0;q<=40;q++){const u=q/40,an=time*(3+a)+u*14+a*2,rr=3+u*30;const x=cx+Math.cos(an)*rr,y=cy+Math.sin(an)*rr*.9;q?f.lineTo(x,y):f.moveTo(x,y);}f.stroke();}
  tomoeRing(f,cx,cy,22*w,-time*3,.35*w);f.globalCompositeOperation='source-over';}
 const a=t-1.5;
 if(a>=0&&a<.7){const r2=R(21);f.lineCap='round';f.globalCompositeOperation='lighter';
  for(let i=0;i<3;i++){const ang=-.9+i*.55,p=a*60,x0=nx0-4-Math.cos(ang)*40+Math.cos(ang)*p*1.2,y0=GY-40-Math.sin(ang)*40+Math.sin(ang)*p*1.2;f.strokeStyle=`rgba(255,${120+i*40},120,${(1-a/.7)})`;f.lineWidth=1.6*(1-a/.7)+.3;f.beginPath();f.moveTo(x0-Math.cos(ang)*26,y0-Math.sin(ang)*26);f.lineTo(x0+Math.cos(ang)*26,y0+Math.sin(ang)*26);f.stroke();}
  f.globalCompositeOperation='source-over';bloodSpray(f,nx0-4,GY-40,a,31,18,-1);}
}
ANIMS.genjutsu={dur:3.4,hold:1.5,hitT:1.5,dmg:14,cost:12,noLift:true,
 sP:[[0,READY],[.4,READY],[.6,GZ],[1.0,GZ2],[2.0,GZ2],[2.5,READY],[3.4,READY]],
 nP:[[0,N_READY],[.9,N_READY],[1.05,N_GJ],[1.45,N_GJ],[1.5,N_HIT],[1.9,N_STAG],[2.7,N_READY],[3.4,N_READY]],
 nX:[[0,288],[1.5,288],[1.6,294],[2.2,290],[2.8,288],[3.4,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:2.5,cx:104,cy:122}],[1.1,{z:2.5,cx:104,cy:122}],[1.4,{z:1.5,cx:240,cy:126}],[1.6,{z:1.7,cx:280,cy:128}],[2.4,{z:1.3,cx:240,cy:126}],[3.0,{z:1.04,cx:192,cy:116}],[3.4,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={},a=t-1.5;if(a>0&&a<.4)E.shk=3*(1-a/.4);if(a>=0&&a<.03)E.flash=.25;E.dim=.35*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,2.3,2.8,t));return E;},
 post:(g,c)=>redWorld(g,scaleAt(0,1,.95,1.25,c.t)*(1-scaleAt(0,1,1.9,2.3,c.t))*.9),
 fx:c=>genjutsuFX(c)};
/* ---- fatality do Genjutsu: Tsukuyomi — o Naruto crucificado no mundo vermelho e perfurado por espadas ---- */
const N_CROSS=mk({tilt:0,lean:0,crouch:1,fbx:-4,ffx:4,hxF:6,hyF:-10,hxB:-6,hyB:-10,hdx:0,hdy:0,hr:-.15,expr:3,tw:1});
const N_CROSS2=Object.assign({},N_CROSS,{hr:-.45,hdy:1.5,crouch:2});
const GJ_ST=[[2.0,-4,-52,.35],[2.45,3,-44,-.5],[2.85,-2,-36,2.8],[3.2,6,-30,-.15],[3.5,-5,-24,.9],[3.75,2,-16,-.85],[3.95,-8,-60,.1],[4.15,8,-52,2.6],[4.3,0,-8,-1.2]];
function gjSword(f,ex,ey,ang,prog){const L=46,dx=Math.cos(ang),dy=Math.sin(ang),far=(1-prog)*60,tx=ex-dx*far,ty=ey-dy*far;f.save();f.lineCap='round';
 f.strokeStyle='rgba(8,4,12,.95)';f.lineWidth=2.1;f.beginPath();f.moveTo(tx-dx*L,ty-dy*L);f.lineTo(tx,ty);f.stroke();f.strokeStyle='rgba(240,236,240,.95)';f.lineWidth=1.2;f.beginPath();f.moveTo(tx-dx*L,ty-dy*L);f.lineTo(tx,ty);f.stroke();
 f.strokeStyle='rgba(255,255,255,.9)';f.lineWidth=.35;f.beginPath();f.moveTo(tx-dx*L,ty-dy*L);f.lineTo(tx,ty);f.stroke();
 f.strokeStyle='#120a14';f.lineWidth=2.6;f.beginPath();f.moveTo(tx-dx*(L+9),ty-dy*(L+9));f.lineTo(tx-dx*L,ty-dy*L);f.stroke();f.strokeStyle='#c8a050';f.lineWidth=.9;f.beginPath();f.moveTo(tx-dx*L-dy*3,ty-dy*L+dx*3);f.lineTo(tx-dx*L+dy*3,ty-dy*L-dx*3);f.stroke();f.restore();}
function gjDrawN(c){
 const {g,A,t,time,nx0,ny0,nP,nOpt}=c,tt=A?t:99;
 if(tt<6.0){g.fillStyle='#0a0510';g.fillRect(nx0-2.4,GY-100,4.8,108);g.fillRect(nx0-24,GY-63,48,4.8);g.strokeStyle='rgba(255,60,70,.5)';g.lineWidth=.5;g.strokeRect(nx0-2.4,GY-100,4.8,108);g.strokeRect(nx0-24,GY-63,48,4.8);}
 const sh=tt>2.0&&tt<6.0?Math.min(1.2,.3+GJ_ST.filter(s=>tt>s[0]).length*.12):0;
 blit(nx0+(sh?Math.sin(time*40)*sh*.8:0),GY+ny0,true,NARUTO,nP,time,nOpt);
}
function gjFatalFX(c){
 const {f,A,t,time,nx0,ny0,nP}=c,tt=A?t:99,rg=rigW(nP);
 if(tt>=2.0&&tt<6.0){
  for(const s of GJ_ST){const a=tt-s[0];if(a<0)continue;const ex=nx0+s[1],ey=GY+s[2],prog=Math.min(1,a/.12);gjSword(f,ex,ey,s[3],prog);
   if(a>=.1){bloodSpray(f,ex,ey,(a-.1)*1.1,300+Math.round(s[0]*10),14,s[1]>0?1:-1);if(a<.4){f.globalCompositeOperation='lighter';orb(f,ex,ey,12*(1-a/.5),[[0,'rgba(255,255,255,.7)'],[1,'rgba(255,120,120,0)']]);f.globalCompositeOperation='source-over';}}
   f.strokeStyle='rgba(150,10,20,.85)';f.lineWidth=.8;f.lineCap='round';if(a>.3){const ph=Math.min(1,(a-.3)*.5);f.beginPath();f.moveTo(ex,ey);f.lineTo(ex+s[1]*.1,ey+ph*12);f.stroke();}}
 }
 if(tt>=6.0){const base=[nx0-rg.C[0],GY+ny0+rg.C[1]],ang=-(ANIMS.genjutsu.L.nRot?ANIMS.genjutsu.L.nRot(tt):0),pv=[nx0,GY+ny0-30],rp=q=>rotAround(q[0],q[1],pv[0],pv[1],ang);
  f.lineCap='round';
  for(const sx of [-1.7,1.7]){const p0=rp([base[0]-1.2+sx*.5,base[1]+.4]),p1=rp([base[0]-1.4+sx*.55,base[1]+11+Math.min(8,(tt-6)*6)]);f.strokeStyle='rgba(150,10,22,.95)';f.lineWidth=.9;f.beginPath();f.moveTo(p0[0],p0[1]);f.lineTo(p1[0],p1[1]);f.stroke();}
  const m0=rp([base[0]-.6,base[1]+5.5]),m1=rp([base[0]-.7,base[1]+14]);f.strokeStyle='rgba(150,10,22,.9)';f.lineWidth=1;f.beginPath();f.moveTo(m0[0],m0[1]);f.lineTo(m1[0],m1[1]);f.stroke();
  if(A&&tt>7.4||!A){const pr=Math.min(11,((A?tt-7.4:99))*6);f.fillStyle='rgba(110,6,14,.5)';f.beginPath();f.ellipse(nx0+4,GY+2,pr,pr*.24,0,0,TAU);f.fill();}}
}
ANIMS.genjutsu.L={g:true,dur:11.0,koAt:10.3,bannerAt:8.4,banner:['月','FATALITY','Tsukuyomi','#e0306c'],latchT:1.6,
 map:[[0,0],[99,99]],
 sP:[[0,READY],[.4,READY],[.6,GZ],[1.0,GZ2],[6.0,GZ2],[6.6,AMA_CL2],[99,AMA_CL2]],
 nP:[[0,N_READY],[.9,N_READY],[1.05,N_GJ],[1.55,N_GJ],[1.6,N_CROSS],[4.3,N_CROSS2],[5.9,N_CROSS2],[6.2,N_BOUND2],[99,N_BOUND2]],
 nX:[[0,288],[99,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:2.7,cx:104,cy:120}],[1.3,{z:2.9,cx:104,cy:120}],[1.55,{z:1.5,cx:200,cy:126}],[1.65,{z:1.6,cx:288,cy:124}],[2.5,{z:2.3,cx:288,cy:116}],[3.2,{z:1.8,cx:288,cy:128}],[3.8,{z:2.8,cx:288,cy:112}],[4.4,{z:1.6,cx:288,cy:126}],[5.8,{z:1.5,cx:285,cy:124}],[6.3,{z:2.2,cx:288,cy:132}],[7.4,{z:1.9,cx:288,cy:140}],[8.4,{z:1.4,cx:240,cy:130}],[9.2,{z:1.04,cx:192,cy:116}]],
 nRot:t=>{const k=scaleAt(0,1,6.6,7.5,t);return -1.45*k*k;},
 nY:t=>{const k=scaleAt(0,1,6.6,7.5,t);return 32*k*k;},
 drawN:c=>gjDrawN(c),
 stat:{nx0:288,nP:N_BOUND2},
 env:(raw,t)=>{const E={};const a=raw-1.5;if(a>0&&a<.5)E.shk=6*(1-a/.5);if(a>=0&&a<.05)E.flash=.9;if(raw>5.95&&raw<6.05)E.flash=.9;
  for(const s of GJ_ST){const d=raw-s[0]-.1;if(d>0&&d<.25)E.shk=Math.max(E.shk||0,3*(1-d/.25));}
  E.dim=.35*scaleAt(0,1,.4,.8,t)*(1-.5*scaleAt(0,1,8.0,9.0,raw)-.5*scaleAt(0,1,10.0,11.0,raw));E.bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,10.0,11.0,raw));return E;},
 post:(g,c)=>redWorld(g,scaleAt(0,1,1.5,1.62,c.raw)*(1-scaleAt(0,1,5.95,6.05,c.raw))),
 lens:(g,c)=>lensGen(g,c,{vig:[6.3,6.9,8.6,9.6],fade:[9.2,9.9],spl:[[6.4,.8,.3,52,1],[6.6,.2,.45,40,2],[7.2,.62,.8,36,3]]}),
 fx:c=>{gjFatalFX(c);if(c.raw>.55&&c.raw<1.55){const [ex,ey]=eyePos(c.sx0,c.sy0,c.rS),k=scaleAt(0,1,.5,1.0,c.raw);c.f.globalCompositeOperation='lighter';orb(c.f,ex,ey,16*k,[[0,'rgba(255,40,60,.75)'],[1,'rgba(160,10,30,0)']]);c.f.globalCompositeOperation='source-over';tomoeRing(c.f,ex+3.5,ey+1,3.4,c.time*7,k);}if(c.A&&c.t>6.0)eyeBleedFX(c.f,Math.max(c.t,5.8),c.time,c.sx0,c.sy0,c.rS);},fxStatic:c=>gjFatalFX(c)};
function sfxFatalGJ(){
 tone('sine',60,50,1.4,.3,.6);nz(.5,'bandpass',500,2400,.2,.8);tone('sawtooth',300,900,.4,.06,1.2);nz(.3,'highpass',3000,9000,.4,1.5);tone('sine',80,36,.8,.6,1.5);
 nz(4.0,'lowpass',400,200,.18,1.7);tone('sine',55,52,4.0,.1,1.7);
 GJ_ST.forEach((s,i)=>{nz(.12,'highpass',3500,9000,.4,s[0]);nz(.2,'lowpass',1400,200,.55,s[0]+.1);tone('sine',140,50,.25,.5,s[0]+.1);});
 nz(.4,'highpass',3000,9000,.6,6.0);tone('sine',70,36,.6,.7,6.0);
 [6.6,7.4,8.2,9.0].forEach((a,i)=>{tone('sine',58,36,.22,.45-i*.05,a);tone('sine',54,34,.22,.35-i*.05,a+.28);});
 tone('sine',85,30,.55,.65,7.4);nz(.45,'lowpass',1600,150,.6,7.4);tone('sine',3300,3300,2.5,.015,6.6);}
ANIMS.genjutsu.L.sfxFn=sfxFatalGJ;

/* ---------- Kawarimi no Jutsu: jutsu BASICO de DEFESA (vale para todos os personagens) ----------
   Gasta o turno e 10 de chakra para deixar o jutsu pronto. O PROXIMO golpe que causar dano em quem preparou e evitado por completo:
   ele troca de lugar com um tronco, o tronco leva o golpe e ele reaparece ileso. Nao causa dano nem contra-ataca.
   EM SEGREDO: preparar nao tem animacao, banner nem marca na placa do adversario (como Defender/Concentrar), para o inimigo nao prever e nao gastar um jutsu a toa.
   So a esquiva em si aparece. Limite: KAWARIMI_MAX usos por luta para cada personagem. Flags e contadores (kawS/kawN, kawUseS/kawUseN) em js/11-kyubi.js. */
const KAWARIMI_COST=10,KAWARIMI_MAX=2;
/* janela da esquiva dentro de uma animacao de ataque: some no primeiro acerto, o tronco leva o golpe, volta ileso depois do ultimo */
function mkDodge(who,A){const ts=(A.hits&&A.hits.length)?A.hits.filter(h=>h.dmg>0).map(h=>h.t):[A.hitT];const first=Math.min(...ts),last=Math.max(...ts);return{who,t0:Math.max(.2,first-.3),tb:last,t1:last+1.05};}
