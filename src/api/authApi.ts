import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { tokenStorage } from '@/utils/tokenStorage';
import type { ApiAuthResponse, AuthResponse, LoginCredentials, User } from '@/types/auth';

const ROLE_PRIORITY = ['ADMIN', 'SUPERVISOR', 'OPERATOR', 'USER'] as const;

function resolvePrimaryRole(roles: string[]): string {
  const normalized = new Set(roles.map((r) => r.replace(/^ROLE_/, '').toUpperCase()));
  return (
    ROLE_PRIORITY.find((priority) => normalized.has(priority)) ||
    roles[0]?.replace(/^ROLE_/, '').toUpperCase() ||
    'USER'
  );
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<ApiAuthResponse>('/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password,
      });

      const raw = response.data as Record<string, any>;
      const data = raw?.data?.usuario ? raw.data : (raw?.usuario ? raw : raw?.data ?? raw);
      const usuario = data?.usuario;

      if (!usuario) {
        throw new Error('La respuesta del servidor no contiene la información del usuario.');
      }

      const roles: string[] = Array.isArray(usuario.roles) ? usuario.roles : [];
      const primaryRole = resolvePrimaryRole(roles);

      const user: User = {
        id: usuario.id,
        name: usuario.nombre,
        email: usuario.email,
        role: primaryRole,
        roles,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre)}&background=E10098&color=fff`,
      };

      const authSession: AuthResponse = {
        user,
        token: data.accessToken || data.token,
        refreshToken: data.refreshToken,
      };

      // Almacenamiento seguro del accessToken y sesión
      tokenStorage.saveSession(authSession);
      return authSession;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        const message =
          errorData?.message ||
          errorData?.mensaje ||
          (error.response?.status === 401 ? 'Email o contraseña incorrectos' : undefined);

        if (message) {
          throw new Error(message);
        }

        if (error.code === 'ERR_NETWORK') {
          throw new Error('No se pudo conectar con el servidor backend. Verifica que esté en ejecución en ' + (import.meta.env.VITE_API_URL || 'http://localhost:8080/api'));
        }
      }
      throw error;
    }
  },

  getCurrentSession(): AuthResponse | null {
    return tokenStorage.getSession();
  },

  logout(): void {
    tokenStorage.clearSession();
  },
};
