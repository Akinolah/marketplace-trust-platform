'use client';

import * as React from 'react';
import { Calendar, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DATE_RANGES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DateRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
      {DATE_RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            value === range.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

interface DashboardActionsProps {
  range: string;
  onRangeChange: (value: string) => void;
  onRefresh: () => void;
  isFetching: boolean;
}

export function DashboardActions({
  range,
  onRangeChange,
  onRefresh,
  isFetching,
}: DashboardActionsProps) {
  return (
    <>
      <DateRangeSelector value={range} onChange={onRangeChange} />
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isFetching}
      >
        <RefreshCw className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')} />
        Refresh
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast.success('Report exported successfully')}
      >
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </>
  );
}
