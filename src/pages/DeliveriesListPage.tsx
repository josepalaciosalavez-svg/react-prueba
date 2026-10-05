import React, { memo, useState, useCallback, useMemo } from 'react';
import { Box, Chip, Container, Grid, Paper, TablePagination } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import {
  Navbar,
  EmptyState,
  GlobalTypography,
  GlobalSkeleton,
  GlobalButton,
} from '@/components/common';
import {
  DeliveriesTable,
  DeliveryCard,
  DeliveriesFilterBar,
  DeliveryModal,
  DeleteDeliveryDialog,
} from '@/components/deliveries';
import { useDeliveries } from '@/hooks/useDeliveries';
import { deliveriesApi } from '@/api/deliveriesApi';
import { notificationStore } from '@/stores';
import type { Delivery } from '@/types/delivery';

export const DeliveriesListPage: React.FC = memo(() => {
  const {
    deliveries,
    page,
    size,
    totalElements,
    search,
    status,
    isLoading,
    setPage,
    setSize,
    setSearch,
    setStatus,
    refresh,
  } = useDeliveries(10);

  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [selectedDeliveryForModal, setSelectedDeliveryForModal] = useState<Delivery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [deliveryToDelete, setDeliveryToDelete] = useState<Delivery | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleOpenCreate = useCallback(() => {
    setSelectedDeliveryForModal(null);
    setIsModalOpen(true);
  }, []);

  const handleEditDelivery = useCallback((delivery: Delivery) => {
    setSelectedDeliveryForModal(delivery);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDeliveryForModal(null);
  }, []);

  const handleModalSuccess = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleOpenDelete = useCallback((delivery: Delivery) => {
    setDeliveryToDelete(delivery);
  }, []);

  const handleCloseDelete = useCallback(() => {
    if (!isDeleting) {
      setDeliveryToDelete(null);
    }
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deliveryToDelete) return;
    setIsDeleting(true);
    try {
      await deliveriesApi.deleteDelivery(deliveryToDelete.id);
      notificationStore.getState().showSuccess('Lugar de entrega eliminado exitosamente');
      setDeliveryToDelete(null);
      refresh();
    } catch {
    } finally {
      setIsDeleting(false);
    }
  }, [deliveryToDelete, refresh]);

  const handleSelectDelivery = useCallback((delivery: Delivery | null) => {
    setSelectedDelivery(delivery);
    if (delivery) {
      setSearch(delivery.direccionEnvio);
    }
  }, [setSearch]);

  const handleSearchChange = useCallback((query: string) => {
    setSearch(query);
    if (!query) {
      setSelectedDelivery(null);
    }
  }, [setSearch]);

  const handleClearFilter = useCallback(() => {
    setSelectedDelivery(null);
    setSearch('');
    setStatus('');
  }, [setSearch, setStatus]);

  const displayedDeliveries = useMemo(() => {
    if (selectedDelivery) {
      return deliveries.filter((d) => d.id === selectedDelivery.id);
    }
    return deliveries;
  }, [selectedDelivery, deliveries]);

  const hasFilter = Boolean(search || status || selectedDelivery);

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
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                backgroundColor: '#FDF2F8',
                color: '#E10098',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocalShippingOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <GlobalTypography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: '#0F172A',
                    fontSize: { xs: '1.5rem', sm: '1.875rem' },
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  Lugares de Entrega
                </GlobalTypography>
                <Chip
                  label={`${totalElements} registrada${totalElements !== 1 ? 's' : ''}`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                  }}
                />
              </Box>
              <GlobalTypography variant="body2" sx={{ color: '#64748B', mt: 0.25 }}>
                Consulta y gestiona las direcciones donde se entregarán los pedidos
              </GlobalTypography>
            </Box>
          </Box>

          <GlobalButton
            variant="contained"
            startIcon={<AddLocationAltOutlinedIcon sx={{ fontSize: 20 }} />}
            onClick={handleOpenCreate}
            sx={{
              backgroundColor: '#E10098',
              color: '#FFFFFF',
              fontWeight: 700,
              height: 40,
              px: 2.5,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(225, 0, 152, 0.25)',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: '#C50084',
                boxShadow: '0 4px 12px rgba(225, 0, 152, 0.35)',
              },
            }}
          >
            Nueva Entrega
          </GlobalButton>
        </Box>

        <DeliveriesFilterBar
          status={status}
          isLoading={isLoading}
          searchValue={search}
          onSelectDelivery={handleSelectDelivery}
          onSearchChange={handleSearchChange}
          onStatusChange={setStatus}
          onRefresh={refresh}
        />

        {hasFilter && (
          <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <GlobalTypography variant="body2" sx={{ color: '#64748B' }}>
              Filtro activo:
            </GlobalTypography>
            <Chip
              label={
                selectedDelivery
                  ? `Entrega: ${selectedDelivery.direccionEnvio}`
                  : search
                  ? `Búsqueda: "${search}"`
                  : `Estatus: ${status}`
              }
              onDelete={handleClearFilter}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ borderColor: '#E10098', color: '#E10098', fontWeight: 600 }}
            />
          </Box>
        )}

        {isLoading ? (
          <GlobalSkeleton variant="responsive" rows={size} />
        ) : displayedDeliveries.length === 0 ? (
          <EmptyState
            title={
              hasFilter
                ? 'No se encontraron entregas coincidentes'
                : 'No hay lugares de entrega registrados'
            }
            description={
              hasFilter
                ? 'Intenta modificando los términos de búsqueda o el filtro de estatus.'
                : 'Actualmente no existen direcciones de entrega en el catálogo del sistema.'
            }
          />
        ) : (
          <Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <DeliveriesTable
                deliveries={displayedDeliveries}
                page={page}
                size={size}
                totalElements={totalElements}
                onPageChange={setPage}
                onRowsPerPageChange={setSize}
                onEditDelivery={handleEditDelivery}
                onDeleteDelivery={handleOpenDelete}
              />
            </Box>

            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Grid container spacing={2}>
                {displayedDeliveries.map((delivery) => (
                  <Grid key={delivery.id} size={{ xs: 12, sm: 6 }}>
                    <DeliveryCard
                      delivery={delivery}
                      onEditDelivery={handleEditDelivery}
                      onDeleteDelivery={handleOpenDelete}
                    />
                  </Grid>
                ))}
              </Grid>

              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalElements}
                  rowsPerPage={size}
                  page={page}
                  onPageChange={(_e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => setSize(parseInt(e.target.value, 10))}
                  labelRowsPerPage="Por pág:"
                  labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                />
              </Paper>
            </Box>
          </Box>
        )}

        <DeliveryModal
          open={isModalOpen}
          delivery={selectedDeliveryForModal}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />

        <DeleteDeliveryDialog
          open={Boolean(deliveryToDelete)}
          delivery={deliveryToDelete}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onClose={handleCloseDelete}
        />
      </Container>
    </Box>
  );
});

DeliveriesListPage.displayName = 'DeliveriesListPage';

export default DeliveriesListPage;
