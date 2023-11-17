import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Document, HydratedDocument } from 'mongoose'
import { RoomStatusEnum } from '@features/rooms/enums/room-status.enum'

@Schema({
  timestamps: true,
})
export class RoomParticipant {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: string

  @Prop({ required: true, type: String })
  socketId: string

  @Prop({ required: false, type: Date })
  lastActive?: string
}

@Schema({
  collection: 'rooms',
  timestamps: true,
})
export class Room extends Document {
  @Prop({ required: true, type: String })
  language: string

  @Prop({ default: [], type: [String] })
  interests: string[]

  @Prop({ type: String })
  type: string

  @Prop({ enum: RoomStatusEnum, required: true, type: String })
  status: RoomStatusEnum

  @Prop({ required: true, type: [RoomParticipant] })
  participants: RoomParticipant[]

  @Prop({ expires: 0, type: Date })
  deleteAt: string
}

export type RoomDocument = HydratedDocument<Room>
export const RoomSchema = SchemaFactory.createForClass(Room)
