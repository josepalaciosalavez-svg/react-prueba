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
      const [filtered, total] = await Promise.all([
        ordersApi.getOrders(),
        ordersApi.getOrders(),
      ]);
      setOrders(filtered);
      setAllOrders(total);
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
  };
}
