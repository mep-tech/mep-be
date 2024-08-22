import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => String)
  readonly pwd: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => String)
  readonly confirmPwd: string;
}
