import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   INJECTED KEYFRAMES & SCOPED CSS
═══════════════════════════════════════════════════════════ */
const PEDAGOGY_CSS = `
  @keyframes ped-gold-shimmer {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  @keyframes ped-aurora-drift {
    0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
    33%      { transform: translate(40px,-30px) scale(1.08) rotate(3deg); }
    66%      { transform: translate(-25px,20px) scale(0.96) rotate(-2deg); }
  }
  @keyframes ped-aurora-drift-2 {
    0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
    40%      { transform: translate(-50px,25px) scale(1.06) rotate(-4deg); }
    75%      { transform: translate(35px,-22px) scale(0.98) rotate(2deg); }
  }
  @keyframes ped-float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-12px) rotate(1deg); }
  }
  @keyframes ped-spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ped-counter-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes ped-glow-pulse {
    0%,100% { opacity: 0.6; }
    50%      { opacity: 1; }
  }
  @keyframes ped-shimmer-line {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ped-particle {
    0%   { opacity: 0; transform: translateY(0) scale(1); }
    20%  { opacity: 1; }
    80%  { opacity: 0.6; }
    100% { opacity: 0; transform: translateY(-60px) scale(0.4); }
  }
  @keyframes ped-scan {
    0%   { top: -2px; opacity: 0; }
    5%   { opacity: 0.5; }
    95%  { opacity: 0.15; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes ped-border-dance {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }

  /* ── Scoped light-mode overrides ── */
  .ped-section {
    --ped-bg:            transparent;
    --ped-card:          rgba(10, 10, 18, 0.55);
    --ped-card-border:   rgba(255,255,255,0.09);
    --ped-text:          rgba(242, 244, 255, 0.95);
    --ped-text-sub:      rgba(168, 178, 216, 0.85);
    --ped-text-muted:    rgba(120, 130, 175, 0.7);
    --ped-gold:          #E8B86D;
    --ped-gold-bright:   #F5D08A;
    --ped-violet:        #A78BFA;
    --ped-violet-deep:   #7C3AED;
    --ped-cyan:          #22D3EE;
    --ped-pink:          #F472B6;
  }
  .light .ped-section {
    --ped-card:          rgba(255, 255, 255, 0.82);
    --ped-card-border:   rgba(91, 33, 182, 0.12);
    --ped-text:          rgba(15, 15, 26, 0.95);
    --ped-text-sub:      rgba(61, 61, 92, 0.85);
    --ped-text-muted:    rgba(100, 100, 145, 0.8);
    --ped-gold:          #B8720F;
    --ped-gold-bright:   #D4920A;
    --ped-violet:        #5B21B6;
    --ped-violet-deep:   #4C1D95;
    --ped-cyan:          #0369A1;
    --ped-pink:          #BE185D;
  }

  .ped-gold-text {
    background: linear-gradient(135deg,
      #F59E0B 0%, #E8B86D 25%, #FDE68A 50%, #E8B86D 75%, #D97706 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ped-gold-shimmer 5s linear infinite;
  }
  .light .ped-gold-text {
    background: linear-gradient(135deg,
      #92400E 0%, #B45309 30%, #D97706 60%, #92400E 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ped-gold-shimmer 5s linear infinite;
  }

  .ped-card {
    background: var(--ped-card);
    border: 1px solid var(--ped-card-border);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-radius: 1.5rem;
    transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
  }
  .ped-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at var(--mx,50%) var(--my,50%),
      rgba(167,139,250,0.08) 0%,
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    z-index: 0;
    border-radius: inherit;
  }
  .ped-card:hover::before { opacity: 1; }
  .ped-card:hover {
    border-color: rgba(167,139,250,0.28);
    box-shadow:
      0 24px 64px rgba(0,0,0,0.32),
      0 0 0 1px rgba(167,139,250,0.14),
      0 0 40px rgba(124,58,237,0.10),
      inset 0 1px 0 rgba(255,255,255,0.10);
    transform: translateY(-4px);
  }
  .light .ped-card {
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
  }
  .light .ped-card:hover {
    border-color: rgba(91,33,182,0.28);
    box-shadow:
      0 20px 56px rgba(91,33,182,0.12),
      0 0 0 1px rgba(91,33,182,0.16),
      0 0 30px rgba(91,33,182,0.06);
    transform: translateY(-4px);
  }
  .light .ped-card::before {
    background: radial-gradient(
      circle at var(--mx,50%) var(--my,50%),
      rgba(91,33,182,0.06) 0%,
      transparent 60%
    );
  }

  .ped-stat-card {
    background: linear-gradient(135deg,
      rgba(124,58,237,0.18) 0%,
      rgba(244,114,182,0.10) 50%,
      rgba(6,182,212,0.12) 100%
    );
    border: 1px solid rgba(167,139,250,0.22);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-radius: 1.25rem;
    position: relative;
    overflow: hidden;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  .ped-stat-card:hover {
    border-color: rgba(167,139,250,0.45);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 16px 48px rgba(124,58,237,0.22), 0 0 24px rgba(124,58,237,0.12);
  }
  .light .ped-stat-card {
    background: linear-gradient(135deg,
      rgba(91,33,182,0.08) 0%,
      rgba(190,24,93,0.05) 50%,
      rgba(3,105,161,0.07) 100%
    );
    border-color: rgba(91,33,182,0.15);
  }
  .light .ped-stat-card:hover {
    border-color: rgba(91,33,182,0.35);
    box-shadow: 0 16px 48px rgba(91,33,182,0.14);
  }

  .ped-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.875rem;
    border-radius: 9999px;
    border: 1px solid rgba(232,184,109,0.35);
    background: linear-gradient(135deg,
      rgba(245,158,11,0.12) 0%,
      rgba(232,184,109,0.08) 100%
    );
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #E8B86D;
    animation: ped-glow-pulse 3s ease-in-out infinite;
  }
  .light .ped-badge {
    border-color: rgba(180,83,9,0.30);
    background: linear-gradient(135deg,
      rgba(180,83,9,0.10) 0%,
      rgba(212,146,10,0.06) 100%
    );
    color: #B45309;
  }

  .ped-course-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1rem;
    border-radius: 0.875rem;
    border: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.022);
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
    cursor: default;
  }
  .ped-course-item::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,
      rgba(167,139,250,0.06) 0%,
      rgba(244,114,182,0.04) 50%,
      rgba(56,189,248,0.06) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .ped-course-item:hover::after { opacity: 1; }
  .ped-course-item:hover {
    border-color: rgba(167,139,250,0.22);
    transform: translateX(6px);
    box-shadow: 0 4px 20px rgba(124,58,237,0.12);
  }
  .light .ped-course-item {
    border-color: rgba(91,33,182,0.06);
    background: rgba(91,33,182,0.03);
  }
  .light .ped-course-item:hover {
    border-color: rgba(91,33,182,0.18);
    box-shadow: 0 4px 20px rgba(91,33,182,0.08);
  }

  .ped-quote-card {
    position: relative;
    padding: 2rem;
    border-radius: 1.5rem;
    background: linear-gradient(135deg,
      rgba(124,58,237,0.14) 0%,
      rgba(10,10,18,0.6) 60%,
      rgba(6,182,212,0.08) 100%
    );
    border: 1px solid rgba(167,139,250,0.20);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    overflow: hidden;
  }
  .light .ped-quote-card {
    background: linear-gradient(135deg,
      rgba(91,33,182,0.07) 0%,
      rgba(255,255,255,0.88) 50%,
      rgba(3,105,161,0.05) 100%
    );
    border-color: rgba(91,33,182,0.15);
  }

  .ped-scan-line {
    position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(167,139,250,0.4) 30%,
      rgba(244,114,182,0.6) 50%,
      rgba(167,139,250,0.4) 70%,
      transparent 100%
    );
    animation: ped-scan 4s linear infinite;
    pointer-events: none;
  }
  .light .ped-scan-line {
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(91,33,182,0.25) 30%,
      rgba(190,24,93,0.4) 50%,
      rgba(91,33,182,0.25) 70%,
      transparent 100%
    );
  }

  .ped-shimmer-border {
    background: linear-gradient(90deg,
      rgba(124,58,237,0.6) 0%,
      rgba(244,114,182,0.8) 33%,
      rgba(6,182,212,0.7) 66%,
      rgba(124,58,237,0.6) 100%
    );
    background-size: 300% 100%;
    animation: ped-border-dance 4s linear infinite;
    padding: 1px;
    border-radius: inherit;
  }
  .light .ped-shimmer-border {
    background: linear-gradient(90deg,
      rgba(91,33,182,0.7) 0%,
      rgba(190,24,93,0.8) 33%,
      rgba(3,105,161,0.7) 66%,
      rgba(91,33,182,0.7) 100%
    );
    background-size: 300% 100%;
    animation: ped-border-dance 4s linear infinite;
  }
`;

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const COURSES = [
  { name: 'Digital Design & Architecture',    icon: '⬡', color: 'from-violet-500 to-purple-600' },
  { name: 'Object-Oriented Programming (C++)', icon: '◈', color: 'from-cyan-500 to-blue-600' },
  { name: 'Database Management Systems',       icon: '◉', color: 'from-emerald-500 to-teal-600' },
  { name: 'Geographic Information Systems',   icon: '◎', color: 'from-amber-500 to-orange-600' },
];

const STATS = [
  { value: '5+',  label: 'Years Teaching', icon: '🎓' },
  { value: '4',   label: 'Core Subjects',  icon: '📚' },
  { value: '500+', label: 'Students Taught', icon: '👥' },
  { value: '3',   label: 'Institutions',   icon: '🏛️' },
];

const INSTITUTIONS = [
  'Buddhi Bikash Secondary School',
  'Trishahid Namuna Ma. Vi.',
  'Various Technical Schools Across Nepal',
];

/* ═══════════════════════════════════════════════════════════
   PARTICLE COMPONENT
═══════════════════════════════════════════════════════════ */
function Particle({ x, y, delay, color }: { x: number; y: number; delay: number; color: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: color,
        animation: `ped-particle ${2.5 + Math.random() * 2}s ease-out ${delay}s infinite`,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   COURSE CARD — INTERACTIVE
═══════════════════════════════════════════════════════════ */
function CourseItem({ course, index }: { course: typeof COURSES[0]; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      className="ped-course-item"
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Animated icon dot */}
      <motion.div
        animate={hov ? { scale: 1.35, rotate: 180 } : { scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className={`shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${course.color}
          flex items-center justify-center shadow-lg`}
      >
        <span className="text-white text-base font-bold">{course.icon}</span>
      </motion.div>

      {/* Text */}
      <span
        className="flex-1 text-sm sm:text-base font-semibold leading-snug"
        style={{ color: 'var(--ped-text)', position: 'relative', zIndex: 1 }}
      >
        {course.name}
      </span>

      {/* Hover arrow */}
      <motion.span
        animate={hov ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
        transition={{ duration: 0.2 }}
        className="shrink-0 text-violet-400 dark:text-violet-400 light:text-violet-600"
        style={{ color: 'var(--ped-violet)' }}
      >
        →
      </motion.span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════ */
function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      className="ped-stat-card flex flex-col items-center justify-center gap-1 p-4 sm:p-5"
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <motion.span
        animate={hov ? { scale: 1.25, rotate: [0, -10, 10, 0] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-2xl sm:text-3xl mb-1"
      >
        {stat.icon}
      </motion.span>
      <span
        className="text-2xl sm:text-3xl font-black font-display ped-gold-text tracking-tight"
      >
        {stat.value}
      </span>
      <span
        className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight"
        style={{ color: 'var(--ped-text-muted)' }}
      >
        {stat.label}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function TeachingExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView    = useInView(sectionRef, { once: false, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY  = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const orb1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  // Inject CSS once
  useEffect(() => {
    if (document.getElementById('ped-styles')) return;
    const el = document.createElement('style');
    el.id = 'ped-styles';
    el.textContent = PEDAGOGY_CSS;
    document.head.appendChild(el);
    return () => { /* keep styles across re-renders */ };
  }, []);

  // Particles config (static)
  const particles = [
    { x: 15, y: 20, delay: 0,   color: 'rgba(167,139,250,0.7)' },
    { x: 82, y: 15, delay: 0.8, color: 'rgba(244,114,182,0.7)' },
    { x: 65, y: 75, delay: 1.5, color: 'rgba(34,211,238,0.6)' },
    { x: 30, y: 80, delay: 2.1, color: 'rgba(232,184,109,0.6)' },
    { x: 90, y: 55, delay: 0.4, color: 'rgba(167,139,250,0.5)' },
    { x: 5,  y: 50, delay: 1.2, color: 'rgba(244,114,182,0.5)' },
  ];

  return (
    <section
      ref={sectionRef}
      className="ped-section relative overflow-hidden"
      style={{
        paddingTop:    'clamp(4rem, 8vw, 7rem)',
        paddingBottom: 'clamp(4rem, 8vw, 7rem)',
      }}
    >
      {/* ── Ambient Background ──────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Deep gradient wash */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 opacity-100"
            style={{
              background: `
                radial-gradient(ellipse 70% 50% at 15% 20%,
                  rgba(124,58,237,0.13) 0%, transparent 65%),
                radial-gradient(ellipse 60% 45% at 85% 75%,
                  rgba(6,182,212,0.10) 0%, transparent 65%),
                radial-gradient(ellipse 50% 55% at 50% 50%,
                  rgba(244,114,182,0.07) 0%, transparent 65%)
              `,
            }}
          />
          <div
            className="light-only absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 70% 50% at 15% 20%,
                  rgba(91,33,182,0.07) 0%, transparent 65%),
                radial-gradient(ellipse 60% 45% at 85% 75%,
                  rgba(3,105,161,0.06) 0%, transparent 65%)
              `,
            }}
          />
        </motion.div>

        {/* Floating orbs */}
        <motion.div
          style={{ y: orb1Y }}
          className="absolute -top-40 -left-24 w-[520px] h-[520px] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="w-full h-full rounded-full blur-[100px] opacity-25"
            style={{
              background: 'conic-gradient(from 0deg, #7C3AED, #F472B6, #06B6D4, #7C3AED)',
            }}
          />
        </motion.div>

        <motion.div
          style={{ y: orb2Y }}
          className="absolute -bottom-32 -right-20 w-[480px] h-[480px] rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="w-full h-full rounded-full blur-[90px] opacity-20"
            style={{
              background: 'conic-gradient(from 180deg, #E8B86D, #F472B6, #7C3AED, #E8B86D)',
            }}
          />
        </motion.div>

        {/* Premium dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.9) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}

        {/* Diagonal accent lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <line x1="0" y1="100%" x2="100%" y2="0" stroke="url(#pedLine1)" strokeWidth="1"/>
          <line x1="-20%" y1="80%" x2="80%" y2="-20%" stroke="url(#pedLine2)" strokeWidth="0.5"/>
          <defs>
            <linearGradient id="pedLine1" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="rgba(124,58,237,0)" />
              <stop offset="50%" stopColor="rgba(244,114,182,0.6)" />
              <stop offset="100%" stopColor="rgba(124,58,237,0)" />
            </linearGradient>
            <linearGradient id="pedLine2" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="rgba(6,182,212,0)" />
              <stop offset="50%" stopColor="rgba(6,182,212,0.5)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── MAIN CONTENT ───────────────────────── */}
      <div
        className="relative z-10 mx-auto w-full"
        style={{
          maxWidth: '1280px',
          paddingLeft:  'clamp(1.25rem, 5vw, 3.5rem)',
          paddingRight: 'clamp(1.25rem, 5vw, 3.5rem)',
        }}
      >
        {/* ── SECTION HEADER ────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 sm:mb-16"
        >
          {/* Eye-catch badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-5 inline-flex"
          >
            <div className="ped-badge">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#E8B86D', boxShadow: '0 0 8px rgba(232,184,109,0.8)' }}
              />
              Pedagogy & Teaching
            </div>
          </motion.div>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black tracking-tight leading-[0.88]"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                color: 'var(--ped-text)',
              }}
            >
              5+ Years of{' '}
              <span className="ped-gold-text italic">Teaching</span>
            </motion.h2>

            {/* Shimmer underline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left' }}
              className="h-[2px] w-32 sm:w-48 rounded-full"
              data-gradient="ped-shimmer"
            >
              <div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #7C3AED, #F472B6, #06B6D4)',
                  backgroundSize: '200% auto',
                  animation: 'ped-shimmer-line 3s linear infinite',
                }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-3 text-base sm:text-lg leading-relaxed max-w-2xl"
              style={{ color: 'var(--ped-text-sub)' }}
            >
              Engineering education that bridges theory with real-world application —
              inspiring curiosity and building tomorrow's innovators across Nepal.
            </motion.p>
          </div>
        </motion.div>

        {/* ── STATS ROW ───────────────────────── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
        </motion.div>

        {/* ── MAIN GRID: 3 columns on lg, 1 on mobile ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

          {/* ── CARD 1: Institutions ─────────── */}
          <motion.div
            className="ped-card lg:col-span-1"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={(e) => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              card.style.setProperty('--mx', `${x}%`);
              card.style.setProperty('--my', `${y}%`);
            }}
          >
            {/* Scan line effect */}
            <div className="ped-scan-line" />

            <div className="relative z-10 p-6 sm:p-7 flex flex-col gap-5 h-full">
              {/* Card header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5"
                    style={{ color: 'var(--ped-text-muted)' }}
                  >
                    Institutions
                  </p>
                  <h3
                    className="text-xl sm:text-2xl font-display font-bold leading-tight"
                    style={{ color: 'var(--ped-text)' }}
                  >
                    Where I've{' '}
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Taught
                    </span>
                  </h3>
                </div>
                {/* Decorative ring */}
                <div className="relative shrink-0 w-12 h-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: '2px solid transparent',
                      borderTopColor: 'rgba(167,139,250,0.6)',
                      borderRightColor: 'rgba(244,114,182,0.4)',
                    }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-1 rounded-full"
                    style={{
                      border: '1.5px solid transparent',
                      borderBottomColor: 'rgba(34,211,238,0.5)',
                      borderLeftColor: 'rgba(232,184,109,0.3)',
                    }}
                  />
                  <div
                    className="absolute inset-3 rounded-full flex items-center justify-center text-base"
                    style={{ background: 'rgba(124,58,237,0.15)' }}
                  >
                    🏛️
                  </div>
                </div>
              </div>

              {/* Institution list */}
              <div className="flex flex-col gap-3 flex-1">
                {INSTITUTIONS.map((inst, i) => (
                  <motion.div
                    key={inst}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="shrink-0 mt-1 w-2 h-2 rounded-full"
                      style={{
                        background: i === 0
                          ? 'linear-gradient(135deg, #F59E0B, #E8B86D)'
                          : i === 1
                          ? 'linear-gradient(135deg, #A78BFA, #F472B6)'
                          : 'linear-gradient(135deg, #22D3EE, #38BDF8)',
                        boxShadow: i === 0
                          ? '0 0 8px rgba(245,158,11,0.5)'
                          : i === 1
                          ? '0 0 8px rgba(167,139,250,0.5)'
                          : '0 0 8px rgba(34,211,238,0.5)',
                      }}
                    />
                    <span
                      className="text-sm sm:text-base font-semibold leading-snug"
                      style={{ color: 'var(--ped-text-sub)' }}
                    >
                      {inst}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Bottom shimmer bar */}
              <div
                className="h-[1px] w-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), rgba(244,114,182,0.4), transparent)',
                  backgroundSize: '200% auto',
                  animation: 'ped-shimmer-line 4s linear infinite',
                }}
              />
            </div>
          </motion.div>

          {/* ── CARD 2: Courses ──────────────── */}
          <motion.div
            className="ped-card lg:col-span-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={(e) => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              card.style.setProperty('--mx', `${x}%`);
              card.style.setProperty('--my', `${y}%`);
            }}
          >
            <div className="ped-scan-line" />

            <div className="relative z-10 p-6 sm:p-7 flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5"
                    style={{ color: 'var(--ped-text-muted)' }}
                  >
                    Courses Taught
                  </p>
                  <h3
                    className="text-xl sm:text-2xl font-display font-bold leading-tight"
                    style={{ color: 'var(--ped-text)' }}
                  >
                    Core Technical{' '}
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #22D3EE 0%, #38BDF8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Disciplines
                    </span>
                  </h3>
                </div>

                {/* Tech accent badge */}
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(6,182,212,0.08))',
                    border: '1px solid rgba(34,211,238,0.25)',
                    color: 'var(--ped-cyan)',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: 'var(--ped-cyan)' }}
                  />
                  4 Subjects
                </motion.div>
              </div>

              {/* Course items */}
              <div className="flex flex-col gap-2.5">
                {COURSES.map((c, i) => <CourseItem key={c.name} course={c} index={i} />)}
              </div>
            </div>
          </motion.div>

          {/* ── CARD 3: Philosophy (full width) ─ */}
          <motion.div
            className="ped-card lg:col-span-3"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={(e) => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              card.style.setProperty('--mx', `${x}%`);
              card.style.setProperty('--my', `${y}%`);
            }}
          >
            <div className="ped-scan-line" />

            <div className="relative z-10 p-6 sm:p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
              {/* Left: Quote */}
              <div className="flex flex-col gap-5">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5"
                    style={{ color: 'var(--ped-text-muted)' }}
                  >
                    Teaching Philosophy
                  </p>
                  <h3
                    className="text-xl sm:text-2xl font-display font-bold"
                    style={{ color: 'var(--ped-text)' }}
                  >
                    My Approach to{' '}
                    <span className="ped-gold-text">Education</span>
                  </h3>
                </div>

                {/* Shimmer border quote box */}
                <div className="ped-quote-card relative">
                  {/* Left accent line */}
                  <div
                    className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                    style={{
                      background: 'linear-gradient(180deg, #F59E0B 0%, #A78BFA 50%, #22D3EE 100%)',
                    }}
                  />

                  {/* Giant quote mark */}
                  <div
                    className="absolute -top-4 -left-2 font-serif leading-none select-none pointer-events-none"
                    style={{
                      fontSize: 'clamp(5rem, 12vw, 9rem)',
                      background: 'linear-gradient(135deg, rgba(167,139,250,0.18), rgba(244,114,182,0.08))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    "
                  </div>

                  <p
                    className="relative z-10 pl-6 text-base sm:text-lg md:text-xl leading-relaxed italic font-serif"
                    style={{ color: 'var(--ped-text-sub)' }}
                  >
                    Education is not just about transferring knowledge; it is about{' '}
                    <span style={{ color: 'var(--ped-gold)', fontStyle: 'normal', fontWeight: 700 }}>
                      inspiring curiosity
                    </span>
                    , fostering critical thinking, and empowering students to build solutions
                    for real-world problems. I believe in a{' '}
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #A78BFA, #F472B6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontStyle: 'normal',
                        fontWeight: 700,
                      }}
                    >
                      hands-on, practical approach
                    </span>{' '}
                    to engineering education.
                  </p>
                </div>
              </div>

              {/* Right: Decorative visual */}
              <div className="hidden md:flex flex-col items-center gap-4 shrink-0">
                {/* Animated ring system */}
                <div className="relative w-36 h-36 lg:w-44 lg:h-44">
                  {/* Outermost ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: '1.5px solid transparent',
                      borderTopColor: 'rgba(167,139,250,0.5)',
                      borderRightColor: 'rgba(244,114,182,0.4)',
                    }}
                  />
                  {/* Middle ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-4 rounded-full"
                    style={{
                      border: '1.5px solid transparent',
                      borderBottomColor: 'rgba(34,211,238,0.5)',
                      borderLeftColor: 'rgba(232,184,109,0.4)',
                    }}
                  />
                  {/* Inner ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-8 rounded-full"
                    style={{
                      border: '1.5px solid transparent',
                      borderTopColor: 'rgba(244,114,182,0.6)',
                      borderRightColor: 'rgba(167,139,250,0.3)',
                    }}
                  />

                  {/* Orbiting dots */}
                  {[0, 120, 240].map((angle, i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0"
                      style={{ transformOrigin: 'center' }}
                    >
                      <div
                        className="absolute w-2.5 h-2.5 rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `rotate(${angle}deg) translateX(${44 + i * 0}px) rotate(-${angle}deg) translate(-50%, -50%)`,
                          background: i === 0
                            ? 'linear-gradient(135deg, #A78BFA, #7C3AED)'
                            : i === 1
                            ? 'linear-gradient(135deg, #F472B6, #DB2777)'
                            : 'linear-gradient(135deg, #22D3EE, #0EA5E9)',
                          boxShadow: i === 0
                            ? '0 0 10px rgba(167,139,250,0.8)'
                            : i === 1
                            ? '0 0 10px rgba(244,114,182,0.8)'
                            : '0 0 10px rgba(34,211,238,0.8)',
                        }}
                      />
                    </motion.div>
                  ))}

                  {/* Center core */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-3xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(244,114,182,0.15) 100%)',
                        border: '1px solid rgba(167,139,250,0.25)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 0 30px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                      }}
                    >
                      🎓
                    </div>
                  </motion.div>
                </div>

                {/* Sub-labels */}
                <div className="flex flex-col items-center gap-1">
                  {['Inspire', 'Empower', 'Innovate'].map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{
                        color: i === 0 ? '#A78BFA' : i === 1 ? '#F472B6' : '#22D3EE',
                        textShadow: i === 0
                          ? '0 0 12px rgba(167,139,250,0.5)'
                          : i === 1
                          ? '0 0 12px rgba(244,114,182,0.5)'
                          : '0 0 12px rgba(34,211,238,0.5)',
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
        {/* END MAIN GRID */}
      </div>
    </section>
  );
}
