import { EventsHandler } from '@nestjs/cqrs';
import { BaseEventHandler } from '../../../../infrastructure/cqrs/listeners/base-event.handler';
import { UserCreatedEvent } from '../../events/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler extends BaseEventHandler<UserCreatedEvent> {
  async execute(event: UserCreatedEvent): Promise<void> {
    this.logger.log(`User created: ${event.userId} (${event.email})`);
    // Add your business logic here (e.g., send welcome email, create notification, etc.)
  }
}

