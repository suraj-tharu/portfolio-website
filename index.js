// src/index.js — Main entry point
// Imports and bootstraps all feature modules

import { initUI, playSound } from './ui.js';
import { initChat } from './chat.js';
import { initThreeBackground } from './three-bg.js';
import { initAnimations } from './animations.js';
import { initGisMap } from './gis-map.js';
import { initMultiplayer } from './multiplayer.js';
import { initI18n } from './i18n.js';

// Expose playSound globally for i18n and other modules
window.playSound = playSound;

// Initialize all modules in correct order
initI18n();        // i18n translation (should be fast, before UI)
initUI();          // Core UI interactions (must run first)
initChat();        // AI chat assistant
initThreeBackground(); // 3D solar system hero background
initAnimations();  // GSAP, AOS, Chart.js, D3
initGisMap();      // Leaflet GIS map
initMultiplayer(); // Socket.io real-time cursors
