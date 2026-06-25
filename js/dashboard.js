/* ============================================
   CareerCopilot Dashboard Logic
   Charts, stats, and recommendations
   ============================================ */

(function(){
  // Initialize dashboard when DOM is ready
  document.addEventListener('DOMContentLoaded', initDashboard);
  window.addEventListener('cc:profile-updated', initDashboard);

  function initDashboard() {
    updateProfileDisplay();
    updateStats();
    renderModuleProgress();
    initCharts();
    updateRecommendations();
    updateQuote();
    updateGoals();
    updateDashboardWidgets();
  }

  // Update profile display in sidebar and topbar
  function updateProfileDisplay() {
    const profile = UserProfile.get();
    const firstName = (profile.name || 'Student').split(' ')[0];
    const targetCompany = profile.targetCompany || '';
    const targetRole = profile.targetRole || 'placement prep';
    
    const sideName = document.getElementById('side-name');
    const sideRank = document.getElementById('side-rank');
    const sideAvatar = document.getElementById('side-avatar');
    const topbarName = document.getElementById('topbar-name');
    const topbarSub = document.querySelector('.topbar-sub');
    
    if (sideName) sideName.textContent = profile.name || 'Student';
    if (sideRank) sideRank.textContent = profile.rank || 'Beginner';
    if (sideAvatar) sideAvatar.textContent = (profile.name || 'S').charAt(0).toUpperCase();
    if (topbarName) topbarName.textContent = firstName;
    
    // Update greeting with personalization
    if (topbarSub) {
      const hour = new Date().getHours();
      let greeting = 'Good evening';
      if (hour < 12) greeting = 'Good morning';
      else if (hour < 18) greeting = 'Good afternoon';
      
      if (targetCompany && targetCompany !== 'Other') {
        topbarSub.textContent = `${greeting}, ${firstName}. Your ${targetRole} path for ${targetCompany} is shaping up`;
      } else {
        topbarSub.textContent = `${greeting}, ${firstName}. Here's how your ${targetRole} preparation is shaping up`;
      }
    }
  }

  // Update all statistics
  function updateStats() {
    const profile = UserProfile.get();
    const completedCoding = Progress.getCompleted('coding').length;
    const completedAptitude = Progress.getCompleted('aptitude').length;
    
    // Calculate readiness score
    const readinessScore = calculateReadinessScore();
    
    // Update stat displays
    updateStat('stat-readiness', readinessScore + '%');
    updateStat('stat-dsa-solved', completedCoding);
    updateStat('stat-streak', profile.streak || 0);
    
    // Countdown to placement
    const countdown = calculateCountdown();
    updateStat('stat-countdown', countdown);
    
    // Update readiness ring
    updateReadinessRing(readinessScore);
    
    // Update career rank label
    const rankLabel = document.getElementById('career-rank-label');
    if (rankLabel) rankLabel.textContent = profile.rank || 'Beginner';
  }

  function updateStat(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function getAttemptedAptitudeCount() {
    const scores = AptitudeState.getScores();
    return Object.values(scores).reduce((sum, item) => sum + (item.total || 0), 0);
  }

  function getInterviewProgressCount() {
    return Progress.getCompleted('interview').length || Progress.getBookmarks('interview').length;
  }

  function getModuleProgress() {
    const codingTotal = Math.max((typeof CODING_QUESTIONS !== 'undefined' && CODING_QUESTIONS.length) || 150, 1);
    const aptitudeTotal = 30;
    const interviewTotal = Math.max((typeof INTERVIEW_QUESTIONS !== 'undefined' && INTERVIEW_QUESTIONS.length) || 30, 1);

    const modules = [
      { label: 'Coding Progress', done: Progress.getCompleted('coding').length, total: codingTotal, color: '#6366F1', link: 'coding.html' },
      { label: 'Aptitude Progress', done: getAttemptedAptitudeCount(), total: aptitudeTotal, color: '#10B981', link: 'aptitude.html' },
      { label: 'Interview Progress', done: getInterviewProgressCount(), total: interviewTotal, color: '#F59E0B', link: 'interview.html' },
      { label: 'Resume Progress', done: ResumeState.getScore(), total: 100, color: '#06B6D4', link: 'resume.html', suffix: '%' }
    ];

    return modules.map(module => {
      const pct = Math.max(0, Math.min(100, Math.round((module.done / module.total) * 100)));
      return { ...module, pct, remaining: Math.max(module.total - module.done, 0) };
    });
  }

  function renderModuleProgress() {
    const canvas = document.getElementById('chart-progress');
    if (!canvas || !canvas.parentElement) return;

    let container = document.getElementById('module-progress-list');
    if (!container) {
      container = document.createElement('div');
      container.id = 'module-progress-list';
      container.className = 'module-progress-list';
      canvas.parentElement.insertBefore(container, canvas);
    }

    container.innerHTML = getModuleProgress().map(module => `
      <a class="module-progress-row" href="${module.link}">
        <div class="module-progress-meta">
          <strong>${module.label}</strong>
          <span>${module.pct}% complete</span>
        </div>
        <div class="module-progress-counts">
          <span>${module.done}${module.suffix || ''} completed</span>
          <span>${module.remaining}${module.suffix || ''} remaining</span>
        </div>
        <div class="progress-bar" aria-label="${module.label}">
          <div class="progress-fill" style="width:${module.pct}%; background:${module.color};"></div>
        </div>
      </a>
    `).join('');
  }

  function calculateReadinessScore() {
    const completedCoding = Progress.getCompleted('coding').length;
    const completedAptitude = getAttemptedAptitudeCount();
    const interviewProgress = getInterviewProgressCount();
    const resumeScore = Storage.get('resume_analysis', {}).atsScore || ResumeState.getScore();
    const profile = UserProfile.get();
    const codingTotal = Math.max((typeof CODING_QUESTIONS !== 'undefined' && CODING_QUESTIONS.length) || 150, 1);
    const interviewTotal = Math.max((typeof INTERVIEW_QUESTIONS !== 'undefined' && INTERVIEW_QUESTIONS.length) || 30, 1);
    
    const dsaScore = Math.min((completedCoding / codingTotal) * 30, 30);
    const aptitudeScore = Math.min((completedAptitude / 30) * 20, 20);
    const interviewScore = Math.min((interviewProgress / interviewTotal) * 20, 20);
    const resumeScoreWeighted = (resumeScore / 100) * 20;
    const streakScore = Math.min((profile.streak / 30) * 10, 10);
    
    return Math.round(dsaScore + aptitudeScore + interviewScore + resumeScoreWeighted + streakScore);
  }

  function calculateHealthScore() {
    const profile = UserProfile.get();
    const completedCoding = Progress.getCompleted('coding').length;
    const completedAptitude = Progress.getCompleted('aptitude').length;
    
    let score = 50; // Base score
    
    score += Math.min(completedCoding * 2, 30);
    score += Math.min(completedAptitude * 1.5, 20);
    score += Math.min(profile.streak, 10);
    
    return Math.min(Math.round(score), 100);
  }

  function calculateCountdown() {
    const profile = UserProfile.get();
    if (!profile.placementDate) return '--';
    
    const placementDate = new Date(profile.placementDate);
    const today = new Date();
    const diffTime = placementDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  function updateReadinessRing(score) {
    const ring = document.getElementById('ring-readiness');
    const label = document.getElementById('ring-readiness-label');
    
    if (ring) {
      const circumference = 414;
      const offset = circumference - (score / 100) * circumference;
      ring.style.strokeDashoffset = offset;
    }
    
    if (label) label.textContent = score + '%';
  }
// Show a friendly empty state in place of an all-zero chart
  function showChartEmptyState(canvas, icon, message) {
    if (!canvas) return;
    canvas.style.display = 'none';
    let note = canvas.parentElement.querySelector('.chart-empty-state');
    if (!note) {
      note = document.createElement('div');
      note.className = 'chart-empty-state';
      note.style.cssText = 'text-align:center; padding:var(--space-6) var(--space-4); color:var(--text-muted);';
      canvas.parentElement.appendChild(note);
    }
    note.innerHTML = `<div style="font-size:2.2rem; margin-bottom:var(--space-2);">${icon}</div><div style="font-size:var(--text-sm);">${message}</div>`;
  }
  // Initialize Chart.js charts
  function initCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded');
      return;
    }

    try { initProgressChart(); } catch (e) { console.error('progress chart', e); }
    try { initTopicsChart(); } catch (e) { console.error('topics chart', e); }
  }

  function initProgressChart() {
    const ctx = document.getElementById('chart-progress');
    if (!ctx) return;
    ctx.style.display = 'none';
    renderModuleProgress();
    return;

    const completedCoding = Progress.getCompleted('coding').length;
    const completedAptitude = Progress.getCompleted('aptitude').length;
    const interviewBookmarks = Progress.getBookmarks('interview').length;
    const resumeScore = ResumeState.getScore();
  if (completedCoding + completedAptitude + interviewBookmarks + resumeScore === 0) {
      showChartEmptyState(ctx, '📊', 'No progress yet. Solve a problem, take a quiz, or build your resume to see your module breakdown here.');
      return;
    }
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['DSA', 'Aptitude', 'Interview', 'Resume'],
        datasets: [{
          data: [
            Math.min((completedCoding / 40) * 100, 100),
            Math.min((completedAptitude / 30) * 100, 100),
            Math.min((interviewBookmarks / 30) * 100, 100),
            resumeScore
          ],
          backgroundColor: [
            '#6366F1',
            '#10B981',
            '#F59E0B',
            '#06B6D4'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#A09DC0',
              font: { size: 12 },
              padding: 15
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  function initTopicsChart() {
    const ctx = document.getElementById('chart-topics');
    if (!ctx) return;

    const completed = Progress.getCompleted('coding');
     if (completed.length === 0) {
      showChartEmptyState(ctx, '🧩', 'Solve coding problems to see which topics you are strongest in.');
      return;
    }
    const topicScores = calculateTopicScores(completed);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(topicScores),
        datasets: [{
          label: 'Problems Solved',
          data: Object.values(topicScores),
          backgroundColor: '#6366F1',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255,255,255,0.05)'
            },
            ticks: {
              color: '#6B6890',
              font: { size: 11 }
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              color: '#6B6890',
              font: { size: 11 }
            }
          }
        }
      }
    });
  }

  function calculateTopicScores(completedIds) {
    const topics = {
      'Arrays': 0,
      'Strings': 0,
      'Linked Lists': 0,
      'Trees': 0,
      'Graphs': 0,
      'DP': 0,
      'Dynamic Programming': 0,
      'Searching': 0,
      'Sorting': 0,
      'Recursion': 0,
      'Backtracking': 0,
      'Greedy': 0,
      'Heaps': 0,
      'Tries': 0,
      'Sliding Window': 0,
      'Two Pointers': 0,
      'Hashing': 0
    };

    completedIds.forEach(id => {
      const question = CODING_QUESTIONS.find(q => q.id === id);
      if (question && topics[question.topic] !== undefined) {
        topics[question.topic]++;
      }
    });

    // Filter out topics with 0
    const filteredTopics = {};
    Object.keys(topics).forEach(key => {
      if (topics[key] > 0) {
        filteredTopics[key] = topics[key];
      }
    });

    return Object.keys(filteredTopics).length > 0 ? filteredTopics : topics;
  }

  // Update recommendations
  function updateRecommendations() {
    const container = document.getElementById('recommend-list');
    if (!container) return;

    const completedCoding = Progress.getCompleted('coding').length;
    const completedAptitude = Progress.getCompleted('aptitude').length;
    const profile = UserProfile.get();

    const recommendations = [];

    if (completedCoding < 5) {
      recommendations.push({
        icon: '💻',
        title: 'Start with Easy DSA',
        desc: 'Solve 5 easy problems to build momentum'
      });
    } else if (completedCoding < 15) {
      recommendations.push({
        icon: '📈',
        title: 'Level Up to Medium',
        desc: 'Try medium problems to challenge yourself'
      });
    }

    if (completedAptitude < 10) {
      recommendations.push({
        icon: '🧮',
        title: 'Practice Aptitude',
        desc: 'Complete 10 aptitude questions this week'
      });
    }

    if (profile.streak < 3) {
      recommendations.push({
        icon: '🔥',
        title: 'Build Your Streak',
        desc: 'Practice daily to maintain consistency'
      });
    }

    if (Progress.getBookmarks('interview').length < 5) {
      recommendations.push({
        icon: '🎤',
        title: 'Bookmark Interview Qs',
        desc: 'Save important questions for review'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        icon: '🎉',
        title: 'Great Progress!',
        desc: 'Keep up the excellent work'
      });
    }

    container.innerHTML = recommendations.map(rec => `
      <div class="row-item">
        <div class="row-icon">${rec.icon}</div>
        <div class="row-main">
          <b>${rec.title}</b>
          <span>${rec.desc}</span>
        </div>
      </div>
    `).join('');
  }

  // Update daily quote
  function updateQuote() {
    const quoteCard = document.getElementById('quote-card');
    if (!quoteCard) return;

    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const dailyTip = document.getElementById('daily-tip');
    const dailyQuote = document.getElementById('daily-quote');

    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const randomTip = CAREER_TIPS[Math.floor(Math.random() * CAREER_TIPS.length)];

    if (quoteText) quoteText.textContent = `"${randomQuote.text}"`;
    if (quoteAuthor) quoteAuthor.textContent = `— ${randomQuote.author}`;
    if (dailyTip) dailyTip.textContent = randomTip;
    if (dailyQuote) dailyQuote.textContent = randomQuote.text;
  }

  // Update weekly goals
  function updateGoals() {
    const completedCoding = Progress.getCompleted('coding').length;
    const completedAptitude = getAttemptedAptitudeCount();
    const interviewProgress = getInterviewProgressCount();

    const goalCoding = document.getElementById('goal-coding');
    const goalAptitude = document.getElementById('goal-aptitude');
    const goalInterview = document.getElementById('goal-interview');

    if (goalCoding) goalCoding.textContent = `${Math.min(completedCoding, 10)}/10 completed`;
    if (goalAptitude) goalAptitude.textContent = `${Math.min(completedAptitude, 3)}/3 completed`;
    if (goalInterview) goalInterview.textContent = `${Math.min(interviewProgress, 5)}/5 completed`;
  }

  function updateDashboardWidgets() {
    const profile = UserProfile.get();
    const readiness = calculateReadinessScore();
    const xp = profile.xp || 0;
    const daily = getDailyChallenge();
    const dreamProgress = document.getElementById('dream-company-progress');
    const dreamStatus = document.getElementById('dream-company-status');
    const xpValue = document.getElementById('dashboard-xp');
    const xpProgress = document.getElementById('xp-progress');
    const xpNext = document.getElementById('xp-next-rank');
    const challengeTitle = document.getElementById('daily-challenge-title');
    const challengeDesc = document.getElementById('daily-challenge-desc');

    if (dreamProgress) dreamProgress.style.width = `${readiness}%`;
    if (dreamStatus) dreamStatus.textContent = `${readiness}% ready for ${profile.dreamCompany || profile.targetCompany || 'your dream company'}.`;
    if (xpValue) xpValue.textContent = `${xp} XP`;
    if (xpProgress) xpProgress.style.width = `${Math.min((xp % 500) / 500 * 100, 100)}%`;
    if (xpNext) xpNext.textContent = `${500 - (xp % 500)} XP to the next milestone.`;
    if (challengeTitle) challengeTitle.textContent = daily.title;
    if (challengeDesc) challengeDesc.textContent = daily.desc;

    const resumeScore = Storage.get('resume_analysis', {}).atsScore || ResumeState.getScore();
    const roadmap = Storage.get('career_roadmap');
    const checks = Storage.get('career_roadmap_checks', {});
    const roadmapTotal = roadmap ? roadmap.weeks.reduce((sum, week) => sum + week.tasks.length, 0) : 0;
    const roadmapDone = Object.values(checks).filter(Boolean).length;
    const mockHistory = Storage.get('mock_interview_history', []);
    updateStat('dashboard-resume-score', `${resumeScore}%`);
    updateStat('dashboard-roadmap-progress', `${roadmapTotal ? Math.round(roadmapDone / roadmapTotal * 100) : 0}%`);
    updateStat('dashboard-interview-score', mockHistory.length ? `${mockHistory[mockHistory.length - 1].score}/10` : '0');
  }

  function getDailyChallenge() {
    const challenges = [
      { title: 'Solve one array problem', desc: 'Focus on clean logic and edge cases.' },
      { title: 'Attempt one aptitude set', desc: 'Target speed plus accuracy for 20 minutes.' },
      { title: 'Rewrite one resume bullet', desc: 'Add a measurable result and strong action verb.' },
      { title: 'Practice one HR answer', desc: 'Use a concise STAR-style story.' },
      { title: 'Review one company roadmap', desc: 'Study hiring process, rounds, and previous questions.' }
    ];
    return challenges[new Date().getDay() % challenges.length];
  }

  // Expose update function for external calls
  window.Dashboard = {
    refresh: initDashboard,
    updateStats: updateStats,
    updateRecommendations: updateRecommendations
  };
})();
