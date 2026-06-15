import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const layers = [
  { id: '2016', name: '2016 Base Map' },
  { id: '2026', name: '2026 LULC Changes' },
  { id: 'hotspots', name: 'Urbanization Hotspots' }
];

export default function GISShowcase() {
  const [activeLayer, setActiveLayer] = useState('2026');
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <section id="gis-showcase" className="py-24 relative z-20 bg-[var(--bg)] border-t border-[var(--stroke)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[var(--brand)]" />
              <span className="text-xs text-[var(--brand)] font-bold uppercase tracking-[0.3em]">Interactive GIS</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-[var(--text)] tracking-tight mb-4">
              Spatial Data <span className="font-display italic text-[var(--text-secondary)]">Analysis</span>
            </h2>
            <p className="text-sm text-[var(--muted)] max-w-lg">
              Interactive visualization of Land Use and Land Cover (LULC) dynamics in Nawalparasi West over a 10-year period.
            </p>
          </div>
          
          <div className="flex gap-2">
            {layers.map(layer => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-300 ${
                  activeLayer === layer.id 
                    ? 'bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/20' 
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)] border border-[var(--stroke)]'
                }`}
              >
                {layer.name}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <motion.div 
          layout
          className={`relative rounded-3xl overflow-hidden border border-[var(--stroke)] bg-[var(--surface)] transition-all duration-700 ease-in-out cursor-pointer ${
            isZoomed ? 'aspect-square md:aspect-video z-50 fixed inset-4 md:inset-10 shadow-2xl shadow-black/50' : 'aspect-[4/3] md:aspect-[21/9]'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          {/* Mock Map Background Layer */}
          <div className="absolute inset-0 bg-[#0F1422] opacity-80" />
          
          {/* Grid lines */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ 
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }}
          />

          {/* Map Images depending on active layer */}
          <AnimatePresence mode="wait">
            {activeLayer === '2016' && (
              <motion.img 
                key="2016"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 0.6, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.8 }}
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity grayscale"
                alt="2016 Map"
              />
            )}
            
            {activeLayer === '2026' && (
              <motion.img 
                key="2026"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 0.7, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.8 }}
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"
                className="absolute inset-0 w-full h-full object-cover"
                alt="2026 Map"
              />
            )}

            {activeLayer === 'hotspots' && (
              <motion.img 
                key="hotspots"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 0.8, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.8 }}
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80"
                className="absolute inset-0 w-full h-full object-cover saturate-200 contrast-125"
                alt="Hotspots"
              />
            )}
          </AnimatePresence>

          {/* UI Overlays */}
          <div className="absolute top-6 right-6 flex flex-col gap-2">
            <div className="bg-[var(--surface-2)]/80 backdrop-blur-md border border-[var(--stroke)] text-[var(--text)] text-xs px-3 py-2 rounded-lg font-mono">
              LAT: 27.5333° N<br/>
              LON: 83.7167° E
            </div>
            <div className="bg-[var(--surface-2)]/80 backdrop-blur-md border border-[var(--stroke)] text-[var(--text)] text-xs px-3 py-2 rounded-lg font-mono">
              RES: 10m/px
            </div>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-[300px]">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              key={activeLayer}
              className="bg-[var(--surface-2)]/90 backdrop-blur-md border border-[var(--stroke)] rounded-2xl p-5 shadow-2xl shadow-black/50"
            >
              <h4 className="text-[var(--text)] font-semibold mb-2 flex items-center justify-between">
                {layers.find(l => l.id === activeLayer)?.name}
                <span className="text-[10px] bg-[var(--brand)]/20 text-[var(--brand)] px-2 py-0.5 rounded-full uppercase">Live Data</span>
              </h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {activeLayer === '2016' && "Baseline satellite imagery showing initial vegetative cover and urban boundaries prior to rapid expansion."}
                {activeLayer === '2026' && "Current LULC classification overlay demonstrating a 24% decrease in agricultural land and 35% increase in built-up area."}
                {activeLayer === 'hotspots' && "Heatmap of rapid urbanization clusters identified through Random Forest classification on multi-temporal Sentinel-2 data."}
              </p>
              
              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-[var(--stroke)] flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase">Vegetation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase">Urban</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase">Water</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Zoom hint */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full border border-white/10">
              {isZoomed ? "Click to minimize" : "Click to expand"}
            </div>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}
