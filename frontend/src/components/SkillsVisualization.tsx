import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3-force';
import SectionHeader from './SectionHeader';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  radius: number;
  color: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

const skillsData = {
  nodes: [
    { id: 'GIS & RS', group: 1, radius: 24, color: '#22D3EE' },
    { id: 'QGIS', group: 1, radius: 14, color: '#22D3EE' },
    { id: 'ArcGIS', group: 1, radius: 14, color: '#22D3EE' },
    { id: 'Earth Engine', group: 1, radius: 16, color: '#22D3EE' },
    
    { id: 'Machine Learning', group: 2, radius: 24, color: '#F472B6' },
    { id: 'Python', group: 2, radius: 18, color: '#F472B6' },
    { id: 'TensorFlow', group: 2, radius: 14, color: '#F472B6' },
    { id: 'Computer Vision', group: 2, radius: 16, color: '#F472B6' },

    { id: 'Web Dev', group: 3, radius: 24, color: '#A78BFA' },
    { id: 'React', group: 3, radius: 18, color: '#A78BFA' },
    { id: 'Next.js', group: 3, radius: 16, color: '#A78BFA' },
    { id: 'Node.js', group: 3, radius: 16, color: '#A78BFA' },
    { id: 'TypeScript', group: 3, radius: 14, color: '#A78BFA' },
  ] as Node[],
  links: [
    { source: 'GIS & RS', target: 'QGIS' },
    { source: 'GIS & RS', target: 'ArcGIS' },
    { source: 'GIS & RS', target: 'Earth Engine' },
    
    { source: 'Machine Learning', target: 'Python' },
    { source: 'Machine Learning', target: 'TensorFlow' },
    { source: 'Machine Learning', target: 'Computer Vision' },
    { source: 'Python', target: 'Earth Engine' }, // Cross-domain link

    { source: 'Web Dev', target: 'React' },
    { source: 'Web Dev', target: 'Next.js' },
    { source: 'Web Dev', target: 'Node.js' },
    { source: 'Web Dev', target: 'TypeScript' },
    { source: 'TypeScript', target: 'React' },
  ] as Link[]
};

function ConstellationGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.parentElement?.clientWidth || 800;
    let height = window.innerWidth < 768 ? 400 : 600;
    
    // Support high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;



    const nodes = skillsData.nodes.map(d => ({ ...d }));
    const links = skillsData.links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<Node>().radius((d: Node) => d.radius + 10))
      .alphaDecay(0.01);

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw links
      ctx.lineWidth = 1.5;
      links.forEach(link => {
        const source = link.source as Node;
        const target = link.target as Node;
        
        // Gradient for link
        const grad = ctx.createLinearGradient(source.x || 0, source.y || 0, target.x || 0, target.y || 0);
        grad.addColorStop(0, `${source.color}40`); // 40 is opacity in hex
        grad.addColorStop(1, `${target.color}40`);
        
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.moveTo(source.x || 0, source.y || 0);
        ctx.lineTo(target.x || 0, target.y || 0);
        ctx.stroke();
      });

      let currentHover: Node | null = null;

      // Draw nodes
      nodes.forEach(node => {
        const x = node.x || 0;
        const y = node.y || 0;
        
        // Check hover
        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = dist < node.radius + 5;
        
        if (isHovered) currentHover = node;

        // Node glow
        ctx.beginPath();
        ctx.arc(x, y, node.radius + (isHovered ? 8 : 4), 0, 2 * Math.PI);
        ctx.fillStyle = `${node.color}20`;
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(x, y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = isHovered ? '#fff' : '#0a051e';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Node text
        ctx.font = `600 ${isHovered ? 12 : 10}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = isHovered ? '#000' : '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Only draw text if it fits in the radius or if it's a main node, or if hovered
        if (node.radius > 16 || isHovered) {
            ctx.fillText(isHovered ? node.id : node.id.substring(0, 3) + (node.id.length > 3 ? '..' : ''), x, y);
        }
      });

      setHoveredNode(currentHover);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      // Light repulsion from mouse
      simulation.force('mouse', d3.forceRadial(100, mouseX, mouseY).strength(-0.1));
      simulation.alpha(0.1).restart();
    };
    
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      simulation.force('mouse', null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
        width = canvas.parentElement?.clientWidth || 800;
        height = window.innerWidth < 768 ? 400 : 600;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        simulation.force('center', d3.forceCenter(width / 2, height / 2));
        simulation.alpha(0.3).restart();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      simulation.stop();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl">
      <canvas ref={canvasRef} className="block w-full cursor-crosshair" />
      
      {/* Floating tooltip overlay */}
      {hoveredNode && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-6 left-6 p-4 rounded-xl border border-white/20 backdrop-blur-md bg-white/5 pointer-events-none"
        >
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: hoveredNode.color, color: hoveredNode.color }} />
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

export default function SkillsVisualization() {
  return (
    <section id="skills" className="section-py relative z-20 bg-[var(--bg)]">
      <div className="section-container">
        <SectionHeader 
          badge="Expertise" 
          title="Skill Constellation" 
          description="An interactive map of my technical proficiencies across GIS, ML, and Web Development. Hover to explore the nodes." 
        />
        
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 relative"
        >
            <ConstellationGraph />
        </motion.div>
      </div>
    </section>
  );
}
