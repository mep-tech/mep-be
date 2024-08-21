import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { ConfigService } from '@nestjs/config';
import { AdminService } from 'src/modules/admin/admin.service';

@Injectable()
export class AdminSeed {
  constructor(
    private readonly adminService: AdminService,
    private readonly passwordHelper: PasswordHelper,
    private readonly configService: ConfigService,
  ) {}

  @Command({
    command: 'seed:admin',
    describe: 'seed admins',
  })
  async seeds(): Promise<void> {
    const adminPassword = this.configService.get<string>('SEED_ADMIN_PASSWORD');
    const testPassword = this.configService.get<string>('SEED_TEST_PASSWORD');

    const data: any[] = [
      {
        names: 'Mep Admin',
        username: 'admin',
        email: 'meperictric@gmail.com',
        password: await this.passwordHelper.hashPassword(adminPassword),
        role: 'admin',
        avatar:
          'https://gravatar.com/avatar/4464e763b01bd4f84bff0dc464886a3c?s=400&d=robohash&r=x',
      },
      {
        names: 'Mep Test',
        username: 'test',
        email: 'kiglance.rw@gmail.com',
        password: await this.passwordHelper.hashPassword(testPassword),
        role: 'admin',
        avatar:
          'https://gravatar.com/avatar/e3060b19369923c6e7ea8e32363cc36b?s=400&d=robohash&r=x',
      },
    ];

    try {
      await this.adminService.createMany(data);
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }

  @Command({
    command: 'remove:admin',
    describe: 'remove admins',
  })
  async remove(): Promise<void> {
    try {
      await this.adminService.deleteMany();
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}
