import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = ['Explore', 'Research', 'Innovate', 'Teach', 'Create'];

type Props = { onComplete: () => void };

/* ── tiny canvas particle field ─────────────────────────── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const count = Math.min(Math.floor((w * h) / 14000), 90);
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${p.alpha})`;
        ctx.fill();
      }
      // draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
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
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 z-0 pointer-events-none" />;
}

/* ── glitch text ─────────────────────────────────────────── */
function GlitchText({ text }: { text: string }) {
  return (
    <div className="relative select-none" style={{ fontFamily: 'inherit' }}>
      {/* glitch layer 1 */}
      <span
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg,#7c3aed,#db2777,#06b6d4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          animation: 'glitch1 3.5s infinite',
          clipPath: 'polygon(0 30%,100% 30%,100% 50%,0 50%)',
          opacity: 0.7,
        }}
      >{text}</span>
      {/* glitch layer 2 */}
      <span
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg,#06b6d4,#7c3aed)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          animation: 'glitch2 3.5s infinite',
          clipPath: 'polygon(0 60%,100% 60%,100% 75%,0 75%)',
          opacity: 0.5,
        }}
      >{text}</span>
      {/* main */}
      <span
        style={{
          background: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 50%,#38bdf8 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}
      >{text}</span>
    </div>
  );
}

/* ── main component ──────────────────────────────────────── */
export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [wordIdx, setWordIdx]   = useState(0);
  const [phase, setPhase]       = useState<'loading' | 'done'>('loading');
  const DURATION = 2800;

  /* progress counter */
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const pct = Math.min(Math.floor(((ts - start) / DURATION) * 100), 100);
      setProgress(pct);
      if (pct < 100) { raf = requestAnimationFrame(tick); }
      else { setTimeout(() => { setPhase('done'); setTimeout(onComplete, 700); }, 200); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  /* word cycle */
  useEffect(() => {
    const id = setInterval(() => setWordIdx(p => (p + 1) % WORDS.length), 800);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ── global keyframes ──────────────────────────────── */}
      <style>{`
        @keyframes glitch1 {
          0%,94%     { transform: translate(0,0); }
          95%        { transform: translate(-3px, 1px); }
          97%        { transform: translate(3px,-1px); }
          100%       { transform: translate(0,0); }
        }
        @keyframes glitch2 {
          0%,96%     { transform: translate(0,0); }
          97%        { transform: translate(3px, 2px); }
          99%        { transform: translate(-3px,-2px); }
          100%       { transform: translate(0,0); }
        }
        @keyframes float-orb {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(30px,-25px) scale(1.08); }
          66%     { transform: translate(-20px,20px) scale(0.95); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200vh); }
        }
        @keyframes progress-glow {
          0%,100% { box-shadow: 0 0 8px 2px rgba(167,139,250,0.6); }
          50%     { box-shadow: 0 0 20px 6px rgba(236,72,153,0.7); }
        }
        @keyframes corner-pulse {
          0%,100% { opacity:0.4; }
          50%     { opacity:1; }
        }
      `}</style>

      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[9999] overflow-hidden flex flex-col"
            style={{ background: 'linear-gradient(145deg,#06040f 0%,#0d0a1f 40%,#0a0f1e 100%)' }}
            exit={{
              clipPath: ['inset(0 0 0% 0)', 'inset(0 0 100% 0)'],
              transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
            }}
          >
            {/* particle bg */}
            <ParticleCanvas />

            {/* morphing orbs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div style={{
                position:'absolute', top:'-15%', left:'-10%',
                width:'55vw', height:'55vw', borderRadius:'50%',
                background:'radial-gradient(circle,rgba(124,58,237,0.35) 0%,transparent 70%)',
                filter:'blur(60px)', animation:'float-orb 9s ease-in-out infinite',
              }} />
              <div style={{
                position:'absolute', bottom:'-10%', right:'-10%',
                width:'50vw', height:'50vw', borderRadius:'50%',
                background:'radial-gradient(circle,rgba(219,39,119,0.3) 0%,transparent 70%)',
                filter:'blur(70px)', animation:'float-orb 11s ease-in-out infinite reverse',
              }} />
              <div style={{
                position:'absolute', top:'40%', left:'50%',
                width:'35vw', height:'35vw', borderRadius:'50%',
                background:'radial-gradient(circle,rgba(6,182,212,0.2) 0%,transparent 70%)',
                filter:'blur(50px)', animation:'float-orb 7s ease-in-out infinite 2s',
              }} />
            </div>

            {/* scanline overlay */}
            <div style={{
              position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
              backgroundImage:'repeating-linear-gradient(transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)',
            }} />
            <div style={{
              position:'absolute', left:0, right:0, height:'20%', zIndex:2, pointerEvents:'none',
              background:'linear-gradient(to bottom,rgba(167,139,250,0.03),transparent)',
              animation:'scanline 6s linear infinite',
            }} />

            {/* ── corner brackets ───────────────────────── */}
            {[
              { top:16, left:16, rotate:0 },
              { top:16, right:16, rotate:90 },
              { bottom:16, right:16, rotate:180 },
              { bottom:16, left:16, rotate:270 },
            ].map(({ rotate, ...positionStyles }, i) => (
              <div key={i} style={{
                position:'absolute', width:28, height:28, zIndex:10,
                animation:'corner-pulse 2s ease-in-out infinite',
                animationDelay:`${i * 0.5}s`,
                ...positionStyles,
              }}>
                <div style={{
                  width:'100%', height:'100%',
                  borderTop:'2px solid rgba(167,139,250,0.7)',
                  borderLeft:'2px solid rgba(167,139,250,0.7)',
                  transform:`rotate(${rotate}deg)`,
                  transformOrigin:'center',
                }} />
              </div>
            ))}

            {/* ── MAIN CONTENT ──────────────────────────── */}
            <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-14">

              {/* Top: name + tagline */}
              <div className="flex items-start justify-between">
                <motion.div
                  initial={{ opacity:0, x:-30 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
                >
                  <div style={{
                    fontSize:'clamp(2rem,5vw,3.5rem)',
                    fontWeight:900, fontStyle:'italic',
                    letterSpacing:'-0.02em', lineHeight:1,
                    fontFamily:'Georgia, serif',
                  }}>
                    <GlitchText text="Er. Suraj" />
                  </div>
                  <motion.div
                    initial={{ opacity:0, y:8 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.4, duration:0.7 }}
                    style={{
                      marginTop:6, fontSize:'clamp(0.65rem,1.2vw,0.8rem)',
                      letterSpacing:'0.3em', textTransform:'uppercase',
                      color:'rgba(167,139,250,0.6)', fontWeight:600,
                    }}
                  >
                    Portfolio · {new Date().getFullYear()}
                  </motion.div>
                </motion.div>

                {/* top-right badge */}
                <motion.div
                  initial={{ opacity:0, x:30 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay:0.5, duration:0.8 }}
                  style={{
                    display:'flex', alignItems:'center', gap:8,
                    padding:'8px 16px', borderRadius:999,
                    border:'1px solid rgba(167,139,250,0.25)',
                    background:'rgba(124,58,237,0.12)',
                    backdropFilter:'blur(12px)',
                  }}
                >
                  <span style={{
                    width:7, height:7, borderRadius:'50%',
                    background:'#34d399',
                    boxShadow:'0 0 0 3px rgba(52,211,153,0.25)',
                    animation:'corner-pulse 1.5s ease-in-out infinite',
                    display:'inline-block',
                  }} />
                  <span style={{
                    fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.2em',
                    textTransform:'uppercase', color:'rgba(167,139,250,0.8)',
                  }}>
                    Initializing
                  </span>
                </motion.div>
              </div>

              {/* Center: big rotating word */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wordIdx}
                    initial={{ opacity:0, y:40, filter:'blur(12px)' }}
                    animate={{ opacity:1, y:0,  filter:'blur(0px)' }}
                    exit={{   opacity:0, y:-30, filter:'blur(8px)' }}
                    transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
                    style={{
                      fontSize:'clamp(4rem,13vw,11rem)',
                      fontWeight:900, fontStyle:'italic',
                      letterSpacing:'-0.04em', lineHeight:1,
                      fontFamily:'Georgia, serif',
                      background:'linear-gradient(135deg,rgba(167,139,250,0.15),rgba(244,114,182,0.12),rgba(56,189,248,0.15))',
                      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                      textShadow:'none',
                      filter:'drop-shadow(0 0 60px rgba(124,58,237,0.25))',
                      userSelect:'none',
                    }}
                  >
                    {WORDS[wordIdx]}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom: counter + progress */}
              <div className="flex flex-col gap-5">
                {/* counter row */}
                <div className="flex items-end justify-between">
                  <motion.div
                    initial={{ opacity:0, y:20 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.3, duration:0.8 }}
                    style={{
                      fontSize:'clamp(0.65rem,1.1vw,0.75rem)',
                      letterSpacing:'0.25em', textTransform:'uppercase',
                      color:'rgba(167,139,250,0.45)', fontWeight:600,
                    }}
                  >
                    Loading assets
                  </motion.div>

                  <motion.div
                    initial={{ opacity:0, y:20 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.2, duration:0.8 }}
                    style={{
                      fontSize:'clamp(4.5rem,12vw,9rem)',
                      fontWeight:900, fontFamily:'Georgia, serif',
                      letterSpacing:'-0.05em', lineHeight:1,
                      background:'linear-gradient(135deg,#a78bfa,#f472b6)',
                      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                      tabularNums: 'tabular-nums',
                    } as React.CSSProperties}
                  >
                    {String(progress).padStart(2, '0')}
                    <span style={{ fontSize:'0.35em', color:'rgba(167,139,250,0.5)', WebkitTextFillColor:'rgba(167,139,250,0.5)' }}>%</span>
                  </motion.div>
                </div>

                {/* progress bar */}
                <motion.div
                  initial={{ opacity:0, scaleX:0 }}
                  animate={{ opacity:1, scaleX:1 }}
                  transition={{ delay:0.4, duration:0.6 }}
                  style={{ originX:0, position:'relative', height:3, borderRadius:999, overflow:'hidden',
                    background:'rgba(255,255,255,0.06)' }}
                >
                  <div style={{
                    position:'absolute', top:0, left:0, height:'100%',
                    width:`${progress}%`,
                    background:'linear-gradient(90deg,#7c3aed,#db2777,#06b6d4)',
                    borderRadius:999,
                    transition:'width 0.1s linear',
                    animation:'progress-glow 2s ease-in-out infinite',
                  }} />
                  {/* shimmer */}
                  <div style={{
                    position:'absolute', top:0, left:0, height:'100%',
                    width:`${progress}%`,
                    background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.4) 50%,transparent 100%)',
                    backgroundSize:'200% 100%',
                    animation:'shimmer 1.2s linear infinite',
                    borderRadius:999,
                  }} />
                </motion.div>

                {/* bottom label row */}
                <motion.div
                  initial={{ opacity:0 }}
                  animate={{ opacity:1 }}
                  transition={{ delay:0.6, duration:0.7 }}
                  style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase',
                    color:'rgba(167,139,250,0.35)', fontWeight:600,
                  }}
                >
                  <span>Suraj Tharu Chaudhary</span>
                  <span>Computer Engineer · Nepal</span>
                </motion.div>
              </div>
            </div>

            <style>{`
              @keyframes shimmer {
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
