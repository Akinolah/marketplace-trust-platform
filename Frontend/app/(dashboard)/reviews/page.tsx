'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { useManagedReviews } from '@/hooks/use-api';
import { useDebounce } from '@/hooks/use-debounce';
import { Search, Star, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import type { ManagedReview } from '@/lib/types';

export default function ReviewsPage() {
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const { data: reviews, isLoading, error, refetch } = useManagedReviews();

  const filtered = React.useMemo(() => {
    if (!reviews) return [];
    return reviews.filter((r) => {
      const searchMatch = !debouncedSearch ||
        r.productName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.reviewerId.includes(debouncedSearch) ||
        r.content.toLowerCase().includes(debouncedSearch.toLowerCase());
      const statusMatch = statusFilter === 'all' || r.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [reviews, debouncedSearch, statusFilter]);

  const columns = [
    {
      key: 'productName',
      header: 'Product',
      render: (r: ManagedReview) => <span className="font-medium">{r.productName}</span>,
    },
    {
      key: 'reviewerId',
      header: 'Reviewer',
      render: (r: ManagedReview) => <span className="font-mono-id text-xs">{r.reviewerId}</span>,
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (r: ManagedReview) => (
        <div className="flex items-center gap-0.5">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span className="text-sm font-medium">{r.rating}</span>
        </div>
      ),
    },
    {
      key: 'content',
      header: 'Review',
      render: (r: ManagedReview) => (
        <p className="max-w-xs truncate text-sm text-muted-foreground">{r.content}</p>
      ),
    },
    {
      key: 'riskScore',
      header: 'Risk Score',
      render: (r: ManagedReview) => (
        <span className={`font-semibold ${r.riskScore >= 70 ? 'text-destructive' : r.riskScore >= 40 ? 'text-warning' : 'text-success'}`}>
          {r.riskScore}%
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (r: ManagedReview) => <span className="text-sm">{formatDate(r.date)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r: ManagedReview) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Monitor and moderate marketplace reviews." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, reviewer, or content..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary">
          <option value="all">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="rounded-lg border bg-card">
          <DataTable
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            emptyState={
              <EmptyState
                icon={<MessageSquare className="h-6 w-6" />}
                title="No reviews found"
                description="Try a different search or adjust your filters."
              />
            }
          />
        </div>
      )}
    </div>
  );
}
