import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { TextReveal } from './premium/TextReveal';
import { useLanguage } from '../context/LanguageContext';
import { useGreeting } from './GreetingBanner';
import { Sparkles, ArrowRight, MapPin } from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   Animated counter digit – rolls like an odometer
───────────────────────────────────────────────────────── */
function RollingWord({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.span
      className="inline-block"
      initial={{ y: 80, opacity: 0, rotateX: -40 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────────────────
   Role cycling badge
───────────────────────────────────────────────────────── */
function RoleBadge({ role }: { role: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={role}
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="inline-block font-semibold italic"
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
  const yBg      = useTransform(scrollY, [0, 900], [0, 280]);
  const opacity  = useTransform(scrollY, [0, 700], [1, 0]);

  const nameWords = ['Suraj', 'Tharu', 'Chaudhary'];

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Background layer ───────────────────────── */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        {/* Base gradient – adapts to light/dark */}
        <div className="absolute inset-0 transition-colors duration-500
          bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.12)_0%,transparent_60%),linear-gradient(180deg,#f8f7ff_0%,#f0ecff_100%)]
          dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.25)_0%,transparent_60%),linear-gradient(180deg,#08060f_0%,#0d0a1a_100%)]
        " />

        {/* Video */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover
            -translate-x-1/2 -translate-y-1/2 opacity-10 dark:opacity-20
            mix-blend-multiply dark:mix-blend-screen transition-opacity duration-1000"
        />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-48
          bg-gradient-to-t from-[#f0ecff] dark:from-[#08060f] to-transparent" />

        {/* Animated orbs */}
        <div className="absolute -top-40 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30
          bg-violet-400 dark:bg-violet-700 animate-blob" style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-25
          bg-pink-400 dark:bg-pink-700 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]
          rounded-full blur-[100px] opacity-20 bg-cyan-400 dark:bg-cyan-600 animate-blob" style={{ animationDelay: '4s' }} />
      </motion.div>

      {/* ── Content ────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-8 pt-20 pb-24 w-full max-w-5xl mx-auto">

        {/* ── Greeting pill ───────────────────────── */}
        {greeting && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full
              bg-white/70 dark:bg-white/8
              border border-violet-200 dark:border-violet-500/30
              shadow-[0_2px_20px_rgba(139,92,246,0.15)] dark:shadow-[0_0_30px_rgba(139,92,246,0.25)]
              backdrop-blur-md
            ">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.9)]" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-violet-700 dark:text-violet-300">
                {greeting}
              </span>
              <span className="text-xs text-slate-500 dark:text-white/40 font-medium">• Welcome back</span>
            </div>
          </motion.div>
        )}

        {/* ── Name ────────────────────────────────── */}
        <h1 className="relative mb-4 [perspective:800px]">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1
            text-[clamp(3.5rem,12vw,9rem)]
            font-display italic font-black leading-[0.85] tracking-tight"
          >
            {nameWords.map((word, i) => (
              <span
                key={word}
                className="inline-block gradient-text-premium drop-shadow-[0_4px_24px_rgba(139,92,246,0.3)]"
              >
                <RollingWord text={word} delay={0.3 + i * 0.18} />
              </span>
            ))}
          </div>

          {/* Glow behind name */}
          <div className="absolute inset-0 -z-10 blur-3xl opacity-20 dark:opacity-40
            bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 rounded-full scale-75 translate-y-4" />
        </h1>

        {/* ── Role + Location ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mb-5 flex flex-col items-center gap-2"
        >
          {/* Animated role */}
          <div className="text-xl sm:text-2xl md:text-3xl font-display text-transparent
            bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500
            dark:from-violet-400 dark:via-pink-400 dark:to-orange-400
            bg-clip-text min-h-[2rem]"
          >
            <RoleBadge role={roles[roleIndex]} />
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm sm:text-base text-slate-600 dark:text-white/50 font-medium">
            <MapPin size={13} className="text-violet-500 shrink-0" />
            {t('hero.location')}
          </div>
        </motion.div>

        {/* ── Description ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05 }}
          className="max-w-xl mb-10 text-base sm:text-lg text-slate-700 dark:text-white/70 font-medium leading-relaxed text-center"
        >
          <TextReveal
            text={t('hero.description')}
            delay={1.2}
            staggerDuration={0.028}
            splitBy="word"
          />
        </motion.div>

        {/* ── CTA Buttons ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.35 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          {/* Primary CTA */}
          <motion.a
            href="#work"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-2.5 rounded-full px-8 py-4
              text-base font-bold text-white overflow-hidden
              shadow-[0_8px_32px_rgba(139,92,246,0.45)]
              hover:shadow-[0_12px_48px_rgba(139,92,246,0.65)]
              transition-shadow duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-600 to-violet-600
              bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-[background-position] duration-500" />
            <Sparkles size={16} className="relative z-10 shrink-0" />
            <span className="relative z-10">See Works</span>
          </motion.a>

          {/* Secondary CTA */}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-2.5 rounded-full px-8 py-4
              text-base font-bold overflow-hidden
              border-2 border-slate-200 dark:border-white/15
              bg-white/60 dark:bg-white/5
              text-slate-800 dark:text-white/80
              hover:border-violet-400 dark:hover:border-violet-500
              hover:text-violet-700 dark:hover:text-violet-300
              backdrop-blur-md transition-all duration-300
              shadow-sm hover:shadow-[0_8px_32px_rgba(139,92,246,0.2)]"
          >
            <span>Reach out</span>
            <ArrowRight size={15} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.a>
        </motion.div>

        {/* ── Floating stats strip ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          {[
            { value: '5+', label: 'Years Teaching' },
            { value: 'MSc', label: 'Information Systems' },
            { value: 'GIS', label: 'Spatial Analysis' },
            { value: 'ML', label: 'Machine Learning' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <span className="text-xl sm:text-2xl font-black font-display italic
                text-transparent bg-gradient-to-br from-violet-600 to-pink-600
                dark:from-violet-300 dark:to-pink-300 bg-clip-text">
                {value}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-white/40 font-semibold">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll indicator ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 dark:text-white/30 font-semibold">
          Scroll
        </span>
        <div className="w-px h-10 bg-slate-200 dark:bg-white/15 relative overflow-hidden rounded-full">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-violet-500/60"
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
