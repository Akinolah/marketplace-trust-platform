'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';

interface CategoryChipsProps {
  selected: string;
  onChange: (value: string) => void;
}

export function CategoryChips({ selected, onChange }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
            selected === cat
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
