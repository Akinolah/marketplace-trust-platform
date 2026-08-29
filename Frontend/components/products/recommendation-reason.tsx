import * as React from 'react';
import { Check } from 'lucide-react';

interface RecommendationReasonProps {
  reasons: string[];
  confidence: number;
}

export function RecommendationReason({
  reasons,
  confidence,
}: RecommendationReasonProps) {
  return (
    <div className="mt-2 space-y-1.5">
      {reasons.map((reason, i) => (
        <div key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" />
          <span>{reason}</span>
        </div>
      ))}
      <div className="mt-2 flex items-center gap-1.5 border-t pt-1.5 text-xs font-medium text-primary">
        <Check className="h-3 w-3" />
        {confidence}% recommendation confidence
      </div>
    </div>
  );
}
