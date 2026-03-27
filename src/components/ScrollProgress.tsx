import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
