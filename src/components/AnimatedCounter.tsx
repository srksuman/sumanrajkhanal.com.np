import { useEffect, useRef, useState } from 'react';
import { useInView, motion, useMotionValue, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export default function AnimatedCounter({ value, suffix = '', duration = 2 }: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplayValue(v));
    return unsubscribe;
  }, [rounded]);

  useEffect(() => {
    if (!isInView) return;

    let start: number | null = null;
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / (duration * 1000), 1);
      const eased = easeOutQuart(t);
      motionVal.set(eased * value);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration, motionVal]);

  return (
    <motion.span ref={ref}>
      {displayValue}{suffix}
    </motion.span>
  );
}
