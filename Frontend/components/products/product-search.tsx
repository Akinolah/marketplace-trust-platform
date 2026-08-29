'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
}

export function ProductSearch({ value, onChange, suggestions = [] }: ProductSearchProps) {
  const [focused, setFocused] = React.useState(false);
  const filtered = value
    ? suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setFocused(false);
        }}
        placeholder="Search by product name, ID, category..."
        className={cn(
          'h-12 w-full rounded-xl border bg-background pl-12 pr-10 text-sm outline-none transition-all',
          'placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20',
          focused && 'border-primary ring-2 ring-primary/20'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {focused && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border bg-popover shadow-lg">
          {filtered.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setFocused(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
