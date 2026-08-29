'use client';

import * as React from 'react';
import {
  Users,
  Package,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { MetricCard } from '@/components/shared/metric-card';
import { MetricCardSkeleton } from '@/components/shared/skeletons';
import { formatNumber, formatPercentage } from '@/lib/utils/format';
import type { DashboardStats } from '@/lib/types';

interface DashboardMetricsProps {
  data?: DashboardStats;
  isLoading: boolean;
}

export function DashboardMetrics({ data, isLoading }: DashboardMetricsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Users"
        value={formatNumber(data.users)}
        icon={Users}
        trend={data.trends.users}
        statusText={data.trends.users.label}
        delay={0}
      />
      <MetricCard
        title="Products"
        value={formatNumber(data.products)}
        icon={Package}
        trend={data.trends.products}
        statusText={data.trends.products.label}
        iconClassName="bg-success/10 text-success"
        delay={0.05}
      />
      <MetricCard
        title="Active Fraud Alerts"
        value={data.fraudAlerts}
        icon={ShieldAlert}
        trend={data.trends.fraud}
        statusText={data.trends.fraud.label}
        iconClassName="bg-destructive/10 text-destructive"
        delay={0.1}
      />
      <MetricCard
        title="Trust Score"
        value={formatPercentage(data.trustScore)}
        icon={ShieldCheck}
        trend={data.trends.trust}
        statusText={data.trends.trust.label}
        iconClassName="bg-primary/10 text-primary"
        delay={0.15}
      />
    </div>
  );
}
