import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly pwd: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  readonly confirmPwd: string;
}
