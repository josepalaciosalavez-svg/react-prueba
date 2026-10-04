import React, { memo } from 'react';
import { AppBar, Box, Container, Toolbar } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlobalButton } from './GlobalButton';
import { GlobalTypography } from './GlobalTypography';
import { UserMenu } from './UserMenu';

export const Navbar: React.FC = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const isOrders = location.pathname.startsWith('/pedidos');

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

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <GlobalButton
              variant="text"
              startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate('/pedidos')}
              sx={{
                color: isOrders ? '#E10098' : '#64748B',
                backgroundColor: isOrders ? 'rgba(225, 0, 152, 0.08)' : 'transparent',
                fontWeight: isOrders ? 700 : 500,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: isOrders ? 'rgba(225, 0, 152, 0.12)' : '#F8FAFC',
                  color: isOrders ? '#E10098' : '#0F172A',
                },
              }}
            >
              Lista de Pedidos
            </GlobalButton>
          </Box>

          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;

