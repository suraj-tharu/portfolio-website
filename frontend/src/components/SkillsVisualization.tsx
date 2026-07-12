import { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion, AnimatePresence, useInView, useSpring,
  useTransform, useMotionValue,
} from 'framer-motion';
import * as d3 from 'd3-force';
import type { LucideIcon } from 'lucide-react';
import {
  Globe2, Brain, Code2, Map, Layers, Cpu, Eye, Database,
  LayoutDashboard, Server, GitBranch, Activity, Sparkles,
  Zap, Star,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   ULTRA-PREMIUM LUXURY KEYFRAMES + STYLES
═══════════════════════════════════════════════════════════════ */
const CSS = `
  :root, .dark {
    --lux-surface-rgb: 6, 5, 18;
    --lux-surface-alt: 4, 4, 12;
    --lux-card-bg: rgba(8, 8, 18, 0.75);
    --lux-text-muted: rgba(235, 235, 248, 0.72);
    --lux-text-soft: rgba(235, 235, 248, 0.42);
    --lux-text-strong: rgba(248, 248, 255, 0.94);
    --lux-text-faint: rgba(235, 235, 248, 0.28);
  }
  .light {
    --lux-surface-rgb: 248, 247, 255;
    --lux-surface-alt: 242, 240, 254;
    --lux-card-bg: rgba(255, 255, 255, 0.92);
    --lux-text-muted: rgba(22, 18, 50, 0.82);
    --lux-text-soft: rgba(35, 30, 65, 0.6);
    --lux-text-strong: rgba(10, 8, 28, 0.96);
    --lux-text-faint: rgba(35, 30, 65, 0.38);
  }

  @keyframes sk-gold-shimmer {
    0%   { background-position: -300% center; }
    100% { background-position: 300% center; }
  }
  @keyframes sk-orb-drift {
    0%,100% { transform: translate(0,0) scale(1) rotate(0deg); opacity: 0.6; }
    33%      { transform: translate(55px,-40px) scale(1.15) rotate(6deg); opacity: 0.88; }
    66%      { transform: translate(-35px,28px) scale(0.92) rotate(-4deg); opacity: 0.65; }
  }
  @keyframes sk-pulse-ring {
    0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.55); transform: scale(0.96); }
    50%      { box-shadow: 0 0 0 18px rgba(212,175,55,0); transform: scale(1.08); }
  }
  @keyframes sk-scan {
    0%   { top: -2px; opacity: 0; }
    3%   { opacity: 0.65; }
    97%  { opacity: 0.22; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes sk-dot-pulse {
    0%,100% { opacity: 0.28; transform: scale(0.7); }
    50%      { opacity: 1; transform: scale(1.5); }
  }
  @keyframes sk-float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-8px) rotate(2deg); }
    66%      { transform: translateY(-5px) rotate(-1.5deg); }
  }
  @keyframes sk-border-glow {
    0%,100% { opacity: 0.45; }
    50%      { opacity: 1; }
  }
  @keyframes sk-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes sk-counter-spin {
    to { transform: rotate(-360deg); }
  }
  @keyframes sk-halo {
    0%,100% { opacity: 0.32; transform: scale(1) rotate(0deg); }
    50%      { opacity: 0.65; transform: scale(1.12) rotate(3deg); }
  }
  @keyframes sk-live-dot {
    0%,100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(74,222,128,0.65); }
    50%      { opacity: 0.82; transform: scale(1.35); box-shadow: 0 0 0 7px rgba(74,222,128,0); }
  }
  @keyframes sk-badge-glow {
    0%,100% { box-shadow: 0 0 22px rgba(212,175,55,0.14), inset 0 1px 0 rgba(212,175,55,0.18); }
    50%      { box-shadow: 0 0 45px rgba(212,175,55,0.32), inset 0 1px 0 rgba(212,175,55,0.28); }
  }
  @keyframes sk-grid-shimmer {
    0%   { background-position: 0% 0%; }
    100% { background-position: 200% 200%; }
  }

  .sk-card {
    transform-style: preserve-3d;
    perspective: 1000px;
  }
  .sk-card:hover .sk-card-inner {
    transform: translateZ(14px);
  }
  .sk-card-inner {
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
  }

  @media (max-width: 640px) {
    .sk-category-hero {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 16px !important;
      padding: 18px 18px !important;
    }
    .sk-hero-avg {
      text-align: left !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      width: 100% !important;
      padding: 12px 14px !important;
    }
  }
  @media (max-width: 480px) {
    .sk-controls-bar {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 12px !important;
    }
  }
`;

/* ═══════════════════════════════════════════════════════════════
   LUXURY PALETTE
═══════════════════════════════════════════════════════════════ */
const GOLD      = '#D4AF37';
const GOLD_RGB  = '212,175,55';
const PLAT      = '#E8E8E8';
const PLAT_RGB  = '232,232,232';
const ROSE      = '#C9956C';
const ROSE_RGB  = '201,149,108';
const TEAL      = '#2DD4BF';
const TEAL_RGB  = '45,212,191';
const VIOLET    = '#A78BFA';
const VIOLET_RGB = '167,139,250';

/* ═══════════════════════════════════════════════════════════════
   DATA — 3 premium categories
═══════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: 'gis',
    label: 'GIS & Remote Sensing',
    sublabel: 'Geospatial Intelligence',
    color: TEAL,
    colorRgb: TEAL_RGB,
    glow: `rgba(${TEAL_RGB},0.18)`,
    gradient: `linear-gradient(135deg, #0d9488 0%, ${TEAL} 50%, #5eead4 100%)`,
    icon: Globe2,
    emoji: '🌍',
    tagline: 'Transforming raw satellite data into actionable spatial intelligence',
    skills: [
      { name: 'QGIS',                level: 95, icon: Map,      desc: 'Advanced spatial analysis & cartography',          years: '5+' },
      { name: 'ArcGIS',              level: 88, icon: Layers,   desc: 'Enterprise GIS workflows & geodatabases',          years: '4+' },
      { name: 'Google Earth Engine', level: 85, icon: Globe2,   desc: 'Cloud-based geospatial processing',                years: '3+' },
      { name: 'Remote Sensing',      level: 90, icon: Activity, desc: 'Satellite imagery classification & analysis',      years: '4+' },
      { name: 'ENVI',                level: 78, icon: Eye,      desc: 'Hyperspectral & multispectral analysis',           years: '3+' },
      { name: 'PostGIS',             level: 80, icon: Database, desc: 'Spatial databases & complex queries',              years: '3+' },
    ],
  },
  {
    id: 'ml',
    label: 'AI & Machine Learning',
    sublabel: 'Deep Intelligence Systems',
    color: ROSE,
    colorRgb: ROSE_RGB,
    glow: `rgba(${ROSE_RGB},0.18)`,
    gradient: `linear-gradient(135deg, #9a3412 0%, ${ROSE} 50%, #fdba74 100%)`,
    icon: Brain,
    emoji: '🧠',
    tagline: 'Building intelligent systems that learn, adapt and predict',
    skills: [
      { name: 'Python',            level: 92, icon: Code2,    desc: 'Primary language for ML & data pipelines',         years: '5+' },
      { name: 'TensorFlow/Keras',  level: 85, icon: Brain,    desc: 'Deep learning model training & deployment',        years: '3+' },
      { name: 'PyTorch',           level: 78, icon: Cpu,      desc: 'Research-grade neural network architectures',      years: '2+' },
      { name: 'Computer Vision',   level: 84, icon: Eye,      desc: 'Image segmentation & object detection',            years: '3+' },
      { name: 'scikit-learn',      level: 90, icon: Activity, desc: 'Classical ML algorithms & pipelines',              years: '4+' },
      { name: 'Pandas / NumPy',    level: 93, icon: Database, desc: 'Data manipulation & scientific computing',         years: '5+' },
    ],
  },
  {
    id: 'web',
    label: 'Web Engineering',
    sublabel: 'Full-Stack Mastery',
    color: VIOLET,
    colorRgb: VIOLET_RGB,
    glow: `rgba(${VIOLET_RGB},0.18)`,
    gradient: `linear-gradient(135deg, #5b21b6 0%, ${VIOLET} 50%, #c4b5fd 100%)`,
    icon: Code2,
    emoji: '⚡',
    tagline: 'Crafting performant, beautiful, and scalable digital experiences',
    skills: [
      { name: 'React / Next.js',  level: 90, icon: LayoutDashboard, desc: 'Modern UI & full-stack applications',        years: '4+' },
      { name: 'TypeScript',       level: 87, icon: Code2,           desc: 'Type-safe, scalable application architecture', years: '3+' },
      { name: 'Node.js',          level: 82, icon: Server,          desc: 'REST APIs, WebSockets & backend services',    years: '4+' },
      { name: 'PostgreSQL',       level: 80, icon: Database,        desc: 'Relational databases & Prisma ORM',           years: '3+' },
      { name: 'Docker / CI-CD',   level: 75, icon: GitBranch,       desc: 'Containerisation & deployment pipelines',     years: '2+' },
      { name: 'Three.js / WebGL', level: 70, icon: Sparkles,        desc: '3D visualisations, shaders & WebGL',         years: '2+' },
    ],
  },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

/* ═══════════════════════════════════════════════════════════════
   D3 CONSTELLATION
═══════════════════════════════════════════════════════════════ */
interface D3Node extends d3.SimulationNodeDatum {
  id: string; group: number; radius: number; color: string;
}
interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node; target: string | D3Node;
}

const constellationData = {
  nodes: [
    { id: 'GIS & RS',        group: 1, radius: 28, color: TEAL   },
    { id: 'QGIS',            group: 1, radius: 16, color: TEAL   },
    { id: 'ArcGIS',          group: 1, radius: 16, color: TEAL   },
    { id: 'Earth Engine',    group: 1, radius: 18, color: TEAL   },
    { id: 'Machine Learning',group: 2, radius: 28, color: ROSE   },
    { id: 'Python',          group: 2, radius: 20, color: ROSE   },
    { id: 'TensorFlow',      group: 2, radius: 16, color: ROSE   },
    { id: 'Computer Vision', group: 2, radius: 18, color: ROSE   },
    { id: 'Web Dev',         group: 3, radius: 28, color: VIOLET },
    { id: 'React',           group: 3, radius: 20, color: VIOLET },
    { id: 'Next.js',         group: 3, radius: 16, color: VIOLET },
    { id: 'Node.js',         group: 3, radius: 16, color: VIOLET },
    { id: 'TypeScript',      group: 3, radius: 16, color: VIOLET },
  ] as D3Node[],
  links: [
    { source: 'GIS & RS',        target: 'QGIS' },
    { source: 'GIS & RS',        target: 'ArcGIS' },
    { source: 'GIS & RS',        target: 'Earth Engine' },
    { source: 'Machine Learning', target: 'Python' },
    { source: 'Machine Learning', target: 'TensorFlow' },
    { source: 'Machine Learning', target: 'Computer Vision' },
    { source: 'Python',          target: 'Earth Engine' },
    { source: 'Web Dev',         target: 'React' },
    { source: 'Web Dev',         target: 'Next.js' },
    { source: 'Web Dev',         target: 'Node.js' },
    { source: 'Web Dev',         target: 'TypeScript' },
    { source: 'TypeScript',      target: 'React' },
    { source: 'Python',          target: 'Web Dev' },
  ] as D3Link[],
};

function ConstellationGraph() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<D3Node | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width  = canvas.parentElement?.clientWidth || 800;
    let height = window.innerWidth < 768 ? 360 : 480;
    const dpr  = window.devicePixelRatio || 1;
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;

    const nodes = constellationData.nodes.map(d => ({ ...d }));
    const links = constellationData.links.map(d => ({ ...d }));
    const sim   = d3.forceSimulation<D3Node>(nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-360))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<D3Node>().radius((d: D3Node) => d.radius + 16))
      .alphaDecay(0.012).stop();

    const reqIdle    = window.requestIdleCallback    || ((cb: () => void) => setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback     || clearTimeout;
    let idleId: number;
    const tickSim = () => {
      idleId = reqIdle(() => { sim.tick(); if (sim.alpha() > sim.alphaMin()) tickSim(); }) as unknown as number;
    };
    tickSim();

    let raf: number; let mx = -1000; let my = -1000; let time = 0;

    const draw = () => {
      time += 0.007;
      ctx.clearRect(0, 0, width, height);

      // Animated links
      links.forEach(link => {
        const s = link.source as D3Node; const t = link.target as D3Node;
        const g = ctx.createLinearGradient(s.x || 0, s.y || 0, t.x || 0, t.y || 0);
        g.addColorStop(0, `${s.color}40`); g.addColorStop(1, `${t.color}25`);
        ctx.beginPath(); ctx.strokeStyle = g; ctx.lineWidth = 1.4;
        ctx.setLineDash([4, 9]); ctx.lineDashOffset = -time * 22;
        ctx.moveTo(s.x || 0, s.y || 0); ctx.lineTo(t.x || 0, t.y || 0); ctx.stroke();
        ctx.setLineDash([]);
      });

      let hoverNode: D3Node | null = null;
      nodes.forEach(node => {
        const x = node.x || 0; const y = node.y || 0;
        const dist = Math.sqrt((mx - x) ** 2 + (my - y) ** 2);
        const isH  = dist < node.radius + 10;
        if (isH) hoverNode = node;

        // Pulse ring
        const pulseAlpha = isH ? 0.28 + 0.14 * Math.sin(time * 3.5) : 0.07 + 0.04 * Math.sin(time * 2 + node.radius);
        ctx.beginPath(); ctx.arc(x, y, node.radius + (isH ? 20 : 12), 0, 2 * Math.PI);
        ctx.fillStyle = `${node.color}${Math.floor(pulseAlpha * 255).toString(16).padStart(2, '0')}`; ctx.fill();

        // Gold glow ring on hover
        if (isH) {
          ctx.beginPath(); ctx.arc(x, y, node.radius + 4, 0, 2 * Math.PI);
          ctx.strokeStyle = `${GOLD}50`; ctx.lineWidth = 8; ctx.stroke();
          ctx.strokeStyle = `${node.color}80`; ctx.lineWidth = 2.5; ctx.stroke();
        }

        // Main circle with gradient fill
        ctx.beginPath(); ctx.arc(x, y, node.radius + (isH ? 5 : 0), 0, 2 * Math.PI);
        const grad = ctx.createRadialGradient(
          x - node.radius * 0.3, y - node.radius * 0.3, 0,
          x, y, node.radius + 4,
        );
        const isLight = document.documentElement.classList.contains('light');
        grad.addColorStop(0, isLight ? '#E8E8ED' : '#181B2E');
        grad.addColorStop(1, isLight ? '#F5F5F7' : '#0A0B12');
        ctx.fillStyle = grad;
        ctx.strokeStyle = isH ? node.color : `${node.color}70`;
        ctx.lineWidth  = isH ? 2.2 : 1.5;
        ctx.fill(); ctx.stroke();

        // Label
        ctx.font = `800 ${isH ? 11.5 : 9}px 'Syne', sans-serif`;
        ctx.fillStyle = isH ? '#fff' : 'rgba(255,255,255,0.75)';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (node.radius > 18 || isH) {
          const label = isH ? node.id : (node.id.length > 5 ? node.id.substring(0, 4) + '..' : node.id);
          ctx.fillText(label, x, y);
        }
      });
      setHovered(hoverNode);
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      sim.force('mouse', d3.forceRadial(90, mx, my).strength(-0.09)).alpha(0.12);
      cancelIdle(idleId as number); tickSim();
    };
    const onLeave = () => { mx = -1000; my = -1000; sim.force('mouse', null); };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    const onResize = () => {
      width  = canvas.parentElement?.clientWidth || 800;
      height = window.innerWidth < 768 ? 360 : 480;
      canvas.width = width * dpr; canvas.height = height * dpr; ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      sim.force('center', d3.forceCenter(width / 2, height / 2)).alpha(0.3);
      cancelIdle(idleId as number); tickSim();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf); sim.stop(); cancelIdle(idleId as number);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div style={{
      position: 'relative', width: '100%', borderRadius: 28, overflow: 'hidden',
      border: `1px solid rgba(${GOLD_RGB},0.15)`,
      background: 'linear-gradient(145deg, rgba(var(--lux-surface-rgb), 0.96), rgba(var(--lux-surface-alt), 0.98))',
      boxShadow: `0 40px 100px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(${GOLD_RGB},0.12)`,
    }}>
      {/* Scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 2, zIndex: 2, pointerEvents: 'none',
        background: `linear-gradient(90deg, transparent, rgba(${GOLD_RGB},0.5), rgba(${PLAT_RGB},0.2), transparent)`,
        animation: 'sk-scan 7s linear infinite',
      }} />

      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', cursor: 'crosshair' }} />

      {/* Hover tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'absolute', top: 20, left: 20,
            padding: '14px 20px', borderRadius: 18,
            background: `linear-gradient(145deg, rgba(var(--lux-surface-rgb), 0.95), rgba(var(--lux-surface-alt), 0.98))`,
            border: `1px solid rgba(${GOLD_RGB},0.3)`,
            backdropFilter: 'blur(24px)',
            boxShadow: `0 0 40px rgba(${GOLD_RGB},0.15), 0 20px 60px rgba(0,0,0,0.5)`,
            pointerEvents: 'none', minWidth: 175,
          }}
        >
          {/* Gold shimmer top */}
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
            background: `linear-gradient(90deg, transparent, rgba(${GOLD_RGB},0.8), transparent)`,
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: hovered.color,
              boxShadow: `0 0 16px ${hovered.color}, 0 0 6px ${GOLD}`,
            }} />
            <span style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.95rem',
              color: hovered.color,
            }}>{hovered.id}</span>
          </div>
          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.62rem', color: `rgba(${GOLD_RGB},0.45)`,
            marginTop: 6, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>
            {hovered.group === 1 ? 'GIS & Remote Sensing'
              : hovered.group === 2 ? 'AI & Machine Learning'
              : 'Web Engineering'}
          </p>
        </motion.div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16,
        display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-end',
      }}>
        {([[TEAL, 'GIS & RS'], [ROSE, 'AI/ML'], [VIOLET, 'Web']] as [string, string][]).map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
            <span style={{ fontSize: '0.62rem', color: 'var(--lux-text-muted)', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '0.1em' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ULTRA-PREMIUM SKILL CARD — 3D Tilt + Gold Shimmer
═══════════════════════════════════════════════════════════════ */
function SkillCard({
  name, level, icon: Icon, desc, color, colorRgb, delay, years,
}: {
  name: string; level: number; icon: LucideIcon; desc: string;
  color: string; colorRgb: string; delay: number; years: string;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const [hovered, setHovered] = useState(false);

  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-70, 70], [12, -12]), { stiffness: 360, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-90, 90], [-12, 12]), { stiffness: 360, damping: 30 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top  - rect.height / 2);
  };
  const handleLeave = () => { mouseX.set(0); mouseY.set(0); setHovered(false); };

  const profLabel = level >= 90 ? 'Expert' : level >= 80 ? 'Advanced' : level >= 70 ? 'Proficient' : 'Intermediate';
  const profColor = level >= 90 ? GOLD : level >= 80 ? PLAT : `rgba(${colorRgb},0.9)`;

  return (
    <motion.div
      ref={ref}
      className="sk-card"
      initial={{ opacity: 0, y: 40, scale: 0.93 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
    >
      <motion.div
        className="sk-card-inner"
        style={{
          rotateX, rotateY, transformStyle: 'preserve-3d',
          padding: '24px 26px', borderRadius: 24,
          background: hovered
            ? `linear-gradient(145deg, rgba(${colorRgb},0.14), rgba(${GOLD_RGB},0.05), rgba(${colorRgb},0.07))`
            : 'linear-gradient(145deg, rgba(var(--lux-surface-rgb),0.9), rgba(var(--lux-surface-alt),0.8))',
          border: `1px solid ${hovered ? `rgba(${GOLD_RGB},0.4)` : `rgba(${colorRgb},0.15)`}`,
          boxShadow: hovered
            ? `0 28px 80px -8px rgba(${colorRgb},0.32), 0 0 0 1px rgba(${GOLD_RGB},0.18), inset 0 1px 0 rgba(${GOLD_RGB},0.12)`
            : `0 4px 28px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)`,
          backdropFilter: 'blur(28px)',
          position: 'relative', overflow: 'hidden',
          transition: 'background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease',
        }}
      >
        {/* Gold shimmer sweep on hover */}
        {hovered && (
          <motion.div
            initial={{ x: '-120%' }}
            animate={{ x: '240%' }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              background: `linear-gradient(108deg, transparent 25%, rgba(${GOLD_RGB},0.15) 50%, transparent 75%)`,
              width: '65%',
            }}
          />
        )}

        {/* Top shimmer line */}
        <div style={{
          position: 'absolute', top: 0, left: '6%', right: '6%', height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${colorRgb},0.7), rgba(${GOLD_RGB},0.5), transparent)`,
          opacity: hovered ? 1 : 0.45, transition: 'opacity 0.4s ease',
        }} />

        {/* Corner accent glow */}
        <div style={{
          position: 'absolute', top: -24, right: -24, width: 100, height: 100,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${colorRgb},0.22) 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0.2, transition: 'opacity 0.45s ease',
          pointerEvents: 'none',
        }} />
        {/* Bottom left glow */}
        <div style={{
          position: 'absolute', bottom: -20, left: -20, width: 80, height: 80,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${GOLD_RGB},0.12) 0%, transparent 70%)`,
          opacity: hovered ? 0.8 : 0, transition: 'opacity 0.45s ease',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.18, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                style={{
                  width: 46, height: 46, borderRadius: 15, flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(${colorRgb},0.26), rgba(${GOLD_RGB},0.1))`,
                  border: `1px solid rgba(${colorRgb},0.36)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: hovered ? `0 0 32px rgba(${colorRgb},0.42), 0 0 14px rgba(${GOLD_RGB},0.15)` : 'none',
                  transition: 'box-shadow 0.38s ease',
                  animation: hovered ? 'sk-float 3.5s ease-in-out infinite' : 'none',
                }}
              >
                <Icon size={20} style={{ color }} />
              </motion.div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  fontSize: 'clamp(0.88rem, 1.1vw, 0.96rem)',
                  color: hovered ? PLAT : 'var(--lux-text-strong)',
                  lineHeight: 1.2, letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  transition: 'color 0.38s ease',
                }}>{name}</p>
                <p style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.62rem', color: 'var(--lux-text-soft)', marginTop: 3,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{desc}</p>
              </div>
            </div>

            {/* Level badge */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 900,
                fontSize: '1.15rem', lineHeight: 1,
                background: `linear-gradient(135deg, ${GOLD} 0%, ${color} 40%, ${PLAT} 100%)`,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                animation: hovered ? 'sk-gold-shimmer 3s linear infinite' : 'none',
              }}>{level}%</div>
              <div style={{
                fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.14em',
                color: profColor, marginTop: 3,
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800,
              }}>{profLabel}</div>
            </div>
          </div>

          {/* Progress bar — luxury glow */}
          <div style={{
            height: 5, borderRadius: 999,
            background: 'rgba(255,255,255,0.04)',
            overflow: 'hidden', position: 'relative', marginBottom: 14,
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${level}%` } : {}}
              transition={{ duration: 1.5, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '100%', borderRadius: 999, position: 'relative',
                background: `linear-gradient(90deg, rgba(${colorRgb},0.45) 0%, ${color} 55%, ${GOLD} 85%, ${PLAT} 100%)`,
                boxShadow: `0 0 20px rgba(${colorRgb},0.65), 0 0 6px ${GOLD}55`,
              }}
            >
              {/* Shimmer sweep on bar */}
              <motion.div
                animate={{ x: ['-100%', '300%'] }}
                transition={{ duration: 2.8, delay: delay + 1.8, ease: 'linear', repeat: Infinity, repeatDelay: 5 }}
                style={{
                  position: 'absolute', inset: 0, width: '35%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
                }}
              />
            </motion.div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={10} style={{ color: `rgba(${GOLD_RGB},0.7)` }} />
              <span style={{
                fontSize: '0.58rem', fontFamily: 'Plus Jakarta Sans, sans-serif',
                color: `rgba(${GOLD_RGB},0.55)`, letterSpacing: '0.07em', fontWeight: 700,
              }}>{years} yrs exp</span>
            </div>
            {/* Star dots */}
            <div style={{ display: 'flex', gap: 4 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={8}
                  style={{
                    color: i < Math.round(level / 20) ? GOLD : 'rgba(255,255,255,0.08)',
                    fill:  i < Math.round(level / 20) ? GOLD : 'transparent',
                    filter: i < Math.round(level / 20) ? `drop-shadow(0 0 4px ${GOLD})` : 'none',
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
   CATEGORY TAB — Luxury Pill
═══════════════════════════════════════════════════════════════ */
function CategoryTab({ cat, active, onClick }: {
  cat: typeof CATEGORIES[number]; active: boolean; onClick: () => void;
}) {
  const Icon = cat.icon;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '12px 24px', borderRadius: 999,
        fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.8rem',
        letterSpacing: '0.03em', cursor: 'pointer', position: 'relative',
        border: `1px solid ${active ? `rgba(${GOLD_RGB},0.45)` : `rgba(${PLAT_RGB},0.07)`}`,
        background: active
          ? `linear-gradient(135deg, rgba(${cat.colorRgb},0.18), rgba(${GOLD_RGB},0.06))`
          : 'rgba(255,255,255,0.025)',
        color: active ? GOLD : 'var(--lux-text-soft)',
        boxShadow: active
          ? `0 0 35px rgba(${cat.colorRgb},0.22), 0 0 15px rgba(${GOLD_RGB},0.12), inset 0 1px 0 rgba(${GOLD_RGB},0.1)`
          : 'none',
        backdropFilter: 'blur(14px)',
        transition: 'all 0.38s cubic-bezier(0.16,1,0.3,1)',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={14} />
      <span>{cat.label}</span>
      {active && (
        <>
          <motion.div
            layoutId="sk-tab-indicator"
            style={{
              position: 'absolute', inset: -1, borderRadius: 999,
              border: `1px solid rgba(${GOLD_RGB},0.6)`,
              pointerEvents: 'none',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: GOLD,
            boxShadow: `0 0 10px ${GOLD}, 0 0 20px rgba(${GOLD_RGB},0.5)`,
            animation: 'sk-dot-pulse 1.8s ease-in-out infinite',
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
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.96 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '11px 22px', borderRadius: 999,
        fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '0.7rem',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        border: `1px solid rgba(${GOLD_RGB},0.28)`,
        background: `linear-gradient(135deg, rgba(${GOLD_RGB},0.1), rgba(${ROSE_RGB},0.05))`,
        color: GOLD,
        cursor: 'pointer', backdropFilter: 'blur(14px)',
        boxShadow: `0 0 25px rgba(${GOLD_RGB},0.12), inset 0 1px 0 rgba(${GOLD_RGB},0.12)`,
      }}
    >
      {view === 'bars'
        ? <><Globe2 size={13} />Constellation</>
        : <><Layers size={13} />Skill Cards</>}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY HERO HEADER
═══════════════════════════════════════════════════════════════ */
function CategoryHero({ cat }: { cat: typeof CATEGORIES[number] }) {
  const Icon = cat.icon;
  const avg  = Math.round(cat.skills.reduce((a, s) => a + s.level, 0) / cat.skills.length);

  return (
    <motion.div
      key={cat.id}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="sk-category-hero"
      style={{
        marginBottom: 32, padding: '28px 32px', borderRadius: 26,
        background: `linear-gradient(145deg,
          rgba(${cat.colorRgb},0.1) 0%,
          rgba(${GOLD_RGB},0.04) 40%,
          rgba(0,0,0,0) 100%)`,
        border: `1px solid rgba(${GOLD_RGB},0.2)`,
        backdropFilter: 'blur(28px)',
        boxShadow: `0 0 70px rgba(${cat.colorRgb},0.1), 0 0 30px rgba(${GOLD_RGB},0.06), inset 0 1px 0 rgba(${GOLD_RGB},0.1)`,
        display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Gold top shimmer */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: `linear-gradient(90deg, transparent, rgba(${GOLD_RGB},0.7), rgba(${cat.colorRgb},0.5), transparent)`,
      }} />

      {/* BG radial */}
      <div style={{
        position: 'absolute', top: '-40%', right: '-8%',
        width: '45%', height: '220%', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${cat.colorRgb},0.13), transparent 60%)`,
        pointerEvents: 'none',
      }} />

      {/* Icon with spin rings */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          position: 'absolute', inset: -12, borderRadius: '50%',
          border: `1px dashed rgba(${GOLD_RGB},0.3)`,
          animation: 'sk-spin 20s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: -6, borderRadius: '50%',
          border: `1px solid rgba(${cat.colorRgb},0.25)`,
          animation: 'sk-counter-spin 14s linear infinite',
        }} />
        <div style={{
          width: 64, height: 64, borderRadius: 20, flexShrink: 0,
          background: `linear-gradient(135deg, rgba(${cat.colorRgb},0.28), rgba(${GOLD_RGB},0.1))`,
          border: `1px solid rgba(${GOLD_RGB},0.3)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 40px rgba(${cat.colorRgb},0.25), 0 0 16px rgba(${GOLD_RGB},0.1)`,
        }}>
          <Icon size={28} style={{ color: cat.color }} />
        </div>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: '1.3rem' }}>{cat.emoji}</span>
          <h3 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 900,
            fontSize: 'clamp(1.1rem,2.2vw,1.5rem)',
            background: `linear-gradient(135deg, ${GOLD} 0%, ${cat.color} 50%, ${PLAT} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            letterSpacing: '-0.025em',
          }}>{cat.label}</h3>
          <span style={{
            fontSize: '0.58rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: `rgba(${GOLD_RGB},0.6)`,
            background: `rgba(${GOLD_RGB},0.08)`, padding: '3px 9px', borderRadius: 999,
            border: `1px solid rgba(${GOLD_RGB},0.2)`,
          }}>{cat.sublabel}</span>
        </div>
        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem',
          color: 'var(--lux-text-muted)', lineHeight: 1.6, maxWidth: 480,
        }}>{cat.tagline}</p>
      </div>

      {/* Avg mastery badge */}
      <div className="sk-hero-avg" style={{
        textAlign: 'right', flexShrink: 0,
        background: `linear-gradient(145deg, rgba(${GOLD_RGB},0.1), rgba(${cat.colorRgb},0.05))`,
        border: `1px solid rgba(${GOLD_RGB},0.22)`,
        borderRadius: 18, padding: '16px 22px',
        boxShadow: `0 0 30px rgba(${GOLD_RGB},0.08)`,
      }}>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 900,
          fontSize: 'clamp(1.9rem,3.2vw,2.8rem)', lineHeight: 1,
          background: `linear-gradient(135deg, ${GOLD} 0%, ${PLAT} 45%, ${cat.color} 100%)`,
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          animation: 'sk-gold-shimmer 4s linear infinite',
        }}>{avg}%</div>
        <div style={{
          fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.16em',
          color: `rgba(${GOLD_RGB},0.5)`, marginTop: 4,
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800,
        }}>avg mastery</div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', marginTop: 8 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={9} style={{
              color: i < Math.round(avg / 20) ? GOLD : 'rgba(255,255,255,0.08)',
              fill:  i < Math.round(avg / 20) ? GOLD : 'transparent',
              filter: i < Math.round(avg / 20) ? `drop-shadow(0 0 5px ${GOLD})` : 'none',
            }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION HEADER — Ultra Luxury Gold
═══════════════════════════════════════════════════════════════ */
function LuxurySkillsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: 'center', marginBottom: 'clamp(48px,7vw,92px)', position: 'relative' }}
    >
      {/* Halo radial glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(640px, 90vw)', height: 'min(640px, 90vw)',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${GOLD_RGB},0.065) 0%, rgba(${VIOLET_RGB},0.03) 40%, transparent 68%)`,
        filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0,
        animation: 'sk-halo 9s ease-in-out infinite',
      }} />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.68, y: 14 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.78, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 1,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 26px', borderRadius: 999, marginBottom: 32,
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          background: `linear-gradient(135deg, rgba(${GOLD_RGB},0.16), rgba(${VIOLET_RGB},0.06), rgba(${GOLD_RGB},0.12))`,
          border: `1px solid rgba(${GOLD_RGB},0.34)`,
          color: GOLD,
          animation: 'sk-badge-glow 4s ease-in-out infinite',
          backdropFilter: 'blur(14px)',
        }}
      >
        {/* Live green dot */}
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#4ade80',
          display: 'inline-block',
          animation: 'sk-live-dot 2.2s ease-in-out infinite',
          flexShrink: 0,
        }} />
        Expertise
        <Sparkles size={10} style={{ opacity: 0.8 }} />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.92, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 1,
          fontFamily: 'Syne, sans-serif', fontWeight: 900,
          fontSize: 'clamp(2.5rem, 5.5vw, 6rem)',
          lineHeight: 0.9, letterSpacing: '-0.048em',
          color: 'var(--text)', marginBottom: 28,
        }}
      >
        Skill{' '}
        <span style={{
          background: `linear-gradient(135deg, ${GOLD} 0%, ${PLAT} 28%, ${ROSE} 58%, ${VIOLET} 80%, ${GOLD} 100%)`,
          backgroundSize: '300% auto',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          fontStyle: 'italic',
          animation: 'sk-gold-shimmer 4s linear infinite',
        }}>
          Constellation
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 1,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 'clamp(0.9rem,1.3vw,1.06rem)',
          color: 'var(--lux-text-muted)', lineHeight: 1.95,
          maxWidth: 540, margin: '0 auto 36px',
        }}
      >
        A deep-dive into my technical proficiencies across GIS &amp; Remote Sensing,
        AI &amp; Machine Learning, and Web Engineering.
      </motion.p>

      {/* Decorative triple divider */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1, width: 'min(500px, 82vw)',
            background: `linear-gradient(90deg, transparent, rgba(${GOLD_RGB},0.95), rgba(${ROSE_RGB},0.6), rgba(${VIOLET_RGB},0.4), rgba(${GOLD_RGB},0.95), transparent)`,
            transformOrigin: 'center',
          }}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1, width: 'min(300px, 55vw)', opacity: 0.32,
            background: `linear-gradient(90deg, transparent, rgba(${PLAT_RGB},0.8), transparent)`,
            transformOrigin: 'center',
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 1.05, type: 'spring', stiffness: 280 }}
          style={{
            width: 10, height: 10,
            background: `linear-gradient(135deg, ${GOLD}, ${ROSE})`,
            transform: 'rotate(45deg)',
            margin: '-5px auto 0',
            boxShadow: `0 0 22px ${GOLD}, 0 0 44px rgba(${GOLD_RGB},0.45)`,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AMBIENT PARTICLES
═══════════════════════════════════════════════════════════════ */
const SK_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i, x: 5 + (i * 4.8) % 90, y: 5 + (i * 6.9) % 90,
  size: 1.2 + (i % 4) * 0.5, delay: (i * 0.3) % 5.5, duration: 5 + (i % 7),
  color: i % 4 === 0 ? GOLD : i % 4 === 1 ? PLAT : i % 4 === 2 ? ROSE : TEAL,
}));

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function SkillsVisualization() {
  const [activeTab, setActiveTab] = useState<CategoryId>('gis');
  const [view, setView]           = useState<'bars' | 'constellation'>('bars');
  const toggleView = useCallback(() => setView(v => v === 'bars' ? 'constellation' : 'bars'), []);
  const activeCat  = CATEGORIES.find(c => c.id === activeTab)!;

  return (
    <section id="skills" style={{ position: 'relative', zIndex: 20, padding: 'clamp(64px,8vw,120px) 0', background: 'var(--bg)', overflow: 'hidden' }}>
      <style>{CSS}</style>

      {/* Floating particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {SK_PARTICLES.map(p => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size, borderRadius: '50%',
              background: p.color, boxShadow: `0 0 ${p.size * 5}px ${p.color}`,
            }}
            animate={{ y: [-12, 12, -12], x: [-5, 5, -5], opacity: [0, 0.65, 0], scale: [0.6, 1.4, 0.6] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Aurora ambient glows */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '8%', left: '-8%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${GOLD_RGB},0.07) 0%, transparent 65%)`,
          filter: 'blur(90px)',
          animation: 'sk-orb-drift 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '3%', right: '-6%',
          width: '48vw', height: '48vw', borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${TEAL_RGB},0.07) 0%, transparent 65%)`,
          filter: 'blur(100px)',
          animation: 'sk-orb-drift 24s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', top: '42%', left: '32%',
          width: '42vw', height: '42vw', borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${ROSE_RGB},0.05) 0%, transparent 65%)`,
          filter: 'blur(80px)',
          animation: 'sk-orb-drift 16s ease-in-out infinite 3s',
        }} />
      </div>

      <div style={{
        maxWidth: '1220px', margin: '0 auto',
        padding: '0 clamp(16px,5vw,52px)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Section header */}
        <LuxurySkillsHeader />

        {/* Controls bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="sk-controls-bar"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 14, marginTop: 44, marginBottom: 44,
          }}
        >
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === 'bars' ? (
            <motion.div
              key={`bars-${activeTab}`}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Category hero */}
              <AnimatePresence mode="wait">
                <CategoryHero key={activeCat.id} cat={activeCat} />
              </AnimatePresence>

              {/* Skill cards grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 370px), 1fr))',
                gap: 16,
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
                    delay={i * 0.09}
                    years={skill.years}
                  />
                ))}
              </div>

              {/* Summary stats bar */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.4 }}
                style={{
                  marginTop: 36, padding: '22px 28px', borderRadius: 22,
                  background: `linear-gradient(145deg, rgba(${GOLD_RGB},0.06), rgba(${activeCat.colorRgb},0.03))`,
                  border: `1px solid rgba(${GOLD_RGB},0.15)`,
                  boxShadow: `0 0 40px rgba(${GOLD_RGB},0.06), inset 0 1px 0 rgba(${GOLD_RGB},0.1)`,
                  display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Top shimmer */}
                <div style={{
                  position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
                  background: `linear-gradient(90deg, transparent, rgba(${GOLD_RGB},0.6), transparent)`,
                }} />
                {[
                  { label: 'Skills Tracked',  value: activeCat.skills.length.toString() },
                  { label: 'Avg Mastery',     value: `${Math.round(activeCat.skills.reduce((a, s) => a + s.level, 0) / activeCat.skills.length)}%` },
                  { label: 'Expert Level',    value: activeCat.skills.filter(s => s.level >= 90).length.toString() },
                  { label: 'Specialty',       value: activeCat.sublabel },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '1.4rem',
                      background: `linear-gradient(135deg, ${GOLD} 0%, ${activeCat.color} 50%, ${PLAT} 100%)`,
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                      animation: 'sk-gold-shimmer 5s linear infinite',
                    }}>{value}</div>
                    <div style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.58rem',
                      textTransform: 'uppercase', letterSpacing: '0.16em',
                      color: `rgba(${GOLD_RGB},0.35)`, marginTop: 4,
                    }}>{label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="constellation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            >
              <ConstellationGraph />
              <p style={{
                textAlign: 'center', marginTop: 18,
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.7rem',
                color: `rgba(${GOLD_RGB},0.35)`, letterSpacing: '0.1em',
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
