import { Inject, Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';

import { CATEGORY_REPOSITORY, type ICategoryRepository } from "../../domain/interfaces/category.repository.interface";
import { Category } from "../../domain/entities/category.entity";
import { CategoryAlreadyExistsException } from "../../domain/exceptions/category.exceptions";

export interface CreateCategoryCommand {
    name: string;
    description: string;
    icon: string;
}

@Injectable()
export class CreateCategoryUseCase {
    constructor(
        @Inject(CATEGORY_REPOSITORY)
        private readonly categoryRepository: ICategoryRepository,
    ) {}

    async execute(command: CreateCategoryCommand): Promise<Category> {
        const existCategory = await this.categoryRepository.findByName(command.name);

        if (existCategory) throw new CategoryAlreadyExistsException(command.name);

        const category = new Category({
            id: uuidv4(),
            name: command.name,
            description: command.description,
            icon: command.icon,
        });

        return this.categoryRepository.create(category);
    }
}