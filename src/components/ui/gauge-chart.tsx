
'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface GaugeChartProps {
  value: number; // A value between 0 and 100
  label?: string;
  children?: ReactNode;
  showValue?: boolean;
  gaugePrimaryColor?: string;
  gaugeSecondaryColor?: string;
}

const GAUGE_WIDTH = 150;
const GAUGE_HEIGHT = 75;
const STROKE_WIDTH = 12;
const RADIUS = (GAUGE_WIDTH - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = Math.PI * RADIUS;

export function GaugeChart({
  value,
  label,
  children,
  showValue = false,
  gaugePrimaryColor = 'hsl(var(--primary))',
  gaugeSecondaryColor = 'hsl(var(--muted))',
}: GaugeChartProps) {
  const percentage = Math.min(Math.max(value, 0), 100);
  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[200px]">
      <svg width={GAUGE_WIDTH} height={GAUGE_HEIGHT + STROKE_WIDTH / 2} viewBox={`0 0 ${GAUGE_WIDTH} ${GAUGE_HEIGHT + STROKE_WIDTH / 2}`}>
        {/* Background Arc */}
        <path
          d={`M ${STROKE_WIDTH / 2} ${GAUGE_HEIGHT} A ${RADIUS} ${RADIUS} 0 0 1 ${GAUGE_WIDTH - STROKE_WIDTH / 2} ${GAUGE_HEIGHT}`}
          fill="none"
          stroke={gaugeSecondaryColor}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />
        {/* Foreground Arc */}
        <motion.path
          d={`M ${STROKE_WIDTH / 2} ${GAUGE_HEIGHT} A ${RADIUS} ${RADIUS} 0 0 1 ${GAUGE_WIDTH - STROKE_WIDTH / 2} ${GAUGE_HEIGHT}`}
          fill="none"
          stroke={gaugePrimaryColor}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1,
            ease: 'circOut',
            delay: 0.2,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
        {children || (
          <motion.span
            className="text-3xl font-bold text-foreground font-headline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {showValue && `${Math.round(percentage)}%`}
          </motion.span>
        )}
        {label && <p className="text-xs text-muted-foreground">{label}</p>}
      </div>
    </div>
  );
}
