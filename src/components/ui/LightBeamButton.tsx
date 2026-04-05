import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LightBeamButtonProps {
  children: React.ReactNode;
  className?: string;
  gradientColors?: [string, string, string];
  onClick?: () => void;
}

/**
 * LightBeamButton — a rotating light-beam border button.
 * Uses CSS @property for hardware-accelerated gradient rotation.
 */
export function LightBeamButton({
  children,
  className,
  onClick,
  gradientColors = ['#8b5cf6', '#06b6d4', '#8b5cf6'],
  ...props
}: LightBeamButtonProps) {
  const gradientString = `conic-gradient(from var(--gradient-angle), transparent 0%, ${gradientColors[0]} 40%, ${gradientColors[1]} 50%, transparent 60%, transparent 100%)`;

  return (
    <>
      <style>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-spin {
          from { --gradient-angle: 0deg; }
          to { --gradient-angle: 360deg; }
        }
        .animate-border-spin {
          animation: border-spin 2s linear infinite;
        }
      `}</style>

      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'relative overflow-hidden px-10 py-4 text-base font-medium tracking-wide',
          'text-white cursor-pointer group',
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>

        {/* Rotating gradient border */}
        <div
          className="absolute inset-0 animate-border-spin opacity-70 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: gradientString, borderRadius: 'inherit' }}
        />

        {/* Inner fill — keeps text readable */}
        <div
          className="absolute inset-[1.5px] bg-black/80 backdrop-blur-sm"
          style={{ borderRadius: 'inherit' }}
        />

        {/* Hover shine overlay */}
        <div
          className="absolute inset-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
            borderRadius: 'inherit',
          }}
        />
      </motion.button>
    </>
  );
}

export default LightBeamButton;
