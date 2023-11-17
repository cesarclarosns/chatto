import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ type: String })
  displayName: string

  @Prop({ type: String })
  googleId: string

  @Prop({ required: true, type: String })
  username: string

  @Prop({ type: String })
  email: string

  @Prop({ required: true, type: String })
  password: string

  @Prop({ type: String })
  bio: string

  @Prop({ default: new Date(Date.now()).toISOString(), type: Date })
  lastActive: string
}

export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User)
