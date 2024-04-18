import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from './entities';
import { UpdateProfileDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
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

  async updateProfile(
    userId: string,
    file: Express.Multer.File | undefined,
    updateProfileDto: UpdateProfileDto,
  ) {
    console.log(updateProfileDto);
    const requiredUser = await this.getUserById(userId);
    const avatar = file
      ? (await this.cloudinaryService.uploadImage(file)).url
      : requiredUser.avatar;

    return await this.updateUser({
      ...requiredUser,
      ...updateProfileDto,
      avatar,
    });
  }

  async updateUser(user: User) {
    const updatedUser = await this.userRepository.save(user);
    return new User({ ...updatedUser });
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return new User(user);
  }

  async getUserWithReviewsAndPurchasedVinyl(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { reviews: true },
    });
    return new User(user);
  }
}
