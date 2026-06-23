import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';

export default function GlobeShowcase() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeEl = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Locations in Nepal (Surkhet and Nawalparasi)
  const locations = [
    { name: 'Birendranagar, Surkhet', lat: 28.6015, lng: 81.6322, size: 0.1, color: '#8B5CF6' },
    { name: 'Nawalparasi West', lat: 27.5319, lng: 83.6922, size: 0.15, color: '#EC4899' },
    { name: 'Kathmandu', lat: 27.7172, lng: 85.3240, size: 0.05, color: '#34D399' }
  ];

  // Arcs connecting research hubs
  const arcsData = [
    { startLat: 27.7172, startLng: 85.3240, endLat: 28.6015, endLng: 81.6322, color: ['#34D399', '#8B5CF6'] },
    { startLat: 27.7172, startLng: 85.3240, endLat: 27.5319, endLng: 83.6922, color: ['#34D399', '#EC4899'] },
  ];

  useEffect(() => {
    // Initial camera position pointing at Nepal
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 28, lng: 84, altitude: 1.5 }, 4000);
      globeEl.current.controls().enableZoom = false;
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--stroke)] shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/20 via-[var(--bg)] to-[var(--bg)] z-0" />
      
      {/* Overlay UI */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-bold">Live Telemetry</span>
          </div>
          <h3 className="text-xl md:text-2xl font-display italic text-[var(--text)]">Research Coordinates</h3>
        </motion.div>
      </div>

      <div className="absolute inset-0 z-1 flex items-center justify-center cursor-move">
        {dimensions.width > 0 && (
          <Globe
            ref={globeEl}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            pointsData={locations}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointAltitude="size"
            pointRadius={0.5}
            pointsMerge={true}
            arcsData={arcsData}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor="color"
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={1500}
            arcStroke={0.5}
          />
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-10 bg-[var(--surface-2)]/80 backdrop-blur-md p-4 rounded-xl border border-[var(--stroke)] pointer-events-none">
        <div className="flex flex-col gap-2">
          {locations.map((loc, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: loc.color }} />
              <span className="text-xs text-[var(--text-secondary)]">{loc.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
