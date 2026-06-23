/* ============================================
   CareerCopilot Chatbot Logic
   Rule-based AI assistant for placement prep
   ============================================ */

const Chatbot = {
  responses: {
    greeting: [
      "Hello! I'm your Career Copilot assistant. How can I help you with your placement preparation today?",
      "Hi there! Ready to ace your placement? I'm here to help with DSA, aptitude, interviews, and more!",
      "Welcome! Let's work together to get you placement-ready. What would you like to focus on?"
    ],
    dsa: [
      "For DSA practice, I recommend starting with easy problems and gradually moving to medium. Focus on arrays, strings, and linked lists first.",
      "DSA is all about consistency! Try solving at least one problem daily. The Coding Practice module has 40 questions organized by difficulty.",
      "Key DSA topics to master: Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and Sorting/Searching algorithms."
    ],
    aptitude: [
      "Aptitude tests typically cover quantitative, logical reasoning, and verbal sections. Practice is key to improving speed and accuracy.",
      "For quantitative aptitude, focus on percentages, ratios, time-speed-distance, and profit-loss. These are the most commonly tested topics.",
      "Logical reasoning questions test your pattern recognition. Practice series completion, coding-decoding, and puzzles regularly."
    ],
    interview: [
      "For HR interviews, prepare answers to common questions like 'Tell me about yourself' and 'Why do you want to work here?'",
      "Technical interviews focus on your project knowledge and core CS concepts. Be ready to explain your final year project in detail.",
      "Use the STAR method (Situation, Task, Action, Result) for behavioral questions to structure your answers effectively."
    ],
    resume: [
      "Keep your resume to 1 page with clear sections: Education, Skills, Projects, and Achievements. Use bullet points and quantify results.",
      "Highlight relevant skills and projects that match the job description. Tailor your resume for each company you apply to.",
      "Include keywords from the job description to pass ATS systems. Focus on achievements, not just responsibilities."
    ],
    company: [
      "Research the company before your interview. Understand their products, culture, and recent news. This shows genuine interest.",
      "For service companies like TCS, Infosys, and Wipro, focus on aptitude and basic technical concepts. They value communication skills.",
      "For product companies, DSA and system design are crucial. Practice medium-hard LeetCode problems and understand scalability concepts."
    ],
    streak: [
      "Consistency is key! Try to maintain your daily streak by spending at least 30 minutes on placement prep every day.",
      "A 7-day streak unlocks the 'Consistency King' badge. Keep going to earn more achievements!",
      "Even on busy days, spend 15-20 minutes reviewing notes or solving one problem to maintain your streak."
    ],
    motivation: [
      "Remember: Every expert was once a beginner. Keep pushing forward!",
      "Your placement journey is a marathon, not a sprint. Pace yourself and stay consistent.",
      "Believe in yourself and your preparation. You've got this!",
      "Small daily efforts lead to big results. Keep coding and learning!"
    ],
    default: [
      "I'm here to help with placement preparation. You can ask me about DSA, aptitude, interviews, resume, companies, or study tips.",
      "I can guide you through various aspects of placement prep. What specific topic would you like to know more about?",
      "Feel free to ask about coding practice, interview tips, company profiles, or study strategies!"
    ]
  },

  getIntent(message) {
    const lower = message.toLowerCase();
    
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return 'greeting';
    if (lower.includes('dsa') || lower.includes('coding') || lower.includes('algorithm') || lower.includes('data structure')) return 'dsa';
    if (lower.includes('aptitude') || lower.includes('quantitative') || lower.includes('logical') || lower.includes('verbal')) return 'aptitude';
    if (lower.includes('interview') || lower.includes('hr') || lower.includes('technical') || lower.includes('behavioral')) return 'interview';
    if (lower.includes('resume') || lower.includes('cv') || lower.includes('portfolio')) return 'resume';
    if (lower.includes('company') || lower.includes('tcs') || lower.includes('infosys') || lower.includes('wipro') || lower.includes('placement')) return 'company';
    if (lower.includes('streak') || lower.includes('consist') || lower.includes('daily')) return 'streak';
    if (lower.includes('motivat') || lower.includes('help') || lower.includes('stuck') || lower.includes('discourage')) return 'motivation';
    
    return 'default';
  },

  getResponse(message) {
    const intent = this.getIntent(message);
    const responses = this.responses[intent];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  },

  processMessage(message) {
    return this.getResponse(message);
  }
};
