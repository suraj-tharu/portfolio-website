import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = ['Explore', 'Research', 'Innovate', 'Teach', 'Create'];
const DURATION = 1800; // 1.8 seconds — recommended UX

type Props = { onComplete: () => void };

/* ── Particle canvas field ───────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const count = Math.min(Math.floor((w * h) / 12000), 100);
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.55 + 0.1,
      hue: Math.random() * 60 + 240, // violet-to-pink range
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,70%,${p.alpha})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.14 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.7;
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

/* ── SVG Circular Progress Ring ─────────────────────────── */
function ProgressRing({ progress }: { progress: number }) {
  const radius = 54;
  const stroke = 2.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg
        height={radius * 2}
        width={radius * 2}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background track */}
        <circle
          stroke="rgba(167,139,250,0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Animated fill */}
        <circle
          stroke="url(#ring-gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: 'stroke-dashoffset 0.08s linear',
            filter: 'drop-shadow(0 0 8px rgba(167,139,250,0.9))',
          }}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#7c3aed" />
            <stop offset="50%"  stopColor="#db2777" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center percentage */}
      <div
        className="absolute flex flex-col items-center"
        style={{ transform: 'rotate(0deg)' }}
      >
        <span style={{
          fontSize: '1.1rem',
          fontWeight: 900,
          fontFamily: 'Georgia, serif',
          backgroundImage: #a78bfa,#f472b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}>
          {progress}
        </span>
        <span style={{ fontSize: '0.45rem', color: 'rgba(167,139,250,0.5)', fontWeight: 700, letterSpacing: '0.1em' }}>%</span>
      </div>
    </div>
  );
}

/* ── Character stagger reveal (for name) ────────────────── */
function CharReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden' }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: 'inline-block' }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ── 3D Card-flip word transition ────────────────────────── */
function CardFlipWord({ word }: { word: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={word}
        initial={{ rotateX: 90, opacity: 0, y: 40 }}
        animate={{ rotateX: 0, opacity: 1, y: 0 }}
        exit={{ rotateX: -90, opacity: 0, y: -40 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontSize: 'clamp(4rem,13vw,11rem)',
          fontWeight: 900,
          fontStyle: 'italic',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          fontFamily: 'Georgia, serif',
          backgroundImage: rgba(167,139,250,0.18),rgba(244,114,182,0.14),rgba(56,189,248,0.18))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 60px rgba(124,58,237,0.3))',
          userSelect: 'none',
          transformOrigin: 'center top',
          perspective: '800px',
        }}
      >
        {word}
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Glitch text ─────────────────────────────────────────── */
function GlitchText({ text }: { text: string }) {
  return (
    <div className="relative select-none" style={{ fontFamily: 'inherit' }}>
      <span
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: #7c3aed,#db2777,#06b6d4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          animation: 'glitch1 3.5s infinite',
          clipPath: 'polygon(0 30%,100% 30%,100% 50%,0 50%)',
          opacity: 0.7,
        }}
      >{text}</span>
      <span
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: #06b6d4,#7c3aed)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          animation: 'glitch2 3.5s infinite',
          clipPath: 'polygon(0 60%,100% 60%,100% 75%,0 75%)',
          opacity: 0.5,
        }}
      >{text}</span>
      <span
        style={{
          backgroundImage: #a78bfa 0%,#f472b6 50%,#38bdf8 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}
      >{text}</span>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');

  /* Progress counter — 1.8s duration */
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const pct = Math.min(Math.floor(((ts - start) / DURATION) * 100), 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setPhase('done');
          setTimeout(onComplete, 650);
        }, 150);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  /* Word cycle */
  useEffect(() => {
    const id = setInterval(() => setWordIdx(p => (p + 1) % WORDS.length), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @keyframes glitch1 {
          0%,94%  { transform: translate(0,0); }
          95%     { transform: translate(-3px, 1px); }
          97%     { transform: translate(3px,-1px); }
          100%    { transform: translate(0,0); }
        }
        @keyframes glitch2 {
          0%,96%  { transform: translate(0,0); }
          97%     { transform: translate(3px, 2px); }
          99%     { transform: translate(-3px,-2px); }
          100%    { transform: translate(0,0); }
        }
        @keyframes ls-orb {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(30px,-25px) scale(1.08); }
          66%     { transform: translate(-20px,20px) scale(0.95); }
        }
        @keyframes ls-scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(220vh); }
        }
        @keyframes ls-corner-pulse {
          0%,100% { opacity:0.35; }
          50%     { opacity:1; }
        }
        @keyframes ls-status-blink {
          0%,100% { opacity:1; }
          50%     { opacity:0; }
        }
        @keyframes ls-sine {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[9999] overflow-hidden flex flex-col"
            style={{ backgroundImage: #06040f 0%,#0d0a1f 40%,#0a0f1e 100%)' }}
            exit={{
              opacity: 0,
              scale: 1.08,
              filter: 'blur(20px)',
              transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
            }}
          >
            {/* Particle field */}
            <ParticleCanvas />

            {/* Aurora orbs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div style={{
                position: 'absolute', top: '-15%', left: '-10%',
                width: '55vw', height: '55vw', borderRadius: '50%',
                backgroundImage: rgba(124,58,237,0.4) 0%,transparent 70%)',
                filter: 'blur(70px)', animation: 'ls-orb 9s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute', bottom: '-10%', right: '-10%',
                width: '50vw', height: '50vw', borderRadius: '50%',
                backgroundImage: rgba(219,39,119,0.35) 0%,transparent 70%)',
                filter: 'blur(80px)', animation: 'ls-orb 11s ease-in-out infinite reverse',
              }} />
              <div style={{
                position: 'absolute', top: '40%', left: '50%',
                width: '35vw', height: '35vw', borderRadius: '50%',
                backgroundImage: rgba(6,182,212,0.25) 0%,transparent 70%)',
                filter: 'blur(60px)', animation: 'ls-orb 7s ease-in-out infinite 2s',
              }} />
            </div>

            {/* Scanlines */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              backgroundImage: 'repeating-linear-gradient(transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)',
            }} />
            <div style={{
              position: 'absolute', left: 0, right: 0, height: '18%', zIndex: 2, pointerEvents: 'none',
              backgroundImage: rgba(167,139,250,0.04),transparent)',
              animation: 'ls-scanline 5s linear infinite',
            }} />

            {/* Corner brackets */}
            {[
              { top: 16, left: 16, rotate: 0 },
              { top: 16, right: 16, rotate: 90 },
              { bottom: 16, right: 16, rotate: 180 },
              { bottom: 16, left: 16, rotate: 270 },
            ].map(({ rotate, ...pos }, i) => (
              <div key={i} style={{
                position: 'absolute', width: 28, height: 28, zIndex: 10,
                animation: 'ls-corner-pulse 2s ease-in-out infinite',
                animationDelay: `${i * 0.5}s`,
                ...pos,
              }}>
                <div style={{
                  width: '100%', height: '100%',
                  borderTop: '2px solid rgba(167,139,250,0.75)',
                  borderLeft: '2px solid rgba(167,139,250,0.75)',
                  transform: `rotate(${rotate}deg)`,
                  transformOrigin: 'center',
                }} />
              </div>
            ))}

            {/* ── MAIN CONTENT ──────────────────────────── */}
            <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-14">

              {/* Top: name + badge */}
              <div className="flex items-start justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div style={{
                    fontSize: 'clamp(2rem,5vw,3.5rem)',
                    fontWeight: 900, fontStyle: 'italic',
                    letterSpacing: '-0.02em', lineHeight: 1,
                    fontFamily: 'Georgia, serif',
                  }}>
                    <GlitchText text="Er. Suraj" />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.7 }}
                    style={{
                      marginTop: 6,
                      fontSize: 'clamp(0.6rem,1.1vw,0.75rem)',
                      letterSpacing: '0.28em', textTransform: 'uppercase',
                      color: 'rgba(167,139,250,0.55)', fontWeight: 600,
                    }}
                  >
                    Portfolio · {new Date().getFullYear()}
                  </motion.div>
                </motion.div>

                {/* Status badge */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45, duration: 0.8 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', borderRadius: 999,
                    border: '1px solid rgba(167,139,250,0.25)',
                    background: 'rgba(124,58,237,0.12)',
                    backdropFilter: 'blur(14px)',
                  }}
                >
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#34d399',
                    boxShadow: '0 0 0 3px rgba(52,211,153,0.25)',
                    animation: 'ls-status-blink 1.2s ease-in-out infinite',
                    display: 'inline-block',
                  }} />
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: 'rgba(167,139,250,0.8)',
                  }}>
                    Initializing
                  </span>
                </motion.div>
              </div>

              {/* Center: 3D card-flip word */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                style={{ perspective: '1000px' }}>
                <CardFlipWord word={WORDS[wordIdx]} />
              </div>

              {/* Bottom: ring + bar + info */}
              <div className="flex flex-col gap-5">

                {/* Counter row: ring + progress label */}
                <div className="flex items-end justify-between gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    style={{
                      fontSize: 'clamp(0.6rem,1vw,0.72rem)',
                      letterSpacing: '0.22em', textTransform: 'uppercase',
                      color: 'rgba(167,139,250,0.4)', fontWeight: 600,
                    }}
                  >
                    Loading assets
                  </motion.div>

                  {/* SVG Progress Ring */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.8, type: 'spring', bounce: 0.3 }}
                  >
                    <ProgressRing progress={progress} />
                  </motion.div>
                </div>

                {/* Progress bar */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  style={{ originX: 0, position: 'relative', height: 2.5, borderRadius: 999, overflow: 'hidden', background: 'rgba(var(--text-base-rgb),0.05)' }}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%',
                    width: `${progress}%`,
                    backgroundImage: #7c3aed,#db2777,#06b6d4)',
                    borderRadius: 999,
                    transition: 'width 0.08s linear',
                    boxShadow: '0 0 12px rgba(167,139,250,0.8)',
                  }} />
                  {/* Shimmer sweep */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%',
                    width: `${progress}%`,
                    backgroundImage: transparent 0%,rgba(var(--text-base-rgb),0.45) 50%,transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'ls-shimmer 1s linear infinite',
                    borderRadius: 999,
                  }} />
                </motion.div>

                {/* Bottom label row + char reveal name */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.7 }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: 'clamp(0.62rem,1vw,0.72rem)',
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(167,139,250,0.3)', fontWeight: 600,
                  }}
                >
                  <span style={{
                    fontSize: 'clamp(0.65rem,1.1vw,0.78rem)',
                    backgroundImage: rgba(167,139,250,0.55),rgba(244,114,182,0.45))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    letterSpacing: '0.06em',
                  }}>
                    <CharReveal text="Suraj Tharu Chaudhary" delay={0.6} />
                  </span>
                  <span>Nepal · Computer Engineer</span>
                </motion.div>
              </div>
            </div>

            {/* Shimmer keyframe */}
            <style>{`
              @keyframes ls-shimmer {
                0%   { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
