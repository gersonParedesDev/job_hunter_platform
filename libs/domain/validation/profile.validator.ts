import { Profile } from '../entities/profile.entity';

export function validateProfile(profile: Profile): void {
  if (!profile.profession || profile.profession.trim() === '') {
    throw new Error('Profile profession cannot be empty');
  }
}
