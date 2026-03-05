import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

import { GraphqlClientService } from "../../../core/graphql/graphql-client.service";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "../models/category.model";
import { GET_ALL_CATEGORIES, GET_CATEGORY_BY_ID } from "../graphql/category.queries";
import { CREATE_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from "../graphql/category.mutations";


interface GetAllCategoriesResponse {
  categories: Category[];
}

interface GetCategoryByIdResponse {
  category: Category;
}

interface CreateCategoryResponse {
  createCategory: Category;
}

interface UpdateCategoryResponse {
  updateCategory: Category;
}

interface DeleteCategoryResponse {
  removeCategory: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly graphql = inject(GraphqlClientService);

  getAll(): Observable<Category[]> {
    return this.graphql
      .query<GetAllCategoriesResponse>(GET_ALL_CATEGORIES)
      .pipe(map((res) => res.categories));
  }

  getById(id: string): Observable<Category> {
    return this.graphql
      .query<GetCategoryByIdResponse>(GET_CATEGORY_BY_ID, { id })
      .pipe(map((res) => res.category));
  }

  create(input: CreateCategoryInput): Observable<Category> {
    return this.graphql
      .mutate<CreateCategoryResponse>(CREATE_CATEGORY, { createCategoryInput: input })
      .pipe(map((res) => res.createCategory));
  }

  update(input: UpdateCategoryInput): Observable<Category> {
    return this.graphql
      .mutate<UpdateCategoryResponse>(UPDATE_CATEGORY, { updateCategoryInput: input })
      .pipe(map((res) => res.updateCategory));
  }

  delete(id: string): Observable<boolean> {
    return this.graphql
      .mutate<DeleteCategoryResponse>(DELETE_CATEGORY, { id })
      .pipe(map((res) => res.removeCategory));
  }
}