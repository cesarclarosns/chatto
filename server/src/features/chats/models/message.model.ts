import mongoose, { Schema, model, InferSchemaType, FilterQuery } from 'mongoose'
import { userModel } from '@features/users/models/user.model'
import { chatModel } from './chat.model'

const messageSchema = new Schema(
  {
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: chatModel.name,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: userModel.name,
    },
    attachments: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    paidAttachments: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    isFree: { type: Boolean, required: true },
    price: { type: Number, required: true },
    content: { type: String, required: true, default: '' },
  },
  {
    timestamps: true,
    strict: false,
  },
)

export const messageModel = model('Message', messageSchema, 'messages')

export type TMessageDocument = InferSchemaType<typeof messageSchema>
export type TMessageDocumentFilterQuery = FilterQuery<TMessageDocument>
