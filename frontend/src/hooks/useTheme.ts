import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

// Global state
let currentTheme: Theme = 'dark';
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') {
    currentTheme = stored;
  } else {
    currentTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
}

const listeners = new Set<(theme: Theme) => void>();

const setGlobalTheme = (newTheme: Theme) => {
  currentTheme = newTheme;
  
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  }
  
  listeners.forEach(listener => listener(newTheme));
};

// Initialize DOM once on module load
if (typeof window !== 'undefined') {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(currentTheme);
  
  window.addEventListener('toggleTheme', () => {
    setGlobalTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  const prefersColorScheme = window.matchMedia('(prefers-color-scheme: light)');
  prefersColorScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setGlobalTheme(e.matches ? 'light' : 'dark');
    }
  });
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  useEffect(() => {
    // Sync local state if global changed before mount
    if (theme !== currentTheme) {
      setTheme(currentTheme);
    }
    
    listeners.add(setTheme);
    return () => {
      listeners.delete(setTheme);
    };
  }, [theme]);

  const toggleTheme = () => {
    setGlobalTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme, setTheme: setGlobalTheme };
}
