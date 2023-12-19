import mongoose, { Schema, model, InferSchemaType, FilterQuery } from 'mongoose'
import { userModel } from '@features/users/models/user.model'

export enum EAttachmentType {
  'image' = 'image',
  'gif' = 'gif',
  'video' = 'video',
  'file' = 'file',
}

export enum EMimeType {
  'image/jpg' = 'image/jpg',
}

const attachmentSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: userModel.name,
    },
    name: { type: String, required: true },
    attachmentType: { type: String, required: true, enum: EAttachmentType },
    mimeType: { type: String, required: true, enum: EMimeType },
    hash: { type: String, required: true },
    key: { type: String, required: true },
  },
  {
    timestamps: true,
    strict: false,
  },
)

export const attachmentModel = model(
  'Attachment',
  attachmentSchema,
  'attachments',
)

export type TAttachmentDocument = InferSchemaType<typeof attachmentSchema>
export type TAttachmentDocumentFilterQuery = FilterQuery<TAttachmentDocument>
