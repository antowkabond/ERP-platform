export const APP_CONFIG_NAME = 'app';

export interface AppConfig {
  env: string;
  port: number;
  cors: string[];
  flags: {
    swagger: {
      enabled: boolean;
      basicAuth: {
        enabled: boolean;
        username: string;
        password: string;
      };
    };
  };
}

