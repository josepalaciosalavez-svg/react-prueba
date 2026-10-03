import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Container, Grid } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Navbar,
  EmptyState,
  GlobalButton,
  GlobalTypography,
} from '@/components/common';
import {
  OrderCard,
  OrderTable,
  OrderSearch,
  OrderListSkeleton,
} from '@/components/orders';
import { useOrders } from '@/hooks/useOrders';
import { useOrderStore } from '@/stores';
import type { Order } from '@/types/order';

export const OrdersListPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, metrics, isLoading, refresh } = useOrders();
  const setStoreOrder = useOrderStore((state) => state.setSelectedOrder);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectOrder = useCallback((order: Order) => {
    setStoreOrder(order);
    navigate(`/pedidos/${order.id}`);
  }, [navigate, setStoreOrder]);

  const handleSearchSelect = useCallback((order: Order | null) => {
    setSelectedOrder(order);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSelectedOrder(null);
    }
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedOrder(null);
    setSearchQuery('');
  }, []);

  const displayedOrders = useMemo(() => {
    if (selectedOrder) {
      return orders.filter((o) => o.id === selectedOrder.id);
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.codigoProducto.toLowerCase().includes(q) ||
        (o.nombreCliente && o.nombreCliente.toLowerCase().includes(q)) ||
        (o.entregaId && o.entregaId.toLowerCase().includes(q)) ||
        (o.direccionEnvio && o.direccionEnvio.toLowerCase().includes(q))
    );
  }, [orders, selectedOrder, searchQuery]);

  const hasActiveFilter = Boolean(searchQuery) || Boolean(selectedOrder);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pb: { xs: 6, sm: 8 } }}>
      <Navbar />

      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 2.5, sm: 3.5, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Encabezado con Toolbar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: { xs: 2, sm: 2.5 },
            mb: { xs: 2.5, md: 3 },
          }}
        >
          <Box>
            <GlobalTypography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#0F172A',
                fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2.125rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Gestión de Pedidos
            </GlobalTypography>
          </Box>

          {/* Barra de Búsqueda Global y Acción */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 1.5,
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: 320, md: 400, lg: 440 } }}>
              <OrderSearch
                value={searchQuery}
                onSelectOrder={handleSearchSelect}
                onQueryChange={handleSearchChange}
              />
            </Box>

            <GlobalButton
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={refresh}
              loading={isLoading}
              sx={{
                whiteSpace: 'nowrap',
                height: 40,
                width: { xs: '100%', sm: 'auto' },
                flexShrink: 0,
              }}
            >
              Actualizar
            </GlobalButton>
          </Box>
        </Box>

        {/* Filtro Activo */}
        {hasActiveFilter && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
            <GlobalTypography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
              Filtro activo:
            </GlobalTypography>
            <Chip
              label={selectedOrder ? selectedOrder.codigoProducto : `"${searchQuery}"`}
              size="small"
              onDelete={handleClearFilter}
              sx={{
                backgroundColor: '#FCE7F3',
                color: '#9D174D',
                fontWeight: 600,
                '& .MuiChip-deleteIcon': {
                  color: '#9D174D',
                  '&:hover': { color: '#831843' },
                },
              }}
            />
          </Box>
        )}

        {/* Estados de Carga y Resultados */}
        {isLoading ? (
          <OrderListSkeleton />
        ) : !orders.length ? (
          <EmptyState
            title="No se tienen pedidos registrados"
            description="No encontramos ningún pedido en la base de datos."
          />
        ) : !displayedOrders.length ? (
          <EmptyState
            title="No se tienen resultados que coincidan con los criterios de búsqueda"
            description="Intenta modificando los términos de búsqueda o limpiando el filtro."
          />
        ) : (
          <Box>
            {/* Tabla en Escritorio */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <OrderTable orders={displayedOrders} onSelectOrder={handleSelectOrder} />
            </Box>

            {/* Cuadrícula de Tarjetas en Móviles y Tablets */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Grid container spacing={2}>
                {displayedOrders.map((order) => (
                  <Grid key={order.id} size={{ xs: 12, sm: 6 }}>
                    <OrderCard order={order} onSelectOrder={handleSelectOrder} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Contador de Resultados */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 1,
                mt: 2.5,
                px: 1,
              }}
            >
              <GlobalTypography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                Mostrando {displayedOrders.length} de {metrics.totalOrders} pedidos totales
              </GlobalTypography>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default OrdersListPage;
