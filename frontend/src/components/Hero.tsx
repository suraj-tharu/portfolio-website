import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { TextReveal } from './premium/TextReveal';
import { useLanguage } from '../context/LanguageContext';
import { useGreeting } from './GreetingBanner';
import { Sparkles, ArrowRight, MapPin, Code2, Globe2, BrainCircuit, GraduationCap } from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   Aurora Mesh Gradient Background (ultra-premium)
────────────────────────────────────────────────────────── */
function AuroraMesh() {
  return (
    <>
      <style>{`
        @keyframes aurora1  { 0%,100%{transform:translate(0,0) scale(1) rotate(0deg)} 33%{transform:translate(50px,-40px) scale(1.14) rotate(5deg)} 66%{transform:translate(-30px,35px) scale(0.92) rotate(-3deg)} }
        @keyframes aurora2  { 0%,100%{transform:translate(0,0) scale(1) rotate(0deg)} 33%{transform:translate(-50px,30px) scale(1.12) rotate(-6deg)} 66%{transform:translate(35px,-25px) scale(0.94) rotate(4deg)} }
        @keyframes aurora3  { 0%,100%{transform:translate(0,0) scale(1) rotate(0deg)} 33%{transform:translate(25px,45px) scale(1.06) rotate(3deg)} 66%{transform:translate(-35px,-40px) scale(1.1) rotate(-2deg)} }
        @keyframes aurora4  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-30px) scale(1.08)} }
        @keyframes hero-shimmer { 0%{background-position:200% 50%} 100%{background-position:-200% 50%} }
        @keyframes badge-pulse  { 0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,0.4)} 50%{box-shadow:0 0 0 10px rgba(167,139,250,0)} }
        @keyframes scroll-flow  { 0%{transform:scaleY(0) translateY(0);transform-origin:top;opacity:1} 45%{transform:scaleY(1) translateY(0);transform-origin:top;opacity:1} 55%{transform:scaleY(1) translateY(0);transform-origin:bottom;opacity:0.8} 100%{transform:scaleY(0) translateY(0);transform-origin:bottom;opacity:0} }
        @keyframes float-tag    { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes grid-pulse   { 0%,100%{opacity:0.025} 50%{opacity:0.06} }
        @keyframes corner-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes badge-dot    { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.5);opacity:1} }
      `}</style>

      {/* Deep base */}
      <div className="absolute inset-0 bg-[#06040f]" />

      {/* Aurora orb 1 — violet primary */}
      <div style={{
        position: 'absolute', top: '-25%', left: '-20%',
        width: '80vw', height: '80vw', borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%,rgba(124,58,237,0.5),rgba(219,39,119,0.25) 45%,transparent 70%)',
        filter: 'blur(90px)', animation: 'aurora1 14s ease-in-out infinite',
      }} />
      {/* Aurora orb 2 — cyan accent */}
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-18%',
        width: '70vw', height: '70vw', borderRadius: '50%',
        background: 'radial-gradient(circle at 60% 60%,rgba(6,182,212,0.4),rgba(124,58,237,0.25) 45%,transparent 70%)',
        filter: 'blur(100px)', animation: 'aurora2 16s ease-in-out infinite',
      }} />
      {/* Aurora orb 3 — pink middle */}
      <div style={{
        position: 'absolute', top: '30%', left: '45%', transform: 'translateX(-50%)',
        width: '55vw', height: '55vw', borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(244,114,182,0.22),rgba(56,189,248,0.18) 45%,transparent 70%)',
        filter: 'blur(80px)', animation: 'aurora3 11s ease-in-out infinite 1.5s',
      }} />
      {/* Aurora orb 4 — emerald accent */}
      <div style={{
        position: 'absolute', top: '60%', right: '15%',
        width: '30vw', height: '30vw', borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(52,211,153,0.18),transparent 70%)',
        filter: 'blur(60px)', animation: 'aurora4 9s ease-in-out infinite 2s',
      }} />

      {/* Dot grid — animated pulse */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(167,139,250,0.45) 1px, transparent 1px)',
        backgroundSize: '42px 42px',
        animation: 'grid-pulse 7s ease-in-out infinite',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 85% 75% at 50% 50%,transparent 35%,rgba(6,4,15,0.75) 100%)',
      }} />

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%',
        background: 'linear-gradient(to top,#06040f 0%,transparent 100%)',
      }} />
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   Floating skill tags with SVG connector lines
────────────────────────────────────────────────────────── */
const TAGS = [
  { label: 'GIS & Remote Sensing', icon: <Globe2 size={11} />,      delay: 0,   x: '-62%', y: '-135%' },
  { label: 'Machine Learning',     icon: <BrainCircuit size={11} />, delay: 0.3, x: '58%',  y: '-115%' },
  { label: 'Computer Engineering', icon: <Code2 size={11} />,        delay: 0.6, x: '-58%', y: '132%'  },
  { label: 'MSc Info Systems',     icon: <GraduationCap size={11} />,delay: 0.9, x: '52%',  y: '128%'  },
];

function FloatingTags() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      {TAGS.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 2.0 + t.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: `translate(${t.x}, ${t.y})`,
            animation: `float-tag ${3.8 + i * 0.6}s ease-in-out infinite`,
            animationDelay: `${t.delay + 2}s`,
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 999,
            background: 'rgba(167,139,250,0.07)',
            border: '1px solid rgba(167,139,250,0.22)',
            backdropFilter: 'blur(14px)',
            color: 'rgba(167,139,250,0.88)',
            fontSize: '0.67rem', fontWeight: 700,
            letterSpacing: '0.08em', whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}>
            {t.icon}
            {t.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Role badge — blur-swap transition
────────────────────────────────────────────────────────── */
function RoleBadge({ role }: { role: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={role}
        initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
        exit={{   opacity: 0, y: -12, filter: 'blur(6px)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        {role}
      </motion.span>
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────────────────
   Character split word reveal (cinematic)
────────────────────────────────────────────────────────── */
function CinematicWord({ text, delay = 0, gradient }: { text: string; delay?: number; gradient: string }) {
  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden', perspective: 800 }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: '110%', rotateX: 55, opacity: 0 }}
          animate={{ y: '0%',   rotateX: 0,  opacity: 1 }}
          transition={{
            delay: delay + i * 0.035,
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            display: 'inline-block',
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   Animated counter
────────────────────────────────────────────────────────── */
function AnimCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = to / 40;
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 40);
    return () => clearInterval(id);
  }, [started, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ──────────────────────────────────────────────────────────
   3D Mouse-Tracking Tilt for name container
────────────────────────────────────────────────────────── */
function use3DTilt() {
  const rotateX = useSpring(0, { stiffness: 150, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 25 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateX.set(-dy * 8);
    rotateY.set(dx * 8);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
}

/* ──────────────────────────────────────────────────────────
   Main Hero
────────────────────────────────────────────────────────── */
export default function Hero() {
  const { t } = useLanguage();
  const greeting = useGreeting();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt();

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
    const id = setInterval(() => setRoleIndex(p => (p + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [roles.length]);

  /* Scroll parallax */
  const { scrollY } = useScroll();
  const yBg     = useTransform(scrollY, [0, 900], [0, 220]);
  const opacity  = useTransform(scrollY, [0, 700], [1, 0]);
  const scale    = useTransform(scrollY, [0, 700], [1, 0.95]);

  const nameConfig = [
    { word: 'Suraj',    gradient: 'linear-gradient(135deg,#c4b5fd 0%,#a78bfa 40%,#f472b6 100%)', delay: 0.2 },
    { word: 'Tharu',    gradient: 'linear-gradient(135deg,#f472b6 0%,#fb7185 40%,#f97316 100%)', delay: 0.5 },
    { word: 'Chaudhary',gradient: 'linear-gradient(135deg,#38bdf8 0%,#818cf8 40%,#a78bfa 100%)', delay: 0.8 },
  ];

  const stats = [
    { value: 5,   suffix: '+', label: 'Years Teaching',   icon: '🎓' },
    { value: 0,   suffix: 'MSc', label: 'Info Systems',   icon: '📡', isText: true },
    { value: 0,   suffix: 'GIS', label: 'Spatial Analysis', icon: '🗺️', isText: true },
    { value: 0,   suffix: 'ML',  label: 'Deep Learning',  icon: '🤖', isText: true },
  ];

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity, scale }}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove as unknown as React.MouseEventHandler<HTMLElement>}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── BACKGROUND ──────────────────────────────────── */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        <AuroraMesh />
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-[0.05] mix-blend-screen"
        />
      </motion.div>

      {/* ── FLOATING TAGS ───────────────────────────────── */}
      <FloatingTags />

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center px-5 sm:px-8 pt-28 pb-32">

        {/* Greeting pill */}
        {greeting && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.85 }}
            animate={{ opacity: 1, y: 0,   scale: 1   }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '10px 22px', borderRadius: 999,
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(167,139,250,0.28)',
              backdropFilter: 'blur(18px)',
              animation: 'badge-pulse 3s ease-in-out infinite',
              boxShadow: '0 4px 24px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'linear-gradient(135deg,#a78bfa,#34d399)',
                display: 'inline-block',
                animation: 'badge-dot 1.5s ease-in-out infinite',
              }} />
              <span style={{
                fontSize: '0.73rem', fontWeight: 800, letterSpacing: '0.22em',
                textTransform: 'uppercase',
                background: 'linear-gradient(135deg,#a78bfa,#f472b6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {greeting}
              </span>
              <span style={{
                fontSize: '0.7rem', color: 'rgba(167,139,250,0.45)',
                fontWeight: 500,
              }}>
                — Welcome
              </span>
            </div>
          </motion.div>
        )}

        {/* ── 3D TILT NAME ────────────────────────────── */}
        <motion.h1
          style={{
            marginBottom: 22,
            lineHeight: 0.88,
            perspective: 1200,
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: 'clamp(8px,2vw,26px)',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic', fontWeight: 900,
            fontSize: 'clamp(3rem,11.5vw,9rem)',
          }}>
            {nameConfig.map(({ word, gradient, delay }) => (
              <span key={word} style={{ filter: `drop-shadow(0 0 45px rgba(167,139,250,0.35))` }}>
                <CinematicWord text={word} delay={delay} gradient={gradient} />
              </span>
            ))}
          </div>
        </motion.h1>

        {/* Animated decorative divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.1, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1.5, width: 'min(340px,65%)', marginBottom: 22, originX: 0.5,
            background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.7),rgba(244,114,182,0.7),rgba(56,189,248,0.5),transparent)',
            borderRadius: 999,
            boxShadow: '0 0 12px rgba(167,139,250,0.4)',
          }}
        />

        {/* ── ROLE ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.9, delay: 0.95 }}
          style={{
            marginBottom: 10,
            fontSize: 'clamp(1.1rem,2.5vw,1.75rem)',
            fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700,
            minHeight: '2.4rem',
            background: 'linear-gradient(135deg,#a78bfa,#f472b6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}
        >
          <RoleBadge role={roles[roleIndex]} />
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.7, delay: 1.1 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 30,
            fontSize: '0.85rem', fontWeight: 500, color: 'rgba(167,139,250,0.55)',
          }}
        >
          <MapPin size={13} style={{ color: '#a78bfa', flexShrink: 0 }} />
          {t('hero.location')}
        </motion.div>

        {/* ── DESCRIPTION ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.9, delay: 1.2 }}
          style={{
            maxWidth: 650, marginBottom: 38,
            fontSize: 'clamp(0.95rem,1.5vw,1.1rem)',
            lineHeight: 1.78, color: 'rgba(203,213,225,0.75)',
            fontWeight: 400,
          }}
        >
          <TextReveal
            text={t('hero.description')}
            delay={1.3}
            staggerDuration={0.02}
            splitBy="word"
          />
        </motion.div>

        {/* ── CTA BUTTONS ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.9, delay: 1.4 }}
          style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginBottom: 54 }}
        >
          {/* Primary — shimmer */}
          <motion.a
            href="#work"
            whileHover={{ scale: 1.07, y: -4 }}
            whileTap={{ scale: 0.96 }}
            style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10,
              borderRadius: 999, padding: '15px 36px',
              fontSize: '0.925rem', fontWeight: 800, color: '#fff',
              background: 'linear-gradient(135deg,#7c3aed,#db2777,#0ea5e9)',
              backgroundSize: '200% 200%', animation: 'hero-shimmer 4s linear infinite',
              boxShadow: '0 10px 36px rgba(124,58,237,0.55),0 0 0 1px rgba(167,139,250,0.25)',
              textDecoration: 'none', overflow: 'hidden', letterSpacing: '0.03em',
            }}
          >
            <span style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.2) 50%,transparent 60%)',
              backgroundSize: '200% 100%', animation: 'hero-shimmer 2.2s linear infinite',
            }} />
            <Sparkles size={16} style={{ flexShrink: 0, position: 'relative', zIndex: 1 }} />
            <span style={{ position: 'relative', zIndex: 1 }}>See My Work</span>
          </motion.a>

          {/* Secondary — animated border */}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.07, y: -4 }}
            whileTap={{ scale: 0.96 }}
            style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10,
              borderRadius: 999, padding: '15px 36px',
              fontSize: '0.925rem', fontWeight: 800,
              border: '1px solid rgba(167,139,250,0.3)',
              color: 'rgba(196,181,253,0.92)',
              background: 'rgba(124,58,237,0.07)',
              backdropFilter: 'blur(18px)',
              textDecoration: 'none', letterSpacing: '0.03em',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 0 0 rgba(167,139,250,0)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(167,139,250,0.25), inset 0 0 20px rgba(167,139,250,0.05)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(167,139,250,0.6)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 rgba(167,139,250,0)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(167,139,250,0.3)';
            }}
          >
            Get In Touch
            <ArrowRight size={15} style={{ flexShrink: 0 }} />
          </motion.a>
        </motion.div>

        {/* ── STATS STRIP ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 1.0, delay: 1.6 }}
          style={{
            width: '100%', maxWidth: 540,
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            borderRadius: 22, padding: '20px 14px',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(167,139,250,0.13)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {stats.map(({ value, suffix, label, icon, isText }, i) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.07, y: -2 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                borderRight: i < 3 ? '1px solid rgba(167,139,250,0.1)' : 'none',
                padding: '4px 6px',
                cursor: 'default',
              }}
            >
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>{icon}</span>
              <span style={{
                fontSize: 'clamp(1rem,2.5vw,1.35rem)', fontWeight: 900,
                fontFamily: 'Georgia, serif', fontStyle: 'italic',
                background: 'linear-gradient(135deg,#a78bfa,#f472b6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {isText ? suffix : <><AnimCounter to={value} />{suffix}</>}
              </span>
              <span style={{
                fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.12em',
                fontWeight: 700, color: 'rgba(167,139,250,0.4)', textAlign: 'center', lineHeight: 1.3,
              }}>
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── SCROLL INDICATOR (premium morphing) ─────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.9 }}
        style={{
          position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 10,
        }}
      >
        <span style={{
          fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.35em',
          fontWeight: 700, color: 'rgba(167,139,250,0.3)',
        }}>
          Scroll
        </span>
        <div style={{
          width: 26, height: 44, borderRadius: 13,
          border: '1.5px solid rgba(167,139,250,0.2)',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          padding: '6px 0',
          background: 'rgba(167,139,250,0.03)',
          backdropFilter: 'blur(8px)',
        }}>
          <motion.div
            style={{
              width: 4, height: 12, borderRadius: 999,
              background: 'linear-gradient(to bottom,#a78bfa,#f472b6)',
              boxShadow: '0 0 8px rgba(167,139,250,0.8)',
            }}
            animate={{ y: [0, 16, 0], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
