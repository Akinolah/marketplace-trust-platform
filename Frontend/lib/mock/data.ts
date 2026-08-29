import type {
  DashboardStats,
  FraudRing,
  SuspiciousReview,
  FraudTrendPoint,
  Product,
  AnalyticsData,
  GraphData,
} from '@/lib/types';

function genDates(days: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export const mockDashboardStats: DashboardStats = {
  users: 12847,
  products: 5634,
  fraudAlerts: 45,
  trustScore: 92,
  trends: {
    users: { value: 12.4, direction: 'up', label: 'vs last month' },
    products: { value: 8.2, direction: 'up', label: 'vs last month' },
    fraud: { value: 12, direction: 'up', label: 'requires attention' },
    trust: { value: 4.5, direction: 'up', label: 'healthy marketplace' },
  },
  trustDistribution: {
    trusted: 85,
    moderate: 10,
    suspicious: 4,
    critical: 1,
  },
  recentAlerts: [
    {
      id: 'alert-001',
      severity: 'critical',
      title: 'Suspicious Ring Detected',
      description: '5 users share the same IP and payment method',
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      actionLabel: 'Investigate',
    },
    {
      id: 'alert-002',
      severity: 'high',
      title: 'Unusual Review Activity',
      description: '12 reviews linked to suspicious accounts',
      timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
      actionLabel: 'Investigate',
    },
    {
      id: 'alert-003',
      severity: 'medium',
      title: 'Multiple Account Login',
      description: '3 accounts accessed from unusual locations',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      actionLabel: 'Review',
    },
    {
      id: 'alert-004',
      severity: 'low',
      title: 'Slight Review Velocity Increase',
      description: 'Review frequency up 15% on 3 products',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      actionLabel: 'Review',
    },
  ],
};

function buildRingGraph(ringId: string): GraphData {
  const nodes = [
    { id: `${ringId}-u1`, type: 'user' as const, label: 'user_2847' },
    { id: `${ringId}-u2`, type: 'user' as const, label: 'user_2851' },
    { id: `${ringId}-u3`, type: 'user' as const, label: 'user_2863' },
    { id: `${ringId}-u4`, type: 'user' as const, label: 'user_2870' },
    { id: `${ringId}-u5`, type: 'user' as const, label: 'user_2888' },
    { id: `${ringId}-ip`, type: 'ip' as const, label: '192.168.1.1' },
    { id: `${ringId}-pay`, type: 'payment' as const, label: '**** 1234' },
    { id: `${ringId}-t1`, type: 'transaction' as const, label: 'txn_8821' },
    { id: `${ringId}-t2`, type: 'transaction' as const, label: 'txn_8845' },
    { id: `${ringId}-t3`, type: 'transaction' as const, label: 'txn_8867' },
    { id: `${ringId}-p1`, type: 'product' as const, label: 'Wireless Earbuds' },
    { id: `${ringId}-p2`, type: 'product' as const, label: 'Phone Case' },
    { id: `${ringId}-r1`, type: 'review' as const, label: '5-star review' },
    { id: `${ringId}-r2`, type: 'review' as const, label: '5-star review' },
  ];
  const relationships = [
    { id: 'r1', source: `${ringId}-u1`, target: `${ringId}-ip`, type: 'used_ip' },
    { id: 'r2', source: `${ringId}-u2`, target: `${ringId}-ip`, type: 'used_ip' },
    { id: 'r3', source: `${ringId}-u3`, target: `${ringId}-ip`, type: 'used_ip' },
    { id: 'r4', source: `${ringId}-u4`, target: `${ringId}-ip`, type: 'used_ip' },
    { id: 'r5', source: `${ringId}-u5`, target: `${ringId}-ip`, type: 'used_ip' },
    { id: 'r6', source: `${ringId}-u1`, target: `${ringId}-pay`, type: 'used_payment' },
    { id: 'r7', source: `${ringId}-u2`, target: `${ringId}-pay`, type: 'used_payment' },
    { id: 'r8', source: `${ringId}-u3`, target: `${ringId}-pay`, type: 'used_payment' },
    { id: 'r9', source: `${ringId}-u1`, target: `${ringId}-t1`, type: 'made_transaction' },
    { id: 'r10', source: `${ringId}-u2`, target: `${ringId}-t2`, type: 'made_transaction' },
    { id: 'r11', source: `${ringId}-u3`, target: `${ringId}-t3`, type: 'made_transaction' },
    { id: 'r12', source: `${ringId}-t1`, target: `${ringId}-p1`, type: 'purchased' },
    { id: 'r13', source: `${ringId}-t2`, target: `${ringId}-p2`, type: 'purchased' },
    { id: 'r14', source: `${ringId}-t3`, target: `${ringId}-p1`, type: 'purchased' },
    { id: 'r15', source: `${ringId}-u1`, target: `${ringId}-r1`, type: 'wrote_review' },
    { id: 'r16', source: `${ringId}-u2`, target: `${ringId}-r2`, type: 'wrote_review' },
    { id: 'r17', source: `${ringId}-r1`, target: `${ringId}-p1`, type: 'reviewed' },
    { id: 'r18', source: `${ringId}-r2`, target: `${ringId}-p2`, type: 'reviewed' },
  ];
  return { nodes, relationships };
}

export const mockFraudRings: FraudRing[] = [
  {
    id: 'ring-001',
    ringNumber: '#001',
    severity: 'critical',
    connectedUsers: 5,
    sharedIp: '192.168.1.1',
    sharedPayment: '**** 1234',
    transactions: 23,
    riskScore: 97,
    detectedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    graph: buildRingGraph('ring-001'),
  },
  {
    id: 'ring-002',
    ringNumber: '#002',
    severity: 'high',
    connectedUsers: 4,
    sharedIp: '10.0.42.77',
    sharedPayment: '**** 5678',
    transactions: 15,
    riskScore: 84,
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    graph: buildRingGraph('ring-002'),
  },
  {
    id: 'ring-003',
    ringNumber: '#003',
    severity: 'medium',
    connectedUsers: 3,
    sharedIp: '172.16.0.5',
    sharedPayment: '**** 9012',
    transactions: 8,
    riskScore: 62,
    detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    graph: buildRingGraph('ring-003'),
  },
  {
    id: 'ring-004',
    ringNumber: '#004',
    severity: 'low',
    connectedUsers: 2,
    sharedIp: '203.0.113.9',
    sharedPayment: '**** 3456',
    transactions: 4,
    riskScore: 38,
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    graph: buildRingGraph('ring-004'),
  },
];

export const mockSuspiciousReviews: SuspiciousReview[] = [
  {
    id: 'rev-001',
    content: 'Great product! Amazing! Best ever!',
    productName: 'Wireless Earbuds',
    reviewerId: 'user_2847',
    riskScore: 89,
    reason: 'Reviewer is connected to 7 suspicious accounts sharing the same IP address.',
    detectedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    severity: 'high',
  },
  {
    id: 'rev-002',
    content: 'Absolutely love it! 10/10 would buy again!',
    productName: 'Phone Case',
    reviewerId: 'user_2851',
    riskScore: 76,
    reason: 'Review posted within 2 minutes of purchase — insufficient time for genuine product evaluation.',
    detectedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    severity: 'medium',
  },
  {
    id: 'rev-003',
    content: 'Perfect! The best purchase I have ever made in my life!',
    productName: 'Bluetooth Speaker',
    reviewerId: 'user_2863',
    riskScore: 82,
    reason: 'Reviewer used the same payment method as 3 flagged accounts and posted within minutes of each other.',
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    severity: 'high',
  },
  {
    id: 'rev-004',
    content: 'Good value for money.',
    productName: 'USB-C Cable',
    reviewerId: 'user_2912',
    riskScore: 41,
    reason: 'Reviewer account created 1 hour before posting, but content appears genuine.',
    detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    severity: 'low',
  },
];

export function getMockFraudTrends(range: string): FraudTrendPoint[] {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const dates = genDates(days);
  return dates.map((date, i) => {
    const base = 20 + Math.sin(i / 3) * 8;
    const alerts = Math.max(0, Math.round(base + (i % 5) * 2));
    return {
      date,
      alerts,
      suspiciousTransactions: Math.round(alerts * 1.4),
      detectionRate: Math.round(82 + Math.sin(i / 4) * 6),
      low: Math.round(alerts * 0.3),
      medium: Math.round(alerts * 0.35),
      high: Math.round(alerts * 0.25),
      critical: Math.max(1, Math.round(alerts * 0.1)),
    };
  });
}

function buildProductGraph(productId: string): GraphData {
  const nodes = [
    { id: `${productId}-p`, type: 'product' as const, label: 'This Product' },
    { id: `${productId}-p2`, type: 'product' as const, label: 'Related Product' },
    { id: `${productId}-u1`, type: 'user' as const, label: 'user_3201' },
    { id: `${productId}-u2`, type: 'user' as const, label: 'user_3202' },
    { id: `${productId}-r1`, type: 'review' as const, label: '4-star review' },
    { id: `${productId}-t1`, type: 'transaction' as const, label: 'txn_9001' },
  ];
  const relationships = [
    { id: 'pr1', source: `${productId}-p`, target: `${productId}-p2`, type: 'bought_together' },
    { id: 'pr2', source: `${productId}-u1`, target: `${productId}-p`, type: 'purchased' },
    { id: 'pr3', source: `${productId}-u2`, target: `${productId}-p`, type: 'purchased' },
    { id: 'pr4', source: `${productId}-u1`, target: `${productId}-r1`, type: 'wrote_review' },
    { id: 'pr5', source: `${productId}-r1`, target: `${productId}-p`, type: 'reviewed' },
    { id: 'pr6', source: `${productId}-u1`, target: `${productId}-t1`, type: 'made_transaction' },
    { id: 'pr7', source: `${productId}-t1`, target: `${productId}-p`, type: 'purchased' },
  ];
  return { nodes, relationships };
}

export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Sony WH-1000XM5',
    category: 'Audio',
    price: 299,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/32992390/pexels-photo-32992390.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchScore: 92,
    buyersAlsoBought: 234,
    badges: ['best-seller'],
    recommendationReasons: [
      'Similar users purchased this',
      'Same category as your recent activity',
      'High trust score',
      'Strong product relationship',
    ],
    recommendationConfidence: 92,
    graph: buildProductGraph('prod-001'),
  },
  {
    id: 'prod-002',
    name: 'Apple AirPods Pro',
    category: 'Audio',
    price: 249,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/38919191/pexels-photo-38919191.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchScore: 88,
    buyersAlsoBought: 189,
    badges: ['trending'],
    recommendationReasons: [
      'Frequently bought together with your items',
      'High rating from trusted reviewers',
      'Trending in your category',
    ],
    recommendationConfidence: 88,
    graph: buildProductGraph('prod-002'),
  },
  {
    id: 'prod-003',
    name: 'Bose QuietComfort 45',
    category: 'Audio',
    price: 329,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/7748203/pexels-photo-7748203.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchScore: 85,
    buyersAlsoBought: 156,
    badges: [],
    recommendationReasons: [
      'Similar purchase behavior',
      'Same category affinity',
      'Consistently high ratings',
    ],
    recommendationConfidence: 85,
    graph: buildProductGraph('prod-003'),
  },
  {
    id: 'prod-004',
    name: 'Samsung Galaxy Watch 5',
    category: 'Electronics',
    price: 279,
    rating: 4.5,
    image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchScore: 79,
    buyersAlsoBought: 112,
    badges: ['new'],
    recommendationReasons: [
      'New arrival in your watched categories',
      'Popular among users with similar profiles',
    ],
    recommendationConfidence: 79,
    graph: buildProductGraph('prod-004'),
  },
  {
    id: 'prod-005',
    name: 'Levi\'s 501 Original Jeans',
    category: 'Fashion',
    price: 59,
    rating: 4.4,
    image: 'https://images.pexels.com/photos/36467358/pexels-photo-36467358.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchScore: 76,
    buyersAlsoBought: 98,
    badges: [],
    recommendationReasons: [
      'Category affinity based on browsing history',
      'High trust score from verified buyers',
    ],
    recommendationConfidence: 76,
    graph: buildProductGraph('prod-005'),
  },
  {
    id: 'prod-006',
    name: 'Nest Learning Thermostat',
    category: 'Home',
    price: 199,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/36730582/pexels-photo-36730582.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchScore: 73,
    buyersAlsoBought: 87,
    badges: ['best-seller'],
    recommendationReasons: [
      'Frequently viewed together with your items',
      'Strong product relationship with your purchases',
    ],
    recommendationConfidence: 73,
    graph: buildProductGraph('prod-006'),
  },
  {
    id: 'prod-007',
    name: 'Dyson V15 Detect',
    category: 'Home',
    price: 649,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/8055197/pexels-photo-8055197.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchScore: 71,
    buyersAlsoBought: 64,
    badges: ['trending'],
    recommendationReasons: [
      'Trending in home category',
      'Similar users with high trust scores purchased this',
    ],
    recommendationConfidence: 71,
    graph: buildProductGraph('prod-007'),
  },
  {
    id: 'prod-008',
    name: 'Nike Air Zoom Pegasus',
    category: 'Sports',
    price: 129,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/15475641/pexels-photo-15475641.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    matchScore: 68,
    buyersAlsoBought: 73,
    badges: [],
    recommendationReasons: [
      'Popular among users with similar activity patterns',
      'High rating in sports category',
    ],
    recommendationConfidence: 68,
    graph: buildProductGraph('prod-008'),
  },
];

export function getMockAnalytics(range: string): AnalyticsData {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const dates = genDates(days);
  return {
    metrics: {
      totalTransactions: 48291,
      fraudPrevented: 1247,
      fraudDetectionRate: 94.2,
      averageTrustScore: 92,
      recommendationConversion: 34.8,
      activeUsers: 8421,
    },
    trends: {
      totalTransactions: { value: 15.3, direction: 'up', label: 'vs last month' },
      fraudPrevented: { value: 8.7, direction: 'up', label: 'vs last month' },
      fraudDetectionRate: { value: 2.1, direction: 'up', label: 'vs last month' },
      averageTrustScore: { value: 4.5, direction: 'up', label: 'healthy' },
      recommendationConversion: { value: 3.2, direction: 'up', label: 'vs last month' },
      activeUsers: { value: 11.4, direction: 'up', label: 'vs last month' },
    },
    fraudDetectionTrend: dates.map((date, i) => ({
      date,
      detected: Math.round(15 + Math.sin(i / 3) * 6),
      prevented: Math.round(14 + Math.sin(i / 3) * 5),
    })),
    trustScoreTrend: dates.map((date, i) => ({
      date,
      score: Math.round(88 + Math.sin(i / 5) * 5),
    })),
    recommendationPerformance: [
      { category: 'Audio', conversions: 1240, revenue: 312000 },
      { category: 'Electronics', conversions: 980, revenue: 245000 },
      { category: 'Fashion', conversions: 760, revenue: 89000 },
      { category: 'Home', conversions: 540, revenue: 178000 },
      { category: 'Sports', conversions: 320, revenue: 64000 },
      { category: 'Beauty', conversions: 280, revenue: 42000 },
    ],
    categoryPerformance: [
      { category: 'Audio', sales: 3200, revenue: 890000 },
      { category: 'Electronics', sales: 2800, revenue: 720000 },
      { category: 'Fashion', sales: 2100, revenue: 310000 },
      { category: 'Home', sales: 1800, revenue: 540000 },
      { category: 'Sports', sales: 1200, revenue: 210000 },
      { category: 'Beauty', sales: 900, revenue: 150000 },
    ],
    fraudSeverity: [
      { name: 'Low', value: 35, color: 'hsl(var(--chart-3))' },
      { name: 'Medium', value: 30, color: 'hsl(var(--chart-2))' },
      { name: 'High', value: 25, color: 'hsl(var(--chart-4))' },
      { name: 'Critical', value: 10, color: 'hsl(var(--chart-5))' },
    ],
    userActivity: dates.map((date, i) => ({
      date,
      active: Math.round(7000 + Math.sin(i / 4) * 1200),
      new: Math.round(400 + Math.sin(i / 3) * 150),
    })),
  };
}
