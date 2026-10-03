import React, { useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { GlobalButton, GlobalTypography } from '@/components/common';

export const LoginPage: React.FC = () => {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Ingresa un correo electrónico válido';
    }

    if (!password) {
      errors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      // Redirigir a la ruta a la que intentaba entrar o a /pedidos
      const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/pedidos';
      navigate(destination, { replace: true });
    } catch {
      // Error manejado en AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        py: 4,
        px: 2,
        backgroundImage:
          'radial-gradient(#E10098 0.5px, transparent 0.5px), radial-gradient(#E10098 0.5px, #F8FAFC 0.5px)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px',
        backgroundOpacity: 0.05,
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            p: 1,
            borderRadius: 3,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
            border: '1px solid #E2E8F0',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Logo y Encabezado */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2.5,
                  backgroundColor: '#E10098',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.75rem',
                  mb: 1.5,
                  boxShadow: '0 4px 14px rgba(225, 0, 152, 0.35)',
                }}
              >
                L
              </Box>
              <GlobalTypography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
                Liverpool
              </GlobalTypography>
              <GlobalTypography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                Sistema de Control y Consulta de Pedidos
              </GlobalTypography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Formulario */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ mb: 2 }}>
                <GlobalTypography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
                  Correo institucional
                </GlobalTypography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="ejemplo@liverpool.com.mx"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) setValidationErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  error={Boolean(validationErrors.email)}
                  helperText={validationErrors.email}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <GlobalTypography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 0.5, display: 'block' }}>
                  Contraseña
                </GlobalTypography>
                <TextField
                  fullWidth
                  size="small"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) setValidationErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  error={Boolean(validationErrors.password)}
                  helperText={validationErrors.password}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                            aria-label="alternar visibilidad de contraseña"
                          >
                            {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <GlobalButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                loading={isSubmitting}
                loadingText="Iniciando sesión..."
                startIcon={<LockOutlinedIcon />}
                sx={{ py: 1.2, fontSize: '0.9375rem', fontWeight: 700 }}
              >
                Ingresar al Portal
              </GlobalButton>
            </Box>

            {/* Quick Demo Helper */}
            <Box
              sx={{
                mt: 3,
                pt: 2,
                borderTop: '1px dashed #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >

            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
