// src/hooks/useAnimations.ts
import { useAnimate } from 'framer-motion';
import type { AnimationSequence } from 'framer-motion';

export const useAnimations = () => {
  const [scope, animate] = useAnimate();

  const glitchAnimation = async (element: HTMLElement) => {
    const sequence: AnimationSequence = [
      [element, { x: -10, opacity: 0, textShadow: 'none' }, { duration: 0.1 }],
      [
        element,
        { x: 10, opacity: 0.3, textShadow: '-2px 0 #ff0000, 2px 2px #0000ff' },
        { duration: 0.1 },
      ],
      [element, { x: -5, textShadow: '2px -2px #ff0000, -2px 2px #0000ff' }, { duration: 0.1 }],
      [element, { x: 5 }, { duration: 0.1 }],
      [
        element,
        { x: 0, opacity: 1, textShadow: '0 0 10px #33ff33' },
        { duration: 0.1, ease: 'easeOut' },
      ],
    ];

    await animate(sequence);
  };

  return { scope, glitchAnimation };
};
