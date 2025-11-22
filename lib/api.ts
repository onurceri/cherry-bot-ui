import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unwrap Envelope Pattern & Handle Token Refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Expecting format: { data: T, status: "success" }
    // We return the inner data directly to the application
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if this request should skip auth redirect (e.g., playground)
      const skip = (originalRequest as any)?.skipAuthRedirect;
      if (skip) {
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        // No refresh token, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.hash = '#/login';
        return Promise.reject(error);
      }

      try {
        // Call the refresh endpoint
        const response = await axios.post(
          'http://localhost:8000/api/v1/auth/refresh',
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token: new_refresh_token } = response.data.data;

        // Store new tokens
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', new_refresh_token);

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Process the queued requests
        processQueue(null, access_token);

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError as Error, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.hash = '#/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

import { User } from '../types';

export const getUser = async (): Promise<User> => {
  return api.get('/users/me');
};

export const updateUser = async (data: Partial<User>): Promise<User> => {
  return api.patch('/users/me', data);
};

export const getT = async <T>(url: string): Promise<T> => {
  return api.get(url) as unknown as Promise<T>;
};

export const postT = async <T>(url: string, data?: unknown): Promise<T> => {
  return api.post(url, data as any) as unknown as Promise<T>;
};
