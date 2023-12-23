import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserRatingDto } from './dto/create-user-rating.dto';
import { CreateUserReviewDto } from './dto/create-user-review.dto';
import { FindAllUserReviewsDto } from './dto/find-all-user-reviews.dto';
import { UpdateUserReviewDto } from './dto/update-user-review.dto';
import { UserRating } from './entities/user-rating.entity';
import { UserRatingPerUser } from './entities/user-rating-per-user';
import { UserReview } from './entities/user-review.entity';

@Injectable()
export class UserRatingsService {
  constructor(
    @InjectModel(UserRating.name) private userRatingModel: Model<UserRating>,
    @InjectModel(UserRatingPerUser.name)
    private userRatingPerUserModel: Model<UserRatingPerUser>,
    @InjectModel(UserReview.name) private userReviewModel: Model<UserReview>,
  ) {}

  // Ratings

  async createUserRating(createUserRatingDto: CreateUserRatingDto) {
    const userRatingPerUser =
      await this.userRatingPerUserModel.findOneAndUpdate(
        {
          rater_id: createUserRatingDto.rater_id,
          user_id: createUserRatingDto.user_id,
        },
        { rating: createUserRatingDto.rating },
        {
          upsert: true,
        },
      );

    if (
      userRatingPerUser &&
      userRatingPerUser.rating == createUserRatingDto.rating
    )
      return;

    await this.userRatingModel.updateOne(
      {
        user_id: createUserRatingDto.user_id,
      },
      {
        $inc: {
          ...(userRatingPerUser && {
            [`ratings.${userRatingPerUser.rating}`]: -1,
          }),
          [`ratings.${createUserRatingDto.rating}`]: 1,
        },
      },
    );
  }

  async findOneUserRating(user_id: string) {
    return await this.userRatingModel.findOne({ user_id });
  }

  async findOneUserRatingPerRater(user_id: string, rater_id: string) {
    return await this.userRatingPerUserModel.findOne({ rater_id, user_id });
  }

  // Reviews

  async createUserReview(createUserReviewDto: CreateUserReviewDto) {
    return await this.userReviewModel.create(createUserReviewDto);
  }

  async findAllUserReviews(findAllUserReviewsDto: FindAllUserReviewsDto) {
    return await this.userReviewModel.find(findAllUserReviewsDto);
  }

  async updateUserReview(
    user_review_id: string,
    updateUserReviewDto: UpdateUserReviewDto,
  ) {
    return await this.userReviewModel.updateOne(
      { _id: user_review_id },
      { $set: updateUserReviewDto },
    );
  }

  async deleteUserReview(user_review_id: string) {
    return await this.userReviewModel.deleteOne({ _id: user_review_id });
  }
}
