'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartCard } from '@/components/shared/chart-card';
import { ChartSkeleton } from '@/components/shared/skeletons';
import { formatNumber } from '@/lib/utils/format';

interface MarketplaceHealthChartProps {
  data: { date: string; trust: number; fraud: number; transactions: number; suspicious: number }[];
  isLoading: boolean;
}

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

export function MarketplaceHealthChart({ data, isLoading }: MarketplaceHealthChartProps) {
  if (isLoading) return <ChartSkeleton className="lg:col-span-2" />;

  return (
    <ChartCard
      title="Marketplace Health"
      description="Trust score, fraud activity, and transaction trends"
      className="lg:col-span-2"
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="trustGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="trust"
            name="Trust Score"
            stroke="hsl(var(--chart-1))"
            fill="url(#trustGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="fraud"
            name="Fraud Activity"
            stroke="hsl(var(--chart-4))"
            fill="url(#fraudGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="suspicious"
            name="Suspicious Activity"
            stroke="hsl(var(--chart-3))"
            fill="none"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

interface TrustDistributionChartProps {
  data: { trusted: number; moderate: number; suspicious: number; critical: number };
  isLoading: boolean;
}

export function TrustDistributionChart({ data, isLoading }: TrustDistributionChartProps) {
  if (isLoading) return <ChartSkeleton />;

  const segments = [
    { label: 'Trusted', value: data.trusted, color: 'hsl(var(--success))' },
    { label: 'Moderate', value: data.moderate, color: 'hsl(var(--chart-3))' },
    { label: 'Suspicious', value: data.suspicious, color: 'hsl(var(--chart-4))' },
    { label: 'Critical', value: data.critical, color: 'hsl(var(--destructive))' },
  ];

  return (
    <ChartCard
      title="Trust Distribution"
      description="Marketplace trust breakdown"
    >
      <div className="space-y-4">
        {segments.map((seg) => (
          <div key={seg.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="font-medium">{seg.label}</span>
              </div>
              <span className="font-semibold">{seg.value}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${seg.value}%`, backgroundColor: seg.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
