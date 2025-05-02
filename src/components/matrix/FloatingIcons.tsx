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
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      const moveX = (Math.random() - 0.5) * 200;
      const moveY = (Math.random() - 0.5) * 200;

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
    <div className="absolute inset-0 pointer-events-none z-[1]">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute text-2xl opacity-30 float"
          style={
            {
              left: `${icon.x}px`,
              top: `${icon.y}px`,
              '--moveX': `${icon.moveX}px`,
              '--moveY': `${icon.moveY}px`,
            } as React.CSSProperties
          }
        >
          {icon.symbol}
        </div>
      ))}
    </div>
  );
};
