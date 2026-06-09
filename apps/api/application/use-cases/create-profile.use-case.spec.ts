import { CreateProfileUseCase, CreateProfileDto } from './create-profile.use-case';
import { ProfileRepository } from '@job-hunter/domain/ports/profile.repository.port';
import { JobQueuePort } from '@job-hunter/domain/ports/job-queue.port';
import { Profile } from '@job-hunter/domain/entities/profile.entity';

describe('CreateProfileUseCase', () => {
  let useCase: CreateProfileUseCase;
  let profileRepositoryMock: jest.Mocked<ProfileRepository>;
  let jobQueuePortMock: jest.Mocked<JobQueuePort>;

  beforeEach(() => {
    profileRepositoryMock = {
      save: jest.fn().mockImplementation((profile) => Promise.resolve(profile)),
      findById: jest.fn(),
      findByUserId: jest.fn().mockResolvedValue([]), // Default to 0 existing profiles
      delete: jest.fn(),
    };

    jobQueuePortMock = {
      enqueueScraping: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new CreateProfileUseCase(profileRepositoryMock, jobQueuePortMock);
  });

  it('should validate, save profile and enqueue scraping task', async () => {
    const dto: CreateProfileDto = {
      userId: 'user-uuid-123',
      profession: 'Software Engineer',
      skills: ['TypeScript', 'NodeJS'],
    };

    const result = await useCase.execute(dto);

    expect(result.id).toBeDefined();
    expect(result.userId).toBe(dto.userId);
    expect(result.profession).toBe(dto.profession);
    expect(result.skills).toEqual(dto.skills);
    expect(result.createdAt).toBeInstanceOf(Date);

    // Verify save was called on the repository port
    expect(profileRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(profileRepositoryMock.save).toHaveBeenCalledWith(result);

    // Verify enqueue was called on the queue port
    expect(jobQueuePortMock.enqueueScraping).toHaveBeenCalledTimes(1);
    expect(jobQueuePortMock.enqueueScraping).toHaveBeenCalledWith(result.id, result.profession);
  });

  it('should throw an error and not persist or enqueue if validation fails', async () => {
    const dto: CreateProfileDto = {
      userId: 'user-uuid-123',
      profession: '', // Invalid empty profession
      skills: ['TypeScript'],
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Profile profession cannot be empty');

    expect(profileRepositoryMock.save).not.toHaveBeenCalled();
    expect(jobQueuePortMock.enqueueScraping).not.toHaveBeenCalled();
  });

  it('should throw an error if the user already has 3 profiles', async () => {
    // Mock user having 3 existing profiles
    const existingProfiles: Profile[] = [
      { id: 'p1', userId: 'user-uuid-123', profession: 'React Dev', skills: [], createdAt: new Date() },
      { id: 'p2', userId: 'user-uuid-123', profession: 'Angular Dev', skills: [], createdAt: new Date() },
      { id: 'p3', userId: 'user-uuid-123', profession: 'Node Dev', skills: [], createdAt: new Date() },
    ];
    profileRepositoryMock.findByUserId.mockResolvedValue(existingProfiles);

    const dto: CreateProfileDto = {
      userId: 'user-uuid-123',
      profession: 'Python Developer',
      skills: ['Python'],
    };

    await expect(useCase.execute(dto)).rejects.toThrow('A user cannot have more than 3 profiles');

    expect(profileRepositoryMock.save).not.toHaveBeenCalled();
    expect(jobQueuePortMock.enqueueScraping).not.toHaveBeenCalled();
  });
});
