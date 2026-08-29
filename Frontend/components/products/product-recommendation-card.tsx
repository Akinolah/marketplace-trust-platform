'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/products/product-image';
import { RecommendationReason } from '@/components/products/recommendation-reason';
import { PRODUCT_BADGE_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductRecommendationCardProps {
  product: Product;
  onViewProduct?: (product: Product) => void;
  delay?: number;
}

export function ProductRecommendationCard({
  product,
  onViewProduct,
  delay = 0,
}: ProductRecommendationCardProps) {
  const [showReasons, setShowReasons] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="group overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <ProductImage src={product.image} alt={product.name} />
          {product.badges.length > 0 && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {product.badges.map((badge) => (
                <Badge
                  key={badge}
                  variant="outline"
                  className={cn(
                    'border-transparent px-2 py-0.5 text-xs font-medium backdrop-blur-sm',
                    PRODUCT_BADGE_CONFIG[badge].classes
                  )}
                >
                  {PRODUCT_BADGE_CONFIG[badge].label}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight">{product.name}</h3>
            <div className="flex items-center gap-0.5 text-sm">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="font-medium">{product.rating}</span>
            </div>
          </div>
          <p className="mb-2 text-xs text-muted-foreground">{product.category}</p>
          <p className="mb-3 text-lg font-bold">{formatCurrency(product.price)}</p>

          <div className="mb-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-primary">{product.matchScore}% Match</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${product.matchScore}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {product.buyersAlsoBought} buyers also bought this
            </p>
          </div>

          <div className="mb-3 rounded-lg bg-primary/5 p-3">
            <button
              onClick={() => setShowReasons(!showReasons)}
              className="flex w-full items-center justify-between text-xs font-medium text-primary"
            >
              <span>Why recommended</span>
              <span className="text-xs">{showReasons ? 'Hide' : 'Show'}</span>
            </button>
            {showReasons && (
              <RecommendationReason
                reasons={product.recommendationReasons}
                confidence={product.recommendationConfidence}
              />
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onViewProduct?.(product)}
          >
            View Product
            <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
