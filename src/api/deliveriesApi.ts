import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { notificationStore } from '@/stores/notificationStore';
import type { Delivery, DeliveryQueryParams, PagedDeliveriesResponse } from '@/types/delivery';

function handleDeliveriesApiError(error: unknown, fallbackMessage: string): never {
  if (axios.isCancel(error) || (error instanceof DOMException && error.name === 'AbortError')) {
    throw error;
  }

  let message = fallbackMessage;

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; mensaje?: string } | undefined;
    const serverMessage = data?.message || data?.mensaje;

    if (serverMessage) {
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

export const deliveriesApi = {
  async getDeliveries(params?: DeliveryQueryParams, signal?: AbortSignal): Promise<PagedDeliveriesResponse> {
    try {
      const response = await axiosInstance.get('/entregas', {
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          sortBy: params?.sortBy ?? 'createdAt',
          sortDir: params?.sortDir ?? 'desc',
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
      handleDeliveriesApiError(error, 'Error al consultar el listado de entregas.');
    }
  },

  async getDeliveryById(id: string, signal?: AbortSignal): Promise<Delivery | null> {
    try {
      const response = await axiosInstance.get(`/entregas/${id}`, { signal });
      return response.data?.data ?? response.data ?? null;
    } catch (error) {
      handleDeliveriesApiError(error, 'Error al consultar la entrega solicitada.');
    }
  },

  async getTypeaheadSuggestions(query: string, signal?: AbortSignal): Promise<Delivery[]> {
    const term = query.trim();
    if (!term) return [];
    try {
      const response = await deliveriesApi.getDeliveries({ search: term, size: 8 }, signal);
      return response.content;
    } catch {
      return [];
    }
  },
};
