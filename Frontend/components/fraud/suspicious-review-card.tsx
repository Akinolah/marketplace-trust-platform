'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SeverityBadge } from '@/components/shared/severity-badge';
import { RiskScore } from '@/components/shared/risk-score';
import { formatRelativeTime } from '@/lib/utils/format';
import type { SuspiciousReview } from '@/lib/types';

interface SuspiciousReviewCardProps {
  review: SuspiciousReview;
  onInvestigate: () => void;
  delay?: number;
}

export function SuspiciousReviewCard({
  review,
  onInvestigate,
  delay = 0,
}: SuspiciousReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <SeverityBadge severity={review.severity} />
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(review.detectedAt)}
            </span>
          </div>

          <div className="mb-3 flex gap-2">
            <Quote className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm italic text-muted-foreground">
              "{review.content}"
            </p>
          </div>

          <div className="mb-3 space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Product:</span>
              <span className="font-medium">{review.productName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Reviewer:</span>
              <span className="font-mono-id text-xs font-medium">{review.reviewerId}</span>
            </div>
          </div>

          <div className="mb-3 rounded-lg bg-destructive/5 p-3">
            <p className="text-xs font-medium text-destructive">Reason</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{review.reason}</p>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <RiskScore value={review.riskScore} />
            <Button size="sm" variant="outline" onClick={onInvestigate}>
              Investigate
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
