import React, { memo } from 'react';
import { Box, Grid, Skeleton } from '@mui/material';

export const OrderListSkeleton: React.FC = memo(() => {
  return (
    <Box>
      {/* Skeleton para vista de tabla en escritorio */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1.5 }}>
        <Skeleton variant="rounded" height={52} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" height={60} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" height={60} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" height={60} sx={{ borderRadius: 2 }} />
      </Box>

      {/* Skeleton para tarjetas en móviles y tablets */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((n) => (
            <Grid key={n} size={{ xs: 12, sm: 6 }}>
              <Skeleton variant="rounded" height={190} sx={{ borderRadius: 2.5 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
});

OrderListSkeleton.displayName = 'OrderListSkeleton';

export default OrderListSkeleton;
