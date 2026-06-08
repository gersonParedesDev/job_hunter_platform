import { Profile, UUID } from '../entities/profile.entity';

export interface ProfileRepository {
  save(profile: Profile): Promise<Profile>;
  findById(id: UUID): Promise<Profile | null>;
  findByUserId(userId: UUID): Promise<Profile | null>;
  delete(id: UUID): Promise<void>;
}
