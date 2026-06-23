import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  BookOpen, Download, FileText, Archive, PenTool, Layers,
  ArrowRight, Search, ExternalLink, ChevronRight,
  Code2, Database, Globe, Cpu, Sparkles, AlertCircle, Loader2,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */
interface LearningMaterial {
  id: number;
  grade: string;
  category: string;
  subject: string;
  description: string | null;
  pdfUrl: string | null;
  createdAt: string;
}

/* ═══════════════════════════════════════════════════════════
   CATEGORIES — map DB grades to UI tabs
═══════════════════════════════════════════════════════════ */
const categories = [
  { id: 'all',              label: 'All Resources',    icon: Sparkles },
  { id: 'Grade 10',         label: 'Grade 10 (SEE)',   icon: BookOpen },
  { id: 'Grade 11',         label: 'Grade 11 (NEB)',   icon: FileText },
  { id: 'Grade 12',         label: 'Grade 12 (NEB)',   icon: Layers },
  { id: 'Teacher Training', label: 'Teacher Training', icon: PenTool },
  { id: 'Project',          label: 'Projects',         icon: Code2 },
  { id: 'Blog',             label: 'Blogs',            icon: Globe },
];

/* Grade → gradient colour */
const gradeColor: Record<string, string> = {
  'Grade 10':         'from-violet-500 to-purple-600',
  'Grade 11':         'from-blue-500 to-cyan-600',
  'Grade 12':         'from-emerald-500 to-teal-600',
  'Teacher Training': 'from-pink-500 to-rose-600',
  'Project':          'from-cyan-500 to-blue-600',
  'Blog':             'from-amber-500 to-orange-600',
};

/* Grade → icon */
const gradeIcon: Record<string, typeof Cpu> = {
  'Grade 10':         Cpu,
  'Grade 11':         Database,
  'Grade 12':         Archive,
  'Teacher Training': BookOpen,
  'Project':          Code2,
  'Blog':             Globe,
};


/* ═══════════════════════════════════════════════════════════
   RESOURCE CARD
═══════════════════════════════════════════════════════════ */
function ResourceCard({ mat, index }: { mat: LearningMaterial; index: number }) {
  const color  = gradeColor[mat.grade]  || 'from-violet-500 to-indigo-600';
  const Icon   = gradeIcon[mat.grade]   || Archive;
  const hasFile = mat.pdfUrl && mat.pdfUrl.trim() !== '' && mat.pdfUrl !== '#';

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
      {/* Colour strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${color}`} />

      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Icon + category badge */}
        <div className="flex items-start justify-between gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg shrink-0`}>
            <Icon size={20} className="text-white" />
          </div>
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full
            bg-violet-50 dark:bg-violet-950/50
            border border-violet-200 dark:border-violet-700/50
            text-violet-700 dark:text-violet-300">
            {mat.category}
          </span>
        </div>

        {/* Title + description */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-snug
            group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
            {mat.subject}
          </h3>
          {mat.description && (
            <p className="text-sm text-slate-500 dark:text-white/45 leading-relaxed line-clamp-3">
              {mat.description}
            </p>
          )}
        </div>

        {/* Grade badge */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full
            bg-slate-100 dark:bg-white/5
            text-slate-600 dark:text-white/50 border border-slate-200 dark:border-white/8">
            {mat.grade}
          </span>
        </div>

        {/* Download / unavailable CTA */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/6">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-white/35">
            <FileText size={11} />
            {hasFile ? (mat.grade === 'Project' || mat.grade === 'Blog' ? 'Link available' : 'File available') : 'No file yet'}
          </div>

          {hasFile ? (
            <motion.a
              href={mat.pdfUrl!}
              target={mat.grade === 'Blog' ? '_self' : '_blank'}
              rel="noopener noreferrer"
              download={mat.grade !== 'Project' && mat.grade !== 'Blog'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-xs font-bold
                text-violet-600 dark:text-violet-400
                hover:text-violet-800 dark:hover:text-violet-200
                transition-colors"
              onClick={e => e.stopPropagation()}
            >
              {mat.grade === 'Project' || mat.grade === 'Blog' ? (
                <><ExternalLink size={12} /> View</>
              ) : (
                <><Download size={12} /> Download</>
              )}
            </motion.a>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-white/25 cursor-not-allowed">
              <ExternalLink size={12} /> Coming soon
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function LearningHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [query, setQuery] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  // === Fetch real data from backend ===
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/learning-materials').then(r => r.ok ? r.json() : { materials: [] }),
      fetch('/api/portfolio-data').then(r => r.ok ? r.json() : { projects: [], blogs: [] })
    ])
      .then(([matsData, portData]) => {
        const rawMaterials = matsData.materials || [];
        const rawProjects = portData.projects || [];
        const rawBlogs = portData.blogs || [];

        // Map Projects into the LearningMaterial shape
        const projectMaterials: LearningMaterial[] = rawProjects.map((p: {
          id: number; title: string; description: string; liveUrl: string; githubUrl: string; createdAt: string;
        }) => ({
          id: p.id + 10000,
          grade: 'Project',
          category: 'Portfolio',
          subject: p.title,
          description: p.description,
          pdfUrl: p.liveUrl || p.githubUrl || '#',
          createdAt: p.createdAt
        }));

        // Map Blogs into the LearningMaterial shape
        const blogMaterials: LearningMaterial[] = rawBlogs.map((b: {
          id: number; title: string; content: string; slug: string; createdAt: string;
        }) => ({
          id: b.id + 20000,
          grade: 'Blog',
          category: 'Article',
          subject: b.title,
          description: b.content ? b.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : '',
          pdfUrl: `/blog/${b.slug}`,
          createdAt: b.createdAt
        }));

        const combined = [...rawMaterials, ...projectMaterials, ...blogMaterials].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setMaterials(combined);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load resources. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setTimeout(() => {
        const el = document.getElementById('resources-grid');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY  = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOp = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const filtered = materials.filter(m => {
    const matchCat = activeCategory === 'all' || m.grade === activeCategory;
    const matchQ   = !query
      || m.subject.toLowerCase().includes(query.toLowerCase())
      || (m.description || '').toLowerCase().includes(query.toLowerCase())
      || m.grade.toLowerCase().includes(query.toLowerCase())
      || m.category.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  const totalFiles = materials.filter(m => m.pdfUrl && m.pdfUrl !== '#').length;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-[#09090f] text-slate-900 dark:text-white"
    >
      {/* ── HERO ────────────────────────────────── */}
      <div ref={heroRef} className="relative min-h-[65vh] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0
            bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(139,92,246,0.10)_0%,transparent_70%)]
            dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(139,92,246,0.22)_0%,transparent_70%)]" />
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] bg-violet-200/40 dark:bg-violet-800/30 animate-blob" />
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full blur-[130px] bg-pink-200/30 dark:bg-pink-800/25 animate-blob" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.8) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />
        </motion.div>

        <motion.div style={{ opacity: heroOp }} className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-8
              text-slate-400 dark:text-white/35"
          >
            <a href="/" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Home</a>
            <ChevronRight size={12} />
            <span className="text-violet-600 dark:text-violet-400">Learning Hub</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-6
                  bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-700/50"
              >
                <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
                  Open Educational Resources
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
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
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
                className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mb-8"
              >
                Free, curated teaching materials, lab manuals, question banks and research guides
                from 5+ years of engineering education in Nepal.
              </motion.p>

              {/* Live stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
                className="grid grid-cols-3 gap-3"
              >
                {[
                  { value: materials.length.toString(), label: 'Resources' },
                  { value: totalFiles.toString(),       label: 'Downloadable' },
                  { value: [...new Set(materials.map(m => m.grade))].length.toString(), label: 'Grade Levels' },
                ].map(s => (
                  <div key={s.label}
                    className="flex flex-col items-center gap-0.5 p-3 rounded-xl
                      bg-white/70 dark:bg-white/[0.04] border border-slate-200 dark:border-white/8">
                    <span className="text-xl font-black font-display italic text-violet-700 dark:text-violet-300">
                      {loading ? '—' : s.value}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 text-center leading-tight">
                      {s.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — preview card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
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
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={24} className="text-violet-500 animate-spin" />
                    </div>
                  ) : materials.slice(0, 3).map((m, i) => {
                    const Ic = gradeIcon[m.grade] || Archive;
                    const col = gradeColor[m.grade] || 'from-violet-500 to-indigo-600';
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/6">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${col} shrink-0`}>
                          <Ic size={14} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{m.subject}</p>
                          <p className="text-[10px] text-slate-400 dark:text-white/35">{m.grade}</p>
                        </div>
                        {m.pdfUrl && m.pdfUrl !== '#' && <Download size={13} className="text-violet-500 shrink-0" />}
                      </div>
                    );
                  })}
                  {!loading && materials.length === 0 && (
                    <p className="text-xs text-center text-slate-400 dark:text-white/30 py-4">No resources uploaded yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white dark:from-[#09090f] to-transparent z-10" />
      </div>

      {/* ── RESOURCES SECTION ─────────────────────── */}
      <section id="resources-grid" className="relative z-20 py-16 md:py-24 px-5 sm:px-8 max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
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
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map(cat => {
            const Icon   = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSearchParams({ category: cat.id })}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold
                  border transition-all duration-200
                  ${active
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-[0_4px_16px_rgba(124,58,237,0.35)]'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-600 dark:text-white/60 hover:border-violet-400 dark:hover:border-violet-500/50'
                  }`}
              >
                <Icon size={13} />
                {cat.label}
                {!loading && cat.id !== 'all' && (
                  <span className={`ml-1 text-[9px] font-black px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400'}`}>
                    {materials.filter(m => m.grade === cat.id).length}
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Resource grid — loading / error / data states */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-32 text-center"
            >
              <Loader2 size={40} className="text-violet-500 animate-spin" />
              <p className="text-slate-500 dark:text-white/40 font-medium">Loading resources…</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-32 text-center"
            >
              <AlertCircle size={40} className="text-rose-500" />
              <p className="text-slate-500 dark:text-white/40 font-medium">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + query}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.length > 0
                ? filtered.map((mat, i) => <ResourceCard key={mat.id} mat={mat} index={i} />)
                : (
                  <div className="col-span-full flex flex-col items-center gap-4 py-24 text-center">
                    <Search size={40} className="text-slate-300 dark:text-white/15" />
                    <p className="text-slate-500 dark:text-white/40 font-medium">
                      {query ? `No resources found for "${query}"` : 'No resources in this category yet.'}
                    </p>
                    <button
                      onClick={() => { setQuery(''); setSearchParams({ category: 'all' }); }}
                      className="text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )
              }
            </motion.div>
          )}
        </AnimatePresence>
      </section>


      {/* ── CTA BANNER ────────────────────────────── */}
      <section className="py-16 md:py-20 px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden
            bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600
            p-10 sm:p-14 text-center text-white"
        >
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
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
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-base
                  bg-white text-violet-700 shadow-xl hover:shadow-2xl hover:bg-violet-50 transition-all duration-300"
              >
                Get in Touch <ArrowRight size={16} />
              </motion.a>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
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
