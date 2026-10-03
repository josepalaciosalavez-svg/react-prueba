import React from 'react';
import { Box, Card, CardContent, Chip, Divider, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { StatusChip } from '@/components/common/StatusChip';
import type { Order } from '@/types/order';

interface OrderCardProps {
  order: Order;
  onSelectOrder: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = React.memo(({ order, onSelectOrder }) => {
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    : 'N/A';

  const precio = Number(order.precio ?? 0);
  const cantidad = Number(order.cantidad ?? 1);
  const total = Number(order.total ?? (precio * cantidad));

  return (
    <Card
      onClick={() => onSelectOrder(order)}
      sx={{
        cursor: 'pointer',
        mb: 2,
        borderRadius: 2.5,
        border: '1px solid #E2E8F0',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
          borderColor: '#CBD5E1',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
              {order.codigoProducto}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              {formattedDate}
            </Typography>
          </Box>
          <StatusChip status={order.statusPedido} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <PersonOutlinedIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
            {order.nombreCliente || 'No asignado'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
          <LocationOnOutlinedIcon sx={{ fontSize: 18, color: '#64748B', mt: 0.2 }} />
          <Typography variant="caption" sx={{ color: '#64748B', lineHeight: 1.3 }}>
            {order.direccionEnvio || 'Dirección pendiente'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            Entrega:
          </Typography>
          <Chip
            label={order.entregaId}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.6875rem',
              fontFamily: 'monospace',
              backgroundColor: '#F1F5F9',
              color: '#475569',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px dashed #E2E8F0' }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              {cantidad} pza{cantidad > 1 ? 's' : ''} • ${precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })} c/u
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
              ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', color: '#E10098', fontWeight: 600, fontSize: '0.8125rem' }}>
            Ver detalle
            <ChevronRightIcon sx={{ fontSize: 18, ml: 0.2 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

OrderCard.displayName = 'OrderCard';
