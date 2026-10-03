import React, { useCallback } from 'react';
import {
  Box,
  Container,
  Skeleton,
  Stack,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Navbar, EmptyState, GlobalButton, GlobalTypography } from '@/components/common';
import { OrderTable } from '@/components/orders/OrderTable';
import { OrderCard } from '@/components/orders/OrderCard';
import { useOrders } from '@/hooks/useOrders';
import type { Order } from '@/types/order';

export const OrdersListPage: React.FC = () => {
  const {
    orders,
    metrics,
    isLoading,
    refresh,
  } = useOrders();

  const handleSelectOrder = useCallback((order: Order) => {
    console.log('order: ', order);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pb: 8 }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <GlobalTypography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
              Gestión de Pedidos
            </GlobalTypography>
            <GlobalTypography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              Búsqueda
            </GlobalTypography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <GlobalButton
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={refresh}
              loading={isLoading}
            >
              Actualizar
            </GlobalButton>
          </Stack>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Skeleton variant="rounded" height={60} />
            <Skeleton variant="rounded" height={60} />
            <Skeleton variant="rounded" height={60} />
            <Skeleton variant="rounded" height={60} />
          </Box>
        ) : !orders.length ? (
          <EmptyState
            title="No se tienen resultados"
            description={
              `No encontramos ningún pedido registrado.`
            }
          />
        ) : (
          <Box>
            {/* Vista de Tabla para Escritorio */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <OrderTable orders={orders} onSelectOrder={handleSelectOrder} />
            </Box>

            {/* Vista de Tarjetas para Móviles */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} onSelectOrder={handleSelectOrder} />
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 1 }}>
              <GlobalTypography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                Mostrando {orders.length} de {metrics.totalOrders} pedidos totales
              </GlobalTypography>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};
