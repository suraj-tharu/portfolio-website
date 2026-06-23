import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const defaultProjects = [
  { title: "LULC Analysis - Nawalparasi", span: "md:col-span-5", aspect: "aspect-[4/3] md:aspect-auto md:h-[400px]", img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80", url: "#" },
  { title: "Remote Sensing Analysis", span: "md:col-span-6", aspect: "aspect-[4/3] md:aspect-auto md:h-[400px]", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80", url: "#" },
  { title: "Machine Learning Classification", span: "md:col-span-6", aspect: "aspect-[4/3] md:aspect-auto md:h-[400px]", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80", url: "#" },
];

type Project = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
};

export default function SelectedWorks() {
  const [dbProjects, setDbProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/portfolio-data')
      .then(res => res.json())
      .then(data => {
        if (data.projects && data.projects.length > 0) {
          setDbProjects(data.projects.slice(0, 4));
        }
      })
      .catch(console.error);
  }, []);

  const displayProjects = dbProjects.length > 0 ? dbProjects.map((p, i) => ({
    title: p.title,
    span: i === 0 || i === 3 ? "md:col-span-7" : "md:col-span-5",
    aspect: "aspect-[4/3] md:aspect-auto md:h-[400px]",
    img: p.imageUrl || defaultProjects[i]?.img || defaultProjects[0].img,
    url: p.liveUrl || p.githubUrl || "#"
  })) : defaultProjects;

  return (
    <section id="work" className="bg-bg py-12 md:py-16 relative z-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Selected Work</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight mb-4">
              Highlighted <span className="font-display italic">works</span>
            </h2>
            <p className="text-sm text-muted max-w-sm">
              A selection of projects I've worked on, from concept to launch.
            </p>
          </div>

          <button className="hidden md:inline-flex group relative items-center justify-center rounded-full px-6 py-3 text-sm bg-surface border border-stroke hover:border-transparent transition-colors overflow-hidden">
            <span className="absolute inset-[-200%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,rgba(137,170,204,1)_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_2s_linear_infinite] transition-opacity duration-300" />
            <div className="absolute inset-[2px] bg-bg rounded-full" />
            <span className="relative z-10 flex items-center gap-2">View all work &rarr;</span>
          </button>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {displayProjects.map((project, i) => (
            <motion.a
              href={project.url}
              target={project.url !== "#" ? "_blank" : undefined}
              rel={project.url !== "#" ? "noopener noreferrer" : undefined}
              key={project.title + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`group relative overflow-hidden premium-card luxury-glow rounded-3xl ${project.span} ${project.aspect} block`}
            >
              {/* Background Image */}
              <img
                src={project.img}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Halftone Overlay */}
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }}
              />

              {/* Hover Dark Overlay & Blur */}
              <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 backdrop-blur-lg transition-all duration-500 flex items-center justify-center">
                {/* Hover Label */}
                <div className="relative inline-flex items-center justify-center p-[2px] rounded-full overflow-hidden transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <span className="absolute inset-[-200%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,rgba(137,170,204,1)_100%)] animate-[spin_2s_linear_infinite]" />
                  <div className="relative bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium shadow-lg-premium">
                    View — <span className="font-display italic text-base">{project.title}</span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
