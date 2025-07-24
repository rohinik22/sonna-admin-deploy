import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ParticleEffectProps {
  trigger: boolean;
  className?: string;
  particleCount?: number;
  colors?: string[];
  duration?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const ParticleEffect = ({ 
  trigger, 
  className,
  particleCount = 20,
  colors = ['#ff6b6b', '#ffa726', '#ffcc02', '#66bb6a'],
  duration = 1000
}: ParticleEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Create particles
    const particles: Particle[] = [];
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: duration,
        maxLife: duration,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2
      });
    }

    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      particles.forEach((particle, index) => {
        if (particle.life <= 0) {
          particles.splice(index, 1);
          return;
        }

        // Update particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // gravity
        particle.life -= 16; // ~60fps

        // Calculate opacity based on life
        const opacity = particle.life / particle.maxLife;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * opacity, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (particles.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trigger, particleCount, colors, duration]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ width: '100%', height: '100%' }}
    />
  );
};