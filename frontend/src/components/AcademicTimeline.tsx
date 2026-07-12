import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  GraduationCap, Briefcase, MapPin, Calendar,
  ArrowRight, Sparkles, ChevronRight,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   ULTRA-PREMIUM CSS
═══════════════════════════════════════════════════════ */
const TIMELINE_CSS = `
  :root, .dark {
    --lux-surface-rgb: 6, 6, 12;
    --lux-surface-alt: 4, 4, 10;
    --lux-card-bg: rgba(8, 8, 16, 0.72);
    --lux-card-border: rgba(212, 175, 55, 0.18);
    --lux-text-muted: rgba(235, 235, 245, 0.7);
    --lux-text-soft: rgba(235, 235, 245, 0.52);
    --lux-text-strong: rgba(245, 245, 255, 0.92);
    --lux-text-faint: rgba(235, 235, 245, 0.32);
  }
  .light {
    --lux-surface-rgb: 250, 249, 255;
    --lux-surface-alt: 244, 242, 252;
    --lux-card-bg: rgba(255, 255, 255, 0.88);
    --lux-card-border: rgba(180, 140, 30, 0.22);
    --lux-text-muted: rgba(30, 25, 55, 0.78);
    --lux-text-soft: rgba(40, 35, 65, 0.65);
    --lux-text-strong: rgba(12, 10, 28, 0.95);
    --lux-text-faint: rgba(40, 35, 65, 0.4);
  }

  @keyframes tl-gold-shimmer {
    0%   { background-position: -300% center; }
    100% { background-position: 300% center; }
  }
  @keyframes tl-orb-breathe {
    0%,100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
    50%      { transform: scale(1.22) rotate(10deg); opacity: 0.9; }
  }
  @keyframes tl-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.55), 0 0 20px rgba(212,175,55,0.2); }
    50%      { box-shadow: 0 0 0 16px rgba(212,175,55,0), 0 0 30px rgba(212,175,55,0); }
  }
  @keyframes tl-teal-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(45,212,191,0.55), 0 0 20px rgba(45,212,191,0.2); }
    50%      { box-shadow: 0 0 0 16px rgba(45,212,191,0), 0 0 30px rgba(45,212,191,0); }
  }
  @keyframes tl-scan-line {
    0%   { top: -2px; opacity: 0; }
    4%   { opacity: 0.7; }
    96%  { opacity: 0.3; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes tl-float-slow {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-10px) rotate(1.5deg); }
    66%      { transform: translateY(-6px) rotate(-1deg); }
  }
  @keyframes tl-spin-slow {
    to { transform: rotate(360deg); }
  }
  @keyframes tl-counter-spin {
    to { transform: rotate(-360deg); }
  }
  @keyframes tl-halo {
    0%,100% { opacity: 0.35; transform: scale(1); }
    50%      { opacity: 0.7; transform: scale(1.08); }
  }
  @keyframes tl-live-dot {
    0%,100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(74,222,128,0.6); }
    50%      { opacity: 0.85; transform: scale(1.3); box-shadow: 0 0 0 6px rgba(74,222,128,0); }
  }
  @keyframes tl-badge-glow {
    0%,100% { box-shadow: 0 0 20px rgba(212,175,55,0.12), inset 0 1px 0 rgba(212,175,55,0.15); }
    50%      { box-shadow: 0 0 40px rgba(212,175,55,0.28), inset 0 1px 0 rgba(212,175,55,0.25); }
  }
  @keyframes tl-orbit-drift {
    0%   { transform: rotate(0deg) translateX(3px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(3px) rotate(-360deg); }
  }

  .tl-timeline-card {
    transition: border-color 0.45s ease, box-shadow 0.45s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.45s ease;
  }
  .tl-timeline-card:hover {
    transform: translateY(-6px) scale(1.015);
  }
  .tl-detail-card {
    transition: box-shadow 0.45s ease;
  }
  @media (max-width: 767px) {
    .tl-orbital-wrap { display: none !important; }
    .tl-mobile-cards { display: flex !important; }
  }
  @media (min-width: 768px) {
    .tl-mobile-cards { display: none !important; }
  }
  @media (max-width: 480px) {
    .tl-cta-btn { padding: 14px 28px !important; font-size: 0.75rem !important; }
  }
`;

/* ═══════════════════════════════════════════════════════
   LUXURY PALETTE  — Gold · Platinum · Ivory · Onyx
═══════════════════════════════════════════════════════ */
const GOLD        = '#D4AF37';
const GOLD_RGB    = '212,175,55';
const PLAT        = '#E8E8E8';
const PLAT_RGB    = '232,232,232';
const ROSE_GOLD   = '#C9956C';
const ROSE_RGB    = '201,149,108';
const TEAL_LUX    = '#2DD4BF';
const TEAL_RGB    = '45,212,191';

type TimelineEvent = {
  id?: number;
  year: string;
  role: string;
  location: string;
  type?: 'education' | 'work';
  desc?: string;
};

const defaultTimeline: TimelineEvent[] = [
  {
    year: '2017 – 2021',
    role: 'B.E. Computer Engineering',
    location: 'Mid-West University · Himalaya College of Engineering',
    type: 'education',
    desc: 'Foundation in computer science, algorithms, and systems engineering with a focus on emerging technologies.',
  },
  {
    year: '2021',
    role: 'Nepal Telecom Internship',
    location: 'Kathmandu, Nepal',
    type: 'work',
    desc: 'Hands-on experience with national-scale telecommunications infrastructure and network operations.',
  },
  {
    year: '2021 – 2023',
    role: 'Instructor',
    location: 'Buddhi Bikash Secondary School',
    type: 'work',
    desc: 'Taught computer science and mathematics, mentoring over 200 students in technical fundamentals.',
  },
  {
    year: '2024 – 2026',
    role: 'Senior Instructor',
    location: 'Trishahid Namuna Ma. Vi.',
    type: 'work',
    desc: 'Led advanced computer science curriculum design and delivery for senior secondary students.',
  },
  {
    year: '2024 – Present',
    role: 'MSc Information System Engineering',
    location: 'Purbanchal University',
    type: 'education',
    desc: 'Graduate research in GIS, remote sensing, and machine learning applications for spatial data analysis.',
  },
];

/* ═══════════════════════════════════════════════════════
   AMBIENT PARTICLES
═══════════════════════════════════════════════════════ */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 5 + (i * 5.6) % 90,
  y: 5 + (i * 7.1) % 90,
  size: 1.2 + (i % 4) * 0.6,
  delay: (i * 0.35) % 5,
  duration: 5 + (i % 6),
  color: i % 4 === 0 ? GOLD : i % 4 === 1 ? PLAT : i % 4 === 2 ? ROSE_GOLD : TEAL_LUX,
}));

function FloatingParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 5}px ${p.color}`,
          }}
          animate={{
            y: [-14, 14, -14],
            x: [-6, 6, -6],
            opacity: [0, 0.7, 0],
            scale: [0.6, 1.4, 0.6],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LUXE ORBITAL VISUALIZER
═══════════════════════════════════════════════════════ */
function LuxeOrbital({
  items, activeIndex, onSelect,
}: {
  items: TimelineEvent[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  const total = items.length;
  const angleStep = (2 * Math.PI) / total;
  const R = 150;
  const cx = 185;
  const cy = 185;
  const size = 370;
  const rotOffset = -Math.PI / 2 - activeIndex * angleStep;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>

      {/* Ambient core glow */}
      <div style={{
        position: 'absolute', inset: '15%', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${GOLD_RGB},0.18) 0%, rgba(${ROSE_RGB},0.08) 50%, transparent 80%)`,
        filter: 'blur(32px)',
        pointerEvents: 'none',
        animation: 'tl-orb-breathe 6s ease-in-out infinite',
      }} />

      <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          {/* Gold gradient */}
          <linearGradient id="tl-goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={GOLD}     stopOpacity="0.9" />
            <stop offset="50%"  stopColor={ROSE_GOLD} stopOpacity="0.6" />
            <stop offset="100%" stopColor={PLAT}     stopOpacity="0.8" />
          </linearGradient>

          {/* Radial glow filter */}
          <filter id="tl-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="tl-strongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Outer decorative ring */}
        <circle cx={cx} cy={cy} r={R + 22}
          fill="none" stroke="url(#tl-goldGrad)" strokeWidth="0.5"
          strokeDasharray="3 9" opacity="0.25" />

        {/* Main orbit ring */}
        <circle cx={cx} cy={cy} r={R}
          fill="none" stroke="url(#tl-goldGrad)" strokeWidth="1.8" opacity="0.55" />

        {/* Inner ring */}
        <circle cx={cx} cy={cy} r={R - 28}
          fill="none" stroke="url(#tl-goldGrad)" strokeWidth="0.5"
          strokeDasharray="2 14" opacity="0.15" />

        {/* Active connector */}
        {items.map((item, i) => {
          const angle = rotOffset + i * angleStep;
          const nx = cx + R * Math.cos(angle);
          const ny = cy + R * Math.sin(angle);
          const isActive = i === activeIndex;
          const col = item.type === 'education' ? GOLD : TEAL_LUX;
          return isActive ? (
            <line key={`conn-${i}`} x1={cx} y1={cy} x2={nx} y2={ny}
              stroke={col} strokeWidth="1.2" strokeDasharray="4 6"
              opacity="0.5" filter="url(#tl-glow)" />
          ) : null;
        })}

        {/* Orbital nodes */}
        {items.map((item, i) => {
          const angle = rotOffset + i * angleStep;
          const nx = cx + R * Math.cos(angle);
          const ny = cy + R * Math.sin(angle);
          const isActive = i === activeIndex;
          const col = item.type === 'education' ? GOLD : TEAL_LUX;
          const labelY = ny + (Math.sin(angle) > 0 ? 34 : -26);

          return (
            <g key={i} style={{ cursor: 'pointer' }} onClick={() => onSelect(i)}>
              {isActive && (
                <>
                  <motion.circle cx={nx} cy={ny} r={20} fill="none" stroke={col} strokeWidth="1"
                    initial={{ r: 20, opacity: 0.8 }}
                    animate={{ r: 38, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }} />
                  <motion.circle cx={nx} cy={ny} r={14} fill="none" stroke={col} strokeWidth="1.5"
                    initial={{ r: 14, opacity: 0.6 }}
                    animate={{ r: 28, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }} />
                </>
              )}
              <circle cx={nx} cy={ny} r={isActive ? 18 : 12}
                fill={isActive ? `${col}25` : `${col}0D`}
                stroke={col} strokeWidth={isActive ? 1.8 : 1}
                filter={isActive ? 'url(#tl-strongGlow)' : undefined}
                opacity={isActive ? 1 : 0.5}
                style={{ transition: 'all 0.5s ease' }} />
              <circle cx={nx} cy={ny} r={isActive ? 8 : 5}
                fill={col}
                filter={isActive ? 'url(#tl-glow)' : undefined}
                opacity={isActive ? 1 : 0.4}
                style={{ transition: 'all 0.5s ease' }} />
              <text x={nx} y={labelY} textAnchor="middle" fontSize="7.5"
                fontFamily="Syne, sans-serif" fontWeight="800" fill={col}
                opacity={isActive ? 1 : 0.35} letterSpacing="0.08em"
                style={{ transition: 'opacity 0.4s ease' }}>
                {item.year}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Center Hub */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 80, height: 80, borderRadius: '50%',
        background: `linear-gradient(135deg, rgba(${GOLD_RGB},0.15), rgba(${ROSE_RGB},0.1))`,
        border: `1.5px solid rgba(${GOLD_RGB},0.4)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 50px rgba(${GOLD_RGB},0.3), 0 0 100px rgba(${GOLD_RGB},0.1)`,
      }}>
        {/* Rotating rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: -10, borderRadius: '50%',
            border: '1px solid transparent',
            borderTopColor: `rgba(${GOLD_RGB},0.7)`,
            borderRightColor: `rgba(${ROSE_RGB},0.4)`,
          }} />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 6, borderRadius: '50%',
            border: '1px solid transparent',
            borderBottomColor: `rgba(${TEAL_RGB},0.5)`,
            borderLeftColor: `rgba(${GOLD_RGB},0.3)`,
          }} />
        {items[activeIndex]?.type === 'education'
          ? <GraduationCap size={24} style={{ color: GOLD }} />
          : <Briefcase size={24} style={{ color: TEAL_LUX }} />
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAGNETIC BUTTON
═══════════════════════════════════════════════════════ */
function MagneticNav({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 350, damping: 25 });
  const sy = useSpring(y, { stiffness: 350, damping: 25 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.4);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.92 }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: `linear-gradient(135deg, rgba(${GOLD_RGB},0.1), rgba(${ROSE_RGB},0.06))`,
        border: `1px solid rgba(${GOLD_RGB},0.3)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: GOLD, cursor: 'pointer',
        boxShadow: `0 0 24px rgba(${GOLD_RGB},0.15)`,
        transform: direction === 'prev' ? 'rotate(180deg)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}>
        <ArrowRight size={15} />
      </div>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════
   LUXURY DETAIL CARD
═══════════════════════════════════════════════════════ */
function LuxuryDetailCard({ item, index }: { item: TimelineEvent; index: number }) {
  const isEdu = item.type === 'education';
  const color    = isEdu ? GOLD      : TEAL_LUX;
  const colorRgb = isEdu ? GOLD_RGB  : TEAL_RGB;
  const Icon     = isEdu ? GraduationCap : Briefcase;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 48, filter: 'blur(18px)', scale: 0.97 }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
        exit={{ opacity: 0, y: -28, filter: 'blur(14px)', scale: 0.97 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="tl-detail-card"
        style={{
          flex: 1, minWidth: 0, position: 'relative',
          background: `linear-gradient(145deg,
            rgba(${colorRgb},0.07) 0%,
            rgba(var(--lux-surface-rgb), 0.97) 40%,
            rgba(var(--lux-surface-alt), 0.95) 70%,
            rgba(${ROSE_RGB},0.035) 100%)`,
          border: `1px solid rgba(${colorRgb},0.26)`,
          borderRadius: 28,
          padding: 'clamp(28px,3.5vw,52px)',
          overflow: 'hidden',
          backdropFilter: 'blur(32px)',
          boxShadow: `0 0 0 1px rgba(${colorRgb},0.1),
            0 40px 100px rgba(0,0,0,0.65),
            0 0 80px rgba(${colorRgb},0.08),
            inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* Top shimmer line */}
        <div style={{
          position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${colorRgb},0.8), rgba(${PLAT_RGB},0.3), transparent)`,
        }} />

        {/* Corner radial glows */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 180, height: 180,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${colorRgb},0.14) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40, width: 140, height: 140,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${ROSE_RGB},0.09) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1, zIndex: 2, pointerEvents: 'none',
          background: `linear-gradient(90deg, transparent, rgba(${colorRgb},0.35), transparent)`,
          animation: 'tl-scan-line 8s linear infinite',
        }} />

        {/* Type pill */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999, marginBottom: 24,
            background: `rgba(${colorRgb},0.10)`,
            border: `1px solid rgba(${colorRgb},0.28)`,
            color, fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.22em',
            textTransform: 'uppercase' as const,
            fontFamily: 'Syne, sans-serif',
            boxShadow: `0 0 20px rgba(${colorRgb},0.12)`,
          }}
        >
          <Icon size={10} />
          {isEdu ? 'Education' : 'Experience'}
          <Sparkles size={8} style={{ opacity: 0.7 }} />
        </motion.div>

        {/* Role title */}
        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
          style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
            fontWeight: 700, fontStyle: 'italic',
            lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 20,
            background: `linear-gradient(135deg, ${color} 0%, rgba(${PLAT_RGB},0.95) 60%, ${color} 100%)`,
            backgroundSize: '300% auto',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            animation: 'tl-gold-shimmer 5s linear infinite',
          }}
        >
          {item.role}
        </motion.h3>

        {/* Description */}
        {item.desc && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 'clamp(0.83rem, 1.1vw, 0.97rem)',
              color: 'var(--lux-text-muted)',
              lineHeight: 1.85, marginBottom: 32,
            }}
          >
            {item.desc}
          </motion.p>
        )}

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.32, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1,
            background: `linear-gradient(90deg, rgba(${colorRgb},0.55), rgba(${ROSE_RGB},0.3), transparent)`,
            marginBottom: 24, transformOrigin: 'left',
          }}
        />

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 'clamp(0.74rem, 1.1vw, 0.82rem)',
            color: 'var(--lux-text-muted)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 11,
              background: `linear-gradient(135deg, rgba(${colorRgb},0.14), rgba(${GOLD_RGB},0.06))`,
              border: `1px solid rgba(${colorRgb},0.28)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 16px rgba(${colorRgb},0.12)`,
            }}>
              <MapPin size={12} style={{ color }} />
            </div>
            {item.location}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto',
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(0.68rem, 1.0vw, 0.75rem)',
            fontWeight: 800,
            color, letterSpacing: '0.1em',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 11,
              background: `linear-gradient(135deg, rgba(${colorRgb},0.14), rgba(${GOLD_RGB},0.06))`,
              border: `1px solid rgba(${colorRgb},0.28)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 16px rgba(${colorRgb},0.12)`,
            }}>
              <Calendar size={12} style={{ color }} />
            </div>
            {item.year}
          </div>
        </motion.div>

        {/* Bottom shimmer */}
        <div style={{
          position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${colorRgb},0.4), transparent)`,
        }} />
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP NAVIGATOR — Luxury Pills
═══════════════════════════════════════════════════════ */
function StepNavigator({ total, active, onSelect, items }: {
  total: number; active: number; onSelect: (i: number) => void; items: TimelineEvent[];
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
      {Array.from({ length: total }, (_, i) => {
        const col = items[i]?.type === 'education' ? GOLD : TEAL_LUX;
        return (
          <motion.button
            key={i}
            onClick={() => onSelect(i)}
            whileHover={{ scaleY: 1.35 }}
            animate={{
              width: active === i ? 40 : 8,
              backgroundColor: active === i ? col : 'rgba(var(--text-base-rgb,100,100,120), 0.18)',
              boxShadow: active === i ? `0 0 18px ${col}AA, 0 0 35px rgba(${active === i ? (items[i]?.type === 'education' ? GOLD_RGB : TEAL_RGB) : GOLD_RGB},0.25)` : 'none',
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 8, borderRadius: 999, border: 'none', cursor: 'pointer',
              padding: 0, outline: 'none',
            }}
          />
        );
      })}
      <span style={{
        marginLeft: 10, fontSize: '0.62rem',
        background: `linear-gradient(90deg, ${GOLD}, ${ROSE_GOLD})`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        fontFamily: 'Syne, sans-serif', fontWeight: 800, letterSpacing: '0.14em',
      }}>
        {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MOBILE LUXE CARD
═══════════════════════════════════════════════════════ */
function MobileLuxeCard({
  item, index, isActive, onClick, totalItems,
}: {
  item: TimelineEvent; index: number; isActive: boolean; onClick: () => void; totalItems: number;
}) {
  const isEdu = item.type === 'education';
  const color    = isEdu ? GOLD      : TEAL_LUX;
  const colorRgb = isEdu ? GOLD_RGB  : TEAL_RGB;
  const Icon     = isEdu ? GraduationCap : Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="tl-timeline-card"
      style={{
        position: 'relative',
        padding: '22px 24px', borderRadius: 20,
        border: `1px solid rgba(${colorRgb},${isActive ? 0.35 : 0.1})`,
        background: isActive
          ? `linear-gradient(145deg, rgba(${colorRgb},0.08), rgba(var(--lux-surface-rgb), 0.95))`
          : 'var(--lux-card-bg)',
        boxShadow: isActive ? `0 0 50px rgba(${colorRgb},0.15), inset 0 1px 0 rgba(${colorRgb},0.1)` : 'none',
        cursor: 'pointer', backdropFilter: 'blur(16px)',
      }}
    >
      {isActive && (
        <div style={{
          position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${colorRgb},0.9), transparent)`,
        }} />
      )}

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Timeline dot + line */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 5 }}>
          <motion.div
            animate={{
              width: isActive ? 16 : 10,
              height: isActive ? 16 : 10,
              boxShadow: isActive ? `0 0 18px ${color}, 0 0 40px rgba(${colorRgb},0.4)` : 'none',
            }}
            transition={{ duration: 0.4 }}
            style={{ borderRadius: '50%', background: color, flexShrink: 0, animation: isActive ? 'tl-pulse 2s ease-in-out infinite' : 'none' }}
          />
          {index < totalItems - 1 && (
            <div style={{
              width: 1, height: 44, marginTop: 8,
              background: `linear-gradient(to bottom, rgba(${colorRgb},0.4), transparent)`,
            }} />
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 999, marginBottom: 8,
            background: `rgba(${colorRgb},0.09)`,
            border: `1px solid rgba(${colorRgb},0.22)`,
            color, fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.18em',
            textTransform: 'uppercase' as const, fontFamily: 'Syne, sans-serif',
          }}>
            <Icon size={8} />
            {isEdu ? 'Education' : 'Experience'}
          </div>

          <h3 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(1.05rem, 3.5vw, 1.3rem)',
            fontWeight: 700, fontStyle: 'italic',
            color: isActive ? color : 'var(--lux-text-strong)',
            lineHeight: 1.25, marginBottom: 6,
            transition: 'color 0.35s ease',
          }}>
            {item.role}
          </h3>

          {isActive && item.desc && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.78rem', color: 'var(--lux-text-soft)',
                lineHeight: 1.75, marginBottom: 10, overflow: 'hidden',
              }}
            >
              {item.desc}
            </motion.p>
          )}

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: '0.7rem', color: 'var(--lux-text-soft)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}>
              <MapPin size={9} style={{ color }} />
              {item.location}
            </span>
            <span style={{
              fontSize: '0.68rem', color,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800, letterSpacing: '0.06em', marginLeft: 'auto',
            }}>
              {item.year}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION HEADER — Ultra Luxury
═══════════════════════════════════════════════════════ */
function LuxuryHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: 'center', marginBottom: 'clamp(56px,8vw,100px)', position: 'relative' }}
    >
      {/* Halo radial behind header */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(600px, 90vw)', height: 'min(600px, 90vw)',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${GOLD_RGB},0.055) 0%, rgba(${ROSE_RGB},0.03) 45%, transparent 70%)`,
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
        animation: 'tl-halo 8s ease-in-out infinite',
      }} />

      {/* Overline badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 12 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 1,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 24px', borderRadius: 999, marginBottom: 32,
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase',
          background: `linear-gradient(135deg, rgba(${GOLD_RGB},0.14), rgba(${ROSE_RGB},0.07), rgba(${GOLD_RGB},0.1))`,
          border: `1px solid rgba(${GOLD_RGB},0.32)`,
          color: GOLD,
          animation: 'tl-badge-glow 4s ease-in-out infinite',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Live green dot */}
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#4ade80',
          display: 'inline-block',
          animation: 'tl-live-dot 2s ease-in-out infinite',
          flexShrink: 0,
        }} />
        Professional Journey
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: GOLD, boxShadow: `0 0 10px ${GOLD}`, display: 'inline-block' }} />
      </motion.div>

      {/* Main title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 1,
          fontFamily: 'Syne, sans-serif', fontWeight: 900,
          fontSize: 'clamp(2.6rem, 6vw, 6.2rem)',
          lineHeight: 0.9, letterSpacing: '-0.048em',
          color: 'var(--text)', marginBottom: 28,
        }}
      >
        Experience{' '}&{' '}
        <br />
        <span style={{
          background: `linear-gradient(135deg, ${GOLD} 0%, ${PLAT} 30%, ${ROSE_GOLD} 60%, ${GOLD} 100%)`,
          backgroundSize: '300% auto',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          fontStyle: 'italic',
          animation: 'tl-gold-shimmer 3.5s linear infinite',
        }}>
          Education
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 1,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 'clamp(0.9rem, 1.35vw, 1.08rem)',
          color: 'var(--lux-text-soft)', lineHeight: 1.95,
          maxWidth: 520, margin: '0 auto 36px',
        }}
      >
        A continuous path of growth through engineering, teaching, and research —
        each milestone forged with precision and purpose.
      </motion.p>

      {/* Decorative triple-line divider */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1, width: 'min(480px, 80vw)',
            background: `linear-gradient(90deg, transparent, rgba(${GOLD_RGB},0.9), rgba(${ROSE_RGB},0.6), rgba(${GOLD_RGB},0.9), transparent)`,
            transformOrigin: 'center',
          }}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1, width: 'min(280px, 50vw)', opacity: 0.35,
            background: `linear-gradient(90deg, transparent, rgba(${PLAT_RGB},0.7), transparent)`,
            transformOrigin: 'center',
          }}
        />
        {/* Center diamond */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.0, type: 'spring', stiffness: 300 }}
          style={{
            width: 10, height: 10,
            background: `linear-gradient(135deg, ${GOLD}, ${ROSE_GOLD})`,
            transform: 'rotate(45deg)',
            margin: '-5px auto 0',
            boxShadow: `0 0 20px ${GOLD}, 0 0 40px rgba(${GOLD_RGB},0.4)`,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
export default function AcademicTimeline() {
  const [timeline, setTimeline]     = useState<TimelineEvent[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { once: false, margin: '-20%' });

  // Auto-cycle
  useEffect(() => {
    if (!isInView) return;
    const count = timeline.length || defaultTimeline.length;
    const id = window.setInterval(() => {
      setActiveIndex(prev => (prev + 1) % count);
    }, 4500);
    return () => clearInterval(id);
  }, [isInView, timeline.length]);

  useEffect(() => {
    fetch('/api/timeline')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        if (data.timeline?.length > 0) {
          setTimeline(data.timeline.map((item: TimelineEvent) => ({
            ...item,
            type: item.type || (
              item.role.toLowerCase().includes('b.e.') || item.role.toLowerCase().includes('msc')
                ? 'education' : 'work'
            ),
          })));
        } else {
          setTimeline(defaultTimeline);
        }
      })
      .catch(() => setTimeline(defaultTimeline));
  }, []);

  const items = timeline.length > 0 ? timeline : defaultTimeline;

  return (
    <section
      ref={sectionRef}
      id="timeline"
      style={{
        position: 'relative', zIndex: 20,
        background: 'var(--bg)', overflow: 'hidden',
      }}
      className="section-py"
    >
      <style>{TIMELINE_CSS}</style>
      <FloatingParticles />

      {/* Aurora ambient glows */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '0%', right: '-20%',
            width: '55vw', height: '55vw', borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${GOLD_RGB},0.07) 0%, transparent 70%)`,
            filter: 'blur(90px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          style={{
            position: 'absolute', bottom: '-5%', left: '-15%',
            width: '48vw', height: '48vw', borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${TEAL_RGB},0.06) 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
          style={{
            position: 'absolute', top: '35%', left: '25%',
            width: '40vw', height: '40vw', borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${ROSE_RGB},0.05) 0%, transparent 70%)`,
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="section-container relative" style={{ position: 'relative', zIndex: 1 }}>
        <LuxuryHeader />

        {/* ── DESKTOP ── */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            style={{
              display: 'flex', alignItems: 'center',
              gap: 'clamp(32px,5vw,72px)', minHeight: 420,
            }}
          >
            {/* Orbital */}
            <motion.div
              initial={{ opacity: 0, scale: 0.65, rotate: -25 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{ flexShrink: 0 }}
            >
              <LuxeOrbital activeIndex={activeIndex} items={items} onSelect={setActiveIndex} />
            </motion.div>

            {/* Right panel */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
              {/* Nav */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <MagneticNav direction="prev" onClick={() => setActiveIndex(i => (i - 1 + items.length) % items.length)} />
                <StepNavigator total={items.length} active={activeIndex} onSelect={setActiveIndex} items={items} />
                <MagneticNav direction="next" onClick={() => setActiveIndex(i => (i + 1) % items.length)} />
              </div>

              {items[activeIndex] && (
                <LuxuryDetailCard item={items[activeIndex]} index={activeIndex} />
              )}
            </div>
          </motion.div>
        </div>

        {/* ── MOBILE ── */}
        <div className="md:hidden flex flex-col gap-4">
          {items.map((item, i) => (
            <MobileLuxeCard
              key={i}
              item={item}
              index={i}
              isActive={activeIndex === i}
              onClick={() => setActiveIndex(i)}
              totalItems={items.length}
            />
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(52px,8vw,96px)' }}
        >
          <motion.a
            href="#contact"
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 60px rgba(${GOLD_RGB},0.35), 0 0 120px rgba(${GOLD_RGB},0.12)`,
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 14,
              padding: '16px 40px', borderRadius: 999,
              fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.82rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: `linear-gradient(135deg, rgba(${GOLD_RGB},0.12), rgba(${ROSE_RGB},0.06))`,
              border: `1px solid rgba(${GOLD_RGB},0.32)`,
              color: GOLD,
              textDecoration: 'none',
              position: 'relative', overflow: 'hidden',
              boxShadow: `0 0 30px rgba(${GOLD_RGB},0.15), inset 0 1px 0 rgba(${GOLD_RGB},0.1)`,
            }}
          >
            {/* Shimmer sweep */}
            <motion.div
              animate={{ x: ['-100%', '300%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: 0, width: '40%',
                background: `linear-gradient(105deg, transparent, rgba(${GOLD_RGB},0.15), transparent)`,
                pointerEvents: 'none',
              }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>Open to Opportunities</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <ChevronRight size={16} />
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
