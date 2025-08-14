
'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useMouse, useWindowSize } from 'react-use';

interface ParticlesProps {
  color?: string;
  particleCount?: number;
  particleSize?: number;
  animate?: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  vx: number;
  vy: number;
}

export const Particles: React.FC<ParticlesProps> = ({
  color = '#FFFFFF',
  particleCount = 5000,
  particleSize = 3,
  animate = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useWindowSize();
  const { elX, elY } = useMouse(canvasRef);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: Math.random() * width,
        originY: Math.random() * height,
        size: Math.random() * particleSize,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
      });
    }
    setParticles(newParticles);
  }, [width, height, particleCount, particleSize]);

  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      particles.forEach((p) => {
        const dx = elX - p.x;
        const dy = elY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.x -= (dx / dist) * force * 2;
          p.y -= (dy / dist) * force * 2;
        } else {
          p.x += (p.originX - p.x) * 0.05;
          p.y += (p.originY - p.y) * 0.05;
        }

        if (animate) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [particles, width, height, color, elX, elY, animate]);

  return <canvas ref={canvasRef} className={className} />;
};
