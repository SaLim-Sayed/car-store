import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

// Hook for login
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: AuthResponse) => {
      // Store token and user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      // Update React Query cache
      queryClient.setQueryData(['user'], data.data.user);
      
      toast.success('تم تسجيل الدخول بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'فشل في تسجيل الدخول');
    },
  });
}

// Hook for registration
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: AuthResponse) => {
      // Store token and user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      // Update React Query cache
      queryClient.setQueryData(['user'], data.data.user);
      
      toast.success('تم إنشاء الحساب بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'فشل في إنشاء الحساب');
    },
  });
}

// Hook for forgot password
export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('تم إرسال رابط استعادة كلمة المرور');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'فشل في إرسال رابط استعادة كلمة المرور');
    },
  });
}

// Hook for reset password
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success('تم إعادة تعيين كلمة المرور بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'فشل في إعادة تعيين كلمة المرور');
    },
  });
}

// Hook for getting current user
export function useCurrentUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      // Get user from localStorage first
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          return JSON.parse(storedUser);
        }
      }
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for logout
export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    // Clear React Query cache
    queryClient.clear();
    
    toast.success('تم تسجيل الخروج');
    
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };
}

// Hook to check if user is authenticated
export function useIsAuthenticated() {
  const { data: user } = useCurrentUser();
  return !!user;
}

// Hook to check if user is admin
export function useIsAdmin() {
  const { data: user } = useCurrentUser();
  return user?.role === 'admin';
}
