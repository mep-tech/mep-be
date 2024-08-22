import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => String)
  readonly oldPwd: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => String)
  readonly newPwd: string;
}
