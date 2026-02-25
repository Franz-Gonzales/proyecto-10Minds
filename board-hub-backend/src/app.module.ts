import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, appValidationSchema } from './config/app.config';
import { databaseConfig, databaseValidationSchema } from './config/database.config';
import { graphqlConfig } from './config/graphql.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GamesModule } from './modules/game/games.module';



@Module({
  imports: [

    //TODO: Configación globlal
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, graphqlConfig],
      validationSchema: appValidationSchema.concat(databaseValidationSchema),
    }),

    // Base de datos
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get<any>('database') || {},
      inject: [ConfigService],
    }),


    // GraphQL
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        ...configService.get('graphql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
      }),
      inject: [ConfigService],
    }),


    GamesModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
