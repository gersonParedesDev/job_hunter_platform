import { Module } from '@nestjs/common';
import { ProfileController } from '../adapters/http/profile.controller';
import { CreateProfileUseCase } from '../../application/use-cases/create-profile.use-case';
import { PrismaProfileRepository } from '../adapters/persistence/prisma-profile.repository';
import { ConsoleJobQueueAdapter } from '../adapters/queue/console-job-queue.adapter';

@Module({
  controllers: [ProfileController],
  providers: [
    {
      provide: PrismaProfileRepository,
      useClass: PrismaProfileRepository,
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
  ],
})
export class AppModule {}
