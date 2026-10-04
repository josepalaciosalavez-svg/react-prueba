import React, { memo } from 'react';
import { Box, Grid, Paper, Skeleton, type SxProps, type Theme } from '@mui/material';

export interface GlobalSkeletonProps {
  rows?: number;
  rowHeight?: number;
  headerHeight?: number;
  showHeader?: boolean;
  variant?: 'table' | 'cards' | 'responsive';
  cardHeight?: number;
  cardColumns?: { xs?: number; sm?: number; md?: number; lg?: number };
  paperSx?: SxProps<Theme>;
}

export const GlobalSkeleton: React.FC<GlobalSkeletonProps> = memo(({
  rows = 6,
  rowHeight = 52,
  headerHeight = 44,
  showHeader = true,
  variant = 'table',
  cardHeight = 160,
  cardColumns = { xs: 12, sm: 6 },
  paperSx,
}) => {
  if (variant === 'cards') {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: rows }).map((_, index) => (
          <Grid key={index} size={cardColumns}>
            <Skeleton variant="rounded" height={cardHeight} sx={{ borderRadius: 2.5 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (variant === 'responsive') {
    return (
      <Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid #E2E8F0',
              borderRadius: 2.5,
              p: 2.5,
              backgroundColor: '#FFFFFF',
              ...paperSx,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {showHeader && (
                <Skeleton variant="rectangular" height={headerHeight} sx={{ borderRadius: 1.5 }} />
              )}
              {Array.from({ length: rows }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  height={rowHeight}
                  sx={{ borderRadius: 1.5 }}
                />
              ))}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Grid container spacing={2}>
            {Array.from({ length: Math.min(rows, 4) }).map((_, index) => (
              <Grid key={index} size={cardColumns}>
                <Skeleton variant="rounded" height={cardHeight} sx={{ borderRadius: 2.5 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #E2E8F0',
        borderRadius: 2.5,
        p: 2.5,
        backgroundColor: '#FFFFFF',
        ...paperSx,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {showHeader && (
          <Skeleton variant="rectangular" height={headerHeight} sx={{ borderRadius: 1.5 }} />
        )}
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={rowHeight} sx={{ borderRadius: 1.5 }} />
        ))}
      </Box>
    </Paper>
  );
});

GlobalSkeleton.displayName = 'GlobalSkeleton';

export default GlobalSkeleton;
