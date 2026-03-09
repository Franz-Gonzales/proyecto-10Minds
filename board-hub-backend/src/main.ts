import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import compression from 'compression';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // Extraemos usando getOrThrow (sin valores por defecto)
  const nodeEnv = configService.getOrThrow<string>('app.nodeEnv');
  const bodyLimit = configService.getOrThrow<string>('app.bodyLimit');
  const port = configService.getOrThrow<number>('app.port');
  const corsOrigins = configService.getOrThrow<string[]>('app.corsOrigins');

  // Helmet — Cabeceras de seguridad HTTP
  app.use(
    helmet({
      contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: nodeEnv === 'production',
    }),
  );

  // Compresión — gzip/deflate para respuestas HTTP
  app.use(compression());

  // CORS
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Body Parser
  app.use(json({ limit: bodyLimit }));
  app.use(urlencoded({ extended: true, limit: bodyLimit }));

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);

  logger.log(`Environment: ${nodeEnv}`);
  logger.log(`CORS origins: ${corsOrigins.join(', ')}`);
  logger.log(`Body limit: ${bodyLimit}`);
  logger.log(`Application running on: http://localhost:${port}/graphql`);
}
void bootstrap();