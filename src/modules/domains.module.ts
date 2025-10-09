import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    // Add your business modules here
  ],
})
export class DomainsModule {}

