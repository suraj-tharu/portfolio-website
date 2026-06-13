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

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-4xl mx-auto">
          {skills.map((skill, i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: i * 0.05, 
                type: "spring", 
                stiffness: 100 
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/5 rounded-full blur-md transition-all group-hover:bg-blue-500/20" />
              <div className="relative px-6 py-3 md:px-8 md:py-4 bg-surface border border-stroke rounded-full flex items-center justify-center backdrop-blur-sm group-hover:border-blue-500/50 transition-colors">
                <span className="text-sm md:text-base font-medium text-text-primary/80 group-hover:text-white transition-colors">
                  {skill}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
