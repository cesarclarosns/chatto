import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

class Ratings extends Document {
  @Prop({ default: 0, type: Number })
  1: number;

  @Prop({ default: 0, type: Number })
  2: number;

  @Prop({ default: 0, type: Number })
  3: number;

  @Prop({ default: 0, type: Number })
  4: number;

  @Prop({ default: 0, type: Number })
  5: number;
}

@Schema({
  collection: 'userRatings',
  timestamps: {
    createdAt: 'updatedAt',
    updatedAt: 'updatedAt',
  },
})
export class UserRating extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  user_id: string;

  @Prop({
    type: Number,
  })
  ratings: Ratings;
}

export const UserRatingSchema = SchemaFactory.createForClass(UserRating);

UserRatingSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

export type TUserRatingFilterQuery = FilterQuery<UserRating>;
