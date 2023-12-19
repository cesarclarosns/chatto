import mongoose, { Schema, model, InferSchemaType, FilterQuery } from 'mongoose'
import { userModel } from '@features/users/models/user.model'

const chatSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: userModel.name,
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  },
)

export const chatModel = model('Chat', chatSchema, 'chats')

export type TChatDocument = InferSchemaType<typeof chatSchema>
export type TChatDocumentFilterQuery = FilterQuery<TChatDocument>
