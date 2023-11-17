import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { RoomServiceClient } from 'livekit-server-sdk'
import { AccessToken } from 'livekit-server-sdk'
import * as mongoose from 'mongoose'
import { Model } from 'mongoose'
import { ICustomSocket } from '@app/common/interfaces/socket.io'
import { SocketService } from '@app/common/modules/socket/socket.service'
import { CONFIG_VALUES } from '@app/config/configuration'
import {
  convertHoursToMilliseconds,
  convertMinutesToMilliseconds,
} from '@app/libs/utils'
import { FindRoomEventDto } from '@features/rooms/dto/find-room-event.dto'
import { LeaveRoomEventDto } from '@features/rooms/dto/leave-room-event.dto'
import { UpdateRoomEventDto } from '@features/rooms/dto/update-room-event.dto'
import { RoomStatusEnum } from '@features/rooms/enums/room-status.enum'
import {
  Room,
  RoomDocument,
  RoomParticipant,
} from '@features/rooms/schemas/room.schema'
import { GetStatusEventDto } from './dto/get-status-event.dto'

@Injectable()
export class RoomsService {
  roomClient: RoomServiceClient

  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private configService: ConfigService,
    private socketService: SocketService,
  ) {
    this.roomClient = new RoomServiceClient(
      configService.getOrThrow<string>(CONFIG_VALUES.app.liveKitHost),
      configService.getOrThrow<string>(CONFIG_VALUES.app.liveKitApiKey),
      configService.getOrThrow<string>(CONFIG_VALUES.app.liveKitSecretKey),
    )
  }

  getRoomChannel(roomId: string) {
    return `rooms:${roomId}`
  }

  async update(id: string, updateRoomDto: UpdateRoomEventDto) {
    return await this.roomModel.updateOne({ _id: id }, updateRoomDto)
  }

  async findOneById(id: string) {
    return await this.roomModel.findById(id)
  }

  async createRoomToken({
    roomId,
    userId,
  }: {
    roomId: string
    userId: string
  }) {
    const at = new AccessToken(
      this.configService.getOrThrow<string>(CONFIG_VALUES.app.liveKitApiKey),
      this.configService.getOrThrow<string>(CONFIG_VALUES.app.liveKitSecretKey),
      {
        identity: userId,
      },
    )
    at.addGrant({ room: roomId, roomJoin: true })
    return at.toJwt()
  }

  async deleteRoomById({
    roomId,
    userId,
  }: {
    roomId: string
    userId?: string
  }) {
    const deleteAt = new Date(
      Date.now() + convertHoursToMilliseconds(24),
    ).toISOString()

    await this.roomModel.updateOne(
      { _id: roomId },
      { deleteAt, status: RoomStatusEnum.ended },
    )
    await this.roomClient.deleteRoom(roomId)

    //Notify sockets
    const roomChannel = this.getRoomChannel(roomId)
    this.socketService.server
      .to(roomChannel)
      .emit('rooms/room/leave-room', { roomId, userId })
    this.socketService.server.socketsLeave(roomChannel)
  }

  async handleFindRoom(
    socket: ICustomSocket,
    ev: FindRoomEventDto,
  ): Promise<{ token: string; room: RoomDocument }> {
    //Delete rooms by socket
    await this.deleteRoomsBySocket(socket)

    //Find room in db
    let room = await this.roomModel.findOne(ev, {})

    if (room) {
      //Add user as participant, update room status to ready and
      //update the document's ttl to 1 day
      const participants = room.participants
      participants.push({ socketId: socket.id, userId: socket.data.sub })
      const status = RoomStatusEnum.started
      const deleteAt = new Date(
        Date.now() + convertHoursToMilliseconds(24),
      ).toISOString()

      await this.roomModel.updateOne(
        { _id: room.id },
        { deleteAt, participants, status },
      )
    } else {
      //Create room in db and crete room in livekit
      const roomId = new mongoose.Types.ObjectId().toString()

      await this.roomClient.createRoom({
        emptyTimeout: 5 * 60,
        maxParticipants: 2,
        name: roomId,
      })

      const participants: RoomParticipant[] = [
        { socketId: socket.id, userId: socket.data.sub },
      ]
      const deleteAt = new Date(
        Date.now() + convertMinutesToMilliseconds(1),
      ).toISOString()

      const newRooms = await this.roomModel.create([
        {
          _id: roomId,
          deleteAt,
          language: ev.language,
          participants,
          status: ev.status,
        },
      ])
      room = newRooms[0]
    }

    // Create token for user
    const token = await this.createRoomToken({
      roomId: room.id,
      userId: socket.data.sub,
    })

    const roomChannel = this.getRoomChannel(room.id)
    socket.join(roomChannel)

    return { room, token }
  }

  async handleLeaveRoom(socket: ICustomSocket, ev: LeaveRoomEventDto) {
    await this.deleteRoomById({ roomId: ev.roomId, userId: socket.data.sub })
  }

  async handleGetStatus(
    socket: ICustomSocket,
    ev: GetStatusEventDto,
  ): Promise<RoomStatusEnum> {
    const roomChannel = this.getRoomChannel(ev.roomId)

    //Check if at least 2 sockets are in the room
    const sockets = await this.socketService.server
      .in(roomChannel)
      .fetchSockets()

    if (sockets.length < 2) {
      //Delete room
      await this.deleteRoomById({ roomId: ev.roomId, userId: socket.data.sub })
      return RoomStatusEnum.ended
    } else {
      return RoomStatusEnum.started
    }
  }

  async deleteRoomsBySocket(socket: ICustomSocket) {
    //Find roomId by the socketId
    const rooms = await this.roomModel.find({
      $or: [
        { status: RoomStatusEnum.started },
        { status: RoomStatusEnum.waiting },
      ],
      participants: {
        $elemMatch: {
          socketId: socket.id,
        },
      },
    })

    if (rooms.length) {
      await Promise.all(
        rooms.map(async (room) => {
          await this.deleteRoomById({
            roomId: room.id,
            userId: socket.data.sub,
          })
        }),
      )
    }
  }
}
