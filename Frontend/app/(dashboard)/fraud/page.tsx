'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { FraudFilters } from '@/components/fraud/fraud-filters';
import { FraudRingCard } from '@/components/fraud/fraud-ring-card';
import { SuspiciousReviewCard } from '@/components/fraud/suspicious-review-card';
import { FraudTrends } from '@/components/fraud/fraud-trends';
import { InvestigationDrawer } from '@/components/fraud/investigation-drawer';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { FraudCardSkeleton } from '@/components/shared/skeletons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, ShieldAlert, BarChart3 } from 'lucide-react';
import { useFraudRings, useSuspiciousReviews, useFraudTrends } from '@/hooks/use-api';
import { toast } from 'sonner';
import type { FraudRing, Severity } from '@/lib/types';

export default function FraudPage() {
  const [search, setSearch] = React.useState('');
  const [severity, setSeverity] = React.useState('all');
  const [activityType, setActivityType] = React.useState('all');
  const [range, setRange] = React.useState('30d');
  const [investigationRing, setInvestigationRing] = React.useState<FraudRing | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const {
    data: rings,
    isLoading: ringsLoading,
    error: ringsError,
    refetch: refetchRings,
  } = useFraudRings();
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useSuspiciousReviews();
  const {
    data: trends,
    isLoading: trendsLoading,
  } = useFraudTrends(range);

  const filterBySeverity = <T extends { severity: Severity }>(items: T[] | undefined) => {
    if (!items) return [];
    return items.filter((item) => {
      const severityMatch = severity === 'all' || item.severity === severity;
      return severityMatch;
    });
  };

  const filteredRings = filterBySeverity(rings).filter((r) =>
    search
      ? r.ringNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.sharedIp.includes(search) ||
        r.sharedPayment.includes(search)
      : true
  );

  const filteredReviews = filterBySeverity(reviews).filter((r) =>
    search
      ? r.reviewerId.toLowerCase().includes(search.toLowerCase()) ||
        r.productName.toLowerCase().includes(search.toLowerCase()) ||
        r.content.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const handleInvestigate = (ring: FraudRing) => {
    setInvestigationRing(ring);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fraud Analysis"
        description="Investigate suspicious patterns, fraud rings, and abnormal marketplace behavior."
      />

      <FraudFilters
        search={search}
        onSearchChange={setSearch}
        severity={severity}
        onSeverityChange={setSeverity}
        activityType={activityType}
        onActivityTypeChange={setActivityType}
      />

      <Tabs defaultValue="rings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rings">Fraud Rings</TabsTrigger>
          <TabsTrigger value="reviews">Suspicious Reviews</TabsTrigger>
          <TabsTrigger value="trends">Fraud Trends</TabsTrigger>
        </TabsList>

        {/* Fraud Rings Tab */}
        <TabsContent value="rings" className="space-y-4">
          {ringsError ? (
            <ErrorState onRetry={() => refetchRings()} />
          ) : ringsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <FraudCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredRings.length === 0 ? (
            <EmptyState
              icon={<ShieldCheck className="h-6 w-6 text-success" />}
              title="No fraud rings detected"
              description="Your marketplace looks healthy. No suspicious connection patterns were found."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRings.map((ring, i) => (
                <FraudRingCard
                  key={ring.id}
                  ring={ring}
                  onInvestigate={handleInvestigate}
                  delay={i * 0.05}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Suspicious Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          {reviewsError ? (
            <ErrorState onRetry={() => refetchReviews()} />
          ) : reviewsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <FraudCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <EmptyState
              icon={<ShieldCheck className="h-6 w-6 text-success" />}
              title="No suspicious reviews"
              description="All recently analyzed reviews appear authentic."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredReviews.map((review, i) => (
                <SuspiciousReviewCard
                  key={review.id}
                  review={review}
                  onInvestigate={() => toast.info('Review investigation opened')}
                  delay={i * 0.05}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Fraud Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
              {['7d', '30d', '90d'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    range === r
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {r === '7d' ? '7 days' : r === '30d' ? '30 days' : '90 days'}
                </button>
              ))}
            </div>
          </div>
          <FraudTrends data={trends} isLoading={trendsLoading} />
        </TabsContent>
      </Tabs>

      <InvestigationDrawer
        ring={investigationRing}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
