import { useEffect, useState } from 'react';

interface FloatingIcon {
  id: number;
  symbol: string;
  x: number;
  y: number;
  moveX: number;
  moveY: number;
}

export const FloatingIcons = () => {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);
  const matrixSymbols = ['∆', '◊', '○', '□', '∇', '×', '+'];

  useEffect(() => {
    const createIcon = () => {
      const id = Date.now();
      
      // Ensure icons start within viewport with some padding
      const padding = 50; // Add padding to prevent icons from appearing at edges
      const maxWidth = window.innerWidth - padding;
      const maxHeight = window.innerHeight - padding;
      
      const startX = Math.random() * (maxWidth - padding) + padding/2;
      const startY = Math.random() * (maxHeight - padding) + padding/2;
      
      // Reduce movement range to prevent going off-screen
      const maxMove = 100;
      const moveX = (Math.random() - 0.5) * maxMove;
      const moveY = (Math.random() - 0.5) * maxMove;

      const newIcon: FloatingIcon = {
        id,
        symbol: matrixSymbols[Math.floor(Math.random() * matrixSymbols.length)],
        x: startX,
        y: startY,
        moveX,
        moveY,
      };

      setIcons((prev) => [...prev, newIcon]);
      setTimeout(() => {
        setIcons((prev) => prev.filter((icon) => icon.id !== id));
      }, 20000);
    };

    const interval = setInterval(createIcon, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute text-2xl opacity-30 text-matrix-green animate-float"
          style={
            {
              left: `${Math.max(0, Math.min(icon.x, window.innerWidth - 50))}px`,
              top: `${Math.max(0, Math.min(icon.y, window.innerHeight - 50))}px`,
              '--moveX': `${icon.moveX}px`,
              '--moveY': `${icon.moveY}px`,
              transform: `translate(var(--moveX, 0), var(--moveY, 0))`,
              animation: 'float 20s ease-in-out infinite',
            } as React.CSSProperties
          }
        >
          {icon.symbol}
        </div>
      ))}
    </div>
  );
};