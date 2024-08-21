import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDefined, IsEmail } from 'class-validator';

export class PasswordForgotDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @IsEmail()
  @Type(() => String)
  readonly email: string;
}
