import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { LoanOrmEntity } from '../../../../../loan/infrastructure/persistence/typeorm/entities/loan.orm-entity';
import { CategoryOrmEntity } from '../../../../../category/infrastructure/persistence/typeorm/entities/category.orm-entity';

@Entity('games')
export class GameOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'category_id' })
    categoryId: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price_per_day' })
    pricePerDay: number;

    @Column({ type: 'int', name: 'min_players' })
    minPlayers: number;

    @Column({ type: 'int', name: 'max_players' })
    maxPlayers: number;

    @Column({ type: 'int', name: 'duration_minutes' })
    durationMinutes: number;

    @Column({ type: 'int', name: 'stock_total' })
    stockTotal: number;

    @Column({ type: 'int', name: 'stock_available' })
    stockAvailable: number;

    @Column({ type: 'text', nullable: true, name: 'image_url' })
    imageUrl: string | null;

    @Column({ type: 'boolean', default: false, name: 'is_deleted' })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @OneToMany(() => LoanOrmEntity, (loan) => loan.game)
    loans: LoanOrmEntity[];

    @ManyToOne(() => CategoryOrmEntity, (category) => category.games, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'category_id' })
    category: CategoryOrmEntity;
}