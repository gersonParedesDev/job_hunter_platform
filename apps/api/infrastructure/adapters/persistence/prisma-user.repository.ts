import { UserRepository } from '@job-hunter/domain/ports/user.repository.port';
import { User, UUID } from '@job-hunter/domain/entities/user.entity';
import { prisma } from '@job-hunter/db';

export class PrismaUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    const upserted = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

    return {
      id: upserted.id,
      name: upserted.name,
      email: upserted.email,
      phone: upserted.phone,
    };
  }

  async findById(id: UUID): Promise<User | null> {
    const found = await prisma.user.findUnique({
      where: { id },
    });

    if (!found) return null;

    return {
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await prisma.user.findUnique({
      where: { email },
    });

    if (!found) return null;

    return {
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
    };
  }

  async delete(id: UUID): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
