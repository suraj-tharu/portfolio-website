import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, type MotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { GraduationCap, Briefcase, MapPin, Calendar } from 'lucide-react';
import { useSoundEffects } from '../hooks/useSoundEffects';

type TimelineEvent = {
  id?: number;
  year: string;
  role: string;
  location: string;
  type?: 'education' | 'work';
};

const defaultTimeline: TimelineEvent[] = [
  { year: "2017 - 2021", role: "B.E. Computer Engineering", location: "Mid-West University (Himalaya College of Engineering)", type: 'education' },
  { year: "2021", role: "Nepal Telecom Internship", location: "Kathmandu", type: 'work' },
  { year: "2021 - 2023", role: "Instructor", location: "Buddhi Bikash Secondary School", type: 'work' },
  { year: "2024 - 2026", role: "Senior Instructor", location: "Trishahid Namuna Ma. Vi.", type: 'work' },
  { year: "2024 - Present", role: "MSc Information System Engineering", location: "Purbanchal University", type: 'education' },
];

function TimelineCard({ item, index, mouseX, mouseY }: { item: TimelineEvent, index: number, mouseX: MotionValue<number>, mouseY: MotionValue<number> }) {
  const { playHover } = useSoundEffects();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }
  }, []);

  // Calculate mouse position relative to card
  const x = useTransform(mouseX, (val: number) => rect ? val - rect.left : 0);
  const y = useTransform(mouseY, (val: number) => rect ? val - rect.top : 0);

  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${x}px ${y}px, black, transparent)`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, type: "spring", bounce: 0.4 }}
      onMouseEnter={() => playHover()}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative w-full group rounded-3xl"
    >
      {/* Background layer */}
      <div className="absolute inset-0 bg-[var(--surface)] rounded-3xl border border-[var(--stroke)] shadow-lg transition-colors duration-500 group-hover:border-[var(--brand)]/30 group-hover:bg-[var(--surface-2)]" />
      
      {/* Spotlight Hover Glow Layer */}
      <motion.div
        className="absolute inset-0 z-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, var(--brand) 0%, transparent 80%)",
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
          opacity: 0.15
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col sm:flex-row gap-6 md:gap-8 items-start sm:items-center">
        {/* Left Side: Icon & Year */}
        <div className="flex flex-col items-start gap-4 min-w-[140px]">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-500/20 to-pink-500/20 border border-brand-500/30 text-brand-light shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            {item.type === 'education' ? <GraduationCap size={28} /> : <Briefcase size={28} />}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1.5 rounded-full border border-[var(--accent)]/20">
            <Calendar size={12} />
            {item.year}
          </div>
        </div>

        {/* Right Side: Role & Location */}
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-2xl md:text-3xl font-display italic text-[var(--text)] leading-tight">
            {item.role}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <MapPin size={14} className="text-[var(--brand)]" />
            <p>{item.location}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AcademicTimeline() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position tracking for all cards
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const glowHeight = useSpring(lineHeight, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => {
        if (data.timeline && data.timeline.length > 0) {
          // Infer type if not present
          const enhanced = data.timeline.map((item: TimelineEvent) => ({
            ...item,
            type: item.type || (item.role.toLowerCase().includes('b.e.') || item.role.toLowerCase().includes('msc') ? 'education' : 'work')
          }));
          setTimeline(enhanced);
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
    <section id="timeline" className="py-24 md:py-32 relative z-20 bg-[var(--bg)]" onMouseMove={handleMouseMove}>
      <div className="max-w-[1000px] mx-auto px-6 md:px-10 relative z-10">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-24"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-[var(--brand)]" />
            <span className="text-xs text-[var(--brand)] font-bold uppercase tracking-[0.3em]">Professional Journey</span>
            <div className="w-8 h-px bg-[var(--brand)]" />
          </div>
          <h2 className="text-5xl md:text-7xl text-[var(--text)] tracking-tight font-display italic">
            Experience & Education
          </h2>
        </motion.div>

        <div ref={containerRef} className="relative flex gap-8 md:gap-16">
          {/* Left Vertical Track */}
          <div className="relative hidden md:flex flex-col items-center w-4 mt-8">
            {/* Background Track */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-[var(--stroke)] rounded-full" />
            
            {/* Animated Fill Track */}
            <motion.div
              className="absolute top-0 w-[3px] rounded-full origin-top"
              style={{
                height: glowHeight,
                background: 'linear-gradient(to bottom, var(--brand), var(--accent-2))',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)'
              }}
            />

            {/* Track Nodes */}
            <div className="absolute top-0 bottom-0 flex flex-col justify-between w-full">
              {timeline.map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-[var(--surface)] border-2 border-[var(--stroke)] z-10 transition-colors duration-300" />
              ))}
            </div>
          </div>

          {/* Right Content Cards */}
          <div className="flex flex-col gap-10 md:gap-16 w-full pb-10">
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
