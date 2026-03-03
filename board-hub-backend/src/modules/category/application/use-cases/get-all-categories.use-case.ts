import { Inject, Injectable } from "@nestjs/common";

import { CATEGORY_REPOSITORY, type ICategoryRepository } from "../../domain/interfaces/category.repository.interface";
import { Category } from "../../domain/entities/category.entity";


@Injectable()
export class GetAllCategoriesUseCase {
    constructor(
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
    ) { }

    async execute(): Promise<Category[]> {
        return await this.categoryRepository.findAll();
    }

}