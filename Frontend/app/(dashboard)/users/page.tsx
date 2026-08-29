'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { RiskScore } from '@/components/shared/risk-score';
import { useUsers } from '@/hooks/use-api';
import { useDebounce } from '@/hooks/use-debounce';
import { Search, Users as UsersIcon, UserCheck } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils/format';
import type { MarketplaceUser } from '@/lib/types';

export default function UsersPage() {
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const { data: users, isLoading, error, refetch } = useUsers();

  const filtered = React.useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      const searchMatch = !debouncedSearch ||
        u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.id.includes(debouncedSearch);
      const statusMatch = statusFilter === 'all' || u.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [users, debouncedSearch, statusFilter]);

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (u: MarketplaceUser) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {u.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium">{u.name}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'id',
      header: 'User ID',
      render: (u: MarketplaceUser) => <span className="font-mono-id text-xs text-muted-foreground">{u.id}</span>,
    },
    {
      key: 'joinDate',
      header: 'Joined',
      render: (u: MarketplaceUser) => <span className="text-sm">{formatDate(u.joinDate)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (u: MarketplaceUser) => <StatusBadge status={u.status} />,
    },
    {
      key: 'trustScore',
      header: 'Trust Score',
      render: (u: MarketplaceUser) => (
        <span className={`font-semibold ${u.trustScore >= 75 ? 'text-success' : u.trustScore >= 50 ? 'text-warning' : 'text-destructive'}`}>
          {u.trustScore}
        </span>
      ),
    },
    {
      key: 'transactions',
      header: 'Transactions',
      render: (u: MarketplaceUser) => <span className="text-sm">{u.transactions}</span>,
    },
    {
      key: 'reviews',
      header: 'Reviews',
      render: (u: MarketplaceUser) => <span className="text-sm">{u.reviews}</span>,
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      render: (u: MarketplaceUser) => <span className="text-xs text-muted-foreground">{formatRelativeTime(u.lastActive)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage marketplace users and monitor their trust scores." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or user ID..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="flagged">Flagged</option>
          <option value="suspended">Suspended</option>
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
                icon={<UsersIcon className="h-6 w-6" />}
                title="No users found"
                description="Try a different search or adjust your filters."
              />
            }
          />
        </div>
      )}
    </div>
  );
}
