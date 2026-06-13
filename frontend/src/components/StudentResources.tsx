import { motion } from 'framer-motion';
import { Download, FileText, BookOpen, Layers, Archive, PenTool } from 'lucide-react';

const resources = [
  { title: "Course Notes", count: "12 Files", icon: <FileText size={24} /> },
  { title: "Question Banks", count: "5 Years", icon: <Archive size={24} /> },
  { title: "Syllabus", count: "Updated 2026", icon: <Layers size={24} /> },
  { title: "Lab Manuals", count: "8 Exercises", icon: <PenTool size={24} /> },
  { title: "Reference Materials", count: "20+ Links", icon: <BookOpen size={24} /> },
];

export default function StudentResources() {
  return (
    <section id="resources" className="bg-bg py-24 relative z-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="text-xs text-muted uppercase tracking-[0.3em] mb-4">Downloads</span>
          <h2 className="text-4xl md:text-6xl text-text-primary tracking-tight font-display italic">
            Student Resources
          </h2>
          <p className="mt-4 text-muted max-w-lg">
            Access organized teaching materials, lab manuals, and previous year question banks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {resources.map((res, i) => (
            <a
              key={i}
              href="/learning-hub"
              className="group relative overflow-hidden bg-surface border border-stroke rounded-3xl p-8 hover:border-blue-500/50 transition-colors cursor-pointer block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-bg border border-stroke flex items-center justify-center text-blue-400 mb-6">
                  {res.icon}
                </div>
                
                <h3 className="text-xl font-bold text-text-primary mb-2">{res.title}</h3>
                <p className="text-sm text-muted mb-8">{res.count}</p>
                
                <div className="mt-auto flex items-center gap-2 text-sm font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                  <Download size={16} /> Download
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
