import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  readonly name: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: string;

  readonly projectOwner: string;
  readonly projectOwnerContact?: string;

  readonly startDate: Date;
  readonly endDate?: Date;

  readonly location: string;

  @ApiProperty({ type: 'array', items: { type: 'string', uniqueItems: true } })
  readonly activities?: string[];

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  readonly gallery?: any[];
}
