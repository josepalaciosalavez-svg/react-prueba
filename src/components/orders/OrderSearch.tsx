import React, { memo } from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import {
  GlobalSearch,
  GlobalTypography,
  StatusChip,
} from '@/components/common';
import { ordersApi } from '@/api/ordersApi';
import type { Order } from '@/types/order';

export interface OrderSearchProps {
  value?: string;
  onSelectOrder: (order: Order | null) => void;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const fetchOrderSuggestions = async (query: string, signal: AbortSignal): Promise<Order[]> => {
  return ordersApi.getTypeaheadSuggestions(query, signal);
};

const getOptionLabel = (order: Order): string =>
  `${order.codigoProducto} - ${order.nombreCliente || 'Sin cliente'}`;

const getOptionKey = (order: Order): string | number => order.id;

const renderOptionContent = (order: Order): React.ReactNode => {
  const total = order.total ?? (order.precio * order.cantidad);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', py: 0.5 }}>
      <Box sx={{ minWidth: 0, mr: 1.5 }}>
        <GlobalTypography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: '#0F172A',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {order.codigoProducto}
        </GlobalTypography>
        <GlobalTypography
          variant="caption"
          sx={{
            color: '#64748B',
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {order.nombreCliente || 'Sin cliente asignado'} • {order.entregaId}
        </GlobalTypography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        <GlobalTypography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
          ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </GlobalTypography>
        <StatusChip status={order.statusPedido} size="small" />
      </Box>
    </Box>
  );
};

export const OrderSearch: React.FC<OrderSearchProps> = memo(({
  value = '',
  onSelectOrder,
  onQueryChange,
  placeholder = 'Buscar por código, cliente o entrega...',
  size = 'small',
  fullWidth = true,
  disabled = false,
  sx,
}) => {

  return (
    <GlobalSearch<Order>
      value={value}
      fetchOptions={fetchOrderSuggestions}
      getOptionLabel={getOptionLabel}
      getOptionKey={getOptionKey}
      renderOptionContent={renderOptionContent}
      onSelect={onSelectOrder}
      onQueryChange={onQueryChange}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      sx={sx}
    />
  );
});

OrderSearch.displayName = 'OrderSearch';

export default OrderSearch;
