import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Request, Response } from 'express';

import { appConfig, appValidationSchema } from './config/app.config';
import {
  databaseConfig,
  databaseValidationSchema,
} from './config/database.config';
import { graphqlConfig } from './config/graphql.config';

import { GraphqlExceptionFilter } from './common/filters/graphql-exception.filter';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard';

import { CategoryModule } from './modules/category/category.module';
import { GamesModule } from './modules/game/games.module';
import { ClientModule } from './modules/client/client.module';
import { LoanModule } from './modules/loan/loan.module';

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
        context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
      }),
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('app.throttleTtl', 60000),
            limit: configService.get<number>('app.throttleLimit', 100),
          },
        ],
      }),
      inject: [ConfigService],
    }),

    CategoryModule,
    GamesModule,
    ClientModule,
    LoanModule,
  ],
  providers: [
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: GraphqlExceptionFilter,
    },
    // Global rate limiting guard (adapted for GraphQL)
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
    // Global timeout interceptor (15s)
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new TimeoutInterceptor(15000),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
