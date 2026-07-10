'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export default function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000, label, detail }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const numericEnd = parseInt(String(end).replace(/[^0-9]/g, ''), 10);
    if (!numericEnd || numericEnd <= 0) {
      setCount(end);
      return;
    }

    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(numericEnd * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  const display = typeof end === 'string' && isNaN(end) ? end : `${prefix}${count}${suffix}`;

  return (
    <div ref={ref} className="text-center p-6">
      <div className="counter-value" aria-label={`${end}${suffix}`}>
        {inView ? display : `${prefix}0${suffix}`}
      </div>
      {label && (
        <p className="mt-3 font-condensed text-sm font-bold uppercase tracking-[0.2em] text-[#f5d76e]">
          {label}
        </p>
      )}
      {detail && (
        <p className="mt-2 text-sm text-white/50 leading-relaxed">{detail}</p>
      )}
    </div>
  );
}
