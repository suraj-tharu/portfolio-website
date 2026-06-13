import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface/80 px-2 py-2 transition-shadow duration-300",
          scrolled && "shadow-md shadow-black/20"
        )}
      >
        {/* Logo */}
        <a href="#" className="group relative w-9 h-9 flex items-center justify-center rounded-full overflow-hidden shrink-0 transition-transform hover:scale-110">
          <div className="absolute inset-0 accent-gradient group-hover:rotate-180 transition-transform duration-700" />
          <div className="absolute inset-[2px] bg-bg rounded-full flex items-center justify-center">
            <span className="font-display italic text-[13px] text-text-primary">JA</span>
          </div>
        </a>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-stroke mx-2" />

        {/* Links */}
        <div className="flex items-center gap-1 mx-1">
          {[
            { label: 'Journey', href: '#timeline' },
            { label: 'Expertise', href: '#skills' },
            { label: 'Work', href: '#work' },
            { label: 'Academia', href: '#research' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setActive(link.label)}
              className={cn(
                "text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors",
                active === link.label 
                  ? "text-text-primary bg-stroke/50" 
                  : "text-muted hover:text-text-primary hover:bg-stroke/30"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-stroke mx-2" />

        {/* Contact Button */}
        <a href="#contact" className="group relative inline-flex items-center justify-center rounded-full p-[2px] ml-1 shrink-0 overflow-hidden text-xs sm:text-sm font-medium">
          <span className="absolute inset-[-200%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,rgba(137,170,204,1)_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_2s_linear_infinite] transition-opacity duration-300" />
          <div className="relative inline-flex items-center gap-2 bg-surface/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-text-primary hover:bg-surface transition-colors border border-white/5 group-hover:border-transparent">
            Say hi <ArrowUpRight size={14} className="text-muted group-hover:text-text-primary transition-colors" />
          </div>
        </a>
      </motion.div>
    </nav>
  );
}
