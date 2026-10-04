import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { notificationStore } from '@/stores/notificationStore';
import type { Order, OrderSummaryMetrics, UpdateOrderDto } from '@/types/order';

type ErrorStatusMap = Record<number, string>;

function handleApiError(
  error: unknown,
  fallbackMessage: string,
  statusOverrides?: ErrorStatusMap
): never {
  if (axios.isCancel(error) || (error instanceof DOMException && error.name === 'AbortError')) {
    throw error;
  }

  let message = fallbackMessage;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string; mensaje?: string } | undefined;
    const serverMessage = data?.message || data?.mensaje;

    if (status && statusOverrides?.[status]) {
      message = statusOverrides[status];
    } else if (status === 403) {
      message = 'Acceso denegado: No cuentas con permisos suficientes para realizar esta acción.';
    } else if (status === 404) {
      message = 'El recurso solicitado no fue encontrado o no existe.';
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

async function withErrorHandling<T>(
  action: () => Promise<T>,
  fallbackMessage: string,
  statusOverrides?: ErrorStatusMap
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    handleApiError(error, fallbackMessage, statusOverrides);
  }
}

export const ordersApi = {
  async getOrders(signal?: AbortSignal): Promise<Order[]> {
    const response = await axiosInstance.get('/pedidos', {
      params: { size: 100 },
      signal,
    });

    const data = response.data?.data?.content ?? response.data?.data ?? response.data ?? [];
    return Array.isArray(data) ? data : [];
  },

  async getOrderById(id: string, signal?: AbortSignal): Promise<Order | null> {
    const response = await axiosInstance.get(`/pedidos/${id}`, { signal });
    return response.data?.data ?? response.data ?? null;
  },

  async updateOrder(id: string, payload: UpdateOrderDto): Promise<Order> {
    return withErrorHandling(
      async () => {
        const response = await axiosInstance.put(`/pedidos/${id}`, payload);
        return response.data?.data ?? response.data;
      },
      'Ocurrió un error inesperado al actualizar el pedido.',
      {
        403: 'Acceso denegado: No tienes permisos para actualizar este pedido.',
        404: 'El pedido no fue encontrado o no existe.',
      }
    );
  },

  async deleteOrder(id: string): Promise<boolean> {
    return withErrorHandling(
      async () => {
        const response = await axiosInstance.delete(`/pedidos/${id}`);
        return response.status === 200 || response.data?.success === true;
      },
      'Ocurrió un error inesperado al eliminar el pedido.',
      {
        403: 'Acceso denegado: Se requieren permisos de Administrador para eliminar pedidos.',
        404: 'El pedido no fue encontrado o ya fue eliminado previamente.',
      }
    );
  },

  async getTypeaheadSuggestions(query: string, signal?: AbortSignal): Promise<Order[]> {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    try {
      const orders = await this.getOrders(signal);
      return orders
        .filter(
          (o) =>
            o.codigoProducto.toLowerCase().includes(term) ||
            (o.nombreCliente && o.nombreCliente.toLowerCase().includes(term)) ||
            (o.entregaId && o.entregaId.toLowerCase().includes(term)) ||
            (o.direccionEnvio && o.direccionEnvio.toLowerCase().includes(term))
        )
        .slice(0, 8);
    } catch {
      return [];
    }
  },

  calculateMetrics(orders: Order[]): OrderSummaryMetrics {
    return {
      totalOrders: orders.length,
      pendingCount: orders.filter((o) => o.statusPedido === 'PENDIENTE').length,
      processingCount: orders.filter((o) => o.statusPedido === 'PROCESANDO').length,
      shippedCount: orders.filter((o) => o.statusPedido === 'ENVIADO').length,
      deliveredCount: orders.filter((o) => o.statusPedido === 'ENTREGADO').length,
      cancelledCount: orders.filter((o) => o.statusPedido === 'CANCELADO').length,
      totalSalesVolume: orders.reduce((sum, o) => sum + (o.total ?? (o.precio * o.cantidad)), 0),
    };
  },
};
