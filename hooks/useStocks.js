/**
 * Stocks API Hooks
 * TanStack Query hooks for stock data.
 */

import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';

// Query keys
export const stockKeys = {
  all: ['stocks'],
  lists: () => [...stockKeys.all, 'list'],
  detail: (symbol) => [...stockKeys.all, 'detail', symbol],
};

// Fetch all stocks
export const useStocks = () => {
  return useQuery({
    queryKey: stockKeys.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get('/stocks');
      return data;
    },
    // Refetch every minute for live data
    refetchInterval: 60000,
  });
};

// Fetch single stock
export const useStock = (symbol) => {
  return useQuery({
    queryKey: stockKeys.detail(symbol),
    queryFn: async () => {
      const { data } = await apiClient.get(`/stocks/${symbol}`);
      return data;
    },
    enabled: !!symbol,
    refetchInterval: 60000,
  });
};

// Fetch social movers
export const useSocialMovers = () => {
  return useQuery({
    queryKey: ['socialMovers'],
    queryFn: async () => {
      const { data } = await apiClient.get('/social-movers');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch daily trends
export const useDailyTrends = () => {
  return useQuery({
    queryKey: ['dailyTrends'],
    queryFn: async () => {
      const { data } = await apiClient.get('/daily-trends');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
