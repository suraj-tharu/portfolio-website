import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const certifications = [
  { title: "Advanced GIS Analysis", issuer: "Esri Training", date: "2023" },
  { title: "Machine Learning with Python", issuer: "Coursera", date: "2024" },
  { title: "Professional ICT Certification", issuer: "Nepal Telecom", date: "2025" },
  { title: "Remote Sensing Workshop", issuer: "ICIMOD", date: "2026" },
];

export default function Certifications() {
  return (
    <section className="bg-bg py-20 relative z-20 border-t border-stroke">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">

        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-text-primary tracking-tight font-display italic mb-4">
            Certifications & Training
          </h2>
          <p className="text-muted">Continuous learning and professional development.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex items-start gap-4 p-6 bg-surface/50 border border-stroke rounded-2xl hover:bg-surface hover:border-blue-500/30 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-1">{cert.title}</h3>
                <p className="text-sm text-muted">{cert.issuer}</p>
                <p className="text-xs text-blue-400 mt-2 font-medium">{cert.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
