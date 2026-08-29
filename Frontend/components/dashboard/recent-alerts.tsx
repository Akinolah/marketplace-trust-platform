'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeverityBadge } from '@/components/shared/severity-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { TableSkeleton } from '@/components/shared/skeletons';
import { formatRelativeTime } from '@/lib/utils/format';
import { useRouter } from 'next/navigation';
import type { FraudAlert } from '@/lib/types';

interface RecentAlertsProps {
  alerts?: FraudAlert[];
  isLoading: boolean;
}

export function RecentAlerts({ alerts, isLoading }: RecentAlertsProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Fraud Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <TableSkeleton rows={4} />
        </CardContent>
      </Card>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Fraud Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<ShieldCheck className="h-6 w-6 text-success" />}
            title="Marketplace looks healthy"
            description="No suspicious activity has been detected recently."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">Recent Fraud Alerts</CardTitle>
        </div>
        <button
          onClick={() => router.push('/fraud')}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </button>
      </CardHeader>
      <CardContent className="space-y-1">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
          >
            <SeverityBadge severity={alert.severity} />
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium">{alert.title}</p>
              <p className="text-xs text-muted-foreground">{alert.description}</p>
              <p className="text-[11px] text-muted-foreground/70">
                {formatRelativeTime(alert.timestamp)}
              </p>
            </div>
            <button
              onClick={() => router.push('/fraud')}
              className="shrink-0 text-xs font-medium text-primary hover:underline"
            >
              {alert.actionLabel} →
            </button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
