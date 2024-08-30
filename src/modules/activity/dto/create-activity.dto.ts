import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ default: '' })
  readonly alias?: string;

  @ApiProperty({ default: '' })
  readonly name: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: string;
}
