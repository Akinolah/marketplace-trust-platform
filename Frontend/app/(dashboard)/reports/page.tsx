'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { useReports } from '@/hooks/use-api';
import {
  FileText,
  Download,
  Plus,
  ShieldAlert,
  TrendingUp,
  ShieldCheck,
  Package,
  Users,
} from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import type { ReportItem } from '@/lib/types';

const REPORT_ICONS: Record<ReportItem['type'], typeof FileText> = {
  fraud: ShieldAlert,
  analytics: TrendingUp,
  trust: ShieldCheck,
  product: Package,
  user: Users,
};

export default function ReportsPage() {
  const { data: reports, isLoading, error, refetch } = useReports();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and download marketplace intelligence reports."
        actions={
          <Button onClick={() => toast.info('Report generation started. You will be notified when it is ready.')}>
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        }
      />

      {error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : !reports || reports.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No reports yet"
          description="Generate your first marketplace intelligence report to get started."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, i) => {
            const Icon = REPORT_ICONS[report.type];
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className="flex flex-col rounded-lg border bg-card p-5 transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <StatusBadge status={report.status} />
                  </div>
                  <h3 className="mb-1 font-semibold leading-tight">{report.name}</h3>
                  <p className="mb-1 text-xs capitalize text-muted-foreground">{report.type} report</p>
                  <p className="mb-4 text-xs text-muted-foreground">
                    Generated: {formatDate(report.dateGenerated)}
                    {report.size !== '—' && ` - ${report.size}`}
                  </p>
                  {report.status === 'ready' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto w-full"
                      onClick={() => toast.success(`Downloading "${report.name}"...`)}
                    >
                      <Download className="mr-2 h-3.5 w-3.5" />
                      Download
                    </Button>
                  ) : report.status === 'generating' ? (
                    <Button variant="outline" size="sm" disabled className="mt-auto w-full">
                      Generating...
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" disabled className="mt-auto w-full">
                      Scheduled
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
