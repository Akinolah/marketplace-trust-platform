'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Check } from 'lucide-react';
import { ProductImage } from '@/components/products/product-image';
import { RecommendationReason } from '@/components/products/recommendation-reason';
import { GraphVisualization, GraphLegend } from '@/components/fraud/graph-visualization';
import { formatCurrency } from '@/lib/utils/format';
import { PRODUCT_BADGE_CONFIG } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
}: ProductDetailDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
          <DialogDescription>
            {product.category} - {formatCurrency(product.price)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            <ProductImage src={product.image} alt={product.name} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-semibold">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.buyersAlsoBought} buyers also bought this
              </span>
            </div>

            {product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <Badge
                    key={badge}
                    className={cn('border-transparent', PRODUCT_BADGE_CONFIG[badge].classes)}
                  >
                    {PRODUCT_BADGE_CONFIG[badge].label}
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-primary">{product.matchScore}% Match</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${product.matchScore}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-primary/5 p-4">
              <h4 className="mb-2 text-sm font-semibold">Why this is recommended</h4>
              <RecommendationReason
                reasons={product.recommendationReasons}
                confidence={product.recommendationConfidence}
              />
            </div>

            <Button
              className="w-full"
              onClick={() => {
                toast.success('Added to watchlist');
                onOpenChange(false);
              }}
            >
              Add to Watchlist
            </Button>
          </div>
        </div>

        {/* Product relationship graph */}
        <div className="mt-2 rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Product Relationships</h3>
            <GraphLegend />
          </div>
          <GraphVisualization data={product.graph} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
