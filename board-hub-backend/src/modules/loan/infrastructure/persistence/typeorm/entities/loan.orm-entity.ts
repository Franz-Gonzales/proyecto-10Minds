import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm";

import { ClientOrmEntity } from "../../../../../client/infrastructure/persistence/typeorm/entities/client.orm-entity";
import { GameOrmEntity } from "../../../../../game/infrastructure/persistence/typeorm/entities/game.orm-entity";
import { LoanStatus } from "../../../../domain/enums/loan-status.enum";

@Entity('loans')
export class LoanOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'game_id' })
    gameId: string;

    @Column({ type: 'uuid', name: 'client_id' })
    clientId: string;

    @Column({ type: 'integer' })
    quantity: number;

    @Column({ type: 'timestamp', name: 'start_date' })
    startDate: Date;

    @Column({ type: 'timestamp', name: 'end_date' })
    endDate: Date;

    @Column({ type: 'timestamp', name: 'delivery_date', nullable: true })
    deliveryDate: Date | null;

    @Column({ type: 'varchar', length: 100 })
    status: LoanStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price_per_day' })
    pricePerDay: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' })
    totalPrice: number;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @Column({ type: 'boolean', default: false, name: 'is_deleted' })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
    deletedAt: Date | null;

    // Relations
    @ManyToOne(() => GameOrmEntity, (game) => game.loans, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'game_id' })
    game: GameOrmEntity;

    @ManyToOne(() => ClientOrmEntity, (client) => client.loans, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'client_id' })
    client: ClientOrmEntity;
}