import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import * as d3 from 'd3-force';
import SectionHeader from './SectionHeader';
import type { LucideIcon } from 'lucide-react';
import {
  Globe2, Brain, Code2, Map, Layers, Cpu, Eye, Database,
  LayoutDashboard, Server, GitBranch, Activity, Sparkles,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: 'gis',
    label: 'GIS & Remote Sensing',
    color: '#22D3EE',
    glow: 'rgba(34,211,238,0.18)',
    border: 'rgba(34,211,238,0.25)',
    icon: Globe2,
    skills: [
      { name: 'QGIS', level: 95, icon: Map,      desc: 'Advanced spatial analysis & cartography' },
      { name: 'ArcGIS', level: 88, icon: Layers,  desc: 'Enterprise GIS workflows' },
      { name: 'Google Earth Engine', level: 85, icon: Globe2, desc: 'Cloud-based geospatial processing' },
      { name: 'Remote Sensing', level: 90, icon: Activity, desc: 'Satellite imagery classification' },
      { name: 'ENVI', level: 78, icon: Eye,       desc: 'Hyperspectral & multispectral analysis' },
      { name: 'PostGIS', level: 80, icon: Database, desc: 'Spatial databases & queries' },
    ],
  },
  {
    id: 'ml',
    label: 'AI & Machine Learning',
    color: '#F472B6',
    glow: 'rgba(244,114,182,0.18)',
    border: 'rgba(244,114,182,0.25)',
    icon: Brain,
    skills: [
      { name: 'Python', level: 92, icon: Code2,  desc: 'Primary language for ML pipelines' },
      { name: 'TensorFlow / Keras', level: 85, icon: Brain,  desc: 'Deep learning model training' },
      { name: 'PyTorch', level: 78, icon: Cpu,   desc: 'Research-grade neural networks' },
      { name: 'Computer Vision', level: 84, icon: Eye, desc: 'Image segmentation & object detection' },
      { name: 'scikit-learn', level: 90, icon: Activity, desc: 'Classical ML & pipelines' },
      { name: 'Pandas / NumPy', level: 93, icon: Database, desc: 'Data manipulation & analysis' },
    ],
  },
  {
    id: 'web',
    label: 'Web Engineering',
    color: '#A78BFA',
    glow: 'rgba(167,139,250,0.18)',
    border: 'rgba(167,139,250,0.25)',
    icon: Code2,
    skills: [
      { name: 'React / Next.js', level: 90, icon: LayoutDashboard, desc: 'Modern UI & full-stack apps' },
      { name: 'TypeScript', level: 87, icon: Code2, desc: 'Type-safe applications' },
      { name: 'Node.js', level: 82, icon: Server, desc: 'REST APIs & backend services' },
      { name: 'PostgreSQL', level: 80, icon: Database, desc: 'Relational databases & Prisma ORM' },
      { name: 'Docker / CI-CD', level: 75, icon: GitBranch, desc: 'Containerisation & pipelines' },
      { name: 'Three.js / WebGL', level: 70, icon: Sparkles, desc: '3D visualisations & shaders' },
    ],
  },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

/* ═══════════════════════════════════════════════════════
   D3 CONSTELLATION (preserved from Phase 2)
═══════════════════════════════════════════════════════ */
interface D3Node extends d3.SimulationNodeDatum {
  id: string; group: number; radius: number; color: string;
}
interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node; target: string | D3Node;
}
const constellationData = {
  nodes: [
    { id: 'GIS & RS',         group: 1, radius: 24, color: '#22D3EE' },
    { id: 'QGIS',             group: 1, radius: 14, color: '#22D3EE' },
    { id: 'ArcGIS',           group: 1, radius: 14, color: '#22D3EE' },
    { id: 'Earth Engine',     group: 1, radius: 16, color: '#22D3EE' },
    { id: 'Machine Learning', group: 2, radius: 24, color: '#F472B6' },
    { id: 'Python',           group: 2, radius: 18, color: '#F472B6' },
    { id: 'TensorFlow',       group: 2, radius: 14, color: '#F472B6' },
    { id: 'Computer Vision',  group: 2, radius: 16, color: '#F472B6' },
    { id: 'Web Dev',          group: 3, radius: 24, color: '#A78BFA' },
    { id: 'React',            group: 3, radius: 18, color: '#A78BFA' },
    { id: 'Next.js',          group: 3, radius: 16, color: '#A78BFA' },
    { id: 'Node.js',          group: 3, radius: 16, color: '#A78BFA' },
    { id: 'TypeScript',       group: 3, radius: 14, color: '#A78BFA' },
  ] as D3Node[],
  links: [
    { source: 'GIS & RS', target: 'QGIS' }, { source: 'GIS & RS', target: 'ArcGIS' },
    { source: 'GIS & RS', target: 'Earth Engine' }, { source: 'Machine Learning', target: 'Python' },
    { source: 'Machine Learning', target: 'TensorFlow' }, { source: 'Machine Learning', target: 'Computer Vision' },
    { source: 'Python', target: 'Earth Engine' }, { source: 'Web Dev', target: 'React' },
    { source: 'Web Dev', target: 'Next.js' }, { source: 'Web Dev', target: 'Node.js' },
    { source: 'Web Dev', target: 'TypeScript' }, { source: 'TypeScript', target: 'React' },
  ] as D3Link[],
};

function ConstellationGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<D3Node | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = canvas.parentElement?.clientWidth || 800;
    let height = window.innerWidth < 768 ? 400 : 520;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    const nodes = constellationData.nodes.map(d => ({ ...d }));
    const links = constellationData.links.map(d => ({ ...d }));
    const sim = d3.forceSimulation<D3Node>(nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(links).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<D3Node>().radius((d: D3Node) => d.radius + 10))
      .alphaDecay(0.01)
      .stop(); // Stop internal D3 timer to manually tick in idle time

    const reqIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;
    let idleId: number;

    const tickSim = () => {
      idleId = reqIdle(() => {
        sim.tick();
        if (sim.alpha() > sim.alphaMin()) {
          tickSim();
        }
      });
    };
    tickSim();
    let raf: number; let mx = -1000; let my = -1000;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.5;
      const isLight = document.documentElement.classList.contains('light');
      links.forEach(link => {
        const s = link.source as D3Node; const t = link.target as D3Node;
        const g = ctx.createLinearGradient(s.x || 0, s.y || 0, t.x || 0, t.y || 0);
        const alpha = isLight ? '70' : '40';
        g.addColorStop(0, `${s.color}${alpha}`); g.addColorStop(1, `${t.color}${alpha}`);
        ctx.beginPath(); ctx.strokeStyle = g;
        ctx.moveTo(s.x || 0, s.y || 0); ctx.lineTo(t.x || 0, t.y || 0); ctx.stroke();
      });
      let hover: D3Node | null = null;
      nodes.forEach(node => {
        const x = node.x || 0; const y = node.y || 0;
        const dist = Math.sqrt((mx - x) ** 2 + (my - y) ** 2);
        const isH = dist < node.radius + 5;
        if (isH) hover = node;
        ctx.beginPath(); ctx.arc(x, y, node.radius + (isH ? 8 : 4), 0, 2 * Math.PI);
        ctx.fillStyle = `${node.color}20`; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = isH ? (isLight ? '#000' : '#fff') : (isLight ? '#f9fafb' : '#0a051e'); ctx.strokeStyle = node.color; ctx.lineWidth = 2;
        ctx.fill(); ctx.stroke();
        ctx.font = `600 ${isH ? 12 : 10}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = isH ? (isLight ? '#fff' : '#000') : (isLight ? '#000' : '#fff'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (node.radius > 16 || isH) ctx.fillText(isH ? node.id : node.id.substring(0, 3) + (node.id.length > 3 ? '..' : ''), x, y);
      });
      setHoveredNode(hover);
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      sim.force('mouse', d3.forceRadial(100, mx, my).strength(-0.1)).alpha(0.1);
      cancelIdle(idleId as number); tickSim();
    };
    const onLeave = () => { mx = -1000; my = -1000; sim.force('mouse', null); };
    canvas.addEventListener('mousemove', onMove); canvas.addEventListener('mouseleave', onLeave);
    const onResize = () => {
      width = canvas.parentElement?.clientWidth || 800; height = window.innerWidth < 768 ? 400 : 520;
      canvas.width = width * dpr; canvas.height = height * dpr; ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      sim.force('center', d3.forceCenter(width / 2, height / 2)).alpha(0.3);
      cancelIdle(idleId as number); tickSim();
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf); sim.stop(); cancelIdle(idleId as number);
      canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl">
      <canvas ref={canvasRef} className="block w-full cursor-crosshair" />
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="absolute top-6 left-6 p-4 rounded-xl border border-white/20 backdrop-blur-md bg-white/5 pointer-events-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hoveredNode.color, boxShadow: `0 0 10px ${hoveredNode.color}` }} />
            <span className="font-syne font-bold text-lg text-white tracking-wide">{hoveredNode.id}</span>
          </div>
          <p className="text-white/50 text-xs mt-2 font-jakarta uppercase tracking-widest">
            {hoveredNode.group === 1 ? 'GIS & Remote Sensing' : hoveredNode.group === 2 ? 'AI & Machine Learning' : 'Web Engineering'}
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ANIMATED SKILL BAR
═══════════════════════════════════════════════════════ */
function SkillBar({ name, level, icon: Icon, desc, color, delay }: {
  name: string; level: number; icon: LucideIcon; desc: string; color: string; delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '14px 18px',
        borderRadius: 16,
        background: hovered ? `${color}0a` : 'rgba(var(--text-base-rgb),0.02)',
        border: `1px solid ${hovered ? color + '35' : 'rgba(var(--text-base-rgb),0.06)'}`,
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${color}18`, border: `1px solid ${color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={15} style={{ color }} />
          </div>
          <div>
            <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: 'rgba(var(--text-base-rgb),0.9)', lineHeight: 1.2 }}>{name}</p>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.65rem', color: 'rgba(var(--text-base-rgb),0.35)', marginTop: 2 }}>{desc}</p>
          </div>
        </div>
        {/* Level badge */}
        <div style={{
          fontFamily: 'Syne, monospace', fontSize: '0.82rem', fontWeight: 800,
          color, minWidth: 38, textAlign: 'right',
        }}>
          {level}%
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 4, borderRadius: 999, background: 'rgba(var(--text-base-rgb),0.06)', overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '100%', borderRadius: 999,
            background: `linear-gradient(90deg, ${color}80 0%, ${color} 60%, ${color}cc 100%)`,
            boxShadow: `0 0 12px ${color}60`,
            position: 'relative',
          }}
        >
          {/* Shimmer sweep */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2.2, delay: delay + 1.4, ease: 'linear', repeat: Infinity, repeatDelay: 3 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg,transparent,rgba(var(--text-base-rgb),0.5),transparent)',
              width: '40%',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   CATEGORY TAB
═══════════════════════════════════════════════════════ */
function CategoryTab({ cat, active, onClick }: {
  cat: typeof CATEGORIES[number]; active: boolean; onClick: () => void;
}) {
  const Icon = cat.icon;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 20px', borderRadius: 999,
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.8rem',
        letterSpacing: '0.02em',
        border: `1px solid ${active ? cat.color + '50' : 'rgba(var(--text-base-rgb),0.08)'}`,
        background: active ? `${cat.color}15` : 'rgba(var(--text-base-rgb),0.03)',
        color: active ? cat.color : 'rgba(var(--text-base-rgb),0.4)',
        boxShadow: active ? `0 0 20px ${cat.color}25, inset 0 1px 0 rgba(var(--text-base-rgb),0.06)` : 'none',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        whiteSpace: 'nowrap',
        position: 'relative',
      }}
    >
      <Icon size={14} />
      {cat.label}
      {active && (
        <motion.div
          layoutId="tab-indicator"
          style={{
            position: 'absolute', inset: -1, borderRadius: 999,
            border: `1px solid ${cat.color}40`,
            pointerEvents: 'none',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        />
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   VIEW TOGGLE BUTTON
═══════════════════════════════════════════════════════ */
function ViewToggle({ view, onToggle }: { view: 'bars' | 'constellation'; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '8px 16px', borderRadius: 999,
        fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.75rem',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        border: '1px solid rgba(167,139,250,0.2)',
        background: 'rgba(167,139,250,0.06)',
        color: 'rgba(167,139,250,0.7)',
        cursor: 'pointer',
      }}
    >
      {view === 'bars' ? <><Globe2 size={12} /> Constellation View</> : <><Layers size={12} /> Skill Bars</>}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
export default function SkillsVisualization() {
  const [activeTab, setActiveTab] = useState<CategoryId>('gis');
  const [view, setView] = useState<'bars' | 'constellation'>('bars');
  const toggleView = useCallback(() => setView(v => v === 'bars' ? 'constellation' : 'bars'), []);

  const activeCat = CATEGORIES.find(c => c.id === activeTab)!;

  return (
    <section id="skills" className="section-py relative z-20 bg-[var(--bg)]">

      {/* Ambient aurora glow */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: '50vw', height: '50vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(34,211,238,0.05),transparent 65%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '5%',
          width: '40vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(167,139,250,0.05),transparent 65%)',
          filter: 'blur(70px)',
        }} />
      </div>

      <div className="section-container relative">
        {/* Header row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <SectionHeader
            badge="Expertise"
            title="Skill Constellation"
            description="A deep-dive into my technical proficiencies across GIS & Remote Sensing, AI & Machine Learning, and Web Engineering."
          />

          {/* Controls row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <CategoryTab
                  key={cat.id}
                  cat={cat}
                  active={activeTab === cat.id && view === 'bars'}
                  onClick={() => { setView('bars'); setActiveTab(cat.id as CategoryId); }}
                />
              ))}
            </div>
            <ViewToggle view={view} onToggle={toggleView} />
          </div>
        </div>

        {/* Content */}
        <div style={{ marginTop: 40 }}>
          <AnimatePresence mode="wait">
            {view === 'bars' ? (
              <motion.div
                key={`bars-${activeTab}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Category hero header */}
                <div style={{
                  marginBottom: 28, padding: '20px 24px',
                  borderRadius: 20,
                  background: `linear-gradient(135deg, ${activeCat.glow}, rgba(0,0,0,0) 70%)`,
                  border: `1px solid ${activeCat.border}`,
                  backdropFilter: 'blur(20px)',
                  display: 'flex', alignItems: 'center', gap: 16,
                  boxShadow: `0 0 40px ${activeCat.glow}`,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: `${activeCat.color}20`,
                    border: `1px solid ${activeCat.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <activeCat.icon size={22} style={{ color: activeCat.color }} />
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: 'Syne, sans-serif', fontWeight: 800,
                      fontSize: 'clamp(1.1rem,2vw,1.4rem)', color: activeCat.color, letterSpacing: '-0.01em',
                    }}>{activeCat.label}</h3>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: 'rgba(var(--text-base-rgb),0.4)', marginTop: 3 }}>
                      {activeCat.skills.length} core competencies · Click bars to explore
                    </p>
                  </div>

                  {/* Overall proficiency */}
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{
                      fontFamily: 'Syne, sans-serif', fontWeight: 900,
                      fontSize: 'clamp(1.6rem,3vw,2.4rem)',
                      background: `linear-gradient(135deg, ${activeCat.color}, var(--white))`,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                      {Math.round(activeCat.skills.reduce((a, s) => a + s.level, 0) / activeCat.skills.length)}%
                    </div>
                    <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(var(--text-base-rgb),0.25)', fontFamily: 'Syne, sans-serif' }}>avg proficiency</div>
                  </div>
                </div>

                {/* Skill bars grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                  gap: 12,
                }}>
                  {activeCat.skills.map((skill, i) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      icon={skill.icon}
                      desc={skill.desc}
                      color={activeCat.color}
                      delay={i * 0.07}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="constellation"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <ConstellationGraph />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
