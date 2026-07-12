import { useEffect } from 'react';

/**
 * Enhanced Theme Animations Hook
 * Suggestion #8: Dark/Light Theme Animations with smooth transitions
 */

export const useThemeAnimation = () => {
    useEffect(() => {
        // Create a style element for smooth transitions
        const style = document.createElement('style');
        style.textContent = `
      /* Smooth color transitions for theme changes - targeted approach */
      body, [class*="bg-"], [class*="text-"] {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }

      /* Prevent transitions on page load */
      body.prefers-reduced-motion * {
        transition: none !important;
      }

      /* Smooth shadow transitions */
      [class*="shadow"] {
        transition: box-shadow 0.2s ease;
      }

      /* Animate theme toggle button */
      .theme-toggle-btn {
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
      }

      .theme-toggle-btn:hover {
        transform: rotate(20deg) scale(1.1);
      }

      /* Glassmorphism enhancement */
      .glass-effect {
        background: rgba(var(--text-base-rgb), 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(var(--text-base-rgb), 0.2);
      }

      .glass-effect.dark {
        background: rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(var(--text-base-rgb), 0.1);
      }

      /* Micro-interactions - better performance */
      button:not([class*="motion"]) {
        position: relative;
        overflow: hidden;
      }

      button:not([class*="motion"])::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(var(--text-base-rgb), 0.3);
        transform: translate(-50%, -50%);
        pointer-events: none;
      }

      button:not([class*="motion"]):active::before {
        animation: ripple 0.6s ease-out;
      }

      @keyframes ripple {
        0% {
          width: 0;
          height: 0;
          opacity: 1;
        }
        100% {
          width: 300px;
          height: 300px;
          opacity: 0;
        }
      }

      /* Smooth page transition */
      [data-page-transition] {
        animation: fadeInUp 0.6s ease-out;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Enhanced focus states */
      a:focus-visible,
      button:focus-visible,
      input:focus-visible {
        outline: 2px solid var(--brand-light);
        outline-offset: 2px;
        border-radius: 4px;
      }

      /* Prevent animation jank on FAB and sections */
      [class*="fixed"] {
        will-change: auto;
        backface-visibility: hidden;
      }

      /* Smooth section transitions */
      section {
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
    `;
        document.head.appendChild(style);

        // Detect system color scheme preference
        const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const handleColorSchemeChange = (e: MediaQueryListEvent) => {
            const isDark = e.matches;
            if (!localStorage.getItem('theme')) {
                // Dispatch event so global useTheme can catch it if needed, or just let useTheme handle it
                // We shouldn't manually toggle 'dark' here as it bypasses the global React state
                const root = document.documentElement;
                root.classList.remove('light', 'dark');
                root.classList.add(isDark ? 'dark' : 'light');
            }
        };

        prefersColorScheme.addEventListener('change', handleColorSchemeChange);

        return () => {
            prefersColorScheme.removeEventListener('change', handleColorSchemeChange);
            document.head.removeChild(style);
        };
    }, []);
};

/**
 * Smooth page transition utility
 * Suggestion #6: Smooth Page Transitions
 */
export const usePageTransition = () => {
    useEffect(() => {
        // Mark page content for transition animation
        const content = document.querySelector('main') || document.querySelector('[role="main"]');
        if (content) {
            content.setAttribute('data-page-transition', '');
        }

        return () => {
            if (content) {
                content.removeAttribute('data-page-transition');
            }
        };
    }, []);
};

/**
 * Micro-interactions utilities
 * Suggestion #7: Micro-interactions
 */

export const createRippleEffect = (event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
};

/**
 * Scroll-spy for navbar highlighting
 * Suggestion #7: Micro-interactions - Scroll-spy
 */
export const useScrollSpy = () => {
    useEffect(() => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        const handleScroll = () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = (section as HTMLElement).offsetTop;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id') || '';
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active', 'text-brand-light');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active', 'text-brand-light');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
};
