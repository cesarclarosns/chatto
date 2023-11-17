import { IsNotEmpty, IsString } from 'class-validator'

export class LeaveRoomEventDto {
  @IsString()
  @IsNotEmpty()
  roomId: string

  userId: string
}
