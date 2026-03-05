import { gql } from 'apollo-angular';

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories {
      id
      name
      description
      icon
      isActive
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const GET_CATEGORY_BY_ID = gql`
  query GetCategoryById($id: ID!) {
    category(id: $id) {
      id
      name
      description
      icon
      isActive
      createdAt
      updatedAt
      deletedAt
    }
  }
`;