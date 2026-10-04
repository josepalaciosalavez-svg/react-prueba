import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '@/api/usersApi';
import type { SystemUser, UserStatus } from '@/types/user';

export interface UseUsersReturn {
  users: SystemUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  search: string;
  status: UserStatus | '';
  isLoading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSearch: (search: string) => void;
  setStatus: (status: UserStatus | '') => void;
  refresh: () => Promise<void>;
}

export function useUsers(initialSize = 10): UseUsersReturn {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(initialSize);
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<UserStatus | ''>('');
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await usersApi.getUsers(
        {
          page,
          size,
          search: search.trim() || undefined,
          status: status || undefined,
        },
        signal
      );
      setUsers(response.content);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
    } catch (err: unknown) {
      if (signal?.aborted) return;
      const message = err instanceof Error ? err.message : 'Error al cargar los usuarios';
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
        fetchUsers(controller.signal);
      }
    });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [fetchUsers]);

  const handleSetSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(0);
  }, []);

  const handleSetStatus = useCallback((newStatus: UserStatus | '') => {
    setStatus(newStatus);
    setPage(0);
  }, []);

  const handleSetSize = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0);
  }, []);

  const refresh = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  return {
    users,
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
