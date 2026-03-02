export enum GameCategory {
  FAMILIAR = 'FAMILIAR',
  ESTRATEGIA = 'ESTRATEGIA',
  COOPERATIVO = 'COOPERATIVO',
  PARTY = 'PARTY',
  ABSTRACTO = 'ABSTRACTO',
  RPG = 'RPG',
}

export interface Game {
  id: string;
  title: string;
  category: GameCategory;
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
}

export interface CreateGameInput {
  title: string;
  category: GameCategory;
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
  category?: GameCategory;
  description?: string | null;
  pricePerDay?: number;
  minPlayers?: number;
  maxPlayers?: number;
  durationMinutes?: number;
  stockTotal?: number;
  imageUrl?: string | null;
}

export const CATEGORY_LABELS: Record<GameCategory, string> = {
  [GameCategory.FAMILIAR]: 'Familiar',
  [GameCategory.ESTRATEGIA]: 'Estrategia',
  [GameCategory.COOPERATIVO]: 'Cooperativo',
  [GameCategory.PARTY]: 'Party',
  [GameCategory.ABSTRACTO]: 'Abstracto',
  [GameCategory.RPG]: 'RPG',
};

export const CATEGORY_COLORS: Record<GameCategory, string> = {
  [GameCategory.FAMILIAR]: 'bg-green-600',
  [GameCategory.ESTRATEGIA]: 'bg-blue-600',
  [GameCategory.COOPERATIVO]: 'bg-purple-600',
  [GameCategory.PARTY]: 'bg-yellow-600',
  [GameCategory.ABSTRACTO]: 'bg-cyan-600',
  [GameCategory.RPG]: 'bg-red-600',
};