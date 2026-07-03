import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let rafId: number;

    try {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        wheelMultiplier: 1,
        touchMultiplier: 1.8,
        infinite: false,
      });

      function raf(time: number) {
        lenis!.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    } catch (e) {
      console.warn('[SmoothScroll] Lenis init failed, falling back to native scroll:', e);
    }

    return () => {
      cancelAnimationFrame(rafId);
      try { lenis?.destroy(); } catch { /* ignore */ }
    };
  }, []);

  return <>{children}</>;
}
