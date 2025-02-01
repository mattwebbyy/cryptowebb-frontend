// src/hooks/useMatrix.ts
import { useCallback, RefObject } from 'react';

export interface MatrixOptions {
  fontSize?: number;
  speed?: number;
  density?: number;
}

export const useMatrixConfig = (options: MatrixOptions = {}) => {
  const {
    fontSize = 14,
    speed = 50,
    density = 1
  } = options;

  const calculateColumns = (width: number) => Math.floor(width / fontSize);
  const generateDrops = (columns: number) => Array(columns).fill(1);

  return {
    fontSize,
    speed,
    density,
    calculateColumns,
    generateDrops
  };
};

export const useMatrix = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const fontSize = 14;

  const initMatrix = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    // We don't need to store ctx here as it's not used in this function
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [canvasRef]);

  const draw = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#33ff33';
    ctx.font = `${fontSize}px monospace`;

    drops.forEach((drop, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const opacity = Math.random() * 0.5 + 0.5;
      ctx.fillStyle = `rgba(51, 255, 51, ${opacity})`;
      ctx.fillText(char, i * fontSize, drop * fontSize);

      if (drop * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
  }, [canvasRef]);

  const startMatrix = useCallback(() => {
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, [draw]);

  return { initMatrix, startMatrix };
};