import React, { memo } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';

export interface GlobalFilterBarProps {
  searchSlot?: React.ReactNode;
  filterSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const GlobalFilterBar: React.FC<GlobalFilterBarProps> = memo(({
  searchSlot,
  filterSlot,
  actionsSlot,
  sx,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 1.5,
        mb: 3,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 1.5,
          flex: 1,
        }}
      >
        {searchSlot && (
          <Box sx={{ flex: 1, minWidth: { sm: 280, md: 360 } }}>
            {searchSlot}
          </Box>
        )}
        {filterSlot && (
          <Box sx={{ minWidth: { sm: 180 } }}>
            {filterSlot}
          </Box>
        )}
      </Box>

      {actionsSlot && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {actionsSlot}
        </Box>
      )}
    </Box>
  );
});

GlobalFilterBar.displayName = 'GlobalFilterBar';

export default GlobalFilterBar;
