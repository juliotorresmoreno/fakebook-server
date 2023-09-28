import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';
import * as path from 'path';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().required(),

  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_DRIVER: Joi.string()
    .valid('postgres', 'mysql', 'oracle', 'mssql', 'mongodb')
    .default('postgres'),
  DB_SYNC: Joi.string().valid('true', 'false').optional(),
  ALLOW_ORIGIN: Joi.string().required(),

  SECRET: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
});

export type Configuration = {
  port: number;
  appName: string;
  secret: string;
  redis?: {
    url?: string;
  };
  database?: TypeOrmModuleOptions;
};

export default (): Configuration => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  appName: process.env.APP_NAME || '',
  secret: process.env.SECRET,
  redis: { url: process.env.REDIS_URL },
  database: {
    type: process.env.DB_DRIVER as any,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [path.join(__dirname, '..', 'entities', '*.entity{.ts,.js}')],
    synchronize: process.env.DB_SYNC === 'true',
  },
});
