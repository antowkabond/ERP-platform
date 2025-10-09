import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { appConfig } from './partials/app.config';
import { databaseConfig } from './partials/database.config';
import { authConfig } from './partials/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, authConfig],
      isGlobal: true,
    }),
  ],
})
export class ConfigurationModule {}

