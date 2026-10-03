import axiosInstance from '@/utils/axiosInstance';
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
