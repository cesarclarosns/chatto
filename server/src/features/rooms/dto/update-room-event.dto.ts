import { PartialType } from '@nestjs/swagger'
import { CreateRoomEventDto } from '@features/rooms/dto/create-room-event.dto'

export class UpdateRoomEventDto extends PartialType(CreateRoomEventDto) {}
