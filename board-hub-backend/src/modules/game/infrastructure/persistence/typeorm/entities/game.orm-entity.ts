import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { GameCategory } from '../../../../domain/enums/game-category.enum';

@Entity('games')
export class GameOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'enum', enum: GameCategory })
    category: GameCategory;

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
}