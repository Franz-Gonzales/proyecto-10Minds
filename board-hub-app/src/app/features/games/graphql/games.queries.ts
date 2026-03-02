import { gql } from 'apollo-angular';

export const GET_ALL_GAMES = gql`
  query GetAllGames($category: GameCategory) {
    games(category: $category) {
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

export const GET_GAME_BY_ID = gql`
  query GetGameById($id: ID!) {
    game(id: $id) {
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