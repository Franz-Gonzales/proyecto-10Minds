
export class Category {
  public id: string;
  public name: string;
  public description: string;
  public icon: string;
  public isActive: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null;

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
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }
}
