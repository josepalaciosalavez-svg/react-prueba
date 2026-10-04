import React, { memo, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Chip,
  OutlinedInput,
  type SelectChangeEvent,
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { GlobalModal, GlobalButton } from '@/components/common';
import { usersApi } from '@/api/usersApi';
import { notificationStore } from '@/stores';
import type { CreateUserDto, SystemUser, UserStatus } from '@/types/user';

export interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (createdUser: SystemUser) => void;
}

const AVAILABLE_ROLES = [
  { value: 'ROLE_ADMIN', label: 'Administrador' },
  { value: 'ROLE_SUPERVISOR', label: 'Supervisor' },
  { value: 'ROLE_OPERATOR', label: 'Operador' },
  { value: 'ROLE_USER', label: 'Usuario General' },
];

const INITIAL_FORM: CreateUserDto = {
  nombre: '',
  email: '',
  password: '',
  roles: ['ROLE_OPERATOR'],
  status: 'ACTIVO',
};

const CreateUserModalContent: React.FC<{
  open: boolean;
  onClose: () => void;
  onSuccess?: (createdUser: SystemUser) => void;
}> = memo(({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateUserDto>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleChange = useCallback((field: keyof CreateUserDto, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }, []);

  const handleRolesChange = useCallback((event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const rolesArray = typeof value === 'string' ? value.split(',') : value;
    handleChange('roles', rolesArray);
  }, [handleChange]);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre completo es requerido.';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Ingresa un formato de correo electrónico válido.';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (!formData.roles || formData.roles.length === 0) {
      newErrors.roles = 'Debes asignar al menos un rol al usuario.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const created = await usersApi.createUser({
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        roles: formData.roles,
        status: formData.status,
      });

      notificationStore.getState().showSuccess(`Usuario "${created.nombre}" creado exitosamente.`);
      onSuccess?.(created);
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  }, [validate, isSubmitting, formData, onSuccess, onClose]);

  const getRoleLabel = (roleVal: string) => {
    const found = AVAILABLE_ROLES.find((r) => r.value === roleVal);
    return found ? found.label : roleVal.replace('ROLE_', '');
  };

  return (
    <GlobalModal
      open={open}
      onClose={onClose}
      title="Nuevo Usuario"
      subtitle="Registra las credenciales y accesos de un nuevo integrante del sistema"
      icon={<PersonAddOutlinedIcon sx={{ fontSize: 24 }} />}
      headerBadgeColor={{ bg: '#FDF2F8', color: '#E10098' }}
      maxWidth="sm"
      fullWidth
      loading={isSubmitting}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5, width: '100%', justifyContent: 'flex-end' }}>
          <GlobalButton
            variant="outlined"
            onClick={onClose}
            disabled={isSubmitting}
            sx={{
              color: '#64748B',
              borderColor: '#E2E8F0',
              '&:hover': { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' },
            }}
          >
            Cancelar
          </GlobalButton>
          <GlobalButton
            variant="contained"
            onClick={handleSubmit}
            loading={isSubmitting}
            sx={{
              backgroundColor: '#E10098',
              color: '#FFFFFF',
              fontWeight: 700,
              px: 3,
              '&:hover': { backgroundColor: '#C50084' },
            }}
          >
            Guardar Usuario
          </GlobalButton>
        </Box>
      }
    >
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              size="small"
              label="Nombre Completo"
              placeholder="Ej. Carlos Mendoza Ruiz"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre}
              disabled={isSubmitting}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              size="small"
              type="email"
              label="Correo Electrónico"
              placeholder="usuario@liverpool.com.mx"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={isSubmitting}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              size="small"
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password}
              disabled={isSubmitting}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleTogglePassword}
                        edge="end"
                        aria-label="Alternar visibilidad de contraseña"
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: 18, color: '#94A3B8' }} />
                        ) : (
                          <Visibility sx={{ fontSize: 18, color: '#94A3B8' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 7 }}>
            <FormControl fullWidth size="small" error={Boolean(errors.roles)}>
              <InputLabel id="create-user-roles-label">Roles Asignados</InputLabel>
              <Select
                labelId="create-user-roles-label"
                multiple
                value={formData.roles}
                onChange={handleRolesChange}
                input={<OutlinedInput label="Roles Asignados" />}
                disabled={isSubmitting}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((val) => (
                      <Chip
                        key={val}
                        label={getRoleLabel(val)}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: val.includes('ADMIN') ? '#FDF2F8' : '#F1F5F9',
                          color: val.includes('ADMIN') ? '#E10098' : '#475569',
                          border: val.includes('ADMIN') ? '1px solid #FCE7F3' : 'none',
                        }}
                      />
                    ))}
                  </Box>
                )}
              >
                {AVAILABLE_ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 5 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="create-user-status-label">Estatus</InputLabel>
              <Select
                labelId="create-user-status-label"
                value={formData.status}
                label="Estatus"
                onChange={(e) => handleChange('status', e.target.value as UserStatus)}
                disabled={isSubmitting}
              >
                <MenuItem value="ACTIVO">Activo</MenuItem>
                <MenuItem value="INACTIVO">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </GlobalModal>
  );
});

CreateUserModalContent.displayName = 'CreateUserModalContent';

export const CreateUserModal: React.FC<CreateUserModalProps> = memo(({
  open,
  onClose,
  onSuccess,
}) => {
  if (!open) return null;

  return (
    <CreateUserModalContent
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
});

CreateUserModal.displayName = 'CreateUserModal';

export default CreateUserModal;
