import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_REFRESH_STRATEGY_NAME } from 'src/utils/constants';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_STRATEGY_NAME) {}
