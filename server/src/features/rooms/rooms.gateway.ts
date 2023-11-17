import { UsePipes, ValidationPipe } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import {
  IClientToServerEvents,
  ICustomServer,
  ICustomSocket,
} from '@app/common/interfaces/socket.io'
import { FindRoomEventDto } from '@features/rooms/dto/find-room-event.dto'
import { LeaveRoomEventDto } from '@features/rooms/dto/leave-room-event.dto'
import { NewMessageEventDto } from '@features/rooms/dto/new-message-event.dto'
import { UserTypingClientEventDto } from '@features/rooms/dto/user-typing-event.dto'
import { RoomsService } from '@features/rooms/rooms.service'

@WebSocketGateway()
@UsePipes(new ValidationPipe())
export class RoomsGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: ICustomServer

  constructor(private roomsService: RoomsService) {}

  async handleDisconnect(socket: ICustomSocket) {
    //Somehow delete the rooms where the socket is a participant (using the socketId)
    console.log('handleDisconnect', socket.id)
    await this.roomsService.deleteRoomsBySocket(socket)
  }

  @SubscribeMessage<keyof IClientToServerEvents>('rooms/room/find-room')
  async handleFindRoom(
    @ConnectedSocket() socket: ICustomSocket,
    @MessageBody() ev: FindRoomEventDto,
  ): Promise<
    Parameters<Parameters<IClientToServerEvents['rooms/room/find-room']>[1]>[0]
  > {
    const { room, token } = await this.roomsService.handleFindRoom(socket, ev)
    return { payload: { room, token }, status: 'success' }
  }

  @SubscribeMessage<keyof IClientToServerEvents>('rooms/room/new-message')
  async handleNewMessage(
    @ConnectedSocket() socket: ICustomSocket,
    @MessageBody() ev: NewMessageEventDto,
  ) {
    socket
      .to(this.roomsService.getRoomChannel(ev.roomId))
      .emit('rooms/room/new-message', {
        ...ev,
        userId: socket.data.sub,
      })
  }

  @SubscribeMessage<keyof IClientToServerEvents>('rooms/room/leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() socket: ICustomSocket,
    @MessageBody() ev: LeaveRoomEventDto,
  ) {
    await this.roomsService.handleLeaveRoom(socket, ev)
  }

  @SubscribeMessage<keyof IClientToServerEvents>('rooms/room/user-typing')
  async handleUserTyping(
    @ConnectedSocket() socket: ICustomSocket,
    @MessageBody() ev: UserTypingClientEventDto,
  ) {
    socket
      .to(this.roomsService.getRoomChannel(ev.roomId))
      .emit('rooms/room/user-typing', { ...ev, userId: socket.data.sub })
  }

  @SubscribeMessage<keyof IClientToServerEvents>('rooms/room/get-status')
  async handleGetStatus(
    @ConnectedSocket() socket: ICustomSocket,
    @MessageBody() ev: UserTypingClientEventDto,
  ): Promise<
    Parameters<Parameters<IClientToServerEvents['rooms/room/get-status']>[1]>[0]
  > {
    const status = await this.roomsService.handleGetStatus(socket, ev)
    return {
      payload: {
        status,
      },
      status: 'success',
    }
  }
}
