export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type GraphNodeType =
  | 'user'
  | 'product'
  | 'review'
  | 'payment'
  | 'ip'
  | 'transaction';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface Trend {
  value: number;
  direction: TrendDirection;
  label: string;
}

export interface DashboardStats {
  users: number;
  products: number;
  fraudAlerts: number;
  trustScore: number;
  trends: {
    users: Trend;
    products: Trend;
    fraud: Trend;
    trust: Trend;
  };
  trustDistribution: {
    trusted: number;
    moderate: number;
    suspicious: number;
    critical: number;
  };
  recentAlerts: FraudAlert[];
}

export interface FraudAlert {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  timestamp: string;
  actionLabel: string;
}

export interface FraudRing {
  id: string;
  ringNumber: string;
  severity: Severity;
  connectedUsers: number;
  sharedIp: string;
  sharedPayment: string;
  transactions: number;
  riskScore: number;
  detectedAt: string;
  graph: GraphData;
}

export interface SuspiciousReview {
  id: string;
  content: string;
  productName: string;
  reviewerId: string;
  riskScore: number;
  reason: string;
  detectedAt: string;
  severity: Severity;
}

export interface FraudTrendPoint {
  date: string;
  alerts: number;
  suspiciousTransactions: number;
  detectionRate: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  matchScore: number;
  buyersAlsoBought: number;
  badges: ProductBadge[];
  recommendationReasons: string[];
  recommendationConfidence: number;
  graph: GraphData;
}

export type ProductBadge = 'trending' | 'best-seller' | 'new';

export interface AnalyticsData {
  metrics: {
    totalTransactions: number;
    fraudPrevented: number;
    fraudDetectionRate: number;
    averageTrustScore: number;
    recommendationConversion: number;
    activeUsers: number;
  };
  trends: {
    totalTransactions: Trend;
    fraudPrevented: Trend;
    fraudDetectionRate: Trend;
    averageTrustScore: Trend;
    recommendationConversion: Trend;
    activeUsers: Trend;
  };
  fraudDetectionTrend: { date: string; detected: number; prevented: number }[];
  trustScoreTrend: { date: string; score: number }[];
  recommendationPerformance: { category: string; conversions: number; revenue: number }[];
  categoryPerformance: { category: string; sales: number; revenue: number }[];
  fraudSeverity: { name: string; value: number; color: string }[];
  userActivity: { date: string; active: number; new: number }[];
}

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  metadata?: Record<string, unknown>;
}

export interface GraphRelationship {
  id: string;
  source: string;
  target: string;
  type: string;
  weight?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface APIError {
  message: string;
  code?: string;
}

export interface MarketplaceUser {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'suspended' | 'flagged';
  trustScore: number;
  transactions: number;
  reviews: number;
  lastActive: string;
}

export interface ManagedProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  sales: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  trustScore: number;
}

export interface ManagedReview {
  id: string;
  productName: string;
  reviewerId: string;
  rating: number;
  content: string;
  date: string;
  status: 'approved' | 'pending' | 'flagged';
  riskScore: number;
}

export interface Transaction {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  fraudRisk: number;
}

export interface AlertItem {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
  category: string;
}

export interface ReportItem {
  id: string;
  name: string;
  type: 'fraud' | 'analytics' | 'trust' | 'product' | 'user';
  dateGenerated: string;
  status: 'ready' | 'generating' | 'scheduled';
  size: string;
}

export interface SystemSettings {
  fraudDetection: {
    sensitivity: 'low' | 'medium' | 'high';
    autoFlagThreshold: number;
    ipSharingAlerts: boolean;
    paymentSharingAlerts: boolean;
    reviewVelocityAlerts: boolean;
  };
  notifications: {
    emailAlerts: boolean;
    slackIntegration: boolean;
    dailyDigest: boolean;
    criticalOnly: boolean;
  };
  trust: {
    minTrustScore: number;
    autoSuspendThreshold: number;
    reviewVerification: boolean;
  };
}
