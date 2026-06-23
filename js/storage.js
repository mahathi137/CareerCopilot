/* ============================================
   CareerCopilot Storage Utilities
   ============================================ */

const Storage = {
  PREFIX: 'cc_',

  get(key, defaultVal = null) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      if (raw === null) return defaultVal;
      return JSON.parse(raw);
    } catch { return defaultVal; }
  },

  set(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
      return true;
    } catch { return false; }
  },

  remove(key) {
    localStorage.removeItem(this.PREFIX + key);
  },

  clear() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(this.PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  },

  // Increment a numeric value
  increment(key, amount = 1) {
    const current = this.get(key, 0);
    this.set(key, current + amount);
    return current + amount;
  },

  // Merge object
  merge(key, obj) {
    const current = this.get(key, {});
    const updated = { ...current, ...obj };
    this.set(key, updated);
    return updated;
  },

  // Array push
  push(key, item, maxLength = null) {
    const arr = this.get(key, []);
    arr.push(item);
    if (maxLength && arr.length > maxLength) arr.shift();
    this.set(key, arr);
    return arr;
  },

  // Export all as JSON
  export() {
    const data = {};
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(this.PREFIX)) {
        const shortKey = k.replace(this.PREFIX, '');
        try { data[shortKey] = JSON.parse(localStorage.getItem(k)); }
        catch { data[shortKey] = localStorage.getItem(k); }
      }
    });
    return data;
  },

  // Import from JSON
  import(data) {
    Object.entries(data).forEach(([k, v]) => {
      this.set(k, v);
    });
  }
};

// ---- User Profile ----
const UserProfile = {
  KEY: 'profile',

  get() {
    return Storage.get(this.KEY, {
      name: 'Student',
      email: '',
      targetCompany: 'TCS',
      placementDate: '',
      dailyHours: 4,
      rank: 'Beginner',
      xp: 0,
      streak: 0,
      lastStudyDate: null,
      joined: new Date().toISOString()
    });
  },

  set(data) {
    const current = this.get();
    Storage.set(this.KEY, { ...current, ...data });
  },

  addXP(amount) {
    const profile = this.get();
    profile.xp += amount;
    profile.rank = this._calculateRank(profile.xp);
    Storage.set(this.KEY, profile);
    return profile;
  },

  updateStreak() {
    const profile = this.get();
    const today = new Date().toDateString();
    const lastDate = profile.lastStudyDate ? new Date(profile.lastStudyDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastDate === today) return profile.streak;
    if (lastDate === yesterday) profile.streak += 1;
    else if (lastDate !== today) profile.streak = 1;

    profile.lastStudyDate = new Date().toISOString();
    Storage.set(this.KEY, profile);
    return profile.streak;
  },

  _calculateRank(xp) {
    if (xp < 100) return 'Beginner';
    if (xp < 300) return 'Learner';
    if (xp < 700) return 'Practitioner';
    if (xp < 1500) return 'Achiever';
    if (xp < 3000) return 'Expert';
    if (xp < 5000) return 'Champion';
    return 'Placement Master';
  }
};

// ---- Progress Tracking ----
const Progress = {
  // Coding progress
  getCompleted(category = 'coding') {
    return Storage.get(`completed_${category}`, []);
  },
  markComplete(id, category = 'coding') {
    const list = this.getCompleted(category);
    if (!list.includes(id)) {
      list.push(id);
      Storage.set(`completed_${category}`, list);
      UserProfile.addXP(category === 'coding' ? 15 : 10);
    }
  },
  unmarkComplete(id, category = 'coding') {
    const list = this.getCompleted(category).filter(x => x !== id);
    Storage.set(`completed_${category}`, list);
  },
  isComplete(id, category = 'coding') {
    return this.getCompleted(category).includes(id);
  },

  // Bookmarks
  getBookmarks(category = 'interview') {
    return Storage.get(`bookmarks_${category}`, []);
  },
  toggleBookmark(id, category = 'interview') {
    const list = this.getBookmarks(category);
    const idx = list.indexOf(id);
    if (idx > -1) list.splice(idx, 1);
    else list.push(id);
    Storage.set(`bookmarks_${category}`, list);
    return idx === -1;
  },
  isBookmarked(id, category = 'interview') {
    return this.getBookmarks(category).includes(id);
  },

  // Notes
  getNotes() {
    return Storage.get('notes', {});
  },
  saveNote(id, text) {
    const notes = this.getNotes();
    notes[id] = text;
    Storage.set('notes', notes);
  },
  getNote(id) {
    return this.getNotes()[id] || '';
  }
};

// ---- Aptitude Quiz State ----
const AptitudeState = {
  getScores() {
    return Storage.get('aptitude_scores', {
      quantitative: { total: 0, correct: 0 },
      logical: { total: 0, correct: 0 },
      verbal: { total: 0, correct: 0 }
    });
  },
  recordAnswer(category, correct) {
    const scores = this.getScores();
    if (!scores[category]) scores[category] = { total: 0, correct: 0 };
    scores[category].total++;
    if (correct) scores[category].correct++;
    Storage.set('aptitude_scores', scores);
    if (correct) UserProfile.addXP(5);
  },
  getAccuracy(category) {
    const scores = this.getScores();
    const s = scores[category];
    if (!s || s.total === 0) return 0;
    return Math.round((s.correct / s.total) * 100);
  }
};

// ---- Achievements ----
const AchievementState = {
  getUnlocked() {
    return Storage.get('achievements', []);
  },
  unlock(id) {
    const list = this.getUnlocked();
    if (!list.includes(id)) {
      list.push(id);
      Storage.set('achievements', list);
      UserProfile.addXP(50);
      return true;
    }
    return false;
  },
  isUnlocked(id) {
    return this.getUnlocked().includes(id);
  }
};

// ---- Planner State ----
const PlannerState = {
  getSettings() {
    return Storage.get('planner_settings', {
      placementDate: '',
      dailyHours: 4,
      focusAreas: ['DSA', 'Aptitude', 'Interviews']
    });
  },
  setSettings(data) {
    Storage.set('planner_settings', data);
  },
  getCheckItems() {
    return Storage.get('planner_checks', {});
  },
  toggleCheck(key) {
    const checks = this.getCheckItems();
    checks[key] = !checks[key];
    Storage.set('planner_checks', checks);
    return checks[key];
  }
};

// ---- Analytics ----
const AnalyticsState = {
  logActivity(type, data = {}) {
    const entry = {
      type,
      data,
      date: new Date().toISOString(),
      day: new Date().toDateString()
    };
    Storage.push('activity_log', entry, 200);
  },

  getWeeklyActivity() {
    const log = Storage.get('activity_log', []);
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    return log.filter(e => new Date(e.date) > now - week);
  },

  getDailyScore() {
    const today = new Date().toDateString();
    const log = Storage.get('activity_log', []);
    return log.filter(e => new Date(e.date).toDateString() === today).length * 5;
  }
};

// ---- Resume Score ----
const ResumeState = {
  getChecklist() {
    return Storage.get('resume_checklist', {});
  },
  toggleItem(key) {
    const cl = this.getChecklist();
    cl[key] = !cl[key];
    Storage.set('resume_checklist', cl);
    return cl[key];
  },
  getScore() {
    const cl = this.getChecklist();
    const checked = Object.values(cl).filter(Boolean).length;
    const total = 20;
    return Math.round((checked / total) * 100);
  }
};

// ---- Dream Company Tracker ----
const CompanyTracker = {
  getDreamCompanies() {
    return Storage.get('dream_companies', []);
  },
  toggleDream(company) {
    const list = this.getDreamCompanies();
    const idx = list.indexOf(company);
    if (idx > -1) list.splice(idx, 1);
    else list.push(company);
    Storage.set('dream_companies', list);
    return idx === -1;
  },
  isDream(company) {
    return this.getDreamCompanies().includes(company);
  }
};