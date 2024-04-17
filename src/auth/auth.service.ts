import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities';
import { Role } from './types';
import { UsersService } from 'src/users/users.service';

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
      secret: this.configService.get<string>('JWT_REFRESH_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  async signAccessToken(user: User) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, payload };
  }

  async changeUserRoleToAdmin(userId: string) {
    const existingUser = await this.usersService.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    existingUser.role = Role.ADMIN;
    return await this.usersService.updateUser(userId, existingUser);
  }
}
