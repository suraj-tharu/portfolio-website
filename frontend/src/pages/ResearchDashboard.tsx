import { motion } from 'framer-motion';
import GISShowcase from '../components/GISShowcase';
import Stats from '../components/Stats';

export default function ResearchDashboard() {

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[var(--bg)] min-h-screen text-[var(--text)] font-sans pt-24"
    >
      <main className="max-w-[1200px] mx-auto px-6 md:px-10 pb-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 mt-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-[var(--brand)]" />
            <span className="text-xs text-[var(--brand)] font-bold uppercase tracking-[0.3em]">Data & Analytics</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display italic tracking-tight mb-6">
            Research <span className="text-[var(--text-secondary)]">Dashboard</span>
          </h1>
          <p className="text-[var(--muted)] max-w-2xl text-lg">
            A comprehensive overview of geospatial datasets, machine learning models, and analytical results from my ongoing research in environmental engineering and urbanization.
          </p>
        </motion.div>

        {/* Stats Summary */}
        <div className="mb-16">
          <Stats />
        </div>

        {/* GIS Interactive Showcase */}
        <div className="mb-24">
          <GISShowcase />
        </div>

        {/* Data Models Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
        >
          <div className="bg-[var(--surface)] border border-[var(--stroke)] rounded-3xl p-8 hover:border-[var(--brand)] transition-colors">
            <h3 className="text-2xl font-bold mb-4">Random Forest Classification</h3>
            <p className="text-[var(--muted)] mb-6">
              Achieved 94.2% overall accuracy in classifying Land Use and Land Cover (LULC) using Sentinel-2 multispectral imagery. The model successfully distinguished between high-density urban areas and bare soil, which typically suffer from spectral confusion.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">Accuracy: 94.2%</span>
              <span className="px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">Kappa: 0.91</span>
              <span className="px-3 py-1 rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)] text-xs font-mono">Sentinel-2</span>
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--stroke)] rounded-3xl p-8 hover:border-[var(--brand)] transition-colors">
            <h3 className="text-2xl font-bold mb-4">Urban Sprawl Prediction</h3>
            <p className="text-[var(--muted)] mb-6">
              Cellular Automata (CA) Markov Chain model forecasting urban expansion trajectories through 2035. Results indicate a potential 15% loss of prime agricultural land if current urbanization trends continue unabated.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-mono">Risk: High</span>
              <span className="px-3 py-1 rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)] text-xs font-mono">CA-Markov</span>
              <span className="px-3 py-1 rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)] text-xs font-mono">TerrSet</span>
            </div>
          </div>
        </motion.section>

      </main>
    </motion.div>
  );
}
