import React from 'react';
import { Box, Card, CardContent, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { StatusChip, GlobalTypography, AclGuard } from '@/components/common';
import type { Order } from '@/types/order';

interface OrderCardProps {
  order: Order;
  onSelectOrder: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = React.memo(({ order, onSelectOrder, onEditOrder, onDeleteOrder }) => {
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

  const handleClick = React.useCallback(() => {
    onSelectOrder(order);
  }, [order, onSelectOrder]);

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
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
      <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box>
            <GlobalTypography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              {order.codigoProducto}
            </GlobalTypography>
            <GlobalTypography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
              {formattedDate}
            </GlobalTypography>
          </Box>
          <StatusChip status={order.statusPedido} size="small" />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, my: 1, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <PersonOutlinedIcon sx={{ fontSize: 16, color: '#64748B' }} />
            <GlobalTypography variant="body2" sx={{ color: '#334155', fontWeight: 500, fontSize: '0.8125rem' }}>
              {order.nombreCliente || 'Cliente no asignado'}
            </GlobalTypography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 16, color: '#64748B', mt: 0.2 }} />
            <GlobalTypography
              variant="body2"
              sx={{
                color: '#64748B',
                fontSize: '0.775rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
              }}
            >
              {order.direccionEnvio || 'Dirección de entrega pendiente'}
            </GlobalTypography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5, borderColor: '#F1F5F9' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Chip
                label={`${cantidad} pza${cantidad > 1 ? 's' : ''}`}
                size="small"
                sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, backgroundColor: '#F8FAFC' }}
              />
              <GlobalTypography variant="caption" sx={{ color: '#64748B' }}>
                x ${precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </GlobalTypography>
            </Box>
            <GlobalTypography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.4, fontSize: '1.05rem' }}>
              ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </GlobalTypography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            {onEditOrder && (
              <Tooltip title="Editar pedido">
                <IconButton
                  size="small"
                  sx={{
                    color: '#0284C7',
                    backgroundColor: '#F0F9FF',
                    '&:hover': { backgroundColor: '#E0F2FE' },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditOrder(order);
                  }}
                  aria-label={`Editar pedido ${order.codigoProducto}`}
                >
                  <EditOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}

            {onDeleteOrder && (
              <AclGuard role="ADMIN">
                <Tooltip title="Eliminar pedido">
                  <IconButton
                    size="small"
                    sx={{
                      color: '#EF4444',
                      backgroundColor: '#FEF2F2',
                      '&:hover': { backgroundColor: '#FEE2E2' },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteOrder(order);
                    }}
                    aria-label={`Eliminar pedido ${order.codigoProducto}`}
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </AclGuard>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', color: '#E10098', fontWeight: 600, fontSize: '0.8125rem' }}>
              Ver detalle
              <ChevronRightIcon sx={{ fontSize: 18, ml: 0.2 }} />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

OrderCard.displayName = 'OrderCard';

export default OrderCard;
