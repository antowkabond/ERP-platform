import './tracer';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { MainModule } from './main.module';
import { TrimStringsPipe } from './app/pipes/trim-strings.pipe';
import { AppConfig, APP_CONFIG_NAME } from './infrastructure/configuration/types/i-app.config';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { default as basicAuth } from 'express-basic-auth';
import { ValidationException } from './app/exceptions/validation.exception';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { EnvironmentEnum } from './app/enums/environment.enum';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, {
    rawBody: true,
    ...(process.env.APP_ENV === EnvironmentEnum.Local
      ? {}
      : {
          logger: WinstonModule.createLogger({
            transports: [new winston.transports.Console({ level: 'debug' })],
          }),
        }),
  });

  if (process.env.APP_ENV !== EnvironmentEnum.Local) {
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  }

  const appConfig = app.get(ConfigService).get<AppConfig>(APP_CONFIG_NAME);

  app.enableCors({ origin: appConfig.cors });
  app.use(helmet());

  app.useGlobalPipes(
    new TrimStringsPipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => new ValidationException(errors),
    }),
  );

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  if (appConfig.flags.swagger.enabled) {
    const { swagger } = appConfig.flags;
    const swaggerUrl = 'swagger-ui';

    if (swagger.basicAuth.enabled) {
      const { username, password } = swagger.basicAuth;
      app.use(
        `/${swaggerUrl}`,
        basicAuth({
          challenge: true,
          users: { [username]: password },
        }),
      );
    }

    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('NestJS API with Prisma PostgreSQL')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerUrl, app, document);
  }

  await app.listen(appConfig.port);
  console.log(`🚀 Application is running on: http://localhost:${appConfig.port}`);
  console.log(`📚 Swagger documentation: http://localhost:${appConfig.port}/swagger-ui`);
}

bootstrap();

