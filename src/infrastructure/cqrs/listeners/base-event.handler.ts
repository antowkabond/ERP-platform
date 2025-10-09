import { Logger } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';

export abstract class BaseEventHandler<T> implements IEventHandler<T> {
  protected logger: Logger = new Logger(this.constructor.name);

  async handle(event: T): Promise<void> {
    try {
      await this.execute(event);
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

  abstract execute(event: T): Promise<void>;
}

