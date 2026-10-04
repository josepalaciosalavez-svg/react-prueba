import { useCallback, useEffect, useMemo, useState } from 'react';
import { ordersApi } from '@/api/ordersApi';
import type { Order, OrderSummaryMetrics } from '@/types/order';

interface UseOrdersReturn {
  orders: Order[];
  allOrders: Order[];
  isLoading: boolean;
  metrics: OrderSummaryMetrics;
  error: string | null;
  refresh: () => Promise<void>;
  removeOrder: (id: string) => Promise<boolean>;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getOrders();
      setOrders(data);
      setAllOrders(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar el listado de pedidos';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    Promise.resolve().then(() => {
      if (!isCancelled) {
        loadData();
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [loadData]);

  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const removeOrder = useCallback(async (id: string): Promise<boolean> => {
    try {
      await ordersApi.deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setAllOrders((prev) => prev.filter((o) => o.id !== id));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar el pedido';
      setError(message);
      throw err;
    }
  }, []);

  const metrics = useMemo<OrderSummaryMetrics>(() => {
    return ordersApi.calculateMetrics(allOrders);
  }, [allOrders]);

  return {
    orders,
    allOrders,
    metrics,
    isLoading,
    error,
    refresh,
    removeOrder,
  };
}
