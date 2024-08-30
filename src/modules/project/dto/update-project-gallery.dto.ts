import { ApiProperty } from "@nestjs/swagger";

export class updateProjectGalleryDto {
  @ApiProperty({ type: 'array', items: { type: 'string', uniqueItems: true } })
  readonly gallery: string[];
}
