import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Moon, X, Menu, MapPin, Mail } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../context/LanguageContext';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useSoundEffects } from '../hooks/useSoundEffects';

/* ─────────────────────────────────────────────────────────
   Animated underline pill that slides between links
───────────────────────────────────────────────────────── */
function NavLink({
  href,
  label,
  isActive,
  isExternal,
  onClick,
  onHover,
}: {
  href: string;
  label: string;
  isActive: boolean;
  isExternal?: boolean;
  onClick?: () => void;
  onHover?: () => void;
}) {
  const cls = `relative px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 group
    ${isActive
      ? 'text-violet-700 dark:text-violet-300'
      : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
    }`;

  const inner = (
    <>
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full
            bg-violet-100 dark:bg-violet-500/15
            border border-violet-300/60 dark:border-violet-500/30
            shadow-[0_0_12px_rgba(124,58,237,0.12)] dark:shadow-[0_0_20px_rgba(124,58,237,0.25)]"
          transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </>
  );

  if (isExternal || href.startsWith('/#') || href.startsWith('#')) {
    return (
      <a href={href} className={cls} onMouseEnter={onHover} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={href} className={cls} onMouseEnter={onHover} onClick={onClick}>
      {inner}
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────
   Fullscreen overlay menu
───────────────────────────────────────────────────────── */
function FullscreenMenu({
  navLinks,
  onClose,
}: {
  navLinks: { label: string; href: string; external?: boolean }[];
  onClose: () => void;
}) {
  return (
    <motion.div
      key="fullscreen-menu"
      initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0.6 }}
      animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
      exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[98] bg-white dark:bg-[#07070f] flex flex-col overflow-hidden"
    >
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Background accent orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[150px] bg-violet-300/20 dark:bg-violet-800/30 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[150px] bg-pink-300/15 dark:bg-pink-900/25 pointer-events-none" />

      {/* Close row */}
      <div className="flex justify-end px-6 sm:px-10 pt-5">
        <motion.button
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          onClick={onClose}
          aria-label="Close menu"
          className="w-12 h-12 flex items-center justify-center rounded-full
            border border-slate-200 dark:border-white/10
            bg-slate-50 dark:bg-white/5
            text-slate-700 dark:text-white
            hover:bg-violet-50 dark:hover:bg-violet-900/30
            hover:border-violet-300 dark:hover:border-violet-600
            transition-all duration-300"
        >
          <X size={18} />
        </motion.button>
      </div>

      {/* Nav links — huge display text */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 md:px-20 lg:px-28">
        <div className="flex flex-col gap-1 sm:gap-0">
          {navLinks.map((link, i) => (
            <div key={link.label} className="overflow-hidden border-b border-slate-100 dark:border-white/8 last:border-0 py-1">
              <motion.div
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '110%', opacity: 0 }}
                transition={{ duration: 0.55, delay: 0.08 + i * 0.07, ease: [0.76, 0, 0.24, 1] }}
              >
                {link.external || link.href.startsWith('/#') || link.href.startsWith('#') ? (
                  <a
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-center justify-between py-3 sm:py-4 w-full
                      font-display italic font-black leading-none tracking-tight
                      text-[clamp(2.2rem,7vw,5.5rem)]
                      text-slate-900 dark:text-white
                      hover:text-violet-600 dark:hover:text-violet-300
                      transition-colors duration-300"
                  >
                    <span>{link.label}</span>
                    <span className="text-base font-normal font-sans not-italic tracking-widest
                      text-slate-400 dark:text-white/30
                      opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0
                      transition-all duration-300 hidden sm:inline">
                      0{i + 1}
                    </span>
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className="group flex items-center justify-between py-3 sm:py-4 w-full
                      font-display italic font-black leading-none tracking-tight
                      text-[clamp(2.2rem,7vw,5.5rem)]
                      text-slate-900 dark:text-white
                      hover:text-violet-600 dark:hover:text-violet-300
                      transition-colors duration-300"
                  >
                    <span>{link.label}</span>
                    <span className="text-base font-normal font-sans not-italic tracking-widest
                      text-slate-400 dark:text-white/30
                      opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0
                      transition-all duration-300 hidden sm:inline">
                      0{i + 1}
                    </span>
                  </Link>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="px-8 sm:px-14 md:px-20 lg:px-28 pb-10 pt-6
          flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
          border-t border-slate-100 dark:border-white/8"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 font-medium">
            <MapPin size={12} className="text-violet-500" />
            Nawalparasi West, Nepal
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 font-medium">
            <Mail size={12} className="text-violet-500" />
            suraj.xaudhary@gmail.com
          </div>
        </div>
        <div className="flex gap-3">
          {['LinkedIn', 'GitHub', 'ResearchGate'].map(s => (
            <a key={s} href="#"
              className="text-xs font-bold uppercase tracking-widest
                text-slate-400 dark:text-white/30
                hover:text-violet-600 dark:hover:text-violet-300
                transition-colors duration-200"
            >
              {s}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Navbar
───────────────────────────────────────────────────────── */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { playHover, playClick } = useSoundEffects();
  const [hidden, setHidden] = useState(false);
  const activeSection = useScrollSpy(['', 'skills', 'work', 'research', 'contact'], 300);

  /* Lock scroll when menu is open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  /* Hide on scroll down, show on scroll up */
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 120);
    setScrolled(latest > 20);
  });

  /* Live clock */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const navLinks = [
    { label: t('nav.home'),        href: '#' },
    { label: t('nav.expertise'),   href: '#skills' },
    { label: t('nav.work'),        href: '/#work' },
    { label: t('nav.academia'),    href: '/#research' },
    { label: t('nav.learninghub'), href: '/learning-hub', external: true },
    { label: t('nav.contact'),     href: '#contact' },
  ];

  return (
    <>
      {/* ── TOP BAR ─────────────────────────────────── */}
      <motion.nav
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: '-110%', opacity: 0 } }}
        animate={hidden && !isOpen ? 'hidden' : 'visible'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        role="navigation"
        aria-label="Main navigation"
        className={`
          fixed top-0 left-0 right-0 z-[100]
          transition-all duration-300 ease-in-out
          ${scrolled
            ? 'mx-3 sm:mx-6 mt-2 sm:mt-3 rounded-2xl border shadow-xl'
            : 'mx-0 mt-0 rounded-none border-b shadow-none'
          }
          ${scrolled
            ? 'bg-white/85 dark:bg-[#0c0c14]/85 border-slate-200/80 dark:border-white/10 shadow-slate-200/50 dark:shadow-black/30'
            : 'bg-white/70 dark:bg-transparent border-slate-100 dark:border-white/5'
          }
          backdrop-blur-2xl
          px-4 sm:px-5 py-3
          flex items-center justify-between gap-4
        `}
      >
        {/* ── LOGO ──────────────────────────────────── */}
        <a
          href="#"
          aria-label="Suraj Chaudhary – home"
          className="group flex items-center gap-3 shrink-0"
          onMouseEnter={() => playHover()}
          onClick={() => playClick()}
        >
          {/* Monogram badge */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
            <span className="absolute inset-0 bg-gradient-to-br from-violet-600 to-pink-600
              opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
            <span className="relative z-10 font-display italic font-black text-sm text-white leading-none">SC</span>
          </div>
          {/* Name — only large screens */}
          <span className="hidden xl:flex flex-col leading-tight">
            <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">Er. Suraj Tharu</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">Chaudhary</span>
          </span>
        </a>

        {/* ── CENTER DESKTOP LINKS ──────────────────── */}
        <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-0.5 rounded-full px-1.5 py-1
            bg-slate-50/80 dark:bg-white/5
            border border-slate-200/70 dark:border-white/8
            backdrop-blur-sm"
          >
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
                  onHover={playHover}
                  onClick={playClick}
                />
              );
            })}
          </div>
        </div>

        {/* ── RIGHT CONTROLS ────────────────────────── */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* Live clock */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full
              bg-slate-50 dark:bg-white/5
              border border-slate-200 dark:border-white/10"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-white/60 tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>

          {/* Theme toggle */}
          <button
            onClick={() => { playClick(); toggleTheme(); }}
            onMouseEnter={() => playHover()}
            aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="w-9 h-9 flex items-center justify-center rounded-xl
              border border-slate-200 dark:border-white/10
              bg-slate-50 dark:bg-white/5
              text-slate-600 dark:text-white/60
              hover:bg-violet-50 dark:hover:bg-violet-900/30
              hover:text-violet-700 dark:hover:text-violet-300
              hover:border-violet-300 dark:hover:border-violet-600
              transition-all duration-200"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Language toggle */}
          <button
            onClick={() => { playClick(); toggleLanguage(); }}
            onMouseEnter={() => playHover()}
            aria-label={language === 'en' ? 'Switch to Nepali' : 'Switch to English'}
            className="h-9 px-3 flex items-center justify-center rounded-xl
              border border-slate-200 dark:border-white/10
              bg-slate-50 dark:bg-white/5
              text-[11px] font-black uppercase tracking-widest
              text-slate-600 dark:text-white/60
              hover:bg-violet-50 dark:hover:bg-violet-900/30
              hover:text-violet-700 dark:hover:text-violet-300
              hover:border-violet-300 dark:hover:border-violet-600
              transition-all duration-200"
          >
            {language === 'en' ? 'NE' : 'EN'}
          </button>

          {/* Hamburger / Close */}
          <button
            onClick={() => { playClick(); setIsOpen(o => !o); }}
            onMouseEnter={() => playHover()}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="w-9 h-9 flex items-center justify-center rounded-xl
              border border-slate-200 dark:border-white/10
              bg-slate-50 dark:bg-white/5
              text-slate-700 dark:text-white/70
              hover:bg-violet-50 dark:hover:bg-violet-900/30
              hover:text-violet-700 dark:hover:text-violet-300
              hover:border-violet-300 dark:hover:border-violet-600
              transition-all duration-200"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={16} />
                </motion.span>
              ) : (
                <motion.span key="m" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* ── FULLSCREEN MENU ─────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <FullscreenMenu navLinks={navLinks} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
