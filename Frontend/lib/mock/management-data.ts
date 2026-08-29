import type {
  MarketplaceUser,
  ManagedProduct,
  ManagedReview,
  Transaction,
  AlertItem,
  ReportItem,
  SystemSettings,
} from '@/lib/types';

export const mockUsers: MarketplaceUser[] = [
  { id: 'usr_001', name: 'Alice Johnson', email: 'alice@example.com', joinDate: '2024-01-15', status: 'active', trustScore: 94, transactions: 47, reviews: 12, lastActive: '2026-08-27T08:00:00Z' },
  { id: 'usr_002', name: 'Bob Smith', email: 'bob@example.com', joinDate: '2024-03-22', status: 'flagged', trustScore: 38, transactions: 23, reviews: 8, lastActive: '2026-08-26T14:00:00Z' },
  { id: 'usr_003', name: 'Carol Davis', email: 'carol@example.com', joinDate: '2024-06-10', status: 'active', trustScore: 87, transactions: 31, reviews: 5, lastActive: '2026-08-27T10:00:00Z' },
  { id: 'usr_004', name: 'David Wilson', email: 'david@example.com', joinDate: '2024-02-05', status: 'suspended', trustScore: 22, transactions: 15, reviews: 20, lastActive: '2026-08-20T12:00:00Z' },
  { id: 'usr_005', name: 'Emma Brown', email: 'emma@example.com', joinDate: '2024-11-18', status: 'active', trustScore: 91, transactions: 62, reviews: 9, lastActive: '2026-08-27T09:00:00Z' },
  { id: 'usr_006', name: 'Frank Miller', email: 'frank@example.com', joinDate: '2025-01-30', status: 'flagged', trustScore: 45, transactions: 8, reviews: 14, lastActive: '2026-08-25T16:00:00Z' },
  { id: 'usr_007', name: 'Grace Lee', email: 'grace@example.com', joinDate: '2024-08-14', status: 'active', trustScore: 88, transactions: 39, reviews: 7, lastActive: '2026-08-27T11:00:00Z' },
  { id: 'usr_008', name: 'Henry Chen', email: 'henry@example.com', joinDate: '2024-05-20', status: 'active', trustScore: 76, transactions: 28, reviews: 3, lastActive: '2026-08-26T18:00:00Z' },
  { id: 'usr_009', name: 'Ivy Garcia', email: 'ivy@example.com', joinDate: '2025-03-11', status: 'active', trustScore: 83, transactions: 19, reviews: 6, lastActive: '2026-08-27T07:00:00Z' },
  { id: 'usr_010', name: 'Jack Taylor', email: 'jack@example.com', joinDate: '2024-09-01', status: 'suspended', trustScore: 15, transactions: 5, reviews: 25, lastActive: '2026-08-15T10:00:00Z' },
];

export const mockManagedProducts: ManagedProduct[] = [
  { id: 'prod_001', name: 'Sony WH-1000XM5', category: 'Audio', price: 299, stock: 142, rating: 4.8, sales: 1240, status: 'active', trustScore: 95 },
  { id: 'prod_002', name: 'Apple AirPods Pro', category: 'Audio', price: 249, stock: 89, rating: 4.7, sales: 980, status: 'active', trustScore: 93 },
  { id: 'prod_003', name: 'Bose QuietComfort 45', category: 'Audio', price: 329, stock: 0, rating: 4.6, sales: 760, status: 'out-of-stock', trustScore: 90 },
  { id: 'prod_004', name: 'Samsung Galaxy Watch 5', category: 'Electronics', price: 279, stock: 54, rating: 4.5, sales: 540, status: 'active', trustScore: 88 },
  { id: 'prod_005', name: 'Levi\'s 501 Original Jeans', category: 'Fashion', price: 59, stock: 230, rating: 4.4, sales: 320, status: 'active', trustScore: 85 },
  { id: 'prod_006', name: 'Nest Learning Thermostat', category: 'Home', price: 199, stock: 67, rating: 4.7, sales: 410, status: 'active', trustScore: 92 },
  { id: 'prod_007', name: 'Dyson V15 Detect', category: 'Home', price: 649, stock: 12, rating: 4.8, sales: 180, status: 'active', trustScore: 91 },
  { id: 'prod_008', name: 'Nike Air Zoom Pegasus', category: 'Sports', price: 129, stock: 0, rating: 4.6, sales: 290, status: 'out-of-stock', trustScore: 87 },
  { id: 'prod_009', name: 'Wireless Charging Pad', category: 'Electronics', price: 39, stock: 500, rating: 4.2, sales: 890, status: 'active', trustScore: 80 },
  { id: 'prod_010', name: 'Vintage Leather Backpack', category: 'Fashion', price: 149, stock: 34, rating: 4.5, sales: 210, status: 'inactive', trustScore: 84 },
];

export const mockManagedReviews: ManagedReview[] = [
  { id: 'rev_001', productName: 'Sony WH-1000XM5', reviewerId: 'usr_001', rating: 5, content: 'Excellent noise cancellation and sound quality. Worth every penny.', date: '2026-08-25', status: 'approved', riskScore: 8 },
  { id: 'rev_002', productName: 'Apple AirPods Pro', reviewerId: 'usr_002', rating: 5, content: 'Great product! Amazing! Best ever!', date: '2026-08-26', status: 'flagged', riskScore: 89 },
  { id: 'rev_003', productName: 'Bose QuietComfort 45', reviewerId: 'usr_003', rating: 4, content: 'Comfortable and great battery life. A bit pricey though.', date: '2026-08-24', status: 'approved', riskScore: 12 },
  { id: 'rev_004', productName: 'Samsung Galaxy Watch 5', reviewerId: 'usr_004', rating: 5, content: 'Perfect! The best purchase I have ever made in my life!', date: '2026-08-26', status: 'flagged', riskScore: 82 },
  { id: 'rev_005', productName: 'Nest Learning Thermostat', reviewerId: 'usr_005', rating: 5, content: 'Saves me so much on energy bills. Installation was straightforward.', date: '2026-08-23', status: 'approved', riskScore: 5 },
  { id: 'rev_006', productName: 'Dyson V15 Detect', reviewerId: 'usr_006', rating: 5, content: 'Absolutely love it! 10/10 would buy again!', date: '2026-08-26', status: 'pending', riskScore: 76 },
  { id: 'rev_007', productName: 'Nike Air Zoom Pegasus', reviewerId: 'usr_007', rating: 4, content: 'Great running shoes, very comfortable for long distances.', date: '2026-08-22', status: 'approved', riskScore: 10 },
  { id: 'rev_008', productName: 'Wireless Charging Pad', reviewerId: 'usr_008', rating: 3, content: 'Works fine but charges slower than expected.', date: '2026-08-21', status: 'approved', riskScore: 15 },
];

export const mockTransactions: Transaction[] = [
  { id: 'txn_0001', userId: 'usr_001', productId: 'prod_001', productName: 'Sony WH-1000XM5', amount: 299, date: '2026-08-27T08:30:00Z', status: 'completed', paymentMethod: 'Visa ****1234', fraudRisk: 5 },
  { id: 'txn_0002', userId: 'usr_002', productId: 'prod_002', productName: 'Apple AirPods Pro', amount: 249, date: '2026-08-26T14:20:00Z', status: 'completed', paymentMethod: 'Mastercard ****5678', fraudRisk: 78 },
  { id: 'txn_0003', userId: 'usr_003', productId: 'prod_004', productName: 'Samsung Galaxy Watch 5', amount: 279, date: '2026-08-27T10:15:00Z', status: 'completed', paymentMethod: 'Visa ****9012', fraudRisk: 8 },
  { id: 'txn_0004', userId: 'usr_004', productId: 'prod_005', productName: 'Levi\'s 501 Original Jeans', amount: 59, date: '2026-08-20T12:00:00Z', status: 'refunded', paymentMethod: 'PayPal', fraudRisk: 65 },
  { id: 'txn_0005', userId: 'usr_005', productId: 'prod_006', productName: 'Nest Learning Thermostat', amount: 199, date: '2026-08-27T09:45:00Z', status: 'completed', paymentMethod: 'Visa ****3456', fraudRisk: 3 },
  { id: 'txn_0006', userId: 'usr_006', productId: 'prod_007', productName: 'Dyson V15 Detect', amount: 649, date: '2026-08-25T16:30:00Z', status: 'pending', paymentMethod: 'Mastercard ****7890', fraudRisk: 72 },
  { id: 'txn_0007', userId: 'usr_007', productId: 'prod_008', productName: 'Nike Air Zoom Pegasus', amount: 129, date: '2026-08-27T11:00:00Z', status: 'completed', paymentMethod: 'Visa ****2345', fraudRisk: 6 },
  { id: 'txn_0008', userId: 'usr_008', productId: 'prod_009', productName: 'Wireless Charging Pad', amount: 39, date: '2026-08-26T18:00:00Z', status: 'completed', paymentMethod: 'Apple Pay', fraudRisk: 4 },
  { id: 'txn_0009', userId: 'usr_009', productId: 'prod_001', productName: 'Sony WH-1000XM5', amount: 299, date: '2026-08-27T07:15:00Z', status: 'completed', paymentMethod: 'Visa ****6789', fraudRisk: 7 },
  { id: 'txn_0010', userId: 'usr_010', productId: 'prod_002', productName: 'Apple AirPods Pro', amount: 249, date: '2026-08-15T10:00:00Z', status: 'failed', paymentMethod: 'Mastercard ****0123', fraudRisk: 91 },
];

export const mockAlerts: AlertItem[] = [
  { id: 'alert_001', severity: 'critical', title: 'Suspicious Ring Detected', description: '5 users share the same IP and payment method', timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), status: 'new', category: 'Fraud Ring' },
  { id: 'alert_002', severity: 'high', title: 'Unusual Review Activity', description: '12 reviews linked to suspicious accounts', timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(), status: 'new', category: 'Reviews' },
  { id: 'alert_003', severity: 'medium', title: 'Multiple Account Login', description: '3 accounts accessed from unusual locations', timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), status: 'acknowledged', category: 'Authentication' },
  { id: 'alert_004', severity: 'low', title: 'Slight Review Velocity Increase', description: 'Review frequency up 15% on 3 products', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), status: 'new', category: 'Reviews' },
  { id: 'alert_005', severity: 'high', title: 'Payment Method Sharing', description: '4 accounts using the same credit card', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), status: 'acknowledged', category: 'Payments' },
  { id: 'alert_006', severity: 'critical', title: 'Coordinated Fake Reviews', description: '8 five-star reviews posted within 2 minutes across accounts', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), status: 'resolved', category: 'Reviews' },
  { id: 'alert_007', severity: 'medium', title: 'IP Address Reuse', description: 'Multiple accounts from a known proxy IP range', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), status: 'resolved', category: 'Network' },
];

export const mockReports: ReportItem[] = [
  { id: 'rpt_001', name: 'Q3 2026 Fraud Analysis', type: 'fraud', dateGenerated: '2026-08-20', status: 'ready', size: '2.4 MB' },
  { id: 'rpt_002', name: 'Marketplace Trust Summary', type: 'trust', dateGenerated: '2026-08-25', status: 'ready', size: '1.1 MB' },
  { id: 'rpt_003', name: 'Product Performance Report', type: 'product', dateGenerated: '2026-08-27', status: 'generating', size: '—' },
  { id: 'rpt_004', name: 'User Activity Analytics', type: 'analytics', dateGenerated: '2026-08-15', status: 'ready', size: '3.7 MB' },
  { id: 'rpt_005', name: 'Monthly Fraud Trends', type: 'fraud', dateGenerated: '2026-08-01', status: 'scheduled', size: '—' },
  { id: 'rpt_006', name: 'User Trust Assessment', type: 'user', dateGenerated: '2026-08-22', status: 'ready', size: '0.8 MB' },
];

export const mockSettings: SystemSettings = {
  fraudDetection: {
    sensitivity: 'medium',
    autoFlagThreshold: 75,
    ipSharingAlerts: true,
    paymentSharingAlerts: true,
    reviewVelocityAlerts: true,
  },
  notifications: {
    emailAlerts: true,
    slackIntegration: false,
    dailyDigest: true,
    criticalOnly: false,
  },
  trust: {
    minTrustScore: 50,
    autoSuspendThreshold: 25,
    reviewVerification: true,
  },
};
