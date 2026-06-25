/* ============================================
   CareerCopilot Resume Analysis Dashboard
   ============================================ */

(function(){
  const PDF_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const SECTION_ALIASES = {
    education: ['education', 'academic background', 'academics', 'qualification', 'qualifications'],
    projects: ['projects', 'academic projects', 'personal projects', 'project work'],
    experience: ['experience', 'work experience', 'professional experience', 'internship', 'internships', 'employment'],
    certifications: ['certifications', 'certification', 'certificates', 'courses', 'licenses', 'credentials'],
    achievements: ['achievements', 'awards', 'honors', 'accomplishments'],
    skills: ['skills', 'technical skills', 'technologies', 'core competencies']
  };

  const SECTION_LABELS = {
    contact: 'Contact',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    experience: 'Experience',
    certifications: 'Certifications',
    achievements: 'Achievements'
  };

  const SKILL_PATTERNS = [
    ['Java', /\bjava\b/i],
    ['Python', /\bpython\b/i],
    ['C++', /\bc\+\+\b|\bcpp\b/i],
    ['C', /\bc programming\b|\bc language\b/i],
    ['JavaScript', /\bjava\s*script\b|\bjavascript\b|\bjs\b/i],
    ['TypeScript', /\btypescript\b|\bts\b/i],
    ['React', /\breact(?:\.js)?\b/i],
    ['Next.js', /\bnext(?:\.js)?\b/i],
    ['Node.js', /\bnode(?:\.js)?\b|\bnodejs\b/i],
    ['Express.js', /\bexpress(?:\.js)?\b/i],
    ['SQL', /\bsql\b|\bmysql\b|\bpostgresql\b|\boracle db\b/i],
    ['HTML', /\bhtml5?\b/i],
    ['CSS', /\bcss3?\b|\btailwind\b|\bbootstrap\b/i],
    ['Git', /\bgit\b|\bgithub\b/i],
    ['MongoDB', /\bmongodb\b|\bmongo\b/i],
    ['Firebase', /\bfirebase\b/i],
    ['AWS', /\baws\b|\bamazon web services\b/i],
    ['Docker', /\bdocker\b/i],
    ['Spring Boot', /\bspring boot\b/i],
    ['REST APIs', /\brest api\b|\brestful\b|\bapi integration\b/i],
    ['Machine Learning', /\bmachine learning\b|\bml\b|\bscikit\b|\btensorflow\b|\bpytorch\b/i],
    ['Data Structures', /\bdata structures?\b|\bdsa\b/i],
    ['OOP', /\boop\b|\bobject oriented\b/i],
    ['DBMS', /\bdbms\b|\bdatabase management\b/i]
  ];

  document.addEventListener('DOMContentLoaded', initResumePage);

  function initResumePage() {
    configurePdfJs();
    bindUpload();
    bindTools();
    const saved = Storage.get('uploaded_resume');
    if (saved?.text) {
      showUploadStatus(saved);
      renderAnalysis(analyze(saved.filename, saved.text));
    }
  }

  function configurePdfJs() {
    if (window.pdfjsLib?.GlobalWorkerOptions) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER;
    }
  }

  function bindUpload() {
    const area = document.getElementById('upload-area');
    const input = document.getElementById('resume-upload');
    if (!area || !input) return;
    area.addEventListener('click', () => input.click());
    area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('dragging'); });
    area.addEventListener('dragleave', () => area.classList.remove('dragging'));
    area.addEventListener('drop', e => {
      e.preventDefault();
      area.classList.remove('dragging');
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });
    input.addEventListener('change', e => {
      if (e.target.files[0]) handleFile(e.target.files[0]);
      input.value = '';
    });
  }

  function bindTools() {
    document.getElementById('analyze-resume-btn')?.addEventListener('click', () => {
      const saved = Storage.get('uploaded_resume');
      if (!saved?.text) return CCToast('Upload a readable PDF or TXT resume first', 'error');
      renderAnalysis(analyze(saved.filename, saved.text));
      CCToast('Resume analyzed', 'success');
    });
    document.getElementById('company-target-select')?.addEventListener('change', renderCompanySuggestions);
    document.getElementById('improve-bullet-btn')?.addEventListener('click', improveBullet);
  }

  async function handleFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt'].includes(ext)) return CCToast('Please upload a PDF or TXT resume', 'error');
    if (file.size > 5 * 1024 * 1024) return CCToast('File must be under 5MB', 'error');

    try {
      const text = await extractResumeText(file, ext);
      const cleaned = normalizeText(text);
      if (cleaned.length < 40) {
        CCToast('Could not extract enough resume text. Try a text-based PDF or TXT file.', 'error');
        return;
      }

      const data = { filename: file.name, uploadDate: new Date().toISOString(), size: file.size, text: cleaned };
      Storage.set('uploaded_resume', data);
      showUploadStatus(data);
      renderAnalysis(analyze(file.name, cleaned));
      CCToast('Resume uploaded and analyzed', 'success');
    } catch (error) {
      console.error('Resume extraction failed', error);
      CCToast(error.message || 'Could not read this resume', 'error');
    }
  }

  async function extractResumeText(file, ext) {
    if (ext === 'txt') return file.text();
    if (!window.pdfjsLib) {
      throw new Error('PDF parser is still loading. Please try again in a moment.');
    }

    const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      pages.push(joinPdfTextItems(content.items || []));
    }
    return pages.join('\n\n');
  }

  function joinPdfTextItems(items) {
    let text = '';
    let lastY = null;
    for (const item of items) {
      const str = String(item.str || '').trim();
      if (!str) continue;
      const y = Math.round(item.transform?.[5] || 0);
      if (lastY !== null && Math.abs(y - lastY) > 4) text += '\n';
      else if (text && !/[\s\n]$/.test(text)) text += ' ';
      text += str;
      lastY = y;
    }
    return text;
  }

  function showUploadStatus(data) {
    document.getElementById('upload-area').style.display = 'none';
    const status = document.getElementById('upload-status');
    status.style.display = 'flex';
    document.getElementById('uploaded-filename').textContent = data.filename;
    document.getElementById('upload-date').textContent = `Uploaded ${new Date(data.uploadDate).toLocaleDateString()}`;
  }

  window.removeResume = function() {
    Storage.remove('uploaded_resume');
    Storage.remove('resume_analysis');
    document.getElementById('upload-area').style.display = '';
    document.getElementById('upload-status').style.display = 'none';
    document.getElementById('analysis-results').style.display = 'none';
    document.getElementById('analysis-empty').style.display = '';
    document.getElementById('ats-score').textContent = '--';
    document.getElementById('resume-score-summary').textContent = 'Upload and analyze a resume to generate a dynamic score.';
    const ring = document.getElementById('ats-ring');
    if (ring) ring.style.strokeDashoffset = 427;
    CCToast('Resume removed', 'info');
  };

  function analyze(filename, text) {
    const raw = normalizeText(text);
    const extracted = extractDetails(raw);
    const sections = buildSectionResults(extracted);
    const scoreParts = calculateScore(raw, extracted, sections);
    const atsScore = Math.min(100, Math.round(Object.values(scoreParts).reduce((sum, value) => sum + value, 0)));

    return {
      filename,
      atsScore,
      completenessScore: Math.round(scoreParts.sections + scoreParts.contact + scoreParts.quality),
      sectionCoverage: Math.round(sections.filter(s => s.present).length / sections.length * 100),
      keywordMatch: Math.round(Math.min(extracted.skills.length, 10) / 10 * 100),
      scoreParts,
      sections,
      extracted,
      skills: extracted.skills,
      strengths: buildStrengths(raw, extracted, sections),
      improvements: buildImprovements(raw, extracted, sections)
    };
  }

  function normalizeText(text) {
    return String(text || '')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/(?:\b(?:endobj|xref|trailer|stream|endstream|startxref|%%EOF)\b|\d+\s+\d+\s+obj)/gi, ' ')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function extractDetails(text) {
    const lines = cleanLines(text);
    const sections = {};
    Object.keys(SECTION_ALIASES).forEach(key => {
      sections[key] = extractSection(lines, SECTION_ALIASES[key]);
    });

    const contact = extractContact(lines, text);
    const skills = extractSkills(text);

    return {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      skills,
      education: summarizeSection(sections.education, detectEducation(lines)),
      projects: summarizeSection(sections.projects, detectKeywordLines(lines, /\b(project|projects|developed|built|created|implemented|application|website|system|portfolio)\b/i)),
      experience: summarizeSection(sections.experience, detectKeywordLines(lines, /\b(intern|internship|experience|trainee|worked|engineer|developer|associate|consultant|analyst)\b/i)),
      certifications: summarizeSection(sections.certifications, detectKeywordLines(lines, /\b(certified|certification|certificate|coursera|nptel|udemy|aws|oracle|linkedin learning|skillshare)\b/i)),
      achievements: summarizeSection(sections.achievements, detectKeywordLines(lines, /\b(award|achievement|winner|rank|hackathon|secured|published|selected|recognized|accomplished)\b/i)),
      rawSections: sections
    };
  }

  function cleanLines(text) {
    return text.split('\n')
      .map(line => line.trim().replace(/\s{2,}/g, ' '))
      .filter(line => line && !isPdfArtifact(line) && !/^[\W_]+$/i.test(line));
  }

  function isPdfArtifact(line) {
    return /(?:\b(?:endobj|xref|trailer|stream|endstream|startxref|%%EOF)\b|\d+\s+\d+\s+obj)/i.test(line);
  }

  function extractContact(lines, text) {
    const email = firstMatch(text, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const phone = firstMatch(text, /(?:\+91[-\s]?)?[6-9]\d{9}\b|(?:\+?1[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}\b|\+\d[\d\s-]{8,}\d/);
    let name = '';

    for (const line of lines.slice(0, 16)) {
      const match = line.match(/^(?:name|full name|candidate name)\s*[:\-]\s*(.+)$/i);
      if (match && match[1]) {
        const candidate = match[1].trim();
        if (candidate && !/[0-9@]/.test(candidate)) {
          name = candidate;
          break;
        }
      }
    }

    if (!name) {
      name = detectName(lines);
    }

    if (!name && email) {
      const idx = lines.findIndex(line => line.includes(email));
      if (idx > 0) {
        const prev = lines[idx - 1].trim();
        if (/^[A-Za-z][A-Za-z .'-]{2,60}$/.test(prev) && prev.split(/\s+/).length <= 4) {
          name = prev;
        }
      }
    }

    return {
      name: name || '',
      email: email || '',
      phone: phone ? phone.replace(/[\s()-]/g, '') : ''
    };
  }

  function detectName(lines) {
    const banned = /resume|curriculum|email|phone|mobile|linkedin|github|portfolio|summary|objective|skills|education|experience|projects|certifications|achievements|address|contact/i;
    const candidate = lines.slice(0, 12).find(line =>
      /^[A-Za-z][A-Za-z .'-]{2,45}$/.test(line) &&
      line.split(/\s+/).length >= 2 &&
      line.split(/\s+/).length <= 4 &&
      !banned.test(line)
    );
    return candidate || '';
  }

  function extractSection(lines, aliases) {
    const start = lines.findIndex(line => aliases.some(alias => sameHeading(line, alias)));
    if (start === -1) return [];
    const content = [];
    for (const line of lines.slice(start + 1)) {
      if (isAnyHeading(line)) break;
      if (line.length > 2) content.push(line);
      if (content.length >= 8) break;
    }
    return content;
  }

  function sameHeading(line, alias) {
    const cleaned = line.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
    return cleaned === alias || cleaned.startsWith(`${alias} `) || cleaned.startsWith(`${alias} &`) || cleaned.startsWith(`${alias} :`);
  }

  function isAnyHeading(line) {
    return Object.values(SECTION_ALIASES).flat().some(alias => sameHeading(line, alias)) ||
      /^(summary|objective|profile|contact|personal details|languages|interests|hobbies|declaration)$/i.test(line.trim());
  }

  function extractSkills(text) {
    const found = SKILL_PATTERNS
      .filter(([, pattern]) => pattern.test(text))
      .map(([skill]) => skill);
    return Array.from(new Set(found));
  }

  function firstMatch(text, pattern) {
    return (text.match(pattern) || [''])[0].trim();
  }

  function summarizeSection(primary, fallback) {
    const lines = primary.length ? primary : fallback;
    return lines.slice(0, 5).join(' ');
  }

  function detectEducation(lines) {
    return detectKeywordLines(lines, /\b(b\.?tech|bachelor|degree|university|college|cgpa|gpa|mca|msc|bsc|computer science|engineering)\b/i);
  }

  function detectKeywordLines(lines, pattern) {
    return lines.filter(line => pattern.test(line) && !isAnyHeading(line)).slice(0, 5);
  }

  function buildSectionResults(extracted) {
    return [
      { key: 'contact', name: SECTION_LABELS.contact, present: Boolean(extracted.email || extracted.phone), note: extracted.email && extracted.phone ? 'Email and phone detected' : 'Add both email and phone' },
      { key: 'skills', name: SECTION_LABELS.skills, present: extracted.skills.length > 0, note: `${extracted.skills.length} skills detected` },
      { key: 'education', name: SECTION_LABELS.education, present: Boolean(extracted.education), note: extracted.education ? 'Education content found' : 'No education details found' },
      { key: 'projects', name: SECTION_LABELS.projects, present: Boolean(extracted.projects), note: extracted.projects ? 'Project content found' : 'No project details found' },
      { key: 'experience', name: SECTION_LABELS.experience, present: Boolean(extracted.experience), note: extracted.experience ? 'Experience content found' : 'No work/internship details found' },
      { key: 'certifications', name: SECTION_LABELS.certifications, present: Boolean(extracted.certifications), note: extracted.certifications ? 'Certification content found' : 'No certifications found' },
      { key: 'achievements', name: SECTION_LABELS.achievements, present: Boolean(extracted.achievements), note: extracted.achievements ? 'Achievement content found' : 'No achievements found' }
    ];
  }

  function calculateScore(text, extracted, sections) {
    const hasMetrics = /\b\d+(?:\.\d+)?%|\b\d+\+|\b\d{2,}\b/.test(text);
    const hasLinks = /\blinkedin\.com|github\.com|https?:\/\//i.test(text);
    const hasActionVerbs = /\bdeveloped|built|created|implemented|designed|optimized|improved|led|managed|analyzed\b/i.test(text);
    const contact = (extracted.email ? 8 : 0) + (extracted.phone ? 7 : 0);
    const sectionCoverage = sections.filter(section => section.present).length / sections.length;
    const sectionsScore = sectionCoverage * 35;
    const skills = Math.min(extracted.skills.length, 10) / 10 * 20;
    const quality = (hasMetrics ? 10 : 0) + (hasLinks ? 8 : 0) + (hasActionVerbs ? 7 : 0) + (extracted.name ? 5 : 0);
    return { contact, sections: sectionsScore, skills, quality };
  }

  function buildStrengths(text, extracted, sections) {
    const strengths = [];
    if (extracted.name) strengths.push(`Candidate name detected: ${extracted.name}`);
    if (extracted.email) strengths.push('Email address is ATS-readable.');
    if (extracted.phone) strengths.push('Phone number is present for recruiter contact.');
    if (extracted.skills.length) strengths.push(`Detected ${extracted.skills.length} skills: ${extracted.skills.slice(0, 8).join(', ')}.`);
    sections.filter(section => section.present && !['contact', 'skills'].includes(section.key))
      .forEach(section => strengths.push(`${section.name} section is present.`));
    if (/\blinkedin\.com/i.test(text)) strengths.push('LinkedIn profile link is included.');
    if (/\bgithub\.com/i.test(text)) strengths.push('GitHub link is included.');
    if (/\b\d+(?:\.\d+)?%|\b\d+\+|\b\d{2,}\b/.test(text)) strengths.push('Resume includes measurable results or numeric detail.');
    return strengths.length ? strengths : ['Readable resume text was extracted. Add structured sections to improve ATS performance.'];
  }

  function buildImprovements(text, extracted, sections) {
    const improvements = [];
    if (!extracted.name) improvements.push('Place your full name clearly at the top of the resume.');
    if (!extracted.email) improvements.push('Add a valid email address in the contact area.');
    if (!extracted.phone) improvements.push('Add a phone number in a standard recruiter-readable format.');
    if (extracted.skills.length < 5) improvements.push(`Add more technical skills. Detected ${extracted.skills.length || 'none'} from the uploaded content.`);
    sections.filter(section => !section.present && !['contact', 'skills'].includes(section.key))
      .forEach(section => improvements.push(`Add or expand the ${section.name} section. ${section.note}.`));
    if (!/\blinkedin\.com/i.test(text)) improvements.push('Add a LinkedIn profile link.');
    if (!/\bgithub\.com/i.test(text) && extracted.skills.some(skill => ['Java', 'Python', 'C++', 'JavaScript', 'React'].includes(skill))) {
      improvements.push('Add a GitHub link to support your technical project claims.');
    }
    if (!/\b\d+(?:\.\d+)?%|\b\d+\+|\b\d{2,}\b/.test(text)) improvements.push('Quantify impact in bullets with numbers, percentages, users, or scale.');
    return improvements.length ? improvements : ['Resume covers the core ATS signals. Tailor keywords to each job description before applying.'];
  }

  function renderAnalysis(result) {
    document.getElementById('analysis-empty').style.display = 'none';
    document.getElementById('analysis-results').style.display = '';
    Storage.set('resume_analysis', result);
    Storage.set('resume_checklist', Object.fromEntries(Array.from({ length: Math.round(result.atsScore / 5) }, (_, i) => [`auto_${i}`, true])));

    document.getElementById('ats-score').textContent = `${result.atsScore}%`;
    document.getElementById('resume-score-summary').innerHTML = `
      <div class="score-breakdown">
        <span>Content Completeness: ${result.completenessScore}%</span>
        <span>Section Coverage: ${result.sectionCoverage}%</span>
        <span>Skill Match: ${result.keywordMatch}%</span>
      </div>
    `;
    const ring = document.getElementById('ats-ring');
    if (ring) ring.style.strokeDashoffset = 427 - result.atsScore / 100 * 427;

    document.getElementById('section-grid').innerHTML = result.sections.map(section => `
      <div class="card card-pad resume-section-card ${section.present ? 'present' : 'missing'}">
        <span>${section.present ? 'Detected' : 'Needs work'}</span>
        <strong>${escapeHtml(section.name)}</strong>
        <small>${escapeHtml(section.note)}</small>
      </div>
    `).join('');
    renderList('resume-strengths', result.strengths);
    renderList('resume-improvements', result.improvements);
    renderExtractedDetails(result);
    document.getElementById('extracted-skills').innerHTML = result.skills.length
      ? result.skills.map(skill => `<span class="tag">${escapeHtml(skill)}</span>`).join('')
      : '<span class="text-muted">No clear technical skills detected from the uploaded text.</span>';
    renderCompanySuggestions(result);
  }

  function renderExtractedDetails(result) {
    const details = result.extracted || {};
    const container = document.getElementById('resume-details-grid');
    const sections = [
      ['Personal Details', [['Name', details.name], ['Email', details.email], ['Phone', details.phone]]],
      ['Detected Skills', [['Skills', details.skills?.join(', ') || '']]],
      ['Education', [['Education Details', details.education]]],
      ['Projects', [['Project Details', details.projects]]],
      ['Experience', [['Work Experience', details.experience]]],
      ['Certifications', [['Certifications', details.certifications]]],
      ['Achievements', [['Achievements', details.achievements]]]
    ];

    container.innerHTML = sections.map(([title, items]) => `
      <div class="resume-detail-section">
        <h4 class="resume-detail-title">${escapeHtml(title)}</h4>
        <div class="resume-detail-items">
          ${items.map(([label, value]) => detailItem(label, value)).join('')}
        </div>
      </div>
    `).join('');
  }

  function detailItem(label, value) {
    const display = value || 'Not detected';
    return `
      <div class="resume-detail-item">
        <span class="detail-label">${escapeHtml(label)}</span>
        <span class="detail-value ${value ? '' : 'not-detected'}">${escapeHtml(display)}</span>
      </div>
    `;
  }

  function renderList(id, items) {
    document.getElementById(id).innerHTML = items.map(item => `<div class="insight-item">${escapeHtml(item)}</div>`).join('');
  }

  function renderCompanySuggestions(result = Storage.get('resume_analysis')) {
    const company = document.getElementById('company-target-select')?.value || 'TCS';
    const profile = typeof UserProfile !== 'undefined' ? UserProfile.get() : {};
    const role = profile.targetRole || 'the target role';
    const skills = result?.skills || [];
    const suggestions = [];

    if (skills.length) suggestions.push(`For ${company}, keep the strongest role-relevant skills near the top: ${skills.slice(0, 5).join(', ')}.`);
    else suggestions.push(`For ${company}, add technical keywords that match ${role}.`);
    if (!result?.sections?.find(section => section.key === 'projects')?.present) suggestions.push('Add project bullets with tech stack, your role, and outcome.');
    if (!result?.sections?.find(section => section.key === 'experience')?.present) suggestions.push('If you have internships, freelance work, or training, add it under Experience.');
    if (!result?.sections?.find(section => section.key === 'certifications')?.present) suggestions.push('Add relevant certifications only if you have completed them.');
    if (suggestions.length < 3) suggestions.push(`Tailor the summary and project keywords toward ${company} and ${role}.`);
    renderList('company-resume-suggestions', suggestions);
  }

  function improveBullet() {
    const input = document.getElementById('bullet-input');
    const raw = input.value.trim() || 'Created a website';
    const cleaned = raw.replace(/\.$/, '').replace(/^(created|made|worked on)\s+/i, '');
    document.getElementById('bullet-output').textContent =
      `Developed ${cleaned} using structured implementation, clear ownership, and measurable user-focused outcomes.`;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  window.ResumePage = { refresh: initResumePage, analyze };
})();
