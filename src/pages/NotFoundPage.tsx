import React from 'react';
import { Box, Container, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { GlobalButton, GlobalTypography } from '@/components/common';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid #E2E8F0',
          }}
        >
          <GlobalTypography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: '5rem',
              color: '#E10098',
              lineHeight: 1,
              mb: 1,
            }}
          >
            404
          </GlobalTypography>
          <GlobalTypography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#0F172A' }}>
            Página no encontrada
          </GlobalTypography>
          <GlobalTypography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
            La ruta a la que intentas acceder no existe o fue trasladada.
          </GlobalTypography>
          <GlobalButton
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/pedidos')}
          >
            Ir a la lista de pedidos
          </GlobalButton>
        </Paper>
      </Container>
    </Box>
  );
};
