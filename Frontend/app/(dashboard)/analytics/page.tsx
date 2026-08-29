'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { PageHeader } from '@/components/shared/page-header';
import { MetricCard } from '@/components/shared/metric-card';
import { ChartCard } from '@/components/shared/chart-card';
import { ChartSkeleton, MetricCardSkeleton } from '@/components/shared/skeletons';
import { EmptyState } from '@/components/shared/empty-state';
import { DateRangeSelector } from '@/components/dashboard/dashboard-actions';
import { useAnalytics } from '@/hooks/use-api';
import { formatNumber, formatCurrency, formatPercentage } from '@/lib/utils/format';
import {
  ArrowLeftRight,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Target,
  Users,
  BarChart3,
} from 'lucide-react';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
};

export default function AnalyticsPage() {
  const [range, setRange] = React.useState('30d');
  const { data, isLoading } = useAnalytics(range);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Marketplace Analytics" description="Understand performance, trust, fraud, and discovery trends." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const m = data.metrics;
  const t = data.trends;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace Analytics"
        description="Understand performance, trust, fraud, and discovery trends."
        actions={<DateRangeSelector value={range} onChange={setRange} />}
      />

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard title="Transactions" value={formatNumber(m.totalTransactions)} icon={ArrowLeftRight} trend={t.totalTransactions} statusText={t.totalTransactions.label} delay={0} />
        <MetricCard title="Fraud Prevented" value={formatNumber(m.fraudPrevented)} icon={ShieldAlert} trend={t.fraudPrevented} statusText={t.fraudPrevented.label} iconClassName="bg-destructive/10 text-destructive" delay={0.05} />
        <MetricCard title="Detection Rate" value={formatPercentage(m.fraudDetectionRate)} icon={ShieldCheck} trend={t.fraudDetectionRate} statusText={t.fraudDetectionRate.label} iconClassName="bg-success/10 text-success" delay={0.1} />
        <MetricCard title="Avg Trust Score" value={formatPercentage(m.averageTrustScore)} icon={TrendingUp} trend={t.averageTrustScore} statusText={t.averageTrustScore.label} delay={0.15} />
        <MetricCard title="Rec. Conversion" value={formatPercentage(m.recommendationConversion)} icon={Target} trend={t.recommendationConversion} statusText={t.recommendationConversion.label} iconClassName="bg-primary/10 text-primary" delay={0.2} />
        <MetricCard title="Active Users" value={formatNumber(m.activeUsers)} icon={Users} trend={t.activeUsers} statusText={t.activeUsers.label} iconClassName="bg-info/10 text-info" delay={0.25} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Fraud Detection Trend */}
        <ChartCard title="Fraud Detection Trend" description="Detected vs prevented fraud over time">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.fraudDetectionTrend.map((d) => ({ date: d.date.slice(5), detected: d.detected, prevented: d.prevented }))} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="detected" name="Detected" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="prevented" name="Prevented" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Trust Score Trend */}
        <ChartCard title="Marketplace Trust Score" description="Average trust score over time">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.trustScoreTrend.map((d) => ({ date: d.date.slice(5), score: d.score }))} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="trustArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="score" name="Trust Score" stroke="hsl(var(--chart-1))" fill="url(#trustArea)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recommendation Performance */}
        <ChartCard title="Recommendation Performance" description="Conversions by category">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.recommendationPerformance} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="conversions" name="Conversions" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Category Performance */}
        <ChartCard title="Product Category Performance" description="Revenue by category">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.categoryPerformance} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Fraud Severity */}
        <ChartCard title="Fraud Severity Distribution" description="Breakdown by severity level">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.fraudSeverity} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {data.fraudSeverity.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* User Activity */}
        <ChartCard title="User Activity" description="Active and new users over time">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.userActivity.map((d) => ({ date: d.date.slice(5), active: d.active, new: d.new }))} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="active" name="Active" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="new" name="New" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
