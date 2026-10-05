import React, { memo } from 'react';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { GlobalTypography } from '@/components/common';
import { UserStatusChip } from './UserStatusChip';
import type { SystemUser } from '@/types/user';

interface UserTableRowProps {
  user: SystemUser;
  onEdit?: (user: SystemUser) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = memo(({ user, onEdit }) => {
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : 'N/A';

  const initial = (user.nombre || user.email || 'U').charAt(0).toUpperCase();

  return (
    <TableRow
      hover
      sx={{
        transition: 'background-color 0.15s ease',
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell component="th" scope="row" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 38,
              height: 38,
              backgroundColor: '#FDF2F8',
              color: '#E10098',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: '1px solid #FCE7F3',
            }}
          >
            {initial}
          </Avatar>
          <Box>
            <GlobalTypography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
              {user.nombre}
            </GlobalTypography>
            <GlobalTypography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>
              {user.email}
            </GlobalTypography>
          </Box>
        </Box>
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
          {Array.isArray(user.roles) && user.roles.length > 0 ? (
            user.roles.map((role) => {
              const isAdmin = role.includes('ADMIN');
              return (
                <Chip
                  key={role}
                  label={role.replace('ROLE_', '')}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    height: 20,
                    borderRadius: 1,
                    backgroundColor: isAdmin ? '#FDF2F8' : '#EFF6FF',
                    color: isAdmin ? '#E10098' : '#2563EB',
                    border: `1px solid ${isAdmin ? '#FCE7F3' : '#DBEAFE'}`,
                  }}
                />
              );
            })
          ) : (
            <Chip
              label="SIN ROL"
              size="small"
              sx={{ height: 20, fontSize: '0.7rem', backgroundColor: '#F1F5F9', color: '#64748B' }}
            />
          )}
        </Box>
      </TableCell>

      <TableCell align="center" sx={{ py: 2 }}>
        <UserStatusChip status={user.status} />
      </TableCell>

      <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
        <GlobalTypography variant="body2" sx={{ color: '#475569', fontSize: '0.8125rem' }}>
          {formattedDate}
        </GlobalTypography>
      </TableCell>

      <TableCell align="right" sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
        <Tooltip title="Editar usuario">
          <IconButton
            size="small"
            onClick={() => onEdit?.(user)}
            aria-label={`Editar usuario ${user.nombre}`}
            sx={{
              color: '#64748B',
              '&:hover': {
                color: '#E10098',
                backgroundColor: '#FDF2F8',
              },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
});

UserTableRow.displayName = 'UserTableRow';

interface UsersTableProps {
  users: SystemUser[];
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  onEditUser?: (user: SystemUser) => void;
}

export const UsersTable: React.FC<UsersTableProps> = memo(({
  users,
  page,
  size,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
  onEditUser,
}) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: '1px solid #E2E8F0',
        borderRadius: 2.5,
        overflowX: 'auto',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Table sx={{ minWidth: 750 }} aria-label="tabla de usuarios">
        <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', py: 1.75 }}>
              Usuario
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', py: 1.75 }}>
              Roles Asignados
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', py: 1.75 }}>
              Estatus
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', py: 1.75 }}>
              Fecha de Registro
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', py: 1.75 }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UserTableRow key={user.id} user={user} onEdit={onEditUser} />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalElements}
        rowsPerPage={size}
        page={page}
        onPageChange={(_e, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
        sx={{
          borderTop: '1px solid #E2E8F0',
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: '0.8125rem',
            color: '#475569',
          },
        }}
      />
    </TableContainer>
  );
});

UsersTable.displayName = 'UsersTable';

export default UsersTable;
