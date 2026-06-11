import { Controller, Post, Get, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProfileUseCase } from '../../../application/use-cases/create-profile.use-case';
import { CreateProfileHttpDto } from './dtos/create-profile.dto';
import { MongooseProfileRepository } from '../persistence/mongoose-profile.repository';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly profileRepository: MongooseProfileRepository
  ) {}

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

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all profiles for a user' })
  @ApiResponse({ status: 200, description: 'Profiles returned successfully.' })
  async getByUserId(@Param('userId') userId: string) {
    try {
      const profiles = await this.profileRepository.findByUserId(userId);
      return {
        success: true,
        data: profiles,
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
