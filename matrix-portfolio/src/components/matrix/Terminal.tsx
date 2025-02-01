
// src/components/matrix/Terminal.tsx
import { motion } from 'framer-motion';

interface TerminalProps {
  lines: string[];
}

export const Terminal = ({ lines }: TerminalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
      animate={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      transition={{ duration: 2, ease: 'steps(40)' }}
      className="max-w-2xl mx-auto text-left p-4 border border-matrix-green bg-matrix-dark/30"
    >
      {lines.map((line, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.5 }}
          className="my-2 leading-relaxed relative pl-6 before:content-['>'] before:absolute before:left-0 before:text-matrix-green/70"
        >
          {line}
        </motion.p>
      ))}
      <span className="inline-block w-2.5 h-[1.2em] bg-matrix-green align-middle ml-2 animate-blink" />
    </motion.div>
  );
};
