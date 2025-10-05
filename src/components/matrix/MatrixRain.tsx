// src/components/matrix/MatrixRain.tsx
import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils'; // Import the cn utility
import { useTheme } from '../../contexts/ThemeContext';

interface MatrixRainProps {
  className?: string; // Define props to accept className
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ className }) => { // Destructure className from props
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

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
      // Theme-appropriate background for fade effect
      const isLightMode = theme.mode === 'light';
      if (isLightMode) {
        // Light mode: white background with fade
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      } else {
        // Dark mode: black background with fade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Theme-appropriate text color
      ctx.font = `${fontSize}px monospace`;

      // Drawing the characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        // Slightly lower opacity as requested
        const opacity = Math.random() * 0.3 + 0.4; // Opacity between 0.4 and 0.7 (more subtle)
        
        if (isLightMode) {
          // Light mode: darker green/teal for visibility on white
          ctx.fillStyle = `rgba(13, 115, 119, ${opacity})`; // Dark teal
        } else {
          // Dark mode: bright green Matrix style
          ctx.fillStyle = `rgba(51, 255, 51, ${opacity})`;
        }

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
  }, [theme.mode]); // Re-run when theme changes

  return (
    <canvas
      ref={canvasRef}
      // Use cn to merge default classes with the passed className
      className={cn("fixed top-0 left-0 w-full h-full pointer-events-none", className)}
      style={{ 
        background: theme.mode === 'light' ? '#ffffff' : '#000000',
        zIndex: -999999,
        position: 'fixed'
      }} // Theme-appropriate background
    />
  );
};