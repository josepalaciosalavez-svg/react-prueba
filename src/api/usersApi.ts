import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { notificationStore } from '@/stores/notificationStore';
import type { SystemUser, UserQueryParams, PagedUsersResponse, CreateUserDto } from '@/types/user';

function handleUsersApiError(error: unknown, fallbackMessage: string): never {
  if (axios.isCancel(error) || (error instanceof DOMException && error.name === 'AbortError')) {
    throw error;
  }

  let message = fallbackMessage;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string; mensaje?: string } | undefined;
    const serverMessage = data?.message || data?.mensaje;

    if (status === 403) {
      message = 'Acceso denegado: Se requieren permisos de Administrador para ver usuarios.';
    } else if (status === 404) {
      message = 'El usuario no fue encontrado o no existe.';
    } else if (serverMessage) {
      message = String(serverMessage);
    } else if (error.message) {
      message = error.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  notificationStore.getState().showError(message);
  throw error;
}

export const usersApi = {
  async getUsers(params?: UserQueryParams, signal?: AbortSignal): Promise<PagedUsersResponse> {
    try {
      const response = await axiosInstance.get('/usuarios', {
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.status ? { status: params.status } : {}),
        },
        signal,
      });

      const data = response.data?.data ?? response.data;
      return {
        content: Array.isArray(data?.content) ? data.content : [],
        page: data?.page ?? 0,
        size: data?.size ?? 10,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 0,
        last: Boolean(data?.last),
        first: Boolean(data?.first),
      };
    } catch (error) {
      handleUsersApiError(error, 'Error al consultar la lista de usuarios.');
    }
  },

  async getUserById(id: string, signal?: AbortSignal): Promise<SystemUser | null> {
    try {
      const response = await axiosInstance.get(`/usuarios/${id}`, { signal });
      return response.data?.data ?? response.data ?? null;
    } catch (error) {
      handleUsersApiError(error, 'Error al consultar el detalle del usuario.');
    }
  },

  async createUser(payload: CreateUserDto): Promise<SystemUser> {
    try {
      const response = await axiosInstance.post('/usuarios', payload);
      return response.data?.data ?? response.data;
    } catch (error) {
      handleUsersApiError(error, 'Error al registrar el nuevo usuario.');
    }
  },

  async getTypeaheadSuggestions(query: string, signal?: AbortSignal): Promise<SystemUser[]> {
    const term = query.trim();
    if (!term) return [];
    try {
      const response = await this.getUsers({ search: term, size: 8 }, signal);
      return response.content;
    } catch {
      return [];
    }
  },
};

