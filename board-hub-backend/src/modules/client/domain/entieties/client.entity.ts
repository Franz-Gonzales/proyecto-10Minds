export class Client {
  readonly id: string;
  readonly name: string;
  readonly lastName: string;
  readonly ci: string;
  readonly phoneNumber: string;
  readonly email: string;
  readonly direction: string | null;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  constructor(props: {
    id: string;
    name: string;
    lastName: string;
    ci: string;
    phoneNumber: string;
    email: string;
    direction?: string | null;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.lastName = props.lastName;
    this.ci = props.ci;
    this.phoneNumber = props.phoneNumber;
    this.email = props.email;
    this.direction = props.direction ?? null;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }
}
