import React, { memo } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { GlobalButton, GlobalFilterBar } from '@/components/common';
import { UserSearch } from './UserSearch';
import type { SystemUser, UserStatus } from '@/types/user';

export interface UsersFilterBarProps {
  status: UserStatus | '';
  isLoading: boolean;
  searchValue?: string;
  onSelectUser: (user: SystemUser | null) => void;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: UserStatus | '') => void;
  onRefresh: () => void;
}

export const UsersFilterBar: React.FC<UsersFilterBarProps> = memo(({
  status,
  isLoading,
  searchValue = '',
  onSelectUser,
  onSearchChange,
  onStatusChange,
  onRefresh,
}) => {
  return (
    <GlobalFilterBar
      searchSlot={
        <UserSearch
          value={searchValue}
          onSelectUser={onSelectUser}
          onQueryChange={onSearchChange}
        />
      }
      filterSlot={
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: '100%', sm: 180 },
            backgroundColor: '#FFFFFF',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        >
          <InputLabel id="users-status-filter-label">Estatus</InputLabel>
          <Select
            labelId="users-status-filter-label"
            value={status}
            label="Estatus"
            onChange={(e) => onStatusChange(e.target.value as UserStatus | '')}
          >
            <MenuItem value="">Todos los estatus</MenuItem>
            <MenuItem value="ACTIVO">Activo</MenuItem>
            <MenuItem value="INACTIVO">Inactivo</MenuItem>
          </Select>
        </FormControl>
      }
      actionsSlot={
        <GlobalButton
          variant="outlined"
          size="medium"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          loading={isLoading}
          sx={{
            color: '#E10098',
            borderColor: '#FCE7F3',
            backgroundColor: '#FFFFFF',
            fontWeight: 600,
            height: 40,
            whiteSpace: 'nowrap',
            '&:hover': {
              borderColor: '#E10098',
              backgroundColor: '#FDF2F8',
            },
          }}
        >
          Actualizar
        </GlobalButton>
      }
    />
  );
});

UsersFilterBar.displayName = 'UsersFilterBar';

export default UsersFilterBar;

