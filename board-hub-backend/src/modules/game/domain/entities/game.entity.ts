export class Game {
  readonly id: string;
  readonly title: string;
  readonly categoryId: string;
  readonly description: string | null;
  readonly pricePerDay: number;
  readonly minPlayers: number;
  readonly maxPlayers: number;
  readonly durationMinutes: number;
  readonly stockTotal: number;
  public stockAvailable: number;
  readonly imageUrl: string | null;
  readonly isDeleted: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    title: string;
    categoryId: string;
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
    this.categoryId = props.categoryId;
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

  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be a positive number');
    }
    if (!this.hasStock(quantity)) {
      throw new Error(`Insufficient stock. Available: ${this.stockAvailable}`);
    }
    this.stockAvailable -= quantity;
  }

  hasStock(quantity: number): boolean {
    return this.stockAvailable >= quantity;
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be a positive number');
    }
    if (this.stockAvailable + quantity > this.stockTotal) {
      throw new Error(`Cannot increase stock beyond total. Available: ${this.stockAvailable}, Total: ${this.stockTotal}`);
    }
    this.stockAvailable += quantity;
  }
}
