import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   DATA — expanded for a fuller marquee
═══════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    quote: "Suraj has a unique ability to bridge complex engineering concepts with real-world applications. His work in GIS and ML is truly outstanding.",
    name: "Dr. Anil Kumar",
    role: "Professor of Computer Engineering",
    company: "Tribhuvan University",
    initial: "A",
    color: '#a78bfa',
    stars: 5,
  },
  {
    quote: "Working with Suraj was a game-changer. He completely transformed our data pipeline, bringing efficiency and clarity to our research projects.",
    name: "Priya Sharma",
    role: "Lead Researcher",
    company: "Nepal Tech Innovation",
    initial: "P",
    color: '#f472b6',
    stars: 5,
  },
  {
    quote: "An exceptional educator and a brilliant mind. Suraj doesn't just teach — he inspires the next generation of engineers to think bigger and bolder.",
    name: "Ramesh Thapa",
    role: "Former Student",
    company: "Now Software Engineer at Google",
    initial: "R",
    color: '#38bdf8',
    stars: 5,
  },
  {
    quote: "Suraj's spatial analysis skills are world-class. The GIS dashboard he built for our environmental project saved weeks of manual analysis.",
    name: "Dr. Meena Rai",
    role: "Environmental Researcher",
    company: "Nepal Academy of Science",
    initial: "M",
    color: '#34d399',
    stars: 5,
  },
  {
    quote: "The machine learning model Suraj developed achieved 94% accuracy on a notoriously difficult dataset. Truly impressive technical depth.",
    name: "Bikash Gurung",
    role: "Data Science Lead",
    company: "Leapfrog Technology",
    initial: "B",
    color: '#fbbf24',
    stars: 5,
  },
  {
    quote: "Suraj's teaching style makes complex concepts accessible. My students consistently perform better after his workshops.",
    name: "Sujata Pokharel",
    role: "School Principal",
    company: "Trishahid Namuna Ma. Vi.",
    initial: "S",
    color: '#fb923c',
    stars: 5,
  },
];

/* ═══════════════════════════════════════════════════════
   GLOBAL MARQUEE STYLES
═══════════════════════════════════════════════════════ */
const MARQUEE_STYLE = `
  @keyframes marquee-left {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes marquee-right {
    0%   { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .marquee-left  { animation: marquee-left  32s linear infinite; }
  .marquee-right { animation: marquee-right 28s linear infinite; }
  .marquee-track:hover .marquee-left,
  .marquee-track:hover .marquee-right { animation-play-state: paused; }
`;

/* ═══════════════════════════════════════════════════════
   TESTIMONIAL CARD
═══════════════════════════════════════════════════════ */
function TestimonialCard({ t }: { t: typeof TESTIMONIALS[number] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 340,
        flexShrink: 0,
        padding: '24px 26px',
        borderRadius: 20,
        background: hovered
          ? `linear-gradient(135deg, ${t.color}12, rgba(0,0,0,0))` 
          : 'rgba(var(--text-base-rgb),0.025)',
        border: `1px solid ${hovered ? t.color + '35' : 'rgba(var(--text-base-rgb),0.07)'}`,
        boxShadow: hovered ? `0 16px 48px rgba(0,0,0,0.3), 0 0 24px ${t.color}18` : '0 4px 20px rgba(0,0,0,0.12)',
        backdropFilter: 'blur(16px)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative quote mark */}
      <Quote
        className="testimonial-quote-icon"
        size={32}
        style={{
          position: 'absolute', top: 16, right: 18,
          color: t.color, opacity: 0.12,
          transform: 'rotate(180deg)',
        }}
      />

      {/* Stars */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
        {Array.from({ length: t.stars }).map((_, i) => (
          <Star key={i} size={12} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
        ))}
      </div>

      {/* Quote */}
      <p style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: 'clamp(0.95rem,1.4vw,1.1rem)',
        fontStyle: 'italic',
        fontWeight: 500,
        color: 'rgba(var(--text-base-rgb), 0.85)',
        lineHeight: 1.65,
        marginBottom: 20,
      }}>
        "{t.quote}"
      </p>

      {/* Divider */}
      <div style={{
        height: 1, marginBottom: 18,
        backgroundImage:  transparent, ${t.color}40, transparent)`,
      }} />

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Avatar */}
        <div style={{
          width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
          backgroundImage:  ${t.color}50, ${t.color}20)`,
          border: `2px solid ${t.color}40`,
          boxShadow: `0 0 16px ${t.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Syne, sans-serif', fontWeight: 900,
          fontSize: '1rem', color: t.color,
        }}>
          {t.initial}
        </div>
        <div>
          <p style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            fontSize: '0.85rem', color: 'rgba(var(--text-base-rgb),0.88)',
            letterSpacing: '-0.01em',
          }}>
            {t.name}
          </p>
          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.7rem', color: 'rgba(var(--text-base-rgb),0.38)',
            marginTop: 2,
          }}>
            {t.role}
          </p>
          <p style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            fontSize: '0.62rem', color: t.color,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginTop: 2,
          }}>
            {t.company}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MARQUEE ROW
═══════════════════════════════════════════════════════ */
function MarqueeRow({ items, direction }: { items: typeof TESTIMONIALS; direction: 'left' | 'right' }) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];
  return (
    <div className="marquee-track" style={{ overflow: 'hidden', width: '100%' }}>
      <div
        className={direction === 'left' ? 'marquee-left' : 'marquee-right'}
        style={{ display: 'flex', gap: 16, width: 'max-content' }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
export default function Testimonials() {
  const row1 = TESTIMONIALS;
  const row2 = [...TESTIMONIALS].reverse();

  return (
    <section id="testimonials" style={{ position: 'relative', zIndex: 20, background: 'var(--bg)', overflow: 'hidden' }} className="section-py">
      <style>{MARQUEE_STYLE}</style>

      {/* Ambient glow */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '60vw', height: '40vw', borderRadius: '50%',
          backgroundImage: rgba(167,139,250,0.06) 0%,transparent 65%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '-5%',
          width: '30vw', height: '30vw', borderRadius: '50%',
          backgroundImage: rgba(244,114,182,0.05),transparent 65%)',
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
          style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,72px)' }}
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
            <Star size={10} />
            Endorsements
          </span>

          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 900,
            fontSize: 'clamp(2.4rem,5.5vw,5rem)',
            lineHeight: 0.95, letterSpacing: '-0.035em',
            color: 'rgba(var(--text-base-rgb),0.95)',
            marginBottom: 18,
          }}>
            What{' '}
            <span style={{
              backgroundImage: #a78bfa 0%,#f472b6 50%,#38bdf8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontStyle: 'italic',
            }}>
              People
            </span>{' '}
            Say
          </h2>

          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 'clamp(0.88rem,1.3vw,1.05rem)',
            color: 'rgba(var(--text-base-rgb),0.35)',
            lineHeight: 1.8, maxWidth: 480, margin: '0 auto',
          }}>
            Reflections from colleagues, mentors, and students on our shared journey.
          </p>
        </motion.div>
      </div>

      {/* ── MARQUEE ROWS (full-bleed) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}
      >
        {/* Gradient fade masks */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
          backgroundImage:  var(--bg) 0%, transparent 8%, transparent 92%, var(--bg) 100%)',
        }} />

        <MarqueeRow items={row1} direction="left" />
        <MarqueeRow items={row2} direction="right" />
      </motion.div>

      {/* ── BOTTOM TAGLINE ── */}
      <div className="section-container">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center', marginTop: 'clamp(28px,4vw,48px)',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.7rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'rgba(var(--text-base-rgb),0.15)',
          }}
        >
          ✦ &nbsp; Hover to pause &nbsp; ✦
        </motion.p>
      </div>
    </section>
  );
}
