import { Attachment } from '@features/attachments/entities/attachment.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { Factory } from 'nestjs-seeder';

export enum EUserRole {
  'admin' = 'admin',
  'user' = 'user',
}

export enum EUserStatus {
  'online' = 'online',
  'offline' = 'offline',
}

class Profile extends Document {
  @Prop({ type: String })
  displayName: string;

  @Prop({ type: String })
  bio: string;

  @Prop({ type: Date })
  lastConnection: string;

  @Prop({ ref: Attachment.name, type: mongoose.Schema.Types.ObjectId })
  profilePicture: string | Attachment;

  @Prop({ ref: Attachment.name, type: mongoose.Schema.Types.ObjectId })
  coverPicture: string | Attachment;
}

class Settings extends Document {
  @Prop({ default: EUserStatus.online, enum: EUserStatus, type: String })
  status: EUserStatus;
}

class Metadata {
  @Prop({ type: Number })
  imagesCount: number;

  @Prop({ type: Number })
  videosCount: number;

  @Prop({ type: Number })
  followersCount: number;

  @Prop({ type: Number })
  subscriptionsCount: number;
}

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User extends Document {
  @Factory((faker) => faker.internet.email())
  @Prop({ required: false, sparse: true, type: String, unique: true })
  email: string;

  @Factory((faker, ctx) => ctx.password)
  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Prop({
    required: false,
    sparse: true,
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
  })
  google_id: string;

  @Prop({
    enum: EUserRole,
    required: true,
    type: String,
  })
  role: EUserRole;

  @Prop({ type: Profile })
  profile: Profile;

  @Prop({ type: Settings })
  settings: Settings;

  @Prop({ type: Metadata })
  metadata: Metadata;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

export type TUserFilterQuery = FilterQuery<User>;
