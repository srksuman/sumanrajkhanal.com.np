import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { damping: 25, stiffness: 250 });
  const ringY = useSpring(cursorY, { damping: 25, stiffness: 250 });

  const dotScale = useMotionValue(1);
  const ringScale = useMotionValue(1);
  const smoothDotScale = useSpring(dotScale, { damping: 20, stiffness: 300 });
  const smoothRingScale = useSpring(ringScale, { damping: 20, stiffness: 300 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('project-card') ||
        target.classList.contains('skill-card') ||
        target.classList.contains('service-item')
      ) {
        dotScale.set(2);
        ringScale.set(1.5);
      }
    };

    const handleOut = () => {
      dotScale.set(1);
      ringScale.set(1);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, [cursorX, cursorY, dotScale, ringScale]);

  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return null;
  }

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{
          left: cursorX,
          top: cursorY,
          scale: smoothDotScale,
        }}
      />
      <motion.div
        className="cursor-ring"
        style={{
          left: ringX,
          top: ringY,
          scale: smoothRingScale,
        }}
      />
    </>
  );
}
