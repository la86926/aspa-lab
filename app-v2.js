(()=>{
const $=id=>document.getElementById(id);

const SIMPLE=[
 {kind:'pair',chip:'1 · PAREJA',title:'Encuentra las magnitudes',q:{b:5,c:6,pair:[3,2],opts:[[6,1],[3,2],[4,2]]}},
 {kind:'pair',chip:'1 · PAREJA',title:'Encuentra las magnitudes',q:{b:-5,c:6,pair:[3,2],opts:[[5,1],[3,2],[6,2]]}},
 {kind:'pair',chip:'1 · PAREJA',title:'Encuentra las magnitudes',q:{b:1,c:-6,pair:[3,2],opts:[[6,1],[3,2],[4,1]]}},
 {kind:'sign',chip:'2 · SIGNOS',title:'Ahora coloca los signos',q:{b:-5,c:6,pair:[3,2]}},
 {kind:'sign',chip:'2 · SIGNOS',title:'Ahora coloca los signos',q:{b:1,c:-6,pair:[3,2]}},
 {kind:'sign',chip:'2 · SIGNOS',title:'Ahora coloca los signos',q:{b:-1,c:-6,pair:[3,2]}},
 {kind:'factor',chip:'3 · FACTORES',title:'Forma los dos factores',q:{b:-5,c:6,pair:[3,2]}},
 {kind:'factor',chip:'3 · FACTORES',title:'Forma los dos factores',q:{b:1,c:-6,pair:[3,2]}},
 {kind:'factor',chip:'3 · FACTORES',title:'Forma los dos factores',q:{b:-1,c:-6,pair:[3,2]}},
 {kind:'aspa',chip:'4 · ASPA',title:'Comprueba el cruce',q:{v:[2,1,1,3]}},
 {kind:'aspa',chip:'4 · ASPA',title:'Comprueba el cruce',q:{v:[3,-2,2,1]}},
 {kind:'aspa',chip:'4 · ASPA',title:'Comprueba el cruce',q:{v:[4,3,2,-1]}}
];

const DOUBLE=[
 {kind:'doubleIntro',chip:'1 · TRES CRUCES',title:'Cada color tiene una misión',q:{v:[1,4,1,1,1,1]}},
 {kind:'doublePick',chip:'2 · IDENTIFICA',title:'¿Qué término produce?',q:{v:[3,1,5,1,-2,2],ask:'xy'}},
 {kind:'doublePick',chip:'2 · IDENTIFICA',title:'¿Qué término produce?',q:{v:[3,1,5,1,-2,2],ask:'y'}},
 {kind:'doublePick',chip:'2 · IDENTIFICA',title:'¿Qué término produce?',q:{v:[3,1,5,1,-2,2],ask:'x'}},
 {kind:'doubleFactor',chip:'3 · FACTORIZA',title:'Haz coincidir los tres cruces',q:{v:[1,4,1,1,1,1]}},
 {kind:'doubleFactor',chip:'3 · FACTORIZA',title:'Haz coincidir los tres cruces',q:{v:[3,1,5,1,-2,2]}},
 {kind:'doubleFactor',chip:'3 · FACTORIZA',title:'Haz coincidir los tres cruces',q:{v:[2,3,-1,1,-1,4]}}
];

let route='simple',step=0,stars=0,status='';

const first=(n,t='')=>{const a=Math.abs(n),c=t&&a===1?'':a;return`${n<0?'−':''}${c}${t}`};
const later=(n,t='')=>{const a=Math.abs(n),c=t&&a===1?'':a;return`${n<0?'−':'+'} ${c}${t}`};
const sCalc=v=>{const[a,b,c,d]=v;return{x2:a*c,x:a*d+b*c,c:b*d}};
const dCalc=v=>{const[a,b,c,d,e,f]=v;return{x2:a*d,xy:a*e+b*d,y2:b*e,x:a*f+c*d,y:b*f+c*e,c:c*f}};
const sPoly=v=>{const p=sCalc(v);return`${first(p.x2,'x²')} ${later(p.x,'x')} ${later(p.c)}`};
const dPoly=v=>{const p=dCalc(v);return`${first(p.x2,'x²')} ${later(p.xy,'xy')} ${later(p.y2,'y²')} ${later(p.x,'x')} ${later(p.y,'y')} ${later(p.c)}`};
const sFactors=v=>{const[a,b,c,d]=v;return`(${first(a,'x')} ${later(b)})(${first(c,'x')} ${later(d)})`};
const dFactors=v=>{const[a,b,c,d,e,f]=v;return`(${first(a,'x')} ${later(b,'y')} ${later(c)})(${first(d,'x')} ${later(e,'y')} ${later(f)})`};

function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function setRoute(r){route=r;document.querySelectorAll('.route-card').forEach(b=>b.classList.toggle('active',b.dataset.route===r));$('routeName').textContent=r==='simple'?'Aspa simple':'Aspa doble'}
function show(id){['startScreen','playScreen','finishScreen'].forEach(x=>$(x).classList.toggle('hidden',x!==id))}
function data(){return route==='simple'?SIMPLE:DOUBLE}
function updateHud(){$('stars').textContent=stars;$('routeName').textContent=route==='simple'?'Aspa simple':'Aspa doble'}
function updateProgress(){const total=data().length;$('progressBar').style.width=`${step/total*100}%`;$('counter').textContent=`${step+1}/${total}`}
function start(){step=0;status='';show('playScreen');render()}
function trinomial(q){return `x² ${later(q.b,'x')} ${later(q.c)}`}

function ruleFor(q){
 const same=q.c>0;
 return {same, relation:same?'SUMA':'DIFERENCIA', relWord:same?'mismo signo':'signos distintos'};
}
function signedPair(q){
 const [big,small]=q.pair;
 const bigSigned=q.b<0?-big:big;
 const smallSigned=q.c>0?(q.b<0?-small:small):(q.b<0?small:-small);
 return [bigSigned,smallSigned];
}
function targetCards(q){
 const r=ruleFor(q);
 return `<div class="target-row">
   <div class="target center"><small>${r.relation}</small><b>${Math.abs(q.b)}</b></div>
   <div class="target product"><small>PRODUCTO</small><b>${Math.abs(q.c)}</b></div>
 </div>
 <div class="sign-rule"><span class="const ${q.c>0?'plus':'minus'}">${q.c>0?'+':'−'} independiente</span><span>→</span><span>${r.relWord}</span></div>`;
}
function choicePairText(p,q){
 const r=ruleFor(q); const relation=r.same?p[0]+p[1]:Math.abs(p[0]-p[1]);
 return `<b>${p[0]} · ${p[1]}</b><small>${r.relation.toLowerCase()} ${relation} · producto ${p[0]*p[1]}</small>`;
}
function render(){
 const item=data()[step];status='';$('feedback').className='feedback hidden';$('stageChip').textContent=item.chip;$('stageTitle').textContent=item.title;updateProgress();updateHud();
 if(item.kind==='pair') pairGame(item.q);
 else if(item.kind==='sign') signGame(item.q);
 else if(item.kind==='factor') factorGame(item.q);
 else if(item.kind==='aspa') aspaGame(item.q);
 else if(item.kind==='doubleIntro') doubleIntro(item.q);
 else if(item.kind==='doublePick') doublePick(item.q);
 else doubleFactor(item.q);
}
function wire(sel,fn){document.querySelectorAll(sel).forEach(b=>b.addEventListener('click',()=>fn(b)))}
function good(title,visual){stars++;updateHud();status='good';$('feedback').className='feedback good';$('feedbackIcon').textContent='✓';$('feedbackTitle').textContent=title;$('feedbackVisual').innerHTML=visual;$('feedbackBtn').textContent='Continuar';}
function retry(title,visual){status='retry';$('feedback').className='feedback try';$('feedbackIcon').textContent='↻';$('feedbackTitle').textContent=title;$('feedbackVisual').innerHTML=visual;$('feedbackBtn').textContent='Intentar otra vez';}
function hint(){
 const item=data()[step],q=item.q;
 if(['pair','sign','factor'].includes(item.kind)){
   const r=ruleFor(q),[big]=q.pair;
   $('feedback').className='feedback try';$('feedbackIcon').textContent='💡';$('feedbackTitle').textContent='Pista';
   $('feedbackVisual').innerHTML=`<span class="visual-strong">${q.c>0?'+':'−'} independiente</span> → ${r.relWord}. El <span class="visual-strong">${big}</span> es el mayor y recibirá el signo de ${q.b<0?'−':'+'}${Math.abs(q.b)}x.`;
   $('feedbackBtn').textContent='Entendido';status='hint';
 }else{
   $('feedback').className='feedback try';$('feedbackIcon').textContent='💡';$('feedbackTitle').textContent='Pista';
   $('feedbackVisual').innerHTML='Sigue solo las líneas de color: multiplica cada diagonal y suma los dos resultados.';
   $('feedbackBtn').textContent='Entendido';status='hint';
 }
}

function pairGame(q){
 const r=ruleFor(q);
 $('gameArea').innerHTML=`<div class="trinomial">${trinomial(q)}</div>${targetCards(q)}
 <div class="choice-grid">${shuffle(q.opts).map(p=>`<button class="choice" data-p="${p.join(',')}" type="button">${choicePairText(p,q)}</button>`).join('')}</div>`;
 wire('.choice',b=>{
   const p=b.dataset.p.split(',').map(Number);
   const ok=(p[0]===q.pair[0]&&p[1]===q.pair[1])||(p[1]===q.pair[0]&&p[0]===q.pair[1]);
   if(ok){b.classList.add('correct');good('Pareja encontrada',`<span class="visual-strong">${p[0]} y ${p[1]}</span> cumplen ${r.relation.toLowerCase()} ${Math.abs(q.b)} y producto ${Math.abs(q.c)}.`)}
   else{b.classList.add('wrong');retry('Revisa las dos metas',`Debe cumplir <span class="visual-strong">${r.relation.toLowerCase()} ${Math.abs(q.b)}</span> y <span class="visual-strong">producto ${Math.abs(q.c)}</span>.`)}
 });
}

function signGame(q){
 const [big,small]=q.pair,correct=signedPair(q);
 const opts=shuffle([[big,small],[-big,-small],[big,-small],[-big,small]]).filter((x,i,a)=>a.findIndex(y=>y[0]===x[0]&&y[1]===x[1])===i).slice(0,3);
 if(!opts.some(x=>x[0]===correct[0]&&x[1]===correct[1])) opts[2]=correct;
 $('gameArea').innerHTML=`<div class="trinomial">${trinomial(q)}</div>
 <div class="number-pair"><div class="num-orb larger"><span class="tag">MAYOR</span>${big}</div><div class="num-orb">${small}</div></div>
 <div class="sign-rule"><span>El <b>${big}</b> toma el signo de <b>${q.b<0?'−':'+'}${Math.abs(q.b)}x</b></span></div>
 <div class="sign-options">${shuffle(opts).map(p=>`<button class="sign-option" data-p="${p.join(',')}" type="button">${p[0]>0?'+':''}${p[0]} &nbsp; ${p[1]>0?'+':''}${p[1]}</button>`).join('')}</div>`;
 wire('.sign-option',b=>{
  const p=b.dataset.p.split(',').map(Number),ok=p[0]===correct[0]&&p[1]===correct[1];
  if(ok){
    b.classList.add('correct');
    const relation=q.c>0?'mismo signo':'signo contrario';
    good('Signos listos',`<div class="sign-demo"><div class="demo-orb big ${correct[0]<0?'neg':'pos'}">${correct[0]>0?'+':''}${correct[0]}</div><span class="demo-arrow">→</span><div class="demo-orb ${correct[1]<0?'neg':'pos'}">${correct[1]>0?'+':''}${correct[1]}</div><div class="demo-note">Mayor: signo de <b>${q.b<0?'−':'+'}${Math.abs(q.b)}x</b> · Independiente ${q.c>0?'+':'−'}: <b>${relation}</b></div></div>`);
  }else{
    b.classList.add('wrong');
    retry('Primero el mayor',`<span class="visual-strong">${big}</span> recibe ${q.b<0?'−':'+'}. Luego ${q.c>0?'<b>+</b> obliga a repetir el signo':'<b>−</b> obliga a usar el signo contrario'}.`);
  }
 });
}

function factorGame(q){
 const [m,n]=signedPair(q),correct=`(x ${later(m)})(x ${later(n)})`;
 const opts=shuffle([
   correct,
   `(x ${later(-m)})(x ${later(n)})`,
   `(x ${later(m)})(x ${later(-n)})`
 ]).filter((x,i,a)=>a.indexOf(x)===i);
 $('gameArea').innerHTML=`<div class="trinomial">${trinomial(q)}</div>
 <div class="sign-demo"><div class="demo-orb ${m<0?'neg':'pos'}">${m>0?'+':''}${m}</div><div class="demo-orb ${n<0?'neg':'pos'}">${n>0?'+':''}${n}</div></div>
 <div class="choice-grid" style="margin-top:20px">${opts.map(x=>`<button class="choice" data-ok="${x===correct}" type="button"><b>${x}</b></button>`).join('')}</div>`;
 wire('.choice',b=>{
  if(b.dataset.ok==='true'){b.classList.add('correct');good('Factores formados',`<span class="visual-strong">${correct}</span>`)}
  else{b.classList.add('wrong');retry('Conserva los signos',`Usa exactamente <span class="visual-strong">${m>0?'+':''}${m}</span> y <span class="visual-strong">${n>0?'+':''}${n}</span>.`)}
 });
}

function aspaMarkup(v){
 const[a,b,c,d]=v,p=sCalc(v);
 return `<div class="aspa-wrap">
 <svg class="aspa-svg" viewBox="0 0 650 280" preserveAspectRatio="none">
   <line class="cross blue active" x1="110" y1="70" x2="540" y2="210"></line>
   <line class="cross pink active" x1="540" y1="70" x2="110" y2="210"></line>
 </svg>
 <div class="node lt">${first(a,'x')}</div><div class="node lb">${b}</div>
 <div class="node rt">${first(c,'x')}</div><div class="node rb">${d}</div>
 <div class="cross-result">${a}×${d} + ${c}×${b} = ${p.x}</div></div>`;
}
function aspaGame(q){
 const v=q.v,p=sCalc(v),wrong=p.x+(p.x>=0?2:-2);
 $('gameArea').innerHTML=`<div class="trinomial">${sPoly(v)}</div>${aspaMarkup(v)}
 <div class="choice-grid"><button class="choice" data-v="${p.x}" type="button"><b>${p.x}x</b></button><button class="choice" data-v="${wrong}" type="button"><b>${wrong}x</b></button><button class="choice" data-v="${-p.x}" type="button"><b>${-p.x}x</b></button></div>`;
 wire('.choice',b=>{if(+b.dataset.v===p.x){b.classList.add('correct');good('Ese es el aspa',`Los dos cruces suman <span class="visual-strong">${p.x}x</span>, el término lineal.`)}else{b.classList.add('wrong');retry('Suma los cruces',`<span class="visual-strong">${v[0]}×${v[3]} + ${v[2]}×${v[1]}</span>`)}})
}

function doubleLines(v,active='all'){
 const[a,b,c,d,e,f]=v;
 const on=x=>active==='all'||active===x?'active':'';
 return `<div class="aspa-wrap" style="height:310px">
 <svg class="aspa-svg" viewBox="0 0 650 310" preserveAspectRatio="none">
  <line class="cross violet ${on('xy')}" x1="105" y1="52" x2="545" y2="155"></line><line class="cross violet ${on('xy')}" x1="545" y1="52" x2="105" y2="155"></line>
  <line class="cross pink ${on('y')}" x1="105" y1="155" x2="545" y2="258"></line><line class="cross pink ${on('y')}" x1="545" y1="155" x2="105" y2="258"></line>
  <line class="cross blue ${on('x')}" x1="105" y1="52" x2="545" y2="258"></line><line class="cross blue ${on('x')}" x1="545" y1="52" x2="105" y2="258"></line>
 </svg>
 <div class="double-node" style="left:5%;top:5%">${first(a,'x')}</div><div class="double-node" style="left:5%;top:41%">${first(b,'y')}</div><div class="double-node" style="left:5%;bottom:5%">${c}</div>
 <div class="double-node" style="right:5%;top:5%">${first(d,'x')}</div><div class="double-node" style="right:5%;top:41%">${first(e,'y')}</div><div class="double-node" style="right:5%;bottom:5%">${f}</div>
 </div>`;
}
function doubleIntro(q){
 const p=dCalc(q.v);
 $('gameArea').innerHTML=`<div class="trinomial" style="font-size:clamp(1.4rem,4vw,2.6rem)">${dPoly(q.v)}</div>${doubleLines(q.v,'all')}
 <div class="target-row"><div class="target product"><small>MORADO</small><b>${p.xy}xy</b></div><div class="target center" style="background:var(--pinkSoft)"><small>ROSADO</small><b>${p.y}y</b></div><div class="target center"><small>AZUL</small><b>${p.x}x</b></div></div>
 <button id="understood" class="primary" type="button">Entendido →</button>`;
 $('understood').addEventListener('click',()=>good('Tres cruces, tres términos','<span class="visual-strong">xy · y · x</span>'));
}
function doublePick(q){
 const p=dCalc(q.v),target=p[q.ask],opts=shuffle([target,target+2,target-2]);
 $('gameArea').innerHTML=`<div class="trinomial" style="font-size:clamp(1.4rem,4vw,2.5rem)">${dPoly(q.v)}</div>${doubleLines(q.v,q.ask)}
 <div class="target-row"><div class="target center"><small>BUSCA</small><b>${q.ask}</b></div></div>
 <div class="choice-grid">${opts.map(x=>`<button class="choice" data-v="${x}" type="button"><b>${x}</b></button>`).join('')}</div>`;
 wire('.choice',b=>{if(+b.dataset.v===target){b.classList.add('correct');good('Cruce correcto',`Coeficiente de <span class="visual-strong">${q.ask}</span> = ${target}`)}else{b.classList.add('wrong');retry('Sigue el color','Multiplica solo las dos diagonales encendidas y suma.')}});
}
function dDistractors(v){const a=v.slice(),b=v.slice();a[1]=-a[1]||1;b[5]+=b[5]>=0?1:-1;return shuffle([v,a,b])}
function doubleFactor(q){
 const t=dCalc(q.v);
 $('gameArea').innerHTML=`<div class="trinomial" style="font-size:clamp(1.3rem,4vw,2.4rem)">${dPoly(q.v)}</div>
 <div class="choice-grid">${dDistractors(q.v).map(v=>`<button class="choice" data-v="${v.join(',')}" type="button"><b style="font-size:1.05rem">${dFactors(v)}</b></button>`).join('')}</div>`;
 wire('.choice',b=>{const v=b.dataset.v.split(',').map(Number),p=dCalc(v),ok=['x2','xy','y2','x','y','c'].every(k=>p[k]===t[k]);if(ok){b.classList.add('correct');good('Los tres cruces coinciden','<span class="visual-strong">xy ✓ &nbsp; y ✓ &nbsp; x ✓</span>')}else{b.classList.add('wrong');retry('Falta una coincidencia',`Esta opción produce xy ${p.xy}, y ${p.y}, x ${p.x}.`)}})
}

function advance(){
 if(status==='hint'||status==='retry'){$('feedback').className='feedback hidden';status='';return}
 if(status!=='good')return;
 step++;
 if(step>=data().length){finish();return}
 render();
}
function finish(){
 show('finishScreen');$('finishTitle').textContent=route==='simple'?'Aspa simple desbloqueada':'Aspa doble desbloqueada';
 $('finishText').textContent=route==='simple'?'Ya sabes elegir la pareja, colocar los signos y comprobar el cruce.':'Ya sabes qué debe producir cada uno de los tres cruces.';
 $('nextRouteBtn').classList.toggle('hidden',route==='double');
}
$('startBtn').addEventListener('click',start);
$('backBtn').addEventListener('click',()=>show('startScreen'));
$('hintBtn').addEventListener('click',hint);
$('feedbackBtn').addEventListener('click',advance);
$('homeBtn').addEventListener('click',()=>show('startScreen'));
$('nextRouteBtn').addEventListener('click',()=>{setRoute('double');start()});
document.querySelectorAll('.route-card').forEach(b=>b.addEventListener('click',()=>setRoute(b.dataset.route)));
setRoute('simple');show('startScreen');updateHud();
})();