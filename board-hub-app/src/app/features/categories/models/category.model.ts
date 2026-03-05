export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


export interface CreateCategoryInput {
  name: string;
  description: string;
  icon: string;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
}