import { useRef, useEffect, useCallback } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { Sparkles, Globe2, Rocket, Users2, Trophy, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

/* ── Animated Odometer Counter ───────────────────────────── */
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

    confetti({
      particleCount: 22,
      spread: 55,
      startVelocity: 22,
      gravity: 1.2,
      origin: { x, y },
      colors: [color, '#ffffff', color + 'aa'],
      scalar: 0.8,
      ticks: 80,
    });
  }, [color]);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { 
        duration, 
        ease: 'easeOut', 
        delay,
        onComplete: fireConfetti,
      });
      return controls.stop;
    }
  }, [inView, count, to, duration, delay, fireConfetti]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}<motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

/* ── Single stat definition ──────────────────────────────── */
const STATS = [
  {
    icon: Globe2,
    value: 8,
    suffix: '+',
    label: 'Years of Experience',
    desc: 'In GIS, research & education',
    color: '#a78bfa',
    bg: 'rgba(124,58,237,0.06)',
    size: 'large',
  },
  {
    icon: Rocket,
    value: 40,
    suffix: '+',
    label: 'Projects Delivered',
    desc: 'Across GIS, web & mobile',
    color: '#38bdf8',
    bg: 'rgba(6,182,212,0.06)',
    size: 'normal',
  },
  {
    icon: Users2,
    value: 500,
    suffix: '+',
    label: 'Students Taught',
    desc: 'Technical & vocational education',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.06)',
    size: 'normal',
  },
  {
    icon: Trophy,
    value: 5,
    suffix: '+',
    label: 'Research Publications',
    desc: 'Peer-reviewed articles',
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.06)',
    size: 'normal',
  },
  {
    icon: Star,
    value: 12,
    suffix: '+',
    label: 'Certifications',
    desc: 'Professional & technical',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.06)',
    size: 'normal',
  },
  {
    icon: Sparkles,
    value: 2847,
    suffix: '',
    label: 'Cups of Tea',
    desc: 'Fueling innovation',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.06)',
    size: 'wide',
  },
] as const;

export default function Stats() {
  return (
    <section id="stats" className="section-py relative z-20 overflow-hidden bg-[var(--bg)]">
      {/* Background ambient */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div style={{
          position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          width:'70vw', height:'60vw', borderRadius:'50%',
          background:'radial-gradient(ellipse,rgba(124,58,237,0.05) 0%,transparent 65%)',
          filter:'blur(60px)',
        }} />
      </div>

      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16 md:mb-20 gap-4"
        >
          <span className="float-badge">
            <Sparkles size={10} />
            By The Numbers
          </span>

          <h2
            className="font-syne font-black text-white/95 tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', lineHeight: 0.95, letterSpacing: '-0.035em' }}
          >
            Impact in{' '}
            <span style={{
              background: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 60%,#38bdf8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontStyle: 'italic',
            }}>Numbers</span>
          </h2>

          <motion.p
            className="font-jakarta text-white/40 max-w-md"
            style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)', lineHeight: 1.75 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            A decade of engineering, research, and education — measured in milestones.
          </motion.p>
        </motion.div>

        {/* Asymmetric Bento Grid */}
        <div
          className="grid gap-4 md:gap-5"
          style={{
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridAutoRows: 'minmax(160px, auto)',
          }}
        >
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;

            // Grid placement for asymmetric bento layout
            const placements = [
              'col-span-12 md:col-span-5 row-span-2', // large — years
              'col-span-6 md:col-span-4',             // normal — projects
              'col-span-6 md:col-span-3',             // normal — students
              'col-span-6 md:col-span-3',             // normal — pubs
              'col-span-6 md:col-span-4',             // normal — certs
              'col-span-12 md:col-span-5',            // wide — tea
            ];

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={`bento-card group flex flex-col justify-between holographic-card ${placements[idx]}`}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--bx', `${((e.clientX - r.left) / r.width) * 100}%`);
                  e.currentTarget.style.setProperty('--by', `${((e.clientY - r.top) / r.height) * 100}%`);
                }}
              >
                {/* Icon */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: stat.bg, border: `1px solid ${stat.color}25` }}
                  >
                    <Icon size={20} style={{ color: stat.color }} />
                  </div>
                </div>

                {/* Value */}
                <div>
                  <div
                    className="stat-number leading-none mb-1"
                    style={{
                      fontSize: stat.size === 'large' ? 'clamp(3.5rem, 6vw, 5.5rem)' : 'clamp(2.5rem, 4vw, 3.8rem)',
                    }}
                  >
                    <OdometerCounter
                      to={stat.value}
                      suffix={stat.suffix}
                      delay={idx * 0.1 + 0.3}
                      color={stat.color}
                    />
                  </div>
                  <p className="font-syne font-bold text-white/80" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)', letterSpacing: '-0.01em' }}>
                    {stat.label}
                  </p>
                  <p className="font-jakarta text-white/30 text-xs mt-0.5 leading-relaxed">{stat.desc}</p>
                </div>

                {/* Accent line */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out rounded-b-[1.5rem]"
                  style={{ background: `linear-gradient(90deg, ${stat.color}80, ${stat.color}, ${stat.color}80)` }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 text-white/20 text-xs font-jakarta tracking-widest uppercase"
        >
          ✦ &nbsp; Growing Every Day &nbsp; ✦
        </motion.p>
      </div>
    </section>
  );
}
