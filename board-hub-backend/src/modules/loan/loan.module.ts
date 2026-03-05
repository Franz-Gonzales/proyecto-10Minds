import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Domain
import { LOAN_REPOSITORY } from './domain/interfaces/loan.repository.interface';

// Application
import { LoanService } from './application/services/loan.service';
import { CreateLoanUseCase } from './application/use-cases/create-loan.use-case';
import { GetAllLoansUseCase } from './application/use-cases/get-all-loans.use-case';
import { GetLoanByIdUseCase } from './application/use-cases/get-loan-by-id.use-case';
import { UpdateLoanUseCase } from './application/use-cases/update-loan.use-case';
import { DeleteLoanUseCase } from './application/use-cases/delete-loan.use-case';
import { ReturnLoanUseCase } from './application/use-cases/return-loan.use-case';
import { RevertLoanUseCase } from './application/use-cases/revert-loan.use-case';
import { CheckOverdueLoansUseCase } from './application/use-cases/check-overdue-loans.use-case';
import { CountActiveLoansByClientUseCase } from './application/use-cases/count-active-loans-by-client.use-case';
import { CountHistoricLoansByClientUseCase } from './application/use-cases/count-historic-loans-by-client.use-case';

// Infrastructure
import { LoanOrmEntity } from './infrastructure/persistence/typeorm/entities/loan.orm-entity';
import { LoanRepositoryAdapter } from './infrastructure/persistence/typeorm/repositories/loan.repository.adapter';

// Presentation
import { LoanResolver } from './presentation/graphql/resolvers/loan.resolver';

// External modules
import { GamesModule } from '../game/games.module';
import { ClientModule } from '../client/client.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([LoanOrmEntity]),
        GamesModule,
        forwardRef(() => ClientModule),
    ],
    providers: [
        // Repository binding (Port → Adapter)
        {
            provide: LOAN_REPOSITORY,
            useClass: LoanRepositoryAdapter,
        },

        // Use Cases
        CreateLoanUseCase,
        GetAllLoansUseCase,
        GetLoanByIdUseCase,
        UpdateLoanUseCase,
        DeleteLoanUseCase,
        ReturnLoanUseCase,
        RevertLoanUseCase,
        CheckOverdueLoansUseCase,
        CountActiveLoansByClientUseCase,
        CountHistoricLoansByClientUseCase,

        // Service (Facade)
        LoanService,

        // Resolver
        LoanResolver,
    ],
    exports: [LoanService],
})
export class LoanModule { }
