import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const awards = [
  { title: "Best Engineering Project Award", description: "Awarded for the final year B.E. project on automated systems.", year: "2021" },
  { title: "Excellence in Teaching", description: "Recognized as the top instructor at Trishahid Namuna Ma. Vi.", year: "2025" },
  { title: "Research Grant Recipient", description: "Secured funding for MSc thesis on spatial decision support.", year: "2026" },
];

export default function AwardsAchievements() {
  return (
    <section className="bg-bg py-20 relative z-20 overflow-hidden">
      <div className="max-w-[800px] mx-auto px-6 md:px-10">

        <div className="flex items-center gap-4 mb-16 justify-center">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-yellow-500/50" />
          <Star className="text-yellow-500" size={24} />
          <h2 className="text-3xl md:text-5xl text-text-primary tracking-tight font-display italic">
            Awards & Honors
          </h2>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-yellow-500/50" />
        </div>

        <div className="flex flex-col gap-6">
          {awards.map((award, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative p-6 md:p-8 rounded-3xl bg-surface/30 border border-stroke overflow-hidden group hover:border-yellow-500/30 transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-full -z-10 group-hover:bg-yellow-500/10 transition-colors" />

              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2 group-hover:text-yellow-500/90 transition-colors">
                    {award.title}
                  </h3>
                  <p className="text-muted leading-relaxed">{award.description}</p>
                </div>
                <div className="text-lg font-display italic text-yellow-500/70">{award.year}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
