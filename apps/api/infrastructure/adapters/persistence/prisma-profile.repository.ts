import { ProfileRepository } from '@job-hunter/domain/ports/profile.repository.port';
import { Profile, UUID } from '@job-hunter/domain/entities/profile.entity';
import { prisma } from '@job-hunter/db';

export class PrismaProfileRepository implements ProfileRepository {
  async save(profile: Profile): Promise<Profile> {
    const upserted = await prisma.profile.upsert({
      where: { id: profile.id },
      update: {
        userId: profile.userId,
        profession: profile.profession,
        skills: profile.skills,
      },
      create: {
        id: profile.id,
        userId: profile.userId,
        profession: profile.profession,
        skills: profile.skills,
        createdAt: profile.createdAt,
      },
    });

    return {
      id: upserted.id,
      userId: upserted.userId,
      profession: upserted.profession,
      skills: upserted.skills,
      createdAt: upserted.createdAt,
    };
  }

  async findById(id: UUID): Promise<Profile | null> {
    const found = await prisma.profile.findUnique({
      where: { id },
    });

    if (!found) return null;

    return {
      id: found.id,
      userId: found.userId,
      profession: found.profession,
      skills: found.skills,
      createdAt: found.createdAt,
    };
  }

  async findByUserId(userId: UUID): Promise<Profile | null> {
    const found = await prisma.profile.findFirst({
      where: { userId },
    });

    if (!found) return null;

    return {
      id: found.id,
      userId: found.userId,
      profession: found.profession,
      skills: found.skills,
      createdAt: found.createdAt,
    };
  }

  async delete(id: UUID): Promise<void> {
    await prisma.profile.delete({
      where: { id },
    });
  }
}
