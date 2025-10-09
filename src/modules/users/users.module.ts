import { Module } from '@nestjs/common';
import { CqrsModule } from '../../infrastructure/cqrs/cqrs.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './persistence/users.repository';

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}

