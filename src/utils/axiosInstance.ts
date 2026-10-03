import axios from 'axios';
import type { AxiosInstance, AxiosRequestHeaders, AxiosResponseHeaders, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '@/utils/tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 5000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();

    if (token) {
      config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      if (config.method?.toLowerCase() === 'post' && config.data) {
        try {
          const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

          if (body && typeof body === 'object' && 'include' in body) {
            config.params = {
              ...config.params,
              include: (body as Record<string, unknown>).include,
            };

            const { include: _include, ...newData } = body as Record<string, unknown>;
            config.data = newData;

            if (config.headers['Content-Type'] === 'application/json') {
              config.data = JSON.stringify(newData);
            }
          }
        } catch {
          // console.warn('Error al procesar el body de la petición:', error);
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const { response } = error;

      // Si el token es inválido o expiró (401), se purga la sesión de inmediato
      if (response?.status === 401) {
        tokenStorage.clearSession();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      let userMessage = 'Hubo un error, inténtelo más tarde';

      if (response?.status === 500) {
        userMessage = error.response?.data?.message ||
          'Error interno del servidor. Por favor, intente más tarde.';

        if (error.response) {
          if (!error.response.data) {
            error.response.data = {};
          }

          error.response.data.mensaje = userMessage;
        }

        if (!response) {
          const mensaje = 'Error de conexión. Verifique su conexión a internet.';
          if (!error.response) {
            error.response = {
              data: { mensaje },
              status: 0,
              statusText: 'Network Error',
              headers: {} as AxiosResponseHeaders,
              config: error.config || {
                headers: {} as AxiosRequestHeaders
              } as InternalAxiosRequestConfig<any>
            };
          } else {
            error.response.data.mensaje = mensaje;
          }
        }
      }
    } else {
      const defaultMessage = 'Hubo un error, inténtelo más tarde';
      if (error instanceof Error) {
        error.message = defaultMessage;
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
