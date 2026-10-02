import type { AuthResponse, LoginCredentials, User } from '@/types/auth';

const STORAGE_KEY = 'liverpool_auth_session';

const MOCK_USER: User = {
  id: 'usr-001',
  name: 'José Palacios',
  email: 'admin@liverpool.com.mx',
  role: 'ADMIN',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simula latencia de red controlada
    await new Promise((resolve) => setTimeout(resolve, 350));

    const normalizedEmail = credentials.email.trim().toLowerCase();

    // Valida credenciales permitidas para el entorno demo o cualquier email válido con contraseña >= 6 caracteres
    if (
      (normalizedEmail === 'admin@liverpool.com.mx' && credentials.password === 'liverpool2026') ||
      (normalizedEmail.includes('@') && credentials.password.length >= 6)
    ) {
      const user: User = {
        ...MOCK_USER,
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      };

      const response: AuthResponse = {
        user,
        token: `jwt_${btoa(`${user.id}:${Date.now()}`)}`,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
      return response;
    }

    throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
  },

  getCurrentSession(): AuthResponse | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthResponse;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
