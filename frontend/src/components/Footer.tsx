import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import VisitorCounter from './VisitorCounter';
import { Briefcase, Terminal, GraduationCap, Microscope, MapPin, Mail, ArrowUpRight, Clock, ExternalLink } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────── */
const socials = [
  { label: 'LinkedIn',     url: 'https://www.linkedin.com/in/suraj-tharu/',  icon: Briefcase,     color: '#0A66C2' },
  { label: 'GitHub',       url: 'https://github.com/suraj-tharu',            icon: Terminal,      color: '#a78bfa' },
  { label: 'Scholar',      url: 'https://scholar.google.com',                icon: GraduationCap, color: '#4285F4' },
  { label: 'ResearchGate', url: 'https://www.researchgate.net',              icon: Microscope,    color: '#00CCBB' },
];

const marqueeItems = [
  'BUILDING THE FUTURE',
  'INNOVATING TOMORROW',
  'SHAPING POSSIBILITIES',
  'CREATING EXCELLENCE',
  'ENGINEERING DREAMS',
];

/* ─────────────────────────────────────────────────────────────────────────
   GLOBAL KEYFRAMES (injected once per mount)
───────────────────────────────────────────────────────────────────────── */
const FOOTER_CSS = `
@keyframes ft-shimmer  { 0%{left:-100%} 100%{left:220%} }
@keyframes ft-flow     { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes ft-left     { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes ft-right    { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
@keyframes ft-pulse-dot{ 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.7);opacity:.3} }
@keyframes ft-bar-flow {
  0%  {background-position:0% 0%;}
  100%{background-position:300% 0%;}
}
.ft-glow-bar {
  background: linear-gradient(90deg,
    #6366f1,#8b5cf6,#ec4899,#f59e0b,
    #38bdf8,#34d399,#6366f1,#8b5cf6
  );
  background-size: 300% 100%;
  animation: ft-bar-flow 5s linear infinite;
}
`;

/* ── Nepal Live Clock ───────────────────────────────────────── */
function NepalClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const nepal = new Date(utc + (5 * 60 + 45) * 60000);
      setTime(nepal.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setDate(nepal.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl
                 border border-slate-200 dark:border-white/10
                 bg-white/70 dark:bg-white/[0.04]
                 shadow-sm dark:shadow-none backdrop-blur-md
                 transition-colors duration-300"
    >
      <div className="relative shrink-0">
        <Clock size={14} className="text-violet-600 dark:text-violet-400" />
        <span
          className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 block"
          style={{ animation: 'ft-pulse-dot 2s ease-in-out infinite' }}
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold font-mono text-slate-800 dark:text-white/90 leading-tight tabular-nums whitespace-nowrap">{time}</p>
        <p className="text-[0.6rem] text-slate-500 dark:text-white/40 font-jakarta tracking-wide whitespace-nowrap">{date} · Nawalparasi, Nepal</p>
      </div>
    </motion.div>
  );
}

/* ── Magnetic email button ──────────────────────────────────── */
function MagneticEmailButton({ email }: { email: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18 });
  const springY = useSpring(y, { stiffness: 250, damping: 18 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); setHovered(false); }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={`mailto:${email}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      data-cursor-text="Email"
      className="group relative inline-flex items-center gap-3 rounded-full
                 px-8 sm:px-12 py-4 sm:py-5 text-base md:text-lg font-semibold
                 overflow-hidden border font-jakarta
                 border-slate-200 dark:border-white/15
                 bg-white dark:bg-white/5
                 text-slate-800 dark:text-white
                 shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Dynamic gradient fill — animated flow */}
      <motion.span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 30%,#ec4899 65%,#f59e0b 100%)',
          backgroundSize: '200% 200%',
          animation: hovered ? 'ft-flow 3s ease infinite' : 'none',
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      {/* Inner cutout */}
      <motion.span
        className="absolute inset-[1.5px] rounded-full bg-white dark:bg-[#08080e] pointer-events-none"
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      />
      {/* Shimmer sweep */}
      {hovered && (
        <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          <span style={{
            position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)',
            animation: 'ft-shimmer 1.4s ease-in-out infinite',
          }} />
        </span>
      )}
      <span
        className="relative z-10 flex items-center gap-3 transition-colors duration-300"
        style={{ color: hovered ? '#fff' : undefined }}
      >
        <Mail size={18} className="shrink-0" />
        <span className="truncate max-w-[200px] sm:max-w-none">{email}</span>
        <ArrowUpRight size={16}
          className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </motion.a>
  );
}

/* ── Swiss Divider ───────────────────────────────────────────── */
function SwissDivider() {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ height: 48, zIndex: 20 }}>
      {/* Full-bleed gradient rule */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px"
        style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(99,102,241,0.5) 30%,rgba(236,72,153,0.5) 65%,transparent 100%)' }} />
      {/* Center diamond node */}
      <div
        className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full
                   bg-white dark:bg-[#07090f]
                   border border-slate-200 dark:border-white/10
                   shadow-sm dark:shadow-none"
        style={{ boxShadow: '0 0 18px rgba(99,102,241,0.22)' }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path d="M5 0L6.5 3.5L10 5L6.5 6.5L5 10L3.5 6.5L0 5L3.5 3.5Z" fill="url(#sdg)" />
          <defs>
            <linearGradient id="sdg" x1="0" y1="0" x2="10" y2="10">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Swiss rule marks */}
      <div className="absolute left-1/2 flex gap-1 items-center" style={{ transform: 'translateX(calc(-50% - 28px))' }}>
        {[40, 20, 8].map((w, i) => (
          <div key={i} className="h-px bg-slate-300 dark:bg-white/20 transition-colors duration-300" style={{ width: w }} />
        ))}
      </div>
      <div className="absolute left-1/2 flex gap-1 items-center" style={{ transform: 'translateX(calc(-50% + 28px))' }}>
        {[8, 20, 40].map((w, i) => (
          <div key={i} className="h-px bg-slate-300 dark:bg-white/20 transition-colors duration-300" style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}

/* ── Constellation Canvas ────────────────────────────────────── */
function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    type Particle = { x: number; y: number; vx: number; vy: number; radius: number };
    const particles: Particle[] = [];
    const N = 42;
    const resize = () => {
      canvas.width  = canvas.parentElement?.clientWidth  || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener('resize', resize); resize();
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.3 + 0.4,
      });
    }
    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dark = document.documentElement.classList.contains('dark');
      ctx.fillStyle   = dark ? 'rgba(139,92,246,0.55)'  : 'rgba(99,102,241,0.28)';
      ctx.strokeStyle = dark ? 'rgba(139,92,246,0.12)'  : 'rgba(99,102,241,0.08)';
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(p.x - particles[j].x, p.y - particles[j].y);
          if (d < 110) {
            ctx.globalAlpha = (1 - d / 110) * 0.55;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.5 }} />;
}

/* ── Social Pill ─────────────────────────────────────────────── */
function SocialPill({ label, url, icon: Icon, color }: typeof socials[number]) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3, scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      className="relative flex items-center gap-1.5 text-xs font-semibold rounded-full
                 px-3.5 py-1.5 font-jakarta overflow-hidden
                 transition-all duration-250"
      style={{
        border: `1px solid ${hov ? color + '70' : 'rgba(148,163,184,0.3)'}`,
        backgroundColor: hov ? color + '12' : 'rgba(255,255,255,0.5)',
        boxShadow: hov ? `0 0 16px ${color}25` : 'none',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span
        className="relative z-10 flex items-center gap-1.5 transition-colors duration-250"
        style={{ color: hov ? color : 'rgba(100,116,139,1)' }}
      >
        <Icon size={13} className="shrink-0" />
        {label}
        {hov && <ExternalLink size={10} className="shrink-0" />}
      </span>
    </motion.a>
  );
}

/* ── Main Footer ─────────────────────────────────────────────── */
export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end end'] });
  const orbY = useTransform(scrollYProgress, [0, 1], ['-15%', '0%']);

  return (
    <>
      <style>{FOOTER_CSS}</style>
      <SwissDivider />

      <footer
        ref={containerRef}
        className="relative z-20 overflow-hidden
                   bg-slate-50 dark:bg-[#050910]
                   text-slate-800 dark:text-white
                   border-t border-slate-200/60 dark:border-white/[0.07]
                   rounded-t-[2.5rem] md:rounded-t-[4rem]
                   transition-colors duration-300"
        style={{ boxShadow: '0 -1px 0 0 rgba(99,102,241,0.08)' }}
      >
        {/* ── Ambient canvas ────────────────────────────── */}
        <ConstellationCanvas />

        {/* ── Ambient orbs — no blend mode, clean in both ── */}
        <motion.div
          style={{ y: orbY }}
          aria-hidden
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        >
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)', filter: 'blur(80px)' }} />
          <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(245,158,11,0.09) 0%,transparent 70%)', filter: 'blur(80px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 70%)', filter: 'blur(90px)' }} />
        </motion.div>

        {/* ── Ghost watermark — safe opacity both modes ─── */}
        <div aria-hidden className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0 overflow-hidden">
          <span
            className="font-black whitespace-nowrap italic"
            style={{
              fontSize: 'clamp(4rem,18vw,14rem)',
              fontFamily: 'Syne, sans-serif',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: 'transparent',
              backgroundImage: 'linear-gradient(135deg,#6366f1,#ec4899)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              opacity: 0.04,
            }}
          >
            SURAJ THARU
          </span>
        </div>

        {/* ── Swiss grid lines ─────────────────────────── */}
        <div aria-hidden className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[20, 40, 60, 80].map(pct => (
            <div key={pct}
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: `${pct}%`,
                background: 'linear-gradient(180deg,transparent,rgba(99,102,241,0.06),transparent)',
              }}
            />
          ))}
        </div>

        {/* ── MARQUEE STRIP ────────────────────────────── */}
        <div
          className="relative z-10 w-full py-10 md:py-14
                     border-b border-slate-200/50 dark:border-white/[0.05]
                     flex flex-col gap-4 overflow-hidden"
          style={{ background: 'linear-gradient(180deg,rgba(99,102,241,0.03) 0%,transparent 100%)' }}
        >
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg,rgba(248,250,252,1) 0%,transparent 100%)' }}
          />
          <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none dark:block hidden"
            style={{ background: 'linear-gradient(90deg,rgba(5,9,16,1) 0%,transparent 100%)' }}
          />
          <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(270deg,rgba(248,250,252,1) 0%,transparent 100%)' }}
          />
          <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none dark:block hidden"
            style={{ background: 'linear-gradient(270deg,rgba(5,9,16,1) 0%,transparent 100%)' }}
          />

          {/* Row 1 — LEFT scroll, large bold italic — visible in both modes */}
          <div className="flex whitespace-nowrap" style={{ animation: 'ft-left 30s linear infinite' }}>
            {[...Array(4)].flatMap((_, rep) =>
              marqueeItems.map((item, i) => (
                <span
                  key={`r1-${rep}-${i}`}
                  className="inline-flex items-center gap-4 px-6 cursor-default select-none"
                  style={{
                    fontSize: 'clamp(2rem,5.5vw,4.5rem)',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontStyle: 'italic',
                    letterSpacing: '-0.03em',
                    color: 'transparent',
                    backgroundImage: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 40%,#ec4899 70%,#f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    opacity: 0.18,
                  }}
                >
                  {item}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
                      fill="#8b5cf6" opacity="0.7" />
                  </svg>
                </span>
              ))
            )}
          </div>

          {/* Row 2 — RIGHT scroll, small caps */}
          <div className="flex whitespace-nowrap" style={{ animation: 'ft-right 24s linear infinite' }}>
            {[...Array(4)].flatMap((_, rep) =>
              [...marqueeItems].reverse().map((item, i) => (
                <span
                  key={`r2-${rep}-${i}`}
                  className="inline-flex items-center gap-3 px-5 cursor-default select-none"
                  style={{
                    fontSize: 'clamp(0.7rem,2vw,1.4rem)',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'transparent',
                    backgroundImage: 'linear-gradient(90deg,#f59e0b,#ec4899,#8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    opacity: 0.22,
                  }}
                >
                  {item}
                  <span style={{ color: '#ec4899', opacity: 0.5, fontSize: '0.55em' }}>◈</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* ── MAIN CTA ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative z-10 flex flex-col items-center text-center
                     px-5 sm:px-8 pt-20 pb-16 md:pt-28 md:pb-20"
        >
          {/* Swiss eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: 1, width: 48, originX: 0, background: 'linear-gradient(90deg,transparent,#f59e0b)' }}
            />
            <span className="text-xs uppercase tracking-[0.4em] font-bold font-syne
                             text-amber-600 dark:text-amber-400 whitespace-nowrap">
              Let&apos;s collaborate
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: 1, width: 48, originX: 1, background: 'linear-gradient(90deg,#f59e0b,transparent)' }}
            />
          </motion.div>

          {/* Swiss-scale headline */}
          <h2
            className="font-syne font-black tracking-tight leading-[0.88] mb-12 w-full"
            style={{ fontSize: 'clamp(3rem,10vw,8rem)', letterSpacing: '-0.04em' }}
          >
            <motion.span
              className="block text-slate-900 dark:text-white"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Ready to create
            </motion.span>
            <motion.span
              className="block italic"
              style={{
                background: 'linear-gradient(135deg,#f59e0b 0%,#ec4899 35%,#8b5cf6 65%,#38bdf8 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'ft-flow 5s ease infinite',
                color: '#f59e0b', /* fallback */
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              something special?
            </motion.span>
          </h2>

          <MagneticEmailButton email="suraj.xaudhary@gmail.com" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-5 text-xs tracking-[0.1em] font-jakarta
                       text-slate-500 dark:text-white/35"
          >
            Typically responds within 24 hours
          </motion.p>
        </motion.div>

        {/* ── BOTTOM BAR — Swiss 3-column responsive grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative z-10
                     border-t border-slate-200/60 dark:border-white/[0.07]
                     px-6 sm:px-10 md:px-14
                     pt-8 pb-10 md:pb-12
                     grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                     gap-8 lg:gap-6
                     items-start"
        >
          {/* Col 1 — Status + Location + Clock */}
          <div className="flex flex-col gap-3 min-w-0">
            <motion.div
              whileHover={{ scale: 1.03, y: -1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="self-start flex items-center gap-2.5 rounded-full
                         px-4 py-2
                         bg-emerald-50 dark:bg-emerald-500/10
                         border border-emerald-200 dark:border-emerald-500/25
                         shadow-sm dark:shadow-none"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 font-jakarta whitespace-nowrap">
                Available for projects
              </span>
            </motion.div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/40 font-jakarta">
              <MapPin size={12} className="shrink-0 text-violet-500 dark:text-violet-400" />
              <span>Nawalparasi West, Nepal</span>
            </div>

            <NepalClock />
          </div>

          {/* Col 2 — Social links */}
          <div className="flex flex-col gap-3 min-w-0">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] font-bold font-syne
                          text-slate-400 dark:text-white/25">
              Connect
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map(s => <SocialPill key={s.label} {...s} />)}
            </div>
          </div>

          {/* Col 3 — Copyright + Visitor */}
          <div className="flex flex-col gap-2.5 min-w-0 sm:col-span-2 lg:col-span-1 lg:items-end">
            <p
              className="text-xs font-black uppercase tracking-widest font-syne lg:text-right"
              style={{
                background: 'linear-gradient(90deg,#f59e0b,#ec4899,#8b5cf6)',
                backgroundSize: '200% 100%',
                animation: 'ft-flow 4s ease infinite',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              © {new Date().getFullYear()} Er. Suraj Tharu Chaudhary
            </p>
            <p className="text-[0.68rem] text-slate-500 dark:text-white/35 tracking-wide font-jakarta lg:text-right">
              All rights reserved. Crafted with ❤️ in Nepal.
            </p>
            <div className="lg:self-end">
              <VisitorCounter />
            </div>
          </div>
        </motion.div>

        {/* ── ANIMATED GRADIENT BAR ─────────────────────── */}
        <div
          className="ft-glow-bar absolute bottom-0 left-0 right-0"
          style={{ height: 3 }}
          aria-hidden
        />
      </footer>
    </>
  );
}
