import { forwardRef, Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, memberSchema } from './schema/member.schema';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: memberSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => AdminModule),
    forwardRef(() => CloudinaryModule),
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
