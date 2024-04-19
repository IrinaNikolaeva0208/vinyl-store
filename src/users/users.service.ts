import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from './entities';
import { PaginationOptions, UpdateProfileDto } from './dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { PurchasesService } from 'src/purchases/purchases.service';
import { LogsService } from 'src/operationsLogs/logs.service';
import { Entity, Operation } from 'src/utils/types';

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
    await this.logUserOperation(savedUser.id, Operation.CREATE);
    return savedUser;
  }

  async deleteUserById(userId: string) {
    await this.logUserOperation(userId, Operation.DELETE);
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
    await this.logUserOperation(user.id, Operation.UPDATE);
    return new User({ ...updatedUser });
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return new User(user);
  }

  async getUserWithReviewsAndPurchasedVinyl(
    userId: string,
    paginationOptions: PaginationOptions,
  ) {
    const { reviewsLimit, reviewsOffset, purchasesLimit, purchasesOffset } =
      paginationOptions;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const [userReviewsPage, totalReviews] =
      await this.reviewsService.getReviewsPageForUser(
        reviewsLimit,
        reviewsOffset,
        userId,
      );
    const [userPurchasesPage, totalPurchases] =
      await this.purchasesService.getPurchasesPageForUser(
        purchasesLimit,
        purchasesOffset,
        userId,
      );
    const reviews = {
      data: userReviewsPage,
      pagination: { reviewsLimit, reviewsOffset, totalReviews },
    };
    const purchases = {
      data: userPurchasesPage,
      pagination: { purchasesLimit, purchasesOffset, totalPurchases },
    };
    return { profile: new User({ ...user }), reviews, purchases };
  }

  async logUserOperation(userId: string, operation: Operation) {
    await this.logsService.createLog({
      perfomedByUser: userId,
      createdAt: Date.now(),
      operation,
      entityId: userId,
      entity: Entity.USER,
    });
  }
}
