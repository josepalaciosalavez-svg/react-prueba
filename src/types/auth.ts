export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OPERATOR' | 'SUPERVISOR' | 'CLIENTE' | string;
  avatar?: string;
  roles?: string[];
  clienteId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface ApiAuthResponse {
  success: boolean;
  message?: string;
  data: {
    accessToken: string;
    refreshToken?: string;
    tokenType: string;
    expiresIn?: number;
    usuario: {
      id: string;
      nombre: string;
      email: string;
      roles: string[];
      status?: string;
      clienteId?: string;
      createdAt?: string;
    };
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
