import React, { memo, useCallback } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { GlobalButton, GlobalFilterBar, GlobalSearch, GlobalTypography } from '@/components/common';
import { deliveriesApi } from '@/api/deliveriesApi';
import type { Delivery, DeliveryStatus } from '@/types/delivery';

export interface DeliveriesFilterBarProps {
  status: DeliveryStatus | '';
  isLoading: boolean;
  searchValue?: string;
  onSelectDelivery: (delivery: Delivery | null) => void;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: DeliveryStatus | '') => void;
  onRefresh: () => void;
}

export const DeliveriesFilterBar: React.FC<DeliveriesFilterBarProps> = memo(({
  status,
  isLoading,
  searchValue = '',
  onSelectDelivery,
  onSearchChange,
  onStatusChange,
  onRefresh,
}) => {
  const getDeliveryOptionLabel = useCallback((delivery: Delivery): string => {
    return delivery.direccionEnvio;
  }, []);

  const getDeliveryOptionKey = useCallback((delivery: Delivery): string => {
    return delivery.id;
  }, []);

  const renderDeliveryOptionContent = useCallback((delivery: Delivery) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, width: '100%' }}>
        <PlaceOutlinedIcon sx={{ fontSize: 18, color: '#E10098', flexShrink: 0 }} />
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <GlobalTypography
            variant="body2"
            sx={{ fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {delivery.direccionEnvio}
          </GlobalTypography>
          <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
            {delivery.nombreCliente ? `${delivery.nombreCliente} · ` : ''}Cliente ID: {delivery.clienteId}
          </GlobalTypography>
        </Box>
      </Box>
    );
  }, []);

  return (
    <GlobalFilterBar
      searchSlot={
        <GlobalSearch<Delivery>
          value={searchValue}
          placeholder="Buscar por dirección o ID de cliente..."
          fetchOptions={deliveriesApi.getTypeaheadSuggestions}
          getOptionLabel={getDeliveryOptionLabel}
          getOptionKey={getDeliveryOptionKey}
          renderOptionContent={renderDeliveryOptionContent}
          onSelect={onSelectDelivery}
          onQueryChange={onSearchChange}
        />
      }
      filterSlot={
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: '100%', sm: 180 },
            backgroundColor: '#FFFFFF',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        >
          <InputLabel id="deliveries-status-filter-label">Estatus</InputLabel>
          <Select
            labelId="deliveries-status-filter-label"
            value={status}
            label="Estatus"
            onChange={(e) => onStatusChange(e.target.value as DeliveryStatus | '')}
          >
            <MenuItem value="">Todos los estatus</MenuItem>
            <MenuItem value="ACTIVO">Activo</MenuItem>
            <MenuItem value="INACTIVO">Inactivo</MenuItem>
          </Select>
        </FormControl>
      }
      actionsSlot={
        <GlobalButton
          variant="outlined"
          size="medium"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          loading={isLoading}
          sx={{
            color: '#E10098',
            borderColor: '#FCE7F3',
            backgroundColor: '#FFFFFF',
            fontWeight: 600,
            height: 40,
            whiteSpace: 'nowrap',
            '&:hover': {
              borderColor: '#E10098',
              backgroundColor: '#FDF2F8',
            },
          }}
        >
          Actualizar
        </GlobalButton>
      }
    />
  );
});

DeliveriesFilterBar.displayName = 'DeliveriesFilterBar';

export default DeliveriesFilterBar;
