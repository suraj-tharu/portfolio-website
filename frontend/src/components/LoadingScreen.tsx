import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Figma Smart-Animate inspired easing presets
   All curves tuned to match Figma's "Gentle", "Quick", "Bouncy"
   and custom cinematic "Film" curve
──────────────────────────────────────────────────────────────── */
const EASE = {
  figmaGentle:    [0.25, 0.46, 0.45, 0.94] as const,
  figmaQuick:     [0.55, 0.055, 0.675, 0.19] as const,
  figmaSpring:    [0.34, 1.56, 0.64, 1] as const,
  cinematic:      [0.76, 0, 0.24, 1] as const,
  silkSmooth:     [0.16, 1, 0.3, 1] as const,
  luxuryIn:       [0.0, 0.0, 0.2, 1.0] as const,
  elasticOut:     [0.215, 0.61, 0.355, 1] as const,
  warpDrive:      [0.87, 0, 0.13, 1] as const,
};

const DURATION = 3200; // 3.2s luxury load
const WORDS = ['Research', 'Innovate', 'Explore', 'Teach', 'Create', 'Design'];

type Props = { onComplete: () => void };

/* ─────────────────────────────────────────────────────────────
   Luxury particle system — golden + violet aurora
──────────────────────────────────────────────────────────────── */
function LuxuryParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    type P = {
      x: number; y: number; r: number; vx: number; vy: number;
      alpha: number; hue: number; pulse: number; pulseSpeed: number;
    };

    const count = Math.min(Math.floor((w * h) / 9000), 140);
    const particles: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.7 + 0.15,
      hue: Math.random() < 0.6 ? Math.random() * 40 + 260 : Math.random() * 30 + 35, // violet or gold
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const liveAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        const liveR = p.r * (0.85 + 0.15 * Math.sin(p.pulse * 0.7));

        // Glow halo
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, liveR * 4);
        grad.addColorStop(0, `hsla(${p.hue},90%,75%,${liveAlpha})`);
        grad.addColorStop(1, `hsla(${p.hue},90%,75%,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, liveR * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, liveR, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,82%,${liveAlpha * 1.4})`;
        ctx.fill();
      }

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const alpha = 0.12 * (1 - dist / 100);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 z-0 pointer-events-none" />;
}

/* ─────────────────────────────────────────────────────────────
   Animated progress orb (magnetic liquid feel)
──────────────────────────────────────────────────────────────── */
function MagneticOrb({ progress }: { progress: number }) {
  const radius = 60;
  const stroke = 3;
  const nr = radius - stroke * 2;
  const circ = nr * 2 * Math.PI;
  const dashOffset = circ - (progress / 100) * circ;
  const angle = ((progress / 100) * 360 - 90) * (Math.PI / 180);
  const tipX = radius + nr * Math.cos(angle);
  const tipY = radius + nr * Math.sin(angle);

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg width={radius * 2} height={radius * 2} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <defs>
          <linearGradient id="orb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="35%" stopColor="#a78bfa" />
            <stop offset="70%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="orb-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Track ring */}
        <circle
          stroke="rgba(255,255,255,0.04)"
          fill="transparent"
          strokeWidth={stroke}
          r={nr} cx={radius} cy={radius}
        />
        {/* Outer faint track */}
        <circle
          stroke="rgba(167,139,250,0.08)"
          fill="transparent"
          strokeWidth={1}
          r={nr + 8} cx={radius} cy={radius}
        />
        {/* Progress arc */}
        <circle
          stroke="url(#orb-grad)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          r={nr} cx={radius} cy={radius}
          style={{
            transition: 'stroke-dashoffset 0.06s linear',
            filter: 'drop-shadow(0 0 10px rgba(167,139,250,1)) drop-shadow(0 0 24px rgba(245,158,11,0.6))',
          }}
        />
        {/* Glowing tip dot */}
        {progress > 2 && (
          <circle
            cx={tipX} cy={tipY} r={4.5}
            fill="#f8fafc"
            filter="url(#orb-glow)"
            style={{ transition: 'cx 0.06s linear, cy 0.06s linear' }}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ gap: 1 }}>
        <span style={{
          fontSize: '1.45rem', fontWeight: 900, lineHeight: 1,
          fontFamily: "'Inter', 'SF Pro Display', sans-serif",
          background: 'linear-gradient(135deg,#f59e0b 0%,#a78bfa 50%,#f472b6 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          letterSpacing: '-0.04em',
        }}>
          {progress}
        </span>
        <span style={{ fontSize: '0.48rem', color: 'rgba(167,139,250,0.45)', fontWeight: 700, letterSpacing: '0.15em' }}>
          %
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Smart-Animate word reveal (Figma-style position + opacity morph)
──────────────────────────────────────────────────────────────── */
function SmartWord({ word }: { word: string }) {
  const chars = word.split('');
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={word}
        style={{
          display: 'flex',
          fontSize: 'clamp(4.5rem,14vw,12rem)',
          fontWeight: 900,
          fontStyle: 'italic',
          letterSpacing: '-0.05em',
          lineHeight: 1,
          fontFamily: "'Inter', 'SF Pro Display', Georgia, serif",
          userSelect: 'none',
          overflow: 'hidden',
        }}
      >
        {chars.map((ch, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ y: '110%', opacity: 0, rotateZ: 8, scale: 0.85 }}
            animate={{ y: '0%', opacity: 1, rotateZ: 0, scale: 1 }}
            exit={{ y: '-110%', opacity: 0, rotateZ: -6, scale: 0.9 }}
            transition={{
              delay: i * 0.038,
              duration: 0.72,
              ease: EASE.silkSmooth,
            }}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg,rgba(245,158,11,0.22),rgba(167,139,250,0.2),rgba(244,114,182,0.18),rgba(56,189,248,0.2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 80px rgba(124,58,237,0.25))',
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
   Character cascade name reveal (Figma Smart Animate style)
──────────────────────────────────────────────────────────────── */
function CascadeName({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden', gap: '0.02em' }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: '105%', opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          transition={{
            delay: delay + i * 0.032,
            duration: 0.65,
            ease: EASE.silkSmooth,
          }}
          style={{ display: 'inline-block' }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Morphing logo mark (animated SVG with Smart Animate paths)
──────────────────────────────────────────────────────────────── */
function LogoMark() {
  return (
    <motion.svg
      width="44" height="44" viewBox="0 0 44 44" fill="none"
      initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 1.1, ease: EASE.figmaSpring, delay: 0.1 }}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <motion.circle
        cx="22" cy="22" r="20" stroke="url(#logo-grad)" strokeWidth="1.5" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: EASE.luxuryIn, delay: 0.2 }}
        style={{ filter: 'drop-shadow(0 0 8px rgba(167,139,250,0.7))' }}
      />
      {/* Inner cross */}
      <motion.path
        d="M22 8 L22 36 M8 22 L36 22"
        stroke="url(#logo-grad)" strokeWidth="1" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1, ease: EASE.luxuryIn, delay: 0.5 }}
      />
      {/* Center diamond */}
      <motion.path
        d="M22 16 L28 22 L22 28 L16 22 Z"
        fill="url(#logo-grad)"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE.figmaSpring, delay: 0.8 }}
        style={{ transformOrigin: '22px 22px', filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.8))' }}
      />
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Horizontal luxury bar (Figma-style scaleX morph)
──────────────────────────────────────────────────────────────── */
function LuxuryBar({ progress }: { progress: number }) {
  return (
    <div style={{ position: 'relative', height: 1.5, borderRadius: 999, overflow: 'visible', background: 'rgba(255,255,255,0.04)' }}>
      {/* Main fill */}
      <div style={{
        position: 'absolute', top: 0, left: 0, height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg,#f59e0b 0%,#a78bfa 40%,#ec4899 75%,#06b6d4 100%)',
        borderRadius: 999,
        transition: 'width 0.06s linear',
        boxShadow: '0 0 16px rgba(167,139,250,0.9), 0 0 32px rgba(245,158,11,0.5)',
      }} />
      {/* Glow pulse overlay */}
      <div style={{
        position: 'absolute', top: -3, left: 0,
        width: `${progress}%`,
        height: 7, borderRadius: 999,
        background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.3),rgba(167,139,250,0.4),transparent)',
        filter: 'blur(4px)',
        transition: 'width 0.06s linear',
      }} />
      {/* Tip flare */}
      {progress > 0 && progress < 100 && (
        <div style={{
          position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)',
          left: `${progress}%`,
          width: 8, height: 8, borderRadius: '50%',
          background: 'white',
          boxShadow: '0 0 12px rgba(255,255,255,1), 0 0 24px rgba(245,158,11,0.9)',
          transition: 'left 0.06s linear',
        }} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Glitch title (tri-layer, high fidelity)
──────────────────────────────────────────────────────────────── */
function GlitchTitle({ text }: { text: string }) {
  return (
    <div className="relative select-none" style={{ fontFamily: "'Inter','SF Pro Display',Georgia,serif" }}>
      <span aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg,#f59e0b,#a78bfa)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        animation: 'glitch1 4s infinite', clipPath: 'polygon(0 20%,100% 20%,100% 45%,0 45%)',
        opacity: 0.65,
      }}>{text}</span>
      <span aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg,#06b6d4,#ec4899)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        animation: 'glitch2 4s infinite', clipPath: 'polygon(0 58%,100% 58%,100% 78%,0 78%)',
        opacity: 0.45,
      }}>{text}</span>
      <span style={{
        background: 'linear-gradient(135deg,#f59e0b 0%,#a78bfa 45%,#f472b6 75%,#38bdf8 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>{text}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Animated grid lines (luxury HUD feel)
──────────────────────────────────────────────────────────────── */
function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Vertical lines */}
      {[16.6, 33.3, 50, 66.6, 83.3].map((pct, i) => (
        <motion.div
          key={`v${i}`}
          style={{
            position: 'absolute', top: 0, bottom: 0, left: `${pct}%`,
            width: 1, background: 'rgba(255,255,255,0.025)',
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 0.15 + i * 0.08, duration: 1.2, ease: EASE.figmaGentle }}
        />
      ))}
      {/* Horizontal lines */}
      {[25, 50, 75].map((pct, i) => (
        <motion.div
          key={`h${i}`}
          style={{
            position: 'absolute', left: 0, right: 0, top: `${pct}%`,
            height: 1, background: 'rgba(255,255,255,0.018)',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.25 + i * 0.12, duration: 1.4, ease: EASE.figmaGentle }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Corner decorators (animated inward draw)
──────────────────────────────────────────────────────────────── */
function Corners() {
  const corners = [
    { top: 20, left: 20, rotate: 0 },
    { top: 20, right: 20, rotate: 90 },
    { bottom: 20, right: 20, rotate: 180 },
    { bottom: 20, left: 20, rotate: 270 },
  ];
  return (
    <>
      {corners.map(({ rotate, ...pos }, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', width: 36, height: 36, zIndex: 10, ...pos }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: EASE.figmaSpring }}
        >
          <motion.div
            style={{
              width: '100%', height: '100%',
              borderTop: '1.5px solid rgba(245,158,11,0.5)',
              borderLeft: '1.5px solid rgba(167,139,250,0.5)',
              transform: `rotate(${rotate}deg)`,
              boxShadow: 'inset 0 0 8px rgba(245,158,11,0.1)',
            }}
            animate={{ borderTopColor: ['rgba(245,158,11,0.5)','rgba(167,139,250,0.9)','rgba(6,182,212,0.6)','rgba(245,158,11,0.5)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Luxury status chip
──────────────────────────────────────────────────────────────── */
function StatusChip({ progress }: { progress: number }) {
  const label =
    progress < 30 ? 'Initializing' :
    progress < 60 ? 'Loading Assets' :
    progress < 90 ? 'Rendering' : 'Almost Ready';

  return (
    <motion.div
      key={label}
      initial={{ opacity: 0, y: -6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE.figmaSpring }}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 16px', borderRadius: 999,
        border: '1px solid rgba(245,158,11,0.2)',
        background: 'rgba(10,8,20,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 0 20px rgba(245,158,11,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <motion.span
        style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'linear-gradient(135deg,#f59e0b,#a78bfa)',
          boxShadow: '0 0 0 3px rgba(245,158,11,0.18)',
          display: 'inline-block',
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={label}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.3, ease: EASE.figmaGentle }}
          style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'rgba(245,158,11,0.75)',
          }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Animated background — 5-orb aurora system
──────────────────────────────────────────────────────────────── */
function AuroraOrbs() {
  const orbs = [
    { top: '-20%', left: '-12%', size: '60vw', color: 'rgba(124,58,237,0.38)', dur: '10s', delay: '0s' },
    { bottom: '-15%', right: '-12%', size: '55vw', color: 'rgba(236,72,153,0.3)', dur: '12s', delay: '1s' },
    { top: '35%', left: '45%', size: '40vw', color: 'rgba(6,182,212,0.22)', dur: '8s', delay: '2s' },
    { top: '10%', right: '20%', size: '30vw', color: 'rgba(245,158,11,0.18)', dur: '14s', delay: '0.5s' },
    { bottom: '20%', left: '15%', size: '25vw', color: 'rgba(167,139,250,0.2)', dur: '9s', delay: '3s' },
  ];
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size, height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle,${orb.color} 0%,transparent 70%)`,
            filter: 'blur(80px)',
            animation: `ls-orb ${orb.dur} ease-in-out infinite ${i % 2 === 0 ? '' : 'reverse'}`,
            animationDelay: orb.delay,
            ...(orb as Record<string, string>),
            size: undefined,
            color: undefined,
            dur: undefined,
            delay: undefined,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main LoadingScreen
──────────────────────────────────────────────────────────────── */
export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'exit'>('loading');

  // Smooth animated counter
  const motionProgress = useMotionValue(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      // Figma-style eased progress: ease-in-out cubic
      const t = Math.min((ts - start) / DURATION, 1);
      // Custom luxury easing: slow start, fast middle, gentle end
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const pct = Math.floor(eased * 100);
      setProgress(pct);
      motionProgress.set(pct);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(() => {
          setPhase('exit');
          setTimeout(onComplete, 950);
        }, 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete, motionProgress]);

  // Word cycle — faster than loading for visual richness
  useEffect(() => {
    const id = setInterval(() => setWordIdx(p => (p + 1) % WORDS.length), 850);
    return () => clearInterval(id);
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

        @keyframes glitch1 {
          0%,92%  { transform:translate(0,0) skewX(0deg); }
          93%     { transform:translate(-4px,1px) skewX(-2deg); }
          95%     { transform:translate(4px,-1px) skewX(1deg); }
          97%     { transform:translate(-2px,2px) skewX(0deg); }
          100%    { transform:translate(0,0) skewX(0deg); }
        }
        @keyframes glitch2 {
          0%,94%  { transform:translate(0,0) skewX(0deg); }
          95%     { transform:translate(4px,2px) skewX(2deg); }
          97%     { transform:translate(-4px,-2px) skewX(-1deg); }
          99%     { transform:translate(2px,1px) skewX(0.5deg); }
          100%    { transform:translate(0,0) skewX(0deg); }
        }
        @keyframes ls-orb {
          0%,100% { transform:translate(0,0) scale(1) rotate(0deg); }
          25%     { transform:translate(35px,-30px) scale(1.06) rotate(5deg); }
          50%     { transform:translate(-15px,25px) scale(0.96) rotate(-3deg); }
          75%     { transform:translate(20px,10px) scale(1.04) rotate(4deg); }
        }
        @keyframes ls-pulse-ring {
          0%   { transform:scale(0.9); opacity:0.8; }
          70%  { transform:scale(1.3); opacity:0; }
          100% { transform:scale(1.3); opacity:0; }
        }
        @keyframes ls-ticker {
          0%   { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
        @keyframes ls-scanline {
          0%   { transform:translateY(-100%); }
          100% { transform:translateY(200vh); }
        }
        @keyframes ls-float {
          0%,100% { transform:translateY(0px) rotate(0deg); }
          50%     { transform:translateY(-12px) rotate(2deg); }
        }
      `}</style>

      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            key="luxury-loader"
            className="fixed inset-0 overflow-hidden flex flex-col"
            style={{
              zIndex: 9999,
              background: 'linear-gradient(155deg,#06040f 0%,#0c0a1e 35%,#090d1c 65%,#07060f 100%)',
              fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif",
            }}
            exit={{
              opacity: 0,
              scale: 1.06,
              filter: 'blur(28px) brightness(1.5)',
              transition: { duration: 0.95, ease: EASE.cinematic },
            }}
          >
            {/* Background layers */}
            <LuxuryParticles />
            <AuroraOrbs />
            <GridLines />
            <Corners />

            {/* Thin top accent line */}
            <motion.div
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 20 }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.8, ease: EASE.luxuryIn, delay: 0.1 }}
            >
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(90deg,transparent 0%,#f59e0b 20%,#a78bfa 50%,#06b6d4 80%,transparent 100%)',
                boxShadow: '0 0 20px rgba(167,139,250,0.8)',
              }} />
            </motion.div>

            {/* Slow scanline sweep */}
            <div style={{
              position: 'absolute', left: 0, right: 0, height: '25%', zIndex: 2, pointerEvents: 'none',
              background: 'linear-gradient(to bottom,rgba(167,139,250,0.03),transparent)',
              animation: 'ls-scanline 7s linear infinite',
            }} />

            {/* ── MAIN CONTENT ── */}
            <div className="relative z-10 flex flex-col justify-between h-full" style={{ padding: 'clamp(20px,3.5vw,60px)' }}>

              {/* ── TOP ROW ── */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                {/* Logo + Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <LogoMark />
                  <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: EASE.silkSmooth, delay: 0.2 }}
                  >
                    <div style={{
                      fontSize: 'clamp(1.6rem,4vw,3rem)',
                      fontWeight: 900, fontStyle: 'italic',
                      letterSpacing: '-0.03em', lineHeight: 1,
                    }}>
                      <GlitchTitle text="Er. Suraj" />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.7, ease: EASE.figmaGentle }}
                      style={{
                        marginTop: 4,
                        fontSize: 'clamp(0.55rem,1vw,0.7rem)',
                        letterSpacing: '0.3em', textTransform: 'uppercase',
                        color: 'rgba(245,158,11,0.45)', fontWeight: 600,
                      }}
                    >
                      Portfolio · {year}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Status chip */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: EASE.silkSmooth }}
                >
                  <StatusChip progress={progress} />
                </motion.div>
              </div>

              {/* ── CENTER: Big word + decorative line ── */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                {/* Decorative glow ring behind word */}
                <motion.div
                  style={{
                    position: 'absolute',
                    width: 'clamp(280px,50vw,600px)',
                    height: 'clamp(280px,50vw,600px)',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(124,58,237,0.07) 0%,rgba(245,158,11,0.04) 40%,transparent 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                  }}
                  animate={{ scale: [0.95, 1.05, 0.95], rotate: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Thin decorative top rule */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1.2, ease: EASE.luxuryIn }}
                  style={{
                    width: 'clamp(60px,12vw,140px)', height: 1,
                    background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.6),transparent)',
                    marginBottom: 'clamp(16px,2.5vw,32px)',
                  }}
                />

                {/* Main big word — Figma Smart Animate */}
                <div style={{ perspective: '1200px' }}>
                  <SmartWord word={WORDS[wordIdx]} />
                </div>

                {/* Descriptor line */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.9, ease: EASE.silkSmooth }}
                  style={{
                    marginTop: 'clamp(10px,2vw,20px)',
                    fontSize: 'clamp(0.62rem,1.1vw,0.8rem)',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: 'rgba(167,139,250,0.35)',
                    fontWeight: 600,
                  }}
                >
                  — Building Tomorrow Today —
                </motion.div>

                {/* Thin bottom rule */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.65, duration: 1.2, ease: EASE.luxuryIn }}
                  style={{
                    marginTop: 'clamp(16px,2.5vw,32px)',
                    width: 'clamp(60px,12vw,140px)', height: 1,
                    background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.5),transparent)',
                  }}
                />
              </div>

              {/* ── BOTTOM ROW ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,1.8vw,22px)' }}>

                {/* Ticker tape */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                  style={{ overflow: 'hidden', height: 18, position: 'relative' }}
                >
                  <div style={{
                    display: 'flex', gap: 40, whiteSpace: 'nowrap',
                    animation: 'ls-ticker 18s linear infinite',
                    width: '200%',
                  }}>
                    {[...Array(2)].map((_, rep) => (
                      <span key={rep} style={{
                        fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em',
                        textTransform: 'uppercase', color: 'rgba(167,139,250,0.2)',
                        flexShrink: 0,
                      }}>
                        {['Computer Engineering', 'GIS & Remote Sensing', 'Research', 'Nepal', 'Innovation', 'Spatial Data Science', 'Machine Learning', 'Full-Stack Development'].map((t, i) => (
                          <span key={i}>{t}&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                        ))}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Progress row: label + orb */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.8, ease: EASE.silkSmooth }}
                    style={{ flexShrink: 0 }}
                  >
                    <div style={{
                      fontSize: 'clamp(0.55rem,0.9vw,0.68rem)',
                      letterSpacing: '0.3em', textTransform: 'uppercase',
                      color: 'rgba(245,158,11,0.35)', fontWeight: 700,
                      marginBottom: 6,
                    }}>
                      Loading Portfolio
                    </div>
                    {/* Mini stat row */}
                    <div style={{ display: 'flex', gap: 20 }}>
                      {[
                        { label: 'Assets', val: `${Math.floor(progress * 0.48)} KB` },
                        { label: 'Modules', val: `${Math.floor(progress * 0.12)}/12` },
                      ].map(item => (
                        <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(167,139,250,0.3)', fontWeight: 600 }}>
                            {item.label}
                          </span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(167,139,250,0.55)', fontVariantNumeric: 'tabular-nums' }}>
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Magnetic progress orb */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 1, ease: EASE.figmaSpring }}
                  >
                    <MagneticOrb progress={progress} />
                  </motion.div>
                </div>

                {/* Luxury progress bar */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: EASE.luxuryIn }}
                  style={{ originX: 0 }}
                >
                  <LuxuryBar progress={progress} />
                </motion.div>

                {/* Bottom info row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: 'clamp(0.58rem,0.95vw,0.7rem)',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(167,139,250,0.28)', fontWeight: 600,
                  }}
                >
                  <span style={{
                    fontSize: 'clamp(0.62rem,1.05vw,0.75rem)',
                    background: 'linear-gradient(90deg,rgba(245,158,11,0.6),rgba(167,139,250,0.5),rgba(244,114,182,0.5))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    letterSpacing: '0.05em', fontWeight: 700,
                  }}>
                    <CascadeName text="Suraj Tharu Chaudhary" delay={0.75} />
                  </span>
                  <span style={{ textAlign: 'right' }}>Nepal · Computer Engineer</span>
                </motion.div>

              </div>
            </div>

            {/* Bottom accent line */}
            <motion.div
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5, zIndex: 20 }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 2, ease: EASE.luxuryIn, delay: 0.2 }}
            >
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(90deg,transparent 0%,#06b6d4 20%,#a78bfa 50%,#f59e0b 80%,transparent 100%)',
                boxShadow: '0 0 16px rgba(6,182,212,0.6)',
              }} />
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
