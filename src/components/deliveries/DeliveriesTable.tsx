import React, { memo } from 'react';
import {
  Box,
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
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { GlobalTypography } from '@/components/common';
import type { Delivery } from '@/types/delivery';

interface DeliveryTableRowProps {
  delivery: Delivery;
  onEdit?: (delivery: Delivery) => void;
  onDelete?: (delivery: Delivery) => void;
}

const DeliveryTableRow: React.FC<DeliveryTableRowProps> = memo(({ delivery, onEdit, onDelete }) => {
  const formattedDate = delivery.createdAt
    ? new Date(delivery.createdAt).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : 'N/A';

  return (
    <TableRow
      hover
      sx={{
        transition: 'background-color 0.15s ease',
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell component="th" scope="row" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              backgroundColor: '#FDF2F8',
              color: '#E10098',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              mt: 0.25,
            }}
          >
            <PlaceOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <GlobalTypography variant="body2" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
              {delivery.direccionEnvio}
            </GlobalTypography>
          </Box>
        </Box>
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonOutlinedIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <Box>
            <GlobalTypography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
              {delivery.nombreCliente || 'Cliente no asignado'}
            </GlobalTypography>
            <GlobalTypography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: '#64748B',
                display: 'block',
                fontSize: '0.75rem',
              }}
            >
            </GlobalTypography>
          </Box>
        </Box>
      </TableCell>

      <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
        <GlobalTypography variant="body2" sx={{ color: '#475569', fontSize: '0.8125rem' }}>
          {formattedDate}
        </GlobalTypography>
      </TableCell>

      <TableCell align="right" sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Editar lugar de entrega">
            <IconButton
              size="small"
              onClick={() => onEdit?.(delivery)}
              aria-label={`Editar entrega ${delivery.id}`}
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
          <Tooltip title="Eliminar lugar de entrega">
            <IconButton
              size="small"
              onClick={() => onDelete?.(delivery)}
              aria-label={`Eliminar entrega ${delivery.id}`}
              sx={{
                color: '#64748B',
                '&:hover': {
                  color: '#DC2626',
                  backgroundColor: '#FEF2F2',
                },
              }}
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
});

DeliveryTableRow.displayName = 'DeliveryTableRow';

interface DeliveriesTableProps {
  deliveries: Delivery[];
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  onEditDelivery?: (delivery: Delivery) => void;
  onDeleteDelivery?: (delivery: Delivery) => void;
}

export const DeliveriesTable: React.FC<DeliveriesTableProps> = memo(({
  deliveries,
  page,
  size,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
  onEditDelivery,
  onDeleteDelivery,
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
      <Table sx={{ minWidth: 750 }} aria-label="tabla de lugares de entrega">
        <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', py: 1.75 }}>
              Dirección de Entrega
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', py: 1.75 }}>
              Cliente
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
          {deliveries.map((delivery) => (
            <DeliveryTableRow
              key={delivery.id}
              delivery={delivery}
              onEdit={onEditDelivery}
              onDelete={onDeleteDelivery}
            />
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

DeliveriesTable.displayName = 'DeliveriesTable';

export default DeliveriesTable;
