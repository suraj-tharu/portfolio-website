import { useState, useEffect } from 'react';
import {
  motion, AnimatePresence, useScroll,
  useMotionValueEvent, useSpring, useMotionValue,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Moon, X, MapPin, Mail, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../context/LanguageContext';
import { useScrollSpy } from '../hooks/useScrollSpy';

/* --- SCROLL PROGRESS BAR -------------------------------------- */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[200]
        bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500"
    >
      <div style={{
        position: 'absolute', inset: 0, height: 6, top: -2,
        background: 'inherit', filter: 'blur(6px)', opacity: 0.6,
      }} />
    </motion.div>
  );
}

/* --- DESKTOP NAV LINK ----------------------------------------- */
function NavLink({
  href, label, isActive, isExternal, onClick,
}: {
  href: string; label: string; isActive: boolean;
  isExternal?: boolean; onClick?: () => void;
}) {
  const cls = `
    relative px-4 py-2 text-[13px] font-bold rounded-full transition-colors duration-300 select-none cursor-pointer font-jakarta
    ${isActive
      ? 'text-slate-900 dark:text-white'
      : 'text-slate-500 dark:text-white/55 hover:text-slate-900 dark:hover:text-white'
    }`;

  const inner = (
    <span className="relative z-10 flex items-center gap-1.5">
      {isActive && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 -z-10 rounded-full
            bg-slate-100 dark:bg-white/[0.08]
            border border-slate-200/80 dark:border-white/10"
          style={{
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.8 }}
        />
      )}
      {label}
      {isExternal && <ArrowUpRight size={12} className="opacity-40" />}
    </span>
  );

  if (isExternal || href.startsWith('/#') || href.startsWith('#')) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={href} className={cls} onClick={onClick}>
      {inner}
    </Link>
  );
}

/* --- FULLSCREEN MENU ------------------------------------------ */
function FullscreenMenu({
  navLinks, onClose, language, toggleLanguage,
}: {
  navLinks: { label: string; href: string; external?: boolean }[];
  onClose: () => void;
  language: string; toggleLanguage: () => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
      animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
      exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9998] flex flex-col overflow-hidden
        bg-white/95 dark:bg-[#06060e]/95 backdrop-blur-2xl"
      aria-modal="true" role="dialog" aria-label="Navigation menu"
    >
      {/* Decorative background orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px]
          bg-violet-300/30 dark:bg-violet-900/20" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full blur-[100px]
          bg-pink-300/20 dark:bg-pink-900/10" />
      </div>

      {/* Main nav links */}
      <nav className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 py-12">
        {navLinks.map((link, i) => (
          <div key={link.label} className="overflow-hidden group border-b border-slate-200/50 dark:border-white/5 last:border-0">
            <motion.div
              initial={{ y: '120%' }}
              animate={{ y: '0%' }}
              exit={{ y: '120%' }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: [0.76, 0, 0.24, 1] }}
            >
              {link.external || link.href.startsWith('/#') || link.href.startsWith('#') ? (
                <a href={link.href} onClick={onClose}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex items-center justify-between w-full py-4 sm:py-5 group/link"
                >
                  <motion.span
                    animate={{ x: hovered === i ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="font-syne font-black tracking-tight leading-none uppercase
                      text-[clamp(2.5rem,7vw,6rem)]
                      text-slate-900 dark:text-white
                      group-hover/link:text-transparent group-hover/link:bg-gradient-to-r
                      group-hover/link:from-violet-600 group-hover/link:to-pink-500
                      group-hover/link:bg-clip-text
                      dark:group-hover/link:from-violet-400 dark:group-hover/link:to-pink-400
                      transition-all duration-300"
                  >
                    {link.label}
                  </motion.span>
                  <span className="text-xs font-bold font-mono text-slate-400 dark:text-white/30 group-hover/link:text-violet-500 transition-colors">
                    0{i + 1}
                  </span>
                </a>
              ) : (
                <Link to={link.href} onClick={onClose}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex items-center justify-between w-full py-4 sm:py-5 group/link"
                >
                  <motion.span
                    animate={{ x: hovered === i ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="font-syne font-black tracking-tight leading-none uppercase
                      text-[clamp(2.5rem,7vw,6rem)]
                      text-slate-900 dark:text-white
                      group-hover/link:text-transparent group-hover/link:bg-gradient-to-r
                      group-hover/link:from-violet-600 group-hover/link:to-pink-500
                      group-hover/link:bg-clip-text
                      dark:group-hover/link:from-violet-400 dark:group-hover/link:to-pink-400
                      transition-all duration-300"
                  >
                    {link.label}
                  </motion.span>
                  <span className="text-xs font-bold font-mono text-slate-400 dark:text-white/30 group-hover/link:text-violet-500 transition-colors">
                    0{i + 1}
                  </span>
                </Link>
              )}
            </motion.div>
          </div>
        ))}
      </nav>

      {/* Footer / Meta info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-24 pb-8 pt-6
          flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6
          border-t border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/40 font-jakarta">
            <MapPin size={13} className="text-violet-500 shrink-0" />
            Nawalparasi West, Nepal
          </div>
          <a href="mailto:suraj.xaudhary@gmail.com"
            className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/40 font-jakarta
              hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            <Mail size={13} className="text-pink-500 shrink-0" />
            suraj.xaudhary@gmail.com
          </a>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-4">
          <button onClick={toggleLanguage}
            className="flex items-center gap-2 text-xs font-bold font-jakarta uppercase tracking-widest text-slate-600 dark:text-white/60 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Language: <span className="px-2 py-1 bg-slate-200/50 dark:bg-white/10 rounded-md">{language === 'en' ? 'NE' : 'EN'}</span>
          </button>
          
          <div className="flex gap-6">
            {[
              { label: 'LinkedIn',     href: 'https://www.linkedin.com/in/suraj-tharu/' },
              { label: 'GitHub',       href: 'https://github.com/suraj-tharu' },
              { label: 'ResearchGate', href: 'https://www.researchgate.net' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-[0.2em] font-jakarta
                  text-slate-400 dark:text-white/30
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

/* --- HAMBURGER ICON ------------------------------------------- */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col gap-[5px] w-5 items-end justify-center">
      <motion.span
        animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0, width: '100%' }}
        className="block h-[1.5px] bg-current rounded-full origin-center"
        style={{ width: '100%' }}
      />
      <motion.span
        animate={{ opacity: open ? 0 : 1, width: open ? '0%' : '70%' }}
        className="block h-[1.5px] bg-current rounded-full"
      />
      <motion.span
        animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0, width: '100%' }}
        className="block h-[1.5px] bg-current rounded-full origin-center"
        style={{ width: '100%' }}
      />
    </div>
  );
}

/* --- MAIN NAVBAR ---------------------------------------------- */
export default function Navbar() {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden]     = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  /* Clock */
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const navLinks: { label: string; href: string; external?: boolean }[] = [
    { label: t('nav.home'),        href: '#' },
    { label: t('nav.expertise'),   href: '#skills' },
    { label: t('nav.work'),        href: '/#work' },
    { label: t('nav.academia'),    href: '/#research' },
    { label: t('nav.learninghub'), href: '/learning-hub' },
    { label: t('nav.contact'),     href: '#contact' },
  ];

  /* Premium pill button class */
  const pillBtn = `
    flex items-center justify-center w-10 h-10 rounded-full
    border border-slate-200/60 dark:border-white/10
    bg-white/60 dark:bg-white/[0.03]
    text-slate-600 dark:text-white/60
    hover:bg-slate-100 dark:hover:bg-white/[0.08]
    hover:text-slate-900 dark:hover:text-white
    hover:border-slate-300 dark:hover:border-white/20
    transition-all duration-300 focus-visible:outline-none
    backdrop-blur-md
  `;

  return (
    <>
      <ScrollProgress />

      {/* -- TOP NAV BAR --------------------------------------- */}
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden:  { y: '-115%', opacity: 0 },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        role="navigation" aria-label="Main navigation"
        className={`
          fixed z-[9999] left-0 right-0 top-0
          flex items-center justify-between
          px-4 sm:px-6 lg:px-8 py-3
          transition-all duration-500 ease-out
          ${scrolled
            ? 'top-3 mx-4 sm:mx-6 lg:mx-auto max-w-[1100px] rounded-[2rem] border'
            : 'mx-0 rounded-none border-b shadow-none'
          }
          ${scrolled
            ? 'bg-white/70 dark:bg-[#06060e]/70 border-slate-200/80 dark:border-white/10'
            : 'bg-white/40 dark:bg-[#06060e]/30 border-slate-200/50 dark:border-white/5'
          }
        `}
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: scrolled
            ? theme === 'light'
              ? '0 10px 40px -10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
              : '0 10px 40px -10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
            : 'none',
        }}
      >
        {/* -- BRAND LOGO --------------------------------------- */}
        <a href="#" aria-label="Home" className="group flex items-center gap-3 shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center
            bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
          >
            <span className="font-syne font-black text-sm tracking-tighter">SC</span>
            {/* Hover sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out
              bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent" />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-[12px] font-bold font-jakarta text-slate-900 dark:text-white tracking-tight">
              Er. Suraj Tharu
            </span>
            <span className="text-[9px] font-bold font-syne uppercase tracking-[0.25em] text-slate-500 dark:text-white/40 mt-0.5">
              Chaudhary
            </span>
          </div>
        </a>

        {/* -- DESKTOP LINKS (Hidden on mobile) --------------- */}
        <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
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

        {/* -- RIGHT CONTROLS --------------------------------- */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Live Clock */}
          <div className="hidden xl:flex items-center gap-2 px-3 h-10 rounded-full border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold font-mono text-slate-500 dark:text-white/50">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} NPT
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={pillBtn}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -45, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 45, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            aria-label={language === 'en' ? 'Nepali' : 'English'}
            className={`hidden sm:flex text-[10px] font-black uppercase tracking-widest font-jakarta ${pillBtn}`}
          >
            {language === 'en' ? 'NE' : 'EN'}
          </button>

          {/* Hamburger Menu (Hidden on lg+ where desktop nav takes over) */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className={`lg:hidden relative z-[10000] ${pillBtn} ${isOpen ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <HamburgerIcon open={false} />
          </button>

          {/* Close Menu Button (Visible only when menu is open) */}
          <AnimatePresence>
            {isOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                onClick={() => setIsOpen(false)}
                className={`fixed top-3 right-4 sm:right-6 lg:right-8 z-[10000] ${pillBtn} !bg-white dark:!bg-[#06060e]`}
              >
                <X size={16} strokeWidth={2} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* -- FULLSCREEN OVERLAY MENU -------------------------- */}
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
