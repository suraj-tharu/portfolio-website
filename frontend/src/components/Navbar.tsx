import { useState, useEffect } from 'react';
import {
  motion, AnimatePresence, useScroll,
  useMotionValueEvent, useSpring,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Moon, X, MapPin, Mail, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../context/LanguageContext';
import { useScrollSpy } from '../hooks/useScrollSpy';

/* ═══════════════════════════════════════════════════════════════════
   SCROLL PROGRESS — single 1px gradient line
═══════════════════════════════════════════════════════════════════ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[1.5px] z-[10001]"
    >
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(90deg, #8B5CF6, #A78BFA, #C4B5FD)',
      }} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DESKTOP NAV LINK — elegant underline reveal
═══════════════════════════════════════════════════════════════════ */
function NavLink({
  href, label, isActive, isExternal, onClick,
}: {
  href: string; label: string; isActive: boolean;
  isExternal?: boolean; onClick?: () => void;
}) {
  const inner = (
    <span className="relative py-1.5 flex items-center gap-1">
      <span className={`
        text-[13px] font-medium tracking-[-0.01em] transition-colors duration-300 whitespace-nowrap
        ${isActive
          ? 'text-slate-900 dark:text-white'
          : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white/80'
        }
      `}>
        {label}
      </span>
      {isExternal && <ArrowUpRight size={11} className="opacity-30" />}
      {/* Active underline */}
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute -bottom-0.5 left-0 right-0 h-[1.5px]"
          style={{
            background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)',
            borderRadius: 999,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
        />
      )}
    </span>
  );

  const cls = "relative select-none cursor-pointer px-3";

  if (isExternal || href.startsWith('/#') || href.startsWith('#')) {
    return <a href={href} className={cls} onClick={onClick}>{inner}</a>;
  }
  return <Link to={href} className={cls} onClick={onClick}>{inner}</Link>;
}

/* ═══════════════════════════════════════════════════════════════════
   FULLSCREEN MENU — refined immersive overlay
═══════════════════════════════════════════════════════════════════ */
function FullscreenMenu({
  navLinks, onClose, language, toggleLanguage,
}: {
  navLinks: { label: string; href: string; external?: boolean }[];
  onClose: () => void;
  language: string; toggleLanguage: () => void;
}) {
  return (
    <motion.div
      initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
      animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
      exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9998] flex flex-col overflow-hidden
        bg-white dark:bg-[#050508]"
      aria-modal="true" role="dialog" aria-label="Navigation menu"
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Single ambient orb */}
      <div className="absolute top-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full blur-[150px]
        bg-violet-200/30 dark:bg-violet-900/15 pointer-events-none z-0" />

      {/* Navigation links */}
      <nav className="relative z-10 flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-32">
        {navLinks.map((link, i) => (
          <div key={link.label} className="overflow-hidden border-b border-slate-200/40 dark:border-white/[0.04] last:border-0">
            <motion.div
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              exit={{ y: '110%' }}
              transition={{ duration: 0.6, delay: 0.08 + i * 0.04, ease: [0.76, 0, 0.24, 1] }}
            >
              {(link.external || link.href.startsWith('/#') || link.href.startsWith('#')) ? (
                <a href={link.href} onClick={onClose}
                  className="group flex items-baseline justify-between w-full py-5 sm:py-6"
                >
                  <span className="font-syne font-extrabold tracking-tight leading-none
                    text-[clamp(2rem,6vw,4.5rem)]
                    text-slate-900 dark:text-white/90
                    group-hover:text-violet-600 dark:group-hover:text-violet-400
                    transition-colors duration-300">
                    {link.label}
                  </span>
                  <span className="text-[11px] font-mono font-medium text-slate-300 dark:text-white/15
                    group-hover:text-violet-400 dark:group-hover:text-violet-500 transition-colors">
                    0{i + 1}
                  </span>
                </a>
              ) : (
                <Link to={link.href} onClick={onClose}
                  className="group flex items-baseline justify-between w-full py-5 sm:py-6"
                >
                  <span className="font-syne font-extrabold tracking-tight leading-none
                    text-[clamp(2rem,6vw,4.5rem)]
                    text-slate-900 dark:text-white/90
                    group-hover:text-violet-600 dark:group-hover:text-violet-400
                    transition-colors duration-300">
                    {link.label}
                  </span>
                  <span className="text-[11px] font-mono font-medium text-slate-300 dark:text-white/15
                    group-hover:text-violet-400 dark:group-hover:text-violet-500 transition-colors">
                    0{i + 1}
                  </span>
                </Link>
              )}
            </motion.div>
          </div>
        ))}
      </nav>

      {/* Footer meta */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="relative z-10 px-8 sm:px-12 md:px-20 lg:px-32 pb-8 pt-6
          flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5
          border-t border-slate-200/40 dark:border-white/[0.04]"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-white/30 font-body">
            <MapPin size={12} className="text-violet-500/70 shrink-0" />
            Nawalparasi West, Nepal
          </div>
          <a href="mailto:suraj.xaudhary@gmail.com"
            className="flex items-center gap-2 text-xs text-slate-400 dark:text-white/30 font-body
              hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            <Mail size={12} className="text-violet-500/70 shrink-0" />
            suraj.xaudhary@gmail.com
          </a>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-4">
          <button onClick={toggleLanguage}
            className="flex items-center gap-2 text-[10px] font-semibold font-body uppercase tracking-[0.2em]
              text-slate-500 dark:text-white/40 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Language
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/[0.06] rounded text-[10px] font-bold
              border border-slate-200/60 dark:border-white/[0.08]">
              {language === 'en' ? 'NE' : 'EN'}
            </span>
          </button>
          
          <div className="flex gap-6">
            {[
              { label: 'LinkedIn',     href: 'https://www.linkedin.com/in/suraj-tharu/' },
              { label: 'GitHub',       href: 'https://github.com/suraj-tharu' },
              { label: 'ResearchGate', href: 'https://www.researchgate.net' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="text-[10px] font-medium uppercase tracking-[0.15em] font-body
                  text-slate-300 dark:text-white/20
                  hover:text-violet-600 dark:hover:text-violet-400
                  transition-colors duration-200"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HAMBURGER ICON — precise 3-line morph
═══════════════════════════════════════════════════════════════════ */
function HamburgerIcon() {
  return (
    <div className="flex flex-col gap-[5px] w-[18px] items-end justify-center">
      <span className="block h-[1.5px] w-full bg-current rounded-full" />
      <span className="block h-[1.5px] w-[70%] bg-current rounded-full" />
      <span className="block h-[1.5px] w-full bg-current rounded-full" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN NAVBAR
═══════════════════════════════════════════════════════════════════ */
export default function Navbar() {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden]     = useState(false);

  const { theme, toggleTheme }         = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const activeSection = useScrollSpy(['', 'skills', 'work', 'research', 'contact'], 300);

  /* Scroll lock */
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : 'auto'; }, [isOpen]);

  /* Hide / show on scroll */
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 140 && !isOpen);
    setScrolled(latest > 24);
  });

  const navLinks: { label: string; href: string; external?: boolean }[] = [
    { label: t('nav.home'),        href: '#' },
    { label: t('nav.expertise'),   href: '#skills' },
    { label: t('nav.work'),        href: '/#work' },
    { label: t('nav.academia'),    href: '/#research' },
    { label: t('nav.learninghub'), href: '/learning-hub' },
    { label: t('nav.contact'),     href: '#contact' },
  ];

  /* Minimal control button */
  const controlBtn = `
    flex items-center justify-center w-9 h-9 rounded-full
    text-slate-500 dark:text-white/50
    hover:text-slate-900 dark:hover:text-white
    hover:bg-slate-100/80 dark:hover:bg-white/[0.06]
    transition-all duration-200 focus-visible:outline-none
  `;

  return (
    <>
      <ScrollProgress />

      {/* ── TOP NAV BAR ─────────────────────────────────────── */}
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden:  { y: '-110%', opacity: 0 },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        role="navigation" aria-label="Main navigation"
        className={`
          fixed z-[9999] left-0 right-0
          flex items-center justify-between
          transition-all duration-500 ease-out
          ${scrolled
            ? 'top-3 mx-4 sm:mx-6 lg:mx-auto max-w-[1080px] rounded-full px-5 sm:px-6 py-2.5 border'
            : 'top-0 mx-0 rounded-none px-5 sm:px-8 lg:px-12 py-4 border-b'
          }
          ${scrolled
            ? 'bg-white/75 dark:bg-[#050508]/75 border-slate-200/60 dark:border-white/[0.06]'
            : 'bg-transparent border-transparent'
          }
        `}
        style={{
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          boxShadow: scrolled
            ? theme === 'light'
              ? '0 4px 30px -8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)'
              : '0 4px 30px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)'
            : 'none',
        }}
      >
        {/* ── BRAND ─────────────────────────────────────────── */}
        <a href="#" aria-label="Home" className="group flex items-center gap-3 shrink-0">
          {/* Monogram */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center
            bg-slate-900 dark:bg-white shrink-0 relative overflow-hidden">
            <span className="font-syne font-extrabold text-[13px] text-white dark:text-slate-900 tracking-tighter relative z-10">
              SC
            </span>
            {/* Hover sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full
              transition-transform duration-700 ease-in-out
              bg-gradient-to-r from-transparent via-white/15 dark:via-black/10 to-transparent" />
          </div>
          {/* Name — hidden on small screens */}
          <div className="hidden sm:flex flex-col leading-none gap-0.5">
            <span className="text-[12px] font-semibold text-slate-900 dark:text-white tracking-[-0.02em] font-body">
              Er. Suraj Tharu
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 font-body">
              Chaudhary
            </span>
          </div>
        </a>

        {/* ── DESKTOP LINKS ─────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(link => {
            const id = link.href.startsWith('/#')
              ? link.href.replace('/#', '')
              : link.href.replace('#', '');
            return (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                isActive={activeSection === id}
                isExternal={link.external}
              />
            );
          })}
        </div>

        {/* ── RIGHT CONTROLS ────────────────────────────────── */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={controlBtn}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                className="flex"
                initial={{ rotate: -30, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            aria-label={language === 'en' ? 'Switch to Nepali' : 'Switch to English'}
            className={`hidden sm:flex text-[10px] font-bold uppercase tracking-[0.15em] font-body ${controlBtn}`}
          >
            {language === 'en' ? 'NE' : 'EN'}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className={`lg:hidden ${controlBtn} ${isOpen ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <HamburgerIcon />
          </button>

          {/* Close button — appears when menu is open */}
          <AnimatePresence>
            {isOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="fixed top-4 right-5 sm:right-8 lg:right-12 z-[10000]
                  w-10 h-10 rounded-full flex items-center justify-center
                  bg-slate-100 dark:bg-white/[0.08]
                  text-slate-600 dark:text-white/70
                  hover:bg-slate-200 dark:hover:bg-white/[0.12]
                  transition-colors"
              >
                <X size={16} strokeWidth={2} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* ── FULLSCREEN OVERLAY MENU ────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <FullscreenMenu
            navLinks={navLinks}
            onClose={() => setIsOpen(false)}
            language={language}
            toggleLanguage={toggleLanguage}
          />
        )}
      </AnimatePresence>
    </>
  );
}
