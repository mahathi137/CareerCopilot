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
    renderMockHistory();
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

  const MOCK_QUESTIONS = {
    'HR Interview': [
      'Tell me about yourself.',
      'Why do you want to join this company?',
      'What are your strengths and weaknesses?',
      'Describe a challenge you faced and how you handled it.'
    ],
    'Technical Interview': [
      'Explain your strongest project with architecture and your contribution.',
      'Explain OOP concepts with examples.',
      'What is the difference between arrays and linked lists?',
      'Solve this coding problem: explain an approach to find duplicates in an array.'
    ],
    'Managerial Interview': [
      'How do you handle tight deadlines?',
      'Describe a conflict in a team project and how you resolved it.',
      'How do you learn a new technology for a project?',
      'How would you prioritize tasks during training or onboarding?'
    ]
  };

  let currentMock = null;

  window.startMockInterview = function() {
    const type = document.getElementById('mock-type').value;
    const company = document.getElementById('mock-company').value;
    const questions = MOCK_QUESTIONS[type] || MOCK_QUESTIONS['Technical Interview'];
    currentMock = { type, company, questions, answers: [], index: 0, started: new Date().toISOString() };
    document.getElementById('mock-feedback-panel').innerHTML = '';
    renderMockQuestion();
  };

  function renderMockQuestion() {
    if (!currentMock) return;
    const question = currentMock.questions[currentMock.index];
    document.getElementById('mock-interview-panel').innerHTML = `
      <div class="mock-question">
        <div class="flex justify-between items-center gap-3">
          <span class="badge badge-primary">${currentMock.company}</span>
          <span class="badge badge-muted">Question ${currentMock.index + 1} of ${currentMock.questions.length}</span>
        </div>
        <h4>${question}</h4>
        <textarea class="form-input" id="mock-answer" rows="5" placeholder="Type your answer as if you are speaking in the interview..."></textarea>
        <button class="btn btn-primary mt-3" type="button" onclick="submitMockAnswer()">${currentMock.index === currentMock.questions.length - 1 ? 'Finish Interview' : 'Save and Next'}</button>
      </div>
    `;
  }

  window.submitMockAnswer = function() {
    if (!currentMock) return;
    const answer = document.getElementById('mock-answer').value.trim();
    if (!answer) return CCToast('Write an answer first', 'error');
    currentMock.answers[currentMock.index] = {
      question: currentMock.questions[currentMock.index],
      answer
    };
    if (currentMock.index < currentMock.questions.length - 1) {
      currentMock.index += 1;
      renderMockQuestion();
      return;
    }
    const session = evaluateMock(currentMock);
    Storage.push('mock_interview_history', session, 10);
    Progress.markComplete(`mock_${Date.now()}`, 'interview');
    renderFeedback(session);
    renderMockHistory();
    updateStats();
    currentMock = null;
  };

  function evaluateMock(mock) {
    const full = mock.answers.map(item => item.answer).join(' ');
    const words = full.split(/\s+/).filter(Boolean).length;
    const answeredAll = mock.answers.filter(item => item && item.answer.trim().length >= 25).length;
    const hasExamples = /project|example|for instance|built|developed|implemented|created/i.test(full);
    const hasImpact = /\d|impact|improved|optimized|reduced|increased|result|outcome/i.test(full);
    const hasTechnical = /oop|class|object|sql|array|linked|complexity|database|api|algorithm|architecture|frontend|backend/i.test(full);
    const hasStructure = /first|second|then|finally|because|therefore|my role|i learned/i.test(full);
    const veryShortAnswers = mock.answers.filter(item => !item || item.answer.trim().split(/\s+/).length < 18).length;

    const completion = answeredAll / mock.questions.length;
    const brevityPenalty = veryShortAnswers * 0.75;
    const communication = clampScore(3 + completion * 2 + (hasStructure ? 1.25 : 0) + (words >= 180 ? 1 : 0) - brevityPenalty);
    const technical = clampScore(3 + (hasTechnical ? 2 : 0) + (hasExamples ? 0.75 : 0) + (hasImpact ? 0.75 : 0) + (mock.type === 'Technical Interview' && words >= 220 ? 1 : 0) - brevityPenalty);
    const confidence = clampScore(3 + completion * 2 + (words >= 160 ? 1 : 0) + (hasExamples ? 0.75 : 0) - brevityPenalty);
    const problemSolving = clampScore(3 + (/approach|edge|complexity|optimi|hash|loop|test/i.test(full) ? 2 : 0) + (hasTechnical ? 0.75 : 0) + (hasImpact ? 0.75 : 0) - brevityPenalty);
    const score = Math.round((communication + technical + confidence + problemSolving) * 2.5);

    return {
      type: mock.type,
      company: mock.company,
      answers: mock.answers,
      communication,
      technical,
      confidence,
      problemSolving,
      score,
      date: new Date().toISOString(),
      strengths: [
        hasStructure ? 'Answers have a clear flow.' : '',
        hasExamples ? 'You included examples from projects or experience.' : '',
        hasImpact ? 'You mentioned outcomes or measurable impact.' : ''
      ].filter(Boolean),
      weaknesses: [
        !hasExamples ? 'Need more concrete examples.' : '',
        !hasTechnical ? 'Technical depth is not strong enough yet.' : '',
        !hasImpact ? 'Add measurable impact and results.' : '',
        (completion < 1 || veryShortAnswers) ? 'Some answers were too short for a real interview.' : ''
      ].filter(Boolean)
    };
  }

  function clampScore(value) {
    return Math.max(1, Math.min(10, Math.round(value)));
  }

  function renderFeedback(session) {
    document.getElementById('mock-feedback-panel').innerHTML = `
      <div class="card card-pad mb-4">
        <span class="stat-label">Interview Score</span>
        <div class="stat-value">${session.score}/100</div>
      </div>
      <div class="content-grid-3">
        <div class="card card-pad"><span class="stat-label">Communication</span><div class="stat-value">${session.communication}/10</div></div>
        <div class="card card-pad"><span class="stat-label">Technical Knowledge</span><div class="stat-value">${session.technical}/10</div></div>
        <div class="card card-pad"><span class="stat-label">Confidence</span><div class="stat-value">${session.confidence}/10</div></div>
        <div class="card card-pad"><span class="stat-label">Problem Solving</span><div class="stat-value">${session.problemSolving}/10</div></div>
      </div>
      <div class="insight-list mt-4">
        <div class="insight-item"><strong>Strengths:</strong> ${(session.strengths.length ? session.strengths : ['Good attempt.']).join(' ')}</div>
        <div class="insight-item"><strong>Weaknesses:</strong> ${(session.weaknesses.length ? session.weaknesses : ['No major weakness detected, but keep adding detail.']).join(' ')}</div>
        <div class="insight-item"><strong>Suggestions:</strong> Practice more DSA, improve project explanation, add examples, and mention measurable impact.</div>
      </div>
    `;
  }

  function renderMockHistory() {
    const history = Storage.get('mock_interview_history', []);
    const count = document.getElementById('mock-history-count');
    const list = document.getElementById('mock-history-list');
    if (count) count.textContent = `${history.length} sessions`;
    if (!list) return;
    list.innerHTML = history.length ? history.slice().reverse().map(item => `
      <div class="mock-history-item">
        <strong>${item.company} - ${item.type}</strong>
        <span>Score ${item.score}/100</span>
      </div>
    `).join('') : '<div class="planner-empty">No mock interviews yet.</div>';
  }
})();
