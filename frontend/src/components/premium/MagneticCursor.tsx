// MagneticCursor - Premium cursor effect that attracts to elements
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
}

export const MagneticCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (cursorRef.current) {
                cursorRef.current.style.left = e.clientX + 'px';
                cursorRef.current.style.top = e.clientY + 'px';

                // Add particles
                if (Math.random() > 0.8) {
                    particlesRef.current.push({
                        id: Date.now() + Math.random(),
                        x: e.clientX,
                        y: e.clientY,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4,
                        life: 1
                    });
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const animateParticles = () => {
            const particles = particlesRef.current;

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                }
            }

            requestAnimationFrame(animateParticles);
        };

        const frame = requestAnimationFrame(animateParticles);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <>
            {/* Main cursor */}
            <motion.div
                ref={cursorRef}
                className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
                    boxShadow: '0 0 20px #D4AF37',
                    filter: 'blur(1px)'
                }}
            />

            {/* Particles container */}
            <div ref={containerRef} className="fixed inset-0 pointer-events-none z-40">
                {particlesRef.current.map(particle => (
                    <motion.div
                        key={particle.id}
                        initial={{ opacity: particle.life, x: particle.x, y: particle.y }}
                        animate={{
                            opacity: 0,
                            x: particle.x + particle.vx * 20,
                            y: particle.y + particle.vy * 20
                        }}
                        transition={{ duration: 1 }}
                        className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
                    />
                ))}
            </div>
        </>
    );
};
