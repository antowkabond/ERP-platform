export const DATABASE_CONFIG_NAME = 'database';

export interface DatabaseConfig {
  url: string;
  redis: {
    host: string;
    port: number;
  };
}

