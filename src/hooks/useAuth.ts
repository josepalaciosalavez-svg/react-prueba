import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  return useAuthStore();
};

export default useAuth;
