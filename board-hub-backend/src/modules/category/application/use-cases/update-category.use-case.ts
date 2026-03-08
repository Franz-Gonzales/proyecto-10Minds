import { Inject, Injectable } from "@nestjs/common";

import { CATEGORY_REPOSITORY, type ICategoryRepository } from "../../domain/interfaces/category.repository.interface";
import { Category } from "../../domain/entities/category.entity";
import { CategoryAlreadyExistsException, CategoryNotFoundException } from "../../domain/exceptions/category.exceptions";

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
    ) {}

    async execute(id: string, command: UpdateCategoryCommand): Promise<Category> {
        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new CategoryNotFoundException(id);
        }

        if (command.name) {
            const duplicateCategory = await this.categoryRepository.findByName(command.name);
            if (duplicateCategory && duplicateCategory.id !== id) {
                throw new CategoryAlreadyExistsException(command.name);
            }
        }

        return this.categoryRepository.update(id, command);
    }
}