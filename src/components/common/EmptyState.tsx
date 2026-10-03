import React from 'react';
import { Box } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { GlobalButton } from './GlobalButton';
import { GlobalTypography } from './GlobalTypography';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(
  ({
    title = 'No se tienen resultados que coincidan con los criterios de búsqueda',
    description = 'Intenta modificando los términos de búsqueda o limpiando los filtros seleccionados.',
    actionLabel,
    onAction,
  }) => {
    return (
      <Box
        sx={{
          py: 8,
          px: 3,
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 3,
          border: '1px dashed #CBD5E1',
          my: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            color: '#64748B',
          }}
        >
          <SearchOffIcon sx={{ fontSize: 36 }} />
        </Box>

        <GlobalTypography variant="h6" sx={{ color: '#0F172A', fontWeight: 600, mb: 1, maxWidth: 500 }}>
          {title}
        </GlobalTypography>

        <GlobalTypography variant="body2" sx={{ color: '#64748B', mb: actionLabel ? 2.5 : 0, maxWidth: 420 }}>
          {description}
        </GlobalTypography>

        {actionLabel && onAction && (
          <GlobalButton variant="outlined" size="small" onClick={onAction}>
            {actionLabel}
          </GlobalButton>
        )}
      </Box>
    );
  }
);

EmptyState.displayName = 'EmptyState';
