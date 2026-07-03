import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ScrollProgress — luxury vertical chapter navigation.
 * Appears on the right edge of the screen. As the user scrolls,
 * section indicators light up with gradient fills and labels
 * slide in. Like a premium editorial magazine's chapter nav.
 */

const SECTIONS = [
  { id: 'hero',           label: 'Home' },
  { id: 'academic',       label: 'Timeline' },
  { id: 'skills',         label: 'Skills' },
  { id: 'about',          label: 'About' },
  { id: 'teaching',       label: 'Teaching' },
  { id: 'work',           label: 'Projects' },
  { id: 'research',       label: 'Research' },
  { id: 'explorations',   label: 'Explorations' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'awards',         label: 'Awards' },
  { id: 'testimonials',   label: 'Testimonials' },
  { id: 'stats',          label: 'Stats' },
  { id: 'contact',        label: 'Contact' },
];

export default function ScrollProgress() {
  const [active, setActive] = useState('hero');
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Show after scrolling a bit
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for active section
  useEffect(() => {
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeIdx = SECTIONS.findIndex((s) => s.id === active);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Page sections"
          className="fixed right-4 top-1/2 -translate-y-1/2 z-[90] hidden lg:flex flex-col items-end gap-1.5"
        >
          {SECTIONS.map((section, idx) => {
            const isActive = section.id === active;
            const isPast = idx < activeIdx;

            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                title={section.label}
                className="group flex items-center gap-2.5 focus:outline-none"
              >
                {/* Label — slides in on hover */}
                <AnimatePresence>
                  {hovered && (
                    <motion.span
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ duration: 0.2, delay: idx * 0.015 }}
                      className="text-[10px] font-bold uppercase tracking-[0.15em] font-syne whitespace-nowrap"
                      style={{
                        color: isActive ? '#a78bfa' : 'rgba(255,255,255,0.25)',
                        textShadow: isActive ? '0 0 12px rgba(167,139,250,0.6)' : 'none',
                      }}
                    >
                      {section.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Dot / pip */}
                <motion.div
                  animate={{
                    width: isActive ? 28 : isPast ? 12 : 6,
                    height: isActive ? 6 : 3,
                    opacity: isActive ? 1 : isPast ? 0.5 : 0.2,
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    borderRadius: 999,
                    background: isActive
                      ? 'linear-gradient(90deg, #7c3aed, #f472b6, #38bdf8)'
                      : isPast
                      ? 'rgba(167,139,250,0.5)'
                      : 'rgba(255,255,255,0.15)',
                    boxShadow: isActive
                      ? '0 0 10px rgba(124,58,237,0.6), 0 0 20px rgba(244,114,182,0.3)'
                      : 'none',
                    flexShrink: 0,
                  }}
                />
              </button>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
