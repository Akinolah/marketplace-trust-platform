'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/page-header';
import { DashboardActions } from '@/components/dashboard/dashboard-actions';
import { DashboardMetrics } from '@/components/dashboard/dashboard-metrics';
import {
  MarketplaceHealthChart,
  TrustDistributionChart,
} from '@/components/dashboard/dashboard-charts';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentAlerts } from '@/components/dashboard/recent-alerts';
import { useDashboardStats, useFraudTrends } from '@/hooks/use-api';

export default function DashboardPage() {
  const [range, setRange] = React.useState('30d');
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching, refetch } = useDashboardStats(range);
  const { data: trendData } = useFraudTrends(range);

  const healthData = React.useMemo(() => {
    if (!trendData) return [];
    return trendData.map((t) => ({
      date: t.date.slice(5),
      trust: 100 - t.detectionRate,
      fraud: t.alerts,
      transactions: t.suspiciousTransactions * 3,
      suspicious: t.alerts,
    }));
  }, [trendData]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, Admin`}
        description="Here's what's happening across your marketplace today."
        actions={
          <DashboardActions
            range={range}
            onRangeChange={setRange}
            onRefresh={() => refetch()}
            isFetching={isFetching}
          />
        }
      />

      <DashboardMetrics data={data} isLoading={isLoading} />

      <div className="grid gap-4 lg:grid-cols-3">
        <MarketplaceHealthChart data={healthData} isLoading={isLoading} />
        <TrustDistributionChart
          data={data?.trustDistribution || { trusted: 0, moderate: 0, suspicious: 0, critical: 0 }}
          isLoading={isLoading}
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <QuickActions />
      </div>

      <RecentAlerts alerts={data?.recentAlerts} isLoading={isLoading} />
    </div>
  );
}
