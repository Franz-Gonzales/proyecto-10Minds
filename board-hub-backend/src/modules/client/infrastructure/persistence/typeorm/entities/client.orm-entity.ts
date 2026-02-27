import { LoanOrmEntity } from "src/modules/loan/infrastructure/persistence/typeorm/entities/loan.orm-entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('clients')
export class ClientOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, name: 'last_name' })
    lastName: string;

    @Column({ type: 'varchar', length: 20, unique: true })
    ci: string;

    @Column({ type: 'varchar', length: 20, unique: true, name: 'phone_number' })
    phoneNumber: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'text', nullable: true })
    direction: string | null;

    @Column({ type: 'boolean', default: true, name: 'is_active' })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
    deletedAt: Date | null;

    @OneToMany(() => LoanOrmEntity, (loan) => loan.client)
    loans: LoanOrmEntity[];
}