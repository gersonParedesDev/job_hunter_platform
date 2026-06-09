import { UserRepository } from '@job-hunter/domain/ports/user.repository.port';
import { User, UUID } from '@job-hunter/domain/entities/user.entity';
import { UserModel } from '@job-hunter/db';

export class MongooseUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    const updated = await UserModel.findOneAndUpdate(
      { id: user.id },
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      { upsert: true, new: true }
    );

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
    };
  }

  async findById(id: UUID): Promise<User | null> {
    const found = await UserModel.findOne({ id });
    if (!found) return null;

    return {
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await UserModel.findOne({ email });
    if (!found) return null;

    return {
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
    };
  }

  async delete(id: UUID): Promise<void> {
    await UserModel.deleteOne({ id });
  }
}
