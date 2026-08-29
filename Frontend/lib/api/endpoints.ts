import { apiClient } from './client';
import type {
  DashboardStats,
  FraudRing,
  SuspiciousReview,
  FraudTrendPoint,
  Product,
  AnalyticsData,
  MarketplaceUser,
  ManagedProduct,
  ManagedReview,
  Transaction,
  AlertItem,
  ReportItem,
  SystemSettings,
} from '@/lib/types';

export const endpoints = {
  getDashboardStats: (range: string) =>
    apiClient.get<DashboardStats>(`/stats`, { params: { range } }).then((r) => r.data),

  getFraudRings: () =>
    apiClient.get<FraudRing[]>(`/fraud/rings`).then((r) => r.data),

  getSuspiciousReviews: () =>
    apiClient.get<SuspiciousReview[]>(`/fraud/suspicious-reviews`).then((r) => r.data),

  getFraudTrends: (range: string) =>
    apiClient.get<FraudTrendPoint[]>(`/fraud/trends`, { params: { range } }).then((r) => r.data),

  getProductRecommendations: (productId?: string) =>
    apiClient
      .get<Product[]>(`/recommendations/product/${productId || 'all'}`)
      .then((r) => r.data),

  getUserRecommendations: (userId: string) =>
    apiClient.get<Product[]>(`/recommendations/user/${userId}`).then((r) => r.data),

  getAnalytics: (range: string) =>
    apiClient.get<AnalyticsData>(`/analytics`, { params: { range } }).then((r) => r.data),

  getUsers: () =>
    apiClient.get<MarketplaceUser[]>(`/users`).then((r) => r.data),

  getManagedProducts: () =>
    apiClient.get<ManagedProduct[]>(`/managed-products`).then((r) => r.data),

  getManagedReviews: () =>
    apiClient.get<ManagedReview[]>(`/managed-reviews`).then((r) => r.data),

  getTransactions: () =>
    apiClient.get<Transaction[]>(`/transactions`).then((r) => r.data),

  getAlerts: () =>
    apiClient.get<AlertItem[]>(`/alerts-data`).then((r) => r.data),

  getReports: () =>
    apiClient.get<ReportItem[]>(`/reports-data`).then((r) => r.data),

  getSettings: () =>
    apiClient.get<SystemSettings>(`/settings-data`).then((r) => r.data),
};
