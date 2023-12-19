import mongoose, { Schema, model, InferSchemaType, FilterQuery } from 'mongoose'
import { userModel } from '@features/users/models/user.model'
import { roomModel } from './room.model'

const roomMessageSchema = new Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: roomModel.name,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: userModel.name,
    },
    content: { type: String, required: true, default: '' },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    strict: false,
  },
)

export const roomMessageModel = model(
  'RoomMessage',
  roomMessageSchema,
  'roomMessages',
)

export type TRoomMessageDocument = InferSchemaType<typeof roomMessageSchema>
export type TRoomMessageDocumentFilterQuery = FilterQuery<TRoomMessageDocument>
