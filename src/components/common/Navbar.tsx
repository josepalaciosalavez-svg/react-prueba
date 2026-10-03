import React from 'react';
import { AppBar, Avatar, Box, Container, Toolbar, Chip } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { GlobalButton } from './GlobalButton';
import { GlobalTypography } from './GlobalTypography';

export const Navbar: React.FC = React.memo(() => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        color: '#0F172A',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 64, justifyContent: 'space-between' }}>
          {/* Logo & Brand */}
          <Box
            onClick={() => navigate('/pedidos')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                backgroundColor: '#E10098',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.25rem',
                boxShadow: '0 2px 8px rgba(225, 0, 152, 0.3)',
              }}
            >
              L
            </Box>
            <Box>
              <GlobalTypography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: '#0F172A',
                }}
              >
                Liverpool
              </GlobalTypography>
              <GlobalTypography
                variant="caption"
                sx={{
                  color: '#64748B',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Portal de Pedidos
              </GlobalTypography>
            </Box>
          </Box>

          {/* Quick Section Nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <GlobalButton
              variant="text"
              startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate('/pedidos')}
              sx={{
                color: '#E10098',
                backgroundColor: 'rgba(225, 0, 152, 0.08)',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              Lista de Pedidos
            </GlobalButton>
          </Box>

          {/* User profile & Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 34, height: 34, border: '2px solid #E10098' }}
                >
                  {user.name.charAt(0)}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                  <GlobalTypography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {user.name}
                  </GlobalTypography>
                  <Chip
                    label={user.role}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                    }}
                  />
                </Box>
              </Box>
            )}

            <GlobalButton
              variant="outlined"
              size="small"
              onClick={handleLogout}
              startIcon={<LogoutOutlinedIcon sx={{ fontSize: 16 }} />}
            >
              Salir
            </GlobalButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
});

Navbar.displayName = 'Navbar';
