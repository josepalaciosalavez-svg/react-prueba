export type OrderStatus =
  | 'PENDIENTE'
  | 'PROCESANDO'
  | 'ENVIADO'
  | 'ENTREGADO'
  | 'CANCELADO';

export interface Order {
  id: string;
  codigoProducto: string;
  cantidad: number;
  precio: number;
  total: number;
  statusPedido: OrderStatus;
  entregaId: string;
  clienteId?: string;
  nombreCliente?: string;
  direccionEnvio?: string;
  statusEntrega?: string;
  createdAt: string;
  updatedAt?: string;

  status?: OrderStatus;
  orderNumber?: string;
  totalAmount?: number;
}

export interface UpdateOrderDto {
  codigoProducto: string;
  cantidad: number;
  precio: number;
  statusPedido: OrderStatus;
  entregaId: string;
}

export interface OrderSummaryMetrics {
  totalOrders: number;
  pendingCount: number;
  processingCount: number;
  shippedCount: number;
  deliveredCount: number;
  cancelledCount: number;
  totalSalesVolume: number;
}