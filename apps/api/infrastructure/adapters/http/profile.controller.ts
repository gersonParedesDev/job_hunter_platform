import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProfileUseCase, CreateProfileDto } from '../../../application/use-cases/create-profile.use-case';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly createProfileUseCase: CreateProfileUseCase) {}

  @Post()
  async create(@Body() dto: CreateProfileDto) {
    try {
      const profile = await this.createProfileUseCase.execute(dto);
      return {
        success: true,
        data: profile,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          error: error.message || 'Internal Server Error',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
