/* ============================================
   CareerCopilot AI Placement Mentor
   Rule-based mentor responses for placement prep
   ============================================ */

const Chatbot = {
  quickActions: [
    'DSA Roadmap',
    'Interview Preparation',
    'Resume Tips',
    'Company Preparation',
    'Coding Help'
  ],

  topicMap: {
    arrays: ['Arrays', 'Arrays store data contiguously and let you access elements by index. Master traversal, two pointers, sliding window, frequency maps, and in-place updates.'],
    strings: ['Strings', 'Strings are character sequences. Focus on pattern search, substring comparison, frequency counting, and careful edge cases like empty strings and special characters.'],
    'linked list': ['Linked List', 'Linked lists test pointer handling. Practice reversal, merging, cycle detection, insertion, and maintaining head/tail references.'],
    linked: ['Linked List', 'Linked lists test pointer handling. Practice reversal, merging, cycle detection, insertion, and maintaining head/tail references.'],
    stack: ['Stack', 'Stacks follow last-in-first-out logic. Practice parentheses validation, next greater element, DFS, and expression parsing.'],
    queue: ['Queue', 'Queues follow first-in-first-out logic. Practice level-order traversal, sliding window, and scheduling problems.'],
    tree: ['Trees', 'Trees need recursion discipline. Practice traversals, height, diameter, LCA, BST operations, and balanced tree checks.'],
    trees: ['Trees', 'Trees need recursion discipline. Practice traversals, height, diameter, LCA, BST operations, and balanced tree checks.'],
    graph: ['Graphs', 'Graphs need representation first: adjacency list, visited set, BFS/DFS, shortest path, cycle detection, and topological sort.'],
    graphs: ['Graphs', 'Graphs need representation first: adjacency list, visited set, BFS/DFS, shortest path, cycle detection, and topological sort.'],
    recursion: ['Recursion', 'Recursion breaks a problem into smaller versions of itself. Identify base cases, recursive state, and use memoization for overlapping subproblems.'],
    'dynamic programming': ['Dynamic Programming', 'DP is recursion plus memory. Identify state, recurrence, base cases, and build answers from smaller subproblems.'],
    dp: ['Dynamic Programming', 'DP is recursion plus memory. Identify state, recurrence, base cases, and build answers from smaller subproblems.'],
    searching: ['Searching', 'Searching covers linear search, binary search, and search-on-answer patterns. Know when sorted data allows log-time search.'],
    sorting: ['Sorting', 'Sorting organizes data to simplify later steps. Know merge sort, quick sort, stable sort, and when sorting reduces complexity.'],
    oop: ['OOP', 'Object-oriented programming is about classes, objects, inheritance, encapsulation, polymorphism, and clean design for reusable code.'],
    dbms: ['DBMS', 'DBMS questions cover relational databases, SQL queries, normalization, joins, indexing, and data integrity.'],
    os: ['OS', 'Operating System', 'OS basics include processes, threads, scheduling, memory management, and concurrency.'],
    cn: ['CN', 'Computer Networks', 'Computer networks cover protocols, OSI/TCP-IP layers, routing, switching, and HTTP basics.'],
    'binary search': ['Binary Search', 'Binary search efficiently finds an item in sorted data by halving the search range each step.']
  },

  languageMap: {
    java: 'Use Java for strong OOP, collections, and enterprise interviews. Revise String, arrays, ArrayList, HashMap, HashSet, Queue, Stack, PriorityQueue, classes, inheritance, exceptions, and JVM basics.',
    python: 'Use Python for fast problem solving. Revise lists, dicts, sets, tuples, heapq, deque, sorting keys, recursion limits, and clean function decomposition.',
    c: 'Use C to show fundamentals. Revise pointers, arrays, strings, structs, memory allocation, recursion, and common segmentation fault causes.',
    'c++': 'Use C++ for DSA speed. Revise STL vectors, maps, sets, unordered_map, queue, stack, priority_queue, sort comparators, references, and OOP.',
    javascript: 'Use JavaScript for frontend and full-stack roles. Revise arrays, objects, maps, sets, promises, closures, DOM basics, and Node fundamentals.'
  },

  placementKeywords: [
    'dsa', 'data structure', 'algorithm', 'array', 'string', 'linked', 'stack', 'queue', 'tree', 'graph', 'recursion', 'dynamic', 'dp',
    'search', 'sort', 'complexity', 'coding', 'code', 'program', 'java', 'python', 'c++', 'javascript', 'resume', 'cv', 'ats',
    'interview', 'hr', 'technical', 'manager', 'company', 'tcs', 'infosys', 'accenture', 'wipro', 'cognizant', 'capgemini',
    'aptitude', 'quant', 'logical', 'verbal', 'career', 'roadmap', 'placement', 'job', 'internship', 'project', 'sql', 'oop', 'dbms',
    'os', 'cn', 'profile', 'dashboard', 'planner', 'analytics', 'achievements', 'settings', 'resume master', 'company prep'
  ],

  offTopicMessage() {
    return "I am CareerCopilot's placement assistant. I can help you with placement preparation, coding, resumes, interviews, company preparation, and navigating this website. Please ask a related question.";
  },

  isPlacementRelated(text) {
    return this.placementKeywords.some(keyword => {
      const escaped = keyword.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&').replace(/\\ /g, '\\s+');
      return new RegExp(`(^|[^a-z0-9+])${escaped}([^a-z0-9+]|$)`, 'i').test(text);
    });
  },

  processMessage(message) {
    const text = String(message || '').trim().toLowerCase();
    const profile = typeof UserProfile !== 'undefined' ? UserProfile.get() : {};

    if (!text) return this.offTopicMessage();
    if (!this.isPlacementRelated(text)) return this.offTopicMessage();

    if (/resume|cv|ats|ats score|resume score/.test(text)) return this.resume(text);
    if (/tcs|infosys|accenture|wipro|cognizant|capgemini/.test(text)) return this.company(text, profile);
    if (/aptitude|quant|logical|verbal|aptitude hub|aptitude practice/.test(text)) return this.aptitude();
    if (/interview|hr|technical round|manager|tell me about yourself|star method|common hr|behavioral/.test(text)) return this.interview(text, profile);
    if (/profile|edit profile|where is my profile|my profile|profile menu|where is resume|resume master|analytics|coding practice|planner|achievements|settings|dashboard|company prep/.test(text)) return this.website(text, profile);

    for (const key of Object.keys(this.topicMap)) {
      if (text.includes(key)) return this.dsaTopic(this.topicMap[key]);
    }

    if (/roadmap|dsa roadmap|placement preparation|how many dsa questions|how many problems/.test(text)) return this.placement(text, profile);
    if (/coding help|code|program|java|python|c\+\+|javascript|\bc\b/.test(text)) return this.programming(text);

    return this.offTopicMessage();
  },

  buildBulletList(items) {
    return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
  },

  dsaTopic(topic) {
    const [name, explanation] = topic;
    const practiceExamples = {
      Arrays: 'Try two-sum, sliding window, and subarray sum problems to build array intuition.',
      Strings: 'Try palindrome checks, anagram grouping, substring search, and string transformation examples.',
      'Linked List': 'Try reverse linked list, merge two sorted lists, detect cycles, and add nodes at positions.',
      Stack: 'Try valid parentheses, next greater element, and evaluate reverse polish notation.',
      Queue: 'Try level-order tree traversal, sliding window maximum, and BFS on graphs.',
      Trees: 'Try tree traversals, max depth, diameter, and BST validation.',
      Graphs: 'Try BFS/DFS, shortest path, cycle detection, and topological sort problems.',
      Recursion: 'Try smaller subproblems on trees, lists, and backtracking with subsets.',
      'Dynamic Programming': 'Try climb stairs, longest increasing subsequence, knapsack, and edit distance patterns.',
      Searching: 'Try binary search on sorted arrays and search-on-answer problems.',
      Sorting: 'Try merge sort, quick sort, and custom comparator sorting.',
      OOP: 'Try designing classes for a library system, bank account, or inventory with inheritance and interfaces.',
      DBMS: 'Try SQL queries for joins, grouping, aggregation, and filtering problems.',
      OS: 'Try explaining process scheduling, memory management, and thread synchronization basics.',
      CN: 'Try explaining TCP/IP layers, packet routing, and differences between TCP and UDP.',
      'Binary Search': 'Binary search works by comparing the target with the middle element of a sorted array and discarding half the search space each step.'
    };

    const mistakes = [
      'Skipping edge cases such as empty input, single element input, or repeated values.',
      'Choosing the wrong data structure for the pattern in the problem.',
      'Not explaining the approach before starting to code.',
      'Ignoring complexity after adding nested loops or recursion.'
    ];

    return `
      <strong>${name}</strong>
      <p>${explanation}</p>
      <p><strong>How it works:</strong> Identify the pattern, choose the right structure, walk through an example, and then code.</p>
      <p><strong>Example:</strong> ${practiceExamples[name] || 'Use a small example and trace each step manually.'}</p>
      <p><strong>Time complexity:</strong> Analyze loops, recursion, and any sorting or searching operations. Aim for O(n) or O(n log n) when input size is large.</p>
      <p><strong>Space complexity:</strong> Track auxiliary storage such as arrays, maps, recursion stack, and temporary variables.</p>
      <p><strong>Common mistakes:</strong></p>
      ${this.buildBulletList(mistakes)}
      <p><strong>Practice suggestion:</strong> Solve 2–3 focused problems on this topic, then revisit them after a day to improve retention.</p>
    `;
  },

  programming(text) {
    const lang = Object.keys(this.languageMap).find(key => text.includes(key));
    const base = lang ? this.languageMap[lang] : 'Pick one language and master its common interview constructs, data structures, and debugging patterns.';
    const actionItems = [
      'Write helper functions for repeated logic and keep code modular.',
      'Test with normal input, edge cases, and boundary conditions.',
      'Explain your approach before typing code and validate with small examples.'
    ];

    return `
      <strong>Coding Help</strong>
      <p>${base}</p>
      <p><strong>Approach:</strong> Clarify the problem, choose a structure, code carefully, and test.</p>
      <p><strong>Common mistakes:</strong> off-by-one errors, mutating input unexpectedly, and missing base cases.</p>
      <p><strong>Next steps:</strong></p>
      ${this.buildBulletList(actionItems)}
    `;
  },

  interview(text, profile) {
    const company = profile.dreamCompany || profile.targetCompany || 'the company';
    const starMethod = [
      'Situation: describe the context clearly.',
      'Task: explain your responsibility or goal.',
      'Action: share what you specifically did.',
      'Result: state the outcome and what you learned.'
    ];

    if (/tell me about yourself/.test(text)) {
      return `
        <strong>Answering “Tell me about yourself”</strong>
        <p>Start with your education and current focus, then highlight one strong project or internship, and end with why you are preparing for placements.</p>
        <p><strong>Structure:</strong></p>
        ${this.buildBulletList([
          'Brief background: course, specialization, and current goal.',
          'Key achievement: one project or internship with your role and impact.',
          'Skills: relevant technical strengths.',
          `Goal: why you want to prepare for ${company} or a similar role.`
        ])}
        <p><strong>Tip:</strong> Keep it under one minute and practice aloud.</p>
      `;
    }

    if (/star method/.test(text)) {
      return `
        <strong>STAR Method</strong>
        <p>Use STAR to structure behavioral answers clearly.</p>
        ${this.buildBulletList(starMethod)}
        <p><strong>Use it for:</strong> teamwork, leadership, challenges, and learning stories.</p>
      `;
    }

    if (/common hr|hr questions|common interview questions/.test(text)) {
      return `
        <strong>Common HR Questions</strong>
        <p>Prepare clear, honest answers with examples and outcomes.</p>
        ${this.buildBulletList([
          'Tell me about yourself.',
          'Why this company?',
          'What are your strengths and weaknesses?',
          'Describe a time you faced a challenge.',
          'Where do you see yourself in 5 years?'
        ])}
        <p><strong>Practice tip:</strong> Use the STAR method and avoid vague phrases like “we” instead of “I.”</p>
      `;
    }

    return `
      <strong>Interview Preparation</strong>
      <p><strong>Technical:</strong> Revise DSA patterns, OOP, DBMS, OS basics, and your project stories.</p>
      <p><strong>HR:</strong> Prepare your strengths, weaknesses, motivation, and learning experiences.</p>
      <p><strong>Behavioral:</strong> Use specific examples and mention your contribution and outcome.</p>
      <p><strong>Common mistakes:</strong> being too vague, not asking clarifying questions, and not relating answers to the role.</p>
      <p><strong>Practice suggestion:</strong> Record a mock answer daily and refine it for clarity and confidence.</p>
    `;
  },

  resume(text) {
    if (/ats score|score good/.test(text)) {
      return `
        <strong>ATS Score Guidance</strong>
        <p>A good ATS score is generally 70% or higher. It means your resume is readable by both humans and applicant tracking systems.</p>
        ${this.buildBulletList([
          'Use standard headings like Contact, Education, Projects, Experience, and Skills.',
          'Include relevant keywords from the job description.',
          'Avoid images, tables, or unusual formatting.',
          'Keep contact information simple and easy to find.'
        ])}
        <p><strong>Reminder:</strong> ATS score is one signal. Strong achievements and clear project descriptions matter too.</p>
      `;
    }

    return `
      <strong>Resume Guidance</strong>
      <p>A strong fresher resume is concise, achievement-focused, and tailored toward placements.</p>
      ${this.buildBulletList([
        'Start with contact details and a clear headline or objective.',
        'List education, technical skills, and certifications clearly.',
        'Describe projects with action verbs, tools used, your role, and measurable results.',
        'Include internships, training, or relevant experience with outcomes.'
      ])}
      <p><strong>Common mistakes:</strong> long paragraphs, missing keywords, unclear contributions, and unsupported claims.</p>
      <p><strong>Use Resume Master:</strong> Upload your resume there to get ATS analysis and improvement suggestions.</p>
    `;
  },

  placement(text, profile) {
    if (/how many dsa questions/.test(text) || /how many problems/.test(text)) {
      return `
        <strong>How many DSA questions should you solve?</strong>
        <p>Quality matters more than quantity. Aim for 30–50 focused problems across easy, medium, and hard categories.</p>
        ${this.buildBulletList([
          'Solve 15–20 easy problems to build confidence and fundamentals.',
          'Solve 10–15 medium problems to practice implementation and optimization.',
          'Solve 5–10 hard problems to stretch problem-solving skills.',
          'Review each solution and revisit problems after a week.'
        ])}
        <p><strong>Tip:</strong> Use Coding Practice to track progress and focus on weak topics.</p>
      `;
    }

    return `
      <strong>Placement Preparation</strong>
      <p>Build a balanced plan across DSA, aptitude, resume, interviews, and company preparation.</p>
      ${this.buildBulletList([
        'Revise core DSA topics: arrays, strings, linked lists, trees, graphs, sorting, searching, and DP.',
        'Practice aptitude daily with timing and accuracy.',
        'Polish your resume with clear projects and measurable outcomes.',
        'Practice mock interviews and common HR questions regularly.',
        'Use company prep for specific process patterns and expectations.'
      ])}
      <p><strong>Next step:</strong> Check your Dashboard readiness and use Planner to keep consistent momentum.</p>
    `;
  },

  company(text, profile) {
    const companyName = ['tcs', 'infosys', 'accenture', 'wipro', 'cognizant', 'capgemini'].find(c => text.includes(c));
    const company = companyName ? companyName.toUpperCase() : (profile.dreamCompany || profile.targetCompany || 'your target company');
    return `
      <strong>Company Preparation for ${company}</strong>
      <p>Focus on aptitude, coding fundamentals, project confidence, and HR readiness.</p>
      ${this.buildBulletList([
        'Review the company’s placement pattern before the drive.',
        'Practice one main language, OOP, DBMS, and your strongest projects.',
        'Prepare HR answers for why you want the company and how you fit.',
        'Use Interview Prep for mock technical and HR rounds.'
      ])}
      <p><strong>Website tip:</strong> Visit Company Prep for guidance and common questions for top companies.</p>
    `;
  },

  aptitude() {
    return `
      <strong>Aptitude Preparation</strong>
      <p>Aptitude tests are about speed and accuracy. Learn common patterns and practice timed quizzes.</p>
      ${this.buildBulletList([
        'Master percentages, ratios, averages, profit-loss, and speed-distance.',
        'Practice number series, coding-decoding, syllogisms, and logical reasoning.',
        'Use Aptitude Hub for timed sets and explanation review.',
        'Avoid spending too long on one question during a test.'
      ])}
      <p><strong>Common mistakes:</strong> over-calculating, skipping elimination, and guessing without a strategy.</p>
    `;
  },

  website(text, profile) {
    const pageKey = this.detectPageRequest(text);
    if (pageKey) return this.pageGuide(pageKey, profile);

    if (/how do i upload a resume|upload a resume|upload resume/.test(text)) {
      return `
        <strong>How to upload a resume</strong>
        <p>Open Resume Master, click the resume drop zone or browse button, select a PDF or TXT file, and then click Analyze Resume for feedback.</p>
      `;
    }

    if (/how do i edit my profile|where do i edit my profile|edit profile/.test(text)) {
      return `
        <strong>Edit Profile</strong>
        <p>Open the profile menu in the top navigation and click Edit Profile.</p>
        <p>You can update your name, email, target company, placement date, and skills there.</p>
      `;
    }

    if (/placement readiness score|readiness score/.test(text)) {
      return `
        <strong>Placement Readiness Score</strong>
        <p>The Dashboard calculates this score from coding progress, aptitude practice, interview activity, resume score, and your streak.</p>
        <p>Improve it by solving more problems, completing aptitude sets, practicing mock interviews, and polishing your resume.</p>
      `;
    }

    return `
      <strong>CareerCopilot Guide</strong>
      <p>I can help you navigate the website and explain the main pages and features.</p>
      ${this.buildBulletList([
        'Ask “Where is my profile?” or “How do I edit my profile?”.',
        'Ask “What is Resume Master?” to learn how to upload and analyze a resume.',
        'Ask “What does Analytics show?” to understand the progress charts.'
      ])}
    `;
  },

  detectPageRequest(text) {
    const pages = {
      dashboard: ['dashboard', 'home page', 'main page'],
      planner: ['planner', 'study planner', 'planner page', 'schedule'],
      coding: ['coding practice', 'coding page', 'code practice'],
      aptitude: ['aptitude hub', 'aptitude page', 'aptitude'],
      interview: ['interview prep', 'interview page', 'mock interview', 'interview practice'],
      resume: ['resume master', 'resume page', 'resume'],
      companies: ['company prep', 'companies page', 'company page'],
      analytics: ['analytics', 'progress dashboard', 'charts'],
      achievements: ['achievements', 'badges', 'xp'],
      settings: ['settings', 'profile settings', 'data management']
    };

    for (const [key, phrases] of Object.entries(pages)) {
      if (phrases.some(phrase => text.includes(phrase))) return key;
    }

    return null;
  },

  pageGuide(pageKey, profile) {
    const company = profile.dreamCompany || profile.targetCompany || 'your target company';
    const map = {
      dashboard: `The Dashboard shows your Placement Readiness Score, coding progress, interview stats, resume score, and quick recommendations for what to practice next. It also aligns your progress with ${company}.`,
      planner: 'The Planner page helps you set daily and weekly goals, track completed tasks, and countdown to your placement date.',
      coding: 'The Coding Practice page contains curated DSA problems, solved counts, and topic filters to build coding strength.',
      aptitude: 'The Aptitude Hub offers timed aptitude quizzes and review explanations for quantitative, logical, and verbal topics.',
      interview: 'The Interview Prep page includes an AI mock interview simulator for technical, HR, and managerial rounds with feedback history.',
      resume: 'The Resume Master page lets you upload a resume, run ATS-friendly analysis, and get suggestions to improve contact info, projects, experience, and keywords. If you do not have a resume yet, use the create resume link on that page.',
      companies: 'The Company Prep page gives guidance for top companies and their typical selection process.',
      analytics: 'The Analytics page shows charts for coding activity, DSA topic completion, readiness score, and skill gaps.',
      achievements: 'The Achievements page tracks badges, XP, rank, and your progress streak.',
      settings: 'The Settings page lets you update profile details, export or import progress, clear data, and toggle app preferences.'
    };

    return `<strong>${pageKey.charAt(0).toUpperCase() + pageKey.slice(1)} Page</strong><p>${map[pageKey]}</p>`;
  }
};
