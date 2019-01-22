import 'dotenv/config';
import database from './database';

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
const isDevelopment = env === 'development';
const isTest = env === 'test';

export default {
  env,
  isProduction,
  isDevelopment,
  isTest,
  databaseUrl: process.env[database[env].use_env_variable],
};
