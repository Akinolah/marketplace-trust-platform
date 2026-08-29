import * as React from 'react';
import { cn } from '@/lib/utils';

interface RiskScoreProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function RiskScore({ value, className, showLabel = true }: RiskScoreProps) {
  const color =
    value >= 80
      ? 'text-destructive'
      : value >= 60
      ? 'text-warning'
      : value >= 40
      ? 'text-primary'
      : 'text-success';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative h-10 w-10 shrink-0">
        <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${(value / 100) * 94.2} 94.2`}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <span className={cn('absolute inset-0 flex items-center justify-center text-xs font-bold', color)}>
          {value}
        </span>
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">Risk Score</span>
          <span className={cn('text-sm font-semibold', color)}>{value}%</span>
        </div>
      )}
    </div>
  );
}
