/* ============================================
   CareerCopilot Achievements Logic
   Badge tracking and display
   ============================================ */

(function(){
  document.addEventListener('DOMContentLoaded', initAchievementsPage);

  function initAchievementsPage() {
    renderBadges();
    updateStats();
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
