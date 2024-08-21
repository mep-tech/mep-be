import { Type } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly password: string;
}
