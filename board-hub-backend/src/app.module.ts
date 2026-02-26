import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { appConfig, appValidationSchema } from './config/app.config';
import { databaseConfig, databaseValidationSchema } from './config/database.config';
import { graphqlConfig } from './config/graphql.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GamesModule } from './modules/game/games.module';
import { GraphqlExceptionFilter } from './common/filters/graphql-exception.filter';
import { join } from 'path';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, graphqlConfig],
      validationSchema: appValidationSchema.concat(databaseValidationSchema),
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
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

    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   sortSchema: true,
    //   playground: false,
    //   plugins:[
    //     ApolloServerPluginLandingPageLocalDefault(),
    //   ]
    // }),

    GamesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphqlExceptionFilter,
    },
  ],
})
export class AppModule { }
