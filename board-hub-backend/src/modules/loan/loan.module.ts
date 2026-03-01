import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Domain
import { LOAN_REPOSITORY } from './domain/interfaces/loan.repository.interface';

// Application
import { LoanService } from './application/services/loan.service';
import { CreateLoantUseCase } from './application/use-cases/create-loan.use-case';
import { GetAllLoansUseCase } from './application/use-cases/get-all-loans.use-case';
import { GetLoanByIdUseCase } from './application/use-cases/get-loan-by-id.use-case';
import { UpdateLoanUseCase } from './application/use-cases/update-loan.use-case';
import { DeleteLoanUseCase } from './application/use-cases/delete-laon.use-case';

// Infrastructure
import { LoanOrmEntity } from './infrastructure/persistence/typeorm/entities/loan.orm-entity';
import { LoanRepositoryAdapter } from './infrastructure/persistence/typeorm/repositories/loan.repository.adapter';

// Presentation
import { LoanResolver } from './presentation/graphql/resolvers/loan.resolver';

// External modules
import { GamesModule } from '../game/games.module';
import { ClientModule } from '../client/client.module';
import { GAME_REPOSITORY } from '../game/domain/interfaces/game.repository.interface';
import { GameRepositoryAdapter } from '../game/infrastructure/persistence/typeorm/repositories/game.repository.adapter';
import { ClientRepositoryAdapter } from '../client/infrastructure/persistence/typeorm/repositories/client.repository.adapter';
import { CLIENT_REPOSITORY } from '../client/domain/interfaces/client.repository.interface';
import { GameOrmEntity } from '../game/infrastructure/persistence/typeorm/entities/game.orm-entity';
import { ClientOrmEntity } from '../client/infrastructure/persistence/typeorm/entities/client.orm-entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            LoanOrmEntity,
            GameOrmEntity,
            ClientOrmEntity,
        ]),
        GamesModule,
        ClientModule,
    ],
    providers: [
        // Repository binding (Port → Adapter)
        {
            provide: LOAN_REPOSITORY,
            useClass: LoanRepositoryAdapter,
        },

        // Game repository 
        {
            provide: GAME_REPOSITORY,
            useClass: GameRepositoryAdapter,
        },
        // Client repository 
        {
            provide: CLIENT_REPOSITORY,
            useClass: ClientRepositoryAdapter,
        },

        // Use cases
        CreateLoantUseCase,
        GetAllLoansUseCase,
        GetLoanByIdUseCase,
        UpdateLoanUseCase,
        DeleteLoanUseCase,

        // Service (Facade)
        LoanService,

        // Resolver
        LoanResolver,
    ],
    exports: [LoanService],
})
export class LoanModule { }
