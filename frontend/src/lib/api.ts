import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  name: string;
  quantity: number;
  rate: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

// Auth API calls
export const authApi = {
  login: (data: LoginData) => 
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data),
  
  register: (data: RegisterData) => 
    api.post<ApiResponse<{ user: User }>>('/auth/register', data),
  
  getMe: () => 
    api.get<ApiResponse<{ user: User }>>('/auth/me'),
};

// Invoice API calls
export const invoiceApi = {
  generatePDF: (products: Product[]) => 
    api.post('/invoice/generate', { products }, { responseType: 'blob' }),
  
  getHistory: () => 
    api.get<ApiResponse<{ invoices: any[] }>>('/invoice/history'),
};
