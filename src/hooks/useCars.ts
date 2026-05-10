import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carsApi } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  color: string;
  description: string;
  images: string[];
  features: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarsFilters {
  search?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CarsResponse {
  success: boolean;
  data: Car[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Hook for fetching cars with pagination and filters
export function useCars(page: number = 1, limit: number = 9, filters: CarsFilters = {}) {
  return useQuery({
    queryKey: ['cars', page, limit, filters],
    queryFn: () => carsApi.getCars({ page, limit, ...filters }),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Hook for fetching featured cars (limited to 3)
export function useFeaturedCars() {
  return useQuery({
    queryKey: ['featured-cars'],
    queryFn: () => carsApi.getCars({ limit: 3 }),
    staleTime: 60 * 1000, // 1 minute
  });
}

// Hook for fetching single car by ID
export function useCar(id: string) {
  return useQuery({
    queryKey: ['car', id],
    queryFn: () => carsApi.getCarById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Hook for creating a new car
export function useCreateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: carsApi.createCar,
    onSuccess: () => {
      toast.success('تم إضافة السيارة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['featured-cars'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'فشل في إضافة السيارة');
    },
  });
}

// Hook for updating a car
export function useUpdateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Car> }) =>
      carsApi.updateCar(id, data),
    onSuccess: (_, { id }) => {
      toast.success('تم تحديث السيارة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['car', id] });
      queryClient.invalidateQueries({ queryKey: ['featured-cars'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'فشل في تحديث السيارة');
    },
  });
}

// Hook for deleting a car
export function useDeleteCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: carsApi.deleteCar,
    onSuccess: () => {
      toast.success('تم حذف السيارة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['featured-cars'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'فشل في حذف السيارة');
    },
  });
}
