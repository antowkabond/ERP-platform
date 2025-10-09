import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DatabaseConfig,
  DATABASE_CONFIG_NAME,
} from '../configuration/types/i-database.config';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { host, port } =
          configService.get<DatabaseConfig>(DATABASE_CONFIG_NAME).redis;
        return {
          redis: {
            host,
            port,
          },
          prefix: 'queues',
          defaultJobOptions: {
            removeOnComplete: true,
          },
        };
      },
    }),
  ],
})
export class QueuesModule {}

