import { Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { DomainsModule } from './modules/domains.module';

@Module({
  imports: [AppModule, InfrastructureModule, DomainsModule],
})
export class MainModule {}

