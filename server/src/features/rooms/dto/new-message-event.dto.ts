import { IsNotEmpty, IsString } from 'class-validator'

export class NewMessageEventDto {
  @IsString()
  @IsNotEmpty()
  content: string

  @IsString()
  @IsNotEmpty()
  roomId: string

  userId: string
}
