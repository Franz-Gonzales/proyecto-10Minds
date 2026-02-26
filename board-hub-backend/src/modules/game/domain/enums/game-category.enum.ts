import { registerEnumType } from "@nestjs/graphql";

export enum GameCategory {
    FAMILIAR = 'Familiar',
    ESTRATEGIA = 'Estrategia',
    COOPERATIVO = 'Cooperativo',
    PARTY = 'Party',
    ABSTRACTO = 'Abstracto',
    RPG = 'RPG',
}


registerEnumType(GameCategory, {
    name: 'GameCategory',
    description: 'Categorías de juegos de mesa',
});