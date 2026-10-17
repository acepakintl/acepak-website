/* AcePak International website behaviour: menu, slider, quote popup, photo viewer, copy buttons */
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
  function stop(){clearInterval(timer);timer=null;}
  function play(){stop();if(!userPaused&&!document.hidden){timer=setInterval(function(){show(cur+1);},5000);}}
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

  /* Quote popup */
  var modal=document.getElementById('quote-modal'), form=document.getElementById('quote-form'), done=document.getElementById('q-done');
  var lastFocus=null;
  function selectOption(sel,val){if(!val)return;for(var i=0;i<sel.options.length;i++){if(sel.options[i].text===val){sel.selectedIndex=i;return;}}}
  function openQuote(btn){
    lastFocus=btn;
    selectOption(document.getElementById('q-client'),btn&&btn.getAttribute('data-client'));
    selectOption(document.getElementById('q-need'),btn&&btn.getAttribute('data-need'));
    form.hidden=false;done.hidden=true;modal.hidden=false;document.body.style.overflow='hidden';
    setTimeout(function(){document.getElementById('q-name').focus();},30);
  }
  function closeQuote(){modal.hidden=true;document.body.style.overflow='';if(lastFocus&&lastFocus.focus)lastFocus.focus();}
  document.querySelectorAll('[data-quote]').forEach(function(b){b.addEventListener('click',function(){setMenu(false);openQuote(b);});});
  modal.querySelectorAll('[data-close]').forEach(function(el){el.addEventListener('click',closeQuote);});
  document.addEventListener('keydown',function(e){
    if(modal.hidden)return;
    if(e.key==='Escape'){closeQuote();return;}
    if(e.key==='Tab'){
      var f=[].slice.call(modal.querySelectorAll('button,a[href],input,select,textarea')).filter(function(el){return el.offsetParent!==null;});
      if(!f.length)return;var first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  function check(id){var el=document.getElementById(id),ok=el.value.trim().length>1;el.closest('.field').classList.toggle('invalid',!ok);document.getElementById(id+'-err').hidden=ok;el.setAttribute('aria-invalid',String(!ok));return ok;}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=check('q-name')&check('q-phone');
    if(!ok){(document.querySelector('.field.invalid input')||{}).focus&&document.querySelector('.field.invalid input').focus();return;}
    var v=function(id){return document.getElementById(id).value.trim();};
    var lines=['Quote request from the AcePak website','Name: '+v('q-name'),'Phone: '+v('q-phone'),'Client: '+v('q-client'),'Need: '+v('q-need')];
    if(v('q-location'))lines.push('Location: '+v('q-location'));
    if(v('q-details'))lines.push('Details: '+v('q-details'));
    var msg=lines.join('\n');
    document.getElementById('q-preview').textContent=msg;
    document.getElementById('q-wa').href='https://wa.me/923201979227?text='+encodeURIComponent(msg);
    form.hidden=true;done.hidden=false;document.getElementById('q-wa').focus();
  });
  document.getElementById('q-edit').addEventListener('click',function(){done.hidden=true;form.hidden=false;document.getElementById('q-name').focus();});

  /* Copy buttons */
  function copyText(btn,text,targetId){
    var label=btn.textContent;
    function selectIt(){var el=document.getElementById(targetId);if(!el)return;var r=document.createRange();r.selectNodeContents(el);var s=window.getSelection();s.removeAllRanges();s.addRange(r);btn.textContent='Selected. Press Ctrl+C';}
    function reset(){setTimeout(function(){btn.textContent=label;},1800);}
    try{navigator.clipboard.writeText(text).then(function(){btn.textContent='Copied';reset();},function(){selectIt();reset();});}catch(err){selectIt();reset();}
  }
  document.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){copyText(b,b.getAttribute('data-copy'),b.getAttribute('aria-controls'));});});
  document.getElementById('q-copy').addEventListener('click',function(){copyText(this,document.getElementById('q-preview').textContent,'q-preview');});

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

  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
})();
