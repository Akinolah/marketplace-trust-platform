'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Compass,
  BarChart3,
  FileText,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  iconClassName: string;
}

const ACTIONS: QuickAction[] = [
  {
    title: 'Investigate Fraud',
    description: 'Analyze suspicious users and connected activity.',
    icon: ShieldAlert,
    href: '/fraud',
    iconClassName: 'bg-destructive/10 text-destructive',
  },
  {
    title: 'Discover Products',
    description: 'Explore recommendations and product relationships.',
    icon: Compass,
    href: '/products',
    iconClassName: 'bg-primary/10 text-primary',
  },
  {
    title: 'View Analytics',
    description: 'Understand marketplace trends and performance.',
    icon: BarChart3,
    href: '/analytics',
    iconClassName: 'bg-success/10 text-success',
  },
  {
    title: 'Generate Report',
    description: 'Export the latest marketplace intelligence.',
    icon: FileText,
    href: '#',
    iconClassName: 'bg-warning/10 text-warning',
  },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ACTIONS.map((action, i) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Card
            className="group cursor-pointer transition-all hover:border-primary/30 hover:shadow-md"
            onClick={() => action.href !== '#' && router.push(action.href)}
          >
            <CardContent className="p-5">
              <div
                className={cn(
                  'mb-3 flex h-10 w-10 items-center justify-center rounded-lg',
                  action.iconClassName
                )}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 text-sm font-semibold">{action.title}</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                {action.description}
              </p>
              <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Get started
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
