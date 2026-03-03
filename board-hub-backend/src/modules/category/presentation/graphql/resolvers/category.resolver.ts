import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { CategoryService } from '../../../application/services/category.service';
import { CreateCategoryInput } from '../inputs/create-category.input';
import { UpdateCategoryInput } from '../inputs/update-category.input';
import { CategoryType } from '../types/category.type';
import { Category } from '../../../domain/entities/category.entity';

@Resolver(() => CategoryType)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) { }

  @Mutation(() => CategoryType, { name: 'createCategory' })
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryInput);
  }

  @Query(() => [CategoryType], { name: 'categories' })
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Query(() => CategoryType, { name: 'category' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => CategoryType, { name: 'updateCategory' })
  async updateCategory(@Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput): Promise<Category> {
    return this.categoryService.update(updateCategoryInput.id, updateCategoryInput);
  }

  @Mutation(() => Boolean, { name: 'removeCategory' })
  async removeCategory(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.categoryService.remove(id);
  }
}
