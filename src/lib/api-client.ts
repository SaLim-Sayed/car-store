import axios from 'axios';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
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

export const adminApi = {
  // Get admin stats
  getStats: () => 
    apiClient.get('/admin/stats').then(res => res.data),

  // Seed database
  seedDatabase: () => 
    apiClient.post('/admin/seed').then(res => res.data),
};
