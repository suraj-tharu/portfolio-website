import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, X, Menu } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Expertise', href: '#skills' },
    { label: 'Work', href: '#work' },
    { label: 'Academia', href: '#research' },
    { label: 'Learning Hub', href: '/learning-hub', external: true },
    { label: 'Contact', href: '#contact' }
  ];

  const menuVars: any = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1, transition: { duration: 0.7, ease: [0.12, 0, 0.39, 0] } },
    exit: { scaleY: 0, transition: { duration: 0.7, ease: [0.12, 0, 0.39, 1] } }
  };

  const linkVars: any = {
    initial: { y: "30vh", transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] } },
    open: { y: 0, transition: { duration: 0.7, ease: [0, 0.55, 0.45, 1] } }
  };

  const containerVars: any = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.3, staggerChildren: 0.09, staggerDirection: 1 } }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center pt-6 px-8 md:px-12 pointer-events-none">
        
        {/* Logo */}
        <a href="#" className="pointer-events-auto group relative w-12 h-12 flex items-center justify-center rounded-full overflow-hidden shrink-0 transition-transform hover:scale-110 bg-surface/80 backdrop-blur-md border border-stroke">
          <div className="absolute inset-0 bg-brand-500 opacity-20 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700" />
          <div className="absolute inset-[2px] bg-bg rounded-full flex items-center justify-center">
            <span className="font-display italic text-lg text-text-primary">SC</span>
          </div>
        </a>

        {/* Controls */}
        <div className="pointer-events-auto flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-md border border-stroke text-text-primary hover:text-brand-light transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-md border border-stroke text-text-primary hover:text-brand-light transition-colors group"
          >
            {isOpen ? <X size={24} className="group-hover:rotate-90 transition-transform duration-300" /> : <Menu size={24} className="group-hover:scale-110 transition-transform duration-300" />}
          </button>
        </div>
      </nav>

      {/* Full Screen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-[#050505] z-[90] origin-top text-white flex flex-col justify-center px-8 md:px-24"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none mix-blend-screen" />
            
            <motion.div variants={containerVars} initial="initial" animate="open" exit="initial" className="flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.div variants={linkVars}>
                    <a
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-4xl md:text-6xl lg:text-7xl font-display italic leading-[0.85] tracking-tight hover:text-brand-light hover:translate-x-8 transition-all duration-300 inline-block"
                    >
                      {link.label}
                    </a>
                  </motion.div>
                </div>
              ))}
            </motion.div>
            
            {/* Footer info in nav */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-12 left-8 md:left-24 right-8 flex justify-between items-end text-muted text-sm border-t border-stroke/50 pt-6"
            >
              <div>
                <p>Nawalparasi West, Nepal</p>
                <p>suraj.tharu@example.com</p>
              </div>
              <div className="flex gap-4">
                <a href="#" className="hover:text-brand-light transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-brand-light transition-colors">GitHub</a>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
