// ── Reveal (same as homepage) ────────────────────────────────
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
  if(!hdr) return;
  // Product page: header always solid
  hdr.classList.add('solid');
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
})();

// ── Gallery Thumbnails ───────────────────────────────────────
(function(){
  var thumbs = document.querySelectorAll('.pdp-thumb');
  var mainImgs = document.querySelectorAll('.pdp-main-img img');
  if(!thumbs.length || !mainImgs.length) return;

  thumbs.forEach(function(thumb, i){
    thumb.addEventListener('click', function(){
      // Update active thumb
      thumbs.forEach(function(t){ t.classList.remove('active'); });
      thumb.classList.add('active');
      // Swap main image
      mainImgs.forEach(function(img){ img.classList.add('hidden'); });
      if(mainImgs[i]) mainImgs[i].classList.remove('hidden');
    });
  });
})();

// ── Variant Selector ─────────────────────────────────────────
(function(){
  var btns = document.querySelectorAll('.pdp-variant-btn');
  var priceEl = document.getElementById('pdpPrice');
  if(!btns.length) return;

  btns.forEach(function(btn){
    btn.addEventListener('click', function(){
      if(btn.classList.contains('sold-out')) return;
      btns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      // Update price
      var newPrice = btn.getAttribute('data-price');
      if(priceEl && newPrice) priceEl.textContent = newPrice;
    });
  });
})();

// ── Quantity ─────────────────────────────────────────────────
(function(){
  var minus = document.getElementById('qtyMinus');
  var plus  = document.getElementById('qtyPlus');
  var input = document.getElementById('qtyInput');
  if(!minus || !plus || !input) return;

  minus.addEventListener('click', function(){
    var v = parseInt(input.value) || 1;
    if(v > 1) input.value = v - 1;
  });
  plus.addEventListener('click', function(){
    var v = parseInt(input.value) || 1;
    if(v < 12) input.value = v + 1;
  });
  input.addEventListener('change', function(){
    var v = parseInt(input.value);
    if(isNaN(v) || v < 1) input.value = 1;
    if(v > 12) input.value = 12;
  });
})();

// ── Accordions ───────────────────────────────────────────────
(function(){
  var triggers = document.querySelectorAll('.pdp-accordion-trigger');
  triggers.forEach(function(trigger){
    trigger.addEventListener('click', function(){
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      var body = trigger.nextElementSibling;
      if(!body) return;
      if(expanded){
        trigger.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = '0';
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
  // Open first accordion by default
  if(triggers.length){
    triggers[0].setAttribute('aria-expanded','true');
    var firstBody = triggers[0].nextElementSibling;
    if(firstBody) firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
  }
})();

// ── Profile Bars Animation ───────────────────────────────────
(function(){
  var bars = document.querySelectorAll('.pdp-profile-fill');
  if(!bars.length) return;
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.style.width = e.target.getAttribute('data-width');
          io.unobserve(e.target);
        }
      });
    },{threshold:0.3});
    bars.forEach(function(bar){ bar.style.width='0'; io.observe(bar); });
  } else {
    bars.forEach(function(bar){ bar.style.width = bar.getAttribute('data-width'); });
  }
  // Review bars
  var revBars = document.querySelectorAll('.pdp-review-bar-fill');
  if('IntersectionObserver' in window){
    var rio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.style.width = e.target.getAttribute('data-width');
          rio.unobserve(e.target);
        }
      });
    },{threshold:0.3});
    revBars.forEach(function(bar){ bar.style.width='0'; rio.observe(bar); });
  } else {
    revBars.forEach(function(bar){ bar.style.width = bar.getAttribute('data-width'); });
  }
})();

// ── Slider (reusable from homepage) ──────────────────────────
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
makeSlider('pairingTrack','pairPrev','pairNext');
makeSlider('revTrack','rvPrev','rvNext');

// ── Add to Cart (demo) ──────────────────────────────────────
(function(){
  var cartBtn = document.getElementById('addToCart');
  if(!cartBtn) return;
  cartBtn.addEventListener('click', function(){
    var original = cartBtn.innerHTML;
    cartBtn.innerHTML = '<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2"><polyline points="20 6 9 17 4 12"/></svg> Added to Cart';
    cartBtn.style.background = 'var(--ink)';
    setTimeout(function(){
      cartBtn.innerHTML = original;
      cartBtn.style.background = '';
    }, 2000);
  });
})();
