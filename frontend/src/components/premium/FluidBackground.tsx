import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

export const FluidBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let t = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resize);
        resize();

        // Premium color palettes based on theme
        const getColors = () => {
            if (theme === 'light') {
                return [
                    [109, 40, 217],  // Violet 700
                    [219, 39, 119],  // Pink 600
                    [217, 119, 6],   // Amber 600
                ];
            } else {
                return [
                    [139, 92, 246],  // Violet 500
                    [236, 72, 153],  // Pink 500
                    [34, 211, 238],  // Cyan 400
                ];
            }
        };

        const render = () => {
            t += 0.002; // Very slow, luxurious movement
            const colors = getColors();
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw fluid blobs
            colors.forEach((color, index) => {
                const xOffset = Math.sin(t + index) * (canvas.width * 0.3) + canvas.width / 2;
                const yOffset = Math.cos(t * 0.8 + index * 2) * (canvas.height * 0.3) + canvas.height / 2;
                const radius = Math.max(canvas.width, canvas.height) * 0.4 + Math.sin(t * 1.5 + index) * 100;

                const gradient = ctx.createRadialGradient(xOffset, yOffset, 0, xOffset, yOffset, radius);
                
                // Very subtle opacity for premium feel (dark mode = more opaque, light mode = very faint)
                const alpha = theme === 'dark' ? 0.15 : 0.05;
                
                gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`);
                gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-1000"
            style={{
                filter: 'blur(60px)',
                opacity: 0.8
            }}
        />
    );
};
