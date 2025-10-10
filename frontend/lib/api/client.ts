import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types/common.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An error occurred',
      error: error.response?.data?.error,
    };
    
    console.error('API Error:', apiError);
    return Promise.reject(apiError);
  }
);

export { apiClient };

// Generic API methods
export const api = {
  get: <T>(url: string) => apiClient.get<T>(url).then((res) => res.data),
  post: <T>(url: string, data?: any) => apiClient.post<T>(url, data).then((res) => res.data),
  patch: <T>(url: string, data?: any) => apiClient.patch<T>(url, data).then((res) => res.data),
  delete: <T>(url: string) => apiClient.delete<T>(url).then((res) => res.data),
};
