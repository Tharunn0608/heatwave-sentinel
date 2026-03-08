import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface CountUpNumberProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export default function CountUpNumber({ end, duration = 1.5, suffix = '', className = '' }: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const startTime = performance.now();
    const step = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setCount(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {count}{suffix}
    </motion.span>
  );
}
