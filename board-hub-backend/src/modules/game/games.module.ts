import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Domain
import { GAME_REPOSITORY } from './domain/interfaces/game.repository.interface';

// Application
import { GamesService } from './application/services/games.service';
import { CreateGameUseCase } from './application/use-cases/create-game.use-case';
import { GetAllGamesUseCase } from './application/use-cases/get-all-games.use-case';
import { GetGameByIdUseCase } from './application/use-cases/get-game-by-id.use-case';
import { UpdateGameUseCase } from './application/use-cases/update-game.use-case';
import { DeleteGameUseCase } from './application/use-cases/delete-game.use-case';

// Infrastructure
import { GameOrmEntity } from './infrastructure/persistence/typeorm/entities/game.orm-entity';
import { GameRepositoryAdapter } from './infrastructure/persistence/typeorm/repositories/game.repository.adapter';

// Presentation
import { GamesResolver } from './presentation/graphql/resolvers/games.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([GameOrmEntity])],
  providers: [
    // Repository binding (Port → Adapter)
    {
      provide: GAME_REPOSITORY,
      useClass: GameRepositoryAdapter,
    },

    // Use cases
    CreateGameUseCase,
    GetAllGamesUseCase,
    GetGameByIdUseCase,
    UpdateGameUseCase,
    DeleteGameUseCase,

    // Service
    GamesService,

    // Resolver
    GamesResolver,
  ],
  exports: [GamesService],
})
export class GamesModule { }