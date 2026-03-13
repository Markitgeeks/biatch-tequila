// ── Reveal ───────────────────────────────────────────────────
(function(){
  document.documentElement.classList.add('js-reveal');
  var els = document.querySelectorAll('.reveal');
  function show(el){ el.classList.add('vis'); }
  els.forEach(function(el){ var r=el.getBoundingClientRect(); if(r.top < window.innerHeight+80) show(el); });
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){show(e.target);io.unobserve(e.target);} }); },{threshold:0.05});
    els.forEach(function(el){ if(!el.classList.contains('vis')) io.observe(el); });
    setTimeout(function(){ document.querySelectorAll('.reveal:not(.vis)').forEach(show); },800);
  } else { els.forEach(show); }
})();

// ── Header ───────────────────────────────────────────────────
(function(){
  var hdr = document.getElementById('siteHeader');
  function upd(){ hdr.classList.toggle('solid', window.scrollY > 10); }
  window.addEventListener('scroll', upd, {passive:true}); upd();
  // Mobile nav
  var ham = document.querySelector('.hamburger');
  var nav = document.getElementById('siteNav');
  if(ham && nav){
    ham.addEventListener('click', function(){
      var open = ham.getAttribute('aria-expanded')==='true';
      ham.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ ham.setAttribute('aria-expanded','false'); nav.classList.remove('open'); }); });
  }
  // Scrollspy
  var links = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', function(){
    var y = window.scrollY+130, active='';
    ['products','mission','about','promo','events','recipes','reviews'].forEach(function(id){ var el=document.getElementById(id); if(el&&el.offsetTop<=y) active='#'+id; });
    links.forEach(function(a){ a.classList.toggle('on', a.getAttribute('href')===active); });
  },{passive:true});
})();

// ── Hero slideshow ───────────────────────────────────────────
(function(){
  var slides=document.querySelectorAll('.hero-slide'), dots=document.querySelectorAll('.hero-dot'), cur=0, tmr;
  function go(n){
    slides[cur].classList.remove('on'); slides[cur].setAttribute('aria-hidden','true');
    dots[cur].classList.remove('on'); dots[cur].setAttribute('aria-selected','false');
    cur=(n+slides.length)%slides.length;
    slides[cur].classList.add('on'); slides[cur].removeAttribute('aria-hidden');
    dots[cur].classList.add('on'); dots[cur].setAttribute('aria-selected','true');
  }
  dots.forEach(function(d,i){ d.addEventListener('click',function(){ clearInterval(tmr); go(i); tmr=setInterval(function(){go(cur+1);},6000); }); });
  tmr=setInterval(function(){go(cur+1);},6000);
})();

// ── Sliders ──────────────────────────────────────────────────
function makeSlider(id,prevId,nextId){
  var t=document.getElementById(id); if(!t) return;
  var prev=document.getElementById(prevId), next=document.getElementById(nextId), pos=0;
  function cw(){ var c=t.firstElementChild; return c ? c.offsetWidth+(parseFloat(getComputedStyle(t).gap)||20) : 0; }
  function maxP(){ return Math.max(0,t.scrollWidth-t.parentElement.offsetWidth); }
  function slide(d){ pos=Math.min(Math.max(pos+d*cw(),0),maxP()); t.style.transform='translateX(-'+pos+'px)'; }
  if(prev) prev.addEventListener('click',function(){slide(-1);});
  if(next) next.addEventListener('click',function(){slide(1);});
  var tx=0;
  t.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
  t.addEventListener('touchend',function(e){ var d=tx-e.changedTouches[0].clientX; if(Math.abs(d)>50) slide(d>0?1:-1); },{passive:true});
}
makeSlider('prodTrack','pPrev','pNext');
makeSlider('recTrack','rPrev','rNext');
makeSlider('revTrack','rvPrev','rvNext');

// ── Mission video ────────────────────────────────────────────
(function(){
  var vid=document.getElementById('missionVideo'), btn=document.getElementById('missionPlayBtn'), area=document.getElementById('missionPlayArea');
  if(!vid||!btn) return;
  btn.addEventListener('click',function(){
    if(!vid.src) vid.src='https://biatch.com/cdn/shop/videos/c/vp/df522bf48c5c4d339bd6c8f862271073/df522bf48c5c4d339bd6c8f862271073.HD-1080p-7.2Mbps-32448419.mp4';
    if(vid.paused){ vid.play(); area.style.opacity='0'; area.style.pointerEvents='none'; }
    else { vid.pause(); area.style.opacity='1'; area.style.pointerEvents='auto'; }
  });
})();

// ── Recipe modal ─────────────────────────────────────────────
var recipes = {
  'blood-orange':{ type:'Signature Cocktail', title:'Blood Orange Margarita', sub:'Rosa Blanco \u00b7 5 min \u00b7 1 serving', ing:['2 oz BIATCH Rosa Blanco','1 oz fresh blood orange juice','\u00be oz fresh lime juice','\u00bd oz agave nectar','Taj\u00edn for rim','Ice'], steps:['Rim glass with Taj\u00edn.','Combine tequila, blood orange juice, lime and agave in shaker with ice.','Shake hard 15 seconds.','Strain into rimmed glass over fresh ice.','Garnish with blood orange slice.'] },
  'paloma':{ type:'Classic Remix', title:'Reposado Paloma', sub:'Reposado \u00b7 4 min \u00b7 1 serving', ing:['2 oz BIATCH Reposado','2 oz fresh grapefruit juice','\u00bd oz lime juice','\u00bc tsp sea salt','Sparkling water','Ice'], steps:['Combine salt, grapefruit and lime in glass.','Fill with ice.','Add Reposado.','Top with sparkling water.','Garnish with grapefruit slice.'] },
  'espresso':{ type:'After Dark', title:'A\u00f1ejo Espresso Martini', sub:'Extra A\u00f1ejo \u00b7 6 min \u00b7 1 serving', ing:['1.5 oz BIATCH Extra A\u00f1ejo','1 oz cold brew espresso','\u00bd oz coffee liqueur','\u00bc oz simple syrup','Ice','3 espresso beans'], steps:['Chill a martini glass.','Add all ingredients to ice-filled shaker.','Shake hard 20 seconds.','Double-strain into chilled glass.','Garnish with 3 espresso beans.'] },
  'cucumber':{ type:'Garden Fresh', title:'Cucumber Jalape\u00f1o Spritz', sub:'Blanco \u00b7 7 min \u00b7 1 serving', ing:['2 oz BIATCH Blanco','4 cucumber slices','1\u20132 jalape\u00f1o slices (seeds removed)','\u00bd oz elderflower liqueur','\u00bd oz lime juice','Sparkling water','Ice'], steps:['Muddle cucumber and jalape\u00f1o in shaker.','Add tequila, elderflower and lime.','Fill with ice, shake 12 seconds.','Strain over fresh ice.','Top with sparkling water and cucumber ribbon.'] }
};
var modal=document.getElementById('recipeModal'), mClose=document.getElementById('modalClose'), mBack=document.getElementById('modalBackdrop');
function openModal(key){ var d=recipes[key]; if(!d) return; document.getElementById('modalType').textContent=d.type; document.getElementById('modalTitle').textContent=d.title; document.getElementById('modalSub').textContent=d.sub; document.getElementById('modalIngs').innerHTML=d.ing.map(function(i){return'<li>'+i+'</li>';}).join(''); document.getElementById('modalSteps').innerHTML=d.steps.map(function(s){return'<li>'+s+'</li>';}).join(''); modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
if(mClose) mClose.addEventListener('click',closeModal);
if(mBack)  mBack.addEventListener('click',closeModal);
document.querySelectorAll('.rcard').forEach(function(c){ c.addEventListener('click',function(){openModal(c.dataset.recipe);}); c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal(c.dataset.recipe);}}); });
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});
