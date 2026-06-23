import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Download, FileText, Archive, PenTool,
  Clock, ArrowRight, Search, Star, ExternalLink, ChevronRight,
  Code2, Database, Globe, Cpu, BarChart2, FlaskConical, Sparkles,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const categories = [
  { id: 'all',         label: 'All',              icon: Sparkles },
  { id: 'notes',       label: 'Course Notes',     icon: FileText },
  { id: 'qbank',       label: 'Question Banks',   icon: Archive },
  { id: 'lab',         label: 'Lab Manuals',      icon: PenTool },
  { id: 'reference',   label: 'References',       icon: BookOpen },
  { id: 'software',    label: 'Software & Tools', icon: Code2 },
];

const resources = [
  {
    id: 1, category: 'notes',
    title: 'Digital Design & Architecture',
    description: 'Complete lecture notes covering combinational circuits, flip-flops, memory, and FPGA basics.',
    icon: Cpu, color: 'from-violet-500 to-purple-600',
    badge: 'Updated 2026', files: 12, downloads: 340, stars: 4.8,
    tags: ['CMOS', 'Logic Gates', 'FPGA'],
  },
  {
    id: 2, category: 'notes',
    title: 'Object-Oriented Programming (C++)',
    description: 'OOP fundamentals: classes, polymorphism, inheritance, templates and STL with practical examples.',
    icon: Code2, color: 'from-blue-500 to-cyan-600',
    badge: 'Popular', files: 9, downloads: 520, stars: 4.9,
    tags: ['C++', 'STL', 'Patterns'],
  },
  {
    id: 3, category: 'notes',
    title: 'Database Management Systems',
    description: 'ER diagrams, normalization, SQL, transactions, NoSQL & query optimization.',
    icon: Database, color: 'from-emerald-500 to-teal-600',
    badge: 'New', files: 8, downloads: 280, stars: 4.7,
    tags: ['SQL', 'NoSQL', 'ER Diagrams'],
  },
  {
    id: 4, category: 'notes',
    title: 'Geographic Information Systems',
    description: 'Spatial data concepts, coordinate systems, map projections and GIS software workflows.',
    icon: Globe, color: 'from-orange-500 to-amber-600',
    badge: 'Updated 2026', files: 15, downloads: 410, stars: 4.9,
    tags: ['QGIS', 'ArcGIS', 'Remote Sensing'],
  },
  {
    id: 5, category: 'qbank',
    title: 'Digital Design Q-Bank (5 Years)',
    description: 'Previous year exam papers with detailed solutions and model answers.',
    icon: Archive, color: 'from-pink-500 to-rose-600',
    badge: '2019–2024', files: 5, downloads: 620, stars: 5.0,
    tags: ['Exam Prep', 'Past Papers'],
  },
  {
    id: 6, category: 'qbank',
    title: 'DBMS Question Bank',
    description: 'Chapter-wise questions with solutions for semester exams and competitive prep.',
    icon: Archive, color: 'from-indigo-500 to-blue-600',
    badge: '5 Years', files: 5, downloads: 450, stars: 4.8,
    tags: ['Exam Prep', 'SQL Practice'],
  },
  {
    id: 7, category: 'lab',
    title: 'C++ Lab Manual (8 Exercises)',
    description: 'Step-by-step lab exercises with code samples, expected output and viva questions.',
    icon: PenTool, color: 'from-cyan-500 to-blue-500',
    badge: '8 Labs', files: 8, downloads: 290, stars: 4.7,
    tags: ['Practicals', 'Code Samples'],
  },
  {
    id: 8, category: 'lab',
    title: 'GIS Practical Manual',
    description: 'Hands-on exercises in QGIS: digitizing, spatial analysis, web mapping.',
    icon: Globe, color: 'from-green-500 to-emerald-600',
    badge: '10 Practicals', files: 10, downloads: 310, stars: 4.9,
    tags: ['QGIS', 'Spatial Analysis'],
  },
  {
    id: 9, category: 'reference',
    title: 'Machine Learning Resources',
    description: 'Curated links to papers, datasets, Jupyter notebooks and free courses for ML/AI.',
    icon: BarChart2, color: 'from-purple-500 to-violet-600',
    badge: '20+ Links', files: 0, downloads: 870, stars: 5.0,
    tags: ['Python', 'Scikit-learn', 'TensorFlow'],
  },
  {
    id: 10, category: 'software',
    title: 'QGIS + Extensions Pack',
    description: 'Installation guides, recommended plugins list and beginner configuration templates.',
    icon: FlaskConical, color: 'from-lime-500 to-green-600',
    badge: 'Free Tool', files: 3, downloads: 180, stars: 4.6,
    tags: ['Open Source', 'GIS'],
  },
];

const journals = [
  {
    title: 'Machine Learning in Land Use Classification',
    date: 'Jun 12, 2026', read: '7 min read', tag: 'Research',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Building Interactive Web GIS with Leaflet.js',
    date: 'May 28, 2026', read: '5 min read', tag: 'Tutorial',
    img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Why Spatial Analysis Matters for Urban Planning',
    date: 'Apr 15, 2026', read: '4 min read', tag: 'Essay',
    img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Teaching Digital Circuits: Lessons from 5 Years',
    date: 'Mar 30, 2026', read: '6 min read', tag: 'Pedagogy',
    img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
  },
];

const stats = [
  { value: '40+', label: 'Resources' },
  { value: '3.5k', label: 'Downloads' },
  { value: '5',   label: 'Subjects' },
  { value: '4.8', label: 'Avg Rating' },
];

/* ═══════════════════════════════════════════════════════════
   RESOURCE CARD
═══════════════════════════════════════════════════════════ */
function ResourceCard({ res, index }: { res: (typeof resources)[0]; index: number }) {
  const Icon = res.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col rounded-2xl overflow-hidden
        border border-slate-200 dark:border-white/8
        bg-white dark:bg-white/[0.03]
        hover:border-violet-300 dark:hover:border-violet-500/40
        hover:shadow-[0_8px_40px_rgba(124,58,237,0.12)] dark:hover:shadow-[0_8px_40px_rgba(124,58,237,0.2)]
        transition-all duration-300"
    >
      {/* Top gradient strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${res.color}`} />

      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Icon + badge row */}
        <div className="flex items-start justify-between gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${res.color} shadow-lg shrink-0`}>
            <Icon size={20} className="text-white" />
          </div>
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full
            bg-violet-50 dark:bg-violet-950/50
            border border-violet-200 dark:border-violet-700/50
            text-violet-700 dark:text-violet-300">
            {res.badge}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-snug group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
            {res.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-white/45 leading-relaxed">
            {res.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {res.tags.map(tag => (
            <span key={tag}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full
                bg-slate-100 dark:bg-white/5
                text-slate-600 dark:text-white/50 border border-slate-200 dark:border-white/8">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/6">
          <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-white/35">
            {res.files > 0 && (
              <div className="flex items-center gap-1">
                <FileText size={11} />
                {res.files} files
              </div>
            )}
            <div className="flex items-center gap-1">
              <Download size={11} />
              {res.downloads}
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={11} fill="currentColor" />
              {res.stars}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 text-xs font-bold
              text-violet-600 dark:text-violet-400
              hover:text-violet-800 dark:hover:text-violet-200
              transition-colors"
          >
            {res.files > 0 ? (
              <><Download size={12} /> Download</>
            ) : (
              <><ExternalLink size={12} /> Explore</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   JOURNAL CARD
═══════════════════════════════════════════════════════════ */
function JournalCard({ entry, index }: { entry: (typeof journals)[0]; index: number }) {
  const tagColor: Record<string, string> = {
    Research: 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700/40',
    Tutorial: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/40',
    Essay: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/40',
    Pedagogy: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/40',
  };

  return (
    <motion.a
      href="#"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group flex gap-4 sm:gap-5 p-4 rounded-2xl
        border border-slate-200 dark:border-white/8
        bg-white dark:bg-white/[0.03]
        hover:border-violet-300 dark:hover:border-violet-500/40
        hover:shadow-[0_4px_24px_rgba(124,58,237,0.08)] dark:hover:shadow-[0_4px_24px_rgba(124,58,237,0.18)]
        transition-all duration-300"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0">
        <img src={entry.img} alt={entry.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        <div>
          <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mb-2 ${tagColor[entry.tag] || tagColor.Tutorial}`}>
            {entry.tag}
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug
            group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors line-clamp-2">
            {entry.title}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-white/35 mt-2">
          <div className="flex items-center gap-1"><Clock size={10} />{entry.read}</div>
          <span>·</span>
          <span>{entry.date}</span>
          <ChevronRight size={13} className="ml-auto text-violet-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function LearningHub() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery]                   = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY   = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOp  = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const filtered = resources.filter(r => {
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    const matchQ   = !query || r.title.toLowerCase().includes(query.toLowerCase())
      || r.description.toLowerCase().includes(query.toLowerCase())
      || r.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
    return matchCat && matchQ;
  });

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-[#09090f] text-slate-900 dark:text-white"
    >
      {/* ── HERO ──────────────────────────────────────── */}
      <div ref={heroRef} className="relative min-h-[65vh] flex items-center overflow-hidden">
        {/* Background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0
            bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(139,92,246,0.10)_0%,transparent_70%)]
            dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(139,92,246,0.22)_0%,transparent_70%)]" />
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] bg-violet-200/40 dark:bg-violet-800/30 animate-blob" />
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full blur-[130px] bg-pink-200/30 dark:bg-pink-800/25 animate-blob" style={{ animationDelay: '2s' }} />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.8) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />
        </motion.div>

        <motion.div style={{ opacity: heroOp }} className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-32 pb-20">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-8
              text-slate-400 dark:text-white/35"
          >
            <a href="/" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Home</a>
            <ChevronRight size={12} />
            <span className="text-violet-600 dark:text-violet-400">Learning Hub</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-6
                  bg-violet-50 dark:bg-violet-950/60
                  border border-violet-200 dark:border-violet-700/50"
              >
                <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
                  Open Educational Resources
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display italic font-black tracking-tight leading-[0.88]
                  text-[clamp(3rem,8vw,6rem)] mb-6"
              >
                <span className="text-slate-900 dark:text-white">Learning</span>
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  Hub
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mb-8"
              >
                Free, curated teaching materials, lab manuals, question banks and research guides
                from 5+ years of engineering education in Nepal.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="grid grid-cols-4 gap-3"
              >
                {stats.map(s => (
                  <div key={s.label}
                    className="flex flex-col items-center gap-0.5 p-3 rounded-xl
                      bg-white/70 dark:bg-white/[0.04]
                      border border-slate-200 dark:border-white/8">
                    <span className="text-xl font-black font-display italic text-violet-700 dark:text-violet-300">
                      {s.value}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 text-center leading-tight">
                      {s.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — featured card preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-200/40 to-pink-200/30 dark:from-violet-900/30 dark:to-pink-900/20 blur-xl" />
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                      <BookOpen size={15} className="text-white" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Latest Resources</span>
                  </div>
                  {resources.slice(0, 3).map((r, i) => {
                    const Ic = r.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/6">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${r.color} shrink-0`}>
                          <Ic size={14} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{r.title}</p>
                          <p className="text-[10px] text-slate-400 dark:text-white/35">{r.downloads} downloads</p>
                        </div>
                        <Download size={13} className="text-violet-500 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom wave fade */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white dark:from-[#09090f] to-transparent z-10" />
      </div>

      {/* ── RESOURCES SECTION ─────────────────────────── */}
      <section className="relative z-20 py-16 md:py-24 px-5 sm:px-8 max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-violet-500" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">Downloads</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display italic font-black tracking-tight
              text-slate-900 dark:text-white leading-tight">
              Study <span style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Materials</span>
            </h2>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none" />
            <input
              type="text"
              placeholder="Search resources…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm
                border border-slate-200 dark:border-white/10
                bg-white dark:bg-white/[0.04]
                text-slate-900 dark:text-white
                placeholder:text-slate-400 dark:placeholder:text-white/30
                focus:outline-none focus:border-violet-400 dark:focus:border-violet-500
                focus:ring-2 focus:ring-violet-400/20 dark:focus:ring-violet-500/20
                transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map(cat => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold
                  border transition-all duration-200
                  ${active
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-[0_4px_16px_rgba(124,58,237,0.35)]'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-600 dark:text-white/60 hover:border-violet-400 dark:hover:border-violet-500/50'
                  }`}
              >
                <Icon size={13} />
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Resource grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + query}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.length > 0
              ? filtered.map((res, i) => <ResourceCard key={res.id} res={res} index={i} />)
              : (
                <div className="col-span-full flex flex-col items-center gap-4 py-24 text-center">
                  <Search size={40} className="text-slate-300 dark:text-white/15" />
                  <p className="text-slate-500 dark:text-white/40 font-medium">No resources found for "{query}"</p>
                  <button onClick={() => { setQuery(''); setActiveCategory('all'); }}
                    className="text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline">
                    Clear filters
                  </button>
                </div>
              )
            }
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── JOURNAL SECTION ───────────────────────────── */}
      <section className="py-16 md:py-24 px-5 sm:px-8 max-w-7xl mx-auto border-t border-slate-100 dark:border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-violet-500" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">Journal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display italic font-black tracking-tight
              text-slate-900 dark:text-white">
              Latest <span style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Thoughts</span>
            </h2>
          </div>
          <motion.a
            href="#"
            whileHover={{ scale: 1.04, x: 4 }}
            className="flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400
              hover:text-violet-800 dark:hover:text-violet-200 transition-colors"
          >
            View all articles <ArrowRight size={15} />
          </motion.a>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {journals.map((entry, i) => <JournalCard key={i} entry={entry} index={i} />)}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <section className="py-16 md:py-20 px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden
            bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600
            p-10 sm:p-14 text-center text-white"
        >
          {/* Noise */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
          {/* Orb */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/60 mb-4">Got Questions?</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display italic font-black tracking-tight leading-[0.9] mb-6">
              Need a specific resource<br className="hidden sm:block" /> or custom material?
            </h2>
            <p className="text-base text-white/70 max-w-xl mx-auto mb-10">
              Reach out directly and I'll be happy to share lecture notes, tailor a guide, or collaborate on educational content.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="mailto:suraj.xaudhary@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-base
                  bg-white text-violet-700 shadow-xl hover:shadow-2xl hover:bg-violet-50 transition-all duration-300"
              >
                Get in Touch <ArrowRight size={16} />
              </motion.a>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-base
                  border-2 border-white/40 text-white hover:border-white hover:bg-white/10 transition-all duration-300"
              >
                Back to Portfolio
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.main>
  );
}
