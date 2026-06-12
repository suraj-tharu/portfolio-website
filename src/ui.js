// src/ui.js — All UI Interactions
// Covers: dark mode, typewriter, terminal, contact form, command palette,
//         audio synth, ambient theme, mini-game, skill progress bars, accessibility

// --- Audio Synth ---
let audioCtx;
export function playSound(type) {
  if (type === 'hover' && (!audioCtx || audioCtx.state === 'suspended')) return;
  if (!audioCtx) {
    if (type !== 'click') return;
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  if (document.body.classList.contains('a11y-reduce-motion')) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  if (type === 'hover') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
    gain.gain.setValueAtTime(0.02, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now); osc.stop(now + 0.05);
  } else if (type === 'click') {
    osc.type = 'square'; osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'type') {
    osc.type = 'triangle'; osc.frequency.setValueAtTime(300 + Math.random() * 200, now);
    gain.gain.setValueAtTime(0.03, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now); osc.stop(now + 0.05);
  }
}

export function initUI() {
  // --- Preloader ---
  window.addEventListener('load', () => {
    const p = document.getElementById('preloader');
    if (p) { p.style.opacity = '0'; setTimeout(() => p.remove(), 700); }
  });

  // --- Live Clock & Greeting ---
  function updateTimeAndGreeting() {
    const now = new Date();
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) {
      const hour = now.getHours();
      if (hour < 12) greetingEl.textContent = 'Good morning';
      else if (hour < 17) greetingEl.textContent = 'Good afternoon';
      else greetingEl.textContent = 'Good evening';
    }
    const clockEl = document.getElementById('live-clock');
    if (clockEl) clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }
  updateTimeAndGreeting();
  setInterval(updateTimeAndGreeting, 1000);

  // --- Dark Mode Toggle & Persistence ---
  const dmToggle = document.getElementById('dark-toggle');
  const html = document.documentElement;
  const moonIcon = document.getElementById('icon-moon');
  const sunIcon = document.getElementById('icon-sun');
  function updateIcons(isDark) {
    if (isDark) { moonIcon?.classList.add('hidden'); sunIcon?.classList.remove('hidden'); }
    else { moonIcon?.classList.remove('hidden'); sunIcon?.classList.add('hidden'); }
  }
  
  // Initialize dark mode from localStorage or system preference
  const isDarkMode = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDarkMode) html.classList.add('dark');
  else html.classList.remove('dark');
  updateIcons(isDarkMode);

  dmToggle?.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDarkNow = html.classList.contains('dark');
    localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
    updateIcons(isDarkNow);
  });

  // --- Mobile Menu ---
  const mobBtn = document.getElementById('mob-btn');
  const mobMenu = document.getElementById('mob-menu');
  mobBtn?.addEventListener('click', () => mobMenu?.classList.toggle('hidden'));

  // --- Typewriter Effect ---
  const phrases = ['GIS Expert.', 'Remote Sensing Analyst.', 'Python Programmer.', 'ML Researcher.'];
  let phraseIdx = 0, charIdx = 0, isDeleting = false;
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const type = () => {
      const currentPhrase = phrases[phraseIdx];
      if (isDeleting) { typewriterElement.textContent = currentPhrase.substring(0, charIdx - 1); charIdx--; }
      else { typewriterElement.textContent = currentPhrase.substring(0, charIdx + 1); charIdx++; }
      let typeSpeed = isDeleting ? 50 : 100;
      if (!isDeleting && charIdx === currentPhrase.length) { typeSpeed = 2000; isDeleting = true; }
      else if (isDeleting && charIdx === 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; typeSpeed = 500; }
      setTimeout(type, typeSpeed);
    };
    setTimeout(type, 1000);
  }

  // --- Custom Cursor (GSAP-powered for buttery smoothness) ---
  const curDot = document.getElementById('cur-dot');
  const curRing = document.getElementById('cur-ring');
  if (curDot && curRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    if (typeof gsap !== 'undefined') {
      const dotX = gsap.quickTo(curDot, 'x', { duration: 0.1, ease: 'power3' });
      const dotY = gsap.quickTo(curDot, 'y', { duration: 0.1, ease: 'power3' });
      const ringX = gsap.quickTo(curRing, 'x', { duration: 0.5, ease: 'power3' });
      const ringY = gsap.quickTo(curRing, 'y', { duration: 0.5, ease: 'power3' });

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        dotX(mouseX - 3); dotY(mouseY - 3);
        ringX(mouseX - 18); ringY(mouseY - 18);
      });

      // Scale ring on hoverable elements
      document.querySelectorAll('a, button, .project-card, [data-cursor-hover]').forEach(el => {
        el.addEventListener('mouseenter', () => {
          gsap.to(curRing, { scale: 2, duration: 0.3, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(curRing, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
      });
    } else {
      document.addEventListener('mousemove', (e) => {
        curDot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
        curRing.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
      });
    }
  } else if (curDot && curRing) {
    curDot.style.display = 'none';
    curRing.style.display = 'none';
  }

  // --- Progress Bar (works with both Lenis and native scroll) ---
  function updateProgressBar() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) progressBar.style.width = scrolled + '%';
  }
  window.addEventListener('scroll', updateProgressBar, { passive: true });

  // --- Interactive Terminal ---
  const termIn = document.getElementById('term-in');
  const termOut = document.getElementById('term-output');
  if (termIn && termOut) {
    termIn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = termIn.value.trim();
        if (cmd) {
          const cmdDiv = document.createElement('div');
          const cmdSpan = document.createElement('span');
          cmdSpan.className = 'text-slate-400';
          cmdSpan.textContent = `❯ ${cmd}`;
          cmdDiv.appendChild(cmdSpan);
          termOut.appendChild(cmdDiv);
          let out = '';
          if (cmd === 'help') out = 'Commands: whoami, skills, research, contact, clear';
          else if (cmd === 'clear') { termOut.innerHTML = ''; termIn.value = ''; return; }
          else if (cmd === 'whoami') out = 'Suraj Tharu Chaudhary — GIS & Remote Sensing Expert, Nepal';
          else if (cmd === 'skills') out = 'QGIS, ArcGIS, GEE, Python, R, Random Forest, LULC Analysis';
          else if (cmd === 'research') out = 'LULC Birendranagar (2024) | LULC Nawalparasi (2025) | Earthquake Analyzer (2024)';
          else if (cmd === 'contact') out = 'Use the contact form below or navigate to #contact';
          else if (cmd === 'connect usb') {
            if (navigator.usb) { navigator.usb.requestDevice({ filters: [] }).catch(e => console.log(e)); out = 'Scanning for WebUSB devices...'; }
            else out = 'WebUSB not supported in this browser.';
          } else if (cmd === 'connect bt') {
            if (navigator.bluetooth) { navigator.bluetooth.requestDevice({ acceptAllDevices: true }).catch(e => console.log(e)); out = 'Scanning for Web Bluetooth devices...'; }
            else out = 'Web Bluetooth not supported in this browser.';
          } else out = `Command not found: ${cmd}. Type 'help'.`;
          if (out) { const outDiv = document.createElement('div'); outDiv.textContent = out; termOut.appendChild(outDiv); }
          termOut.scrollTop = termOut.scrollHeight;
        }
        termIn.value = '';
      }
    });
  }

  // --- Service Worker (PWA) ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }


  const monacoContainer = document.getElementById('monaco-container');
  if (monacoContainer && typeof require !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
        require(['vs/editor/editor.main'], function () {
          window.editor = monaco.editor.create(monacoContainer, {
            value: ['# GEE Python API Example', 'import ee', 'ee.Initialize()', '', 'image = ee.Image("LANDSAT/LC08/C02/T1_L2/LC08_199041_20230601")', 'ndvi = image.normalizedDifference(["SR_B5", "SR_B4"])', 'print(ndvi.getInfo())'].join('\n'),
            language: 'python',
            theme: document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs',
            minimap: { enabled: false }, fontSize: 12, scrollBeyondLastLine: false
          });
          document.getElementById('dark-toggle')?.addEventListener('click', () => {
            setTimeout(() => monaco.editor.setTheme(document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs'), 50);
          });
        });
      }
    });
    observer.observe(monacoContainer);
  }
  window.runCode = function () {
    const out = document.getElementById('monaco-output');
    if (out) { out.innerHTML += `<br/><span class="text-white">❯ python gee_script.py</span><br/><span class="text-yellow-400">[Info] Authenticating with Earth Engine...</span><br/>[Info] NDVI computed successfully. Values: -0.04 to 0.82`; out.scrollTop = out.scrollHeight; }
  };

  // --- GitHub Feed & Calendar ---
  async function fetchGitHub() {
    const feed = document.getElementById('gh-feed');
    if (!feed) return;
    try {
      const res = await fetch('https://api.github.com/users/surajtharu/events/public?per_page=5');
      if (!res.ok) throw new Error('API limit');
      const events = await res.json();
      if (!events || events.length === 0) { feed.innerHTML = '<div>No recent activity found.</div>'; return; }
      feed.innerHTML = '';
      events.forEach(ev => {
        let actionText = ev.type;
        if (ev.type === 'PushEvent') actionText = `Pushed to ${ev.repo.name}`;
        else if (ev.type === 'CreateEvent') actionText = `Created ${ev.payload.ref_type} in ${ev.repo.name}`;
        else if (ev.type === 'WatchEvent') actionText = `Starred ${ev.repo.name}`;
        const div = document.createElement('div');
        div.className = 'flex gap-2 items-center';
        const arrow = document.createElement('span'); arrow.className = 'text-brand-500'; arrow.textContent = '→';
        const text = document.createElement('span'); text.className = 'truncate'; text.textContent = actionText;
        div.appendChild(arrow); div.appendChild(text);
        feed.appendChild(div);
      });
    } catch (err) {
      if (feed) feed.innerHTML = '<div class="text-slate-400">GitHub activity unavailable (API rate limit).</div>';
    }
  }
  fetchGitHub();

  if (typeof GitHubCalendar !== 'undefined') {
    try {
      GitHubCalendar(".calendar", "surajtharu", { responsive: true, global_stats: false });
    } catch (e) {
      console.warn('GitHub Calendar failed to load', e);
    }
  }

  // --- Project Filtering & Search ---
  const projectSearch = document.getElementById('project-search');
  const projectFilter = document.getElementById('project-filter');
  const projectCards = document.querySelectorAll('.project-card');

  function filterProjects() {
    if (!projectSearch || !projectFilter || projectCards.length === 0) return;
    const query = projectSearch.value.toLowerCase();
    const filter = projectFilter.value.toLowerCase();
    
    projectCards.forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const tags = card.getAttribute('data-tags') || '';
      const matchesSearch = title.includes(query) || tags.includes(query);
      const matchesFilter = filter === 'all' || tags.includes(filter);
      
      if (matchesSearch && matchesFilter) {
        card.style.display = 'block';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  }

  projectSearch?.addEventListener('input', filterProjects);
  projectFilter?.addEventListener('change', filterProjects);

  // --- Global Hover Lift ---
  document.querySelectorAll('.rounded-xl.border, .rounded-lg.border').forEach(el => {
    if (el.id !== 'chat-widget') el.classList.add('hover-lift');
  });

  // --- Ambient Theming ---
  function updateAmbientLight() {
    const hour = new Date().getHours();
    let color = 'transparent';
    if (hour >= 5 && hour < 8) color = 'rgba(252, 211, 77, 0.04)';
    else if (hour >= 18 && hour < 20) color = 'rgba(244, 63, 94, 0.04)';
    else if (hour >= 20 || hour < 5) color = 'rgba(56, 189, 248, 0.02)';
    let overlay = document.getElementById('ambient-light');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'ambient-light';
      overlay.className = 'fixed inset-0 pointer-events-none z-[-1] mix-blend-screen transition-colors duration-1000';
      document.body.appendChild(overlay);
    }
    overlay.style.backgroundColor = color;
  }
  setInterval(updateAmbientLight, 60000);
  updateAmbientLight();

  // --- Command Palette ---
  const cmdPalette = document.getElementById('cmd-palette');
  const cmdBackdrop = document.getElementById('cmd-backdrop');
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');
  if (cmdPalette && cmdInput && cmdResults) {
    const commands = [
      { title: 'Toggle Dark Mode', icon: '🌙', action: () => document.getElementById('dark-toggle')?.click() },
      { title: 'Navigate: About', icon: '👤', action: () => { window.location.hash = '#about'; } },
      { title: 'Navigate: Projects', icon: '🔭', action: () => { window.location.hash = '#projects'; } },
      { title: 'Navigate: Skills', icon: '🛠️', action: () => { window.location.hash = '#skills'; } },
      { title: 'Navigate: Contact', icon: '📬', action: () => { window.location.hash = '#contact'; } },
      { title: 'Open Admin Panel', icon: '⚙️', action: () => { window.location.href = '/admin'; } },
      { title: 'Download Resume', icon: '📄', action: () => { playSound('click'); window.open('./Suraj_Tharu_CV.pdf', '_blank'); } },
      { title: 'Open AI Assistant', icon: '🤖', action: () => window.toggleChat?.() },
      { title: 'Accessibility Settings', icon: '👁️', action: () => document.getElementById('a11y-toggle')?.click() }
    ];
    const toggleCmdPalette = () => {
      if (cmdPalette.classList.contains('hidden')) {
        cmdPalette.classList.remove('hidden'); cmdPalette.classList.add('flex');
        cmdInput.value = ''; cmdInput.focus(); renderCmdResults('');
      } else {
        cmdPalette.classList.add('hidden'); cmdPalette.classList.remove('flex');
      }
    };
    const renderCmdResults = (query) => {
      const filtered = commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));
      cmdResults.innerHTML = filtered.map((c, i) => `
        <div class="cmd-item flex items-center gap-3 px-4 py-3 hover:bg-brand-500/10 dark:hover:bg-brand-500/20 cursor-pointer rounded-lg text-sm dark:text-slate-300 transition-colors" data-idx="${i}">
          <span class="text-xl">${c.icon}</span><span>${c.title}</span>
        </div>`).join('');
      document.querySelectorAll('.cmd-item').forEach(el => {
        el.addEventListener('mouseenter', () => playSound('hover'));
        el.addEventListener('click', () => { playSound('click'); commands[el.dataset.idx].action(); toggleCmdPalette(); });
      });
    };
    document.getElementById('open-cmd')?.addEventListener('click', toggleCmdPalette);
    cmdBackdrop?.addEventListener('click', toggleCmdPalette);
    document.getElementById('cmd-close')?.addEventListener('click', toggleCmdPalette);
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); toggleCmdPalette(); }
      if (e.key === 'Escape' && !cmdPalette.classList.contains('hidden')) toggleCmdPalette();
    });
    cmdInput.addEventListener('input', (e) => renderCmdResults(e.target.value));
  }

  // --- Accessibility ---
  document.getElementById('a11y-toggle')?.addEventListener('click', () => {
    const menu = document.getElementById('a11y-menu');
    menu?.classList.toggle('hidden'); menu?.classList.toggle('flex');
  });
  document.getElementById('a11y-motion')?.addEventListener('change', (e) => document.body.classList.toggle('a11y-reduce-motion', e.target.checked));
  document.getElementById('a11y-contrast')?.addEventListener('change', (e) => document.body.classList.toggle('a11y-high-contrast', e.target.checked));
  document.getElementById('a11y-font')?.addEventListener('change', (e) => document.body.classList.toggle('a11y-dyslexia', e.target.checked));

  // --- Contact Modal ---
  const initConnBtn = document.getElementById('init-conn-btn');
  const contactModal = document.getElementById('contact-modal');
  const closeContact = document.getElementById('close-contact');
  const contactBackdrop = document.getElementById('contact-backdrop');
  const contactBox = document.getElementById('contact-box');
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  const openContactModal = () => {
    contactModal?.classList.remove('hidden'); contactModal?.classList.add('flex');
    setTimeout(() => { contactBox?.classList.remove('scale-95', 'opacity-0'); contactBox?.classList.add('scale-100', 'opacity-100'); document.getElementById('c-name')?.focus(); }, 10);
  };
  const closeContactModal = () => {
    contactBox?.classList.remove('scale-100', 'opacity-100'); contactBox?.classList.add('scale-95', 'opacity-0');
    setTimeout(() => { contactModal?.classList.add('hidden'); contactModal?.classList.remove('flex'); contactStatus?.classList.add('hidden'); contactForm?.reset(); }, 300);
  };
  initConnBtn?.addEventListener('click', () => { playSound('click'); openContactModal(); });
  closeContact?.addEventListener('click', closeContactModal);
  contactBackdrop?.addEventListener('click', closeContactModal);
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('c-name').value,
      email: document.getElementById('c-email').value,
      subject: document.getElementById('c-subject').value,
      message: document.getElementById('c-msg').value,
      honeypot: document.getElementById('c-hp').value
    };
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.innerText = 'Transmitting...'; submitBtn.disabled = true;
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (response.ok) {
        contactStatus.innerText = 'Message transmitted successfully.';
        contactStatus.className = 'mt-4 text-center font-bold text-green-400';
        contactForm.reset(); setTimeout(closeContactModal, 2000);
      } else { throw new Error('Transmission failed'); }
    } catch (error) {
      contactStatus.innerText = 'Error: Transmission failed.';
      contactStatus.className = 'mt-4 text-center font-bold text-red-500';
    } finally {
      contactStatus?.classList.remove('hidden'); submitBtn.innerText = 'Execute Send'; submitBtn.disabled = false;
    }
  });

  // --- Mini-Game ---
  const playBtn = document.getElementById('play-resume');
  const gameModal = document.getElementById('game-modal');
  const gameCanvas = document.getElementById('game-canvas');
  const gameOverlay = document.getElementById('game-overlay');
  const startGameBtn = document.getElementById('start-game-btn');
  const closeGame = document.getElementById('close-game');
  const scoreEl = document.getElementById('game-score');
  let gameCtx, gameLoopId, gameScore = 0;
  let player, fallingItems = [];
  const skillsList = ['GIS', 'QGIS', 'Python', 'GEE', 'React', 'LULC', 'ML'];
  if (playBtn && gameCanvas) {
    gameCtx = gameCanvas.getContext('2d');
    playBtn.addEventListener('click', () => { playSound('click'); gameModal?.classList.remove('hidden'); gameModal?.classList.add('flex'); gameOverlay?.classList.remove('hidden'); });
    closeGame?.addEventListener('click', () => { gameModal?.classList.add('hidden'); gameModal?.classList.remove('flex'); cancelAnimationFrame(gameLoopId); });
    startGameBtn?.addEventListener('click', () => { gameOverlay?.classList.add('hidden'); resetGame(); gameLoopId = requestAnimationFrame(gameLoop); });
    const keys = {};
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);
    const resetGame = () => { gameScore = 0; if (scoreEl) scoreEl.innerText = gameScore; player = { x: 275, y: 350, w: 50, h: 20, speed: 6 }; fallingItems = []; };
    const gameLoop = () => {
      gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
      if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
      if (keys['ArrowRight'] && player.x < gameCanvas.width - player.w) player.x += player.speed;
      gameCtx.fillStyle = '#0ea5e9'; gameCtx.fillRect(player.x, player.y, player.w, player.h);
      if (Math.random() < 0.02) fallingItems.push({ x: Math.random() * (gameCanvas.width - 40), y: 0, text: skillsList[Math.floor(Math.random() * skillsList.length)], speed: 2 + Math.random() * 2 });
      for (let i = fallingItems.length - 1; i >= 0; i--) {
        let item = fallingItems[i]; item.y += item.speed;
        gameCtx.fillStyle = '#38bdf8'; gameCtx.font = '14px monospace'; gameCtx.fillText(item.text, item.x, item.y);
        if (item.y > player.y && item.y < player.y + player.h && item.x > player.x - 30 && item.x < player.x + player.w) { gameScore += 10; if (scoreEl) scoreEl.innerText = gameScore; playSound('click'); fallingItems.splice(i, 1); continue; }
        if (item.y > gameCanvas.height) fallingItems.splice(i, 1);
      }
      gameLoopId = requestAnimationFrame(gameLoop);
    };
  }

  // --- Konami Code Easter Egg (Matrix Rain) ---
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIdx = 0;
  window.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiCode.length) {
        konamiIdx = 0;
        triggerMatrixRain();
      }
    } else {
      konamiIdx = 0;
    }
  });

  function triggerMatrixRain() {
    playSound('click');
    const c = document.createElement('canvas');
    c.style.position = 'fixed'; c.style.top = '0'; c.style.left = '0'; c.style.width = '100vw'; c.style.height = '100vh';
    c.style.zIndex = '99999'; c.style.pointerEvents = 'none'; c.style.opacity = '0.8';
    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const font_size = 14;
    const columns = c.width / font_size;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#0F0';
      ctx.font = font_size + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * font_size, drops[i] * font_size);
        if (drops[i] * font_size > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    const rainInt = setInterval(draw, 33);
    setTimeout(() => { clearInterval(rainInt); c.style.transition = 'opacity 2s'; c.style.opacity = '0'; setTimeout(() => c.remove(), 2000); }, 10000);
  }

  // --- Mobile Gestures (Swipe to close contact modal) ---
  let touchstartY = 0;
  let touchendY = 0;
  contactBox?.addEventListener('touchstart', e => { touchstartY = e.changedTouches[0].screenY; }, {passive: true});
  contactBox?.addEventListener('touchend', e => {
    touchendY = e.changedTouches[0].screenY;
    if (touchendY - touchstartY > 100) closeContactModal(); // Swipe down to close
  }, {passive: true});

  // --- Audio hooks & Magnetic Buttons ---
  document.querySelectorAll('a, button, .hover-lift, .magnetic').forEach(el => {
    el.addEventListener('mouseenter', () => playSound('hover'));
    el.addEventListener('click', () => playSound('click'));
  });
  
  // Magnetic effect logic
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  document.getElementById('term-in')?.addEventListener('keydown', () => playSound('type'));
  document.getElementById('cmd-input')?.addEventListener('keydown', () => playSound('type'));
  document.getElementById('chat-input')?.addEventListener('keydown', () => playSound('type'));

  // --- Visitor Counter ---
  const visitEl = document.getElementById('visit-count');
  if (visitEl && typeof io !== 'undefined') {
    const socket = io();
    visitEl.textContent = '...';
    socket.on('user-joined', (data) => {
      visitEl.textContent = data.count || '0';
    });
    socket.on('user-left', (data) => {
      visitEl.textContent = data.count || '0';
    });
    socket.on('current-users', (users) => {
      visitEl.textContent = users.length.toString();
    });
  }

  // --- Logic Gate Simulator ---
  const inA = document.getElementById('gate-in-a');
  const inB = document.getElementById('gate-in-b');
  const outGate = document.getElementById('gate-out');
  function updateGate() {
    if (!inA || !inB || !outGate) return;
    const res = inA.checked && inB.checked;
    outGate.innerText = res ? '1' : '0';
    outGate.className = res
      ? 'w-12 h-12 rounded-full border-4 border-green-400 bg-green-400/20 shadow-[0_0_15px_rgba(74,222,128,0.5)] flex items-center justify-center transition-all text-green-400 font-bold'
      : 'w-12 h-12 rounded-full border-4 border-slate-300 dark:border-slate-600 flex items-center justify-center transition-all dark:text-white font-bold';
    if (res) playSound('click');
  }
  inA?.addEventListener('change', updateGate);
  inB?.addEventListener('change', updateGate);

  // --- QR Codes ---
  setTimeout(() => {
    if (typeof QRCode !== 'undefined') {
      const qr1 = document.getElementById('qr-1');
      const qr2 = document.getElementById('qr-2');
      if (qr1) new QRCode(qr1, { text: 'https://coursera.org/verify/example', width: 56, height: 56, colorDark: '#0f172a', colorLight: '#ffffff' });
      if (qr2) new QRCode(qr2, { text: 'https://aws.amazon.com/verification', width: 56, height: 56, colorDark: '#0f172a', colorLight: '#ffffff' });
    }
  }, 1000);
}
