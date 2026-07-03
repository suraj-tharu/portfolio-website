import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'logo' | 'wipe' | 'done'>('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('wipe'), 2200);
    const t2 = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 3400); // 1.2s wipe duration

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (stage === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-intro"
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* LOGO STAGE */}
        <AnimatePresence>
          {stage === 'logo' && (
            <motion.div
              key="logo-stage"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="relative flex flex-col items-center"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  style={{ fill: 'none', stroke: '#a78bfa', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}
                >
                  <motion.path
                    d="M30 70 L50 30 L70 70 M40 50 L60 50 M10 10 L90 10 L90 90 L10 90 Z"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  />
                  {/* S T C stylized monogram approximation */}
                  <motion.path
                    d="M 40 40 C 30 40, 30 50, 40 50 C 50 50, 50 60, 40 60 M 45 40 L 55 40 M 50 40 L 50 60 M 60 40 C 55 40, 55 50, 60 50 C 65 50, 65 60, 60 60"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
                  />
                </svg>
                {/* Glow behind the logo */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, times: [0, 0.4, 0.6, 1] }}
                  className="absolute inset-0 bg-purple-500 rounded-full blur-[40px] -z-10 mix-blend-screen"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-6 text-center"
              >
                <div className="text-white/80 font-syne font-bold tracking-[0.3em] uppercase text-sm md:text-base">
                  Suraj Tharu Chaudhary
                </div>
                <div className="text-white/40 font-jakarta text-[0.65rem] tracking-[0.4em] uppercase mt-2">
                  Portfolio · 2026
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WIPE STAGE */}
        {stage === 'wipe' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '-100%' }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-white dark:bg-[#0a051e] z-10"
            style={{
               boxShadow: '0 -20px 40px rgba(167,139,250,0.3)',
               borderTop: '2px solid rgba(167,139,250,0.5)'
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
