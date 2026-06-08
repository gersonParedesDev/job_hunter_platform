import { User, UUID } from '../entities/user.entity';

export interface UserRepository {
  save(user: User): Promise<User>;
  findById(id: UUID): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: UUID): Promise<void>;
}
