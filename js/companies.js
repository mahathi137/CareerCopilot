/* ============================================
   CareerCopilot Company Prep Logic
   Company profiles and preparation guides
   ============================================ */

(function(){
  document.addEventListener('DOMContentLoaded', initCompaniesPage);

  function initCompaniesPage() {
    renderCompanies();
  }

  function renderCompanies() {
    const grid = document.getElementById('companies-grid');
    if (!grid) return;

    const dreamCompanies = CompanyTracker.getDreamCompanies();

    grid.innerHTML = Object.entries(COMPANIES_DATA).map(([key, company]) => {
      const isDream = dreamCompanies.includes(key);
      return `
        <div class="card card-pad">
          <div class="flex justify-between items-start mb-4">
            <div style="font-size: 3rem;">${company.logo}</div>
            <button class="btn-icon" onclick="toggleDream('${key}')" style="color: ${isDream ? 'var(--primary)' : 'var(--text-muted)'};">
              ${isDream ? '★' : '☆'}
            </button>
          </div>
          <h3 style="margin-bottom: var(--space-1); color: var(--text-primary);">${company.name}</h3>
          <div class="flex gap-2 mb-4">
            <span class="badge badge-muted">${company.type}</span>
            <span class="badge badge-primary">${company.package}</span>
          </div>
          <div class="divider" style="margin: var(--space-3) 0;"></div>
          <div style="margin-bottom: var(--space-3);">
            <strong style="color: var(--text-primary); font-size: var(--text-sm);">Difficulty:</strong>
            <span style="color: var(--text-muted); font-size: var(--text-sm);">${company.difficulty}</span>
          </div>
          <div style="margin-bottom: var(--space-4);">
            <strong style="color: var(--text-primary); font-size: var(--text-sm);">Hiring Process:</strong>
            <ul style="margin-top: var(--space-2); color: var(--text-secondary); font-size: var(--text-sm); line-height: 1.6;">
              ${company.hiringProcess.map(step => `<li>• ${step}</li>`).join('')}
            </ul>
          </div>
          <button class="btn btn-primary btn-block" onclick="showDetails('${key}')">View Full Details</button>
        </div>
      `;
    }).join('');
  }

  window.toggleDream = function(key) {
    const isDream = CompanyTracker.toggleDream(key);
    if (isDream) {
      CCToast(`${COMPANIES_DATA[key].name} added to dream companies!`, 'success');
    } else {
      CCToast('Removed from dream companies', 'info');
    }
    renderCompanies();
  };

  window.showDetails = function(key) {
    const company = COMPANIES_DATA[key];
    if (!company) return;

    const dreamCompanies = CompanyTracker.getDreamCompanies();
    const isDream = dreamCompanies.includes(key);

    document.getElementById('companies-grid').style.display = 'none';
    document.getElementById('company-detail-view').style.display = 'block';

    document.getElementById('company-detail-content').innerHTML = `
      <div class="flex justify-between items-start mb-6">
        <div class="flex items-center gap-4">
          <div style="font-size: 4rem;">${company.logo}</div>
          <div>
            <h2 style="margin-bottom: var(--space-1); color: var(--text-primary);">${company.name}</h2>
            <div class="flex gap-2">
              <span class="badge badge-muted">${company.type}</span>
              <span class="badge badge-primary">${company.package}</span>
              <span class="badge badge-warning">${company.difficulty}</span>
            </div>
          </div>
        </div>
        <button class="btn-icon" onclick="toggleDream('${key}')" style="color: ${isDream ? 'var(--primary)' : 'var(--text-muted)'}; font-size: 1.5rem;">
          ${isDream ? '★' : '☆'}
        </button>
      </div>

      <div class="content-grid-2 mb-6">
        <div class="card card-pad" style="background: var(--bg-elevated);">
          <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">Eligibility Criteria</h3>
          <ul style="color: var(--text-secondary); line-height: 1.8;">
            ${company.eligibility.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>

        <div class="card card-pad" style="background: var(--bg-elevated);">
          <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">Salary Range</h3>
          <div style="font-size: var(--text-xl); font-weight: 600; color: var(--primary); margin-bottom: var(--space-2);">
            ${company.package}
          </div>
          <p style="color: var(--text-muted); font-size: var(--text-sm);">
            Based on role and experience level
          </p>
        </div>
      </div>

      <div class="card card-pad mb-6" style="background: var(--bg-elevated);">
        <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">Hiring Process</h3>
        <div class="flex-col gap-3">
          ${company.hiringProcess.map((step, index) => `
            <div class="flex items-start gap-3">
              <div class="badge badge-primary" style="min-width: 30px; text-align: center;">${index + 1}</div>
              <div style="color: var(--text-secondary);">${step}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="content-grid-2 mb-6">
        <div class="card card-pad" style="background: var(--bg-elevated);">
          <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">Aptitude Round</h3>
          <ul style="color: var(--text-secondary); line-height: 1.8;">
            ${company.aptitudeRound.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>

        <div class="card card-pad" style="background: var(--bg-elevated);">
          <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">Coding Round</h3>
          <ul style="color: var(--text-secondary); line-height: 1.8;">
            ${company.codingRound.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="content-grid-2 mb-6">
        <div class="card card-pad" style="background: var(--bg-elevated);">
          <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">Interview Round</h3>
          <ul style="color: var(--text-secondary); line-height: 1.8;">
            ${company.interviewRound.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>

        <div class="card card-pad" style="background: var(--bg-elevated);">
          <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">Preparation Strategy</h3>
          <ul style="color: var(--text-secondary); line-height: 1.8;">
            ${company.preparationStrategy.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="card card-pad mb-6" style="background: var(--bg-elevated);">
        <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">Frequently Asked Questions</h3>
        <div class="flex-col gap-4">
          ${company.faq.map(q => `
            <div>
              <div style="font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-1);">Q: ${q.question}</div>
              <div style="color: var(--text-secondary);">A: ${q.answer}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card card-pad" style="background: var(--primary-light); border: 1px solid var(--primary);">
        <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">💡 Pro Tips</h3>
        <ul style="color: var(--text-secondary); line-height: 1.8;">
          ${company.tips.map(tip => `<li>• ${tip}</li>`).join('')}
        </ul>
      </div>
    `;
  };

  window.showCompaniesGrid = function() {
    document.getElementById('company-detail-view').style.display = 'none';
    document.getElementById('companies-grid').style.display = 'grid';
  };

  window.CompaniesPage = {
    refresh: initCompaniesPage
  };
})();
