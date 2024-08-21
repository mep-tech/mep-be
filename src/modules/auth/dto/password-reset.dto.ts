import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly oldPwd: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly newPwd: string;
}
