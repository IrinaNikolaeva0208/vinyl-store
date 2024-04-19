import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PurchasesModule } from 'src/purchases/purchases.module';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([User]),
    PurchasesModule,
    ReviewsModule,
    PurchasesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
