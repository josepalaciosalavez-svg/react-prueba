import { useState, useEffect, useCallback } from 'react';
import { deliveriesApi } from '@/api/deliveriesApi';
import type { Delivery, DeliveryStatus } from '@/types/delivery';

export interface UseDeliveriesReturn {
  deliveries: Delivery[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  search: string;
  status: DeliveryStatus | '';
  isLoading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSearch: (search: string) => void;
  setStatus: (status: DeliveryStatus | '') => void;
  refresh: () => Promise<void>;
}

export function useDeliveries(initialSize = 10): UseDeliveriesReturn {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(initialSize);
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<DeliveryStatus | ''>('');
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveries = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deliveriesApi.getDeliveries(
        {
          page,
          size,
          sortBy: 'createdAt',
          sortDir: 'desc',
          search: search.trim() || undefined,
          status: status || undefined,
        },
        signal
      );
      setDeliveries(response.content);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
    } catch (err: unknown) {
      if (signal?.aborted) return;
      const message = err instanceof Error ? err.message : 'Error al cargar las entregas';
      setError(message);
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [page, size, search, status]);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    Promise.resolve().then(() => {
      if (!isCancelled) {
        fetchDeliveries(controller.signal);
      }
    });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [fetchDeliveries]);

  const handleSetSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(0);
  }, []);

  const handleSetStatus = useCallback((newStatus: DeliveryStatus | '') => {
    setStatus(newStatus);
    setPage(0);
  }, []);

  const handleSetSize = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0);
  }, []);

  const refresh = useCallback(async () => {
    await fetchDeliveries();
  }, [fetchDeliveries]);

  return {
    deliveries,
    page,
    size,
    totalElements,
    totalPages,
    search,
    status,
    isLoading,
    error,
    setPage,
    setSize: handleSetSize,
    setSearch: handleSetSearch,
    setStatus: handleSetStatus,
    refresh,
  };
}
