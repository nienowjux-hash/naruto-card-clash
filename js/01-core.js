'use strict';
const $=id=>document.getElementById(id);
const W=384,H=216,K=1280/384,RES=K*1.6,PW=1280,PH=720,GY=182;
const TAU=Math.PI*2;
const cv=$('c');cv.width=PW;cv.height=PH;
const g=cv.getContext('2d');g.imageSmoothingQuality='high';
const fxc=document.createElement('canvas');fxc.width=PW;fxc.height=PH;const f=fxc.getContext('2d');
const hex=s=>{const n=parseInt(s.slice(1),16);return[n>>16&255,n>>8&255,n&255]};
const mix=(a,b,k)=>a.map((v,i)=>v+(b[i]-v)*k);
const css=(c,k=1,a=1)=>`rgba(${Math.min(255,c[0]*k)|0},${Math.min(255,c[1]*k)|0},${Math.min(255,c[2]*k)|0},${a})`;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function R(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const OUT='#0a0a1e';
function setCam(c,z,sx,sy,cx,cy){const s=K*z;c.setTransform(s,0,0,s,PW/2+sx-cx*s,PH/2+sy-cy*s)}

/* ---------- helpers ---------- */
function orb(c,x,y,r,stops){const gr=c.createRadialGradient(x,y,0,x,y,r);for(const[s,col]of stops)gr.addColorStop(s,col);c.fillStyle=gr;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
function path(c,pts,close){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));if(close)c.closePath();}
function poly(c,pts,fill,stroke,lw,ox=0,oy=0){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0]+ox,p[1]+oy):c.moveTo(p[0]+ox,p[1]+oy));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw||.7;c.lineJoin='round';c.stroke();}}
function boltLines(x,y,ang,len,seed,branch){const rn=R(seed),lines=[];const pts=[[x,y]];let px=x,py=y,a=ang;const n=Math.max(3,Math.ceil(len/3));
 for(let i=0;i<n;i++){a+=(rn()-.5)*1.1;px+=Math.cos(a)*3;py+=Math.sin(a)*3;pts.push([px,py]);
  if(branch&&rn()<.2&&len>12)lines.push(...boltLines(px,py,a+(rn()<.5?1:-1)*(.6+rn()*.6),len*(1-i/n)*.55,seed*7+i,false));}
 lines.push(pts);return lines;}
function drawBolts(c,lines,s=1,cols){c.lineCap='round';c.lineJoin='round';
 const L=cols||[[3.4,'rgba(50,110,255,.30)'],[1.5,'rgba(120,215,255,.85)'],[.55,'#fff']];
 for(const[w,col]of L)for(const l of lines){c.strokeStyle=col;c.lineWidth=w*s;path(c,l);c.stroke();}}
function jagLines(x0,y0,x1,y1,seed,amp){const rn=R(seed),n=Math.max(3,Math.round(Math.hypot(x1-x0,y1-y0)/3));const p=[[x0,y0]];for(let i=1;i<n;i++){const k=i/n;p.push([x0+(x1-x0)*k+(rn()-.5)*amp,y0+(y1-y0)*k+(rn()-.5)*amp]);}p.push([x1,y1]);return[p];}
function blob(c,cx,cy,r,col,ph,amp=.22,sq=1){c.fillStyle=col;c.beginPath();const n=44;for(let i=0;i<=n;i++){const a=i/n*TAU;const rr=r*(1+amp*(Math.sin(a*5+ph)*.6+Math.sin(a*9-ph*1.7)*.4));const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*sq;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();c.fill();}
function fireBlob(c,x,y,r,ph){
 c.globalCompositeOperation='lighter';orb(c,x,y,r*2.4,[[0,'rgba(255,140,40,.55)'],[1,'rgba(255,60,0,0)']]);c.globalCompositeOperation='source-over';
 blob(c,x,y,r*1.02,'#5a0e0c',ph,.26);blob(c,x,y,r*.92,'#c42a16',ph+1,.26);blob(c,x,y,r*.74,'#ff6a1a',ph+2,.26);blob(c,x,y,r*.52,'#ffb02e',ph+3,.24);blob(c,x,y,r*.32,'#ffe680',ph+4,.2);blob(c,x,y,r*.16,'#fffbe8',ph+5,.15);}

