import { motion } from 'framer-motion';

const skills = [
  "React", "Next.js", "Flutter", "Node.js", "Python", 
  "GIS", "Google Earth Engine", "AI & Automation", "Research Methodology"
];

export default function SkillsVisualization() {
  return (
    <section id="skills" className="bg-bg py-20 relative z-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="text-xs text-muted uppercase tracking-[0.3em] mb-4">Expertise</span>
          <h2 className="text-4xl md:text-6xl text-text-primary tracking-tight font-display italic">
            Skills Arsenal
          </h2>
        </motion.div>

        <div className="relative w-full max-w-3xl mx-auto aspect-square max-h-[600px] flex items-center justify-center mt-10">
          {/* Center node */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            viewport={{ once: true }}
            className="absolute z-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-brand to-brand-dark flex flex-col items-center justify-center text-white font-bold luxury-glow shadow-2xl-premium"
          >
            <span className="text-xl md:text-2xl font-display italic">Core</span>
            <span className="text-xs uppercase tracking-widest opacity-80 mt-1">Skills</span>
          </motion.div>
          
          {/* Orbiting nodes */}
          {skills.map((skill, i) => {
            const radius = 100 + (i % 3) * 60; // Concentric circles
            const duration = 25 + (i % 3) * 15; // Different speeds
            const initialRotation = (360 / skills.length) * i; // Distribute evenly
            
            return (
              <motion.div
                key={skill}
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
                  className="absolute top-0 -translate-y-1/2 premium-card luxury-glow glass rounded-full px-4 py-2 md:px-5 md:py-2.5 whitespace-nowrap text-xs md:text-sm font-medium text-text-primary backdrop-blur-md cursor-pointer hover:border-brand-light transition-colors"
                  style={{ padding: '0.5rem 1rem' }}
                  animate={{ rotate: -(initialRotation + 360) }}
                  transition={{ duration, repeat: Infinity, ease: "linear" }}
                  whileHover={{ scale: 1.1, zIndex: 50 }}
                >
                  <span className="gradient-text-premium font-bold">{skill}</span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
