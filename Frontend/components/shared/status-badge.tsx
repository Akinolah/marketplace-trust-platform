'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'active' | 'inactive' | 'out-of-stock' | 'suspended' | 'flagged' | 'approved' | 'pending' | 'completed' | 'failed' | 'refunded' | 'new' | 'acknowledged' | 'resolved' | 'ready' | 'generating' | 'scheduled';

const STATUS_CONFIG: Record<StatusType, { label: string; classes: string; dot: string }> = {
  active: { label: 'Active', classes: 'bg-success/10 text-success', dot: 'bg-success' },
  inactive: { label: 'Inactive', classes: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
  'out-of-stock': { label: 'Out of Stock', classes: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
  suspended: { label: 'Suspended', classes: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
  flagged: { label: 'Flagged', classes: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  approved: { label: 'Approved', classes: 'bg-success/10 text-success', dot: 'bg-success' },
  pending: { label: 'Pending', classes: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  completed: { label: 'Completed', classes: 'bg-success/10 text-success', dot: 'bg-success' },
  failed: { label: 'Failed', classes: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
  refunded: { label: 'Refunded', classes: 'bg-info/10 text-info', dot: 'bg-info' },
  new: { label: 'New', classes: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  acknowledged: { label: 'Acknowledged', classes: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  resolved: { label: 'Resolved', classes: 'bg-success/10 text-success', dot: 'bg-success' },
  ready: { label: 'Ready', classes: 'bg-success/10 text-success', dot: 'bg-success' },
  generating: { label: 'Generating', classes: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  scheduled: { label: 'Scheduled', classes: 'bg-info/10 text-info', dot: 'bg-info' },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, classes: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.classes,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}
