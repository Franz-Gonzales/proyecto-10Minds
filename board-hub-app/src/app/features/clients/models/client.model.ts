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