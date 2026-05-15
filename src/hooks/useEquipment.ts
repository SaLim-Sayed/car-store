import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { equipmentApi } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Equipment {
  _id: string;
  title: string;
  brand: string;
  model?: string;
  year?: number;
  price: number;
  category: string;
  condition: string;
  hours: number;
  location: string;
  phone?: string;
  description: string;
  images: string[];
  features: string[];
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export function useEquipment(page = 1, limit = 12, filters: EquipmentFilters = {}) {
  return useQuery({
    queryKey: ['equipment', page, limit, filters],
    queryFn: () => equipmentApi.getEquipment({ page, limit, ...filters }),
    staleTime: 30 * 1000,
  });
}

export function useFeaturedEquipment(limit = 3) {
  return useQuery({
    queryKey: ['featured-equipment', limit],
    queryFn: () => equipmentApi.getEquipment({ limit, featured: true }),
    staleTime: 60 * 1000,
  });
}

export function useEquipmentById(id: string) {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: () => equipmentApi.getEquipmentById(id),
    enabled: !!id,
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: equipmentApi.createEquipment,
    onSuccess: () => {
      toast.success('تمت إضافة المعدة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['featured-equipment'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'فشل في إضافة المعدة');
    },
  });
}

export function useUpdateEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Equipment> }) =>
      equipmentApi.updateEquipment(id, data),
    onSuccess: (_, { id }) => {
      toast.success('تم تحديث المعدة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['equipment', id] });
      queryClient.invalidateQueries({ queryKey: ['featured-equipment'] });
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || 'فشل في تحديث المعدة');
    },
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: equipmentApi.deleteEquipment,
    onSuccess: () => {
      toast.success('تم حذف المعدة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['featured-equipment'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: () => {
      toast.error('فشل في حذف المعدة');
    },
  });
}
