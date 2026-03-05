import { gql } from 'apollo-angular';

export const CREATE_GAME = gql`
  mutation CreateGame($createGameInput: CreateGameInput!) {
    createGame(createGameInput: $createGameInput) {
      id
      title
      categoryId
      description
      pricePerDay
      minPlayers
      maxPlayers
      durationMinutes
      stockTotal
      stockAvailable
      imageUrl
      isDeleted
      createdAt
      updatedAt

      category {
        id
        name
        icon
      }
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation UpdateGame($updateGameInput: UpdateGameInput!) {
    updateGame(updateGameInput: $updateGameInput) {
      id
      title
      categoryId
      description
      pricePerDay
      minPlayers
      maxPlayers
      durationMinutes
      stockTotal
      stockAvailable
      imageUrl
      isDeleted
      createdAt
      updatedAt
      
      category {
        id
        name
        icon
      }
    }
  }
`;

export const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id)
  }
`;