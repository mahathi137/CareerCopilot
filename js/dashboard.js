/* ============================================
   CareerCopilot Dashboard Logic
   Charts, stats, and recommendations
   ============================================ */

(function(){
  // Initialize dashboard when DOM is ready
  document.addEventListener('DOMContentLoaded', initDashboard);

  function initDashboard() {
    updateProfileDisplay();
    updateStats();
    initCharts();
    updateRecommendations();
    updateQuote();
    updateGoals();
  }

  // Update profile display in sidebar and topbar
  function updateProfileDisplay() {
    const profile = UserProfile.get();
    const firstName = (profile.name || 'Student').split(' ')[0];
    const targetCompany = profile.targetCompany || '';
    
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
        topbarSub.textContent = `${greeting}, ${firstName}. Your ${targetCompany} preparation is shaping up`;
      } else {
        topbarSub.textContent = `${greeting}, ${firstName}. Here's how your placement prep is shaping up`;
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
    const healthScore = calculateHealthScore();
    
    // Update stat displays
    updateStat('stat-readiness', readinessScore + '%');
    updateStat('stat-health', healthScore + '%');
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

  function calculateReadinessScore() {
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

  // Initialize Chart.js charts
  function initCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded');
      return;
    }

    initProgressChart();
    initTopicsChart();
  }

  function initProgressChart() {
    const ctx = document.getElementById('chart-progress');
    if (!ctx) return;

    const completedCoding = Progress.getCompleted('coding').length;
    const completedAptitude = Progress.getCompleted('aptitude').length;
    const interviewBookmarks = Progress.getBookmarks('interview').length;
    const resumeScore = ResumeState.getScore();

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
    const completedAptitude = Progress.getCompleted('aptitude').length;
    const interviewBookmarks = Progress.getBookmarks('interview').length;

    const goalCoding = document.getElementById('goal-coding');
    const goalAptitude = document.getElementById('goal-aptitude');
    const goalInterview = document.getElementById('goal-interview');

    if (goalCoding) goalCoding.textContent = `${Math.min(completedCoding, 10)}/10 completed`;
    if (goalAptitude) goalAptitude.textContent = `${Math.min(completedAptitude, 3)}/3 completed`;
    if (goalInterview) goalInterview.textContent = `${Math.min(interviewBookmarks, 5)}/5 completed`;
  }

  // Expose update function for external calls
  window.Dashboard = {
    refresh: initDashboard,
    updateStats: updateStats,
    updateRecommendations: updateRecommendations
  };
})();
