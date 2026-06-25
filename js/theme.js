/* ===================================================================
   CareerCopilot — theme.js
   =================================================================== */

(function(){
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(t=>{
      t.setAttribute('aria-pressed', theme === 'dark');
      t.setAttribute('title', theme === 'dark' ? 'Dark mode' : 'Light mode');
      t.textContent = theme === 'dark' ? '☾' : '☀';
    });
  }

  function initTheme(){
    const theme = Storage.get("theme", "light");
    applyTheme(theme || 'light');
  }

  function toggleTheme(){
    const theme = Storage.get("theme", "light");
    const next = theme === 'dark' ? 'light' : 'dark';
    Storage.set("theme", next);
    applyTheme(next);
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initTheme();
    document.querySelectorAll('.theme-toggle').forEach(btn=>{
      btn.addEventListener('click', toggleTheme);
    });
  });

  window.CCTheme = { toggleTheme, applyTheme };
})();
