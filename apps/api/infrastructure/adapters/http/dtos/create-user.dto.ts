import { ApiProperty } from '@nestjs/swagger';

export class CreateUserHttpDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The unique email of the user',
  })
  email!: string;

  @ApiProperty({
    example: '+5491122334455',
    description: 'The contact phone number of the user',
  })
  phone!: string;
}
