import { Inject, Injectable } from "@nestjs/common";

import { Category } from "../../domain/entities/category.entity";
import { CategoryNotFoundException } from "../../domain/exceptions/category.exceptions";
import { CATEGORY_REPOSITORY, type ICategoryRepository } from "../../domain/interfaces/category.repository.interface";

@Injectable()
export class GetCategoryByIdUseCase {
    constructor(
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
    ) {}

    async execute(id: string): Promise<Category> {
        const category = await this.categoryRepository.findById(id);

        if (!category) {
            throw new CategoryNotFoundException(id);
        }

        return category;
    }
}