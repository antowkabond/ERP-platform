import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PublishEventCommand } from './publish-event.command';

@CommandHandler(PublishEventCommand)
export class PublishEventHandler implements ICommandHandler<PublishEventCommand> {
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: PublishEventCommand): Promise<void> {
    this.eventBus.publish(command.event);
  }
}

