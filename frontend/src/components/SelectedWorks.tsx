import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Link2 } from 'lucide-react';

const defaultProjects = [
  {
    title: 'LULC Analysis — Nawalparasi',
    category: 'GIS Research',
    year: '2024',
    tags: ['GIS', 'Remote Sensing', 'Python'],
    span: 'md:col-span-7',
    img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
    url: '#',
    color: '#a78bfa',
  },
  {
    title: 'Remote Sensing Analysis',
    category: 'Satellite Imagery',
    year: '2024',
    tags: ['Satellite', 'ML', 'NDVI'],
    span: 'md:col-span-5',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    url: '#',
    color: '#38bdf8',
  },
  {
    title: 'Machine Learning Classification',
    category: 'Deep Learning',
    year: '2023',
    tags: ['TensorFlow', 'CNN', 'Accuracy 94%'],
    span: 'md:col-span-5',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    url: '#',
    color: '#f472b6',
  },
  {
    title: 'WebGIS Interactive Dashboard',
    category: 'Full-Stack Dev',
    year: '2023',
    tags: ['React', 'Leaflet', 'Node.js'],
    span: 'md:col-span-7',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    url: '#',
    color: '#34d399',
  },
  {
    title: 'Urban Sprawl Simulation',
    category: 'Urban Analysis',
    year: '2023',
    tags: ['QGIS', 'Python', 'CA Model'],
    span: 'md:col-span-6',
    img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80',
    url: '#',
    color: '#fbbf24',
  },
  {
    title: 'Hydrological Modeling',
    category: 'Environmental GIS',
    year: '2022',
    tags: ['HEC-HMS', 'DEM', 'Watershed'],
    span: 'md:col-span-6',
    img: 'https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&w=1200&q=80',
    url: '#',
    color: '#fb923c',
  },
];

type DisplayProject = typeof defaultProjects[number];

/* ── 3D Tilt Card with Spotlight ─────────────────────────── */
function ProjectCard({ project, index }: { project: DisplayProject; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.1 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-8deg', '8deg']);

  // Spotlight position
  const [spotX, setSpotX] = useState(50);
  const [spotY, setSpotY] = useState(50);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    x.set(nx);
    y.set(ny);
    setSpotX(((e.clientX - r.left) / r.width) * 100);
    setSpotY(((e.clientY - r.top) / r.height) * 100);
  }, [x, y]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setHovered(false);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200, transformStyle: 'preserve-3d' }}
      className={`relative overflow-hidden rounded-3xl ${project.span} cursor-pointer group`}
      data-cursor-text="View"
    >
      {/* Card base */}
      <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-3xl">

        {/* Background image with parallax */}
        <motion.img
          src={project.img}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Gradient overlay — always present */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Spotlight effect */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 200px at ${spotX}% ${spotY}%, rgba(255,255,255,0.08), transparent 70%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Holographic border on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${project.color}25 0%, transparent 60%, ${project.color}15 100%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Content — bottom */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-7">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <motion.span
              animate={{ y: hovered ? 0 : -4, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="float-badge"
              style={{ borderColor: `${project.color}40`, color: project.color, background: `${project.color}15` }}
            >
              {project.category}
            </motion.span>

            <motion.div
              animate={{ scale: hovered ? 1 : 0.8, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
            >
              <ArrowUpRight size={15} className="text-white" />
            </motion.div>
          </div>

          {/* Bottom content */}
          <div>
            {/* Tags */}
            <motion.div
              animate={{ y: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-1.5 mb-3"
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/70 font-jakarta backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* Title */}
            <h3
              className="font-syne font-black text-white leading-tight tracking-tight"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', transform: 'translateZ(20px)' }}
            >
              {project.title}
            </h3>

            {/* Year + link */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-white/35 text-xs font-mono font-bold">{project.year}</span>
              {project.url !== '#' && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors font-jakarta"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={11} />
                  Visit
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SelectedWorks() {
  const [dbProjects, setDbProjects] = useState<{ title: string; description: string; imageUrl: string | null; githubUrl: string | null; liveUrl: string | null; id: number }[]>([]);

  useEffect(() => {
    fetch('/api/portfolio-data')
      .then((r) => r.json())
      .then((data) => { if (data.projects?.length > 0) setDbProjects(data.projects.slice(0, 6)); })
      .catch(() => {/* use defaults */});
  }, []);

  const displayProjects: DisplayProject[] = dbProjects.length > 0
    ? dbProjects.map((p, i) => ({
        ...defaultProjects[i % defaultProjects.length],
        title: p.title,
        img: p.imageUrl || defaultProjects[i % defaultProjects.length].img,
        url: p.liveUrl || p.githubUrl || '#',
      }))
    : defaultProjects;

  return (
    <section id="work" className="section-py relative z-20 bg-[var(--bg)] overflow-hidden">
      {/* Ambient */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '30%', left: '-5%',
          width: '40vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(124,58,237,0.05),transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="section-container relative">
        {/* Editorial Section Number */}
        <div className="absolute top-0 right-0 -translate-y-1/4 select-none pointer-events-none overflow-hidden z-0">
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 0.03, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-syne font-black text-white inline-block"
            style={{ fontSize: 'clamp(8rem, 15vw, 15rem)', lineHeight: 0.8 }}
          >
            01
          </motion.span>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 md:mb-18"
        >
          <div className="flex flex-col gap-4">
            <span className="float-badge self-start">Selected Work</span>
            <h2
              className="font-syne font-black text-white/95 tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', lineHeight: 0.92, letterSpacing: '-0.035em' }}
            >
              Highlighted{' '}
              <span
                className="italic"
                style={{
                  background: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 50%,#38bdf8 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
              >
                Works
              </span>
            </h2>
            <p className="font-jakarta text-white/35 max-w-sm" style={{ fontSize: 'clamp(0.87rem, 1.2vw, 1rem)', lineHeight: 1.75 }}>
              A curated selection of research, engineering, and innovation — from concept to impact.
            </p>
          </div>

          <motion.a
            href="#"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-outline-luxury self-start md:self-end font-jakarta text-sm shrink-0"
          >
            View All Projects
            <ArrowUpRight size={15} />
          </motion.a>
        </motion.div>

        {/* 3D Tilt Card Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5"
          style={{ perspective: '1800px' }}
        >
          {displayProjects.map((project, i) => (
            <ProjectCard key={project.title + i} project={project} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mt-14"
        >
          <a
            href="https://github.com/suraj-tharu"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient font-jakarta text-sm"
          >
            <Link2 size={16} />
            View All on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
