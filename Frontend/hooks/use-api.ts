'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { endpoints } from '@/lib/api/endpoints';
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

export function useDashboardStats(range: string) {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', range],
    queryFn: () => endpoints.getDashboardStats(range),
  });
}

export function useFraudRings() {
  return useQuery<FraudRing[]>({
    queryKey: ['fraud-rings'],
    queryFn: () => endpoints.getFraudRings(),
  });
}

export function useSuspiciousReviews() {
  return useQuery<SuspiciousReview[]>({
    queryKey: ['suspicious-reviews'],
    queryFn: () => endpoints.getSuspiciousReviews(),
  });
}

export function useFraudTrends(range: string) {
  return useQuery<FraudTrendPoint[]>({
    queryKey: ['fraud-trends', range],
    queryFn: () => endpoints.getFraudTrends(range),
  });
}

export function useProductRecommendations(productId?: string) {
  return useQuery<Product[]>({
    queryKey: ['product-recommendations', productId],
    queryFn: () => endpoints.getProductRecommendations(productId),
  });
}

export function useUserRecommendations(userId: string) {
  return useQuery<Product[]>({
    queryKey: ['user-recommendations', userId],
    queryFn: () => endpoints.getUserRecommendations(userId),
    enabled: !!userId,
  });
}

export function useAnalytics(range: string) {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics', range],
    queryFn: () => endpoints.getAnalytics(range),
  });
}

export function useUsers() {
  return useQuery<MarketplaceUser[]>({
    queryKey: ['users'],
    queryFn: () => endpoints.getUsers(),
  });
}

export function useManagedProducts() {
  return useQuery<ManagedProduct[]>({
    queryKey: ['managed-products'],
    queryFn: () => endpoints.getManagedProducts(),
  });
}

export function useManagedReviews() {
  return useQuery<ManagedReview[]>({
    queryKey: ['managed-reviews'],
    queryFn: () => endpoints.getManagedReviews(),
  });
}

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => endpoints.getTransactions(),
  });
}

export function useAlerts() {
  return useQuery<AlertItem[]>({
    queryKey: ['alerts'],
    queryFn: () => endpoints.getAlerts(),
  });
}

export function useReports() {
  return useQuery<ReportItem[]>({
    queryKey: ['reports'],
    queryFn: () => endpoints.getReports(),
  });
}

export function useSettings() {
  return useQuery<SystemSettings>({
    queryKey: ['settings'],
    queryFn: () => endpoints.getSettings(),
  });
}
