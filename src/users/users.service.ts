import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { NotFoundException } from '@nestjs/common';
import { Role } from 'src/auth/types';
import { User } from './entities';
import { PaginationOptions, UpdateProfileDto } from './dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { PurchasesService } from 'src/purchases/purchases.service';
import { LogsService } from 'src/operationsLogs/logs.service';
import { Operation } from 'src/utils/types';
import { USER_NOT_FOUND_MESSAGE } from 'src/utils/constants';

@Injectable()
export class UsersService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly reviewsService: ReviewsService,
    private readonly purchasesService: PurchasesService,
    private readonly logsService: LogsService,
  ) {}

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createUser(user: Omit<User, 'id'>) {
    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);
    await this.logsService.createLog(
      savedUser.id,
      savedUser.id,
      Operation.CREATE,
    );
    return savedUser;
  }

  async deleteUserById(userId: string) {
    await this.logsService.createLog(userId, userId, Operation.DELETE);
    await this.userRepository.delete(userId);
  }

  async updateProfile(
    userId: string,
    file: Express.Multer.File | undefined,
    updateProfileDto: UpdateProfileDto,
  ) {
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
    await this.logsService.createLog(user.id, user.id, Operation.UPDATE);
    return new User({ ...updatedUser });
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return new User(user);
  }

  async getUserPurchases(userId: string, paginationOptions: PaginationOptions) {
    return await this.getUserRelations(
      this.purchasesService,
      userId,
      paginationOptions,
    );
  }

  async getUserReviews(userId: string, paginationOptions: PaginationOptions) {
    return await this.getUserRelations(
      this.reviewsService,
      userId,
      paginationOptions,
    );
  }

  async getUserRelations(
    service: ReviewsService | PurchasesService,
    userId: string,
    paginationOptions: PaginationOptions,
  ) {
    const { limit, offset } = paginationOptions;
    const [userRelationsPage, total] = await service.getPageForUser(
      limit,
      offset,
      userId,
    );
    return {
      data: userRelationsPage,
      pagination: { limit, offset, total },
    };
  }

  async changeUserRoleToAdmin(userId: string) {
    const existingUser = await this.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
    }

    existingUser.role = Role.ADMIN;
    return await this.updateUser(existingUser);
  }
}
