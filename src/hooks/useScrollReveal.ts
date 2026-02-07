import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollRevealOptions {
  /** Threshold for triggering (0-1). Default: 0.15 */
  threshold?: number;
  /** Root margin for early/late triggering. Default: '0px 0px -50px 0px' */
  rootMargin?: string;
  /** Only animate once. Default: true */
  once?: boolean;
  /** Delay in ms before marking visible (for staggering). Default: 0 */
  delay?: number;
}

/**
 * Hook for viewport-based scroll reveal animations.
 * Returns a ref to attach to the element and a boolean for visibility.
 * Respects prefers-reduced-motion automatically.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -50px 0px',
  once = true,
  delay = 0,
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // If reduced motion is preferred, show everything immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, delay, prefersReducedMotion]);

  return { ref, isVisible, prefersReducedMotion };
}
