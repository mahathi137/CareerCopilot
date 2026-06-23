/* ============================================
   CareerCopilot Interview Prep Logic
   HR, technical, and behavioral questions
   ============================================ */

(function(){
  let currentCategory = 'hr';

  document.addEventListener('DOMContentLoaded', initInterviewPage);

  function initInterviewPage() {
    renderQuestions();
    updateStats();
    initTabs();
  }

  function renderQuestions() {
    const container = document.getElementById('questions-list');
    if (!container) return;

    const questions = INTERVIEW_QUESTIONS[currentCategory];
    const bookmarks = Progress.getBookmarks('interview');

    container.innerHTML = questions.map(q => {
      const isBookmarked = bookmarks.includes(q.id);
      return `
        <div class="card card-pad">
          <div class="flex justify-between items-start mb-3">
            <span class="badge badge-primary">${q.category}</span>
            <button class="btn-icon" onclick="toggleBookmark('${q.id}')" style="color: ${isBookmarked ? 'var(--primary)' : 'var(--text-muted)'};">
              ${isBookmarked ? '★' : '☆'}
            </button>
          </div>
          <h3 style="font-size: var(--text-base); font-weight: 600; margin-bottom: var(--space-3); color: var(--text-primary);">${q.question}</h3>
          <div class="divider" style="margin: var(--space-3) 0;"></div>
          <div style="margin-bottom: var(--space-3);">
            <strong style="color: var(--primary); font-size: var(--text-sm);">💡 Tips:</strong>
            <p style="color: var(--text-secondary); font-size: var(--text-sm); margin-top: var(--space-1);">${q.tips}</p>
          </div>
          <div>
            <strong style="color: var(--success); font-size: var(--text-sm);">✓ Example Answer:</strong>
            <p style="color: var(--text-secondary); font-size: var(--text-sm); margin-top: var(--space-1); font-style: italic;">${q.example}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  function updateStats() {
    const bookmarks = Progress.getBookmarks('interview');
    const countEl = document.getElementById('bookmarked-count');
    if (countEl) countEl.textContent = bookmarks.length;
  }

  function initTabs() {
    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category;
        renderQuestions();
      });
    });
  }

  window.toggleBookmark = function(id) {
    const isBookmarked = Progress.toggleBookmark(id, 'interview');
    if (isBookmarked) {
      CCToast('Question bookmarked!', 'success');
    } else {
      CCToast('Bookmark removed', 'info');
    }
    updateStats();
    renderQuestions();
  };

  window.InterviewPage = {
    refresh: initInterviewPage
  };
})();
