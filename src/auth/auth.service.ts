import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities';
import { Repository } from 'typeorm';
import { Role } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createGoogleIfNotExists(user: Omit<User, 'id'>) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: user.email },
    });

    if (!existingUser) {
      const newUser = this.usersRepository.create(user);
      return await this.usersRepository.save(newUser);
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
    const existingUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    existingUser.role = Role.ADMIN;
    return await this.usersRepository.save(existingUser);
  }
}
