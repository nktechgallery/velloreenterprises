'use client';

import { useInView } from 'react-intersection-observer';

export function useReveal(options = {}) {
  return useInView({
    threshold: 0.16,
    triggerOnce: true,
    rootMargin: '0px 0px -8% 0px',
    ...options,
  });
}
