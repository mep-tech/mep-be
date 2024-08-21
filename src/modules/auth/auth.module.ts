import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { JwtDynamicModule } from './jwt/jwt.module';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [JwtDynamicModule.forRoot(), forwardRef(() => AdminModule)],
  controllers: [AuthController],
  providers: [AuthService, PasswordHelper, ConfigService],
  exports: [AuthService],
})
export class AuthModule {}
