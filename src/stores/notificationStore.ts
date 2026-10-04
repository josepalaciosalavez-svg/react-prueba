import { create } from 'zustand';

export type NotificationSeverity = 'error' | 'success' | 'warning' | 'info';

export interface NotificationState {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
  autoHideDuration: number;
}

export interface NotificationStore extends NotificationState {
  showNotification: (
    message: string,
    severity?: NotificationSeverity,
    autoHideDuration?: number
  ) => void;
  showError: (message: string, autoHideDuration?: number) => void;
  showSuccess: (message: string, autoHideDuration?: number) => void;
  showWarning: (message: string, autoHideDuration?: number) => void;
  showInfo: (message: string, autoHideDuration?: number) => void;
  hideNotification: () => void;
}

const DEFAULT_ERROR_DURATION = 6000;
const DEFAULT_INFO_DURATION = 4000;

export const useNotificationStore = create<NotificationStore>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  autoHideDuration: DEFAULT_INFO_DURATION,

  showNotification: (
    message: string,
    severity: NotificationSeverity = 'info',
    autoHideDuration = severity === 'error' ? DEFAULT_ERROR_DURATION : DEFAULT_INFO_DURATION
  ) =>
    set({
      open: true,
      message,
      severity,
      autoHideDuration,
    }),

  showError: (message: string, autoHideDuration = DEFAULT_ERROR_DURATION) =>
    set({
      open: true,
      message,
      severity: 'error',
      autoHideDuration,
    }),

  showSuccess: (message: string, autoHideDuration = DEFAULT_INFO_DURATION) =>
    set({
      open: true,
      message,
      severity: 'success',
      autoHideDuration,
    }),

  showWarning: (message: string, autoHideDuration = DEFAULT_ERROR_DURATION) =>
    set({
      open: true,
      message,
      severity: 'warning',
      autoHideDuration,
    }),

  showInfo: (message: string, autoHideDuration = DEFAULT_INFO_DURATION) =>
    set({
      open: true,
      message,
      severity: 'info',
      autoHideDuration,
    }),

  hideNotification: () =>
    set((state) => ({
      ...state,
      open: false,
    })),
}));

/**
 * Acceso directo imperativo al store para llamadas en servicios/APIs
 * fuera del árbol de renderizado de React sin provocar re-renders innecesarios.
 */
export const notificationStore = useNotificationStore;
