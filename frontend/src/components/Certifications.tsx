import { motion } from 'framer-motion';
import { GlowCard } from './premium/GlowCard';

const certifications = [
  { title: "Advanced GIS Analysis", issuer: "Esri Training", date: "2023", icon: "🗺️", color: "from-blue-500/20 to-cyan-500/10" },
  { title: "Machine Learning with Python", issuer: "Coursera", date: "2024", icon: "🤖", color: "from-violet-500/20 to-purple-500/10" },
  { title: "Professional ICT Certification", issuer: "Nepal Telecom", date: "2025", icon: "📡", color: "from-green-500/20 to-emerald-500/10" },
  { title: "Remote Sensing Workshop", issuer: "ICIMOD", date: "2026", icon: "🛰️", color: "from-amber-500/20 to-orange-500/10" },
];

export default function Certifications() {
  return (
    <section className="bg-bg py-12 md:py-16 relative z-20 border-t border-stroke">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="text-xs text-muted uppercase tracking-[0.3em] mb-4">Credentials</span>
          <h2 className="text-3xl md:text-5xl text-text-primary tracking-tight font-display italic mb-4">
            Certifications &amp; Training
          </h2>
          <p className="text-muted max-w-md">Continuous learning and professional development.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlowCard
                className="flex items-start gap-4 p-6 h-full bg-gradient-to-br border-stroke rounded-2xl"
                glowColor="rgba(139, 92, 246, 0.12)"
              >
                {/* Icon with gradient background */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center text-2xl shrink-0 border border-white/10`}>
                  {cert.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-text-primary mb-1 leading-snug">{cert.title}</h3>
                  <p className="text-sm text-muted">{cert.issuer}</p>
                  <div className="mt-3 inline-block">
                    <span className="text-xs font-semibold text-brand-light bg-brand-500/10 border border-brand-500/20 rounded-full px-3 py-1">
                      {cert.date}
                    </span>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
