import { io } from '@app'
import { IGateway } from '@common/interfaces/gateway.interface'
import { ICustomServer, ICustomSocket } from '@common/interfaces/socket'
import { RoomsService, roomsService } from './rooms.service'
import { createRoomMessageDtoSchema } from './dto/create-room-message.dto'

export class RoomsGateway implements IGateway {
  server: ICustomServer
  roomsService: RoomsService

  constructor() {
    this.server = io
    this.roomsService = roomsService
  }

  init = (socket: ICustomSocket) => {
    console.log('RoomsGateway connect', socket.id)

    socket.on('disconnect', async () => {
      console.log('RoomsGateway disconnect', socket.id)

      await Promise.all(
        [...socket.rooms].map(async (room) => {
          if (room.includes('rooms:')) {
            const room_id = room.replace('rooms:', '')
            await this.leaveRoom(socket, room_id)
          }
        }),
      )
    })

    socket.on('rooms/join-room', async (ev, cb) => {
      try {
        await this.joinRoom(socket, ev.room_id)

        cb({ status: 'success' })
      } catch (err) {
        cb({ status: 'failed' })
      }
    })

    socket.on('rooms/leave-room', async (ev, cb) => {
      try {
        await this.leaveRoom(socket, ev.room_id)

        cb({ status: 'success' })
      } catch (err) {
        cb({ status: 'failed' })
      }
    })

    socket.on('rooms/send-message', async (ev, cb) => {
      try {
        const createRoomMessageDto = createRoomMessageDtoSchema.parse({
          ...ev,
          user_id: socket.data.sub,
        })
        const message =
          await this.roomsService.createRoomMessage(createRoomMessageDto)

        socket
          .to(`rooms:${ev.room_id}`)
          .emit('rooms/send-message', message.toJSON())

        cb({ status: 'success' })
      } catch (err) {
        cb({ status: 'failed' })
      }
    })

    socket.on('rooms/user-typing', (ev, cb) => {
      try {
        socket
          .to(`rooms:${ev.room_id}`)
          .emit('rooms/user-typing', { ...ev, user_id: socket.data.sub })

        cb({ status: 'success' })
      } catch (err) {
        cb({ status: 'failed' })
      }
    })
  }

  joinRoom = async (socket: ICustomSocket, room_id: string) => {
    socket.join(`rooms:${room_id}`)

    const participants = [
      ...new Set(
        (await this.server.in(`rooms:${room_id}`).fetchSockets()).map(
          (socket) => socket.data.sub,
        ),
      ),
    ]
    await this.roomsService.update(room_id, { participants })

    socket
      .to(`rooms:${room_id}`)
      .emit('rooms/join-room', { room_id, user_id: socket.data.sub })
  }

  leaveRoom = async (socket: ICustomSocket, room_id: string) => {
    socket.leave(`rooms:${room_id}`)

    const participants = [
      ...new Set(
        (await this.server.in(`rooms:${room_id}`).fetchSockets()).map(
          (socket) => socket.data.sub,
        ),
      ),
    ]
    await this.roomsService.update(room_id, { participants })

    socket
      .to(`rooms:${room_id}`)
      .emit('rooms/leave-room', { room_id, user_id: socket.data.sub })
  }
}

export const roomsGateway = new RoomsGateway()
