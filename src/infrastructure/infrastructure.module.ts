import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CqrsModule } from './cqrs/cqrs.module';
import { CryptoModule } from './crypto/crypto.module';
import { QueuesModule } from './queues/queues.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { EnvironmentEnum } from '../app/enums/environment.enum';

@Module({
  imports: [
    ...(process.env.APP_ENV === EnvironmentEnum.Local
      ? []
      : [
          WinstonModule.forRoot({
            transports: [new winston.transports.Console({ level: 'debug' })],
          }),
        ]),
    ConfigurationModule,
    PrismaModule,
    CqrsModule,
    CryptoModule,
    QueuesModule,
    HealthModule,
  ],
})
export class InfrastructureModule {}

