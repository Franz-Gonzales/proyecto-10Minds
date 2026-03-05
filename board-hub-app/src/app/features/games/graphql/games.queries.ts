import { gql } from 'apollo-angular';

export const GET_ALL_GAMES = gql`
  query GetAllGames($categoryId: ID) {
    games(categoryId: $categoryId) {
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

export const GET_GAME_BY_ID = gql`
  query GetGameById($id: ID!) {
    game(id: $id) {
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
