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

export interface DeliveryRequest {
  clienteId: string;
  direccionEnvio: string;
  status: DeliveryStatus;
}

export type CreateDeliveryDto = DeliveryRequest;
export type UpdateDeliveryDto = DeliveryRequest;

export interface ClientOption {
  id: string;
  nombre: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  email?: string;
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
