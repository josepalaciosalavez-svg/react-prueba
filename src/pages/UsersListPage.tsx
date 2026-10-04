import React, { memo } from 'react';
import { Box, Chip, Container, Grid, Paper, TablePagination } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import {
  Navbar,
  EmptyState,
  GlobalTypography,
  GlobalButton,
  AclGuard,
} from '@/components/common';
import {
  UsersTable,
  UserCard,
  UsersFilterBar,
  UsersSkeleton,
} from '@/components/users';
import { useUsers } from '@/hooks/useUsers';
import { useNavigate } from 'react-router-dom';

const AccessDeniedView: React.FC = memo(() => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ pt: 10, textAlign: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <SecurityOutlinedIcon sx={{ fontSize: 32 }} />
          </Box>
          <GlobalTypography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            Acceso Restringido
          </GlobalTypography>
          <GlobalTypography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
            El módulo de administración de usuarios requiere permisos con rol de Administrador.
          </GlobalTypography>
          <GlobalButton
            variant="contained"
            onClick={() => navigate('/pedidos')}
            sx={{
              backgroundColor: '#E10098',
              '&:hover': { backgroundColor: '#C50084' },
            }}
          >
            Ir a Pedidos
          </GlobalButton>
        </Paper>
      </Container>
    </Box>
  );
});

AccessDeniedView.displayName = 'AccessDeniedView';

const UsersContent: React.FC = memo(() => {
  const {
    users,
    page,
    size,
    totalElements,
    search,
    status,
    isLoading,
    setPage,
    setSize,
    setSearch,
    setStatus,
    refresh,
  } = useUsers(10);

  const hasFilter = Boolean(search || status);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pb: { xs: 6, sm: 8 } }}>
      <Navbar />

      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 2.5, sm: 3.5, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                backgroundColor: '#FDF2F8',
                color: '#E10098',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PeopleAltOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <GlobalTypography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: '#0F172A',
                    fontSize: { xs: '1.5rem', sm: '1.875rem' },
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  Administración de Usuarios
                </GlobalTypography>
                <Chip
                  label={`${totalElements} registrado${totalElements !== 1 ? 's' : ''}`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                  }}
                />
              </Box>
              <GlobalTypography variant="body2" sx={{ color: '#64748B', mt: 0.25 }}>
                Consulta y gestiona las cuentas de acceso del sistema
              </GlobalTypography>
            </Box>
          </Box>
        </Box>

        <UsersFilterBar
          status={status}
          isLoading={isLoading}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onRefresh={refresh}
        />

        {isLoading ? (
          <UsersSkeleton />
        ) : users.length === 0 ? (
          <EmptyState
            title={
              hasFilter
                ? 'No se encontraron usuarios coincidentes'
                : 'No hay usuarios registrados en el sistema'
            }
            description={
              hasFilter
                ? 'Intenta modificando los términos de búsqueda o el filtro de estatus.'
                : 'Actualmente no existen registros en el catálogo de usuarios.'
            }
          />
        ) : (
          <Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <UsersTable
                users={users}
                page={page}
                size={size}
                totalElements={totalElements}
                onPageChange={setPage}
                onRowsPerPageChange={setSize}
              />
            </Box>

            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Grid container spacing={2}>
                {users.map((user) => (
                  <Grid key={user.id} size={{ xs: 12, sm: 6 }}>
                    <UserCard user={user} />
                  </Grid>
                ))}
              </Grid>

              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalElements}
                  rowsPerPage={size}
                  page={page}
                  onPageChange={(_e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => setSize(parseInt(e.target.value, 10))}
                  labelRowsPerPage="Por pág:"
                  labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                />
              </Paper>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
});

UsersContent.displayName = 'UsersContent';

export const UsersListPage: React.FC = () => {
  return (
    <AclGuard role="ADMIN" fallback={<AccessDeniedView />}>
      <UsersContent />
    </AclGuard>
  );
};

export default UsersListPage;
