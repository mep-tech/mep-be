import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

@Module({})
export class JwtDynamicModule {
  static forRoot(): DynamicModule {
    return JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          secret: configService.get<string>('JWT_SECRET'),
        };
        const expiresIn = configService.get<string>('EXPIRES_IN');
        if (expiresIn) {
          options.signOptions = {
            expiresIn,
          };
        }
        return options;
      },
      inject: [ConfigService],
    });
  }
}
