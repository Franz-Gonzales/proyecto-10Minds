import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const databaseConfig = registerAs('database', () => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV === 'development',
    autoLoadEntities: true,
    // logging: process.env.NODE_ENV === 'development',
}));


// Validación
export const databaseValidationSchema = Joi.object({
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
});
