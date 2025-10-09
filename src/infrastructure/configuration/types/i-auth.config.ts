export const AUTH_CONFIG_NAME = 'auth';

export interface AuthConfig {
  auth0: {
    domain: string;
    audience: string;
    clientId: string;
    clientSecret: string;
  };
}

