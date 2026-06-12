(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/ui.js
  var audioCtx;
  function playSound(type) {
    if (type === "hover" && (!audioCtx || audioCtx.state === "suspended")) return;
    if (!audioCtx) {
      if (type !== "click") return;
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return;
      }
    }
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {
    });
    if (document.body.classList.contains("a11y-reduce-motion")) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    if (type === "hover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "click") {
      osc.type = "square";
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "type") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300 + Math.random() * 200, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  }
  function initUI() {
    window.addEventListener("load", () => {
      const p = document.getElementById("preloader");
      if (p) {
        p.style.opacity = "0";
        setTimeout(() => p.remove(), 700);
      }
    });
    function updateTimeAndGreeting() {
      const now = /* @__PURE__ */ new Date();
      const greetingEl = document.getElementById("greeting");
      if (greetingEl) {
        const hour = now.getHours();
        if (hour < 12) greetingEl.textContent = "Good morning";
        else if (hour < 17) greetingEl.textContent = "Good afternoon";
        else greetingEl.textContent = "Good evening";
      }
      const clockEl = document.getElementById("live-clock");
      if (clockEl) clockEl.textContent = now.toLocaleTimeString("en-US", { hour12: false });
    }
    updateTimeAndGreeting();
    setInterval(updateTimeAndGreeting, 1e3);
    const dmToggle = document.getElementById("dark-toggle");
    const html = document.documentElement;
    const moonIcon = document.getElementById("icon-moon");
    const sunIcon = document.getElementById("icon-sun");
    function updateIcons(isDark) {
      if (isDark) {
        moonIcon?.classList.add("hidden");
        sunIcon?.classList.remove("hidden");
      } else {
        moonIcon?.classList.remove("hidden");
        sunIcon?.classList.add("hidden");
      }
    }
    const isDarkMode = localStorage.getItem("theme") === "dark" || !("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDarkMode) html.classList.add("dark");
    else html.classList.remove("dark");
    updateIcons(isDarkMode);
    dmToggle?.addEventListener("click", () => {
      html.classList.toggle("dark");
      const isDarkNow = html.classList.contains("dark");
      localStorage.setItem("theme", isDarkNow ? "dark" : "light");
      updateIcons(isDarkNow);
    });
    const mobBtn = document.getElementById("mob-btn");
    const mobMenu = document.getElementById("mob-menu");
    mobBtn?.addEventListener("click", () => mobMenu?.classList.toggle("hidden"));
    const phrases = ["GIS Expert.", "Remote Sensing Analyst.", "Python Programmer.", "ML Researcher."];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;
    const typewriterElement = document.getElementById("typewriter");
    if (typewriterElement) {
      const type = () => {
        const currentPhrase = phrases[phraseIdx];
        if (isDeleting) {
          typewriterElement.textContent = currentPhrase.substring(0, charIdx - 1);
          charIdx--;
        } else {
          typewriterElement.textContent = currentPhrase.substring(0, charIdx + 1);
          charIdx++;
        }
        let typeSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && charIdx === currentPhrase.length) {
          typeSpeed = 2e3;
          isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
      };
      setTimeout(type, 1e3);
    }
    const curDot = document.getElementById("cur-dot");
    const curRing = document.getElementById("cur-ring");
    if (curDot && curRing && window.matchMedia("(pointer: fine)").matches) {
      let mouseX = 0, mouseY = 0;
      if (typeof gsap !== "undefined") {
        const dotX = gsap.quickTo(curDot, "x", { duration: 0.1, ease: "power3" });
        const dotY = gsap.quickTo(curDot, "y", { duration: 0.1, ease: "power3" });
        const ringX = gsap.quickTo(curRing, "x", { duration: 0.5, ease: "power3" });
        const ringY = gsap.quickTo(curRing, "y", { duration: 0.5, ease: "power3" });
        document.addEventListener("mousemove", (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          dotX(mouseX - 3);
          dotY(mouseY - 3);
          ringX(mouseX - 18);
          ringY(mouseY - 18);
        });
        document.querySelectorAll("a, button, .project-card, [data-cursor-hover]").forEach((el) => {
          el.addEventListener("mouseenter", () => {
            gsap.to(curRing, { scale: 2, duration: 0.3, ease: "power2.out" });
          });
          el.addEventListener("mouseleave", () => {
            gsap.to(curRing, { scale: 1, duration: 0.3, ease: "power2.out" });
          });
        });
      } else {
        document.addEventListener("mousemove", (e) => {
          curDot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
          curRing.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
        });
      }
    } else if (curDot && curRing) {
      curDot.style.display = "none";
      curRing.style.display = "none";
    }
    function updateProgressBar() {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? winScroll / height * 100 : 0;
      const progressBar = document.getElementById("scroll-progress");
      if (progressBar) progressBar.style.width = scrolled + "%";
    }
    window.addEventListener("scroll", updateProgressBar, { passive: true });
    const termIn = document.getElementById("term-in");
    const termOut = document.getElementById("term-output");
    if (termIn && termOut) {
      termIn.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const cmd = termIn.value.trim();
          if (cmd) {
            const cmdDiv = document.createElement("div");
            const cmdSpan = document.createElement("span");
            cmdSpan.className = "text-slate-400";
            cmdSpan.textContent = `\u276F ${cmd}`;
            cmdDiv.appendChild(cmdSpan);
            termOut.appendChild(cmdDiv);
            let out = "";
            if (cmd === "help") out = "Commands: whoami, skills, research, contact, clear";
            else if (cmd === "clear") {
              termOut.innerHTML = "";
              termIn.value = "";
              return;
            } else if (cmd === "whoami") out = "Suraj Tharu Chaudhary \u2014 GIS & Remote Sensing Expert, Nepal";
            else if (cmd === "skills") out = "QGIS, ArcGIS, GEE, Python, R, Random Forest, LULC Analysis";
            else if (cmd === "research") out = "LULC Birendranagar (2024) | LULC Nawalparasi (2025) | Earthquake Analyzer (2024)";
            else if (cmd === "contact") out = "Use the contact form below or navigate to #contact";
            else if (cmd === "connect usb") {
              if (navigator.usb) {
                navigator.usb.requestDevice({ filters: [] }).catch((e2) => console.log(e2));
                out = "Scanning for WebUSB devices...";
              } else out = "WebUSB not supported in this browser.";
            } else if (cmd === "connect bt") {
              if (navigator.bluetooth) {
                navigator.bluetooth.requestDevice({ acceptAllDevices: true }).catch((e2) => console.log(e2));
                out = "Scanning for Web Bluetooth devices...";
              } else out = "Web Bluetooth not supported in this browser.";
            } else out = `Command not found: ${cmd}. Type 'help'.`;
            if (out) {
              const outDiv = document.createElement("div");
              outDiv.textContent = out;
              termOut.appendChild(outDiv);
            }
            termOut.scrollTop = termOut.scrollHeight;
          }
          termIn.value = "";
        }
      });
    }
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {
      }));
    }
    const monacoContainer = document.getElementById("monaco-container");
    if (monacoContainer && typeof __require !== "undefined") {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          __require.config({ paths: { "vs": "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs" } });
          __require(["vs/editor/editor.main"], function() {
            window.editor = monaco.editor.create(monacoContainer, {
              value: ["# GEE Python API Example", "import ee", "ee.Initialize()", "", 'image = ee.Image("LANDSAT/LC08/C02/T1_L2/LC08_199041_20230601")', 'ndvi = image.normalizedDifference(["SR_B5", "SR_B4"])', "print(ndvi.getInfo())"].join("\n"),
              language: "python",
              theme: document.documentElement.classList.contains("dark") ? "vs-dark" : "vs",
              minimap: { enabled: false },
              fontSize: 12,
              scrollBeyondLastLine: false
            });
            document.getElementById("dark-toggle")?.addEventListener("click", () => {
              setTimeout(() => monaco.editor.setTheme(document.documentElement.classList.contains("dark") ? "vs-dark" : "vs"), 50);
            });
          });
        }
      });
      observer.observe(monacoContainer);
    }
    window.runCode = function() {
      const out = document.getElementById("monaco-output");
      if (out) {
        out.innerHTML += `<br/><span class="text-white">\u276F python gee_script.py</span><br/><span class="text-yellow-400">[Info] Authenticating with Earth Engine...</span><br/>[Info] NDVI computed successfully. Values: -0.04 to 0.82`;
        out.scrollTop = out.scrollHeight;
      }
    };
    async function fetchGitHub() {
      const feed = document.getElementById("gh-feed");
      if (!feed) return;
      try {
        const res = await fetch("https://api.github.com/users/surajtharu/events/public?per_page=5");
        if (!res.ok) throw new Error("API limit");
        const events = await res.json();
        if (!events || events.length === 0) {
          feed.innerHTML = "<div>No recent activity found.</div>";
          return;
        }
        feed.innerHTML = "";
        events.forEach((ev) => {
          let actionText = ev.type;
          if (ev.type === "PushEvent") actionText = `Pushed to ${ev.repo.name}`;
          else if (ev.type === "CreateEvent") actionText = `Created ${ev.payload.ref_type} in ${ev.repo.name}`;
          else if (ev.type === "WatchEvent") actionText = `Starred ${ev.repo.name}`;
          const div = document.createElement("div");
          div.className = "flex gap-2 items-center";
          const arrow = document.createElement("span");
          arrow.className = "text-brand-500";
          arrow.textContent = "\u2192";
          const text = document.createElement("span");
          text.className = "truncate";
          text.textContent = actionText;
          div.appendChild(arrow);
          div.appendChild(text);
          feed.appendChild(div);
        });
      } catch (err) {
        if (feed) feed.innerHTML = '<div class="text-slate-400">GitHub activity unavailable (API rate limit).</div>';
      }
    }
    fetchGitHub();
    if (typeof GitHubCalendar !== "undefined") {
      try {
        GitHubCalendar(".calendar", "surajtharu", { responsive: true, global_stats: false });
      } catch (e) {
        console.warn("GitHub Calendar failed to load", e);
      }
    }
    const projectSearch = document.getElementById("project-search");
    const projectFilter = document.getElementById("project-filter");
    const projectCards = document.querySelectorAll(".project-card");
    function filterProjects() {
      if (!projectSearch || !projectFilter || projectCards.length === 0) return;
      const query = projectSearch.value.toLowerCase();
      const filter = projectFilter.value.toLowerCase();
      projectCards.forEach((card) => {
        const title = card.getAttribute("data-title") || "";
        const tags = card.getAttribute("data-tags") || "";
        const matchesSearch = title.includes(query) || tags.includes(query);
        const matchesFilter = filter === "all" || tags.includes(filter);
        if (matchesSearch && matchesFilter) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    }
    projectSearch?.addEventListener("input", filterProjects);
    projectFilter?.addEventListener("change", filterProjects);
    document.querySelectorAll(".rounded-xl.border, .rounded-lg.border").forEach((el) => {
      if (el.id !== "chat-widget") el.classList.add("hover-lift");
    });
    function updateAmbientLight() {
      const hour = (/* @__PURE__ */ new Date()).getHours();
      let color = "transparent";
      if (hour >= 5 && hour < 8) color = "rgba(252, 211, 77, 0.04)";
      else if (hour >= 18 && hour < 20) color = "rgba(244, 63, 94, 0.04)";
      else if (hour >= 20 || hour < 5) color = "rgba(56, 189, 248, 0.02)";
      let overlay = document.getElementById("ambient-light");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "ambient-light";
        overlay.className = "fixed inset-0 pointer-events-none z-[-1] mix-blend-screen transition-colors duration-1000";
        document.body.appendChild(overlay);
      }
      overlay.style.backgroundColor = color;
    }
    setInterval(updateAmbientLight, 6e4);
    updateAmbientLight();
    const cmdPalette = document.getElementById("cmd-palette");
    const cmdBackdrop = document.getElementById("cmd-backdrop");
    const cmdInput = document.getElementById("cmd-input");
    const cmdResults = document.getElementById("cmd-results");
    if (cmdPalette && cmdInput && cmdResults) {
      const commands = [
        { title: "Toggle Dark Mode", icon: "\u{1F319}", action: () => document.getElementById("dark-toggle")?.click() },
        { title: "Navigate: About", icon: "\u{1F464}", action: () => {
          window.location.hash = "#about";
        } },
        { title: "Navigate: Projects", icon: "\u{1F52D}", action: () => {
          window.location.hash = "#projects";
        } },
        { title: "Navigate: Skills", icon: "\u{1F6E0}\uFE0F", action: () => {
          window.location.hash = "#skills";
        } },
        { title: "Navigate: Contact", icon: "\u{1F4EC}", action: () => {
          window.location.hash = "#contact";
        } },
        { title: "Open Admin Panel", icon: "\u2699\uFE0F", action: () => {
          window.location.href = "/admin";
        } },
        { title: "Download Resume", icon: "\u{1F4C4}", action: () => {
          playSound("click");
          window.open("./Suraj_Tharu_CV.pdf", "_blank");
        } },
        { title: "Open AI Assistant", icon: "\u{1F916}", action: () => window.toggleChat?.() },
        { title: "Accessibility Settings", icon: "\u{1F441}\uFE0F", action: () => document.getElementById("a11y-toggle")?.click() }
      ];
      const toggleCmdPalette = () => {
        if (cmdPalette.classList.contains("hidden")) {
          cmdPalette.classList.remove("hidden");
          cmdPalette.classList.add("flex");
          cmdInput.value = "";
          cmdInput.focus();
          renderCmdResults("");
        } else {
          cmdPalette.classList.add("hidden");
          cmdPalette.classList.remove("flex");
        }
      };
      const renderCmdResults = (query) => {
        const filtered = commands.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));
        cmdResults.innerHTML = filtered.map((c, i) => `
        <div class="cmd-item flex items-center gap-3 px-4 py-3 hover:bg-brand-500/10 dark:hover:bg-brand-500/20 cursor-pointer rounded-lg text-sm dark:text-slate-300 transition-colors" data-idx="${i}">
          <span class="text-xl">${c.icon}</span><span>${c.title}</span>
        </div>`).join("");
        document.querySelectorAll(".cmd-item").forEach((el) => {
          el.addEventListener("mouseenter", () => playSound("hover"));
          el.addEventListener("click", () => {
            playSound("click");
            commands[el.dataset.idx].action();
            toggleCmdPalette();
          });
        });
      };
      document.getElementById("open-cmd")?.addEventListener("click", toggleCmdPalette);
      cmdBackdrop?.addEventListener("click", toggleCmdPalette);
      document.getElementById("cmd-close")?.addEventListener("click", toggleCmdPalette);
      window.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          toggleCmdPalette();
        }
        if (e.key === "Escape" && !cmdPalette.classList.contains("hidden")) toggleCmdPalette();
      });
      cmdInput.addEventListener("input", (e) => renderCmdResults(e.target.value));
    }
    document.getElementById("a11y-toggle")?.addEventListener("click", () => {
      const menu = document.getElementById("a11y-menu");
      menu?.classList.toggle("hidden");
      menu?.classList.toggle("flex");
    });
    document.getElementById("a11y-motion")?.addEventListener("change", (e) => document.body.classList.toggle("a11y-reduce-motion", e.target.checked));
    document.getElementById("a11y-contrast")?.addEventListener("change", (e) => document.body.classList.toggle("a11y-high-contrast", e.target.checked));
    document.getElementById("a11y-font")?.addEventListener("change", (e) => document.body.classList.toggle("a11y-dyslexia", e.target.checked));
    const initConnBtn = document.getElementById("init-conn-btn");
    const contactModal = document.getElementById("contact-modal");
    const closeContact = document.getElementById("close-contact");
    const contactBackdrop = document.getElementById("contact-backdrop");
    const contactBox = document.getElementById("contact-box");
    const contactForm = document.getElementById("contact-form");
    const contactStatus = document.getElementById("contact-status");
    const openContactModal = () => {
      contactModal?.classList.remove("hidden");
      contactModal?.classList.add("flex");
      setTimeout(() => {
        contactBox?.classList.remove("scale-95", "opacity-0");
        contactBox?.classList.add("scale-100", "opacity-100");
        document.getElementById("c-name")?.focus();
      }, 10);
    };
    const closeContactModal = () => {
      contactBox?.classList.remove("scale-100", "opacity-100");
      contactBox?.classList.add("scale-95", "opacity-0");
      setTimeout(() => {
        contactModal?.classList.add("hidden");
        contactModal?.classList.remove("flex");
        contactStatus?.classList.add("hidden");
        contactForm?.reset();
      }, 300);
    };
    initConnBtn?.addEventListener("click", () => {
      playSound("click");
      openContactModal();
    });
    closeContact?.addEventListener("click", closeContactModal);
    contactBackdrop?.addEventListener("click", closeContactModal);
    contactForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("c-name").value,
        email: document.getElementById("c-email").value,
        subject: document.getElementById("c-subject").value,
        message: document.getElementById("c-msg").value,
        honeypot: document.getElementById("c-hp").value
      };
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.innerText = "Transmitting...";
      submitBtn.disabled = true;
      try {
        const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (response.ok) {
          contactStatus.innerText = "Message transmitted successfully.";
          contactStatus.className = "mt-4 text-center font-bold text-green-400";
          contactForm.reset();
          setTimeout(closeContactModal, 2e3);
        } else {
          throw new Error("Transmission failed");
        }
      } catch (error) {
        contactStatus.innerText = "Error: Transmission failed.";
        contactStatus.className = "mt-4 text-center font-bold text-red-500";
      } finally {
        contactStatus?.classList.remove("hidden");
        submitBtn.innerText = "Execute Send";
        submitBtn.disabled = false;
      }
    });
    const playBtn = document.getElementById("play-resume");
    const gameModal = document.getElementById("game-modal");
    const gameCanvas = document.getElementById("game-canvas");
    const gameOverlay = document.getElementById("game-overlay");
    const startGameBtn = document.getElementById("start-game-btn");
    const closeGame = document.getElementById("close-game");
    const scoreEl = document.getElementById("game-score");
    let gameCtx, gameLoopId, gameScore = 0;
    let player, fallingItems = [];
    const skillsList = ["GIS", "QGIS", "Python", "GEE", "React", "LULC", "ML"];
    if (playBtn && gameCanvas) {
      gameCtx = gameCanvas.getContext("2d");
      playBtn.addEventListener("click", () => {
        playSound("click");
        gameModal?.classList.remove("hidden");
        gameModal?.classList.add("flex");
        gameOverlay?.classList.remove("hidden");
      });
      closeGame?.addEventListener("click", () => {
        gameModal?.classList.add("hidden");
        gameModal?.classList.remove("flex");
        cancelAnimationFrame(gameLoopId);
      });
      startGameBtn?.addEventListener("click", () => {
        gameOverlay?.classList.add("hidden");
        resetGame();
        gameLoopId = requestAnimationFrame(gameLoop);
      });
      const keys = {};
      window.addEventListener("keydown", (e) => keys[e.key] = true);
      window.addEventListener("keyup", (e) => keys[e.key] = false);
      const resetGame = () => {
        gameScore = 0;
        if (scoreEl) scoreEl.innerText = gameScore;
        player = { x: 275, y: 350, w: 50, h: 20, speed: 6 };
        fallingItems = [];
      };
      const gameLoop = () => {
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
        if (keys["ArrowRight"] && player.x < gameCanvas.width - player.w) player.x += player.speed;
        gameCtx.fillStyle = "#0ea5e9";
        gameCtx.fillRect(player.x, player.y, player.w, player.h);
        if (Math.random() < 0.02) fallingItems.push({ x: Math.random() * (gameCanvas.width - 40), y: 0, text: skillsList[Math.floor(Math.random() * skillsList.length)], speed: 2 + Math.random() * 2 });
        for (let i = fallingItems.length - 1; i >= 0; i--) {
          let item = fallingItems[i];
          item.y += item.speed;
          gameCtx.fillStyle = "#38bdf8";
          gameCtx.font = "14px monospace";
          gameCtx.fillText(item.text, item.x, item.y);
          if (item.y > player.y && item.y < player.y + player.h && item.x > player.x - 30 && item.x < player.x + player.w) {
            gameScore += 10;
            if (scoreEl) scoreEl.innerText = gameScore;
            playSound("click");
            fallingItems.splice(i, 1);
            continue;
          }
          if (item.y > gameCanvas.height) fallingItems.splice(i, 1);
        }
        gameLoopId = requestAnimationFrame(gameLoop);
      };
    }
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let konamiIdx = 0;
    window.addEventListener("keydown", (e) => {
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
      playSound("click");
      const c = document.createElement("canvas");
      c.style.position = "fixed";
      c.style.top = "0";
      c.style.left = "0";
      c.style.width = "100vw";
      c.style.height = "100vh";
      c.style.zIndex = "99999";
      c.style.pointerEvents = "none";
      c.style.opacity = "0.8";
      document.body.appendChild(c);
      const ctx = c.getContext("2d");
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const font_size = 14;
      const columns = c.width / font_size;
      const drops = [];
      for (let x = 0; x < columns; x++) drops[x] = 1;
      function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#0F0";
        ctx.font = font_size + "px monospace";
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(text, i * font_size, drops[i] * font_size);
          if (drops[i] * font_size > c.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      }
      const rainInt = setInterval(draw, 33);
      setTimeout(() => {
        clearInterval(rainInt);
        c.style.transition = "opacity 2s";
        c.style.opacity = "0";
        setTimeout(() => c.remove(), 2e3);
      }, 1e4);
    }
    let touchstartY = 0;
    let touchendY = 0;
    contactBox?.addEventListener("touchstart", (e) => {
      touchstartY = e.changedTouches[0].screenY;
    }, { passive: true });
    contactBox?.addEventListener("touchend", (e) => {
      touchendY = e.changedTouches[0].screenY;
      if (touchendY - touchstartY > 100) closeContactModal();
    }, { passive: true });
    document.querySelectorAll("a, button, .hover-lift, .magnetic").forEach((el) => {
      el.addEventListener("mouseenter", () => playSound("hover"));
      el.addEventListener("click", () => playSound("click"));
    });
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0px, 0px)";
      });
    });
    document.getElementById("term-in")?.addEventListener("keydown", () => playSound("type"));
    document.getElementById("cmd-input")?.addEventListener("keydown", () => playSound("type"));
    document.getElementById("chat-input")?.addEventListener("keydown", () => playSound("type"));
    const visitEl = document.getElementById("visit-count");
    if (visitEl && typeof io !== "undefined") {
      const socket = io();
      visitEl.textContent = "...";
      socket.on("user-joined", (data) => {
        visitEl.textContent = data.count || "0";
      });
      socket.on("user-left", (data) => {
        visitEl.textContent = data.count || "0";
      });
      socket.on("current-users", (users) => {
        visitEl.textContent = users.length.toString();
      });
    }
    const inA = document.getElementById("gate-in-a");
    const inB = document.getElementById("gate-in-b");
    const outGate = document.getElementById("gate-out");
    function updateGate() {
      if (!inA || !inB || !outGate) return;
      const res = inA.checked && inB.checked;
      outGate.innerText = res ? "1" : "0";
      outGate.className = res ? "w-12 h-12 rounded-full border-4 border-green-400 bg-green-400/20 shadow-[0_0_15px_rgba(74,222,128,0.5)] flex items-center justify-center transition-all text-green-400 font-bold" : "w-12 h-12 rounded-full border-4 border-slate-300 dark:border-slate-600 flex items-center justify-center transition-all dark:text-white font-bold";
      if (res) playSound("click");
    }
    inA?.addEventListener("change", updateGate);
    inB?.addEventListener("change", updateGate);
    setTimeout(() => {
      if (typeof QRCode !== "undefined") {
        const qr1 = document.getElementById("qr-1");
        const qr2 = document.getElementById("qr-2");
        if (qr1) new QRCode(qr1, { text: "https://coursera.org/verify/example", width: 56, height: 56, colorDark: "#0f172a", colorLight: "#ffffff" });
        if (qr2) new QRCode(qr2, { text: "https://aws.amazon.com/verification", width: 56, height: 56, colorDark: "#0f172a", colorLight: "#ffffff" });
      }
    }, 1e3);
  }

  // src/chat.js
  function initChat() {
    const chatHistory = [];
    const chatBtn = document.getElementById("chat-btn");
    const chatWidget = document.getElementById("chat-widget");
    const closeChat = document.getElementById("close-chat");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");
    if (!chatBtn || !chatWidget || !chatInput || !chatMessages) return;
    const chatIcon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>';
    const closeIcon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
    function toggleChat() {
      chatWidget.classList.toggle("open");
      if (chatWidget.classList.contains("open")) {
        chatBtn.innerHTML = closeIcon;
        chatBtn.classList.add("bg-slate-700", "hover:bg-slate-600");
        chatBtn.classList.remove("bg-brand-500", "hover:bg-brand-400");
        chatInput.focus();
      } else {
        chatBtn.innerHTML = chatIcon;
        chatBtn.classList.remove("bg-slate-700", "hover:bg-slate-600");
        chatBtn.classList.add("bg-brand-500", "hover:bg-brand-400");
      }
    }
    chatBtn.addEventListener("click", toggleChat);
    if (closeChat) closeChat.addEventListener("click", () => {
      if (chatWidget.classList.contains("open")) toggleChat();
    });
    let currentContext = "Hero Section";
    window.addEventListener("scroll", () => {
      const sections = document.querySelectorAll("section");
      let current = "";
      sections.forEach((section) => {
        if (window.pageYOffset >= section.offsetTop - 200) current = section.getAttribute("id") || current;
      });
      if (current) currentContext = current;
    });
    let isVoiceMode = false;
    chatInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter" && chatInput.value.trim() !== "") {
        const msg = chatInput.value.trim();
        chatInput.value = "";
        chatInput.disabled = true;
        const userMsgDiv = document.createElement("div");
        userMsgDiv.className = "bg-brand-500 text-white p-3 rounded-xl rounded-tr-sm self-end max-w-[85%] chat-msg";
        userMsgDiv.textContent = msg;
        chatMessages.appendChild(userMsgDiv);
        const typingId = "typing-" + Date.now();
        chatMessages.insertAdjacentHTML("beforeend", `<div id="${typingId}" class="bg-slate-200 dark:bg-slate-800 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] chat-msg dark:text-slate-400 text-slate-500 text-xs flex items-center gap-1">
        <span class="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style="animation-delay: 0s"></span>
        <span class="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
        <span class="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
      </div>`);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatHistory.push({ role: "user", content: msg });
        if (chatHistory.length > 20) chatHistory.splice(0, 2);
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg, context: currentContext, history: chatHistory.slice(0, -1) })
          });
          const data = await res.json();
          document.getElementById(typingId)?.remove();
          if (data.reply) {
            chatHistory.push({ role: "assistant", content: data.reply });
            const botMsgDiv = document.createElement("div");
            botMsgDiv.className = "bg-slate-200 dark:bg-slate-800 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] chat-msg dark:text-slate-200 text-slate-800";
            botMsgDiv.textContent = data.reply;
            chatMessages.appendChild(botMsgDiv);
            if (isVoiceMode) {
              const speech = new SpeechSynthesisUtterance(data.reply);
              window.speechSynthesis.speak(speech);
            }
          } else {
            const errorDiv = document.createElement("div");
            errorDiv.className = "bg-red-500/10 text-red-500 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] chat-msg text-xs";
            errorDiv.textContent = data.error || "Server error";
            chatMessages.appendChild(errorDiv);
          }
        } catch (error) {
          console.error(error);
          document.getElementById(typingId)?.remove();
          const connErrorDiv = document.createElement("div");
          connErrorDiv.className = "bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] chat-msg text-xs";
          connErrorDiv.textContent = "Error connecting to AI Server.";
          chatMessages.appendChild(connErrorDiv);
        }
        chatInput.disabled = false;
        chatInput.focus();
        chatMessages.scrollTop = chatMessages.scrollHeight;
        isVoiceMode = false;
      }
    });
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceBtn = document.getElementById("voice-btn");
    if (SpeechRecognition && voiceBtn) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      voiceBtn.addEventListener("click", () => {
        isVoiceMode = true;
        try {
          recognition.start();
          voiceBtn.classList.add("text-brand-500", "animate-pulse");
        } catch (e) {
          console.warn("SpeechRecognition error:", e);
        }
      });
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        voiceBtn.classList.remove("text-brand-500", "animate-pulse");
        chatInput.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));
      };
      recognition.onend = () => voiceBtn.classList.remove("text-brand-500", "animate-pulse");
    } else if (voiceBtn) {
      voiceBtn.style.display = "none";
    }
    window.toggleChat = toggleChat;
  }

  // src/three-bg.js
  function initThreeBackground() {
    const canvas = document.getElementById("hero-canvas");
    if (typeof THREE === "undefined" || !canvas) {
      console.warn("[Three.js] Library not loaded or canvas missing \u2014 skipping 3D Earth.");
      return;
    }
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2e3);
      camera.position.set(0, 0, 300);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const ambientLight = new THREE.AmbientLight(16777215, 0.4);
      scene.add(ambientLight);
      const sunLight = new THREE.DirectionalLight(16777215, 1.5);
      sunLight.position.set(500, 300, 500);
      scene.add(sunLight);
      const backLight = new THREE.DirectionalLight(959977, 1.2);
      backLight.position.set(-500, -300, -500);
      scene.add(backLight);
      const earthGroup = new THREE.Group();
      earthGroup.rotation.z = -23.5 * Math.PI / 180;
      scene.add(earthGroup);
      const earthRadius = 70;
      const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
      const earthMat = new THREE.MeshPhongMaterial({
        color: 988970,
        emissive: 132631,
        specular: 3718648,
        shininess: 20,
        transparent: true,
        opacity: 0.95
      });
      const earthMesh = new THREE.Mesh(earthGeo, earthMat);
      earthGroup.add(earthMesh);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 3718648,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      });
      const wireMesh = new THREE.Mesh(earthGeo, wireMat);
      wireMesh.scale.set(1.01, 1.01, 1.01);
      earthGroup.add(wireMesh);
      const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.15, 64, 64);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: 959977,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      });
      const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
      scene.add(atmosMesh);
      const getCoordinatesFromLatLng = (lat, lng, radius) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
      };
      const locations = [
        { name: "Nepal (Kathmandu)", lat: 27.7172, lng: 85.324, color: 1096065 },
        // Green
        { name: "Surkhet (Research)", lat: 28.6015, lng: 81.6322, color: 16096779 },
        // Amber
        { name: "Nawalparasi", lat: 27.5319, lng: 83.6922, color: 9133302 },
        // Purple
        { name: "USA (Silicon Valley)", lat: 37.3875, lng: -122.0575, color: 3718648 }
        // Blue
      ];
      const markers = [];
      locations.forEach((loc) => {
        const markerGeo = new THREE.SphereGeometry(1.5, 16, 16);
        const markerMat = new THREE.MeshBasicMaterial({
          color: loc.color,
          transparent: true,
          opacity: 0.8
        });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        const haloGeo = new THREE.SphereGeometry(3, 16, 16);
        const haloMat = new THREE.MeshBasicMaterial({
          color: loc.color,
          transparent: true,
          opacity: 0.3,
          blending: THREE.AdditiveBlending
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        marker.add(halo);
        const pos = getCoordinatesFromLatLng(loc.lat, loc.lng, earthRadius + 0.5);
        marker.position.copy(pos);
        earthGroup.add(marker);
        markers.push({ mesh: marker, halo, originalScale: 1, pulseAngle: Math.random() * Math.PI * 2 });
      });
      const starsGeo = new THREE.BufferGeometry();
      const starsCount = 1500;
      const posArray = new Float32Array(starsCount * 3);
      for (let i = 0; i < starsCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 2e3;
      }
      starsGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
      const starsMat = new THREE.PointsMaterial({ size: 1.5, color: 16777215, transparent: true, opacity: 0.7 });
      const stars = new THREE.Points(starsGeo, starsMat);
      scene.add(stars);
      let mouseX = 0, mouseY = 0;
      document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
      });
      let scrollY = 0;
      window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
      });
      const clock = new THREE.Clock();
      const animate = () => {
        requestAnimationFrame(animate);
        if (!document.body.classList.contains("a11y-reduce-motion")) {
          const t = clock.getElapsedTime();
          earthGroup.rotation.y = t * 0.05;
          stars.rotation.y = t * 0.01;
          markers.forEach((m) => {
            m.pulseAngle += 0.05;
            const scale = 1 + Math.sin(m.pulseAngle) * 0.4;
            m.halo.scale.set(scale, scale, scale);
            m.halo.material.opacity = 0.3 * (1.5 - scale);
          });
          camera.position.x += (mouseX * 50 - camera.position.x) * 0.05;
          camera.position.y += (-mouseY * 50 - camera.position.y) * 0.05;
          camera.position.z = 300 + scrollY * 0.1;
          camera.lookAt(scene.position);
        }
        renderer.render(scene, camera);
      };
      animate();
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    } catch (e) {
      console.warn("[Three.js] Earth Render error:", e.message);
    }
  }

  // src/animations.js
  function initAnimations() {
    let lenis;
    if (typeof Lenis !== "undefined") {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
      });
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
      if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1e3);
        });
        gsap.ticker.lagSmoothing(0, 0);
      }
    }
    if (typeof gsap !== "undefined") {
      gsap.from(".hero-word", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2
      });
      gsap.to("#hero-photo-wrap", {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.5,
        ease: "power3.inOut",
        delay: 0.5
      });
      try {
        gsap.registerPlugin(ScrollTrigger);
        const aosElements = document.querySelectorAll("[data-aos]");
        aosElements.forEach((el) => {
          const animationType = el.getAttribute("data-aos");
          const delayRaw = el.getAttribute("data-aos-delay");
          const delay = delayRaw ? parseInt(delayRaw) / 1e3 : 0;
          let fromVars = { opacity: 0, duration: 1, delay, ease: "power3.out" };
          if (animationType === "fade-up") {
            fromVars.y = 50;
          } else if (animationType === "fade-down") {
            fromVars.y = -50;
          } else if (animationType === "fade-right") {
            fromVars.x = -50;
          } else if (animationType === "fade-left") {
            fromVars.x = 50;
          } else if (animationType === "zoom-in") {
            fromVars.scale = 0.8;
          }
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse"
            },
            ...fromVars
          });
        });
        const projectSections = document.querySelectorAll("#projects, #featured-projects");
        projectSections.forEach((section) => {
          const cards = section.querySelectorAll(".project-card");
          if (cards.length > 0) {
            gsap.from(cards, {
              scrollTrigger: {
                trigger: section,
                start: "top 75%"
              },
              y: 50,
              opacity: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "back.out(1.7)"
            });
          }
        });
        document.querySelectorAll(".orb").forEach((orb, i) => {
          const speed = i % 2 === 0 ? -0.3 : 0.3;
          gsap.to(orb, {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: orb.closest("section") || document.body,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        });
        document.querySelectorAll(".sec-num, .section-heading").forEach((el) => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: "top 90%"
            },
            x: -30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
          });
        });
      } catch (e) {
        console.warn("[GSAP] ScrollTrigger not available:", e.message);
      }
    }
    if (typeof Chart !== "undefined") {
      try {
        const ctx = document.getElementById("radarChart").getContext("2d");
        new Chart(ctx, {
          type: "radar",
          data: {
            labels: ["GIS & RS Expertise", "ML Proficiency", "Innovation", "Research Output", "Programming"],
            datasets: [{
              label: "LULC Analysis (RF)",
              data: [95, 88, 85, 92, 78],
              backgroundColor: "rgba(14, 165, 233, 0.2)",
              borderColor: "rgba(14, 165, 233, 1)",
              pointBackgroundColor: "rgba(14, 165, 233, 1)",
              borderWidth: 2
            }, {
              label: "Earthquake Monitoring",
              data: [80, 75, 70, 65, 85],
              backgroundColor: "rgba(234, 179, 8, 0.2)",
              borderColor: "rgba(234, 179, 8, 1)",
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                angleLines: { color: "rgba(148, 163, 184, 0.2)" },
                grid: { color: "rgba(148, 163, 184, 0.2)" },
                pointLabels: { color: "#94a3b8", font: { family: "Space Mono", size: 10 } },
                ticks: { display: false }
              }
            },
            plugins: { legend: { labels: { color: "#94a3b8", font: { family: "Space Mono", size: 10 } } } }
          }
        });
      } catch (e) {
        console.warn("[Chart.js] Radar chart error:", e.message);
      }
    }
    if (typeof d3 === "undefined") {
      console.warn("[D3] Library not loaded \u2014 skipping skills graph.");
      return;
    }
    try {
      const graphEl = document.getElementById("d3-skills-graph");
      if (!graphEl) return;
      const width = graphEl.clientWidth;
      const height = 400;
      const nodes = [
        { id: "GIS", group: 1, radius: 26 },
        { id: "QGIS", group: 1, radius: 20 },
        { id: "ArcGIS", group: 1, radius: 18 },
        { id: "GEE", group: 2, radius: 24 },
        { id: "Python", group: 2, radius: 22 },
        { id: "R Lang", group: 2, radius: 18 },
        { id: "ML / RF", group: 3, radius: 22 },
        { id: "LULC", group: 3, radius: 20 },
        { id: "Remote Sensing", group: 3, radius: 20 }
      ];
      const links = [
        { source: "GIS", target: "QGIS" },
        { source: "GIS", target: "ArcGIS" },
        { source: "GIS", target: "LULC" },
        { source: "GEE", target: "Python" },
        { source: "GEE", target: "LULC" },
        { source: "ML / RF", target: "Python" },
        { source: "ML / RF", target: "LULC" },
        { source: "Remote Sensing", target: "GEE" },
        { source: "Remote Sensing", target: "LULC" },
        { source: "R Lang", target: "Python" }
      ];
      const svg = d3.select("#d3-skills-graph").append("svg").attr("width", "100%").attr("height", "100%").attr("viewBox", [0, 0, width, height]);
      const simulation = d3.forceSimulation(nodes).force("link", d3.forceLink(links).id((d) => d.id).distance(90)).force("charge", d3.forceManyBody().strength(-320)).force("center", d3.forceCenter(width / 2, height / 2));
      const link = svg.append("g").attr("stroke", "#334155").attr("stroke-opacity", 0.6).selectAll("line").data(links).join("line").attr("stroke-width", 2);
      const dragBehavior = (sim) => {
        const dragstarted = (event) => {
          if (!event.active) sim.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        };
        const dragged = (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        };
        const dragended = (event) => {
          if (!event.active) sim.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        };
        return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
      };
      const node = svg.append("g").selectAll("circle").data(nodes).join("circle").attr("r", (d) => d.radius).attr("fill", (d) => d.group === 1 ? "#0ea5e9" : d.group === 2 ? "#10b981" : "#a855f7").attr("stroke", "#fff").attr("stroke-width", 1.5).call(dragBehavior(simulation));
      const labels = svg.append("g").selectAll("text").data(nodes).join("text").text((d) => d.id).attr("font-size", "10px").attr("font-family", "Space Mono").attr("fill", document.documentElement.classList.contains("dark") ? "#f8fafc" : "#0f172a").attr("dx", 12).attr("dy", 4);
      simulation.on("tick", () => {
        link.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y).attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
        node.attr("cx", (d) => Math.max(d.radius, Math.min(width - d.radius, d.x))).attr("cy", (d) => Math.max(d.radius, Math.min(height - d.radius, d.y)));
        labels.attr("x", (d) => Math.max(d.radius, Math.min(width - d.radius, d.x))).attr("y", (d) => Math.max(d.radius, Math.min(height - d.radius, d.y)));
      });
    } catch (e) {
      console.warn("[D3] Skills graph error:", e.message);
    }
  }

  // src/gis-map.js
  function initGisMap() {
    const mapContainer = document.getElementById("gis-map");
    if (!mapContainer) return;
    const mapObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && typeof L !== "undefined") {
        mapObserver.disconnect();
        const map = L.map("gis-map").setView([28.3949, 84.124], 7);
        setTimeout(() => map.invalidateSize(), 100);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: "&copy; OpenStreetMap &copy; CARTO",
          subdomains: "abcd",
          maxZoom: 20
        }).addTo(map);
        const surkhetMarker = L.marker([28.6015, 81.6322]).addTo(map);
        surkhetMarker.bindPopup(`
        <div style="color: #0f172a; font-family: 'Space Mono', monospace;">
          <h4 style="font-weight: bold; margin-bottom: 4px;">Birendranagar, Surkhet</h4>
          <p style="font-size: 12px; margin:0;">LULC Analysis using Random Forest</p>
        </div>
      `).openPopup();
        const nawalparasiMarker = L.marker([27.5319, 83.6922]).addTo(map);
        nawalparasiMarker.bindPopup(`
        <div style="color: #0f172a; font-family: 'Space Mono', monospace;">
          <h4 style="font-weight: bold; margin-bottom: 4px;">Nawalparasi West</h4>
          <p style="font-size: 12px; margin:0;">Decadal LULC Dynamics (2016-2026)</p>
        </div>
      `);
      }
    });
    mapObserver.observe(mapContainer);
  }

  // src/multiplayer.js
  function initMultiplayer() {
    try {
      const socket = io();
      const cursors = {};
      document.addEventListener("mousemove", (e) => {
        if (socket.connected && document.hasFocus()) {
          socket.emit("cursor-move", {
            x: e.pageX / window.innerWidth,
            y: e.pageY / window.innerHeight
          });
        }
      });
      socket.on("cursor-update", (data) => {
        let el = cursors[data.id];
        if (!el) {
          el = document.createElement("div");
          el.className = "absolute w-3 h-3 rounded-full pointer-events-none z-[99999] shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-75 ease-out";
          el.style.backgroundColor = data.color;
          document.body.appendChild(el);
          cursors[data.id] = el;
        }
        el.style.left = data.x * window.innerWidth + "px";
        el.style.top = data.y * window.innerHeight + "px";
      });
      socket.on("cursor-remove", (id) => {
        if (cursors[id]) {
          cursors[id].remove();
          delete cursors[id];
        }
      });
      socket.on("user-left", (data) => {
        if (cursors[data.id]) {
          cursors[data.id].remove();
          delete cursors[data.id];
        }
      });
      console.log("[Multiplayer] Socket.io cursors initialized.");
    } catch (e) {
      console.warn("[Multiplayer] Socket.io not available \u2014 cursors disabled.");
    }
  }

  // src/i18n.js
  var dict = {
    "EN": {
      "nav_about": "About",
      "nav_projects": "Projects",
      "nav_skills": "Skills",
      "nav_contact": "Contact",
      "hi": "Hi,",
      "im": "I'm",
      "hero_desc": "I merge geographic insight with machine learning to build intelligent, scalable spatial solutions.",
      "playground_title": "Engineering Playground",
      "admin_login": "Admin Login",
      "contact_title": "Establish Connection",
      "contact_desc": "Reach out to discuss GIS, ML, or Full-Stack engineering."
    },
    "NP": {
      "nav_about": "\u092C\u093E\u0930\u0947\u092E\u093E",
      "nav_projects": "\u092A\u0930\u093F\u092F\u094B\u091C\u0928\u093E\u0939\u0930\u0942",
      "nav_skills": "\u0938\u0940\u092A\u0939\u0930\u0942",
      "nav_contact": "\u0938\u092E\u094D\u092A\u0930\u094D\u0915",
      "hi": "\u0928\u092E\u0938\u094D\u0924\u0947,",
      "im": "\u092E \u0939\u0941\u0901",
      "hero_desc": "\u092E \u092D\u094C\u0917\u094B\u0932\u093F\u0915 \u091C\u094D\u091E\u093E\u0928\u0932\u093E\u0908 \u092E\u0947\u0936\u093F\u0928 \u0932\u0930\u094D\u0928\u093F\u0919\u0938\u0901\u0917 \u092E\u093F\u0932\u093E\u090F\u0930 \u092C\u094C\u0926\u094D\u0927\u093F\u0915, \u092E\u093E\u092A\u0928\u092F\u094B\u0917\u094D\u092F \u0938\u094D\u0925\u093E\u0928\u093F\u0915 \u0938\u092E\u093E\u0927\u093E\u0928\u0939\u0930\u0942 \u0928\u093F\u0930\u094D\u092E\u093E\u0923 \u0917\u0930\u094D\u091B\u0941\u0964",
      "playground_title": "\u0907\u0928\u094D\u091C\u093F\u0928\u093F\u092F\u0930\u093F\u0919 \u0916\u0947\u0932 \u092E\u0948\u0926\u093E\u0928",
      "admin_login": "\u092A\u094D\u0930\u0936\u093E\u0938\u0915 \u0932\u0917\u0907\u0928",
      "contact_title": "\u0938\u092E\u094D\u092A\u0930\u094D\u0915 \u0938\u094D\u0925\u093E\u092A\u0928\u093E \u0917\u0930\u094D\u0928\u0941\u0939\u094B\u0938\u094D",
      "contact_desc": "GIS, ML, \u0935\u093E \u092B\u0941\u0932-\u0938\u094D\u091F\u094D\u092F\u093E\u0915 \u0907\u0928\u094D\u091C\u093F\u0928\u093F\u092F\u0930\u093F\u0919\u0915\u094B \u092C\u093E\u0930\u0947\u092E\u093E \u091B\u0932\u092B\u0932 \u0917\u0930\u094D\u0928 \u0938\u092E\u094D\u092A\u0930\u094D\u0915 \u0917\u0930\u094D\u0928\u0941\u0939\u094B\u0938\u094D\u0964"
    }
  };
  function initI18n() {
    let currentLang = localStorage.getItem("site_lang") || "EN";
    const langToggleBtn = document.getElementById("lang-toggle");
    function applyTranslations(lang) {
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (dict[lang] && dict[lang][key]) {
          if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.placeholder = dict[lang][key];
          } else {
            el.innerText = dict[lang][key];
          }
        }
      });
      document.documentElement.lang = lang.toLowerCase();
      if (langToggleBtn) {
        langToggleBtn.innerText = lang;
      }
    }
    applyTranslations(currentLang);
    if (langToggleBtn) {
      langToggleBtn.addEventListener("click", () => {
        currentLang = currentLang === "EN" ? "NP" : "EN";
        localStorage.setItem("site_lang", currentLang);
        applyTranslations(currentLang);
        if (window.playSound) window.playSound("click");
      });
    }
  }

  // src/index.js
  window.playSound = playSound;
  initI18n();
  initUI();
  initChat();
  initThreeBackground();
  initAnimations();
  initGisMap();
  initMultiplayer();
})();
