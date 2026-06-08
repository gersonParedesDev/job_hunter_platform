import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileHttpDto {
  @ApiProperty({
    example: 'user-uuid-123',
    description: 'The unique ID of the user owning the profile',
  })
  userId!: string;

  @ApiProperty({
    example: 'React Developer',
    description: 'The profession/title to search and scrape jobs for',
  })
  profession!: string;

  @ApiProperty({
    example: ['React', 'TypeScript', 'Redux'],
    description: 'List of skills to match against job descriptions',
    type: [String],
  })
  skills!: string[];
}
