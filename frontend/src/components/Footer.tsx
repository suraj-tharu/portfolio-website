import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform } from 'framer-motion';
import VisitorCounter from './VisitorCounter';
import { Briefcase, Terminal, GraduationCap, Microscope, MapPin, Mail, ArrowRight } from 'lucide-react';

const socials = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/suraj-tharu/', icon: Briefcase },
  { label: 'GitHub',   url: 'https://github.com/suraj-tharu',           icon: Terminal },
  { label: 'Scholar',  url: 'https://scholar.google.com',               icon: GraduationCap },
  { label: 'ResearchGate', url: 'https://www.researchgate.net',         icon: Microscope },
];

const marqueeItems = [
  'BUILDING THE FUTURE',
  'INNOVATING TOMORROW',
  'SHAPING POSSIBILITIES',
  'CREATING EXCELLENCE',
  'ENGINEERING DREAMS',
];

export default function Footer() {
  const marqueeRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  /* Parallax orbs */
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end end'] });
  const orbY = useTransform(scrollYProgress, [0, 1], ['-15%', '0%']);

  /* GSAP infinite marquee */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 35,
        ease: 'none',
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={containerRef}
      className="
        relative z-20 overflow-hidden
        bg-white dark:bg-[#060608]
        text-slate-900 dark:text-white
        border-t border-slate-200 dark:border-white/10
        rounded-t-[40px] md:rounded-t-[72px]
      "
    >
      {/* ── Decorative background ─────────────────── */}
      {/* Ghost text watermark */}
      <div
        aria-hidden
        className="
          pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0 overflow-hidden
        "
      >
        <span
          className="
            text-[18vw] font-display italic font-black whitespace-nowrap
            text-slate-900/[0.03] dark:text-white/[0.03]
          "
        >
          SURAJ THARU
        </span>
      </div>

      {/* Animated gradient orbs */}
      <motion.div style={{ y: orbY }} aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full blur-[140px] bg-violet-500/10 dark:bg-violet-600/25" />
        <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full blur-[140px] bg-pink-500/10 dark:bg-pink-600/25" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full blur-[120px] bg-cyan-500/10 dark:bg-cyan-600/20" />
      </motion.div>

      {/* ── Marquee strip ─────────────────────────── */}
      <div className="relative z-10 w-full overflow-hidden py-10 md:py-16 border-b border-slate-100 dark:border-white/5">
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap text-6xl md:text-8xl lg:text-9xl font-display italic tracking-tight text-slate-200 dark:text-white/8"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="px-6 hover:text-violet-400 dark:hover:text-violet-300 transition-colors duration-500 cursor-default"
            >
              {marqueeItems[i % marqueeItems.length]} •
            </span>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={`d${i}`}
              className="px-6 hover:text-violet-400 dark:hover:text-violet-300 transition-colors duration-500 cursor-default"
            >
              {marqueeItems[i % marqueeItems.length]} •
            </span>
          ))}
        </div>
      </div>

      {/* ── Main CTA block ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 md:pt-28 md:pb-20"
      >
        {/* Label */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-10 bg-slate-300 dark:bg-white/20" />
          <span className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-white/40 font-medium">
            Let's collaborate
          </span>
          <div className="h-px w-10 bg-slate-300 dark:bg-white/20" />
        </div>

        {/* Headline */}
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-display tracking-tighter leading-[0.88] mb-10">
          <span className="text-slate-900 dark:text-white">Ready to create</span>
          <br />
          <span className="italic text-transparent bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 bg-clip-text">
            something special?
          </span>
        </h2>

        {/* CTA Button */}
        <motion.a
          href="mailto:suraj.xaudhary@gmail.com"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="
            group relative inline-flex items-center gap-3
            rounded-full px-8 sm:px-12 py-4 sm:py-5 text-base md:text-lg font-semibold overflow-hidden
            border border-slate-200 dark:border-white/15
            bg-slate-50 dark:bg-white/5
            text-slate-700 dark:text-white/80
            hover:text-white dark:hover:text-white
            backdrop-blur-xl
            transition-colors duration-300
          "
        >
          {/* Gradient fill on hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute inset-[1px] rounded-full bg-slate-50 dark:bg-[#0a0a0c] group-hover:opacity-0 transition-opacity duration-500" />
          <span className="relative z-10 flex items-center gap-3">
            <Mail size={18} className="shrink-0" />
            suraj.xaudhary@gmail.com
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
          </span>
        </motion.a>
      </motion.div>

      {/* ── Bottom bar ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ once: true }}
        className="
          relative z-10 px-6 md:px-14 pb-8 md:pb-10
          border-t border-slate-100 dark:border-white/10
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-10
        "
      >
        {/* ── Column 1: Status + Location */}
        <div className="flex flex-col gap-3">
          {/* Availability pill */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="
              self-start flex items-center gap-3
              rounded-full px-4 py-2.5
              bg-emerald-50 dark:bg-emerald-500/10
              border border-emerald-200 dark:border-emerald-500/30
            "
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Available for projects
            </span>
          </motion.div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 pl-1">
            <MapPin size={13} className="shrink-0 text-violet-500" />
            Nawalparasi West, Nepal
          </div>
        </div>

        {/* ── Column 2: Social links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-white/30 font-semibold">Connect</p>
          <div className="flex flex-wrap gap-2">
            {socials.map(({ label, url, icon: Icon }) => (
              <motion.a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2, scale: 1.05 }}
                className="
                  flex items-center gap-1.5 text-sm font-medium
                  rounded-full px-3.5 py-1.5
                  border border-slate-200 dark:border-white/10
                  bg-slate-50 dark:bg-white/5
                  text-slate-600 dark:text-white/60
                  hover:border-violet-400 dark:hover:border-violet-500
                  hover:text-violet-600 dark:hover:text-violet-300
                  transition-all duration-300
                "
              >
                <Icon size={13} />
                {label}
              </motion.a>
            ))}
          </div>
        </div>

        {/* ── Column 3: Copyright + Visitor counter */}
        <div className="flex flex-col items-start sm:items-start lg:items-end gap-3 justify-end">
          {/* Copyright */}
          <p className="text-xs font-bold uppercase tracking-widest text-transparent bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text">
            © 2026 Er. Suraj Tharu Chaudhary.
          </p>
          <p className="text-xs text-slate-400 dark:text-white/35 tracking-wide -mt-2">
            All rights reserved.
          </p>
          {/* Visitor badge */}
          <VisitorCounter />
        </div>
      </motion.div>
    </footer>
  );
}
