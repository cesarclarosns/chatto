import mongoose, { Schema, model, InferSchemaType, FilterQuery } from 'mongoose'
import { messageModel } from '@features/chats/models/message.model'
import { userModel } from '@features/users/models/user.model'

const messagePaymentSchema = new Schema(
  {
    user_id: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel.name,
    },
    message_id: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: messageModel.name,
    },
  },
  {
    timestamps: true,
    strict: false,
  },
)

export const messagePaymentModel = model(
  'MessagePayment',
  messagePaymentSchema,
  'messagePayments',
)

export type TMessagePaymentDocument = InferSchemaType<
  typeof messagePaymentSchema
>
export type TMessagePaymentDocumentFilterQuery =
  FilterQuery<TMessagePaymentDocument>
