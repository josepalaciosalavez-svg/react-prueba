import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { GlobalTypography } from '@/components/common';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          backgroundColor: '#F8FAFC',
        }}
      >
        <CircularProgress sx={{ color: '#E10098' }} size={40} thickness={4} />
        <GlobalTypography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
          Verificando sesión
        </GlobalTypography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirige al login preservando la ruta previa en el estado para redirección post-login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
