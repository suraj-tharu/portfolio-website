import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import SectionHeader from './SectionHeader';

const skills = [
  { name: 'GIS',            percent: 96, color: '#22D3EE', ring: 1 },
  { name: 'Python',         percent: 92, color: '#FFD43B', ring: 1 },
  { name: 'React',          percent: 95, color: '#61DAFB', ring: 1 },
  { name: 'Research',       percent: 98, color: '#F59E0B', ring: 2 },
  { name: 'Earth Engine',   percent: 90, color: '#34D399', ring: 2 },
  { name: 'Node.js',        percent: 88, color: '#68A063', ring: 2 },
  { name: 'AI & Automation',percent: 85, color: '#EC4899', ring: 3 },
  { name: 'Next.js',        percent: 90, color: '#8B5CF6', ring: 3 },
  { name: 'Flutter',        percent: 85, color: '#54C5F8', ring: 3 },
];

/* Ring config: radius, speed, direction */
const RINGS = [
  { radius: 110, duration: 22, dir: 1  },
  { radius: 180, duration: 34, dir: -1 },
  { radius: 250, duration: 48, dir: 1  },
];

/* ── Animated Counter ──────────────────────────────────────  */
function AnimatedCounter({ from = 0, to, duration = 1.8 }: { from?: number; to: number; duration?: number }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (v) => Math.round(v));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (inView) animate(count, to, { duration, ease: 'easeOut' });
  }, [inView, count, to, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

/* ── Mobile Bar Skill ──────────────────────────────────────── */
function MobileSkillBar({ skill, i }: { skill: typeof skills[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.55, delay: i * 0.07 }}
      className="flex items-center gap-4"
    >
      <div style={{ width: 120, fontSize: '0.82rem', fontWeight: 700, color: skill.color, flexShrink: 0, letterSpacing: '0.02em' }}>
        {skill.name}
      </div>
      <div style={{ flex: 1, height: 6, background: 'var(--surface)', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
        <motion.div
          style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg,${skill.color}60,${skill.color})` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.percent}%` }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 1.2, delay: i * 0.07 + 0.2, ease: 'easeOut' }}
        />
        {/* Shimmer */}
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)',
            width: '40%',
          }}
          animate={{ x: ['-40%', '300%'] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15, ease: 'linear' }}
        />
      </div>
      <div style={{ width: 40, fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'right', flexShrink: 0, fontWeight: 700 }}>
        <AnimatedCounter to={skill.percent} duration={1.4} />%
      </div>
    </motion.div>
  );
}

/* ── Desktop Neon Orbit ────────────────────────────────────── */
function NeonOrbit({
  hoveredSkill, setHoveredSkill,
}: {
  hoveredSkill: string | null;
  setHoveredSkill: (s: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto"
      style={{ width: 560, height: 560, maxWidth: '100%' }}
    >
      {/* SVG orbital tracks + neon glow */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        viewBox="0 0 560 560"
      >
        {RINGS.map((ring, i) => (
          <g key={i}>
            {/* Outer glow */}
            <circle
              cx="280" cy="280"
              r={ring.radius}
              fill="none"
              stroke={`rgba(167,139,250,${0.06 - i * 0.015})`}
              strokeWidth={12 - i * 2}
            />
            {/* Main track */}
            <circle
              cx="280" cy="280"
              r={ring.radius}
              fill="none"
              stroke={`rgba(167,139,250,${0.18 - i * 0.04})`}
              strokeWidth={1}
              strokeDasharray="6 8"
              className="orbit-path"
              style={{ animationDelay: `${i * 0.8}s` }}
            />
          </g>
        ))}
      </svg>

      {/* Center node — pulsing aura */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 10 }}>
        {/* Expanding rings */}
        {[1, 2, 3].map(n => (
          <motion.div
            key={n}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 160, height: 160, borderRadius: '50%',
              border: '1px solid rgba(167,139,250,0.2)',
              transform: 'translate(-50%,-50%)',
            }}
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: n * 0.8, ease: 'easeOut' }}
          />
        ))}

        {/* Center card */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          style={{
            width: 140, height: 140, borderRadius: '50%',
            background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
            border: '1px solid rgba(167,139,250,0.3)',
            position: 'relative',
            cursor: 'default',
          }}
        >
          <AnimatePresence mode="wait">
            {hoveredSkill ? (
              <motion.div
                key="skill"
                initial={{ opacity: 0, scale: 0.7, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0)' }}
                exit={{ opacity: 0, scale: 0.7, filter: 'blur(4px)' }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
              >
                <span style={{
                  fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.65)', fontWeight: 700,
                }}>
                  {hoveredSkill}
                </span>
                <span style={{
                  fontSize: '2.2rem', fontWeight: 900, fontFamily: 'Georgia, serif', fontStyle: 'italic',
                  background: 'linear-gradient(135deg,#a78bfa,#f472b6)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  lineHeight: 1,
                }}>
                  <AnimatedCounter
                    to={skills.find(s => s.name === hoveredSkill)?.percent || 100}
                    duration={0.8}
                  />
                  <span style={{ fontSize: '1rem' }}>%</span>
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="core"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
              >
                <span style={{
                  fontSize: '1.75rem', fontFamily: 'Georgia, serif', fontStyle: 'italic',
                  fontWeight: 900, color: 'rgba(255,255,255,0.95)',
                }}>Core</span>
                <span style={{
                  fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.5)', fontWeight: 700,
                }}>Skills</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Orbiting skill pills — grouped by ring */}
      {skills.map((skill) => {
        const ring = RINGS[(skill.ring - 1) % RINGS.length];
        const skillsInRing = skills.filter(s => s.ring === skill.ring);
        const posInRing = skillsInRing.findIndex(s => s.name === skill.name);
        const angleStep = (Math.PI * 2) / skillsInRing.length;
        const initialAngle = posInRing * angleStep;
        const isHovered = hoveredSkill === skill.name;

        return (
          <motion.div
            key={skill.name}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: ring.radius * 2,
              height: ring.radius * 2,
              marginTop: -ring.radius,
              marginLeft: -ring.radius,
              zIndex: isHovered ? 20 : 5,
            }}
            animate={{ rotate: ring.dir > 0 ? [initialAngle * (180 / Math.PI), initialAngle * (180 / Math.PI) + 360] : [initialAngle * (180 / Math.PI), initialAngle * (180 / Math.PI) - 360] }}
            transition={{ duration: ring.duration, repeat: Infinity, ease: 'linear' }}
          >
            {/* Counter-rotate pill so text stays upright */}
            <motion.div
              style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) translateY(-50%)' }}
              animate={{ rotate: ring.dir > 0 ? [0, -360] : [0, 360] }}
              transition={{ duration: ring.duration, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                whileHover={{ scale: 1.2 }}
                animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 999, whiteSpace: 'nowrap',
                  background: isHovered
                    ? `rgba(${skill.color},0.15)`
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isHovered ? skill.color : 'rgba(255,255,255,0.08)'}`,
                  backdropFilter: 'blur(14px)',
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                  boxShadow: isHovered
                    ? `0 0 20px ${skill.color}55, 0 0 40px ${skill.color}22`
                    : 'none',
                }}
              >
                {/* Color dot */}
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: skill.color,
                  boxShadow: `0 0 6px ${skill.color}`,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '0.72rem', fontWeight: 800,
                  color: isHovered ? skill.color : 'rgba(255,255,255,0.7)',
                  letterSpacing: '0.04em',
                  transition: 'color 0.2s',
                }}>
                  {skill.name}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Main Export ───────────────────────────────────────────── */
export default function SkillsVisualization() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section id="skills" className="bg-bg py-24 md:py-36 relative z-20 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '60vw', height: '60vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(124,58,237,0.06),transparent 65%)',
          filter: 'blur(40px)',
        }} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <SectionHeader
          eyebrow="Expertise"
          title="Skills Arsenal"
          highlightWord="Arsenal"
          subtitle={isMobile ? 'Proficiency across all core technologies' : undefined}
        />

        {isMobile
          ? (
            <div className="flex flex-col gap-5 w-full">
              {skills.map((skill, i) => <MobileSkillBar key={skill.name} skill={skill} i={i} />)}
            </div>
          )
          : (
            <div className="flex items-center justify-center mt-8">
              <NeonOrbit hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} />
            </div>
          )
        }

        {/* Skill legend on desktop */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="flex flex-wrap gap-3 justify-center mt-10"
          >
            {skills.map(skill => (
              <motion.div
                key={skill.name}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                whileHover={{ scale: 1.07, y: -2 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 999,
                  border: `1px solid ${hoveredSkill === skill.name ? skill.color : 'rgba(255,255,255,0.06)'}`,
                  background: hoveredSkill === skill.name ? `${skill.color}15` : 'rgba(255,255,255,0.03)',
                  cursor: 'default',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: skill.color, boxShadow: `0 0 5px ${skill.color}` }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: hoveredSkill === skill.name ? skill.color : 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
                  {skill.name}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                  {skill.percent}%
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
