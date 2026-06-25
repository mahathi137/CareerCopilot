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
    arrays: ['Arrays', 'Use arrays when data is contiguous and indexed. Master traversal, prefix sums, two pointers, sliding window, and hashing.'],
    strings: ['Strings', 'Treat strings as character arrays. Focus on frequency maps, two pointers, pattern matching, and careful edge cases.'],
    linked: ['Linked List', 'Linked lists test pointer handling. Practice slow-fast pointer, reversal, merge, cycle detection, and dummy nodes.'],
    stack: ['Stack', 'Stacks help with last-in-first-out logic: parentheses, next greater element, monotonic stack, and expression parsing.'],
    queue: ['Queue', 'Queues power BFS, scheduling, and level-order traversal. Know normal queues, deques, and priority queues.'],
    tree: ['Trees', 'Trees need recursion discipline. Practice traversals, height, diameter, LCA, BST rules, and level-order BFS.'],
    graph: ['Graphs', 'Graphs need representation first: adjacency list, visited set, BFS/DFS, shortest path, cycle detection, and topological sort.'],
    recursion: ['Recursion', 'Define base case, state, transition, and return value. Trace small examples before coding.'],
    dynamic: ['Dynamic Programming', 'DP is recursion plus memory. Identify state, recurrence, base cases, order of computation, and answer extraction.'],
    dp: ['Dynamic Programming', 'DP is recursion plus memory. Identify state, recurrence, base cases, order of computation, and answer extraction.'],
    searching: ['Searching', 'Master linear search, binary search, lower/upper bounds, and binary search on answer.'],
    sorting: ['Sorting', 'Know merge sort, quick sort, stable sorting, comparator logic, and when sorting simplifies a problem.'],
    complexity: ['Time and Space Complexity', 'Complexity describes growth. Count loops, recursion branches, data structures, and input constraints.']
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
    'search', 'sort', 'complexity', 'coding', 'code', 'program', 'java', 'python', 'c++', 'javascript', 'resume', 'cv', 'interview',
    'hr', 'technical', 'manager', 'company', 'tcs', 'infosys', 'accenture', 'wipro', 'cognizant', 'capgemini', 'aptitude',
    'quant', 'logical', 'verbal', 'career', 'roadmap', 'placement', 'job', 'internship', 'project', 'sql', 'oop', 'dbms',
    'leetcode', 'hackerrank', 'portfolio', 'ats', 'skills', 'developer', 'software', 'freshers', 'fresher'
  ],

  offTopicMessage() {
    return 'I am CareerCopilot placement assistant. I can help you with DSA, coding, resumes, interviews, company preparation, and career guidance. Please ask something related to placement preparation.';
  },

  isPlacementRelated(text) {
    return this.placementKeywords.some(keyword => {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\ /g, '\\s+');
      return new RegExp(`(^|[^a-z0-9+])${escaped}([^a-z0-9+]|$)`, 'i').test(text);
    });
  },

  processMessage(message) {
    const text = String(message || '').toLowerCase();
    const profile = typeof UserProfile !== 'undefined' ? UserProfile.get() : {};

    if (!text.trim()) return this.offTopicMessage();

    if (!this.isPlacementRelated(text)) return this.offTopicMessage();

    if (/resume|cv|bullet/.test(text)) return this.resume(text);
    if (/company|tcs|infosys|accenture|wipro|cognizant|capgemini/.test(text)) return this.company(text, profile);
    if (/aptitude|quant|logical|verbal/.test(text)) return this.aptitude();
    if (/interview|hr|technical round|manager/.test(text)) return this.interview(text, profile);

    for (const key of Object.keys(this.topicMap)) {
      if (text.includes(key)) return this.dsaTopic(this.topicMap[key]);
    }

    if (/roadmap|dsa roadmap|\bdsa\b|data structure|algorithm/.test(text)) return this.roadmap(profile);
    if (/coding help|code|program|java|python|c\+\+|javascript|\bc\b/.test(text)) return this.programming(text);

    return this.offTopicMessage();
  },

  roadmap(profile) {
    const company = profile.dreamCompany || profile.targetCompany || 'your target company';
    return `
      <strong>DSA Roadmap for ${company}</strong>
      <p><strong>Simple plan:</strong> Build fundamentals first, then move into interview patterns and timed practice.</p>
      <p><strong>Week 1:</strong> Arrays, strings, searching, sorting, time complexity, and 10 easy problems.</p>
      <p><strong>Week 2:</strong> Linked list, stack, queue, recursion, hashing, and 8 easy plus 5 medium problems.</p>
      <p><strong>Week 3:</strong> Trees, graphs, BFS/DFS, greedy basics, and company coding patterns.</p>
      <p><strong>Week 4:</strong> Dynamic programming basics, mock interviews, resume polish, and aptitude revision.</p>
      <p><strong>Practice problems:</strong> Two Sum, Best Time to Buy/Sell Stock, Valid Parentheses, Merge Two Lists, Binary Tree Level Order, Number of Islands, Climbing Stairs.</p>
      <p><strong>Common mistakes:</strong> skipping edge cases, memorizing solutions, ignoring complexity, and not explaining your approach aloud.</p>
    `;
  },

  dsaTopic(topic) {
    const [name, explanation] = topic;
    return `
      <strong>${name} Mentor Notes</strong>
      <p><strong>Simple explanation:</strong> ${explanation}</p>
      <p><strong>Example:</strong> For an array problem asking for a pair sum, use a hash map to remember values already seen.</p>
      <p><strong>Approach:</strong> Clarify input, identify constraints, choose a pattern, dry-run with a small example, then code.</p>
      <p><strong>Code idea:</strong> Write a helper, initialize your data structure, loop once if possible, update answer, handle empty or single-item inputs.</p>
      <p><strong>Complexity:</strong> Aim for O(n) or O(n log n) when constraints are large. Track extra memory from maps, recursion, or queues.</p>
      <p><strong>Common mistakes:</strong> off-by-one errors, missing null cases, modifying input accidentally, and not explaining why the solution works.</p>
      <p><strong>Practice:</strong> Start with 3 easy problems, then 3 medium problems from this topic under a 35-minute timer.</p>
    `;
  },

  programming(text) {
    const lang = Object.keys(this.languageMap).find(key => text.includes(key));
    const base = lang ? this.languageMap[lang] : 'Pick one main language for interviews and become fluent with its input/output, collections, functions, and debugging.';
    return `
      <strong>Coding Help</strong>
      <p><strong>Simple explanation:</strong> ${base}</p>
      <p><strong>Approach:</strong> Before writing code, say the brute force idea, improve it, then mention time and space complexity.</p>
      <p><strong>Code idea:</strong> Use clear variable names, keep helper functions small, and test with normal, edge, and stress cases.</p>
      <p><strong>Complexity:</strong> Mention both time and auxiliary space. Interviewers care about the tradeoff, not only the final code.</p>
      <p><strong>Common mistakes:</strong> jumping into syntax, not handling empty input, using the wrong collection, and staying silent while debugging.</p>
      <p><strong>Practice problems:</strong> Reverse a string, remove duplicates, frequency counter, binary search, valid parentheses, and merge intervals.</p>
    `;
  },

  interview(text, profile) {
    const company = profile.dreamCompany || profile.targetCompany || 'the company';
    return `
      <strong>Interview Preparation Plan</strong>
      <p><strong>HR:</strong> Prepare tell me about yourself, strengths, weakness, relocation, why ${company}, and a failure/learning story.</p>
      <p><strong>Technical:</strong> Revise one language, OOP, DBMS, SQL, OS basics, DSA patterns, and every project on your resume.</p>
      <p><strong>Answer format:</strong> Use a direct answer, one example, your role, result, and what you learned.</p>
      <p><strong>Common mistakes:</strong> vague project explanations, saying "we did" without your contribution, and not asking clarifying questions.</p>
      <p><strong>Practice task:</strong> Record a 90-second project explanation today and improve clarity, confidence, and impact.</p>
    `;
  },

  resume(text) {
    return `
      <strong>Resume Tips</strong>
      <p><strong>Simple explanation:</strong> A placement resume should prove skills through projects, measurable impact, and recruiter-friendly keywords.</p>
      <p><strong>Bullet upgrade example:</strong> "Created a website" becomes "Developed a responsive web application with optimized UI, reusable components, and improved user experience."</p>
      <p><strong>Approach:</strong> Use action verb + technology + scope + measurable result. Add GitHub/demo links where possible.</p>
      <p><strong>ATS:</strong> Include exact keywords: Java, Python, SQL, React, OOP, DBMS, data structures, algorithms, internship, projects.</p>
      <p><strong>Common mistakes:</strong> long paragraphs, no metrics, missing links, ungrouped skills, and listing tools you cannot explain.</p>
    `;
  },

  company(text, profile) {
    const company = ['tcs','infosys','accenture','wipro','cognizant','capgemini'].find(c => text.includes(c)) || (profile.dreamCompany || 'target company');
    return `
      <strong>Company Preparation: ${String(company).toUpperCase()}</strong>
      <p><strong>Overview:</strong> Focus on aptitude, communication, programming fundamentals, and project confidence.</p>
      <p><strong>Hiring process:</strong> Aptitude or cognitive assessment, coding/technical MCQ, technical interview, then HR or manager round.</p>
      <p><strong>Technical rounds:</strong> Prepare one language, OOP, SQL, DBMS, arrays, strings, recursion, and your strongest project.</p>
      <p><strong>HR questions:</strong> Tell me about yourself, why this company, strengths, weakness, relocation, and career goals.</p>
      <p><strong>Roadmap:</strong> 10 days aptitude, 10 days DSA basics, 5 days project revision, 5 days mock interviews.</p>
    `;
  },

  aptitude() {
    return `
      <strong>Aptitude Preparation</strong>
      <p><strong>Simple explanation:</strong> Aptitude is a speed plus accuracy game. Learn patterns, then practice timed sets.</p>
      <p><strong>Topics:</strong> Percentages, ratios, averages, profit-loss, time-speed-distance, number series, coding-decoding, syllogisms, and reading comprehension.</p>
      <p><strong>Approach:</strong> First solve slowly for accuracy, then repeat under time limits. Keep a formula notebook.</p>
      <p><strong>Common mistakes:</strong> over-calculating, not eliminating options, and spending too long on one question.</p>
    `;
  }
};
