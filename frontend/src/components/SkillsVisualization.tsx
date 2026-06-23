import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const skills = [
  { name: "React", percent: 95, color: "#61DAFB" },
  { name: "Next.js", percent: 90, color: "#8B5CF6" },
  { name: "Flutter", percent: 85, color: "#54C5F8" },
  { name: "Node.js", percent: 88, color: "#68A063" },
  { name: "Python", percent: 92, color: "#FFD43B" },
  { name: "GIS", percent: 96, color: "#22D3EE" },
  { name: "Earth Engine", percent: 90, color: "#34D399" },
  { name: "AI & Automation", percent: 85, color: "#EC4899" },
  { name: "Research", percent: 98, color: "#F59E0B" }
];

const AnimatedCounter = ({ from = 0, to, duration = 2 }: { from?: number, to: number, duration?: number }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      animate(count, to, { duration: duration, ease: "easeOut" });
    }
  }, [inView, count, to, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

// Mobile-friendly progress bar layout
const MobileSkillGrid = () => (
  <div className="grid grid-cols-1 gap-4 w-full">
    {skills.map((skill, i) => (
      <motion.div
        key={skill.name}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.5, delay: i * 0.07 }}
        className="flex items-center gap-4"
      >
        <div className="w-32 text-sm font-medium text-text-primary shrink-0">{skill.name}</div>
        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(to right, ${skill.color}80, ${skill.color})` }}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.percent}%` }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 1, delay: i * 0.07 + 0.2, ease: "easeOut" }}
          />
        </div>
        <div className="w-12 text-sm text-muted text-right shrink-0">
          <AnimatedCounter to={skill.percent} duration={1.5} />%
        </div>
      </motion.div>
    ))}
  </div>
);

// Desktop orbit layout
const DesktopOrbit = ({ hoveredSkill, setHoveredSkill }: { hoveredSkill: string | null, setHoveredSkill: (s: string | null) => void }) => (
  <div className="relative w-full max-w-3xl mx-auto aspect-square max-h-[600px] flex items-center justify-center mt-10">
    {/* Center node */}
    <motion.div 
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      viewport={{ once: true }}
      className="absolute z-10 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-brand to-brand-dark flex flex-col items-center justify-center text-white font-bold luxury-glow shadow-2xl-premium transition-colors duration-500"
    >
      {hoveredSkill ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <span className="text-sm uppercase tracking-widest opacity-80 mb-1">{hoveredSkill}</span>
          <div className="text-4xl md:text-5xl font-display italic flex items-center">
            <AnimatedCounter to={skills.find(s => s.name === hoveredSkill)?.percent || 100} duration={1} />%
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <span className="text-xl md:text-3xl font-display italic">Core</span>
          <span className="text-xs uppercase tracking-widest opacity-80 mt-1">Skills</span>
        </motion.div>
      )}
    </motion.div>
    
    {/* Orbiting nodes */}
    {skills.map((skill, i) => {
      const radius = 120 + (i % 3) * 70;
      const duration = 25 + (i % 3) * 15;
      const initialRotation = (360 / skills.length) * i;
      
      return (
        <motion.div
          key={skill.name}
          className="absolute origin-center flex justify-center"
          style={{ width: radius * 2, height: radius * 2 }}
          initial={{ rotate: initialRotation, opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          animate={{ rotate: initialRotation + 360 }}
          transition={{ 
            rotate: { duration, repeat: Infinity, ease: "linear" },
            opacity: { duration: 1, delay: i * 0.1 },
            scale: { duration: 1, delay: i * 0.1, type: "spring" }
          }}
        >
          <motion.div
            className={`absolute top-0 -translate-y-1/2 premium-card luxury-glow glass rounded-full px-4 py-2 md:px-5 md:py-2.5 whitespace-nowrap text-xs md:text-sm font-medium backdrop-blur-md cursor-pointer transition-colors ${hoveredSkill === skill.name ? 'border-brand-light text-brand-light' : 'text-text-primary hover:border-brand-light'}`}
            style={{ padding: '0.5rem 1rem' }}
            animate={{ rotate: -(initialRotation + 360) }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
            onMouseEnter={() => setHoveredSkill(skill.name)}
            onMouseLeave={() => setHoveredSkill(null)}
            whileHover={{ scale: 1.15, zIndex: 50 }}
          >
            <span className="font-bold">{skill.name}</span>
          </motion.div>
        </motion.div>
      );
    })}
  </div>
);

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
    <section id="skills" className="bg-bg py-20 relative z-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-12"
        >
          <span className="text-xs text-muted uppercase tracking-[0.3em] mb-4">Expertise</span>
          <h2 className="text-4xl md:text-6xl text-text-primary tracking-tight font-display italic">
            Skills Arsenal
          </h2>
          {isMobile && (
            <p className="text-sm text-muted mt-3">Proficiency across all core technologies</p>
          )}
        </motion.div>

        {/* Responsive: grid bars on mobile, orbit on desktop */}
        {isMobile
          ? <MobileSkillGrid />
          : <DesktopOrbit hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} />
        }

      </div>
    </section>
  );
}
