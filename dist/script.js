const topics={
  corporativas:{count:'01 / 05',title:'Finanzas corporativas',description:'Decisiones de inversión, financiación y gobierno que determinan cómo una organización crea y sostiene valor.',items:['Fusiones y adquisiciones','Estructura de capital','Crecimiento y desempeño empresarial','Género en juntas directivas']},
  mercados:{count:'02 / 05',title:'Mercados financieros',description:'Dinámicas, instrumentos y comportamientos que explican cómo se asignan recursos y se forman precios.',items:['Liquidez de mercados','Gestión de portafolios','Instrumentos financieros','Análisis de mercados']},
  riesgos:{count:'03 / 05',title:'Ingeniería y riesgos',description:'Modelos y herramientas para identificar, medir y gestionar incertidumbre en decisiones financieras.',items:['Determinación y gestión del riesgo','Modelos predictivos','Opciones reales','Valoración de patentes']},
  banca:{count:'04 / 05',title:'Banca e instituciones',description:'El papel del sistema financiero, sus agentes y reglas en la movilización de recursos y el desarrollo económico.',items:['Instituciones financieras','Fuentes de financiación','Endeudamiento y mercados','Agentes del sistema financiero']},
  personales:{count:'05 / 05',title:'Finanzas personales',description:'Decisiones financieras de los hogares y su relación con el bienestar, la educación y la calidad de vida.',items:['Educación financiera','Ahorro e inversión','Bienestar financiero','Decisiones intertemporales']}
};

const qs=(s,c=document)=>c.querySelector(s);const qsa=(s,c=document)=>[...c.querySelectorAll(s)];
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add('is-ready')));

const menuButton=qs('.menu-button');const nav=qs('#site-nav');
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open);document.body.classList.toggle('menu-open',!open)});
qsa('#site-nav a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}));

qsa('[data-topic]').forEach(button=>button.addEventListener('click',()=>{
  if(button.getAttribute('aria-selected')==='true')return;
  const topic=topics[button.dataset.topic];const panel=qs('#topic-panel');
  qsa('[data-topic]').forEach(b=>b.setAttribute('aria-selected','false'));button.setAttribute('aria-selected','true');
  qs('#topic-count').textContent=topic.count;qs('#topic-title').textContent=topic.title;qs('#topic-description').textContent=topic.description;qs('#topic-list').innerHTML=topic.items.map(item=>`<li>${item}</li>`).join('');
  if(!reducedMotion){panel?.getAnimations().forEach(animation=>animation.cancel());panel?.animate([{opacity:.25,transform:'translate3d(0,12px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:620,easing:'cubic-bezier(.16,1,.3,1)'})}
}));

const money=new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
const number=new Intl.NumberFormat('es-CO',{maximumFractionDigits:1});
function updateLab(){const capital=Number(qs('#capital')?.value||0);const rate=Number(qs('#rate')?.value||0)/100;const years=Number(qs('#years')?.value||0);const simple=capital*(1+rate*years);const compound=capital*Math.pow(1+rate,years);qs('#capital-label').textContent=money.format(capital);qs('#rate-label').textContent=`${Math.round(rate*100)}%`;qs('#years-label').textContent=`${years} ${years===1?'año':'años'}`;qs('#simple-result').textContent=money.format(simple);qs('#compound-result').textContent=money.format(compound);qs('#multiplier').textContent=`${number.format(compound/capital)}×`;const max=Math.max(compound,simple);qs('#simple-bar').style.width=`${Math.max(8,simple/max*100)}%`;qs('#compound-bar').style.width='100%'}
qsa('.lab-inputs input').forEach(input=>input.addEventListener('input',updateLab));updateLab();

['.metrics-grid','.meaning-grid','.method-steps','.model-cards','.experience-grid','.team-list','.join-steps','.faq-list'].forEach(selector=>{
  const group=qs(selector);if(!group)return;
  [...group.children].forEach((item,index)=>item.style.setProperty('--delay',`${Math.min(index,6)*75}ms`));
});

function animateMetric(element){
  const value=Number(element.dataset.value);if(!Number.isFinite(value)||element.dataset.value==='')return;
  const prefix=element.dataset.prefix||'';const suffix=element.dataset.suffix||'';const duration=reducedMotion?0:1450;const start=performance.now();
  const frame=now=>{const progress=duration===0?1:Math.min((now-start)/duration,1);const eased=1-Math.pow(1-progress,5);element.textContent=`${prefix}${Math.round(value*eased).toLocaleString('es-CO')}${suffix}`;if(progress<1)requestAnimationFrame(frame)};
  requestAnimationFrame(frame);
}

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  entry.target.classList.add('in-view');
  if(entry.target.classList.contains('metric'))animateMetric(qs('.metric-value',entry.target));
  const finishReveal=()=>{entry.target.classList.remove('reveal','in-view');entry.target.style.removeProperty('--delay')};
  if(reducedMotion)finishReveal();else{
    const onEnd=event=>{if(event.propertyName!=='transform')return;entry.target.removeEventListener('transitionend',onEnd);finishReveal()};
    entry.target.addEventListener('transitionend',onEnd);setTimeout(finishReveal,1900);
  }
  observer.unobserve(entry.target);
}),{threshold:.12,rootMargin:'0px 0px -6%'});
qsa('.reveal').forEach(el=>observer.observe(el));

const hero=qs('.hero');const dial=qs('.scope-dial');const heroOrbits=qs('.hero-orbits');
if(hero&&dial&&heroOrbits&&!reducedMotion&&window.matchMedia('(pointer:fine)').matches){
  const motion={x:0,y:0,targetX:0,targetY:0,frame:0};
  const renderMotion=()=>{motion.x+=(motion.targetX-motion.x)*.075;motion.y+=(motion.targetY-motion.y)*.075;dial.style.setProperty('--px',`${motion.x*14}px`);dial.style.setProperty('--py',`${motion.y*12}px`);heroOrbits.style.setProperty('--hx',`${motion.x*-18}px`);heroOrbits.style.setProperty('--hy',`${motion.y*-14}px`);if(Math.abs(motion.targetX-motion.x)>.001||Math.abs(motion.targetY-motion.y)>.001)motion.frame=requestAnimationFrame(renderMotion);else motion.frame=0};
  const requestMotion=()=>{if(!motion.frame)motion.frame=requestAnimationFrame(renderMotion)};
  hero.addEventListener('pointermove',event=>{const rect=hero.getBoundingClientRect();motion.targetX=(event.clientX-rect.left)/rect.width-.5;motion.targetY=(event.clientY-rect.top)/rect.height-.5;requestMotion()},{passive:true});
  hero.addEventListener('pointerleave',()=>{motion.targetX=0;motion.targetY=0;requestMotion()});
}

if(!reducedMotion)qsa('.faq-list details').forEach(details=>{
  const summary=qs('summary',details);if(!summary)return;
  summary.addEventListener('click',event=>{
    event.preventDefault();if(details.dataset.animating==='true')return;
    const opening=!details.open;const startHeight=details.offsetHeight;
    if(opening)details.open=true;
    const endHeight=opening?details.offsetHeight:summary.offsetHeight;
    details.dataset.animating='true';details.style.overflow='hidden';
    const animation=details.animate({height:[`${startHeight}px`,`${endHeight}px`]},{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});
    animation.onfinish=()=>{if(!opening)details.open=false;details.style.height='';details.style.overflow='';delete details.dataset.animating};
    animation.oncancel=animation.onfinish;
  });
});

const progress=qs('#progress-bar');const header=qs('.site-header');let ticking=false;
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;header?.classList.toggle('is-scrolled',scrollY>48);ticking=false}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true}},{passive:true});updateScroll();
qs('#year').textContent=new Date().getFullYear();
