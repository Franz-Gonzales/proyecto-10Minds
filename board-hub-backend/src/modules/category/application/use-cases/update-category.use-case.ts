import { Inject, Injectable } from "@nestjs/common";
import { v4 as uuidv4, v4 } from 'uuid';

import { CATEGORY_REPOSITORY, type ICategoryRepository } from "../../domain/interfaces/category.repository.interface";
import { Category } from "../../domain/entities/category.entity";


export interface UpdateCategoryCommand {
    name?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
}

@Injectable()
export class UpdateCategoryUseCase {
    constructor(
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
    ) { }

    async execute(id: string, command: UpdateCategoryCommand): Promise<Category> {

        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new Error(`Category with id ${id} not found`);
        }

        if (command.name) {
            const duplicateCategory = await this.categoryRepository.findByName(command.name);
            if (duplicateCategory && duplicateCategory.id !== id) {
                throw new Error(`Category with name ${command.name} already exists`);
            }
        }

        return await this.categoryRepository.update(id, command);

    }
}