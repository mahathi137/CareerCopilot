/* ============================================
   CareerCopilot Settings Logic
   Profile management and data operations
   ============================================ */

(function(){
  document.addEventListener('DOMContentLoaded', initSettingsPage);

  function initSettingsPage() {
    loadProfile();
  }

  function loadProfile() {
    const profile = UserProfile.get();
    
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const companySelect = document.getElementById('profile-company');

    if (nameInput) nameInput.value = profile.name || '';
    if (emailInput) emailInput.value = profile.email || '';
    if (companySelect) companySelect.value = profile.targetCompany || 'TCS';
  }

  window.saveProfile = function() {
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const companySelect = document.getElementById('profile-company');

    const profile = {
      name: nameInput.value,
      email: emailInput.value,
      targetCompany: companySelect.value
    };

    UserProfile.set(profile);
    CCToast('Profile saved!', 'success');
    
    // Update sidebar display
    const sideName = document.getElementById('side-name');
    const sideAvatar = document.getElementById('side-avatar');
    if (sideName) sideName.textContent = profile.name || 'Student';
    if (sideAvatar) sideAvatar.textContent = (profile.name || 'S').charAt(0).toUpperCase();
  };

  window.exportData = function() {
    const data = Storage.export();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'careercopilot-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    CCToast('Data exported successfully!', 'success');
  };

  window.importData = function() {
    document.getElementById('import-file').click();
  };

  window.handleImport = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        Storage.import(data);
        CCToast('Data imported successfully!', 'success');
        location.reload();
      } catch (err) {
        CCToast('Invalid file format', 'error');
      }
    };
    reader.readAsText(file);
  };

  window.clearData = function() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      Storage.clear();
      CCToast('All data cleared', 'success');
      location.reload();
    }
  };

  window.toggleTheme = function() {
    if (typeof CCTheme !== 'undefined') {
      CCTheme.toggleTheme();
    }
  };

  window.resetProgress = function() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      Storage.clear();
      CCToast('Progress reset', 'success');
      location.reload();
    }
  };

  window.SettingsPage = {
    refresh: initSettingsPage
  };
})();
