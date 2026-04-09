import { Module } from '@nestjs/common';
import { CqrsModule as BaseCqrsModule } from '@nestjs/cqrs';
import { PublishEventHandler } from './commands/publish-event.handler';

@Module({
  imports: [BaseCqrsModule],
  providers: [PublishEventHandler],
  exports: [BaseCqrsModule],
})
export class CqrsModule {}

