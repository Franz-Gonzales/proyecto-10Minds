import { gql } from 'apollo-angular';

const LOAN_FRAGMENT = `
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
`;

export const CREATE_LOAN = gql`
  mutation CreateLoan($createLoanInput: CreateLoanInput!) {
    createLoan(createLoanInput: $createLoanInput) {
      ${LOAN_FRAGMENT}
    }
  }
`;

export const UPDATE_LOAN = gql`
  mutation UpdateLoan($updateLoanInput: UpdateLoanInput!) {
    updateLoan(updateLoanInput: $updateLoanInput) {
      ${LOAN_FRAGMENT}
    }
  }
`;

export const RETURN_LOAN = gql`
  mutation ReturnLoan($id: ID!) {
    returnLoan(id: $id) {
      ${LOAN_FRAGMENT}
    }
  }
`;

export const REVERT_LOAN = gql`
  mutation RevertLoan($id: ID!) {
    revertLoan(id: $id) {
      ${LOAN_FRAGMENT}
    }
  }
`;

export const DELETE_LOAN = gql`
  mutation RemoveLoan($id: ID!) {
    removeLoan(id: $id)
  }
`;

export const CREATE_BULK_LOANS = gql`
  mutation CreateBulkLoans($createBulkLoansInput: CreateBulkLoansInput!) {
    createBulkLoans(createBulkLoansInput: $createBulkLoansInput) {
      ${LOAN_FRAGMENT}
    }
  }
`;
