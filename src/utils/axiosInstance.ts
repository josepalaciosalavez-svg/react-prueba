import axios from 'axios';
import type { AxiosInstance, AxiosRequestHeaders, AxiosResponseHeaders, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 5000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      let userMessage = 'Hubo un error, inténtelo más tarde';
      const { response } = error;

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
