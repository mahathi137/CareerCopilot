/* ============================================
   CareerCopilot Study Planner Board
   ============================================ */

(function(){
  const columns = [
    { id: 'todo', label: 'To Do' },
    { id: 'inprogress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' }
  ];

  document.addEventListener('DOMContentLoaded', initPlannerPage);

  function initPlannerPage() {
    hydrateSettingsFromProfile();
    loadGoals();
    hydrateRoadmapInputs();
    renderCareerRoadmap();
    renderBoard();
    bindDragTargets();
    window.addEventListener('cc:profile-updated', renderCountdown);
  }

  function hydrateRoadmapInputs() {
    const profile = UserProfile.get();
    const deadline = document.getElementById('roadmap-deadline');
    if (deadline && profile.placementDate) deadline.value = profile.placementDate;
  }

  function roadmapTemplate(role, level, profile) {
    const skills = (profile.skills || []).join(', ') || 'your current skills';
    const base = {
      'Software Developer': ['Programming basics and complexity', 'Arrays, strings, linked list', 'Trees, graphs, DBMS, OOP', 'Projects, resume, mock interviews'],
      'Frontend Developer': ['HTML, CSS, JavaScript fundamentals', 'React, routing, state, API integration', 'Responsive projects and GitHub polish', 'Resume, portfolio, interviews'],
      'Data Analyst': ['Excel, SQL, statistics basics', 'Python, pandas, data cleaning', 'Dashboards, visualization, case studies', 'Portfolio, resume, mock interviews'],
      'AI Engineer': ['Python, math, statistics refresh', 'ML algorithms and model evaluation', 'Deep learning basics and projects', 'Portfolio, resume, mock interviews']
    };
    const weeks = base[role] || base['Software Developer'];
    return weeks.map((focus, index) => ({
      week: `Week ${index + 1}`,
      focus,
      tasks: [
        `Study ${focus} with notes for ${level.toLowerCase()} level`,
        `Complete 5 focused practice items connected to ${role}`,
        `Add one proof point from ${skills} to resume or portfolio`
      ]
    }));
  }

  window.generateCareerRoadmap = function() {
    const profile = UserProfile.get();
    const role = document.getElementById('roadmap-role').value;
    const level = document.getElementById('roadmap-level').value;
    const deadline = document.getElementById('roadmap-deadline').value || profile.placementDate || '';
    const plan = {
      role,
      level,
      deadline,
      created: new Date().toISOString(),
      weeks: roadmapTemplate(role, level, profile)
    };
    Storage.set('career_roadmap', plan);
    Storage.set('career_roadmap_checks', {});
    renderCareerRoadmap();
    CCToast('Career roadmap generated', 'success');
  };

  function renderCareerRoadmap() {
    const plan = Storage.get('career_roadmap');
    const output = document.getElementById('career-roadmap-output');
    if (!output) return;
    if (!plan) {
      output.innerHTML = '<div class="planner-empty">Generate a roadmap to see weekly focus areas, daily tasks, and progress tracking.</div>';
      updateRoadmapProgress(0, 0);
      return;
    }
    const checks = Storage.get('career_roadmap_checks', {});
    const items = plan.weeks.flatMap((week, wi) => week.tasks.map((task, ti) => ({ key: `${wi}_${ti}`, task })));
    const done = items.filter(item => checks[item.key]).length;
    updateRoadmapProgress(done, items.length);
    output.innerHTML = `
      <div class="roadmap-summary">
        <strong>${escapeHtml(plan.role)} - ${escapeHtml(plan.level)}</strong>
        <span>${plan.deadline ? `Deadline: ${escapeHtml(plan.deadline)}` : 'Deadline not set'}</span>
      </div>
      <div class="career-roadmap-weeks">
        ${plan.weeks.map((week, wi) => `
          <article class="career-roadmap-week">
            <h4>${week.week}: ${escapeHtml(week.focus)}</h4>
            ${week.tasks.map((task, ti) => {
              const key = `${wi}_${ti}`;
              return `<label class="roadmap-task"><input type="checkbox" ${checks[key] ? 'checked' : ''} onchange="toggleRoadmapTask('${key}')"><span>${escapeHtml(task)}</span></label>`;
            }).join('')}
          </article>
        `).join('')}
      </div>
    `;
  }

  window.toggleRoadmapTask = function(key) {
    const checks = Storage.get('career_roadmap_checks', {});
    checks[key] = !checks[key];
    Storage.set('career_roadmap_checks', checks);
    renderCareerRoadmap();
  };

  function updateRoadmapProgress(done, total) {
    const badge = document.getElementById('roadmap-progress-badge');
    const pct = total ? Math.round(done / total * 100) : 0;
    if (badge) badge.textContent = `${pct}% complete`;
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function hydrateSettingsFromProfile() {
    const profile = UserProfile.get();
    const settings = PlannerState.getSettings();
    if (profile.placementDate && !settings.placementDate) {
      PlannerState.setSettings({ ...settings, placementDate: profile.placementDate });
    }
  }

  function loadGoals() {
    const goals = PlannerState.getGoals();
    const weekly = document.getElementById('weekly-goal');
    const monthly = document.getElementById('monthly-goal');
    if (weekly) weekly.value = goals.weekly || '';
    if (monthly) monthly.value = goals.monthly || '';
  }

  window.saveGoals = function() {
    PlannerState.setGoals({
      weekly: document.getElementById('weekly-goal').value.trim(),
      monthly: document.getElementById('monthly-goal').value.trim()
    });
    renderGoalCards();
    CCToast('Goals saved', 'success');
  };

  function renderBoard() {
    const tasks = normalizeTasks();
    columns.forEach(col => renderColumn(col.id, tasks.filter(t => t.status === col.id)));
    renderStats(tasks);
    renderGoalCards();
    renderCountdown();
  }

  function normalizeTasks() {
    const tasks = PlannerState.getTasks().map(task => ({
      ...task,
      status: task.status || (task.done ? 'completed' : 'todo'),
      priority: task.priority || 'medium'
    }));
    Storage.set('planner_tasks', tasks);
    return tasks;
  }

  function renderColumn(status, tasks) {
    const zone = document.getElementById(`column-${status}`);
    const count = document.getElementById(`count-${status}`);
    if (!zone) return;
    if (count) count.textContent = tasks.length;

    if (!tasks.length) {
      zone.innerHTML = `<div class="planner-empty">Drop tasks here or add a new ${columns.find(c => c.id === status).label.toLowerCase()} item.</div>`;
      return;
    }

    zone.innerHTML = tasks.map(task => `
      <article class="planner-task priority-${task.priority}" draggable="true" data-task-id="${task.id}">
        <div class="planner-task-top">
          <span class="badge badge-${task.priority === 'high' ? 'danger' : task.priority === 'low' ? 'success' : 'warning'}">${escapeHtml(task.priority)}</span>
          <span class="planner-due">${task.date ? `Due ${escapeHtml(task.date)}` : 'No due date'}</span>
        </div>
        <h4>${escapeHtml(task.title)}</h4>
        <div class="planner-task-meta">
          <span>${escapeHtml(task.area)}</span>
          <span>${status === 'completed' ? 'Done' : columns.find(c => c.id === status).label}</span>
        </div>
        <div class="planner-task-actions">
          <button class="btn btn-sm btn-ghost" onclick="editTask('${task.id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTask('${task.id}')">Delete</button>
        </div>
      </article>
    `).join('');

    zone.querySelectorAll('.planner-task').forEach(card => {
      card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', card.dataset.taskId);
        card.classList.add('dragging');
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });
  }

  function bindDragTargets() {
    document.querySelectorAll('.planner-column').forEach(column => {
      column.addEventListener('dragover', e => {
        e.preventDefault();
        column.classList.add('drag-over');
      });
      column.addEventListener('dragleave', () => column.classList.remove('drag-over'));
      column.addEventListener('drop', e => {
        e.preventDefault();
        column.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain');
        const status = column.dataset.status;
        if (id && status) {
          PlannerState.moveTask(id, status);
          AnalyticsState.logActivity('planner_move', { id, status });
          renderBoard();
        }
      });
    });
  }

  function renderStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed' || t.done).length;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    const completedEl = document.getElementById('planner-completed');
    const progressEl = document.getElementById('planner-progress');
    const summary = document.getElementById('task-summary');
    if (completedEl) completedEl.textContent = `${completed}/${total}`;
    if (progressEl) progressEl.style.width = `${pct}%`;
    if (summary) summary.textContent = `${total} tasks`;
  }

  function renderGoalCards() {
    const goals = PlannerState.getGoals();
    const weekly = document.getElementById('weekly-goal-text');
    const monthly = document.getElementById('monthly-goal-text');
    if (weekly) weekly.textContent = goals.weekly || 'Set a focused weekly target.';
    if (monthly) monthly.textContent = goals.monthly || 'Set a monthly preparation milestone.';
  }

  function renderCountdown() {
    const profile = UserProfile.get();
    const settings = PlannerState.getSettings();
    const date = profile.placementDate || settings.placementDate;
    const el = document.getElementById('planner-countdown');
    if (!el) return;
    if (!date) {
      el.textContent = '--';
      return;
    }
    const today = new Date();
    const target = new Date(date);
    const days = Math.max(0, Math.ceil((target - today) / 86400000));
    el.textContent = days;
  }

  window.submitTask = function(event) {
    event.preventDefault();
    const id = document.getElementById('task-id').value;
    const data = {
      title: document.getElementById('task-title').value.trim(),
      area: document.getElementById('task-area').value,
      priority: document.getElementById('task-priority').value,
      date: document.getElementById('task-date').value,
      status: document.getElementById('task-status').value,
      hours: 1,
      done: document.getElementById('task-status').value === 'completed'
    };
    if (!data.title) return false;
    if (id) {
      PlannerState.updateTask(id, data);
      CCToast('Task updated', 'success');
    } else {
      PlannerState.addTask(data);
      AnalyticsState.logActivity('planner_add', { title: data.title });
      CCToast('Task added', 'success');
    }
    resetTaskForm();
    renderBoard();
    return false;
  };

  window.editTask = function(id) {
    const task = PlannerState.getTasks().find(t => t.id === id);
    if (!task) return;
    document.getElementById('task-id').value = task.id;
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-area').value = task.area || 'DSA';
    document.getElementById('task-priority').value = task.priority || 'medium';
    document.getElementById('task-date').value = task.date || '';
    document.getElementById('task-status').value = task.status || (task.done ? 'completed' : 'todo');
    document.getElementById('task-submit-btn').textContent = 'Update Task';
    document.getElementById('task-cancel-btn').style.display = '';
    document.getElementById('task-title').focus();
  };

  window.cancelEditTask = resetTaskForm;

  function resetTaskForm() {
    const form = document.getElementById('task-form');
    if (form) form.reset();
    document.getElementById('task-id').value = '';
    document.getElementById('task-submit-btn').textContent = 'Add Task';
    document.getElementById('task-cancel-btn').style.display = 'none';
    loadGoals();
  }

  window.deleteTask = function(id) {
    if (!confirm('Delete this task?')) return;
    PlannerState.deleteTask(id);
    if (document.getElementById('task-id').value === id) resetTaskForm();
    CCToast('Task deleted', 'info');
    renderBoard();
  };

  window.PlannerPage = { refresh: initPlannerPage };
})();
