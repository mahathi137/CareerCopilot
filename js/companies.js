/* ============================================
   CareerCopilot Company Prep Logic
   Company profiles and preparation guides
   ============================================ */

(function(){
  document.addEventListener('DOMContentLoaded', initCompaniesPage);

  function initCompaniesPage() {
    renderCompanies();
  }

  const COMPANY_DEFAULTS = {
    TCS: ['Week 1: Quant, reasoning, verbal fundamentals.', 'Week 2: Programming MCQs, arrays, strings, and basic SQL.', 'Week 3: Mock NQT tests and project interview practice.'],
    Infosys: ['Revise Infosys quantitative patterns.', 'Practice pseudocode, OOP, DBMS, and two easy-medium coding problems daily.', 'Prepare project architecture and role-specific questions.'],
    Wipro: ['Practice NLTH aptitude and written English.', 'Solve string, array, and number-based coding questions.', 'Prepare concise HR answers around flexibility and learning mindset.'],
    Accenture: ['Practice cognitive and technical assessment sections.', 'Revise cloud basics, Agile, OOP, and one programming language.', 'Prepare leadership and teamwork stories.'],
    Cognizant: ['Practice GAME/aptitude style questions.', 'Solve easy-medium DSA and SQL query problems.', 'Prepare Java/OOP and project deep dives.'],
    Capgemini: ['Practice pseudocode and game-based assessments.', 'Revise cloud, Agile, DevOps basics, OOP, and DBMS.', 'Write timed essays on current technology topics.']
  };

  function enrichCompany(key, company) {
    const aptitude = company.aptitudeRound || (company.aptitudePattern?.sections || []).map(section =>
      `${section.name}: ${section.questions || 'adaptive'} questions, ${section.time}`
    );
    const coding = Array.isArray(company.codingRound) ? company.codingRound : [company.codingRound || 'Coding details vary by role and campus drive.'];
    return {
      ...company,
      eligibility: company.eligibility || ['Usually open to eligible final-year students.', 'Minimum percentage or CGPA criteria varies by campus.', 'No active backlogs are commonly expected at joining.'],
      aptitudeRound: aptitude.length ? aptitude : ['Quantitative aptitude, logical reasoning, and verbal ability.'],
      codingRound: coding,
      technicalInterview: company.technicalInterview || (company.interviewTopics || []).map(topic => `Prepare ${topic} with definitions, examples, and project usage.`),
      hrInterview: company.hrInterview || ['Tell me about yourself.', `Why ${company.name}?`, 'Are you flexible with location, shifts, and training?', 'Describe a challenge from your project or academics.'],
      preparationRoadmap: company.preparationRoadmap || COMPANY_DEFAULTS[key] || company.tips || [],
      previousQuestions: company.commonQuestions || [],
      faq: company.faq || [
        { question: 'What should I prioritize first?', answer: `Start with ${company.name}'s aptitude pattern, then revise one programming language, SQL, OOP, and your projects.` },
        { question: 'How should I prepare for coding?', answer: 'Practice arrays, strings, sorting, searching, recursion, and basic dynamic programming under a timer.' },
        { question: 'What matters in HR?', answer: 'Clarity, confidence, willingness to learn, location flexibility, and honest project ownership.' }
      ]
    };
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
    const company = enrichCompany(key, COMPANIES_DATA[key]);
    if (!company) return;
    const studied = Storage.get('companies_studied', []);
    if (!studied.includes(key)) {
      studied.push(key);
      Storage.set('companies_studied', studied);
    }

    const dreamCompanies = CompanyTracker.getDreamCompanies();
    const isDream = dreamCompanies.includes(key);
    company.eligibility = company.eligibility || [
      'Usually open to final-year students from eligible branches.',
      'Minimum academic percentage or CGPA criteria varies by campus.',
      'No active backlogs are commonly expected at joining.'
    ];
    company.aptitudeRound = company.aptitudeRound || (company.aptitudePattern?.sections || []).map(section =>
      `${section.name}: ${section.questions || 'adaptive'} questions, ${section.time}`
    );
    company.codingRound = Array.isArray(company.codingRound) ? company.codingRound : [company.codingRound || 'Coding details vary by role and campus drive.'];
    company.interviewRound = company.interviewRound || [
      ...(company.interviewTopics || []).map(topic => `Technical: prepare ${topic} with examples from your projects.`),
      'HR: tell me about yourself, relocation flexibility, strengths, weaknesses, and why this company.'
    ];
    company.preparationStrategy = company.preparationStrategy || company.tips || [];
    company.faq = company.faq || [
      { question: 'What should I prioritize first?', answer: 'Start with the aptitude pattern, then revise one programming language, SQL, OOP, and your projects.' },
      { question: 'Are previous questions useful?', answer: 'Yes. Use them to identify repeated topics, then practice the underlying concepts.' },
      { question: 'How many coding problems should I solve?', answer: 'Solve 25-40 focused easy/medium problems across arrays, strings, sorting, searching, and recursion.' }
    ];

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
          <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">Technical Interview</h3>
          <ul style="color: var(--text-secondary); line-height: 1.8;">
            ${company.technicalInterview.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>

        <div class="card card-pad" style="background: var(--bg-elevated);">
          <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">HR Interview</h3>
          <ul style="color: var(--text-secondary); line-height: 1.8;">
            ${company.hrInterview.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="card card-pad mb-6" style="background: var(--bg-elevated);">
        <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">Preparation Roadmap</h3>
        <div class="flex-col gap-3">
          ${company.preparationRoadmap.map((item, index) => `
            <div class="flex items-start gap-3">
              <div class="badge badge-primary">${index + 1}</div>
              <div style="color: var(--text-secondary);">${item}</div>
            </div>
          `).join('')}
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
    const detail = document.getElementById('company-detail-content');
    const previousQuestions = company.previousQuestions || [];
    detail.insertAdjacentHTML('beforeend', `
      <div class="content-grid-2 mt-4">
        <div class="card card-pad" style="background: var(--bg-elevated);">
          <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">Company Overview</h3>
          <p style="color: var(--text-secondary); line-height: 1.8;">${company.name} is a ${company.type.toLowerCase()} company with typical fresher packages around ${company.package}. Expect ${company.difficulty.toLowerCase()} selection difficulty with emphasis on aptitude, coding basics, projects, and communication.</p>
        </div>
        <div class="card card-pad" style="background: var(--bg-elevated);">
          <h3 style="margin-bottom: var(--space-3); color: var(--text-primary);">Previous Questions</h3>
          <ul style="color: var(--text-secondary); line-height: 1.8;">
            ${previousQuestions.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    `);
  };

  window.showCompaniesGrid = function() {
    document.getElementById('company-detail-view').style.display = 'none';
    document.getElementById('companies-grid').style.display = 'grid';
  };

  window.CompaniesPage = {
    refresh: initCompaniesPage
  };
})();
