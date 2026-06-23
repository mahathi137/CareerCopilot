/* ============================================
   CareerCopilot Study Planner Logic
   Weekly study plan and settings
   ============================================ */

(function(){
  document.addEventListener('DOMContentLoaded', initPlannerPage);

  function initPlannerPage() {
    loadSettings();
    renderWeeklyPlan();
  }

  function loadSettings() {
    const settings = PlannerState.getSettings();
    
    const dateInput = document.getElementById('placement-date');
    const hoursSelect = document.getElementById('daily-hours');
    const focusSelect = document.getElementById('focus-areas');

    if (dateInput && settings.placementDate) dateInput.value = settings.placementDate;
    if (hoursSelect) hoursSelect.value = settings.dailyHours;
    if (focusSelect) focusSelect.value = settings.focusAreas[0] || 'balanced';
  }

  window.saveSettings = function() {
    const dateInput = document.getElementById('placement-date');
    const hoursSelect = document.getElementById('daily-hours');
    const focusSelect = document.getElementById('focus-areas');

    const settings = {
      placementDate: dateInput.value,
      dailyHours: parseInt(hoursSelect.value),
      focusAreas: [focusSelect.value]
    };

    PlannerState.setSettings(settings);
    
    // Update profile
    UserProfile.set({ placementDate: dateInput.value });
    
    CCToast('Settings saved!', 'success');
    renderWeeklyPlan();
  };

  function renderWeeklyPlan() {
    const container = document.getElementById('weekly-plan');
    if (!container) return;

    const settings = PlannerState.getSettings();
    const checks = PlannerState.getCheckItems();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    container.innerHTML = days.map((day, idx) => {
      const checkKey = `day_${idx}`;
      const isChecked = checks[checkKey];
      return `
        <div class="card" style="padding: var(--space-4);">
          <div class="flex justify-between items-center">
            <div>
              <strong style="color: var(--text-primary);">${day}</strong>
              <div style="font-size: var(--text-sm); color: var(--text-muted); margin-top: 2px;">
                ${settings.dailyHours} hours • ${getDayFocus(idx, settings.focusAreas[0])}
              </div>
            </div>
            <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleCheck('${checkKey}')" style="width: 20px; height: 20px;">
          </div>
        </div>
      `;
    }).join('');
  }

  function getDayFocus(dayIndex, focus) {
    const focuses = {
      'balanced': ['DSA', 'Aptitude', 'DSA', 'Interview', 'Aptitude', 'Projects', 'Review'],
      'dsa-heavy': ['DSA', 'DSA', 'DSA', 'Aptitude', 'DSA', 'DSA', 'Review'],
      'aptitude-heavy': ['Aptitude', 'Aptitude', 'DSA', 'Aptitude', 'Interview', 'Aptitude', 'Review']
    };
    return focuses[focus] ? focuses[focus][dayIndex] : 'DSA';
  }

  window.toggleCheck = function(key) {
    PlannerState.toggleCheck(key);
  };

  window.PlannerPage = {
    refresh: initPlannerPage
  };
})();
