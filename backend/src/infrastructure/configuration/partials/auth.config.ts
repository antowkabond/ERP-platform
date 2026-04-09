import { registerAs } from '@nestjs/config';
import { AuthConfig, AUTH_CONFIG_NAME } from '../types/i-auth.config';

export const authConfig = registerAs(
  AUTH_CONFIG_NAME,
  (): AuthConfig => ({
    auth0: {
      domain: process.env.AUTH_ZERO_DOMAIN,
      audience: process.env.AUTH_ZERO_AUDIENCE,
      clientId: process.env.AUTH_ZERO_CLIENT_ID,
      clientSecret: process.env.AUTH_ZERO_CLIENT_SECRET,
    },
  }),
);

