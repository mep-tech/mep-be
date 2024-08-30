import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Skip must a positive number' })
  skip?: number;

  @ApiProperty({ example: 30})
  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Limit must be greater than or equal to 1' })
  limit?: number;
}
