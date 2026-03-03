import { gql } from 'apollo-angular';

export const GET_ALL_LOANS = gql`
  query GetAllLoans($status: LoanStatus, $clientId: ID, $gameId: ID, $includeDeleted: Boolean) {
    loans(status: $status, clientId: $clientId, gameId: $gameId, includeDeleted: $includeDeleted) {
      id
      gameId
      clientId
      quantity
      startDate
      endDate
      deliveryDate
      status
      pricePerDay
      totalPrice
      notes
      isDeleted
      createdAt
      updatedAt
      deletedAt
      game {
        id
        title
        category
        imageUrl
        pricePerDay
        stockAvailable
      }
      client {
        id
        name
        lastName
        ci
        phoneNumber
        email
      }
    }
  }
`;

export const GET_LOAN_BY_ID = gql`
  query GetLoanById($id: ID!) {
    loan(id: $id) {
      id
      gameId
      clientId
      quantity
      startDate
      endDate
      deliveryDate
      status
      pricePerDay
      totalPrice
      notes
      isDeleted
      createdAt
      updatedAt
      deletedAt
      game {
        id
        title
        category
        imageUrl
        pricePerDay
        stockAvailable
      }
      client {
        id
        name
        lastName
        ci
        phoneNumber
        email
      }
    }
  }
`;
