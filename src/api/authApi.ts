import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { tokenStorage } from '@/utils/tokenStorage';
import type { ApiAuthResponse, AuthResponse, LoginCredentials, User } from '@/types/auth';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<ApiAuthResponse>('/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password,
      });

      const { data } = response.data;
      const primaryRole = data.usuario.roles.includes('ROLE_ADMIN')
        ? 'ADMIN'
        : data.usuario.roles.includes('ROLE_SUPERVISOR')
        ? 'SUPERVISOR'
        : data.usuario.roles.includes('ROLE_OPERATOR') || data.usuario.roles.includes('ROLE_OPERADOR')
        ? 'OPERATOR'
        : data.usuario.roles[0]?.replace('ROLE_', '') || 'ADMIN';

      const user: User = {
        id: data.usuario.id,
        name: data.usuario.nombre,
        email: data.usuario.email,
        role: primaryRole,
        roles: data.usuario.roles,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.usuario.nombre)}&background=E10098&color=fff`,
      };

      const authSession: AuthResponse = {
        user,
        token: data.accessToken,
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
