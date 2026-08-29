'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { useTransactions } from '@/hooks/use-api';
import { useDebounce } from '@/hooks/use-debounce';
import { Search, CreditCard } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format';
import type { Transaction } from '@/lib/types';

export default function TransactionsPage() {
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const { data: transactions, isLoading, error, refetch } = useTransactions();

  const filtered = React.useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => {
      const searchMatch = !debouncedSearch ||
        t.id.includes(debouncedSearch) ||
        t.userId.includes(debouncedSearch) ||
        t.productName.toLowerCase().includes(debouncedSearch.toLowerCase());
      const statusMatch = statusFilter === 'all' || t.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [transactions, debouncedSearch, statusFilter]);

  const columns = [
    {
      key: 'id',
      header: 'Transaction ID',
      render: (t: Transaction) => <span className="font-mono-id text-xs">{t.id}</span>,
    },
    {
      key: 'productName',
      header: 'Product',
      render: (t: Transaction) => <span className="font-medium">{t.productName}</span>,
    },
    {
      key: 'userId',
      header: 'User',
      render: (t: Transaction) => <span className="font-mono-id text-xs text-muted-foreground">{t.userId}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (t: Transaction) => <span className="font-medium">{formatCurrency(t.amount)}</span>,
    },
    {
      key: 'paymentMethod',
      header: 'Payment',
      render: (t: Transaction) => <span className="font-mono-id text-xs">{t.paymentMethod}</span>,
    },
    {
      key: 'fraudRisk',
      header: 'Fraud Risk',
      render: (t: Transaction) => (
        <span className={`font-semibold ${t.fraudRisk >= 70 ? 'text-destructive' : t.fraudRisk >= 40 ? 'text-warning' : 'text-success'}`}>
          {t.fraudRisk}%
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (t: Transaction) => <span className="text-xs text-muted-foreground">{formatRelativeTime(t.date)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (t: Transaction) => <StatusBadge status={t.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" description="Monitor marketplace transactions and fraud risk indicators." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID, user, or product..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary">
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
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
                icon={<CreditCard className="h-6 w-6" />}
                title="No transactions found"
                description="Try a different search or adjust your filters."
              />
            }
          />
        </div>
      )}
    </div>
  );
}
