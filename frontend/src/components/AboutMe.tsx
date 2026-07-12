import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, useScroll } from "framer-motion";
import {
  MapPin, GraduationCap, Briefcase, Users, BookOpen, Code2,
  Coffee, Award, Download, ArrowRight, ExternalLink,
  type LucideIcon
} from "lucide-react";
import surajPhoto from "../assets/suraj_profile.jpg";

/* ─────────────────────────────────────────────────────────────
   Figma Smart-Animate easing presets
──────────────────────────────────────────────────────────────── */
const EASE = {
  silkSmooth:  [0.16, 1, 0.3, 1]       as const,
  figmaSpring: [0.34, 1.56, 0.64, 1]  as const,
  luxuryIn:    [0.0, 0.0, 0.2, 1.0]   as const,
  cinematic:   [0.76, 0, 0.24, 1]     as const,
  gentle:      [0.25, 0.46, 0.45, 0.94] as const,
};

/* ─────────────────────────────────────────────────────────────
   Injected keyframes
──────────────────────────────────────────────────────────────── */
const AM_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,600;0,700;0,900;1,700;1,900&display=swap');
@keyframes am-flow    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes am-shimmer { 0%{left:-100%} 100%{left:120%} }
@keyframes am-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes am-spin-rev  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
@keyframes am-drift-1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(40px,-28px) scale(1.06)} 70%{transform:translate(-20px,24px) scale(0.97)} }
@keyframes am-drift-2 { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-30px,18px) scale(1.04)} 65%{transform:translate(25px,-22px) scale(0.98)} }
@keyframes am-glow-pulse { 0%,100%{opacity:0.5; transform:scale(1)} 50%{opacity:1; transform:scale(1.05)} }
@keyframes am-border-flow { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
`;

/* ─────────────────────────────────────────────────────────────
   Animated Counter
──────────────────────────────────────────────────────────────── */
function AnimatedCounter({ to, suffix = "", duration = 2, delay = 0 }: {
  to: number; suffix?: string; duration?: number; delay?: number;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (inView) {
      const c = animate(count, to, { duration, ease: "easeOut", delay });
      return c.stop;
    }
  }, [inView, count, to, duration, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Ultra Stat Card
──────────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, suffix, color, delay }: {
  icon: LucideIcon; label: string; value: number; suffix?: string;
  color: string; delay: number;
}) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.75, delay, ease: EASE.silkSmooth }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: '1.25rem',
        background: hov ? `linear-gradient(145deg, ${color}18 0%, ${color}08 100%)` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? color + '35' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(20px)',
        padding: 'clamp(14px,1.8vw,22px)',
        transition: 'background 0.4s, border-color 0.4s',
        cursor: 'default',
      }}
    >
      <motion.div
        animate={{ scale: hov ? 1.15 : 1, rotate: hov ? 8 : 0 }}
        transition={{ duration: 0.4, ease: EASE.figmaSpring }}
        style={{
          width: 36, height: 36, borderRadius: '0.75rem',
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
        }}
      >
        <Icon size={15} style={{ color }} />
      </motion.div>
      <div style={{
        fontSize: 'clamp(1.6rem,3vw,2.5rem)',
        fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em',
        fontFamily: "'Inter', sans-serif",
        color: hov ? color : 'rgba(255,255,255,0.9)', transition: 'color 0.35s', marginBottom: 4,
      }}>
        <AnimatedCounter to={value} suffix={suffix ?? ""} delay={delay + 0.3} />
      </div>
      <p style={{
        fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em',
        fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif",
      }}>{label}</p>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg,transparent,${color},transparent)`,
        opacity: hov ? 1 : 0, transition: 'opacity 0.4s',
        borderRadius: '0 0 1.25rem 1.25rem',
      }} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Luxury Skill Bar
──────────────────────────────────────────────────────────────── */
function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hov, setHov] = useState(false);

  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: '0.72rem', fontWeight: 600,
          color: hov ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
          transition: 'color 0.3s', fontFamily: "'Inter', sans-serif", letterSpacing: '0.02em',
        }}>{name}</span>
        <motion.span
          animate={{ color: hov ? color : 'rgba(255,255,255,0.4)' }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: '0.62rem', fontWeight: 700, fontFamily: 'monospace' }}
        >{level}%</motion.span>
      </div>
      <div style={{ height: 3, borderRadius: 999, overflow: 'hidden', background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${color}80, ${color})` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.4, delay, ease: EASE.silkSmooth }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Education Timeline Item
──────────────────────────────────────────────────────────────── */
function EduItem({ degree, uni, year, color, delay }: {
  degree: string; uni: string; year: string; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.75, delay, ease: EASE.silkSmooth }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 3 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', border: `2px solid ${color}`, background: `${color}25` }} />
        <div style={{ width: 1, minHeight: 28, marginTop: 4, background: `linear-gradient(180deg, ${color}50, transparent)` }} />
      </div>
      <div style={{ paddingBottom: 18 }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>{degree}</p>
        <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: 2, fontFamily: "'Inter', sans-serif" }}>{uni}</p>
        <span style={{
          display: 'inline-block', marginTop: 5, fontSize: '0.57rem', fontWeight: 700,
          fontFamily: 'monospace', padding: '2px 8px', borderRadius: 999,
          background: `${color}18`, color, border: `1px solid ${color}28`,
        }}>{year}</span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Ultra-premium Profile Photo Card
──────────────────────────────────────────────────────────────── */
function ProfilePhotoCard() {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{ position: 'relative', width: '100%', maxWidth: 380, margin: '0 auto' }}
    >
      {/* Spinning gradient border */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: -2, borderRadius: '2.2rem',
          background: 'linear-gradient(135deg,#f59e0b,#a78bfa,#ec4899,#06b6d4,#f59e0b)',
          backgroundSize: '300% 300%', animation: 'am-border-flow 4s ease infinite',
          zIndex: 0,
        }}
      >
        <div style={{ margin: 2, height: 'calc(100% - 4px)', background: '#0d0a1e', borderRadius: '2rem' }} />
      </motion.div>

      {/* Outer orbit rings */}
      <div style={{
        position: 'absolute', inset: -18, borderRadius: '2.8rem',
        border: '1px dashed rgba(167,139,250,0.15)',
        animation: 'am-spin-rev 25s linear infinite', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', inset: -32, borderRadius: '3.4rem',
        border: '1px solid rgba(245,158,11,0.07)',
        animation: 'am-spin-slow 40s linear infinite', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Orbit dots */}
      {[0, 120, 240].map((deg, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '110%', height: '110%',
          transform: `rotate(${deg}deg)`, transformOrigin: '0 0',
          marginTop: '-55%', marginLeft: '-55%',
          animation: `am-spin-slow ${18 + i * 4}s linear infinite`,
          pointerEvents: 'none', zIndex: 2,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 7, height: 7, borderRadius: '50%',
            background: ['#f59e0b', '#a78bfa', '#06b6d4'][i],
            boxShadow: `0 0 12px ${['rgba(245,158,11,0.9)', 'rgba(167,139,250,0.9)', 'rgba(6,182,212,0.9)'][i]}`,
          }} />
        </div>
      ))}

      {/* Main photo container */}
      <motion.div
        animate={{ y: hov ? -6 : 0, scale: hov ? 1.015 : 1 }}
        transition={{ duration: 0.6, ease: EASE.silkSmooth }}
        style={{
          position: 'relative', zIndex: 1,
          borderRadius: '2rem', overflow: 'hidden', aspectRatio: '3/4',
          background: 'linear-gradient(145deg,rgba(124,58,237,0.3),rgba(6,182,212,0.1))',
          boxShadow: hov
            ? '0 40px 100px rgba(124,58,237,0.4), 0 20px 60px rgba(245,158,11,0.2), 0 0 0 2px rgba(167,139,250,0.4)'
            : '0 24px 64px rgba(0,0,0,0.7), 0 8px 32px rgba(124,58,237,0.2)',
          transition: 'box-shadow 0.5s',
        }}
      >
        <img
          src={surajPhoto}
          alt="Er. Suraj Tharu Chaudhary — Computer Engineer, GIS & ML Specialist"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top', display: 'block',
            filter: hov ? 'brightness(1.08) saturate(1.15)' : 'brightness(0.92) saturate(1.05)',
            transition: 'filter 0.5s ease',
          }}
        />

        {/* Overlay gradients */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom,transparent 50%,rgba(6,4,15,0.88) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg,rgba(124,58,237,0.12) 0%,transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Bottom name badge */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 18px' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: EASE.silkSmooth }}
          >
            <p style={{
              fontSize: '1.05rem', fontWeight: 900, fontStyle: 'italic',
              letterSpacing: '-0.03em', lineHeight: 1.1, fontFamily: "'Inter', sans-serif",
              background: 'linear-gradient(90deg,#f59e0b,#a78bfa,#f472b6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              backgroundSize: '200% 100%', animation: 'am-flow 3s ease infinite',
            }}>
              Er. Suraj Tharu
            </p>
            <p style={{
              fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 3,
              fontFamily: "'Inter', sans-serif",
            }}>
              GIS · ML · Web Engineer
            </p>
          </motion.div>
        </div>

        {/* Available badge */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(10,8,20,0.72)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(52,211,153,0.28)', borderRadius: 999,
          padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%', background: '#34d399',
            boxShadow: '0 0 6px rgba(52,211,153,0.8)', display: 'inline-block',
          }} />
          <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' }}>
            Available
          </span>
        </div>
      </motion.div>

      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 120, height: 120,
        borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.4) 0%,transparent 70%)',
        filter: 'blur(24px)', pointerEvents: 'none', zIndex: 0,
        animation: 'am-glow-pulse 3s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: -16, left: -16, width: 100, height: 100,
        borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.35) 0%,transparent 70%)',
        filter: 'blur(20px)', pointerEvents: 'none', zIndex: 0,
        animation: 'am-glow-pulse 4s ease-in-out infinite 1s',
      }} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Data
──────────────────────────────────────────────────────────────── */
const stats = [
  { icon: GraduationCap, label: "Years Exp.",   value: 5,    suffix: "+", color: "#a78bfa", delay: 0    },
  { icon: Code2,         label: "Projects",     value: 40,   suffix: "+", color: "#38bdf8", delay: 0.07 },
  { icon: BookOpen,      label: "Publications", value: 2,    suffix: "+", color: "#f472b6", delay: 0.14 },
  { icon: Users,         label: "Students",     value: 500,  suffix: "+", color: "#34d399", delay: 0.21 },
  { icon: Award,         label: "Certs",        value: 12,   suffix: "+", color: "#fbbf24", delay: 0.28 },
  { icon: Coffee,        label: "Cups of Tea",  value: 2847, suffix: "",  color: "#fb923c", delay: 0.35 },
];

const skills = [
  { name: "GIS & Remote Sensing", level: 92, color: "#a78bfa" },
  { name: "Machine Learning",     level: 85, color: "#38bdf8" },
  { name: "React / Next.js",      level: 88, color: "#f472b6" },
  { name: "Python",               level: 90, color: "#34d399" },
  { name: "Flutter / Dart",       level: 78, color: "#fbbf24" },
  { name: "Earth Engine / GEE",   level: 83, color: "#fb923c" },
];

const expertise = [
  "GIS & Remote Sensing", "Machine Learning", "Python", "React", "Node.js",
  "Earth Engine", "Flutter", "Next.js", "Research", "Data Viz", "PostgreSQL", "Docker",
];

/* ─────────────────────────────────────────────────────────────
   Main Component
──────────────────────────────────────────────────────────────── */
export default function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full overflow-hidden section-py"
      style={{ background: 'var(--bg, #07060f)', isolation: 'isolate' }}
    >
      <style>{AM_CSS}</style>

      {/* Parallax ambient background */}
      <motion.div style={{ y: bgY }} aria-hidden className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', top: '-20%', right: '-15%', width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)',
          filter: 'blur(80px)', animation: 'am-drift-1 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-12%', left: '-12%', width: '48vw', height: '48vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 70%)',
          filter: 'blur(70px)', animation: 'am-drift-2 25s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '30%', width: '30vw', height: '30vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(6,182,212,0.06) 0%,transparent 70%)', filter: 'blur(90px)',
        }} />
      </motion.div>

      {/* HUD Grid */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[20, 40, 60, 80].map((pct) => (
          <div key={pct} style={{
            position: 'absolute', top: 0, bottom: 0, left: `${pct}%`, width: 1,
            background: 'linear-gradient(180deg,transparent,rgba(139,92,246,0.035),transparent)',
          }} />
        ))}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1, top: '50%',
          background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.035),transparent)',
        }} />
      </div>

      {/* Watermark */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span style={{
          fontSize: 'clamp(7rem,24vw,22rem)', fontFamily: "'Inter', sans-serif",
          fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.05em', lineHeight: 1,
          color: 'transparent', backgroundImage: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', opacity: 0.028, whiteSpace: 'nowrap',
        }}>ABOUT</span>
      </div>

      <div className="relative z-10 section-container">

        {/* Section Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE.silkSmooth }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 'clamp(40px,6vw,72px)' }}
        >
          <span className="float-badge" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', display: 'inline-block',
              boxShadow: '0 0 8px rgba(167,139,250,0.8)', animation: 'am-glow-pulse 2s ease-in-out infinite',
            }} />
            About Me
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[48, 28, 10].map((w, i) => (
              <div key={i} style={{ height: 1, width: w, borderRadius: 999, background: 'linear-gradient(90deg,rgba(167,139,250,0.4),transparent)' }} />
            ))}
          </div>
          <span style={{
            fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.32em', color: 'rgba(167,139,250,0.45)', fontFamily: "'Inter', sans-serif",
          }}>
            Engineer · Educator · Researcher
          </span>
        </motion.div>

        {/* Hero Headline */}
        <div style={{ marginBottom: 'clamp(40px,7vw,80px)', overflow: 'hidden' }}>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ y: '115%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: EASE.silkSmooth }}
              style={{
                fontSize: 'clamp(3.2rem,9vw,9rem)', fontWeight: 900, lineHeight: 0.88,
                letterSpacing: '-0.045em', fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.92)',
              }}
            >
              Er. Suraj{" "}
              <span style={{
                fontStyle: 'italic',
                backgroundImage: 'linear-gradient(135deg,#f59e0b 0%,#a78bfa 35%,#f472b6 65%,#38bdf8 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                animation: 'am-flow 5s ease infinite',
              }}>Tharu</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.25, ease: EASE.silkSmooth }}
            style={{
              height: 2, marginTop: 'clamp(12px,1.5vw,20px)', originX: 0,
              background: 'linear-gradient(90deg,#f59e0b,#a78bfa,#f472b6,#38bdf8)',
              backgroundSize: '300% 100%', animation: 'am-flow 4s ease infinite',
              borderRadius: 999, maxWidth: 200, boxShadow: '0 0 24px rgba(167,139,250,0.6)',
            }}
          />
        </div>

        {/* MAIN GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(32px,5vw,80px)',
          alignItems: 'start',
        }}>

          {/* LEFT: Photo Column */}
          <motion.div style={{ y: photoY }}>
            <motion.div
              initial={{ opacity: 0, x: -40, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: EASE.silkSmooth }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <ProfilePhotoCard />

                {/* Pills */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: 0.25, ease: EASE.silkSmooth }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
                >
                  {[
                    { icon: <MapPin size={11} style={{ color: '#a78bfa', flexShrink: 0 }} />, text: 'Nawalparasi West, Nepal', style: {} },
                    {
                      icon: (
                        <span style={{ position: 'relative', display: 'flex', width: 8, height: 8, flexShrink: 0 }}>
                          <span className="animate-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#34d399', opacity: 0.6 }} />
                          <span style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: '#34d399' }} />
                        </span>
                      ),
                      text: 'Open to Work',
                      style: { color: '#34d399', border: '1px solid rgba(52,211,153,0.28)', background: 'rgba(52,211,153,0.08)', fontWeight: 700 },
                    },
                    { icon: <Briefcase size={11} style={{ color: '#f472b6', flexShrink: 0 }} />, text: 'GIS & Research Lead', style: {} },
                  ].map((pill, i) => (
                    <span key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: '0.7rem', fontWeight: 500,
                      color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif",
                      padding: '6px 14px', borderRadius: 999,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)',
                      ...pill.style,
                    }}>
                      {pill.icon}{pill.text}
                    </span>
                  ))}
                </motion.div>

                {/* Education card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.85, delay: 0.18, ease: EASE.silkSmooth }}
                  style={{
                    borderRadius: '1.5rem', overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(20px)',
                    padding: 'clamp(16px,2vw,24px)', position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '1.5rem',
                    background: 'linear-gradient(135deg,rgba(167,139,250,0.04) 0%,transparent 60%)',
                    pointerEvents: 'none',
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '0.65rem',
                      background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.22)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <GraduationCap size={14} style={{ color: '#a78bfa' }} />
                    </div>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(167,139,250,0.6)', fontFamily: "'Inter', sans-serif" }}>
                      Education
                    </span>
                  </div>
                  <EduItem degree="M.Sc. Information System Engineering" uni="Purbanchal University" year="2020" color="#a78bfa" delay={0.1} />
                  <EduItem degree="B.E. Computer Engineering" uni="Mid-West University" year="2017" color="#38bdf8" delay={0.2} />
                  <EduItem degree="Internship — Nepal Telecom" uni="Six-month industry training" year="2016" color="#f472b6" delay={0.3} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Bio + Skills + Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px,3vw,40px)' }}>

            {/* Bio */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { delay: 0.05, content: (<>Computer Engineering professional with deep expertise in{" "}<strong style={{ color: 'rgba(167,139,250,0.9)', fontWeight: 600 }}>GIS & Remote Sensing</strong>,{" "}<strong style={{ color: 'rgba(56,189,248,0.9)', fontWeight: 600 }}>Machine Learning</strong>, and{" "}<strong style={{ color: 'rgba(244,114,182,0.9)', fontWeight: 600 }}>Web Technologies</strong>. Passionate about leveraging technology for sustainable development and innovation in Nepal.</>) },
                { delay: 0.13, content: (<>Earned a <strong style={{ color: 'rgba(167,139,250,0.9)', fontWeight: 600 }}>B.E. in Computer Engineering</strong>{" "}from Mid-West University and an{" "}<strong style={{ color: 'rgba(244,114,182,0.9)', fontWeight: 600 }}>M.Sc. in Information System Engineering</strong>{" "}from Purbanchal University. Completed a six-month internship at{" "}<strong style={{ color: 'rgba(56,189,248,0.9)', fontWeight: 600 }}>Nepal Telecom</strong>.</>) },
                { delay: 0.21, content: (<>Currently working as a{" "}<strong style={{ color: 'rgba(52,211,153,0.9)', fontWeight: 600 }}>Coordinator</strong> at Shree Tri Shaheed Model Secondary School, Syangja — focusing on technology-driven learning, research, and capacity building in technical & vocational education.</>) },
              ].map(({ delay, content }, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.85, delay, ease: EASE.silkSmooth }}
                  style={{
                    fontSize: 'clamp(0.82rem,1.1vw,0.95rem)', lineHeight: 1.9,
                    color: 'rgba(255,255,255,0.55)', fontFamily: "'Inter', sans-serif", fontWeight: 400,
                  }}
                >{content}</motion.p>
              ))}
            </div>

            {/* Skill bars card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.1, ease: EASE.silkSmooth }}
              style={{
                borderRadius: '1.5rem', overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(20px)', padding: 'clamp(16px,2vw,24px)', position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 60,
                background: 'linear-gradient(180deg,rgba(167,139,250,0.05),transparent)',
                pointerEvents: 'none', borderRadius: '1.5rem 1.5rem 0 0',
              }} />
              <p style={{
                fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.28em',
                fontWeight: 700, color: 'rgba(167,139,250,0.55)', marginBottom: 18,
                fontFamily: "'Inter', sans-serif",
              }}>Core Expertise</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px 32px' }}>
                {skills.map((s, i) => (<SkillBar key={s.name} {...s} delay={0.05 * i} />))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {expertise.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.06, borderColor: 'rgba(167,139,250,0.45)', color: 'rgba(255,255,255,0.85)' }}
                    transition={{ duration: 0.25, ease: EASE.figmaSpring }}
                    style={{
                      fontSize: '0.65rem', fontWeight: 600, fontFamily: "'Inter', sans-serif",
                      padding: '4px 12px', borderRadius: 999,
                      border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(255,255,255,0.45)', cursor: 'default', transition: 'all 0.25s',
                    }}
                  >{skill}</motion.span>
                ))}
              </div>
            </motion.div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(8px,1.2vw,14px)' }}>
              {stats.map((s) => (<StatCard key={s.label} {...s} />))}
            </div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.3, ease: EASE.silkSmooth }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingTop: 4 }}
            >
              <motion.a href="#contact" whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.3, ease: EASE.figmaSpring }} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 24px', borderRadius: 999,
                background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
                color: 'white', fontSize: '0.82rem', fontWeight: 700,
                fontFamily: "'Inter', sans-serif", textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
              }}>
                Get In Touch <ArrowRight size={14} style={{ flexShrink: 0 }} />
              </motion.a>
              <motion.a href="/Suraj_Tharu_CV.pdf" download whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.3, ease: EASE.figmaSpring }} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 24px', borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(10px)', color: 'rgba(255,255,255,0.75)',
                fontSize: '0.82rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", textDecoration: 'none',
              }}>
                <Download size={14} style={{ flexShrink: 0 }} /> Download CV
              </motion.a>
              <motion.a href="https://www.linkedin.com/in/suraj-tharu/" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.3, ease: EASE.figmaSpring }} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 24px', borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(10px)', color: 'rgba(255,255,255,0.75)',
                fontSize: '0.82rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", textDecoration: 'none',
              }}>
                <ExternalLink size={14} style={{ flexShrink: 0 }} /> LinkedIn
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
