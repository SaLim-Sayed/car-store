import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export interface SettingsData {
  phoneDisplay: string;
  phoneE164: string;
  facebook: string;
  instagram: string;
  twitter: string;
  email: string;
  address: string;
}

export const settingsApi = {
  getSettings: async () => {
    const res = await axios.get('/api/settings');
    return res.data;
  },
  updateSettings: async (data: Partial<SettingsData>) => {
    const res = await axios.post('/api/settings', data);
    return res.data;
  },
};

export function useSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: () => settingsApi.getSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateSettings,
    onSuccess: () => {
      toast.success('تم تحديث الإعدادات بنجاح');
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'فشل في تحديث الإعدادات');
    },
  });
}
