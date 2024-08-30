import { ApiProperty } from '@nestjs/swagger';

export class CreateGalleryDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  readonly images: string[];
}
