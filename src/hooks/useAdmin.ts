import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface AdminStats {
  totalCars: number;
  totalUsers: number;
  availableCars: number;
  soldCars: number;
  reservedCars: number;
  totalRevenue: number;
}

export interface SeedResult {
  cars: string;
  admin: string;
}

// Hook for getting admin stats
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Hook for seeding database
export function useSeedDatabase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.seedDatabase,
    onSuccess: (data: { success: boolean; results: SeedResult }) => {
      toast.success('تم تهيئة قاعدة البيانات بنجاح');
      // Invalidate stats query to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['featured-cars'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'فشل في تهيئة قاعدة البيانات');
    },
  });
}
