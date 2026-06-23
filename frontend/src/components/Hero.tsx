import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { TextReveal } from './premium/TextReveal';
import { useLanguage } from '../context/LanguageContext';
import { useGreeting } from './GreetingBanner';
import { Sparkles, ArrowRight, MapPin } from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   Word flies up into place
───────────────────────────────────────────────────────── */
function RollingWord({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.span
      className="inline-block"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────────────────
   Role cycling with AnimatePresence
───────────────────────────────────────────────────────── */
function RoleBadge({ role }: { role: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={role}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="inline-block"
      >
        {role}
      </motion.span>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Hero
───────────────────────────────────────────────────────── */
export default function Hero() {
  const { t } = useLanguage();
  const greeting = useGreeting();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  const roles = [
    t('hero.role.engineer'),
    t('hero.role.educator'),
    t('hero.role.researcher'),
    t('hero.role.gis'),
  ];

  /* HLS video */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
    if (Hls.isSupported()) {
      const hls = new Hls({ startPosition: -1, capLevelToPlayerSize: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      hls.on(Hls.Events.ERROR, (_e, d) => {
        if (d.fatal) { hls.destroy(); if (video.parentElement) video.parentElement.style.opacity = '0'; }
      });
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => video.play().catch(() => {}));
    }
  }, []);

  /* Role rotation */
  useEffect(() => {
    const id = setInterval(() => setRoleIndex(p => (p + 1) % roles.length), 2500);
    return () => clearInterval(id);
  }, [roles.length]);

  /* Scroll parallax */
  const { scrollY } = useScroll();
  const yBg     = useTransform(scrollY, [0, 900], [0, 220]);
  const opacity = useTransform(scrollY, [0, 700], [1, 0]);

  const nameWords = ['Suraj', 'Tharu', 'Chaudhary'];

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── BACKGROUND ──────────────────────────────── */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">

        {/* Solid bg — white in light, near-black in dark */}
        <div className="absolute inset-0 bg-white dark:bg-[#09090f]" />

        {/* Subtle top radial tint */}
        <div className="absolute inset-0
          bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(139,92,246,0.08)_0%,transparent_70%)]
          dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(139,92,246,0.22)_0%,transparent_70%)]" />

        {/* Video overlay */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover
            -translate-x-1/2 -translate-y-1/2
            opacity-[0.04] dark:opacity-[0.15]
            mix-blend-multiply dark:mix-blend-screen"
        />

        {/* Soft orbs — visible in both modes */}
        <div className="absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full blur-[130px]
          bg-violet-300/40 dark:bg-violet-700/40 animate-blob" style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] rounded-full blur-[130px]
          bg-pink-300/30 dark:bg-pink-700/35 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[350px] h-[350px] rounded-full blur-[110px]
          bg-cyan-200/30 dark:bg-cyan-600/25 animate-blob" style={{ animationDelay: '4s' }} />

        {/* Bottom page-fade */}
        <div className="absolute inset-x-0 bottom-0 h-40
          bg-gradient-to-t from-white dark:from-[#09090f] to-transparent" />
      </motion.div>

      {/* ── CONTENT ─────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center px-5 sm:px-8 pt-24 pb-28">

        {/* Greeting pill */}
        {greeting && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-7"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full
              bg-violet-50 dark:bg-violet-950/60
              border border-violet-200 dark:border-violet-700/50
              shadow-sm dark:shadow-[0_0_24px_rgba(139,92,246,0.2)]
              backdrop-blur-sm"
            >
              <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-violet-700 dark:text-violet-300">
                {greeting}
              </span>
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-white/40 font-medium">
                — Welcome back
              </span>
            </div>
          </motion.div>
        )}

        {/* ── BIG NAME ──────────────────────────────── */}
        {/*
          NO webkit-fill tricks here — pure solid color with strong contrast.
          Light mode: very dark slate.  Dark mode: pure white.
          The gradient lives on a ::before pseudo-layer via inline style fallback.
        */}
        <h1 className="mb-5 leading-[0.88] tracking-tight">
          <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-0
            font-display italic font-black
            text-[clamp(3rem,11vw,8.5rem)]"
          >
            {nameWords.map((word, i) => (
              <span
                key={word}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 45%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 12px rgba(124,58,237,0.25))',
                }}
              >
                <RollingWord text={word} delay={0.25 + i * 0.16} />
              </span>
            ))}
          </div>
        </h1>

        {/* ── ROLE (light-adaptive) ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mb-2 text-xl sm:text-2xl md:text-3xl font-display font-bold italic
            text-violet-700 dark:text-violet-300
            min-h-[2.2rem]"
        >
          <RoleBadge role={roles[roleIndex]} />
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex items-center justify-center gap-1.5 mb-8
            text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300"
        >
          <MapPin size={13} className="text-violet-500 shrink-0" />
          {t('hero.location')}
        </motion.div>

        {/* ── DESCRIPTION ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="max-w-2xl mb-10
            text-base sm:text-lg font-medium leading-relaxed text-center
            text-slate-700 dark:text-slate-300"
        >
          <TextReveal
            text={t('hero.description')}
            delay={1.1}
            staggerDuration={0.025}
            splitBy="word"
          />
        </motion.div>

        {/* ── CTA BUTTONS ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.25 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          {/* Primary — solid gradient, always visible */}
          <motion.a
            href="#work"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="relative inline-flex items-center gap-2.5 rounded-full px-9 py-4
              text-base font-bold text-white
              bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600
              shadow-[0_6px_28px_rgba(124,58,237,0.4)]
              hover:shadow-[0_10px_40px_rgba(124,58,237,0.6)]
              transition-shadow duration-300 overflow-hidden"
          >
            <Sparkles size={16} className="shrink-0" />
            See Works
          </motion.a>

          {/* Secondary — visible border on both modes */}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2.5 rounded-full px-9 py-4
              text-base font-bold
              border-2 border-slate-300 dark:border-white/20
              text-slate-800 dark:text-white
              hover:border-violet-500 dark:hover:border-violet-400
              hover:text-violet-700 dark:hover:text-violet-300
              bg-white/50 dark:bg-white/5 backdrop-blur-md
              transition-all duration-300"
          >
            Reach out
            <ArrowRight size={15} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.a>
        </motion.div>

        {/* ── STATS STRIP ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="w-full max-w-lg mx-auto
            grid grid-cols-4 gap-4
            rounded-2xl p-5
            bg-white/70 dark:bg-white/5
            border border-slate-100 dark:border-white/10
            backdrop-blur-md
            shadow-sm dark:shadow-none"
        >
          {[
            { value: '5+',  label: 'Years Teaching' },
            { value: 'MSc', label: 'Info Systems' },
            { value: 'GIS', label: 'Spatial Analysis' },
            { value: 'ML',  label: 'Machine Learning' },
          ].map(({ value, label }, i) => (
            <div key={label} className={`flex flex-col items-center gap-1 ${i < 3 ? 'border-r border-slate-200 dark:border-white/10' : ''}`}>
              <span className="text-lg sm:text-2xl font-black font-display italic text-violet-700 dark:text-violet-300">
                {value}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400 text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── SCROLL INDICATOR ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[9px] uppercase tracking-[0.28em] font-semibold text-slate-400 dark:text-white/30">
          Scroll
        </span>
        <div className="w-px h-10 bg-slate-200 dark:bg-white/15 relative overflow-hidden rounded-full">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 bg-violet-500 rounded-full"
            animate={{ y: ['0%', '200%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
