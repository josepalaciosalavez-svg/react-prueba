import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { notificationStore } from '@/stores/notificationStore';
import type { Order, OrderSummaryMetrics } from '@/types/order';

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

  async deleteOrder(id: string): Promise<boolean> {
    try {
      const response = await axiosInstance.delete(`/pedidos/${id}`);
      return response.status === 200 || response.data?.success === true;
    } catch (error: unknown) {
      let errorMessage = 'Ocurrió un error inesperado al eliminar el pedido.';

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as { message?: string; mensaje?: string } | undefined;
        const serverMessage = data?.message || data?.mensaje;

        if (status === 403) {
          errorMessage = 'Acceso denegado: Se requieren permisos de Administrador para eliminar pedidos.';
        } else if (status === 404) {
          errorMessage = 'El pedido no fue encontrado o ya fue eliminado previamente.';
        } else if (serverMessage) {
          errorMessage = String(serverMessage);
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Despacho directo a la notificación global sin renderizar componentes intermedios
      notificationStore.getState().showError(errorMessage);
      throw error;
    }
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
