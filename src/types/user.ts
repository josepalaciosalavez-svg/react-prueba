export type UserStatus = 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';

export interface SystemUser {
  id: string;
  nombre: string;
  email: string;
  roles: string[];
  status: UserStatus;
  createdAt: string;
}

export interface UserQueryParams {
  page?: number;
  size?: number;
  search?: string;
  status?: UserStatus;
}

export interface PagedUsersResponse {
  content: SystemUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}
