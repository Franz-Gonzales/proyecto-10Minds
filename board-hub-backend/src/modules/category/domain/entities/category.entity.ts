
export class Category {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  constructor(props: {
    id: string;
    name: string;
    description: string;
    icon: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.icon = props.icon;
    this.isActive = props.isActive ?? true;
    const now = new Date();
    this.createdAt = props.createdAt ?? now;
    this.updatedAt = props.updatedAt ?? now;
    this.deletedAt = props.deletedAt ?? null;
  }
}
