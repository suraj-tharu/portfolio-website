import { useRef, useCallback, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { Globe2, Rocket, Users2, Trophy, Star, Sparkles, type LucideIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

/* ═══════════════════════════════════════════════════════
   ANIMATED ODOMETER
═══════════════════════════════════════════════════════ */
function OdometerCounter({ to, prefix = '', suffix = '', duration = 2.2, delay = 0, color = '#a78bfa' }: {
  to: number; prefix?: string; suffix?: string; duration?: number; delay?: number; color?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => {
    const n = Math.round(v);
    return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'K' : String(n);
  });
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const fireConfetti = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({ particleCount: 18, spread: 50, startVelocity: 20, gravity: 1.2,
      origin: { x, y }, colors: [color, '#ffffff', color + 'aa'], scalar: 0.8, ticks: 80 });
  }, [color]);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: 'easeOut', delay, onComplete: fireConfetti });
      return controls.stop;
    }
  }, [inView, count, to, duration, delay, fireConfetti]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}<motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   STAT DATA
═══════════════════════════════════════════════════════ */
const STATS: {
  icon: LucideIcon; value: number; suffix: string; prefix?: string;
  label: string; desc: string; color: string;
}[] = [
  { icon: Globe2,  value: 8,    suffix: '+',  label: 'Years of Experience', desc: 'In GIS, research & education', color: '#a78bfa' },
  { icon: Rocket,  value: 40,   suffix: '+',  label: 'Projects Delivered',  desc: 'Across GIS, web & mobile',    color: '#38bdf8' },
  { icon: Users2,  value: 500,  suffix: '+',  label: 'Students Taught',     desc: 'Technical education',         color: '#34d399' },
  { icon: Trophy,  value: 5,    suffix: '+',  label: 'Publications',        desc: 'Peer-reviewed research',      color: '#f472b6' },
  { icon: Star,    value: 12,   suffix: '+',  label: 'Certifications',      desc: 'Professional & technical',    color: '#fbbf24' },
  { icon: Sparkles,value: 2847, suffix: '',   label: 'Cups of Tea',         desc: 'Fueling innovation',          color: '#fb923c' },
];

/* ═══════════════════════════════════════════════════════
   SINGLE STAT CELL
═══════════════════════════════════════════════════════ */
function StatCell({ stat, index }: { stat: typeof STATS[number]; index: number }) {
  const Icon = stat.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = `${stat.color}0a`;
        (e.currentTarget as HTMLElement).style.borderColor = `${stat.color}30`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px rgba(0,0,0,0.3), 0 0 30px ${stat.color}12`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
      style={{
        padding: 'clamp(20px,3vw,32px) clamp(16px,2.5vw,28px)',
        borderRadius: 20,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'default', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Accent glow corner */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80, borderRadius: '0 20px 0 100%',
        background: `${stat.color}08`, pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${stat.color}15`, border: `1px solid ${stat.color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 20px ${stat.color}15`,
      }}>
        <Icon size={20} style={{ color: stat.color }} />
      </div>

      {/* Number */}
      <div style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 900,
        fontSize: 'clamp(2rem,4vw,3.2rem)',
        lineHeight: 0.95, letterSpacing: '-0.03em',
        background: `linear-gradient(135deg, ${stat.color} 0%, rgba(255,255,255,0.9) 60%)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        <OdometerCounter
          to={stat.value}
          suffix={stat.suffix}
          delay={index * 0.1 + 0.3}
          color={stat.color}
        />
      </div>

      {/* Label */}
      <div>
        <p style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(0.82rem,1.2vw,1rem)',
          color: 'rgba(255,255,255,0.82)',
          letterSpacing: '-0.01em', lineHeight: 1.2,
        }}>
          {stat.label}
        </p>
        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)',
          marginTop: 4, lineHeight: 1.5,
        }}>
          {stat.desc}
        </p>
      </div>

      {/* Bottom accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: index * 0.08 + 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, borderRadius: 999,
          background: `linear-gradient(90deg, ${stat.color}60, ${stat.color}, ${stat.color}60)`,
          originX: 0.5,
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
export default function Stats() {
  return (
    <section id="stats" style={{ position: 'relative', zIndex: 20, overflow: 'hidden', background: 'var(--bg)' }} className="section-py">

      {/* Aurora ambient */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '70vw', height: '60vw', borderRadius: '50%',
          background: 'radial-gradient(ellipse,rgba(124,58,237,0.05) 0%,transparent 65%)',
          filter: 'blur(80px)',
        }} />
      </div>

      {/* Full-width dark frosted glass strip */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(124,58,237,0.04),rgba(15,8,35,0.8),rgba(56,189,248,0.03))',
        borderTop: '1px solid rgba(167,139,250,0.08)',
        borderBottom: '1px solid rgba(167,139,250,0.08)',
        backdropFilter: 'blur(40px)',
        padding: 'clamp(16px,3vw,32px) 0',
        marginBottom: 'clamp(40px,6vw,72px)',
      }}>
        <div className="section-container">
          {/* ── HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', marginBottom: 'clamp(40px,5vw,64px)' }}
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
              <Sparkles size={10} />
              By The Numbers
            </span>

            <h2 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 900,
              fontSize: 'clamp(2.4rem,5.5vw,5rem)',
              lineHeight: 0.95, letterSpacing: '-0.035em',
              color: 'rgba(255,255,255,0.95)',
              marginBottom: 16,
            }}>
              Impact in{' '}
              <span style={{
                background: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 60%,#38bdf8 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                fontStyle: 'italic',
              }}>
                Numbers
              </span>
            </h2>

            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 'clamp(0.88rem,1.3vw,1.05rem)',
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.8, maxWidth: 480, margin: '0 auto',
            }}>
              A decade of engineering, research, and education — measured in milestones.
            </p>

            {/* Shimmer divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: 1, maxWidth: 280, margin: '24px auto 0',
                background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.5),rgba(244,114,182,0.4),transparent)',
              }}
            />
          </motion.div>

          {/* ── STAT GRID ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
            gap: 'clamp(10px,2vw,20px)',
          }}>
            {STATS.map((stat, i) => (
              <StatCell key={stat.label} stat={stat} index={i} />
            ))}
          </div>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            style={{
              textAlign: 'center', marginTop: 'clamp(24px,4vw,48px)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.68rem', letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)',
            }}
          >
            ✦ &nbsp; Growing Every Day &nbsp; ✦
          </motion.p>
        </div>
      </div>
    </section>
  );
}
