import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UsersRepository } from '../persistence/users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponse } from '../dtos/user.response';
import { PublishEventCommand } from '../../../infrastructure/cqrs/commands/publish-event.command';
import { UserCreatedEvent } from '../events/user-created.event';
import { HashingService } from '../../../infrastructure/crypto/services/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly commandBus: CommandBus,
    private readonly hashingService: HashingService,
  ) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.repository.findAll();
    return users.map((user) => new UserResponse(user));
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserResponse(user);
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const hashedPassword = dto.password
      ? await this.hashingService.hash(dto.password)
      : null;

    const user = await this.repository.create({
      ...dto,
      password: hashedPassword,
    });

    // Publish event
    await this.commandBus.execute(
      new PublishEventCommand(new UserCreatedEvent(user.id, user.email)),
    );

    return new UserResponse(user);
  }
}

