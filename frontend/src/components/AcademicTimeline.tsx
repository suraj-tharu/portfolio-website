import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue, useMotionTemplate, type MotionValue
} from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { GraduationCap, Briefcase, MapPin, Calendar } from 'lucide-react';
import { useSoundEffects } from '../hooks/useSoundEffects';
import SectionHeader from './SectionHeader';

type TimelineEvent = {
  id?: number;
  year: string;
  role: string;
  location: string;
  type?: 'education' | 'work';
};

const defaultTimeline: TimelineEvent[] = [
  { year: '2017 - 2021', role: 'B.E. Computer Engineering',   location: 'Mid-West University (Himalaya College of Engineering)', type: 'education' },
  { year: '2021',        role: 'Nepal Telecom Internship',     location: 'Kathmandu', type: 'work' },
  { year: '2021 - 2023', role: 'Instructor',                   location: 'Buddhi Bikash Secondary School', type: 'work' },
  { year: '2024 - 2026', role: 'Senior Instructor',            location: 'Trishahid Namuna Ma. Vi.', type: 'work' },
  { year: '2024 - Present', role: 'MSc Information System Engineering', location: 'Purbanchal University', type: 'education' },
];

/* ── 3D Tilt Card ────────────────────────────────────────── */
function TimelineCard({
  item, index, mouseX, mouseY,
}: {
  item: TimelineEvent;
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const { playHover } = useSoundEffects();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  /* Local tilt springs */
  const tiltX = useSpring(0, { stiffness: 300, damping: 30 });
  const tiltY = useSpring(0, { stiffness: 300, damping: 30 });

  const updateRect = useCallback(() => {
    if (cardRef.current) setRect(cardRef.current.getBoundingClientRect());
  }, []);

  useEffect(() => {
    updateRect();
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, [updateRect]);

  /* Track mouse for spotlight */
  const x = useTransform(mouseX, (val: number) => rect ? val - rect.left : 0);
  const y = useTransform(mouseY, (val: number) => rect ? val - rect.top : 0);
  const maskImage = useMotionTemplate`radial-gradient(450px circle at ${x}px ${y}px, black, transparent)`;

  /* 3D tilt on hover */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    tiltX.set(-dy * 6);
    tiltY.set(dx * 6);
  }, [tiltX, tiltY]);

  const handleMouseLeave = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
    setIsHovered(false);
  }, [tiltX, tiltY]);

  const isEducation = item.type === 'education';
  const accentColor = isEducation
    ? 'rgba(139,92,246,0.7)'
    : 'rgba(52,211,153,0.7)';
  const glowColor = isEducation
    ? 'rgba(139,92,246,0.12)'
    : 'rgba(52,211,153,0.08)';

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.85, delay: index * 0.12, type: 'spring', bounce: 0.35 }}
      onMouseEnter={() => { setIsHovered(true); playHover(); updateRect(); }}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        width: '100%',
        perspective: 1000,
        rotateX: tiltX,
        rotateY: tiltY,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Background layer */}
      <div
        className="absolute inset-0 rounded-3xl transition-all duration-500"
        style={{
          background: isHovered
            ? `linear-gradient(135deg, var(--surface-2), var(--surface))`
            : 'var(--surface)',
          border: `1px solid ${isHovered ? accentColor : 'var(--stroke)'}`,
          boxShadow: isHovered
            ? `0 20px 48px rgba(0,0,0,0.25), 0 0 40px ${glowColor}`
            : '0 4px 20px rgba(0,0,0,0.12)',
          borderRadius: 24,
        }}
      />

      {/* Spotlight glow layer */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none z-0"
        style={{
          WebkitMaskImage: maskImage,
          maskImage,
          opacity: isHovered ? 0.18 : 0,
          background: `radial-gradient(circle at center, ${accentColor}, transparent 80%)`,
          transition: 'opacity 0.35s ease',
          borderRadius: 24,
        }}
      />

      {/* Pulsing left border accent */}
      <motion.div
        animate={isHovered ? { opacity: [0.6, 1, 0.6], scaleY: [0.8, 1, 0.8] } : { opacity: 0.3 }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        style={{
          position: 'absolute', left: 0, top: '15%', bottom: '15%',
          width: 3, borderRadius: 999,
          background: isEducation
            ? 'linear-gradient(to bottom,#7c3aed,#a78bfa)'
            : 'linear-gradient(to bottom,#34d399,#06b6d4)',
          boxShadow: `0 0 12px ${accentColor}`,
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col sm:flex-row gap-6 md:gap-8 items-start sm:items-center" style={{ borderRadius: 24 }}>

        {/* Left: Icon + Year */}
        <div className="flex flex-col items-start gap-4 min-w-[140px]">
          <motion.div
            whileHover={{ scale: 1.12, rotate: 5 }}
            style={{
              padding: 16, borderRadius: 18,
              background: isEducation
                ? 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(167,139,250,0.1))'
                : 'linear-gradient(135deg,rgba(52,211,153,0.2),rgba(6,182,212,0.1))',
              border: `1px solid ${isEducation ? 'rgba(139,92,246,0.3)' : 'rgba(52,211,153,0.3)'}`,
              color: isEducation ? '#a78bfa' : '#34d399',
              boxShadow: `0 0 20px ${isEducation ? 'rgba(139,92,246,0.2)' : 'rgba(52,211,153,0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {isEducation ? <GraduationCap size={28} /> : <Briefcase size={28} />}
          </motion.div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: '0.68rem', fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: isEducation ? '#a78bfa' : '#34d399',
            background: isEducation ? 'rgba(139,92,246,0.1)' : 'rgba(52,211,153,0.1)',
            padding: '6px 12px', borderRadius: 999,
            border: `1px solid ${isEducation ? 'rgba(139,92,246,0.2)' : 'rgba(52,211,153,0.2)'}`,
          }}>
            <Calendar size={11} />
            {item.year}
          </div>
        </div>

        {/* Right: Role + Location */}
        <div className="flex-1 flex flex-col gap-2">
          <h3 style={{
            fontSize: 'clamp(1.2rem,2.5vw,1.65rem)',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 900,
            color: 'var(--text)',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}>
            {item.role}
          </h3>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: '0.875rem', color: 'var(--muted)',
          }}>
            <MapPin size={14} style={{ color: 'var(--brand)', flexShrink: 0 }} />
            <p>{item.location}</p>
          </div>
          {/* Type badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            marginTop: 8, padding: '3px 10px', borderRadius: 999,
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: isEducation ? 'rgba(139,92,246,0.08)' : 'rgba(52,211,153,0.08)',
            color: isEducation ? 'rgba(139,92,246,0.7)' : 'rgba(52,211,153,0.7)',
            width: 'fit-content',
          }}>
            {isEducation ? '📚 Education' : '💼 Work'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── SVG Animated Path Draw ──────────────────────────────── */
function AnimatedTimelinePath({ count }: { count: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });
  const pathLength = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  const nodePositions = Array.from({ length: count }, (_, i) => ({
    y: (i / (count - 1)) * 100,
  }));

  return (
    <div ref={containerRef} className="relative hidden md:flex flex-col items-center w-6 mt-8 self-stretch">
      <svg
        ref={ref}
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{ width: 3, height: '100%', overflow: 'visible' }}
        preserveAspectRatio="none"
      >
        {/* Background track */}
        <line
          x1="1.5" y1="0%" x2="1.5" y2="100%"
          stroke="rgba(167,139,250,0.12)"
          strokeWidth="2"
        />
        {/* Animated fill */}
        <motion.line
          x1="1.5" y1="0%" x2="1.5" y2="100%"
          stroke="url(#timeline-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            pathLength,
            filter: 'drop-shadow(0 0 4px rgba(139,92,246,0.8))',
          }}
        />
        <defs>
          <linearGradient id="timeline-gradient" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#7c3aed" />
            <stop offset="50%"  stopColor="#db2777" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>

      {/* Node dots */}
      <div className="absolute top-0 bottom-0 flex flex-col justify-between w-full" style={{ zIndex: 2 }}>
        {nodePositions.map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5, type: 'spring', bounce: 0.5 }}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Pulse ring */}
            <motion.div
              animate={{ scale: [1, 2], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: 16, height: 16, borderRadius: '50%',
                border: '1px solid rgba(139,92,246,0.5)',
              }}
            />
            {/* Core dot */}
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: 'linear-gradient(135deg,#7c3aed,#db2777)',
              border: '2px solid var(--bg)',
              boxShadow: '0 0 10px rgba(124,58,237,0.6)',
              zIndex: 1,
            }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function AcademicTimeline() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => {
        if (data.timeline?.length > 0) {
          setTimeline(data.timeline.map((item: TimelineEvent) => ({
            ...item,
            type: item.type || (
              item.role.toLowerCase().includes('b.e.') || item.role.toLowerCase().includes('msc')
                ? 'education' : 'work'
            ),
          })));
        } else {
          setTimeline(defaultTimeline);
        }
      })
      .catch(() => setTimeline(defaultTimeline));
  }, []);

  return (
    <section
      id="timeline"
      className="py-24 md:py-36 relative z-20 bg-[var(--bg)] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{
          position: 'absolute', top: '10%', right: '-10%',
          width: '40vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(124,58,237,0.06),transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-10%',
          width: '35vw', height: '35vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(52,211,153,0.05),transparent 70%)',
          filter: 'blur(50px)',
        }} />
      </div>

      <div className="max-w-[1000px] mx-auto px-6 md:px-10 relative z-10">
        <SectionHeader
          eyebrow="Professional Journey"
          title="Experience & Education"
          highlightWord="Education"
          subtitle="A path of continuous growth through engineering, teaching, and research."
        />

        <div className="relative flex gap-8 md:gap-16">
          {/* Animated SVG timeline track */}
          {timeline.length > 0 && <AnimatedTimelinePath count={timeline.length} />}

          {/* Cards */}
          <div className="flex flex-col gap-10 md:gap-14 w-full pb-10">
            {timeline.map((item, i) => (
              <TimelineCard
                key={i}
                item={item}
                index={i}
                mouseX={mouseX}
                mouseY={mouseY}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
