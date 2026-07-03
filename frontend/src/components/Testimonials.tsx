import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from './SectionHeader';

const globalStyles = `
  @keyframes testimonial-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
`;

const testimonials = [
  {
    id: 1,
    quote: "Suraj has a unique ability to bridge complex engineering concepts with real-world applications. His work in GIS and ML is truly outstanding.",
    name: "Dr. Anil Kumar",
    role: "Professor of Computer Engineering",
    company: "Tribhuvan University",
    initial: "A",
    color: '#a78bfa',
  },
  {
    id: 2,
    quote: "Working with Suraj was a game-changer. He completely transformed our data pipeline, bringing efficiency and clarity to our research projects.",
    name: "Priya Sharma",
    role: "Lead Researcher",
    company: "Nepal Tech Innovation",
    initial: "P",
    color: '#f472b6',
  },
  {
    id: 3,
    quote: "An exceptional educator and a brilliant mind. Suraj doesn't just teach — he inspires the next generation of engineers to think bigger and bolder.",
    name: "Ramesh Thapa",
    role: "Former Student",
    company: "Now Software Engineer at Google",
    initial: "R",
    color: '#38bdf8',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Inject styles
  useEffect(() => {
    const id = 'testimonial-styles';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = globalStyles;
      document.head.appendChild(style);
    }
  }, []);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  }, [active]);

  const next = useCallback(() => {
    goTo((active + 1) % testimonials.length);
  }, [active, goTo]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const t = testimonials[active];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 60, filter: 'blur(12px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit:  (d: number) => ({ opacity: 0, x: d * -60, filter: 'blur(12px)' }),
  };

  return (
    <section id="testimonials" className="section-py relative z-20 bg-[var(--bg)] overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '60vw', height: '40vw', borderRadius: '50%',
          background: `radial-gradient(ellipse, ${t.color}12 0%, transparent 65%)`,
          filter: 'blur(80px)',
          transition: 'background 0.8s ease',
        }}
      />

      {/* Ornamental quote marks */}
      <div
        className="absolute top-12 left-[8%] select-none pointer-events-none font-[Cormorant_Garamond,serif]"
        style={{ fontSize: 'clamp(8rem,15vw,14rem)', lineHeight: 1, color: t.color, opacity: 0.06, transition: 'color 0.8s ease' }}
        aria-hidden="true"
      >
        "
      </div>
      <div
        className="absolute bottom-12 right-[8%] select-none pointer-events-none font-[Cormorant_Garamond,serif] rotate-180"
        style={{ fontSize: 'clamp(8rem,15vw,14rem)', lineHeight: 1, color: t.color, opacity: 0.06, transition: 'color 0.8s ease' }}
        aria-hidden="true"
      >
        "
      </div>

      <div className="section-container relative">
        <SectionHeader
          badge="Endorsements"
          title="What People Say"
          highlightWord="People"
          description="Reflections from colleagues, mentors, and students on our shared journey."
        />

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto mt-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center gap-8"
            >
              {/* The quote itself */}
              <blockquote>
                <p
                  style={{
                    fontFamily: 'Cormorant Garamond, Georgia, serif',
                    fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    color: 'rgba(240,242,248,0.92)',
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>

              {/* Divider */}
              <motion.div
                className="w-12 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              />

              {/* Author */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="relative w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-white font-syne font-black text-xl"
                  style={{
                    background: `linear-gradient(135deg, ${t.color}60, ${t.color}20)`,
                    border: `2px solid ${t.color}50`,
                    boxShadow: `0 0 20px ${t.color}30, 0 0 40px ${t.color}15`,
                  }}
                >
                  {/* Rotating ring */}
                  <div
                    className="absolute inset-[-4px] rounded-full border border-dashed"
                    style={{
                      borderColor: `${t.color}30`,
                      animation: 'ring-rotate 8s linear infinite',
                    }}
                  />
                  {t.initial}
                </div>

                <div className="text-left">
                  <p className="font-syne font-bold text-white text-base tracking-tight">{t.name}</p>
                  <p className="font-jakarta text-white/50 text-sm mt-0.5">{t.role}</p>
                  <p
                    className="font-jakarta text-[0.65rem] uppercase tracking-wider mt-1 font-bold"
                    style={{ color: t.color }}
                  >
                    {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {testimonials.map((test, idx) => (
            <button
              key={test.id}
              onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current);
                goTo(idx);
                timerRef.current = setInterval(next, 5000);
              }}
              aria-label={`Go to testimonial ${idx + 1}`}
              className="transition-all duration-400 focus:outline-none rounded-full"
            >
              <motion.div
                animate={{
                  width: idx === active ? 28 : 8,
                  height: 8,
                  opacity: idx === active ? 1 : 0.3,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  borderRadius: 999,
                  background: idx === active
                    ? `linear-gradient(90deg, ${test.color}, #f472b6)`
                    : 'rgba(255,255,255,0.3)',
                  boxShadow: idx === active ? `0 0 12px ${test.color}70` : 'none',
                }}
              />
            </button>
          ))}
        </div>

        {/* Timer bar */}
        <div className="max-w-3xl mx-auto mt-4">
          <div className="h-px bg-white/5 rounded-full overflow-hidden">
            <motion.div
              key={`timer-${active}`}
              className="h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{
                background: `linear-gradient(90deg, ${t.color}, #f472b6)`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
