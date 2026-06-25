/* ===================================================================
   CareerCopilot shared behaviors
   =================================================================== */

(function(){
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
    const icon = type === 'success' ? 'OK' : type === 'error' ? '!' : 'i';
    el.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    wrap.appendChild(el);
    setTimeout(()=>{
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      setTimeout(()=> el.remove(), 300);
    }, 2600);
  }
  window.CCToast = showToast;

  function escapeHtml(value){
    return String(value || '').replace(/[&<>"']/g, c => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[c]));
  }

  function initialsFor(name){
    return String(name || 'Student').split(' ').filter(Boolean).slice(0,2).map(p => p[0].toUpperCase()).join('') || 'S';
  }

  function initMobileNav(){
    const burger = document.querySelector('.nav-burger, .nav-mobile-btn');
    const links = document.querySelector('.nav-links');
    if(!burger || !links) return;
    burger.addEventListener('click', ()=> links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> links.classList.remove('open')));
  }

  function personalizeShell(){
    if(typeof UserProfile === 'undefined') return;
    const profile = UserProfile.get();
    const name = profile.name && profile.name !== 'Student' ? profile.name : 'Student';
    const firstName = name.split(' ')[0];
    const initials = initialsFor(name);
    const dreamCompany = profile.dreamCompany || profile.targetCompany || 'your dream company';
    const targetRole = profile.targetRole || 'placement';

    const sideName = document.getElementById('side-name');
    const sideRank = document.getElementById('side-rank');
    const sideAvatar = document.getElementById('side-avatar');
    const topAvatar = document.getElementById('top-avatar');
    const triggerName = document.querySelector('.profile-trigger-name');
    const topbarName = document.getElementById('topbar-name');
    if(sideName) sideName.textContent = name;
    if(sideRank) sideRank.textContent = profile.rank || 'Beginner';
    if(sideAvatar) sideAvatar.textContent = initials;
    if(topAvatar) topAvatar.textContent = initials;
    if(triggerName) triggerName.textContent = firstName;
    if(topbarName) topbarName.textContent = firstName;

    document.querySelectorAll('[data-profile-name]').forEach(el => el.textContent = name);
    document.querySelectorAll('[data-profile-email]').forEach(el => el.textContent = profile.email || 'Profile saved locally');
    document.querySelectorAll('[data-profile-first-name]').forEach(el => el.textContent = firstName);
    document.querySelectorAll('[data-profile-dream-company]').forEach(el => el.textContent = dreamCompany);
    document.querySelectorAll('[data-profile-target-role]').forEach(el => el.textContent = targetRole);
    document.querySelectorAll('[data-cc-name]').forEach(el => el.textContent = firstName);
  }
  window.CCPersonalize = personalizeShell;

  function ensureProfileMenu(){
    if(typeof UserProfile === 'undefined') return;
    const profile = UserProfile.get();
    const shellActions = document.querySelector('.topbar-actions');
    if(!shellActions || document.getElementById('profile-menu-wrap')) return;

    const wrap = document.createElement('div');
    wrap.id = 'profile-menu-wrap';
    wrap.className = 'profile-menu-wrap';
    wrap.innerHTML = `
      <button class="profile-trigger" id="profile-trigger" type="button" aria-label="Open profile menu">
        <span class="avatar" id="top-avatar">${initialsFor(profile.name)}</span>
        <span class="profile-trigger-name">${escapeHtml((profile.name || 'Student').split(' ')[0])}</span>
      </button>
      <div class="profile-menu" id="profile-menu">
        <div class="profile-menu-head">
          <div class="avatar">${initialsFor(profile.name)}</div>
          <div>
            <strong data-profile-name>${escapeHtml(profile.name || 'Student')}</strong>
            <span data-profile-email>${escapeHtml(profile.email || 'Profile saved locally')}</span>
          </div>
        </div>
        <button type="button" id="profile-edit-button">Edit Profile</button>
      </div>
    `;
    shellActions.appendChild(wrap);
    wrap.querySelector('#profile-trigger').addEventListener('click', () => wrap.classList.toggle('open'));
    wrap.querySelector('#profile-edit-button').addEventListener('click', () => {
      wrap.classList.remove('open');
      if(window.Onboarding) window.Onboarding.edit ? window.Onboarding.edit() : window.Onboarding.show({ edit: true });
    });
    document.addEventListener('click', e => {
      if(!wrap.contains(e.target)) wrap.classList.remove('open');
    });

    window.CCAuth = { open(){ if(window.Onboarding) window.Onboarding.show(); }, close(){} };
  }

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

    const current = location.pathname.split('/').pop() || 'index.html';
    sidebar.querySelectorAll('.side-link').forEach(link=>{
      if(link.getAttribute('href') === current) link.classList.add('active');
    });
  }

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

  function initFAQ(){
    document.querySelectorAll('.faq-item').forEach(item=>{
      const q = item.querySelector('.faq-q, .faq-question');
      const a = item.querySelector('.faq-a');
      if(!q) return;
      q.addEventListener('click', ()=>{
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(o=>{
          if(o!==item){
            o.classList.remove('open');
            const oa = o.querySelector('.faq-a');
            if(oa) oa.style.maxHeight = null;
          }
        });
        if(isOpen){ item.classList.remove('open'); if(a) a.style.maxHeight = null; }
        else { item.classList.add('open'); if(a) a.style.maxHeight = a.scrollHeight + 'px'; }
      });
    });
  }

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
    personalizeShell();
    ensureProfileMenu();
    initReveal();
    initCounters();
    initFAQ();
    initNavbarScroll();
    if(typeof UserProfile !== 'undefined') UserProfile.updateStreak();
  });

  window.addEventListener('cc:profile-updated', personalizeShell);
})();
