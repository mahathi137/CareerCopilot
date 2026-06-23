/* ===================================================================
   CareerCopilot — main.js
   Shared behaviors across every page: mobile nav, reveal-on-scroll,
   toasts, sidebar highlighting, streak tracking.
   =================================================================== */

(function(){

  /* ---------- Toasts ---------- */
  function ensureToastWrap(){
    let wrap = document.querySelector('.toast-wrap');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    return wrap;
  }

  function showToast(message, type='success'){
    const wrap = ensureToastWrap();
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
    el.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    wrap.appendChild(el);
    setTimeout(()=>{
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      setTimeout(()=> el.remove(), 300);
    }, 2600);
  }
  window.CCToast = showToast;

  /* ---------- Mobile nav (marketing navbar) ---------- */
  function initMobileNav(){
    const burger = document.querySelector('.nav-burger');
    const links = document.querySelector('.nav-links');
    if(!burger || !links) return;
    burger.addEventListener('click', ()=> links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> links.classList.remove('open')));
  }

  /* ---------- Sidebar (app shell) ---------- */
  function initSidebar(){
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.sidebar-overlay');
    if(!sidebar || !toggle) return;
    function open(){ sidebar.classList.add('open'); overlay && overlay.classList.add('show'); }
    function close(){ sidebar.classList.remove('open'); overlay && overlay.classList.remove('show'); }
    toggle.addEventListener('click', open);
    overlay && overlay.addEventListener('click', close);
    sidebar.querySelectorAll('a').forEach(a=> a.addEventListener('click', close));

    // Highlight active link based on current file
    const current = location.pathname.split('/').pop() || 'index.html';
    sidebar.querySelectorAll('.side-link').forEach(link=>{
      const href = link.getAttribute('href');
      if(href === current) link.classList.add('active');
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal(){
    const items = document.querySelectorAll('.reveal');
    if(!items.length) return;
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, {threshold:0.15});
    items.forEach(i=> obs.observe(i));
  }

  /* ---------- Animated counters ---------- */
  function initCounters(){
    const counters = document.querySelectorAll('[data-count]');
    if(!counters.length) return;
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1400;
        const start = performance.now();
        function tick(now){
          const progress = Math.min(1, (now-start)/duration);
          const val = Math.floor(progress * target);
          el.textContent = val + suffix;
          if(progress < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, {threshold:0.4});
    counters.forEach(c=> obs.observe(c));
  }

  /* ---------- FAQ accordion ---------- */
  function initFAQ(){
    document.querySelectorAll('.faq-item').forEach(item=>{
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      q && q.addEventListener('click', ()=>{
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(o=>{
          if(o!==item){ o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null; }
        });
        if(isOpen){ item.classList.remove('open'); a.style.maxHeight = null; }
        else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
      });
    });
  }

  /* ---------- Navbar scroll shadow ---------- */
  function initNavbarScroll(){
    const nav = document.querySelector('.navbar');
    if(!nav) return;
    window.addEventListener('scroll', ()=>{
      nav.style.boxShadow = window.scrollY > 10 ? 'var(--shadow-md)' : 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initMobileNav();
    initSidebar();
    initReveal();
    initCounters();
    initFAQ();
    initNavbarScroll();
    UserProfile.updateStreak();
  });

})();
