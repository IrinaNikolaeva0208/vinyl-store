import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities';
import { Repository } from 'typeorm';

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

  async signTokens(user: User) {
    const payload = { id: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
