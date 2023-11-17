import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SocketModule } from '@app/common/modules/socket/socket.module'
import { RoomsController } from '@features/rooms/rooms.controller'
import { RoomsGateway } from '@features/rooms/rooms.gateway'
import { RoomsService } from '@features/rooms/rooms.service'
import { Room, RoomSchema } from '@features/rooms/schemas/room.schema'

@Module({
  controllers: [RoomsController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Room.name,
        schema: RoomSchema,
      },
    ]),
    SocketModule,
  ],
  providers: [RoomsService, RoomsGateway],
})
export class RoomsModule {}
