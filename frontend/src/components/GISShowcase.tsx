import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const L = (window as any).L;

const layers = [
  { id: '2016', name: '2016 Base Map' },
  { id: '2026', name: '2026 LULC Changes' },
  { id: 'hotspots', name: 'Urbanization Hotspots' }
];

const tileLayerUrls: Record<string, string> = {
  '2016': 'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png',
  '2026': 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  'hotspots': 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png'
};

export default function GISShowcase() {
  const [activeLayer, setActiveLayer] = useState('2026');
  const [isZoomed, setIsZoomed] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tileLayerRef = useRef<any>(null);

  // Swaps tile layer URL dynamically when layer selection changes
  useEffect(() => {
    if (tileLayerRef.current && L) {
      tileLayerRef.current.setUrl(tileLayerUrls[activeLayer]);
    }
  }, [activeLayer]);

  // Adjust size of Leaflet canvas when container scales (e.g. on full screen click)
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 750); // Match transition duration of container scaling
    }
  }, [isZoomed]);

  useEffect(() => {
    if (typeof L === 'undefined') return;

    // Fix Leaflet default marker icons not loading correctly due to packaging relative paths
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    const map = L.map('react-gis-map', {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,   // FIX: prevent scroll-jacking on page scroll
      tap: false,               // FIX: prevent tap events capturing touch scroll
    }).setView([27.5319, 83.6922], 9);
    mapRef.current = map;

    // Custom dark luxury tiles
    const tileLayer = L.tileLayer(tileLayerUrls[activeLayer], {
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Add luxury glowing markers
    const createGlowingMarker = (color: string) => L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 15px ${color}; border: 2px solid white;"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    const surkhetMarker = L.marker([28.6015, 81.6322], { icon: createGlowingMarker('#f472b6') }).addTo(map);
    surkhetMarker.bindPopup(`
      <div style="background: rgba(15,8,35,0.9); border: 1px solid rgba(244,114,182,0.3); padding: 12px; border-radius: 12px; backdrop-filter: blur(10px); color: white; font-family: 'Plus Jakarta Sans', sans-serif; min-width: 180px;">
        <h4 style="font-weight: 700; margin-bottom: 6px; font-size: 14px; color: #f472b6;">Birendranagar, Surkhet</h4>
        <p style="font-size: 11px; margin: 0; color: rgba(255,255,255,0.7);">LULC Analysis using Random Forest</p>
      </div>
    `);

    const nawalparasiMarker = L.marker([27.5319, 83.6922], { icon: createGlowingMarker('#38bdf8') }).addTo(map);
    nawalparasiMarker.bindPopup(`
      <div style="background: rgba(15,8,35,0.9); border: 1px solid rgba(56,189,248,0.3); padding: 12px; border-radius: 12px; backdrop-filter: blur(10px); color: white; font-family: 'Plus Jakarta Sans', sans-serif; min-width: 180px;">
        <h4 style="font-weight: 700; margin-bottom: 6px; font-size: 14px; color: #38bdf8;">Nawalparasi West</h4>
        <p style="font-size: 11px; margin: 0; color: rgba(255,255,255,0.7);">Decadal LULC Dynamics (2016-2026)</p>
      </div>
    `).openPopup();

    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Layer change with FlyTo animation
  useEffect(() => {
    if (mapRef.current && L) {
      if (activeLayer === '2016') mapRef.current.flyTo([27.5319, 83.6922], 10, { duration: 2.5, easeLinearity: 0.1 });
      if (activeLayer === '2026') mapRef.current.flyTo([28.6015, 81.6322], 11, { duration: 2.5, easeLinearity: 0.1 });
      if (activeLayer === 'hotspots') mapRef.current.flyTo([27.9, 82.5], 8, { duration: 2.5, easeLinearity: 0.1 });
    }
  }, [activeLayer]);

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
          className={`relative rounded-3xl overflow-hidden border border-[var(--stroke)] bg-[var(--surface)] transition-all duration-700 ease-in-out ${
            isZoomed ? 'z-50 fixed inset-4 md:inset-10 shadow-2xl shadow-black/50' : 'relative aspect-[4/3] md:aspect-[21/9]'
          }`}
        >
          {/* Actual Leaflet Map Element */}
          <div id="react-gis-map" className="w-full h-full min-h-[450px]" style={{ height: '100%' }} />

          {/* Scroll hint — appears briefly on hover */}
          <div className="pointer-events-none absolute inset-0 z-[999] flex items-center justify-center opacity-0 transition-opacity duration-300"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            id="gis-scroll-hint"
          >
            <div style={{
              padding: '10px 20px', borderRadius: 12,
              background: 'rgba(167,139,250,0.15)',
              border: '1px solid rgba(167,139,250,0.3)',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.78rem', fontWeight: 600,
              letterSpacing: '0.05em',
            }}>
              🖱 Use Ctrl + Scroll to zoom map
            </div>
          </div>

          {/* Dynamic Layer Info Overlay */}
          <div className="absolute bottom-6 left-6 z-[1000] right-6 md:right-auto md:w-[300px] pointer-events-auto">
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

          {/* Expand/Minimize Control Button Overlay */}
          <button 
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-6 left-6 z-[1000] bg-[var(--surface-2)]/90 hover:bg-[var(--brand)] hover:text-white backdrop-blur-md border border-[var(--stroke)] text-[var(--text)] text-xs px-3.5 py-2.5 rounded-xl font-mono flex items-center gap-2 transition-all duration-300 shadow-lg pointer-events-auto"
          >
            {isZoomed ? "⛶ Minimize" : "⛶ Expand Map"}
          </button>

          {/* Coordinates UI Overlays */}
          <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2 pointer-events-none">
            <div className="bg-[var(--surface-2)]/90 backdrop-blur-md border border-[var(--stroke)] text-[var(--text)] text-xs px-3 py-2 rounded-lg font-mono">
              LAT: 27.5333° N<br/>
              LON: 83.7167° E
            </div>
            <div className="bg-[var(--surface-2)]/90 backdrop-blur-md border border-[var(--stroke)] text-[var(--text)] text-xs px-3 py-2 rounded-lg font-mono">
              RES: 10m/px
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
