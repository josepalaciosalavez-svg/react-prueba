import React, { memo, useState, useCallback, useTransition } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { GlobalModal, GlobalButton } from '@/components/common';
import { ordersApi } from '@/api/ordersApi';
import { notificationStore } from '@/stores';
import type { Order, OrderStatus, UpdateOrderDto } from '@/types/order';

export interface EditOrderModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onSuccess?: (updatedOrder: Order) => void;
}

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDIENTE',
  'PROCESANDO',
  'ENVIADO',
  'ENTREGADO',
  'CANCELADO',
];

interface EditOrderModalContentProps {
  open: boolean;
  order: Order;
  onClose: () => void;
  onSuccess?: (updatedOrder: Order) => void;
}

const EditOrderModalContent: React.FC<EditOrderModalContentProps> = memo(({
  open,
  order,
  onClose,
  onSuccess,
}) => {
  const [, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState<UpdateOrderDto>(() => ({
    codigoProducto: order.codigoProducto || '',
    cantidad: Number(order.cantidad) || 1,
    precio: Number(order.precio) || 0,
    statusPedido: order.statusPedido || 'PENDIENTE',
    entregaId: order.entregaId || '',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((field: keyof UpdateOrderDto, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigoProducto.trim()) {
      newErrors.codigoProducto = 'El código de producto es obligatorio';
    }

    if (!formData.cantidad || formData.cantidad < 1) {
      newErrors.cantidad = 'La cantidad mínima es 1';
    }

    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.entregaId.trim()) {
      newErrors.entregaId = 'El ID de entrega es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: UpdateOrderDto = {
        codigoProducto: formData.codigoProducto.trim(),
        cantidad: Number(formData.cantidad),
        precio: Number(formData.precio),
        statusPedido: formData.statusPedido,
        entregaId: formData.entregaId.trim(),
      };

      const updated = await ordersApi.updateOrder(order.id, payload);
      notificationStore.getState().showSuccess(`Pedido #${updated.codigoProducto} actualizado exitosamente.`);

      startTransition(() => {
        onSuccess?.(updated);
        onClose();
      });
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  }, [order.id, validate, formData, onSuccess, onClose]);

  return (
    <GlobalModal
      open={open}
      onClose={onClose}
      loading={isSubmitting}
      maxWidth="sm"
      title="Actualizar Pedido"
      subtitle={`Editando ID: ${order.id}`}
      icon={<EditOutlinedIcon sx={{ fontSize: 22 }} />}
      headerBadgeColor={{
        bg: '#FDF2F8',
        color: '#E10098',
      }}
      actions={
        <>
          <GlobalButton
            variant="outlined"
            size="small"
            onClick={onClose}
            disabled={isSubmitting}
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
            loading={isSubmitting}
            loadingText="Guardando..."
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#E10098',
              boxShadow: '0 4px 12px rgba(225, 0, 152, 0.25)',
              '&:hover': {
                backgroundColor: '#C50084',
                boxShadow: '0 6px 16px rgba(225, 0, 152, 0.35)',
              },
            }}
          >
            Guardar Cambios
          </GlobalButton>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12 }}>
            <TextField
              required
              fullWidth
              size="small"
              label="Código de Producto"
              value={formData.codigoProducto}
              onChange={(e) => handleChange('codigoProducto', e.target.value)}
              error={Boolean(errors.codigoProducto)}
              helperText={errors.codigoProducto}
              disabled={isSubmitting}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              fullWidth
              size="small"
              type="number"
              label="Cantidad"
              value={formData.cantidad}
              onChange={(e) => handleChange('cantidad', Math.max(1, parseInt(e.target.value, 10) || 1))}
              error={Boolean(errors.cantidad)}
              helperText={errors.cantidad}
              disabled={isSubmitting}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: 1, step: 1 },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              fullWidth
              size="small"
              type="number"
              label="Precio Unitario"
              value={formData.precio}
              onChange={(e) => handleChange('precio', parseFloat(e.target.value) || 0)}
              error={Boolean(errors.precio)}
              helperText={errors.precio}
              disabled={isSubmitting}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: 0.01, step: 0.01 },
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="edit-order-status-label" shrink>
                Estatus del Pedido
              </InputLabel>
              <Select
                labelId="edit-order-status-label"
                value={formData.statusPedido}
                label="Estatus del Pedido"
                onChange={(e) => handleChange('statusPedido', e.target.value as OrderStatus)}
                disabled={isSubmitting}
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </GlobalModal>
  );
});

EditOrderModalContent.displayName = 'EditOrderModalContent';

export const EditOrderModal: React.FC<EditOrderModalProps> = memo(({
  open,
  order,
  onClose,
  onSuccess,
}) => {
  if (!order || !open) return null;

  return (
    <EditOrderModalContent
      key={order.id}
      open={open}
      order={order}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
});

EditOrderModal.displayName = 'EditOrderModal';

export default EditOrderModal;
