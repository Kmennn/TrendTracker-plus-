/**
 * Alerts API Hooks
 * TanStack Query hooks for alerts CRUD operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';

// Query keys
export const alertKeys = {
  all: ['alerts'],
  lists: () => [...alertKeys.all, 'list'],
  list: (filters) => [...alertKeys.lists(), filters],
  details: () => [...alertKeys.all, 'detail'],
  detail: (id) => [...alertKeys.details(), id],
};

// Fetch all alerts
export const useAlerts = () => {
  return useQuery({
    queryKey: alertKeys.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get('/alerts');
      return data;
    },
  });
};

// Create alert mutation
export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alertData) => {
      const { data } = await apiClient.post('/alerts', alertData);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch alerts
      queryClient.invalidateQueries({ queryKey: alertKeys.lists() });
    },
  });
};

// Delete alert mutation
export const useDeleteAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alertId) => {
      await apiClient.delete(`/alerts/${alertId}`);
      return alertId;
    },
    onMutate: async (alertId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: alertKeys.lists() });
      
      // Snapshot previous value
      const previousAlerts = queryClient.getQueryData(alertKeys.lists());
      
      // Optimistic update
      queryClient.setQueryData(alertKeys.lists(), (old) => 
        old?.filter((alert) => alert.id !== alertId)
      );
      
      return { previousAlerts };
    },
    onError: (err, alertId, context) => {
      // Rollback on error
      queryClient.setQueryData(alertKeys.lists(), context.previousAlerts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.lists() });
    },
  });
};
