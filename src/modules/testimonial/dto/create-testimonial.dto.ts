import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => String)
  readonly names: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => String)
  readonly message: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly company: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly role: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => String)
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly image?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => String)
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly companyLogo?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => String)
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly siteImage?: string;
}
