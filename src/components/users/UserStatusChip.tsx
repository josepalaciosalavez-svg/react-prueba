import React, { memo } from 'react';
import { Chip } from '@mui/material';
import type { UserStatus } from '@/types/user';

interface UserStatusChipProps {
  status: UserStatus | string;
  size?: 'small' | 'medium';
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  ACTIVO: {
    label: 'Activo',
    bg: '#ECFDF5',
    color: '#059669',
    border: '#A7F3D0',
  },
  INACTIVO: {
    label: 'Inactivo',
    bg: '#F8FAFC',
    color: '#64748B',
    border: '#CBD5E1',
  }
};

export const UserStatusChip: React.FC<UserStatusChipProps> = memo(({
  status,
  size = 'small',
}) => {
  const normalized = (status || '').toUpperCase();
  const config = STATUS_CONFIG[normalized] || {
    label: status || 'Desconocido',
    bg: '#F1F5F9',
    color: '#475569',
    border: '#E2E8F0',
  };

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        fontWeight: 700,
        fontSize: size === 'small' ? '0.725rem' : '0.8125rem',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        borderRadius: 1.5,
        height: size === 'small' ? 22 : 28,
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
});

UserStatusChip.displayName = 'UserStatusChip';

export default UserStatusChip;
