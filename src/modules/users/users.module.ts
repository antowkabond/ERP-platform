import { Module } from '@nestjs/common';
import { CqrsModule } from '../../infrastructure/cqrs/cqrs.module';
import { CryptoModule } from '../../infrastructure/crypto/crypto.module';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './persistence/users.repository';
import { UserCreatedHandler } from './cqrs/listeners/user-created.handler';

@Module({
  imports: [CqrsModule, CryptoModule, PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserCreatedHandler],
  exports: [UsersService],
})
export class UsersModule {}
