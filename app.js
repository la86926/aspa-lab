(()=>{
const SIMPLE=[[1,2,1,3],[2,1,1,3],[3,-2,2,1],[3,1,4,-5],[4,3,2,-1]];
const DOUBLE=[[1,4,1,1,1,1],[3,1,5,1,-2,2],[2,3,-1,1,-1,4],[2,1,-2,1,3,-3],[3,4,1,1,2,2]];
let mode='simple',idx=0,phase=1,points=0,stars=0,current=[],slots=[],chips=[],selected=null;
const $=id=>document.getElementById(id);
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const first=(n,t='')=>{const a=Math.abs(n),c=t&&a===1?'':a;return`${n<0?'−':''}${c}${t}`};
const later=(n,t='')=>{const a=Math.abs(n),c=t&&a===1?'':a;return`${n<0?'−':'+'} ${c}${t}`};
function data(v){if(mode==='simple'){const[a,b,c,d]=v;return{x2:a*c,x:a*d+c*b,c:b*d}}const[a,b,c,d,e,f]=v;return{x2:a*d,xy:a*e+d*b,y2:b*e,x:a*f+d*c,y:b*f+e*c,c:c*f}}
function poly(v){const p=data(v);if(mode==='simple')return`${first(p.x2,'x²')} ${later(p.x,'x')} ${later(p.c)}`;return`${first(p.x2,'x²')} ${later(p.xy,'xy')} ${later(p.y2,'y²')} ${later(p.x,'x')} ${later(p.y,'y')} ${later(p.c)}`}
function factors(v){if(mode==='simple'){const[a,b,c,d]=v;return`(${first(a,'x')} ${later(b)})(${first(c,'x')} ${later(d)})`}const[a,b,c,d,e,f]=v;return`(${first(a,'x')} ${later(b,'y')} ${later(c)})(${first(d,'x')} ${later(e,'y')} ${later(f)})`}
function same(a,b){return a.length===b.length&&a.every((v,i)=>v===b[i])}
function equivalent(a,b){if(same(a,b))return true;if(mode==='simple')return same(a,[b[2],b[3],b[0],b[1]]);return same(a,[b[3],b[4],b[5],b[0],b[1],b[2]])}
function setFeedback(type,msg){const f=$('feedback');f.className=`feedback show ${type}`;f.textContent=msg}
function clearFeedback(){$('feedback').className='feedback';$('feedback').textContent=''}
function updateStats(){$('points').textContent=points;$('stars').textContent=stars;$('round').textContent=idx+1}
function updatePhase(){
  $('phase1').classList.toggle('hidden',phase!==1);$('phase2').classList.toggle('hidden',phase!==2);$('phase3').classList.toggle('hidden',phase!==3);
  $('phaseBadge').textContent=`Fase ${phase} de 3`;$('progressBar').style.width=`${phase*33.333}%`;
  const titles=['','1. Detecta la estructura','2. Construye los factores','3. Comprueba cada cruce'];$('missionTitle').textContent=titles[phase];
  [1,2,3].forEach(n=>{const r=$(`road${n}`);r.className='road'+(n<phase?' done':n===phase?' active':'')});
}
function concept(){
  if(mode==='simple'){
    $('conceptTitle').textContent='El término central nace de dos productos';
    $('conceptBody').innerHTML='<div class="concept-row"><b>1</b><div><strong>Construye los extremos</strong><small>Los productos horizontales generan el término cuadrático y el independiente.</small></div></div><div class="concept-row"><b>2</b><div><strong>Cruza y suma</strong><small>Los dos productos diagonales deben sumar exactamente el coeficiente de x.</small></div></div><div class="concept-row"><b>3</b><div><strong>Lee las filas</strong><small>Si el cruce coincide, cada fila es un factor.</small></div></div>';
    $('coachText').textContent='Pídele que diga: “estos dos productos deben sumar el término central”. Esa frase obliga a comprender el sentido del aspa.';
  }else{
    $('conceptTitle').textContent='En aspa doble hay tres comprobaciones distintas';
    $('conceptBody').innerHTML='<div class="concept-row"><b>1</b><div><strong>Aspa xy</strong><small>Cruza x con y y reconstruye el coeficiente de xy.</small></div></div><div class="concept-row"><b>2</b><div><strong>Aspa y</strong><small>Cruza y con las constantes y obtiene el término en y.</small></div></div><div class="concept-row"><b>3</b><div><strong>Aspa grande x</strong><small>Cruza x con las constantes y obtiene el término en x.</small></div></div>';
    $('coachText').textContent='Haz que nombre cada aspa antes de multiplicar: “esta produce xy, esta produce y y esta produce x”. Así deja de ver líneas sin significado.';
  }
}
function distract(v,n){const d=v.slice();const positions=shuffle([...d.keys()]);for(let k=0;k<n;k++){const i=positions[k];if(k%2===0)d[i]=-d[i];else d[i]=d[i]+(d[i]>=0?1:-1)}return d}
function renderChoices(){
  let a=distract(current,1),b=distract(current,2);if(equivalent(a,current))a=distract(current,3);if(equivalent(b,current)||same(a,b))b=distract(current,3);
  const opts=shuffle([{v:current,ok:true},{v:a,ok:false},{v:b,ok:false}]);
  $('choices').innerHTML=opts.map((o,i)=>`<button class="choice" data-ok="${o.ok}" data-i="${i}" type="button">${factors(o.v)}</button>`).join('');
  $('choices').querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
    if(phase!==1)return;
    if(btn.dataset.ok==='true'){
      btn.classList.add('good');points+=10;stars++;phase=2;updateStats();updatePhase();setFeedback('ok','Bien. Ahora no copies la respuesta: constrúyela con las fichas.');
    }else{btn.classList.add('bad');setFeedback('bad','Esa opción falla. Revisa signos y piensa qué productos deben aparecer en los extremos y en los cruces.')}
  }))
}
function makeChips(){const extras=current.map((v,i)=>i%2===0?(v===0?2:-v):(v+(v>=0?1:-1)));chips=shuffle(current.concat(extras)).map((value,id)=>({id,value,used:false}));selected=null}
function slotButton(i,label){return`<button class="slot" data-slot="${i}" type="button" aria-label="${label}">?</button>`}
function renderBuild(){
  slots=new Array(mode==='simple'?4:6).fill(null);makeChips();
  if(mode==='simple')$('factorArea').innerHTML=`<div class="factor-card"><strong>Factor 1</strong><div class="slot-row">${slotButton(0,'coeficiente x factor 1')}<span class="sym">x</span><span class="sym">+</span>${slotButton(1,'constante factor 1')}</div></div><div class="factor-card"><strong>Factor 2</strong><div class="slot-row">${slotButton(2,'coeficiente x factor 2')}<span class="sym">x</span><span class="sym">+</span>${slotButton(3,'constante factor 2')}</div></div>`;
  else $('factorArea').innerHTML=`<div class="factor-card"><strong>Factor 1</strong><div class="slot-row">${slotButton(0,'coeficiente x factor 1')}<span class="sym">x</span><span class="sym">+</span>${slotButton(1,'coeficiente y factor 1')}<span class="sym">y</span><span class="sym">+</span>${slotButton(2,'constante factor 1')}</div></div><div class="factor-card"><strong>Factor 2</strong><div class="slot-row">${slotButton(3,'coeficiente x factor 2')}<span class="sym">x</span><span class="sym">+</span>${slotButton(4,'coeficiente y factor 2')}<span class="sym">y</span><span class="sym">+</span>${slotButton(5,'constante factor 2')}</div></div>`;
  wireSlots();renderBank()
}
function renderBank(){$('bank').innerHTML=chips.map(c=>`<button class="chip${c.used?' used':''}${selected===c.id?' selected':''}" data-chip="${c.id}" type="button">${c.value}</button>`).join('');$('bank').querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{const id=+b.dataset.chip,item=chips.find(c=>c.id===id);if(!item||item.used)return;selected=selected===id?null:id;renderBank()}))}
function wireSlots(){$('factorArea').querySelectorAll('.slot').forEach(s=>s.addEventListener('click',()=>{if(phase!==2)return;const i=+s.dataset.slot;if(slots[i]!==null){const old=+s.dataset.chip;const item=chips.find(c=>c.id===old);if(item)item.used=false;slots[i]=null;delete s.dataset.chip;paintSlots();renderBank();preview();return}if(selected===null)return;const item=chips.find(c=>c.id===selected);if(!item||item.used)return;slots[i]=item.value;item.used=true;s.dataset.chip=item.id;selected=null;paintSlots();renderBank();preview()}));paintSlots()}
function paintSlots(){$('factorArea').querySelectorAll('.slot').forEach(s=>{const v=slots[+s.dataset.slot];s.textContent=v===null?'?':v;s.classList.toggle('filled',v!==null)})}
function preview(){if(slots.every(v=>v!==null))$('expansion').textContent=poly(slots);else $('expansion').textContent='Completa todos los espacios para ver la expansión.'}
function clearBuild(){slots.fill(null);chips.forEach(c=>c.used=false);selected=null;$('factorArea').querySelectorAll('.slot').forEach(s=>delete s.dataset.chip);paintSlots();renderBank();$('expansion').textContent='—';clearFeedback()}
function checkBuild(){if(slots.some(v=>v===null)){setFeedback('warn','Faltan fichas por colocar.');return}if(!equivalent(slots,current)){setFeedback('bad','Todavía no coincide. Mira los signos y la posición de cada coeficiente.');$('expansion').textContent=poly(slots);return}points+=15;stars+=2;phase=3;updateStats();updatePhase();$('expansion').textContent=poly(slots);drawAspa(slots);renderChecks(slots);setFeedback('ok','Construcción correcta. Ahora mira qué término produce cada aspa.');setTimeout(animateAspa,250)}
function svgNode(x,y,text){return`<circle class="node" cx="${x}" cy="${y}" r="42"></circle><text class="node-text" x="${x}" y="${y}">${text}</text>`}
function line(id,cls,x1,y1,x2,y2){return`<line id="${id}" class="cross ${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>`}
function label(x,y,text){return`<rect class="label-bg" x="${x-54}" y="${y-18}" width="108" height="36" rx="18"></rect><text class="label-text" x="${x}" y="${y+6}">${text}</text>`}
function drawAspa(v){const svg=$('aspaSvg');if(mode==='simple'){const[a,b,c,d]=v;svg.innerHTML=line('xy1','xy',190,100,530,260)+line('xy2','xy',530,100,190,260)+svgNode(190,100,first(a,'x'))+svgNode(190,260,b)+svgNode(530,100,first(c,'x'))+svgNode(530,260,d)+label(360,180,`${a}·${d} + ${c}·${b}`)}else{const[a,b,c,d,e,f]=v;svg.innerHTML=line('xy1','xy',190,65,530,180)+line('xy2','xy',530,65,190,180)+line('yc1','yc',190,180,530,295)+line('yc2','yc',530,180,190,295)+line('xc1','xc',190,65,530,295)+line('xc2','xc',530,65,190,295)+svgNode(190,65,first(a,'x'))+svgNode(190,180,first(b,'y'))+svgNode(190,295,c)+svgNode(530,65,first(d,'x'))+svgNode(530,180,first(e,'y'))+svgNode(530,295,f)}}
function renderChecks(v){const p=data(v);if(mode==='simple')$('checks').innerHTML=`<div class="check-card xy"><strong>Aspa central → ${p.x}x</strong><small>${v[0]}·${v[3]} + ${v[2]}·${v[1]} = ${p.x}. Esa suma reconstruye el término central.</small></div>`;else $('checks').innerHTML=`<div class="check-card xy"><strong>Aspa morada → ${p.xy}xy</strong><small>${v[0]}·${v[4]} + ${v[3]}·${v[1]} = ${p.xy}</small></div><div class="check-card yc"><strong>Aspa naranja → ${p.y}y</strong><small>${v[1]}·${v[5]} + ${v[4]}·${v[2]} = ${p.y}</small></div><div class="check-card xc"><strong>Aspa verde → ${p.x}x</strong><small>${v[0]}·${v[5]} + ${v[3]}·${v[2]} = ${p.x}</small></div>`}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function animateAspa(){const groups=mode==='simple'?[['xy1','xy2']]:[['xy1','xy2'],['yc1','yc2'],['xc1','xc2']];document.querySelectorAll('.cross').forEach(l=>l.classList.remove('active'));for(const g of groups){g.forEach(id=>$(id)?.classList.add('active'));await wait(700);g.forEach(id=>$(id)?.classList.remove('active'));await wait(120)}}
function load(){current=(mode==='simple'?SIMPLE:DOUBLE)[idx%(mode==='simple'?SIMPLE.length:DOUBLE.length)].slice();phase=1;clearFeedback();$('problem').textContent=poly(current);$('expansion').textContent='—';concept();renderChoices();renderBuild();$('checks').innerHTML='';$('aspaSvg').innerHTML='';updateStats();updatePhase()}
function next(){idx=(idx+1)%(mode==='simple'?SIMPLE.length:DOUBLE.length);load()}
$('simpleTab').addEventListener('click',()=>{mode='simple';idx=0;$('simpleTab').classList.add('active');$('doubleTab').classList.remove('active');load()});
$('doubleTab').addEventListener('click',()=>{mode='double';idx=0;$('doubleTab').classList.add('active');$('simpleTab').classList.remove('active');load()});
$('newBtn').addEventListener('click',next);$('clearBtn').addEventListener('click',clearBuild);$('checkBuildBtn').addEventListener('click',checkBuild);$('animateBtn').addEventListener('click',animateAspa);$('nextBtn').addEventListener('click',next);
load();
})();