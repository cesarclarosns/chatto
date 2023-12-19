import mongoose, { Schema, model, InferSchemaType, FilterQuery } from 'mongoose'
import { userModel } from '@features/users/models/user.model'

const postSchema = new Schema(
  {
    user_id: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel.name,
    },
    attachments: [{ type: mongoose.Schema.Types.ObjectId }],
    paidAttachments: [{ type: mongoose.Schema.Types.ObjectId }],
    isFree: { type: Boolean },
    price: { type: Number },
    content: { type: String },
  },
  {
    timestamps: true,
    strict: false,
  },
)

export const postModel = model('Post', postSchema, 'posts')

export type TPostDocument = InferSchemaType<typeof postSchema>
export type TPostDocumentFilterQuery = FilterQuery<TPostDocument>
