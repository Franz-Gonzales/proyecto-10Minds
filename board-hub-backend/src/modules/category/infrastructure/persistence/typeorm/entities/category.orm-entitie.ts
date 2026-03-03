import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('categories')
export class CategoryOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    icon: string;

    @Column({ type: 'boolean', default: true, name: 'is_active' })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
    deletedAt: Date | null;
}