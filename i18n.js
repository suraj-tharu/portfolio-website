// src/i18n.js — Multi-language support (English / Nepali)

const dict = {
  'EN': {
    'nav_about': 'About',
    'nav_projects': 'Projects',
    'nav_skills': 'Skills',
    'nav_contact': 'Contact',
    'hi': 'Hi,',
    'im': "I'm",
    'hero_desc': 'I merge geographic insight with machine learning to build intelligent, scalable spatial solutions.',
    'playground_title': 'Engineering Playground',
    'admin_login': 'Admin Login',
    'contact_title': 'Establish Connection',
    'contact_desc': 'Reach out to discuss GIS, ML, or Full-Stack engineering.',
  },
  'NP': {
    'nav_about': 'बारेमा',
    'nav_projects': 'परियोजनाहरू',
    'nav_skills': 'सीपहरू',
    'nav_contact': 'सम्पर्क',
    'hi': 'नमस्ते,',
    'im': 'म हुँ',
    'hero_desc': 'म भौगोलिक ज्ञानलाई मेशिन लर्निङसँग मिलाएर बौद्धिक, मापनयोग्य स्थानिक समाधानहरू निर्माण गर्छु।',
    'playground_title': 'इन्जिनियरिङ खेल मैदान',
    'admin_login': 'प्रशासक लगइन',
    'contact_title': 'सम्पर्क स्थापना गर्नुहोस्',
    'contact_desc': 'GIS, ML, वा फुल-स्ट्याक इन्जिनियरिङको बारेमा छलफल गर्न सम्पर्क गर्नुहोस्।',
  }
};

export function initI18n() {
  let currentLang = localStorage.getItem('site_lang') || 'EN';
  
  const langToggleBtn = document.getElementById('lang-toggle');
  
  function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[lang] && dict[lang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
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

  // Apply initial
  applyTranslations(currentLang);

  // Toggle handler
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', (e) => {
      currentLang = currentLang === 'EN' ? 'NP' : 'EN';
      localStorage.setItem('site_lang', currentLang);
      applyTranslations(currentLang);
      
      // Play sound via ui.js if available
      if (window.playSound) window.playSound('click');
    });
  }
}
