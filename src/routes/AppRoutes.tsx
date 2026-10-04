import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicRoute } from '@/routes/PublicRoute';

const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const OrdersListPage = lazy(() =>
  import('@/pages/OrdersListPage').then((m) => ({ default: m.OrdersListPage }))
);
const OrderDetailPage = lazy(() =>
  import('@/pages/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage }))
);
const UsersListPage = lazy(() =>
  import('@/pages/UsersListPage').then((m) => ({ default: m.UsersListPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
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
        <Route path="/" element={<Navigate to="/pedidos" replace />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/pedidos" element={<OrdersListPage />} />
          <Route path="/pedidos/:id" element={<OrderDetailPage />} />
          <Route path="/usuarios" element={<UsersListPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
