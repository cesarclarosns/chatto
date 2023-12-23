import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserRating, UserRatingSchema } from './entities/user-rating.entity';
import {
  UserRatingPerUser,
  UserRatingPerUserSchema,
} from './entities/user-rating-per-user';
import { UserReview, UserReviewSchema } from './entities/user-review.entity';
import { UserRatingsController } from './user-ratings.controller';
import { UserRatingsService } from './user-ratings.service';

@Module({
  controllers: [UserRatingsController],
  imports: [
    MongooseModule.forFeature([
      {
        name: UserRating.name,
        schema: UserRatingSchema,
      },
      {
        name: UserRatingPerUser.name,
        schema: UserRatingPerUserSchema,
      },
      {
        name: UserReview.name,
        schema: UserReviewSchema,
      },
    ]),
  ],
  providers: [UserRatingsService],
})
export class UserRatingsModule {}
