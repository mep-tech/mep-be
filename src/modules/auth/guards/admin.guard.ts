// We are keeping auth.guard.ts and admin.guard.ts apart to make room for more future roles permissions.

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from 'src/modules/admin/admin.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = await this.adminService.findAdminById(request['user'].id);

    if (!user) {
      throw new HttpException(
        'Logged-in user is unidentified',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.role !== 'admin') {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
