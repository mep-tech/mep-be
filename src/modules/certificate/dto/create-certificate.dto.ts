import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => String)
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => String)
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => String)
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly image: string;
}
