import { Inject, Injectable } from "@nestjs/common";
import { CATEGORY_REPOSITORY, type ICategoryRepository } from "../../domain/interfaces/category.repository.interface";

@Injectable()
export class DeleteCategoryUseCase {
    constructor(
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
    ) { }

    async execute(id: string): Promise<boolean> {
        const existingCategory = await this.categoryRepository.findById(id);
        if (!existingCategory) {
            throw new Error(`Category with id ${id} not found`);
        }
        return this.categoryRepository.delete(id);
    }
}