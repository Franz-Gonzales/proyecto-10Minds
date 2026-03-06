export interface Client {
  id: string;
  name: string;
  lastName: string;
  ci: string;
  phoneNumber: string;
  email: string;
  direction: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  activeLoans: number;
  totalHistoric: number;
}

export interface PageInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedClients {
  items: Client[];
  pageInfo: PageInfo;
}

export interface CreateClientInput {
  name: string;
  lastName: string;
  ci: string;
  phoneNumber: string;
  email: string;
  direction?: string | null;
}

export interface UpdateClientInput {
  id: string;
  name?: string;
  lastName?: string;
  ci?: string;
  phoneNumber?: string;
  email?: string;
  direction?: string | null;
}