import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const appConfig = registerAs('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:4200')
        .split(',')
        .map((origin) => origin.trim()),
    throttleTtl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
    throttleLimit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    bodyLimit: process.env.BODY_LIMIT || '15mb',
}));

export const appValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(3000),
    CORS_ORIGINS: Joi.string().default('http://localhost:4200'),
    THROTTLE_TTL: Joi.number().default(60000),
    THROTTLE_LIMIT: Joi.number().default(100),
    BODY_LIMIT: Joi.string().default('15mb'),
});