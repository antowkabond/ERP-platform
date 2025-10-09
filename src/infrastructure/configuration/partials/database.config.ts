import { registerAs } from '@nestjs/config';
import { DatabaseConfig, DATABASE_CONFIG_NAME } from '../types/i-database.config';

export const databaseConfig = registerAs(
  DATABASE_CONFIG_NAME,
  (): DatabaseConfig => ({
    url: process.env.DB_URL,
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
  }),
);

