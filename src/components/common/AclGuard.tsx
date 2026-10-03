import React from 'react';
import { useAuthStore } from '@/stores/authStore';

export interface AclGuardProps {
  role?: string;
  roles?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const AclGuard: React.FC<AclGuardProps> = ({
  role,
  roles,
  fallback = null,
  children,
}) => {
  const hasRole = useAuthStore((state) => state.hasRole);
  const hasAnyRole = useAuthStore((state) => state.hasAnyRole);

  let allowed = false;
  if (role) {
    allowed = hasRole(role);
  } else if (roles && roles.length > 0) {
    allowed = hasAnyRole(roles);
  } else {
    allowed = true;
  }

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AclGuard;
