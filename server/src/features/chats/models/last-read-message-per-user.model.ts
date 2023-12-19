import mongoose, { Schema, model, InferSchemaType, FilterQuery } from 'mongoose'
import { userModel } from '@features/users/models/user.model'
import { chatModel } from './chat.model'
import { messageModel } from './message.model'

const lastReadMessagePerUserSchema = new Schema(
  {
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: chatModel.name,
    },
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: messageModel.name,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: userModel.name,
    },
  },
  {
    timestamps: false,
    strict: false,
  },
)

export const lastReadMessagePerUserModel = model(
  'LastReadMessagePerUser',
  lastReadMessagePerUserSchema,
  'messages',
)

export type TLastReadMessagePerUserDocument = InferSchemaType<
  typeof lastReadMessagePerUserSchema
>
export type TLastReadMessagePerUserDocumentFilterQuery =
  FilterQuery<TLastReadMessagePerUserDocument>
