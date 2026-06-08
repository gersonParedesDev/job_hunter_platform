import { User } from '@job-hunter/domain/entities/user.entity';
import { UserRepository } from '@job-hunter/domain/ports/user.repository.port';
import { randomUUID } from 'crypto';

export interface CreateUserDto {
  name: string;
  email: string;
  phone: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
    };

    // Save to database
    return this.userRepository.save(user);
  }
}
