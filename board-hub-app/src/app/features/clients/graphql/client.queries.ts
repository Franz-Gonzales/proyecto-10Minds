import { gql } from 'apollo-angular';

export const GET_ALL_CLIENTS = gql`
  query GetAllClients {
    clients {
      id
      name
      lastName
      ci
      phoneNumber
      email
      direction
      isActive
      createdAt
      updatedAt
      deletedAt

      activeLoans
      totalHistoric
    }
  }
`;

export const GET_CLIENTS_PAGINATED = gql`
  query GetClientsPaginated(
    $page: Int!
    $limit: Int!
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    clientsPaginated(
      page: $page
      limit: $limit
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      items {
        id
        name
        lastName
        ci
        phoneNumber
        email
        direction
        isActive
        createdAt
        updatedAt
        deletedAt
        activeLoans
        totalHistoric
      }
      pageInfo {
        totalItems
        totalPages
        currentPage
        itemsPerPage
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_CLIENT_BY_ID = gql`
  query GetClientById($id: ID!) {
    client(id: $id) {
      id
      name
      lastName
      ci
      phoneNumber
      email
      direction
      isActive
      createdAt
      updatedAt
      deletedAt

      activeLoans
      totalHistoric
    }
  }
`;