import { motion } from 'framer-motion';
import { Download, FileText, BookOpen, Layers, Archive, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

const resources = [
  { title: "Class 10 (SEE)", count: "Computer Science & Math", icon: <BookOpen size={24} />, link: "/learning-hub?category=class-10" },
  { title: "Class 11 (NEB)", count: "Computer Science Notes", icon: <FileText size={24} />, link: "/learning-hub?category=class-11" },
  { title: "Class 12 (NEB)", count: "CS & Physics Notes", icon: <Layers size={24} />, link: "/learning-hub?category=class-12" },
  { title: "Diploma Level", count: "Engineering Materials", icon: <Archive size={24} />, link: "/learning-hub?category=diploma" },
  { title: "Bachelor Level", count: "C++, DBMS, GIS", icon: <PenTool size={24} />, link: "/learning-hub?category=bachelor" },
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
            <Link
              key={i}
              to={res.link}
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
                  <Download size={16} /> View Resources
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
