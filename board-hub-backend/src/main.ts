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

  const nodeEnv = configService.get<string>('app.nodeEnv', 'development');
  const bodyLimit = configService.get<string>('app.bodyLimit', '10mb');

  //  Helmet — Cabeceras de seguridad HTTP
  //  Desactiva contentSecurityPolicy en desarrollo para permitir Apollo Sandbox
  app.use(
    helmet({
      contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: nodeEnv === 'production',
    }),
  );

  // Compresión — gzip/deflate para respuestas HTTP
  app.use(compression());

  // CORS — Orígenes permitidos desde configuración
  const corsOrigins = configService.get<string[]>('app.corsOrigins', [
    'http://localhost:4200',
  ]);
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Body Parser — Límite configurable para payloads grandes (Base64 images)
  app.use(json({ limit: bodyLimit }));
  app.use(urlencoded({ extended: true, limit: bodyLimit }));

  // Validación global — Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.get<number>('app.port', 3000);
  await app.listen(port);

  logger.log(`Environment: ${nodeEnv}`);
  logger.log(`CORS origins: ${corsOrigins.join(', ')}`);
  logger.log(`Body limit: ${bodyLimit}`);
  logger.log(`Application running on: http://localhost:${port}/graphql`);
}
void bootstrap();
