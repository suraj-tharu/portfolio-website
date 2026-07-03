import { useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { MapPin, GraduationCap, Briefcase, Users, BookOpen, Code2, Coffee, Award } from 'lucide-react';

/* ── Animated Counter ────────────────────────────────────── */
function AnimatedCounter({ to, suffix = '', duration = 2, delay = 0 }: {
  to: number; suffix?: string; duration?: number; delay?: number;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: 'easeOut', delay });
      return controls.stop;
    }
  }, [inView, count, to, duration, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

/* ── Bento Stat Card ─────────────────────────────────────── */
function StatCard({
  icon: Icon, label, value, suffix, color, delay, colSpan = false,
}: {
  icon: React.ElementType; label: string; value: number; suffix?: string;
  color: string; delay: number; colSpan?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - r.left) / r.width) * 100);
    mouseY.set(((e.clientY - r.top) / r.height) * 100);
    e.currentTarget.style.setProperty('--bx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--by', `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouse}
      className={`bento-card group cursor-default ${colSpan ? 'md:col-span-2' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <span className="text-[0.65rem] uppercase tracking-[0.18em] text-white/20 font-bold font-syne">{label}</span>
      </div>

      {/* Value */}
      <div
        className="stat-number"
        style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
      >
        <AnimatedCounter to={value} suffix={suffix ?? ''} delay={delay + 0.3} />
      </div>

      {/* Bottom glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    </motion.div>
  );
}

const stats = [
  { icon: GraduationCap, label: 'Years Experience', value: 8,  suffix: '+', color: '#a78bfa', delay: 0 },
  { icon: Code2,         label: 'Projects Completed', value: 40, suffix: '+', color: '#38bdf8', delay: 0.08 },
  { icon: BookOpen,      label: 'Publications',       value: 5,  suffix: '+', color: '#f472b6', delay: 0.16 },
  { icon: Users,         label: 'Students Taught',    value: 500, suffix: '+', color: '#34d399', delay: 0.24 },
  { icon: Award,         label: 'Certifications',     value: 12, suffix: '+', color: '#fbbf24', delay: 0.32 },
  { icon: Coffee,        label: 'Cups of Tea',        value: 2847, suffix: '', color: '#fb923c', delay: 0.4  },
];

/* ── Bio Paragraph ───────────────────────────────────────── */
function BioParagraph({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="text-fluid-body text-white/60 dark:text-white/60 leading-[1.85] font-jakarta"
    >
      {children}
    </motion.p>
  );
}

export default function AboutMe() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-[var(--bg)] section-py"
      style={{ isolation: 'isolate' }}
    >
      {/* ── Background editorial watermark ────────── */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
      >
        <span
          className="watermark-text"
          style={{
            fontSize: 'clamp(8rem, 22vw, 22rem)',
            opacity: 0.035,
            whiteSpace: 'nowrap',
          }}
        >
          ABOUT
        </span>
      </div>

      {/* ── Ambient orbs ─────────────────────────── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div style={{
          position: 'absolute', top: '10%', right: '-10%',
          width: '45vw', height: '45vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-8%',
          width: '35vw', height: '35vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
      </div>

      <div className="relative z-10 section-container">

        {/* ── Section Label ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="float-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
            About Me
          </span>
        </motion.div>

        {/* ── Two-column editorial layout ───────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* LEFT — Headline + Bio ──────────────── */}
          <div className="flex flex-col gap-8">
            {/* Big display heading */}
            <div>
              <div style={{ overflow: 'hidden' }}>
                <motion.h2
                  initial={{ y: '110%' }}
                  whileInView={{ y: '0%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-syne font-black leading-[0.88] tracking-tight text-white/95"
                  style={{ fontSize: 'clamp(3.2rem, 7vw, 7rem)' }}
                >
                  Er. Suraj
                </motion.h2>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <motion.h2
                  initial={{ y: '110%' }}
                  whileInView={{ y: '0%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="font-syne font-black leading-[0.88] tracking-tight italic"
                  style={{
                    fontSize: 'clamp(3.2rem, 7vw, 7rem)',
                    background: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 50%,#38bdf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Tharu
                </motion.h2>
              </div>

              {/* Animated underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: 2, width: 80, originX: 0, marginTop: '1.25rem',
                  background: 'linear-gradient(90deg,#a78bfa,#f472b6)',
                  borderRadius: 999,
                  boxShadow: '0 0 12px rgba(167,139,250,0.5)',
                }}
              />
            </div>

            {/* Location + Status row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-3"
            >
              <span className="flex items-center gap-1.5 text-sm text-white/40 font-jakarta">
                <MapPin size={13} className="text-violet-400" />
                Nawalparasi West, Nepal
              </span>
              <span className="w-1 h-1 rounded-full bg-white/15" />
              <span className="flex items-center gap-2 text-sm text-emerald-400 font-jakarta font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Open to Collaboration
              </span>
              <span className="w-1 h-1 rounded-full bg-white/15" />
              <span className="flex items-center gap-1.5 text-sm text-white/40 font-jakarta">
                <Briefcase size={13} className="text-pink-400" />
                GIS & Research Specialist
              </span>
            </motion.div>

            {/* Bio paragraphs */}
            <div className="flex flex-col gap-5">
              <BioParagraph delay={0.1}>
                Computer Engineering professional with deep expertise in{' '}
                <strong className="text-white/85 font-semibold">GIS & Remote Sensing</strong>,{' '}
                <strong className="text-white/85 font-semibold">Machine Learning</strong>, and{' '}
                <strong className="text-white/85 font-semibold">full-stack development</strong>.
                Passionate about leveraging technology for sustainable development and innovation in Nepal.
              </BioParagraph>
              <BioParagraph delay={0.18}>
                Earned a{' '}
                <strong className="text-violet-300 font-semibold">B.E. in Computer Engineering</strong>{' '}
                from Mid-West University and an{' '}
                <strong className="text-pink-300 font-semibold">M.Sc. in Information System Engineering</strong>{' '}
                from Purbanchal University. Completed a six-month internship at{' '}
                <strong className="text-sky-300 font-semibold">Nepal Telecom</strong>.
              </BioParagraph>
              <BioParagraph delay={0.26}>
                Currently working as a{' '}
                <strong className="text-emerald-300 font-semibold">Coordinator</strong> at Shree Tri Shaheed
                Model Secondary School, Syangja — focusing on technology-driven learning, research, and
                capacity building in technical & vocational education.
              </BioParagraph>
            </div>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <a href="#contact" className="btn-gradient font-jakarta text-sm">
                Get In Touch
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 4 }}>
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href="/Suraj_Tharu_CV.pdf"
                download
                className="btn-outline-luxury font-jakarta text-sm"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v9M3 7l4 4 4-4M1 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download CV
              </a>
            </motion.div>
          </div>

          {/* RIGHT — Stats Bento Grid ──────────── */}
          <div className="flex flex-col gap-6">
            {/* Education pill */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bento-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                  <GraduationCap size={16} className="text-violet-400" />
                </div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/25 font-syne">Education</span>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { degree: 'M.Sc. Information System Engineering', uni: 'Purbanchal University', year: '2020' },
                  { degree: 'B.E. Computer Engineering', uni: 'Mid-West University', year: '2017' },
                ].map((e) => (
                  <div key={e.degree} className="flex items-start justify-between gap-2 py-1.5 border-b border-white/[0.04] last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-white/85 font-jakarta leading-tight">{e.degree}</p>
                      <p className="text-xs text-white/35 font-jakarta mt-0.5">{e.uni}</p>
                    </div>
                    <span className="text-xs text-violet-400/70 font-mono font-bold shrink-0">{e.year}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats mini bento */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

            {/* Skills chips row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bento-card"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/25 font-bold font-syne mb-3">Core Expertise</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'GIS & Remote Sensing','Machine Learning','Python','React','Node.js',
                  'Earth Engine','Flutter','Next.js','Research','Data Viz',
                ].map((skill) => (
                  <span key={skill} className="tag-luxury font-jakarta">{skill}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
