import { ReactNode, CSSProperties, forwardRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type AnimationType = 'fade-up' | 'fade-in' | 'scale' | 'slide-left' | 'slide-right';

interface ScrollRevealProps {
  children: ReactNode;
  /** Animation type. Default: 'fade-up' */
  animation?: AnimationType;
  /** Delay in ms for staggered effects. Default: 0 */
  delay?: number;
  /** Duration in ms. Default: 700 */
  duration?: number;
  /** Intersection threshold. Default: 0.15 */
  threshold?: number;
  /** Additional className */
  className?: string;
}

const animationStyles: Record<AnimationType, { hidden: CSSProperties; visible: CSSProperties }> = {
  'fade-up': {
    hidden: { opacity: 0, transform: 'translateY(40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'scale': {
    hidden: { opacity: 0, transform: 'scale(0.92)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'slide-left': {
    hidden: { opacity: 0, transform: 'translateX(-40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'slide-right': {
    hidden: { opacity: 0, transform: 'translateX(40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
};

/**
 * ScrollReveal wrapper — animates children when they enter the viewport.
 * 
 * Usage:
 *   <ScrollReveal animation="fade-up" delay={200}>
 *     <YourComponent />
 *   </ScrollReveal>
 * 
 * Customize: Change `animation`, `delay`, `duration`, and `threshold` props.
 */
export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className = '',
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold, delay });

  const styles = animationStyles[animation];
  const currentStyle: CSSProperties = {
    ...(isVisible ? styles.visible : styles.hidden),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={ref} style={currentStyle} className={className}>
      {children}
    </div>
  );
}
