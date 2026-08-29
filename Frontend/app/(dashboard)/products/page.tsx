'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { ProductSearch } from '@/components/products/product-search';
import { CategoryChips } from '@/components/products/category-chips';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductRecommendationCard } from '@/components/products/product-recommendation-card';
import { ProductDetailDialog } from '@/components/products/product-detail-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { ProductCardSkeleton } from '@/components/shared/skeletons';
import { useProductRecommendations } from '@/hooks/use-api';
import { useDebounce } from '@/hooks/use-debounce';
import { PackageSearch } from 'lucide-react';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [category, setCategory] = React.useState('All');
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 700]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [minRating, setMinRating] = React.useState(0);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { data: products, isLoading, error, refetch } = useProductRecommendations();

  const suggestions = React.useMemo(
    () => (products || []).map((p) => p.name).concat(['Audio', 'Electronics', 'Home', 'Sports']),
    [products]
  );

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const searchMatch = !debouncedSearch ||
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedSearch.toLowerCase());
      const categoryMatch = category === 'All' || p.category === category;
      const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
      const selectedCatMatch = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const ratingMatch = p.rating >= minRating;
      return searchMatch && categoryMatch && priceMatch && selectedCatMatch && ratingMatch;
    });
  }, [products, debouncedSearch, category, priceRange, selectedCategories, minRating]);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Discovery"
        description="Explore products and understand why they are recommended."
      />

      <ProductSearch
        value={search}
        onChange={setSearch}
        suggestions={suggestions}
      />

      <CategoryChips selected={category} onChange={setCategory} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-64 lg:shrink-0">
          <ProductFilters
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            minRating={minRating}
            onRatingChange={setMinRating}
          />
        </div>

        <div className="flex-1">
          {error ? (
            <ErrorState onRetry={() => refetch()} />
          ) : isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon={<PackageSearch className="h-6 w-6" />}
              title="No products found"
              description="Try a different search or adjust your filters."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product, i) => (
                <ProductRecommendationCard
                  key={product.id}
                  product={product}
                  onViewProduct={handleViewProduct}
                  delay={i * 0.05}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductDetailDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
