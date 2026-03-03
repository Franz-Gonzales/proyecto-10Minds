import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService } from './application/services/category.service';
import { CategoryResolver } from './presentation/graphql/resolvers/category.resolver';
import { CategoryOrmEntity } from './infrastructure/persistence/typeorm/entities/category.orm-entitie';
import { CATEGORY_REPOSITORY } from './domain/interfaces/category.repository.interface';
import { CategoryRepositoryAdapter } from './infrastructure/persistence/typeorm/repositories/category.repository.adapter';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { GetCategoryByIdUseCase } from './application/use-cases/get-category-by-id.use-case';
import { GetAllCategoriesUseCase } from './application/use-cases/get-all-categories.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case';

@Module({

  imports: [
    TypeOrmModule.forFeature([CategoryOrmEntity])
  ],

  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepositoryAdapter,
    },

    // Casos de use
    CreateCategoryUseCase,
    GetCategoryByIdUseCase,
    GetAllCategoriesUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,

    CategoryResolver,
    CategoryService

  ],

  exports: [CategoryService, CATEGORY_REPOSITORY],
})
export class CategoryModule { }
