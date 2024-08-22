import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => String)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => String)
  readonly password: string;
}
