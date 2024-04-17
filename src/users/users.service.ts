import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createUser(user: Omit<User, 'id'>) {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async deleteUserById(userId: string) {
    await this.userRepository.delete(userId);
  }

  async updateUser(userId: string, updateDto: Partial<User>) {
    const user = await this.getUserById(userId);
    return await this.userRepository.save({ ...user, ...updateDto });
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return new User(user);
  }
}
