import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { newsApi, showroomsApi } from '@/lib/api-client';
import { toast } from 'sonner';

// --- News Hooks ---

export function useNews(limit?: number, status?: string) {
  return useQuery({
    queryKey: ['news', limit, status],
    queryFn: () => newsApi.getNews(limit, status),
  });
}

export function useNewsById(id: string) {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => newsApi.getNewsById(id),
    enabled: !!id,
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newsData: any) => newsApi.createNews(newsData),
    onSuccess: () => {
      toast.success('تم نشر الخبر بنجاح');
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => newsApi.updateNews(id, data),
    onSuccess: () => {
      toast.success('تم تحديث الخبر بنجاح');
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => newsApi.deleteNews(id),
    onSuccess: () => {
      toast.success('تم حذف الخبر بنجاح');
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: () => {
      toast.error('فشل في حذف الخبر');
    },
  });
}

// --- Showrooms Hooks ---

export function useShowrooms(featured?: boolean) {
  return useQuery({
    queryKey: ['showrooms', featured],
    queryFn: () => showroomsApi.getShowrooms(featured),
  });
}

export function useShowroomById(id: string) {
  return useQuery({
    queryKey: ['showrooms', id],
    queryFn: () => showroomsApi.getShowroomById(id),
    enabled: !!id,
  });
}

export function useCreateShowroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (showroomData: any) => showroomsApi.createShowroom(showroomData),
    onSuccess: () => {
      toast.success('تم تسجيل المعرض بنجاح');
      queryClient.invalidateQueries({ queryKey: ['showrooms'] });
    },
  });
}

export function useUpdateShowroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => showroomsApi.updateShowroom(id, data),
    onSuccess: () => {
      toast.success('تم تحديث بيانات المعرض بنجاح');
      queryClient.invalidateQueries({ queryKey: ['showrooms'] });
    },
  });
}

export function useDeleteShowroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => showroomsApi.deleteShowroom(id),
    onSuccess: () => {
      toast.success('تم حذف المعرض بنجاح');
      queryClient.invalidateQueries({ queryKey: ['showrooms'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: () => {
      toast.error('فشل في حذف المعرض');
    },
  });
}
