import { create } from 'zustand';
import { authApi } from '@/api/authApi';
import type { LoginCredentials, User } from '@/types/auth';

function checkIsAdmin(user: User | null): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  if (Array.isArray(user.roles)) {
    return user.roles.some((r) => r === 'ROLE_ADMIN' || r === 'ADMIN');
  }
  return false;
}

function extractRoles(user: User | null): string[] {
  if (!user) return [];
  const set = new Set<string>();
  if (user.role) {
    const r = user.role.toUpperCase();
    set.add(r);
    set.add(`ROLE_${r}`);
  }
  if (Array.isArray(user.roles)) {
    user.roles.forEach((r) => {
      const upper = r.toUpperCase();
      set.add(upper);
      set.add(upper.replace(/^ROLE_/, ''));
    });
  }
  return Array.from(set);
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // ACL & Roles
  isAdmin: boolean;
  roles: string[];
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialSession = authApi.getCurrentSession();
const initialUser = initialSession?.user ?? null;
const initialToken = initialSession?.token ?? null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialUser && initialToken),
  isLoading: false,
  error: null,
  isAdmin: checkIsAdmin(initialUser),
  roles: extractRoles(initialUser),

  hasRole: (role: string) => {
    const currentRoles = get().roles;
    const normalized = role.trim().toUpperCase();
    return currentRoles.includes(normalized) || currentRoles.includes(`ROLE_${normalized}`);
  },

  hasAnyRole: (requiredRoles: string[]) => {
    const currentRoles = get().roles;
    return requiredRoles.some((r) => {
      const normalized = r.trim().toUpperCase();
      return currentRoles.includes(normalized) || currentRoles.includes(`ROLE_${normalized}`);
    });
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      const user = response.user;
      const token = response.token;
      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: checkIsAdmin(user),
        roles: extractRoles(user),
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado al iniciar sesión';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    authApi.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      roles: [],
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
