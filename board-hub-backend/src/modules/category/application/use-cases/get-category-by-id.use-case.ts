import { Inject, Injectable } from "@nestjs/common";
import { Category } from "../../domain/entities/category.entity";
import { CATEGORY_REPOSITORY, type ICategoryRepository } from "../../domain/interfaces/category.repository.interface";



@Injectable()
export class GetCategoryByIdUseCase {
    constructor(
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
    ) { }

    async execute(id: string): Promise<Category> {
        const category = await this.categoryRepository.findById(id);

        if (!category) {
            throw new Error(`Category with id ${id} not found`);
        }

        return category;

    }
}