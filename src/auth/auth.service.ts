import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities';
import { UsersService } from 'src/users/users.service';
import {
  JWT_REFRESH_SECRET_CONFIG_KEY,
  JWT_REFRESH_TOKEN_EXPIRES_IN_CONFIG_KEY,
} from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createGoogleIfNotExists(user: Omit<User, 'id'>) {
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      return await this.usersService.createUser(user);
    }

    return existingUser;
  }

  async getFreshTokens(user: User) {
    const { accessToken, payload } = await this.signAccessToken(user);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(JWT_REFRESH_SECRET_CONFIG_KEY),
      expiresIn: this.configService.get<string>(
        JWT_REFRESH_TOKEN_EXPIRES_IN_CONFIG_KEY,
      ),
    });

    return { accessToken, refreshToken };
  }

  async signAccessToken(user: Pick<User, 'id' | 'email' | 'role'>) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, payload };
  }
}
