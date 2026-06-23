import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Moon, X, Menu } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../context/LanguageContext';
import { MagneticWrapper } from './premium/MagneticWrapper';
import { useScrollSpy } from '../hooks/useScrollSpy';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const activeSection = useScrollSpy(['', 'skills', 'work', 'research', 'contact'], 300);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { label: t('nav.home'), href: '#' },
    { label: t('nav.expertise'), href: '#skills' },
    { label: t('nav.work'), href: '/#work' },
    { label: t('nav.academia'), href: '/#research' },
    { label: t('nav.learninghub'), href: '/learning-hub', external: true },
    { label: t('nav.contact'), href: '#contact' }
  ];

  const menuVars: Variants = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1, transition: { duration: 0.7, ease: [0.12, 0, 0.39, 0] } },
    exit: { scaleY: 0, transition: { duration: 0.7, ease: [0.12, 0, 0.39, 1] } }
  };

  const linkVars: Variants = {
    initial: { y: "30vh", transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] } },
    open: { y: 0, transition: { duration: 0.7, ease: [0, 0.55, 0.45, 1] } }
  };

  const containerVars: Variants = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.3, staggerChildren: 0.09, staggerDirection: 1 } }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.nav 
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-4 md:top-6 left-0 right-0 z-[100] px-4 md:px-6 flex justify-between items-center"
        role="navigation" aria-label="Main navigation"
      >
        {/* Left — Logo */}
        <a href="#" className="pointer-events-auto group relative w-11 h-11 flex items-center justify-center rounded-full overflow-hidden shrink-0 transition-transform hover:scale-110 glass shadow-lg-premium border border-stroke" aria-label="Suraj Chaudhary - Portfolio Home" title="Go to homepage">
          <div className="absolute inset-0 bg-brand-500 opacity-20 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700" />
          <div className="absolute inset-[2px] bg-bg rounded-full flex items-center justify-center">
            <span className="font-display italic text-base text-text-primary">SC</span>
          </div>
        </a>

        {/* Center — Desktop Navigation Pills */}
        <div className="hidden lg:flex items-center gap-1 glass shadow-lg-premium border border-stroke rounded-full px-2 py-1 pointer-events-auto absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const sectionId = link.href.startsWith('/#') ? link.href.replace('/#', '') : link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.label}
                href={link.href}
                className="relative px-3 py-1.5 rounded-full text-sm font-medium transition-colors group"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-brand-500/10 border border-brand-500/30 rounded-full z-0 shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? 'text-brand-light font-semibold' : 'text-text-secondary group-hover:text-text-primary'}`}>
                  {link.label}
                </span>
              </a>
            );
          })}
        </div>

        {/* Right — Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Live Clock */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass shadow-lg-premium border border-stroke hover:border-brand-500/40 transition-all"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            <span className="text-xs font-bold text-text-secondary">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>

          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full glass shadow-lg-premium border border-stroke hover:border-brand-500/50 text-text-secondary hover:text-brand-light transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-bg"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          </button>

          <button
            onClick={toggleLanguage}
            className="w-10 h-10 flex items-center justify-center rounded-full glass shadow-lg-premium border border-stroke hover:border-brand-500/50 font-semibold text-xs text-text-secondary hover:text-brand-light transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-bg"
            aria-label={language === 'en' ? 'Switch to Nepali' : 'Switch to English'}
            title="Toggle Language"
          >
            {language === 'en' ? 'NE' : 'EN'}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full glass shadow-lg-premium border border-stroke hover:border-brand-500/50 text-text-secondary hover:text-brand-light transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-bg"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? <X size={18} className="group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" /> : <Menu size={18} className="group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />}
          </button>
        </div>
      </motion.nav>

      {/* Full Screen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            id="mobile-nav"
            role="navigation"
            aria-label="Mobile navigation menu"
            className="fixed inset-0 bg-[#050505] z-[98] origin-top text-white flex flex-col justify-center px-6 sm:px-8 md:px-24 pointer-events-auto overflow-y-auto overflow-x-hidden pt-24 pb-12"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none mix-blend-screen" />

            <motion.div variants={containerVars} initial="initial" animate="open" exit="initial" className="flex flex-col gap-2 sm:gap-3 md:gap-4 flex-grow justify-center">
              {navLinks.map((link, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.div variants={linkVars}>
                    {link.external || link.href.startsWith('/#') || link.href.startsWith('#') ? (
                      <MagneticWrapper>
                        <a
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="font-display italic leading-tight tracking-tight hover:text-[var(--brand)] hover:translate-x-3 md:hover:translate-x-6 transition-all duration-300 inline-block focus:outline-none focus:ring-2 focus:ring-brand rounded px-2 py-1 break-words max-w-full text-[24px]"
                        >
                          {link.label}
                        </a>
                      </MagneticWrapper>
                    ) : (
                      <MagneticWrapper>
                        <Link
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className="font-display italic leading-tight tracking-tight hover:text-[var(--brand)] hover:translate-x-3 md:hover:translate-x-6 transition-all duration-300 inline-block focus:outline-none focus:ring-2 focus:ring-brand rounded px-2 py-1 break-words max-w-full text-[24px]"
                        >
                          {link.label}
                        </Link>
                      </MagneticWrapper>
                    )}
                  </motion.div>
                </div>
              ))}
            </motion.div>

            {/* Footer info in nav */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-end text-muted text-xs sm:text-sm border-t border-stroke/50 pt-4 gap-4"
            >
              <div>
                <p>Nawalparasi West, Nepal</p>
                <p>suraj.xaudhary@gmail.com</p>
              </div>
              <div className="flex gap-4">
                <a href="#" className="hover:text-brand-light transition-colors focus:outline-none focus:ring-2 focus:ring-brand rounded px-2 py-1">LinkedIn</a>
                <a href="#" className="hover:text-brand-light transition-colors focus:outline-none focus:ring-2 focus:ring-brand rounded px-2 py-1">GitHub</a>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
