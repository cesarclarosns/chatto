import mongoose, { Schema, model, InferSchemaType, FilterQuery } from 'mongoose'
import { userModel } from '@features/users/models/user.model'

const massMessageSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: userModel.name,
    },
    toFollowers: { type: Boolean, required: true },
    toFans: { type: Boolean, required: true },
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

export const massMessageModel = model(
  'MassMessage',
  massMessageSchema,
  'massMessages',
)

export type TMassMessageDocument = InferSchemaType<typeof massMessageSchema>
export type TMassMessageDocumentFilterQuery = FilterQuery<TMassMessageDocument>
