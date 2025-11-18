import { useQuery } from '@tanstack/react-query';
import { fetchTransformers } from '@/lib/api';

/**
 * Custom hook for fetching transformer data using TanStack Query
 */
export const useTransformers = () => {
  return useQuery({
    queryKey: ['transformers'],
    queryFn: fetchTransformers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
