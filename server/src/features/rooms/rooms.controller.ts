import { Controller, UseGuards } from '@nestjs/common'
import { AccessTokenGuard } from '@features/auth/guards'
import { RoomsService } from '@features/rooms/rooms.service'

@Controller('rooms')
@UseGuards(AccessTokenGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
}
