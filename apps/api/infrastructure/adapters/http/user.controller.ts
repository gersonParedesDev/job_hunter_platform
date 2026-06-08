import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { CreateUserHttpDto } from './dtos/create-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input parameters.' })
  async create(@Body() dto: CreateUserHttpDto) {
    try {
      const user = await this.createUserUseCase.execute(dto);
      return {
        success: true,
        data: user,
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
