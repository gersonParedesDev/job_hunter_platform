import { Module } from '@nestjs/common';
import { ProfileController } from '../adapters/http/profile.controller';
import { UserController } from '../adapters/http/user.controller';
import { CreateProfileUseCase } from '../../application/use-cases/create-profile.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { MongooseProfileRepository } from '../adapters/persistence/mongoose-profile.repository';
import { MongooseUserRepository } from '../adapters/persistence/mongoose-user.repository';
import { ConsoleJobQueueAdapter } from '../adapters/queue/console-job-queue.adapter';

@Module({
  controllers: [ProfileController, UserController],
  providers: [
    {
      provide: MongooseProfileRepository,
      useClass: MongooseProfileRepository,
    },
    {
      provide: MongooseUserRepository,
      useClass: MongooseUserRepository,
    },
    {
      provide: ConsoleJobQueueAdapter,
      useClass: ConsoleJobQueueAdapter,
    },
    {
      provide: CreateProfileUseCase,
      useFactory: (
        profileRepo: MongooseProfileRepository,
        jobQueue: ConsoleJobQueueAdapter
      ) => {
        return new CreateProfileUseCase(profileRepo, jobQueue);
      },
      inject: [MongooseProfileRepository, ConsoleJobQueueAdapter],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepo: MongooseUserRepository) => {
        return new CreateUserUseCase(userRepo);
      },
      inject: [MongooseUserRepository],
    },
  ],
})
export class AppModule {}
