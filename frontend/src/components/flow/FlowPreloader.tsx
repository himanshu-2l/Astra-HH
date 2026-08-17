import React, { useState, useEffect, useRef } from 'react';

interface FlowPreloaderProps {
  onComplete: () => void;
  minDuration?: number;
}

export const FlowPreloader: React.FC<FlowPreloaderProps> = ({
  onComplete,
  minDuration = 1800,
}) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Progress Bar timer
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / minDuration) * 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          setIsDone(true);
          onComplete();
        }, 600);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  // 3D Particle Molecule / Orbiting Circle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const numPoints = 80;
    const radius = 64;

    // Generate sphere particle coordinates
    const points: { x: number; y: number; z: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      points.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        size: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.5 + 0.5,
      });
    }

    let angleY = 0;
    let angleX = 0.3;

    const render = (time: number) => {
      const t = time * 0.0015;
      angleY += 0.015;
      angleX = Math.sin(t * 0.5) * 0.2 + 0.2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw subtle orbital ring
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.1, radius * 0.35, angleY * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Project & draw rotated sphere particles
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Sort points by Z depth
      const projected = points.map((p) => {
        // Rotate around Y
        let x1 = p.x * cosY + p.z * sinY;
        let y1 = p.y;
        let z1 = -p.x * sinY + p.z * cosY;

        // Wave displacement
        const wave = Math.sin(x1 * 0.05 + t * 2.0) * 4;
        y1 += wave;

        // Rotate around X
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        // Perspective scale
        const scale = 250 / (250 + z2);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          pz: z2,
          scale,
          size: p.size * scale,
          alpha: (p.alpha * (z2 + radius)) / (radius * 2) + 0.2,
        };
      });

      projected.sort((a, b) => a.pz - b.pz);

      projected.forEach((p) => {
        const grad = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, p.size * 2);
        grad.addColorStop(0, `rgba(180, 220, 255, ${p.alpha})`);
        grad.addColorStop(0.5, `rgba(120, 160, 255, ${p.alpha * 0.6})`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 bg-[#000000] select-none transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* 3D Orbiting Particle Molecule Sphere with Radial Glow */}
      <div className="relative flex items-center justify-center">
        {/* Soft Radial Ambient Glow */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            transform: 'scale(1.6)',
          }}
        />

        {/* 3D Particle Circle Canvas */}
        <canvas
          ref={canvasRef}
          width={220}
          height={220}
          className="relative z-10 w-[200px] h-[200px] md:w-[220px] md:h-[220px]"
        />
      </div>

      {/* Sleek Minimalist Loading Line */}
      <div className="w-48 sm:w-52 h-0.5 bg-white/10 rounded-full mt-6 sm:mt-8 overflow-hidden relative">
        <div
          className="h-full rounded-full bg-white/60 transition-all duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
