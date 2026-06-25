/* ============================================
   CareerCopilot Profile Setup
   Single LocalStorage-backed profile modal
   ============================================ */

(function(){
  document.addEventListener('DOMContentLoaded', initOnboarding);

  function initOnboarding() {
    if (typeof UserProfile === 'undefined') return;
    const profile = UserProfile.get();
    const wantsProfile = new URLSearchParams(location.search).get('profile') === '1';
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    const isLanding = currentPage === 'index.html' || currentPage === '';
    const needsProfile = !UserProfile.isComplete(profile);

    if (wantsProfile) {
      if (!needsProfile) {
        history.replaceState(null, '', location.pathname);
        location.href = 'dashboard.html';
        return;
      }
      showOnboardingModal({ required: true, fromLanding: isLanding });
    } else if (!isLanding && needsProfile) {
      showOnboardingModal({ required: true, fromLanding: false });
    } else {
      applyPersonalization(profile.name, profile.targetCompany || profile.dreamCompany);
    }
  }

  function value(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  function showOnboardingModal(options = {}) {
    if (document.getElementById('onboarding-modal')) return;
    const profile = UserProfile.get();
    const isEdit = Boolean(options.edit) || UserProfile.isComplete(profile);
    const skills = Array.isArray(profile.skills) ? profile.skills.join(', ') : (profile.skills || '');
    const appShell = document.querySelector('.app');
    if (options.required && appShell) {
      document.body.classList.add('profile-required');
      appShell.setAttribute('aria-hidden', 'true');
    }

    const modal = document.createElement('div');
    modal.id = 'onboarding-modal';
    modal.dataset.fromLanding = options.fromLanding ? 'true' : 'false';
    modal.dataset.editMode = isEdit && !options.required ? 'true' : 'false';
    modal.innerHTML = `
      <div class="modal-overlay active">
        <div class="modal profile-setup-modal">
          <div class="profile-setup-mark">CC</div>
          <h2>${isEdit ? 'Edit Profile' : 'Create Profile'}</h2>
          <p>${isEdit ? 'Update your saved profile information and save changes.' : 'Enter your name, email, target role, target company, placement date, and skills to save your profile.'}</p>

          <div class="content-grid-2">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="user-name-input" class="form-input" placeholder="Enter your name">
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" id="user-email-input" class="form-input" placeholder="you@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">Target Job Role</label>
              <input type="text" id="target-role-input" class="form-input" placeholder="Software Developer">
            </div>
            <div class="form-group">
              <label class="form-label">Target Company</label>
              <select id="dream-company-input" class="form-select">
                <option value="">Select your target company</option>
                <option value="TCS">TCS</option>
                <option value="Infosys">Infosys</option>
                <option value="Accenture">Accenture</option>
                <option value="Wipro">Wipro</option>
                <option value="Cognizant">Cognizant</option>
                <option value="Capgemini">Capgemini</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Placement Date</label>
              <input type="date" id="placement-date-input" class="form-input">
            </div>
          </div>

          <div class="form-group mt-4">
            <label class="form-label">Skills</label>
            <input type="text" id="user-skills-input" class="form-input" placeholder="Java, Python, SQL, React">
          </div>

          <button class="btn btn-primary btn-lg btn-block mt-4" onclick="saveUserProfile()">Save Profile</button>
          <p class="profile-setup-note">This saves your local placement profile with Name, Email, Target Role, Target Company, Placement Date, and Skills.</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    setValue('user-name-input', profile.name === 'Student' ? '' : profile.name);
    setValue('user-email-input', profile.email);
    setValue('target-role-input', profile.targetRole);
    setValue('dream-company-input', profile.dreamCompany || profile.targetCompany);
    setValue('placement-date-input', profile.placementDate);
    setValue('user-skills-input', skills);

    setTimeout(() => document.getElementById('user-name-input')?.focus(), 100);
    ['user-name-input', 'user-email-input', 'target-role-input', 'dream-company-input', 'placement-date-input', 'user-skills-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keydown', e => {
        if (e.key === 'Enter') window.saveUserProfile();
      });
    });
  }

  window.saveUserProfile = function() {
    const nameInput = document.getElementById('user-name-input');
    const emailInput = document.getElementById('user-email-input');
    const roleInput = document.getElementById('target-role-input');
    const companyInput = document.getElementById('dream-company-input');
    const dateInput = document.getElementById('placement-date-input');
    const skillsInput = document.getElementById('user-skills-input');
    const name = value('user-name-input');
    const email = value('user-email-input');
    const targetRole = value('target-role-input');
    const dreamCompany = value('dream-company-input');
    const placementDate = value('placement-date-input');
    const skills = value('user-skills-input').split(',').map(skill => skill.trim()).filter(Boolean);

    const markInvalid = (input, message) => {
      if (!input) return;
      input.style.borderColor = 'var(--danger)';
      input.focus();
      if (typeof CCToast === 'function') CCToast(message, 'error');
      setTimeout(() => input.style.borderColor = 'var(--border)', 1800);
    };

    if (!name) {
      markInvalid(nameInput, 'Please enter your name');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      markInvalid(emailInput, 'Please enter a valid email');
      return;
    }
    if (!targetRole) {
      markInvalid(roleInput, 'Please enter your target job role');
      return;
    }
    if (!dreamCompany) {
      markInvalid(companyInput, 'Please select your dream company');
      return;
    }
    if (!placementDate) {
      markInvalid(dateInput, 'Please select your placement date');
      return;
    }
    if (!skills.length) {
      markInvalid(skillsInput, 'Please add at least one current skill');
      return;
    }

    const data = {
      name,
      email,
      targetRole,
      dreamCompany,
      targetCompany: dreamCompany,
      placementDate,
      skills
    };

    UserProfile.set(data);
    const savedProfile = UserProfile.get();
    const modal = document.getElementById('onboarding-modal');
    const fromLanding = modal?.dataset.fromLanding === 'true';
    const editMode = modal?.dataset.editMode === 'true';
    document.getElementById('onboarding-modal')?.remove();
    document.body.classList.remove('profile-required');
    const appShell = document.querySelector('.app');
    if (appShell) {
      appShell.removeAttribute('aria-hidden');
      appShell.style.filter = '';
    }
    applyPersonalization(name, dreamCompany);
    if (typeof CCToast === 'function') CCToast(`Profile saved. Your ${targetRole} prep is ready.`, 'success');
    window.dispatchEvent(new CustomEvent('cc:profile-updated', { detail: savedProfile }));

    if (location.search.includes('profile=1')) {
      history.replaceState(null, '', location.pathname);
    }

    if (!editMode && (fromLanding || !location.pathname.endsWith('dashboard.html'))) {
      location.href = 'dashboard.html';
    }
  };

  function applyPersonalization(name, targetCompany) {
    if (typeof window.CCPersonalize === 'function') window.CCPersonalize();

    const firstName = (name || 'Student').split(' ')[0];
    const topbarName = document.getElementById('topbar-name');
    if (topbarName) topbarName.textContent = firstName;

    const isDashboard = !!topbarName;
    if (!isDashboard) return;

    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';

    const greetingEl = document.querySelector('.topbar-sub');
    const profile = UserProfile.get();
    if (greetingEl) greetingEl.textContent = `${greeting}, ${firstName}. Your ${profile.targetRole || targetCompany || 'placement'} preparation is shaping up.`;
  }

  window.Onboarding = {
    show: showOnboardingModal,
    edit: () => showOnboardingModal({ edit: true }),
    personalize: applyPersonalization
  };
})();
