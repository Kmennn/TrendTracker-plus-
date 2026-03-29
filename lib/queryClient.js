/**
 * TanStack Query Client Configuration
 * Central query client with default options.
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      
      // Cache data for 30 minutes
      gcTime: 1000 * 60 * 30,
      
      // Retry failed requests 2 times
      retry: 2,
      
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

export default queryClient;
