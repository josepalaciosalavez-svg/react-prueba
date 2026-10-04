import React, { memo } from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box, Avatar, Chip } from '@mui/material';
import { GlobalSearch, GlobalTypography } from '@/components/common';
import { UserStatusChip } from './UserStatusChip';
import { usersApi } from '@/api/usersApi';
import type { SystemUser } from '@/types/user';

export interface UserSearchProps {
  value?: string;
  onSelectUser: (user: SystemUser | null) => void;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const fetchUserSuggestions = async (query: string, signal: AbortSignal): Promise<SystemUser[]> => {
  return usersApi.getTypeaheadSuggestions(query, signal);
};

const getOptionLabel = (user: SystemUser): string =>
  `${user.nombre} (${user.email})`;

const getOptionKey = (user: SystemUser): string | number => user.id;

const renderOptionContent = (user: SystemUser): React.ReactNode => {
  const initial = (user.nombre || user.email || 'U').charAt(0).toUpperCase();
  const isAdmin = user.roles?.some((r) => r.includes('ADMIN'));

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', py: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, mr: 1.5 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            backgroundColor: '#FDF2F8',
            color: '#E10098',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: '1px solid #FCE7F3',
          }}
        >
          {initial}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <GlobalTypography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: '#0F172A',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user.nombre}
          </GlobalTypography>
          <GlobalTypography
            variant="caption"
            sx={{
              color: '#64748B',
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user.email}
          </GlobalTypography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexShrink: 0 }}>
        {isAdmin && (
          <Chip
            label="ADMIN"
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.65rem',
              height: 18,
              backgroundColor: '#FDF2F8',
              color: '#E10098',
              border: '1px solid #FCE7F3',
            }}
          />
        )}
        <UserStatusChip status={user.status} size="small" />
      </Box>
    </Box>
  );
};

export const UserSearch: React.FC<UserSearchProps> = memo(({
  value = '',
  onSelectUser,
  onQueryChange,
  placeholder = 'Buscar usuario por nombre o correo...',
  size = 'small',
  fullWidth = true,
  disabled = false,
  sx,
}) => {
  return (
    <GlobalSearch<SystemUser>
      value={value}
      fetchOptions={fetchUserSuggestions}
      getOptionLabel={getOptionLabel}
      getOptionKey={getOptionKey}
      renderOptionContent={renderOptionContent}
      onSelect={onSelectUser}
      onQueryChange={onQueryChange}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      sx={sx}
    />
  );
});

UserSearch.displayName = 'UserSearch';

export default UserSearch;
