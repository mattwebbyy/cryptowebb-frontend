// src/components/matrix/MatrixRain.tsx
import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils'; // Import the cn utility

interface MatrixRainProps {
  className?: string; // Define props to accept className
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ className }) => { // Destructure className from props
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix rain configuration
    const chars =
      '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    // Animation loop
    const draw = () => {
      // Black background with opacity for fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text
      // ctx.fillStyle = '#33ff33'; // Overridden by character-specific opacity below
      ctx.font = `${fontSize}px monospace`;

      // Drawing the characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        // Random opacity for more dynamic effect
        const opacity = Math.random() * 0.5 + 0.5; // Opacity between 0.5 and 1.0
        ctx.fillStyle = `rgba(51, 255, 51, ${opacity})`; // Green with variable opacity

        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset when reaching bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount

  return (
    <canvas
      ref={canvasRef}
      // Use cn to merge default classes with the passed className
      className={cn("fixed top-0 left-0 w-full h-full -z-10", className)}
      style={{ background: 'black' }} // Explicit background for the canvas itself
    />
  );
};