import React from 'react';
import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { StatusChip, GlobalTypography } from '@/components/common';
import type { Order } from '@/types/order';

interface OrderTableRowProps {
  order: Order;
  onSelectOrder: (order: Order) => void;
}

const OrderTableRow: React.FC<OrderTableRowProps> = React.memo(({ order, onSelectOrder }) => {
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const precio = Number(order.precio ?? 0);
  const cantidad = Number(order.cantidad ?? 1);
  const total = Number(order.total ?? (precio * cantidad));

  const handleRowClick = React.useCallback(() => {
    onSelectOrder(order);
  }, [order, onSelectOrder]);

  const handleActionClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelectOrder(order);
    },
    [order, onSelectOrder]
  );

  return (
    <TableRow
      hover
      onClick={handleRowClick}
      sx={{
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      {/* Código de Producto */}
      <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap', py: 2 }}>
        <GlobalTypography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
          {order.codigoProducto}
        </GlobalTypography>
        <GlobalTypography variant="caption" sx={{ color: '#94A3B8', display: 'block', fontSize: '0.725rem' }}>
          {formattedDate}
        </GlobalTypography>
      </TableCell>

      {/* Cantidad */}
      <TableCell align="center" sx={{ py: 2 }}>
        <Chip
          label={`${cantidad} pza${cantidad > 1 ? 's' : ''}`}
          size="small"
          sx={{ fontWeight: 600, backgroundColor: '#F1F5F9', color: '#334155' }}
        />
      </TableCell>

      {/* Precio */}
      <TableCell align="right" sx={{ whiteSpace: 'nowrap', py: 2 }}>
        <GlobalTypography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
          ${precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </GlobalTypography>
      </TableCell>

      {/* Total */}
      <TableCell align="right" sx={{ whiteSpace: 'nowrap', py: 2 }}>
        <GlobalTypography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
          ${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </GlobalTypography>
      </TableCell>

      {/* Estatus */}
      <TableCell align="center" sx={{ whiteSpace: 'nowrap', py: 2 }}>
        <StatusChip status={order.statusPedido} />
      </TableCell>

      {/* ID Entrega */}
      <TableCell sx={{ whiteSpace: 'nowrap', py: 2 }}>
        <GlobalTypography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 600,
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 1,
            px: 0.8,
            py: 0.3,
            color: '#475569',
          }}
        >
          {order.entregaId}
        </GlobalTypography>
      </TableCell>

      {/* Cliente */}
      <TableCell sx={{ py: 2, minWidth: 160 }}>
        <GlobalTypography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
          {order.nombreCliente || 'No asignado'}
        </GlobalTypography>
      </TableCell>

      {/* Dirección de Entrega */}
      <TableCell sx={{ py: 2, minWidth: 220 }}>
        <GlobalTypography variant="body2" sx={{ color: '#475569', fontSize: '0.8125rem', lineHeight: 1.35 }}>
          {order.direccionEnvio || 'Dirección pendiente'}
        </GlobalTypography>
      </TableCell>

      {/* Acción */}
      <TableCell align="center" sx={{ whiteSpace: 'nowrap', py: 2 }}>
        <Tooltip title="Ver pedido">
          <IconButton
            size="small"
            sx={{
              color: '#E10098',
              backgroundColor: '#FDF2F8',
              '&:hover': { backgroundColor: '#FCE7F3' },
            }}
            onClick={handleActionClick}
            aria-label={`Ver pedido ${order.codigoProducto}`}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
});

OrderTableRow.displayName = 'OrderTableRow';

interface OrderTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const OrderTable: React.FC<OrderTableProps> = React.memo(({ orders, onSelectOrder }) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: '1px solid #E2E8F0',
        borderRadius: 2,
        overflowX: 'auto',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Table sx={{ minWidth: 1000 }} aria-label="tabla de pedidos">
        <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', whiteSpace: 'nowrap', py: 1.5 }}>
              Código Producto
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', whiteSpace: 'nowrap', py: 1.5 }}>
              Cantidad
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', whiteSpace: 'nowrap', py: 1.5 }}>
              Precio
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', whiteSpace: 'nowrap', py: 1.5 }}>
              Total
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', whiteSpace: 'nowrap', py: 1.5 }}>
              Estatus Pedido
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', whiteSpace: 'nowrap', py: 1.5 }}>
              ID Entrega
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', whiteSpace: 'nowrap', py: 1.5 }}>
              Cliente
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', minWidth: 220, py: 1.5 }}>
              Dirección de Entrega
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem', whiteSpace: 'nowrap', py: 1.5 }}>
              Acción
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <OrderTableRow key={order.id} order={order} onSelectOrder={onSelectOrder} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

OrderTable.displayName = 'OrderTable';

export default OrderTable;
