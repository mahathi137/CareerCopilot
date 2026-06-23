/* ============================================
   CareerCopilot Data File
   Questions, Companies, Badges, Quotes, FAQ
   ============================================ */

// ========== DSA QUESTIONS ==========
const DSA_QUESTIONS = [
  // ---- EASY ----
  { id: 'dsa1', title: 'Two Sum', difficulty: 'easy', topic: 'Arrays', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.' },
  { id: 'dsa2', title: 'Valid Parentheses', difficulty: 'easy', topic: 'Strings', description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.' },
  { id: 'dsa3', title: 'Reverse Linked List', difficulty: 'easy', topic: 'Linked Lists', description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.' },
  { id: 'dsa4', title: 'Maximum Subarray', difficulty: 'easy', topic: 'Arrays', description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.' },
  { id: 'dsa5', title: 'Climbing Stairs', difficulty: 'easy', topic: 'Dynamic Programming', description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?' },
  { id: 'dsa6', title: 'Binary Search', difficulty: 'easy', topic: 'Searching', description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.' },
  { id: 'dsa7', title: 'Merge Sorted Array', difficulty: 'easy', topic: 'Sorting', description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, merge nums1 and nums2 into a single array sorted in non-decreasing order.' },
  { id: 'dsa8', title: 'Symmetric Tree', difficulty: 'easy', topic: 'Trees', description: 'Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).' },
  { id: 'dsa9', title: 'Reverse String', difficulty: 'easy', topic: 'Strings', description: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.' },
  { id: 'dsa10', title: 'Fibonacci Number', difficulty: 'easy', topic: 'Recursion', description: 'Given n, calculate F(n), where F(n) = F(n - 1) + F(n - 2), with F(0) = 0 and F(1) = 1.' },
  { id: 'dsa11', title: 'Single Number', difficulty: 'easy', topic: 'Arrays', description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. Solve in O(n) time and O(1) space.' },
  { id: 'dsa12', title: 'Find Missing Number', difficulty: 'easy', topic: 'Arrays', description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.' },
  { id: 'dsa13', title: 'Linked List Cycle', difficulty: 'easy', topic: 'Linked Lists', description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.' },
  { id: 'dsa14', title: 'Invert Binary Tree', difficulty: 'easy', topic: 'Trees', description: 'Given the root of a binary tree, invert the tree, and return its root.' },
  { id: 'dsa15', title: 'Best Time to Buy Stock', difficulty: 'easy', topic: 'Arrays', description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize your profit by choosing a single day to buy and a single day in the future to sell.' },

  // ---- MEDIUM ----
  { id: 'dsa16', title: 'Longest Substring Without Repeating', difficulty: 'medium', topic: 'Strings', description: 'Given a string s, find the length of the longest substring without repeating characters.' },
  { id: 'dsa17', title: 'Container With Most Water', difficulty: 'medium', topic: 'Arrays', description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.' },
  { id: 'dsa18', title: 'Group Anagrams', difficulty: 'medium', topic: 'Strings', description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.' },
  { id: 'dsa19', title: 'Binary Tree Level Order Traversal', difficulty: 'medium', topic: 'Trees', description: 'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level).' },
  { id: 'dsa20', title: 'Number of Islands', difficulty: 'medium', topic: 'Graphs', description: 'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.' },
  { id: 'dsa21', title: 'Longest Palindromic Substring', difficulty: 'medium', topic: 'Dynamic Programming', description: 'Given a string s, return the longest palindromic substring in s.' },
  { id: 'dsa22', title: 'Add Two Numbers (Linked List)', difficulty: 'medium', topic: 'Linked Lists', description: 'You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.' },
  { id: 'dsa23', title: 'Validate BST', difficulty: 'medium', topic: 'Trees', description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).' },
  { id: 'dsa24', title: 'Course Schedule', difficulty: 'medium', topic: 'Graphs', description: 'There are numCourses courses you have to take, labeled from 0 to numCourses-1. Determine if it is possible to finish all courses given prerequisites (cycle detection in directed graph).' },
  { id: 'dsa25', title: 'Coin Change', difficulty: 'medium', topic: 'Dynamic Programming', description: 'You are given an integer array coins representing coins of various denominations and an integer amount. Return the fewest number of coins needed to make up that amount.' },
  { id: 'dsa26', title: 'Subsets', difficulty: 'medium', topic: 'Recursion', description: 'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.' },
  { id: 'dsa27', title: 'Sort Colors', difficulty: 'medium', topic: 'Sorting', description: 'Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.' },
  { id: 'dsa28', title: 'Search in Rotated Sorted Array', difficulty: 'medium', topic: 'Searching', description: 'Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not.' },
  { id: 'dsa29', title: '3Sum', difficulty: 'medium', topic: 'Arrays', description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.' },
  { id: 'dsa30', title: 'Flatten Nested List Iterator', difficulty: 'medium', topic: 'Recursion', description: 'Implement an iterator to flatten a nested list of integers.' },

  // ---- HARD ----
  { id: 'dsa31', title: 'Median of Two Sorted Arrays', difficulty: 'hard', topic: 'Searching', description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).' },
  { id: 'dsa32', title: 'Merge K Sorted Lists', difficulty: 'hard', topic: 'Linked Lists', description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.' },
  { id: 'dsa33', title: 'Trapping Rain Water', difficulty: 'hard', topic: 'Arrays', description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.' },
  { id: 'dsa34', title: 'Regular Expression Matching', difficulty: 'hard', topic: 'Dynamic Programming', description: 'Given an input string s and a pattern p, implement regular expression matching with support for "." and "*" where "." matches any single character and "*" matches zero or more of the preceding element.' },
  { id: 'dsa35', title: 'Word Ladder', difficulty: 'hard', topic: 'Graphs', description: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words where each adjacent pair differs by exactly one letter. Return the length of the shortest transformation sequence.' },
  { id: 'dsa36', title: 'N-Queens', difficulty: 'hard', topic: 'Recursion', description: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions.' },
  { id: 'dsa37', title: 'Binary Tree Max Path Sum', difficulty: 'hard', topic: 'Trees', description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. Return the maximum path sum.' },
  { id: 'dsa38', title: 'Serialize and Deserialize Binary Tree', difficulty: 'hard', topic: 'Trees', description: 'Design an algorithm to serialize and deserialize a binary tree.' },
  { id: 'dsa39', title: 'Largest Rectangle in Histogram', difficulty: 'hard', topic: 'Arrays', description: 'Given an array of integers heights representing the histogram bar heights, find the largest rectangle.' },
  { id: 'dsa40', title: 'Edit Distance', difficulty: 'hard', topic: 'Dynamic Programming', description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.' }
];

// ========== APTITUDE QUESTIONS ==========
const APTITUDE_QUESTIONS = {
  quantitative: [
    { id: 'apt1', question: 'A train travels 120 km in 2 hours. What is its speed in m/s?', options: ['16.67 m/s', '33.33 m/s', '60 m/s', '20 m/s'], answer: 0, explanation: 'Speed = 120 km / 2 h = 60 km/h = 60 × 1000/3600 = 16.67 m/s' },
    { id: 'apt2', question: 'What is 15% of 240?', options: ['36', '32', '38', '34'], answer: 0, explanation: '15% × 240 = 0.15 × 240 = 36' },
    { id: 'apt3', question: 'If a shirt costs ₹400 and is sold at a 20% profit, what is the selling price?', options: ['₹480', '₹460', '₹500', '₹420'], answer: 0, explanation: 'SP = 400 × 1.2 = ₹480' },
    { id: 'apt4', question: 'The average of 5 numbers is 18. What is their sum?', options: ['90', '85', '95', '80'], answer: 0, explanation: 'Sum = Average × Count = 18 × 5 = 90' },
    { id: 'apt5', question: 'A can do work in 10 days, B in 15 days. Together they finish in?', options: ['6 days', '5 days', '8 days', '4 days'], answer: 0, explanation: '1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6, so 6 days' },
    { id: 'apt6', question: 'If 8 men can complete a work in 12 days, how many days will 12 men take?', options: ['8', '6', '10', '9'], answer: 0, explanation: 'M1×D1 = M2×D2 → 8×12 = 12×D2 → D2 = 8 days' },
    { id: 'apt7', question: 'Simple interest on ₹2000 at 5% per annum for 3 years?', options: ['₹300', '₹250', '₹350', '₹400'], answer: 0, explanation: 'SI = P×R×T/100 = 2000×5×3/100 = ₹300' },
    { id: 'apt8', question: 'A pipe fills a tank in 4 hours. Another empties it in 6 hours. Time to fill when both open?', options: ['12 hours', '10 hours', '8 hours', '6 hours'], answer: 0, explanation: 'Net = 1/4 - 1/6 = 1/12, so 12 hours' },
    { id: 'apt9', question: 'What is the compound interest on ₹1000 at 10% for 2 years?', options: ['₹210', '₹200', '₹220', '₹190'], answer: 0, explanation: 'CI = 1000(1.1)² - 1000 = 1210 - 1000 = ₹210' },
    { id: 'apt10', question: 'The ratio of boys to girls is 3:2. If there are 30 boys, how many girls?', options: ['20', '25', '15', '18'], answer: 0, explanation: 'Girls = (2/3) × 30 = 20' }
  ],
  logical: [
    { id: 'log1', question: 'If A is B\'s sister, B is C\'s brother, and C is D\'s father, how is A related to D?', options: ['Aunt', 'Sister', 'Mother', 'Grandmother'], answer: 0, explanation: 'A is sister of B, B is brother of C (so A is sister of C), C is D\'s father so A is D\'s aunt.' },
    { id: 'log2', question: 'What comes next in the series? 2, 6, 12, 20, 30, ?', options: ['42', '40', '44', '36'], answer: 0, explanation: 'Differences: 4, 6, 8, 10, 12 → next is 30+12 = 42' },
    { id: 'log3', question: 'Find the odd one out: Apple, Mango, Carrot, Banana', options: ['Carrot', 'Apple', 'Mango', 'Banana'], answer: 0, explanation: 'Carrot is a vegetable; others are fruits.' },
    { id: 'log4', question: 'If FAST = 6120, then SLOW = ?', options: ['1923', '1924', '1922', '1925'], answer: 0, explanation: 'F=6,A=1,S=19,T=20 → S=19,L=12,O=15,W=23 → 19+12+15+23=1923 (using letter positions)' },
    { id: 'log5', question: 'Complete the analogy: Book : Library :: Painting : ?', options: ['Gallery', 'Museum', 'Studio', 'Frame'], answer: 0, explanation: 'Books are kept in a Library; Paintings are displayed in a Gallery.' },
    { id: 'log6', question: 'How many triangles in a triangle divided by 3 lines from top to base?', options: ['5', '4', '6', '3'], answer: 0, explanation: '3 small triangles + 2 medium + 1 large... depends on configuration. Classic answer: 5.' },
    { id: 'log7', question: 'If all Blips are Blops, and some Blops are Blinks, then?', options: ['Some Blips may be Blinks', 'All Blips are Blinks', 'No Blips are Blinks', 'All Blinks are Blips'], answer: 0, explanation: 'Since all Blips are Blops, and some Blops are Blinks, some Blips may be Blinks.' },
    { id: 'log8', question: 'A clock shows 3:15. What is the angle between the hour and minute hands?', options: ['7.5°', '0°', '15°', '22.5°'], answer: 0, explanation: 'Hour hand at 3:15 = 97.5°; Minute hand = 90°; Difference = 7.5°' },
    { id: 'log9', question: 'In a code, PENCIL = 135793. Then ERASER = ?', options: ['653461', '635461', '654361', '653641'], answer: 0, explanation: 'Pattern mapping E=1,R=3,A=5,S=6,E=1,R=3 with coded values → 653461' },
    { id: 'log10', question: 'Find the pattern: 1, 4, 9, 16, 25, ?', options: ['36', '35', '37', '34'], answer: 0, explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6² = 36' }
  ],
  verbal: [
    { id: 'ver1', question: 'Choose the word most similar to "Benevolent":', options: ['Kind', 'Cruel', 'Selfish', 'Indifferent'], answer: 0, explanation: 'Benevolent means kind and generous.' },
    { id: 'ver2', question: 'Find the antonym of "Verbose":', options: ['Concise', 'Wordy', 'Talkative', 'Lengthy'], answer: 0, explanation: 'Verbose means using more words than needed; Concise means brief.' },
    { id: 'ver3', question: 'Identify the correct sentence:', options: ['She has been working since morning.', 'She is working since morning.', 'She works since morning.', 'She was working since morning.'], answer: 0, explanation: '"Since" requires present perfect or past perfect tense.' },
    { id: 'ver4', question: 'Choose the correctly spelled word:', options: ['Necessary', 'Necesary', 'Neccesary', 'Necesery'], answer: 0, explanation: 'The correct spelling is "Necessary" (one C, two S\'s).' },
    { id: 'ver5', question: 'Choose the word that best completes: "The politician\'s speech was _____ - it convinced everyone."', options: ['Persuasive', 'Ambiguous', 'Mundane', 'Confusing'], answer: 0, explanation: 'Persuasive means able to convince, which matches the context.' },
    { id: 'ver6', question: 'Find the analogy: Painter : Canvas :: Sculptor : ?', options: ['Marble', 'Chisel', 'Museum', 'Paint'], answer: 0, explanation: 'A Painter works on Canvas; a Sculptor works on Marble.' },
    { id: 'ver7', question: 'Select the correct passive voice: "The company hired him."', options: ['He was hired by the company.', 'He is hired by the company.', 'He has been hired by the company.', 'He had been hired by the company.'], answer: 0, explanation: 'Simple past active "hired" becomes "was hired" in passive.' },
    { id: 'ver8', question: 'Which phrase is a simile?', options: ['Life is like a box of chocolates.', 'Time is money.', 'The stars danced.', 'The world is a stage.'], answer: 0, explanation: 'A simile uses "like" or "as" to compare; metaphors do not.' },
    { id: 'ver9', question: 'The word "ephemeral" means:', options: ['Short-lived', 'Permanent', 'Enormous', 'Ancient'], answer: 0, explanation: 'Ephemeral means lasting for a very short time.' },
    { id: 'ver10', question: 'Rearrange: "students / the / hard / studying / are"', options: ['The students are studying hard.', 'Are the students studying hard.', 'Studying hard are the students.', 'The students studying hard are.'], answer: 0, explanation: 'Correct word order for declarative sentence.' }
  ]
};

// ========== INTERVIEW QUESTIONS ==========
const INTERVIEW_QUESTIONS = {
  hr: [
    { id: 'hr1', question: 'Tell me about yourself.', category: 'HR', tips: 'Keep it professional. Cover education, key skills, relevant experience, and career goals. Keep it under 2 minutes.', example: 'I am a final year B.Tech student in Computer Science from [College]. I have strong skills in Java and Python, and I\'ve built projects in web development. I\'m passionate about problem-solving and looking forward to starting my career at a company like [Company Name].' },
    { id: 'hr2', question: 'Why do you want to work for our company?', category: 'HR', tips: 'Research the company beforehand. Mention specific things you like about the company culture, products, or mission.', example: 'I admire [Company]\'s focus on innovation and the impact it has made in [domain]. Your commitment to employee growth and the kind of projects you work on align perfectly with my career aspirations.' },
    { id: 'hr3', question: 'What are your strengths?', category: 'HR', tips: 'Choose strengths relevant to the job. Back each with a specific example.', example: 'My strongest quality is problem-solving. During my project on [topic], I faced a complex bug that no one could fix for days. I systematically debugged it and found the root cause within hours.' },
    { id: 'hr4', question: 'What are your weaknesses?', category: 'HR', tips: 'Choose a real weakness but show self-awareness and steps you\'re taking to improve.', example: 'I sometimes spend too much time perfecting code. I\'ve been learning to balance quality with deadlines by using time-boxing techniques.' },
    { id: 'hr5', question: 'Where do you see yourself in 5 years?', category: 'HR', tips: 'Show ambition aligned with the company\'s growth path. Mention technical and leadership goals.', example: 'In 5 years, I see myself as a senior developer who has contributed to large-scale products, possibly leading a small team. I want to grow with this company and take on increasing responsibilities.' },
    { id: 'hr6', question: 'Why should we hire you?', category: 'HR', tips: 'Directly connect your skills, attitude, and achievements to the company\'s needs.', example: 'I bring a strong foundation in coding, quick learning ability, and genuine passion for this field. I\'m adaptable, work well in teams, and I\'m committed to delivering quality work.' },
    { id: 'hr7', question: 'Describe a challenging situation and how you handled it.', category: 'HR', tips: 'Use the STAR method: Situation, Task, Action, Result.', example: 'During my final year project, our team lead left mid-way. I took initiative, restructured the task allocation, and ensured we completed the project on time with all planned features.' },
    { id: 'hr8', question: 'Are you willing to relocate?', category: 'HR', tips: 'Be honest. If you\'re flexible, say so positively.', example: 'Yes, I\'m open to relocating. I believe new environments bring growth opportunities and I\'m excited about the possibility.' },
    { id: 'hr9', question: 'Do you have any questions for us?', category: 'HR', tips: 'Always ask 2-3 thoughtful questions. Shows curiosity and preparation.', example: 'What does the onboarding process look like? What technologies does the team currently work with? What growth opportunities are available for freshers?' },
    { id: 'hr10', question: 'What motivates you?', category: 'HR', tips: 'Be authentic. Mention internal motivators: learning, solving problems, making impact.', example: 'I\'m motivated by solving complex problems and seeing the tangible impact of my work. When a feature I built improves user experience, that\'s deeply satisfying.' }
  ],
  technical: [
    { id: 'tech1', question: 'What is Object-Oriented Programming?', category: 'Technical', tips: 'Cover the 4 pillars: Encapsulation, Inheritance, Polymorphism, Abstraction with examples.', example: 'OOP is a programming paradigm that organizes code around objects. The 4 pillars are: Encapsulation (binding data and methods), Inheritance (child class inherits parent properties), Polymorphism (same interface, different implementations), Abstraction (hiding implementation details).' },
    { id: 'tech2', question: 'Explain the difference between Stack and Queue.', category: 'Technical', tips: 'Focus on LIFO vs FIFO, use cases, and time complexity.', example: 'Stack follows LIFO (Last In First Out) - like a stack of plates. Queue follows FIFO (First In First Out) - like a queue at a ticket counter. Stack is used for function calls, undo operations. Queue is used for BFS, scheduling.' },
    { id: 'tech3', question: 'What is the difference between Process and Thread?', category: 'Technical', tips: 'Focus on memory sharing, independence, and overhead.', example: 'A Process is an independent program in execution with its own memory space. A Thread is a lightweight unit of a process sharing the same memory. Multiple threads can run within one process.' },
    { id: 'tech4', question: 'What is SQL vs NoSQL?', category: 'Technical', tips: 'Cover structure, scalability, use cases for both.', example: 'SQL databases are relational, use tables, and are ideal for structured data with ACID transactions (MySQL, PostgreSQL). NoSQL databases are flexible, schema-less, and suited for unstructured data at scale (MongoDB, Cassandra).' },
    { id: 'tech5', question: 'Explain REST API.', category: 'Technical', tips: 'Cover HTTP methods, statelessness, and JSON format.', example: 'REST (Representational State Transfer) is an architectural style for APIs. It uses HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove). It\'s stateless - each request is independent. Data is usually exchanged as JSON.' },
    { id: 'tech6', question: 'What is a Hash Table?', category: 'Technical', tips: 'Explain hashing, collision handling, and O(1) average time complexity.', example: 'A Hash Table maps keys to values using a hash function. It provides O(1) average time for insert, delete, and lookup. Collisions (two keys mapping to same index) are handled by chaining or open addressing.' },
    { id: 'tech7', question: 'Explain ACID properties in databases.', category: 'Technical', tips: 'Define each property and why they matter.', example: 'ACID stands for Atomicity (all or nothing), Consistency (data remains valid), Isolation (transactions don\'t interfere), Durability (committed data persists). These ensure reliable transactions in databases.' },
    { id: 'tech8', question: 'What is Big-O notation?', category: 'Technical', tips: 'Explain time and space complexity, common complexities with examples.', example: 'Big-O notation describes the worst-case time or space complexity of an algorithm. Common complexities: O(1) constant, O(log n) binary search, O(n) linear scan, O(n log n) merge sort, O(n²) bubble sort.' },
    { id: 'tech9', question: 'What is a Binary Tree vs Binary Search Tree?', category: 'Technical', tips: 'Highlight the ordering property of BST.', example: 'A Binary Tree is a hierarchical structure where each node has at most 2 children. A BST is a Binary Tree with the property: left child < root < right child. This allows O(log n) search, insertion, deletion in balanced BSTs.' },
    { id: 'tech10', question: 'Explain the difference between TCP and UDP.', category: 'Technical', tips: 'Cover reliability, speed, and use cases.', example: 'TCP (Transmission Control Protocol) ensures reliable, ordered data delivery with error checking (used for web browsing, email). UDP (User Datagram Protocol) is faster but unreliable, no guarantee of delivery (used for video streaming, gaming).' }
  ],
  behavioral: [
    { id: 'beh1', question: 'Tell me about a time you worked in a team.', category: 'Behavioral', tips: 'Use STAR method. Highlight your specific contribution and the team outcome.', example: 'In my final year project, I worked in a 4-member team. We divided responsibilities, I handled the backend API. When a team member fell sick, I took on their tasks while maintaining my own, and we delivered the project on time.' },
    { id: 'beh2', question: 'Describe a time you failed and what you learned.', category: 'Behavioral', tips: 'Be honest. Focus more on the learning and growth than the failure itself.', example: 'In my first hackathon, our team couldn\'t complete the project on time because we over-engineered the solution. I learned to prioritize working features over perfect code and to scope projects realistically.' },
    { id: 'beh3', question: 'How do you handle criticism?', category: 'Behavioral', tips: 'Show maturity, openness to feedback, and ability to improve.', example: 'I view criticism as an opportunity to improve. When my professor critiqued my project presentation, instead of getting defensive, I asked for specific feedback and improved the documentation, which led to a better grade.' },
    { id: 'beh4', question: 'Describe a time you showed leadership.', category: 'Behavioral', tips: 'Leadership doesn\'t require a title. Show initiative, direction, and positive impact.', example: 'During a college event, the organizer couldn\'t come. I stepped up, delegated tasks to team members, resolved last-minute issues, and the event ran smoothly. The team later thanked me for keeping things together.' },
    { id: 'beh5', question: 'How do you prioritize when you have multiple deadlines?', category: 'Behavioral', tips: 'Show planning skills. Mention tools or frameworks you use.', example: 'I list all tasks and prioritize by urgency and importance using the Eisenhower Matrix. I break large tasks into smaller ones, set daily goals, and communicate proactively if any deadline looks at risk.' }
  ]
};

// ========== COMPANIES DATA ==========
const COMPANIES_DATA = {
  TCS: {
    name: 'Tata Consultancy Services',
    logo: '🔵',
    color: '#1A3A6B',
    type: 'Service',
    package: '3.36-7 LPA',
    difficulty: 'Easy-Medium',
    hiringProcess: [
      'Online Application / Campus Drive',
      'National Qualifier Test (NQT)',
      'Technical Interview (1-2 rounds)',
      'Managerial Interview',
      'HR Interview'
    ],
    aptitudePattern: {
      duration: '180 minutes',
      sections: [
        { name: 'Numerical Ability', questions: 26, time: '40 min' },
        { name: 'Verbal Ability', questions: 24, time: '30 min' },
        { name: 'Reasoning Ability', questions: 30, time: '50 min' },
        { name: 'Programming Logic', questions: 10, time: '20 min' },
        { name: 'Coding', questions: 1, time: '20 min' }
      ]
    },
    codingRound: 'One coding problem (Easy-Medium). C/Java/Python allowed. Focus on logic and working solution.',
    interviewTopics: ['OOP Concepts', 'DBMS', 'OS', 'Networking Basics', 'Data Structures'],
    tips: [
      'TCS NQT score determines campus placement eligibility',
      'Practice TCS previous papers — pattern is consistent',
      'Focus on basic aptitude and verbal; no negative marking',
      'Technical interviews focus on project knowledge and basics',
      'Be prepared with one coding language thoroughly'
    ],
    commonQuestions: [
      'Explain your final year project in detail',
      'What is polymorphism? Give a real-world example',
      'Difference between C and Java',
      'What is normalization in DBMS?',
      'Write a program to find the Fibonacci series'
    ]
  },
  Infosys: {
    name: 'Infosys',
    logo: '🟦',
    color: '#007CC3',
    type: 'Service',
    package: '3.6-8 LPA',
    difficulty: 'Medium',
    hiringProcess: [
      'Online Registration',
      'Infosys Aptitude Test (3 sections)',
      'Pseudocode / Coding Round',
      'Technical Interview',
      'HR Interview'
    ],
    aptitudePattern: {
      duration: '170 minutes',
      sections: [
        { name: 'Reasoning & Problem Solving', questions: 15, time: '25 min' },
        { name: 'Mathematical Thinking', questions: 10, time: '35 min' },
        { name: 'Verbal Ability', questions: 40, time: '35 min' },
        { name: 'Pseudocode', questions: 5, time: '25 min' },
        { name: 'Coding', questions: 2, time: '3 hours' }
      ]
    },
    codingRound: '2 coding problems. Difficulty: Easy to Medium. Focus on clean, correct solutions.',
    interviewTopics: ['Data Structures', 'Java/Python', 'SQL', 'OOP', 'Puzzles'],
    tips: [
      'Infosys focuses heavily on verbal ability — practice reading comprehension',
      'Pseudocode section requires understanding code logic without syntax',
      'For Power Programmer role, harder coding questions appear',
      'Technical interview tests your fundamentals, not advanced topics',
      'Projects are key talking points — know yours inside out'
    ],
    commonQuestions: [
      'Difference between Array and Linked List',
      'What are the types of joins in SQL?',
      'Explain deadlock in OS',
      'Write a program for palindrome check',
      'What is the difference between abstract class and interface?'
    ]
  },
  Accenture: {
    name: 'Accenture',
    logo: '🟣',
    color: '#A100FF',
    type: 'Service',
    package: '4.5-9 LPA',
    difficulty: 'Medium',
    hiringProcess: [
      'Online Application',
      'Cognitive & Technical Assessment (ATAP)',
      'Communication Assessment',
      'Technical Interview',
      'HR Interview'
    ],
    aptitudePattern: {
      duration: '90 minutes',
      sections: [
        { name: 'Cognitive Ability', questions: 50, time: '60 min' },
        { name: 'Technical Assessment', questions: 40, time: '30 min' }
      ]
    },
    codingRound: 'Usually 2 coding questions. Accenture focuses on logic and output-based problems.',
    interviewTopics: ['Coding in any language', 'Data Structures', 'OOP', 'DBMS', 'Current Tech Trends'],
    tips: [
      'Accenture values communication skills highly',
      'ATAP test is fully adaptive — the difficulty adjusts based on your answers',
      'Both ASE and PackageTrack roles are offered based on performance',
      'Focus on time management — cognitive section has tight deadlines',
      'Leadership and teamwork examples are highly valued in HR'
    ],
    commonQuestions: [
      'Explain Agile methodology',
      'Difference between cloud computing service models',
      'What is recursion? Write an example',
      'What are design patterns?',
      'Describe your most challenging project'
    ]
  },
  Wipro: {
    name: 'Wipro',
    logo: '🟠',
    color: '#4C2C8F',
    type: 'Service',
    package: '3.5-7 LPA',
    difficulty: 'Easy-Medium',
    hiringProcess: [
      'Online Application / Campus Drive',
      'Online Written Test (NLTH)',
      'Essay Writing',
      'Technical Interview',
      'HR Interview'
    ],
    aptitudePattern: {
      duration: '60 minutes',
      sections: [
        { name: 'Aptitude', questions: 16, time: '16 min' },
        { name: 'Written English', questions: 22, time: '28 min' },
        { name: 'Coding', questions: 2, time: '60 min' }
      ]
    },
    codingRound: '2 problems in any language. Focus on basic algorithms, string manipulation, and arrays.',
    interviewTopics: ['C/C++/Java basics', 'OOPS', 'Linked Lists', 'Trees', 'SQL'],
    tips: [
      'Wipro\'s aptitude test is one of the easier ones — don\'t underestimate it',
      'Essay writing section tests communication — practice tech-related topics',
      'WILP (Work Integrated Learning Programme) is available — a good growth option',
      'Technical round focuses on fundamentals, not advanced algorithms',
      'Wipro\'s HR round is relaxed — be confident and honest'
    ],
    commonQuestions: [
      'What are pointers in C?',
      'Explain the concept of inheritance with example',
      'Write a function to reverse a string',
      'What is normalization?',
      'Difference between stack overflow and heap overflow'
    ]
  },
  Cognizant: {
    name: 'Cognizant',
    logo: '🔷',
    color: '#0033A0',
    type: 'Service',
    package: '4-8 LPA',
    difficulty: 'Medium',
    hiringProcess: [
      'Online Test (GAME + Aptitude)',
      'Programming Test',
      'Technical Interview',
      'HR Interview'
    ],
    aptitudePattern: {
      duration: '75 minutes',
      sections: [
        { name: 'Reasoning', questions: 25, time: '25 min' },
        { name: 'Verbal', questions: 25, time: '25 min' },
        { name: 'Coding', questions: 2, time: '45 min' }
      ]
    },
    codingRound: '2 coding problems. Difficulty ranges from Easy to Medium. Focus on standard DSA problems.',
    interviewTopics: ['Data Structures', 'Java', 'SQL', 'OOP Concepts', 'Networking'],
    tips: [
      'CTS has two roles: Programmer Analyst Trainee (PAT) and Generic',
      'Higher test scores unlock PAT role with better package',
      'Focus on DSA basics — linked lists, trees, sorting are commonly tested',
      'SQL knowledge is important for technical round',
      'Project discussion is detailed — know your tech stack'
    ],
    commonQuestions: [
      'Explain the difference between overloading and overriding',
      'Write a program to check if a number is prime',
      'What are indexes in SQL?',
      'Explain the concept of multithreading',
      'What is the difference between HashMap and HashTable?'
    ]
  },
  Capgemini: {
    name: 'Capgemini',
    logo: '🟢',
    color: '#0070AD',
    type: 'Service',
    package: '3.8-9 LPA',
    difficulty: 'Medium',
    hiringProcess: [
      'Pseudo Code Test + Behavioral Test',
      'Game-based Assessment',
      'Technical + HR Interview'
    ],
    aptitudePattern: {
      duration: '150 minutes',
      sections: [
        { name: 'Pseudo Code', questions: 20, time: '25 min' },
        { name: 'Behavioural', questions: 100, time: '25 min' },
        { name: 'Game-based', questions: null, time: '10 min' },
        { name: 'Essay Writing', questions: 1, time: '20 min' },
        { name: 'Coding', questions: 2, time: '60 min' }
      ]
    },
    codingRound: '2 coding problems. Focus on logic and complete working solutions.',
    interviewTopics: ['Agile/DevOps Basics', 'Cloud Concepts', 'OOP', 'Data Structures', 'Current Tech'],
    tips: [
      'Capgemini Pseudocode test requires logic, not actual code knowledge',
      'Game-based assessment tests cognitive abilities like memory and attention',
      'Essay writing tests communication — practice writing on tech topics',
      'Capgemini values cloud and DevOps knowledge more than other service companies',
      'RISE (Role in System Engineering) is a popular fresher program'
    ],
    commonQuestions: [
      'What is DevOps? How does CI/CD work?',
      'Explain cloud computing (IaaS, PaaS, SaaS)',
      'What is the difference between Agile and Waterfall?',
      'Write a program for bubble sort',
      'What is your understanding of microservices?'
    ]
  }
};

// ========== BADGES ==========
const BADGES = [
  {
    id: 'badge1',
    name: 'First Code',
    icon: '💻',
    description: 'Complete your first coding problem',
    color: '#6366F1',
    xp: 50,
    condition: (stats) => stats.codingCompleted >= 1
  },
  {
    id: 'badge2',
    name: 'Coding Warrior',
    icon: '⚔️',
    description: 'Solve 10 coding problems',
    color: '#8B5CF6',
    xp: 100,
    condition: (stats) => stats.codingCompleted >= 10
  },
  {
    id: 'badge3',
    name: 'DSA Master',
    icon: '🏆',
    description: 'Solve 25 coding problems',
    color: '#F59E0B',
    xp: 200,
    condition: (stats) => stats.codingCompleted >= 25
  },
  {
    id: 'badge4',
    name: 'Hard Mode',
    icon: '🔥',
    description: 'Solve 5 hard difficulty problems',
    color: '#EF4444',
    xp: 150,
    condition: (stats) => stats.hardCompleted >= 5
  },
  {
    id: 'badge5',
    name: 'Aptitude Master',
    icon: '🧮',
    description: 'Complete 30 aptitude questions',
    color: '#06B6D4',
    xp: 100,
    condition: (stats) => stats.aptitudeCompleted >= 30
  },
  {
    id: 'badge6',
    name: 'Sharp Mind',
    icon: '🎯',
    description: 'Achieve 80%+ accuracy in aptitude',
    color: '#10B981',
    xp: 150,
    condition: (stats) => stats.aptitudeAccuracy >= 80
  },
  {
    id: 'badge7',
    name: 'Interview Ace',
    icon: '🎤',
    description: 'Bookmark 10 interview questions',
    color: '#EC4899',
    xp: 100,
    condition: (stats) => stats.interviewBookmarks >= 10
  },
  {
    id: 'badge8',
    name: 'Resume Pro',
    icon: '📄',
    description: 'Achieve 70%+ resume score',
    color: '#3B82F6',
    xp: 150,
    condition: (stats) => stats.resumeScore >= 70
  },
  {
    id: 'badge9',
    name: 'Consistency King',
    icon: '👑',
    description: 'Maintain a 7-day study streak',
    color: '#F59E0B',
    xp: 200,
    condition: (stats) => stats.streak >= 7
  },
  {
    id: 'badge10',
    name: 'Streak Legend',
    icon: '⚡',
    description: 'Maintain a 30-day study streak',
    color: '#6366F1',
    xp: 500,
    condition: (stats) => stats.streak >= 30
  },
  {
    id: 'badge11',
    name: 'Company Researcher',
    icon: '🏢',
    description: 'Study all 6 company profiles',
    color: '#8B5CF6',
    xp: 100,
    condition: (stats) => stats.companiesStudied >= 6
  },
  {
    id: 'badge12',
    name: 'Placement Champion',
    icon: '🎓',
    description: 'Achieve 80%+ placement readiness score',
    color: '#F59E0B',
    xp: 500,
    condition: (stats) => stats.readinessScore >= 80
  },
  {
    id: 'badge13',
    name: 'Early Bird',
    icon: '🌅',
    description: 'Start your placement prep journey',
    color: '#06B6D4',
    xp: 25,
    condition: (stats) => stats.totalXP >= 1
  },
  {
    id: 'badge14',
    name: 'Planner',
    icon: '📅',
    description: 'Set up your study planner',
    color: '#10B981',
    xp: 50,
    condition: (stats) => stats.plannerSetup
  },
  {
    id: 'badge15',
    name: 'Topic Explorer',
    icon: '🗺️',
    description: 'Practice problems from 5 different topics',
    color: '#EC4899',
    xp: 100,
    condition: (stats) => stats.topicsExplored >= 5
  }
];

// ========== MOTIVATIONAL QUOTES ==========
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Every expert was once a beginner. Keep coding!", author: "Career Copilot" },
  { text: "Your only limit is your mind. Code beyond it.", author: "Anonymous" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The best time to start was yesterday. The next best time is now.", author: "Career Copilot" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "A smooth sea never made a skilled programmer.", author: "Career Copilot" },
  { text: "Every line of code you write today is an investment in your future.", author: "Career Copilot" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Your placement is a marathon, not a sprint. Pace yourself.", author: "Career Copilot" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Today's practice is tomorrow's performance.", author: "Career Copilot" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" }
];

// ========== CAREER TIPS ==========
const CAREER_TIPS = [
  "Practice 1 DSA problem every day — consistency beats cramming.",
  "Solve at least 50 LeetCode problems before appearing for interviews.",
  "Your GitHub profile is your portfolio — keep it active.",
  "Read 1 technical blog post per day to stay updated.",
  "Mock interviews are as important as actual preparation.",
  "Learn SQL — 90% of tech companies test database knowledge.",
  "Focus on depth over breadth — know a few languages really well.",
  "Prepare 3-4 strong project examples for behavioral interviews.",
  "Practice typing speed — it helps in timed coding assessments.",
  "Learn the top 10 sorting and searching algorithms cold.",
  "Revise OS, DBMS, and Networking basics — they're commonly asked.",
  "Keep your resume to 1 page with quantified achievements.",
  "Apply to 20+ companies — don't rely on just one.",
  "Research each company before the interview — show you're interested.",
  "After each practice session, review what you got wrong and why."
];

// ========== FAQ DATA ==========
const FAQ_DATA = [
  {
    q: "Is CareerCopilot completely free?",
    a: "Yes! CareerCopilot is completely free to use. All features including DSA practice, aptitude tests, interview prep, and the AI Copilot are available at no cost."
  },
  {
    q: "How does the Placement Readiness Score work?",
    a: "Your Placement Readiness Score is calculated based on your progress across all modules: DSA completion (30%), Aptitude accuracy (20%), Interview prep (20%), Resume score (20%), and Consistency streak (10%)."
  },
  {
    q: "Can I use CareerCopilot for product-based companies too?",
    a: "Absolutely! While we have dedicated profiles for top IT service companies, the DSA practice, interview prep, and aptitude sections are relevant for product companies like Amazon, Google, and Microsoft as well."
  },
  {
    q: "How does the AI Copilot work?",
    a: "The Copilot is a rule-based intelligent assistant with 300+ pre-configured responses. It understands your questions about placement preparation, DSA, resume, companies, and career advice, and provides actionable guidance."
  },
  {
    q: "Is my progress saved if I close the browser?",
    a: "Yes! All your progress, completed questions, bookmarks, notes, and settings are saved in your browser's Local Storage. Your data persists across sessions on the same device and browser."
  },
  {
    q: "How do I export my progress data?",
    a: "Go to Settings → Export Progress. This downloads a JSON file with all your data. You can later import it on another device using Settings → Import Progress."
  },
  {
    q: "Can I use CareerCopilot on mobile?",
    a: "Yes! CareerCopilot is fully responsive and works beautifully on mobile devices. You can access all features on smartphones and tablets."
  },
  {
    q: "How are XP and ranks calculated?",
    a: "You earn XP by completing activities: 15 XP per coding problem, 5 XP per correct aptitude answer, 10 XP per interview question learned, 50 XP per badge unlocked. Ranks progress from Beginner → Learner → Practitioner → Achiever → Expert → Champion → Placement Master."
  }
];

// ========== ROADMAP DATA ==========
const ROADMAP_PHASES = [
  {
    phase: 'Foundation',
    title: 'Build Your Base',
    icon: '🏗️',
    color: '#6366F1',
    bg: 'rgba(99,102,241,0.15)',
    desc: 'Master programming fundamentals, data structures basics, and begin aptitude practice. Set up your profile and learning goals.',
    tags: ['Arrays', 'Strings', 'Basic Math', 'C/Java/Python'],
    duration: '4 weeks'
  },
  {
    phase: 'Core DSA',
    title: 'Master Data Structures',
    icon: '🔧',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.15)',
    desc: 'Deep dive into Linked Lists, Trees, Graphs, and Dynamic Programming. Solve 50+ problems consistently.',
    tags: ['Trees', 'Graphs', 'DP', 'Recursion'],
    duration: '6 weeks'
  },
  {
    phase: 'Aptitude',
    title: 'Crack Aptitude Tests',
    icon: '🧮',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.15)',
    desc: 'Practice Quantitative, Logical, and Verbal ability. Target 80%+ accuracy on company-specific patterns.',
    tags: ['Quant', 'Logical', 'Verbal', 'Time Management'],
    duration: '4 weeks'
  },
  {
    phase: 'Interview Prep',
    title: 'Interview Mastery',
    icon: '🎤',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.15)',
    desc: 'Prepare HR, Technical, and Behavioral questions. Practice mock interviews and refine your answers using STAR method.',
    tags: ['HR Questions', 'Technical Basics', 'STAR Method', 'Mock Interviews'],
    duration: '3 weeks'
  },
  {
    phase: 'Resume & Apply',
    title: 'Polish & Apply',
    icon: '🚀',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.15)',
    desc: 'Create an ATS-optimized resume, apply to target companies, and track your applications. Network and follow up strategically.',
    tags: ['ATS Resume', 'LinkedIn', 'Applications', 'Networking'],
    duration: '2 weeks'
  },
  {
    phase: 'Final Prep',
    title: 'Placement Season',
    icon: '🏆',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.15)',
    desc: 'Revise all topics, practice coding rounds under timed conditions, and attend campus drives with full confidence.',
    tags: ['Revision', 'Mock Tests', 'Campus Drive', 'Confidence'],
    duration: 'Ongoing'
  }
];

// ========== RESUME CHECKLIST ==========
const RESUME_CHECKLIST = [
  { key: 'contact', label: 'Contact Information (Phone, Email, LinkedIn, GitHub)', section: 'Basics', points: 5 },
  { key: 'summary', label: 'Professional Summary (2-3 lines)', section: 'Basics', points: 5 },
  { key: 'skills', label: 'Technical Skills Section', section: 'Skills', points: 8 },
  { key: 'skills_relevant', label: 'Skills are relevant to target job role', section: 'Skills', points: 5 },
  { key: 'education', label: 'Education with CGPA/Percentage', section: 'Education', points: 8 },
  { key: 'education_year', label: 'Graduation year clearly mentioned', section: 'Education', points: 3 },
  { key: 'project1', label: 'At least 1 strong project listed', section: 'Projects', points: 10 },
  { key: 'project_tech', label: 'Projects include tech stack used', section: 'Projects', points: 5 },
  { key: 'project_impact', label: 'Projects mention quantified impact', section: 'Projects', points: 7 },
  { key: 'project_link', label: 'GitHub/live link provided for projects', section: 'Projects', points: 5 },
  { key: 'certifications', label: 'Relevant certifications listed', section: 'Certifications', points: 5 },
  { key: 'internship', label: 'Internship/work experience mentioned', section: 'Experience', points: 10 },
  { key: 'achievements', label: 'Achievements/Awards section', section: 'Achievements', points: 5 },
  { key: 'coding_profiles', label: 'Coding profile links (LeetCode, HackerRank)', section: 'Extras', points: 5 },
  { key: 'one_page', label: 'Resume is exactly 1 page', section: 'Formatting', points: 5 },
  { key: 'ats_format', label: 'No tables, images, or complex formatting', section: 'Formatting', points: 5 },
  { key: 'action_verbs', label: 'Descriptions start with action verbs', section: 'Language', points: 5 },
  { key: 'no_typos', label: 'Zero spelling/grammar errors', section: 'Language', points: 5 },
  { key: 'consistent', label: 'Consistent font and formatting throughout', section: 'Formatting', points: 3 },
  { key: 'keywords', label: 'Job-relevant keywords included', section: 'ATS', points: 5 }
];

// ========== TESTIMONIALS ==========
const TESTIMONIALS = [
  {
    text: "CareerCopilot helped me crack TCS NQT on my first attempt. The aptitude practice and mock questions were spot-on with the actual exam pattern.",
    name: "Priya Sharma",
    role: "B.Tech CSE, 2024",
    company: "Placed at TCS",
    color: "#6366F1",
    avatar: "PS",
    stars: 5
  },
  {
    text: "The DSA section helped me solve problems I never thought I could. I went from knowing nothing about graphs to confidently solving BFS/DFS in 3 weeks!",
    name: "Rahul Verma",
    role: "B.Tech IT, 2024",
    company: "Placed at Infosys",
    color: "#8B5CF6",
    avatar: "RV",
    stars: 5
  },
  {
    text: "The company-specific preparation section is gold! Knowing exactly what to expect for Accenture's ATAP and pseudocode round saved me so much time.",
    name: "Anjali Krishnan",
    role: "B.Tech ECE, 2023",
    company: "Placed at Accenture",
    color: "#06B6D4",
    avatar: "AK",
    stars: 5
  },
  {
    text: "I was terrified of HR interviews. The CareerCopilot interview section with model answers gave me the confidence to face the panel and I got the offer!",
    name: "Karthik Reddy",
    role: "MCA, 2024",
    company: "Placed at Wipro",
    color: "#10B981",
    avatar: "KR",
    stars: 5
  },
  {
    text: "The AI Copilot is incredibly helpful. I could ask it any question at 2 AM when I was panicking before my interview and it gave me exactly the guidance I needed.",
    name: "Sneha Patel",
    role: "B.Tech CSE, 2024",
    company: "Placed at Cognizant",
    color: "#F59E0B",
    avatar: "SP",
    stars: 5
  },
  {
    text: "The Resume Score feature identified exactly what was missing from my resume. After fixing those issues, I started getting interview calls from companies I hadn't heard back from.",
    name: "Vikash Kumar",
    role: "B.Tech CSE, 2023",
    company: "Placed at Capgemini",
    color: "#EF4444",
    avatar: "VK",
    stars: 5
  }
];