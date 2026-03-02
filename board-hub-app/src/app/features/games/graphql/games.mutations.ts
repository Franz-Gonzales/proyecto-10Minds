import { gql } from 'apollo-angular';

export const CREATE_GAME = gql`
  mutation CreateGame($createGameInput: CreateGameInput!) {
    createGame(createGameInput: $createGameInput) {
      id
      title
      category
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
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation UpdateGame($updateGameInput: UpdateGameInput!) {
    updateGame(updateGameInput: $updateGameInput) {
      id
      title
      category
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
    }
  }
`;

export const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id)
  }
`;