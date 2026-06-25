/* ============================================
   CareerCopilot Achievements Logic
   Badge tracking and display
   ============================================ */

(function(){
  document.addEventListener('DOMContentLoaded', initAchievementsPage);

  function initAchievementsPage() {
    evaluateAchievements();
    renderBadges();
    updateStats();
  }

  function evaluateAchievements() {
    const completed = Progress.getCompleted('coding');
    const hardCompleted = (typeof CODING_QUESTIONS !== 'undefined' ? CODING_QUESTIONS : []).filter(q => q.difficulty === 'hard' && completed.includes(q.id)).length;
    const aptitudeScores = AptitudeState.getScores();
    const aptitudeCompleted = Object.values(aptitudeScores).reduce((sum, item) => sum + (item.total || 0), 0);
    const aptitudeCorrect = Object.values(aptitudeScores).reduce((sum, item) => sum + (item.correct || 0), 0);
    const stats = {
      codingCompleted: completed.length,
      hardCompleted,
      aptitudeCompleted,
      aptitudeAccuracy: aptitudeCompleted ? Math.round((aptitudeCorrect / aptitudeCompleted) * 100) : 0,
      interviewBookmarks: Progress.getBookmarks('interview').length,
      resumeScore: ResumeState.getScore(),
      streak: UserProfile.get().streak || 0,
      companiesStudied: Storage.get('companies_studied', []).length,
      readinessScore: calculateReadiness(),
      totalXP: UserProfile.get().xp || 0,
      plannerSetup: PlannerState.getTasks().length > 0,
      topicsExplored: new Set(completed.map(id => ((typeof CODING_QUESTIONS !== 'undefined' ? CODING_QUESTIONS : []).find(q => q.id === id) || {}).topic).filter(Boolean)).size
    };
    BADGES.forEach(badge => {
      try {
        if (badge.condition(stats)) AchievementState.unlock(badge.id);
      } catch {}
    });
  }

  function calculateReadiness() {
    const coding = Progress.getCompleted('coding').length;
    const aptitude = Object.values(AptitudeState.getScores()).reduce((sum, item) => sum + (item.total || 0), 0);
    const interview = Progress.getBookmarks('interview').length;
    const resume = ResumeState.getScore();
    const streak = UserProfile.get().streak || 0;
    return Math.round(Math.min(coding / 150 * 30, 30) + Math.min(aptitude / 30 * 20, 20) + Math.min(interview / 30 * 20, 20) + resume * .2 + Math.min(streak / 30 * 10, 10));
  }

  function renderBadges() {
    const grid = document.getElementById('badges-grid');
    if (!grid) return;

    const unlocked = AchievementState.getUnlocked();
    const profile = UserProfile.get();

    grid.innerHTML = BADGES.map(badge => {
      const isUnlocked = unlocked.includes(badge.id);
      return `
        <div class="card card-pad" style="text-align: center; opacity: ${isUnlocked ? '1' : '0.5'};">
          <div style="font-size: 3rem; margin-bottom: var(--space-3); filter: ${isUnlocked ? 'none' : 'grayscale(100%)'};">${badge.icon}</div>
          <h3 style="margin-bottom: var(--space-2); color: var(--text-primary);">${badge.name}</h3>
          <p style="color: var(--text-muted); font-size: var(--text-sm); margin-bottom: var(--space-3);">${badge.description}</p>
          <span class="badge ${isUnlocked ? 'badge-success' : 'badge-muted'}">
            ${isUnlocked ? '✓ Unlocked' : `+${badge.xp} XP`}
          </span>
        </div>
      `;
    }).join('');
  }

  function updateStats() {
    const unlocked = AchievementState.getUnlocked();
    const profile = UserProfile.get();

    const badgesEarned = document.getElementById('badges-earned');
    const totalXP = document.getElementById('total-xp');
    const currentRank = document.getElementById('current-rank');
    const streakDays = document.getElementById('streak-days');

    if (badgesEarned) badgesEarned.textContent = unlocked.length;
    if (totalXP) totalXP.textContent = profile.xp || 0;
    if (currentRank) currentRank.textContent = profile.rank || 'Beginner';
    if (streakDays) streakDays.textContent = profile.streak || 0;
  }

  window.AchievementsPage = {
    refresh: initAchievementsPage
  };
})();
