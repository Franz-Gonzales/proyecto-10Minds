import { Category } from "../entities/category.entity";

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface ICategoryRepository {
    create(category: Category): Promise<Category>;
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    update(id: string, partial: Partial<Category>): Promise<Category>;
    delete(id: string): Promise<boolean>;

    restore(id: string): Promise<boolean>; 
}
