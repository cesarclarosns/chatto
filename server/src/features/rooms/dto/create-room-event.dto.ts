import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { RoomStatusEnum } from '@features/rooms/enums/room-status.enum'

export class CreateRoomEventDto {
  @IsString()
  @IsEnum(RoomStatusEnum)
  status: string

  @IsString()
  @IsNotEmpty()
  language: string
}
