import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useSpring, useTransform, useMotionValue } from 'framer-motion';
import * as d3 from 'd3-force';
import SectionHeader from './SectionHeader';
import type { LucideIcon } from 'lucide-react';
import {
  Globe2, Brain, Code2, Map, Layers, Cpu, Eye, Database,
  LayoutDashboard, Server, GitBranch, Activity, Sparkles, Zap, Star,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   KEYFRAME STYLES
═══════════════════════════════════════════════════════════════ */
const CSS = `
  @keyframes skills-orb-drift {
    0%,100% { transform: translate(0,0) scale(1); opacity: 0.6; }
    33%      { transform: translate(40px,-30px) scale(1.1); opacity: 0.8; }
    66%      { transform: translate(-25px,20px) scale(0.95); opacity: 0.65; }
  }
  @keyframes skills-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes skills-pulse-ring {
    0%   { transform: scale(0.95); opacity: 0.6; }
    50%  { transform: scale(1.08); opacity: 0.25; }
    100% { transform: scale(0.95); opacity: 0.6; }
  }
  @keyframes skills-float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-8px) rotate(2deg); }
  }
  @keyframes skills-scan {
    0%   { top: 0%; opacity: 0; }
    5%   { opacity: 0.5; }
    95%  { opacity: 0.3; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes skills-dot-pulse {
    0%,100% { opacity: 0.3; transform: scale(0.8); }
    50%      { opacity: 1; transform: scale(1.3); }
  }
  @keyframes skills-border-flow {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .skill-card-tilt {
    transform-style: preserve-3d;
    perspective: 800px;
  }
  .skill-card-tilt:hover .skill-card-inner {
    transform: translateZ(8px);
  }
  .skill-card-inner {
    transition: transform 0.3s ease;
  }
`;

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: 'gis',
    label: 'GIS & Remote Sensing',
    sublabel: 'Geospatial Intelligence',
    color: '#22D3EE',
    colorRgb: '34,211,238',
    glow: 'rgba(34,211,238,0.15)',
    border: 'rgba(34,211,238,0.2)',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 50%, #67e8f9 100%)',
    icon: Globe2,
    emoji: '🌍',
    tagline: 'Transforming raw satellite data into actionable spatial intelligence',
    skills: [
      { name: 'QGIS', level: 95, icon: Map,       desc: 'Advanced spatial analysis & cartography', years: '5+' },
      { name: 'ArcGIS', level: 88, icon: Layers,   desc: 'Enterprise GIS workflows & geodatabases', years: '4+' },
      { name: 'Google Earth Engine', level: 85, icon: Globe2, desc: 'Cloud-based geospatial processing', years: '3+' },
      { name: 'Remote Sensing', level: 90, icon: Activity, desc: 'Satellite imagery classification & analysis', years: '4+' },
      { name: 'ENVI', level: 78, icon: Eye,         desc: 'Hyperspectral & multispectral analysis', years: '3+' },
      { name: 'PostGIS', level: 80, icon: Database, desc: 'Spatial databases & complex queries', years: '3+' },
    ],
  },
  {
    id: 'ml',
    label: 'AI & Machine Learning',
    sublabel: 'Deep Intelligence Systems',
    color: '#F472B6',
    colorRgb: '244,114,182',
    glow: 'rgba(244,114,182,0.15)',
    border: 'rgba(244,114,182,0.2)',
    gradient: 'linear-gradient(135deg, #db2777 0%, #f472b6 50%, #f9a8d4 100%)',
    icon: Brain,
    emoji: '🧠',
    tagline: 'Building intelligent systems that learn, adapt and predict',
    skills: [
      { name: 'Python', level: 92, icon: Code2,    desc: 'Primary language for ML & data pipelines', years: '5+' },
      { name: 'TensorFlow / Keras', level: 85, icon: Brain, desc: 'Deep learning model training & deployment', years: '3+' },
      { name: 'PyTorch', level: 78, icon: Cpu,     desc: 'Research-grade neural network architectures', years: '2+' },
      { name: 'Computer Vision', level: 84, icon: Eye, desc: 'Image segmentation & object detection', years: '3+' },
      { name: 'scikit-learn', level: 90, icon: Activity, desc: 'Classical ML algorithms & pipelines', years: '4+' },
      { name: 'Pandas / NumPy', level: 93, icon: Database, desc: 'Data manipulation & scientific computing', years: '5+' },
    ],
  },
  {
    id: 'web',
    label: 'Web Engineering',
    sublabel: 'Full-Stack Mastery',
    color: '#A78BFA',
    colorRgb: '167,139,250',
    glow: 'rgba(167,139,250,0.15)',
    border: 'rgba(167,139,250,0.2)',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #c4b5fd 100%)',
    icon: Code2,
    emoji: '⚡',
    tagline: 'Crafting performant, beautiful, and scalable digital experiences',
    skills: [
      { name: 'React / Next.js', level: 90, icon: LayoutDashboard, desc: 'Modern UI & full-stack applications', years: '4+' },
      { name: 'TypeScript', level: 87, icon: Code2, desc: 'Type-safe, scalable application architecture', years: '3+' },
      { name: 'Node.js', level: 82, icon: Server,  desc: 'REST APIs, WebSockets & backend services', years: '4+' },
      { name: 'PostgreSQL', level: 80, icon: Database, desc: 'Relational databases & Prisma ORM', years: '3+' },
      { name: 'Docker / CI-CD', level: 75, icon: GitBranch, desc: 'Containerisation & deployment pipelines', years: '2+' },
      { name: 'Three.js / WebGL', level: 70, icon: Sparkles, desc: '3D visualisations, shaders & WebGL', years: '2+' },
    ],
  },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

/* ═══════════════════════════════════════════════════════════════
   D3 CONSTELLATION GRAPH
═══════════════════════════════════════════════════════════════ */
interface D3Node extends d3.SimulationNodeDatum {
  id: string; group: number; radius: number; color: string;
}
interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node; target: string | D3Node;
}
const constellationData = {
  nodes: [
    { id: 'GIS & RS',        group: 1, radius: 28, color: '#22D3EE' },
    { id: 'QGIS',            group: 1, radius: 16, color: '#22D3EE' },
    { id: 'ArcGIS',          group: 1, radius: 16, color: '#22D3EE' },
    { id: 'Earth Engine',    group: 1, radius: 18, color: '#22D3EE' },
    { id: 'Machine Learning',group: 2, radius: 28, color: '#F472B6' },
    { id: 'Python',          group: 2, radius: 20, color: '#F472B6' },
    { id: 'TensorFlow',      group: 2, radius: 16, color: '#F472B6' },
    { id: 'Computer Vision', group: 2, radius: 18, color: '#F472B6' },
    { id: 'Web Dev',         group: 3, radius: 28, color: '#A78BFA' },
    { id: 'React',           group: 3, radius: 20, color: '#A78BFA' },
    { id: 'Next.js',         group: 3, radius: 16, color: '#A78BFA' },
    { id: 'Node.js',         group: 3, radius: 16, color: '#A78BFA' },
    { id: 'TypeScript',      group: 3, radius: 16, color: '#A78BFA' },
  ] as D3Node[],
  links: [
    { source: 'GIS & RS', target: 'QGIS' }, { source: 'GIS & RS', target: 'ArcGIS' },
    { source: 'GIS & RS', target: 'Earth Engine' }, { source: 'Machine Learning', target: 'Python' },
    { source: 'Machine Learning', target: 'TensorFlow' }, { source: 'Machine Learning', target: 'Computer Vision' },
    { source: 'Python', target: 'Earth Engine' }, { source: 'Web Dev', target: 'React' },
    { source: 'Web Dev', target: 'Next.js' }, { source: 'Web Dev', target: 'Node.js' },
    { source: 'Web Dev', target: 'TypeScript' }, { source: 'TypeScript', target: 'React' },
    { source: 'Python', target: 'Web Dev' },
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
    let height = window.innerWidth < 768 ? 380 : 500;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;

    const nodes = constellationData.nodes.map(d => ({ ...d }));
    const links = constellationData.links.map(d => ({ ...d }));
    const sim = d3.forceSimulation<D3Node>(nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<D3Node>().radius((d: D3Node) => d.radius + 14))
      .alphaDecay(0.01).stop();

    const reqIdle = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;
    let idleId: number;
    const tickSim = () => {
      idleId = reqIdle(() => { sim.tick(); if (sim.alpha() > sim.alphaMin()) tickSim(); });
    };
    tickSim();
    let raf: number; let mx = -1000; let my = -1000; let time = 0;

    const draw = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.classList.contains('light');

      // Draw links with animated dashes
      links.forEach(link => {
        const s = link.source as D3Node; const t = link.target as D3Node;
        const g = ctx.createLinearGradient(s.x || 0, s.y || 0, t.x || 0, t.y || 0);
        const alpha = isLight ? '55' : '30';
        g.addColorStop(0, `${s.color}${alpha}`); g.addColorStop(1, `${t.color}${alpha}`);
        ctx.beginPath(); ctx.strokeStyle = g; ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 8]); ctx.lineDashOffset = -time * 20;
        ctx.moveTo(s.x || 0, s.y || 0); ctx.lineTo(t.x || 0, t.y || 0); ctx.stroke();
        ctx.setLineDash([]);
      });

      let hover: D3Node | null = null;
      nodes.forEach(node => {
        const x = node.x || 0; const y = node.y || 0;
        const dist = Math.sqrt((mx - x) ** 2 + (my - y) ** 2);
        const isH = dist < node.radius + 8;
        if (isH) hover = node;

        // Outer pulse ring
        ctx.beginPath(); ctx.arc(x, y, node.radius + (isH ? 18 : 10), 0, 2 * Math.PI);
        const alpha = isH ? 0.25 + 0.15 * Math.sin(time * 3) : 0.08 + 0.05 * Math.sin(time * 2 + node.radius);
        ctx.fillStyle = `${node.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`; ctx.fill();

        // Main circle
        ctx.beginPath(); ctx.arc(x, y, node.radius + (isH ? 4 : 0), 0, 2 * Math.PI);
        const gradNode = ctx.createRadialGradient(x - node.radius * 0.3, y - node.radius * 0.3, 0, x, y, node.radius + 2);
        gradNode.addColorStop(0, isLight ? '#e0f2fe' : '#1e1040');
        gradNode.addColorStop(1, isLight ? '#bae6fd' : '#0d0824');
        ctx.fillStyle = gradNode; ctx.strokeStyle = isH ? node.color : `${node.color}90`; ctx.lineWidth = isH ? 2 : 1.5;
        ctx.fill(); ctx.stroke();

        // Glow stroke overlay
        if (isH) {
          ctx.beginPath(); ctx.arc(x, y, node.radius + 4, 0, 2 * Math.PI);
          ctx.strokeStyle = `${node.color}60`; ctx.lineWidth = 6; ctx.stroke();
        }

        // Text
        ctx.font = `700 ${isH ? 11 : 9}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = isH ? (isLight ? '#0c0a1e' : '#ffffff') : (isLight ? '#1e1b4b' : 'rgba(255,255,255,0.85)');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (node.radius > 18 || isH) {
          const label = isH ? node.id : (node.id.length > 5 ? node.id.substring(0, 4) + '..' : node.id);
          ctx.fillText(label, x, y);
        }
      });
      setHoveredNode(hover);
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      sim.force('mouse', d3.forceRadial(90, mx, my).strength(-0.08)).alpha(0.12);
      cancelIdle(idleId as number); tickSim();
    };
    const onLeave = () => { mx = -1000; my = -1000; sim.force('mouse', null); };
    canvas.addEventListener('mousemove', onMove); canvas.addEventListener('mouseleave', onLeave);

    const onResize = () => {
      width = canvas.parentElement?.clientWidth || 800; height = window.innerWidth < 768 ? 380 : 500;
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
    <div style={{ position: 'relative', width: '100%', borderRadius: 28, overflow: 'hidden',
      border: '1px solid rgba(167,139,250,0.12)',
      background: 'linear-gradient(145deg, rgba(10,5,25,0.9), rgba(15,8,35,0.95))',
      boxShadow: '0 32px 80px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(167,139,250,0.1)',
    }}>
      {/* Scan line effect */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 2, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)',
        animation: 'skills-scan 6s linear infinite',
      }} />
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', cursor: 'crosshair' }} />
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'absolute', top: 20, left: 20,
            padding: '14px 20px', borderRadius: 16,
            background: 'rgba(10,5,30,0.92)',
            border: `1px solid ${hoveredNode.color}40`,
            backdropFilter: 'blur(20px)',
            boxShadow: `0 0 30px ${hoveredNode.color}20`,
            pointerEvents: 'none', minWidth: 160,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: hoveredNode.color,
              boxShadow: `0 0 14px ${hoveredNode.color}`,
            }} />
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: hoveredNode.color }}>{hoveredNode.id}</span>
          </div>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.65rem', color: 'rgba(167,139,250,0.5)', marginTop: 6, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {hoveredNode.group === 1 ? 'GIS & Remote Sensing' : hoveredNode.group === 2 ? 'AI & Machine Learning' : 'Web Engineering'}
          </p>
        </motion.div>
      )}
      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16,
        display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end',
      }}>
        {[['#22D3EE', 'GIS & RS'], ['#F472B6', 'AI/ML'], ['#A78BFA', 'Web']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '0.08em' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ULTRA PREMIUM SKILL CARD
═══════════════════════════════════════════════════════════════ */
function SkillCard({ name, level, icon: Icon, desc, color, colorRgb, delay, years }: {
  name: string; level: number; icon: LucideIcon; desc: string;
  color: string; colorRgb: string; delay: number; years: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-60, 60], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-80, 80], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); setHovered(false); };

  // Proficiency label
  const profLabel = level >= 90 ? 'Expert' : level >= 80 ? 'Advanced' : level >= 70 ? 'Proficient' : 'Intermediate';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX, rotateY, transformStyle: 'preserve-3d',
          padding: '20px 22px', borderRadius: 20,
          background: hovered
            ? `linear-gradient(145deg, rgba(${colorRgb},0.12), rgba(${colorRgb},0.04))`
            : 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          border: `1px solid ${hovered ? color + '40' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: hovered
            ? `0 20px 60px -10px rgba(${colorRgb},0.25), 0 0 0 1px rgba(${colorRgb},0.15), inset 0 1px 0 rgba(255,255,255,0.08)`
            : '0 4px 20px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(20px)',
          transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
          cursor: 'default', position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Corner accent */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 60, height: 60,
          background: `radial-gradient(circle at top right, rgba(${colorRgb},0.15), transparent 70%)`,
          opacity: hovered ? 1 : 0, transition: 'opacity 0.4s ease',
        }} />

        {/* Shimmer on hover */}
        {hovered && (
          <motion.div
            initial={{ x: '-100%' }} animate={{ x: '200%' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.08) 50%, transparent 65%)',
              width: '60%',
            }}
          />
        )}

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Icon box */}
              <motion.div
                whileHover={{ scale: 1.12, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(${colorRgb},0.2), rgba(${colorRgb},0.08))`,
                  border: `1px solid rgba(${colorRgb},0.3)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: hovered ? `0 0 20px rgba(${colorRgb},0.3)` : 'none',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <Icon size={18} style={{ color }} />
              </motion.div>
              <div>
                <p style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  fontSize: '0.92rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                }}>{name}</p>
                <p style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', marginTop: 3,
                  letterSpacing: '0.04em',
                }}>{desc}</p>
              </div>
            </div>

            {/* Level badge */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 900,
                fontSize: '1.1rem', lineHeight: 1,
                background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.9))`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{level}%</div>
              <div style={{
                fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.12em',
                color: `rgba(${colorRgb},0.6)`, marginTop: 2,
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700,
              }}>{profLabel}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{
            height: 5, borderRadius: 999,
            background: 'rgba(255,255,255,0.05)',
            overflow: 'hidden', position: 'relative', marginBottom: 12,
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${level}%` } : {}}
              transition={{ duration: 1.4, delay: delay + 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '100%', borderRadius: 999, position: 'relative',
                background: `linear-gradient(90deg, rgba(${colorRgb},0.5) 0%, ${color} 60%, rgba(255,255,255,0.9) 100%)`,
                boxShadow: `0 0 16px rgba(${colorRgb},0.6), 0 0 4px rgba(${colorRgb},0.8)`,
              }}
            >
              {/* Animated shimmer on bar */}
              <motion.div
                animate={{ x: ['-100%', '250%'] }}
                transition={{ duration: 2.5, delay: delay + 1.5, ease: 'linear', repeat: Infinity, repeatDelay: 4 }}
                style={{
                  position: 'absolute', inset: 0, width: '35%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                }}
              />
            </motion.div>
          </div>

          {/* Footer: years badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Zap size={10} style={{ color: `rgba(${colorRgb},0.7)` }} />
              <span style={{
                fontSize: '0.6rem', fontFamily: 'Plus Jakarta Sans, sans-serif',
                color: `rgba(${colorRgb},0.6)`, letterSpacing: '0.06em', fontWeight: 600,
              }}>{years} yrs exp</span>
            </div>
            {/* Dot indicators */}
            <div style={{ display: 'flex', gap: 3 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: i < Math.round(level / 20) ? color : 'rgba(255,255,255,0.08)',
                  boxShadow: i < Math.round(level / 20) ? `0 0 6px rgba(${colorRgb},0.8)` : 'none',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ULTRA PREMIUM CATEGORY TAB
═══════════════════════════════════════════════════════════════ */
function CategoryTab({ cat, active, onClick }: {
  cat: typeof CATEGORIES[number]; active: boolean; onClick: () => void;
}) {
  const Icon = cat.icon;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 22px', borderRadius: 999,
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.82rem',
        letterSpacing: '0.02em', cursor: 'pointer', position: 'relative',
        border: `1px solid ${active ? cat.color + '50' : 'rgba(255,255,255,0.07)'}`,
        background: active
          ? `linear-gradient(135deg, rgba(${cat.colorRgb},0.18), rgba(${cat.colorRgb},0.06))`
          : 'rgba(255,255,255,0.03)',
        color: active ? cat.color : 'rgba(255,255,255,0.35)',
        boxShadow: active
          ? `0 0 30px rgba(${cat.colorRgb},0.2), inset 0 1px 0 rgba(255,255,255,0.08)`
          : 'none',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={14} />
      <span>{cat.label}</span>
      {active && (
        <>
          {/* Animated border glow */}
          <motion.div
            layoutId="tab-indicator"
            style={{
              position: 'absolute', inset: -1, borderRadius: 999,
              border: `1px solid ${cat.color}50`, pointerEvents: 'none',
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
          {/* Active dot */}
          <div style={{
            width: 5, height: 5, borderRadius: '50%', background: cat.color,
            boxShadow: `0 0 8px ${cat.color}`,
            animation: 'skills-dot-pulse 2s ease-in-out infinite',
          }} />
        </>
      )}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VIEW TOGGLE
═══════════════════════════════════════════════════════════════ */
function ViewToggle({ view, onToggle }: { view: 'bars' | 'constellation'; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 18px', borderRadius: 999,
        fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '0.73rem',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        border: '1px solid rgba(167,139,250,0.25)',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(167,139,250,0.06))',
        color: 'rgba(167,139,250,0.8)',
        cursor: 'pointer', backdropFilter: 'blur(12px)',
        boxShadow: '0 0 20px rgba(124,58,237,0.1)',
      }}
    >
      {view === 'bars'
        ? <><Globe2 size={12} />Constellation</>
        : <><Layers size={12} />Skill Cards</>}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY HERO HEADER
═══════════════════════════════════════════════════════════════ */
function CategoryHero({ cat }: { cat: typeof CATEGORIES[number] }) {
  const Icon = cat.icon;
  const avg = Math.round(cat.skills.reduce((a, s) => a + s.level, 0) / cat.skills.length);

  return (
    <motion.div
      key={cat.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        marginBottom: 32, padding: '24px 28px', borderRadius: 24,
        background: `linear-gradient(135deg, rgba(${cat.colorRgb},0.1) 0%, rgba(${cat.colorRgb},0.03) 60%, rgba(0,0,0,0) 100%)`,
        border: `1px solid rgba(${cat.colorRgb},0.2)`,
        backdropFilter: 'blur(24px)',
        boxShadow: `0 0 60px rgba(${cat.colorRgb},0.08), inset 0 1px 0 rgba(255,255,255,0.06)`,
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* BG radial glow */}
      <div style={{
        position: 'absolute', top: '-30%', right: '-10%',
        width: '40%', height: '200%', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${cat.colorRgb},0.12), transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div style={{
        width: 60, height: 60, borderRadius: 18, flexShrink: 0,
        background: `linear-gradient(135deg, rgba(${cat.colorRgb},0.25), rgba(${cat.colorRgb},0.08))`,
        border: `1px solid rgba(${cat.colorRgb},0.35)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 30px rgba(${cat.colorRgb},0.2)`,
      }}>
        <Icon size={26} style={{ color: cat.color }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: '1.2rem' }}>{cat.emoji}</span>
          <h3 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(1.1rem,2.2vw,1.45rem)', color: cat.color,
            letterSpacing: '-0.02em',
          }}>{cat.label}</h3>
          <span style={{
            fontSize: '0.6rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: `rgba(${cat.colorRgb},0.6)`,
            background: `rgba(${cat.colorRgb},0.1)`, padding: '3px 8px', borderRadius: 999,
            border: `1px solid rgba(${cat.colorRgb},0.2)`,
          }}>{cat.sublabel}</span>
        </div>
        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, maxWidth: 480,
        }}>{cat.tagline}</p>
      </div>

      {/* Avg badge */}
      <div style={{
        textAlign: 'right', flexShrink: 0,
        background: `linear-gradient(145deg, rgba(${cat.colorRgb},0.12), rgba(${cat.colorRgb},0.04))`,
        border: `1px solid rgba(${cat.colorRgb},0.2)`,
        borderRadius: 16, padding: '14px 20px',
      }}>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 900,
          fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1,
          background: `linear-gradient(135deg, ${cat.color}, rgba(255,255,255,0.95))`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>{avg}%</div>
        <div style={{
          fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.14em',
          color: `rgba(${cat.colorRgb},0.5)`, marginTop: 4,
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700,
        }}>avg mastery</div>
        <div style={{ display: 'flex', gap: 3, justifyContent: 'flex-end', marginTop: 8 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={8} style={{ color: i < Math.round(avg / 20) ? cat.color : 'rgba(255,255,255,0.1)', fill: i < Math.round(avg / 20) ? cat.color : 'transparent' }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function SkillsVisualization() {
  const [activeTab, setActiveTab] = useState<CategoryId>('gis');
  const [view, setView] = useState<'bars' | 'constellation'>('bars');
  const toggleView = useCallback(() => setView(v => v === 'bars' ? 'constellation' : 'bars'), []);
  const activeCat = CATEGORIES.find(c => c.id === activeTab)!;

  return (
    <section id="skills" style={{ position: 'relative', zIndex: 20, padding: 'clamp(64px,8vw,120px) 0', background: 'var(--bg)' }}>
      <style>{CSS}</style>

      {/* ── Ambient aurora glows ── */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Cyan orb */}
        <div style={{
          position: 'absolute', top: '10%', left: '-5%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.07), transparent 60%)',
          filter: 'blur(80px)', animation: 'skills-orb-drift 18s ease-in-out infinite',
        }} />
        {/* Pink orb */}
        <div style={{
          position: 'absolute', bottom: '5%', right: '-5%',
          width: '45vw', height: '45vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,114,182,0.07), transparent 60%)',
          filter: 'blur(90px)', animation: 'skills-orb-drift 22s ease-in-out infinite reverse',
        }} />
        {/* Violet orb */}
        <div style={{
          position: 'absolute', top: '45%', left: '35%',
          width: '40vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.05), transparent 60%)',
          filter: 'blur(70px)', animation: 'skills-orb-drift 14s ease-in-out infinite 2s',
        }} />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px,5vw,48px)', position: 'relative' }}>

        {/* ── Section header ── */}
        <SectionHeader
          badge="Expertise"
          title="Skill Constellation"
          description="A deep-dive into my technical proficiencies across GIS & Remote Sensing, AI & Machine Learning, and Web Engineering."
        />

        {/* ── Controls ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12, marginTop: 40, marginBottom: 40,
          }}
        >
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
        </motion.div>

        {/* ── Content ── */}
        <AnimatePresence mode="wait">
          {view === 'bars' ? (
            <motion.div
              key={`bars-${activeTab}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Category hero */}
              <AnimatePresence mode="wait">
                <CategoryHero key={activeCat.id} cat={activeCat} />
              </AnimatePresence>

              {/* Skill cards grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
                gap: 14,
              }}>
                {activeCat.skills.map((skill, i) => (
                  <SkillCard
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    icon={skill.icon}
                    desc={skill.desc}
                    color={activeCat.color}
                    colorRgb={activeCat.colorRgb}
                    delay={i * 0.08}
                    years={skill.years}
                  />
                ))}
              </div>

              {/* Bottom summary stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  marginTop: 32, padding: '20px 24px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center',
                }}
              >
                {[
                  { label: 'Skills Tracked', value: activeCat.skills.length.toString() },
                  { label: 'Avg Mastery', value: `${Math.round(activeCat.skills.reduce((a, s) => a + s.level, 0) / activeCat.skills.length)}%` },
                  { label: 'Expert Level', value: activeCat.skills.filter(s => s.level >= 90).length.toString() },
                  { label: 'Category', value: activeCat.sublabel },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '1.3rem',
                      background: activeCat.gradient,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>{value}</div>
                    <div style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.6rem',
                      textTransform: 'uppercase', letterSpacing: '0.14em',
                      color: 'rgba(255,255,255,0.25)', marginTop: 2,
                    }}>{label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="constellation"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ConstellationGraph />
              <p style={{
                textAlign: 'center', marginTop: 16,
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.72rem',
                color: 'rgba(167,139,250,0.4)', letterSpacing: '0.08em',
              }}>
                ✦ Hover nodes to explore · Move cursor to interact with the force field
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
