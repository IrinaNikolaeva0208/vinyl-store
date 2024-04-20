import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../utils/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JWT_AUTH_STRATEGY_NAME } from 'src/utils/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_AUTH_STRATEGY_NAME) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
