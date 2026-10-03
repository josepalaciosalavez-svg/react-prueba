import type { AuthResponse, User } from '@/types/auth';

const STORAGE_KEY = '_lp_sec_sess_v1';
const SIGNATURE_PREFIX = 'lp_sec:';

// Caché en memoria protegida
let memoryToken: string | null = null;
let memorySession: AuthResponse | null = null;

export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwtPayload<{ exp?: number }>(token);
    if (!payload?.exp) return false;
    // Margen de 30 segundos de anticipación para evitar carreras en peticiones en vuelo
    const expirationTimeMs = payload.exp * 1000;
    return Date.now() >= expirationTimeMs - 30_000;
  } catch {
    return true;
  }
}

function encodeSecureData(data: string): string {
  try {
    const encoded = btoa(encodeURIComponent(data));
    return `${SIGNATURE_PREFIX}${encoded}`;
  } catch {
    return data;
  }
}

function decodeSecureData(data: string): string | null {
  try {
    if (!data.startsWith(SIGNATURE_PREFIX)) return null;
    const raw = data.slice(SIGNATURE_PREFIX.length);
    return decodeURIComponent(atob(raw));
  } catch {
    return null;
  }
}

export const tokenStorage = {
  saveSession(session: AuthResponse): void {
    if (!session?.token) return;

    memoryToken = session.token;
    memorySession = session;

    try {
      const serialized = JSON.stringify(session);
      const obfuscated = encodeSecureData(serialized);
      sessionStorage.setItem(STORAGE_KEY, obfuscated);
    } catch {
      // console.log('problema al guardar el token')
    }
  },

  getAccessToken(): string | null {
    if (memoryToken) {
      if (!isTokenExpired(memoryToken)) {
        return memoryToken;
      }
      this.clearSession();
      return null;
    }

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const decoded = decodeSecureData(stored);
      if (!decoded) {
        this.clearSession();
        return null;
      }

      const session = JSON.parse(decoded) as AuthResponse;
      if (!session?.token || isTokenExpired(session.token)) {
        this.clearSession();
        return null;
      }

      memoryToken = session.token;
      memorySession = session;
      return memoryToken;
    } catch {
      this.clearSession();
      return null;
    }
  },

  getSession(): AuthResponse | null {
    const token = this.getAccessToken();
    if (!token) return null;

    if (memorySession) {
      return memorySession;
    }

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const decoded = decodeSecureData(stored);
      if (!decoded) return null;
      const session = JSON.parse(decoded) as AuthResponse;
      memorySession = session;
      return session;
    } catch {
      return null;
    }
  },

  getUser(): User | null {
    return this.getSession()?.user ?? null;
  },


  clearSession(): void {
    memoryToken = null;
    memorySession = null;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('liverpool_auth_session');
    } catch {
      // console.log('problema al borrar el token')
    }
  },
};
