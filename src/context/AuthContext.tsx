import React, { useMemo, useState } from 'react';
import { authApi } from '@/api/authApi';
import { AuthContext } from '@/context/authContextDef';
import type { AuthContextType, LoginCredentials, User } from '@/types/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialización síncrona perezosa para evitar setState en useEffect
  const [user, setUser] = useState<User | null>(() => {
    return authApi.getCurrentSession()?.user ?? null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error inesperado al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authApi.logout();
    setUser(null);
    setError(null);
  };

  const clearError = (): void => setError(null);

  // useMemo previene renders innecesarios en consumidores del contexto
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      logout,
      clearError,
    }),
    [user, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
