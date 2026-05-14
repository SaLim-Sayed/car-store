import axios from 'axios';

// Base URL logic: prioritize env var, fallback to current origin or localhost
const getBaseUrl = () => {
  // Server-side (SSR/SSG)
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  }
  
  // Client-side
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // If env var exists and we're not on localhost (production), use it
  if (envUrl && !window.location.hostname.includes('localhost')) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }
  
  // Default to current origin /api for local development or if no env var
  return `${window.location.origin}/api`;
};

const baseURL = getBaseUrl();
console.log('API Base URL:', baseURL);

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API functions
export const carsApi = {
  // Get all cars with optional filters
  getCars: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    fuelType?: string;
    transmission?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => 
    apiClient.get('/cars', { params }).then(res => res.data),

  // Get car by ID
  getCarById: (id: string) => 
    apiClient.get(`/cars/${id}`).then(res => res.data),

  // Create new car
  createCar: (carData: any) => 
    apiClient.post('/cars', carData).then(res => res.data),

  // Update car
  updateCar: (id: string, carData: any) => 
    apiClient.put(`/cars/${id}`, carData).then(res => res.data),

  // Delete car
  deleteCar: (id: string) => 
    apiClient.delete(`/cars/${id}`).then(res => res.data),
};

export const authApi = {
  // Login
  login: (credentials: { email: string; password: string }) => 
    apiClient.post('/auth/login', credentials).then(res => res.data),

  // Register
  register: (userData: { name: string; email: string; password: string }) => 
    apiClient.post('/auth/register', userData).then(res => res.data),

  // Forgot password
  forgotPassword: (email: string) => 
    apiClient.post('/auth/forgot-password', { email }).then(res => res.data),

  // Reset password
  resetPassword: (token: string, password: string) => 
    apiClient.post('/auth/reset-password', { token, password }).then(res => res.data),
};

export const newsApi = {
  getNews: (limit?: number, status?: string) => 
    apiClient.get('/news', { params: { limit, status } }).then(res => res.data),
  getNewsById: (id: string) => 
    apiClient.get(`/news/${id}`).then(res => res.data),
  createNews: (newsData: any) => 
    apiClient.post('/news', newsData).then(res => res.data),
  updateNews: (id: string, newsData: any) => 
    apiClient.put(`/news/${id}`, newsData).then(res => res.data),
  deleteNews: (id: string) => 
    apiClient.delete(`/news/${id}`).then(res => res.data),
};

export const showroomsApi = {
  getShowrooms: (featured?: boolean) => 
    apiClient.get('/showrooms', { params: { featured } }).then(res => res.data),
  getShowroomById: (id: string) => 
    apiClient.get(`/showrooms/${id}`).then(res => res.data),
  createShowroom: (showoomData: any) => 
    apiClient.post('/showrooms', showoomData).then(res => res.data),
  updateShowroom: (id: string, showroomData: any) => 
    apiClient.put(`/showrooms/${id}`, showroomData).then(res => res.data),
  deleteShowroom: (id: string) => 
    apiClient.delete(`/showrooms/${id}`).then(res => res.data),
};

export const adminApi = {
  // Get admin stats
  getStats: () => 
    apiClient.get('/admin/stats').then(res => res.data),

  // Seed database
  seedDatabase: () => 
    apiClient.post('/admin/seed').then(res => res.data),
};
