import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  displayName: string

  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  bio: string

  @Prop({ required: true })
  lastConnection: string

  @Prop({ required: true })
  country: string
}

export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User)
