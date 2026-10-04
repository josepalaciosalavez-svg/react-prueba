import React, { memo, useState, useCallback } from 'react';
import {
  Avatar,
  Box,
  ButtonBase,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { GlobalTypography } from './GlobalTypography';
import { AclGuard } from './AclGuard';

export const UserMenu: React.FC = memo(() => {
  const { user, logout } = useAuth();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleNavigate = useCallback(
    (path: string) => {
      handleClose();
      navigate(path);
    },
    [navigate, handleClose]
  );

  const handleLogout = useCallback(() => {
    handleClose();
    logout();
    navigate('/login');
  }, [logout, navigate, handleClose]);

  if (!user) return null;

  const isUsers = location.pathname.startsWith('/usuarios');

  return (
    <Box>
      <ButtonBase
        onClick={handleOpen}
        aria-controls={isOpen ? 'user-account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          p: '4px 10px 4px 6px',
          borderRadius: 3,
          transition: 'all 0.15s ease-in-out',
          border: '1px solid transparent',
          '&:hover': {
            backgroundColor: '#F8FAFC',
            borderColor: '#E2E8F0',
          },
          '&:focus-visible': {
            outline: '2px solid #E10098',
            outlineOffset: 2,
          },
        }}
      >
        <Avatar
          src={user.avatar}
          alt={user.name}
          sx={{
            width: 36,
            height: 36,
            border: '2px solid #E10098',
            backgroundColor: '#FDF2F8',
            color: '#E10098',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          {user.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
          <GlobalTypography
            variant="body2"
            sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}
          >
            {user.name}
          </GlobalTypography>
        </Box>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: 18,
            color: '#64748B',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </ButtonBase>

      <Menu
        id="user-account-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              minWidth: 240,
              mt: 1.2,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
              overflow: 'hidden',
              py: 0.5,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <GlobalTypography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
            {user.name}
          </GlobalTypography>
          {user.email && (
            <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.75 }}>
              {user.email}
            </GlobalTypography>
          )}
          <Chip
            label={user.role}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 700,
              backgroundColor: isAdmin ? '#FDF2F8' : '#F1F5F9',
              color: isAdmin ? '#E10098' : '#475569',
              border: isAdmin ? '1px solid #FCE7F3' : 'none',
            }}
          />
        </Box>

        <Divider sx={{ my: 0.5 }} />

        <AclGuard role="ADMIN">
          <MenuItem
            selected={isUsers}
            onClick={() => handleNavigate('/usuarios')}
            sx={{
              py: 1.2,
              px: 2,
              gap: 1.5,
              fontSize: '0.875rem',
              fontWeight: isUsers ? 700 : 500,
              color: isUsers ? '#E10098' : '#1E293B',
              '&.Mui-selected': {
                backgroundColor: '#FDF2F8',
                '&:hover': {
                  backgroundColor: '#FCE7F3',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: isUsers ? '#E10098' : '#64748B' }}>
              <PeopleAltOutlinedIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Administración de Usuarios" />
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
        </AclGuard>

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.2,
            px: 2,
            gap: 1.5,
            fontSize: '0.875rem',
            color: '#DC2626',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#FEF2F2',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 28, color: '#DC2626' }}>
            <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </MenuItem>
      </Menu>
    </Box>
  );
});

UserMenu.displayName = 'UserMenu';

export default UserMenu;
