import React from 'react';
import { Chip, type ChipProps } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import type { OrderStatus } from '@/types/order';

interface StatusConfig {
  label: string;
  color: ChipProps['color'];
  icon: React.ReactElement;
  bg: string;
  textColor: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  PENDIENTE: {
    label: 'Pendiente',
    color: 'warning',
    icon: <AccessTimeIcon sx={{ fontSize: 16 }} />,
    bg: '#FEF3C7',
    textColor: '#92400E',
  },
  PENDING: {
    label: 'Pendiente',
    color: 'warning',
    icon: <AccessTimeIcon sx={{ fontSize: 16 }} />,
    bg: '#FEF3C7',
    textColor: '#92400E',
  },
  PROCESANDO: {
    label: 'Procesando',
    color: 'info',
    icon: <AutorenewIcon sx={{ fontSize: 16 }} />,
    bg: '#DBEAFE',
    textColor: '#1E40AF',
  },
  PROCESSING: {
    label: 'Procesando',
    color: 'info',
    icon: <AutorenewIcon sx={{ fontSize: 16 }} />,
    bg: '#DBEAFE',
    textColor: '#1E40AF',
  },
  ENVIADO: {
    label: 'Enviado',
    color: 'primary',
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />,
    bg: '#FCE7F3',
    textColor: '#9D174D',
  },
  SHIPPED: {
    label: 'Enviado',
    color: 'primary',
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />,
    bg: '#FCE7F3',
    textColor: '#9D174D',
  },
  ENTREGADO: {
    label: 'Entregado',
    color: 'success',
    icon: <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />,
    bg: '#D1FAE5',
    textColor: '#065F46',
  },
  DELIVERED: {
    label: 'Entregado',
    color: 'success',
    icon: <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />,
    bg: '#D1FAE5',
    textColor: '#065F46',
  },
  CANCELADO: {
    label: 'Cancelado',
    color: 'error',
    icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} />,
    bg: '#FEE2E2',
    textColor: '#991B1B',
  },
  CANCELLED: {
    label: 'Cancelado',
    color: 'error',
    icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} />,
    bg: '#FEE2E2',
    textColor: '#991B1B',
  },
  ACTIVO: {
    label: 'Activo',
    color: 'success',
    icon: <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />,
    bg: '#DCFCE7',
    textColor: '#15803D',
  },
  INACTIVO: {
    label: 'Inactivo',
    color: 'default',
    icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} />,
    bg: '#F1F5F9',
    textColor: '#64748B',
  },
};

interface StatusChipProps {
  status: OrderStatus | string;
  size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = React.memo(({ status, size = 'small' }) => {
  const normalizedKey = (status || '').toUpperCase();
  const config = STATUS_CONFIG[normalizedKey] ?? {
    label: status,
    color: 'default' as ChipProps['color'],
    icon: <AccessTimeIcon sx={{ fontSize: 16 }} />,
    bg: '#F1F5F9',
    textColor: '#475569',
  };

  return (
    <Chip
      size={size}
      icon={config.icon}
      label={config.label}
      sx={{
        backgroundColor: config.bg,
        color: config.textColor,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.8125rem',
        '& .MuiChip-icon': {
          color: config.textColor,
        },
      }}
    />
  );
});

StatusChip.displayName = 'StatusChip';
