/* ============================================
   CareerCopilot Analytics Logic
   Comprehensive analytics with multiple charts
   ============================================ */

(function(){
  document.addEventListener('DOMContentLoaded', initAnalyticsPage);

  function initAnalyticsPage() {
    updateProgressCards();
    initAllCharts();
    updateAchievementStats();
  }

  function updateProgressCards() {
    const completedCoding = Progress.getCompleted('coding').length;
    const completedAptitude = Progress.getCompleted('aptitude').length;
    const interviewBookmarks = Progress.getBookmarks('interview').length;

    const dsaProgress = Math.round((completedCoding / 40) * 100);
    const aptitudeProgress = Math.round((completedAptitude / 30) * 100);
    const interviewProgress = Math.round((interviewBookmarks / 25) * 100);

    document.getElementById('dsa-progress').textContent = dsaProgress + '%';
    document.getElementById('dsa-bar').style.width = dsaProgress + '%';
    document.getElementById('dsa-count').textContent = completedCoding;

    document.getElementById('aptitude-progress').textContent = aptitudeProgress + '%';
    document.getElementById('aptitude-bar').style.width = aptitudeProgress + '%';
    document.getElementById('aptitude-count').textContent = completedAptitude;

    document.getElementById('interview-progress').textContent = interviewProgress + '%';
    document.getElementById('interview-bar').style.width = interviewProgress + '%';
    document.getElementById('interview-count').textContent = interviewBookmarks;
  }

  function initAllCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded');
      return;
    }

    initWeeklyActivityChart();
    initCodingProgressChart();
    initAptitudeProgressChart();
    initInterviewProgressChart();
    initTopicPerformanceChart();
    initXPTrendChart();
    initReadinessTrendChart();
    initSkillGapChart();
  }

  function initWeeklyActivityChart() {
    const ctx = document.getElementById('activity-chart');
    if (!ctx) return;

    const weeklyActivity = AnalyticsState.getWeeklyActivity();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activityData = new Array(7).fill(0);

    weeklyActivity.forEach(entry => {
      const dayIndex = new Date(entry.date).getDay();
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      activityData[adjustedIndex]++;
    });

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          label: 'Activities',
          data: activityData,
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99,102,241,0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6366F1',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
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
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6B6890', stepSize: 1 }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#6B6890' }
          }
        }
      }
    });
  }

  function initCodingProgressChart() {
    const ctx = document.getElementById('coding-progress-chart');
    if (!ctx) return;

    const completed = Progress.getCompleted('coding');
    const easy = CODING_QUESTIONS.filter(q => q.difficulty === 'easy' && completed.includes(q.id)).length;
    const medium = CODING_QUESTIONS.filter(q => q.difficulty === 'medium' && completed.includes(q.id)).length;
    const hard = CODING_QUESTIONS.filter(q => q.difficulty === 'hard' && completed.includes(q.id)).length;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [{
          label: 'Completed',
          data: [easy, medium, hard],
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
          borderRadius: 8
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
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6B6890' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#6B6890' }
          }
        }
      }
    });
  }

  function initAptitudeProgressChart() {
    const ctx = document.getElementById('aptitude-progress-chart');
    if (!ctx) return;

    const scores = AptitudeState.getScores();
    const quantAccuracy = AptitudeState.getAccuracy('quantitative');
    const logicalAccuracy = AptitudeState.getAccuracy('logical');
    const verbalAccuracy = AptitudeState.getAccuracy('verbal');

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Quantitative', 'Logical', 'Verbal'],
        datasets: [{
          label: 'Accuracy %',
          data: [quantAccuracy, logicalAccuracy, verbalAccuracy],
          backgroundColor: 'rgba(6,182,212,0.2)',
          borderColor: '#06B6D4',
          pointBackgroundColor: '#06B6D4'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.05)' },
            angleLines: { color: 'rgba(255,255,255,0.05)' },
            pointLabels: { color: '#6B6890' },
            ticks: { color: '#6B6890', backdropColor: 'transparent' }
          }
        }
      }
    });
  }

  function initInterviewProgressChart() {
    const ctx = document.getElementById('interview-progress-chart');
    if (!ctx) return;

    const bookmarks = Progress.getBookmarks('interview');
    // Use actual interview questions from data.js
    const totalInterview = 30; // Approximate total
    const bookmarkedCount = bookmarks.length;
    
    // For demo, distribute bookmarks across categories
    const hr = Math.floor(bookmarkedCount * 0.4);
    const technical = Math.floor(bookmarkedCount * 0.4);
    const behavioral = bookmarkedCount - hr - technical;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['HR', 'Technical', 'Behavioral'],
        datasets: [{
          data: [hr, technical, behavioral],
          backgroundColor: ['#6366F1', '#10B981', '#F59E0B'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#A09DC0' }
          }
        },
        cutout: '65%'
      }
    });
  }

  function initTopicPerformanceChart() {
    const ctx = document.getElementById('topic-performance-chart');
    if (!ctx) return;

    const completed = Progress.getCompleted('coding');
    const topicScores = calculateTopicScores(completed);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(topicScores),
        datasets: [{
          label: 'Problems Solved',
          data: Object.values(topicScores),
          backgroundColor: '#8B5CF6',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6B6890' }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#6B6890' }
          }
        }
      }
    });
  }

  function initXPTrendChart() {
    const ctx = document.getElementById('xp-trend-chart');
    if (!ctx) return;

    const profile = UserProfile.get();
    const activity = AnalyticsState.getWeeklyActivity();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const xpData = new Array(7).fill(0);

    // Simulate XP trend based on activity
    activity.forEach((entry, idx) => {
      xpData[idx % 7] += entry.xp || 10;
    });

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          label: 'XP Earned',
          data: xpData,
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245,158,11,0.1)',
          fill: true,
          tension: 0.4
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
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6B6890' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#6B6890' }
          }
        }
      }
    });
  }

  function initReadinessTrendChart() {
    const ctx = document.getElementById('readiness-trend-chart');
    if (!ctx) return;

    const profile = UserProfile.get();
    const days = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const readinessData = [20, 35, 50, calculateCurrentReadiness()];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          label: 'Readiness Score',
          data: readinessData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          fill: true,
          tension: 0.4
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
            max: 100,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6B6890' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#6B6890' }
          }
        }
      }
    });
  }

  function initSkillGapChart() {
    const ctx = document.getElementById('skill-gap-chart');
    if (!ctx) return;

    const completedCoding = Progress.getCompleted('coding').length;
    const completedAptitude = Progress.getCompleted('aptitude').length;
    const interviewBookmarks = Progress.getBookmarks('interview').length;
    const resumeScore = ResumeState.getScore();

    const targetDSA = 40;
    const targetAptitude = 30;
    const targetInterview = 25;
    const targetResume = 100;

    const dsaGap = Math.max(0, targetDSA - completedCoding);
    const aptitudeGap = Math.max(0, targetAptitude - completedAptitude);
    const interviewGap = Math.max(0, targetInterview - interviewBookmarks);
    const resumeGap = Math.max(0, targetResume - resumeScore);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['DSA', 'Aptitude', 'Interview', 'Resume'],
        datasets: [{
          label: 'Gap Remaining',
          data: [dsaGap, aptitudeGap, interviewGap, resumeGap],
          backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#06B6D4'],
          borderRadius: 8
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
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6B6890' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#6B6890' }
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

  function calculateCurrentReadiness() {
    const completedCoding = Progress.getCompleted('coding').length;
    const completedAptitude = Progress.getCompleted('aptitude').length;
    const interviewBookmarks = Progress.getBookmarks('interview').length;
    const resumeScore = ResumeState.getScore();
    const profile = UserProfile.get();
    
    const dsaScore = Math.min((completedCoding / 40) * 30, 30);
    const aptitudeScore = Math.min((completedAptitude / 30) * 20, 20);
    const interviewScore = Math.min((interviewBookmarks / 30) * 20, 20);
    const resumeScoreWeighted = (resumeScore / 100) * 20;
    const streakScore = Math.min((profile.streak / 30) * 10, 10);
    
    return Math.round(dsaScore + aptitudeScore + interviewScore + resumeScoreWeighted + streakScore);
  }

  function updateAchievementStats() {
    const unlocked = AchievementState.getUnlocked();
    const totalBadges = BADGES.length;
    const profile = UserProfile.get();

    const statsContainer = document.getElementById('achievement-stats');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="flex gap-6">
          <div>
            <div class="stat-card-value">${unlocked.length}/${totalBadges}</div>
            <div class="text-muted">Badges Earned</div>
          </div>
          <div>
            <div class="stat-card-value">${profile.xp || 0}</div>
            <div class="text-muted">Total XP</div>
          </div>
          <div>
            <div class="stat-card-value">${profile.streak || 0}</div>
            <div class="text-muted">Day Streak</div>
          </div>
        </div>
      `;
    }
  }

  window.AnalyticsPage = {
    refresh: initAnalyticsPage
  };
})();
