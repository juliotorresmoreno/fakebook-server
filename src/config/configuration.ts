import * as Joi from 'joi';

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
});

type Configuration = {
  port: number;
  appName: string;
};

export default (): Configuration => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  appName: process.env.APP_NAME || '',
});
