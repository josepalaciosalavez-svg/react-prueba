export type DeliveryStatus = 'ACTIVO' | 'INACTIVO';

export interface Delivery {
  id: string;
  clienteId: string;
  nombreCliente: string | null;
  direccionEnvio: string;
  status: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
  status?: DeliveryStatus | '';
}

export interface PagedDeliveriesResponse {
  content: Delivery[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}
