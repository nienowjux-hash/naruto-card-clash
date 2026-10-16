/* ================== Cópia: Rasengan e Kage Bunshin (Sasuke usa a técnica copiada) ================== */
const RS_H=mk({tilt:.1,crouch:6,lean:1,fbx:-11,ffx:8,hxF:13,hyF:2,hxB:12,hyB:4,hF:1,hB:1,expr:2,tw:.85,hr:-.05,red:1});
const RS_D=mk({tilt:.42,crouch:7,lean:3,fbx:-15,fby:-4,ffx:-4,ffy:-5,hxF:16,hyF:0,hxB:-8,hyB:3,hF:1,expr:2,tw:.8,hr:-.1,wind:1,red:1});
const RS_P=mk({tilt:.34,crouch:6,lean:3,fbx:-12,ffx:6,hxF:17,hyF:-1,hxB:-7,hyB:3,hF:1,expr:2,tw:.8,wind:.6,red:1});
const RSX=[[0,96],[1.55,96],[1.65,110],[2.05,246],[2.9,246],[3.5,96],[99,96]];
const N_DRILL=mk({tilt:.34,lean:2,crouch:4,fbx:-8,ffx:5,hxF:4,hyF:9,hxB:-3,hyB:-6,hdx:3,hdy:2,hr:.2,expr:3,tw:1,wind:.8});
function copRasenganFX(c,fatal){
 const {f,A,t,time,fr,nx0,hw}=c,tt=A?t:99,rr=scaleAt(0,1,.6,1.5,tt)*8*(tt<2.1?1:Math.max(0,1-(tt-(fatal?2.58:2.5))/.3));
 if(A&&rr>0&&tt<(fatal?2.9:2.7)){rasengan(f,hw[0]+3,hw[1]-1,rr,time,fr);
  if(tt<1.5){const r2=R(fr*3+1);f.globalCompositeOperation='lighter';f.lineCap='round';for(let i=0;i<12;i++){const an=r2()*TAU,d0=12+r2()*18,ph=(time*3+i*.17)%1,dd=d0*(1-ph);f.strokeStyle='rgba(190,230,255,'+(.7*ph)+')';f.lineWidth=.4;f.beginPath();f.moveTo(hw[0]+Math.cos(an)*dd,hw[1]+Math.sin(an)*dd*.8);f.lineTo(hw[0]+Math.cos(an)*(dd+3),hw[1]+Math.sin(an)*(dd+3)*.8);f.stroke();}f.globalCompositeOperation='source-over';}}
 if(A&&tt>1.6&&tt<2.1){dashLines(f,c,1.6,2.1,5);for(let i=3;i>=1;i--){const t2=tt-i*.04;if(t2<1.65)continue;blit(interp(RSX,t2),GY,false,SASUKE,evalPose(c.A.sP,t2),time,{tint:[160,210,255],tk:.5,alpha:.28-i*.07,noRefl:true});}}
 const a=tt-2.1;
 if(A&&a>=0&&!fatal&&a<1.2){const ex=nx0-8,ey=GY-38;waterColumn(f,ex-6,a,11,46);bloodSpray(f,ex-4,ey-2,a,4,28,-1);scraps(f,ex,ey,a,5,16,[[51,68,154],[236,238,248],[250,210,176]],-1);
  f.globalCompositeOperation='lighter';if(a<.6)orb(f,ex,ey,44*(1-a/.9),[[0,'rgba(255,255,255,.5)'],[.3,'rgba(150,215,255,.3)'],[1,'rgba(60,120,255,0)']]);
  if(a<.5){const k=a/.5,e2=1-(1-k)*(1-k);rasengan(f,ex,ey,9+40*e2,time*1.4,fr,.8*(1-k));ringFX(f,ex,ey,6+66*e2,2.2*(1-k)+.2,'rgba(255,255,255,'+(1-k)+')');}
  f.globalCompositeOperation='source-over';}
}
ANIMS.cop_rasengan={dur:4.2,hold:2.1,hitT:2.1,dmg:22,cost:18,noLift:true,
 sP:[[0,READY],[.4,READY],[.55,RS_H],[1.6,RS_H],[1.72,RS_D],[2.05,RS_D],[2.1,RS_P],[2.8,RS_P],[3.3,READY],[4.2,READY]],
 sX:RSX,
 nP:[[0,N_READY],[1.7,N_READY],[1.85,N_SURP],[2.0,N_GUARD],[2.08,N_GUARD],[2.12,N_HIT],[2.7,N_HIT],[3.2,N_STAG],[3.8,N_READY],[4.2,N_READY]],
 nX:[[0,288],[2.08,288],[2.15,292],[2.6,334],[3.3,330],[4.0,290],[4.2,288]],
 nYf:t=>interp([[0,0],[2.1,0],[2.5,-16],[3.0,0],[99,0]],t),
 nRotf:t=>-TAU*2*scaleAt(0,1,2.15,3.0,t),
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.7,cx:110,cy:126}],[1.5,{z:1.7,cx:112,cy:126}],[1.8,{z:1.3,cx:190,cy:128}],[2.1,{z:1.5,cx:268,cy:130}],[2.7,{z:1.4,cx:290,cy:130}],[3.4,{z:1.1,cx:230,cy:122}],[3.9,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={},a=t-2.1;if(a>0&&a<.9)E.shk=6*(1-a/.9);if(a>=0&&a<.03)E.flash=.45;else if(a>=.03&&a<.1)E.flash=.18;E.dim=.35*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,3.0,3.6,t));return E;},
 fx:c=>copRasenganFX(c,false)};
/* ---- fatality da cópia do Rasengan: a espiral tritura o Naruto em fatias que giram para longe ---- */
const RSB=[{top:-200,bot:-62},{top:-62,bot:-52},{top:-52,bot:-42},{top:-42,bot:-32},{top:-32,bot:-22},{top:-22,bot:-12},{top:-12,bot:60}],RS_CUT=2.55,RS_FALL=[62,52,42,32,22,12,0];
function rsState(i,tt){const k=Math.max(0,tt-RS_CUT),dir=i%2?1:-1,sm=x=>x*x*(3-2*x),e1=sm(clamp(k/1.1,0,1)),e2=sm(clamp(k/1.5,0,1));
 const dx=dir*(10+6*i)*e1,rot=dir*((1+.5*i)*e2+2.5*Math.sin(clamp(k/1.2,0,1)*Math.PI)),up=-(18+i*3)*Math.sin(clamp(k/.9,0,1)*Math.PI)*(1-clamp((k-.9)/.4,0,1)),dy=up+RS_FALL[i]*sm(clamp((k-.2)/1.3,0,1));return{dx,dy,rot};}
function rsDrawN(c){
 const {g,A,t,time,nx0,ny0,nP,nOpt}=c,tt=A?t:99;
 if(tt<RS_CUT){const sh=tt>2.1?Math.sin(time*50)*.9:0;blit(nx0+sh,GY+ny0,true,NARUTO,nP,time,nOpt);return;}
 const o2=Object.assign({},nOpt,{noRefl:true});
 RSB.forEach((pc,i)=>{const s=rsState(i,tt),top=GY+pc.top,bot=GY+pc.bot,cy=(Math.max(top,GY-80)+Math.min(bot,GY))/2;
  g.save();g.translate(nx0+s.dx,cy+s.dy);g.rotate(s.rot);g.translate(-nx0,-cy);g.beginPath();g.rect(nx0-40,top,80,bot-top);g.clip();blit(nx0,GY+ny0,true,NARUTO,nP,time,o2);
  g.fillStyle='rgba(122,8,16,.95)';if(i>0)g.fillRect(nx0-8,top,16,2.4);if(i<6)g.fillRect(nx0-8,bot-2.4,16,2.4);g.restore();});
}
function rsFatalFX(c){
 const {f,A,t,time,nx0,hw}=c,tt=A?t:99;
 copRasenganFX(c,true);
 if(A&&tt>=2.1&&tt<RS_CUT+.3){ /* a esfera triturando a barriga: espiral de sangue e luz */
  const cx=nx0-7,cy=GY-38,k=scaleAt(0,1,2.1,RS_CUT,tt);f.globalCompositeOperation='lighter';f.lineCap='round';
  for(let s=0;s<4;s++){f.strokeStyle=`rgba(${180+s*20},${200+s*14},255,${.55})`;f.lineWidth=.5;f.beginPath();for(let q=0;q<=24;q++){const u=q/24,an=time*(14+s*3)+u*8+s*1.6,rr=3+u*(12+26*k);f.lineTo(cx+Math.cos(an)*rr,cy+Math.sin(an)*rr*.9);}f.stroke();}
  f.globalCompositeOperation='source-over';
  for(let i=0;i<26;i++){const r=R(40+i),an=time*9+i*.8,rr=6+r()*(20+20*k),x=cx+Math.cos(an)*rr,y=cy+Math.sin(an)*rr*.8;f.fillStyle=`rgba(${120+(r()*40|0)},8,16,${.85})`;f.beginPath();f.arc(x,y,.5+r()*.8,0,TAU);f.fill();}}
 const a=tt-RS_CUT;if(a<0)return;
 if(A&&a<.6){f.globalCompositeOperation='lighter';const k=a/.6;orb(f,nx0,GY-38,60*(1-k*.5),[[0,`rgba(255,255,255,${.9*(1-k)})`],[.4,`rgba(150,215,255,${.5*(1-k)})`],[1,'rgba(60,120,255,0)']]);ringFX(f,nx0,GY-38,6+90*Math.min(1,k*1.4),2.4*(1-k)+.2,`rgba(220,240,255,${1-k})`);f.globalCompositeOperation='source-over';}
 for(let i=0;i<7;i++){const s=rsState(i,tt),mid=GY+(RSB[i].top<-100?-70:(RSB[i].bot>50?-6:(RSB[i].top+RSB[i].bot)/2));if(A&&a<1.4)bloodSpray(f,nx0+s.dx,mid+s.dy,a*.9,200+i,A?9:0,i%2?1:-1);}
 const pr=Math.min(26,(A?Math.max(0,a-.5):9)*9);if(pr>0){f.fillStyle='rgba(110,6,14,.6)';f.beginPath();f.ellipse(nx0+2,GY+2,pr,pr*.24,0,0,TAU);f.fill();}
}
ANIMS.cop_rasengan.L={g:true,dur:10.2,koAt:9.5,bannerAt:7.9,banner:['螺','FATALITY','Rasengan Copiado','#6fb8ff'],latchT:RS_CUT,
 map:[[0,0],[1.7,1.7],[2.4,2.05],[2.8,2.1],[3.2,2.2],[4.3,2.55],[5.0,2.58],[7.2,3.6],[8.4,4.6],[99,95.2]],
 sX:RSX.filter(k=>k[0]<=2.9).concat([[3.8,96],[99,96]]),
 sP:ANIMS.cop_rasengan.sP.filter(k=>k[0]<=2.1).concat([[2.7,RS_P],[3.2,READY],[3.8,VICTORY],[99,VICTORY]]),
 nP:[[0,N_READY],[1.7,N_READY],[1.85,N_SURP],[2.0,N_GUARD],[2.08,N_GUARD],[2.12,N_DRILL],[2.5,N_DRILL],[99,N_DRILL]],
 nX:[[0,288],[2.08,288],[2.15,291],[99,291]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.7,cx:110,cy:126}],[1.5,{z:1.7,cx:112,cy:126}],[1.8,{z:1.3,cx:190,cy:128}],[2.1,{z:2.0,cx:272,cy:128}],[2.55,{z:2.4,cx:286,cy:124}],[3.0,{z:1.9,cx:286,cy:130}],[3.8,{z:1.6,cx:280,cy:134}],[4.4,{z:1.3,cx:240,cy:126}],[5.2,{z:1.04,cx:192,cy:116}]],
 drawN:c=>rsDrawN(c),
 stat:{nx0:291,sx0:96,nP:N_DRILL},
 env:fenv(5.0,7.2,8.4,9.5,10.2),
 lens:(g,c)=>lensGen(g,c,{streak:[4.3,GY-38],vig:[4.4,5.0,7.4,8.6],fade:[8.8,9.5],spl:[[4.35,.8,.3,52,1],[4.5,.2,.45,40,2],[5.1,.62,.8,36,3]]}),
 fx:c=>rsFatalFX(c),fxStatic:c=>rsFatalFX(c)};
function sfxFatalRS(){
 const M=ANIMS.cop_rasengan.L.map,rh=rawOfGen(M,2.1),rc=rawOfGen(M,RS_CUT);
 tone('sawtooth',180,900,.8,.05,.75,22);nz(.8,'bandpass',500,3000,.1,.75);nz(.4,'bandpass',600,2600,.2,1.65);
 nz(.3,'highpass',3500,9000,.5,rh);tone('sine',120,34,.5,.8,rh);nz(rc-rh,'bandpass',900,2600,.2,rh+.1);tone('sawtooth',300,1400,rc-rh,.06,rh+.1,30);
 nz(.3,'highpass',3500,9000,.7,rc);nz(.6,'lowpass',2200,150,.9,rc);tone('sine',70,26,1.0,.9,rc);[rc+.3,rc+.6,rc+1.0,rc+1.5].forEach(a=>nz(.18,'lowpass',1700,200,.4,a));
 [rc+3.0,rc+3.7,rc+4.4].forEach((a,i)=>{tone('sine',62,38,.2,.45-i*.05,a);tone('sine',58,36,.2,.35-i*.05,a+.26);});}
ANIMS.cop_rasengan.L.sfxFn=sfxFatalRS;
/* ---- Cópia do Kage Bunshin ---- */
const CB_W=Object.assign({},PN_W,{red:1}),CB_D=Object.assign({},PN_D,{red:1}),CB_P=Object.assign({},PN_P,{red:1});
const CB_CL=[{x0:130,r0:1.75,h:2.1},{x0:160,r0:2.2,h:2.55},{x0:190,r0:2.65,h:3.0}];
function cbClones(c,cls,alpha){
 const {t,time}=c;for(const cl of cls){if(t<1.3||t>cl.h+.3)continue;
  const xk=[[0,cl.x0],[cl.r0,cl.x0],[cl.h-.05,256],[cl.h+.4,256]],pk=[[0,READY],[cl.r0-.1,CB_W],[cl.r0+.05,CB_D],[cl.h-.04,CB_D],[cl.h,CB_P],[cl.h+.4,CB_P]];
  const x=interp(xk,t),v=(interp(xk,t+.02)-interp(xk,t-.02))/.04;let P=evalPose(pk,t);P=gait(P,x,1,v,1,time,t<cl.r0-.1,cl.x0*.1);blit(x,GY,false,SASUKE,P,time,{alpha:alpha||.97});}
}
function copBunshinFX(c){
 const {f,A,t,time,nx0}=c;
 for(const cl of CB_CL){puff(f,cl.x0,GY-26,t-1.3,cl.x0);const x=interp([[0,cl.x0],[cl.r0,cl.x0],[cl.h-.05,256],[cl.h+.4,256]],cl.h+.28);puff(f,x,GY-26,t-(cl.h+.28),cl.h*7);
  const a=t-cl.h;if(a>=0&&a<.5){impactFX(f,nx0-8,GY-36-((cl.h*10|0)%3)*6,a,50+(cl.h*10|0),cl.h>2.9);bloodSpray(f,nx0-7,GY-36,a,80+(cl.h*10|0),8,-1);}}
}
ANIMS.cop_bunshin={dur:4.6,hold:3.0,hitT:3.0,dmg:24,cost:15,noLift:true,
 sP:[[0,READY],[.45,READY],[.6,SEAL_A],[.85,SEAL_B],[1.1,SEAL_C],[1.4,READY],[3.4,READY],[4.6,READY]],
 nP:[[0,N_READY],[1.2,N_READY],[1.6,N_SURP],[2.05,N_GUARD],[2.1,N_HIT],[2.4,N_GUARD],[2.55,N_HIT],[2.85,N_GUARD],[3.0,N_UPPER],[3.5,N_UPPER],[3.9,N_STAG],[4.5,N_READY],[4.6,N_READY]],
 nX:[[0,288],[2.05,288],[2.12,293],[2.5,290],[2.57,296],[2.95,292],[3.05,306],[3.6,310],[4.3,290],[4.6,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.5,{z:1.04,cx:192,cy:116}],[.9,{z:1.4,cx:120,cy:126}],[1.5,{z:1.3,cx:200,cy:126}],[2.1,{z:1.5,cx:250,cy:128}],[3.0,{z:1.6,cx:270,cy:128}],[3.9,{z:1.3,cx:240,cy:126}],[4.4,{z:1.04,cx:192,cy:116}],[4.6,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={};for(const cl of CB_CL){const a=t-cl.h;if(a>0&&a<.25)E.shk=Math.max(E.shk||0,2.5*(1-a/.25));}E.dim=.3*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,3.6,4.2,t));return E;},
 drawN:null,
 fx:c=>copBunshinFX(c),clonesFn:c=>cbClones(c,CB_CL)};
/* ---- fatality da cópia do Kage Bunshin: seis clones lançam kunais ao mesmo tempo e o Naruto vira alfineteira ---- */
const CBF_CL=[{x:244,y:0,f:false},{x:262,y:0,f:false},{x:332,y:0,f:true},{x:350,y:0,f:true},{x:270,y:-46,f:false},{x:308,y:-46,f:true}];
const CBF_V=[2.5,2.85,3.2],CBF_FL=.22;
const cbfTgt=n=>{const cl=CBF_CL[n%6],side=cl.f?1:-1;return[side*(1.5+((n*13)%7)),-60+((n*37)%52)];};
const N_STUCK=mk({tilt:0,lean:0,crouch:2,fbx:-5,ffx:5,hxF:2,hyF:10,hxB:1,hyB:10,hdx:0,hdy:1,hr:-.1,expr:3,tw:1,wind:.4});
const N_STUCK2=mk({tilt:-.06,lean:-1,crouch:3,fbx:-5,ffx:5,hxF:1,hyF:11,hxB:0,hyB:11,hdx:-1,hdy:2,hr:-.3,expr:3,tw:1});
function cbfPose(tt){return evalPose(ANIMS.cop_bunshin.L.nP,tt);}
function cbfFX(c){
 const {f,A,g,t,time,nx0,ny0}=c,tt=A?t:99,L=ANIMS.cop_bunshin.L,rot=L.nRot(tt),ang=-rot,pv=[nx0,GY+ny0-30],rp=q=>rotAround(q[0],q[1],pv[0],pv[1],ang);
 /* clones e nuvens de fumaca */
 if(A&&tt>=1.5&&tt<3.9)CBF_CL.forEach((cl,i)=>{const fl=cl.f;const P=evalPose([[0,READY],[1.6,READY],[2.3,KT_W],[2.45,KT_T],[3.3,KT_T],[3.6,READY]],tt);const sh=tt>2.45&&tt<3.5?Math.sin(time*30+i)*.5:0;puff(f,cl.x,GY+cl.y-26,tt-1.5,i*5+1);puff(f,cl.x,GY+cl.y-26,tt-3.7,i*5+2);
  if(tt<3.7)blit(cl.x+sh,GY+cl.y,fl,SASUKE,P,time,{alpha:.96,noRefl:true});});
 /* voos de kunai e kunais cravados */
 for(let n=0;n<18;n++){const v=Math.floor(n/6),cl=CBF_CL[n%6],t0=CBF_V[v],tg=cbfTgt(n),a=tt-t0;if(a<0)continue;
  const tip=[nx0+tg[0],GY+ny0+tg[1]],start=[cl.x+(cl.f?-4:4),GY+cl.y-38+ny0*0],dir=Math.atan2(tip[1]-start[1],tip[0]-start[0]);
  if(a<CBF_FL){const k=a/CBF_FL,p=lerp2(start,tip,k);f.globalCompositeOperation='lighter';f.strokeStyle='rgba(210,230,255,.5)';f.lineWidth=.4;f.beginPath();f.moveTo(p[0]-Math.cos(dir)*10,p[1]-Math.sin(dir)*10);f.lineTo(p[0],p[1]);f.stroke();f.globalCompositeOperation='source-over';drawKunai(f,p[0]-Math.cos(dir)*9,p[1]-Math.sin(dir)*9,dir,.9);}
  else{const q=rp(tip),hx=q[0]-Math.cos(dir+ang)*9,hy=q[1]-Math.sin(dir+ang)*9;drawKunai(f,hx,hy,dir+ang,.9);
   if(A&&a<CBF_FL+.45){const b=a-CBF_FL;f.globalCompositeOperation='lighter';orb(f,q[0],q[1],7*(1-b/.5),[[0,'rgba(255,255,255,.7)'],[1,'rgba(200,220,255,0)']]);f.globalCompositeOperation='source-over';bloodSpray(f,q[0],q[1],b,90+n,6,cl.f?1:-1);}}}
 const last=CBF_V[2]+CBF_FL;
 if(tt>last+.1){const base=rp([nx0-3,GY+ny0-40]);for(let i=0;i<5;i++){const ph=((time*.5+i*.23)%1),p0=rp([nx0+(i-2)*2.4,GY+ny0-44+i*3]),p1=rp([nx0+(i-2)*2.5,GY+ny0-4]);f.strokeStyle='rgba(135,8,16,.85)';f.lineWidth=.8;f.lineCap='round';f.beginPath();f.moveTo(p0[0],p0[1]);f.lineTo(p0[0]+(p1[0]-p0[0])*ph,p0[1]+(p1[1]-p0[1])*ph);f.stroke();}
  const pr=Math.min(14,(A?tt-last-.1:99)*5);if(pr>0){f.fillStyle='rgba(110,6,14,.55)';f.beginPath();f.ellipse(nx0+3,GY+2,pr,pr*.24,0,0,TAU);f.fill();}}
}
ANIMS.cop_bunshin.L={g:true,dur:9.6,koAt:9.0,bannerAt:7.4,banner:['影','FATALITY','Kage Bunshin Copiado','#ffa43a'],latchT:3.3,
 map:[[0,0],[2.3,2.3],[2.5,2.5],[4.9,3.7],[6.3,4.5],[8.0,5.6],[99,97.0]],
 sP:[[0,READY],[.45,READY],[.6,SEAL_A],[.85,SEAL_B],[1.1,SEAL_C],[1.4,READY],[3.6,READY],[4.6,VICTORY],[99,VICTORY]],
 nP:[[0,N_READY],[1.2,N_READY],[1.6,N_SURP],[2.3,N_GUARD],[2.5,N_STUCK],[3.6,N_STUCK],[4.3,N_STUCK2],[99,N_STUCK2]],
 nX:[[0,288],[99,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.5,{z:1.04,cx:192,cy:116}],[.9,{z:1.4,cx:120,cy:126}],[1.5,{z:1.3,cx:200,cy:126}],[2.1,{z:1.5,cx:260,cy:128}],[2.6,{z:2.0,cx:290,cy:124}],[3.3,{z:2.3,cx:290,cy:124}],[3.9,{z:1.7,cx:290,cy:128}],[4.6,{z:1.5,cx:288,cy:140}],[5.4,{z:1.3,cx:250,cy:128}],[6.2,{z:1.04,cx:192,cy:116}]],
 nRot:t=>{const k=scaleAt(0,1,4.3,5.1,t);return -1.45*k*k;},
 nY:t=>{const k=scaleAt(0,1,4.3,5.1,t);return 32*k*k;},
 stat:{nx0:288,nP:N_STUCK2},
 env:(raw,t)=>{const E={};for(const v of CBF_V){const d=t-v-CBF_FL;if(d>0&&d<.3)E.shk=Math.max(E.shk||0,5*(1-d/.3));if(d>=0&&d<.04&&v===CBF_V[2])E.flash=.7;}
  E.dim=.45*scaleAt(0,1,.4,.85,t)*(1-.4*scaleAt(0,1,6.0,7.0,raw)-.6*scaleAt(0,1,8.3,9.0,raw));E.bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,8.3,9.0,raw));
  const tr=scaleAt(0,1,3.3,3.9,t)*(1-scaleAt(0,1,5.0,5.6,t));if(tr>0)E.tint=`rgba(110,6,18,${.18*tr})`;return E;},
 lens:(g,c)=>lensGen(g,c,{vig:[4.0,4.6,6.4,7.6],fade:[7.8,8.4],spl:[[4.1,.8,.3,52,1],[4.3,.2,.5,40,2],[4.9,.62,.8,36,3]]}),
 fx:c=>cbfFX(c),fxStatic:c=>cbfFX(c)};
function sfxFatalCB(){
 const M=ANIMS.cop_bunshin.L.map;
 [.6,.85,1.1].forEach(a=>nz(.1,'bandpass',2000,1000,.1,a));nz(.4,'bandpass',500,2400,.2,1.3);
 CBF_V.forEach((v,i)=>{const r=rawOfGen(M,v);nz(.16,'highpass',3000,8000,.3,r);[0,1,2,3,4,5].forEach(j=>{const rr=rawOfGen(M,v+CBF_FL);nz(.07,'bandpass',1500,600,.3,rr+j*.02);tone('sine',140,60,.15,.3,rr+j*.02);});});
 [rawOfGen(M,4.3)].forEach(a=>{tone('sine',85,30,.6,.7,rawOfGen(M,5.0));nz(.45,'lowpass',1600,150,.6,rawOfGen(M,5.0));});
 [6.2,6.9,7.6].forEach((a,i)=>{tone('sine',62,38,.2,.45-i*.05,a);tone('sine',58,36,.2,.35-i*.05,a+.26);});}
ANIMS.cop_bunshin.L.sfxFn=sfxFatalCB;
/* ---- Selo Amaldicoado (Nivel 1): o selo se espalha, deixando o Sasuke mais forte e rapido (sem Chidori roxo) ---- */
const SEL_S=mk({tilt:.04,crouch:5,lean:1,fbx:-8,ffx:7,hxF:6,hyF:8,hxB:5,hyB:8,hr:.04,hdy:1,expr:2,tw:.92,red:1});
function seloAtivaFX(c){
 const {f,A,t,time,fr,sx0,sy0,rS}=c,[ex,ey]=eyePos(sx0,sy0,rS),on=scaleAt(0,1,.8,2.0,t);
 if(t>.6&&t<2.1){const k=scaleAt(0,1,.6,1.0,t);f.fillStyle='rgba(6,4,12,.55)';for(let i=0;i<14;i++){const r=R(500+i),ph=((time*.8+i*.137)%1),x=sx0+(r()-.5)*22*(1+ph),y=GY-8-ph*60*(.6+r()*.6);f.beginPath();f.ellipse(x,y,1+r()*1.8,1.8+r()*3*ph,0,0,TAU);f.globalAlpha=(1-ph)*.7*k;f.fill();}f.globalAlpha=1;}
 curseAura(f,sx0,.55*on*(1-scaleAt(0,1,2.7,3.2,t)),time,fr);
 f.globalCompositeOperation='lighter';orb(f,ex+1.5,ey,4.5*scaleAt(0,1,.8,1.4,t),[[0,'rgba(255,50,60,.55)'],[1,'rgba(160,10,30,0)']]);f.globalCompositeOperation='source-over';
 const a=t-2.0;if(a>=0&&a<.7){const k=a/.7;f.globalCompositeOperation='lighter';ringFX(f,sx0,GY-34,8+60*k,2*(1-k)+.2,`rgba(200,200,215,${1-k})`);ringFX(f,sx0,GY-34,(8+60*k)*.7,1.2*(1-k)+.2,`rgba(255,80,90,${(1-k)*.7})`);f.globalCompositeOperation='source-over';
  f.strokeStyle=`rgba(210,210,225,${1-k})`;f.lineWidth=.5;f.lineCap='round';for(let i=0;i<14;i++){const an=i*TAU/14,r0=10+a*80,r1=r0+8+((i*37)%12);f.beginPath();f.moveTo(sx0+Math.cos(an)*r0,GY-34+Math.sin(an)*r0*.9);f.lineTo(sx0+Math.cos(an)*r1,GY-34+Math.sin(an)*r1*.9);f.stroke();}}
}
ANIMS.selo={dur:3.6,hold:2.0,hitT:2.0,dmg:0,cost:20,noLift:true,
 sP:[[0,READY],[.4,READY],[.6,SEL_N],[1.9,SEL_N],[2.05,SEL_B],[2.5,SEL_B],[3.0,SEL_S],[3.6,SEL_S]],
 nP:[[0,N_READY],[1.4,N_READY],[1.7,N_SURP],[2.6,N_SURP],[3.1,N_READY],[3.6,N_READY]],
 nX:[[0,288],[3.6,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:2.5,cx:104,cy:124}],[1.9,{z:2.7,cx:104,cy:124}],[2.1,{z:1.7,cx:112,cy:126}],[2.9,{z:1.4,cx:130,cy:128}],[3.4,{z:1.04,cx:192,cy:116}],[3.6,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={},a=t-2.0;if(a>0&&a<.9)E.shk=4*(1-a/.9);if(t>.9&&t<1.9)E.shk=Math.max(E.shk||0,1.4);if(a>=0&&a<.05)E.flash=.35;E.dim=.4*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,2.6,3.2,t));E.tint=`rgba(12,10,22,${.3*scaleAt(0,1,.6,1.2,t)*(1-scaleAt(0,1,2.6,3.2,t))})`;return E;},
 fx:c=>seloAtivaFX(c)};
const SEL_ROAR=mk({tilt:-.15,crouch:4,lean:-1,fbx:-9,ffx:7,hxF:-7,hyF:-8,hxB:-9,hyB:-8,hr:-.25,expr:2,red:1,tw:.95,wind:1,scream:1});
function selo2FX(c){const {f,t,time,fr,sx0,sy0,rS}=c,on=scaleAt(0,1,1.0,2.4,t),[ex,ey]=eyePos(sx0,sy0,rS);
 if(t>.6&&t<3.4){const k=scaleAt(0,1,.6,1.0,t);f.fillStyle='rgba(6,4,12,.6)';for(let i=0;i<16;i++){const r=R(500+i),ph=((time*.8+i*.137)%1),x=sx0+(r()-.5)*24*(1+ph),y=GY-8-ph*66*(.6+r()*.6);f.beginPath();f.ellipse(x,y,1+r()*1.8,1.8+r()*3*ph,0,0,TAU);f.globalAlpha=(1-ph)*.7*k;f.fill();}f.globalAlpha=1;}
 if(t>1.0&&t<3.1){const r2=R(fr*5+11);let L=[];const n=Math.round(5+11*on);for(let i=0;i<n;i++)L.push(...boltLines(sx0+(r2()-.5)*10,GY-36+(r2()-.5)*44,r2()*TAU,8+r2()*(12+22*on),fr*7+i,true));darkBolts(f,L,.8);}
 curseAura2(f,sx0,.95*on*(1-.45*scaleAt(0,1,3.6,4.4,t)),time,fr);
 f.globalCompositeOperation='lighter';orb(f,ex+1.5,ey,5*scaleAt(0,1,.8,1.4,t),[[0,'rgba(255,50,60,.6)'],[1,'rgba(160,10,30,0)']]);f.globalCompositeOperation='source-over';
 const a=t-2.4;if(a>=0&&a<1.0){const k=a/1.0;f.globalCompositeOperation='lighter';orb(f,sx0,GY-40,70*(1-k*.6),[[0,'rgba(220,190,255,'+(.6*(1-k))+')'],[.4,'rgba(130,60,240,'+(.35*(1-k))+')'],[1,'rgba(40,10,100,0)']]);
  for(let q=0;q<3;q++){const kk=clamp(k*1.3-q*.12,0,1);ringFX(f,sx0,GY-34,8+90*kk,2.4*(1-kk)+.2,'rgba('+(q?'120,60,220':'210,190,255')+','+(1-kk)+')');}
  f.strokeStyle='rgba(200,160,255,'+(1-k)+')';f.lineWidth=.55;f.lineCap='round';for(let i=0;i<18;i++){const an=i*TAU/18,r0=12+a*100,r1=r0+10+((i*37)%16);f.beginPath();f.moveTo(sx0+Math.cos(an)*r0,GY-34+Math.sin(an)*r0*.9);f.lineTo(sx0+Math.cos(an)*r1,GY-34+Math.sin(an)*r1*.9);f.stroke();}f.globalCompositeOperation='source-over';}
}
ANIMS.selo2={dur:4.8,hold:2.4,hitT:2.4,dmg:0,cost:40,noLift:true,
 sP:[[0,READY],[.4,READY],[.6,SEL_N],[2.3,SEL_N],[2.45,SEL_ROAR],[3.3,SEL_ROAR],[3.8,SEL_S],[4.8,SEL_S]],
 nP:[[0,N_READY],[1.3,N_READY],[1.8,N_SURP],[2.8,N_SURP],[3.4,N_GUARD],[4.8,N_GUARD]],
 nX:[[0,288],[4.8,288]],
 cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:2.5,cx:104,cy:124}],[2.3,{z:2.8,cx:104,cy:122}],[2.5,{z:1.5,cx:100,cy:116}],[3.4,{z:1.5,cx:100,cy:116}],[4.2,{z:1.04,cx:192,cy:116}],[4.8,{z:1.04,cx:192,cy:116}]],
 env:(raw,t)=>{const E={},a=t-2.4;if(a>0&&a<1.1)E.shk=8*(1-a/1.1);if(t>1.0&&t<2.3)E.shk=Math.max(E.shk||0,1.8);if(a>=0&&a<.05)E.flash=.6;
  E.dim=.45*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,3.6,4.4,t));E.tint='rgba(30,10,60,'+(.34*scaleAt(0,1,.6,1.2,t)*(1-scaleAt(0,1,3.6,4.4,t)))+')';E.bars=14*scaleAt(0,1,.4,.8,t)*(1-scaleAt(0,1,4.0,4.6,t));return E;},
 fx:c=>selo2FX(c)};
ANIMS.rasengan={enemy:true,dur:4.6,hold:2.2,hitT:2.2,hits:[{t:2.2,dmg:30}],cost:30,
  sP:[[0,READY],[.45,READY],[1.7,READY],[1.95,S_GUARD],[2.15,S_GUARD],[2.2,S_HIT],[2.9,S_HIT],[3.3,S_STAG],[3.9,READY],[4.6,READY]],
  nP:[[0,N_READY],[.55,N_READY],[.7,N_RAS_WIND],[1.55,N_RAS_WIND],[1.65,N_RAS_DASH],[2.05,N_RAS_DASH],[2.15,N_RAS_HIT],[2.9,N_RAS_HIT],[3.28,N_RAS_HIT],[3.32,N_READY],[4.6,N_READY]],
  sX:[[0,96],[2.15,96],[2.2,96],[2.55,48],[3.4,40],[4.2,96]],sArc:[2.2,2.7,16],sSpin:[2.22,2.7,-1],
  tpN:[3.3],nX:[[0,288],[1.6,288],[1.75,270],[2.1,130],[2.9,130],[3.29,130],[3.31,288],[4.6,288]],
  cam:[[0,{z:1.04,cx:192,cy:116}],[.5,{z:1.04,cx:192,cy:116}],[.8,{z:1.6,cx:268,cy:130}],[1.5,{z:1.7,cx:272,cy:130}],[1.7,{z:1.4,cx:210,cy:130}],[2.05,{z:1.5,cx:122,cy:130}],[2.2,{z:1.75,cx:112,cy:130}],[3.0,{z:1.4,cx:90,cy:130}],[3.9,{z:1.04,cx:192,cy:116}],[4.6,{z:1.04,cx:192,cy:116}]]};
/* ---- Naruto Uzumaki Rendan: quatro clones chutam o Sasuke para o alto ("U! ZU! MA! KI!") e o Naruto de verdade desce com o calcanhar ---- */
const N_UPKICK=mk({tilt:-.14,crouch:2,lean:-1,fbx:-7,ffx:17,ffy:-17,hxF:-5,hyF:5,hxB:10,hyB:-3,hr:.12,expr:2,tw:.9,wind:.6});
const UZK=[1.6,1.85,2.1,2.35],UZ_SLAM=2.95;
const uzSY=t=>interp([[0,0],[1.6,0],[1.72,-17],[1.85,-20],[1.97,-36],[2.1,-39],[2.22,-55],[2.35,-58],[2.6,-72],[2.78,-74],[UZ_SLAM,0],[99,0]],t);
ANIMS.uzumaki={enemy:true,dur:4.6,hold:UZ_SLAM,hitT:UZ_SLAM,hits:UZK.map(t=>({t,dmg:6})).concat([{t:UZ_SLAM,dmg:16}]),cost:35,noLift:true,
  sP:[[0,READY],[1.5,READY],[1.6,S_HIT],[1.85,S_FLINCH],[2.1,S_HIT],[2.35,S_FLINCH],[2.9,S_HIT],[UZ_SLAM,S_HIT],[3.5,S_STAG],[4.2,READY],[4.6,READY]],
  sX:[[0,96],[99,96]],sYf:uzSY,sSpin:[1.62,2.75,-2],
  nP:[[0,N_READY],[.5,N_READY],[.6,N_SEAL],[1.0,N_SEAL],[1.1,N_READY],[2.3,N_READY],[2.38,N_COIL],[2.5,N_UPKICK],[2.85,N_UPKICK],[UZ_SLAM,N_PUNCH],[3.6,N_PUNCH],[3.68,N_READY],[4.6,N_READY]],
  tpN:[3.7],nX:[[0,288],[2.36,288],[2.6,114],[UZ_SLAM,118],[3.69,120],[3.71,288],[4.6,288]],
  nYf:t=>interp([[0,0],[2.36,0],[2.6,-98],[2.82,-94],[UZ_SLAM,-4],[3.0,0],[99,0]],t),
  cam:[[0,{z:1.04,cx:192,cy:116}],[.45,{z:1.04,cx:192,cy:116}],[.7,{z:1.5,cx:262,cy:128}],[1.1,{z:1.3,cx:180,cy:126}],[1.5,{z:1.6,cx:116,cy:124}],[1.9,{z:1.4,cx:110,cy:108}],[2.3,{z:1.25,cx:112,cy:94}],[2.75,{z:1.25,cx:112,cy:92}],[UZ_SLAM,{z:1.7,cx:108,cy:130}],[3.6,{z:1.5,cx:120,cy:126}],[4.2,{z:1.04,cx:192,cy:116}],[4.6,{z:1.04,cx:192,cy:116}]]};
/* fatality do Uzumaki Rendan: o calcanhar crava o Sasuke no chao, abre uma cratera com rachaduras e sangue, e o Naruto diz a frase dele */
ANIMS.uzumaki.LR={dur:9.6,koAt:8.8,bannerAt:7.9,speakAt:6.1,line:'Esse é o meu jeito ninja!',speechPos:['44%','14%'],banner:['連弾','FATALITY','Uzumaki Rendan','#ff7a2a'],
 map:[[0,0],[2.85,2.85],[3.35,2.98],[4.7,3.5],[99,97.8]],
 sP:ANIMS.uzumaki.sP.filter(k=>k[0]<=2.8).concat([[2.94,S_HIT],[3.02,S_DOWN],[99,S_DOWN]]),sX:[[0,96],[99,96]],
 nP:ANIMS.uzumaki.nP.filter(k=>k[0]<=2.85).concat([[UZ_SLAM,N_PUNCH],[3.4,N_PUNCH],[3.6,N_READY],[4.4,N_VICT],[99,N_VICT]]),
 nX:[[0,288],[2.36,288],[2.6,114],[UZ_SLAM,112],[3.4,112],[3.8,156],[99,156]],
 cam:ANIMS.uzumaki.cam.filter(k=>k[0]<=2.8).concat([[UZ_SLAM,{z:2.0,cx:104,cy:140}],[3.5,{z:2.3,cx:98,cy:148}],[4.3,{z:1.9,cx:110,cy:144}],[4.7,{z:2.3,cx:150,cy:124}],[6.6,{z:2.4,cx:152,cy:122}],[7.2,{z:1.04,cx:192,cy:116}],[99,{z:1.04,cx:192,cy:116}]])};
function drawCrater(c,x,k){if(k<=0)return;const w=24*k,h=4*k;c.save(); /* cratera em pixels: buraco escuro, borda de terra levantada e rachaduras */
 c.fillStyle='#120a1e';pxDisc(c,x,GY+1,0);c.beginPath();c.ellipse(x,GY+1.5,w,h,0,0,TAU);c.fill();
 c.fillStyle='#6a5a80';for(let i=-w;i<=w;i+=1.6){const yy=GY+1.5-h*Math.sqrt(Math.max(0,1-(i/w)**2));c.fillRect(Math.round(x+i),Math.round(yy)-1,2,1);}
 c.strokeStyle='#0a0612';c.lineWidth=.6;const r=R(55);for(let i=0;i<9;i++){const an=(i/9)*Math.PI+(r()-.5)*.3,l=(16+r()*22)*k;c.beginPath();let px=x+Math.cos(an)*w*.9*(i%2?1:-1),py=GY+1.5;c.moveTo(px,py);for(let j=0;j<3;j++){px+=Math.cos(an)*(i%2?1:-1)*l/3+(r()-.5)*3;py+=(r()-.3)*1.2;c.lineTo(px,py);}c.stroke();}
 c.fillStyle='rgba(150,12,22,.85)';c.beginPath();c.ellipse(x-2,GY+1.5,w*.6,h*.7,0,0,TAU);c.fill();c.restore();}
function uzFatalFX(f,t,sx0){const a=t-UZ_SLAM;if(a<0)return;const cy=GY-6;
 if(a<1.4){bloodSpray(f,sx0,cy,a*.9,81,60,0);bloodSpray(f,sx0-6,cy-4,a,82,40,-1);bloodSpray(f,sx0+6,cy-4,a,83,40,1);
  scraps(f,sx0,GY-2,a,84,26,[[80,70,96],[58,46,74],[110,96,120],[150,16,24]],0);}
 if(a<.35){f.save();f.globalCompositeOperation='lighter';const k=a/.35;ringFX(f,sx0,GY,6+70*k,2.4*(1-k)+.2,`rgba(255,230,200,${1-k})`);f.restore();}
}
/* poeira da cratera no canvas principal (sem bloom), cinza e para os lados, sem tampar o corpo */
function uzDust(g,t,sx0){const a=t-UZ_SLAM;if(a<0||a>1.6)return;const k=Math.min(1,a/.25),fade=1-Math.max(0,(a-.5)/1.1);g.save();g.globalAlpha=.5*fade;
 for(let i=0;i<12;i++){const r=R(90+i),side=i%2?1:-1,dx=side*(14+r()*30)*k,up=(2+r()*14)*k;g.fillStyle=i%3?'#5a5068':'#7a7088';pxDisc(g,sx0+dx,GY-up,(4+r()*5)*(.5+k*.6));}g.restore();}
/* os clones: surgem em fumaca, correm ate o Sasuke e cada um salta e chuta para cima na altura em que ele esta; depois somem */
function uzClones(t,time){if(t<1.0||t>2.7)return;UZK.forEach((kt,i)=>{const x0=146+i*24,v0=t-1.0;if(t>kt+.22)return;
 const hb=uzSY(kt-.01),x=interp([[0,x0],[1.15,x0],[kt-.18,112],[kt+.3,110]],t),y=interp([[0,0],[kt-.16,0],[kt-.02,hb+6],[kt+.22,hb-8]],t);
 const P=evalPose([[0,N_READY],[1.15,N_READY],[1.2,N_DASHP],[kt-.16,N_DASHP],[kt-.06,N_UPKICK],[kt+.3,N_UPKICK]],t);
 blit(x,GY+y,true,NARUTO,P,time,{alpha:.97,vel:(interp([[0,x0],[1.15,x0],[kt-.18,112]],t+.02)-interp([[0,x0],[1.15,x0],[kt-.18,112]],t-.02))/.04});});
 UZK.forEach((kt,i)=>{puff(g,146+i*24,GY-24,t-1.0,i+21);puff(g,110,GY+uzSY(kt-.01)-18,t-(kt+.2),i+31);});}
/* ---- Oiroke no Jutsu: o Naruto vira uma garota (coberta por nuvens de fumaca) para desconcentrar o Sasuke; sem dano ---- */
const OIR_ON=1.25,OIR_OFF=3.3;
ANIMS.oiroke={enemy:true,dur:4.2,hold:OIR_ON,hitT:OIR_ON,hits:[],cost:10,noLift:true,
  sP:[[0,READY],[2.6,READY],[2.75,S_FLINCH],[3.2,S_FLINCH],[3.6,READY],[4.2,READY]],sX:[[0,96],[99,96]],
  nP:[[0,N_READY],[.45,N_READY],[.55,N_SEAL],[1.15,N_SEAL],[1.25,N_READY],[4.2,N_READY]],nX:[[0,288],[99,288]],
  cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.6,cx:268,cy:128}],[1.3,{z:2.4,cx:284,cy:126}],[2.45,{z:2.5,cx:284,cy:124}],[2.7,{z:2.4,cx:100,cy:124}],[3.4,{z:2.3,cx:102,cy:124}],[3.9,{z:1.04,cx:192,cy:116}],[4.2,{z:1.04,cx:192,cy:116}]]};
/* ---- Harem no Jutsu: Oiroke + Kage Bunshin. Varias garotas (cobertas por fumaca) cercam o Sasuke; quase sempre ele cai na distracao ---- */
const HAR_X=[150,178,206,234,262,288];
ANIMS.harem={enemy:true,dur:5.4,hold:OIR_ON,hitT:OIR_ON,hits:[],cost:20,noLift:true,
  sP:[[0,READY],[2.9,READY],[3.05,S_STAG],[3.6,S_STAG],[4.0,READY],[4.6,READY]],sX:[[0,96],[2.9,96],[3.15,84],[99,84]],
  nP:[[0,N_READY],[.45,N_READY],[.55,N_SEAL],[1.15,N_SEAL],[1.25,N_READY],[4.6,N_READY]],nX:[[0,288],[99,288]],
  cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.7,{z:1.4,cx:250,cy:126}],[1.4,{z:1.15,cx:210,cy:120}],[2.6,{z:1.2,cx:200,cy:120}],[2.95,{z:1.6,cx:110,cy:122}],[3.3,{z:1.25,cx:120,cy:110}],[4.3,{z:1.15,cx:150,cy:116}],[4.9,{z:1.04,cx:192,cy:116}],[5.4,{z:1.04,cx:192,cy:116}]]};
/* com a distracao, o Sasuke e lancado para fora da tela num jato de sangue do nariz, girando, e volta depois numa nuvem de fumaca */
const HAR_FLY=t=>{const a=t-3.0;if(a<0)return null;if(a<.9){const k=a/.9;return {x:96-k*230,y:-Math.sin(Math.min(1,k*1.4)*Math.PI*.5)*120+k*k*30,rot:-k*TAU*2.5,out:false};}if(t<4.5)return {x:-400,y:0,rot:0,out:true};return {x:96,y:0,rot:0,out:false};};
function haremClones(t,time){if(t<OIR_ON||t>OIR_OFF+.3)return;HAR_X.slice(0,5).forEach((x0,i)=>{const x=x0-6*Math.min(1,(t-OIR_ON)/1.2)*(1+i*.1),P=Object.assign({},N_READY,{crouch:2+Math.sin(time*4+i)*1.2});blit(x,GY,true,NARUTO,P,time,{sexy:true,alpha:.97});});}
/* ---- Uzumaki Naruto Kamikaze: o Naruto gira como um tornado com tres clones em volta e atravessa o Sasuke varias vezes ---- */
const KM_IN=1.45,KM_HITS=[1.8,2.0,2.2,2.4],KM_END=2.65,KM_OUT=3.3;
ANIMS.kamikaze={enemy:true,dur:4.4,hold:KM_END,hitT:KM_END,hits:KM_HITS.map(t=>({t,dmg:5})).concat([{t:KM_END,dmg:14}]),cost:30,noLift:true,
  sP:[[0,READY],[1.7,READY],[1.8,S_FLINCH],[2.0,S_HIT],[2.2,S_FLINCH],[2.4,S_HIT],[KM_END,S_HIT],[3.3,S_STAG],[3.9,READY],[4.4,READY]],
  sX:[[0,96],[1.75,96],[2.45,90],[KM_END,86],[3.1,66],[3.9,96],[4.4,96]],
  nP:[[0,N_READY],[.45,N_READY],[.55,N_SEAL],[1.0,N_SEAL],[1.1,N_READY],[1.3,N_COIL],[1.45,N_DASHP],[KM_OUT,N_DASHP],[KM_OUT+.1,N_READY],[4.4,N_READY]],
  tpN:[3.4],nX:[[0,288],[KM_IN,288],[1.75,122],[2.45,118],[KM_END,112],[3.39,120],[3.41,288],[4.4,288]],
  cam:[[0,{z:1.04,cx:192,cy:116}],[.45,{z:1.04,cx:192,cy:116}],[.7,{z:1.5,cx:268,cy:126}],[1.3,{z:1.4,cx:240,cy:124}],[1.75,{z:1.7,cx:112,cy:126}],[2.5,{z:1.8,cx:108,cy:126}],[KM_END,{z:2.0,cx:100,cy:128}],[3.3,{z:1.4,cx:110,cy:124}],[3.9,{z:1.04,cx:192,cy:116}],[4.4,{z:1.04,cx:192,cy:116}]]};
const KM_SPIN=t=>t>=KM_IN&&t<((anim&&anim.lethal&&anim.type==='kamikaze')||window.__LETHE==='kamikaze'?4.3:KM_OUT); /* no fatality o tornado continua ate arremessar o Sasuke */
/* tornado em pixels: faixas de vento em espiral, rastro laranja das roupas e poeira no chao */
function kmTornado(g,t,time,x){if(!KM_SPIN(t))return;const kEnd=(anim&&anim.lethal&&anim.type==='kamikaze')||window.__LETHE==='kamikaze'?4.3:KM_OUT,k=Math.min(1,(t-KM_IN)/.15)*(1-Math.max(0,(t-(kEnd-.2))/.2));g.save();g.globalAlpha=k;
 for(let i=0;i<150;i++){const h=i/150,ang=time*26+i*.7,rx=12+h*18,py=GY-2-h*62+Math.sin(ang)*3;for(let j=0;j<4;j++){const aj=ang-j*.12;if(Math.sin(aj)<-.3)continue;const px=x+Math.cos(aj)*rx;g.fillStyle=j===0?(i%6===0?'#ffb347':'#ffffff'):j<3?'#bfe2ff':'#6aa6e8';g.fillRect(Math.round(px),Math.round(py),2,1);}}
 for(let i=0;i<10;i++){const r=R(i+900),a=(time*1.6+r())%1;g.fillStyle=`rgba(150,140,170,${.5*(1-a)})`;pxDisc(g,x+(r()-.5)*40*(1+a),GY-2-a*6,2+a*4);}
 g.restore();}
/* tres clones girando em volta dele (os que ficam atras sao desenhados antes) */
function kmClones(t,time,x,front){if(!KM_SPIN(t))return;for(let i=0;i<3;i++){const ang=time*22+i*TAU/3,sn=Math.sin(ang);if((sn>0)!==front)continue;
 const P=i%2?N_UPKICK:N_DASHP;blit(x+Math.cos(ang)*16,GY-2,Math.cos(ang*2)>0,NARUTO,P,time,{alpha:.92,noRefl:true});}}
/* fatality: o tornado puxa o Sasuke para dentro, gira ele no ar rasgando a roupa num redemoinho de sangue e o arremessa no chao */
const KMF_UP=KM_END,KMF_DROP=4.3;
const kmFatY=t=>t<KMF_UP?0:t<KMF_DROP?-interp([[KMF_UP,0],[KMF_UP+.5,62],[KMF_DROP-.2,70],[KMF_DROP,64]],t):interp([[KMF_DROP,-64],[KMF_DROP+.22,0],[99,0]],t);
ANIMS.kamikaze.LR={dur:9.8,koAt:9.1,bannerAt:8.2,speakAt:6.4,line:'Ninguém me para, dattebayo!',speechPos:['44%','14%'],banner:['神風','FATALITY','Uzumaki Naruto Kamikaze','#ffb347'],
 map:[[0,0],[KM_END,KM_END],[KMF_DROP+.4,KMF_DROP+.4],[99,99]],
 sP:ANIMS.kamikaze.sP.filter(k=>k[0]<=KM_END).concat([[KM_END+.1,S_HIT],[KMF_DROP,S_HIT],[KMF_DROP+.22,S_DOWN],[99,S_DOWN]]),
 sX:[[0,96],[1.75,96],[2.45,90],[KM_END,100],[KMF_DROP,104],[99,104]],
 nP:ANIMS.kamikaze.nP.filter(k=>k[0]<=KM_END).concat([[KMF_DROP,N_DASHP],[KMF_DROP+.15,N_READY],[5.6,N_READY],[6.2,N_VICT],[99,N_VICT]]),
 nX:[[0,288],[KM_IN,288],[1.75,122],[2.45,118],[KM_END,104],[KMF_DROP,104],[KMF_DROP+.5,150],[99,150]],
 cam:ANIMS.kamikaze.cam.filter(k=>k[0]<=KM_END).concat([[KM_END+.4,{z:1.5,cx:104,cy:100}],[KMF_DROP-.1,{z:1.5,cx:104,cy:98}],[KMF_DROP+.15,{z:2.0,cx:104,cy:136}],[5.2,{z:2.0,cx:110,cy:138}],[5.8,{z:2.3,cx:152,cy:124}],[7.6,{z:2.4,cx:152,cy:122}],[8.2,{z:1.04,cx:192,cy:116}],[99,{z:1.04,cx:192,cy:116}]])};
const LKM=type=>type==='kamikaze'&&LE(type);
function kmFatalFX(f,t,sx0,sy0){const a=t-KMF_UP;if(a<0)return;
 if(t<KMF_DROP){for(let i=0;i<40;i++){const tb=KMF_UP+i*.04;if(tb>t)break;const ag=t-tb;if(ag>.6)continue;const ang=tb*30,r=R(i+1200);f.fillStyle=r()<.5?'#d4202e':'#9a0f1c';f.fillRect(Math.round(sx0+Math.cos(ang)*(8+ag*40)),Math.round(GY+sy0-30+Math.sin(ang)*6-ag*20+ag*ag*60),2,2);}
  scraps(f,sx0,GY+sy0-30,(a%1),130+Math.floor(a),8,[[42,79,184],[30,50,130],[200,196,170]],0);}
 const d=t-KMF_DROP;if(d>=0&&d<1.4){bloodSpray(f,sx0,GY-8,d,141,60,0);scraps(f,sx0,GY-4,d,142,16,[[90,80,100],[150,16,24],[42,79,184]],0);if(d<.3){f.save();f.globalCompositeOperation='lighter';const k=d/.3;ringFX(f,sx0,GY,6+56*k,2*(1-k)+.2,`rgba(255,230,200,${1-k})`);f.restore();}}
 if(t>KMF_DROP+.3&&t<8){const pr=Math.min(16,(t-KMF_DROP-.3)*4);f.fillStyle='rgba(110,6,14,.6)';f.beginPath();f.ellipse(sx0,GY+2,pr,pr*.24,0,0,TAU);f.fill();}}
/* ---- Kuchiyose no Jutsu: o Naruto morde o polegar, bate a mao no chao (com o chakra vermelho da Kurama) e invoca o Gama Bunta,
   que dispara a bala de agua (Suiton: Teppodama) no Sasuke e some numa nuvem de fumaca ---- */
let BUNTA=null;if(typeof gamaBunta==='function'){const gr=gamaBunta(),c=document.createElement('canvas');gr.draw(c,BUNTA_PAL,1);BUNTA={c,w:gr.w,h:gr.h};}
const KU_SLAM=1.3,KU_IN=1.55,KU_FIRE=2.9,KU_HIT=3.3,KU_OUT=4.3,KU_BX=292,KU_NX=KU_BX-48,KU_NY=-96,KU_NS=.42,KU_BS=1.2; /* o sapo e gigante: 120% do sprite, bem maior que o Sasuke */
ANIMS.kuchiyose={enemy:true,dur:5.4,hold:KU_HIT,hitT:KU_HIT,hits:[{t:KU_HIT,dmg:20}],cost:50,noLift:true,
  sP:[[0,READY],[2.8,READY],[3.0,S_GUARD],[3.25,S_GUARD],[KU_HIT,S_HIT],[3.9,S_HIT],[4.3,S_STAG],[4.9,READY],[5.4,READY]],
  sX:[[0,96],[KU_HIT,96],[3.7,58],[4.4,58],[5.0,96],[5.4,96]],
  nP:[[0,N_READY],[.4,N_READY],[.5,N_SEAL],[1.1,N_SEAL],[1.2,N_COIL],[KU_SLAM,N_COIL],[1.5,N_COIL],[1.6,N_READY],[5.4,N_READY]],
  nX:[[0,288],[1.5,288],[1.51,KU_NX],[99,KU_NX]],
  nYf:t=>t<1.5?0:KU_NY,
  cam:[[0,{z:1.04,cx:192,cy:116}],[.4,{z:1.04,cx:192,cy:116}],[.6,{z:1.8,cx:282,cy:130}],[1.2,{z:2.0,cx:286,cy:140}],[KU_SLAM+.1,{z:1.5,cx:270,cy:130}],[KU_IN+.2,{z:1.0,cx:192,cy:108}],[2.6,{z:1.0,cx:192,cy:108}],[KU_HIT,{z:1.2,cx:150,cy:120}],[3.9,{z:1.1,cx:170,cy:112}],[4.7,{z:1.04,cx:192,cy:116}],[5.4,{z:1.04,cx:192,cy:116}]]};
/* o sapo: entra e sai em fumaca, respira devagar e solta fumaca do cachimbo; olha para a esquerda (para o Sasuke) */
function drawBunta(g,time,al,inh,hit,open){if(!BUNTA||al<=0)return;hit=hit||0;open=open||0;const br=Math.sin(time*2)*.6+(inh||0)*7,shx=hit*Math.sin(time*70)*3+hit*3+bOff.x;
 g.fillStyle='rgba(2,6,20,.5)';g.beginPath();g.ellipse(KU_BX-8+bOff.x,GY+1,84*(1-Math.min(.6,-bOff.y/160)),6,0,0,TAU);g.fill();
 g.save();g.globalAlpha=al;g.imageSmoothingEnabled=false;g.translate(KU_BX+shx,GY+bOff.y);if(bOff.rot)g.rotate(bOff.rot);g.scale(KU_BS*(1+bOff.sq*.25),KU_BS*(1-bOff.sq*.3));g.drawImage(BUNTA.c,0,0,BUNTA.w,BUNTA.h,-BUNTA.w/2,-BUNTA.h-br,BUNTA.w,BUNTA.h+br);
 if(hit>0){g.globalCompositeOperation='lighter';g.globalAlpha=hit*.55;g.drawImage(BUNTA.c,0,0,BUNTA.w,BUNTA.h,-BUNTA.w/2,-BUNTA.h-br,BUNTA.w,BUNTA.h+br);g.globalCompositeOperation='source-over';g.globalAlpha=al;}
 if(open>0){ /* boca escancarada: interior escuro, lingua e a bala de agua se formando la dentro */
  g.translate(-BUNTA.w/2,-BUNTA.h-br);const yb=48+16*open,fl=(a,pts)=>{g.fillStyle=a;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();};
  fl('#1a0610',[[5,46],[30,46],[66,49],[60,yb+5],[32,yb+9],[7,yb+1]]);fl('#5a1428',[[9,48],[30,48],[60,51],[55,yb+2],[32,yb+5],[11,yb-2]]);
  g.fillStyle='#c8303e';pxDisc(g,36,yb+1,0);g.beginPath();g.ellipse(38,yb+1,20,1.5+4*open,0,0,TAU);g.fill();
  const br2=2+7*open;g.fillStyle='#17408c';pxDisc(g,20,(48+yb)/2+1,br2+1);g.fillStyle='#4f96ec';pxDisc(g,20,(48+yb)/2+1,br2);g.fillStyle='#d8f0ff';pxDisc(g,19-br2*.3,(48+yb)/2-br2*.3,br2*.35);
  g.fillStyle='#ffffff';for(let i=0;i<5;i++){const a=time*9+i*1.3;g.fillRect(Math.round(20+Math.cos(a)*(br2+4)),Math.round((48+yb)/2+Math.sin(a)*(br2+4)),1,1);}
 }
 g.restore();
 /* fumaca do cachimbo em pixels */
 g.save();g.globalAlpha=al*.8;for(let i=0;i<6;i++){const ph=(time*.5+i/6)%1;g.fillStyle=ph<.5?'#d8d8e4':'#9a9aac';pxDisc(g,KU_BX+bOff.x+(2-75)*KU_BS-ph*4+Math.sin(time*2+i)*2,GY+bOff.y+(54-110)*KU_BS-ph*34,2+ph*4);}g.restore();}
/* barra de vida do sapo, em pixels, acima da cabeca */
function drawBuntaHP(g){if(!bunta)return;const x0=KU_BX-64,y0=GY-BUNTA.h-12,w=96,k=Math.max(0,bunta.hp/bunta.max);g.fillStyle='#140a10';g.fillRect(x0-1,y0-1,w+2,6);g.fillStyle='#4a2a2a';g.fillRect(x0,y0,w,4);g.fillStyle=k>.5?'#6fe06a':k>.25?'#f0c830':'#e03a3a';g.fillRect(x0,y0,Math.round(w*k),4);g.fillStyle='#f6f4ee';g.fillRect(x0,y0,Math.round(w*k),1);}
/* a invocacao: o sapo fica no campo com a propria vida, apanha no lugar do Naruto e ataca sozinho a cada turno */
let bunta=null,buntaGone=0,bOff={x:0,y:0,sq:0,rot:0};
function buntaDie(){if(!bunta)return;bunta=null;setBars();buntaGone=performance.now()/1000;toast('Gama Bunta voltou para o Monte Myōboku');}
/* selo de invocacao no chao: linhas de escrita saindo da mao em pixels */
function kuSeal(g,t,x){const a=t-KU_SLAM;if(a<0||a>.9)return;const k=Math.min(1,a/.2),fade=1-Math.max(0,(a-.5)/.4);g.save();g.globalAlpha=fade;g.fillStyle='#120a14';
 for(let i=0;i<7;i++){const an=-Math.PI+i/6*Math.PI,len=10+28*k;for(let j=0;j<len;j+=2){const px=x+Math.cos(an)*j*1.4,py=GY+1+Math.sin(an)*j*.12;g.fillRect(Math.round(px),Math.round(py),1+(j%6===0?1:0),1);}}g.restore();}
/* bala de agua: esfera de agua em pixels voando da boca do sapo ate o Sasuke, e o estouro */
/* bala de agua em pixel art: esfera com 5 tons, bolhas girando e rastro de linhas */
function pxWaterBall(g,x,y,r,time){const o=(c,dx,dy,rr)=>{g.fillStyle=c;pxDisc(g,x+dx*r,y+dy*r,rr);};
 o('#12347a',0,0,r+1.5);o('#2262c8',0,0,r);o('#3f86e4',.08,.08,r*.84);o('#6eb2f6',-.1,-.1,r*.62);o('#a8d8fc',-.2,-.2,r*.4);o('#f0faff',-.3,-.32,r*.2);
 g.fillStyle='#d0ecff';for(let i=0;i<6;i++){const a=time*14+i*TAU/6,rr=r*.55;g.fillRect(Math.round(x+Math.cos(a)*rr),Math.round(y+Math.sin(a)*rr*.9),1,1);}
 g.fillStyle='#8cc8fa';for(let i=0;i<10;i++){const a=time*10+i*TAU/10,rr=r*1.15;g.fillRect(Math.round(x+Math.cos(a)*rr),Math.round(y+Math.sin(a)*rr),1,1);}}
function kuWater(g,f,t,time,sx0,tF,tH){const S=KU_BS,mx=KU_BX+(8-75)*S,my=GY+(46-110)*S,tx=sx0+6,ty=GY-36;
 if(t>=tF-.02&&t<tF+.25){const a0=Math.max(0,t-tF),k0=a0/.25,r3=R(1700);for(let i=0;i<24;i++){const an=Math.PI*.55+r3()*Math.PI*.9,sp=20+r3()*70;g.fillStyle=r3()<.5?'#e8f8ff':'#6eb2f6';g.fillRect(Math.round(mx+Math.cos(an)*sp*a0),Math.round(my+Math.sin(an)*sp*a0+60*a0*a0),2,2);}g.strokeStyle=`rgba(220,240,255,${1-k0})`;g.lineWidth=1.5;g.beginPath();g.ellipse(mx,my,4+30*k0,3+16*k0,0,0,TAU);g.stroke();} /* estouro na boca */
 if(t>=tF&&t<tH){const k=(t-tF)/(tH-tF),e=k*k*.5+k*.5,x=mx+(tx-mx)*e,y=my+(ty-my)*e,r=11+k*9;
  /* rastro: linhas de agua e esguichos atras da bala */
  for(let i=1;i<=14;i++){const kb=Math.max(0,e-i*.03),xb=mx+(tx-mx)*kb,yb=my+(ty-my)*kb,r2=R(i+1500);g.fillStyle=i<5?'#6eb2f6':i<10?'#a8d8fc':'#e0f2ff';g.fillRect(Math.round(xb+(r2()-.3)*(2+i*.5)),Math.round(yb+(r2()-.5)*r*(.6+i*.08)),3+(i%3),1+(i%2));}
  pxWaterBall(g,x,y,r,time);
  /* marola no chao embaixo do caminho */
  g.fillStyle='rgba(200,230,255,.5)';for(let i=0;i<10;i++){const xg=x+i*5,al=1-i/10;g.globalAlpha=al*.6;g.fillRect(Math.round(xg),GY+1+(i%2),4,1);}g.globalAlpha=1;}
 const a=t-tH;
 if(a>=0&&a<1.3){const r2=R(1600);
  /* coroa de agua subindo do Sasuke */
  const ph=Math.min(1,a/.22),fade=a<.5?1:Math.max(0,1-(a-.5)/.8);g.save();g.globalAlpha=.8*fade;
  for(let dx=-18;dx<=18;dx+=2){const h=(1-Math.abs(dx)/20)*(60+((dx*7)%11))*ph*(1-.35*Math.max(0,(a-.3))),x=sx0+dx;g.fillStyle='#6eb2f6';g.fillRect(x,Math.round(GY-h),2,Math.round(h));g.fillStyle='#a8d8fc';g.fillRect(x,Math.round(GY-h),2,3);g.fillStyle='#e8f8ff';if(dx%4===0)g.fillRect(x,Math.round(GY-h),2,1);}
  g.restore();
  /* gotas e respingos em pixel */
  for(let i=0;i<70;i++){const an=-Math.PI*.95+r2()*Math.PI*.9,sp=30+r2()*150,x=sx0+Math.cos(an)*sp*a,y=ty+Math.sin(an)*sp*a+170*a*a;if(y>GY+2)continue;const q=r2();g.fillStyle=q<.3?'#e8f8ff':q<.7?'#a8d8fc':'#4f96ec';const z=q<.2?3:q<.6?2:1;g.fillRect(Math.round(x),Math.round(y),z,z);}
  /* ondas no chao */
  g.strokeStyle='rgba(210,236,255,.8)';for(let i=0;i<3;i++){const rr=a*95-i*14;if(rr<=2)continue;g.globalAlpha=Math.max(0,1-rr/110);g.lineWidth=1;g.beginPath();g.ellipse(sx0,GY+1,rr,rr*.2,0,0,TAU);g.stroke();}g.globalAlpha=1;
  if(a<.3){f.save();f.globalCompositeOperation='lighter';const k=a/.3;orb(f,tx,ty,40*(1-k*.6),[[0,'rgba(200,230,255,.55)'],[1,'rgba(60,120,255,0)']]);f.restore();}}}
/* ---- Teppodama: o sapo invocado ataca sozinho, uma bala de agua por turno ---- */
const TP_FIRE=1.15,TP_HIT=1.65;
ANIMS.teppodama={enemy:true,dur:3.6,hold:TP_HIT,hitT:TP_HIT,hits:[{t:TP_HIT,dmg:4}],cost:0,noLift:true,
  sP:[[0,READY],[1.0,READY],[1.2,S_GUARD],[1.55,S_GUARD],[TP_HIT,S_HIT],[2.3,S_HIT],[2.7,S_STAG],[3.2,READY],[3.6,READY]],
  sX:[[0,96],[TP_HIT,96],[2.2,56],[2.8,56],[3.3,96],[3.6,96]],
  nP:[[0,N_READY],[99,N_READY]],nX:[[0,KU_NX],[99,KU_NX]],nYf:t=>KU_NY+(LE('teppodama')?tpJy(t):0),
  cam:[[0,{z:1.04,cx:192,cy:116}],[.25,{z:1.5,cx:236,cy:112}],[TP_FIRE+.05,{z:1.6,cx:222,cy:114}],[TP_HIT-.25,{z:1.25,cx:170,cy:116}],[TP_HIT,{z:1.5,cx:120,cy:128}],[2.4,{z:1.3,cx:140,cy:122}],[3.1,{z:1.04,cx:192,cy:116}],[3.6,{z:1.04,cx:192,cy:116}]]};
/* recuo do sapo: inclina para tras ao inalar e da um tranco para tras quando dispara */
function tpRec(t){const inh=clamp((t-(TP_FIRE-.8))/.8,0,1)*(t<TP_FIRE?1:0),a=t-TP_FIRE,kick=a>=0&&a<.5?Math.pow(1-a/.5,2):0;return {x:kick*10,y:0,rot:-.05*inh+.06*kick};}
/* ---- fatality do Teppodama: o sapo salta e esmaga o Sasuke com o corpo inteiro ---- */
const TPF_UP=2.35,TPF_LAND=2.95,TPF_BACK=4.1,TPF_HOME=4.7,TPF_DX=-212;
function tpJx(t){if(t<TPF_UP)return 0;if(t<TPF_LAND){const k=(t-TPF_UP)/(TPF_LAND-TPF_UP);return TPF_DX*(k*k*(3-2*k));}if(t<TPF_BACK)return TPF_DX;if(t<TPF_HOME){const k=(t-TPF_BACK)/(TPF_HOME-TPF_BACK);return TPF_DX*(1-k*k*(3-2*k));}return 0;}
function tpJy(t){if(t>TPF_UP-.25&&t<TPF_UP)return 4*(t-(TPF_UP-.25))/.25; /* agacha antes de pular */
 if(t>=TPF_UP&&t<TPF_LAND){const k=(t-TPF_UP)/(TPF_LAND-TPF_UP);return -Math.sin(k*Math.PI)*78;}if(t>=TPF_BACK&&t<TPF_HOME){const k=(t-TPF_BACK)/(TPF_HOME-TPF_BACK);return -Math.sin(k*Math.PI)*46;}return 0;}
function tpSq(t){const a=t-TPF_LAND;return a>=0&&a<.5?Math.sin(Math.min(1,a/.12)*Math.PI*.5)*(1-a/.5):0;}
ANIMS.teppodama.LR={dur:9.2,koAt:8.6,bannerAt:7.6,speakAt:5.9,line:'Isso é o que dá mexer com o chefe do Monte Myōboku!',speechPos:['46%','12%'],banner:['蝦蟇','FATALITY','Gama Bunta','#e8703a'],
 map:[[0,0],[TPF_LAND-.05,TPF_LAND-.05],[TPF_LAND+.55,TPF_LAND+.12],[99,99-.43]],
 sP:[[0,READY],[1.0,READY],[1.2,S_GUARD],[1.55,S_GUARD],[TP_HIT,S_HIT],[2.4,S_HIT],[2.65,S_STAG],[2.9,S_DOWN],[99,S_DOWN]],
 sX:[[0,96],[TP_HIT,96],[2.2,74],[99,74]],
 nP:[[0,N_READY],[TPF_UP-.1,N_COIL],[TPF_UP+.1,N_READY],[5.6,N_READY],[6.0,N_VICT],[99,N_VICT]],
 nX:Array.from({length:131},(_,i)=>[i*.05,KU_NX+tpJx(i*.05)]).concat([[99,KU_NX]]),
 cam:[[0,{z:1.04,cx:192,cy:116}],[.25,{z:1.5,cx:236,cy:112}],[TP_FIRE+.05,{z:1.6,cx:222,cy:114}],[TP_HIT-.25,{z:1.25,cx:170,cy:116}],[TP_HIT,{z:1.5,cx:120,cy:128}],[2.2,{z:1.2,cx:150,cy:110}],[TPF_UP+.3,{z:1.04,cx:170,cy:108}],[TPF_LAND,{z:1.3,cx:90,cy:124}],[3.6,{z:1.25,cx:96,cy:122}],[TPF_BACK+.3,{z:1.4,cx:96,cy:140}],[5.2,{z:1.9,cx:80,cy:156}],[5.7,{z:1.5,cx:220,cy:100}],[7.2,{z:1.5,cx:222,cy:100}],[7.8,{z:1.04,cx:192,cy:116}],[99,{z:1.04,cx:192,cy:116}]]};
const LTP=type=>type==='teppodama'&&LE(type);
function tpFatalFX(g,f,t,sx0){const a=t-TPF_LAND;if(a<0)return;
 if(a<1.2){bloodSpray(f,sx0-50,GY-6,a,151,40,-1);bloodSpray(f,sx0+50,GY-6,a,152,40,1);bloodSpray(f,sx0,GY-10,a*1.2,153,30,0);
  if(a<.35){f.save();f.globalCompositeOperation='lighter';const k=a/.35;ringFX(f,sx0,GY,10+110*k,2.6*(1-k)+.3,`rgba(255,235,210,${1-k})`);f.restore();}
  g.save();g.globalAlpha=.55*Math.max(0,1-a/1.2);for(let i=0;i<16;i++){const r=R(i+170),side=i%2?1:-1,k=Math.min(1,a/.3);g.fillStyle=i%3?'#5a5068':'#7a7088';pxDisc(g,sx0+side*(40+r()*70)*k,GY-(2+r()*16)*k,(5+r()*7)*(.5+k*.6));}g.restore();}}
/* ---- em cima do Gama Bunta o Naruto nao ataca de perto: so arremessa kunai e shuriken, sem sair da cabeca do sapo ---- */
const NK_THROW=.55,NK_HIT=.95;
ANIMS.nkunai={enemy:true,dur:2.2,hold:NK_HIT,hitT:NK_HIT,hits:[{t:NK_HIT,dmg:2}],cost:0,noLift:true,
  sP:[[0,READY],[.8,READY],[.9,S_GUARD],[NK_HIT,S_FLINCH],[1.4,S_FLINCH],[1.8,READY],[2.2,READY]],sX:[[0,96],[99,96]],
  nP:[[0,N_READY],[.35,N_READY],[.45,N_COIL],[NK_THROW,N_PUNCH],[.9,N_PUNCH],[1.2,N_READY],[2.2,N_READY]],nX:[[0,KU_NX],[99,KU_NX]],nYf:t=>KU_NY,
  cam:[[0,{z:1.04,cx:192,cy:116}],[.3,{z:1.2,cx:215,cy:108}],[1.0,{z:1.2,cx:190,cy:112}],[1.8,{z:1.04,cx:192,cy:116}],[2.2,{z:1.04,cx:192,cy:116}]]};
ANIMS.nshuriken={enemy:true,dur:2.6,hold:1.15,hitT:1.15,hits:[{t:.95,dmg:2},{t:1.15,dmg:1},{t:1.35,dmg:1}],cost:0,noLift:true,
  sP:[[0,READY],[.9,READY],[1.0,S_GUARD],[1.15,S_FLINCH],[1.5,S_HIT],[2.0,READY],[2.6,READY]],sX:[[0,96],[99,96]],
  nP:[[0,N_READY],[.35,N_READY],[.45,N_COIL],[.55,N_PUNCH],[1.0,N_PUNCH],[1.3,N_READY],[2.6,N_READY]],nX:[[0,KU_NX],[99,KU_NX]],nYf:t=>KU_NY,
  cam:[[0,{z:1.04,cx:192,cy:116}],[.3,{z:1.2,cx:215,cy:108}],[1.2,{z:1.2,cx:190,cy:112}],[2.0,{z:1.04,cx:192,cy:116}],[2.6,{z:1.04,cx:192,cy:116}]]};
function nThrowFX(f,type,t,time,sx0){const x0=KU_NX-6,y0=GY+KU_NY-22,x1=sx0+4,y1=GY-40;
 if(type==='nkunai'){if(t<NK_THROW||t>NK_HIT)return;const k=(t-NK_THROW)/(NK_HIT-NK_THROW),x=x0+(x1-x0)*k,y=y0+(y1-y0)*k;drawKunai(f,x,y,Math.atan2(y1-y0,x1-x0)+Math.PI,1);
  if(t>=NK_HIT-.01&&t<NK_HIT+.25){f.save();f.globalCompositeOperation='lighter';orb(f,x1,y1,10*(1-(t-NK_HIT)/.25),[[0,'rgba(255,255,255,.7)'],[1,'rgba(200,225,255,0)']]);f.restore();}}
 else{[0,.2,.4].forEach((d,i)=>{const a=t-.55-d*.9;if(a<0||a>.42)return;const k=a/.42,x=x0+(x1-x0)*k,y=y0+(y1-y0)*k+Math.sin(k*Math.PI)*-6*(i-1);drawShuriken(f,x,y,time*30+i,2.2,false);});
  for(const h of [.95,1.15,1.35]){const a=t-h;if(a>=0&&a<.22){f.save();f.globalCompositeOperation='lighter';orb(f,x1,y1,8*(1-a/.22),[[0,'rgba(255,255,255,.7)'],[1,'rgba(200,225,255,0)']]);f.restore();}}}}
/* ---- Manto da Kyuubi: em perigo ou com raiva, o chakra vermelho da raposa envolve o Naruto (cura e mais forca por 3 turnos) ---- */
const KY_ON=1.35,KY_TURNS=3,KY_HEAL=8,KY_POW=1.35;
const N_RAGE=mk({tilt:.22,crouch:9,lean:3,fbx:-12,ffx:8,hxF:9,hyF:6,hxB:-6,hyB:6,expr:2,tw:.8,hr:.12,wind:1});
ANIMS.kyuubi={enemy:true,dur:3.4,hold:KY_ON,hitT:KY_ON,hits:[],cost:0,noLift:true,
  sP:[[0,READY],[1.3,READY],[1.45,S_GUARD],[2.4,S_GUARD],[2.8,READY],[3.4,READY]],sX:[[0,96],[99,96]],
  nP:[[0,N_READY],[.3,N_READY],[.55,N_COIL],[1.0,N_RAGE],[1.3,N_RAGE],[1.45,N_READY],[3.4,N_READY]],nX:[[0,288],[99,288]],
  cam:[[0,{z:1.04,cx:192,cy:116}],[.35,{z:2.0,cx:282,cy:130}],[1.25,{z:2.4,cx:284,cy:128}],[KY_ON+.1,{z:1.5,cx:268,cy:124}],[2.6,{z:1.4,cx:262,cy:124}],[3.1,{z:1.04,cx:192,cy:116}],[3.4,{z:1.04,cx:192,cy:116}]]};
let kyuT=0,kyuUsed=false;
/* manto em pixel: bolhas de chakra vermelho subindo em volta do corpo, contorno escuro tremendo e a cauda de chakra atras */

/* ---- ataques basicos do Naruto (Soco e Chute): o golpe do Sasuke espelhado, com o Naruto atacando e o Sasuke apanhando ---- */
function mirrorBasic(baseId,fxKind){const B=ANIMS[baseId],mir=arr=>arr.map(([t,x])=>[t,384-x]);
 const vic=p=>p===N_HIT||p===N_HITB?S_HIT:p===N_STAG?S_STAG:READY;
 return{enemy:true,dur:B.dur,hold:B.hold,hitT:B.hitT,hits:[{t:B.hitT,dmg:B.dmg}],cost:0,noLift:true,tpN:B.tp,
  nP:B.sP,nX:mir(B.sX),sP:B.nP.map(([t,p])=>[t,vic(p)]),sX:mir(B.nX),
  cam:B.cam.map(([t,c])=>[t,Object.assign({},c,{cx:384-c.cx})]),env:B.env,
  fx:c=>{const {f,t}=c,A=ANIMS['n'+baseId],sx0=interp(A.sX,t);
   const k=baseId==='soco'?[.5,.85]:[.55,.95];dashLines(f,c,k[0],k[1],5);
   const h=t-A.hitT;impactFX(f,sx0+6,GY-(baseId==='soco'?53:40),h,5,false);}};}
ANIMS.nsoco=mirrorBasic('soco');
ANIMS.nchute=mirrorBasic('chute');

/* ---- arremessos do Naruto no chao (Kunai e Shuriken): a pose de arremesso do Sasuke espelhada; o projetil sai da mao do Naruto e vai ate o Sasuke ---- */
const vicPose=p=>p===N_HIT||p===N_HITB?S_HIT:p===N_STAG?S_STAG:READY;
function gKunaiFX(c){
 const {f,A,t}=c,T0=.85,T1=1.25,hr=rigW(evalPose(A.nP,T0)),P0=[288-hr.hf.hx-3,GY+hr.hf.hy],P1=[interp(A.sX,T1)+6,GY-42];
 const dx=P1[0]-P0[0],dy=P1[1]-P0[1],dir=Math.atan2(dy,dx);
 if(t>=T0&&t<T1){const k=(t-T0)/(T1-T0),pos=kk=>[P0[0]+dx*kk,P0[1]+dy*kk-Math.sin(kk*Math.PI)*10];
  f.globalCompositeOperation='lighter';for(let i=1;i<=9;i++){const kk=k-i*.025;if(kk<0)break;const q=pos(kk);f.fillStyle='rgba(255,225,190,'+((1-i/10)*.7)+')';f.beginPath();f.arc(q[0],q[1],1.1*(1-i/12),0,TAU);f.fill();}
  f.globalCompositeOperation='source-over';const q=pos(k);drawKunai(f,q[0],q[1],dir+(1-k)*12,1);}
 const a=t-T1;
 if(a>=0){if(t<2.7)drawKunai(f,P1[0]+8.5,P1[1],Math.PI+.08,1.05);
  if(a<.55){f.globalCompositeOperation='lighter';if(a<.3)orb(f,P1[0],P1[1],16*(1-a/.45),[[0,'rgba(255,255,255,.8)'],[.4,'rgba(200,225,255,.4)'],[1,'rgba(120,160,255,0)']]);f.globalCompositeOperation='source-over';}
  bloodSpray(f,P1[0],P1[1],a,71,14,1);}}
function gShurikenFX(c){
 const {f,A,t}=c,R0=[.82,1.02,1.22],H=[1.32,1.52,1.72],sx0=interp(A.sX,1.32),T=[[sx0+6,GY-44],[sx0+3,GY-54],[sx0+5,GY-24]];
 for(let i=0;i<3;i++){const hr=rigW(evalPose(A.nP,R0[i])),P0=[288-hr.hf.hx-3,GY+hr.hf.hy-1],a=t-H[i];
  if(t>=R0[i]&&t<H[i]){const k=(t-R0[i])/.5,x=P0[0]+(T[i][0]-P0[0])*k,y=P0[1]+(T[i][1]-P0[1])*k-Math.sin(k*Math.PI)*(8+i*3);
   f.globalCompositeOperation='lighter';for(let j=1;j<=7;j++){const kk=k-j*.03;if(kk<0)break;const qx=P0[0]+(T[i][0]-P0[0])*kk,qy=P0[1]+(T[i][1]-P0[1])*kk-Math.sin(kk*Math.PI)*(8+i*3);f.fillStyle='rgba(255,220,190,'+((1-j/8)*.6)+')';f.beginPath();f.arc(qx,qy,1.1*(1-j/9),0,TAU);f.fill();}
   f.globalCompositeOperation='source-over';drawShuriken(f,x,y,t*40+i,.9,false);}
  if(a>=0){if(t<2.8)drawShuriken(f,T[i][0]+1.2,T[i][1],.4+i*1.1,.8,false);
   if(a<.4){f.globalCompositeOperation='lighter';orb(f,T[i][0],T[i][1],12*(1-a/.5),[[0,'rgba(255,255,255,.7)'],[.4,'rgba(200,225,255,.35)'],[1,'rgba(120,160,255,0)']]);f.globalCompositeOperation='source-over';}
   bloodSpray(f,T[i][0],T[i][1],a,91+i,9,1);}}}
function mirrorShot(baseId,hits,fx){const B=ANIMS[baseId],mir=arr=>arr.map(([t,x])=>[t,384-x]);
 return{enemy:true,dur:B.dur,hold:B.hold,hitT:B.hitT,hits,cost:0,noLift:true,
  nP:B.sP,nX:[[0,288],[99,288]],sP:B.nP.map(([t,p])=>[t,vicPose(p)]),sX:mir(B.nX),
  cam:B.cam.map(([t,c])=>[t,Object.assign({},c,{cx:384-c.cx})]),env:B.env,fx};}
ANIMS.gkunai=mirrorShot('kunai',[{t:1.25,dmg:8}],gKunaiFX);
ANIMS.gshuriken=mirrorShot('shuriken',[{t:1.32,dmg:4},{t:1.52,dmg:4},{t:1.72,dmg:4}],gShurikenFX);
