import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

const INTRO_DURATION = 3200; // ms — total loading experience

// ── Particle system ─────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  pulse: number;
}

function useParticles(count: number): Particle[] {
  const ref = useRef<Particle[]>([]);
  if (ref.current.length === 0) {
    const colors = ['#9B6DFF', '#FF6FB8', '#F0C46A', '#2FD6F5', '#3DDBA8'];
    ref.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 0.5,
      speedX: (Math.random() - 0.5) * 0.04,
      speedY: (Math.random() - 0.5) * 0.04,
      opacity: Math.random() * 0.6 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
    }));
  }
  return ref.current;
}

// ── Animated number counter ──────────────────────────────────────────────────
function AnimatedCount({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v));
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.4, ease: 'easeOut' });
    const unsub = display.on('change', setDisplayed);
    return () => { controls.stop(); unsub(); };
  }, [value]);

  return <>{displayed}</>;
}

// ── Status messages cycling ──────────────────────────────────────────────────
const STATUS_MESSAGES = [
  'Calibrating neural pathways…',
  'Loading design assets…',
  'Synchronizing projects…',
  'Rendering experience…',
  'Almost ready…',
];

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'enter' | 'logo' | 'wipe' | 'done'>('enter');
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const particles = useParticles(55);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particleStateRef = useRef(particles.map(p => ({ ...p })));

  // ── Canvas particle animation ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const pts = particleStateRef.current;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      // Draw connection lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 12) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(155,109,255,${0.08 * (1 - dist / 12)})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo((pts[i].x / 100) * canvas.width, (pts[i].y / 100) * canvas.height);
            ctx.lineTo((pts[j].x / 100) * canvas.width, (pts[j].y / 100) * canvas.height);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of pts) {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = 100;
        if (p.x > 100) p.x = 0;
        if (p.y < 0) p.y = 100;
        if (p.y > 100) p.y = 0;
        p.pulse += 0.03;

        const px = (p.x / 100) * canvas.width;
        const py = (p.y / 100) * canvas.height;
        const pulsedOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        // Glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, p.size * 5);
        grd.addColorStop(0, p.color + Math.floor(pulsedOpacity * 255).toString(16).padStart(2, '0'));
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.fillStyle = grd;
        ctx.arc(px, py, p.size * 5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = pulsedOpacity;
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ── Progress animation ─────────────────────────────────────────────────────
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const pct = Math.min(Math.floor(((ts - start) / (INTRO_DURATION * 0.78)) * 100), 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Status cycling ─────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx(i => (i + 1) % STATUS_MESSAGES.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // ── Stage sequencing ───────────────────────────────────────────────────────
  useEffect(() => {
    const t0 = setTimeout(() => setStage('logo'), 150);
    const t1 = setTimeout(() => setStage('wipe'), INTRO_DURATION - 600);
    const t2 = setTimeout(() => {
      setStage('done');
      onComplete();
    }, INTRO_DURATION + 800);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (stage === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-intro"
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ background: '#030307' }}
        exit={{ opacity: 0, scale: 1.04, filter: 'blur(20px)' }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* ── Canvas particle field ── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        />

        {/* ── Deep ambient orbs ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          {/* Primary iris orb — top-left */}
          <motion.div
            animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '-20%', left: '-15%',
              width: '60vw', height: '60vw', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(155,109,255,0.28) 0%, rgba(116,69,232,0.12) 50%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          {/* Orchid magenta — bottom-right */}
          <motion.div
            animate={{ x: [0, -35, 25, 0], y: [0, 25, -15, 0], scale: [1, 0.9, 1.08, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{
              position: 'absolute', bottom: '-20%', right: '-15%',
              width: '55vw', height: '55vw', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,111,184,0.22) 0%, rgba(192,21,94,0.1) 50%, transparent 70%)',
              filter: 'blur(90px)',
            }}
          />
          {/* Champagne gold — center */}
          <motion.div
            animate={{ scale: [1, 1.2, 0.9, 1.05, 1], opacity: [0.15, 0.25, 0.12, 0.2, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{
              position: 'absolute', top: '30%', left: '35%',
              width: '30vw', height: '30vw', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(240,196,106,0.18) 0%, transparent 65%)',
              filter: 'blur(60px)',
            }}
          />
          {/* Azure — top-right */}
          <motion.div
            animate={{ x: [0, -20, 30, 0], y: [0, 20, -30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            style={{
              position: 'absolute', top: '-10%', right: '-5%',
              width: '35vw', height: '35vw', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(47,214,245,0.14) 0%, transparent 65%)',
              filter: 'blur(70px)',
            }}
          />
        </div>

        {/* ── Scanline / noise overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(155,109,255,0.015) 2px,
              rgba(155,109,255,0.015) 4px
            )`,
          }}
        />

        {/* ── Corner brackets — luxury cinematic frame ── */}
        {[
          { top: 24, left: 24, rotate: 0 },
          { top: 24, right: 24, rotate: 90 },
          { bottom: 24, right: 24, rotate: 180 },
          { bottom: 24, left: 24, rotate: 270 },
        ].map(({ rotate, ...pos }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i + 0.3, duration: 0.5 }}
            style={{ position: 'absolute', width: 36, height: 36, zIndex: 10, ...pos }}
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              style={{
                width: '100%', height: '100%',
                borderTop: '1.5px solid rgba(155,109,255,0.7)',
                borderLeft: '1.5px solid rgba(155,109,255,0.7)',
                transform: `rotate(${rotate}deg)`,
                transformOrigin: 'center',
                boxShadow: '0 0 8px rgba(155,109,255,0.3)',
              }}
            />
          </motion.div>
        ))}

        {/* ── Side rule lines ── */}
        {['top', 'bottom'].map((side) => (
          <motion.div
            key={side}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'absolute',
              [side]: 24,
              left: 72, right: 72,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(155,109,255,0.35) 30%, rgba(240,196,106,0.25) 70%, transparent)',
              zIndex: 10,
              transformOrigin: 'center',
            }}
          />
        ))}

        {/* ── LOGO STAGE ── */}
        <AnimatePresence>
          {stage === 'logo' && (
            <motion.div
              key="logo-stage"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, filter: 'blur(12px)' }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              className="relative flex flex-col items-center gap-0"
              style={{ zIndex: 20 }}
            >
              {/* ── Monogram / Logo ── */}
              <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
                {/* Outer ring — slow rotate */}
                <motion.svg
                  viewBox="0 0 160 160"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                >
                  <circle
                    cx="80" cy="80" r="74"
                    fill="none"
                    stroke="url(#ring-grad)"
                    strokeWidth="0.75"
                    strokeDasharray="3 8"
                    opacity="0.5"
                  />
                  <defs>
                    <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9B6DFF" />
                      <stop offset="50%" stopColor="#F0C46A" />
                      <stop offset="100%" stopColor="#2FD6F5" />
                    </linearGradient>
                  </defs>
                </motion.svg>

                {/* Middle ring — counter rotate */}
                <motion.svg
                  viewBox="0 0 160 160"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                >
                  <circle
                    cx="80" cy="80" r="60"
                    fill="none"
                    stroke="rgba(240,196,106,0.2)"
                    strokeWidth="0.5"
                    strokeDasharray="1 6"
                  />
                </motion.svg>

                {/* Glow disc */}
                <motion.div
                  animate={{ opacity: [0.3, 0.65, 0.3], scale: [0.9, 1.05, 0.9] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    width: 100, height: 100,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(155,109,255,0.55) 0%, rgba(255,111,184,0.2) 50%, transparent 70%)',
                    filter: 'blur(18px)',
                  }}
                />

                {/* S · T monogram SVG */}
                <motion.svg
                  viewBox="0 0 64 64"
                  style={{ width: 72, height: 72, position: 'relative', zIndex: 2, filter: 'drop-shadow(0 0 20px rgba(155,109,255,0.8))' }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <defs>
                    <linearGradient id="mono-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#B898FF" />
                      <stop offset="45%" stopColor="#FF6FB8" />
                      <stop offset="100%" stopColor="#F0C46A" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* S */}
                  <motion.path
                    d="M 18 20 C 10 20, 10 29, 18 29 C 26 29, 26 38, 18 38"
                    fill="none"
                    stroke="url(#mono-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.25 }}
                  />
                  {/* T */}
                  <motion.path
                    d="M 34 20 L 50 20 M 42 20 L 42 42"
                    fill="none"
                    stroke="url(#mono-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.55 }}
                  />
                </motion.svg>
              </div>

              {/* ── Name & title ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                className="flex flex-col items-center text-center mt-6"
              >
                {/* Name — Cinzel luxury serif */}
                <motion.h1
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)',
                    fontWeight: 700,
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    background: 'linear-gradient(135deg, #EEF0FF 0%, #B898FF 40%, #F0C46A 80%, #EEF0FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: 'none',
                    margin: 0,
                  }}
                >
                  Suraj Tharu
                </motion.h1>

                {/* Divider line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.95, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                  style={{
                    height: 1,
                    width: '80%',
                    margin: '10px auto',
                    background: 'linear-gradient(90deg, transparent, rgba(155,109,255,0.6), rgba(240,196,106,0.5), transparent)',
                    transformOrigin: 'center',
                  }}
                />

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.62rem',
                    letterSpacing: '0.45em',
                    textTransform: 'uppercase',
                    color: 'rgba(184,192,232,0.55)',
                    margin: 0,
                  }}
                >
                  Portfolio · Experience · Innovation
                </motion.p>
              </motion.div>

              {/* ── Progress system ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                style={{ marginTop: 40, width: 'min(260px, 60vw)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
              >
                {/* Track */}
                <div style={{
                  width: '100%', height: 2,
                  background: 'rgba(155,109,255,0.08)',
                  borderRadius: 99,
                  overflow: 'visible',
                  position: 'relative',
                }}>
                  {/* Fill */}
                  <motion.div
                    style={{
                      height: '100%',
                      borderRadius: 99,
                      background: 'linear-gradient(90deg, #9B6DFF 0%, #FF6FB8 50%, #F0C46A 100%)',
                      width: `${Math.max(progress, 3)}%`,
                      transition: 'width 0.06s linear',
                      boxShadow: '0 0 16px rgba(155,109,255,0.9), 0 0 32px rgba(255,111,184,0.4)',
                      position: 'relative',
                    }}
                  >
                    {/* Leading glow dot */}
                    <span style={{
                      position: 'absolute',
                      right: -4, top: '50%',
                      transform: 'translateY(-50%)',
                      width: 8, height: 8,
                      borderRadius: '50%',
                      background: '#ffffff',
                      boxShadow: '0 0 0 3px rgba(155,109,255,0.5), 0 0 12px rgba(155,109,255,1)',
                    }} />
                  </motion.div>
                </div>

                {/* Percent + status row */}
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', monospace",
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(155,109,255,0.6)',
                    textTransform: 'uppercase',
                  }}>
                    Loading
                  </span>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(240,196,106,0.7)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    <AnimatedCount value={Math.max(progress, 3)} />%
                  </span>
                </div>

                {/* Status message */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={statusIdx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.58rem',
                      letterSpacing: '0.12em',
                      color: 'rgba(184,192,232,0.35)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {STATUS_MESSAGES[statusIdx]}
                  </motion.div>
                </AnimatePresence>

                {/* Live badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.4 }}
                  style={{
                    marginTop: 4,
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 16px', borderRadius: 999,
                    border: '1px solid rgba(155,109,255,0.18)',
                    background: 'rgba(155,109,255,0.06)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      display: 'inline-block',
                      width: 5, height: 5, borderRadius: '50%',
                      background: '#3DDBA8',
                      boxShadow: '0 0 0 3px rgba(61,219,168,0.2), 0 0 8px rgba(61,219,168,0.6)',
                    }}
                  />
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.58rem', fontWeight: 700,
                    letterSpacing: '0.25em', textTransform: 'uppercase',
                    background: 'linear-gradient(90deg, rgba(155,109,255,0.8), rgba(240,196,106,0.7))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Systems Online
                  </span>
                </motion.div>
              </motion.div>

              {/* ── 2026 label ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                style={{
                  marginTop: 32,
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.55rem',
                  letterSpacing: '0.6em',
                  textTransform: 'uppercase',
                  color: 'rgba(107,116,168,0.4)',
                }}
              >
                © 2026 · Suraj Tharu Chaudhary
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── WIPE STAGE — luxury vertical wipe ── */}
        {stage === 'wipe' && (
          <>
            {/* First panel — iris */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: '-110%' }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              style={{
                position: 'absolute', inset: 0, zIndex: 50,
                background: 'linear-gradient(170deg, #030307 0%, #0D0F1C 50%, #08090F 100%)',
                borderTop: '1.5px solid rgba(155,109,255,0.5)',
                boxShadow: '0 -24px 80px rgba(155,109,255,0.35), 0 -4px 20px rgba(240,196,106,0.15)',
              }}
            />
            {/* Second panel — subtle delay, gold accent */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: '-110%' }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.08 }}
              style={{
                position: 'absolute', inset: 0, zIndex: 49,
                background: 'linear-gradient(170deg, #0D0F1C 0%, #191D34 100%)',
                opacity: 0.6,
              }}
            />
          </>
        )}

        {/* ── Global keyframes ── */}
        <style>{`
          @keyframes ci-shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
