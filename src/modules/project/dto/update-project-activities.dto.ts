import { ApiProperty } from "@nestjs/swagger";

export class updateProjectActivitiesDto {
  @ApiProperty({ type: 'array', items: { type: 'string', uniqueItems: true } })
  readonly activities: string[];
}
