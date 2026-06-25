/* ============================================
   CareerCopilot Analytics Dashboard
   ============================================ */

(function(){
  const ROLE_SKILLS = {
    'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Node'],
    'Software Developer': ['Java', 'Python', 'C++', 'DSA', 'SQL', 'OOP'],
    'Data Analyst': ['Excel', 'SQL', 'Python', 'Statistics', 'Power BI', 'Projects'],
    'AI Engineer': ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Deep Learning', 'Projects']
  };

  document.addEventListener('DOMContentLoaded', initAnalyticsPage);

  function initAnalyticsPage() {
    const model = buildModel();
    updateSummary(model);
    renderSkillGap();
    document.getElementById('skill-gap-role')?.addEventListener('change', renderSkillGap);
    if (typeof Chart === 'undefined') {
      document.querySelectorAll('canvas').forEach(c => showEmpty(c, 'Chart.js could not be loaded. Progress data remains saved locally.'));
      return;
    }
    renderCharts(model);
  }

  function buildModel() {
    const profile = UserProfile.get();
    const codingCompleted = Progress.getCompleted('coding');
    const codingTotal = Math.max((typeof CODING_QUESTIONS !== 'undefined' && CODING_QUESTIONS.length) || 40, 1);
    const codingPct = Math.round(codingCompleted.length / codingTotal * 100);
    const aptitude = AptitudeState.getScores();
    const aptitudeTotal = Object.values(aptitude).reduce((sum, s) => sum + (s.total || 0), 0);
    const interview = Progress.getCompleted('interview').length + Progress.getBookmarks('interview').length;
    const resumeScore = Storage.get('resume_analysis', {}).atsScore || ResumeState.getScore();
    const readiness = Math.round(Math.min(codingPct,100) * .35 + Math.min(aptitudeTotal / 30 * 100,100) * .2 + Math.min(interview / 20 * 100,100) * .2 + resumeScore * .2 + Math.min(profile.streak || 0, 10) * .5);
    return { profile, codingCompleted, codingTotal, codingPct, aptitudeTotal, interview, resumeScore, readiness, weekly: weeklyBuckets(), topics: topicCounts(codingCompleted) };
  }

  function updateSummary(model) {
    setText('analytics-coding', `${model.codingPct}%`);
    setText('analytics-dsa', model.codingCompleted.length);
    setText('analytics-streak', model.profile.streak || 0);
    setText('analytics-readiness', `${model.readiness}%`);
  }

  function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }

  function colors() {
    const styles = getComputedStyle(document.documentElement);
    return { text: styles.getPropertyValue('--text-secondary').trim() || '#777', grid: styles.getPropertyValue('--border').trim() || '#ddd' };
  }

  function chartOptions(extra = {}) {
    const c = colors();
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: c.text } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: c.text } },
        y: { beginAtZero: true, grid: { color: c.grid }, ticks: { color: c.text } }
      },
      ...extra
    };
  }

  function renderCharts(model) {
    createChart('coding-activity-chart', {
      type: 'line',
      data: { labels: model.weekly.labels, datasets: [{ label: 'Activities', data: model.weekly.values, borderColor: '#6366F1', backgroundColor: 'rgba(99,102,241,.18)', fill: true, tension: .35 }] },
      options: chartOptions({ plugins: { legend: { display: false } } })
    });

    const topics = Object.keys(model.topics).length ? model.topics : { Arrays: 0, Strings: 0, Trees: 0, Graphs: 0, DP: 0 };
    createChart('dsa-topic-chart', {
      type: 'bar',
      data: { labels: Object.keys(topics), datasets: [{ label: 'Solved', data: Object.values(topics), backgroundColor: '#10B981', borderRadius: 8 }] },
      options: chartOptions({ plugins: { legend: { display: false } } })
    });

    const studied = Storage.get('companies_studied', []);
    const companies = ['TCS', 'Infosys', 'Accenture', 'Wipro', 'Cognizant', 'Capgemini'];
    createChart('company-progress-chart', {
      type: 'bar',
      data: { labels: companies, datasets: [{ label: 'Progress %', data: companies.map(c => studied.includes(c) ? 100 : 20), backgroundColor: '#F59E0B', borderRadius: 8 }] },
      options: chartOptions({ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, grid: { color: colors().grid }, ticks: { color: colors().text } }, x: { grid: { display: false }, ticks: { color: colors().text } } } })
    });

    createChart('weekly-performance-chart', {
      type: 'doughnut',
      data: { labels: ['Coding', 'Aptitude', 'Interview', 'Resume'], datasets: [{ data: [model.codingPct, Math.min(model.aptitudeTotal / 30 * 100, 100), Math.min(model.interview / 20 * 100, 100), model.resumeScore], backgroundColor: ['#6366F1','#06B6D4','#F59E0B','#10B981'], borderWidth: 0 }] },
      options: chartOptions({ cutout: '64%', scales: {} })
    });
  }

  function createChart(id, config) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    new Chart(canvas, config);
  }

  function showEmpty(canvas, message) {
    canvas.style.display = 'none';
    const box = document.createElement('div');
    box.className = 'chart-empty-state';
    box.innerHTML = `<div><strong>No chart available</strong><p>${message}</p></div>`;
    canvas.parentElement.appendChild(box);
  }

  function topicCounts(completed) {
    const counts = {};
    if (typeof CODING_QUESTIONS === 'undefined') return counts;
    CODING_QUESTIONS.forEach(q => {
      if (completed.includes(q.id)) counts[q.topic] = (counts[q.topic] || 0) + 1;
    });
    return counts;
  }

  function weeklyBuckets() {
    const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const values = new Array(7).fill(0);
    AnalyticsState.getWeeklyActivity().forEach(entry => {
      const day = new Date(entry.date).getDay();
      values[day === 0 ? 6 : day - 1]++;
    });
    if (!values.some(Boolean)) values[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] = Progress.getCompleted('coding').length;
    return { labels, values };
  }

  function renderSkillGap() {
    const role = document.getElementById('skill-gap-role')?.value || 'Frontend Developer';
    const profile = UserProfile.get();
    const current = (profile.skills || []).map(s => String(s).toLowerCase());
    const skills = ROLE_SKILLS[role] || ROLE_SKILLS['Frontend Developer'];
    document.getElementById('skill-gap-results').innerHTML = skills.map(skill => {
      const has = current.some(s => skill.toLowerCase().includes(s) || s.includes(skill.toLowerCase()));
      return `<div class="skill-gap-item ${has ? 'has' : 'missing'}"><strong>${skill}</strong><span>${has ? 'Current' : 'Recommended next'}</span></div>`;
    }).join('') + `<div class="skill-gap-recommendation"><strong>Recommendations</strong><span>Learn the first missing skill, build 2 projects, and add proof to your resume.</span></div>`;
  }

  window.AnalyticsPage = { refresh: initAnalyticsPage };
})();
