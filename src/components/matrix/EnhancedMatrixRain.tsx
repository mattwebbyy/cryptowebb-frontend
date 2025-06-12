// src/components/matrix/EnhancedMatrixRain.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface MatrixCharacter {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
  isLeading: boolean;
  color: string;
}

interface EnhancedMatrixRainProps {
  density?: number;
  speed?: number;
  fontSize?: number;
  showGlitch?: boolean;
  interactive?: boolean;
  characters?: string;
  colors?: string[];
}

export const EnhancedMatrixRain: React.FC<EnhancedMatrixRainProps> = ({
  density = 0.8,
  speed = 1,
  fontSize = 14,
  showGlitch = true,
  interactive = true,
  characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?',
  colors = ['#33ff33', '#00ff00', '#00ff41', '#00ff82', '#00ffaa']
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const charactersArray = useRef<MatrixCharacter[]>([]);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Performance optimization: use RAF for smooth animations
  const [fps] = useState(60);
  const fpsInterval = useRef(1000 / fps);
  const lastTime = useRef(0);

  const getRandomCharacter = useCallback(() => {
    return characters[Math.floor(Math.random() * characters.length)];
  }, [characters]);

  const getRandomColor = useCallback(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, [colors]);

  const initializeCharacters = useCallback((canvas: HTMLCanvasElement) => {
    const columns = Math.floor(canvas.width / fontSize);
    charactersArray.current = [];

    for (let i = 0; i < columns * density; i++) {
      charactersArray.current.push({
        x: Math.floor(Math.random() * columns) * fontSize,
        y: Math.random() * canvas.height,
        speed: (Math.random() * 2 + 1) * speed,
        char: getRandomCharacter(),
        opacity: Math.random() * 0.8 + 0.2,
        isLeading: Math.random() > 0.7,
        color: getRandomColor()
      });
    }
  }, [density, fontSize, speed, getRandomCharacter, getRandomColor]);

  const triggerGlitch = useCallback(() => {
    if (!showGlitch) return;
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 150);
  }, [showGlitch]);

  const draw = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, currentTime: number) => {
    // FPS limiting
    if (currentTime - lastTime.current < fpsInterval.current) {
      return;
    }
    lastTime.current = currentTime;

    // Create trailing effect
    ctx.fillStyle = glitchEffect ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    charactersArray.current.forEach((char, index) => {
      // Update character position
      char.y += char.speed;
      
      // Reset character when it goes off screen
      if (char.y > canvas.height + fontSize) {
        char.y = -fontSize;
        char.x = Math.floor(Math.random() * (canvas.width / fontSize)) * fontSize;
        char.char = getRandomCharacter();
        char.speed = (Math.random() * 2 + 1) * speed;
        char.opacity = Math.random() * 0.8 + 0.2;
        char.isLeading = Math.random() > 0.7;
        char.color = getRandomColor();
      }

      // Interactive effect: characters react to mouse
      if (interactive) {
        const distanceToMouse = Math.sqrt(
          Math.pow(char.x - mousePosition.x, 2) + Math.pow(char.y - mousePosition.y, 2)
        );
        if (distanceToMouse < 100) {
          char.opacity = Math.min(1, char.opacity + 0.3);
          char.speed *= 1.5;
        }
      }

      // Randomly change character
      if (Math.random() > 0.98) {
        char.char = getRandomCharacter();
      }

      // Set drawing properties
      ctx.font = `${fontSize}px 'Courier New', monospace`;
      
      // Leading characters are brighter
      if (char.isLeading) {
        ctx.shadowBlur = glitchEffect ? 20 : 10;
        ctx.shadowColor = char.color;
        ctx.fillStyle = char.color;
        ctx.globalAlpha = char.opacity;
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = char.color;
        ctx.globalAlpha = char.opacity * 0.6;
      }

      // Glitch effect
      if (glitchEffect && Math.random() > 0.8) {
        ctx.fillStyle = '#ff0000';
        char.x += (Math.random() - 0.5) * 10;
      }

      // Draw character
      ctx.fillText(char.char, char.x, char.y);
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    });
  }, [fontSize, speed, getRandomCharacter, getRandomColor, interactive, mousePosition, glitchEffect]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });

    // Occasionally trigger glitch effect on mouse movement
    if (Math.random() > 0.95) {
      triggerGlitch();
    }
  }, [interactive, triggerGlitch]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeCharacters(canvas);
  }, [initializeCharacters]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize characters
    initializeCharacters(canvas);

    // Animation loop
    const animate = (currentTime: number) => {
      draw(canvas, ctx, currentTime);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Event listeners
    window.addEventListener('resize', handleResize);
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    // Random glitch effects
    let glitchInterval: NodeJS.Timeout;
    if (showGlitch) {
      glitchInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          triggerGlitch();
        }
      }, 5000 + Math.random() * 10000);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      if (glitchInterval) {
        clearInterval(glitchInterval);
      }
    };
  }, [draw, handleResize, handleMouseMove, initializeCharacters, interactive, showGlitch, triggerGlitch]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${
        glitchEffect ? 'animate-pulse' : ''
      }`}
      style={{
        background: 'transparent',
        filter: glitchEffect ? 'hue-rotate(180deg) saturate(2)' : 'none',
        transition: 'filter 0.1s ease-out'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
};

export default EnhancedMatrixRain;