import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const appConfig = registerAs('app', () => ({
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT as string, 10),
    corsOrigins: (process.env.CORS_ORIGINS as string)
        .split(',')
        .map((origin) => origin.trim()),
    throttleTtl: parseInt(process.env.THROTTLE_TTL as string, 10),
    throttleLimit: parseInt(process.env.THROTTLE_LIMIT as string, 10),
    bodyLimit: process.env.BODY_LIMIT,
}));

export const appValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .required(),
    PORT: Joi.number().required(),
    CORS_ORIGINS: Joi.string().required(),
    THROTTLE_TTL: Joi.number().required(),
    THROTTLE_LIMIT: Joi.number().required(),
    BODY_LIMIT: Joi.string().required(),
});