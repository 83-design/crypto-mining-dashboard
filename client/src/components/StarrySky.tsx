import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
  twinkleSpeed: number;
  vx: number;
  vy: number;
  color: string;
}

export const StarrySky: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate 160 stars with varying depths, sizes and blue/white tints
    const starColors = ['#FFFFFF', '#E0F2FE', '#BAE6FD', '#93C5FD', '#60A5FA'];
    const stars: Star[] = Array.from({ length: 160 }, () => {
      const radius = Math.random() < 0.8 ? Math.random() * 1.1 + 0.3 : Math.random() * 1.8 + 1.2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        alpha: Math.random() * 0.7 + 0.2,
        targetAlpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -Math.abs(Math.random() * 0.18 + 0.04), // Gentle upward/diagonal cosmic drift
        color: starColors[Math.floor(Math.random() * starColors.length)],
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#030509');
      bgGrad.addColorStop(0.5, '#050813');
      bgGrad.addColorStop(1, '#080D1A');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Cosmic royal-blue nebula ambient glows
      const nebula1 = ctx.createRadialGradient(width * 0.5, height * 0.35, 10, width * 0.5, height * 0.35, width * 0.7);
      nebula1.addColorStop(0, 'rgba(46, 123, 255, 0.14)');
      nebula1.addColorStop(0.4, 'rgba(20, 56, 140, 0.08)');
      nebula1.addColorStop(1, 'rgba(3, 5, 9, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(width * 0.8, height * 0.8, 10, width * 0.8, height * 0.8, width * 0.5);
      nebula2.addColorStop(0, 'rgba(56, 189, 248, 0.06)');
      nebula2.addColorStop(1, 'rgba(3, 5, 9, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // Draw and animate twinkling drifting stars
      for (const star of stars) {
        // Twinkle interpolation
        if (Math.abs(star.alpha - star.targetAlpha) < 0.02) {
          star.targetAlpha = Math.random() * 0.85 + 0.15;
        } else {
          star.alpha += (star.targetAlpha - star.alpha) * star.twinkleSpeed;
        }

        // Drifting movement
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around boundaries
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;

        // Draw star with soft glow
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra outer glow for larger bright stars
        if (star.radius > 1.2) {
          ctx.globalAlpha = star.alpha * 0.35;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
