const fs=require('fs');let s=fs.readFileSync('naruto-demo.html','utf8');
const rp=(x,y)=>{if(!s.includes(x)){console.log('MISSING',x.slice(0,100));return;}s=s.split(x).join(y)};
rp("if(a<.5)orb(f,cx,cy,50*(1-a/.7),[[0,'rgba(240,210,255,.85)'],[.35,'rgba(150,70,240,.45)'],[1,'rgba(60,10,140,0)']]);","if(a<.7)orb(f,cx,cy,34*(1-a/.9),[[0,'rgba(4,0,10,.8)'],[1,'rgba(20,4,40,0)']]);f.globalCompositeOperation='lighter';if(a<.5)orb(f,cx,cy,50*(1-a/.7),[[0,'rgba(200,160,255,.5)'],[.35,'rgba(130,60,230,.4)'],[1,'rgba(60,10,140,0)']]);");
rp("orb(f,nx0,GY-38,46*(1-aa/1.1),[[0,'rgba(240,210,255,.9)'],[.4,'rgba(160,80,250,.5)'],[1,'rgba(60,10,140,0)']])","orb(f,nx0,GY-38,46*(1-aa/1.1),[[0,'rgba(200,160,255,.55)'],[.4,'rgba(130,60,240,.45)'],[1,'rgba(60,10,140,0)']])");
rp("if(a>=0&&a<.04)E.flash=.9;else if(a>=.04&&a<.14)E.flash=.4;if(t>1.0&&t<1.9)E.shk=Math.max(E.shk||0,1.6);","if(a>=0&&a<.04)E.flash=.5;else if(a>=.04&&a<.14)E.flash=.25;if(t>1.0&&t<1.9)E.shk=Math.max(E.shk||0,1.6);");
rp("env:(raw,t)=>{const E={},a=raw-3.9;if(a>0&&a<1.7)E.shk=9*Math.pow(1-a/1.7,1.4)*(a<.4?1.3:1);if(a>=0&&a<.04)E.flash=.95;else if(a>=.04&&a<.14)E.flash=.5;else if(a>=.14&&a<.3)E.flash=.18;","env:(raw,t)=>{const E={},a=raw-3.9;if(a>0&&a<1.7)E.shk=9*Math.pow(1-a/1.7,1.4)*(a<.4?1.3:1);if(a>=0&&a<.04)E.flash=.5;else if(a>=.04&&a<.14)E.flash=.28;else if(a>=.14&&a<.3)E.flash=.1;");
rp("if(b>=0&&b<.05)E.flash=.95;","if(b>=0&&b<.05)E.flash=.5;");
// aura da forma parada menos pesada
rp("curseAura2(f,sx0,.5,time,fr);else if(sealT>0","curseAura2(f,sx0,.3,time,fr);else if(sealT>0");
fs.writeFileSync('naruto-demo.html',s);console.log('ok');
