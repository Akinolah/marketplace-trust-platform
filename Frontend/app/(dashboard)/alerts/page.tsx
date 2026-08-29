'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/shared/page-header';
import { SeverityBadge } from '@/components/shared/severity-badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { useAlerts } from '@/hooks/use-api';
import { useDebounce } from '@/hooks/use-debounce';
import { Search, Bell, Check, BellOff } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/format';
import { toast } from 'sonner';
import type { AlertItem } from '@/lib/types';

export default function AlertsPage() {
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [severityFilter, setSeverityFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const { data: alerts, isLoading, error, refetch } = useAlerts();

  const filtered = React.useMemo(() => {
    if (!alerts) return [];
    return alerts.filter((a) => {
      const searchMatch = !debouncedSearch ||
        a.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        a.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        a.category.toLowerCase().includes(debouncedSearch.toLowerCase());
      const severityMatch = severityFilter === 'all' || a.severity === severityFilter;
      const statusMatch = statusFilter === 'all' || a.status === statusFilter;
      return searchMatch && severityMatch && statusMatch;
    });
  }, [alerts, debouncedSearch, severityFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader title="Alerts" description="View and manage all marketplace security alerts." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary">
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary">
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BellOff className="h-6 w-6 text-success" />}
          title="No alerts found"
          description="No alerts match your current filters. Your marketplace may be healthy."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <div className="flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={alert.severity} />
                    <StatusBadge status={alert.status} />
                    <span className="text-xs text-muted-foreground">{alert.category}</span>
                  </div>
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground/70">{formatRelativeTime(alert.timestamp)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {alert.status !== 'resolved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success('Alert acknowledged')}
                    >
                      <Check className="mr-1 h-3.5 w-3.5" />
                      Acknowledge
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.success('Alert resolved')}
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
