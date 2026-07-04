import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import VisitorCounter from './VisitorCounter';
import { Briefcase, Terminal, GraduationCap, Microscope, MapPin, Mail, ArrowRight, Clock } from 'lucide-react';

const socials = [
  { label: 'LinkedIn',     url: 'https://www.linkedin.com/in/suraj-tharu/',  icon: Briefcase,    color: '#0A66C2' },
  { label: 'GitHub',       url: 'https://github.com/suraj-tharu',            icon: Terminal,     color: '#a78bfa' },
  { label: 'Scholar',      url: 'https://scholar.google.com',                icon: GraduationCap,color: '#4285F4' },
  { label: 'ResearchGate', url: 'https://www.researchgate.net',              icon: Microscope,   color: '#00CCBB' },
];

const marqueeItems = [
  'BUILDING THE FUTURE',
  'INNOVATING TOMORROW',
  'SHAPING POSSIBILITIES',
  'CREATING EXCELLENCE',
  'ENGINEERING DREAMS',
];

/* ── Nepal Live Clock ───────────────────────────────────────── */
function NepalClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      // Nepal is UTC+5:45
      const nepalOffset = 5 * 60 + 45;
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const nepal = new Date(utc + nepalOffset * 60000);

      setTime(nepal.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setDate(nepal.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 shadow-sm backdrop-blur-md"
    >
      <Clock size={14} className="text-violet-600 dark:text-violet-400 shrink-0" />
      <div>
        <p className="text-xs font-bold font-mono text-slate-800 dark:text-white/90 leading-tight">{time}</p>
        <p className="text-[0.6rem] text-slate-500 dark:text-white/40 font-jakarta tracking-wide">{date} · Nawalparasi, Nepal</p>
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={`mailto:${email}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      data-cursor-text="Email"
      className="group relative inline-flex items-center gap-3 rounded-full px-8 sm:px-12 py-4 sm:py-5 text-base md:text-lg font-semibold overflow-hidden border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-slate-800 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Gradient hover fill */}
      <span className="absolute inset-0 bg-gradient-to-r from-amber-500 via-sky-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="absolute inset-[1px] rounded-full bg-white dark:bg-[#0a0a0c] group-hover:opacity-0 transition-opacity duration-500" />
      {/* Shimmer sweep on hover */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden rounded-full">
        <span style={{
          position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
          backgroundImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)',
          animation: 'footer-shimmer 1.5s ease-in-out infinite',
        }} />
      </span>
      <span className="relative z-10 flex items-center gap-3 font-jakarta group-hover:text-white transition-colors duration-300">
        <Mail size={18} className="shrink-0" />
        {email}
        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300 shrink-0" />
      </span>
    </motion.a>
  );
}

/* ── Premium UI Elements ────────────────────────────────────── */
function AuroraDivider() {
  return (
    <div className="relative flex justify-center items-center w-full h-[2px] z-10" style={{ margin: '-2rem 0 2rem 0' }}>
      <div className="relative w-[80%] max-w-[800px] h-[1px]" style={{ backgroundImage: 'linear-gradient(to right, transparent, rgba(56,189,248,0.5), transparent)' }}>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-[#fcd34d] bg-white dark:bg-[#060608] px-3 py-0.5 rounded-full z-20 transition-colors duration-300" style={{ textShadow: '0 0 10px #f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>◆</span>
      </div>
    </div>
  );
}

function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const particles: {x: number, y: number, vx: number, vy: number, radius: number}[] = [];
    const particleCount = 40;
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener('resize', resize);
    resize();
    for(let i=0; i<particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5
      });
    }
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Determine if dark mode is active to change particle color slightly
      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(14, 165, 233, 0.2)';
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(14, 165, 233, 0.1)';
      
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
        for(let j=i+1; j<particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        }
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationId); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60" />;
}

/* ── Main Footer ─────────────────────────────────────────────── */
export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end end'] });
  const orbY = useTransform(scrollYProgress, [0, 1], ['-18%', '0%']);

  return (
    <>
      <AuroraDivider />
      <footer
        ref={containerRef}
        className="relative z-20 overflow-hidden bg-slate-50 dark:bg-[#050910] text-slate-800 dark:text-white backdrop-blur-3xl border-t border-slate-200 dark:border-white/10 rounded-t-[40px] md:rounded-t-[72px] transition-colors duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] dark:shadow-none"
      >
        <ConstellationCanvas />
        <style>{`
        @keyframes footer-shimmer { 0%{left:-100%} 100%{left:200%} }
        @keyframes footer-glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes marquee-left  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes marquee-right { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
      `}</style>

      {/* Ghost watermark */}
      <div aria-hidden className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0 overflow-hidden">
        <span className="text-[18vw] font-display italic font-black whitespace-nowrap text-slate-900/[0.03] dark:text-white/[0.022]">
          SURAJ THARU
        </span>
      </div>

      {/* Animated ambient orbs */}
      <motion.div style={{ y: orbY }} aria-hidden className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100">
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-[150px] bg-sky-400/20 dark:bg-sky-500/15" />
        <div className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full blur-[150px] bg-amber-400/20 dark:bg-amber-500/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full blur-[130px] bg-sky-300/20 dark:bg-[#38bdf8]/10" />
      </motion.div>

      {/* ── Dual-row Marquee strip ──────────────────────── */}
      <div className="relative z-10 w-full overflow-hidden py-8 md:py-12 border-b border-slate-200 dark:border-white/5 flex flex-col gap-3 bg-white/30 dark:bg-transparent backdrop-blur-sm">
        {/* Row 1 — scrolls LEFT */}
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee-left 28s linear infinite' }}>
          {Array.from({ length: 2 }).map((_, rep) =>
            [...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={`r1-${rep}-${i}`}
                className="inline-flex items-center gap-3 px-4 cursor-default select-none text-slate-200 dark:text-white/[0.05]"
                style={{ fontSize: 'clamp(1.8rem,5vw,4rem)', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.02em' }}
              >
                {item}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="opacity-50 dark:opacity-100">
                  <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
                    fill="rgba(167,139,250,0.45)" />
                </svg>
              </span>
            ))
          )}
        </div>

        {/* Row 2 — scrolls RIGHT */}
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee-right 22s linear infinite' }}>
          {Array.from({ length: 2 }).map((_, rep) =>
            [...marqueeItems].reverse().concat([...marqueeItems].reverse()).concat([...marqueeItems].reverse()).map((item, i) => (
              <span
                key={`r2-${rep}-${i}`}
                className="inline-flex items-center gap-3 px-4 cursor-default select-none text-slate-300 dark:text-white/[0.025]"
                style={{ fontSize: 'clamp(1rem,2.5vw,2rem)', fontFamily: 'Syne, sans-serif', fontWeight: 400, fontStyle: 'normal', letterSpacing: '0.18em', textTransform: 'uppercase' }}
              >
                {item}
                <span className="text-pink-400/40 dark:text-pink-400/30 text-[0.6em]">◈</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── Main CTA block ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 md:pt-28 md:pb-20"
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: 1.5, width: 40, originX: 0, backgroundImage: 'linear-gradient(to right, transparent, rgba(245,158,11,0.6))', borderRadius: 999 }}
          />
          <span className="text-xs uppercase tracking-[0.35em] text-amber-600 dark:text-[rgba(245,158,11,0.8)] font-syne font-bold">Let's collaborate</span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: 1.5, width: 40, originX: 1, backgroundImage: 'linear-gradient(to right, rgba(245,158,11,0.6), transparent)', borderRadius: 999 }}
          />
        </div>

        {/* Headline */}
        <h2 className="font-syne font-black tracking-tight leading-[0.9] mb-10"
          style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', letterSpacing: '-0.035em' }}>
          <motion.span
            className="text-slate-900 dark:text-white block"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Ready to create
          </motion.span>
          <motion.span
            className="italic block"
            style={{
              backgroundImage: 'linear-gradient(to right, #f59e0b 0%,#ea580c 50%,#0ea5e9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            something special?
          </motion.span>
        </h2>

        {/* Magnetic email button */}
        <MagneticEmailButton email="suraj.xaudhary@gmail.com" />

        {/* Availability note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-5 text-[0.78rem] tracking-[0.08em] font-jakarta text-violet-500/70 dark:text-violet-300/40"
        >
          Typically responds within 24 hours
        </motion.p>
      </motion.div>

      {/* ── Bottom bar ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ once: true }}
        className="relative z-10 px-6 md:px-14 pb-8 md:pb-10 border-t border-slate-200 dark:border-white/[0.06] flex flex-col lg:flex-row gap-8 lg:gap-6 justify-between pt-10"
      >
        {/* Column 1: Status + Location + Clock */}
        <div className="flex flex-col gap-3 lg:w-1/3">
          <motion.div
            whileHover={{ scale: 1.03, y: -1 }}
            className="self-start flex items-center gap-3 rounded-full px-4 py-2.5 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
            </span>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 font-jakarta">Available for projects</span>
          </motion.div>

          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 pl-1 font-jakarta font-medium">
            <MapPin size={14} className="shrink-0 text-violet-500 dark:text-violet-400" />
            Nawalparasi West, Nepal
          </div>

          <NepalClock />
        </div>

        {/* Column 2: Social links */}
        <div className="flex flex-col gap-3 lg:items-center lg:w-1/3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-white/25 font-bold font-syne text-left lg:text-center w-full">Connect</p>
          <div className="flex flex-wrap gap-2 lg:justify-center">
            {socials.map(({ label, url, icon: Icon, color }) => (
              <motion.a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.08 }}
                className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-3.5 py-1.5 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-600 dark:text-white/60 transition-all duration-300 font-jakarta shadow-sm dark:shadow-none hover:shadow-md"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = color + (document.documentElement.classList.contains('dark') ? '80' : '50');
                  (e.currentTarget as HTMLElement).style.color = color;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${color}20`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '';
                  (e.currentTarget as HTMLElement).style.color = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = '';
                }}
              >
                <Icon size={13} />
                {label}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Column 3: Copyright + visitor */}
        <div className="flex flex-col items-start lg:items-end gap-3 justify-end lg:w-1/3">
          <p className="text-xs font-bold uppercase tracking-widest lg:text-right font-syne"
            style={{ backgroundImage: 'linear-gradient(to right, #f59e0b, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            © {new Date().getFullYear()} Er.Suraj Tharu Chaudhary
          </p>
          <p className="text-xs text-slate-500 dark:text-white/40 tracking-wide -mt-2 lg:text-right font-jakarta font-medium">
            All rights reserved. Crafted with ❤️ in Nepal.
          </p>
          <div className="bg-white/50 dark:bg-transparent rounded-lg p-1">
            <VisitorCounter />
          </div>
        </div>
      </motion.div>

      {/* Animated bottom gradient bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 4,
        backgroundImage: 'linear-gradient(to right, #0ea5e9, #2563eb, #f59e0b, #fcd34d, #0ea5e9)',
        backgroundSize: '200% 100%',
        animation: 'footer-shimmer 6s linear infinite',
      }} />
    </footer>
    </>
  );
}
