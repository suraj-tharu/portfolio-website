import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, useScroll, useSpring } from "framer-motion";
import {
  MapPin, GraduationCap, Briefcase, Users, BookOpen, Code2,
  Coffee, Award, Download, ArrowRight, ExternalLink,
  type LucideIcon
} from "lucide-react";

/* --- Injected keyframes --------------------------------------------- */
const AM_CSS = `
@keyframes am-flow    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes am-shimmer { 0%{left:-80%} 100%{left:120%} }
@keyframes am-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes am-drift-1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(30px,-20px) scale(1.05)} 70%{transform:translate(-15px,18px) scale(0.97)} }
@keyframes am-drift-2 { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-25px,15px) scale(1.04)} 65%{transform:translate(20px,-18px) scale(0.98)} }
@keyframes am-orbit { 0%{transform:rotate(0deg) translateX(60px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(60px) rotate(-360deg)} }
`;

/* --- Animated Counter ----------------------------------------------- */
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

/* --- Stat Card ------------------------------------------------------ */
function StatCard({ icon: Icon, label, value, suffix, color, delay }: {
  icon: LucideIcon; label: string; value: number; suffix?: string;
  color: string; delay: number;
}) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      className="bento-card group cursor-default relative overflow-hidden"
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300"
        style={{
          background: `${color}18`,
          border: `1px solid ${color}30`,
          transform: hov ? "scale(1.12)" : "scale(1)",
        }}
      >
        <Icon size={16} style={{ color }} />
      </div>

      {/* Value */}
      <div
        className="font-syne font-black leading-none mb-1"
        style={{
          fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
          color: hov ? color : undefined,
          transition: "color 0.3s",
        }}
      >
        <AnimatedCounter to={value} suffix={suffix ?? ""} delay={delay + 0.3} />
      </div>

      {/* Label */}
      <p className="about-stat-label text-[0.62rem] uppercase tracking-[0.18em] font-bold font-syne">
        {label}
      </p>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-[1.5rem] transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg,transparent,${color},transparent)`,
          opacity: hov ? 1 : 0,
        }}
      />

      {/* Hover radial glow */}
      <div
        className="absolute inset-0 rounded-[1.5rem] pointer-events-none transition-opacity duration-400"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${color}10 0%, transparent 70%)`,
          opacity: hov ? 1 : 0,
        }}
      />
    </motion.div>
  );
}

/* --- Skill Bar ------------------------------------------------------ */
function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold font-jakarta about-bio-text">{name}</span>
        <span className="text-[0.6rem] font-bold font-mono tabular-nums" style={{ color }}>{level}%</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}aa, ${color})` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

/* --- Profile Orb ---------------------------------------------------- */
function ProfileOrb() {
  const initials = ["S", "T"];
  return (
    <div className="relative w-full aspect-square max-w-[340px] mx-auto select-none">
      {/* Outer rotating ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: "1px dashed rgba(139,92,246,0.25)",
          animation: "am-spin-slow 30s linear infinite",
        }}
      />
      {/* Middle orbit ring */}
      <div
        className="absolute inset-[12%] rounded-full"
        style={{
          border: "1px solid rgba(244,114,182,0.18)",
          animation: "am-spin-slow 20s linear infinite reverse",
        }}
      />

      {/* Orbit dots */}
      {[0, 120, 240].map((deg, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 w-full h-full"
          style={{ transform: `rotate(${deg}deg)`, transformOrigin: "0 0", marginTop: "-50%", marginLeft: "-50%" }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ background: ["#a78bfa", "#f472b6", "#38bdf8"][i] }}
          />
        </div>
      ))}

      {/* Center card */}
      <div
        className="absolute inset-[18%] rounded-[2rem] flex flex-col items-center justify-center gap-3 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(139,92,246,0.15) 0%, rgba(244,114,182,0.08) 50%, rgba(56,189,248,0.10) 100%)",
          border: "1px solid rgba(139,92,246,0.22)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Monogram */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center font-syne font-black text-2xl"
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            color: "white",
            letterSpacing: "-0.04em",
          }}
        >
          ST
        </div>
        <div className="text-center px-3">
          <p className="font-syne font-bold text-sm about-heading-primary leading-tight">Er. Suraj Tharu</p>
          <p className="font-jakarta text-[0.62rem] about-muted-text mt-0.5">GIS · ML · Web Engineer</p>
        </div>
        {/* Shimmer sweep */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
          <div
            style={{
              position: "absolute", top: 0, left: "-80%", width: "60%", height: "100%",
              background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)",
              animation: "am-shimmer 4s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Corner accent glows */}
      <div
        className="absolute -top-4 -right-4 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)", filter: "blur(16px)" }}
      />
      <div
        className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(244,114,182,0.30) 0%, transparent 70%)", filter: "blur(14px)" }}
      />
    </div>
  );
}

/* --- Education Timeline Item ---------------------------------------- */
function EduItem({ degree, uni, year, color, delay }: {
  degree: string; uni: string; year: string; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-4 group"
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center shrink-0 pt-1">
        <div
          className="w-3 h-3 rounded-full border-2 transition-all duration-300 group-hover:scale-125"
          style={{ borderColor: color, backgroundColor: color + "30" }}
        />
        <div className="w-px flex-1 mt-1" style={{ background: `linear-gradient(180deg, ${color}40, transparent)`, minHeight: 32 }} />
      </div>
      {/* Content */}
      <div className="pb-5">
        <p className="text-sm font-bold about-edu-degree font-jakarta leading-snug">{degree}</p>
        <p className="text-xs about-edu-uni font-jakarta mt-0.5">{uni}</p>
        <span
          className="inline-block mt-1.5 text-[0.58rem] font-bold font-mono px-2 py-0.5 rounded-full"
          style={{ background: color + "18", color, border: `1px solid ${color}30` }}
        >
          {year}
        </span>
      </div>
    </motion.div>
  );
}

/* --- DATA ----------------------------------------------------------- */
const stats = [
  { icon: GraduationCap, label: "Years Exp.",    value: 5,    suffix: "+", color: "#a78bfa", delay: 0     },
  { icon: Code2,         label: "Projects",       value: 40,   suffix: "+", color: "#38bdf8", delay: 0.07  },
  { icon: BookOpen,      label: "Publications",   value: 2,    suffix: "+", color: "#f472b6", delay: 0.14  },
  { icon: Users,         label: "Students",       value: 500,  suffix: "+", color: "#34d399", delay: 0.21  },
  { icon: Award,         label: "Certs",          value: 12,   suffix: "+", color: "#fbbf24", delay: 0.28  },
  { icon: Coffee,        label: "Cups of Tea",    value: 2847, suffix: "",  color: "#fb923c", delay: 0.35  },
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

/* --- Main Component ------------------------------------------------- */
export default function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[var(--bg)] section-py"
      style={{ isolation: "isolate" }}
    >
      <style>{AM_CSS}</style>

      {/* -- Parallax ambient background -------------------- */}
      <motion.div
        style={{ y: bgY }}
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute -top-[20%] right-[-15%] w-[55vw] h-[55vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
            filter: "blur(70px)",
            animation: "am-drift-1 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-12%] w-[45vw] h-[45vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(244,114,182,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "am-drift-2 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </motion.div>

      {/* -- Swiss grid lines ------------------------------- */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[25, 50, 75].map((pct) => (
          <div
            key={pct}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${pct}%`,
              background: "linear-gradient(180deg,transparent,rgba(139,92,246,0.04),transparent)",
            }}
          />
        ))}
        {/* Horizontal rule */}
        <div
          className="absolute left-0 right-0 h-px top-1/2"
          style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.04),transparent)" }}
        />
      </div>

      {/* -- Watermark -------------------------------------- */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span
          className="font-black italic"
          style={{
            fontSize: "clamp(7rem, 24vw, 22rem)",
            fontFamily: "Syne, sans-serif",
            letterSpacing: "-0.05em",
            lineHeight: 1,
            color: "transparent",
            backgroundImage: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            opacity: 0.035,
            whiteSpace: "nowrap",
          }}
        >
          ABOUT
        </span>
      </div>

      <div className="relative z-10 section-container">

        {/* -- Section badge -------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-14"
        >
          <span className="float-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
            About Me
          </span>
          {/* Swiss rule lines */}
          <div className="flex items-center gap-1.5">
            {[48, 24, 8].map((w, i) => (
              <div key={i} className="h-px bg-slate-400/20 dark:bg-white/10 rounded-full" style={{ width: w }} />
            ))}
          </div>
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.35em] about-overline font-syne">
            Engineer · Educator · Researcher
          </span>
        </motion.div>

        {/* -- Hero headline — full width ------------------- */}
        <div className="mb-16 overflow-hidden">
          <div style={{ overflow: "hidden" }}>
            <motion.h2
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-syne font-black leading-[0.85] tracking-tight about-heading-primary"
              style={{ fontSize: "clamp(3.5rem, 9vw, 9rem)", letterSpacing: "-0.045em" }}
            >
              Er. Suraj{" "}
              <span
                className="italic"
                style={{
                  backgroundImage: "linear-gradient(135deg,#a78bfa 0%,#f472b6 40%,#38bdf8 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "am-flow 5s ease infinite",
                }}
              >
                Tharu
              </span>
            </motion.h2>
          </div>
          {/* Animated underline rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 2, originX: 0, marginTop: "1.2rem",
              background: "linear-gradient(90deg,#a78bfa,#f472b6,#38bdf8)",
              backgroundSize: "200% 100%",
              animation: "am-flow 4s ease infinite",
              borderRadius: 999, maxWidth: 180,
              boxShadow: "0 0 18px rgba(167,139,250,0.55)",
            }}
          />
        </div>

        {/* -- 3-column layout: Profile | Bio | Stats ------- */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr] gap-12 xl:gap-20 items-start">

          {/* --- LEFT: Profile orb + identity card ----------- */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProfileOrb />
            </motion.div>

            {/* Location / Status pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              <span className="flex items-center gap-1.5 text-xs about-muted-text font-jakarta px-3 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03]">
                <MapPin size={11} className="text-violet-400 shrink-0" />
                Nawalparasi West, Nepal
              </span>
              <span className="flex items-center gap-2 text-xs text-emerald-400 font-jakarta font-semibold px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                Open to Work
              </span>
              <span className="flex items-center gap-1.5 text-xs about-muted-text font-jakarta px-3 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03]">
                <Briefcase size={11} className="text-pink-400 shrink-0" />
                GIS &amp; Research Lead
              </span>
            </motion.div>

            {/* Education timeline card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="bento-card"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0">
                  <GraduationCap size={14} className="text-violet-400" />
                </div>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] about-overline font-syne">Education</span>
              </div>
              <EduItem
                degree="M.Sc. Information System Engineering"
                uni="Purbanchal University"
                year="2020"
                color="#a78bfa"
                delay={0.1}
              />
              <EduItem
                degree="B.E. Computer Engineering"
                uni="Mid-West University"
                year="2017"
                color="#38bdf8"
                delay={0.2}
              />
              <EduItem
                degree="Internship — Nepal Telecom"
                uni="Six-month industry training"
                year="2016"
                color="#f472b6"
                delay={0.3}
              />
            </motion.div>
          </div>

          {/* --- RIGHT: Bio + Skills + Stats ----------------- */}
          <div className="flex flex-col gap-10">

            {/* Bio block */}
            <div className="flex flex-col gap-5">
              {[
                {
                  delay: 0.05,
                  content: (
                    <>
                      Computer Engineering professional with deep expertise in{" "}
                      <strong className="about-heading-primary font-semibold">GIS &amp; Remote Sensing</strong>,{" "}
                      <strong className="about-heading-primary font-semibold">Machine Learning</strong>, and{" "}
                      <strong className="about-heading-primary font-semibold">Web Technologies</strong>.
                      Passionate about leveraging technology for sustainable development and innovation in Nepal.
                    </>
                  ),
                },
                {
                  delay: 0.13,
                  content: (
                    <>
                      Earned a <strong className="text-violet-300 font-semibold">B.E. in Computer Engineering</strong>{" "}
                      from Mid-West University and an{" "}
                      <strong className="text-pink-300 font-semibold">M.Sc. in Information System Engineering</strong>{" "}
                      from Purbanchal University. Completed a six-month internship at{" "}
                      <strong className="text-sky-300 font-semibold">Nepal Telecom</strong>.
                    </>
                  ),
                },
                {
                  delay: 0.21,
                  content: (
                    <>
                      Currently working as a{" "}
                      <strong className="text-emerald-300 font-semibold">Coordinator</strong> at Shree Tri Shaheed Model Secondary School,
                      Syangja — focusing on technology-driven learning, research, and capacity building in technical &amp; vocational education.
                    </>
                  ),
                },
              ].map(({ delay, content }, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
                  className="text-fluid-body about-bio-text leading-[1.85] font-jakarta"
                >
                  {content}
                </motion.p>
              ))}
            </div>

            {/* Skill bars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bento-card"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.22em] about-overline font-bold font-syne mb-5">
                Core Expertise
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {skills.map((s, i) => (
                  <SkillBar key={s.name} {...s} delay={0.05 * i} />
                ))}
              </div>

              {/* Chip tags */}
              <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-white/[0.05]">
                {expertise.map((skill) => (
                  <span key={skill} className="tag-luxury font-jakarta text-[0.68rem]">{skill}</span>
                ))}
              </div>
            </motion.div>

            {/* Stats grid 3×2 */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <a href="#contact" className="btn-gradient font-jakarta text-sm">
                Get In Touch
                <ArrowRight size={14} className="shrink-0" />
              </a>
              <a href="/Suraj_Tharu_CV.pdf" download className="btn-outline-luxury font-jakarta text-sm">
                <Download size={14} className="shrink-0" />
                Download CV
              </a>
              <a
                href="https://www.linkedin.com/in/suraj-tharu/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-luxury font-jakarta text-sm"
              >
                <ExternalLink size={14} className="shrink-0" />
                LinkedIn
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
