/* AcePak International website behaviour: menu, slider, enquiry form, photo viewer, copy buttons, motion */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menu */
  var head=document.querySelector('.site-head'), menuBtn=document.querySelector('.menu-btn');
  function setMenu(o){head.classList.toggle('open',o);menuBtn.setAttribute('aria-expanded',String(o));menuBtn.querySelector('span').textContent=o?'Close':'Menu';}
  menuBtn.addEventListener('click',function(){setMenu(!head.classList.contains('open'));});
  document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',function(){setMenu(false);});});

  /* Slider */
  var slider=document.querySelector('.slider'), slides=[].slice.call(slider.querySelectorAll('.slide')), dots=[].slice.call(slider.querySelectorAll('.dot'));
  var pauseBtn=slider.querySelector('.sl-pause'), cur=0, timer=null, userPaused=reduce;
  function show(n){
    slides[cur].classList.remove('is-active');slides[cur].setAttribute('aria-hidden','true');slides[cur].inert=true;dots[cur].setAttribute('aria-current','false');
    cur=(n+slides.length)%slides.length;
    slides[cur].classList.add('is-active');slides[cur].removeAttribute('aria-hidden');slides[cur].inert=false;dots[cur].setAttribute('aria-current','true');
  }
  var bar=document.createElement('div');bar.className='sl-progress';bar.setAttribute('aria-hidden','true');bar.innerHTML='<i></i>';slider.appendChild(bar);
  function runBar(){bar.classList.remove('run','paused');void bar.offsetWidth;bar.classList.add('run');}
  function stop(){clearInterval(timer);timer=null;bar.classList.add('paused');}
  function play(){stop();if(!userPaused&&!document.hidden){timer=setInterval(function(){show(cur+1);runBar();},5000);runBar();}else{bar.classList.remove('run');}}
  function setPauseIcon(){pauseBtn.setAttribute('aria-label',userPaused?'Play slideshow':'Pause slideshow');pauseBtn.querySelector('use').setAttribute('href',userPaused?'#i-play':'#i-pause');}
  slider.querySelector('.prev').addEventListener('click',function(){show(cur-1);play();});
  slider.querySelector('.next').addEventListener('click',function(){show(cur+1);play();});
  dots.forEach(function(d,i){d.addEventListener('click',function(){show(i);play();});});
  pauseBtn.addEventListener('click',function(){userPaused=!userPaused;setPauseIcon();play();});
  slider.addEventListener('mouseenter',stop);slider.addEventListener('mouseleave',play);
  slider.addEventListener('focusin',stop);slider.addEventListener('focusout',play);
  document.addEventListener('visibilitychange',function(){document.hidden?stop():play();});
  var sx=null;
  slider.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  slider.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45){show(dx<0?cur+1:cur-1);play();}sx=null;});
  setPauseIcon();play();

  /* Enquiry form: sends to acepak.intl@gmail.com through FormSubmit (without JavaScript the form posts there directly) */
  var form=document.getElementById('enquiry-form');
  if(form){
    var statusEl=document.getElementById('e-status'), submitBtn=form.querySelector('.q-submit');
    var rules={
      'e-name':function(v){return v.length>1;},
      'e-phone':function(v){return v.replace(/\D/g,'').length>=7;},
      'e-email':function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);},
      'e-service':function(v){return v!=='';}
    };
    function check(id){var el=document.getElementById(id),ok=rules[id](el.value.trim());el.closest('.field').classList.toggle('invalid',!ok);document.getElementById(id+'-err').hidden=ok;el.setAttribute('aria-invalid',String(!ok));return ok;}
    Object.keys(rules).forEach(function(id){var el=document.getElementById(id);['input','change'].forEach(function(t){el.addEventListener(t,function(){if(el.closest('.field').classList.contains('invalid'))check(id);});});});
    function say(msg,cls){statusEl.textContent=msg;statusEl.className='form-note q-status'+(cls?' '+cls:'');}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var bad=Object.keys(rules).filter(function(id){return !check(id);});
      if(bad.length){document.getElementById(bad[0]).focus();say('Please check the highlighted fields.','bad');return;}
      if(form.elements._honey.value)return; // filled only by spam bots
      var label=submitBtn.textContent;submitBtn.disabled=true;submitBtn.textContent='Sending…';say('');
      var data={};new FormData(form).forEach(function(v,k){data[k]=v;});
      fetch('https://formsubmit.co/ajax/acepak.intl@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().then(function(d){if(!r.ok||String(d.success)!=='true')throw new Error(d.message||'Not sent');});})
        .then(function(){form.reset();say('Thank you. Your enquiry has been sent and our team will contact you soon.','ok');})
        .catch(function(){say('Sorry, your enquiry could not be sent. Please call or WhatsApp +92 320 1979227, or email acepak.intl@gmail.com.','bad');})
        .finally(function(){submitBtn.disabled=false;submitBtn.textContent=label;});
    });
  }
  var headQuote=document.querySelector('.head-quote');if(headQuote)headQuote.addEventListener('click',function(){setMenu(false);});

  /* Copy buttons */
  function copyText(btn,text,targetId){
    var label=btn.textContent;
    function selectIt(){var el=document.getElementById(targetId);if(!el)return;var r=document.createRange();r.selectNodeContents(el);var s=window.getSelection();s.removeAllRanges();s.addRange(r);btn.textContent='Selected. Press Ctrl+C';}
    function reset(){setTimeout(function(){btn.textContent=label;},1800);}
    try{navigator.clipboard.writeText(text).then(function(){btn.textContent='Copied';reset();},function(){selectIt();reset();});}catch(err){selectIt();reset();}
  }
  document.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){copyText(b,b.getAttribute('data-copy'),b.getAttribute('aria-controls'));});});

  /* Photo viewer */
  var lb=document.getElementById('lightbox');
  if(lb){
    var lbItems=[].slice.call(document.querySelectorAll('[data-lb]')), lbImg=lb.querySelector('img'), lbCap=lb.querySelector('.lb-cap'), lbCount=lb.querySelector('.lb-count'), lbIdx=0, lbLast=null;
    function lbShow(n){
      lbIdx=(n+lbItems.length)%lbItems.length;
      var a=lbItems[lbIdx];
      lbImg.src=a.getAttribute('href');lbImg.alt=a.querySelector('img').alt;
      lbCap.textContent=a.getAttribute('data-caption')||'';lbCount.textContent='('+(lbIdx+1)+' of '+lbItems.length+')';
    }
    function lbOpen(n,trigger){lbLast=trigger;lbShow(n);lb.hidden=false;document.body.style.overflow='hidden';lb.querySelector('.lb-close').focus();}
    function lbClose(){lb.hidden=true;lbImg.removeAttribute('src');document.body.style.overflow='';if(lbLast&&lbLast.focus)lbLast.focus();}
    lbItems.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();lbOpen(i,a);});});
    lb.querySelectorAll('[data-lb-close]').forEach(function(el){el.addEventListener('click',lbClose);});
    lb.querySelector('.lb-prev').addEventListener('click',function(){lbShow(lbIdx-1);});
    lb.querySelector('.lb-next').addEventListener('click',function(){lbShow(lbIdx+1);});
    document.addEventListener('keydown',function(e){
      if(lb.hidden)return;
      if(e.key==='Escape'){lbClose();return;}
      if(e.key==='ArrowLeft'){lbShow(lbIdx-1);return;}
      if(e.key==='ArrowRight'){lbShow(lbIdx+1);return;}
      if(e.key==='Tab'){
        var f=[].slice.call(lb.querySelectorAll('button')),first=f[0],last=f[f.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
    var lx=null;
    lb.addEventListener('touchstart',function(e){lx=e.touches[0].clientX;},{passive:true});
    lb.addEventListener('touchend',function(e){if(lx===null)return;var dx=e.changedTouches[0].clientX-lx;if(Math.abs(dx)>45)lbShow(dx<0?lbIdx+1:lbIdx-1);lx=null;});
  }

  /* Motion: scroll reveals and count-up figures (skipped when the head script did not enable .motion) */
  var root=document.documentElement, motion=root.classList.contains('motion');
  if(motion){

    // [selector, variant, stagger step in seconds]; items in the same parent cascade one after another.
    var groups=[
      ['.sec-head','',0],['.icons a','rv-card',.07],
      
      ['.cards .card','rv-card',.12],['.message > *','',.08],['.values .value','rv-card',.12],['.sdg > *','rv-pop',.05],
      ['.stats .stat','',.12],['.svc-grid .svc','rv-card',.06],['.people .person','rv-card',.14],
      ['.rec-body > *','',.08],['.rec-gallery li','rv-right',.07],['.lic-grid .lic','rv-card',.1],['.reg-row > *','rv-pop',.04],
      ['details.codes','',0],['.contact-grid > :first-child','rv-left',0],['.q-intro','rv-left',0],['.q-card','rv-right',.1],['.foot-grid > *','',.1]
    ];
    var targets=[];
    groups.forEach(function(g){
      var count=new Map();
      document.querySelectorAll(g[0]).forEach(function(el){
        if(el.getBoundingClientRect().top<innerHeight*.9)return; // already on screen at load: leave as is
        var n=count.get(el.parentNode)||0;count.set(el.parentNode,n+1);
        el.classList.add('rv');if(g[1])el.classList.add(g[1]);
        if(g[2])el.style.setProperty('--rv-d',Math.min(n,6)*g[2]+'s');
        targets.push(el);
      });
    });
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting)return;
        var el=en.target;io.unobserve(el);el.classList.add('in');
        if(el.classList.contains('stat'))countUp(el);
        // Once arrived, drop the reveal classes so each element's own hover transitions apply again.
        var d=parseFloat(el.style.getPropertyValue('--rv-d'))||0;
        setTimeout(function(){el.classList.remove('rv','rv-card','rv-pop','rv-left','rv-right','in');el.style.removeProperty('--rv-d');},(d+1.2)*1000);
      });
    },{rootMargin:'0px 0px -8% 0px',threshold:.12});
    targets.forEach(function(el){io.observe(el);});
    requestAnimationFrame(function(){root.classList.add('ready');});
  }

  /* Count-up figures: animates the digits already in the page, so the final text is always present for search engines */
  function countUp(stat){
    var b=stat.querySelector('b');if(!b||b.classList.contains('stat-word'))return;
    [].slice.call(b.childNodes).forEach(function(node){
      var m=node.nodeType===3&&node.nodeValue.match(/^(\s*)(\d+)(.*)$/);if(!m)return;
      var end=+m[2],start=performance.now(),dur=1400;
      (function tick(now){var p=Math.min((now-start)/dur,1),v=Math.round(end*(1-Math.pow(1-p,3)));node.nodeValue=m[1]+v+m[3];if(p<1)requestAnimationFrame(tick);})(start);
    });
  }

  /* Gallery carousel: arrow buttons, mouse drag, and buttons that disable at either end */
  var track=document.querySelector('.rec-gallery');
  if(track){
    track.setAttribute('tabindex','0');
    var nav=document.createElement('div');nav.className='gal-nav';
    nav.innerHTML='<button class="gal-btn" type="button" aria-label="Previous photos" aria-controls="gal-track"><svg class="ic" aria-hidden="true"><use href="#i-left"/></svg></button><button class="gal-btn" type="button" aria-label="Next photos" aria-controls="gal-track"><svg class="ic" aria-hidden="true"><use href="#i-right"/></svg></button>';
    track.id='gal-track';track.parentNode.insertBefore(nav,track.nextSibling);
    var prevB=nav.children[0],nextB=nav.children[1];
    function step(){var li=track.querySelector('li');return li?li.getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap||18):300;}
    function edges(){prevB.disabled=track.scrollLeft<4;nextB.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-4;}
    prevB.addEventListener('click',function(){track.scrollBy({left:-step(),behavior:reduce?'auto':'smooth'});});
    nextB.addEventListener('click',function(){track.scrollBy({left:step(),behavior:reduce?'auto':'smooth'});});
    track.addEventListener('scroll',function(){requestAnimationFrame(edges);},{passive:true});
    window.addEventListener('resize',edges);edges();
    var dragX=null,dragLeft=0,moved=false;
    track.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;dragX=e.clientX;dragLeft=track.scrollLeft;moved=false;});
    window.addEventListener('pointermove',function(e){if(dragX===null)return;var dx=e.clientX-dragX;if(!moved&&Math.abs(dx)>6){moved=true;track.classList.add('dragging');}if(moved)track.scrollLeft=dragLeft-dx;});
    window.addEventListener('pointerup',function(){if(dragX===null)return;dragX=null;if(moved){track.classList.remove('dragging');var w=step();track.scrollTo({left:Math.round(track.scrollLeft/w)*w,behavior:'smooth'});}});
    track.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);
    track.addEventListener('dragstart',function(e){e.preventDefault();});
  }

  /* Header gains a soft shadow once the page is scrolled */
  var ticking=false;
  function onScroll(){ticking=false;head.classList.toggle('scrolled',window.scrollY>8);}
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});onScroll();

  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
})();
