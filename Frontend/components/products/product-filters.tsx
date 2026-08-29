'use client';

import * as React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CATEGORIES } from '@/lib/constants';

interface ProductFiltersProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  selectedCategories: string[];
  onCategoryChange: (cats: string[]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
}

const RATINGS = [
  { value: 0, label: 'All Ratings' },
  { value: 4, label: '4★ & up' },
  { value: 4.5, label: '4.5★ & up' },
  { value: 4.8, label: '4.8★ & up' },
];

export function ProductFilters({
  priceRange,
  onPriceChange,
  selectedCategories,
  onCategoryChange,
  minRating,
  onRatingChange,
}: ProductFiltersProps) {
  const toggleCategory = (cat: string) => {
    if (cat === 'All') {
      onCategoryChange([]);
      return;
    }
    if (selectedCategories.includes(cat)) {
      onCategoryChange(selectedCategories.filter((c) => c !== cat));
    } else {
      onCategoryChange([...selectedCategories, cat]);
    }
  };

  const filtersContent = (
    <div className="space-y-6">
      {/* Price */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Price Range</h3>
        <div className="px-2">
          <Slider
            min={0}
            max={700}
            step={10}
            value={priceRange}
            onValueChange={(v) => onPriceChange([v[0], v[1]] as [number, number])}
            className="my-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              <Label htmlFor={`cat-${cat}`} className="text-sm font-normal cursor-pointer">
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Rating</h3>
        <div className="space-y-2">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              onClick={() => onRatingChange(r.value)}
              className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                minRating === r.value
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="rounded-lg border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Filters</h2>
          </div>
          {filtersContent}
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">{filtersContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
