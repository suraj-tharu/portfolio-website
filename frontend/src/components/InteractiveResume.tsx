import { motion } from 'framer-motion';
import { FileText, Eye } from 'lucide-react';
import { useState } from 'react';
import ResumeModal from './ResumeModal';

export default function InteractiveResume() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section id="resume" className="bg-bg py-24 relative z-20 border-t border-stroke">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10 flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-20 h-20 bg-surface border border-stroke rounded-2xl flex items-center justify-center text-blue-400 mb-8 shadow-[0_0_30px_rgba(96,165,250,0.15)]"
        >
          <span style={{ transform: "perspective(1000px) rotateX(20deg) rotateY(-20deg)" }}>
            <FileText size={40} />
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl text-text-primary tracking-tight font-display italic text-center mb-6"
        >
          Comprehensive Profile
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted text-center max-w-2xl mb-12 text-lg"
        >
          Get a detailed overview of my academic background, technical skills, teaching experience, and professional references in a neatly formatted document.
        </motion.p>

        <motion.button
          onClick={() => setIsModalOpen(true)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="group relative inline-flex items-center justify-center rounded-full text-base font-medium px-10 py-4 bg-text-primary text-bg hover:bg-bg hover:text-text-primary transition-all hover:scale-105 overflow-hidden shadow-xl shadow-blue-500/10"
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 accent-gradient z-0 transition-opacity" />
          <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 z-0 transition-opacity" />
          <span className="relative z-10 flex items-center gap-3">
            <span style={{ transform: "perspective(1000px) rotateX(20deg) rotateY(-20deg)" }}>
              <Eye size={20} />
            </span>
            View Boarding Pass
          </span>
        </motion.button>

        <ResumeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      </div>
    </section>
  );
}
