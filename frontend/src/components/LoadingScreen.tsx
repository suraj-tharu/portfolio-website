import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Cinematic easing presets — tuned for ultra-luxury feel
──────────────────────────────────────────────────────────────── */
const EASE = {
  figmaGentle:  [0.25, 0.46, 0.45, 0.94] as const,
  figmaSpring:  [0.34, 1.56, 0.64, 1]    as const,
  cinematic:    [0.76, 0, 0.24, 1]       as const,
  silkSmooth:   [0.16, 1, 0.3, 1]        as const,
  luxuryIn:     [0.0, 0.0, 0.2, 1.0]     as const,
  expoOut:      [0.16, 1, 0.3, 1]        as const,
};

const DURATION = 3400; // 3.4s luxury load

const WORDS = [
  'Research', 'Innovate', 'Explore',
  'Teach', 'Create', 'Discover',
];

// Deep-space palette matching the portfolio
const C = {
  gold:    '#c9a84c',
  goldMid: '#e8c96a',
  violet:  '#8b5cf6',
  cyan:    '#22d3ee',
  pink:    '#ec4899',
  white:   'rgba(255,255,255,0.92)',
};

type Props = { onComplete: () => void };

/* ─────────────────────────────────────────────────────────────
   Film-grain overlay — adds tactile depth
──────────────────────────────────────────────────────────────── */
function FilmGrain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 256;
    let raf: number;
    const draw = () => {
      const img = ctx.createImageData(256, 256);
      for (let i = 0; i < img.data.length; i += 4) {
        const g = (Math.random() * 18) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = g;
        img.data[i + 3] = 28;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        zIndex: 3, pointerEvents: 'none', opacity: 0.55,
        imageRendering: 'pixelated',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Star-field canvas — deep-space parallax dots
──────────────────────────────────────────────────────────────── */
function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    type Star = { x: number; y: number; r: number; alpha: number; speed: number; hue: number; phase: number };
    const count = Math.min(Math.floor((w * h) / 6000), 200);
    const stars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.2,
      alpha: Math.random() * 0.8 + 0.1,
      speed: Math.random() * 0.18 + 0.04,
      hue: Math.random() < 0.55
        ? Math.random() * 40 + 260   // violet range
        : Math.random() < 0.7
          ? Math.random() * 25 + 38  // gold range
          : Math.random() * 20 + 185, // cyan range
      phase: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.012;
      for (const s of stars) {
        s.phase += s.speed * 0.04;
        const a = s.alpha * (0.6 + 0.4 * Math.sin(s.phase));
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
        grad.addColorStop(0, `hsla(${s.hue},85%,78%,${a})`);
        grad.addColorStop(1, `hsla(${s.hue},85%,78%,0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue},90%,92%,${Math.min(a * 1.6, 1)})`;
        ctx.fill();
      }
      // Subtle connection threads (short-range only)
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.07 * (1 - d / 80)})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

/* ─────────────────────────────────────────────────────────────
   Layered aurora orbs — deep cinematic glow
──────────────────────────────────────────────────────────────── */
function AuroraOrbs() {
  const orbs = [
    { top: '-18%',  left: '-10%', size: '65vw', color: 'rgba(109,40,217,0.35)', dur: '11s', delay: '0s' },
    { bottom: '-18%', right: '-10%', size: '60vw', color: 'rgba(201,168,76,0.18)', dur: '13s', delay: '1.2s' },
    { top: '30%',   left: '40%',  size: '45vw', color: 'rgba(34,211,238,0.14)', dur: '8.5s', delay: '2s' },
    { top: '5%',    right: '15%', size: '32vw', color: 'rgba(236,72,153,0.12)', dur: '15s', delay: '0.4s' },
    { bottom: '15%', left: '10%', size: '28vw', color: 'rgba(139,92,246,0.2)',  dur: '9.5s', delay: '3.5s' },
    { top: '55%',   left: '5%',  size: '20vw', color: 'rgba(201,168,76,0.12)', dur: '7s',   delay: '1.8s' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      {orbs.map((orb, i) => {
        const { size, color, dur, delay: d, ...pos } = orb;
        return (
          <div key={i} style={{
            position: 'absolute', width: size, height: size, borderRadius: '50%',
            background: `radial-gradient(circle,${color} 0%,transparent 70%)`,
            filter: 'blur(90px)',
            animation: `ls-orb ${dur} ease-in-out infinite ${i % 2 === 0 ? '' : 'reverse'}`,
            animationDelay: d,
            ...pos,
          }} />
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Luxury grid — ultra-faint HUD overlay
──────────────────────────────────────────────────────────────── */
function GridLines() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {[16.6, 33.3, 50, 66.6, 83.3].map((pct, i) => (
        <motion.div key={`v${i}`}
          style={{ position: 'absolute', top: 0, bottom: 0, left: `${pct}%`, width: 1, background: 'rgba(255,255,255,0.022)' }}
          initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.07, duration: 1.4, ease: EASE.figmaGentle }}
        />
      ))}
      {[25, 50, 75].map((pct, i) => (
        <motion.div key={`h${i}`}
          style={{ position: 'absolute', left: 0, right: 0, top: `${pct}%`, height: 1, background: 'rgba(255,255,255,0.015)' }}
          initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 1.6, ease: EASE.figmaGentle }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Precision corner brackets — military-spec
──────────────────────────────────────────────────────────────── */
function Corners() {
  const defs = [
    { style: { top: 24, left: 24 },    rot: 0 },
    { style: { top: 24, right: 24 },   rot: 90 },
    { style: { bottom: 24, right: 24 }, rot: 180 },
    { style: { bottom: 24, left: 24 }, rot: 270 },
  ];
  return (
    <>
      {defs.map(({ style, rot }, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', width: 44, height: 44, zIndex: 15, ...style }}
          initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 + i * 0.08, duration: 0.9, ease: EASE.figmaSpring }}
        >
          <motion.div
            style={{
              width: '100%', height: '100%',
              borderTop: `1.5px solid rgba(201,168,76,0.55)`,
              borderLeft: `1.5px solid rgba(201,168,76,0.55)`,
              transform: `rotate(${rot}deg)`,
            }}
            animate={{ borderTopColor: ['rgba(201,168,76,0.55)', 'rgba(139,92,246,0.8)', 'rgba(34,211,238,0.5)', 'rgba(201,168,76,0.55)'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Monogram SVG — animated "STC" initial mark with orbiting ring
──────────────────────────────────────────────────────────────── */
function MonogramMark() {
  return (
    <motion.div style={{ position: 'relative', width: 64, height: 64 }}
      initial={{ scale: 0.3, opacity: 0, rotate: -60 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 1.3, ease: EASE.figmaSpring, delay: 0.08 }}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="mono-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c9a84c" />
            <stop offset="0.45" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
          <filter id="mono-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Outer orbit ring */}
        <motion.circle cx="32" cy="32" r="30" stroke="url(#mono-grad)" strokeWidth="1" fill="none"
          strokeDasharray="12 6"
          style={{ filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.7))' }}
          animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          initial={{ pathLength: 0, opacity: 0 }}
        />
        {/* Inner solid ring */}
        <motion.circle cx="32" cy="32" r="22" stroke="url(#mono-grad)" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: EASE.luxuryIn, delay: 0.3 }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.6))' }}
        />
        {/* Center diamond */}
        <motion.path d="M32 22 L40 32 L32 42 L24 32 Z"
          fill="url(#mono-grad)"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE.figmaSpring, delay: 0.9 }}
          style={{ transformOrigin: '32px 32px', filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.9))' }}
        />
        {/* Cross hairlines */}
        <motion.path d="M32 14 L32 50 M14 32 L50 32"
          stroke="url(#mono-grad)" strokeWidth="0.8" strokeLinecap="round" opacity="0.45"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: EASE.luxuryIn, delay: 0.6 }}
        />
        {/* Tip dot at top of orbit */}
        <motion.circle cx="32" cy="2" r="3" fill="#c9a84c"
          filter="url(#mono-glow)"
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5, ease: EASE.figmaSpring }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(201,168,76,1))' }}
        />
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Cinematic word reveal — per-character Playfair serif
──────────────────────────────────────────────────────────────── */
function CinematicWord({ word }: { word: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={word}
        style={{
          display: 'flex', overflow: 'hidden',
          fontSize: 'clamp(4rem,13vw,11rem)',
          fontWeight: 700,
          fontStyle: 'italic',
          letterSpacing: '-0.04em',
          lineHeight: 0.9,
          fontFamily: "'Playfair Display','Georgia',serif",
          userSelect: 'none',
        }}
      >
        {word.split('').map((ch, i) => (
          <motion.span key={`${word}-${i}`}
            initial={{ y: '115%', opacity: 0, rotateX: 35, skewX: 10 }}
            animate={{ y: '0%',   opacity: 1, rotateX: 0,  skewX: 0  }}
            exit={{    y: '-115%', opacity: 0, rotateX: -25, skewX: -8 }}
            transition={{ delay: i * 0.042, duration: 0.75, ease: EASE.silkSmooth }}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(160deg,#e8c96a 0%,#c9a84c 25%,#a78bfa 55%,#f472b6 80%,#38bdf8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: 'drop-shadow(0 0 60px rgba(201,168,76,0.2))',
              transformOrigin: 'bottom center',
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────
   Name cascade — character-by-character Playfair reveal
──────────────────────────────────────────────────────────────── */
function CascadeName({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden', gap: '0.01em' }}>
      {text.split('').map((ch, i) => (
        <motion.span key={i}
          initial={{ y: '110%', opacity: 0, filter: 'blur(5px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: delay + i * 0.028, duration: 0.6, ease: EASE.silkSmooth }}
          style={{ display: 'inline-block' }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Precision progress ring — 120px cinematic orb
──────────────────────────────────────────────────────────────── */
function ProgressOrb({ progress }: { progress: number }) {
  const R = 52, S = 3;
  const nr = R - S * 2;
  const circ = nr * 2 * Math.PI;
  const offset = circ - (progress / 100) * circ;
  const angle = ((progress / 100) * 360 - 90) * (Math.PI / 180);
  const tipX = R + nr * Math.cos(angle);
  const tipY = R + nr * Math.sin(angle);

  return (
    <div style={{ position: 'relative', width: R * 2, height: R * 2 }}>
      <svg width={R * 2} height={R * 2} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <defs>
          <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#c9a84c" />
            <stop offset="40%"  stopColor="#8b5cf6" />
            <stop offset="75%"  stopColor="#ec4899" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <filter id="prog-glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Outer pulse ring */}
        <circle cx={R} cy={R} r={nr + 10} stroke="rgba(201,168,76,0.06)" fill="none" strokeWidth={1} />
        {/* Track */}
        <circle cx={R} cy={R} r={nr} stroke="rgba(255,255,255,0.04)" fill="none" strokeWidth={S} />
        {/* Progress arc */}
        <circle cx={R} cy={R} r={nr}
          stroke="url(#prog-grad)" fill="none" strokeWidth={S}
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.06s linear', filter: 'drop-shadow(0 0 10px rgba(139,92,246,1)) drop-shadow(0 0 22px rgba(201,168,76,0.5))' }}
        />
        {/* Tip flare */}
        {progress > 2 && (
          <circle cx={tipX} cy={tipY} r={4} fill="white"
            filter="url(#prog-glow)"
            style={{ transition: 'cx 0.06s linear,cy 0.06s linear' }}
          />
        )}
      </svg>
      {/* Center % */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{
          fontSize: '1.25rem', fontWeight: 900, lineHeight: 1,
          fontFamily: "'Inter','SF Pro Display',sans-serif",
          background: 'linear-gradient(135deg,#e8c96a,#8b5cf6,#f472b6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          letterSpacing: '-0.04em',
        }}>
          {progress}
        </span>
        <span style={{ fontSize: '0.42rem', color: 'rgba(201,168,76,0.4)', fontWeight: 700, letterSpacing: '0.2em' }}>%</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Gold progress bar — hair-thin luxury strip
──────────────────────────────────────────────────────────────── */
function GoldBar({ progress }: { progress: number }) {
  return (
    <div style={{ position: 'relative', height: 1, borderRadius: 999, background: 'rgba(255,255,255,0.04)' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg,#c9a84c 0%,#8b5cf6 40%,#ec4899 75%,#22d3ee 100%)',
        borderRadius: 999,
        transition: 'width 0.06s linear',
        boxShadow: '0 0 14px rgba(139,92,246,0.9), 0 0 28px rgba(201,168,76,0.5)',
      }} />
      {/* Glow haze */}
      <div style={{
        position: 'absolute', top: -3, left: 0,
        width: `${progress}%`, height: 7, borderRadius: 999,
        background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.3),rgba(139,92,246,0.4),transparent)',
        filter: 'blur(4px)', transition: 'width 0.06s linear',
      }} />
      {/* Running tip */}
      {progress > 0 && progress < 100 && (
        <div style={{
          position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)',
          left: `${progress}%`, width: 7, height: 7, borderRadius: '50%',
          background: 'white',
          boxShadow: '0 0 10px rgba(255,255,255,1), 0 0 22px rgba(201,168,76,0.9)',
          transition: 'left 0.06s linear',
        }} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Status pill — animated phase chip
──────────────────────────────────────────────────────────────── */
function StatusPill({ progress }: { progress: number }) {
  const label =
    progress < 25 ? 'Initializing' :
    progress < 55 ? 'Loading Assets' :
    progress < 85 ? 'Rendering' : 'Almost Ready';

  return (
    <motion.div key={label}
      initial={{ opacity: 0, y: -8, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE.figmaSpring }}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 14px', borderRadius: 999,
        border: '1px solid rgba(201,168,76,0.18)',
        background: 'rgba(8,6,18,0.7)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 0 24px rgba(201,168,76,0.06), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <motion.span
        style={{
          width: 5, height: 5, borderRadius: '50%',
          background: 'linear-gradient(135deg,#c9a84c,#8b5cf6)',
          boxShadow: '0 0 0 3px rgba(201,168,76,0.15)',
          display: 'inline-block',
        }}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <AnimatePresence mode="wait">
        <motion.span key={label}
          initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }}
          transition={{ duration: 0.28, ease: EASE.figmaGentle }}
          style={{
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)',
            fontFamily: "'Inter',sans-serif",
          }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Geometric SVG centerpiece — animated helix/compass rose
──────────────────────────────────────────────────────────────── */
function GeometricOrb({ progress }: { progress: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', width: 'clamp(260px,42vw,520px)', height: 'clamp(260px,42vw,520px)', pointerEvents: 'none' }}
      initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: EASE.silkSmooth, delay: 0.2 }}
    >
      <svg viewBox="0 0 400 400" fill="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="geo-grad1" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c9a84c" stopOpacity="0.6" />
            <stop offset="0.5" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="geo-grad2" x1="400" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ec4899" stopOpacity="0.4" />
            <stop offset="1" stopColor="#c9a84c" stopOpacity="0.3" />
          </linearGradient>
          <filter id="geo-glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Outer rotating ring — slow */}
        <motion.circle cx="200" cy="200" r="190" stroke="url(#geo-grad1)" strokeWidth="0.6" fill="none"
          strokeDasharray="20 8"
          animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 200px' }}
        />
        {/* Mid ring */}
        <motion.circle cx="200" cy="200" r="150" stroke="url(#geo-grad2)" strokeWidth="0.8" fill="none"
          strokeDasharray="8 14"
          animate={{ rotate: -360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 200px' }}
        />
        {/* Compass lines — 8 cardinal/intercardinal */}
        {[0,22.5,45,67.5,90,112.5,135,157.5].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const inner = i % 2 === 0 ? 80 : 115;
          const outer = i % 2 === 0 ? 168 : 145;
          return (
            <motion.line key={i}
              x1={200 + inner * Math.cos(rad)} y1={200 + inner * Math.sin(rad)}
              x2={200 + outer * Math.cos(rad)} y2={200 + outer * Math.sin(rad)}
              stroke={i % 2 === 0 ? 'rgba(201,168,76,0.4)' : 'rgba(139,92,246,0.3)'}
              strokeWidth={i % 2 === 0 ? 1.2 : 0.7} strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.8, ease: EASE.luxuryIn }}
            />
          );
        })}
        {/* Progress arc on inner circle */}
        <motion.circle cx="200" cy="200" r="80"
          stroke="url(#geo-grad1)" fill="none" strokeWidth="1.5" strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 80} ${2 * Math.PI * 80}`}
          strokeDashoffset={2 * Math.PI * 80 * (1 - progress / 100)}
          style={{ rotate: '-90deg', transformOrigin: '200px 200px', filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.8))' }}
          initial={{ rotate: '-90deg' }}
        />
        {/* Center hexagon */}
        <motion.path
          d={`M200,160 L235,180 L235,220 L200,240 L165,220 L165,180 Z`}
          stroke="url(#geo-grad1)" strokeWidth="1" fill="rgba(139,92,246,0.04)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1.0, duration: 1, ease: EASE.luxuryIn }}
          filter="url(#geo-glow)"
        />
        {/* Inner cross */}
        <motion.path d="M200 176 L200 224 M176 200 L224 200"
          stroke="rgba(201,168,76,0.5)" strokeWidth="0.8" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 0.8, ease: EASE.luxuryIn }}
        />
        {/* Center dot */}
        <motion.circle cx="200" cy="200" r="4" fill="url(#geo-grad1)"
          filter="url(#geo-glow)"
          animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Ticker tape — scrolling expertise tags
──────────────────────────────────────────────────────────────── */
const TAGS = ['Computer Engineering', 'GIS Research', 'Remote Sensing', 'Machine Learning',
  'Nepal', 'LULC Analysis', 'Full-Stack Dev', 'Data Science', 'Spatial Intelligence'];

function TickerTape() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
      style={{ overflow: 'hidden', height: 16, position: 'relative' }}
    >
      <div style={{
        display: 'flex', gap: 32, whiteSpace: 'nowrap',
        animation: 'ls-ticker 22s linear infinite', width: '200%',
      }}>
        {[0, 1].map(rep => (
          <span key={rep} style={{
            fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.28em',
            textTransform: 'uppercase', color: 'rgba(139,92,246,0.25)', flexShrink: 0,
          }}>
            {TAGS.map((t, i) => <span key={i}>{t}&nbsp;&nbsp;·&nbsp;&nbsp;</span>)}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Glitch title — tri-layer chromatic aberration
──────────────────────────────────────────────────────────────── */
function GlitchTitle({ text }: { text: string }) {
  return (
    <div style={{ position: 'relative', fontFamily: "'Playfair Display','Georgia',serif", fontStyle: 'italic' }}>
      <span aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg,#c9a84c,#8b5cf6)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        animation: 'glitch1 5s infinite', clipPath: 'polygon(0 15%,100% 15%,100% 42%,0 42%)', opacity: 0.6,
      }}>{text}</span>
      <span aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg,#22d3ee,#ec4899)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        animation: 'glitch2 5s infinite', clipPath: 'polygon(0 60%,100% 60%,100% 80%,0 80%)', opacity: 0.4,
      }}>{text}</span>
      <span style={{
        background: 'linear-gradient(135deg,#e8c96a 0%,#c9a84c 20%,#8b5cf6 55%,#f472b6 80%,#22d3ee 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>{text}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main LoadingScreen — ultra-premium cinematic edition
──────────────────────────────────────────────────────────────── */
export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'exit'>('loading');
  const motionProgress = useMotionValue(0);
  const year = useMemo(() => new Date().getFullYear(), []);

  // Eased progress ramp
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / DURATION, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const pct = Math.floor(eased * 100);
      setProgress(pct);
      motionProgress.set(pct);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(() => { setPhase('exit'); setTimeout(onComplete, 1100); }, 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete, motionProgress]);

  // Word cycling
  useEffect(() => {
    const id = setInterval(() => setWordIdx(p => (p + 1) % WORDS.length), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400;1,700;1,900&family=Inter:wght@400;600;700;900&display=swap');

        @keyframes glitch1 {
          0%,91%  { transform:translate(0,0) skewX(0deg); }
          92%     { transform:translate(-3px,1px) skewX(-1.5deg); }
          94%     { transform:translate(3px,-1px) skewX(1deg); }
          96%     { transform:translate(-1.5px,2px) skewX(0deg); }
          100%    { transform:translate(0,0) skewX(0deg); }
        }
        @keyframes glitch2 {
          0%,93%  { transform:translate(0,0) skewX(0deg); }
          94%     { transform:translate(3px,2px) skewX(1.5deg); }
          96%     { transform:translate(-3px,-1.5px) skewX(-1deg); }
          98%     { transform:translate(1.5px,1px) skewX(0.4deg); }
          100%    { transform:translate(0,0) skewX(0deg); }
        }
        @keyframes ls-orb {
          0%,100% { transform:translate(0,0) scale(1) rotate(0deg); }
          25%     { transform:translate(30px,-25px) scale(1.05) rotate(4deg); }
          50%     { transform:translate(-12px,20px) scale(0.97) rotate(-2deg); }
          75%     { transform:translate(18px,8px) scale(1.03) rotate(3deg); }
        }
        @keyframes ls-ticker {
          0%   { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
        @keyframes ls-scanline {
          0%   { transform:translateY(-100%); }
          100% { transform:translateY(220vh); }
        }
      `}</style>

      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            key="ultra-luxury-loader"
            className="fixed inset-0 overflow-hidden flex flex-col"
            style={{
              zIndex: 9999,
              background: 'linear-gradient(160deg,#050310 0%,#0a0720 35%,#070c1a 65%,#060410 100%)',
              fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif",
            }}
            exit={{
              clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'],
              transition: { duration: 1.1, ease: EASE.cinematic },
            }}
          >
            {/* ── Background Layers ── */}
            <StarField />
            <AuroraOrbs />
            <GridLines />
            <FilmGrain />
            <Corners />

            {/* Scanline sweep */}
            <div style={{
              position: 'absolute', left: 0, right: 0, height: '28%', zIndex: 4, pointerEvents: 'none',
              background: 'linear-gradient(to bottom,rgba(139,92,246,0.025),transparent)',
              animation: 'ls-scanline 8s linear infinite',
            }} />

            {/* Top accent line */}
            <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 20 }}
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 2, ease: EASE.luxuryIn, delay: 0.05 }}
            >
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(90deg,transparent 0%,#c9a84c 15%,#8b5cf6 50%,#22d3ee 85%,transparent 100%)',
                boxShadow: '0 0 24px rgba(139,92,246,0.7)',
              }} />
            </motion.div>

            {/* ── MAIN CONTENT ── */}
            <div className="relative flex flex-col justify-between h-full" style={{ padding: 'clamp(22px,3.5vw,64px)', zIndex: 10 }}>

              {/* ── TOP ROW ── */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                {/* Logo + Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <MonogramMark />
                  <motion.div
                    initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: EASE.silkSmooth, delay: 0.15 }}
                  >
                    <div style={{ fontSize: 'clamp(1.5rem,3.8vw,2.8rem)', fontWeight: 900, lineHeight: 1 }}>
                      <GlitchTitle text="Er. Suraj" />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55, duration: 0.6, ease: EASE.figmaGentle }}
                      style={{
                        marginTop: 4,
                        fontSize: 'clamp(0.5rem,0.9vw,0.65rem)',
                        letterSpacing: '0.32em', textTransform: 'uppercase',
                        color: 'rgba(201,168,76,0.42)', fontWeight: 600,
                      }}
                    >
                      Portfolio &nbsp;·&nbsp; {year}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Status pill */}
                <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: EASE.silkSmooth }}
                >
                  <StatusPill progress={progress} />
                </motion.div>
              </div>

              {/* ── CENTER ── */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 0 }}>

                {/* Geometric centerpiece behind text */}
                <GeometricOrb progress={progress} />

                {/* Top rule */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1.2, ease: EASE.luxuryIn }}
                  style={{
                    width: 'clamp(50px,10vw,120px)', height: 1,
                    background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.55),transparent)',
                    marginBottom: 'clamp(14px,2vw,28px)',
                  }}
                />

                {/* Big cinematic word */}
                <div style={{ perspective: '1400px', position: 'relative', zIndex: 5 }}>
                  <CinematicWord word={WORDS[wordIdx]} />
                </div>

                {/* Descriptor */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.9, ease: EASE.silkSmooth }}
                  style={{
                    marginTop: 'clamp(8px,1.5vw,16px)',
                    fontSize: 'clamp(0.58rem,1vw,0.72rem)',
                    letterSpacing: '0.38em', textTransform: 'uppercase',
                    color: 'rgba(139,92,246,0.32)', fontWeight: 600,
                    fontFamily: "'Inter',sans-serif",
                  }}
                >
                  — Building Tomorrow Today —
                </motion.div>

                {/* Bottom rule */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.65, duration: 1.2, ease: EASE.luxuryIn }}
                  style={{
                    marginTop: 'clamp(14px,2vw,28px)',
                    width: 'clamp(50px,10vw,120px)', height: 1,
                    background: 'linear-gradient(90deg,transparent,rgba(34,211,238,0.45),transparent)',
                  }}
                />
              </div>

              {/* ── BOTTOM ROW ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px,1.6vw,20px)' }}>

                {/* Ticker */}
                <TickerTape />

                {/* Progress row */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
                  {/* Left: label + mini stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: EASE.silkSmooth }}
                    style={{ flexShrink: 0 }}
                  >
                    <div style={{
                      fontSize: 'clamp(0.5rem,0.85vw,0.62rem)',
                      letterSpacing: '0.3em', textTransform: 'uppercase',
                      color: 'rgba(201,168,76,0.32)', fontWeight: 700, marginBottom: 6,
                    }}>
                      Loading Portfolio
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                      {[
                        { label: 'Assets', val: `${Math.floor(progress * 0.48)} KB` },
                        { label: 'Modules', val: `${Math.floor(progress * 0.12)}/12` },
                      ].map(item => (
                        <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: '0.5rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(139,92,246,0.28)', fontWeight: 600 }}>
                            {item.label}
                          </span>
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(139,92,246,0.5)', fontVariantNumeric: 'tabular-nums' }}>
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Right: progress orb */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.28, duration: 1.1, ease: EASE.figmaSpring }}
                  >
                    <ProgressOrb progress={progress} />
                  </motion.div>
                </div>

                {/* Progress bar */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.45, duration: 0.9, ease: EASE.luxuryIn }}
                  style={{ originX: 0 }}
                >
                  <GoldBar progress={progress} />
                </motion.div>

                {/* Footer info */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.75, duration: 0.8 }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: 'clamp(0.55rem,0.9vw,0.67rem)',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(139,92,246,0.26)', fontWeight: 600,
                    fontFamily: "'Inter',sans-serif",
                  }}
                >
                  <span style={{
                    fontSize: 'clamp(0.6rem,1vw,0.72rem)',
                    background: 'linear-gradient(90deg,rgba(201,168,76,0.65),rgba(139,92,246,0.55),rgba(244,114,182,0.5))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    letterSpacing: '0.04em', fontWeight: 700,
                    fontFamily: "'Playfair Display','Georgia',serif",
                  }}>
                    <CascadeName text="Suraj Tharu Chaudhary" delay={0.78} />
                  </span>
                  <span style={{ textAlign: 'right' }}>Nepal · Computer Engineer</span>
                </motion.div>
              </div>
            </div>

            {/* Bottom accent line */}
            <motion.div
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5, zIndex: 20 }}
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 2.2, ease: EASE.luxuryIn, delay: 0.15 }}
            >
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(90deg,transparent 0%,#22d3ee 18%,#8b5cf6 50%,#c9a84c 82%,transparent 100%)',
                boxShadow: '0 0 18px rgba(34,211,238,0.5)',
              }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
