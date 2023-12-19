import { Schema, model, InferSchemaType, FilterQuery } from 'mongoose'

export enum EUserStatus {
  'online' = 'online',
  'offline' = 'offline',
}

const userSchema = new Schema(
  {
    email: { type: String, unique: true, sparse: true },
    google_id: { type: String, unique: true, sparse: true },
    password: { type: String },
    username: { type: String, unique: true, required: true },
    profile: {
      displayName: { type: String },
      profilePicture: { type: String },
      coverPicture: { type: String },
      bio: { type: String },
      imagesCount: { type: Number },
      videosCount: { type: Number },
      ratingsCount: { type: Number },
      followersCount: { type: Number },
      subscriptionsCount: { type: Number },
    },
    settings: {
      status: {
        type: String,
        enum: EUserStatus,
        default: EUserStatus.online,
        required: false,
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  },
)

export const userModel = model('User', userSchema, 'users')

export type TUserDocument = InferSchemaType<typeof userSchema>
export type TUserDocumentFilterQuery = FilterQuery<TUserDocument>
