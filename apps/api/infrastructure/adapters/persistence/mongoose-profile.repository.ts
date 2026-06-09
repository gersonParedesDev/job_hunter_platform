import { ProfileRepository } from '@job-hunter/domain/ports/profile.repository.port';
import { Profile, UUID } from '@job-hunter/domain/entities/profile.entity';
import { ProfileModel } from '@job-hunter/db';

export class MongooseProfileRepository implements ProfileRepository {
  async save(profile: Profile): Promise<Profile> {
    const updated = await ProfileModel.findOneAndUpdate(
      { id: profile.id },
      {
        id: profile.id,
        userId: profile.userId,
        profession: profile.profession,
        skills: profile.skills,
        createdAt: profile.createdAt,
      },
      { upsert: true, new: true }
    );

    return {
      id: updated.id,
      userId: updated.userId,
      profession: updated.profession,
      skills: updated.skills,
      createdAt: updated.createdAt,
    };
  }

  async findById(id: UUID): Promise<Profile | null> {
    const found = await ProfileModel.findOne({ id });
    if (!found) return null;

    return {
      id: found.id,
      userId: found.userId,
      profession: found.profession,
      skills: found.skills,
      createdAt: found.createdAt,
    };
  }

  async findByUserId(userId: UUID): Promise<Profile[]> {
    const found = await ProfileModel.find({ userId });
    return found.map(doc => ({
      id: doc.id,
      userId: doc.userId,
      profession: doc.profession,
      skills: doc.skills,
      createdAt: doc.createdAt,
    }));
  }

  async delete(id: UUID): Promise<void> {
    await ProfileModel.deleteOne({ id });
  }
}
