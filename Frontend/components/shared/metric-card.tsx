'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { Trend } from '@/lib/types';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: Trend;
  statusText?: string;
  iconClassName?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  statusText,
  iconClassName,
  delay = 0,
}: MetricCardProps) {
  const TrendIcon =
    trend?.direction === 'up'
      ? TrendingUp
      : trend?.direction === 'down'
      ? TrendingDown
      : Minus;

  const trendColor =
    trend?.direction === 'up'
      ? 'text-success'
      : trend?.direction === 'down'
      ? 'text-destructive'
      : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
            </div>
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                iconClassName || 'bg-primary/10 text-primary'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
          {(trend || statusText) && (
            <div className="mt-3 flex items-center gap-2 text-xs">
              {trend && (
                <span className={cn('flex items-center gap-1 font-medium', trendColor)}>
                  <TrendIcon className="h-3.5 w-3.5" />
                  {trend.direction === 'up' ? '+' : ''}
                  {trend.value}%
                </span>
              )}
              {statusText && (
                <span className="text-muted-foreground">{statusText}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
