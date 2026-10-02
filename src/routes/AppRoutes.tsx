import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { PublicRoute } from '@/routes/PublicRoute';

const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);

const RouteSuspenseFallback: React.FC = () => (
  <Box
    sx={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress sx={{ color: '#E10098' }} size={32} thickness={4} />
  </Box>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteSuspenseFallback />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
