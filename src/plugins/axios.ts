import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';
// import {getCookie, setCookie, deleteCookie} from "@/utils/cookies.ts";
import type {App} from "vue";
import {useAuthStore} from "@/stores/authStore.ts";
import router from "@/router";
import {setCookie} from "@/utils/cookies.ts";


const authApi = import.meta.env.VITE_AUTH_BASE_URL;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const authAxiosInstance: AxiosInstance = axios.create({
  baseURL: authApi,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

authAxiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();

  if (authStore.accessToken) {
    config.headers.set('Authorization', `Bearer ${authStore.accessToken}`);

    // setCookie("accessToken", authStore.accessToken, 1);
    //   = {
    //   ...config.headers,
    //   Authorization: `Bearer ${authStore.accessToken}`
    // }
  }

  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

authAxiosInstance.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;
  const authStore = useAuthStore();

  if (error.response?.status == 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      if (authStore.refreshToken) {
        const newToken = await authStore.refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return authAxiosInstance(originalRequest);
        }
      }
    } catch (refreshError) {
      console.error('Refresh token error:', refreshError);
    }

    authStore.clearAuth();
    if (router.currentRoute.value.path !== '/login') {
      await router.push({
        path: '/login',
        query: {redirect: router.currentRoute.value.fullPath}
      })
    }
  }

  // Handle 403 Forbidden
  if (error.response?.status === 403) {
    console.error('Access forbidden - insufficient permissions')
    // You can show a toast notification here
    await router.push({path: '/unauthorized'})
  }

  // Handle 500 Internal Server Error
  if (error.response?.status === 500) {
    console.error('Server error:', error.response.data)
    // You can show a global error notification here
  }

  // Handle network errors
  if (!error.response) {
    console.error('Network error:', error.message)
    // You can show a network error notification here
  }

  return Promise.reject(error)
});
// Helper function to create axios instance with custom config
export const createApiClient = (config: AxiosRequestConfig = {}): AxiosInstance => {
  return axios.create({
    ...axiosInstance.defaults,
    ...config
  })
}

export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    authAxiosInstance.get(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    authAxiosInstance.post(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    authAxiosInstance.put(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    authAxiosInstance.patch(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    authAxiosInstance.delete(url, config)
}

export {
  authAxiosInstance, axiosInstance

}

declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime?: Date
    }
    _retry?: boolean
  }
}
