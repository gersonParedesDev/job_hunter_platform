import { CreateUserUseCase, CreateUserDto } from './create-user.use-case';
import { UserRepository } from '@job-hunter/domain/ports/user.repository.port';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepositoryMock = {
      save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateUserUseCase(userRepositoryMock);
  });

  it('should create and save a new user successfully', async () => {
    const dto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+5491122334455',
    };

    const result = await useCase.execute(dto);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(dto.name);
    expect(result.email).toBe(dto.email);
    expect(result.phone).toBe(dto.phone);

    expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.save).toHaveBeenCalledWith(result);
  });
});
