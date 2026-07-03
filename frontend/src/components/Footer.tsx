import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import VisitorCounter from './VisitorCounter';
import { Briefcase, Terminal, GraduationCap, Microscope, MapPin, Mail, ArrowRight } from 'lucide-react';

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

/* ── Magnetic email button ──────────────────────────────── */
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

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={`mailto:${email}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      data-magnetic
      data-cursor-text="Email"
      className="group relative inline-flex items-center gap-3 rounded-full px-8 sm:px-12 py-4 sm:py-5 text-base md:text-lg font-semibold overflow-hidden border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/80 hover:text-white dark:hover:text-white backdrop-blur-xl transition-colors duration-300"
    >
      {/* Gradient hover fill */}
      <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="absolute inset-[1px] rounded-full bg-slate-50 dark:bg-[#0a0a0c] group-hover:opacity-0 transition-opacity duration-500" />
      {/* Shimmer sweep on hover */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden rounded-full" style={{ transition: 'opacity 0.3s' }}>
        <span style={{
          position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
          background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',
          animation: 'footer-shimmer 1.5s ease-in-out infinite',
        }} />
      </span>
      <span className="relative z-10 flex items-center gap-3">
        <Mail size={18} className="shrink-0" />
        {email}
        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300 shrink-0" />
      </span>
    </motion.a>
  );
}

/* ── Proximity-repulsion headline chars ──────────────────── */
function ProximityHeadline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-display tracking-tighter leading-[0.88] mb-10">
      {children}
    </h2>
  );
}

/* ── Main Footer ─────────────────────────────────────────── */
export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end end'] });
  const orbY = useTransform(scrollYProgress, [0, 1], ['-18%', '0%']);

  /* GSAP infinite marquee */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 30,
        ease: 'none',
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={containerRef}
      className="relative z-20 overflow-hidden bg-white dark:bg-[#060608] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 rounded-t-[40px] md:rounded-t-[72px]"
    >
      <style>{`
        @keyframes footer-shimmer { 0%{left:-100%} 100%{left:200%} }
        @keyframes footer-glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes marquee-item-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
      `}</style>

      {/* ── Ghost watermark ───────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0 overflow-hidden"
      >
        <span className="text-[18vw] font-display italic font-black whitespace-nowrap text-slate-900/[0.025] dark:text-white/[0.025]">
          SURAJ THARU
        </span>
      </div>

      {/* ── Animated orbs ─────────────────────────────── */}
      <motion.div style={{ y: orbY }} aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-[150px] bg-violet-500/8 dark:bg-violet-600/22" />
        <div className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full blur-[150px] bg-pink-500/8 dark:bg-pink-600/22" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full blur-[130px] bg-cyan-500/8 dark:bg-cyan-600/18" />
      </motion.div>

      {/* ── Marquee strip — with hover color wave ────── */}
      <div className="relative z-10 w-full overflow-hidden py-10 md:py-16 border-b border-slate-100 dark:border-white/5">
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="px-6 cursor-default select-none text-6xl md:text-8xl lg:text-9xl font-display italic tracking-tight text-slate-200 dark:text-white/[0.06] hover:text-violet-400 dark:hover:text-violet-300 transition-colors duration-500"
              style={{
                display: 'inline-block',
                /* Wave effect via nth-child — staggered transition-delay */
                transitionDelay: `${(i % 6) * 0.05}s`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.color = '#a78bfa';
                el.style.textShadow = '0 0 20px rgba(167,139,250,0.5)';
                /* Ripple to neighbors */
                const prev = el.previousElementSibling as HTMLElement | null;
                const next = el.nextElementSibling as HTMLElement | null;
                if (prev) { prev.style.color = 'rgba(167,139,250,0.55)'; prev.style.textShadow = '0 0 12px rgba(167,139,250,0.3)'; }
                if (next) { next.style.color = 'rgba(167,139,250,0.55)'; next.style.textShadow = '0 0 12px rgba(167,139,250,0.3)'; }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.color = '';
                el.style.textShadow = '';
                const prev = el.previousElementSibling as HTMLElement | null;
                const next = el.nextElementSibling as HTMLElement | null;
                if (prev) { prev.style.color = ''; prev.style.textShadow = ''; }
                if (next) { next.style.color = ''; next.style.textShadow = ''; }
              }}
            >
              {marqueeItems[i % marqueeItems.length]}
              <span style={{ color: 'rgba(167,139,250,0.3)', margin: '0 8px', fontSize: '0.6em' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main CTA block ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 md:pt-28 md:pb-20"
      >
        {/* Label */}
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 1.5, width: 40, originX: 0,
              background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.6))',
              borderRadius: 999,
            }}
          />
          <span className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-white/40 font-medium">
            Let's collaborate
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 1.5, width: 40, originX: 1,
              background: 'linear-gradient(90deg,rgba(167,139,250,0.6),transparent)',
              borderRadius: 999,
            }}
          />
        </div>

        <ProximityHeadline>
          <motion.span
            className="text-slate-900 dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Ready to create
          </motion.span>
          <br />
          <motion.span
            className="italic text-transparent bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 bg-clip-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            something special?
          </motion.span>
        </ProximityHeadline>

        {/* Magnetic email button */}
        <MagneticEmailButton email="suraj.xaudhary@gmail.com" />

        {/* Availability note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ marginTop: 20, fontSize: '0.78rem', color: 'rgba(167,139,250,0.4)', letterSpacing: '0.08em' }}
        >
          Typically responds within 24 hours
        </motion.p>
      </motion.div>

      {/* ── Bottom bar ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ once: true }}
        className="relative z-10 px-6 md:px-14 pb-8 md:pb-10 border-t border-slate-100 dark:border-white/10 flex flex-col lg:flex-row gap-10 lg:gap-6 justify-between pt-10"
      >
        {/* Column 1: Status + Location */}
        <div className="flex flex-col gap-3 lg:w-1/3">
          <motion.div
            whileHover={{ scale: 1.03, y: -1 }}
            className="self-start flex items-center gap-3 rounded-full px-4 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Available for projects
            </span>
          </motion.div>

          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 pl-1">
            <MapPin size={13} className="shrink-0 text-violet-500" />
            Nawalparasi West, Nepal
          </div>
        </div>

        {/* Column 2: Social links */}
        <div className="flex flex-col gap-3 lg:items-center lg:w-1/3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-white/30 font-semibold text-left lg:text-center w-full">
            Connect
          </p>
          <div className="flex flex-wrap gap-2 lg:justify-center">
            {socials.map(({ label, url, icon: Icon, color }) => (
              <motion.a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.08 }}
                className="flex items-center gap-1.5 text-sm font-medium rounded-full px-3.5 py-1.5 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white/60 transition-all duration-300"
                style={{ '--hover-color': color } as React.CSSProperties}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = color + '80';
                  (e.currentTarget as HTMLElement).style.color = color;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${color}30`;
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
          <p className="text-xs font-bold uppercase tracking-widest text-transparent bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text lg:text-right">
            © {new Date().getFullYear()} Er. Suraj Tharu Chaudhary.
          </p>
          <p className="text-xs text-slate-400 dark:text-white/35 tracking-wide -mt-2 lg:text-right">
            All rights reserved. Crafted with ❤️ in Nepal.
          </p>
          <VisitorCounter />
        </div>
      </motion.div>

      {/* Bottom gradient bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg,#7c3aed,#db2777,#06b6d4,#34d399,#7c3aed)',
        backgroundSize: '200% 100%',
        animation: 'hero-shimmer 6s linear infinite',
      }} />
    </footer>
  );
}
