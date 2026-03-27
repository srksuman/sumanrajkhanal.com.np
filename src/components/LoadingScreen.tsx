import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const progress = useMotionValue(0);
  const displayProgress = useTransform(progress, (v) => Math.round(v));
  const barScaleX = useTransform(progress, [0, 100], [0, 1]);
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    const unsubscribe = displayProgress.on('change', (v) => setDisplayVal(v));
    return unsubscribe;
  }, [displayProgress]);

  const stableOnComplete = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    let start: number | null = null;
    const duration = 2200;

    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(t);
      progress.set(eased * 100);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(stableOnComplete, 600);
        }, 400);
      }
    };

    requestAnimationFrame(animate);
  }, [stableOnComplete, progress]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <motion.div
            className="loading-counter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {displayVal}%
          </motion.div>

          <motion.div
            className="loading-name"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Suman Raj Khanal
          </motion.div>

          <div className="loading-bar">
            <motion.div
              className="loading-bar-fill"
              style={{ scaleX: barScaleX }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
