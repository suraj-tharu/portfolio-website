import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const secretCode = ['s', 'u', 'r', 'a', 'j'];

export function DeveloperMode() {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    let input = '';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      
      const key = e.key.toLowerCase();
      input += key;
      
      // Keep only the last N characters where N is the length of the secret code
      if (input.length > secretCode.length) {
        input = input.slice(input.length - secretCode.length);
      }
      
      if (input === secretCode.join('')) {
        setIsActive(true);
      }
      
      if (e.key === 'Escape' && isActive) {
        setIsActive(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
        >
          {/* Matrix green background */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm pointer-events-auto" onClick={() => setIsActive(false)} />
          
          <motion.div 
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative bg-black border border-green-500/30 rounded-lg w-full max-w-2xl mx-4 shadow-[0_0_50px_rgba(34,197,94,0.2)] pointer-events-auto overflow-hidden font-mono text-green-500"
          >
            {/* Terminal Header */}
            <div className="bg-gray-900 border-b border-green-500/30 px-4 py-2 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={() => setIsActive(false)} />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-gray-400 font-sans">root@suraj-portfolio:~</span>
            </div>
            
            {/* Terminal Body */}
            <div className="p-6 h-[400px] overflow-y-auto">
              <TypewriterText text={[
                "> Initializing Developer Mode...",
                "> System Access Granted.",
                "> Welcome, Suraj.",
                "",
                "GREETINGS VISITOR.",
                "You have found the hidden developer terminal.",
                "I am a Computer Engineer passionate about building high-performance systems and applying Machine Learning to GIS data.",
                "",
                "Skills Loaded:",
                "  [OK] React & Vite",
                "  [OK] Node.js & Go",
                "  [OK] Python & ML",
                "  [OK] Remote Sensing & QGIS",
                "",
                "Press ESC to exit system."
              ]} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TypewriterText({ text }: { text: string[] }) {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => [...prev, text[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);

  return (
    <div className="flex flex-col gap-2">
      {displayedText.map((line, i) => (
        <div key={i} className="animate-fade-in">{line}</div>
      ))}
      <div className="w-3 h-5 bg-green-500 animate-pulse mt-2" />
    </div>
  );
}
