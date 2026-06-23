/* ============================================
   CareerCopilot Onboarding Logic
   First visit name collection and personalization
   ============================================ */

(function(){
  document.addEventListener('DOMContentLoaded', initOnboarding);

  function initOnboarding() {
    const profile = UserProfile.get();
    
    // Check if user has completed onboarding
    if (!profile.name || profile.name === 'Student' || !profile.targetCompany) {
      showOnboardingModal();
    } else {
      applyPersonalization(profile.name, profile.targetCompany);
    }
  }

  function showOnboardingModal() {
    // Create modal if it doesn't exist
    if (document.getElementById('onboarding-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'onboarding-modal';
    modal.innerHTML = `
      <div class="modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
        <div class="modal-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-8); max-width: 520px; width: 90%; text-align: center; animation: slideUp 0.4s ease;">
          <div style="font-size: 4rem; margin-bottom: var(--space-4);">🚀</div>
          <h2 style="margin-bottom: var(--space-2); color: var(--text-primary);">Welcome to CareerCopilot!</h2>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-6);">Let's personalize your placement preparation journey</p>
          
          <div class="form-group" style="margin-bottom: var(--space-4); text-align: left;">
            <label class="form-label">Your Name</label>
            <input type="text" id="user-name-input" class="form-input" placeholder="Enter your name" style="width: 100%; padding: var(--space-4); font-size: var(--text-base); background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); color: var(--text-primary);">
          </div>
          
          <div class="form-group" style="margin-bottom: var(--space-4); text-align: left;">
            <label class="form-label">Target Company</label>
            <select id="target-company-input" class="form-select" style="width: 100%; padding: var(--space-4); font-size: var(--text-base); background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); color: var(--text-primary);">
              <option value="">Select your dream company</option>
              <option value="TCS">Tata Consultancy Services (TCS)</option>
              <option value="Infosys">Infosys</option>
              <option value="Accenture">Accenture</option>
              <option value="Wipro">Wipro</option>
              <option value="Cognizant">Cognizant</option>
              <option value="Capgemini">Capgemini</option>
              <option value="Amazon">Amazon</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Meta">Meta (Facebook)</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div class="form-group" style="margin-bottom: var(--space-6); text-align: left;">
            <label class="form-label">Placement Date (Optional)</label>
            <input type="date" id="placement-date-input" class="form-input" style="width: 100%; padding: var(--space-4); font-size: var(--text-base); background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); color: var(--text-primary);">
          </div>
          
          <button class="btn btn-primary btn-lg" onclick="saveUserProfile()" style="width: 100%;">Start Your Journey</button>
          <p style="color: var(--text-muted); font-size: var(--text-sm); margin-top: var(--space-4);">Your progress is saved locally in your browser</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Focus on input
    setTimeout(() => document.getElementById('user-name-input').focus(), 100);

    // Handle Enter key
    document.getElementById('user-name-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') saveUserProfile();
    });
  }

  window.saveUserProfile = function() {
    const nameInput = document.getElementById('user-name-input');
    const companyInput = document.getElementById('target-company-input');
    const dateInput = document.getElementById('placement-date-input');
    
    const name = nameInput.value.trim();
    const targetCompany = companyInput.value;
    const placementDate = dateInput.value;
    
    if (!name) {
      nameInput.style.borderColor = 'var(--danger)';
      setTimeout(() => nameInput.style.borderColor = 'var(--border)', 2000);
      return;
    }

    if (!targetCompany) {
      companyInput.style.borderColor = 'var(--danger)';
      setTimeout(() => companyInput.style.borderColor = 'var(--border)', 2000);
      return;
    }

    UserProfile.set({ 
      name: name,
      targetCompany: targetCompany,
      placementDate: placementDate
    });
    
    // Remove modal
    const modal = document.getElementById('onboarding-modal');
    if (modal) modal.remove();

    // Apply personalization
    applyPersonalization(name, targetCompany);

    // Show welcome toast
    CCToast(`Welcome, ${name}! Let's ace your ${targetCompany} placement! 🎯`, 'success');
  };

  function applyPersonalization(name, targetCompany) {
    // Update all name placeholders
    const firstName = name.split(' ')[0];
    
    // Dashboard
    const topbarName = document.getElementById('topbar-name');
    if (topbarName) topbarName.textContent = firstName;
    
    const sideName = document.getElementById('side-name');
    if (sideName) sideName.textContent = name;
    
    const sideAvatar = document.getElementById('side-avatar');
    if (sideAvatar) sideAvatar.textContent = name.charAt(0).toUpperCase();

    // Update greeting based on time and target company
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';

    const greetingEl = document.querySelector('.topbar-sub');
    if (greetingEl) {
      if (targetCompany && targetCompany !== 'Other') {
        greetingEl.textContent = `${greeting}, ${firstName}. Your ${targetCompany} preparation is shaping up`;
      } else {
        greetingEl.textContent = `${greeting}, ${firstName}. Here's how your placement prep is shaping up`;
      }
    }
  }

  window.Onboarding = {
    show: showOnboardingModal,
    personalize: applyPersonalization
  };
})();
