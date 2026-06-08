import { Module } from '@nestjs/common';
import { ProfileController } from '../adapters/http/profile.controller';
import { UserController } from '../adapters/http/user.controller';
import { CreateProfileUseCase } from '../../application/use-cases/create-profile.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { PrismaProfileRepository } from '../adapters/persistence/prisma-profile.repository';
import { PrismaUserRepository } from '../adapters/persistence/prisma-user.repository';
import { ConsoleJobQueueAdapter } from '../adapters/queue/console-job-queue.adapter';

@Module({
  controllers: [ProfileController, UserController],
  providers: [
    {
      provide: PrismaProfileRepository,
      useClass: PrismaProfileRepository,
    },
    {
      provide: PrismaUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ConsoleJobQueueAdapter,
      useClass: ConsoleJobQueueAdapter,
    },
    {
      provide: CreateProfileUseCase,
      useFactory: (
        profileRepo: PrismaProfileRepository,
        jobQueue: ConsoleJobQueueAdapter
      ) => {
        return new CreateProfileUseCase(profileRepo, jobQueue);
      },
      inject: [PrismaProfileRepository, ConsoleJobQueueAdapter],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepo: PrismaUserRepository) => {
        return new CreateUserUseCase(userRepo);
      },
      inject: [PrismaUserRepository],
    },
  ],
})
export class AppModule {}
