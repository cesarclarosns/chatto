import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

@Schema({
  collection: 'userRatingPerUser',
  timestamps: {
    createdAt: 'updatedAt',
    updatedAt: 'updatedAt',
  },
})
export class UserRatingPerUser extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  user_id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  rater_id: string;

  @Prop({
    max: 5,
    min: 1,
    required: true,
    type: Number,
  })
  rating: number;
}

export const UserRatingPerUserSchema =
  SchemaFactory.createForClass(UserRatingPerUser);

UserRatingPerUserSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

export type TUserRatingPerUserFilterQuery = FilterQuery<UserRatingPerUser>;
