import { Client } from '../../clients/models/client.model';
import { Game } from '../../games/models/game.model';

export enum LoanStatus {
  RESERVED = 'RESERVED',
  LOANED = 'LOANED',
  DELIVERED = 'DELIVERED',
  OVERDUE = 'OVERDUE',
}

export interface Loan {
  id: string;
  gameId: string;
  clientId: string;
  quantity: number;
  startDate: string;
  endDate: string;
  deliveryDate: string | null;
  status: LoanStatus;
  pricePerDay: number;
  totalPrice: number;
  notes: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  game?: Game;
  client?: Client;
}

export interface CreateLoanInput {
  gameId: string;
  clientId: string;
  quantity: number;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface UpdateLoanInput {
  id: string;
  gameId?: string;
  clientId?: string;
  quantity?: number;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface BulkLoanItem {
  gameId: string;
  quantity: number;
}

export interface CreateBulkLoansInput {
  clientId: string;
  items: BulkLoanItem[];
  startDate: string;
  endDate: string;
  notes?: string;
}

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  [LoanStatus.RESERVED]: 'Reservado',
  [LoanStatus.LOANED]: 'Prestado',
  [LoanStatus.DELIVERED]: 'Entregado',
  [LoanStatus.OVERDUE]: 'Vencido',
};

export const LOAN_STATUS_COLORS: Record<LoanStatus, { bg: string; text: string; border: string; dot: string }> = {
  [LoanStatus.RESERVED]: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
  },
  [LoanStatus.LOANED]: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
  },
  [LoanStatus.DELIVERED]: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  [LoanStatus.OVERDUE]: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
  },
};
