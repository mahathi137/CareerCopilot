/* ============================================
   CareerCopilot Resume Master Logic
   Interactive resume checklist, upload, and analysis
   ============================================ */

(function(){
  const CHECKLIST_ITEMS = [
    { id: 'contact', section: 'Contact Info', items: [
      { id: 'email', label: 'Professional email address' },
      { id: 'phone', label: 'Contact number' },
      { id: 'linkedin', label: 'LinkedIn profile link' },
      { id: 'github', label: 'GitHub/portfolio link' }
    ]},
    { id: 'summary', section: 'Summary', items: [
      { id: 'objective', label: 'Clear career objective' },
      { id: 'skills', label: 'Key skills highlighted' },
      { id: 'length', label: 'Summary under 3 lines' }
    ]},
    { id: 'education', section: 'Education', items: [
      { id: 'degree', label: 'Degree mentioned' },
      { id: 'college', label: 'College/university name' },
      { id: 'gpa', label: 'CGPA/percentage included' },
      { id: 'year', label: 'Graduation year' }
    ]},
    { id: 'skills', section: 'Technical Skills', items: [
      { id: 'languages', label: 'Programming languages listed' },
      { id: 'tools', label: 'Tools and technologies' },
      { id: 'databases', label: 'Database knowledge' },
      { id: 'frameworks', label: 'Frameworks mentioned' }
    ]},
    { id: 'projects', section: 'Projects', items: [
      { id: 'project1', label: 'At least 2 projects listed' },
      { id: 'techstack', label: 'Tech stack for each project' },
      { id: 'description', label: 'Brief project description' },
      { id: 'impact', label: 'Impact/results quantified' }
    ]},
    { id: 'format', section: 'Formatting', items: [
      { id: 'length', label: 'Resume under 1 page' },
      { id: 'font', label: 'Professional font used' },
      { id: 'spacing', label: 'Consistent spacing' },
      { id: 'bullet', label: 'Bullet points used' }
    ]}
  ];

  document.addEventListener('DOMContentLoaded', initResumePage);

  function initResumePage() {
    renderChecklist();
    updateScore();
    initUploadHandler();
    loadUploadedResume();
  }

  function initUploadHandler() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('resume-upload');

    if (!uploadArea || !fileInput) return;

    // Click to browse
    uploadArea.addEventListener('click', () => fileInput.click());

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = 'var(--primary)';
      uploadArea.style.background = 'var(--primary-light)';
    });

    uploadArea.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = 'var(--border)';
      uploadArea.style.background = 'transparent';
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = 'var(--border)';
      uploadArea.style.background = 'transparent';
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    });
  }

  function handleFileUpload(file) {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension !== 'pdf' && fileExtension !== 'docx') {
      CCToast('Please upload a PDF or DOCX file', 'error');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      CCToast('File size must be less than 5MB', 'error');
      return;
    }

    // Simulate upload and analysis
    CCToast('Uploading and analyzing resume...', 'info');
    
    setTimeout(() => {
      // Save to local storage (simulate with metadata)
      const resumeData = {
        filename: file.name,
        uploadDate: new Date().toISOString(),
        size: file.size
      };
      Storage.set('uploaded_resume', resumeData);
      
      // Show upload status
      showUploadStatus(resumeData);
      
      // Perform analysis
      analyzeResume(file.name);
      
      CCToast('Resume uploaded and analyzed successfully!', 'success');
    }, 1500);
  }

  function showUploadStatus(resumeData) {
    const uploadArea = document.getElementById('upload-area');
    const uploadStatus = document.getElementById('upload-status');
    
    if (uploadArea) uploadArea.style.display = 'none';
    if (uploadStatus) {
      uploadStatus.style.display = 'block';
      document.getElementById('uploaded-filename').textContent = resumeData.filename;
      document.getElementById('upload-date').textContent = `Uploaded ${new Date(resumeData.uploadDate).toLocaleDateString()}`;
    }
  }

  function loadUploadedResume() {
    const resumeData = Storage.get('uploaded_resume');
    if (resumeData) {
      showUploadStatus(resumeData);
      document.getElementById('analysis-results').style.display = 'block';
      // Re-run analysis with saved data
      analyzeResume(resumeData.filename);
    }
  }

  window.removeResume = function() {
    Storage.remove('uploaded_resume');
    const uploadArea = document.getElementById('upload-area');
    const uploadStatus = document.getElementById('upload-status');
    const analysisResults = document.getElementById('analysis-results');
    
    if (uploadArea) uploadArea.style.display = 'block';
    if (uploadStatus) uploadStatus.style.display = 'none';
    if (analysisResults) analysisResults.style.display = 'none';
    
    CCToast('Resume removed', 'info');
  };

  function analyzeResume(filename) {
    // Simulate AI analysis (in production, this would use an actual AI service)
    const analysisResults = generateMockAnalysis(filename);
    
    // Update analysis UI
    document.getElementById('analysis-results').style.display = 'block';
    
    // Update scores
    updateAnalysisScores(analysisResults.resumeScore, analysisResults.atsScore);
    
    // Render extracted info
    renderExtractedSkills(analysisResults.skills);
    renderExtractedEducation(analysisResults.education);
    renderMissingSections(analysisResults.missingSections);
    renderImprovementSuggestions(analysisResults.suggestions);
  }

  function generateMockAnalysis(filename) {
    // Generate realistic mock analysis data
    const skills = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker'];
    const education = 'B.Tech in Computer Science Engineering';
    const missingSections = ['Projects section needs more detail', 'Add quantifiable achievements', 'Include certifications'];
    const suggestions = [
      { icon: '💡', text: 'Add metrics to your achievements (e.g., "Improved performance by 40%")' },
      { icon: '📊', text: 'Include relevant coursework and projects' },
      { icon: '🎯', text: 'Tailor skills section to match job descriptions' },
      { icon: '✨', text: 'Add a strong professional summary at the top' }
    ];

    return {
      resumeScore: Math.floor(Math.random() * 20) + 70, // 70-90
      atsScore: Math.floor(Math.random() * 25) + 65, // 65-90
      skills: skills,
      education: education,
      missingSections: missingSections,
      suggestions: suggestions
    };
  }

  function updateAnalysisScores(resumeScore, atsScore) {
    const resumeScoreEl = document.getElementById('analysis-resume-score');
    const resumeRingEl = document.getElementById('analysis-resume-ring');
    const atsScoreEl = document.getElementById('ats-score');
    const atsRingEl = document.getElementById('ats-ring');

    if (resumeScoreEl) resumeScoreEl.textContent = resumeScore + '%';
    if (resumeRingEl) {
      const circumference = 377;
      const offset = circumference - (resumeScore / 100) * circumference;
      resumeRingEl.style.strokeDashoffset = offset;
    }

    if (atsScoreEl) atsScoreEl.textContent = atsScore + '%';
    if (atsRingEl) {
      const circumference = 377;
      const offset = circumference - (atsScore / 100) * circumference;
      atsRingEl.style.strokeDashoffset = offset;
    }
  }

  function renderExtractedSkills(skills) {
    const container = document.getElementById('extracted-skills');
    if (!container) return;

    container.innerHTML = skills.map(skill => 
      `<span class="tag">${skill}</span>`
    ).join('');
  }

  function renderExtractedEducation(education) {
    const container = document.getElementById('extracted-education');
    if (!container) return;

    container.textContent = education;
  }

  function renderMissingSections(sections) {
    const container = document.getElementById('missing-sections');
    if (!container) return;

    container.innerHTML = sections.map(section => 
      `<div class="flex items-center gap-2" style="color: var(--warning);">
        <span>⚠️</span>
        <span>${section}</span>
      </div>`
    ).join('');
  }

  function renderImprovementSuggestions(suggestions) {
    const container = document.getElementById('improvement-suggestions');
    if (!container) return;

    container.innerHTML = suggestions.map(suggestion => 
      `<div class="flex items-start gap-3" style="padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md);">
        <span style="font-size: 1.5rem;">${suggestion.icon}</span>
        <span style="color: var(--text-secondary);">${suggestion.text}</span>
      </div>`
    ).join('');
  }

  function renderChecklist() {
    const container = document.getElementById('resume-checklist');
    if (!container) return;

    const checklist = ResumeState.getChecklist();

    container.innerHTML = CHECKLIST_ITEMS.map(section => `
      <div class="card card-pad">
        <h3 style="margin-bottom: var(--space-4); color: var(--text-primary);">${section.section}</h3>
        <div class="flex-col gap-3">
          ${section.items.map(item => {
            const isChecked = checklist[item.id];
            return `
              <label class="flex items-center gap-3" style="cursor: pointer;">
                <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleCheck('${item.id}')" style="width: 18px; height: 18px;">
                <span style="color: var(--text-secondary);">${item.label}</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');
  }

  function updateScore() {
    const score = ResumeState.getScore();
    const scoreEl = document.getElementById('resume-score');
    const ringEl = document.getElementById('resume-ring');

    if (scoreEl) scoreEl.textContent = score + '%';
    
    if (ringEl) {
      const circumference = 534;
      const offset = circumference - (score / 100) * circumference;
      ringEl.style.strokeDashoffset = offset;
    }
  }

  window.toggleCheck = function(id) {
    ResumeState.toggleItem(id);
    updateScore();
  };

  window.ResumePage = {
    refresh: initResumePage
  };
})();
