'use client';

import * as React from 'react';
import { Search, SlidersHorizontal, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SeverityBadge } from '@/components/shared/severity-badge';
import { cn } from '@/lib/utils';
import type { Severity } from '@/lib/types';
import { toast } from 'sonner';

interface FraudFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  severity: string;
  onSeverityChange: (value: string) => void;
  activityType: string;
  onActivityTypeChange: (value: string) => void;
}

export function FraudFilters({
  search,
  onSearchChange,
  severity,
  onSeverityChange,
  activityType,
  onActivityTypeChange,
}: FraudFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users, IPs, payments, products..."
          className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex items-center gap-2">
        <Select value={severity} onValueChange={onSeverityChange}>
          <SelectTrigger className="h-10 w-[140px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={activityType} onValueChange={onActivityTypeChange}>
          <SelectTrigger className="h-10 w-[150px]">
            <SelectValue placeholder="Activity Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="rings">Fraud Rings</SelectItem>
            <SelectItem value="reviews">Suspicious Reviews</SelectItem>
            <SelectItem value="transactions">Transactions</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => toast.success('Filters exported')}
          title="Export"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
