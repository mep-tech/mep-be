import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseConfigModule } from './database/mongoose.module';
import { ConfigModule } from '@nestjs/config';
import { TestimonialModule } from './modules/testimonial/testimonial.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import configuration from 'config/configuration';
import { MigrationModule } from './database/migration/migration.module';
import { AuthModule } from './modules/auth/auth.module';
import { MemberModule } from './modules/member/member.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseConfigModule,
    TestimonialModule,
    UserModule,
    AdminModule,
    AuthModule,
    MigrationModule,
    MemberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
