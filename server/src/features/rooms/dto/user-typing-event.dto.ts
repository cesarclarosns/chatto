import { OmitType } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UserTypingEventDto {
  @IsString()
  @IsNotEmpty()
  roomId: string

  @IsString()
  @IsNotEmpty()
  userId: string
}

export class UserTypingClientEventDto extends OmitType(UserTypingEventDto, [
  'userId',
]) {}

export class UserTypingServerEventDto extends UserTypingEventDto {}
