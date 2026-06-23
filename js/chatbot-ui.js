/* ============================================
   CareerCopilot Chatbot UI
   Handles chatbot widget UI interactions
   ============================================ */

(function(){
  let isOpen = false;
  let messages = [];

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'chatbot-toggle';
  toggleBtn.innerHTML = '<span class="icon-chat">💬</span><span class="icon-close">✕</span>';
  toggleBtn.setAttribute('aria-label', 'Toggle chatbot');
  document.body.appendChild(toggleBtn);

  const chatWindow = document.createElement('div');
  chatWindow.className = 'chatbot-window';
  chatWindow.innerHTML = `
    <div class="chatbot-header">
      <div class="chatbot-avatar">🤖</div>
      <div class="chatbot-header-info">
        <div class="chatbot-name">Career Copilot</div>
        <div class="chatbot-status">
          <span class="chatbot-status-dot"></span>
          Online
        </div>
      </div>
      <div class="chatbot-header-actions">
        <button class="chatbot-header-btn" aria-label="Clear chat">🗑️</button>
      </div>
    </div>
    <div class="chatbot-messages">
      <div class="chatbot-welcome">
        <strong>👋 Hi there! I'm your Career Copilot</strong>
        <ul>
          <li>Ask about DSA practice</li>
          <li>Get interview tips</li>
          <li>Resume guidance</li>
          <li>Company insights</li>
          <li>Study strategies</li>
        </ul>
      </div>
    </div>
    <div class="chatbot-suggestions">
      <button class="suggestion-chip">How to start DSA?</button>
      <button class="suggestion-chip">Interview tips</button>
      <button class="suggestion-chip">Resume help</button>
    </div>
    <div class="chatbot-input-area">
      <div class="chatbot-input-row">
        <textarea class="chatbot-input" placeholder="Type your question..." rows="1"></textarea>
        <button class="chatbot-send" aria-label="Send message">➤</button>
      </div>
      <div class="chatbot-footer-hint">Press Enter to send</div>
    </div>
  `;
  document.body.appendChild(chatWindow);

  const messagesContainer = chatWindow.querySelector('.chatbot-messages');
  const input = chatWindow.querySelector('.chatbot-input');
  const sendBtn = chatWindow.querySelector('.chatbot-send');
  const clearBtn = chatWindow.querySelector('.chatbot-header-btn');
  const suggestions = chatWindow.querySelectorAll('.suggestion-chip');

  function toggleChatbot() {
    isOpen = !isOpen;
    toggleBtn.classList.toggle('open', isOpen);
    chatWindow.classList.toggle('open', isOpen);
    if (isOpen) {
      input.focus();
    }
  }

  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
      <div class="message-avatar">${isUser ? '👤' : '🤖'}</div>
      <div class="message-bubble">
        ${text}
        <div class="message-time">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    messages.push({ text, isUser, time });
  }

  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing';
    typingDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return typingDiv;
  }

  function removeTyping(typingElement) {
    if (typingElement && typingElement.parentNode) {
      typingElement.remove();
    }
  }

  function sendMessage(text) {
    if (!text || !text.trim()) return;
    
    addMessage(text, true);
    input.value = '';
    
    const typing = showTyping();
    
    setTimeout(() => {
      removeTyping(typing);
      if (typeof Chatbot !== 'undefined') {
        const response = Chatbot.processMessage(text);
        addMessage(response, false);
      } else {
        addMessage("I'm loading... Please try again in a moment.", false);
      }
    }, 800 + Math.random() * 500);
  }

  function handleSend() {
    const text = input.value.trim();
    if (text) {
      sendMessage(text);
    }
  }

  toggleBtn.addEventListener('click', toggleChatbot);

  sendBtn.addEventListener('click', handleSend);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  clearBtn.addEventListener('click', () => {
    const welcome = messagesContainer.querySelector('.chatbot-welcome');
    messagesContainer.innerHTML = '';
    if (welcome) {
      messagesContainer.appendChild(welcome);
    }
    messages = [];
  });

  suggestions.forEach(chip => {
    chip.addEventListener('click', () => {
      if (!isOpen) toggleChatbot();
      sendMessage(chip.textContent);
    });
  });

  window.ChatbotUI = {
    toggle: toggleChatbot,
    isOpen: () => isOpen
  };
})();
