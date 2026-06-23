/* ============================================
   CareerCopilot Aptitude Quiz Logic
   Quantitative, logical, and verbal practice
   ============================================ */

(function(){
  let currentCategory = 'quantitative';
  let currentQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let answered = false;

  document.addEventListener('DOMContentLoaded', initAptitudePage);

  function initAptitudePage() {
    updateStats();
    initTabs();
  }

  function updateStats() {
    const total = AptitudeState.getScores();
    const totalAttempted = total.quantitative.total + total.logical.total + total.verbal.total;
    
    const quantScore = AptitudeState.getAccuracy('quantitative');
    const logicalScore = AptitudeState.getAccuracy('logical');
    const verbalScore = AptitudeState.getAccuracy('verbal');

    const totalEl = document.getElementById('aptitude-total');
    const quantEl = document.getElementById('quant-score');
    const logicalEl = document.getElementById('logical-score');
    const verbalEl = document.getElementById('verbal-score');

    if (totalEl) totalEl.textContent = totalAttempted;
    if (quantEl) quantEl.textContent = quantScore + '%';
    if (logicalEl) logicalEl.textContent = logicalScore + '%';
    if (verbalEl) verbalEl.textContent = verbalScore + '%';
  }

  function initTabs() {
    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category;
      });
    });
  }

  window.startQuiz = function() {
    currentQuestions = [...APTITUDE_QUESTIONS[currentCategory]].sort(() => Math.random() - 0.5).slice(0, 10);
    currentIndex = 0;
    score = 0;
    answered = false;

    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-question').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';

    showQuestion();
  };

  function showQuestion() {
    const question = currentQuestions[currentIndex];
    answered = false;

    document.getElementById('question-number').textContent = `Question ${currentIndex + 1}/${currentQuestions.length}`;
    document.getElementById('category-label').textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('explanation').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = question.options.map((opt, idx) => `
      <button class="btn btn-outline btn-block option-btn" data-index="${idx}" onclick="selectOption(${idx})">
        ${opt}
      </button>
    `).join('');
  }

  window.selectOption = function(index) {
    if (answered) return;
    answered = true;

    const question = currentQuestions[currentIndex];
    const isCorrect = index === question.answer;
    const buttons = document.querySelectorAll('.option-btn');

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === question.answer) {
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-success');
      } else if (idx === index && !isCorrect) {
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-danger');
      }
    });

    if (isCorrect) {
      score++;
      AptitudeState.recordAnswer(currentCategory, true);
      CCToast('Correct! +5 XP', 'success');
    } else {
      AptitudeState.recordAnswer(currentCategory, false);
      CCToast('Incorrect. Keep practicing!', 'error');
    }

    document.getElementById('explanation-text').textContent = question.explanation;
    document.getElementById('explanation').style.display = 'block';
    document.getElementById('next-btn').style.display = 'inline-flex';

    updateStats();
  };

  window.nextQuestion = function() {
    currentIndex++;
    if (currentIndex < currentQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  };

  function showResult() {
    document.getElementById('quiz-question').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('final-score').textContent = `${score}/${currentQuestions.length}`;
    
    UserProfile.updateStreak();
  }

  window.endQuiz = function() {
    if (currentIndex > 0) {
      showResult();
    } else {
      resetQuiz();
    }
  };

  window.resetQuiz = function() {
    document.getElementById('quiz-start').style.display = 'block';
    document.getElementById('quiz-question').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'none';
  };

  window.AptitudePage = {
    refresh: initAptitudePage
  };
})();
