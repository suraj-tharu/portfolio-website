import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Plane, QrCode } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999]"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, rotateX: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 m-auto w-full max-w-4xl h-fit z-[10000] flex items-center justify-center p-4 pointer-events-none"
            style={{ perspective: 1200 }}
          >
            {/* The Ticket */}
            <div className={`relative pointer-events-auto flex flex-col md:flex-row w-full rounded-2xl overflow-hidden shadow-2xl ${isDark ? 'bg-[#0f0c29] text-white' : 'bg-white text-gray-900'} border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Main Ticket Area */}
              <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-dashed border-gray-400/30 relative">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h3 className="font-syne text-2xl md:text-4xl font-bold tracking-tighter mb-2">
                      SURAJ THARU
                    </h3>
                    <p className={`font-mono text-sm uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                      MSc. Information Systems
                    </p>
                  </div>
                  <Plane className={`opacity-20 ${isDark ? 'text-white' : 'text-black'}`} size={48} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  <div>
                    <p className="text-xs uppercase text-muted dark:text-gray-500 font-mono mb-1">Date</p>
                    <p className="font-bold font-mono">2026</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted dark:text-gray-500 font-mono mb-1">Class</p>
                    <p className="font-bold font-mono">FIRST</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted dark:text-gray-500 font-mono mb-1">Origin</p>
                    <p className="font-bold font-mono">NPL</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted dark:text-gray-500 font-mono mb-1">Destination</p>
                    <p className="font-bold font-mono">GLOBAL</p>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-sm text-text-secondary dark:text-gray-400">
                  <div className="flex justify-between border-b border-gray-500/20 pb-2">
                    <span>SKILLS</span>
                    <span className={isDark ? 'text-white' : 'text-black'}>TS, REACT, NEXT, GIS, ML</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-500/20 pb-2">
                    <span>EXPERIENCE</span>
                    <span className={isDark ? 'text-white' : 'text-black'}>5+ YEARS</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-500/20 pb-2">
                    <span>STATUS</span>
                    <span className="text-green-500">AVAILABLE</span>
                  </div>
                </div>

                {/* Decorative cutouts */}
                <div className={`absolute -bottom-4 -right-4 w-8 h-8 rounded-full ${isDark ? 'bg-black/60' : 'bg-black/60'} md:-top-4 md:-right-4 backdrop-blur-md hidden md:block`} />
                <div className={`absolute -bottom-4 -right-4 w-8 h-8 rounded-full ${isDark ? 'bg-black/60' : 'bg-black/60'} md:bottom-auto md:-right-4 backdrop-blur-md hidden md:block`} style={{ top: 'calc(50% - 16px)' }} />
                <div className={`absolute -bottom-4 -right-4 w-8 h-8 rounded-full ${isDark ? 'bg-black/60' : 'bg-black/60'} hidden md:block`} />
              </div>

              {/* Stub / Action Area */}
              <div className={`w-full md:w-64 p-8 md:p-12 flex flex-col justify-between ${isDark ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20' : 'bg-purple-50'}`}>
                <div className="flex flex-col items-center mb-8">
                  <QrCode size={100} className={`mb-4 opacity-80 ${isDark ? 'text-white' : 'text-black'}`} />
                  <p className="font-mono text-xs text-center text-muted dark:text-gray-500 break-all">
                    01101001 01101110 01100110 01101111
                  </p>
                </div>
                
                <a
                  href="/Suraj_Tharu_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
                >
                  <Download size={18} />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
