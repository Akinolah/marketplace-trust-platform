'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { useManagedProducts } from '@/hooks/use-api';
import { useDebounce } from '@/hooks/use-debounce';
import { Search, Package } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils/format';
import type { ManagedProduct } from '@/lib/types';

export default function ProductsManagePage() {
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const { data: products, isLoading, error, refetch } = useManagedProducts();

  const filtered = React.useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const searchMatch = !debouncedSearch ||
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.id.includes(debouncedSearch);
      const categoryMatch = categoryFilter === 'all' || p.category === categoryFilter;
      const statusMatch = statusFilter === 'all' || p.status === statusFilter;
      return searchMatch && categoryMatch && statusMatch;
    });
  }, [products, debouncedSearch, categoryFilter, statusFilter]);

  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (p: ManagedProduct) => (
        <div>
          <p className="font-medium">{p.name}</p>
          <p className="font-mono-id text-xs text-muted-foreground">{p.id}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (p: ManagedProduct) => <span className="text-sm">{p.category}</span> },
    { key: 'price', header: 'Price', render: (p: ManagedProduct) => <span className="font-medium">{formatCurrency(p.price)}</span> },
    { key: 'stock', header: 'Stock', render: (p: ManagedProduct) => <span className={p.stock === 0 ? 'text-destructive' : ''}>{p.stock}</span> },
    { key: 'rating', header: 'Rating', render: (p: ManagedProduct) => <span className="text-sm">{p.rating}★</span> },
    { key: 'sales', header: 'Sales', render: (p: ManagedProduct) => <span className="text-sm">{formatNumber(p.sales)}</span> },
    {
      key: 'trustScore',
      header: 'Trust',
      render: (p: ManagedProduct) => (
        <span className={`font-semibold ${p.trustScore >= 85 ? 'text-success' : p.trustScore >= 70 ? 'text-warning' : 'text-destructive'}`}>
          {p.trustScore}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (p: ManagedProduct) => <StatusBadge status={p.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Manage your marketplace product catalog and trust scores." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary">
          <option value="all">All Categories</option>
          <option value="Audio">Audio</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
          <option value="Sports">Sports</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="out-of-stock">Out of Stock</option>
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
                icon={<Package className="h-6 w-6" />}
                title="No products found"
                description="Try a different search or adjust your filters."
              />
            }
          />
        </div>
      )}
    </div>
  );
}
