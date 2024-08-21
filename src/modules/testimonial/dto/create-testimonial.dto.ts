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
  readonly image?: string;
}
