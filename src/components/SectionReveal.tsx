import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function SectionReveal({ children, delay = 0, className = '' }: SectionRevealProps) {
  const clampedDelay = Math.min(delay, 0.15);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15, margin: '-30px' }}
      transition={{ duration: 0.4, delay: clampedDelay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

