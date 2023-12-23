import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

@Schema({
  collection: 'userReviews',
  timestamps: {
    createdAt: 'updatedAt',
    updatedAt: 'updatedAt',
  },
})
export class UserReview extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  user_id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  reviewer_id: string;

  @Prop({
    required: true,
    type: String,
  })
  content: string;
}

export const UserReviewSchema = SchemaFactory.createForClass(UserReview);

UserReviewSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

export type TUserReviewFilterQuery = FilterQuery<UserReview>;
