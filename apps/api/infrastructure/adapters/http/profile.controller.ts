import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProfileUseCase } from '../../../application/use-cases/create-profile.use-case';
import { CreateProfileHttpDto } from './dtos/create-profile.dto';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly createProfileUseCase: CreateProfileUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a job hunter profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input parameters.' })
  async create(@Body() dto: CreateProfileHttpDto) {
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
