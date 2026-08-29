'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Users, Wifi, CreditCard, ArrowLeftRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SeverityBadge } from '@/components/shared/severity-badge';
import { RiskScore } from '@/components/shared/risk-score';
import { formatRelativeTime } from '@/lib/utils/format';
import type { FraudRing } from '@/lib/types';

interface FraudRingCardProps {
  ring: FraudRing;
  onInvestigate: (ring: FraudRing) => void;
  delay?: number;
}

export function FraudRingCard({ ring, onInvestigate, delay = 0 }: FraudRingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <SeverityBadge severity={ring.severity} />
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(ring.detectedAt)}
            </span>
          </div>

          <h3 className="mb-1 text-lg font-semibold">Fraud Ring {ring.ringNumber}</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {ring.connectedUsers} connected users
          </p>

          <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Users</p>
                <p className="font-medium">{ring.connectedUsers}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Shared IP</p>
                <p className="font-mono-id font-medium text-xs">{ring.sharedIp}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment</p>
                <p className="font-mono-id font-medium text-xs">{ring.sharedPayment}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Transactions</p>
                <p className="font-medium">{ring.transactions}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <RiskScore value={ring.riskScore} />
            <Button size="sm" onClick={() => onInvestigate(ring)}>
              Investigate
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
