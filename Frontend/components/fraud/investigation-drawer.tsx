'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SeverityBadge } from '@/components/shared/severity-badge';
import { RiskScore } from '@/components/shared/risk-score';
import { GraphVisualization, GraphLegend } from '@/components/fraud/graph-visualization';
import { GRAPH_NODE_CONFIG } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils/format';
import type { FraudRing, GraphNode } from '@/lib/types';
import { Flag, X } from 'lucide-react';
import { toast } from 'sonner';

interface InvestigationDrawerProps {
  ring: FraudRing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvestigationDrawer({
  ring,
  open,
  onOpenChange,
}: InvestigationDrawerProps) {
  const [selectedNode, setSelectedNode] = React.useState<GraphNode | null>(null);

  React.useEffect(() => {
    if (!open) setSelectedNode(null);
  }, [open]);

  if (!ring) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-2xl lg:max-w-3xl"
      >
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SeverityBadge severity={ring.severity} />
            <SheetDescription>{formatRelativeTime(ring.detectedAt)}</SheetDescription>
          </div>
          <SheetTitle className="text-xl">
            Fraud Ring {ring.ringNumber} Investigation
          </SheetTitle>
          <SheetDescription>
            {ring.connectedUsers} connected users sharing IP and payment methods.
            Explore the relationship graph below.
          </SheetDescription>
        </SheetHeader>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border p-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Shared IP</p>
            <p className="font-mono-id text-sm font-medium">{ring.sharedIp}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Payment</p>
            <p className="font-mono-id text-sm font-medium">{ring.sharedPayment}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Transactions</p>
            <p className="text-sm font-medium">{ring.transactions}</p>
          </div>
          <div>
            <RiskScore value={ring.riskScore} showLabel={false} />
          </div>
        </div>

        {/* Graph */}
        <div className="mt-4 rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Relationship Graph</h3>
            <GraphLegend />
          </div>
          <GraphVisualization
            data={ring.graph}
            onNodeSelect={setSelectedNode}
          />
        </div>

        {/* Node details */}
        {selectedNode && (
          <div className="mt-4 rounded-lg border bg-muted/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: GRAPH_NODE_CONFIG[selectedNode.type].color }}
                />
                <span className="text-sm font-semibold">{selectedNode.label}</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{GRAPH_NODE_CONFIG[selectedNode.type].label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono-id">{selectedNode.id}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              toast.success('Fraud ring flagged for review');
              onOpenChange(false);
            }}
          >
            <Flag className="mr-2 h-4 w-4" />
            Flag for Action
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.success('Investigation notes saved');
              onOpenChange(false);
            }}
          >
            Save Notes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
