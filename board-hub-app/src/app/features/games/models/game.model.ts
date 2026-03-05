import { Category } from '../../categories/models/category.model';

export interface Game {
  id: string;
  title: string;
  categoryId: string;
  description: string | null;
  pricePerDay: number;
  minPlayers: number;
  maxPlayers: number;
  durationMinutes: number;
  stockTotal: number;
  stockAvailable: number;
  imageUrl: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  category?: Category;
}

export interface CreateGameInput {
  title: string;
  categoryId: string;
  description?: string | null;
  pricePerDay: number;
  minPlayers: number;
  maxPlayers: number;
  durationMinutes: number;
  stockTotal: number;
  imageUrl?: string | null;
}

export interface UpdateGameInput {
  id: string;
  title?: string;
  categoryId?: string;
  description?: string | null;
  pricePerDay?: number;
  minPlayers?: number;
  maxPlayers?: number;
  durationMinutes?: number;
  stockTotal?: number;
  imageUrl?: string | null;
}
