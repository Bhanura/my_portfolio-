'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
};

export default function FadeIn({ children, delay = 0, direction = 'up', className = '' }: FadeInProps) {
  const directionOffset = {
    up: 40,
    down: -40,
    left: 40,
    right: -40,
    none: 0,
  };

  const initialY = direction === 'up' || direction === 'down' ? directionOffset[direction] : 0;
  const initialX = direction === 'left' || direction === 'right' ? directionOffset[direction] : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: initialY, x: initialX }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.25, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
