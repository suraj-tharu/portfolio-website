import { useEffect, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * NoiseTexture — film-grain overlay
 * The #1 hallmark of ultra-premium sites (Linear, Vercel, Pika).
 * A fixed, looping canvas noise texture at ~5% opacity gives the
 * flat dark background tactile, organic depth.
 */
export default function NoiseTexture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 256;
    const H = 256;
    canvas.width = W;
    canvas.height = H;

    let animId: number;

    const drawNoise = () => {
      const imageData = ctx.createImageData(W, H);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i]     = value; // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        data[i + 3] = 18;    // Alpha — very subtle
      }

      ctx.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(drawNoise);
    };

    drawNoise();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Hide in light mode — grain doesn't look great on white
  if (theme === 'light') return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999,
        pointerEvents: 'none',
        opacity: 0.045,
        mixBlendMode: 'overlay',
        imageRendering: 'pixelated',
        // Tile the small canvas across the full viewport
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
