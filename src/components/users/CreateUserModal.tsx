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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { GlobalModal, GlobalButton } from '@/components/common';
import { usersApi } from '@/api/usersApi';
import { notificationStore } from '@/stores';
import type { CreateUserDto, SystemUser, UserStatus } from '@/types/user';

export interface UserModalProps {
  open: boolean;
  user?: SystemUser | null;
  onClose: () => void;
  onSuccess?: (savedUser: SystemUser) => void;
}

export type CreateUserModalProps = UserModalProps;
export type EditUserModalProps = UserModalProps;

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

const UserModalContent: React.FC<{
  open: boolean;
  user?: SystemUser | null;
  onClose: () => void;
  onSuccess?: (savedUser: SystemUser) => void;
}> = memo(({ open, user, onClose, onSuccess }) => {
  const isEdit = Boolean(user);

  const [formData, setFormData] = useState<CreateUserDto>(() => {
    if (user) {
      return {
        nombre: user.nombre || '',
        email: user.email || '',
        password: '',
        roles: Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : ['ROLE_OPERATOR'],
        status: user.status || 'ACTIVO',
      };
    }
    return INITIAL_FORM;
  });

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
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Ingresa un formato de correo electrónico válido.';
    }

    if (!formData.password) {
      newErrors.password = isEdit ? 'Ingresa la contraseña para confirmar los cambios.' : 'La contraseña es requerida.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!formData.roles || formData.roles.length === 0) {
      newErrors.roles = 'Debes asignar al menos un rol al usuario.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isEdit]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      let savedUser: SystemUser;
      if (isEdit && user) {
        savedUser = await usersApi.updateUser(user.id, {
          nombre: formData.nombre.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          roles: formData.roles,
          status: formData.status,
        });
        notificationStore.getState().showSuccess(`Usuario "${savedUser.nombre}" actualizado exitosamente.`);
      } else {
        savedUser = await usersApi.createUser({
          nombre: formData.nombre.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          roles: formData.roles,
          status: formData.status,
        });
        notificationStore.getState().showSuccess(`Usuario "${savedUser.nombre}" creado exitosamente.`);
      }

      onSuccess?.(savedUser);
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  }, [validate, isSubmitting, isEdit, user, formData, onSuccess, onClose]);

  const getRoleLabel = (roleVal: string) => {
    const found = AVAILABLE_ROLES.find((r) => r.value === roleVal);
    return found ? found.label : roleVal.replace('ROLE_', '');
  };

  return (
    <GlobalModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
      subtitle={
        isEdit
          ? 'Modifica los datos, roles o credenciales de la cuenta'
          : 'Registra las credenciales y accesos de un nuevo integrante del sistema'
      }
      icon={
        isEdit ? (
          <EditOutlinedIcon sx={{ fontSize: 24 }} />
        ) : (
          <PersonAddOutlinedIcon sx={{ fontSize: 24 }} />
        )
      }
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
            {isEdit ? 'Actualizar Usuario' : 'Guardar Usuario'}
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
              label={isEdit ? 'Contraseña o Nueva Contraseña' : 'Contraseña'}
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password || (isEdit ? 'Ingresa al menos 8 caracteres para confirmar o actualizar' : undefined)}
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
              <InputLabel id="user-modal-roles-label">Roles Asignados</InputLabel>
              <Select
                labelId="user-modal-roles-label"
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
              <InputLabel id="user-modal-status-label">Estatus</InputLabel>
              <Select
                labelId="user-modal-status-label"
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

UserModalContent.displayName = 'UserModalContent';

export const UserModal: React.FC<UserModalProps> = memo(({
  open,
  user,
  onClose,
  onSuccess,
}) => {
  if (!open) return null;

  return (
    <UserModalContent
      key={user ? user.id : 'new-user'}
      open={open}
      user={user}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
});

UserModal.displayName = 'UserModal';

export const CreateUserModal: React.FC<CreateUserModalProps> = memo((props) => (
  <UserModal {...props} user={null} />
));

CreateUserModal.displayName = 'CreateUserModal';

export const EditUserModal: React.FC<EditUserModalProps> = memo((props) => (
  <UserModal {...props} />
));

EditUserModal.displayName = 'EditUserModal';

export default UserModal;
