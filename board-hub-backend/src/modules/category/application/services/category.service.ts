import { Injectable } from '@nestjs/common';

import { CreateCategoryCommand, CreateCategoryUseCase } from '../use-cases/create-category.use-case';
import { Category } from '../../domain/entities/category.entity';
import { GetCategoryByIdUseCase } from '../use-cases/get-category-by-id.use-case';
import { GetAllCategoriesUseCase } from '../use-cases/get-all-categories.use-case';
import { UpdateCategoryCommand, UpdateCategoryUseCase } from '../use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../use-cases/delete-category.use-case';

@Injectable()
export class CategoryService {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly getAllCategoriesUseCase: GetAllCategoriesUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase
  ) { }

  async create(command: CreateCategoryCommand): Promise<Category> {
    return this.createCategoryUseCase.execute(command);
  }

  async findAll(): Promise<Category[]> {
    return this.getAllCategoriesUseCase.execute();
  }

  async findOne(id: string): Promise<Category> {
    return this.getCategoryByIdUseCase.execute(id);
  }

  async update(id: string, command: UpdateCategoryCommand): Promise<Category> {
    return this.updateCategoryUseCase.execute(id, command);
  }

  async remove(id: string): Promise<boolean> {
    return this.deleteCategoryUseCase.execute(id);
  }

}
