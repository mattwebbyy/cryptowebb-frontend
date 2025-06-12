// src/components/ui/GlitchEffects.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Glitch Button Component
export const GlitchButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  glitchIntensity?: 'low' | 'medium' | 'high';
}> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  glitchIntensity = 'medium'
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [hoverEffects, setHoverEffects] = useState(false);
  const glitchTimeoutRef = useRef<NodeJS.Timeout>();

  const variants = {
    primary: 'bg-teal-600 dark:bg-matrix-green text-white dark:text-black border-teal-600 dark:border-matrix-green',
    secondary: 'bg-transparent border-2 border-teal-600 dark:border-matrix-green text-teal-600 dark:text-matrix-green',
    ghost: 'bg-transparent text-teal-600 dark:text-matrix-green hover:bg-teal-600/10 dark:hover:bg-matrix-green/10'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const intensitySettings = {
    low: { duration: 100, frequency: 0.3 },
    medium: { duration: 150, frequency: 0.5 },
    high: { duration: 200, frequency: 0.7 }
  };

  const triggerGlitch = () => {
    if (disabled) return;
    
    setIsGlitching(true);
    
    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current);
    }
    
    glitchTimeoutRef.current = setTimeout(() => {
      setIsGlitching(false);
    }, intensitySettings[glitchIntensity].duration);
  };

  useEffect(() => {
    return () => {
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current);
      }
    };
  }, []);

  const glitchVariants = {
    normal: {
      x: 0,
      y: 0,
      filter: 'none',
      textShadow: 'none'
    },
    glitch: {
      x: [0, -2, 2, -1, 1, 0],
      y: [0, 1, -1, 1, -1, 0],
      filter: [
        'none',
        'hue-rotate(90deg)',
        'hue-rotate(180deg)',
        'hue-rotate(270deg)',
        'hue-rotate(360deg)',
        'none'
      ],
      textShadow: [
        'none',
        '2px 0 #ff0000, -2px 0 #00ffff',
        '1px 0 #ff0000, -1px 0 #00ffff',
        '2px 0 #ff0000, -2px 0 #00ffff',
        'none'
      ],
      transition: {
        duration: intensitySettings[glitchIntensity].duration / 1000,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden font-mono font-semibold rounded-md transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
        ${className}
      `}
      onClick={() => {
        triggerGlitch();
        onClick?.();
      }}
      onMouseEnter={() => {
        setHoverEffects(true);
        if (Math.random() < intensitySettings[glitchIntensity].frequency) {
          triggerGlitch();
        }
      }}
      onMouseLeave={() => setHoverEffects(false)}
      variants={glitchVariants}
      animate={isGlitching ? 'glitch' : 'normal'}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Background glitch effect */}
      <AnimatePresence>
        {hoverEffects && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-matrix-green/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      {/* Glitch overlay */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            className="absolute inset-0 bg-red-500/20 mix-blend-multiply"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: intensitySettings[glitchIntensity].duration / 1000 }}
          />
        )}
      </AnimatePresence>

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Glitch Text Component
export const GlitchText: React.FC<{
  children: string;
  className?: string;
  trigger?: boolean;
  continuous?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}> = ({
  children,
  className = '',
  trigger = false,
  continuous = false,
  intensity = 'medium'
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [displayText, setDisplayText] = useState(children);
  const intervalRef = useRef<NodeJS.Timeout>();
  const glitchTimeoutRef = useRef<NodeJS.Timeout>();

  const intensitySettings = {
    low: { duration: 200, charChangeRate: 0.1, interval: 5000 },
    medium: { duration: 300, charChangeRate: 0.2, interval: 3000 },
    high: { duration: 500, charChangeRate: 0.3, interval: 2000 }
  };

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';

  const createGlitchedText = (text: string, intensity: number) => {
    return text
      .split('')
      .map(char => {
        if (Math.random() < intensity && char !== ' ') {
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
      })
      .join('');
  };

  const triggerGlitch = () => {
    setIsGlitching(true);
    const settings = intensitySettings[intensity];

    // Create glitch animation sequence
    let step = 0;
    const maxSteps = 5;
    
    const glitchStep = () => {
      if (step < maxSteps) {
        setDisplayText(createGlitchedText(children, settings.charChangeRate));
        step++;
        setTimeout(glitchStep, settings.duration / maxSteps);
      } else {
        setDisplayText(children);
        setIsGlitching(false);
      }
    };

    glitchStep();
  };

  // Trigger glitch effect
  useEffect(() => {
    if (trigger) {
      triggerGlitch();
    }
  }, [trigger]);

  // Continuous glitch effect
  useEffect(() => {
    if (continuous) {
      const settings = intensitySettings[intensity];
      intervalRef.current = setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance to glitch
          triggerGlitch();
        }
      }, settings.interval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [continuous, intensity]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.span
      className={`inline-block ${className}`}
      animate={isGlitching ? {
        textShadow: [
          'none',
          '2px 0 #ff0000, -2px 0 #00ffff',
          '1px 0 #ff0000, -1px 0 #00ffff',
          'none'
        ],
        filter: [
          'none',
          'hue-rotate(90deg)',
          'hue-rotate(180deg)',
          'none'
        ]
      } : {}}
      transition={{ duration: 0.1 }}
    >
      {displayText}
    </motion.span>
  );
};

// Scanning Line Effect
export const ScanningLine: React.FC<{
  height?: string;
  className?: string;
  speed?: number;
  color?: string;
}> = ({
  height = 'h-full',
  className = '',
  speed = 2,
  color = 'bg-teal-600 dark:bg-matrix-green'
}) => {
  return (
    <div className={`relative overflow-hidden ${height} ${className}`}>
      <motion.div
        className={`absolute top-0 left-0 w-full h-0.5 ${color} opacity-80`}
        style={{
          boxShadow: `0 0 10px currentColor`,
        }}
        animate={{
          y: ['0%', '100%', '0%']
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};

// Matrix Code Rain Effect (Lightweight)
export const MatrixCodeBlock: React.FC<{
  width?: string;
  height?: string;
  density?: number;
  className?: string;
}> = ({
  width = 'w-full',
  height = 'h-32',
  density = 0.1,
  className = ''
}) => {
  const [characters, setCharacters] = useState<string[]>([]);
  const chars = '01アイウエオカキクケコ';

  useEffect(() => {
    const generateChars = () => {
      const charCount = Math.floor(100 * density);
      const newChars = Array.from({ length: charCount }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      );
      setCharacters(newChars);
    };

    generateChars();
    const interval = setInterval(generateChars, 2000);

    return () => clearInterval(interval);
  }, [density]);

  return (
    <div className={`relative overflow-hidden ${width} ${height} ${className}`}>
      <div className="absolute inset-0 flex flex-wrap content-start opacity-20">
        {characters.map((char, index) => (
          <motion.span
            key={index}
            className="text-xs font-mono text-teal-600 dark:text-matrix-green"
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [0, 20, 40]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

// Particle System
export const ParticleSystem: React.FC<{
  particleCount?: number;
  className?: string;
  color?: string;
}> = ({
  particleCount = 50,
  className = '',
  color = 'bg-teal-600 dark:bg-matrix-green'
}) => {
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 5
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${color} opacity-60`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeOut',
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

// Terminal Window Effect
export const TerminalWindow: React.FC<{
  children: React.ReactNode;
  title?: string;
  className?: string;
}> = ({
  children,
  title = 'terminal',
  className = ''
}) => {
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bg-black/90 border border-teal-600 dark:border-matrix-green rounded-lg overflow-hidden font-mono ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-teal-600 dark:border-matrix-green">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm text-teal-600 dark:text-matrix-green">{title}</span>
        </div>
        <ScanningLine height="h-4" speed={1} />
      </div>

      {/* Terminal Content */}
      <div className="p-4 text-teal-600 dark:text-matrix-green relative">
        {children}
        {isTyping && (
          <motion.span
            className="inline-block w-2 h-4 bg-teal-600 dark:bg-matrix-green ml-1"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
};

export default {
  GlitchButton,
  GlitchText,
  ScanningLine,
  MatrixCodeBlock,
  ParticleSystem,
  TerminalWindow
};