import { useEffect, useRef } from 'react';
import type { JarvisState } from '../types';

interface OrbCanvasProps {
  state: JarvisState;
  onClick?: () => void;
}

const STATE_COLORS = {
  idle: { primary: '#00D4FF', secondary: '#0088FF', glow: '#00FFFF' },
  listening: { primary: '#00FFFF', secondary: '#00D4FF', glow: '#FFFFFF' },
  thinking: { primary: '#7B2FFF', secondary: '#00D4FF', glow: '#9D50FF' },
  speaking: { primary: '#00FF88', secondary: '#00D4FF', glow: '#00FFAA' },
  error: { primary: '#FF4444', secondary: '#FF0000', glow: '#FF6666' },
};

export function OrbCanvas({ state, onClick }: OrbCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    const animate = () => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const baseRadius = Math.min(rect.width, rect.height) * 0.3;

      ctx.clearRect(0, 0, rect.width, rect.height);
      timeRef.current += 0.016;

      const colors = STATE_COLORS[state];
      const isPulsing = state === 'listening' || state === 'speaking';
      const isSpinning = state === 'thinking';

      const pulseScale = isPulsing ? 1 + Math.sin(timeRef.current * 4) * 0.15 : 1;
      const radius = baseRadius * pulseScale;

      // Outer glow
      const outerGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 2.5);
      outerGlow.addColorStop(0, `${colors.glow}40`);
      outerGlow.addColorStop(0.5, `${colors.glow}10`);
      outerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Rotating outer rings (3 rings)
      for (let ring = 0; ring < 3; ring++) {
        const ringRadius = radius * (1.4 + ring * 0.3);
        const ringSpeed = (ring + 1) * 0.3;
        const rotation = timeRef.current * ringSpeed;

        ctx.strokeStyle = `${colors.primary}${Math.floor((0.6 - ring * 0.15) * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;

        // Draw segmented ring
        for (let i = 0; i < 12; i++) {
          const startAngle = rotation + (i * Math.PI / 6);
          const endAngle = startAngle + Math.PI / 8;

          ctx.beginPath();
          ctx.arc(centerX, centerY, ringRadius, startAngle, endAngle);
          ctx.stroke();
        }

        // Corner markers
        for (let i = 0; i < 4; i++) {
          const angle = rotation + (i * Math.PI / 2);
          const x = centerX + Math.cos(angle) * ringRadius;
          const y = centerY + Math.sin(angle) * ringRadius;

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = colors.glow;
          ctx.fill();
        }
      }

      // Inner rotating ring with notches
      const innerRingRadius = radius * 1.1;
      const innerRotation = -timeRef.current * 0.8;
      
      ctx.strokeStyle = `${colors.primary}CC`;
      ctx.lineWidth = 3;
      
      for (let i = 0; i < 60; i++) {
        const angle = innerRotation + (i * Math.PI * 2 / 60);
        const length = i % 5 === 0 ? 15 : 8;
        const startRadius = innerRingRadius - length;
        
        const x1 = centerX + Math.cos(angle) * startRadius;
        const y1 = centerY + Math.sin(angle) * startRadius;
        const x2 = centerX + Math.cos(angle) * innerRingRadius;
        const y2 = centerY + Math.sin(angle) * innerRingRadius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Core sphere with gradient
      const coreGradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        0,
        centerX,
        centerY,
        radius
      );
      coreGradient.addColorStop(0, colors.glow);
      coreGradient.addColorStop(0.3, colors.primary);
      coreGradient.addColorStop(0.7, colors.secondary);
      coreGradient.addColorStop(1, `${colors.secondary}40`);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Inner bright core (Arc Reactor style)
      const innerPulse = 0.6 + Math.sin(timeRef.current * 5) * 0.4;
      const innerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.4);
      innerGradient.addColorStop(0, `${colors.glow}${Math.floor(innerPulse * 255).toString(16).padStart(2, '0')}`);
      innerGradient.addColorStop(0.5, `${colors.primary}${Math.floor(innerPulse * 200).toString(16).padStart(2, '0')}`);
      innerGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = innerGradient;
      ctx.fill();

      // Triangular core pattern (Arc Reactor triangle)
      ctx.strokeStyle = `${colors.glow}DD`;
      ctx.lineWidth = 2;
      const triangleRadius = radius * 0.25;
      const triangleRotation = timeRef.current * 0.5;

      for (let i = 0; i < 3; i++) {
        const angle = triangleRotation + (i * Math.PI * 2 / 3);
        const x = centerX + Math.cos(angle) * triangleRadius;
        const y = centerY + Math.sin(angle) * triangleRadius;

        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();

      // Spinning indicator for thinking state
      if (isSpinning) {
        const spinnerRadius = radius * 1.6;
        const spinnerAngle = timeRef.current * 3;

        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        for (let i = 0; i < 3; i++) {
          const angle = spinnerAngle + (i * Math.PI * 2 / 3);
          ctx.beginPath();
          ctx.arc(centerX, centerY, spinnerRadius, angle, angle + Math.PI * 0.3);
          ctx.stroke();
        }
      }

      // Particle effects
      const particleCount = 40;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + timeRef.current * 0.5;
        const particleRadius = radius * (1.05 + Math.sin(timeRef.current * 2 + i) * 0.05);
        const x = centerX + Math.cos(angle) * particleRadius;
        const y = centerY + Math.sin(angle) * particleRadius;
        const size = 1.5 + Math.sin(timeRef.current * 3 + i) * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `${colors.primary}AA`;
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [state]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-pointer"
      onClick={onClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
}
