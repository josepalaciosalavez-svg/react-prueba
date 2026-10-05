import React, { memo } from 'react';
import { Box } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { GlobalModal, GlobalButton, GlobalTypography } from '@/components/common';
import type { Delivery } from '@/types/delivery';

export interface DeleteDeliveryDialogProps {
  open: boolean;
  delivery: Delivery | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteDeliveryDialog: React.FC<DeleteDeliveryDialogProps> = memo(({
  open,
  delivery,
  isDeleting,
  onConfirm,
  onClose,
}) => {
  if (!delivery) return null;

  return (
    <GlobalModal
      open={open}
      onClose={onClose}
      loading={isDeleting}
      maxWidth="xs"
      title="Eliminar Lugar de Entrega"
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
        ¿Estás seguro de que deseas eliminar permanentemente este lugar de entrega? Esta acción no se puede deshacer.
      </GlobalTypography>

      <Box
        sx={{
          p: 1.5,
          backgroundColor: '#F8FAFC',
          borderRadius: 2,
          border: '1px solid #E2E8F0',
        }}
      >
        <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
          Dirección: <strong style={{ color: '#0F172A' }}>{delivery.direccionEnvio}</strong>
        </GlobalTypography>
        <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
          Cliente: <strong style={{ color: '#0F172A' }}>{delivery.nombreCliente || 'No asignado'}</strong> (ID: {delivery.clienteId})
        </GlobalTypography>
        <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
          ID Entrega: <strong style={{ color: '#0F172A' }}>{delivery.id}</strong>
        </GlobalTypography>
      </Box>
    </GlobalModal>
  );
});

DeleteDeliveryDialog.displayName = 'DeleteDeliveryDialog';

export default DeleteDeliveryDialog;
