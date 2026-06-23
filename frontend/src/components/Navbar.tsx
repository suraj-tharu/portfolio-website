import { useState, useEffect } from 'react';
import {
  motion, AnimatePresence, useScroll,
  useMotionValueEvent, useSpring, useMotionValue,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Moon, X, MapPin, Mail, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../context/LanguageContext';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useSoundEffects } from '../hooks/useSoundEffects';

/* ══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════════════════ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[200]
        bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500"
    />
  );
}

/* ══════════════════════════════════════════════════════════
   DESKTOP NAV LINK (magnetic hover + spring underline)
══════════════════════════════════════════════════════════ */
function NavLink({
  href, label, isActive, isExternal, onClick, onHover,
}: {
  href: string; label: string; isActive: boolean;
  isExternal?: boolean; onClick?: () => void; onHover?: () => void;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 200, damping: 20 });
  const springY = useSpring(my, { stiffness: 200, damping: 20 });

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.3);
    my.set((e.clientY - r.top - r.height / 2) * 0.3);
    onHover?.();
  }
  function resetMouse() { mx.set(0); my.set(0); }

  const cls = `
    relative px-4 py-2 text-[13px] font-bold rounded-full transition-colors duration-150 select-none cursor-pointer
    ${isActive
      ? 'text-violet-700 dark:text-violet-300'
      : 'text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
    }`;

  const inner = (
    <motion.span
      style={{ x: springX, y: springY }}
      className="relative z-10 flex items-center gap-1"
    >
      {isActive && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 -z-10 rounded-full
            bg-gradient-to-r from-violet-100 to-purple-100
            dark:from-violet-500/20 dark:to-purple-500/20
            border border-violet-200/80 dark:border-violet-500/30
            shadow-[0_0_16px_rgba(124,58,237,0.15)] dark:shadow-[0_0_24px_rgba(124,58,237,0.3)]"
          transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        />
      )}
      {label}
      {isExternal && <ExternalLink size={10} className="opacity-40" />}
    </motion.span>
  );

  if (isExternal || href.startsWith('/#') || href.startsWith('#')) {
    return (
      <a href={href} className={cls}
        onMouseMove={handleMouse} onMouseLeave={resetMouse} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={href} className={cls}
      onMouseMove={handleMouse} onMouseLeave={resetMouse} onClick={onClick}>
      {inner}
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════
   FULLSCREEN OVERLAY MENU
══════════════════════════════════════════════════════════ */
function FullscreenMenu({
  navLinks, onClose, theme, toggleTheme, language, toggleLanguage,
}: {
  navLinks: { label: string; href: string; external?: boolean }[];
  onClose: () => void;
  theme: string; toggleTheme: () => void;
  language: string; toggleLanguage: () => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
      animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
      exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[98] flex flex-col overflow-hidden
        bg-white dark:bg-[#06060e]"
      aria-modal="true" role="dialog" aria-label="Navigation menu"
    >
      {/* ── Decorative background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient top-left orb */}
        <div className="absolute -top-24 -left-24 w-[600px] h-[600px] rounded-full blur-[180px]
          bg-violet-200/50 dark:bg-violet-900/40" />
        {/* Gradient bottom-right orb */}
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full blur-[160px]
          bg-pink-200/40 dark:bg-pink-900/30" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* ── Top bar inside menu ── */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 md:px-16 pt-5 pb-2">
        {/* Logo */}
        <a href="#" onClick={onClose}
          className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-violet-600 to-pink-600
              flex items-center justify-center">
              <span className="font-display italic font-black text-sm text-white">SC</span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white">Er. Suraj Tharu</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">Chaudhary</span>
          </div>
        </a>

        {/* Right controls row */}
        <div className="flex items-center gap-2">
          {/* Theme */}
          <button onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl
              border border-slate-200 dark:border-white/10
              bg-slate-50 dark:bg-white/5
              text-slate-600 dark:text-white/60
              hover:border-violet-400 hover:text-violet-700 dark:hover:text-violet-300
              transition-all duration-200"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme}
                initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </motion.span>
            </AnimatePresence>
          </button>
          {/* Language */}
          <button onClick={toggleLanguage}
            className="h-9 px-3 flex items-center justify-center rounded-xl
              border border-slate-200 dark:border-white/10
              bg-slate-50 dark:bg-white/5
              text-[11px] font-black uppercase tracking-widest
              text-slate-600 dark:text-white/60
              hover:border-violet-400 hover:text-violet-700 dark:hover:text-violet-300
              transition-all duration-200"
            aria-label="Toggle language"
          >
            {language === 'en' ? 'NE' : 'EN'}
          </button>
          {/* Close */}
          <motion.button
            initial={{ opacity: 0, scale: 0.7, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-xl
              border-2 border-slate-200 dark:border-white/15
              text-slate-700 dark:text-white
              hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/30
              transition-all duration-200"
          >
            <X size={16} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* ── Divider ── */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
        style={{ transformOrigin: 'left' }}
        className="mx-6 sm:mx-10 md:mx-16 h-px bg-gradient-to-r from-violet-300/60 via-pink-300/40 to-transparent dark:from-violet-700/50 dark:via-pink-700/30"
      />

      {/* ── Main nav links ── */}
      <nav className="relative z-10 flex-1 flex flex-col justify-center
        px-6 sm:px-10 md:px-16 py-6 overflow-hidden">
        {navLinks.map((link, i) => (
          <div key={link.label} className="overflow-hidden group border-b border-slate-100/80 dark:border-white/5 last:border-0">
            <motion.div
              initial={{ y: '120%' }}
              animate={{ y: '0%' }}
              exit={{ y: '120%' }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.065, ease: [0.76, 0, 0.24, 1] }}
            >
              {link.external || link.href.startsWith('/#') || link.href.startsWith('#') ? (
                <a href={link.href} onClick={onClose}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex items-center justify-between w-full py-3 sm:py-4 md:py-5 group/link"
                >
                  <motion.span
                    animate={{ x: hovered === i ? 16 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="font-display italic font-black tracking-tight leading-none
                      text-[clamp(1.8rem,5.5vw,5rem)]
                      text-slate-900 dark:text-white
                      group-hover/link:text-transparent group-hover/link:bg-gradient-to-r
                      group-hover/link:from-violet-600 group-hover/link:via-purple-600 group-hover/link:to-pink-600
                      group-hover/link:bg-clip-text
                      dark:group-hover/link:from-violet-400 dark:group-hover/link:via-purple-300 dark:group-hover/link:to-pink-400
                      transition-all duration-300"
                  >
                    {link.label}
                  </motion.span>
                  <div className="flex items-center gap-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-white/30">
                      0{i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center
                      bg-gradient-to-br from-violet-500 to-pink-500">
                      <ArrowUpRight size={14} className="text-white" />
                    </div>
                  </div>
                </a>
              ) : (
                <Link to={link.href} onClick={onClose}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex items-center justify-between w-full py-3 sm:py-4 md:py-5 group/link"
                >
                  <motion.span
                    animate={{ x: hovered === i ? 16 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="font-display italic font-black tracking-tight leading-none
                      text-[clamp(1.8rem,5.5vw,5rem)]
                      text-slate-900 dark:text-white
                      group-hover/link:text-transparent group-hover/link:bg-gradient-to-r
                      group-hover/link:from-violet-600 group-hover/link:via-purple-600 group-hover/link:to-pink-600
                      group-hover/link:bg-clip-text
                      dark:group-hover/link:from-violet-400 dark:group-hover/link:via-purple-300 dark:group-hover/link:to-pink-400
                      transition-all duration-300"
                  >
                    {link.label}
                  </motion.span>
                  <div className="flex items-center gap-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-white/30">
                      0{i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center
                      bg-gradient-to-br from-violet-500 to-pink-500">
                      <ArrowUpRight size={14} className="text-white" />
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        className="relative z-10 px-6 sm:px-10 md:px-16 pb-8 pt-5
          flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5
          border-t border-slate-100 dark:border-white/5"
      >
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/35 font-medium">
            <MapPin size={11} className="text-violet-500 shrink-0" />
            Nawalparasi West, Nepal
          </div>
          <a href="mailto:suraj.xaudhary@gmail.com"
            className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/35 font-medium
              hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
            <Mail size={11} className="text-violet-500 shrink-0" />
            suraj.xaudhary@gmail.com
          </a>
        </div>
        <div className="flex gap-5">
          {[
            { label: 'LinkedIn',     href: 'https://www.linkedin.com/in/suraj-tharu/' },
            { label: 'GitHub',       href: 'https://github.com/suraj-tharu' },
            { label: 'ResearchGate', href: 'https://www.researchgate.net' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="text-[11px] font-bold uppercase tracking-widest
                text-slate-400 dark:text-white/30
                hover:text-violet-600 dark:hover:text-violet-300
                transition-colors duration-200"
            >
              {s.label}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   CUSTOM HAMBURGER — 3 animated lines
══════════════════════════════════════════════════════════ */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col gap-[5px] w-5 items-end">
      <motion.span
        animate={{ rotate: open ? 45 : 0, y: open ? 9 : 0, width: '100%' }}
        className="block h-[2px] bg-current rounded-full origin-center"
        style={{ width: '100%' }}
      />
      <motion.span
        animate={{ opacity: open ? 0 : 1, width: open ? '0%' : '65%' }}
        className="block h-[2px] bg-current rounded-full"
      />
      <motion.span
        animate={{ rotate: open ? -45 : 0, y: open ? -9 : 0, width: '100%' }}
        className="block h-[2px] bg-current rounded-full origin-center"
        style={{ width: '100%' }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════════════════════════ */
export default function Navbar() {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden]     = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { theme, toggleTheme }         = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { playHover, playClick }        = useSoundEffects();
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

  /* Clock */
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const navLinks = [
    { label: t('nav.home'),        href: '#' },
    { label: t('nav.expertise'),   href: '#skills' },
    { label: t('nav.work'),        href: '/#work' },
    { label: t('nav.academia'),    href: '/#research' },
    { label: t('nav.learninghub'), href: '/learning-hub', external: true },
    { label: t('nav.contact'),     href: '#contact' },
  ];

  /* Pill control classes — reused across buttons */
  const pillBtn = `
    flex items-center justify-center rounded-xl
    border border-slate-200 dark:border-white/10
    bg-white/80 dark:bg-white/5
    text-slate-600 dark:text-white/55
    hover:bg-violet-50 dark:hover:bg-violet-900/25
    hover:border-violet-400/70 dark:hover:border-violet-500/50
    hover:text-violet-700 dark:hover:text-violet-300
    transition-all duration-200 focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-violet-500/50
  `;

  return (
    <>
      <ScrollProgress />

      {/* ── TOP BAR ─────────────────────────────────────── */}
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden:  { y: '-115%', opacity: 0 },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
        role="navigation" aria-label="Main navigation"
        className={`
          fixed z-[100] left-0 right-0 top-0
          flex items-center justify-between
          px-4 sm:px-5 py-2.5
          transition-all duration-500 ease-out
          ${scrolled
            ? 'top-2 mx-3 sm:mx-5 lg:mx-8 rounded-2xl shadow-2xl shadow-slate-200/60 dark:shadow-black/50 border'
            : 'mx-0 rounded-none border-b shadow-none'
          }
          ${scrolled
            ? 'bg-white/90 dark:bg-[#0b0b14]/90 border-slate-200/90 dark:border-white/8 backdrop-blur-3xl'
            : 'bg-white/60 dark:bg-transparent border-slate-100 dark:border-white/5 backdrop-blur-xl'
          }
        `}
      >
        {/* ── LOGO ─────────────────────────────────────── */}
        <a href="#" aria-label="Home"
          onMouseEnter={() => playHover()} onClick={() => playClick()}
          className="group flex items-center gap-2.5 shrink-0"
        >
          {/* Badge */}
          <div className="relative w-9 h-9 rounded-[10px] overflow-hidden shrink-0 shadow-[0_2px_12px_rgba(124,58,237,0.35)]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600
              group-hover:from-violet-500 group-hover:to-pink-500 transition-all duration-300" />
            {/* Shine */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_0%,transparent_60%)]" />
            <span className="absolute inset-0 flex items-center justify-center
              font-display italic font-black text-[13px] text-white leading-none z-10">
              SC
            </span>
          </div>
          {/* Name – visible on md+ */}
          <div className="hidden md:flex flex-col leading-none gap-0.5">
            <span className="text-[11px] font-black tracking-tight text-slate-900 dark:text-white">
              Er. Suraj Tharu
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-400">
              Chaudhary
            </span>
          </div>
        </a>

        {/* ── CENTER DESKTOP LINKS ─────────────────────── */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-0.5
            bg-slate-50/90 dark:bg-white/[0.04]
            border border-slate-200/80 dark:border-white/[0.07]
            rounded-full px-1.5 py-1 backdrop-blur-sm
            shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-none"
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
                  onHover={() => playHover()}
                  onClick={() => playClick()}
                />
              );
            })}
          </div>
        </div>

        {/* ── RIGHT CONTROLS ───────────────────────────── */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Live clock – md+ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="hidden md:flex items-center gap-2 h-9 px-3 rounded-xl
              border border-slate-200 dark:border-white/10
              bg-white/80 dark:bg-white/5"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>

          {/* Theme */}
          <button
            onClick={() => { playClick(); toggleTheme(); }}
            onMouseEnter={() => playHover()}
            aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className={`w-9 h-9 ${pillBtn}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme}
                initial={{ rotate: -30, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Language – hidden on xs */}
          <button
            onClick={() => { playClick(); toggleLanguage(); }}
            onMouseEnter={() => playHover()}
            aria-label={language === 'en' ? 'Nepali' : 'English'}
            className={`hidden sm:flex h-9 px-3 text-[10px] font-black uppercase tracking-widest ${pillBtn}`}
          >
            {language === 'en' ? 'NE' : 'EN'}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => { playClick(); setIsOpen(o => !o); }}
            onMouseEnter={() => playHover()}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className={`w-9 h-9 ${pillBtn}`}
          >
            <HamburgerIcon open={isOpen} />
          </button>
        </div>
      </motion.nav>

      {/* ── FULLSCREEN OVERLAY ───────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <FullscreenMenu
            navLinks={navLinks}
            onClose={() => setIsOpen(false)}
            theme={theme}
            toggleTheme={() => { playClick(); toggleTheme(); }}
            language={language}
            toggleLanguage={() => { playClick(); toggleLanguage(); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
