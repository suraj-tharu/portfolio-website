import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INTRO_DURATION = 2200; // Total loading animation duration in ms

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'logo' | 'wipe' | 'done'>('logo');
  const [progress, setProgress] = useState(0);

  // Timer-based progress (no THREE.js dependency — avoids WebGL context blocking)
  useEffect(() => {
    let start: number | null = null;
    let raf: number;

    const tick = (ts: number) => {
      if (!start) start = ts;
      const pct = Math.min(Math.floor(((ts - start) / (INTRO_DURATION * 0.8)) * 100), 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Stage sequencing — guaranteed to complete
  useEffect(() => {
    const t1 = setTimeout(() => setStage('wipe'), INTRO_DURATION - 500);
    const t2 = setTimeout(() => {
      setStage('done');
      onComplete();
    }, INTRO_DURATION + 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (stage === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-intro"
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #06040f 0%, #0d0a1f 40%, #0a0f1e 100%)' }}
        exit={{ opacity: 0, scale: 1.06, filter: 'blur(16px)' }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Aurora orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{
            position: 'absolute', top: '-15%', left: '-10%',
            width: '55vw', height: '55vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
            filter: 'blur(70px)',
            animation: 'ci-orb 9s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', right: '-10%',
            width: '50vw', height: '50vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(219,39,119,0.35) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'ci-orb 11s ease-in-out infinite reverse',
          }} />
        </div>

        {/* Corner brackets */}
        {[
          { top: 16, left: 16, rotate: 0 },
          { top: 16, right: 16, rotate: 90 },
          { bottom: 16, right: 16, rotate: 180 },
          { bottom: 16, left: 16, rotate: 270 },
        ].map(({ rotate, ...pos }, i) => (
          <div key={i} style={{
            position: 'absolute', width: 28, height: 28, zIndex: 10,
            animation: 'ci-corner-pulse 2s ease-in-out infinite',
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

        {/* LOGO STAGE */}
        <AnimatePresence>
          {stage === 'logo' && (
            <motion.div
              key="logo-stage"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="relative flex flex-col items-center"
            >
              {/* Logo SVG */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  style={{ fill: 'none', stroke: '#a78bfa', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}
                >
                  <motion.path
                    d="M30 70 L50 30 L70 70 M40 50 L60 50 M10 10 L90 10 L90 90 L10 90 Z"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                  />
                  <motion.path
                    d="M 40 40 C 30 40, 30 50, 40 50 C 50 50, 50 60, 40 60 M 45 40 L 55 40 M 50 40 L 50 60 M 60 40 C 55 40, 55 50, 60 50 C 65 50, 65 60, 60 60"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
                  />
                </svg>
                {/* Glow behind logo */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, times: [0, 0.4, 0.6, 1] }}
                  className="absolute inset-0 bg-purple-500 rounded-full -z-10"
                  style={{ filter: 'blur(40px)', mixBlendMode: 'screen' }}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-6 flex flex-col items-center text-center w-full max-w-xs"
              >
                <div className="text-white/80 font-syne font-bold tracking-[0.3em] uppercase text-sm md:text-base">
                  Suraj Tharu Chaudhary
                </div>
                <div className="text-white/40 font-jakarta text-[0.65rem] tracking-[0.4em] uppercase mt-2">
                  Portfolio · 2026
                </div>

                {/* Progress Bar */}
                <div className="mt-8 w-48 flex flex-col items-center gap-3">
                  <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #a78bfa, #f472b6, #38bdf8)',
                        width: `${Math.max(progress, 8)}%`,
                        transition: 'width 0.08s linear',
                        boxShadow: '0 0 12px rgba(167,139,250,0.8)',
                      }}
                    />
                  </div>
                  <div className="text-white/30 text-[0.6rem] font-mono tracking-widest">
                    {Math.round(Math.max(progress, 8))}%
                  </div>
                </div>

                {/* Status badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  style={{
                    marginTop: 20,
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 14px', borderRadius: 999,
                    border: '1px solid rgba(167,139,250,0.2)',
                    background: 'rgba(124,58,237,0.1)',
                    backdropFilter: 'blur(14px)',
                  }}
                >
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#34d399',
                    boxShadow: '0 0 0 3px rgba(52,211,153,0.25)',
                    animation: 'ci-blink 1.2s ease-in-out infinite',
                    display: 'inline-block',
                  }} />
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: 'rgba(167,139,250,0.75)',
                  }}>
                    Initializing
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WIPE STAGE */}
        {stage === 'wipe' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '-100%' }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(135deg, #0a051e 0%, #080420 50%, #0d0a1f 100%)',
              boxShadow: '0 -20px 60px rgba(167,139,250,0.4)',
              borderTop: '2px solid rgba(167,139,250,0.6)',
            }}
          />
        )}

        {/* Keyframes */}
        <style>{`
          @keyframes ci-orb {
            0%,100% { transform: translate(0,0) scale(1); }
            33%     { transform: translate(30px,-25px) scale(1.08); }
            66%     { transform: translate(-20px,20px) scale(0.95); }
          }
          @keyframes ci-corner-pulse {
            0%,100% { opacity: 0.35; }
            50%     { opacity: 1; }
          }
          @keyframes ci-blink {
            0%,100% { opacity: 1; }
            50%     { opacity: 0.3; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
