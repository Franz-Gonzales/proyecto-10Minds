import { GameCategory } from '../enums/game-category.enum';

export class Game {
  readonly id: string;
  readonly title: string;
  readonly category: GameCategory;
  readonly description: string | null;
  readonly pricePerDay: number;
  readonly minPlayers: number;
  readonly maxPlayers: number;
  readonly durationMinutes: number;
  readonly stockTotal: number;
  readonly stockAvailable: number;
  readonly imageUrl: string | null;
  readonly isDeleted: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    title: string;
    category: GameCategory;
    description?: string | null;
    pricePerDay: number;
    minPlayers: number;
    maxPlayers: number;
    durationMinutes: number;
    stockTotal: number;
    stockAvailable: number;
    imageUrl?: string | null;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.title = props.title;
    this.category = props.category;
    this.description = props.description ?? null;
    this.pricePerDay = props.pricePerDay;
    this.minPlayers = props.minPlayers;
    this.maxPlayers = props.maxPlayers;
    this.durationMinutes = props.durationMinutes;
    this.stockTotal = props.stockTotal;
    this.stockAvailable = props.stockAvailable;
    this.imageUrl = props.imageUrl ?? null;
    this.isDeleted = props.isDeleted ?? false;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
