import React, { memo, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { GlobalModal, GlobalButton, GlobalTypography } from '@/components/common';
import { deliveriesApi } from '@/api/deliveriesApi';
import { notificationStore } from '@/stores';
import type { Delivery, DeliveryRequest, DeliveryStatus, ClientOption } from '@/types/delivery';

export interface DeliveryModalProps {
  open: boolean;
  delivery?: Delivery | null;
  onClose: () => void;
  onSuccess?: (savedDelivery: Delivery) => void;
}

export type CreateDeliveryModalProps = DeliveryModalProps;
export type EditDeliveryModalProps = DeliveryModalProps;

const INITIAL_FORM: DeliveryRequest = {
  clienteId: '',
  direccionEnvio: '',
  status: 'ACTIVO',
};

const DeliveryModalContent: React.FC<{
  open: boolean;
  delivery?: Delivery | null;
  onClose: () => void;
  onSuccess?: (savedDelivery: Delivery) => void;
}> = memo(({ open, delivery, onClose, onSuccess }) => {
  const isEdit = Boolean(delivery);

  const [formData, setFormData] = useState<DeliveryRequest>(() => {
    if (delivery) {
      return {
        clienteId: delivery.clienteId || '',
        direccionEnvio: delivery.direccionEnvio || '',
        status: delivery.status || 'ACTIVO',
      };
    }
    return INITIAL_FORM;
  });

  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(() => {
    if (delivery?.clienteId) {
      return {
        id: delivery.clienteId,
        nombre: delivery.nombreCliente || delivery.clienteId,
      };
    }
    return null;
  });

  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
  const [loadingClients, setLoadingClients] = useState<boolean>(false);
  const [clientSearchInput, setClientSearchInput] = useState<string>(
    delivery ? (delivery.nombreCliente ? `${delivery.nombreCliente} (${delivery.clienteId})` : delivery.clienteId) : ''
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = useCallback((field: keyof DeliveryRequest, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }, []);

  const handleSearchClients = useCallback(async (query: string) => {
    const term = query.trim();
    if (!term) {
      setClientOptions([]);
      return;
    }
    setLoadingClients(true);
    try {
      const results = await deliveriesApi.getClientSuggestions(term);
      setClientOptions(results);
    } finally {
      setLoadingClients(false);
    }
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clienteId.trim()) {
      newErrors.clienteId = 'El ID de cliente es obligatorio';
    }

    if (!formData.direccionEnvio.trim()) {
      newErrors.direccionEnvio = 'La dirección de envío es obligatoria';
    } else if (formData.direccionEnvio.trim().length < 5) {
      newErrors.direccionEnvio = 'La dirección debe contener al menos 5 caracteres';
    }

    if (!formData.status) {
      newErrors.status = 'El estatus es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);
      try {
        const payload: DeliveryRequest = {
          clienteId: formData.clienteId.trim(),
          direccionEnvio: formData.direccionEnvio.trim(),
          status: formData.status,
        };

        let savedDelivery: Delivery;

        if (isEdit && delivery) {
          savedDelivery = await deliveriesApi.updateDelivery(delivery.id, payload);
          notificationStore.getState().showSuccess('Lugar de entrega actualizado exitosamente');
        } else {
          savedDelivery = await deliveriesApi.createDelivery(payload);
          notificationStore.getState().showSuccess('Lugar de entrega registrado exitosamente');
        }

        onSuccess?.(savedDelivery);
        onClose();
      } catch {
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, formData, isEdit, delivery, onSuccess, onClose]
  );

  return (
    <GlobalModal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      loading={isSubmitting}
      icon={<LocalShippingOutlinedIcon sx={{ fontSize: 24 }} />}
      headerBadgeColor={{ bg: '#FDF2F8', color: '#E10098' }}
      title={isEdit ? 'Editar Lugar de Entrega' : 'Nueva Dirección de Entrega'}
      subtitle={
        isEdit
          ? 'Modifica los datos y la dirección de envío del pedido'
          : 'Registra una nueva dirección de destino asociada a un cliente'
      }
      actions={
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, width: '100%' }}>
          <GlobalButton
            variant="outlined"
            onClick={onClose}
            disabled={isSubmitting}
            sx={{
              borderColor: '#CBD5E1',
              color: '#475569',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#94A3B8',
                backgroundColor: '#F8FAFC',
              },
            }}
          >
            Cancelar
          </GlobalButton>
          <GlobalButton
            type="submit"
            form="delivery-form"
            variant="contained"
            loading={isSubmitting}
            sx={{
              backgroundColor: '#E10098',
              color: '#FFFFFF',
              fontWeight: 700,
              px: 3,
              boxShadow: '0 2px 8px rgba(225, 0, 152, 0.25)',
              '&:hover': {
                backgroundColor: '#C50084',
              },
            }}
          >
            {isEdit ? 'Guardar Cambios' : 'Crear Entrega'}
          </GlobalButton>
        </Box>
      }
    >
      <Box component="form" id="delivery-form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <Autocomplete<ClientOption, false, false, true>
              freeSolo
              options={clientOptions}
              loading={loadingClients}
              value={selectedClient}
              inputValue={clientSearchInput}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                const fullName = `${option.nombre || ''} ${option.apellidoPaterno || ''}`.trim();
                return fullName ? `${fullName} (${option.id})` : option.id;
              }}
              onInputChange={(_event, newInputValue, reason) => {
                setClientSearchInput(newInputValue);
                if (reason === 'input') {
                  handleChange('clienteId', newInputValue);
                  handleSearchClients(newInputValue);
                }
              }}
              onChange={(_event, newValue) => {
                if (typeof newValue === 'string') {
                  setSelectedClient({ id: newValue, nombre: newValue });
                  handleChange('clienteId', newValue);
                } else if (newValue) {
                  setSelectedClient(newValue);
                  handleChange('clienteId', newValue.id);
                } else {
                  setSelectedClient(null);
                  handleChange('clienteId', '');
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="ID o Nombre del Cliente"
                  placeholder="Busca por nombre o escribe el ID del cliente"
                  size="small"
                  error={Boolean(errors.clienteId)}
                  helperText={errors.clienteId || 'Selecciona un cliente o ingresa el identificador directamente'}
                  disabled={isSubmitting}
                  slotProps={{
                    ...params.slotProps,
                    input: {
                      ...params.slotProps.input,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <PersonOutlinedIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
                          </InputAdornment>
                          {params.slotProps.input.startAdornment}
                        </>
                      ),
                      endAdornment: (
                        <>
                          {loadingClients ? <CircularProgress size={18} sx={{ color: '#E10098', mr: 1 }} /> : null}
                          {params.slotProps.input.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
              renderOption={(props, option) => {
                const fullName = `${option.nombre || ''} ${option.apellidoPaterno || ''}`.trim();
                return (
                  <Box component="li" {...props} key={option.id} sx={{ py: 1, px: 2 }}>
                    <Box sx={{ minWidth: 0, width: '100%' }}>
                      <GlobalTypography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                        {fullName || 'Cliente'}
                      </GlobalTypography>
                      <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                        ID: {option.id} {option.email ? `· ${option.email}` : ''}
                      </GlobalTypography>
                    </Box>
                  </Box>
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              multiline
              minRows={3}
              maxRows={5}
              label="Dirección de Envío"
              placeholder="Calle, número exterior/interior, colonia, alcaldía o municipio, código postal y referencias..."
              value={formData.direccionEnvio}
              onChange={(e) => handleChange('direccionEnvio', e.target.value)}
              error={Boolean(errors.direccionEnvio)}
              helperText={errors.direccionEnvio || 'Dirección completa y detallada para la recepción del pedido'}
              disabled={isSubmitting}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <PlaceOutlinedIcon sx={{ fontSize: 20, color: '#94A3B8' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth size="small" error={Boolean(errors.status)}>
              <InputLabel id="delivery-modal-status-label">Estatus</InputLabel>
              <Select
                labelId="delivery-modal-status-label"
                value={formData.status}
                label="Estatus"
                onChange={(e) => handleChange('status', e.target.value as DeliveryStatus)}
                disabled={isSubmitting}
              >
                <MenuItem value="ACTIVO">Activo</MenuItem>
                <MenuItem value="INACTIVO">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </GlobalModal>
  );
});

DeliveryModalContent.displayName = 'DeliveryModalContent';

export const DeliveryModal: React.FC<DeliveryModalProps> = memo(({
  open,
  delivery,
  onClose,
  onSuccess,
}) => {
  if (!open) return null;

  return (
    <DeliveryModalContent
      key={delivery ? delivery.id : 'new-delivery'}
      open={open}
      delivery={delivery}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
});

DeliveryModal.displayName = 'DeliveryModal';

export const CreateDeliveryModal: React.FC<CreateDeliveryModalProps> = memo((props) => (
  <DeliveryModal {...props} delivery={null} />
));

CreateDeliveryModal.displayName = 'CreateDeliveryModal';

export const EditDeliveryModal: React.FC<EditDeliveryModalProps> = memo((props) => (
  <DeliveryModal {...props} />
));

EditDeliveryModal.displayName = 'EditDeliveryModal';

export default DeliveryModal;
