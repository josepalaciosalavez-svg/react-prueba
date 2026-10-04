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
  DeleteOrderDialog,
  EditOrderModal,
} from '@/components/orders';
import { useOrders } from '@/hooks/useOrders';
import { useOrderStore, notificationStore } from '@/stores';
import type { Order } from '@/types/order';

export const OrdersListPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, metrics, isLoading, refresh, removeOrder } = useOrders();
  const setStoreOrder = useOrderStore((state) => state.setSelectedOrder);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleSelectOrder = useCallback((order: Order) => {
    setStoreOrder(order);
    navigate(`/pedidos/${order.id}`);
  }, [navigate, setStoreOrder]);

  const handleRequestDelete = useCallback((order: Order) => {
    setOrderToDelete(order);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      await removeOrder(orderToDelete.id);
      notificationStore.getState().showSuccess(`Pedido #${orderToDelete.codigoProducto} eliminado exitosamente.`);
      setOrderToDelete(null);
    } catch {
    } finally {
      setIsDeleting(false);
    }
  }, [orderToDelete, removeOrder]);

  const handleCloseDelete = useCallback(() => {
    if (!isDeleting) {
      setOrderToDelete(null);
    }
  }, [isDeleting]);

  const handleRequestEdit = useCallback((order: Order) => {
    setOrderToEdit(order);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setOrderToEdit(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    refresh();
  }, [refresh]);

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
              size="medium"
              startIcon={<RefreshIcon />}
              onClick={refresh}
              loading={isLoading}
              sx={{
                color: '#E10098',
                borderColor: '#FCE7F3',
                backgroundColor: '#FFFFFF',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#E10098',
                  backgroundColor: '#FDF2F8',
                },
              }}
            >
              Actualizar
            </GlobalButton>
          </Box>
        </Box>

        {hasActiveFilter && (
          <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <GlobalTypography variant="body2" sx={{ color: '#64748B' }}>
              Filtro activo:
            </GlobalTypography>
            <Chip
              label={selectedOrder ? `Pedido: ${selectedOrder.codigoProducto}` : `Búsqueda: "${searchQuery}"`}
              onDelete={handleClearFilter}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ borderColor: '#E10098', color: '#E10098', fontWeight: 600 }}
            />
          </Box>
        )}

        {isLoading ? (
          <OrderListSkeleton />
        ) : displayedOrders.length === 0 ? (
          <EmptyState
            title="No se tienen resultados que coincidan con los criterios de búsqueda"
            description="Intenta modificando los términos de búsqueda o limpiando el filtro."
          />
        ) : (
          <Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <OrderTable
                orders={displayedOrders}
                onSelectOrder={handleSelectOrder}
                onEditOrder={handleRequestEdit}
                onDeleteOrder={handleRequestDelete}
              />
            </Box>

            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Grid container spacing={2}>
                {displayedOrders.map((order) => (
                  <Grid key={order.id} size={{ xs: 12, sm: 6 }}>
                    <OrderCard
                      order={order}
                      onSelectOrder={handleSelectOrder}
                      onEditOrder={handleRequestEdit}
                      onDeleteOrder={handleRequestDelete}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

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

        <DeleteOrderDialog
          open={Boolean(orderToDelete)}
          order={orderToDelete}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onClose={handleCloseDelete}
        />

        <EditOrderModal
          open={Boolean(orderToEdit)}
          order={orderToEdit}
          onClose={handleCloseEdit}
          onSuccess={handleEditSuccess}
        />
      </Container>
    </Box>
  );
};

export default OrdersListPage;
