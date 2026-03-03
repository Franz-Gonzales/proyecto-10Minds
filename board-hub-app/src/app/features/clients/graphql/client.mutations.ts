import { gql } from 'apollo-angular';

export const CREATE_CLIENT = gql`
  mutation CreateClient($createClientInput: CreateClientInput!) {
    createClient(createClientInput: $createClientInput) {
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


export const UPDATE_CLIENT = gql`
  mutation UpdateClient($updateClientInput: UpdateClientInput!) {
    updateClient(updateClientInput: $updateClientInput) {
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

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    removeClient(id: $id)
  }
`;