import React, { memo } from 'react';
import { Box } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { GlobalModal, GlobalButton, GlobalTypography } from '@/components/common';
import type { Order } from '@/types/order';

export interface DeleteOrderDialogProps {
  open: boolean;
  order: Order | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteOrderDialog: React.FC<DeleteOrderDialogProps> = memo(({
  open,
  order,
  isDeleting,
  onConfirm,
  onClose,
}) => {
  if (!order) return null;

  return (
    <GlobalModal
      open={open}
      onClose={onClose}
      loading={isDeleting}
      maxWidth="xs"
      title="Eliminar Pedido"
      icon={<WarningAmberRoundedIcon sx={{ fontSize: 24 }} />}
      headerBadgeColor={{
        bg: '#FEE2E2',
        color: '#DC2626',
      }}
      actions={
        <>
          <GlobalButton
            variant="outlined"
            size="small"
            onClick={onClose}
            disabled={isDeleting}
            sx={{
              color: '#64748B',
              borderColor: '#CBD5E1',
              '&:hover': {
                borderColor: '#94A3B8',
                backgroundColor: '#F8FAFC',
              },
            }}
          >
            Cancelar
          </GlobalButton>
          <GlobalButton
            variant="contained"
            size="small"
            color="error"
            loading={isDeleting}
            loadingText="Eliminando..."
            onClick={onConfirm}
            sx={{
              backgroundColor: '#DC2626',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
              '&:hover': {
                backgroundColor: '#B91C1C',
                boxShadow: '0 6px 16px rgba(220, 38, 38, 0.35)',
              },
            }}
          >
            Sí, Eliminar
          </GlobalButton>
        </>
      }
    >
      <GlobalTypography variant="body2" sx={{ color: '#475569', mb: 2 }}>
        ¿Estás seguro de que deseas eliminar permanentemente el pedido con código{' '}
        <strong style={{ color: '#0F172A' }}>{order.codigoProducto}</strong>? Esta acción no se puede deshacer.
      </GlobalTypography>

      <Box
        sx={{
          p: 1.5,
          backgroundColor: '#F8FAFC',
          borderRadius: 2,
          border: '1px solid #E2E8F0',
        }}
      >
        <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
          Cliente: <strong>{order.nombreCliente || 'No asignado'}</strong>
        </GlobalTypography>
        <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
          ID Entrega: <strong>{order.entregaId}</strong>
        </GlobalTypography>
      </Box>
    </GlobalModal>
  );
});

DeleteOrderDialog.displayName = 'DeleteOrderDialog';

export default DeleteOrderDialog;
