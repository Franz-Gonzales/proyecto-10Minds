import { gql } from 'apollo-angular';

export const CREATE_LOAN = gql`
  mutation CreateLoan($createLoanInput: CreateLoanInput!) {
    createLoan(createLoanInput: $createLoanInput) {
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
        categoryId
        imageUrl
        pricePerDay
        stockAvailable

        category {
          id
          name
          icon
        }
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

export const RETURN_LOAN = gql`
  mutation ReturnLoan($id: ID!) {
    returnLoan(id: $id) {
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
        categoryId
        imageUrl
        pricePerDay
        stockAvailable

        category {
          id
          name
          icon
        }
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

export const DELETE_LOAN = gql`
  mutation RemoveLoan($id: ID!) {
    removeLoan(id: $id)
  }
`;
