import { Profile } from '@job-hunter/domain/entities/profile.entity';
import { ProfileRepository } from '@job-hunter/domain/ports/profile.repository.port';
import { JobQueuePort } from '@job-hunter/domain/ports/job-queue.port';
import { validateProfile } from '@job-hunter/domain/validation/profile.validator';
import { randomUUID } from 'crypto';

export interface CreateProfileDto {
  userId: string;
  profession: string;
  skills: string[];
}

export class CreateProfileUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly jobQueuePort: JobQueuePort
  ) {}

  async execute(dto: CreateProfileDto): Promise<Profile> {
    // Check if the user already has 3 profiles
    const existingProfiles = await this.profileRepository.findByUserId(dto.userId);
    if (existingProfiles.length >= 3) {
      throw new Error('A user cannot have more than 3 profiles');
    }

    const profile: Profile = {
      id: randomUUID(),
      userId: dto.userId,
      profession: dto.profession,
      skills: dto.skills,
      createdAt: new Date(),
    };

    // Validate using our domain validator
    validateProfile(profile);

    // Persist profile
    const savedProfile = await this.profileRepository.save(profile);

    // Enqueue job searching task
    await this.jobQueuePort.enqueueScraping(savedProfile.id, savedProfile.profession);

    return savedProfile;
  }
}
