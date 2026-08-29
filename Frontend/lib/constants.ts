import type { Severity, GraphNodeType, ProductBadge } from '@/lib/types';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  comingSoon: boolean;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

// comingSoon: true marks pages whose backend endpoint is still a 501 stub
// (see Backend/src/routes/stubs.routes.js) — flip to false as each one is
// wired to a real Cypher query.
export const NAV_ITEMS: NavSection[] = [
  {
    section: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', comingSoon: false },
      { label: 'Fraud Analysis', href: '/fraud', icon: 'ShieldAlert', comingSoon: false },
      { label: 'Product Discovery', href: '/products', icon: 'Compass', comingSoon: false },
      { label: 'Analytics', href: '/analytics', icon: 'BarChart3', comingSoon: true },
    ],
  },
  {
    section: 'Management',
    items: [
      { label: 'Users', href: '/users', icon: 'Users', comingSoon: true },
      { label: 'Products', href: '/products-manage', icon: 'Package', comingSoon: true },
      { label: 'Reviews', href: '/reviews', icon: 'MessageSquare', comingSoon: true },
      { label: 'Transactions', href: '/transactions', icon: 'CreditCard', comingSoon: true },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'Alerts', href: '/alerts', icon: 'Bell', comingSoon: true },
      { label: 'Reports', href: '/reports', icon: 'FileText', comingSoon: true },
      { label: 'Settings', href: '/settings', icon: 'Settings', comingSoon: true },
    ],
  },
];

export const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; classes: string; dot: string }
> = {
  low: {
    label: 'LOW',
    classes:
      'bg-severity-low text-severity-low-foreground border-severity-low/40',
    dot: 'bg-severity-medium',
  },
  medium: {
    label: 'MEDIUM',
    classes:
      'bg-severity-medium/20 text-severity-medium-foreground border-severity-medium/40',
    dot: 'bg-severity-medium',
  },
  high: {
    label: 'HIGH',
    classes:
      'bg-severity-high/15 text-severity-high-foreground border-severity-high/40',
    dot: 'bg-severity-high',
  },
  critical: {
    label: 'CRITICAL',
    classes:
      'bg-severity-critical text-severity-critical-foreground border-severity-critical/40',
    dot: 'bg-severity-critical',
  },
};

export const GRAPH_NODE_CONFIG: Record<
  GraphNodeType,
  { color: string; label: string; radius: number }
> = {
  user: { color: '#3b82f6', label: 'User', radius: 18 },
  product: { color: '#8b5cf6', label: 'Product', radius: 16 },
  ip: { color: '#f97316', label: 'IP Address', radius: 14 },
  payment: { color: '#ef4444', label: 'Payment', radius: 14 },
  review: { color: '#eab308', label: 'Review', radius: 12 },
  transaction: { color: '#10b981', label: 'Transaction', radius: 15 },
};

export const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Audio',
  'Home',
  'Beauty',
  'Sports',
] as const;

export const PRODUCT_BADGE_CONFIG: Record<
  ProductBadge,
  { label: string; classes: string }
> = {
  trending: { label: 'Trending', classes: 'bg-primary/10 text-primary' },
  'best-seller': { label: 'Best Seller', classes: 'bg-warning/20 text-warning' },
  new: { label: 'New', classes: 'bg-success/15 text-success' },
};

export const DATE_RANGES = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
] as const;
