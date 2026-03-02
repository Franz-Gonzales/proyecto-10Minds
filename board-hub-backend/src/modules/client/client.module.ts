import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CLIENT_REPOSITORY } from './domain/interfaces/client.repository.interface';

import { ClientService } from './application/services/client.service';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case';
import { GetClientByIdUseCase } from './application/use-cases/get-client-by-id.use-case';
import { GetAllClientUseCase } from './application/use-cases/get-all-clients.use-case';
import { UpdateClientUseCase } from './application/use-cases/update-client.use-case';
import { DeleteClientUseCase } from './application/use-cases/delete-client.use-case';

import { ClientRepositoryAdapter } from './infrastructure/persistence/typeorm/repositories/client.repository.adapter';
import { ClientOrmEntity } from './infrastructure/persistence/typeorm/entities/client.orm-entity';

import { ClientResolver } from './presentation/graphql/resolvers/client.resolver';

@Module({

  imports: [
    TypeOrmModule.forFeature([ClientOrmEntity])
  ],

  providers: [

    {
      provide: CLIENT_REPOSITORY,
      useClass: ClientRepositoryAdapter,
    },

    CreateClientUseCase,
    GetAllClientUseCase,
    GetClientByIdUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,

    ClientResolver,
    ClientService,
  ],
  exports: [ClientService, CLIENT_REPOSITORY],
})
export class ClientModule {}
