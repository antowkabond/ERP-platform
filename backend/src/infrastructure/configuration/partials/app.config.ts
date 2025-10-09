import { registerAs } from '@nestjs/config';
import { AppConfig, APP_CONFIG_NAME } from '../types/i-app.config';

export const appConfig = registerAs(
  APP_CONFIG_NAME,
  (): AppConfig => ({
    env: process.env.APP_ENV || 'local',
    port: parseInt(process.env.PORT, 10) || 3000,
    cors: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    flags: {
      swagger: {
        enabled: process.env.SWAGGER_ENABLED === 'true' || true,
        basicAuth: {
          enabled: process.env.SWAGGER_BASIC_AUTH_ENABLED === 'true' || false,
          username: process.env.SWAGGER_BASIC_AUTH_USERNAME || 'admin',
          password: process.env.SWAGGER_BASIC_AUTH_PASSWORD || 'admin',
        },
      },
    },
  }),
);

