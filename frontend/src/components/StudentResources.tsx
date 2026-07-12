import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, BookOpen, Layers, Archive, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LearningMaterial {
  id: number;
  grade: string;
  category: string;
  subject: string;
}

const resourceDefs = [
  { title: 'Grade 10 (SEE)',   grade: 'Grade 10',         desc: 'Computer Science & Math Notes',  icon: <BookOpen size={24} /> },
  { title: 'Grade 11 (NEB)',   grade: 'Grade 11',         desc: 'Computer Science Notes',         icon: <FileText size={24} /> },
  { title: 'Grade 12 (NEB)',   grade: 'Grade 12',         desc: 'CS & Physics Notes',             icon: <Layers size={24} /> },
  { title: 'Teacher Training', grade: 'Teacher Training', desc: 'Training Materials & Guides',    icon: <PenTool size={24} /> },
  { title: 'All Resources',    grade: 'all',              desc: 'Browse all uploaded materials',  icon: <Archive size={24} /> },
];

export default function StudentResources() {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);

  useEffect(() => {
    fetch('/api/learning-materials')
      .then(r => {
        if (!r.ok) throw new Error('API not available');
        return r.json();
      })
      .then(data => setMaterials(data.materials || []))
      .catch(() => {});
  }, []);

  const countFor = (grade: string) =>
    grade === 'all'
      ? materials.length
      : materials.filter(m => m.grade === grade).length;

  return (
    <section id="resources" className="bg-bg py-12 md:py-16 relative z-20 overflow-hidden">
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
          {resourceDefs.map((res, i) => (
            <Link
              key={i}
              to={`/learning-hub?category=${encodeURIComponent(res.grade)}`}
              className="group relative overflow-hidden bg-surface border border-stroke rounded-3xl p-8 hover:border-blue-500/50 transition-colors cursor-pointer block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-bg border border-stroke flex items-center justify-center text-blue-400 mb-6">
                  {res.icon}
                </div>

                <h3 className="text-xl font-bold text-text-primary mb-2">{res.title}</h3>
                <p className="text-sm text-muted mb-2">{res.desc}</p>

                {materials.length > 0 && (
                  <p className="text-xs font-bold text-blue-400 mb-6">
                    {countFor(res.grade)}{' '}
                    {countFor(res.grade) === 1 ? 'resource' : 'resources'} available
                  </p>
                )}

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
