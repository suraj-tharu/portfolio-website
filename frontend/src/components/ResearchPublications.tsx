import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const publications = [
  {
    type: "Research Paper",
    title: "Land Use and Land Cover Analysis of Birendranagar Municipality, Surkhet Using Random Forest Algorithm",
    description: "This research focuses on analyzing spatial and temporal land use/land cover patterns within Birendranagar Municipality using satellite imagery and the Random Forest machine learning algorithm. The study evaluates changes in urban areas, forests, agricultural land, water bodies, and other land cover classes to support sustainable planning and resource management.",
    year: "2024",
  },
  {
    type: "Research Paper",
    title: "Decadal Land Use/Land Cover Dynamics in the Nepal Terai: A Multi-Temporal Sentinel-2 and Random Forest Analysis of Nawalparasi West (2016–2026)",
    description: "This research investigates ten years of land use and land cover changes in Nawalparasi West using multi-temporal Sentinel-2 satellite imagery and Random Forest classification techniques. The study examines urban expansion, agricultural transformation, forest dynamics, and environmental changes to provide insights for sustainable development and land management in the Nepal Terai region.",
    year: "2026",
  }
];

export default function ResearchPublications() {
  return (
    <section id="research" className="bg-bg py-24 relative z-20 border-t border-stroke">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">Academia</span>
          </div>
          <h2 className="text-4xl md:text-6xl text-text-primary tracking-tight font-display italic">
            Research Experience
          </h2>
        </motion.div>

        <div className="flex flex-col gap-8">
          {publications.map((pub, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col md:flex-row md:items-start gap-6 p-6 md:p-8 bg-surface/30 hover:bg-surface border border-stroke rounded-3xl transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-bg border border-stroke rounded-full flex items-center justify-center text-muted group-hover:text-blue-400 transition-colors mt-1">
                <BookOpen size={20} />
              </div>

              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-stroke/50 text-text-primary/80">
                    {pub.type}
                  </span>
                  <span className="text-sm text-muted">{pub.year}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-white transition-colors mb-4 leading-snug">
                  {pub.title}
                </h3>
                <p className="text-[0.95rem] md:text-base text-muted/90 leading-relaxed">
                  {pub.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
