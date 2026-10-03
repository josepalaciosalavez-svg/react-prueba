import React from 'react';
import { Box, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(
  ({
    title = 'No se tienen resultados que coincidan con los criterios de búsqueda',
    description = 'Intenta modificando los términos de búsqueda o limpiando los filtros seleccionados.',
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

        <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 600, mb: 1, maxWidth: 500 }}>
          {title}
        </Typography>

        <Typography variant="body2" sx={{ color: '#64748B', mb: 3, maxWidth: 420 }}>
          {description}
        </Typography>
      </Box>
    );
  }
);

EmptyState.displayName = 'EmptyState';
