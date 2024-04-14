import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_ADMIN_ONLY_KEY } from '../decorators';
import { Role } from '../../auth/types';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdminOnly = this.reflector.getAllAndOverride<boolean>(
      IS_ADMIN_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!isAdminOnly) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return user.role == Role.ADMIN;
  }
}
