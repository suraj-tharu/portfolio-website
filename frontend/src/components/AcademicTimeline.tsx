import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

type TimelineEvent = {
  id?: number;
  year: string;
  role: string;
  location: string;
};

const defaultTimeline: TimelineEvent[] = [
  { year: "2017 - 2021", role: "B.E. Computer Engineering", location: "Mid-West University (Himalaya College of Engineering)" },
  { year: "2021", role: "Nepal Telecom Internship", location: "Kathmandu" },
  { year: "2021 - 2023", role: "Instructor", location: "Buddhi Bikash Secondary School" },
  { year: "2023 - 2024", role: "Instructor", location: "Additional Technical School" },
  { year: "2024 - 2026", role: "Senior Instructor", location: "Trishahid Namuna Ma. Vi." },
  { year: "2024 - Present", role: "MSc Information System Engineering", location: "Purbanchal University" },
];

export default function AcademicTimeline() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => {
        if (data.timeline && data.timeline.length > 0) {
          setTimeline(data.timeline);
        } else {
          setTimeline(defaultTimeline);
        }
      })
      .catch((error) => {
        console.error('Error fetching timeline:', error);
        setTimeline(defaultTimeline);
      });
  }, []);

  return (
    <section id="timeline" className="py-20 relative z-20 bg-[var(--bg)]">
      <div className="max-w-[800px] mx-auto px-6 md:px-10 relative z-10">

        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs text-[var(--muted)] uppercase tracking-[0.3em] mb-4">Journey</span>
          <h2 className="text-4xl md:text-6xl text-[var(--text)] tracking-tight font-display italic">
            Academic Timeline
          </h2>
        </div>

        <div ref={containerRef} className="relative">
          {/* Background track line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-[var(--stroke)] -translate-x-1/2" />

          {/* Animated fill line */}
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 w-[2px] -translate-x-1/2 origin-top"
            style={{
              height: lineHeight,
              background: 'linear-gradient(to bottom, var(--brand), var(--accent-2))',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.5)'
            }}
          />

          <div className="flex flex-col gap-12 py-10">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative flex items-center justify-start md:justify-between w-full pl-20 md:pl-0 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Static dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[var(--surface)] border-2 border-[var(--stroke)] -translate-x-1/2 z-10" />
                {/* Animated glow dot */}
                <motion.div
                  className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-10"
                  style={{ background: 'var(--brand)' }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  animate={{ boxShadow: ['0 0 8px rgba(139,92,246,0.4)', '0 0 18px rgba(139,92,246,0.7)', '0 0 8px rgba(139,92,246,0.4)'] }}
                />

                {/* Content Box — using CSS variables for full light/dark support */}
                <div className={`w-full md:w-[45%] flex ${i % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                  <div className="bg-[var(--surface)] border-2 border-[var(--stroke)] p-6 md:p-8 rounded-2xl w-full hover:bg-[var(--surface-2)] hover:border-[var(--brand)]/50 transition-all duration-300 shadow-md">
                    <span className="text-[var(--accent)] text-base md:text-lg font-medium tracking-widest uppercase block mb-2">
                      {item.year}
                    </span>
                    <h3 className="text-xl md:text-2xl font-display italic text-[var(--text)] mt-1 mb-2 leading-snug">
                      {item.role}
                    </h3>
                    <p className="text-[var(--muted)] text-sm md:text-base">{item.location}</p>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
