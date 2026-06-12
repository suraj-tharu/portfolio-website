// src/chat.js — AI Chat Assistant + Voice Input

export function initChat() {
  const chatHistory = [];
  const chatBtn = document.getElementById('chat-btn');
  const chatWidget = document.getElementById('chat-widget');
  const closeChat = document.getElementById('close-chat');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  if (!chatBtn || !chatWidget || !chatInput || !chatMessages) return;

  const chatIcon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>';
  const closeIcon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';

  function toggleChat() {
    chatWidget.classList.toggle('open');
    if (chatWidget.classList.contains('open')) {
      chatBtn.innerHTML = closeIcon;
      chatBtn.classList.add('bg-slate-700', 'hover:bg-slate-600');
      chatBtn.classList.remove('bg-brand-500', 'hover:bg-brand-400');
      chatInput.focus();
    } else {
      chatBtn.innerHTML = chatIcon;
      chatBtn.classList.remove('bg-slate-700', 'hover:bg-slate-600');
      chatBtn.classList.add('bg-brand-500', 'hover:bg-brand-400');
    }
  }

  chatBtn.addEventListener('click', toggleChat);
  if (closeChat) closeChat.addEventListener('click', () => { if (chatWidget.classList.contains('open')) toggleChat(); });

  // Context-aware scrolling
  let currentContext = 'Hero Section';
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    let current = '';
    sections.forEach(section => {
      if (window.pageYOffset >= section.offsetTop - 200) current = section.getAttribute('id') || current;
    });
    if (current) currentContext = current;
  });

  let isVoiceMode = false;

  chatInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && chatInput.value.trim() !== '') {
      const msg = chatInput.value.trim();
      chatInput.value = '';
      chatInput.disabled = true;

      const userMsgDiv = document.createElement('div');
      userMsgDiv.className = 'bg-brand-500 text-white p-3 rounded-xl rounded-tr-sm self-end max-w-[85%] chat-msg';
      userMsgDiv.textContent = msg;
      chatMessages.appendChild(userMsgDiv);

      const typingId = 'typing-' + Date.now();
      chatMessages.insertAdjacentHTML('beforeend', `<div id="${typingId}" class="bg-slate-200 dark:bg-slate-800 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] chat-msg dark:text-slate-400 text-slate-500 text-xs flex items-center gap-1">
        <span class="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style="animation-delay: 0s"></span>
        <span class="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
        <span class="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
      </div>`);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      chatHistory.push({ role: 'user', content: msg });
      if (chatHistory.length > 20) chatHistory.splice(0, 2);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg, context: currentContext, history: chatHistory.slice(0, -1) })
        });
        const data = await res.json();
        document.getElementById(typingId)?.remove();

        if (data.reply) {
          chatHistory.push({ role: 'assistant', content: data.reply });
          const botMsgDiv = document.createElement('div');
          botMsgDiv.className = 'bg-slate-200 dark:bg-slate-800 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] chat-msg dark:text-slate-200 text-slate-800';
          botMsgDiv.textContent = data.reply;
          chatMessages.appendChild(botMsgDiv);
          if (isVoiceMode) {
            const speech = new SpeechSynthesisUtterance(data.reply);
            window.speechSynthesis.speak(speech);
          }
        } else {
          const errorDiv = document.createElement('div');
          errorDiv.className = 'bg-red-500/10 text-red-500 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] chat-msg text-xs';
          errorDiv.textContent = data.error || 'Server error';
          chatMessages.appendChild(errorDiv);
        }
      } catch (error) {
        console.error(error);
        document.getElementById(typingId)?.remove();
        const connErrorDiv = document.createElement('div');
        connErrorDiv.className = 'bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] chat-msg text-xs';
        connErrorDiv.textContent = 'Error connecting to AI Server.';
        chatMessages.appendChild(connErrorDiv);
      }

      chatInput.disabled = false;
      chatInput.focus();
      chatMessages.scrollTop = chatMessages.scrollHeight;
      isVoiceMode = false;
    }
  });

  // Voice Input
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const voiceBtn = document.getElementById('voice-btn');
  if (SpeechRecognition && voiceBtn) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;

    voiceBtn.addEventListener('click', () => {
      isVoiceMode = true;
      try {
        recognition.start();
        voiceBtn.classList.add('text-brand-500', 'animate-pulse');
      } catch (e) { console.warn('SpeechRecognition error:', e); }
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      voiceBtn.classList.remove('text-brand-500', 'animate-pulse');
      chatInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
    };

    recognition.onend = () => voiceBtn.classList.remove('text-brand-500', 'animate-pulse');
  } else if (voiceBtn) {
    voiceBtn.style.display = 'none';
  }

  // Expose toggleChat for command palette
  window.toggleChat = toggleChat;
}
