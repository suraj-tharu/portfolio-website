import {
  motion, useScroll, useSpring,
} from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { GraduationCap, Briefcase, MapPin, Calendar, ArrowRight } from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
type TimelineEvent = {
  id?: number;
  year: string;
  role: string;
  location: string;
  type?: 'education' | 'work';
  desc?: string;
};

const defaultTimeline: TimelineEvent[] = [
  {
    year: '2017 – 2021',
    role: 'B.E. Computer Engineering',
    location: 'Mid-West University · Himalaya College of Engineering',
    type: 'education',
    desc: 'Foundation in computer science, algorithms, and systems engineering with a focus on emerging technologies.',
  },
  {
    year: '2021',
    role: 'Nepal Telecom Internship',
    location: 'Kathmandu, Nepal',
    type: 'work',
    desc: 'Hands-on experience with national-scale telecommunications infrastructure and network operations.',
  },
  {
    year: '2021 – 2023',
    role: 'Instructor',
    location: 'Buddhi Bikash Secondary School',
    type: 'work',
    desc: 'Taught computer science and mathematics, mentoring over 200 students in technical fundamentals.',
  },
  {
    year: '2024 – 2026',
    role: 'Senior Instructor',
    location: 'Trishahid Namuna Ma. Vi.',
    type: 'work',
    desc: 'Led advanced computer science curriculum design and delivery for senior secondary students.',
  },
  {
    year: '2024 – Present',
    role: 'MSc Information System Engineering',
    location: 'Purbanchal University',
    type: 'education',
    desc: 'Graduate research in GIS, remote sensing, and machine learning applications for spatial data analysis.',
  },
];

/* ═══════════════════════════════════════════════════════
   GLOWING SPINE
═══════════════════════════════════════════════════════ */
function GlowingSpine({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 20%'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: 0,
      bottom: 0,
      width: 2,
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
    }}>
      {/* Track */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(167,139,250,0.08)',
        borderRadius: 999,
      }} />
      {/* Fill */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          scaleY,
          originY: 0,
          background: 'linear-gradient(to bottom, #7c3aed 0%, #db2777 50%, #34d399 100%)',
          borderRadius: 999,
          boxShadow: '0 0 16px rgba(124,58,237,0.7)',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NODE DOT
═══════════════════════════════════════════════════════ */
function NodeDot({ color, side }: { color: string; side: 'left' | 'right' }) {
  return (
    <div style={{
      position: 'absolute',
      top: 32,
      [side === 'left' ? 'right' : 'left']: -26,
      width: 14,
      height: 14,
      zIndex: 10,
    }}>
      {/* Pulse ring */}
      <motion.div
        animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `1.5px solid ${color}`,
        }}
      />
      {/* Core */}
      <div style={{
        position: 'absolute', inset: 2,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}, ${color}80)`,
        boxShadow: `0 0 12px ${color}`,
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TIMELINE CARD
═══════════════════════════════════════════════════════ */
function TimelineCard({ item, index }: { item: TimelineEvent; index: number }) {
  const isLeft = index % 2 === 0;
  const isEdu = item.type === 'education';
  const color = isEdu ? '#a78bfa' : '#34d399';
  const glow = isEdu ? 'rgba(167,139,250,0.12)' : 'rgba(52,211,153,0.1)';
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 52px 1fr',
      gap: 0,
      alignItems: 'start',
      position: 'relative',
    }}>
      {/* Left slot */}
      <div style={{ paddingRight: 32, display: 'flex', justifyContent: 'flex-end' }}>
        {isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ width: '100%', maxWidth: 460 }}
          >
            <CardInner item={item} color={color} glow={glow} hovered={hovered} isEdu={isEdu} />
            <NodeDot color={color} side="left" />
          </motion.div>
        ) : (
          /* Year stamp on right side of left col */
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(0.75rem,1.2vw,0.9rem)',
              color: 'var(--muted)',
              letterSpacing: '0.08em',
              textAlign: 'right',
              paddingTop: 34,
            }}
          >
            {item.year}
          </motion.div>
        )}
      </div>

      {/* Center spine space */}
      <div style={{ position: 'relative' }} />

      {/* Right slot */}
      <div style={{ paddingLeft: 32 }}>
        {!isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ width: '100%', maxWidth: 460, position: 'relative' }}
          >
            <CardInner item={item} color={color} glow={glow} hovered={hovered} isEdu={isEdu} />
            <NodeDot color={color} side="right" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(0.75rem,1.2vw,0.9rem)',
              color: 'var(--muted)',
              letterSpacing: '0.08em',
              paddingTop: 34,
            }}
          >
            {item.year}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CardInner({ item, color, glow, hovered, isEdu }: {
  item: TimelineEvent; color: string; glow: string; hovered: boolean; isEdu: boolean;
}) {
  return (
    <div style={{
      padding: '22px 24px',
      borderRadius: 20,
      background: hovered
        ? `linear-gradient(135deg, ${glow}, rgba(0,0,0,0) 80%)`
        : 'var(--surface)',
      border: `1px solid ${hovered ? color + '40' : 'var(--stroke)'}`,
      boxShadow: hovered ? `0 16px 48px rgba(0,0,0,0.3), 0 0 30px ${glow}` : '0 4px 20px rgba(0,0,0,0.15)',
      backdropFilter: 'blur(16px)',
      transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent left border */}
      <div style={{
        position: 'absolute', left: 0, top: '10%', bottom: '10%',
        width: 3, borderRadius: 999,
        background: `linear-gradient(to bottom, ${color}, ${color}40)`,
        boxShadow: `0 0 10px ${color}`,
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.3s ease',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 16px ${color}20`,
        }}>
          {isEdu
            ? <GraduationCap size={18} style={{ color }} />
            : <Briefcase size={18} style={{ color }} />
          }
        </div>
        <div style={{ flex: 1 }}>
          {/* Type badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 999, marginBottom: 6,
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
            background: `${color}12`,
            border: `1px solid ${color}25`,
            color: color,
            fontFamily: 'Syne, sans-serif',
          }}>
            {isEdu ? '📚 Education' : '💼 Experience'}
          </div>

          {/* Role */}
          <h3 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(1rem,1.8vw,1.3rem)',
            fontWeight: 700,
            fontStyle: 'italic',
            color: 'var(--text)',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}>
            {item.role}
          </h3>
        </div>
      </div>

      {/* Description */}
      {item.desc && (
        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: 14,
        }}>
          {item.desc}
        </p>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5,
          fontSize: '0.72rem', color: 'var(--muted)',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}>
          <MapPin size={11} style={{ color, flexShrink: 0 }} />
          {item.location}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: '0.68rem', fontWeight: 600,
          color: color, marginLeft: 'auto',
          fontFamily: 'Syne, sans-serif', letterSpacing: '0.06em',
        }}>
          <Calendar size={10} />
          {item.year}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MOBILE TIMELINE (single column)
═══════════════════════════════════════════════════════ */
function MobileTimelineCard({ item, index }: { item: TimelineEvent; index: number }) {
  const isEdu = item.type === 'education';
  const color = isEdu ? '#a78bfa' : '#34d399';
  const glow = isEdu ? 'rgba(167,139,250,0.12)' : 'rgba(52,211,153,0.1)';
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', gap: 16 }}
    >
      {/* Left spine + dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div style={{
          width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${color}, ${color}80)`,
          boxShadow: `0 0 10px ${color}`,
          marginTop: 26,
        }} />
        {index < defaultTimeline.length - 1 && (
          <div style={{
            width: 2, flex: 1, marginTop: 6,
            background: 'linear-gradient(to bottom, rgba(167,139,250,0.3), rgba(167,139,250,0.05))',
          }} />
        )}
      </div>
      {/* Card */}
      <div style={{ flex: 1, paddingBottom: 24 }}>
        <CardInner item={item} color={color} glow={glow} hovered={hovered} isEdu={isEdu} />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
export default function AcademicTimeline() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/timeline')
      .then(r => {
        if (!r.ok) throw new Error('API not available');
        return r.json();
      })
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

  const items = timeline.length > 0 ? timeline : defaultTimeline;

  return (
    <section
      ref={sectionRef}
      id="timeline"
      style={{ position: 'relative', zIndex: 20, background: 'var(--bg)', overflow: 'hidden' }}
      className="section-py"
    >
      {/* Aurora ambient */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '-12%',
          width: '45vw', height: '45vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(124,58,237,0.06),transparent 70%)',
          filter: 'blur(70px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-12%',
          width: '40vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(52,211,153,0.05),transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="section-container relative">
        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: 'clamp(56px,8vw,96px)' }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '6px 18px', borderRadius: 999, marginBottom: 20,
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            background: 'rgba(167,139,250,0.08)',
            border: '1px solid rgba(167,139,250,0.2)',
            color: 'rgba(167,139,250,0.75)',
          }}>
            <Calendar size={10} />
            Professional Journey
          </span>

          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 900,
            fontSize: 'clamp(2.4rem,5.5vw,5rem)',
            lineHeight: 0.95, letterSpacing: '-0.035em',
            color: 'var(--text)',
            marginBottom: 20,
          }}>
            Experience &{' '}
            <span style={{
              background: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 50%,#38bdf8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontStyle: 'italic',
            }}>
              Education
            </span>
          </h2>

          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 'clamp(0.88rem,1.3vw,1.05rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.8, maxWidth: 520, margin: '0 auto',
          }}>
            A continuous path of growth through engineering, teaching, and research —
            each step building on the last.
          </p>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 1, maxWidth: 320, margin: '28px auto 0',
              background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.5),rgba(244,114,182,0.4),transparent)',
            }}
          />
        </motion.div>

        {/* ── DESKTOP ALTERNATING TIMELINE ── */}
        <div className="hidden md:block">
          <div style={{ position: 'relative', paddingTop: 16, paddingBottom: 16 }}>
            <GlowingSpine sectionRef={sectionRef} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px,4vw,48px)' }}>
              {items.map((item, i) => (
                <TimelineCard key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* ── MOBILE SINGLE-COLUMN ── */}
        <div className="md:hidden" style={{ flexDirection: 'column' }}>
          {items.map((item, i) => (
            <MobileTimelineCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* ── BOTTOM CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(40px,6vw,72px)' }}
        >
          <a
            href="#contact"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '13px 28px', borderRadius: 999,
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem',
              letterSpacing: '0.04em',
              background: 'rgba(167,139,250,0.08)',
              border: '1px solid rgba(167,139,250,0.25)',
              color: 'rgba(167,139,250,0.8)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(167,139,250,0.15)';
              (e.currentTarget as HTMLElement).style.color = '#a78bfa';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(167,139,250,0.08)';
              (e.currentTarget as HTMLElement).style.color = 'rgba(167,139,250,0.8)';
            }}
          >
            Open to Opportunities
            <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
