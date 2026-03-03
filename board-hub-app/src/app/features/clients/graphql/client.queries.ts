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