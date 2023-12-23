import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { CreateUserRatingDto } from './dto/create-user-rating.dto';
import { CreateUserReviewDto } from './dto/create-user-review.dto';
import { UserRatingsService } from './user-ratings.service';

@Controller('user-ratings')
export class UserRatingsController {
  constructor(private readonly userRatingsService: UserRatingsService) {}

  // Ratings

  @Post('users/:user_id/ratings')
  async createUserRating(@Body() createUserRatingDto: CreateUserRatingDto) {
    return await this.userRatingsService.createUserRating(createUserRatingDto);
  }

  @Get('users/:user_id/ratings')
  async findOneUserRating(@Param('user_id') user_id: string) {
    return await this.userRatingsService.findOneUserRating(user_id);
  }

  @Get('users/:user_id/ratings/me')
  async findMyUserRating(
    @Param('user_id') user_id: string,
    @Req() req: Request,
  ) {
    const rater_id = req.user.sub;
    return await this.userRatingsService.findOneUserRatingPerRater(
      user_id,
      rater_id,
    );
  }

  // Reviews

  @Post('users/:user_id/reviews')
  async createUserReview(
    @Param('user_id') user_id: string,
    @Body() createUserReviewDto: CreateUserReviewDto,
  ) {
    return await this.userRatingsService.createUserReview(createUserReviewDto);
  }

  @Get('users/:user_id/reviews')
  async findAllUserReviews(
    @Param('user_id') user_id: string,
    @Query() findAllUserReviewsDto: any,
  ) {
    return await this.userRatingsService.findAllUserReviews(
      findAllUserReviewsDto,
    );
  }

  @Patch('users/:user_id/reviews/:review_id')
  async updateUserReview(
    @Param('user_id') user_id: string,
    @Param('review_id') review_id: string,
  ) {
    console.log(user_id, review_id);
  }

  @Delete('users/:user_id/reviews/:review_id')
  async deleteUserReview(
    @Param('user_id') user_id: string,
    @Param('review_id') review_id: string,
  ) {
    console.log(user_id, review_id);
  }
}
