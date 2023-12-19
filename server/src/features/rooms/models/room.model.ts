import mongoose, { Schema, model, InferSchemaType, FilterQuery } from 'mongoose'
import { userModel } from '@features/users/models/user.model'

export enum ERoomStatus {
  'started' = 'started',
  'ended' = 'ended',
}

const roomSchema = new Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId },
    admins: [{ type: mongoose.Schema.Types.ObjectId }],
    blackList: [{ type: mongoose.Schema.Types.ObjectId }],
    status: {
      type: String,
      required: true,
      enum: ERoomStatus,
      default: ERoomStatus.started,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: userModel.name,
      },
    ],
    language: { type: String },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
    strict: false,
  },
)

export const roomModel = model('Room', roomSchema, 'rooms')

export type TRoomDocument = InferSchemaType<typeof roomSchema>
export type TRoomDocumentFilterQuery = FilterQuery<TRoomDocument>
