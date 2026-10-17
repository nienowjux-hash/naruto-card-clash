/* ---------- Vila da Folha (Konohagakure) ----------
   Cenario proprio da vila, usado quando o jogador esta fora de um duelo (hubMode): Monte Hokage com os quatro rostos, telhados, Torre do Hokage,
   Armeiro, Dojo e Templo de Invocacao, rua de pedra e o Time 7 parado. As partes fixas sao pintadas uma vez (konStatic) e depois
   animadas por cima: nuvens, passaros, fumaca das chaminés, folhas caindo e lanternas. Os predios sao botoes clicaveis (konoha-hot). */
const KON_SPOTS=[ /* x/y no mundo (384x216), nome e destino */
 {id:'torre',x:64,y:104,name:'Torre do Hokage',sub:'Mapa da campanha',go:()=>openMap()},
 {id:'armeiro',x:150,y:120,name:'Armeiro',sub:'Equipamentos',go:()=>openInv()},
 {id:'dojo',x:242,y:118,name:'Dojo',sub:'Árvore de habilidades',go:()=>openTree()},
 {id:'templo',x:338,y:116,name:'Templo de Invocação',sub:'Invocar ninjas',go:()=>openGacha()}];
let konStatic=null,konClouds=null;
const konR=R(2024);
function konRoof(c,x,y,w,h,col,col2){ /* telhado de beiral curvo: faixa escura embaixo, telhas e cumeeira */
 poly(c,[[x-3,y+h],[x+w+3,y+h],[x+w-2,y+2],[x+2,y+2]],col);poly(c,[[x+2,y+2],[x+w-2,y+2],[x+w-5,y-3],[x+5,y-3]],col2);
 c.fillStyle='rgba(0,0,0,.18)';for(let i=0;i<w;i+=3)c.fillRect(x+i,y+3,1,h-2);c.fillStyle='rgba(255,255,255,.22)';c.fillRect(x+5,y-3,w-10,1);c.fillStyle='rgba(60,20,10,.45)';c.fillRect(x-3,y+h-1,w+6,1.5);}
function konHouse(c,x,yb,w,h,roof,roof2,wall){c.fillStyle=wall||'#eadcb4';c.fillRect(x,yb-h,w,h);c.fillStyle='rgba(0,0,0,.12)';c.fillRect(x+w*.6,yb-h,w*.4,h);c.fillStyle='#5a3a22';c.fillRect(x+w*.12,yb-h,1.4,h);c.fillRect(x+w*.88,yb-h,1.4,h);
 konRoof(c,x-1,yb-h-8,w+2,9,roof,roof2);c.fillStyle='#fbe28a';const n=Math.max(1,Math.floor(w/16));for(let i=0;i<n;i++){const wx=x+4+i*(w-8)/n;c.fillRect(wx,yb-h*.62,5,h*.28);c.fillStyle='#3a2414';c.fillRect(wx+2.2,yb-h*.62,.6,h*.28);c.fillStyle='#fbe28a';}
 c.fillStyle='#4a2c18';c.fillRect(x+w/2-3,yb-h*.38,6,h*.38);}
function konFace(c,x,y,k){ /* rosto esculpido no monte: pedra clara, cabelo, sobrancelhas, olhos, nariz e boca (4 Hokages) */
 c.fillStyle='#e6cc9c';c.beginPath();c.ellipse(x,y,15,17,0,0,TAU);c.fill();c.fillStyle='rgba(120,80,40,.3)';c.beginPath();c.ellipse(x+5,y+2,9,15,0,0,TAU);c.fill();
 const hair=['#5a3a28','#d8d0c0','#8a6a48','#e8c85a'][k];c.fillStyle=hair;
 if(k===0){c.beginPath();c.moveTo(x-16,y+22);c.lineTo(x-17,y-4);c.quadraticCurveTo(x-14,y-20,x,y-19);c.quadraticCurveTo(x+14,y-20,x+17,y-4);c.lineTo(x+16,y+22);c.lineTo(x+12,y+4);c.lineTo(x+12,y-10);c.lineTo(x-12,y-10);c.lineTo(x-12,y+4);c.fill();}
 else if(k===1){poly(c,[[x-15,y-6],[x-12,y-20],[x-4,y-14],[x,y-22],[x+5,y-14],[x+12,y-20],[x+15,y-6],[x+13,y-9],[x-13,y-9]],hair);}
 else if(k===2){poly(c,[[x-17,y-10],[x-14,y-21],[x+14,y-21],[x+17,y-10],[x+11,y-12],[x-11,y-12]],hair);c.fillStyle='#c84a3a';c.fillRect(x-4,y-19,8,5);}
 else{poly(c,[[x-15,y-6],[x-17,y-16],[x-9,y-12],[x-6,y-23],[x,y-14],[x+6,y-23],[x+9,y-12],[x+17,y-16],[x+15,y-6],[x+12,y-9],[x-12,y-9]],hair);}
 c.fillStyle='#4a3020';c.fillRect(x-9,y-6,6,1.4);c.fillRect(x+3,y-6,6,1.4);c.fillRect(x-8,y-3,4,1.6);c.fillRect(x+4,y-3,4,1.6);c.fillRect(x-1,y-2,1.4,8);c.fillRect(x-4,y+9,8,1.2);
 if(k===0||k===1){c.fillRect(x-11,y+4,1,6);c.fillRect(x+10,y+4,1,6);}}
function konBuildStatic(){
 const cv=document.createElement('canvas');cv.width=BW;cv.height=BH;const c=cv.getContext('2d');c.setTransform(RES,0,0,RES,0,0);
 /* ceu de fim de tarde */
 let gr=c.createLinearGradient(0,0,0,150);[[0,'#4a8fd8'],[.4,'#8cc4ee'],[.75,'#cfe4f0'],[1,'#ffe0a8']].forEach(s=>gr.addColorStop(s[0],s[1]));c.fillStyle=gr;c.fillRect(0,0,W,152);
 orb(c,300,92,120,[[0,'rgba(255,230,170,.55)'],[1,'rgba(255,230,170,0)']]);
 /* montanhas distantes */
 for(const [col,base,amp,ph] of [['#9ab4dc',96,26,1],['#7c9cc8',108,22,3]]){c.fillStyle=col;c.beginPath();c.moveTo(0,150);for(let x=0;x<=W;x+=2)c.lineTo(x,base-amp*(.5+.5*Math.sin(x*.021+ph))-amp*.4*Math.sin(x*.057+ph*2));c.lineTo(W,150);c.fill();}
 /* Monte Hokage: paredao de pedra com os quatro rostos */
 const rock=c.createLinearGradient(0,34,0,152);rock.addColorStop(0,'#c8a878');rock.addColorStop(1,'#8a6a4a');c.fillStyle=rock;
 c.beginPath();c.moveTo(70,152);c.lineTo(84,86);c.lineTo(104,56);c.lineTo(140,42);c.lineTo(192,36);c.lineTo(244,42);c.lineTo(280,56);c.lineTo(300,86);c.lineTo(314,152);c.fill();
 c.fillStyle='rgba(60,36,20,.22)';c.beginPath();c.moveTo(250,40);c.lineTo(280,56);c.lineTo(300,86);c.lineTo(314,152);c.lineTo(262,152);c.fill();
 c.strokeStyle='rgba(70,44,26,.35)';c.lineWidth=.7;for(let i=0;i<26;i++){const x=88+konR()*220,y=70+konR()*70;c.beginPath();c.moveTo(x,y);c.lineTo(x+konR()*8-4,y+6+konR()*10);c.stroke();}
 [[128,76],[164,72],[200,72],[236,76]].forEach((p,i)=>konFace(c,p[0],p[1],i));
 /* mata no pe do monte */
 for(let i=0;i<60;i++){const x=70+konR()*244,y=130+konR()*26,r=3+konR()*5;orb(c,x,y,r,[[0,konR()<.5?'#3c8a3c':'#2e7434'],[1,'rgba(40,110,50,0)']]);}
 /* casas ao fundo (fileira distante, menor) */
 const bk=[[6,'#c4562a','#e0763a'],[40,'#b04828','#d0663a'],[98,'#c4562a','#e0763a'],[290,'#b04828','#d0663a'],[330,'#c4562a','#e0763a'],[364,'#b04828','#d0663a']];
 bk.forEach(b=>konHouse(c,b[0],146,28+Math.floor(konR()*8),18,b[1],b[2],'#dccca4'));
 /* arvores entre as casas */
 for(const x of [30,118,270,314,372]){c.fillStyle='#5a3a22';c.fillRect(x-1,138,2.4,14);for(const [dx,dy,r] of [[0,130,9],[-6,134,7],[6,134,7],[0,124,6]])orb(c,x+dx,dy,r,[[0,'#4a9a44'],[.8,'#2e7a38'],[1,'rgba(40,110,50,0)']]);}
 /* Torre do Hokage (redonda, telhado vermelho largo e o kanji do fogo) */
 c.fillStyle='#c44a3a';c.fillRect(46,116,36,36);c.fillStyle='rgba(0,0,0,.2)';c.fillRect(70,116,12,36);c.fillStyle='#e8d8b0';c.fillRect(46,134,36,3);c.fillRect(46,150,36,2);
 konRoof(c,40,100,48,18,'#a22a22','#cc4a38');konRoof(c,50,84,28,18,'#a22a22','#cc4a38');c.fillStyle='#8a2018';c.fillRect(62,74,4,10);poly(c,[[58,74],[70,74],[64,66]],'#cc4a38');
 c.fillStyle='#fff';c.font='900 14px "Yu Mincho","MS Mincho",serif';c.textAlign='center';c.fillText('火',64,129);c.fillStyle='#4a2c18';c.fillRect(60,141,8,11);
 /* Armeiro: casa com toldo listrado e espadas na vitrine */
 konHouse(c,128,152,46,26,'#7a5a3a','#a07a4e','#e6d6ae');
 for(let i=0;i<8;i++){c.fillStyle=i%2?'#d84a3a':'#f4ecd4';c.fillRect(131+i*5,136,5,7);}
 c.strokeStyle='#cfd6e6';c.lineWidth=1;c.beginPath();c.moveTo(143,148);c.lineTo(147,140);c.moveTo(150,148);c.lineTo(154,140);c.stroke();
 /* Dojo: telhado de duas aguas, faixada larga e faixa vermelha */
 c.fillStyle='#e8dcb8';c.fillRect(212,126,60,26);c.fillStyle='rgba(0,0,0,.12)';c.fillRect(250,126,22,26);
 konRoof(c,206,112,72,16,'#3c4a6a','#566a92');konRoof(c,214,100,56,14,'#3c4a6a','#566a92');
 c.fillStyle='#c83a3a';c.fillRect(232,128,16,22);c.fillStyle='#fff';c.font='900 11px "Yu Mincho","MS Mincho",serif';c.textAlign='center';c.fillText('修',240,143);
 c.fillStyle='#4a2c18';for(const x of [216,222,258,264])c.fillRect(x,130,4,22);
 /* Templo de Invocacao: torii vermelho e santuario ao fundo */
 konHouse(c,334,148,26,18,'#4a3a2a','#6a5238','#e0d0a8');
 c.fillStyle='#d83a2a';c.fillRect(318,120,5,36);c.fillRect(356,120,5,36);c.fillRect(314,116,52,5);poly(c,[[311,116],[369,116],[364,111],[316,111]],'#2a2a32');c.fillRect(320,126,38,3.4);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(314,116,52,1);
 c.fillStyle='#fff6d8';c.fillRect(336,126,4,6);
 /* chao: grama e rua de pedra */
 c.fillStyle='#7ab25a';c.fillRect(0,152,W,8);c.fillStyle='rgba(0,0,0,.14)';c.fillRect(0,158,W,2);
 const road=c.createLinearGradient(0,160,0,H);road.addColorStop(0,'#d2bd90');road.addColorStop(1,'#a89068');c.fillStyle=road;c.fillRect(0,160,W,H-160);
 c.strokeStyle='rgba(90,66,40,.3)';c.lineWidth=.6;for(let y=170;y<H;y+=14){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();for(let x=((y/14)%2)*12;x<W;x+=24){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+14);c.stroke();}}
 for(let i=0;i<40;i++){c.fillStyle='rgba(255,255,255,.14)';c.fillRect(konR()*W,162+konR()*50,2+konR()*3,1);}
 /* cerca e postes com lanternas */
 c.fillStyle='#6a4a2c';for(let x=0;x<W;x+=10){if(x>110&&x<300)continue;c.fillRect(x,150,1.6,9);}c.fillRect(0,153,110,1.4);c.fillRect(300,153,84,1.4);
 for(const x of [100,196,288]){c.fillStyle='#4a2c18';c.fillRect(x,146,2,14);c.fillStyle='#d83a2a';c.fillRect(x-4,138,10,10);c.fillStyle='#fbd868';c.fillRect(x-2,140,6,6);}
 pixelateBG(cv,18);konStatic=cv;
 konClouds=[0,1,2].map(i=>{const k=document.createElement('canvas');k.width=Math.round(110*RES);k.height=Math.round(30*RES);const x=k.getContext('2d');x.setTransform(RES,0,0,RES,0,0);x.filter='blur(1.2px)';const r=R(300+i*9);
  for(let j=0;j<8;j++){const cx=14+j*11+r()*5,cy=15+r()*6,rx=10+r()*8,ry=3+r()*3;x.fillStyle='rgba(255,255,255,.92)';x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,TAU);x.fill();x.fillStyle='rgba(190,205,230,.55)';x.beginPath();x.ellipse(cx+2,cy+2,rx*.9,ry*.7,0,0,TAU);x.fill();}return k;});}
function drawKonoha(c,time,tint){
 if(!konStatic)konBuildStatic();
 c.save();c.imageSmoothingEnabled=false;c.drawImage(konStatic,0,0,BW,BH,0,0,W,H);c.restore();
 /* nuvens (por cima do ceu, atras do monte: so no alto) */
 c.save();c.beginPath();c.rect(0,0,W,52);c.clip();c.globalAlpha=.9;[[10,14,3,0],[150,6,2,1],[250,22,4,2],[330,10,2.4,1]].forEach(q=>{const x=((q[0]+time*q[2])%(W+130))-110;c.drawImage(konClouds[q[3]],x,q[1],110,30);});c.restore();
 for(let i=0;i<4;i++){const x=((time*10+i*92)%(W+60))-30,y=22+(i*17)%34+Math.sin(time*.9+i)*3;drawBird(c,x,y,.8+i%3*.2,time*7+i*2);}
 /* fumaca das chamines */
 for(const sx of [18,112,298,372])for(let k=0;k<5;k++){const ph=(time*.35+k*.2+sx*.01)%1,x=sx+Math.sin(time+k+sx)*3+ph*8,y=132-ph*34,r=2+ph*5;c.fillStyle=`rgba(236,236,240,${(1-ph)*.55})`;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
 /* lanternas piscando */
 c.globalCompositeOperation='lighter';for(const x of [100,196,288]){const f=.5+.5*Math.sin(time*5+x);orb(c,x+1,143,16,[[0,`rgba(255,200,100,${.35+.2*f})`],[1,'rgba(255,200,100,0)']]);}c.globalCompositeOperation='source-over';
 /* sombra e Time 7 parado na rua */
 const team=(typeof teamNow==='function'?teamNow():['sasuke']).slice(0,4),xs=[138,176,214,252];
 team.forEach((id,i)=>{c.fillStyle='rgba(40,28,14,.35)';c.beginPath();c.ellipse(xs[i],203,10,2.4,0,0,TAU);c.fill();});
 {const hb=hubMode,hs=heroS;hubMode=false;try{team.forEach((id,i)=>{const x=xs[i],P=i%2?READY:Object.assign({},READY,{crouch:3+Math.sin(time*2.2+i)*.6});
   if(id==='naruto'){blit(x,201,true,NARUTO,Object.assign({},N_READY,{crouch:3+Math.sin(time*2.2+i)*.6}),time,{noRefl:true,sc:.66});}
   else if(id==='gozu'||id==='meizu'){const ps=playSkin,rn=roleN;playSkin=id;roleN=true;try{blit(x,201,true,NARUTO,N_READY,time,{noRefl:true,sc:.66});}finally{playSkin=ps;roleN=rn;}}
   else{heroS=id;blit(x,201,false,SASUKE,P,time,{noRefl:true,sc:.66});}});}finally{hubMode=hb;heroS=hs;}}
 /* folhas caindo */
 for(let i=0;i<14;i++){const ph=(time*.06+i*.071)%1,x=W+10-ph*(W+40)+Math.sin(time*1.5+i)*8,y=10+ph*190+Math.sin(time*2+i*3)*6,a=time*2+i;c.save();c.translate(x,y);c.rotate(a);c.fillStyle=i%3?'#5aa84a':'#d0883a';c.beginPath();c.ellipse(0,0,1.8,.9,0,0,TAU);c.fill();c.restore();}
 const vg=c.createRadialGradient(W/2,H*.55,H*.5,W/2,H*.55,W*.66);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(30,14,10,.3)');c.fillStyle=vg;c.fillRect(0,0,W,H);
 if(tint){c.fillStyle=tint;c.fillRect(-20,-20,W+40,H+40);}}
if(typeof konSpots==='function')konSpots();
