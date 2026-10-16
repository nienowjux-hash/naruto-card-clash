/* ---------- audio ---------- */
let AC=null;
function ensureAudio(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();}
function nz(dur,type,f0,f1,vol,at){if(!AC||!sound||AC.state!=='running')return;const n=AC.sampleRate*dur,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
 const s=AC.createBufferSource();s.buffer=b;const fl=AC.createBiquadFilter();fl.type=type;const t=AC.currentTime+at;fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
 const gn=AC.createGain();gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(fl);fl.connect(gn);gn.connect(AC.destination);s.start(t);}
function tone(type,f0,f1,dur,vol,at,lfo){if(!AC||!sound||AC.state!=='running')return;const o=AC.createOscillator(),gn=AC.createGain(),t=AC.currentTime+at;o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);
 gn.gain.setValueAtTime(vol,t);gn.gain.linearRampToValueAtTime(vol,t+dur*.85);gn.gain.linearRampToValueAtTime(0.0001,t+dur);o.connect(gn);gn.connect(AC.destination);
 if(lfo){const l=AC.createOscillator(),lg=AC.createGain();l.type='square';l.frequency.value=lfo;lg.gain.value=vol*.9;l.connect(lg);lg.connect(gn.gain);l.start(t);l.stop(t+dur);}o.start(t);o.stop(t+dur);}
/* Som do fatality (tempos em segundos reais desde o inicio): estalo do impacto, carne e osso, batimentos na camera lenta, retirada molhada, queda. */
function sfxFatal(){
 nz(.22,'highpass',1800,7000,.55,2.58);tone('sine',150,30,1.2,.8,2.58);nz(.5,'bandpass',320,90,.75,2.62);nz(.35,'lowpass',900,120,.55,2.72);
 [2.95,3.12,3.4].forEach(a=>nz(.09,'bandpass',1400,700,.35,a));
 nz(1.9,'highpass',3500,7000,.05,2.7);tone('sawtooth',90,40,2.2,.05,2.8,13);
 [3.2,4.0,4.8,5.6,6.4,7.2].forEach((a,i)=>{tone('sine',62,38,.2,.55-i*.04,a);tone('sine',58,36,.2,.45-i*.04,a+.26);});
 nz(1.0,'bandpass',180,1000,.5,5.2);tone('sawtooth',220,55,.9,.1,5.26);nz(.35,'highpass',2500,6000,.35,5.26);nz(.55,'lowpass',1200,100,.85,5.26);tone('sine',120,28,.7,.8,5.26);nz(.4,'lowpass',1400,160,.65,6.3);
 [5.6,5.95,6.4,6.9].forEach(a=>{tone('sine',320,110,.07,.12,a);});
 tone('sine',95,34,.45,.65,8.5);nz(.35,'lowpass',1800,150,.55,8.5);
 tone('sine',55,35,1.4,.5,8.7);}
function sfx(type){if(type==='cop_rasengan')type='rasengan';if(type==='cop_bunshin')type='bunshin';
 if(type==='shishi'){nz(.3,'bandpass',500,2400,.22,.5);nz(.12,'highpass',3000,8000,.3,.85);tone('sine',110,38,.4,.7,.85);[1.2,1.35,1.5,1.65,1.8].forEach(a=>{nz(.08,'bandpass',1500,700,.4,a);tone('sine',130,50,.15,.45,a);});nz(.3,'highpass',2500,8000,.3,2.1);tone('sine',60,26,.9,.9,2.2);nz(.7,'lowpass',2600,160,.8,2.2);return;}
 if(type==='selochidori'){tone('sine',55,48,1.8,.35,.7);nz(1.6,'bandpass',200,900,.22,.8);tone('sawtooth',90,400,1.1,.05,1.0,8);nz(.5,'highpass',3000,9000,.25,1.9);tone('sine',2600,3600,.7,.04,2.4);nz(.3,'highpass',3500,9000,.6,3.2);nz(.5,'lowpass',2000,150,.8,3.2);tone('sine',90,28,.7,.8,3.2);return;}
 if(type==='selo2'){tone('sine',48,40,2.4,.45,.6);nz(2.0,'bandpass',180,1000,.28,.7);tone('sawtooth',80,520,1.6,.06,.9,9);[1.3,1.6,1.9,2.2].forEach(a=>tone('sine',60,34,.22,.45,a));nz(.6,'highpass',3000,9000,.4,2.0);tone('sine',90,28,1.0,.9,2.4);nz(.9,'lowpass',2600,150,.8,2.4);nz(.5,'highpass',3500,9000,.5,2.45);return;}
 if(type==='selo'){tone('sine',55,48,1.8,.4,.7);nz(1.6,'bandpass',200,900,.2,.8);tone('sawtooth',90,380,1.1,.05,1.0,8);[1.2,1.5,1.8].forEach(a=>tone('sine',70,40,.2,.4,a));nz(.4,'highpass',3000,9000,.35,2.0);tone('sine',110,40,.6,.6,2.0);return;}
 if(type==='copy'){tone('sine',900,1500,.9,.05,.6);nz(.6,'highpass',3500,8000,.1,.6);tone('sine',70,40,.7,.35,.7);tone('sine',1700,2200,.5,.04,1.4);return;}
 if(type==='genjutsu'){tone('sine',80,45,1.0,.4,.6);nz(.5,'bandpass',400,2200,.2,.7);tone('sawtooth',400,1100,.5,.06,1.0);nz(.35,'highpass',3000,9000,.3,1.5);tone('sine',120,40,.4,.5,1.5);return;}
 if(type==='soushuken'){[.75,.85].forEach(a=>nz(.2,'highpass',3000,8000,.25,a));tone('sine',2400,3400,.9,.04,1.0);nz(.9,'highpass',3500,9000,.07,.9);[1.8,1.95].forEach(a=>{nz(.1,'bandpass',1400,600,.35,a);tone('sine',3000,2400,.12,.07,a);tone('sine',120,50,.2,.4,a);});return;}
 if(type==='kagesh'){nz(.2,'highpass',3000,8000,.3,.85);tone('sine',70,38,.8,.25,.85);nz(.6,'highpass',2500,8000,.1,.9);tone('sine',1200,700,.6,.05,1.1);nz(.3,'highpass',3500,9000,.35,1.5);tone('sine',130,34,.4,.7,1.5);nz(.25,'lowpass',2400,200,.55,1.5);return;}
 if(type==='kunai'){nz(.12,'highpass',3000,8000,.22,.85);tone('sine',2000,2600,.35,.05,.9);nz(.1,'bandpass',1200,600,.35,1.25);tone('sine',3400,2800,.15,.08,1.25);tone('sine',120,50,.2,.4,1.25);return;}
 if(type==='shuriken'){[.95,1.1,1.25].forEach(a=>{nz(.14,'highpass',2500,7000,.18,a);tone('sine',1800,2400,.3,.04,a+.05);});[1.5,1.62,1.75].forEach(a=>{nz(.08,'bandpass',1400,700,.3,a);tone('sine',3000,2400,.1,.07,a);tone('sine',110,50,.15,.35,a);});return;}
 if(type==='soco'){nz(.3,'bandpass',500,2400,.2,.45);nz(.1,'highpass',3000,7000,.2,.85);tone('sine',110,40,.4,.7,.95);nz(.22,'lowpass',2500,300,.6,.95);return;}
 if(type==='chute'){nz(.4,'bandpass',600,2800,.22,.5);nz(.15,'highpass',3000,8000,.25,1.0);tone('sine',100,34,.5,.8,1.35);nz(.3,'lowpass',2600,200,.65,1.35);return;}
 if(type==='rasengan'){tone('sawtooth',180,900,.8,.06,.75,24);nz(.8,'bandpass',500,3000,.12,.75);nz(.45,'bandpass',600,2600,.22,1.65);tone('sine',140,45,.5,.6,2.2);nz(.5,'lowpass',2800,200,.6,2.2);nz(.5,'highpass',2500,7000,.2,2.2);return;}
 if(type==='nkunai'){nz(.12,'bandpass',3000,1200,.2,NK_THROW);nz(.15,'highpass',2000,500,.3,NK_HIT);return;}
 if(type==='nshuriken'){[.55,.75,.95].forEach(a=>nz(.1,'bandpass',3200,1400,.18,a));[.95,1.15,1.35].forEach(a=>nz(.12,'highpass',2000,500,.25,a));return;}
 if(type==='teppodama'){nz(.4,'bandpass',800,1800,.25,TP_FIRE);tone('sine',70,40,.4,.5,TP_FIRE);nz(.6,'lowpass',1800,200,.6,TP_HIT);if(anim&&anim.lethal){nz(.5,'bandpass',300,900,.3,TPF_UP);tone('sine',55,25,1,.9,TPF_LAND);nz(.9,'lowpass',1400,120,.9,TPF_LAND);}return;}
 if(type==='kuchiyose'){[.6,.8].forEach(a=>nz(.1,'bandpass',2000,1000,.1,a));tone('sine',90,40,.5,.6,KU_SLAM);nz(.6,'bandpass',400,2000,.35,KU_IN-.15);tone('sine',60,30,.8,.7,KU_IN);nz(.4,'bandpass',800,1800,.25,KU_FIRE);nz(.6,'lowpass',1800,200,.6,KU_HIT);nz(.5,'bandpass',500,2400,.3,KU_OUT-.05);return;}
 if(type==='kamikaze'){[.65,.85].forEach(a=>nz(.1,'bandpass',2000,1000,.1,a));nz(.4,'bandpass',500,2400,.22,1.0);nz(1.3,'bandpass',900,1600,.25,KM_IN);KM_HITS.forEach(a=>{tone('sine',150,60,.2,.4,a);nz(.15,'lowpass',2600,300,.35,a);});tone('sine',110,40,.5,.6,KM_END);nz(.5,'lowpass',2400,200,.6,KM_END);return;}
 if(type==='harem'){[0,.06,.12,.18,.24].forEach(d=>nz(.3,'bandpass',500,2400,.2,OIR_ON-.1+d));[0,.15,.3].forEach(d=>tone('sine',880,1320,.2,.22,OIR_ON+.3+d));nz(.5,'bandpass',500,2400,.25,OIR_OFF-.1);return;}
 if(type==='rasengan'&&anim&&anim.lethal&&kyuT>0){tone('sawtooth',80,40,1.2,.4,2.3);nz(1.2,'lowpass',900,150,.7,2.9);}
 if(type==='kyuubi'){tone('sawtooth',90,60,.9,.35,.4);nz(.9,'lowpass',900,200,.5,.5);tone('sine',60,30,.7,.8,KY_ON);nz(.8,'bandpass',600,1400,.5,KY_ON);return;}
 if(type==='oiroke'){nz(.4,'bandpass',500,2400,.22,OIR_ON-.1);tone('sine',880,1320,.25,.25,OIR_ON+.3);nz(.4,'bandpass',500,2400,.22,OIR_OFF-.1);return;}
 if(type==='uzumaki'){[.65,.85].forEach(a=>nz(.1,'bandpass',2000,1000,.1,a));nz(.4,'bandpass',500,2400,.22,1.0);UZK.forEach(a=>{tone('sine',150,60,.22,.45,a);nz(.18,'lowpass',2600,300,.4,a);});nz(.3,'bandpass',800,3000,.18,2.45);tone('sine',90,30,.6,.7,UZ_SLAM);nz(.6,'lowpass',2000,150,.7,UZ_SLAM);return;}
 if(type==='bunshin'){[.65,.85].forEach(a=>nz(.1,'bandpass',2000,1000,.1,a));nz(.4,'bandpass',500,2400,.22,1.15);[1.9,2.45,3.0].forEach(a=>{tone('sine',120,50,.25,.45,a);nz(.2,'lowpass',2400,300,.4,a);});nz(.4,'bandpass',500,3000,.2,3.3);tone('sine',140,40,.5,.65,3.6);nz(.5,'lowpass',2600,200,.6,3.6);return;}
 if(type==='kawarimi'){[.5,.75,1.0].forEach(a=>nz(.1,'bandpass',2000,1000,.1,a));nz(.45,'bandpass',600,2600,.2,1.15);tone('sine',150,50,.3,.5,1.62);nz(.4,'highpass',1500,4000,.25,1.62);nz(.3,'bandpass',800,200,.3,1.9);tone('sine',130,40,.4,.55,2.68);nz(.3,'lowpass',2500,200,.5,2.68);return;}
 if(type==='amaterasu'){tone('sine',60,50,1.2,.25,1.0);nz(.5,'bandpass',400,2400,.25,1.2);tone('sawtooth',300,900,.4,.08,1.25);nz(1.9,'highpass',3000,6000,.05,2.0);nz(1.6,'lowpass',500,150,.4,2.0);tone('sine',90,40,.5,.5,2.0);return;}
 if(type==='chidori'){[.55,.85,1.15].forEach(a=>nz(.12,'bandpass',2200,1200,.12,a));tone('sawtooth',2600,4200,.8,.04,1.4,26);nz(.8,'highpass',3500,6000,.07,1.4);
  nz(.4,'bandpass',500,3200,.2,2.15);nz(.3,'highpass',2000,5000,.12,2.2);tone('sine',140,38,.55,.6,2.58);nz(.45,'lowpass',2600,200,.55,2.58);nz(.5,'highpass',2500,7000,.2,2.58);}
 else{[.5,.7,.9,1.1,1.3].forEach(a=>nz(.1,'bandpass',2000,1000,.1,a));nz(.35,'bandpass',300,1400,.18,1.45);nz(.7,'lowpass',1200,300,.35,1.82);tone('sawtooth',90,60,.6,.08,1.82);
  tone('sine',110,30,.7,.65,2.4);nz(.9,'lowpass',2000,150,.6,2.4);}
}

